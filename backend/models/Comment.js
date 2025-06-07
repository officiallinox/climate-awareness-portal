const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['observation', 'experience', 'tip', 'question', 'general'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
commentSchema.index({ userId: 1, createdAt: -1 });
commentSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);