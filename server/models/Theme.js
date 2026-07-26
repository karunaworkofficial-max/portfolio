const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  mode: { type: String, enum: ['dark', 'light'], default: 'dark' },
  primaryColor: { type: String, default: '#6C63FF' },
  secondaryColor: { type: String, default: '#FF6584' },
  accentColor: { type: String, default: '#00D4AA' },
  backgroundColor: { type: String, default: '#0a0a0a' },
  surfaceColor: { type: String, default: '#1a1a2e' },
  textColor: { type: String, default: '#ffffff' },
  mutedTextColor: { type: String, default: '#888888' },
  
  fontHeading: { type: String, default: 'Clash Display' },
  fontBody: { type: String, default: 'Satoshi' },
  fontAccent: { type: String, default: 'Space Mono' },
  
  scene3D: {
    enabled: { type: Boolean, default: true },
    backgroundColor: { type: String, default: '#0a0a0a' },
    ambientLightIntensity: { type: Number, default: 0.5 },
    fogColor: String,
    fogDensity: Number,
    particleColor: { type: String, default: '#6C63FF' },
    particleCount: { type: Number, default: 500 },
    floatingShapesColor: { type: String, default: '#6C63FF' },
    bloomIntensity: { type: Number, default: 0.5 },
    chromaticAberration: { type: Boolean, default: true }
  },
  
  projectsLayout: { type: String, enum: ['grid', 'masonry', 'horizontal-scroll', '3d-gallery'], default: 'grid' },
  borderRadius: { type: String, enum: ['none', 'small', 'medium', 'large'], default: 'medium' },
  heroStyle: { type: String, enum: ['3d-scene', 'typography-focus', 'video-bg', 'minimal'], default: '3d-scene' },
  
  customCursor: { type: Boolean, default: true },
  smoothScroll: { type: Boolean, default: true },
  animationSpeed: { type: String, enum: ['none', 'slow', 'normal', 'fast'], default: 'normal' },
  pageTransition: { type: String, enum: ['fade', 'slide', 'scale', 'none'], default: 'fade' },
  scrollIndicator: { type: Boolean, default: true },
  grainEffect: { type: Boolean, default: true },
  cursorStyle: { type: String, enum: ['dot', 'circle', 'crosshair', 'ring'], default: 'circle' }
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);
