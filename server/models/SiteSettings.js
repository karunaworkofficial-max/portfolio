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
    // We can expand this later
    heading: { type: String, default: 'About Me' }
  },
  contact: {
    // We can expand this later
    heading: { type: String, default: 'Get In Touch' }
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
