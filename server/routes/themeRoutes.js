const express = require('express');
const router = express.Router();
const { getTheme, updateTheme, update3D, resetTheme } = require('../controllers/themeController');
const { protect } = require('../middleware/auth');

router.get('/', getTheme);
router.put('/', protect, updateTheme);
router.put('/3d', protect, update3D);
router.post('/reset', protect, resetTheme);

module.exports = router;
