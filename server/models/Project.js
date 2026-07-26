const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  subtitle: { type: String },
  description: { type: String },
  
  category: {
    type: String,
    enum: [
      'brand-identity', 'logo-design', 'poster-design', 'packaging-design',
      'editorial-design', 'social-media-design', 'typography', 'illustration',
      'print-design', 'ui-design', 'motion-graphics', 'infographic',
      'merchandise', 'album-art', 'book-cover', 'other'
    ]
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
  views: { type: Number, default: 0 },
  accentColor: String
}, { timestamps: true });

// Pre-save middleware
projectSchema.pre('save', function() {
  // auto-generate slug from title
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  // generate accentColor from first color in colorPalette
  if (this.isModified('colorPalette') && this.colorPalette && this.colorPalette.length > 0 && !this.accentColor) {
    this.accentColor = this.colorPalette[0];
  }
});

module.exports = mongoose.model('Project', projectSchema);
