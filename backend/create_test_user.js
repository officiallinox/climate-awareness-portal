// Create a test user for testing user dashboard
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/climate_portal');

async function createTestUser() {
    try {
        // Check if test user already exists
        const existingUser = await User.findOne({ email: 'testuser@portal.com' });
        if (existingUser) {
            console.log('Test user already exists');
            console.log('Test user details:', {
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            });
        } else {
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
            console.log('Test user created successfully');
            console.log('Login credentials:');
            console.log('Email: testuser@portal.com');
            console.log('Password: test123');
        }
        
        // Test user count
        const userCount = await User.countDocuments();
        console.log('Total users in database:', userCount);
        
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        mongoose.connection.close();
    }
}

createTestUser();