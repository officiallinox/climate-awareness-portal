const axios = require('axios');

async function testProfileAPI() {
    try {
        console.log('Testing user profile API...');
        
        // Login to get a token
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@portal.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('Logged in successfully, token obtained');
        
        // Get user profile
        console.log('\nFetching user profile...');
        const profileResponse = await axios.get('http://localhost:3000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('User profile data:');
        console.log(JSON.stringify(profileResponse.data, null, 2));
        
        // Update user profile
        console.log('\nUpdating user profile...');
        const updateData = {
            name: 'Admin User',
            location: 'Dar es Salaam, Tanzania',
            bio: 'I am passionate about climate awareness and environmental conservation.'
        };
        
        const updateResponse = await axios.put('http://localhost:3000/api/users/profile', updateData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Profile update response:');
        console.log(JSON.stringify(updateResponse.data, null, 2));
        
        // Verify the update
        console.log('\nVerifying profile update...');
        const verifyResponse = await axios.get('http://localhost:3000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Updated user profile:');
        console.log(JSON.stringify(verifyResponse.data, null, 2));
        
        // Check if the location and bio were updated
        const updatedUser = verifyResponse.data;
        if (updatedUser.location === updateData.location && updatedUser.bio === updateData.bio) {
            console.log('\n✅ Success! Profile was updated correctly with location and bio.');
        } else {
            console.log('\n❌ Error: Profile update verification failed.');
            console.log('Expected location:', updateData.location, 'Got:', updatedUser.location);
            console.log('Expected bio:', updateData.bio, 'Got:', updatedUser.bio);
        }
        
    } catch (error) {
        console.error('Error testing profile API:', error.response ? error.response.data : error.message);
    }
}

testProfileAPI();