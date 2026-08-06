const express = require('express');
const router = express.Router();
const { trackView, getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Public route to track views
router.post('/track', trackView);

// Admin protected route to get analytics data
router.get('/', protect, getAnalytics);

module.exports = router;
