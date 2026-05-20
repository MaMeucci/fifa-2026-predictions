const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get leaderboard - public endpoint (no admin required)
router.get('/leaderboard', protect, async (req, res) => {
  try {
    // Get only users with role 'user' (exclude admins) and active
    const users = await User.find({ 
      role: 'user',
      isActive: true 
    })
      .select('username')
      .sort({ createdAt: 1 }); // For now, sort by registration date
    
    // TODO: When score calculation is implemented, sort by totalPoints
    // For now, return users with mock scores
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      userId: user._id,
      totalPoints: 0, // TODO: Calculate from predictions
      exactResults: 0,
      correctSigns: 0,
      trend: 'same'
    }));
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// Get my score
router.get('/my-score', protect, async (req, res) => {
  try {
    // TODO: Calculate user's actual score from predictions
    // For now, return mock data
    res.json({
      success: true,
      data: {
        userId: req.user._id,
        username: req.user.username,
        totalPoints: 0,
        exactResults: 0,
        correctSigns: 0,
        rank: 1
      }
    });
  } catch (error) {
    console.error('Error fetching user score:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user score',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob