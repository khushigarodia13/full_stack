const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');

// Get all students for team finder (excluding current user)
router.get('/students', auth, async (req, res) => {
  try {
    const { scoreRange, year, goals, search } = req.query;
    
    // Build filter query
    let filter = { _id: { $ne: req.user.id } };
    
    if (scoreRange && scoreRange !== 'all') {
      const [min, max] = scoreRange.split('-').map(Number);
      filter.productivityScore = { $gte: min, $lte: max };
    }
    
    if (year && year !== 'all') {
      filter.year = parseInt(year);
    }
    
    if (goals && goals !== 'all') {
      filter.goals = { $regex: goals, $options: 'i' };
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Get students with their latest productivity scores
    const students = await User.find(filter)
      .select('name email year college background goals githubId')
      .lean();

    // Get productivity scores for each student
    const studentsWithScores = await Promise.all(
      students.map(async (student) => {
        const latestLog = await DailyLog.findOne({ user: student._id })
          .sort({ date: -1 })
          .lean();
        
        return {
          ...student,
          productivityScore: latestLog?.productivityScore || 0,
          skills: student.background ? parseSkillsFromBackground(student.background) : []
        };
      })
    );

    // Sort by productivity score (descending)
    studentsWithScores.sort((a, b) => b.productivityScore - a.productivityScore);

    res.json({
      success: true,
      students: studentsWithScores
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send connection request
router.post('/connect', auth, async (req, res) => {
  try {
    const { toUserId, message, hackathonProject } = req.body;
    
    // Check if users can connect
    const canConnect = await Connection.canConnect(req.user.id, toUserId);
    if (!canConnect) {
      return res.status(400).json({ 
        success: false, 
        message: 'Connection already exists or invalid request' 
      });
    }

    // Get sender's productivity score
    const senderLog = await DailyLog.findOne({ user: req.user.id })
      .sort({ date: -1 });
    
    const senderSkills = req.user.background ? 
      parseSkillsFromBackground(req.user.background) : [];

    const connection = new Connection({
      fromUser: req.user.id,
      toUser: toUserId,
      message,
      hackathonProject,
      productivityScore: senderLog?.productivityScore || 0,
      skills: senderSkills
    });

    await connection.save();

    res.json({
      success: true,
      message: 'Connection request sent successfully',
      connection
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get connection requests (incoming and outgoing)
router.get('/requests', auth, async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    let query = {};
    if (type === 'incoming') {
      query = { toUser: req.user.id };
    } else if (type === 'outgoing') {
      query = { fromUser: req.user.id };
    } else {
      query = {
        $or: [
          { toUser: req.user.id },
          { fromUser: req.user.id }
        ]
      };
    }

    const connections = await Connection.find(query)
      .populate('fromUser', 'name email year college')
      .populate('toUser', 'name email year college')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      connections
    });
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Accept/reject connection request
router.put('/requests/:connectionId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { connectionId } = req.params;

    const connection = await Connection.findOne({
      _id: connectionId,
      toUser: req.user.id,
      status: 'pending'
    });

    if (!connection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Connection request not found' 
      });
    }

    connection.status = status;
    connection.updatedAt = new Date();
    await connection.save();

    res.json({
      success: true,
      message: `Connection request ${status}`,
      connection
    });
  } catch (error) {
    console.error('Error updating connection request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get compatible students (based on skill match and productivity score)
router.get('/compatible', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userSkills = currentUser.background ? 
      parseSkillsFromBackground(currentUser.background) : [];

    // Get all students except current user
    const students = await User.find({ _id: { $ne: req.user.id } })
      .select('name email year college background goals')
      .lean();

    // Calculate compatibility scores
    const compatibleStudents = await Promise.all(
      students.map(async (student) => {
        const studentSkills = student.background ? 
          parseSkillsFromBackground(student.background) : [];
        
        const skillMatch = calculateSkillMatch(studentSkills, userSkills);
        
        const latestLog = await DailyLog.findOne({ user: student._id })
          .sort({ date: -1 })
          .lean();
        
        const productivityScore = latestLog?.productivityScore || 0;
        
        // Calculate overall compatibility score
        const compatibilityScore = (skillMatch * 0.6) + (productivityScore * 0.4);
        
        return {
          ...student,
          skillMatch,
          productivityScore,
          compatibilityScore: Math.round(compatibilityScore)
        };
      })
    );

    // Sort by compatibility score
    compatibleStudents.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({
      success: true,
      students: compatibleStudents.slice(0, 10) // Top 10 most compatible
    });
  } catch (error) {
    console.error('Error fetching compatible students:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to parse skills from background
function parseSkillsFromBackground(background) {
  const skillKeywords = [
    'react', 'javascript', 'python', 'java', 'node.js', 'mongodb',
    'sql', 'aws', 'docker', 'kubernetes', 'machine learning', 'ai',
    'data science', 'frontend', 'backend', 'full-stack', 'mobile',
    'android', 'ios', 'flutter', 'react native'
  ];
  
  const skills = [];
  const backgroundLower = background.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (backgroundLower.includes(skill)) {
      // Determine level based on context
      let level = 'Beginner';
      if (backgroundLower.includes('expert') || backgroundLower.includes('advanced')) {
        level = 'Expert';
      } else if (backgroundLower.includes('intermediate')) {
        level = 'Intermediate';
      }
      
      skills.push({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        level
      });
    }
  });
  
  return skills;
}

// Helper function to calculate skill match percentage
function calculateSkillMatch(studentSkills, userSkills) {
  if (!userSkills.length || !studentSkills.length) return 0;
  
  const userSkillNames = userSkills.map(s => s.name.toLowerCase());
  const studentSkillNames = studentSkills.map(s => s.name.toLowerCase());
  
  const commonSkills = userSkillNames.filter(skill => 
    studentSkillNames.includes(skill)
  );
  
  return Math.round((commonSkills.length / userSkillNames.length) * 100);
}

module.exports = router; 