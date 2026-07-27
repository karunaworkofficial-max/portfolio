const express = require('express');
const router = express.Router();
const { getSiteContent, updateSiteContent } = require('../controllers/siteContentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSiteContent)
  .put(protect, updateSiteContent);

module.exports = router;
