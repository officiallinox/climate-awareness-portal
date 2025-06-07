// Script to create an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/climate_portal');
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@portal.com' });
        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists');
            process.exit(0);
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

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();