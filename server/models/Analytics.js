const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  type: {
    type: String,
    enum: ['PAGE_VIEW', 'PROJECT_VIEW', 'IMAGE_VIEW'],
    required: true
  },
  target: {
    type: String, // Page name, Project Title/ID, or Image ID
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create index on timestamp for fast sorting
analyticsSchema.index({ timestamp: -1 });
// Create index on type for filtering
analyticsSchema.index({ type: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
