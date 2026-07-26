const Profile = require('../models/Profile');
const asyncHandler = require('../middleware/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  res.json({ success: true, data: profile || {}, message: 'Profile fetched successfully' });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = new Profile(req.body);
    await profile.save();
  } else {
    profile = await Profile.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
  }
  res.json({ success: true, data: profile, message: 'Profile updated successfully' });
});

const updateField = (field) => asyncHandler(async (req, res) => {
  const updateQuery = {};
  updateQuery[field] = req.body[field] || req.body;
  const profile = await Profile.findOneAndUpdate({}, { $set: updateQuery }, { new: true, runValidators: true });
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  res.json({ success: true, data: profile, message: `Profile ${field} updated successfully` });
});

exports.updatePhoto = updateField('photo');
exports.updateResume = updateField('resumeUrl');
exports.updateSkills = updateField('skills');
exports.updateTools = updateField('tools');
exports.updateExperience = updateField('experience');
exports.updateEducation = updateField('education');
exports.updateAwards = updateField('awards');
exports.updateSocial = updateField('socialLinks');
exports.updateClients = updateField('clientLogos');

exports.updateStats = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }
  const { yearsOfExperience, projectsCompleted, happyClients, awardsCount, selfProjects } = req.body;
  if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
  if (projectsCompleted !== undefined) profile.projectsCompleted = projectsCompleted;
  if (happyClients !== undefined) profile.happyClients = happyClients;
  if (awardsCount !== undefined) profile.awardsCount = awardsCount;
  if (selfProjects !== undefined) profile.selfProjects = selfProjects;
  
  await profile.save();
  res.json({ success: true, data: profile, message: 'Stats updated successfully' });
});
