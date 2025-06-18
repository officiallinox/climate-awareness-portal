const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing user registration with location...');
        
        // Generate a unique email to avoid conflicts
        const timestamp = new Date().getTime();
        const email = `test${timestamp}@example.com`;
        
        const userData = {
            name: 'Test User',
            email: email,
            password: 'password123',
            confirmPassword: 'password123',
            phone: 'Dar es Salaam, Tanzania', // This will be saved as both phone and location
            gender: 'male',
            dob: new Date(1990, 0, 1).toISOString()
        };
        
        console.log('Registering user with data:', userData);
        
        // Register the user
        const registerResponse = await axios.post('http://localhost:3000/api/auth/register', userData);
        console.log('Registration response:', registerResponse.data);
        
        // Login with the new user
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: email,
            password: 'password123'
        });
        console.log('Login response:', loginResponse.data);
        
        // Check if location is included in the user data
        if (loginResponse.data.user.location) {
            console.log('✅ Success! Location is included in the user data:', loginResponse.data.user.location);
        } else {
            console.log('❌ Error: Location is not included in the user data');
        }
        
        // Verify token
        const token = loginResponse.data.token;
        const verifyResponse = await axios.get('http://localhost:3000/api/auth/verify', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Verify token response:', verifyResponse.data);
        
        // Check if location is included in the verify response
        if (verifyResponse.data.location) {
            console.log('✅ Success! Location is included in the verify response:', verifyResponse.data.location);
        } else {
            console.log('❌ Error: Location is not included in the verify response');
        }
        
    } catch (error) {
        console.error('Error testing registration:', error.response ? error.response.data : error.message);
    }
}

testRegistration();