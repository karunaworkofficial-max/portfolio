const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  home: {
    heroTitle: { type: String, default: 'Welcome to my universe' },
    marqueeText: { type: String, default: 'CREATIVE DESIGNER ✦ UI / UX ✦ PROBLEM SOLVER' }
  },
  about: {
    journeyHeading: { type: String, default: 'The Journey' },
    journeyText: { type: String, default: 'Hi, I am Karuna. I craft digital experiences that merge logic with creativity.' },
    titleRole: { type: String, default: 'Interactive Designer' }
  },
  projects: {
    heroTitle: { type: String, default: 'Work Archive' },
    heroSubtitle: { type: String, default: 'A curated exhibition of projects exploring visual identities, digital experiences, and creative solutions.' }
  },
  contact: {
    heroTitle: { type: String, default: 'Get in Touch' },
    heroSubtitle: { type: String, default: 'Ready to start a project? Send me a message and let\'s talk.' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
