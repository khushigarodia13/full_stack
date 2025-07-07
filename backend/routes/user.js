const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
   const LearningPath = require('../models/LearningPath');
const Progress = require('../models/Progress');


const router = express.Router();
// GET /api/mentors - Return all users with isMentor: true
router.get('/mentors', auth, async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true }); // or whatever flag you use
    res.json({ mentors });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
});

// Save onboarding info
router.post('/onboarding', auth, async (req, res) => {
  const { background, goals, selectedCompany } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { background, goals, selectedCompany },
      { new: true }
    );
    res.json({ message: 'Onboarding info saved', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ user });
});

router.get('/progress', auth, async (req, res) => {
  const progress = await Progress.find({ userId: req.user });
  res.json({ progress });
});


router.post('/progress', auth, async (req, res) => {
  const { nodeId } = req.body;
  let progress = await Progress.findOne({ userId: req.user, nodeId });
  if (!progress) {
    progress = await Progress.create({
      userId: req.user,
      nodeId,
      status: "completed",
      completedAt: new Date(),
    });
  } else {
    progress.status = "completed";
    progress.completedAt = new Date();
    await progress.save();
  }
  res.json({ progress });
});
router.get('/resume', auth, async (req, res) => {
  const user = await User.findById(req.user);
  const progress = await Progress.find({ userId: req.user, status: "completed" });
  const learningPath = await LearningPath.findOne();
  // Optionally, fetch GitHub info if you want to include it
  const userSchema = new mongoose.Schema({
  // ...other fields...
  isMentor: { type: Boolean, default: false },
  expertise: String, // optional, for mentor expertise
  // ...other fields...
});

  // Build skills from completed modules
  const completedModules = progress.map(p => p.nodeId);
  const skills = learningPath.nodes
    .filter(node => completedModules.includes(node.title))
    .map(node => node.title);

  // Example resume data
  const resume = {
    name: user.name,
    email: user.email,
    skills,
    // Add more fields as needed
  };

  res.json({ resume });
});
module.exports = router;