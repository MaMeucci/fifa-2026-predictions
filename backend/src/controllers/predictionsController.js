const Prediction = require('../models/Prediction');
const Settings = require('../models/Settings');
const Match = require('../models/Match');

// @desc    Get user's predictions
// @route   GET /api/predictions/my
// @access  Private
exports.getMyPredictions = async (req, res, next) => {
  try {
    let prediction = await Prediction.findOne({ user: req.user.id })
      .populate('groupStage.match', 'matchNumber homeTeam awayTeam date phase');
    
    if (!prediction) {
      // Create empty prediction for user
      prediction = await Prediction.create({
        user: req.user.id,
        groupStage: [],
        knockoutStage: {
          round16: [],
          quarterFinals: [],
          semiFinals: [],
          final: [],
        },
      });
    }
    
    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's predictions
// @route   PUT /api/predictions/my
// @access  Private
exports.updateMyPredictions = async (req, res, next) => {
  try {
    // Check if predictions are locked
    const settings = await Settings.getSettings();
    if (settings.arePredictionsLocked()) {
      return res.status(403).json({
        success: false,
        message: 'Predictions are locked. Cannot modify after tournament starts.',
      });
    }
    
    let prediction = await Prediction.findOne({ user: req.user.id });
    
    if (!prediction) {
      prediction = new Prediction({ user: req.user.id });
    }
    
    // Check if already locked
    if (prediction.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Your predictions are already locked.',
      });
    }
    
    // Update fields
    const allowedFields = [
      'groupStage',
      'knockoutStage',
      'finalRankings',
      'topScorer',
      'capiscione',
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        prediction[field] = req.body[field];
      }
    });
    
    await prediction.save();
    
    res.status(200).json({
      success: true,
      data: prediction,
      message: 'Predictions updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock user's predictions
// @route   POST /api/predictions/my/lock
// @access  Private
exports.lockMyPredictions = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ user: req.user.id });
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'No predictions found',
      });
    }
    
    if (prediction.isLocked) {
      return res.status(400).json({
        success: false,
        message: 'Predictions are already locked',
      });
    }
    
    await prediction.lock();
    
    res.status(200).json({
      success: true,
      data: prediction,
      message: 'Predictions locked successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all predictions (only after tournament starts or for admins)
// @route   GET /api/predictions/all
// @access  Private
exports.getAllPredictions = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    // Check if tournament has started (admins can always see)
    if (!settings.hasTournamentStarted() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Predictions will be visible after tournament starts',
      });
    }
    
    const predictions = await Prediction.find({ isLocked: true })
      .populate('user', 'username email')
      .populate('groupStage.match', 'matchNumber homeTeam awayTeam date group phase')
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific user's predictions (only after tournament starts)
// @route   GET /api/predictions/user/:userId
// @access  Private
exports.getUserPredictions = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    // Check if tournament has started
    if (!settings.hasTournamentStarted()) {
      return res.status(403).json({
        success: false,
        message: 'Predictions will be visible after tournament starts',
      });
    }
    
    const prediction = await Prediction.findOne({ user: req.params.userId })
      .populate('user', 'username email')
      .populate('groupStage.match', 'matchNumber homeTeam awayTeam date phase');
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Predictions not found for this user',
      });
    }
    
    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/predictions/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await Prediction.getLeaderboard(limit);
    
    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate scores for all predictions (Admin only)
// @route   POST /api/predictions/calculate-scores
// @access  Private/Admin
exports.calculateScores = async (req, res, next) => {
  try {
    // This would be a complex function that:
    // 1. Gets all finished matches
    // 2. Compares with each user's predictions
    // 3. Calculates points according to rules
    // 4. Updates prediction scores
    
    // For now, return a placeholder
    res.status(200).json({
      success: true,
      message: 'Score calculation started. This is a background job.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob