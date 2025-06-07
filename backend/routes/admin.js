const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const Initiative = require('../models/Initiative');
const Article = require('../models/Article');

const router = express.Router();

router.post('/initiatives', authMiddleware, adminOnly, async (req, res) => {
  // create initiative
});

router.post('/articles', authMiddleware, adminOnly, async (req, res) => {
  // create article
});

module.exports = router;
