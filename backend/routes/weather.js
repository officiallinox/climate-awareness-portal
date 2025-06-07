const express = require('express');
const router = express.Router();
const axios = require('axios');
const weatherController = require('../controllers/weatherController');

const apiKey = process.env.OPENWEATHERMAP_API_KEY || 'demo_key';

// Enhanced current weather endpoint with better error handling and data formatting
router.get('/current', async (req, res) => {
    const { city, country = 'TZ' } = req.query; // Default to Tanzania
    
    if (!city) {
        return res.status(400).json({ 
            error: 'City parameter is required',
            message: 'Please provide a city name'
        });
    }

    try {
        console.log(`[Weather API] Fetching weather for: ${city}, ${country}`);
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${country}&appid=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);
        
        // Format the response for our frontend
        const weatherData = {
            location: response.data.name,
            country: response.data.sys.country,
            temperature: Math.round(response.data.main.temp),
            feelsLike: Math.round(response.data.main.feels_like),
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            windSpeed: Math.round(response.data.wind.speed * 10) / 10,
            windDirection: response.data.wind.deg,
            visibility: Math.round((response.data.visibility || 10000) / 1000),
            cloudiness: response.data.clouds.all,
            sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
            timestamp: new Date().toISOString(),
            coordinates: {
                lat: response.data.coord.lat,
                lon: response.data.coord.lon
            }
        };
        
        console.log(`[Weather API] Success for ${weatherData.location}: ${weatherData.temperature}°C`);
        res.json(weatherData);
        
    } catch (error) {
        console.error(`[Weather API] Error fetching weather for ${city}:`, error.message);
        
        // Provide fallback data for Tanzania cities
        if (error.response?.status === 404 || apiKey === 'demo_key') {
            const fallbackData = generateTanzaniaFallbackWeather(city);
            console.log(`[Weather API] Using fallback data for ${city}`);
            res.json(fallbackData);
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch weather data',
                message: `Unable to get weather information for ${city}`,
                fallback: generateTanzaniaFallbackWeather(city)
            });
        }
    }
});

// Generate realistic fallback weather data for Tanzania cities
function generateTanzaniaFallbackWeather(city) {
    const cityName = city.toLowerCase();
    
    // Base temperatures for different Tanzania regions
    let baseTemp = 25; // Default
    let humidity = 70;
    let description = 'partly cloudy';
    
    // Coastal cities (warmer, more humid)
    if (cityName.includes('dar es salaam') || cityName.includes('zanzibar') || cityName.includes('tanga')) {
        baseTemp = 28;
        humidity = 80;
        description = 'humid and warm';
    }
    // Highland cities (cooler)
    else if (cityName.includes('arusha') || cityName.includes('mbeya') || cityName.includes('iringa')) {
        baseTemp = 20;
        humidity = 60;
        description = 'mild and pleasant';
    }
    // Lake zone cities
    else if (cityName.includes('mwanza') || cityName.includes('musoma')) {
        baseTemp = 26;
        humidity = 75;
        description = 'warm with lake breeze';
    }
    // Central plateau
    else if (cityName.includes('dodoma') || cityName.includes('tabora')) {
        baseTemp = 24;
        humidity = 55;
        description = 'dry and warm';
    }
    
    // Add some realistic variation
    const tempVariation = (Math.random() - 0.5) * 4;
    const humidityVariation = (Math.random() - 0.5) * 20;
    
    return {
        location: city,
        country: 'TZ',
        temperature: Math.round(baseTemp + tempVariation),
        feelsLike: Math.round(baseTemp + tempVariation + 2),
        description: description,
        humidity: Math.max(30, Math.min(95, Math.round(humidity + humidityVariation))),
        pressure: Math.round(1010 + (Math.random() - 0.5) * 20),
        windSpeed: Math.round((5 + Math.random() * 10) * 10) / 10,
        windDirection: Math.round(Math.random() * 360),
        visibility: Math.round(8 + Math.random() * 7),
        cloudiness: Math.round(Math.random() * 80),
        sunrise: '06:30:00',
        sunset: '18:45:00',
        timestamp: new Date().toISOString(),
        coordinates: getTanzaniaCityCoordinates(city),
        fallback: true
    };
}

// Get coordinates for Tanzania cities
function getTanzaniaCityCoordinates(city) {
    const coordinates = {
        'dar es salaam': { lat: -6.7924, lon: 39.2083 },
        'dodoma': { lat: -6.1630, lon: 35.7516 },
        'arusha': { lat: -3.3869, lon: 36.6830 },
        'mwanza': { lat: -2.5164, lon: 32.9175 },
        'zanzibar': { lat: -6.1659, lon: 39.2026 },
        'mbeya': { lat: -8.9094, lon: 33.4607 },
        'morogoro': { lat: -6.8235, lon: 37.6536 },
        'tabora': { lat: -5.0169, lon: 32.8333 },
        'kigoma': { lat: -4.8765, lon: 29.6269 },
        'iringa': { lat: -7.7669, lon: 35.6975 },
        'songea': { lat: -10.6839, lon: 35.6503 },
        'musoma': { lat: -1.5000, lon: 33.8000 }
    };
    
    const cityKey = city.toLowerCase();
    return coordinates[cityKey] || { lat: -6.369028, lon: 34.888822 }; // Default to Tanzania center
}

// Enhanced forecast endpoint
router.get('/forecast', async (req, res) => {
    const { city, country = 'TZ', days = 5 } = req.query;
    
    if (!city) {
        return res.status(400).json({ 
            error: 'City parameter is required',
            message: 'Please provide a city name'
        });
    }

    try {
        console.log(`[Weather API] Fetching forecast for: ${city}, ${country}`);
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},${country}&appid=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);
        
        // Format forecast data
        const forecastData = {
            location: response.data.city.name,
            country: response.data.city.country,
            coordinates: response.data.city.coord,
            forecasts: response.data.list.slice(0, days * 8).map(item => ({
                datetime: new Date(item.dt * 1000).toISOString(),
                date: new Date(item.dt * 1000).toLocaleDateString(),
                time: new Date(item.dt * 1000).toLocaleTimeString(),
                temperature: Math.round(item.main.temp),
                feelsLike: Math.round(item.main.feels_like),
                description: item.weather[0].description,
                humidity: item.main.humidity,
                windSpeed: Math.round(item.wind.speed * 10) / 10,
                cloudiness: item.clouds.all,
                precipitation: item.rain ? item.rain['3h'] || 0 : 0
            })),
            timestamp: new Date().toISOString()
        };
        
        console.log(`[Weather API] Forecast success for ${forecastData.location}: ${forecastData.forecasts.length} entries`);
        res.json(forecastData);
        
    } catch (error) {
        console.error(`[Weather API] Error fetching forecast for ${city}:`, error.message);
        
        if (error.response?.status === 404 || apiKey === 'demo_key') {
            const fallbackForecast = generateTanzaniaFallbackForecast(city, days);
            console.log(`[Weather API] Using fallback forecast for ${city}`);
            res.json(fallbackForecast);
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch forecast data',
                message: `Unable to get forecast for ${city}`
            });
        }
    }
});

// Generate fallback forecast data
function generateTanzaniaFallbackForecast(city, days) {
    const baseWeather = generateTanzaniaFallbackWeather(city);
    const forecasts = [];
    
    for (let i = 0; i < days * 8; i++) {
        const date = new Date();
        date.setHours(date.getHours() + i * 3); // 3-hour intervals
        
        // Add some variation to the base weather
        const tempVariation = (Math.random() - 0.5) * 6;
        const humidityVariation = (Math.random() - 0.5) * 20;
        
        forecasts.push({
            datetime: date.toISOString(),
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            temperature: Math.round(baseWeather.temperature + tempVariation),
            feelsLike: Math.round(baseWeather.feelsLike + tempVariation),
            description: baseWeather.description,
            humidity: Math.max(30, Math.min(95, Math.round(baseWeather.humidity + humidityVariation))),
            windSpeed: Math.round((baseWeather.windSpeed + (Math.random() - 0.5) * 5) * 10) / 10,
            cloudiness: Math.round(Math.random() * 80),
            precipitation: Math.random() > 0.8 ? Math.round(Math.random() * 5 * 10) / 10 : 0
        });
    }
    
    return {
        location: city,
        country: 'TZ',
        coordinates: baseWeather.coordinates,
        forecasts: forecasts,
        timestamp: new Date().toISOString(),
        fallback: true
    };
}

// Tanzania-specific weather overview endpoint
router.get('/tanzania-overview', async (req, res) => {
    try {
        console.log('[Weather API] Fetching Tanzania weather overview');
        
        const tanzaniaCities = [
            'Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 
            'Zanzibar', 'Mbeya', 'Morogoro', 'Tabora'
        ];
        
        const weatherPromises = tanzaniaCities.map(async (city) => {
            try {
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},TZ&appid=${apiKey}&units=metric`;
                const response = await axios.get(apiUrl);
                
                return {
                    city: response.data.name,
                    temperature: Math.round(response.data.main.temp),
                    description: response.data.weather[0].description,
                    humidity: response.data.main.humidity,
                    windSpeed: Math.round(response.data.wind.speed * 10) / 10,
                    coordinates: response.data.coord
                };
            } catch (error) {
                console.warn(`[Weather API] Fallback for ${city}:`, error.message);
                const fallback = generateTanzaniaFallbackWeather(city);
                return {
                    city: city,
                    temperature: fallback.temperature,
                    description: fallback.description,
                    humidity: fallback.humidity,
                    windSpeed: fallback.windSpeed,
                    coordinates: fallback.coordinates,
                    fallback: true
                };
            }
        });
        
        const results = await Promise.all(weatherPromises);
        
        // Calculate overview statistics
        const avgTemp = Math.round(results.reduce((sum, city) => sum + city.temperature, 0) / results.length);
        const avgHumidity = Math.round(results.reduce((sum, city) => sum + city.humidity, 0) / results.length);
        const avgWindSpeed = Math.round(results.reduce((sum, city) => sum + city.windSpeed, 0) / results.length * 10) / 10;
        
        const overview = {
            country: 'Tanzania',
            timestamp: new Date().toISOString(),
            summary: {
                averageTemperature: avgTemp,
                averageHumidity: avgHumidity,
                averageWindSpeed: avgWindSpeed,
                totalCities: results.length
            },
            cities: results,
            climateZones: {
                coastal: results.filter(city => ['Dar es Salaam', 'Zanzibar'].includes(city.city)),
                highland: results.filter(city => ['Arusha', 'Mbeya'].includes(city.city)),
                central: results.filter(city => ['Dodoma', 'Tabora'].includes(city.city)),
                lake: results.filter(city => ['Mwanza'].includes(city.city))
            }
        };
        
        console.log(`[Weather API] Tanzania overview success: ${results.length} cities, avg temp ${avgTemp}°C`);
        res.json(overview);
        
    } catch (error) {
        console.error('[Weather API] Error fetching Tanzania overview:', error);
        res.status(500).json({ 
            error: 'Failed to fetch Tanzania weather overview',
            message: 'Unable to get comprehensive weather data for Tanzania'
        });
    }
});

// Air quality endpoint for Tanzania cities
router.get('/air-quality', async (req, res) => {
    const { city, country = 'TZ' } = req.query;
    
    if (!city) {
        return res.status(400).json({ 
            error: 'City parameter is required',
            message: 'Please provide a city name'
        });
    }

    try {
        console.log(`[Weather API] Fetching air quality for: ${city}`);
        
        // First get coordinates
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${country}&limit=1&appid=${apiKey}`;
        const geoResponse = await axios.get(geoUrl);
        
        if (geoResponse.data.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon } = geoResponse.data[0];
        
        // Get air quality data
        const aqUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const aqResponse = await axios.get(aqUrl);
        
        const data = aqResponse.data.list[0];
        const aqi = data.main.aqi;
        const aqiLevels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
        
        const airQualityData = {
            location: city,
            country: country,
            coordinates: { lat, lon },
            aqi: aqi,
            quality: aqiLevels[aqi - 1] || 'Unknown',
            components: {
                co: data.components.co,
                no2: data.components.no2,
                o3: data.components.o3,
                pm2_5: data.components.pm2_5,
                pm10: data.components.pm10,
                so2: data.components.so2
            },
            timestamp: new Date().toISOString()
        };
        
        console.log(`[Weather API] Air quality success for ${city}: AQI ${aqi} (${airQualityData.quality})`);
        res.json(airQualityData);
        
    } catch (error) {
        console.error(`[Weather API] Error fetching air quality for ${city}:`, error.message);
        
        // Provide fallback air quality data
        const fallbackAQ = {
            location: city,
            country: country,
            coordinates: getTanzaniaCityCoordinates(city),
            aqi: Math.floor(Math.random() * 3) + 1, // 1-3 (Good to Moderate)
            quality: ['Good', 'Fair', 'Moderate'][Math.floor(Math.random() * 3)],
            components: {
                co: Math.round(200 + Math.random() * 100),
                no2: Math.round(10 + Math.random() * 20),
                o3: Math.round(50 + Math.random() * 30),
                pm2_5: Math.round(5 + Math.random() * 15),
                pm10: Math.round(10 + Math.random() * 20),
                so2: Math.round(5 + Math.random() * 10)
            },
            timestamp: new Date().toISOString(),
            fallback: true
        };
        
        res.json(fallbackAQ);
    }
});

router.post('/weather-predictions', weatherController.createPrediction);
router.get('/weather-predictions', weatherController.getPredictions);
router.get('/weather-predictions/export', weatherController.exportPredictions);

module.exports = router;
