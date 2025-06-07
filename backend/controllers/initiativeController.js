const Initiative = require('../models/Initiative');
const User = require('../models/User');

// Get all initiatives with filtering and population
exports.getInitiatives = async (req, res) => {
  try {
    const { category, status, city, limit = 50, page = 1 } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get initiatives with populated organizer info
    const initiatives = await Initiative.find(filter)
      .populate('organizer', 'name email')
      .populate('participants.user', 'name')
      .sort({ featured: -1, date: 1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();
    
    // Get total count for pagination
    const total = await Initiative.countDocuments(filter);
    
    res.json(initiatives);
  } catch (err) {
    console.error('Error fetching initiatives:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single initiative by ID
exports.getInitiativeById = async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id)
      .populate('organizer', 'name email phone')
      .populate('participants.user', 'name');
    
    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }
    
    res.json(initiative);
  } catch (err) {
    console.error('Error fetching initiative:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create new initiative
exports.createInitiative = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      maxParticipants,
      requirements,
      materials,
      impact,
      contactInfo
    } = req.body;
    
    // Get organizer from token (if authenticated) or use admin
    let organizerId = req.user?.id;
    
    // If no authenticated user, find an admin user as organizer
    if (!organizerId) {
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        organizerId = adminUser._id;
      } else {
        return res.status(400).json({ error: 'No organizer available' });
      }
    }
    
    const newInitiative = new Initiative({
      title,
      description,
      category,
      date: new Date(date),
      time,
      location,
      organizer: organizerId,
      maxParticipants: maxParticipants || 100,
      requirements: requirements || [],
      materials: materials || [],
      impact: impact || {},
      contactInfo: contactInfo || {}
    });
    
    const savedInitiative = await newInitiative.save();
    
    // Update organizer's organized initiatives
    await User.findByIdAndUpdate(organizerId, {
      $push: { 'initiatives.organized': savedInitiative._id },
      $inc: { 'stats.initiativesOrganized': 1 }
    });
    
    // Populate organizer info before sending response
    await savedInitiative.populate('organizer', 'name email');
    
    res.status(201).json(savedInitiative);
  } catch (err) {
    console.error('Error creating initiative:', err);
    res.status(400).json({ error: err.message });
  }
};

// Update initiative
exports.updateInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedInitiative = await Initiative.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');
    
    if (!updatedInitiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }
    
    res.json(updatedInitiative);
  } catch (err) {
    console.error('Error updating initiative:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete initiative
exports.deleteInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    
    const initiative = await Initiative.findByIdAndDelete(id);
    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }
    
    res.json({ message: 'Initiative deleted successfully' });
  } catch (err) {
    console.error('Error deleting initiative:', err);
    res.status(500).json({ error: err.message });
  }
};

// Join initiative
exports.joinInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find initiative
    const initiative = await Initiative.findById(id);
    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }
    
    // Check if initiative is full
    if (initiative.isFull) {
      return res.status(400).json({ error: 'Initiative is full' });
    }
    
    // Check if user already joined
    const alreadyJoined = initiative.participants.some(
      p => p.user.toString() === userId
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ error: 'Already joined this initiative' });
    }
    
    // Add user to initiative participants
    initiative.participants.push({
      user: userId,
      joinedAt: new Date(),
      status: 'joined'
    });
    
    await initiative.save();
    
    // Update user's joined initiatives
    const user = await User.findById(userId);
    await user.joinInitiative(id);
    
    // Populate and return updated initiative
    await initiative.populate('participants.user', 'name');
    
    res.json({
      message: 'Successfully joined initiative',
      initiative,
      participantCount: initiative.participantCount
    });
  } catch (err) {
    console.error('Error joining initiative:', err);
    res.status(500).json({ error: err.message });
  }
};

// Leave initiative
exports.leaveInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find initiative
    const initiative = await Initiative.findById(id);
    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }
    
    // Remove user from participants
    initiative.participants = initiative.participants.filter(
      p => p.user.toString() !== userId
    );
    
    await initiative.save();
    
    // Update user's joined initiatives
    await User.findByIdAndUpdate(userId, {
      $pull: { 'initiatives.joined': { initiative: id } },
      $inc: { 'stats.initiativesJoined': -1 }
    });
    
    res.json({
      message: 'Successfully left initiative',
      participantCount: initiative.participantCount
    });
  } catch (err) {
    console.error('Error leaving initiative:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get user's initiatives
exports.getUserInitiatives = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate({
        path: 'initiatives.joined.initiative',
        populate: {
          path: 'organizer',
          select: 'name'
        }
      })
      .populate({
        path: 'initiatives.organized',
        populate: {
          path: 'participants.user',
          select: 'name'
        }
      });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      joined: user.initiatives.joined,
      organized: user.initiatives.organized,
      stats: user.stats
    });
  } catch (err) {
    console.error('Error fetching user initiatives:', err);
    res.status(500).json({ error: err.message });
  }
};
