const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.getSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.getSettings();
    
    // Remove immutable fields from payload
    const payload = { ...req.body };
    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;

    settings.set(payload);
    
    await settings.save();

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
