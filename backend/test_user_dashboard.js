const axios = require('axios');

async function testUserDashboard() {
    try {
        console.log('Testing user dashboard...');
        
        // Login
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'testuser@dashboard.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        
        // Test profile
        const profileResponse = await axios.get('http://localhost:3000/api/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Profile loaded:', profileResponse.data.name);
        
        // Test activities
        const activitiesResponse = await axios.get('http://localhost:3000/api/users/activities', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Activities loaded:', activitiesResponse.data.length, 'items');
        
        // Test stats
        const statsResponse = await axios.get('http://localhost:3000/api/users/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Stats loaded:', statsResponse.data);
        console.log('🎉 Dashboard is working!');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testUserDashboard();