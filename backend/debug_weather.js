// Debug weather API
const axios = require('axios');
require('dotenv').config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

async function testWeatherAPI() {
    console.log('API Key:', OPENWEATHER_API_KEY ? 'Present' : 'Missing');
    
    try {
        console.log('Testing with exact same call as chatbot...');
        
        // Test the exact same call that the chatbot makes
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: 'Dar es Salaam',
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
        
        console.log('Processed weather data:', result);
        
        // Test with London to see if API key is working
        const londonResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: 'London',
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });
        
        console.log('London weather for comparison:', {
            location: londonResponse.data.name,
            temperature: londonResponse.data.main.temp,
            description: londonResponse.data.weather[0].description
        });
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testWeatherAPI();