const axios = require('axios');

async function testAdminDashboard() {
    console.log('🔧 Testing Admin Dashboard...\n');

    const baseURL = 'http://localhost:3000';
    
    try {
        // First, create an admin user using registration
        console.log('📝 Creating admin user...');
        try {
            await axios.post(`${baseURL}/api/auth/register`, {
                name: 'Admin User',
                phone: '1234567890',
                email: 'admin@portal.com',
                password: 'admin123',
                gender: 'other',
                dob: '1990-01-01'
            });
            console.log('✅ Admin user created');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Admin user already exists');
            } else {
                console.log('❌ Error creating admin:', error.response?.data || error.message);
            }
        }

        // Login as admin (using hardcoded admin credentials)
        console.log('\n🔑 Logging in as admin...');
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
            email: 'admin@portal.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');
        
        // Test admin endpoints
        const endpoints = [
            { url: '/api/admin/users', name: 'Load Users' },
            { url: '/api/admin/activities', name: 'Load All Activities' },
            { url: '/api/admin/comments', name: 'Load All Comments' }
        ];
        
        for (const endpoint of endpoints) {
            try {
                console.log(`\n🔗 Testing: ${endpoint.name}`);
                const response = await axios.get(`${baseURL}${endpoint.url}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(`✅ ${endpoint.name} - Status: ${response.status}`);
                console.log(`📊 Data count: ${response.data.length} items`);
                
                if (response.data.length > 0) {
                    console.log(`📄 Sample data:`, JSON.stringify(response.data[0], null, 2));
                }
            } catch (error) {
                console.log(`❌ ${endpoint.name} - Error: ${error.response?.status} ${error.response?.statusText}`);
                console.log(`📄 Error Response:`, error.response?.data);
            }
        }
        
        console.log('\n🎉 Admin dashboard test completed!');
        console.log('🌐 Access admin dashboard at: http://localhost:3000/admin.html');
        console.log('📧 Login with: admin@portal.com / admin123');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAdminDashboard();