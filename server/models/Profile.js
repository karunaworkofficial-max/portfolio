const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: String,
  lastName: String,
  tagline: String,
  bio: String,
  shortBio: String,
  photo: { url: String, publicId: String },
  email: String,
  phone: String,
  location: { city: String, country: String },
  availableForWork: { type: Boolean, default: true },
  availableForFreelance: { type: Boolean, default: true },
  
  designPhilosophy: String,
  specializations: [String],
  yearsOfExperience: Number,
  projectsCompleted: Number,
  happyClients: Number,
  awardsCount: Number,
  selfProjects: Number,
  
  skills: [{
    name: String,
    category: { type: String, enum: ['design', 'tools', 'soft-skills'] },
    level: Number,
    icon: String
  }],
  tools: [{
    name: String,
    icon: String,
    proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
  }],
  
  experience: [{
    company: String,
    role: String,
    type: { type: String, enum: ['full-time', 'freelance', 'contract', 'internship'] },
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    highlights: [String]
  }],
  
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: String
  }],
  
  awards: [{
    title: String,
    organization: String,
    year: String,
    link: String
  }],
  
  certifications: [{
    title: String,
    issuer: String,
    year: String,
    link: String
  }],
  
  reviews: [{
    clientName: String,
    company: String,
    rating: Number,
    text: String
  }],
  
  socialLinks: {
    instagram: String,
    behance: String,
    dribbble: String,
    linkedin: String,
    twitter: String,
    pinterest: String,
    youtube: String,
    vimeo: String,
    github: String,
    medium: String,
    personalBlog: String
  },
  
  resumeUrl: String,
  
  clientLogos: [{
    name: String,
    logo: { url: String, publicId: String }
  }],
  
  loadingLogo: { url: String, publicId: String }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
