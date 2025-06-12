require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');
const Comment = require('./models/Comment');
const Initiative = require('./models/Initiative');
const Article = require('./models/Article');

// Import seed functions
const seedInitiatives = require('./seedInitiatives');
const seedArticles = require('./seedArticles');
const addTestData = require('./test-data');

// Use the exact connection string provided by the user
const MONGO_URI = "mongodb://localhost:27017/climate_portal";

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@portal.com' });
        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists');
            return existingAdmin;
        }

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@portal.com',
            password: 'admin123',
            phone: '0000000000',
            gender: 'male',
            dob: new Date('1980-01-01'),
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@portal.com');
        console.log('🔑 Password: admin123');
        return admin;
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        throw error;
    }
}

async function createTestUser() {
    try {
        // Check if test user already exists
        const existingUser = await User.findOne({ email: 'testuser@portal.com' });
        if (existingUser) {
            console.log('ℹ️ Test user already exists');
            return existingUser;
        }

        // Create test user
        const testUser = new User({
            name: 'Test User',
            email: 'testuser@portal.com',
            password: 'test123',
            role: 'user',
            phone: '0987654321',
            gender: 'male',
            dob: new Date('1995-01-01')
        });

        await testUser.save();
        console.log('✅ Test user created successfully');
        console.log('📧 Email: testuser@portal.com');
        console.log('🔑 Password: test123');
        return testUser;
    } catch (error) {
        console.error('❌ Error creating test user:', error);
        throw error;
    }
}

async function seedAllData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Create admin and test users
        const admin = await createAdmin();
        const testUser = await createTestUser();

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await Activity.deleteMany({});
        await Comment.deleteMany({});
        await Initiative.deleteMany({});
        await Article.deleteMany({});
        
        // Keep users but delete any that aren't our admin or test user
        await User.deleteMany({ 
            _id: { 
                $nin: [
                    admin._id, 
                    testUser._id
                ] 
            } 
        });
        
        console.log('✅ Database cleared');

        // Seed initiatives
        console.log('🌱 Seeding initiatives...');
        await seedInitiatives(admin._id);
        
        // Seed articles
        console.log('📰 Seeding articles...');
        await seedArticles(admin._id);
        
        // Add test data (activities and comments)
        console.log('📊 Adding test activities and comments...');
        await addTestData();

        // Update article views
        console.log('📊 Updating article views...');
        const updateArticleViewsModule = require('./update-article-views');
        await updateArticleViewsModule();

        // Get counts
        const userCount = await User.countDocuments();
        const initiativeCount = await Initiative.countDocuments();
        const articleCount = await Article.countDocuments();
        const activityCount = await Activity.countDocuments();
        const commentCount = await Comment.countDocuments();
        
        // Get total article views
        const articles = await Article.find();
        const totalArticleViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);

        console.log(`
        ✅ All data seeded successfully!
        
        📊 Database Summary:
        - Users: ${userCount}
        - Initiatives: ${initiativeCount}
        - Articles: ${articleCount} (${totalArticleViews} total views)
        - Activities: ${activityCount}
        - Comments: ${commentCount}
        
        🔑 Login Credentials:
        - Admin: admin@portal.com / admin123
        - Test User: testuser@portal.com / test123
        `);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run if called directly
if (require.main === module) {
    seedAllData();
}

module.exports = seedAllData;