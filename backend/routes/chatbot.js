const express = require('express');
const router = express.Router();
const axios = require('axios');

// API Configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo_key';
const AIR_QUALITY_API_KEY = process.env.AIR_QUALITY_API_KEY || 'demo_key';

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
        // Weather and Environmental Data Queries
        if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('climate data')) {
            let location = extractLocation(lowerMessage) || 'New York'; // Default to major city
            
            console.log(`[Chatbot] Getting weather for: ${location}`);
            const weatherData = await climateAPI.getWeatherData(location);
            if (weatherData) {
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

        // Air Quality Queries
        if (lowerMessage.includes('air quality') || lowerMessage.includes('pollution') || lowerMessage.includes('aqi')) {
            let location = extractLocation(lowerMessage) || 'New York';
            
            const airData = await climateAPI.getAirQualityData(location);
            if (airData) {
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

        // CO2 and Greenhouse Gas Queries
        if (lowerMessage.includes('co2') || lowerMessage.includes('carbon dioxide') || lowerMessage.includes('greenhouse gas')) {
            const co2Data = climateAPI.getCurrentCO2Level();
            return `🌡️ **Current Global CO2 Levels:**
            
**Atmospheric CO2:** ${co2Data.level} ppm
**Trend:** ${co2Data.trend}
**Last Updated:** ${new Date(co2Data.lastUpdate).toLocaleDateString()}

${co2Data.comparison}. The safe level for climate stability is considered to be below 350 ppm. Current levels are driving global warming and climate change impacts worldwide.

**Key Facts:**
• CO2 levels rise by ~2.5 ppm annually
• Pre-industrial levels were ~280 ppm
• Each ppm represents ~7.8 billion tons of CO2`;
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
            return `🤖 **I'm your Climate AI Assistant! Here's what I can help you with:**

**🌤️ Real-Time Data:**
• Current weather conditions for any location
• Air quality and pollution levels
• Climate forecasts and trends

**📚 Climate Education:**
• Climate science explanations
• Greenhouse gas information
• Climate change impacts and solutions

**♻️ Sustainability Guidance:**
• Personal carbon footprint reduction tips
• Sustainable living practices
• Renewable energy information

**📰 Current Information:**
• Latest climate news and research
• Policy updates and international agreements
• Technology innovations and breakthroughs

**🌍 Regional Insights:**
• Location-specific climate information
• Regional adaptation strategies
• Local environmental challenges

Just ask me anything about climate, environment, sustainability, or weather! I'm here to provide accurate, up-to-date information to help you understand and address climate challenges.`;
        }

        // Default response with suggestions
        return `🌍 **Hello! I'm your Climate AI Assistant.**

I have access to real-time environmental data and comprehensive climate knowledge. Here are some things you can ask me:

**🌤️ Weather & Environment:**
• "What's the weather in [city]?"
• "Air quality in [location]"
• "Current CO2 levels"

**📚 Climate Science:**
• "Tell me about climate change"
• "How do greenhouse gases work?"
• "Climate change impacts"

**♻️ Sustainability:**
• "How can I reduce my carbon footprint?"
• "Sustainable living tips"
• "Renewable energy information"

**📰 Current Events:**
• "Latest climate news"
• "Climate technology innovations"
• "Climate policy updates"

What would you like to know about our planet's climate today?`;

    } catch (error) {
        console.error('[Chatbot] Error:', error);
        return `🔧 **I'm experiencing some technical difficulties right now.**

While I work on resolving this issue, here are some reliable climate resources you can explore:

• **NASA Climate Change:** climate.nasa.gov
• **IPCC Reports:** ipcc.ch
• **Climate.gov:** climate.gov
• **Our Articles:** Browse our climate knowledge hub

Please try asking your question again in a moment!`;
    }
}

// Helper function to extract location from message
function extractLocation(message) {
    // Common location patterns
    const locationPatterns = [
        /(?:weather|temperature|climate|air quality) (?:in|for|at) ([a-zA-Z\s,]+)/i,
        /(?:in|at) ([a-zA-Z\s,]+) (?:weather|temperature|climate|air quality)/i,
        /([a-zA-Z\s,]+) (?:weather|temperature|climate|air quality)/i
    ];
    
    for (const pattern of locationPatterns) {
        const match = message.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }
    
    // Check for specific city names
    const cities = [
        'new york', 'london', 'paris', 'tokyo', 'beijing', 'mumbai', 'delhi',
        'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
        'san antonio', 'san diego', 'dallas', 'san jose', 'austin',
        'dar es salaam', 'dodoma', 'arusha', 'mwanza', 'zanzibar',
        'nairobi', 'lagos', 'cairo', 'johannesburg', 'cape town',
        'sydney', 'melbourne', 'toronto', 'vancouver', 'montreal'
    ];
    
    const lowerMessage = message.toLowerCase();
    for (const city of cities) {
        if (lowerMessage.includes(city)) {
            return city;
        }
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
        
        const errorResponse = {
            reply: `🔧 I apologize, but I'm experiencing technical difficulties right now. 

This might be due to:
• High server load
• API rate limits
• Network connectivity issues

Please try again in a moment. In the meantime, you can:
• Browse our climate articles
• Check out our sustainability initiatives
• Explore the weather section

I'll be back to full functionality shortly!`,
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
        service: 'Climate AI Assistant',
        version: '2.0.0',
        capabilities: [
            'Real-time weather data',
            'Air quality monitoring',
            'Climate science education',
            'Sustainability guidance',
            'Climate news updates',
            'Regional climate information'
        ],
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Get chatbot capabilities
router.get('/capabilities', (req, res) => {
    res.json({
        name: 'Climate AI Assistant',
        description: 'Intelligent climate and environmental information assistant',
        features: {
            'Real-time Data': [
                'Current weather conditions',
                'Air quality indices',
                'Climate forecasts',
                'Environmental monitoring'
            ],
            'Climate Education': [
                'Climate science explanations',
                'Greenhouse gas information',
                'Climate change impacts',
                'Scientific research insights'
            ],
            'Sustainability': [
                'Carbon footprint reduction',
                'Sustainable living tips',
                'Renewable energy guidance',
                'Environmental best practices'
            ],
            'Current Events': [
                'Climate news updates',
                'Policy developments',
                'Technology innovations',
                'Research breakthroughs'
            ],
            'Regional Information': [
                'Location-specific climate data',
                'Regional adaptation strategies',
                'Local environmental challenges',
                'Area-specific solutions'
            ]
        },
        dataSource: [
            'OpenWeatherMap API',
            'Climate research databases',
            'Environmental monitoring networks',
            'Scientific literature',
            'Government climate data'
        ],
        lastUpdated: new Date().toISOString()
    });
});

module.exports = router;