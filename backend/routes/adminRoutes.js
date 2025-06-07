const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Dashboard statistics
router.get('/dashboard-stats', authMiddleware, adminOnly, userController.getDashboardStats);

// Admin user management routes
router.get('/users', authMiddleware, adminOnly, userController.getUsers);
router.get('/users/:id', authMiddleware, adminOnly, userController.getUserById);
router.put('/users/:id', authMiddleware, adminOnly, userController.updateUser);
router.delete('/users/:id', authMiddleware, adminOnly, userController.deleteUser);

// Admin activities management routes
router.get('/activities', authMiddleware, adminOnly, userController.getAllActivities);
router.delete('/activities/:activityId', authMiddleware, adminOnly, userController.deleteActivityAdmin);

// Admin comments management routes
router.get('/comments', authMiddleware, adminOnly, userController.getAllComments);
router.delete('/comments/:commentId', authMiddleware, adminOnly, userController.deleteCommentAdmin);
router.put('/comments/:commentId', authMiddleware, adminOnly, userController.updateCommentAdmin);

module.exports = router;