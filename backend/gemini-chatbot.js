const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
require('dotenv').config();

// Get API key from environment variables
const GEMINI_API_KEY = process.env.Gemini_API_KEY;

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Function to get response from Gemini API
async function getGeminiResponse(message) {
    try {
        console.log(`[Gemini] Processing message: "${message.substring(0, 100)}..."`);
        
        // Get the generative model (Gemini)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Create a climate-focused system prompt
        const prompt = `You are a helpful climate assistant that provides information about climate science, sustainability, and environmental issues. 
Your responses should be informative, educational, and focused on climate awareness.
Format your responses using Markdown for better readability.
Keep your tone friendly, informative, and encouraging.

If asked about how AI works, provide a very concise explanation (under 100 words) focusing on neural networks, pattern recognition, and training data.

User question: ${message}

Provide a helpful, informative response about this topic. Keep your answers concise and to the point.`;
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        console.log(`[Gemini] Response received (${response.text().length} chars)`);
        
        return response.text();
    } catch (error) {
        console.error("[Gemini] API Error:", error.message);
        console.error("[Gemini] Full error:", error);
        
        // Fallback to a simple response if the API fails
        return getFallbackResponse(message);
    }
}

// Fallback response system when API is unavailable
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // AI explanation
    if (lowerMessage.includes('how ai works') || lowerMessage.includes('how does ai work') || lowerMessage.includes('explain ai')) {
        return `**How AI Works - Simple Explanation**

AI works through these key processes:

1. **Learning from Data**: I was trained on vast amounts of text to recognize patterns
2. **Pattern Recognition**: I identify patterns in language to understand questions
3. **Neural Networks**: My system mimics brain neurons to process information
4. **Prediction**: I predict the most helpful response based on my training

Think of me as a sophisticated pattern-matching system that can generate human-like text based on what I've learned from millions of examples.`;
    }
    
    // Climate change related
    if (lowerMessage.includes('climate change') || lowerMessage.includes('global warming')) {
        return `**Climate Change Overview**

Climate change refers to long-term shifts in temperatures and weather patterns. Key points:

• **Causes**: Primarily human activities, especially burning fossil fuels
• **Effects**: Rising temperatures, changing precipitation patterns, extreme weather events
• **Current Status**: Global temperature has risen ~1.1°C since pre-industrial times
• **Projections**: Without action, temperatures could rise 2-4°C by 2100
• **Solutions**: Renewable energy, energy efficiency, sustainable practices

The scientific consensus is clear that climate change is real, caused by humans, and requires urgent action.`;
    }
    
    // Weather related
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
        return `**Weather and Climate**

Weather refers to short-term atmospheric conditions, while climate describes long-term patterns.

Our climate data shows significant changes in recent decades:
• Global temperatures have risen approximately 1.1°C since pre-industrial times
• Weather patterns are becoming more unpredictable and extreme
• Seasonal shifts are affecting agriculture and ecosystems

For specific local weather information, please check our weather section which provides real-time data and forecasts.`;
    }
    
    // Sustainability related
    if (lowerMessage.includes('sustainable') || lowerMessage.includes('sustainability')) {
        return `**Sustainability Practices**

Sustainability is about meeting our present needs without compromising future generations. Here are some key practices:

• **Energy Conservation**: Reduce consumption, use energy-efficient appliances
• **Waste Reduction**: Recycle, compost, avoid single-use items
• **Water Conservation**: Fix leaks, install water-efficient fixtures
• **Sustainable Transportation**: Walk, bike, use public transit, or electric vehicles
• **Eco-Friendly Shopping**: Buy local, choose products with minimal packaging

Small changes in daily habits can collectively make a significant impact on our environment.`;
    }
    
    // Default response
    return `Thank you for your question about climate awareness. Our portal provides information on various climate topics including weather patterns, sustainability practices, renewable energy, and environmental conservation. Please explore our articles section for detailed information on these topics.`;
}

// Route handler for chatbot requests
router.post('/ask', async (req, res) => {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            error: 'Message is required',
            reply: 'Please provide a message for me to respond to. I\'m here to help with climate and environmental questions!'
        });
    }
    
    try {
        console.log(`[Gemini Chatbot] Received message: "${message}"`);
        
        // Get response from Gemini API
        const reply = await getGeminiResponse(message);
        
        console.log(`[Gemini Chatbot] Sending reply: "${reply.substring(0, 100)}..."`);
        
        res.json({
            reply,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[Gemini Chatbot] Error:', error);
        
        res.status(500).json({
            reply: `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or explore our climate articles section for information.`,
            error: true,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;