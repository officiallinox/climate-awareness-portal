const express = require('express');
const router = express.Router();
const axios = require('axios');

// This is a simplified implementation using Hugging Face's Inference API
// You'll need to sign up for a free API key at https://huggingface.co/

// Replace with your Hugging Face API key
const HUGGINGFACE_API_KEY = "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Replace with your actual key

// Function to get response from Hugging Face API
async function getHuggingFaceResponse(message) {
    try {
        // Add climate context to the message
        const contextualizedMessage = `You are a helpful climate assistant that provides information about climate science, sustainability, and environmental issues. 
        
User question: ${message}

Provide a helpful, informative response about this climate-related topic.`;

        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                inputs: contextualizedMessage,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.95,
                    do_sample: true
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`
                }
            }
        );

        // Extract the generated text
        if (response.data && response.data[0] && response.data[0].generated_text) {
            // Extract just the assistant's response (remove the prompt)
            const fullText = response.data[0].generated_text;
            const assistantResponse = fullText.split("Provide a helpful, informative response about this climate-related topic.")[1] || fullText;
            
            return assistantResponse.trim();
        } else {
            throw new Error("Unexpected response format from Hugging Face API");
        }
    } catch (error) {
        console.error("[HuggingFace] API Error:", error.message);
        if (error.response) {
            console.error("[HuggingFace] Error details:", error.response.data);
        }
        
        // Fallback to our rule-based system if the API fails
        return getFallbackResponse(message);
    }
}

// Fallback response system when API is unavailable
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
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
        console.log(`[HuggingFace Chatbot] Received message: "${message}"`);
        
        // If you have a valid API key, uncomment this line to use the Hugging Face API
        // const reply = await getHuggingFaceResponse(message);
        
        // For now, use the fallback system since we don't have a valid API key
        const reply = getFallbackResponse(message);
        
        // Add a small delay to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log(`[HuggingFace Chatbot] Sending reply: "${reply.substring(0, 100)}..."`);
        
        res.json({
            reply,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[HuggingFace Chatbot] Error:', error);
        
        res.status(500).json({
            reply: `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or explore our climate articles section for information.`,
            error: true,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;