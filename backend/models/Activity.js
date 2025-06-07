const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['outdoor', 'indoor', 'sports', 'travel', 'work'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    weather: {
        temperature: Number,
        description: String,
        humidity: Number,
        windSpeed: Number,
        pressure: Number
    },
    location: {
        type: String,
        default: 'Dar es Salaam'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
activitySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);