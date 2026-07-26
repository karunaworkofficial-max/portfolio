const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, updatePhoto, updateResume, updateSkills, 
  updateTools, updateExperience, updateEducation, updateAwards, 
  updateSocial, updateClients, updateStats
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/', getProfile);

router.put('/', protect, updateProfile);
router.put('/photo', protect, updatePhoto);
router.put('/resume', protect, updateResume);
router.put('/skills', protect, updateSkills);
router.put('/tools', protect, updateTools);
router.put('/experience', protect, updateExperience);
router.put('/education', protect, updateEducation);
router.put('/awards', protect, updateAwards);
router.put('/social', protect, updateSocial);
router.put('/clients', protect, updateClients);
router.put('/stats', protect, updateStats);

module.exports = router;
