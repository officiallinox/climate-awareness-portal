const axios = require('axios');

async function testAdmin() {
    try {
        console.log('Testing admin login...');
        
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@portal.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');
        console.log('User info:', loginResponse.data.user);
        
        // Test admin endpoints
        console.log('\nTesting admin endpoints...');
        
        try {
            const usersResponse = await axios.get('http://localhost:3000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Users loaded:', usersResponse.data.length, 'users');
        } catch (error) {
            console.log('❌ Users error:', error.response?.status, error.response?.data);
        }
        
        try {
            const activitiesResponse = await axios.get('http://localhost:3000/api/admin/activities', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Activities loaded:', activitiesResponse.data.length, 'activities');
        } catch (error) {
            console.log('❌ Activities error:', error.response?.status, error.response?.data);
        }
        
        try {
            const commentsResponse = await axios.get('http://localhost:3000/api/admin/comments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Comments loaded:', commentsResponse.data.length, 'comments');
        } catch (error) {
            console.log('❌ Comments error:', error.response?.status, error.response?.data);
        }
        
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
    }
}

testAdmin();