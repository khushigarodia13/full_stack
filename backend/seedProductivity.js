// backend/seedProductivity.js
  require('dotenv').config();
  const mongoose = require('mongoose');
const User = require('./models/User');
const ProductivityLog = require('./models/ProductivityLog');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function seed() {
  await User.deleteMany({});
  await ProductivityLog.deleteMany({});

  // Create 10 users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await User.create({
      name: `Student${i}`,
      email: `student${i}@test.com`,
      passwordHash: 'test', // Not secure, just for seeding
    });
    users.push(user);
  }

  // Add productivity logs for each user
  for (const user of users) {
    for (let j = 0; j < 5; j++) {
      await ProductivityLog.create({
        user: user._id,
        date: new Date(Date.now() - j * 86400000),
        activities: [`Activity ${j + 1}`],
        score: Math.floor(Math.random() * 100),
      });
    }
  }

  console.log('Seeded 10 users with productivity logs.');
  mongoose.disconnect();
}

seed();