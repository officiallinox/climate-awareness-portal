const axios = require('axios');

async function debugRoutes() {
    console.log('🔍 Debugging Routes...\n');

    const baseURL = 'http://localhost:3000';
    
    try {
        // First login to get token
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
            email: 'testuser@dashboard.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful, token received');
        
        // Test different endpoints
        const endpoints = [
            '/api/users/profile',
            '/api/users/activities', 
            '/api/users/stats',
            '/api/users/comments'
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`\n🔗 Testing: ${endpoint}`);
                const response = await axios.get(`${baseURL}${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(`✅ ${endpoint} - Status: ${response.status}`);
                console.log(`📄 Response:`, JSON.stringify(response.data, null, 2));
            } catch (error) {
                console.log(`❌ ${endpoint} - Error: ${error.response?.status} ${error.response?.statusText}`);
                console.log(`📄 Error Response:`, error.response?.data);
            }
        }
        
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
    }
}

debugRoutes();