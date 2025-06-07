const User = require('../models/User');
const Activity = require('../models/Activity');
const Comment = require('../models/Comment');
const axios = require('axios');

// Admin functions
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(400).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error('Error fetching all users:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Cannot find user' });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.role) user.role = req.body.role;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(400).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
        
        // Also delete user's activities and comments
        await Activity.deleteMany({ userId: req.params.id });
        await Comment.deleteMany({ userId: req.params.id });
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// User dashboard functions
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, gender, dob } = req.body;
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (gender) user.gender = gender;
        if (dob) user.dob = new Date(dob);

        const updatedUser = await user.save();
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating user profile:', err.message);
        res.status(400).json({ message: err.message });
    }
};

// Activity functions
const getUserActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user.userId })
            .sort({ date: -1 })
            .limit(50);
        res.json(activities);
    } catch (err) {
        console.error('Error fetching user activities:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const addUserActivity = async (req, res) => {
    try {
        const { name, type, date, notes, location } = req.body;
        
        // Get current weather data for the activity
        let weather = null;
        try {
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: location || 'Dar es Salaam',
                    appid: process.env.OPENWEATHERMAP_API_KEY,
                    units: 'metric'
                }
            });
            
            if (weatherResponse.data) {
                weather = {
                    temperature: weatherResponse.data.main.temp,
                    description: weatherResponse.data.weather[0].description,
                    humidity: weatherResponse.data.main.humidity,
                    windSpeed: weatherResponse.data.wind.speed,
                    pressure: weatherResponse.data.main.pressure
                };
            }
        } catch (weatherError) {
            console.log('Could not fetch weather data:', weatherError.message);
        }

        const activity = new Activity({
            userId: req.user.userId,
            name,
            type,
            date: new Date(date),
            weather,
            location: location || 'Dar es Salaam',
            notes
        });

        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        console.error('Error adding user activity:', err.message);
        res.status(400).json({ message: err.message });
    }
};

const deleteUserActivity = async (req, res) => {
    try {
        const activity = await Activity.findOneAndDelete({
            _id: req.params.activityId,
            userId: req.user.userId
        });
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        console.error('Error deleting user activity:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Comment functions
const getUserComments = async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(comments);
    } catch (err) {
        console.error('Error fetching user comments:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const addUserComment = async (req, res) => {
    try {
        const { text, category, tags, isPublic } = req.body;
        
        const comment = new Comment({
            userId: req.user.userId,
            text,
            author: req.user.email ? req.user.email.split('@')[0] : 'User',
            category: category || 'general',
            tags: tags || [],
            isPublic: isPublic || false
        });

        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        console.error('Error adding user comment:', err.message);
        res.status(400).json({ message: err.message });
    }
};

const deleteUserComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.commentId,
            userId: req.user.userId
        });
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting user comment:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Dashboard stats
const getUserStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get activity stats
        const totalActivities = await Activity.countDocuments({ userId });
        const outdoorActivities = await Activity.countDocuments({ userId, type: 'outdoor' });
        const indoorActivities = await Activity.countDocuments({ userId, type: 'indoor' });
        
        // Get activities with weather data for average temperature
        const activitiesWithWeather = await Activity.find({ 
            userId, 
            'weather.temperature': { $exists: true } 
        });
        
        let avgTemperature = null;
        if (activitiesWithWeather.length > 0) {
            const totalTemp = activitiesWithWeather.reduce((sum, activity) => 
                sum + activity.weather.temperature, 0);
            avgTemperature = Math.round(totalTemp / activitiesWithWeather.length);
        }
        
        // Get comment stats
        const totalComments = await Comment.countDocuments({ userId });
        const publicComments = await Comment.countDocuments({ userId, isPublic: true });
        
        // Calculate climate score (simple algorithm)
        const climateScore = Math.min(100, 
            (outdoorActivities * 10) + 
            (totalComments * 5) + 
            (publicComments * 3)
        );
        
        // Get activity breakdown by type
        const activityBreakdown = await Activity.aggregate([
            { $match: { userId: req.user.userId } },
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        
        // Get recent activities
        const recentActivities = await Activity.find({ userId })
            .sort({ date: -1 })
            .limit(5)
            .select('name type date weather.temperature');

        res.json({
            totalActivities,
            outdoorActivities,
            indoorActivities,
            avgTemperature,
            totalComments,
            publicComments,
            climateScore,
            activityBreakdown,
            recentActivities
        });
    } catch (err) {
        console.error('Error fetching user stats:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Admin functions for activities and comments management
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('userId', 'name email')
            .sort({ date: -1 });
        res.json(activities);
    } catch (err) {
        console.error('Error fetching all activities:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        console.error('Error fetching all comments:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const deleteActivityAdmin = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted successfully' });
    } catch (err) {
        console.error('Error deleting activity:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const deleteCommentAdmin = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err.message);
        res.status(500).json({ message: err.message });
    }
};

const updateCommentAdmin = async (req, res) => {
    try {
        const { isPublic } = req.body;
        const comment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { isPublic },
            { new: true }
        ).populate('userId', 'name email');
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        res.json(comment);
    } catch (err) {
        console.error('Error updating comment:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// Dashboard statistics endpoint
const getDashboardStats = async (req, res) => {
    try {
        // Get current date and calculate date ranges
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalActivities = await Activity.countDocuments();
        const totalComments = await Comment.countDocuments();

        // Get growth statistics
        const usersLastWeek = await User.countDocuments({ createdAt: { $gte: lastWeek } });
        const activitiesLastWeek = await Activity.countDocuments({ date: { $gte: lastWeek } });
        const commentsLastWeek = await Comment.countDocuments({ createdAt: { $gte: lastWeek } });

        // Calculate growth percentages
        const userGrowth = totalUsers > 0 ? Math.round((usersLastWeek / totalUsers) * 100) : 0;
        const activityGrowth = totalActivities > 0 ? Math.round((activitiesLastWeek / totalActivities) * 100) : 0;
        const commentGrowth = totalComments > 0 ? Math.round((commentsLastWeek / totalComments) * 100) : 0;

        // Get activity type distribution
        const activityTypes = await Activity.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        // Get daily activity data for the last 7 days
        const dailyActivities = await Activity.aggregate([
            {
                $match: {
                    date: { $gte: lastWeek }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get user engagement stats
        const dailyActiveUsers = await Activity.distinct('userId', { date: { $gte: today } }).then(users => users.length);
        const weeklyActiveUsers = await Activity.distinct('userId', { date: { $gte: lastWeek } }).then(users => users.length);
        const monthlyActiveUsers = await Activity.distinct('userId', { date: { $gte: lastMonth } }).then(users => users.length);

        // Calculate climate impact
        const outdoorActivities = await Activity.countDocuments({ type: 'outdoor' });
        const walkingActivities = await Activity.countDocuments({ 
            name: { $regex: /walk/i } 
        });
        const cyclingActivities = await Activity.countDocuments({ 
            name: { $regex: /cycle|bike/i } 
        });
        const ecoActivities = await Activity.countDocuments({
            $or: [
                { type: 'outdoor' },
                { name: { $regex: /eco|green|environment/i } }
            ]
        });

        // Calculate average climate score
        const avgClimateScore = await Activity.aggregate([
            { $group: { _id: null, avgScore: { $avg: '$climateScore' } } }
        ]);
        const averageScore = avgClimateScore.length > 0 ? Math.round(avgClimateScore[0].avgScore || 50) : 50;

        // Get recent activities for feed
        const recentActivities = await Activity.find()
            .populate('userId', 'name email')
            .sort({ date: -1 })
            .limit(10);

        res.json({
            metrics: {
                totalUsers,
                totalActivities,
                totalComments,
                averageClimateScore: averageScore,
                userGrowth,
                activityGrowth,
                commentGrowth,
                scoreGrowth: Math.round(Math.random() * 10) // Mock for now
            },
            charts: {
                activityTypes: activityTypes.map(type => ({
                    label: type._id,
                    count: type.count
                })),
                dailyActivities: dailyActivities.map(day => ({
                    date: day._id,
                    count: day.count
                }))
            },
            engagement: {
                dailyActiveUsers,
                weeklyActiveUsers,
                monthlyActiveUsers,
                totalUsers
            },
            climateImpact: {
                carbonSaved: (outdoorActivities * 2.5).toFixed(1),
                stepsWalked: walkingActivities * 5000,
                distanceCycled: cyclingActivities * 10,
                ecoActivities
            },
            recentActivities: recentActivities.map(activity => ({
                id: activity._id,
                name: activity.name,
                type: activity.type,
                date: activity.date,
                user: activity.userId ? {
                    name: activity.userId.name,
                    email: activity.userId.email
                } : { name: 'Unknown User', email: '' }
            }))
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    // Admin functions
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllActivities,
    getAllComments,
    deleteActivityAdmin,
    deleteCommentAdmin,
    updateCommentAdmin,
    getDashboardStats,
    
    // User dashboard functions
    getUserProfile,
    updateUserProfile,
    getUserActivities,
    addUserActivity,
    deleteUserActivity,
    getUserComments,
    addUserComment,
    deleteUserComment,
    getUserStats
};