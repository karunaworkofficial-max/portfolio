const mongoose = require('mongoose');
const Project = require('./models/Project');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
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
  
  console.log('Successfully reset all views, likes, shares, and comments.');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
