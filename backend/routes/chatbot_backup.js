const express = require('express');
const router = express.Router();
const axios = require('axios');

// API Configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY || 'demo_key';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo_key';

// Climate APIs integration
class ClimateAPIService {
    
    // Get current weather and climate data for a location
    async getWeatherData(location = 'Tanzania') {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: location,
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric'
                }
            });
            
            const data = response.data;
            return {
                location: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                description: data.weather[0].description,
                windSpeed: data.wind.speed
            };
        } catch (error) {
            console.error('Weather API error:', error.message);
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

    // Get CO2 data from free APIs
    async getCO2Data() {
        try {
            // Try multiple free CO2 APIs
            const response = await axios.get('https://api.co2signal.com/v1/latest?countryCode=US', {
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error('CO2 API error:', error.message);
            // Fallback with static recent data
            return {
                carbonIntensity: 400,
                fossilFuelPercentage: 60,
                message: "Current global CO2 levels are around 420 ppm, the highest in human history."
            };
        }
    }

    // Get climate facts with focus on Tanzania and East Africa
    async getClimateFacts() {
        try {
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
        } catch (error) {
            console.error('Climate facts error:', error.message);
            return "Tanzania and East Africa face significant climate challenges but also have great potential for renewable energy development.";
        }
    }

    // Get renewable energy data
    async getRenewableEnergyData() {
        try {
            // Simulated renewable energy statistics (in real app, use actual API)
            return {
                globalCapacity: "3,372 GW",
                growthRate: "9.6%",
                topSources: ["Hydropower", "Wind", "Solar", "Bioenergy"],
                message: "Renewable energy capacity continues to grow rapidly worldwide, with solar and wind leading the expansion."
            };
        } catch (error) {
            console.error('Renewable energy API error:', error.message);
            return null;
        }
    }

    // Get air quality data for Tanzania cities
    async getAirQuality(location = 'Dar es Salaam') {
        try {
            // Tanzania major cities coordinates
            const tanzanianCities = {
                'dar es salaam': { lat: -6.7924, lon: 39.2083 },
                'dodoma': { lat: -6.1630, lon: 35.7516 },
                'arusha': { lat: -3.3869, lon: 36.6830 },
                'mwanza': { lat: -2.5164, lon: 32.9175 },
                'zanzibar': { lat: -6.1659, lon: 39.2026 },
                'tanzania': { lat: -6.3690, lon: 34.8888 }
            };
            
            const cityKey = location.toLowerCase();
            const coords = tanzanianCities[cityKey] || tanzanianCities['dar es salaam'];
            
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution`, {
                params: {
                    lat: coords.lat,
                    lon: coords.lon,
                    appid: OPENWEATHER_API_KEY
                }
            });
            
            const aqi = response.data.list[0].main.aqi;
            const aqiLevels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
            
            return {
                aqi: aqi,
                quality: aqiLevels[aqi - 1] || 'Unknown',
                components: response.data.list[0].components,
                location: location
            };
        } catch (error) {
            console.error('Air Quality API error:', error.message);
            return null;
        }
    }

    // Get Tanzania-specific climate data
    async getTanzaniaClimateData() {
        try {
            // Get weather data for major Tanzanian cities
            const cities = ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza'];
            const weatherPromises = cities.map(city => this.getWeatherData(city));
            const weatherData = await Promise.all(weatherPromises);
            
            return {
                cities: weatherData.filter(data => data !== null),
                climateInfo: {
                    seasons: "Tanzania has two main seasons: dry (June-October) and wet (November-May)",
                    temperature: "Average temperatures range from 20°C to 30°C year-round",
                    rainfall: "Annual rainfall varies from 500mm in central areas to 2000mm on the coast",
                    challenges: "Climate challenges include droughts, floods, and rising temperatures affecting agriculture"
                }
            };
        } catch (error) {
            console.error('Tanzania climate data error:', error.message);
            return null;
        }
    }

    // Get East Africa climate news
    async getEastAfricaClimateNews() {
        try {
            const response = await axios.get(`https://newsapi.org/v2/everything`, {
                params: {
                    q: 'Tanzania climate OR East Africa environment OR Kenya climate OR Uganda environment',
                    sortBy: 'publishedAt',
                    pageSize: 5,
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
            console.error('East Africa News API error:', error.message);
            return null;
        }
    }
}

const climateAPI = new ClimateAPIService();

// Enhanced response generator using APIs
async function getEnhancedClimateResponse(message) {
    const lowerMessage = message.toLowerCase();
    console.log(`Processing message: "${lowerMessage}"`); // Debug log
    
    try {
        // Location-specific weather queries (prioritize these)
        const locationMatch = lowerMessage.match(/weather in ([a-zA-Z\s]+)/);
        console.log(`Location match result:`, locationMatch); // Debug log
        
        if (locationMatch) {
            const location = locationMatch[1].trim();
            console.log(`Fetching weather for: ${location}`); // Debug log
            const weatherData = await climateAPI.getWeatherData(location);
            if (weatherData) {
                console.log(`Weather data received for: ${weatherData.location}`); // Debug log
                return `Current weather in ${weatherData.location}: ${weatherData.temperature}°C, ${weatherData.description}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.windSpeed} m/s. This data helps monitor local climate conditions and their impact on agriculture and daily life in Tanzania.`;
            }
        }

        // General weather-related queries
        if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
            // Default to Dar es Salaam for general weather queries
            const weatherData = await climateAPI.getWeatherData('Dar es Salaam');
            if (weatherData) {
                return `Current weather in ${weatherData.location}: ${weatherData.temperature}°C, ${weatherData.description}. Humidity: ${weatherData.humidity}%. This real-time data helps us understand local climate conditions and their impact on our environment.`;
            }
        }

        // Air quality queries
        if (lowerMessage.includes('air quality') || lowerMessage.includes('pollution')) {
            // Extract location or default to Dar es Salaam
            let location = 'Dar es Salaam';
            
            if (lowerMessage.includes('in ')) {
                const locationMatch = lowerMessage.match(/in ([a-zA-Z\s]+)/);
                if (locationMatch) {
                    location = locationMatch[1].trim();
                }
            }
            
            const airData = await climateAPI.getAirQuality(location);
            if (airData) {
                return `Current air quality in ${airData.location || location} is ${airData.quality} (AQI: ${airData.aqi}). Air pollution significantly impacts climate change and human health. You can help by using public transport, supporting clean energy, and reducing emissions.`;
            }
        }

        // CO2 and emissions queries
        if (lowerMessage.includes('co2') || lowerMessage.includes('carbon dioxide') || lowerMessage.includes('emissions')) {
            const co2Data = await climateAPI.getCO2Data();
            if (co2Data) {
                return `${co2Data.message || 'Current CO2 levels are critically high.'} CO2 is the primary greenhouse gas driving climate change. We can reduce emissions through renewable energy, energy efficiency, and sustainable transportation.`;
            }
        }

        // Renewable energy queries
        if (lowerMessage.includes('renewable') || lowerMessage.includes('solar') || lowerMessage.includes('wind energy')) {
            const renewableData = await climateAPI.getRenewableEnergyData();
            if (renewableData) {
                return `Global renewable energy capacity: ${renewableData.globalCapacity} with ${renewableData.growthRate} annual growth. Top sources: ${renewableData.topSources.join(', ')}. ${renewableData.message}`;
            }
        }

        // Climate facts queries
        if (lowerMessage.includes('fact') || lowerMessage.includes('did you know') || lowerMessage.includes('tell me something')) {
            const fact = await climateAPI.getClimateFacts();
            return `Climate Fact: ${fact} Would you like to know more about any specific climate topic?`;
        }

        // News and updates
        if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('updates')) {
            // Check if asking for East Africa specific news
            if (lowerMessage.includes('tanzania') || lowerMessage.includes('east africa') || lowerMessage.includes('kenya') || lowerMessage.includes('uganda')) {
                const news = await climateAPI.getEastAfricaClimateNews();
                if (news && news.length > 0) {
                    let response = "Here are the latest East Africa climate news updates:\n\n";
                    news.forEach((article, index) => {
                        response += `${index + 1}. ${article.title}\n${article.description}\n\n`;
                    });
                    return response;
                }
            } else {
                const news = await climateAPI.getClimateNews();
                if (news && news.length > 0) {
                    let response = "Here are the latest global climate news updates:\n\n";
                    news.forEach((article, index) => {
                        response += `${index + 1}. ${article.title}\n${article.description}\n\n`;
                    });
                    return response;
                }
            }
        }

        // Tanzania-specific climate information
        if (lowerMessage.includes('tanzania') || lowerMessage.includes('kilimanjaro') || lowerMessage.includes('serengeti')) {
            const tanzaniaData = await climateAPI.getTanzaniaClimateData();
            if (tanzaniaData) {
                let response = "Tanzania Climate Overview:\n\n";
                response += `${tanzaniaData.climateInfo.seasons}\n`;
                response += `${tanzaniaData.climateInfo.temperature}\n`;
                response += `${tanzaniaData.climateInfo.rainfall}\n`;
                response += `Climate Challenges: ${tanzaniaData.climateInfo.challenges}\n\n`;
                
                if (tanzaniaData.cities.length > 0) {
                    response += "Current weather in major cities:\n";
                    tanzaniaData.cities.forEach(city => {
                        response += `• ${city.location}: ${city.temperature}°C, ${city.description}\n`;
                    });
                }
                return response;
            }
        }

        // East Africa regional queries
        if (lowerMessage.includes('east africa') || lowerMessage.includes('kenya') || lowerMessage.includes('uganda')) {
            return "East Africa faces unique climate challenges including variable rainfall, droughts, and floods. The region has significant renewable energy potential, especially solar and geothermal. Countries like Kenya lead in geothermal energy, while Tanzania has vast solar potential. Would you like specific information about any country?";
        }

        // Specific Tanzanian cities weather queries
        if (lowerMessage.includes('dar es salaam') || lowerMessage.includes('dodoma') || lowerMessage.includes('arusha') || lowerMessage.includes('mwanza') || lowerMessage.includes('zanzibar')) {
            const cityName = lowerMessage.includes('dar es salaam') ? 'Dar es Salaam' :
                           lowerMessage.includes('dodoma') ? 'Dodoma' :
                           lowerMessage.includes('arusha') ? 'Arusha' :
                           lowerMessage.includes('mwanza') ? 'Mwanza' : 'Zanzibar';
            
            const weatherData = await climateAPI.getWeatherData(cityName);
            if (weatherData) {
                return `Current conditions in ${weatherData.location}: ${weatherData.temperature}°C, ${weatherData.description}. Humidity: ${weatherData.humidity}%. This coastal/inland location experiences ${cityName === 'Dar es Salaam' || cityName === 'Zanzibar' ? 'tropical coastal' : 'highland/inland'} climate patterns.`;
            }
        }

    } catch (error) {
        console.error('API service error:', error);
    }

    // Fallback to knowledge base for other queries
    return getKnowledgeBaseResponse(message);
}

// Fallback knowledge base for non-API queries with Tanzania focus
function getKnowledgeBaseResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const responses = {
        'climate change': "Climate change significantly affects Tanzania through changing rainfall patterns, rising temperatures, and sea-level rise. Tanzania is vulnerable due to its dependence on rain-fed agriculture and coastal location.",
        'agriculture': "Tanzania's agriculture employs 65% of the population and contributes 25% to GDP. Climate change affects crop yields, with maize, rice, and coffee being particularly vulnerable to temperature and rainfall changes.",
        'drought': "Tanzania experiences frequent droughts, especially in central and northern regions. The 2016-2017 drought affected over 1.4 million people. Early warning systems and drought-resistant crops are being developed.",
        'flooding': "Coastal areas and river basins in Tanzania face increased flooding risks. Dar es Salaam is particularly vulnerable to sea-level rise and extreme rainfall events.",
        'renewable energy': "Tanzania has excellent renewable energy potential: abundant solar radiation, wind resources along the coast and highlands, geothermal in the Rift Valley, and significant hydropower capacity.",
        'solar energy': "Tanzania receives 4-7 kWh/m²/day of solar radiation, making solar power highly viable. The government aims to increase renewable energy access, especially in rural areas.",
        'hydropower': "Tanzania generates about 35% of electricity from hydropower, mainly from the Rufiji River. However, droughts can significantly reduce generation capacity.",
        'deforestation': "Tanzania loses about 400,000 hectares of forest annually due to agriculture expansion, charcoal production, and logging. This affects carbon storage and biodiversity.",
        'conservation': "Tanzania hosts 38% of East Africa's wildlife and has established numerous national parks and conservation areas. Climate change threatens ecosystems like the Serengeti.",
        'adaptation': "Tanzania's climate adaptation strategies include drought-resistant crops, improved water management, coastal protection, and early warning systems for extreme weather.",
        'mitigation': "Tanzania aims to reduce emissions by 30-35% by 2030 through renewable energy expansion, forest conservation, and sustainable agriculture practices.",
        'carbon footprint': "In Tanzania, reduce your carbon footprint by: using solar energy, efficient cookstoves, public transport, supporting reforestation, and practicing sustainable agriculture.",
        'sustainable living': "Sustainable living in Tanzania includes: rainwater harvesting, solar cooking, organic farming, waste reduction, supporting local products, and forest conservation.",
        'initiatives': "Join climate initiatives in Tanzania: tree planting programs, clean energy projects, sustainable agriculture training, coastal conservation, and community-based adaptation projects."
    };
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return "I'm your Climate Assistant focused on Tanzania and East Africa! I can provide real-time weather data for Tanzanian cities, air quality information, regional climate news, and answer questions about climate change impacts and solutions in Tanzania. What would you like to know?";
}

router.post('/ask', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Generate enhanced climate-aware response using APIs
        const reply = await getEnhancedClimateResponse(message);
        
        res.json({ reply });
    } catch (error) {
        console.error('Error processing chatbot request:', error);
        res.status(500).json({ error: 'Failed to get a response from the chatbot.' });
    }
});

module.exports = router;
