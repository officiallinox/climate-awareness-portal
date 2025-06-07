const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(authMiddleware);

// Get dashboard data
router.get('/', controller.getDashboardData);

// Get user profile
router.get('/profile', controller.getUserProfile);

// Update user profile
router.put('/profile', controller.updateUserProfile);

// Get user statistics
router.get('/stats', controller.getUserStats);

module.exports = router;