const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);

// Admin-only routes
router.post('/', authMiddleware, adminOnly, articleController.createArticle);
router.put('/:id', authMiddleware, adminOnly, articleController.updateArticle);
router.delete('/:id', authMiddleware, adminOnly, articleController.deleteArticle);

module.exports = router;
