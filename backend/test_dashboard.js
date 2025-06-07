// Test script for user dashboard functionality
const axios = require('axios');

async function testDashboard() {
    console.log('🧪 Testing User Dashboard Functionality...\n');

    const baseURL = 'http://localhost:3000';
    let authToken = '';

    try {
        // Step 1: Try to login with existing user or register new one
        console.log('📝 Step 1: Logging in test user...');
        try {
            const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
                email: 'testuser@dashboard.com',
                password: 'password123'
            });
            authToken = loginResponse.data.token;
            console.log('✅ User logged in successfully');
        } catch (loginError) {
            console.log('🔄 User not found, registering new user...');
            const registerResponse = await axios.post(`${baseURL}/api/auth/register`, {
                name: 'Test User',
                email: `testuser${Date.now()}@dashboard.com`,
                password: 'password123',
                phone: '1234567890',
                gender: 'male',
                dob: '1990-01-01'
            });
            authToken = registerResponse.data.token;
            console.log('✅ User registered successfully');
        }
        console.log('🔑 Token received:', authToken ? 'Yes' : 'No');

        // Step 2: Test user profile
        console.log('\n👤 Step 2: Testing user profile...');
        const profileResponse = await axios.get(`${baseURL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Profile loaded:', profileResponse.data.name);

        // Step 3: Add test activities
        console.log('\n🏃‍♂️ Step 3: Adding test activities...');
        const activities = [
            {
                name: 'Morning Jog',
                type: 'outdoor',
                date: new Date().toISOString(),
                notes: 'Great weather for running'
            },
            {
                name: 'Gym Workout',
                type: 'indoor',
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                notes: 'Strength training session'
            },
            {
                name: 'Beach Volleyball',
                type: 'sports',
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                notes: 'Fun game with friends'
            }
        ];

        for (const activity of activities) {
            const activityResponse = await axios.post(`${baseURL}/api/users/activities`, activity, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Activity added: ${activity.name}`);
        }

        // Step 4: Add test comments
        console.log('\n💬 Step 4: Adding test comments...');
        const comments = [
            {
                text: 'The weather has been perfect for outdoor activities lately!',
                category: 'observation',
                isPublic: true
            },
            {
                text: 'I noticed the air quality is much better in the mornings.',
                category: 'experience',
                isPublic: false
            },
            {
                text: 'Remember to stay hydrated during hot weather activities.',
                category: 'tip',
                isPublic: true
            }
        ];

        for (const comment of comments) {
            const commentResponse = await axios.post(`${baseURL}/api/users/comments`, comment, {
                headers: { 
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Comment added: ${comment.text.substring(0, 30)}...`);
        }

        // Step 5: Test dashboard stats
        console.log('\n📊 Step 5: Testing dashboard stats...');
        const statsResponse = await axios.get(`${baseURL}/api/users/stats`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const stats = statsResponse.data;
        console.log('✅ Dashboard stats loaded:');
        console.log(`   📈 Total Activities: ${stats.totalActivities}`);
        console.log(`   🌳 Outdoor Activities: ${stats.outdoorActivities}`);
        console.log(`   🏠 Indoor Activities: ${stats.indoorActivities}`);
        console.log(`   💬 Total Comments: ${stats.totalComments}`);
        console.log(`   🌍 Climate Score: ${stats.climateScore}`);
        if (stats.avgTemperature) {
            console.log(`   🌡️ Average Temperature: ${stats.avgTemperature}°C`);
        }

        // Step 6: Test loading activities and comments
        console.log('\n📋 Step 6: Testing data retrieval...');
        
        const activitiesResponse = await axios.get(`${baseURL}/api/users/activities`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log(`✅ Activities loaded: ${activitiesResponse.data.length} items`);

        const commentsResponse = await axios.get(`${baseURL}/api/users/comments`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log(`✅ Comments loaded: ${commentsResponse.data.length} items`);

        console.log('\n🎉 All dashboard tests passed successfully!');
        console.log('\n🌐 You can now test the dashboard at: http://localhost:3000/user.html');
        console.log('📧 Login with: testuser@dashboard.com / password123');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            console.log('💡 This might be an authentication issue. Check if the server is running.');
        }
    }
}

// Wait for server to be ready, then run test
setTimeout(testDashboard, 3000);