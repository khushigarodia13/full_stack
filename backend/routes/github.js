const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/github/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user.githubId) {
      return res.status(400).json({ message: "GitHub not connected" });
    }
    // Fetch public events from GitHub API
    const githubRes = await axios.get(`https://api.github.com/user/${user.githubId}/events/public`);
    res.json({ events: githubRes.data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch GitHub activity" });
  }
});

module.exports = router;