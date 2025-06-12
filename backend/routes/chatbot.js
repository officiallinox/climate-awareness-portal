const express = require('express');
const router = express.Router();
const axios = require('axios');

// API Configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo_key';
const AIR_QUALITY_API_KEY = process.env.AIR_QUALITY_API_KEY || 'demo_key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'demo_key';

// Helper function for OpenAI API calls
async function callOpenAI(systemMessage, userMessage, maxTokens = 500) {
    console.log(`[OpenAI] Making API call with system message (${systemMessage.length} chars)`);
    console.log(`[OpenAI] User message: "${userMessage.substring(0, 100)}..."`);
    console.log(`[OpenAI] Using API key: ${OPENAI_API_KEY.substring(0, 10)}...`);
    
    // Check if we're using a demo key or if the API key is invalid
    if (OPENAI_API_KEY === 'demo_key' || OPENAI_API_KEY.length < 20) {
        console.warn('[OpenAI] Using demo key or invalid API key. Falling back to local response.');
        throw new Error('Invalid API key configuration');
    }
    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: maxTokens,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const aiResponse = response.data.choices[0].message.content;
            console.log('[OpenAI] Response received successfully');
            return aiResponse;
        } else {
            console.error('[OpenAI] Unexpected response format:', response.data);
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('[OpenAI] API Error:', error.message);
        
        // Check for quota exceeded error
        if (error.response && error.response.status === 429) {
            console.error('[OpenAI] Quota exceeded or rate limit error');
            throw new Error('OpenAI API quota exceeded. Please check your billing details.');
        }
        
        // Log detailed error information
        if (error.response) {
            console.error('[OpenAI] Error details:', JSON.stringify(error.response.data, null, 2));
            console.error('[OpenAI] Status code:', error.response.status);
        }
        
        throw error; // Re-throw the error to be handled by the calling function
    }
}

// Enhanced Climate APIs integration
class ClimateAPIService {
    
    // Get current weather and climate data for a location
    async getWeatherData(location = 'Global') {
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
                country: data.sys.country,
                temperature: data.main.temp,
                feelsLike: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                description: data.weather[0].description,
                windSpeed: data.wind.speed,
                windDirection: data.wind.deg,
                visibility: data.visibility,
                cloudiness: data.clouds.all,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
            };
            console.log(`[WeatherAPI] Success for ${result.location}: ${result.temperature}°C`);
            return result;
        } catch (error) {
            console.error('[WeatherAPI] Error:', error.message);
            return null;
        }
    }

    // Get air quality data
    async getAirQualityData(location = 'Global') {
        try {
            // First get coordinates
            const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
                params: {
                    q: location,
                    limit: 1,
                    appid: OPENWEATHER_API_KEY
                }
            });

            if (geoResponse.data.length === 0) {
                return null;
            }

            const { lat, lon } = geoResponse.data[0];
            
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: OPENWEATHER_API_KEY
                }
            });

            const data = response.data.list[0];
            const aqi = data.main.aqi;
            const aqiLevels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
            
            return {
                location: location,
                aqi: aqi,
                quality: aqiLevels[aqi - 1] || 'Unknown',
                co: data.components.co,
                no2: data.components.no2,
                o3: data.components.o3,
                pm2_5: data.components.pm2_5,
                pm10: data.components.pm10
            };
        } catch (error) {
            console.error('[AirQuality] Error:', error.message);
            return null;
        }
    }

    // Get climate forecast
    async getClimateForcast(location = 'Global') {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                params: {
                    q: location,
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric',
                    cnt: 8 // 24 hours (3-hour intervals)
                }
            });

            const forecasts = response.data.list.map(item => ({
                time: new Date(item.dt * 1000).toLocaleString(),
                temperature: item.main.temp,
                description: item.weather[0].description,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed
            }));

            return {
                location: response.data.city.name,
                forecasts: forecasts
            };
        } catch (error) {
            console.error('[Forecast] Error:', error.message);
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

    // Get comprehensive climate facts
    getClimateFacts() {
        const facts = [
            // Global Climate Facts
            "The current atmospheric CO2 level is over 420 ppm, the highest in over 3 million years.",
            "Global temperatures have risen by approximately 1.1°C since pre-industrial times.",
            "Arctic sea ice is declining at a rate of 13% per decade.",
            "Ocean pH has decreased by 0.1 units since pre-industrial times due to CO2 absorption.",
            "Renewable energy costs have dropped by 90% for solar and 70% for wind since 2010.",
            "Deforestation accounts for about 11% of global CO2 emissions.",
            "The last decade (2014-2023) includes the 10 warmest years on record.",
            "Methane is 28 times more potent than CO2 as a greenhouse gas over 100 years.",
            
            // Regional Climate Facts
            "Tanzania's Mount Kilimanjaro has lost over 80% of its ice cap since 1912 due to climate change.",
            "Lake Victoria is experiencing rising temperatures affecting fish populations and water levels.",
            "East Africa experiences some of the world's most variable rainfall patterns.",
            "The Sahel region is expanding southward by 48km per year due to desertification.",
            "Small island states face complete submersion with just 1.5°C of warming.",
            
            // Solutions and Technology
            "Electric vehicle sales grew by 108% globally in 2021.",
            "Solar energy can provide 100 times the world's current energy needs.",
            "Reforestation could remove 25% of current atmospheric CO2.",
            "Energy efficiency improvements could reduce global emissions by 40%.",
            "Carbon capture technology could remove 1-5 billion tons of CO2 annually by 2030.",
            
            // Biodiversity and Ecosystems
            "Climate change threatens 1 million species with extinction.",
            "Coral reefs have experienced 3 global bleaching events since 1998.",
            "Permafrost thaw could release 300 billion tons of carbon by 2100.",
            "Wetlands store 35% of terrestrial carbon despite covering only 6% of Earth's surface.",
            
            // Human Impact
            "Climate change could displace 1.2 billion people by 2050.",
            "Heat waves kill more people annually than hurricanes, tornadoes, and floods combined.",
            "Climate change could reduce global GDP by 10-23% by 2100 without action.",
            "Agriculture productivity could decline by 10-25% by 2050 due to climate change."
        ];
        
        return facts[Math.floor(Math.random() * facts.length)];
    }

    // Get sustainability tips
    getSustainabilityTips() {
        const tips = [
            "Switch to LED bulbs - they use 75% less energy and last 25 times longer than incandescent bulbs.",
            "Unplug electronics when not in use - phantom loads account for 5-10% of residential energy use.",
            "Use a programmable thermostat - it can save up to 10% on heating and cooling costs.",
            "Choose public transport, cycling, or walking - transportation accounts for 29% of greenhouse gas emissions.",
            "Eat less meat - livestock production generates 14.5% of global greenhouse gas emissions.",
            "Reduce food waste - one-third of food produced globally is wasted, contributing to 8% of emissions.",
            "Use reusable bags, bottles, and containers to reduce single-use plastic consumption.",
            "Plant native species in your garden - they require less water and support local ecosystems.",
            "Collect rainwater for gardening - it reduces water consumption and stormwater runoff.",
            "Buy local and seasonal produce to reduce transportation emissions and support local farmers.",
            "Use cold water for washing clothes - it can save up to 90% of the energy used by washing machines.",
            "Air-dry clothes instead of using a dryer to save energy and extend clothing life.",
            "Choose renewable energy options if available in your area.",
            "Insulate your home properly - it can reduce heating and cooling energy use by up to 40%.",
            "Use a water-efficient showerhead to reduce both water and energy consumption."
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Get current CO2 levels (simulated - in real implementation, this would fetch from an API)
    getCurrentCO2Level() {
        // Simulated current CO2 level (real implementation would fetch from Mauna Loa Observatory API)
        const currentCO2 = 421.5 + (Math.random() * 2 - 1); // Around 421.5 ppm with some variation
        return {
            level: currentCO2.toFixed(1),
            trend: "increasing",
            lastUpdate: new Date().toISOString(),
            comparison: "This is the highest level in over 3 million years"
        };
    }

    // Get renewable energy statistics
    getRenewableEnergyStats() {
        const stats = [
            "Solar power capacity has grown by over 20% annually for the past decade.",
            "Wind energy now provides over 7% of global electricity generation.",
            "Hydroelectric power generates about 16% of the world's electricity.",
            "Geothermal energy has a capacity factor of 75%, higher than most other renewables.",
            "Renewable energy employed 13.7 million people globally in 2022.",
            "China leads in renewable energy capacity with over 1,000 GW installed.",
            "Denmark generates over 50% of its electricity from wind power.",
            "Costa Rica runs on nearly 100% renewable electricity.",
            "Solar panel efficiency has improved from 6% in 1954 to over 26% today.",
            "Battery storage costs have fallen by 90% since 2010."
        ];
        
        return stats[Math.floor(Math.random() * stats.length)];
    }
}

const climateAPI = new ClimateAPIService();

// Enhanced AI Climate Response Generator
async function getEnhancedClimateResponse(message) {
    const lowerMessage = message.toLowerCase();
    console.log(`[Chatbot] Processing: "${message}"`);
    
    try {
        // First, check if it's a climate or weather-specific query
        if (isClimateQuery(lowerMessage)) {
            // Check for weather-related queries to provide real-time data
            if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('climate data')) {
                let location = extractLocation(lowerMessage) || 'New York'; // Default to major city
                
                console.log(`[Chatbot] Getting weather for: ${location}`);
                const weatherData = await climateAPI.getWeatherData(location);
                
                if (weatherData) {
                    // Get AI-powered response that incorporates the weather data
                    return await getAIWeatherResponse(message, weatherData);
                }
            }
            
            // For agricultural/farming questions related to weather
            if ((lowerMessage.includes('crop') || 
                 lowerMessage.includes('farm') || 
                 lowerMessage.includes('plant') || 
                 lowerMessage.includes('grow') || 
                 lowerMessage.includes('garden')) && 
                (lowerMessage.includes('weather') || 
                 lowerMessage.includes('climate') || 
                 lowerMessage.includes('temperature'))) {
                
                let location = extractLocation(lowerMessage) || 'New York';
                console.log(`[Chatbot] Getting agricultural weather data for: ${location}`);
                
                const weatherData = await climateAPI.getWeatherData(location);
                if (weatherData) {
                    // Use AI to generate agricultural recommendations
                    return await getAIAgricultureResponse(message, weatherData);
                }
            }

            // Air Quality Queries
            if (lowerMessage.includes('air quality') || lowerMessage.includes('pollution') || lowerMessage.includes('aqi')) {
                let location = extractLocation(lowerMessage) || 'New York';
                
                const airData = await climateAPI.getAirQualityData(location);
                if (airData) {
                    // Use AI to generate air quality response
                    return await getAIAirQualityResponse(message, airData);
                }
            }

            // CO2 and Greenhouse Gas Queries
            if (lowerMessage.includes('co2') || lowerMessage.includes('carbon dioxide') || lowerMessage.includes('greenhouse gas')) {
                const co2Data = climateAPI.getCurrentCO2Level();
                // Use AI to generate CO2 and greenhouse gas response
                return await getAICO2Response(message, co2Data);
            }

            // Climate Facts and Education
            if (lowerMessage.includes('fact') || lowerMessage.includes('did you know') || lowerMessage.includes('tell me about climate')) {
                const fact = climateAPI.getClimateFacts();
                return `🌍 **Climate Science Fact:**

${fact}

Would you like to know more about any specific aspect of climate science? I can explain topics like greenhouse gases, renewable energy, climate impacts, or sustainability solutions!`;
            }

            // Sustainability and Solutions
            if (lowerMessage.includes('sustainability') || lowerMessage.includes('sustainable') || lowerMessage.includes('how can i help') || lowerMessage.includes('reduce') || lowerMessage.includes('carbon footprint')) {
                const tip = climateAPI.getSustainabilityTips();
                return `♻️ **Sustainability Tip:**

${tip}

**More ways to help:**
• **Energy:** Use renewable energy, improve efficiency
• **Transport:** Walk, bike, use public transport, consider EVs
• **Diet:** Eat less meat, reduce food waste, buy local
• **Consumption:** Buy less, reuse more, choose sustainable products
• **Advocacy:** Support climate policies, educate others

Every action counts! Small changes add up to make a significant impact when adopted widely.`;
            }

            // Renewable Energy Queries
            if (lowerMessage.includes('renewable energy') || lowerMessage.includes('solar') || lowerMessage.includes('wind') || lowerMessage.includes('clean energy')) {
                const stat = climateAPI.getRenewableEnergyStats();
                return `⚡ **Renewable Energy Insight:**

${stat}

**Current Global Renewable Energy Status:**
• **Solar:** Fastest growing energy source globally
• **Wind:** Cost-competitive with fossil fuels in many regions
• **Hydro:** Largest source of renewable electricity worldwide
• **Geothermal:** Provides consistent, reliable baseload power
• **Storage:** Battery technology improving rapidly

The renewable energy transition is accelerating, driven by falling costs and climate commitments!`;
            }

            // Climate Change Impacts
            if (lowerMessage.includes('climate change') || lowerMessage.includes('global warming') || lowerMessage.includes('climate impact')) {
                return `🌡️ **Climate Change Overview:**

Climate change refers to long-term shifts in global temperatures and weather patterns, primarily caused by human activities since the 1800s.

**Key Impacts:**
• **Temperature:** Global average has risen 1.1°C since pre-industrial times
• **Weather:** More frequent extreme events (heatwaves, storms, droughts)
• **Sea Level:** Rising due to thermal expansion and ice melt
• **Ecosystems:** Species migration, coral bleaching, habitat loss
• **Agriculture:** Changing growing seasons and crop yields
• **Human Health:** Heat stress, disease patterns, food security

**Solutions exist:** Renewable energy, energy efficiency, sustainable transport, nature-based solutions, and international cooperation through agreements like the Paris Climate Accord.`;
            }

            // News and Current Events
            if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('current events')) {
                const news = await climateAPI.getClimateNews();
                if (news && news.length > 0) {
                    let response = "📰 **Latest Climate News:**\n\n";
                    news.slice(0, 3).forEach((article, index) => {
                        const date = new Date(article.publishedAt).toLocaleDateString();
                        response += `**${index + 1}.** ${article.title}\n`;
                        response += `*${date}* - ${article.description?.substring(0, 100)}...\n\n`;
                    });
                    response += "Stay informed about climate developments to understand the urgency and progress in addressing climate change!";
                    return response;
                }
            }

            // Biodiversity and Ecosystems
            if (lowerMessage.includes('biodiversity') || lowerMessage.includes('ecosystem') || lowerMessage.includes('species') || lowerMessage.includes('extinction')) {
                return `🦋 **Biodiversity & Climate Change:**

Climate change is one of the biggest threats to global biodiversity, affecting species and ecosystems worldwide.

**Key Impacts:**
• **Habitat Loss:** Changing temperatures alter suitable habitats
• **Migration:** Species forced to move to survive
• **Timing:** Disrupted breeding and feeding cycles
• **Ocean Acidification:** Threatens marine ecosystems
• **Extreme Events:** Wildfires, storms destroy habitats

**Current Status:**
• 1 million species face extinction risk
• 75% of land environments severely altered
• Ocean ecosystems declining rapidly
• Pollinators essential for food security at risk

**Solutions:** Protected areas, habitat restoration, sustainable practices, and addressing climate change root causes.`;
            }

            // Policy and Economics
            if (lowerMessage.includes('policy') || lowerMessage.includes('paris agreement') || lowerMessage.includes('economics') || lowerMessage.includes('cost')) {
                return `🏛️ **Climate Policy & Economics:**

**Paris Agreement:** Global commitment to limit warming to 1.5°C above pre-industrial levels.

**Economic Aspects:**
• **Cost of Inaction:** Could reduce global GDP by 10-23% by 2100
• **Investment Needed:** $2.8 trillion annually for clean energy transition
• **Job Creation:** Renewable energy sector employs 13.7 million globally
• **Health Benefits:** Cleaner air saves healthcare costs
• **Innovation:** Drives technological advancement and competitiveness

**Policy Tools:**
• Carbon pricing and emissions trading
• Renewable energy standards
• Energy efficiency regulations
• Green building codes
• Sustainable transport policies

Economic analysis shows that climate action is cost-effective compared to inaction!`;
            }

            // Technology and Innovation
            if (lowerMessage.includes('technology') || lowerMessage.includes('innovation') || lowerMessage.includes('carbon capture') || lowerMessage.includes('electric vehicle')) {
                return `🔬 **Climate Technology & Innovation:**

**Breakthrough Technologies:**
• **Carbon Capture:** Removing CO2 directly from atmosphere
• **Green Hydrogen:** Clean fuel for industry and transport
• **Advanced Batteries:** Enabling renewable energy storage
• **Smart Grids:** Optimizing energy distribution
• **Electric Vehicles:** Rapidly improving range and affordability

**Emerging Solutions:**
• Artificial photosynthesis
• Lab-grown meat alternatives
• Advanced nuclear reactors
• Sustainable aviation fuels
• Ocean-based carbon removal

**Innovation Trends:**
• Costs falling rapidly for clean technologies
• AI optimizing energy systems
• Blockchain enabling carbon markets
• IoT improving efficiency

Technology innovation is accelerating the clean energy transition and providing new solutions to climate challenges!`;
            }

            // Regional Climate Information
            if (lowerMessage.includes('africa') || lowerMessage.includes('tanzania') || lowerMessage.includes('kenya') || lowerMessage.includes('region')) {
                return `🌍 **Regional Climate Information:**

**Africa & Climate Change:**
Africa is particularly vulnerable to climate impacts despite contributing least to global emissions.

**Key Challenges:**
• **Water Stress:** Changing rainfall patterns affect agriculture
• **Temperature Rise:** Faster warming than global average
• **Sea Level Rise:** Threatens coastal communities
• **Extreme Weather:** More frequent droughts and floods
• **Food Security:** Agricultural productivity at risk

**Opportunities:**
• **Solar Potential:** Abundant sunshine for renewable energy
• **Young Population:** Innovation and adaptation capacity
• **Natural Resources:** Potential for sustainable development
• **Regional Cooperation:** Shared solutions across borders

**Adaptation Strategies:**
• Drought-resistant crops
• Water conservation systems
• Early warning systems
• Sustainable land management
• Climate-resilient infrastructure`;
            }

            // Forecast and Predictions
            if (lowerMessage.includes('forecast') || lowerMessage.includes('prediction') || lowerMessage.includes('future') || lowerMessage.includes('2030') || lowerMessage.includes('2050')) {
                let location = extractLocation(lowerMessage) || 'Global';
                
                if (location !== 'Global') {
                    const forecast = await climateAPI.getClimateForcast(location);
                    if (forecast) {
                        let response = `🔮 **24-Hour Weather Forecast for ${forecast.location}:**\n\n`;
                        forecast.forecasts.slice(0, 4).forEach((item, index) => {
                            response += `**${item.time}:** ${item.temperature}°C, ${item.description}\n`;
                        });
                        return response + "\nThis short-term forecast helps understand local weather patterns that contribute to long-term climate trends.";
                    }
                }
                
                return `🔮 **Climate Projections:**

**By 2030:**
• Global temperature likely to rise 1.5°C above pre-industrial levels
• Renewable energy could provide 45% of electricity globally
• Electric vehicle sales expected to reach 30% of new car sales

**By 2050:**
• Many countries committed to net-zero emissions
• Sea level could rise 0.3-0.6 meters
• Arctic summers may be ice-free
• 1.2 billion people could be displaced by climate impacts

**Positive Trends:**
• Renewable energy costs continuing to fall
• Climate technology innovation accelerating
• Growing public awareness and action
• Increasing corporate and government commitments

The future depends on actions we take today!`;
            }

            // Help and Capabilities
            if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities')) {
                return `🤖 **I'm your AI Assistant! Here's what I can help you with:**

**🌤️ Real-Time Data:**
• Current weather conditions for any location
• Air quality and pollution levels
• Climate forecasts and trends

**📚 Education:**
• Science explanations on any topic
• Historical information
• Math and problem solving
• Language and translation help

**♻️ Practical Guidance:**
• Personal tips and advice
• How-to instructions
• Product recommendations
• Planning and organization

**📰 Current Information:**
• Latest news and research
• Technology innovations
• Cultural and social trends

**🌍 General Knowledge:**
• Answer questions on any topic
• Explain complex concepts
• Provide summaries and analysis

Just ask me anything! I'm here to provide helpful, accurate information on virtually any topic.`;
            }
        }

        // For non-climate queries or if no specific climate response was generated,
        // use the general AI response service
        try {
            console.log('[Chatbot] Using general AI response for:', message);
            
            // Simulate a general AI response
            const generalResponse = await getGeneralAIResponse(message);
            return generalResponse;
            
        } catch (generalError) {
            console.error('[Chatbot] Error getting general response:', generalError);
            
            // Fallback to default response
            return `I'm not sure how to answer that specific question, but I'd be happy to help with any climate-related questions or other general topics. 

What else would you like to know about?`;
        }

    } catch (error) {
        console.error('[Chatbot] Error:', error);
        return `🔧 **I'm experiencing some technical difficulties right now.**

While I work on resolving this issue, here are some reliable resources you can explore:

• **General Knowledge:** wikipedia.org
• **Science Information:** science.org
• **News Sources:** reuters.com, apnews.com
• **Our Articles:** Browse our knowledge hub

Please try asking your question again in a moment!`;
    }
}

// Function to get AI-powered weather response
async function getAIWeatherResponse(message, weatherData) {
    console.log(`[OpenAI] Generating weather response for ${weatherData.location}, ${weatherData.temperature}°C`);
    
    try {
        // Format weather data for the AI
        const weatherInfo = `
Current Weather in ${weatherData.location}, ${weatherData.country}:
- Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
- Conditions: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Pressure: ${weatherData.pressure} hPa
- Wind: ${weatherData.windSpeed} m/s
- Visibility: ${(weatherData.visibility / 1000).toFixed(1)} km
- Sunrise: ${weatherData.sunrise} | Sunset: ${weatherData.sunset}
`;

        // Prepare the system message with weather data
        const systemMessage = `You are an AI assistant specialized in climate awareness and environmental topics.
You have access to real-time weather data that you should incorporate into your response.

CURRENT WEATHER DATA:
${weatherInfo}

Provide a helpful, informative response that addresses the user's question and incorporates the weather data.
Format your response using Markdown for better readability. Include the weather data in a visually appealing way.
Also include a brief note about how this weather relates to broader climate patterns or trends when relevant.
Keep your tone friendly, informative, and encouraging.`;

        // Make the API call to OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        
        // Extract and return the AI's response
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const aiResponse = response.data.choices[0].message.content;
            console.log('[OpenAI] Weather response received successfully');
            return aiResponse;
        } else {
            console.error('[OpenAI] Unexpected response format:', response.data);
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('[OpenAI] Weather API Error:', error.message);
        
        // Fallback to formatted weather data if AI fails
        return `🌤️ **Current Weather in ${weatherData.location}, ${weatherData.country}:**
                    
**Temperature:** ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
**Conditions:** ${weatherData.description}
**Humidity:** ${weatherData.humidity}%
**Pressure:** ${weatherData.pressure} hPa
**Wind:** ${weatherData.windSpeed} m/s
**Visibility:** ${(weatherData.visibility / 1000).toFixed(1)} km
**Sunrise:** ${weatherData.sunrise} | **Sunset:** ${weatherData.sunset}

This real-time data helps us monitor local climate conditions and understand weather patterns that contribute to long-term climate trends.`;
    }
}

// Function to get AI-powered air quality response
async function getAIAirQualityResponse(message, airData) {
    console.log(`[OpenAI] Generating air quality response for ${airData.location}`);
    
    try {
        // Format air quality data for the AI
        const airQualityInfo = `
Current Air Quality in ${airData.location}:
- Air Quality Index: ${airData.aqi}/5 (${airData.quality})
- PM2.5: ${airData.pm2_5} μg/m³
- PM10: ${airData.pm10} μg/m³
- NO2: ${airData.no2} μg/m³
- Ozone (O3): ${airData.o3} μg/m³
- Carbon Monoxide: ${airData.co} μg/m³
`;

        // Prepare the system message with air quality data
        const systemMessage = `You are an AI assistant specialized in climate awareness and environmental topics.
You have access to real-time air quality data that you should incorporate into your response.

CURRENT AIR QUALITY DATA:
${airQualityInfo}

Provide a helpful, informative response that addresses the user's question and incorporates the air quality data.
Format your response using Markdown for better readability. Include the air quality data in a visually appealing way.
Explain what these measurements mean for health and the environment, and how they relate to climate change.
Include health recommendations based on the current air quality level.
Keep your tone friendly, informative, and encouraging.`;

        // Make the API call to OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        
        // Extract and return the AI's response
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const aiResponse = response.data.choices[0].message.content;
            console.log('[OpenAI] Air quality response received successfully');
            return aiResponse;
        } else {
            console.error('[OpenAI] Unexpected response format:', response.data);
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('[OpenAI] Air Quality API Error:', error.message);
        
        // Fallback to formatted air quality data if AI fails
        return `🌬️ **Air Quality in ${airData.location}:**
                    
**Air Quality Index:** ${airData.aqi}/5 (${airData.quality})
**PM2.5:** ${airData.pm2_5} μg/m³
**PM10:** ${airData.pm10} μg/m³
**NO2:** ${airData.no2} μg/m³
**Ozone (O3):** ${airData.o3} μg/m³
**Carbon Monoxide:** ${airData.co} μg/m³

Air quality directly impacts human health and is closely linked to climate change. Poor air quality often indicates high greenhouse gas emissions in the area.`;
    }
}

// Function to get AI-powered agriculture recommendations
async function getAIAgricultureResponse(message, weatherData) {
    console.log(`[OpenAI] Generating agriculture recommendations for ${weatherData.location}, ${weatherData.temperature}°C`);
    
    try {
        // Format weather data for the AI
        const weatherInfo = `
Current Weather in ${weatherData.location}, ${weatherData.country}:
- Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
- Conditions: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind: ${weatherData.windSpeed} m/s
- Sunrise: ${weatherData.sunrise} | Sunset: ${weatherData.sunset}
`;

        // Prepare the system message with weather data
        const systemMessage = `You are an AI assistant specialized in agricultural advice and climate-smart farming.
You have access to real-time weather data that you should use to provide specific agricultural recommendations.

CURRENT WEATHER DATA:
${weatherInfo}

Based on this weather data, provide detailed agricultural recommendations including:
1. Suitable crops for the current conditions
2. Planting and care advice considering the temperature, humidity, and conditions
3. Weather-specific considerations for farming activities
4. Sustainable farming practices appropriate for these conditions

Format your response using Markdown for better readability. Make your recommendations specific and actionable.
Keep your tone friendly, informative, and encouraging.`;

        // Make the API call to OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        
        // Extract and return the AI's response
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const aiResponse = response.data.choices[0].message.content;
            console.log('[OpenAI] Agriculture response received successfully');
            return aiResponse;
        } else {
            console.error('[OpenAI] Unexpected response format:', response.data);
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('[OpenAI] Agriculture API Error:', error.message);
        
        // Fallback to basic agriculture recommendations if AI fails
        // Temperature ranges for different crop categories
        const coldWeatherCrops = ['Spinach', 'Kale', 'Lettuce', 'Broccoli', 'Cabbage'];
        const moderateWeatherCrops = ['Tomatoes', 'Peppers', 'Cucumbers', 'Beans', 'Corn'];
        const warmWeatherCrops = ['Watermelon', 'Cantaloupe', 'Sweet Potatoes', 'Okra', 'Peanuts'];
        
        let recommendedCrops = [];
        let seasonalAdvice = '';
        let additionalTips = '';
        
        // Determine crop recommendations based on temperature
        const temp = weatherData.temperature;
        
        if (temp < 10) {
            recommendedCrops = coldWeatherCrops;
            seasonalAdvice = 'These cold-weather crops can tolerate light frost and prefer cooler temperatures.';
            additionalTips = 'Consider using cold frames or row covers to protect young plants from extreme cold.';
        } else if (temp >= 10 && temp < 20) {
            recommendedCrops = [...coldWeatherCrops.slice(0, 2), ...moderateWeatherCrops.slice(0, 3)];
            seasonalAdvice = 'This is an excellent temperature range for many crops, particularly leafy greens and root vegetables.';
            additionalTips = 'This is a good time to start hardening off seedlings for transplanting.';
        } else if (temp >= 20 && temp < 30) {
            recommendedCrops = moderateWeatherCrops;
            seasonalAdvice = 'These moderate-temperature crops thrive in this temperature range and can be directly sown in the garden.';
            additionalTips = 'Ensure adequate watering as temperatures rise, preferably in the early morning or evening.';
        } else {
            recommendedCrops = warmWeatherCrops;
            seasonalAdvice = 'These heat-loving crops thrive in warm to hot conditions but will need adequate water.';
            additionalTips = 'Provide afternoon shade for sensitive plants and increase watering frequency during hot periods.';
        }
        
        return `🌱 **Agricultural Recommendations for ${weatherData.location}, ${weatherData.country}**

**Current Weather Conditions:**
- Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
- Conditions: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind: ${weatherData.windSpeed} m/s

**Recommended Crops for Current Conditions:**
${recommendedCrops.map(crop => `- ${crop}`).join('\n')}

**Seasonal Advice:**
${seasonalAdvice}

**Additional Growing Tips:**
${additionalTips}

**Weather Considerations:**
- The current weather pattern suggests ${weatherData.description.toLowerCase()}, which may ${weatherData.description.includes('rain') ? 'reduce the need for manual watering' : 'require regular irrigation'}.
- Plan your gardening activities around the sunrise (${weatherData.sunrise}) and sunset (${weatherData.sunset}) times for optimal results.`;
    }
}

// Function to determine if a query is climate-related
function isClimateQuery(message) {
    const climateKeywords = [
        'climate', 'weather', 'temperature', 'global warming', 'carbon', 'co2', 
        'greenhouse', 'emission', 'sustainability', 'renewable', 'solar', 'wind', 
        'environment', 'pollution', 'biodiversity', 'ecosystem', 'conservation',
        'recycling', 'green energy', 'fossil fuel', 'sea level', 'ocean', 'air quality',
        'drought', 'flood', 'hurricane', 'wildfire', 'deforestation', 'paris agreement',
        'ipcc', 'carbon footprint', 'net zero', 'electric vehicle', 'methane',
        'crop', 'farm', 'plant', 'grow', 'garden', 'agriculture', 'harvest', 'soil'
    ];
    
    return climateKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// Function to get a general AI response for any question using OpenAI API
async function getGeneralAIResponse(message) {
    console.log('[OpenAI] Processing query:', message);
    
    try {
        // Prepare the system message to guide the AI's responses
        const systemMessage = `You are an AI assistant specialized in climate awareness and environmental topics. 
You provide helpful, accurate, and educational responses with a focus on climate science, sustainability, 
and environmental issues. When appropriate, include relevant facts, statistics, or practical advice. 
Format your responses using Markdown for better readability. Keep your tone friendly, informative, and encouraging.`;

        // Make the API call to OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo", // You can use "gpt-4" for more advanced capabilities if available
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });
        
        // Extract and return the AI's response
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const aiResponse = response.data.choices[0].message.content;
            console.log('[OpenAI] Response received successfully');
            return aiResponse;
        } else {
            console.error('[OpenAI] Unexpected response format:', response.data);
            throw new Error('Unexpected response format from OpenAI API');
        }
    } catch (error) {
        console.error('[OpenAI] API Error:', error.message);
        console.error('[OpenAI] Full error object:', JSON.stringify(error, null, 2));
        
        if (error.response) {
            console.error('[OpenAI] Error details:', JSON.stringify(error.response.data, null, 2));
            console.error('[OpenAI] Status code:', error.response.status);
            console.error('[OpenAI] Headers:', JSON.stringify(error.response.headers, null, 2));
        }
        
        // Fallback response in case of API failure
        return `I apologize, but I'm having trouble connecting to my knowledge base at the moment. 
        
Here are some general points about climate change while I resolve this issue:

- Climate change refers to long-term shifts in temperatures and weather patterns
- Human activities, particularly burning fossil fuels, are the main driver of current climate change
- Effects include rising temperatures, changing precipitation patterns, and more extreme weather events
- Solutions involve reducing emissions, transitioning to renewable energy, and adapting to changes

Please try your question again in a moment, or you can explore our climate articles section for more information.`;
    }
}

// Helper function to generate simulated responses
function generateSimulatedResponse(message, useMarkdown = false) {
    // This function creates a sophisticated, plausible-sounding response based on the query
    // In a real implementation, this would be replaced by an actual AI API call
    
    const lowerMessage = message.toLowerCase();
    
    // History questions
    if (lowerMessage.includes('history') || lowerMessage.includes('historical') || 
        lowerMessage.includes('ancient') || lowerMessage.includes('century') || 
        lowerMessage.includes('war') || lowerMessage.includes('revolution')) {
        
        if (useMarkdown) {
            return `Historical analysis of this topic reveals a complex interplay of factors and perspectives. The events in question occurred during a **significant period** that shaped subsequent historical developments in profound ways.

**Key historical aspects:**

1. **Chronological context**: The timeline generally accepted by historians places these events within a broader historical narrative
2. **Causal factors**: Multiple influences contributed, including:
   - Political dynamics and power structures of the era
   - Economic conditions and resource distribution
   - Social movements and cultural shifts
   - Technological developments of the period
3. **Key figures**: Several influential individuals played pivotal roles, though their motivations and impacts are subject to ongoing scholarly debate
4. **Legacy and impact**: The long-term consequences continue to influence modern society through:
   - Institutional structures
   - Cultural memory and national identities
   - Precedents for subsequent historical developments

Historiographical approaches to this subject have evolved over time, with earlier interpretations often reflecting the perspectives and biases of their era. Modern scholarship tends to incorporate more diverse viewpoints and interdisciplinary methodologies.`;
        } else {
            return `Historical records indicate this is a complex topic with multiple perspectives. The events you're asking about occurred during a significant period that shaped subsequent developments. Historians generally agree on the main timeline, though interpretations vary regarding causes and impacts.

Key factors included political, economic, and social conditions of the time, as well as influential figures who played pivotal roles. The long-term consequences continue to influence modern society in various ways.`;
        }
    }
    
    // Science questions
    if (lowerMessage.includes('science') || lowerMessage.includes('scientific') || 
        lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || 
        lowerMessage.includes('biology') || lowerMessage.includes('theory')) {
        
        if (useMarkdown) {
            return `From a scientific perspective, this topic involves several fundamental principles and mechanisms that have been extensively studied through empirical research.

**Current scientific understanding:**

* **Theoretical framework**: The phenomenon is explained through established scientific models that have been refined through decades of research
* **Empirical evidence**: Multiple lines of evidence support our understanding, including:
  * Laboratory experiments with reproducible results
  * Observational data collected across diverse contexts
  * Statistical analyses demonstrating significant correlations
* **Areas of ongoing research**: Scientists continue to investigate:
  * More precise quantification of key variables
  * Edge cases and boundary conditions
  * Potential applications and implications

**Recent advances** in instrumentation and computational methods have enabled more sophisticated measurements and modeling, leading to refinements in theoretical understanding. The scientific consensus, while robust on fundamental aspects, acknowledges areas where further research is needed to address remaining questions.

It's worth noting that scientific understanding is always provisional and subject to revision as new evidence emerges, though well-established principles rarely undergo complete paradigm shifts.`;
        } else {
            return `From a scientific perspective, this involves several key principles and mechanisms. Current research in this field has made significant advances in understanding the underlying processes.

The scientific consensus, based on peer-reviewed studies, supports certain fundamental concepts while acknowledging areas where more research is needed. Recent technological developments have enabled more precise measurements and observations, leading to refined theories.`;
        }
    }
    
    // Technology questions
    if (lowerMessage.includes('technology') || lowerMessage.includes('computer') || 
        lowerMessage.includes('software') || lowerMessage.includes('hardware') || 
        lowerMessage.includes('internet') || lowerMessage.includes('digital')) {
        
        if (useMarkdown) {
            return `This technology has evolved significantly in recent years, with each iteration addressing previous limitations and introducing new capabilities.

**Key technological aspects:**

1. **Historical development**:
   * Early implementations faced challenges with performance and scalability
   * Breakthrough innovations around [relevant timeframe] enabled wider adoption
   * Recent advancements have focused on optimization and user experience

2. **Current state of the technology**:
   * Modern implementations leverage advanced algorithms and systems
   * Key features include improved efficiency, reliability, and integration capabilities
   * Industry standards have emerged to ensure interoperability

3. **Implementation considerations**:
   * Security and privacy safeguards
   * Scalability for varying workloads
   * Integration with existing systems and workflows
   * Cost-benefit analysis for different deployment models

4. **Future trends** likely include:
   * Enhanced automation and intelligence
   * Improved performance metrics
   * More intuitive interfaces and experiences
   * Broader ecosystem integration

Leading organizations in this space continue to invest in research and development, with competition driving rapid innovation cycles. Open-source contributions have also played a significant role in advancing the technology and making it more accessible.`;
        } else {
            return `This technology has evolved significantly over recent years, with innovations addressing previous limitations. Current implementations utilize advanced algorithms and systems to optimize performance and user experience.

Industry leaders continue to develop new features and capabilities, while considering important factors like security, scalability, and integration with existing systems. Future trends may include further automation, improved efficiency, and enhanced functionality.`;
        }
    }
    
    // Health questions
    if (lowerMessage.includes('health') || lowerMessage.includes('medical') || 
        lowerMessage.includes('disease') || lowerMessage.includes('treatment') || 
        lowerMessage.includes('symptom') || lowerMessage.includes('doctor')) {
    if (useMarkdown) {
            return `Health research indicates this is a multifaceted topic with various physiological, psychological, and lifestyle components that interact in complex ways.

**Key health considerations:**

* **Evidence-based approaches**: Medical consensus generally supports interventions that have demonstrated efficacy through:
  * Randomized controlled trials
  * Systematic reviews and meta-analyses
  * Clinical practice guidelines from respected medical organizations

* **Prevention strategies** often include:
  * Nutritional considerations and dietary patterns
  * Physical activity recommendations (type, frequency, intensity)
  * Sleep hygiene and stress management techniques
  * Regular health screenings and preventive care

* **Treatment approaches** typically vary based on:
  * Severity and progression
  * Individual health profiles and comorbidities
  * Response to first-line interventions
  * Risk-benefit analysis of available options

* **Personalized considerations**: Individual factors that may influence outcomes include:
  * Genetic predispositions
  * Environmental exposures
  * Behavioral patterns
  * Access to healthcare resources

It's important to note that while general information can be helpful for understanding, consulting with qualified healthcare providers is essential for personalized medical advice tailored to specific circumstances.`;
        } else {
            return `Health research suggests this is a multifaceted topic involving various physiological and lifestyle factors. Medical professionals typically recommend evidence-based approaches tailored to individual circumstances.

Prevention strategies often include balanced nutrition, regular physical activity, adequate sleep, and stress management. Treatment options may vary depending on severity, duration, and individual health profiles. Consulting with healthcare providers is always recommended for personalized advice.`;
        }
    }
    
    // Business and economics
    if (lowerMessage.includes('business') || lowerMessage.includes('economic') || 
        lowerMessage.includes('finance') || lowerMessage.includes('market') || 
        lowerMessage.includes('investment') || lowerMessage.includes('company')) {
        
        if (useMarkdown) {
            return `From a business and economic perspective, this topic involves multiple factors that influence decision-making, market dynamics, and financial outcomes.

**Key business considerations:**

1. **Market analysis**:
   * Current trends and growth projections
   * Competitive landscape and market positioning
   * Consumer behavior and demand patterns
   * Regulatory environment and compliance requirements

2. **Strategic implications**:
   * Value proposition and differentiation opportunities
   * Resource allocation and optimization
   * Risk assessment and mitigation strategies
   * Performance metrics and success indicators

3. **Financial aspects**:
   * Cost structures and pricing models
   * Revenue projections and profit margins
   * Investment requirements and funding options
   * Return on investment calculations

4. **Operational considerations**:
   * Implementation timelines and milestones
   * Resource requirements (human, technological, financial)
   * Process optimization and efficiency improvements
   * Quality assurance and continuous improvement

Organizations typically approach these decisions through structured frameworks that balance short-term objectives with long-term strategic goals, while accounting for both internal capabilities and external market conditions.`;
        } else {
            return `From a business and economic perspective, this involves considerations of market dynamics, strategic positioning, and financial implications. Organizations typically evaluate such decisions based on both quantitative metrics and qualitative factors.

Key considerations include competitive analysis, resource allocation, risk assessment, and alignment with strategic objectives. Financial models often project potential outcomes across different scenarios, accounting for variables like market conditions, operational efficiency, and regulatory requirements.`;
        }
    }
    
    // Psychology and behavior
    if (lowerMessage.includes('psychology') || lowerMessage.includes('behavior') || 
        lowerMessage.includes('mental') || lowerMessage.includes('cognitive') || 
        lowerMessage.includes('emotion') || lowerMessage.includes('brain')) {
        
        if (useMarkdown) {
            return `Psychological research offers valuable insights into this topic, drawing from multiple theoretical frameworks and empirical studies.

**Key psychological perspectives:**

* **Cognitive aspects**:
  * Information processing and decision-making patterns
  * Attention, perception, and memory influences
  * Cognitive biases and heuristics that may affect judgment
  * Development of mental models and schemas

* **Emotional components**:
  * Role of emotional states in shaping experiences and responses
  * Emotional regulation strategies and their effectiveness
  * Interaction between cognitive and emotional processes
  * Individual differences in emotional reactivity and resilience

* **Behavioral patterns**:
  * Learning mechanisms (classical and operant conditioning)
  * Habit formation and maintenance
  * Environmental influences on behavior
  * Motivation and reinforcement systems

* **Social dimensions**:
  * Interpersonal dynamics and relationship factors
  * Social influence and conformity pressures
  * Group processes and identity considerations
  * Cultural contexts and their impact

Research in this area continues to evolve, with recent advances in neuroscience providing additional insights into the biological underpinnings of psychological processes. Evidence-based approaches typically integrate findings from multiple methodologies, including experimental studies, observational research, and clinical applications.`;
        } else {
            return `Psychological research provides several perspectives on this topic, drawing from cognitive, emotional, behavioral, and social frameworks. Studies have identified patterns in how people process information, form attitudes, and make decisions in this context.

Key factors include cognitive processes, emotional responses, learned behaviors, and social influences. Individual differences in personality traits and past experiences also play important roles in shaping outcomes. Recent neuroscience research has added valuable insights into the biological mechanisms underlying these psychological processes.`;
        }
    }
    
    // Generic response for other topics
    if (useMarkdown) {
        return `This is a multifaceted topic with several important dimensions to consider based on current understanding.

**Key aspects to consider:**

1. **Conceptual framework**:
   * Fundamental principles and definitions
   * Historical development of key ideas
   * Theoretical models that explain observed patterns
   * Relationships between core components

2. **Practical applications**:
   * Real-world implementations and case studies
   * Best practices and common approaches
   * Challenges and limitations in application
   * Metrics for evaluating effectiveness

3. **Current perspectives**:
   * Areas of consensus among experts
   * Points of ongoing debate and discussion
   * Recent developments and emerging trends
   * Interdisciplinary connections and insights

4. **Contextual factors**:
   * Environmental and situational influences
   * Individual variations and considerations
   * Systemic and structural elements
   * Cultural and social dimensions

The field continues to evolve as new research, methodologies, and practical experiences contribute to our collective understanding. Different stakeholders may emphasize various aspects depending on their specific goals, values, and contexts.`;
    } else {
        
            return `This is an interesting topic with various dimensions to consider. Based on available information, there are several key aspects worth noting.

Experts in this field have conducted research and developed frameworks that help us understand the fundamental concepts. Different perspectives exist, each offering valuable insights into the complexities involved.

Recent developments continue to shape our understanding, with ongoing discussions among specialists contributing to a more comprehensive view.`;
    }
}

// Helper function to extract location from message
function extractLocation(message) {
    const lowerMessage = message.toLowerCase();
    
    // First, check if the message is asking about current location or weather
    if (lowerMessage.includes('this weather') || 
        lowerMessage.includes('current weather') || 
        lowerMessage.includes('weather now') || 
        lowerMessage.includes('weather here') ||
        lowerMessage.includes('my location') ||
        lowerMessage.includes('my area') ||
        lowerMessage.includes('this kind of weather')) {
        
        // Default to a major city if we can't determine user's location
        // In a real implementation, this would use geolocation or user preferences
        return 'New York';
    }
    
    // Common location patterns
    const locationPatterns = [
        /(?:weather|temperature|climate|air quality|grow|plant|crops|farming) (?:in|for|at|of) ([a-zA-Z\s,]+)/i,
        /(?:in|at|of) ([a-zA-Z\s,]+) (?:weather|temperature|climate|air quality|grow|plant|crops|farming)/i,
        /([a-zA-Z\s,]+) (?:weather|temperature|climate|air quality)/i
    ];
    
    for (const pattern of locationPatterns) {
        const match = message.match(pattern);
        if (match) {
            // Clean up the location
            let location = match[1].trim();
            // Remove common words that might be captured but aren't locations
            const nonLocationWords = ['the', 'a', 'an', 'this', 'that', 'these', 'those', 'now', 'then', 'today', 'tomorrow', 'yesterday', 'kind', 'type', 'sort'];
            for (const word of nonLocationWords) {
                location = location.replace(new RegExp(`\\b${word}\\b`, 'i'), '').trim();
            }
            if (location.length > 2) {
                return location;
            }
        }
    }
    
    // Check for specific city names
    const cities = [
        'new york', 'london', 'paris', 'tokyo', 'beijing', 'mumbai', 'delhi',
        'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
        'san antonio', 'san diego', 'dallas', 'san jose', 'austin',
        'dar es salaam', 'dodoma', 'arusha', 'mwanza', 'zanzibar',
        'nairobi', 'lagos', 'cairo', 'johannesburg', 'cape town',
        'sydney', 'melbourne', 'toronto', 'vancouver', 'montreal',
        'berlin', 'rome', 'madrid', 'barcelona', 'amsterdam', 'vienna',
        'seoul', 'bangkok', 'singapore', 'kuala lumpur', 'jakarta',
        'mexico city', 'lima', 'bogota', 'rio de janeiro', 'sao paulo',
        'buenos aires', 'santiago'
    ];
    
    for (const city of cities) {
        if (lowerMessage.includes(city)) {
            return city;
        }
    }
    
    // If still no location found, check for agricultural/farming questions about weather
    if ((lowerMessage.includes('crop') || 
         lowerMessage.includes('farm') || 
         lowerMessage.includes('plant') || 
         lowerMessage.includes('grow') || 
         lowerMessage.includes('garden')) && 
        (lowerMessage.includes('weather') || 
         lowerMessage.includes('climate') || 
         lowerMessage.includes('temperature'))) {
        
        // Default to a major city for agricultural weather questions
        return 'New York';
    }
    
    return null;
}

router.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ 
            error: 'Message is required',
            reply: 'Please provide a message for me to respond to. I\'m here to help with climate and environmental questions!'
        });
    }

    // Rate limiting check (simple implementation)
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    try {
        console.log(`[API] Received message from ${clientIP}: "${message}"`);
        
        // Add typing delay for more natural interaction
        const typingDelay = Math.min(message.length * 50, 3000); // Max 3 seconds
        await new Promise(resolve => setTimeout(resolve, Math.min(typingDelay, 1000)));
        
        const reply = await getEnhancedClimateResponse(message);
        
        console.log(`[API] Sending reply (${reply.length} chars): "${reply.substring(0, 100)}..."`);
        
        // Track usage statistics
        const responseData = {
            reply,
            timestamp: new Date().toISOString(),
            messageLength: message.length,
            responseLength: reply.length,
            processingTime: Date.now() - now
        };
        
        res.json(responseData);
        
    } catch (error) {
        console.error('[API] Error processing chatbot request:', error);
        
        let errorMessage = `🔧 I apologize, but I'm experiencing technical difficulties right now.`;
        
        // Check for specific error types
        if (error.message && error.message.includes('quota exceeded')) {
            errorMessage = `⚠️ **API Quota Exceeded**

I apologize, but our AI service has reached its usage limit for the current billing period. 

This is a temporary issue that our team is aware of. We're working to upgrade our service capacity to better serve you.

In the meantime, you can:
• Browse our climate articles for information
• Check our sustainability initiatives section
• Explore the weather data visualizations

Thank you for your understanding!`;
        } else {
            errorMessage = `🔧 I apologize, but I'm experiencing technical difficulties right now. 

This might be due to:
• High server load
• API rate limits
• Network connectivity issues

Please try again in a moment. In the meantime, you can:
• Browse our climate articles
• Check out our sustainability initiatives
• Explore the weather section

I'll be back to full functionality shortly!`;
        }
        
        const errorResponse = {
            reply: errorMessage,
            error: true,
            timestamp: new Date().toISOString()
        };
        
        res.status(500).json(errorResponse);
    }
});

// Health check endpoint for the chatbot service
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AI Assistant',
        version: '3.0.0',
        capabilities: [
            'General knowledge base',
            'Real-time weather data',
            'Educational content',
            'Practical assistance',
            'Current events information',
            'Creative support'
        ],
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Get chatbot capabilities
router.get('/capabilities', (req, res) => {
    res.json({
        name: 'AI Assistant',
        description: 'Intelligent assistant with broad knowledge across many domains',
        features: {
            'General Knowledge': [
                'Science and technology',
                'History and culture',
                'Arts and literature',
                'Mathematics and logic'
            ],
            'Real-time Data': [
                'Current weather conditions',
                'Air quality indices',
                'Climate forecasts',
                'Environmental monitoring'
            ],
            'Educational Content': [
                'Explanations of complex topics',
                'Learning resources',
                'Problem-solving assistance',
                'Research guidance'
            ],
            'Practical Assistance': [
                'How-to guides',
                'Tips and advice',
                'Product information',
                'Planning assistance'
            ],
            'Current Events': [
                'News summaries',
                'Technology trends',
                'Cultural developments',
                'Research breakthroughs'
            ],
            'Creative Support': [
                'Writing assistance',
                'Idea generation',
                'Design concepts',
                'Creative problem-solving'
            ]
        },
        dataSource: [
            'General knowledge base',
            'OpenWeatherMap API',
            'Research databases',
            'Educational resources',
            'Current events information',
            'Scientific literature'
        ],
        lastUpdated: new Date().toISOString()
    });
});

module.exports = router;