const Article = require('../models/Article');

// GET all articles
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// GET a specific article by ID
exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: 'Cannot find article'
            });
        }
        res.json(article);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// POST a new article (Admin only)
exports.createArticle = async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

// PUT (update) a specific article by ID (Admin only)
exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: 'Cannot find article'
            });
        }
        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

// DELETE a specific article by ID (Admin only)
exports.deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: 'Cannot find article'
            });
        }
        res.json({
            message: 'Deleted Article'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
