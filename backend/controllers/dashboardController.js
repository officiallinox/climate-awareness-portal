const User = require('../models/User');
const Initiative = require('../models/Initiative');
const Article = require('../models/Article');
const Activity = require('../models/Activity');
const Comment = require('../models/Comment');

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
        
        // Log the update request
        console.log('Updating user profile with data:', updates);
        
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

// ACTIVITIES CRUD OPERATIONS

// Get user activities
exports.getUserActivities = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const activities = await Activity.find({ userId })
            .sort({ date: -1 })
            .limit(100); // Limit to last 100 activities
        
        res.json(activities);
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create activity
exports.createActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const activityData = {
            ...req.body,
            userId
        };
        
        const activity = new Activity(activityData);
        await activity.save();
        
        // Update user stats
        await updateUserActivityStats(userId);
        
        res.status(201).json(activity);
    } catch (error) {
        console.error('Error creating activity:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update activity
exports.updateActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const activityId = req.params.id;
        
        const activity = await Activity.findOneAndUpdate(
            { _id: activityId, userId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        res.json(activity);
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete activity
exports.deleteActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const activityId = req.params.id;
        
        const activity = await Activity.findOneAndDelete({ _id: activityId, userId });
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        
        // Update user stats
        await updateUserActivityStats(userId);
        
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: error.message });
    }
};

// COMMENTS CRUD OPERATIONS

// Get user comments
exports.getUserComments = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const comments = await Comment.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 comments
        
        res.json(comments);
    } catch (error) {
        console.error('Error fetching user comments:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create comment
exports.createComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        const commentData = {
            ...req.body,
            userId,
            author: user.name || user.email
        };
        
        const comment = new Comment(commentData);
        await comment.save();
        
        // Update user stats
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.totalComments': 1 }
        });
        
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update comment
exports.updateComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        
        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, userId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        
        const comment = await Comment.findOneAndDelete({ _id: commentId, userId });
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        // Update user stats
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.totalComments': -1 }
        });
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: error.message });
    }
};

// BULK SYNC OPERATION

// Sync dashboard data (for offline capability)
exports.syncDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { activities, comments, preferences } = req.body;
        
        const results = {
            activities: { created: 0, updated: 0, errors: 0 },
            comments: { created: 0, updated: 0, errors: 0 },
            preferences: { updated: false }
        };
        
        // Sync activities
        if (activities && Array.isArray(activities)) {
            for (const activityData of activities) {
                try {
                    if (activityData.id) {
                        // Update existing activity
                        const updated = await Activity.findOneAndUpdate(
                            { _id: activityData.id, userId },
                            { ...activityData, userId },
                            { new: true, upsert: true }
                        );
                        results.activities.updated++;
                    } else {
                        // Create new activity
                        const activity = new Activity({ ...activityData, userId });
                        await activity.save();
                        results.activities.created++;
                    }
                } catch (error) {
                    console.error('Error syncing activity:', error);
                    results.activities.errors++;
                }
            }
        }
        
        // Sync comments
        if (comments && Array.isArray(comments)) {
            const user = await User.findById(userId);
            
            for (const commentData of comments) {
                try {
                    if (commentData.id) {
                        // Update existing comment
                        await Comment.findOneAndUpdate(
                            { _id: commentData.id, userId },
                            { ...commentData, userId, author: user.name || user.email },
                            { new: true, upsert: true }
                        );
                        results.comments.updated++;
                    } else {
                        // Create new comment
                        const comment = new Comment({ 
                            ...commentData, 
                            userId, 
                            author: user.name || user.email 
                        });
                        await comment.save();
                        results.comments.created++;
                    }
                } catch (error) {
                    console.error('Error syncing comment:', error);
                    results.comments.errors++;
                }
            }
        }
        
        // Sync preferences
        if (preferences) {
            try {
                await User.findByIdAndUpdate(userId, {
                    dashboardPreferences: preferences
                });
                results.preferences.updated = true;
            } catch (error) {
                console.error('Error syncing preferences:', error);
            }
        }
        
        // Update user stats
        await updateUserActivityStats(userId);
        
        res.json(results);
    } catch (error) {
        console.error('Error syncing dashboard data:', error);
        res.status(500).json({ error: error.message });
    }
};

// Helper function to update user activity stats
async function updateUserActivityStats(userId) {
    try {
        const activities = await Activity.find({ userId });
        const totalActivities = activities.length;
        
        // Calculate streak
        const sortedActivities = activities
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate = null;
        
        for (const activity of sortedActivities) {
            const activityDate = new Date(activity.date).toDateString();
            
            if (lastDate && activityDate !== lastDate) {
                const daysDiff = (new Date(activityDate) - new Date(lastDate)) / (1000 * 60 * 60 * 24);
                
                if (daysDiff === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            } else if (!lastDate) {
                tempStreak = 1;
            }
            
            lastDate = activityDate;
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
        
        // Calculate current streak from today backwards
        const today = new Date().toDateString();
        const recentActivities = sortedActivities.reverse();
        
        for (const activity of recentActivities) {
            const activityDate = new Date(activity.date).toDateString();
            const daysDiff = (new Date(today) - new Date(activityDate)) / (1000 * 60 * 60 * 24);
            
            if (daysDiff <= 1) {
                currentStreak++;
            } else {
                break;
            }
        }
        
        const lastActivityDate = sortedActivities.length > 0 ? 
            sortedActivities[0].date : null;
        
        await User.findByIdAndUpdate(userId, {
            'stats.totalActivities': totalActivities,
            'stats.currentStreak': currentStreak,
            'stats.longestStreak': longestStreak,
            'stats.lastActivityDate': lastActivityDate
        });
        
    } catch (error) {
        console.error('Error updating user activity stats:', error);
    }
}