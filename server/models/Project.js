const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  slug: { type: String, unique: true },
  subtitle: { type: String },
  description: { type: String },
  
  category: {
    type: String,
    enum: [
      'brand-identity', 'logo-design', 'poster-design', 'packaging-design',
      'editorial-design', 'social-media-design', 'typography', 'illustration',
      'print-design', 'ui-design', 'motion-graphics', 'infographic',
      'merchandise', 'album-art', 'book-cover', 'other', ''
    ],
    default: ''
  },
  designType: String,
  clientName: String,
  clientIndustry: String,
  projectYear: String,
  duration: String,
  
  brief: String,
  challenge: String,
  approach: String,
  solution: String,
  results: String,
  testimonial: {
    text: String,
    author: String,
    role: String
  },
  
  images: [{
    url: String,
    publicId: String,
    alt: String,
    width: Number,
    height: Number,
    isMockup: Boolean
  }],
  thumbnail: {
    url: String,
    publicId: String
  },
  beforeAfter: {
    before: { url: String, publicId: String },
    after: { url: String, publicId: String }
  },
  colorPalette: [String],
  videoUrl: String,
  
  tools: [String],
  fonts: [{
    name: String,
    role: String
  }],
  deliverables: [String],
  tags: [String],
  projectLink: String,
  
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  is3DShowcase: { type: Boolean, default: false },
  displayAsCarousel: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  accentColor: String
}, { timestamps: true });

// Pre-save middleware
projectSchema.pre('save', function() {
  // auto-generate slug from title
  if (this.isModified('title') && !this.slug) {
    if (this.title && this.title.trim() !== '') {
      this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    } else {
      this.slug = 'untitled-' + Math.random().toString(36).substring(2, 8);
    }
  }
  // generate accentColor from first color in colorPalette
  if (this.isModified('colorPalette') && this.colorPalette && this.colorPalette.length > 0 && !this.accentColor) {
    this.accentColor = this.colorPalette[0];
  }
});

module.exports = mongoose.model('Project', projectSchema);
