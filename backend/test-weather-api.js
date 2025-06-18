const axios = require('axios');

async function testWeatherAPI() {
    const apiKey = '918101f82e84a81763f5c8a1e07285da';
    console.log('🌤️ Testing OpenWeatherMap API...');
    
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Dar es Salaam,TZ&appid=${apiKey}&units=metric`);
        
        console.log('✅ API Key is working!');
        console.log('📍 Location:', response.data.name);
        console.log('🌡️ Temperature:', response.data.main.temp + '°C');
        console.log('☁️ Weather:', response.data.weather[0].description);
        console.log('💨 Wind Speed:', response.data.wind.speed + ' m/s');
        console.log('💧 Humidity:', response.data.main.humidity + '%');
        
        return true;
    } catch (error) {
        console.log('❌ API Error:', error.response?.status);
        console.log('💬 Message:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 401) {
            console.log('🔑 The API key appears to be invalid or expired');
            console.log('🔗 Please check: https://openweathermap.org/api');
        }
        
        return false;
    }
}

testWeatherAPI();