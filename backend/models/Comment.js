const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    // Support both 'content' and 'text' for backward compatibility
    text: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'tip', 'experience', 'question', 'achievement', 'challenge'],
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

// Pre-save hook to handle both content and text fields
commentSchema.pre('save', function(next) {
    // If text is provided but not content, use text as content
    if (this.text && !this.content) {
        this.content = this.text;
    }
    // If content is provided but not text, use content as text for backward compatibility
    if (this.content && !this.text) {
        this.text = this.content;
    }
    next();
});

module.exports = mongoose.model('Comment', commentSchema);