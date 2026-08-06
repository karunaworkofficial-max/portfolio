const Analytics = require('../models/Analytics');
const asyncHandler = require('../middleware/asyncHandler');

// Helper function to fetch location from IP and save to DB
const recordViewAsync = async (ip, type, target) => {
  try {
    let country = 'Unknown';
    let city = 'Unknown';

    // Don't fetch location for localhost (dev environment)
    if (ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('192.168.')) {
      try {
        // We use ip-api.com because it's free and doesn't require an API key for up to 45 requests/min.
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`);
        const data = await response.json();
        if (data && data.status === 'success') {
          country = data.country || 'Unknown';
          city = data.city || 'Unknown';
        }
      } catch (err) {
        console.error('Error fetching geo location:', err.message);
      }
    } else {
      country = 'Localhost';
      city = 'Localhost';
    }

    await Analytics.create({
      ip: ip || 'Unknown',
      country,
      city,
      type,
      target
    });
  } catch (error) {
    console.error('Error recording analytics view:', error.message);
  }
};

exports.recordViewAsync = recordViewAsync;

// @desc    Track a page view from the frontend
// @route   POST /api/analytics/track
// @access  Public
exports.trackView = asyncHandler(async (req, res) => {
  const { type, target } = req.body;
  const { admin } = req.query;

  // Don't track admin views if admin query param is true
  if (admin === 'true') {
    return res.status(200).json({ success: true, message: 'Admin view ignored' });
  }

  if (!type || !target) {
    res.status(400);
    throw new Error('Type and target are required');
  }

  const ip = req.ip || req.connection.remoteAddress;
  
  // Fire and forget so we don't block the response waiting for the geo API
  recordViewAsync(ip, type, target);

  res.status(200).json({ success: true, message: 'View tracked successfully' });
});

// @desc    Get analytics data for admin dashboard
// @route   GET /api/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res) => {
  // Fetch overall stats
  const totalPageViews = await Analytics.countDocuments({ type: 'PAGE_VIEW' });
  const totalProjectViews = await Analytics.countDocuments({ type: 'PROJECT_VIEW' });
  const totalImageViews = await Analytics.countDocuments({ type: 'IMAGE_VIEW' });

  // Fetch recent 100 views (can add pagination later if needed)
  const recentViews = await Analytics.find()
    .sort({ timestamp: -1 })
    .limit(100);

  res.json({
    success: true,
    data: {
      stats: {
        totalPageViews,
        totalProjectViews,
        totalImageViews
      },
      recentViews
    },
    message: 'Analytics fetched successfully'
  });
});
