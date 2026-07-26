require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Theme = require('./models/Theme');
const Project = require('./models/Project');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio');
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await Admin.deleteMany();
    await Profile.deleteMany();
    await Theme.deleteMany();
    await Project.deleteMany();

    // 1. Create Admin
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: 'admin123'
    });

    // 2. Default Profile
    await Profile.create({
      name: "John Designer",
      tagline: "Visual Designer & Creative Director",
      bio: "I craft visual identities and experiences...",
      shortBio: "Design enthusiast turning ideas into visual reality.",
      designPhilosophy: "Great design is invisible. It just works.",
      specializations: ["Brand Identity", "Packaging Design", "Typography", "Print Design"],
      skills: [
        { name: "Brand Identity", category: "design", level: 95 },
        { name: "Typography", category: "design", level: 90 },
        { name: "Layout Design", category: "design", level: 92 },
        { name: "Color Theory", category: "design", level: 88 },
        { name: "Illustration", category: "design", level: 75 }
      ],
      tools: [
        { name: "Adobe Photoshop", proficiency: "expert" },
        { name: "Adobe Illustrator", proficiency: "expert" },
        { name: "Adobe InDesign", proficiency: "advanced" },
        { name: "Figma", proficiency: "expert" },
        { name: "After Effects", proficiency: "intermediate" },
        { name: "Procreate", proficiency: "advanced" },
        { name: "Blender", proficiency: "intermediate" }
      ],
      yearsOfExperience: 5,
      projectsCompleted: 50,
      happyClients: 30,
      availableForWork: true
    });

    // 3. Default Theme
    await Theme.create({
      mode: "dark",
      primaryColor: "#6C63FF",
      fontHeading: "Clash Display",
      fontBody: "Satoshi",
      scene3D: { enabled: true, particleCount: 500, bloomIntensity: 0.5 },
      heroStyle: "3d-scene",
      customCursor: true,
      grainEffect: true
    });

    // 4. Sample Projects
    await Project.create([
      {
        title: "Zenith Coffee - Brand Identity",
        category: "brand-identity",
        images: [{ url: "https://placehold.co/1200x800", alt: "Zenith Coffee Thumbnail" }],
        thumbnail: { url: "https://placehold.co/1200x800" },
        colorPalette: ["#2D1B0E", "#C4956A", "#F5F0EB", "#1A1A1A"],
        tools: ["Illustrator", "Photoshop"],
        isFeatured: true,
        is3DShowcase: true,
        accentColor: "#C4956A",
        order: 1
      },
      {
        title: "TechFlow - App UI Design",
        category: "ui-design",
        images: [{ url: "https://placehold.co/1200x800", alt: "TechFlow Thumbnail" }],
        thumbnail: { url: "https://placehold.co/1200x800" },
        isFeatured: true,
        is3DShowcase: true,
        accentColor: "#6C63FF",
        order: 2
      },
      {
        title: "Music Fest 2024 - Poster Design",
        category: "poster-design",
        images: [{ url: "https://placehold.co/1200x800", alt: "Music Fest Thumbnail" }],
        thumbnail: { url: "https://placehold.co/1200x800" },
        isFeatured: true,
        is3DShowcase: true,
        accentColor: "#FF6584",
        order: 3
      }
    ]);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error Details:', error);
    process.exit(1);
  }
};

seedData();
