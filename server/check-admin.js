require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const admins = await mongoose.connection.db.collection('admins').find({}).toArray();
  console.log('Admins in DB:', admins);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
