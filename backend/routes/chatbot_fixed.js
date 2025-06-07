const express = require('express');
const router = express.Router();
const axios = require('axios');

// API Configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo_key';

// Climate APIs integration
class ClimateAPIService {
    
    // Get current weather and climate data for a location
    async getWeatherData(location = 'Dar es Salaam') {
        try {
            console.log(`[WeatherAPI] Fetching weather for: ${location}`);
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: location,
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric'
                }
            });
            
            const data = response.data;
            const result = {
                location: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                description: data.weather[0].description,
                windSpeed: data.wind.speed
            };
            console.log(`[WeatherAPI] Success for ${result.location}: ${result.temperature}°C`);
            return result;
        } catch (error) {
            console.error('[WeatherAPI] Error:', error.message);
            return null;
        }
    }

    // Get climate-related news
    async getClimateNews() {
        try {
            const response = await axios.get(`https://newsapi.org/v2/everything`, {
                params: {
                    q: 'climate change OR renewable energy OR sustainability',
                    sortBy: 'publishedAt',
                    pageSize: 3,
                    apiKey: NEWS_API_KEY
                }
            });
            
            return response.data.articles.map(article => ({
                title: article.title,
                description: article.description,
                url: article.url,
                publishedAt: article.publishedAt
            }));
        } catch (error) {
            console.error('News API error:', error.message);
            return null;
        }
    }

    // Get Tanzania-specific climate facts
    getClimateFacts() {
        const facts = [
            "Tanzania's Mount Kilimanjaro has lost over 80% of its ice cap since 1912 due to climate change.",
            "Lake Victoria, shared by Tanzania, Kenya, and Uganda, is experiencing rising temperatures affecting fish populations.",
            "Tanzania's coastal areas face sea-level rise threats, with Dar es Salaam particularly vulnerable.",
            "The Serengeti ecosystem in Tanzania is shifting due to changing rainfall patterns.",
            "Tanzania generates about 35% of its electricity from hydropower, making it vulnerable to droughts.",
            "East Africa experiences some of the world's most variable rainfall, with climate change increasing unpredictability.",
            "Tanzania's agricultural sector employs 65% of the population and is highly climate-sensitive.",
            "The Indian Ocean around Tanzania is warming faster than the global average.",
            "Tanzania has committed to reducing greenhouse gas emissions by 30-35% by 2030.",
            "Renewable energy potential in Tanzania includes abundant solar, wind, and geothermal resources."
        ];
        
        return facts[Math.floor(Math.random() * facts.length)];
    }
}

const climateAPI = new ClimateAPIService();

// Enhanced response generator using APIs
async function getEnhancedClimateResponse(message) {
    const lowerMessage = message.toLowerCase();
    console.log(`[Chatbot] Processing: "${message}"`);
    
    try {
        // Check for weather queries first
        if (lowerMessage.includes('weather')) {
            let location = 'Dar es Salaam'; // Default location
            
            // Extract specific location if mentioned
            const locationMatch = lowerMessage.match(/weather in ([a-zA-Z\s]+)/i);
            if (locationMatch) {
                location = locationMatch[1].trim();
            } else if (lowerMessage.includes('dar es salaam')) {
                location = 'Dar es Salaam';
            } else if (lowerMessage.includes('dodoma')) {
                location = 'Dodoma';
            } else if (lowerMessage.includes('arusha')) {
                location = 'Arusha';
            } else if (lowerMessage.includes('mwanza')) {
                location = 'Mwanza';
            } else if (lowerMessage.includes('zanzibar')) {
                location = 'Zanzibar';
            }
            
            console.log(`[Chatbot] Getting weather for: ${location}`);
            const weatherData = await climateAPI.getWeatherData(location);
            if (weatherData) {
                return `Current weather in ${weatherData.location}: ${weatherData.temperature}°C, ${weatherData.description}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} m/s. This data helps monitor climate conditions in Tanzania.`;
            }
        }

        // Climate facts
        if (lowerMessage.includes('fact') || lowerMessage.includes('did you know')) {
            const fact = climateAPI.getClimateFacts();
            return `Climate Fact: ${fact}`;
        }

        // News queries
        if (lowerMessage.includes('news') || lowerMessage.includes('latest')) {
            const news = await climateAPI.getClimateNews();
            if (news && news.length > 0) {
                let response = "Latest climate news:\n\n";
                news.slice(0, 2).forEach((article, index) => {
                    response += `${index + 1}. ${article.title}\n`;
                });
                return response;
            }
        }

        // Tanzania specific queries
        if (lowerMessage.includes('tanzania')) {
            return "Tanzania faces significant climate challenges including variable rainfall, rising temperatures, and sea-level rise. The country has great potential for renewable energy, especially solar and hydropower. Agriculture, which employs 65% of the population, is particularly vulnerable to climate change.";
        }

        // Default responses for common topics
        if (lowerMessage.includes('climate change')) {
            return "Climate change significantly affects Tanzania through changing rainfall patterns, rising temperatures, and sea-level rise. Tanzania is working on adaptation strategies and renewable energy development.";
        }

        if (lowerMessage.includes('renewable energy')) {
            return "Tanzania has excellent renewable energy potential with abundant solar radiation (4-7 kWh/m²/day), wind resources along the coast, and geothermal potential in the Rift Valley. The government aims to increase renewable energy access.";
        }

        // Default response
        return "I'm your Tanzania Climate Assistant! I can provide weather information for Tanzanian cities, climate facts, news updates, and answer questions about climate change in Tanzania and East Africa. What would you like to know?";

    } catch (error) {
        console.error('[Chatbot] Error:', error);
        return "I'm sorry, I encountered an error while processing your request. Please try again.";
    }
}

router.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        console.log(`[API] Received message: "${message}"`);
        const reply = await getEnhancedClimateResponse(message);
        console.log(`[API] Sending reply: "${reply.substring(0, 50)}..."`);
        res.json({ reply });
    } catch (error) {
        console.error('[API] Error processing chatbot request:', error);
        res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
    }
});

module.exports = router;