const axios = require('axios');

async function testDashboardStats() {
    try {
        console.log('🔧 Testing Dashboard Stats Endpoint...\n');

        // Login first
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@portal.com',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');

        // Test dashboard stats
        const statsResponse = await axios.get('http://localhost:3000/api/admin/dashboard-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('✅ Dashboard stats loaded successfully');
        console.log('\n📊 Dashboard Data:');
        console.log('Metrics:', JSON.stringify(statsResponse.data.metrics, null, 2));
        console.log('Charts:', JSON.stringify(statsResponse.data.charts, null, 2));
        console.log('Engagement:', JSON.stringify(statsResponse.data.engagement, null, 2));
        console.log('Climate Impact:', JSON.stringify(statsResponse.data.climateImpact, null, 2));
        console.log('Recent Activities Count:', statsResponse.data.recentActivities.length);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testDashboardStats();