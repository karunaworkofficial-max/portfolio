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
    
    // We expect the entire settings object or a partial update
    // For deep merging, we can use a simple assign if the structure is straightforward
    // Since req.body might only contain specific pages (e.g., { home: { ... } })
    
    // Helper function for deep merge
    const deepMerge = (target, source) => {
      for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && !Array.isArray(source[key]) && target[key]) {
          Object.assign(source[key], deepMerge(target[key], source[key]));
        }
      }
      Object.assign(target || {}, source);
      return target;
    };

    deepMerge(settings, req.body);
    
    await settings.save();

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
