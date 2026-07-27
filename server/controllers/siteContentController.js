const SiteContent = require('../models/SiteContent');

// @desc    Get site content
// @route   GET /api/content
// @access  Public
exports.getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    
    // Create default content if none exists
    if (!content) {
      content = await SiteContent.create({});
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching content' });
  }
};

// @desc    Update site content
// @route   PUT /api/content
// @access  Private (Admin)
exports.updateSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    
    if (!content) {
      content = await SiteContent.create(req.body);
    } else {
      // Merge updates
      if (req.body.home) content.home = { ...content.home, ...req.body.home };
      if (req.body.about) content.about = { ...content.about, ...req.body.about };
      if (req.body.projects) content.projects = { ...content.projects, ...req.body.projects };
      if (req.body.contact) content.contact = { ...content.contact, ...req.body.contact };
      
      await content.save();
    }

    res.status(200).json({
      success: true,
      data: content,
      message: 'Site content updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating content' });
  }
};
