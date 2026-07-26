const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const asyncHandler = require('../middleware/asyncHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for username: ${username}, password: ${password}`);
  const admin = await Admin.findOne({ username });
  console.log('Admin found in DB:', admin ? { username: admin.username, passwordHash: admin.password } : 'NONE');
  
  if (admin) {
    const isMatch = await admin.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);
    
    if (isMatch) {
      res.json({ success: true, data: { _id: admin._id, username: admin.username, token: generateToken(admin._id) }, message: 'Logged in successfully' });
      return;
    }
  }
  
  res.status(401);
  throw new Error('Invalid username or password');
});

exports.register = asyncHandler(async (req, res) => {
  const adminExists = await Admin.countDocuments();
  if (adminExists >= 1) {
    res.status(400);
    throw new Error('Admin already exists. Only one admin allowed.');
  }
  const { username, password } = req.body;
  const admin = await Admin.create({ username, password });
  res.status(201).json({ success: true, data: { _id: admin._id, username: admin.username, token: generateToken(admin._id) }, message: 'Admin created successfully' });
});

exports.verify = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { _id: req.admin._id, username: req.admin.username }, message: 'Token verified' });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  const { oldPassword, newPassword } = req.body;
  if (admin && (await admin.matchPassword(oldPassword))) {
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password updated successfully', data: {} });
  } else {
    res.status(401);
    throw new Error('Invalid old password');
  }
});
