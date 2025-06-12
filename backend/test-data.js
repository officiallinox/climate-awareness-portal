const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');
const Comment = require('./models/Comment');

// This function will be called by seed-all-data.js
// We don't connect to MongoDB here anymore

async function addTestData() {
    try {
        console.log('Starting test data generation...');

        // Create test users
        const testUsers = [
            { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'user' },
            { name: 'Bob Wilson', email: 'bob@example.com', password: 'password123', role: 'user' },
            { name: 'Alice Brown', email: 'alice@example.com', password: 'password123', role: 'user' },
            { name: 'Charlie Davis', email: 'charlie@example.com', password: 'password123', role: 'user' }
        ];

        const users = await User.insertMany(testUsers);
        console.log('Test users created:', users.length);

        // Create test activities for the last 30 days
        const activities = [];
        const activityTypes = ['outdoor', 'indoor', 'sports', 'travel', 'work'];
        const activityNames = [
            'Tree Planting', 'Beach Cleanup', 'Recycling Drive', 'Environmental Workshop',
            'Nature Walk', 'Solar Panel Installation', 'Composting', 'Water Conservation',
            'Wildlife Protection', 'Green Energy Seminar'
        ];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Create 3-15 activities per day
            const activitiesPerDay = Math.floor(Math.random() * 13) + 3;
            
            for (let j = 0; j < activitiesPerDay; j++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
                const randomName = activityNames[Math.floor(Math.random() * activityNames.length)];
                
                // Set random hour (more activities during business hours)
                const hour = Math.random() < 0.7 ? 
                    Math.floor(Math.random() * 9) + 9 : // 9 AM - 6 PM (70% chance)
                    Math.floor(Math.random() * 24); // Any hour (30% chance)
                
                date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

                activities.push({
                    userId: randomUser._id,
                    name: randomName,
                    type: randomType,
                    date: new Date(date),
                    location: 'Dar es Salaam',
                    notes: `Test activity for ${randomName}`
                });
            }
        }

        const createdActivities = await Activity.insertMany(activities);
        console.log('Test activities created:', createdActivities.length);

        // Create test comments
        const comments = [];
        for (let i = 0; i < 50; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));

            comments.push({
                userId: randomUser._id,
                text: `This is a test comment about climate awareness #${i + 1}`,
                author: randomUser.name,
                category: 'general',
                tags: ['climate', 'environment', 'test'],
                isPublic: Math.random() > 0.3 // 70% public
            });
        }

        const createdComments = await Comment.insertMany(comments);
        console.log('Test comments created:', createdComments.length);

        console.log('✅ Test data added successfully!');
        console.log(`📊 Summary:
        - Users: ${users.length}
        - Activities: ${createdActivities.length}
        - Comments: ${createdComments.length}`);

        return {
            users,
            activities: createdActivities,
            comments: createdComments
        };

    } catch (error) {
        console.error('Error adding test data:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    addTestData();
}

module.exports = addTestData;