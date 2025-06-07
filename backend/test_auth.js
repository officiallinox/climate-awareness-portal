// Test script for authentication system
const axios = require('axios');

async function testAuth() {
    console.log('🧪 Testing Authentication System...\n');

    const baseURL = 'http://localhost:3000/api/auth';
    
    // Test data
    const testUser = {
        name: 'John Doe',
        email: 'john.doe@test.com',
        password: 'password123',
        phone: '1234567890',
        gender: 'male',
        dob: '1990-01-01'
    };

    try {
        // Test Registration
        console.log('📝 Testing Registration...');
        const registerResponse = await axios.post(`${baseURL}/register`, testUser);
        console.log('✅ Registration successful:', registerResponse.data.message);
        console.log('🔑 Token received:', registerResponse.data.token ? 'Yes' : 'No');
        console.log('👤 User data:', registerResponse.data.user);
        console.log('');

        // Test Login
        console.log('🔐 Testing Login...');
        const loginResponse = await axios.post(`${baseURL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful');
        console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
        console.log('👤 User data:', loginResponse.data.user);
        console.log('');

        // Test Invalid Login
        console.log('❌ Testing Invalid Login...');
        try {
            await axios.post(`${baseURL}/login`, {
                email: testUser.email,
                password: 'wrongpassword'
            });
        } catch (error) {
            console.log('✅ Invalid login properly rejected:', error.response.data.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Wait a moment for server to be ready, then run test
setTimeout(testAuth, 2000);