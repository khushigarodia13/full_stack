const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const Progress = require('../models/Progress');
const ProductivityLog = require('../models/ProductivityLog');
const DailyLog = require('../models/DailyLog');
const Timetable = require('../models/Timetable');

const router = express.Router();

// GET /api/mentors - Return all users with isMentor: true
router.get('/mentors', auth, async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true });
    res.json({ mentors });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
});

// GET /api/team-finder - Return all users for team finder
router.get('/team-finder', auth, async (req, res) => {
  try {
    const users = await User.find({}, {
      name: 1,
      email: 1,
      year: 1,
      college: 1,
      goals: 1,
      skills: 1,
      productivityScore: 1,
      github: 1,
      linkedin: 1,
      location: 1,
      _id: 1
    });
    
    // Transform users to match Team Finder format
    const teamFinderUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      year: user.year || 2,
      college: user.college || 'NIT College',
      productivityScore: user.productivityScore || Math.floor(Math.random() * 40) + 60, // Default score 60-100
      skills: user.skills || [
        { name: 'JavaScript', level: 'Intermediate' },
        { name: 'React', level: 'Beginner' },
        { name: 'Node.js', level: 'Beginner' }
      ],
      goals: user.goals || 'Software development and learning',
      github: user.github || `https://github.com/${user.name?.toLowerCase().replace(/\s+/g, '')}`,
      linkedin: user.linkedin || `https://linkedin.com/in/${user.name?.toLowerCase().replace(/\s+/g, '')}`,
      location: user.location || 'India'
    }));
    
    res.json({ users: teamFinderUsers });
  } catch (err) {
    console.error('Error fetching team finder users:', err);
    res.status(500).json({ message: "Failed to fetch users for team finder" });
  }
});

// Save onboarding info
router.post('/onboarding', auth, async (req, res) => {
  const { 
    background, 
    goals, 
    selectedCompany, 
    college, 
    year, 
    skills, 
    github, 
    linkedin, 
    location 
  } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        background, 
        goals, 
        selectedCompany, 
        college, 
        year, 
        skills, 
        github, 
        linkedin, 
        location 
      },
      { new: true }
    );
    res.json({ message: 'Onboarding info saved', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user info
router.get('/me', auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Error in /me route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    console.log('req.user in progress:', req.user);
    console.log('req.user.id in progress:', req.user.id);
    const progress = await Progress.find({ userId: req.user.id });
    res.json({ progress });
  } catch (err) {
    console.error('Error in /progress route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Post user progress
router.post('/progress', auth, async (req, res) => {
  const completedCount = await Progress.countDocuments({ userId: req.user.id, status: "completed" });
  let level = 1;
  if (completedCount >= 10) level = 3;
  else if (completedCount >= 5) level = 2;

  await User.findByIdAndUpdate(req.user.id, {
    level,
    $addToSet: { badges: `level_${level}` }
  });

  const { nodeId } = req.body;
  let progress = await Progress.findOne({ userId: req.user.id, nodeId });
  if (!progress) {
    progress = await Progress.create({
      userId: req.user.id,
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

// Mark subtopic as complete (POST /progress/step)
router.post('/progress/step', auth, async (req, res) => {
  try {
    const { nodeId, stepTitle } = req.body;
    let progress = await Progress.findOne({ userId: req.user.id, nodeId, stepTitle });
    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        nodeId,
        stepTitle,
        status: 'completed',
        completedAt: new Date(),
      });
    } else {
      progress.status = 'completed';
      progress.completedAt = new Date();
      await progress.save();
    }
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark step as complete', error: err.message });
  }
});

// DELETE user progress (unmark technology as complete)
router.delete('/progress', auth, async (req, res) => {
  try {
    const { nodeId } = req.body;
    const result = await Progress.deleteOne({ userId: req.user.id, nodeId });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete progress', error: err.message });
  }
});

// Handler: Mark/unmark subtopic as complete

// DELETE user progress for a subtopic (unmark subtopic as complete)
router.delete('/progress/step', auth, async (req, res) => {
  try {
    const { nodeId, stepTitle } = req.body;
    const result = await Progress.deleteOne({ userId: req.user.id, nodeId, stepTitle });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete step progress', error: err.message });
  }
});

// Get user resume
router.get('/resume', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User  not found" });
  }

  const progress = await Progress.find({ userId: req.user.id, status: "completed" });
  const learningPath = await LearningPath.findOne();
  if (!learningPath) {
    return res.status(404).json({ message: "Learning path not found" });
  }

  // Build skills from completed modules
  const completedModules = progress.map(p => p.nodeId);
  const skills = learningPath.nodes
    .filter(node => completedModules.includes(node.title))
    .map(node => node.title);

  // Construct resume data
  const resume = {
    name: user.name,
    email: user.email,
    skills,
    // Add more fields as needed
  };

  // Send the constructed resume object
  res.json({ resume }); // Changed from resume: user.resumeData to resume
});

// Add a productivity log for the current user
router.post('/productivity/log', auth, async (req, res) => {
  try {
    const { activities, score } = req.body;
    const log = await ProductivityLog.create({
      user: req.user.id,
      activities,
      score,
      date: new Date(),
    });
    res.status(201).json({ message: 'Productivity log created', log });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create productivity log' });
  }
});

// Get all productivity logs and average score for the current user
router.get('/productivity/me', auth, async (req, res) => {
  try {
    const logs = await ProductivityLog.find({ user: req.user.id }).sort({ date: -1 });
    const avgScore = logs.length > 0 ? (logs.reduce((sum, log) => sum + (log.score || 0), 0) / logs.length) : 0;
    res.json({ logs, avgScore });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch productivity logs' });
  }
});

// Get weekly productivity data
router.get('/productivity/weekly', auth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyLogs = await DailyLog.find({
      user: req.user.id,
      date: { $gte: oneWeekAgo }
    }).sort({ date: 1 });

    const weeklyData = weeklyLogs.map(log => ({
      date: log.date,
      productivityScore: log.productivityScore,
      taskCompletion: log.totalTasks > 0 ? (log.completedTasks.length / log.totalTasks) * 100 : 0,
      resumeActions: log.resumeActions.length,
      jobPrepProgress: log.jobPrepProgress
    }));

    res.json({ success: true, weeklyData });
  } catch (error) {
    console.error('Error fetching weekly productivity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user timetable
router.get('/timetable', auth, async (req, res) => {
  try {
    let timetable = await Timetable.findOne({ user: req.user.id });
    
    if (!timetable) {
      // Create default timetable if none exists
      timetable = new Timetable({
        user: req.user.id,
        schedule: [
          { day: 'Monday', tasks: [] },
          { day: 'Tuesday', tasks: [] },
          { day: 'Wednesday', tasks: [] },
          { day: 'Thursday', tasks: [] },
          { day: 'Friday', tasks: [] },
          { day: 'Saturday', tasks: [] },
          { day: 'Sunday', tasks: [] }
        ]
      });
      await timetable.save();
    }

    res.json({ success: true, timetable });
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user timetable
router.post('/timetable', auth, async (req, res) => {
  try {
    const { schedule } = req.body;
    
    let timetable = await Timetable.findOne({ user: req.user.id });
    
    if (!timetable) {
      timetable = new Timetable({
        user: req.user.id,
        schedule
      });
    } else {
      timetable.schedule = schedule;
    }
    
    await timetable.save();
    
    res.json({ success: true, timetable });
  } catch (error) {
    console.error('Error updating timetable:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updateFields = {};
    const allowedFields = ['name', 'email', 'year', 'college', 'background', 'goals', 'phone', 'location'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

module.exports = router;
