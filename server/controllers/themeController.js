const Theme = require('../models/Theme');
const asyncHandler = require('../middleware/asyncHandler');

exports.getTheme = asyncHandler(async (req, res) => {
  let theme = await Theme.findOne();
  if (!theme) {
    theme = await Theme.create({});
  }
  res.json({ success: true, data: theme, message: 'Theme fetched successfully' });
});

exports.updateTheme = asyncHandler(async (req, res) => {
  let theme = await Theme.findOne();
  if (!theme) {
    theme = new Theme(req.body);
    await theme.save();
  } else {
    theme = await Theme.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
  }
  res.json({ success: true, data: theme, message: 'Theme updated successfully' });
});

exports.update3D = asyncHandler(async (req, res) => {
  let theme = await Theme.findOne();
  if (!theme) {
    res.status(404);
    throw new Error('Theme not found');
  }
  theme.scene3D = { ...theme.scene3D, ...req.body };
  await theme.save();
  res.json({ success: true, data: theme, message: '3D settings updated successfully' });
});

exports.resetTheme = asyncHandler(async (req, res) => {
  await Theme.deleteMany({});
  const theme = await Theme.create({});
  res.json({ success: true, data: theme, message: 'Theme reset to defaults' });
});
