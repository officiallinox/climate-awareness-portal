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

// Activities CRUD
router.get('/activities', controller.getUserActivities);
router.post('/activities', controller.createActivity);
router.put('/activities/:id', controller.updateActivity);
router.delete('/activities/:id', controller.deleteActivity);

// Comments CRUD
router.get('/comments', controller.getUserComments);
router.post('/comments', controller.createComment);
router.put('/comments/:id', controller.updateComment);
router.delete('/comments/:id', controller.deleteComment);

// Save dashboard data (bulk save for offline sync)
router.post('/sync', controller.syncDashboardData);

module.exports = router;