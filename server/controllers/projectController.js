const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('cloudinary').v2; // Will configure properly in server.js

exports.getProjects = asyncHandler(async (req, res) => {
  const { category, tag, featured, search, limit = 10, page = 1, sort = 'order' } = req.query;
  let query = { isVisible: true };

  if (category) query.category = category;
  if (tag) query.tags = { $in: [tag] };
  if (featured === 'true') query.isFeatured = true;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { clientName: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Project.countDocuments(query);
  const projects = await Project.find(query).sort(sort).skip(skip).limit(parseInt(limit));

  res.json({
    success: true,
    data: projects,
    message: 'Projects fetched successfully',
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

exports.getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ isVisible: true, isFeatured: true }).sort('order');
  res.json({ success: true, data: projects, message: 'Featured projects fetched' });
});

exports.getProjectStats = asyncHandler(async (req, res) => {
  const totalProjects = await Project.countDocuments({ isVisible: true });
  const uniqueClients = await Project.distinct('clientName', { isVisible: true, clientName: { $ne: null, $ne: '' } });
  res.json({ success: true, data: { totalProjects, totalClients: uniqueClients.length }, message: 'Project stats fetched' });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Project.aggregate([
    { $match: { isVisible: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json({ success: true, data: categories, message: 'Categories fetched' });
});

exports.get3DShowcase = asyncHandler(async (req, res) => {
  const projects = await Project.find({ isVisible: true, is3DShowcase: true }).sort('order');
  res.json({ success: true, data: projects, message: '3D showcase projects fetched' });
});

exports.getProjectBySlug = asyncHandler(async (req, res) => {
  const { admin } = req.query;
  const ip = req.ip || req.connection.remoteAddress;

  let project = await Project.findOne({ slug: req.params.slug, isVisible: true });
  
  if (!project) { res.status(404); throw new Error('Project not found'); }

  // Increment views if not admin and IP hasn't viewed yet
  if (admin !== 'true' && !project.viewedBy.includes(ip)) {
    project.views += 1;
    project.viewedBy.push(ip);
    await project.save();
  }

  res.json({ success: true, data: project, message: 'Project fetched' });
});

exports.getRelatedProjects = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) { res.status(404); throw new Error('Project not found'); }
  const related = await Project.find({
    category: project.category,
    _id: { $ne: project._id },
    isVisible: true
  }).limit(3);
  res.json({ success: true, data: related, message: 'Related projects fetched' });
});

// Admin Protected Routes
exports.getAllProjectsAdmin = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort('order');
  res.json({ success: true, data: projects, message: 'All projects fetched for admin' });
});

exports.getProjectByIdAdmin = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  res.json({ success: true, data: project, message: 'Project fetched for admin' });
});

exports.createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project, message: 'Project created' });
});

exports.updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) { res.status(404); throw new Error('Project not found'); }
  res.json({ success: true, data: project, message: 'Project updated' });
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  // Delete all associated images in Cloudinary
  const publicIds = [];
  if (project.thumbnail?.publicId) publicIds.push(project.thumbnail.publicId);
  if (project.beforeAfter?.before?.publicId) publicIds.push(project.beforeAfter.before.publicId);
  if (project.beforeAfter?.after?.publicId) publicIds.push(project.beforeAfter.after.publicId);
  if (project.images?.length > 0) {
    project.images.forEach(img => img.publicId && publicIds.push(img.publicId));
  }
  for (const id of publicIds) {
    try { await cloudinary.uploader.destroy(id); } catch(err) { console.error('Cloudinary deletion error', err); }
  }
  await project.deleteOne();
  res.json({ success: true, data: {}, message: 'Project deleted' });
});

exports.toggleVisibility = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  project.isVisible = !project.isVisible;
  await project.save();
  res.json({ success: true, data: project, message: 'Visibility toggled' });
});

exports.toggleFeatured = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  project.isFeatured = !project.isFeatured;
  await project.save();
  res.json({ success: true, data: project, message: 'Featured status toggled' });
});

exports.toggle3DShowcase = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  project.is3DShowcase = !project.is3DShowcase;
  await project.save();
  res.json({ success: true, data: project, message: '3D showcase toggled' });
});

exports.reorderProjects = asyncHandler(async (req, res) => {
  const { reorderedProjects } = req.body; // Array of { id, order }
  if (!reorderedProjects || !reorderedProjects.length) { res.status(400); throw new Error('No items provided'); }
  for (const item of reorderedProjects) {
    await Project.findByIdAndUpdate(item.id, { order: item.order });
  }
  res.json({ success: true, data: {}, message: 'Projects reordered' });
});

// --- Engagement Features (Projects) ---

exports.likeProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  const ip = req.ip || req.connection.remoteAddress;
  if (!project.likedBy.includes(ip)) {
    project.likes += 1;
    project.likedBy.push(ip);
    await project.save();
  }
  res.json({ success: true, data: project.likes, message: 'Project liked' });
});

exports.shareProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  project.shares += 1;
  await project.save();
  res.json({ success: true, data: project.shares, message: 'Project shared' });
});

exports.commentOnProject = asyncHandler(async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) { res.status(400); throw new Error('Name and text are required'); }
  
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  project.comments.push({ name, text });
  await project.save();
  res.json({ success: true, data: project.comments, message: 'Comment added' });
});

// --- Engagement Features (Images) ---

exports.viewImage = asyncHandler(async (req, res) => {
  const { admin } = req.query;
  const ip = req.ip || req.connection.remoteAddress;
  
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  const image = project.images.id(req.params.imageId);
  if (!image) { res.status(404); throw new Error('Image not found'); }
  
  if (admin !== 'true' && !image.viewedBy.includes(ip)) {
    image.views += 1;
    image.viewedBy.push(ip);
    await project.save();
  }
  res.json({ success: true, data: image.views, message: 'Image viewed' });
});

exports.likeImage = asyncHandler(async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  const image = project.images.id(req.params.imageId);
  if (!image) { res.status(404); throw new Error('Image not found'); }
  
  if (!image.likedBy.includes(ip)) {
    image.likes += 1;
    image.likedBy.push(ip);
    await project.save();
  }
  res.json({ success: true, data: image.likes, message: 'Image liked' });
});

exports.shareImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  const image = project.images.id(req.params.imageId);
  if (!image) { res.status(404); throw new Error('Image not found'); }
  
  image.shares += 1;
  await project.save();
  res.json({ success: true, data: image.shares, message: 'Image shared' });
});

exports.commentOnImage = asyncHandler(async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) { res.status(400); throw new Error('Name and text are required'); }

  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }
  
  const image = project.images.id(req.params.imageId);
  if (!image) { res.status(404); throw new Error('Image not found'); }
  
  image.comments.push({ name, text });
  await project.save();
  res.json({ success: true, data: image.comments, message: 'Comment added to image' });
});
