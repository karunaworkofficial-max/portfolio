const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectType: { 
    type: String, 
    enum: ['brand-identity', 'logo', 'packaging', 'social-media', 'print', 'web-design', 'other'] 
  },
  budget: { 
    type: String, 
    enum: ['under-500', '500-1000', '1000-2500', '2500-5000', '5000-plus', 'not-sure'] 
  },
  timeline: { 
    type: String, 
    enum: ['asap', '1-2-weeks', '1-month', '2-3-months', 'flexible'] 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
