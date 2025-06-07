// Simple test script for the chatbot API
const axios = require('axios');

async function testChatbot() {
    const testQueries = [
        "Weather in Dar es Salaam",
        "Tanzania climate information", 
        "Give me a climate fact",
        "What are the latest climate news?",
        "Tell me about renewable energy in Tanzania",
        "Weather in Arusha",
        "Climate change impacts"
    ];

    console.log('🧪 Testing Tanzania Climate Chatbot API...\n');

    for (const query of testQueries) {
        try {
            console.log(`❓ Query: "${query}"`);
            
            const response = await axios.post('http://localhost:3000/api/chatbot/ask', {
                message: query
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(`✅ Response: ${response.data.reply.substring(0, 100)}...\n`);
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
        }
    }
}

testChatbot();