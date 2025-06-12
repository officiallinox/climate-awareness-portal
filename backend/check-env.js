require('dotenv').config();

console.log('Environment Variables:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set (first 5 chars: ' + process.env.OPENAI_API_KEY.substring(0, 5) + '...)' : 'Not set');
console.log('OPENWEATHERMAP_API_KEY:', process.env.OPENWEATHERMAP_API_KEY ? 'Set' : 'Not set');
console.log('NEWS_API_KEY:', process.env.NEWS_API_KEY ? 'Set' : 'Not set');
console.log('AIR_QUALITY_API_KEY:', process.env.AIR_QUALITY_API_KEY ? 'Set' : 'Not set');