const Message = require('../models/Message');
const asyncHandler = require('../middleware/asyncHandler');

exports.submitMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({ success: true, data: message, message: 'Message sent successfully' });
});

exports.getMessages = asyncHandler(async (req, res) => {
  const { filter, search, page = 1, limit = 10 } = req.query;
  let query = {};

  if (filter === 'unread') query.isRead = false;
  else if (filter === 'starred') query.isStarred = true;
  else if (filter === 'archived') query.isArchived = true;
  else if (filter === 'all') query.isArchived = false;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Message.countDocuments(query);
  const messages = await Message.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit));

  res.json({
    success: true,
    data: messages,
    message: 'Messages fetched successfully',
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

exports.getStats = asyncHandler(async (req, res) => {
  const total = await Message.countDocuments();
  const unread = await Message.countDocuments({ isRead: false });
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  const messagesToday = await Message.countDocuments({ createdAt: { $gte: today } });
  const messagesThisWeek = await Message.countDocuments({ createdAt: { $gte: thisWeek } });

  res.json({
    success: true,
    data: { total, unread, today: messagesToday, thisWeek: messagesThisWeek },
    message: 'Stats fetched successfully'
  });
});

exports.getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json({ success: true, data: message, message: 'Message fetched successfully' });
});

exports.toggleRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) { res.status(404); throw new Error('Message not found'); }
  message.isRead = !message.isRead;
  await message.save();
  res.json({ success: true, data: message, message: 'Read status toggled' });
});

exports.toggleStar = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) { res.status(404); throw new Error('Message not found'); }
  message.isStarred = !message.isStarred;
  await message.save();
  res.json({ success: true, data: message, message: 'Star status toggled' });
});

exports.toggleArchive = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) { res.status(404); throw new Error('Message not found'); }
  message.isArchived = !message.isArchived;
  await message.save();
  res.json({ success: true, data: message, message: 'Archive status toggled' });
});

exports.deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) { res.status(404); throw new Error('Message not found'); }
  await message.deleteOne();
  res.json({ success: true, data: {}, message: 'Message deleted successfully' });
});

exports.deleteBulk = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) { res.status(400); throw new Error('No ids provided'); }
  await Message.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, data: {}, message: 'Messages deleted successfully' });
});

exports.markBulkRead = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !ids.length) { res.status(400); throw new Error('No ids provided'); }
  await Message.updateMany({ _id: { $in: ids } }, { isRead: true });
  res.json({ success: true, data: {}, message: 'Messages marked as read' });
});
