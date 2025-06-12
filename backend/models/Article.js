const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['climate-science', 'sustainability', 'renewable-energy', 'conservation', 'policy', 'education'],
        default: 'climate-science'
    },
    tags: [{
        type: String,
        trim: true
    }],
    featuredImage: {
        type: String,
        default: '/images/default-article.jpg'
    },
    gallery: [{
        url: String,
        caption: String
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    viewCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    sources: [{
        title: String,
        url: String
    }],
    relatedArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    featured: {
        type: Boolean,
        default: false
    },
    readTime: {
        type: Number,
        default: 5 // in minutes
    },
    metaDescription: {
        type: String,
        trim: true
    },
    metaKeywords: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Generate slug from title before saving
articleSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // Calculate read time based on content length (average reading speed: 200 words per minute)
    if (this.isNew || this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }
    
    next();
});

// Virtual for comment count
articleSchema.virtual('commentCount').get(function() {
    return this.comments ? this.comments.length : 0;
});

// Indexes for better query performance
articleSchema.index({ category: 1, status: 1, createdAt: -1 });
articleSchema.index({ slug: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ featured: 1 });

module.exports = mongoose.model('Article', articleSchema);