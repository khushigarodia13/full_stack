const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');

// Get today's productivity data
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyLog = await DailyLog.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!dailyLog) {
      dailyLog = new DailyLog({
        user: req.user.id,
        date: today,
        tasks: [],
        completedTasks: [],
        totalTasks: 0,
        productivityScore: 0,
        resumeActions: [],
        jobPrepProgress: 0
      });
      await dailyLog.save();
    }

    res.json({
      success: true,
      dailyLog
    });
  } catch (error) {
    console.error('Error fetching today\'s productivity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add or update a task for today
router.post('/add-task', auth, async (req, res) => {
  try {
    const { name, time, duration } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let dailyLog = await DailyLog.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    if (!dailyLog) {
      dailyLog = new DailyLog({
        user: req.user.id,
        date: today,
        tasks: [],
        completedTasks: [],
        totalTasks: 0,
        productivityScore: 0,
        resumeActions: [],
        jobPrepProgress: 0
      });
    }
    // Check if task already exists (by name+time)
    const existing = dailyLog.tasks.find(t => t.name === name && t.time === time);
    if (!existing) {
      dailyLog.tasks.push({ name, time, duration, completed: false });
      dailyLog.totalTasks = dailyLog.tasks.length;
      await dailyLog.save();
    }
    res.json({ success: true, dailyLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add task', error: error.message });
  }
});

// Delete a task for today
router.post('/delete-task', auth, async (req, res) => {
  try {
    const { name, time } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let dailyLog = await DailyLog.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    if (dailyLog) {
      dailyLog.tasks = dailyLog.tasks.filter(t => !(t.name === name && t.time === time));
      dailyLog.totalTasks = dailyLog.tasks.length;
      await dailyLog.save();
    }
    res.json({ success: true, dailyLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
});

// Update /complete-task to mark a task as completed/uncompleted in tasks array
router.post('/complete-task', auth, async (req, res) => {
  try {
    const { taskName, completed } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let dailyLog = await DailyLog.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    if (!dailyLog) {
      dailyLog = new DailyLog({
        user: req.user.id,
        date: today,
        tasks: [],
        completedTasks: [],
        totalTasks: 0,
        productivityScore: 0,
        resumeActions: [],
        jobPrepProgress: 0
      });
    }
    // Update completed state in tasks array
    dailyLog.tasks = dailyLog.tasks.map(t =>
      t.name === taskName ? { ...t.toObject(), completed } : t
    );
    // Update completedTasks for legacy support
    if (completed) {
      if (!dailyLog.completedTasks.includes(taskName)) {
        dailyLog.completedTasks.push(taskName);
      }
    } else {
      dailyLog.completedTasks = dailyLog.completedTasks.filter(task => task !== taskName);
    }
    // Update totalTasks
    dailyLog.totalTasks = dailyLog.tasks.length;
    // Calculate productivity score
    const taskCompletionRate = dailyLog.totalTasks > 0 ? 
      (dailyLog.tasks.filter(t => t.completed).length / dailyLog.totalTasks) * 100 : 0;
    const resumeProgressRate = Math.min(dailyLog.resumeActions.length / 10, 1) * 100;
    const jobPrepRate = dailyLog.jobPrepProgress;
    dailyLog.productivityScore = Math.round(
      (taskCompletionRate * 0.4 + resumeProgressRate * 0.3 + jobPrepRate * 0.3)
    );
    await dailyLog.save();
    res.json({ success: true, dailyLog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task completion', error: error.message });
  }
});

// Add resume action
router.post('/resume-action', auth, async (req, res) => {
  try {
    const { action } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyLog = await DailyLog.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!dailyLog) {
      dailyLog = new DailyLog({
        user: req.user.id,
        date: today,
        completedTasks: [],
        totalTasks: 0,
        productivityScore: 0,
        resumeActions: [],
        jobPrepProgress: 0
      });
    }

    dailyLog.resumeActions.push({
      action,
      timestamp: new Date()
    });

    // Recalculate productivity score
    const taskCompletionRate = dailyLog.totalTasks > 0 ? 
      (dailyLog.completedTasks.length / dailyLog.totalTasks) * 100 : 0;
    const resumeProgressRate = Math.min(dailyLog.resumeActions.length / 10, 1) * 100;
    const jobPrepRate = dailyLog.jobPrepProgress;

    dailyLog.productivityScore = Math.round(
      (taskCompletionRate * 0.4 + resumeProgressRate * 0.3 + jobPrepRate * 0.3)
    );

    await dailyLog.save();

    res.json({
      success: true,
      dailyLog
    });
  } catch (error) {
    console.error('Error adding resume action:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update job prep progress
router.post('/job-prep-progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyLog = await DailyLog.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!dailyLog) {
      dailyLog = new DailyLog({
        user: req.user.id,
        date: today,
        completedTasks: [],
        totalTasks: 0,
        productivityScore: 0,
        resumeActions: [],
        jobPrepProgress: 0
      });
    }

    dailyLog.jobPrepProgress = Math.min(Math.max(progress, 0), 100);

    // Recalculate productivity score
    const taskCompletionRate = dailyLog.totalTasks > 0 ? 
      (dailyLog.completedTasks.length / dailyLog.totalTasks) * 100 : 0;
    const resumeProgressRate = Math.min(dailyLog.resumeActions.length / 10, 1) * 100;
    const jobPrepRate = dailyLog.jobPrepProgress;

    dailyLog.productivityScore = Math.round(
      (taskCompletionRate * 0.4 + resumeProgressRate * 0.3 + jobPrepRate * 0.3)
    );

    await dailyLog.save();

    res.json({
      success: true,
      dailyLog
    });
  } catch (error) {
    console.error('Error updating job prep progress:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get productivity history (last 7 days)
router.get('/history', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const history = await DailyLog.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching productivity history:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router; 