const mongoose = require('mongoose');
require('dotenv').config();

const LearningPath = require('./models/LearningPath');
const Resource = require('./models/Resource');
const Company = require('./models/Company');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Clear old data
  await LearningPath.deleteMany({});
  await Resource.deleteMany({});
  await Company.deleteMany({});

  // Create resources
  const htmlRes = await Resource.create({
    nodeId: 'HTML',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
    title: 'HTML Crash Course',
    description: 'A beginner-friendly HTML video tutorial.',
  });

  const cssRes = await Resource.create({
    nodeId: 'CSS',
    type: 'article',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
    title: 'CSS Flexbox Guide',
    description: 'Comprehensive guide to CSS Flexbox.',
  });

  // Create learning path
  await LearningPath.create({
    name: 'Web Development',
    description: 'Start your journey as a web developer.',
    nodes: [
      {
        title: 'HTML',
        description: 'Learn the basics of HTML.',
        prerequisites: [],
        resources: [htmlRes._id],
        faangCustomizations: {},
      },
      {
        title: 'CSS',
        description: 'Style your web pages with CSS.',
        prerequisites: ['HTML'],
        resources: [cssRes._id],
        faangCustomizations: {},
      },
      {
        title: 'JavaScript',
        description: 'Add interactivity with JavaScript.',
        prerequisites: ['HTML', 'CSS'],
        resources: [],
        faangCustomizations: {},
      },
    ],
  });

  // Create company customization
  await Company.create({
    name: 'Google',
    customizations: {
      extraModules: ['System Design', 'DSA'],
      interviewPrep: 'https://careers.google.com/how-we-hire/interview/',
    },
  });

  console.log('Database seeded!');
  process.exit();
}

seed();