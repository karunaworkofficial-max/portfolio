const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  home: {
    hero: {
      subtitle: { type: String, default: 'Welcome to my universe' },
      headingLine1: { type: String, default: "Hello, I'm" },
      description: { type: String, default: 'Crafting digital experiences that merge logic with creativity.' },
      availability: { type: String, default: 'Available for work' }
    },
    links: {
      aboutTitle: { type: String, default: 'More About Me' },
      aboutSubtitle: { type: String, default: 'Discover my journey' },
      contactTitle: { type: String, default: "Let's Talk" },
      contactSubtitle: { type: String, default: 'Start a conversation' }
    },
    marquee: {
      items: [{ type: String }]
    }
  },
  about: {
    role: { type: String, default: 'Interactive Designer' },
    resumeBtn: { type: String, default: 'Download Resume' },
    journeyHeading: { type: String, default: 'The Journey' },
    experienceHeading: { type: String, default: 'Experience' },
    skillsHeading: { type: String, default: 'Creative Arsenal' }
  },
  projects: {
    heading: { type: String, default: 'Featured Projects' },
    subheading: { type: String, default: 'A curated selection of my latest work.' }
  },
  contact: {
    heading: { type: String, default: 'Get In Touch' },
    subheading: { type: String, default: "Let's build something amazing together" },
    formName: { type: String, default: 'Your Name' },
    formEmail: { type: String, default: 'Email Address' },
    formMessage: { type: String, default: 'Project Details' },
    formSubmit: { type: String, default: 'Send Message' }
  }
}, { timestamps: true });

// Ensure we only have one settings document
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      home: {
        marquee: {
          items: ['CREATIVE DESIGNER', '✦', 'UI / UX', '✦', 'PROBLEM SOLVER', '✦']
        }
      }
    });
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
