require('dotenv').config();
const axios = require('axios');

// Test the OpenAI API directly
async function testOpenAI() {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    console.log('Testing OpenAI API...');
    console.log(`API Key (first 10 chars): ${OPENAI_API_KEY.substring(0, 10)}...`);
    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello, how are you?" }
            ],
            temperature: 0.7,
            max_tokens: 100
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        console.log('Success! The API is working correctly.');
        
    } catch (error) {
        console.error('API Error:', error.message);
        
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        }
        
        console.error('Full error:', JSON.stringify(error, null, 2));
    }
}

// Run the test
testOpenAI();