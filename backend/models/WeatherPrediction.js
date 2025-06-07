const mongoose = require('mongoose');

const weatherPredictionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    location: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    conditions: {
        type: String,
        enum: [
            'clear sky',
            'light rain',
            'moderate rain',
            'overcast clouds',
            'broken clouds',
            'few clouds',
            'scattered clouds',
            'shower rain',
            'thunderstorm',
            'snow',
            'mist'
        ],
        required: true,
    },
    forecast: [{
        date: { type: Date, required: true },
        temperature: { type: Number, required: true },
        conditions: {
            type: String,
            enum: [
                'clear sky',
                'light rain',
                'moderate rain',
                'overcast clouds',
                'broken clouds',
                'few clouds',
                'scattered clouds',
                'shower rain',
                'thunderstorm',
                'snow',
                'mist'
            ],
            required: true,
        }
    }]
});

module.exports = mongoose.model('WeatherPrediction', weatherPredictionSchema);
