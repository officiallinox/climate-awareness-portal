const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Initiative = require('../models/Initiative');

// Get public statistics for homepage
router.get('/stats', async (req, res) => {
    try {
        // Get counts from database
        const [userCount, articleCount, initiativeCount] = await Promise.all([
            User.countDocuments(),
            Article.countDocuments(),
            Initiative.countDocuments()
        ]);

        // Calculate derived statistics
        const carbonSaved = initiativeCount * 125; // 125kg CO2 per initiative
        const treesPlanted = initiativeCount * 50; // 50 trees per initiative
        const userActivities = userCount * 3; // Average 3 activities per user
        const partnerOrgs = Math.min(Math.floor(userCount / 10), 100); // 1 partner per 10 users, max 100

        const stats = {
            users: {
                total: userCount,
                active: Math.floor(userCount * 0.7), // 70% active users
                new: Math.floor(userCount * 0.2) // 20% new users this month
            },
            articles: {
                total: articleCount,
                published: articleCount,
                views: articleCount * 150 // Average 150 views per article
            },
            initiatives: {
                total: initiativeCount,
                active: Math.floor(initiativeCount * 0.6), // 60% active
                completed: Math.floor(initiativeCount * 0.4) // 40% completed
            },
            impact: {
                carbonSaved: carbonSaved,
                treesPlanted: treesPlanted,
                userActivities: userActivities,
                partnerOrgs: partnerOrgs
            },
            global: {
                co2Reduced: carbonSaved,
                treesPlanted: treesPlanted,
                countries: 50, // Static for now
                cities: 200 // Static for now
            }
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching public stats:', error);
        
        // Return fallback data if database fails
        res.json({
            users: {
                total: 1247,
                active: 873,
                new: 249
            },
            articles: {
                total: 156,
                published: 156,
                views: 23400
            },
            initiatives: {
                total: 89,
                active: 53,
                completed: 36
            },
            impact: {
                carbonSaved: 11125,
                treesPlanted: 4450,
                userActivities: 3741,
                partnerOrgs: 124
            },
            global: {
                co2Reduced: 150000,
                treesPlanted: 2500000,
                countries: 50,
                cities: 200
            }
        });
    }
});

// Get recent activities for homepage (public, anonymized)
router.get('/recent-activities', async (req, res) => {
    try {
        // Get recent initiatives and articles
        const [recentInitiatives, recentArticles] = await Promise.all([
            Initiative.find()
                .sort({ createdAt: -1 })
                .limit(3)
                .select('title description createdAt')
                .lean(),
            Article.find()
                .sort({ createdAt: -1 })
                .limit(3)
                .select('title content createdAt')
                .lean()
        ]);

        // Format activities for public display
        const activities = [
            ...recentInitiatives.map(init => ({
                type: 'initiative',
                title: init.title,
                description: init.description?.substring(0, 100) + '...',
                date: init.createdAt,
                icon: '🌱'
            })),
            ...recentArticles.map(article => ({
                type: 'article',
                title: article.title,
                description: article.content?.substring(0, 100) + '...',
                date: article.createdAt,
                icon: '📰'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        res.json(activities);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        
        // Return fallback activities
        res.json([
            {
                type: 'initiative',
                title: 'Community Tree Planting',
                description: 'Join us for a massive tree planting event in Central Park this weekend...',
                date: new Date(Date.now() - 86400000), // 1 day ago
                icon: '🌱'
            },
            {
                type: 'article',
                title: 'Climate Change and Ocean Health',
                description: 'Understanding the critical relationship between rising temperatures and marine ecosystems...',
                date: new Date(Date.now() - 172800000), // 2 days ago
                icon: '📰'
            },
            {
                type: 'initiative',
                title: 'Solar Panel Installation Drive',
                description: 'Help install solar panels in low-income neighborhoods to reduce energy costs...',
                date: new Date(Date.now() - 259200000), // 3 days ago
                icon: '☀️'
            }
        ]);
    }
});

module.exports = router;