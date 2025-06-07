const User = require('../models/User');
const Initiative = require('../models/Initiative');
const Article = require('../models/Article');

// Get user dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user with populated initiatives
        const user = await User.findById(userId)
            .populate({
                path: 'initiatives.joined.initiative',
                populate: {
                    path: 'organizer',
                    select: 'name email'
                }
            })
            .populate({
                path: 'initiatives.organized',
                populate: {
                    path: 'participants.user',
                    select: 'name email'
                }
            });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get upcoming initiatives user has joined
        const upcomingJoined = user.initiatives.joined
            .filter(item => {
                const initiative = item.initiative;
                return initiative && 
                       initiative.status === 'upcoming' && 
                       new Date(initiative.date) > new Date();
            })
            .sort((a, b) => new Date(a.initiative.date) - new Date(b.initiative.date));
        
        // Get recent activity (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentActivity = user.initiatives.joined
            .filter(item => new Date(item.joinedAt) > thirtyDaysAgo)
            .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
        
        // Get user's organized initiatives
        const organizedInitiatives = user.initiatives.organized || [];
        
        // Calculate achievements
        const achievements = [];
        
        // First join achievement
        if (user.stats.initiativesJoined >= 1) {
            achievements.push({
                type: 'first_join',
                title: 'First Step',
                description: 'Joined your first initiative',
                icon: 'fa-seedling',
                color: '#10b981'
            });
        }
        
        // Tree planter achievement
        if (user.stats.treesPlanted >= 10) {
            achievements.push({
                type: 'tree_planter',
                title: 'Tree Planter',
                description: `Helped plant ${user.stats.treesPlanted} trees`,
                icon: 'fa-tree',
                color: '#059669'
            });
        }
        
        // Cleanup hero achievement
        if (user.stats.wasteCollected >= 50) {
            achievements.push({
                type: 'cleanup_hero',
                title: 'Cleanup Hero',
                description: `Collected ${user.stats.wasteCollected}kg of waste`,
                icon: 'fa-broom',
                color: '#3b82f6'
            });
        }
        
        // Eco warrior achievement
        if (user.stats.initiativesCompleted >= 5) {
            achievements.push({
                type: 'eco_warrior',
                title: 'Eco Warrior',
                description: `Completed ${user.stats.initiativesCompleted} initiatives`,
                icon: 'fa-shield-alt',
                color: '#8b5cf6'
            });
        }
        
        // Organizer achievement
        if (user.stats.initiativesOrganized >= 1) {
            achievements.push({
                type: 'organizer',
                title: 'Community Organizer',
                description: `Organized ${user.stats.initiativesOrganized} initiatives`,
                icon: 'fa-users',
                color: '#f59e0b'
            });
        }
        
        // Calculate impact score
        const impactScore = (user.stats.co2Reduced * 2) + 
                           (user.stats.treesPlanted * 5) + 
                           (user.stats.wasteCollected * 1);
        
        // Determine user level
        let level = 'New Member';
        if (impactScore >= 1000) level = 'Eco Champion';
        else if (impactScore >= 500) level = 'Climate Warrior';
        else if (impactScore >= 200) level = 'Green Advocate';
        else if (impactScore >= 50) level = 'Earth Friend';
        
        // Get recommended initiatives (not joined, upcoming, in user's area if available)
        const recommendedInitiatives = await Initiative.find({
            _id: { $nin: user.initiatives.joined.map(item => item.initiative) },
            status: 'upcoming',
            date: { $gte: new Date() },
            isActive: true
        })
        .populate('organizer', 'name')
        .sort({ featured: -1, date: 1 })
        .limit(6);
        
        const dashboardData = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                level,
                impactScore,
                joinedAt: user.createdAt
            },
            stats: user.stats,
            achievements,
            initiatives: {
                joined: user.initiatives.joined,
                organized: organizedInitiatives,
                upcoming: upcomingJoined,
                recentActivity,
                recommended: recommendedInitiatives
            },
            summary: {
                totalJoined: user.stats.initiativesJoined,
                totalCompleted: user.stats.initiativesCompleted,
                totalOrganized: user.stats.initiativesOrganized,
                upcomingCount: upcomingJoined.length,
                recentActivityCount: recentActivity.length
            }
        };
        
        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        
        // Remove sensitive fields that shouldn't be updated via this endpoint
        delete updates.password;
        delete updates.role;
        delete updates.stats;
        delete updates.initiatives;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { ...updates },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get user's initiative statistics
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get detailed statistics
        const joinedInitiatives = await Initiative.find({
            'participants.user': userId
        }).populate('organizer', 'name');
        
        const organizedInitiatives = await Initiative.find({
            organizer: userId
        });
        
        // Calculate monthly activity
        const monthlyActivity = {};
        joinedInitiatives.forEach(initiative => {
            const participant = initiative.participants.find(p => p.user.toString() === userId);
            if (participant) {
                const month = new Date(participant.joinedAt).toISOString().slice(0, 7); // YYYY-MM
                monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
            }
        });
        
        // Calculate category breakdown
        const categoryBreakdown = {};
        joinedInitiatives.forEach(initiative => {
            const category = initiative.category;
            categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
        });
        
        const stats = {
            basic: user.stats,
            detailed: {
                joinedInitiatives: joinedInitiatives.length,
                organizedInitiatives: organizedInitiatives.length,
                monthlyActivity,
                categoryBreakdown,
                impactScore: (user.stats.co2Reduced * 2) + (user.stats.treesPlanted * 5) + (user.stats.wasteCollected * 1)
            }
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: error.message });
    }
};