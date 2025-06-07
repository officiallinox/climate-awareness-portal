const axios = require('axios');

async function testPublicAPI() {
    try {
        console.log('🔧 Testing Public API Endpoints...\n');

        // Test public stats endpoint
        const statsResponse = await axios.get('http://localhost:3000/api/public/stats');
        console.log('✅ Public stats endpoint working');
        console.log('📊 Stats Data:');
        console.log('Users:', statsResponse.data.users);
        console.log('Articles:', statsResponse.data.articles);
        console.log('Initiatives:', statsResponse.data.initiatives);
        console.log('Impact:', statsResponse.data.impact);
        console.log('Global:', statsResponse.data.global);

        // Test recent activities endpoint
        const activitiesResponse = await axios.get('http://localhost:3000/api/public/recent-activities');
        console.log('\n✅ Recent activities endpoint working');
        console.log('📝 Recent Activities:', activitiesResponse.data.length, 'items');

        console.log('\n🎉 All public API endpoints are working correctly!');

    } catch (error) {
        console.error('❌ Error testing public API:', error.response?.data || error.message);
    }
}

testPublicAPI();