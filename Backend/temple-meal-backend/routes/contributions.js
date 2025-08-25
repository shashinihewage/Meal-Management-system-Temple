const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getContributions, addContribution } = require('../controllers/contributionController');

// Protect all contribution routes - user must be authenticated
router.use(authMiddleware);

// GET /api/contributions - get all contributions for the logged-in user (example)
router.get('/', getContributions);

// POST /api/contributions - add a new contribution by the logged-in user
router.post('/', addContribution);

module.exports = router;
