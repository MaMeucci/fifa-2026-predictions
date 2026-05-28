const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Score = require('../models/Score');
const { protect, admin } = require('../middleware/auth');
const { calculateAllScores, calculateUserScore } = require('../services/scoreCalculationService');

// Get leaderboard - public endpoint (no admin required)
router.get('/leaderboard', protect, async (req, res) => {
  try {
    // Get scores for users with role 'user' (exclude admins) and active
    const scores = await Score.find()
      .populate({
        path: 'user',
        match: { role: 'user', isActive: true },
        select: 'username'
      })
      .sort({ totalPoints: -1 });
    
    // Filter out null users (admins or inactive users)
    const validScores = scores.filter(score => score.user !== null);
    
    // Format leaderboard
    const leaderboard = validScores.map((score, index) => {
      const breakdown = score.breakdown || {};
      
      // Calculate category totals
      const groupStageTotal =
        (breakdown.exactResults?.points || 0) +
        (breakdown.correctSigns?.points || 0) +
        (breakdown.bonusExactResults?.points || 0);
      
      const knockoutStageTotal =
        (breakdown.round16Teams?.points || 0) +
        (breakdown.quarterTeams?.points || 0) +
        (breakdown.semiTeams?.points || 0) +
        (breakdown.finalTeams?.points || 0) +
        (breakdown.finalMatchTeams?.points || 0);
      
      const podiumTotal =
        (breakdown.winner?.points || 0) +
        (breakdown.runnerUp?.points || 0) +
        (breakdown.third?.points || 0) +
        (breakdown.fourth?.points || 0) +
        (breakdown.topScorer?.points || 0);
      
      const capiscioneTotal =
        (breakdown.capiscione?.top?.points || 0) +
        (breakdown.capiscione?.outsider?.points || 0) +
        (breakdown.capiscione?.materasso?.points || 0);
      
      return {
        rank: index + 1,
        username: score.user.username,
        userId: score.user._id,
        totalPoints: score.totalPoints || 0,
        exactResults: breakdown.exactResults?.count || 0,
        correctSigns: breakdown.correctSigns?.count || 0,
        groupStageTotal,
        knockoutStageTotal,
        podiumTotal,
        capiscioneTotal,
        trend: 'same' // TODO: Calculate trend based on previous rankings
      };
    });
    
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
    // Get user's score
    const score = await Score.findOne({ user: req.user._id })
      .populate('user', 'username');
    
    if (!score) {
      return res.json({
        success: true,
        data: {
          userId: req.user._id,
          username: req.user.username,
          totalPoints: 0,
          exactResults: 0,
          correctSigns: 0,
          rank: null
        }
      });
    }
    
    // Calculate rank
    const higherScores = await Score.countDocuments({
      totalPoints: { $gt: score.totalPoints }
    });
    const rank = higherScores + 1;
    
    res.json({
      success: true,
      data: {
        userId: score.user._id,
        username: score.user.username,
        totalPoints: score.totalPoints,
        exactResults: score.breakdown?.exactResults?.count || 0,
        correctSigns: score.breakdown?.correctSigns?.count || 0,
        rank
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

// Calculate all scores (admin only)
router.post('/calculate', protect, admin, async (req, res) => {
  try {
    console.log('Starting score calculation...');
    const result = await calculateAllScores();
    
    res.json({
      success: true,
      message: result.message,
      data: {
        scoresCalculated: result.scoresCalculated,
        results: result.results
      }
    });
  } catch (error) {
    console.error('Error calculating scores:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating scores',
      error: error.message
    });
  }
});

// Get detailed score breakdown for a user (admin only)
router.get('/breakdown/:userId', protect, admin, async (req, res) => {
  try {
    const score = await Score.findOne({ user: req.params.userId })
      .populate('user', 'username email');
    
    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found for this user'
      });
    }
    
    res.json({
      success: true,
      data: score
    });
  } catch (error) {
    console.error('Error fetching score breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching score breakdown',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob