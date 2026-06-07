const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect, admin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '', activeOnly = 'false' } = req.query;
    
    const query = {};
    
    // Search by username or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter only active users
    if (activeOnly === 'true') {
      query.isActive = true;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-passwordHash -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -verificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent removing admin role from yourself
    if (user._id.toString() === req.user._id.toString() && role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove admin role from yourself'
      });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
});

// Toggle user active status
router.put('/users/:id/toggle-active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deactivating yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// Reset user password
router.put('/users/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Only allow password reset for local auth users
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reset password for non-local authentication users'
      });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Update password - set it directly and mark as not modified
    // to prevent the pre-save hook from hashing it again
    user.passwordHash = newPassword;
    
    // The pre-save hook will hash it automatically
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successfully',
      data: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/stats/users', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const localUsers = await User.countDocuments({ authProvider: 'local' });
    const auth0Users = await User.countDocuments({ authProvider: 'auth0' });
    
    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        admins: adminUsers,
        regularUsers: totalUsers - adminUsers,
        local: localUsers,
        auth0: auth0Users
      }
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
});

// Get tournament statistics
router.get('/stats/tournament', async (req, res) => {
  try {
    const Match = require('../models/Match');
    const Prediction = require('../models/Prediction');
    const KnockoutResults = require('../models/KnockoutResults');
    
    // Match statistics
    const totalMatches = await Match.countDocuments();
    const finishedMatches = await Match.countDocuments({ status: 'FINISHED' });
    const scheduledMatches = totalMatches - finishedMatches;
    
    // Determine current phase based on finished matches
    let currentPhase = 'Gironi';
    if (finishedMatches >= 48) currentPhase = 'Ottavi di Finale';
    if (finishedMatches >= 56) currentPhase = 'Quarti di Finale';
    if (finishedMatches >= 60) currentPhase = 'Semifinali';
    if (finishedMatches >= 62) currentPhase = 'Finale per 3° posto';
    if (finishedMatches >= 63) currentPhase = 'Finale';
    if (finishedMatches === 104) currentPhase = 'Torneo Concluso';
    
    const tournamentProgress = Math.round((finishedMatches / totalMatches) * 100);
    
    // User participation statistics - using the correct Prediction model
    const totalUsers = await User.countDocuments({ role: 'user' }); // Exclude admins
    const allPredictions = await Prediction.find({}).populate('user');
    
    // Filter out admin predictions
    const userPredictions = allPredictions.filter(p => p.user && p.user.role === 'user');
    const usersWithPredictions = userPredictions.length;
    
    // Count users with complete predictions
    // Complete = has at least 48 group stage predictions + knockout stage filled
    let completeUsers = 0;
    let partialUsers = 0;
    
    userPredictions.forEach(pred => {
      const hasGroupStage = pred.groupStage && pred.groupStage.length >= 48;
      const hasKnockoutStage = pred.knockoutStage &&
                               pred.knockoutStage.round16 &&
                               pred.knockoutStage.round16.length > 0;
      
      if (hasGroupStage && hasKnockoutStage) {
        completeUsers++;
      } else if (pred.groupStage && pred.groupStage.length > 0) {
        partialUsers++;
      }
    });
    
    const completionRate = totalUsers > 0 ? Math.round((completeUsers / totalUsers) * 100) : 0;
    
    // Prediction statistics (only for finished matches)
    const finishedMatchIds = await Match.find({ status: 'FINISHED' });
    
    let exactResults = 0;
    let correctSigns = 0;
    let totalPredictions = 0;
    
    // Count sign distribution
    const signStats = {
      '1': 0,
      'X': 0,
      '2': 0
    };
    
    userPredictions.forEach(userPred => {
      if (!userPred.groupStage) return;
      
      userPred.groupStage.forEach(groupPred => {
        // Find the corresponding finished match
        const finishedMatch = finishedMatchIds.find(m =>
          m._id.toString() === groupPred.match.toString()
        );
        
        if (!finishedMatch || !finishedMatch.result ||
            finishedMatch.result.homeScore === null) {
          return;
        }
        
        totalPredictions++;
        
        const actualHome = finishedMatch.result.homeScore;
        const actualAway = finishedMatch.result.awayScore;
        const predHome = groupPred.homeScore;
        const predAway = groupPred.awayScore;
        
        // Check exact result
        if (actualHome === predHome && actualAway === predAway) {
          exactResults++;
        }
        
        // Check sign
        const actualSign = actualHome > actualAway ? '1' : actualHome < actualAway ? '2' : 'X';
        if (groupPred.sign === actualSign) {
          correctSigns++;
        }
        
        // Count sign distribution
        if (groupPred.sign) {
          signStats[groupPred.sign]++;
        }
      });
    });
    
    const successRate = totalPredictions > 0 ?
      Math.round(((exactResults + correctSigns) / (totalPredictions * 2)) * 100) : 0;
    
    // Top performers
    const topScorers = await Prediction.find({})
      .populate('user', 'username')
      .sort({ 'scores.total': -1 })
      .limit(5);
    
    const topPerformers = topScorers
      .filter(p => p.user && p.user.role === 'user')
      .map(p => ({
        username: p.user.username,
        score: p.scores.total
      }));
    
    // Most difficult match (least correct predictions)
    const matchDifficulty = [];
    for (const match of finishedMatchIds.slice(0, 20)) {
      let correct = 0;
      let total = 0;
      
      userPredictions.forEach(userPred => {
        if (!userPred.groupStage) return;
        
        const matchPred = userPred.groupStage.find(gp =>
          gp.match.toString() === match._id.toString()
        );
        
        if (matchPred && match.result && match.result.homeScore !== null) {
          total++;
          if (matchPred.homeScore === match.result.homeScore &&
              matchPred.awayScore === match.result.awayScore) {
            correct++;
          }
        }
      });
      
      if (total > 0) {
        matchDifficulty.push({
          match: `${match.homeTeam} vs ${match.awayTeam}`,
          correctPredictions: correct,
          totalPredictions: total,
          difficulty: Math.round((correct / total) * 100)
        });
      }
    }
    
    const mostDifficult = matchDifficulty.sort((a, b) => a.difficulty - b.difficulty)[0];
    const mostPredicted = matchDifficulty.sort((a, b) => b.difficulty - a.difficulty)[0];
    
    // Knockout phase statistics
    let winnerPredictions = {};
    let topScorerPredictions = {};
    
    userPredictions.forEach(pred => {
      if (pred.finalRankings?.first?.name) {
        const winner = pred.finalRankings.first.name;
        winnerPredictions[winner] = (winnerPredictions[winner] || 0) + 1;
      }
      if (pred.topScorer?.playerName) {
        const scorer = pred.topScorer.playerName;
        topScorerPredictions[scorer] = (topScorerPredictions[scorer] || 0) + 1;
      }
    });
    
    const mostPredictedWinner = Object.entries(winnerPredictions)
      .sort((a, b) => b[1] - a[1])[0];
    const mostPredictedScorer = Object.entries(topScorerPredictions)
      .sort((a, b) => b[1] - a[1])[0];
    
    res.json({
      success: true,
      data: {
        tournament: {
          totalMatches,
          finishedMatches,
          scheduledMatches,
          currentPhase,
          progress: tournamentProgress
        },
        participation: {
          totalUsers,
          usersWithPredictions,
          completeUsers,
          partialUsers,
          completionRate
        },
        predictions: {
          total: totalPredictions,
          exactResults,
          correctSigns,
          successRate,
          signDistribution: signStats
        },
        topPerformers: topScorers.map(u => ({
          username: u.username,
          score: u.totalScore
        })),
        insights: {
          mostDifficultMatch: mostDifficult,
          mostPredictedMatch: mostPredicted,
          mostPredictedWinner: mostPredictedWinner ? {
            team: mostPredictedWinner[0],
            count: mostPredictedWinner[1]
          } : null,
          mostPredictedScorer: mostPredictedScorer ? {
            player: mostPredictedScorer[0],
            count: mostPredictedScorer[1]
          } : null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tournament statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tournament statistics',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob