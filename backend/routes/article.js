const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/featured', articleController.getFeaturedArticles);
router.get('/recent', articleController.getRecentArticles);
router.get('/popular', articleController.getPopularArticles);
router.get('/category/:category', articleController.getArticlesByCategory);
router.get('/id/:id', articleController.getArticleById);
router.get('/:slug', articleController.getArticleBySlug);

// Protected routes
router.post('/', authMiddleware, articleController.createArticle);
router.put('/:id', authMiddleware, articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);
router.post('/:id/like', authMiddleware, articleController.likeArticle);
router.post('/:id/comment', authMiddleware, articleController.addComment);

module.exports = router;