const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { generateFallbackArticles } = require('../utils/fallbackData');

// Get all articles with pagination, filtering, and sorting
exports.getAllArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Build query based on filters
        const query = { status: 'published' };
        
        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }
        
        // Tag filter
        if (req.query.tag) {
            query.tags = req.query.tag;
        }
        
        // Search by title or content
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { summary: searchRegex }
            ];
        }
        
        // Featured articles
        if (req.query.featured === 'true') {
            query.featured = true;
        }
        
        // Sort options
        let sortOption = { createdAt: -1 }; // Default: newest first
        
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'popular':
                    sortOption = { viewCount: -1 };
                    break;
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                case 'a-z':
                    sortOption = { title: 1 };
                    break;
                case 'z-a':
                    sortOption = { title: -1 };
                    break;
            }
        }
        
        // Execute query with pagination
        const articles = await Article.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('author', 'name avatar')
            .lean();
        
        // Get total count for pagination
        const totalArticles = await Article.countDocuments(query);
        
        // Calculate total pages
        const totalPages = Math.ceil(totalArticles / limit);
        
        // Format the response data
        const formattedArticles = articles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate
            };
        });
        
        res.json({
            articles: formattedArticles,
            pagination: {
                currentPage: page,
                totalPages,
                totalArticles,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        console.log('Using fallback article data');
        // Use fallback data instead of returning an error
        const fallbackArticles = generateFallbackArticles();
        res.json({ articles: fallbackArticles });
    }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find article and increment view count
        const article = await Article.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        )
        .populate('author', 'name avatar bio')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name avatar'
            },
            options: { sort: { createdAt: -1 } }
        })
        .populate('relatedArticles', 'title slug featuredImage summary')
        .lean();
        
        if (!article) {
            // Generate a fallback article if not found
            const fallbackArticle = generateSingleFallbackArticle(id);
            return res.json(fallbackArticle);
        }
        
        // Format dates
        const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get related articles by category if not already populated
        let relatedArticles = article.relatedArticles;
        if (!relatedArticles || relatedArticles.length === 0) {
            relatedArticles = await Article.find({
                category: article.category,
                _id: { $ne: article._id },
                status: 'published'
            })
            .select('title slug featuredImage summary')
            .limit(3)
            .lean();
        }
        
        res.json({
            ...article,
            createdAtFormatted: createdDate,
            relatedArticles
        });
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        // Generate a fallback article if there's an error
        const fallbackArticle = generateSingleFallbackArticle(req.params.id);
        res.json(fallbackArticle);
    }
};

// Generate a single fallback article
function generateSingleFallbackArticle(id) {
    const categories = ['climate-science', 'sustainability', 'renewable-energy', 'conservation', 'policy'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const date = new Date();
    
    return {
        _id: id,
        title: `Article about ${category.replace('-', ' ')}`,
        slug: `article-about-${category}`,
        summary: `This is a sample article about ${category.replace('-', ' ')}. It provides an overview of key concepts and recent developments.`,
        content: `
            <h2>Introduction to ${category.replace('-', ' ')}</h2>
            <p>This is a sample article about ${category.replace('-', ' ')}. The actual article content could not be loaded, so we're showing this placeholder content instead.</p>
            
            <p>Climate change is one of the most pressing challenges of our time. It affects every country and every person on our planet. The effects of climate change are already visible and will become more dramatic over time.</p>
            
            <h2>Key Points</h2>
            <ul>
                <li>Global temperatures have increased by about 1°C since pre-industrial times</li>
                <li>Sea levels are rising at an accelerating rate</li>
                <li>Extreme weather events are becoming more frequent and intense</li>
                <li>Many species are at risk of extinction due to changing habitats</li>
            </ul>
            
            <h2>What Can We Do?</h2>
            <p>There are many actions we can take to combat climate change:</p>
            <ol>
                <li>Reduce our carbon footprint by using renewable energy</li>
                <li>Conserve forests and plant trees to absorb CO2</li>
                <li>Adopt sustainable farming practices</li>
                <li>Reduce waste and increase recycling</li>
                <li>Support policies that address climate change</li>
            </ol>
            
            <p>By working together, we can make a difference and create a more sustainable future for all.</p>
        `,
        category: category,
        featuredImage: `/images/default-${category}.jpg`,
        createdAt: date,
        viewCount: Math.floor(Math.random() * 500) + 50,
        readTime: Math.floor(Math.random() * 10) + 3,
        author: {
            _id: 'fallback-author',
            name: 'ClimAware Team',
            avatar: '/images/default-avatar.jpg'
        },
        createdAtFormatted: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        relatedArticles: Array.from({ length: 3 }, (_, i) => {
            const relCategory = categories[Math.floor(Math.random() * categories.length)];
            return {
                _id: `fallback-related-${i}`,
                title: `Related article about ${relCategory.replace('-', ' ')}`,
                slug: `related-article-${i}`,
                summary: `This is a related article about ${relCategory.replace('-', ' ')}.`,
                featuredImage: `/images/default-${relCategory}.jpg`
            };
        }),
        fallback: true
    };
}

// Get a single article by slug
exports.getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Find article and increment view count
        const article = await Article.findOneAndUpdate(
            { slug, status: 'published' },
            { $inc: { viewCount: 1 } },
            { new: true }
        )
        .populate('author', 'name avatar bio')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name avatar'
            },
            options: { sort: { createdAt: -1 } }
        })
        .populate('relatedArticles', 'title slug featuredImage summary')
        .lean();
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        // Format dates
        const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get related articles by category if not already populated
        let relatedArticles = article.relatedArticles;
        if (!relatedArticles || relatedArticles.length === 0) {
            relatedArticles = await Article.find({
                category: article.category,
                _id: { $ne: article._id },
                status: 'published'
            })
            .select('title slug featuredImage summary')
            .limit(3)
            .lean();
        }
        
        res.json({
            ...article,
            createdAtFormatted: createdDate,
            relatedArticles
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ message: 'Error fetching article', error: error.message });
    }
};

// Create a new article
exports.createArticle = async (req, res) => {
    try {
        const { title, content, summary, category, tags, featuredImage, sources, metaDescription, metaKeywords } = req.body;
        
        // Validate required fields
        if (!title || !content || !summary) {
            return res.status(400).json({ message: 'Title, content, and summary are required' });
        }
        
        // Get author from authenticated user
        const authorId = req.user.id;
        
        // Create new article
        const newArticle = new Article({
            title,
            content,
            summary,
            author: authorId,
            category: category || 'climate-science',
            tags: tags || [],
            featuredImage,
            sources: sources || [],
            metaDescription,
            metaKeywords
        });
        
        // Save article
        await newArticle.save();
        
        res.status(201).json({
            message: 'Article created successfully',
            article: newArticle
        });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ message: 'Error creating article', error: error.message });
    }
};

// Update an article
exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Find article
        const article = await Article.findById(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        // Check if user is the author or admin
        if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this article' });
        }
        
        // Update article
        Object.keys(updates).forEach(key => {
            article[key] = updates[key];
        });
        
        // Save updated article
        await article.save();
        
        res.json({
            message: 'Article updated successfully',
            article
        });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ message: 'Error updating article', error: error.message });
    }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find article
        const article = await Article.findById(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        // Check if user is the author or admin
        if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this article' });
        }
        
        // Delete article
        await Article.findByIdAndDelete(id);
        
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ message: 'Error deleting article', error: error.message });
    }
};

// Like an article
exports.likeArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Find article
        const article = await Article.findById(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        // Check if user already liked the article
        const alreadyLiked = article.likes.some(like => like.user.toString() === userId);
        
        if (alreadyLiked) {
            // Unlike the article
            article.likes = article.likes.filter(like => like.user.toString() !== userId);
            article.likeCount = article.likes.length;
        } else {
            // Like the article
            article.likes.push({ user: userId });
            article.likeCount = article.likes.length;
        }
        
        // Save article
        await article.save();
        
        res.json({
            message: alreadyLiked ? 'Article unliked' : 'Article liked',
            liked: !alreadyLiked,
            likeCount: article.likeCount
        });
    } catch (error) {
        console.error('Error liking article:', error);
        res.status(500).json({ message: 'Error liking article', error: error.message });
    }
};

// Add a comment to an article
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        
        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }
        
        // Find article
        const article = await Article.findById(id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        // Create new comment
        const newComment = new Comment({
            content,
            user: userId,
            article: id
        });
        
        // Save comment
        await newComment.save();
        
        // Add comment to article
        article.comments.push(newComment._id);
        await article.save();
        
        // Populate user info
        await newComment.populate('user', 'name avatar');
        
        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

// Get featured articles for homepage
exports.getFeaturedArticles = async (req, res) => {
    try {
        const featuredArticles = await Article.find({ 
            featured: true,
            status: 'published'
        })
        .select('title slug summary featuredImage category createdAt readTime')
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();
        
        // Format the response data
        const formattedArticles = featuredArticles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate
            };
        });
        
        res.json(formattedArticles);
    } catch (error) {
        console.error('Error fetching featured articles:', error);
        res.status(500).json({ message: 'Error fetching featured articles', error: error.message });
    }
};

// Get recent articles
exports.getRecentArticles = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        const recentArticles = await Article.find({ status: 'published' })
            .select('title slug summary featuredImage category createdAt readTime')
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        
        // Format the response data
        const formattedArticles = recentArticles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate
            };
        });
        
        res.json(formattedArticles);
    } catch (error) {
        console.error('Error fetching recent articles:', error);
        res.status(500).json({ message: 'Error fetching recent articles', error: error.message });
    }
};

// Get popular articles
exports.getPopularArticles = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        const popularArticles = await Article.find({ status: 'published' })
            .select('title slug summary featuredImage category createdAt viewCount readTime')
            .populate('author', 'name avatar')
            .sort({ viewCount: -1 })
            .limit(limit)
            .lean();
        
        // Format the response data
        const formattedArticles = popularArticles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate
            };
        });
        
        res.json(formattedArticles);
    } catch (error) {
        console.error('Error fetching popular articles:', error);
        res.status(500).json({ message: 'Error fetching popular articles', error: error.message });
    }
};

// Get articles by category
exports.getArticlesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const articles = await Article.find({ 
            category,
            status: 'published'
        })
        .select('title slug summary featuredImage category createdAt readTime')
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
        // Get total count for pagination
        const totalArticles = await Article.countDocuments({ 
            category,
            status: 'published'
        });
        
        // Calculate total pages
        const totalPages = Math.ceil(totalArticles / limit);
        
        // Format the response data
        const formattedArticles = articles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate
            };
        });
        
        res.json({
            articles: formattedArticles,
            pagination: {
                currentPage: page,
                totalPages,
                totalArticles,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching articles by category:', error);
        res.status(500).json({ message: 'Error fetching articles by category', error: error.message });
    }
};

// Get articles by tag
exports.getArticlesByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const articles = await Article.find({ 
            tags: tag,
            status: 'published'
        })
        .select('title slug summary featuredImage category createdAt tags readTime')
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
        // Get total count for pagination
        const totalArticles = await Article.countDocuments({ 
            tags: tag,
            status: 'published'
        });
        
        // Calculate total pages
        const totalPages = Math.ceil(totalArticles / limit);
        
        // Format the response data
        const formattedArticles = articles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate
            };
        });
        
        res.json({
            articles: formattedArticles,
            pagination: {
                currentPage: page,
                totalPages,
                totalArticles,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching articles by tag:', error);
        res.status(500).json({ message: 'Error fetching articles by tag', error: error.message });
    }
};

// Get articles by author
exports.getArticlesByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Verify author exists
        const author = await User.findById(authorId).select('name avatar bio');
        
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        
        const articles = await Article.find({ 
            author: authorId,
            status: 'published'
        })
        .select('title slug summary featuredImage category createdAt readTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
        // Get total count for pagination
        const totalArticles = await Article.countDocuments({ 
            author: authorId,
            status: 'published'
        });
        
        // Calculate total pages
        const totalPages = Math.ceil(totalArticles / limit);
        
        // Format the response data
        const formattedArticles = articles.map(article => {
            // Format dates
            const createdDate = new Date(article.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return {
                ...article,
                createdAtFormatted: createdDate,
                author // Include author info with each article
            };
        });
        
        res.json({
            author,
            articles: formattedArticles,
            pagination: {
                currentPage: page,
                totalPages,
                totalArticles,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching articles by author:', error);
        res.status(500).json({ message: 'Error fetching articles by author', error: error.message });
    }
};