const express = require('express');
const router = express.Router();
const { uploadImage, uploadImages, deleteImage, uploadFile, uploadVideo } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/image', protect, uploadImage);
router.post('/images', protect, uploadImages);
router.post('/video', protect, uploadVideo);
router.post('/file', protect, uploadFile);
router.delete('/image', protect, deleteImage);

module.exports = router;
