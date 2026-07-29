const express = require('express');
const router = express.Router();
const {
  getProjects, getFeaturedProjects, getProjectStats, getCategories, get3DShowcase,
  getProjectBySlug, getRelatedProjects, getAllProjectsAdmin, getProjectByIdAdmin,
  createProject, updateProject, deleteProject, toggleVisibility,
  toggleFeatured, toggle3DShowcase, reorderProjects,
  likeProject, shareProject, commentOnProject,
  viewImage, likeImage, shareImage, commentOnImage
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/stats', getProjectStats);
router.get('/categories', getCategories);
router.get('/3d-showcase', get3DShowcase);
router.get('/:slug', getProjectBySlug);
router.get('/:slug/related', getRelatedProjects);

router.get('/reset/all/stats', async (req, res) => {
  const Project = require('../models/Project');
  await Project.updateMany({}, { 
    $set: { 
      views: 0, 
      likes: 0, 
      shares: 0, 
      comments: [],
      viewedBy: [],
      likedBy: []
    } 
  });
  
  const projects = await Project.find({});
  for(let p of projects) {
    if(p.images && p.images.length > 0) {
      for(let i=0; i<p.images.length; i++) {
        p.images[i].views = 0;
        p.images[i].likes = 0;
        p.images[i].shares = 0;
        p.images[i].comments = [];
        p.images[i].viewedBy = [];
        p.images[i].likedBy = [];
      }
      await p.save();
    }
  }
  res.json({ message: 'Stats reset' });
});

// Project Engagement
router.post('/:id/like', likeProject);
router.post('/:id/share', shareProject);
router.post('/:id/comment', commentOnProject);

// Image Engagement
router.post('/:id/images/:imageId/view', viewImage);
router.post('/:id/images/:imageId/like', likeImage);
router.post('/:id/images/:imageId/share', shareImage);
router.post('/:id/images/:imageId/comment', commentOnImage);

router.get('/admin/all', protect, getAllProjectsAdmin);
router.get('/admin/:id', protect, getProjectByIdAdmin);
router.post('/', protect, createProject);
router.put('/reorder', protect, reorderProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/:id/visibility', protect, toggleVisibility);
router.patch('/:id/featured', protect, toggleFeatured);
router.patch('/:id/3d-showcase', protect, toggle3DShowcase);

module.exports = router;
