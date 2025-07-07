const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  level: { type: Number, default: 1 },
badges: { type: [String], default: [] },
progress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Progress' }],
college: String, // already present if you collect this
// ...other fields...
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  githubId: String,
  googleId: String,
  background: String,
  goals: String,
  selectedCompany: String,
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Progress' }],
  resumeData: Object,
});
// After marking a module as complete
const completedCount = await Progress.countDocuments({ userId: req.user, status: "completed" });
let level = 1;
if (completedCount >= 10) level = 3;
else if (completedCount >= 5) level = 2;

await User.findByIdAndUpdate(req.user, {
  level,
  $addToSet: { badges: `level_${level}` }
});

module.exports = mongoose.model('User', userSchema);