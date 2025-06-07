const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// User dashboard routes (put these first to avoid conflicts)
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Note: Admin routes have been moved to /api/admin/* to avoid conflicts

// Activity routes
router.get('/activities', authMiddleware, userController.getUserActivities);
router.post('/activities', authMiddleware, userController.addUserActivity);
router.delete('/activities/:activityId', authMiddleware, userController.deleteUserActivity);

// Comments routes
router.get('/comments', authMiddleware, userController.getUserComments);
router.post('/comments', authMiddleware, userController.addUserComment);
router.delete('/comments/:commentId', authMiddleware, userController.deleteUserComment);

// Dashboard stats
router.get('/stats', authMiddleware, userController.getUserStats);

module.exports = router;