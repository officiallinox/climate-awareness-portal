const express = require('express');
const router = express.Router();
const controller = require('../controllers/initiativeController');
const { authMiddleware } = require('../middleware/auth');

// Public routes (no authentication required)
// Get all initiatives
router.get('/', controller.getInitiatives);

// Get initiative by ID
router.get('/:id', controller.getInitiativeById);

// Protected routes (authentication required)
// Create new initiative
router.post('/', authMiddleware, controller.createInitiative);

// Update initiative
router.put('/:id', authMiddleware, controller.updateInitiative);

// Delete initiative
router.delete('/:id', authMiddleware, controller.deleteInitiative);

// Join initiative
router.post('/:id/join', authMiddleware, controller.joinInitiative);

// Leave initiative
router.post('/:id/leave', authMiddleware, controller.leaveInitiative);

// Get user's initiatives (joined and organized)
router.get('/user/my-initiatives', authMiddleware, controller.getUserInitiatives);

module.exports = router;