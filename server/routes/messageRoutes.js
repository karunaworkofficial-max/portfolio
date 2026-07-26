const express = require('express');
const router = express.Router();
const {
  submitMessage, getMessages, getStats, getMessage,
  toggleRead, toggleStar, toggleArchive, deleteMessage,
  deleteBulk, markBulkRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { contactFormLimiter } = require('../middleware/rateLimiter');

router.post('/', contactFormLimiter, submitMessage);

router.get('/', protect, getMessages);
router.get('/stats', protect, getStats);
router.get('/:id', protect, getMessage);
router.patch('/:id/read', protect, toggleRead);
router.patch('/:id/star', protect, toggleStar);
router.patch('/:id/archive', protect, toggleArchive);
router.delete('/:id', protect, deleteMessage);
router.delete('/bulk', protect, deleteBulk);
router.patch('/bulk/read', protect, markBulkRead);

module.exports = router;
