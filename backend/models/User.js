const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  level: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Progress' }],
  college: { type: String, default: 'NIT College' },
  year: { type: Number, default: 2 },
  skills: [{ 
    name: { type: String, default: 'JavaScript' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' }
  }],
  productivityScore: { type: Number, default: 75 },
  github: String,
  linkedin: String,
  location: { type: String, default: 'India' },
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  githubId: String,
  googleId: String,
  background: String,
  goals: String,
  selectedCompany: String,
  resumeData: Object, // This can be used if you want to store resume data directly
});

module.exports = mongoose.model('User ', userSchema);
