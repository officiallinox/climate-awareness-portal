// Simple direct test of the chatbot function
require('dotenv').config();

// Import the chatbot route handler directly
const express = require('express');
const app = express();
app.use(express.json());

// Import the chatbot routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);

// Test the chatbot directly
async function testDirect() {
    try {
        console.log('Testing chatbot function directly...');
        
        // Simulate a request
        const mockReq = {
            body: {
                message: "Weather in Dar es Salaam"
            }
        };
        
        const mockRes = {
            json: (data) => {
                console.log('Response:', data);
            },
            status: (code) => ({
                json: (data) => {
                    console.log('Error response:', code, data);
                }
            })
        };
        
        // This won't work directly, so let's just test the API
        const axios = require('axios');
        
        setTimeout(async () => {
            try {
                const response = await axios.post('http://localhost:3000/api/chatbot/ask', {
                    message: "Weather in Dar es Salaam"
                });
                console.log('API Response:', response.data);
            } catch (error) {
                console.error('API Error:', error.message);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                }
            }
        }, 1000);
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

testDirect();