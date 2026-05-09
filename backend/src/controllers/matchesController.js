const Match = require('../models/Match');

// @desc    Get all matches
// @route   GET /api/matches
// @access  Public
exports.getAllMatches = async (req, res, next) => {
  try {
    const { phase, group, status } = req.query;
    
    // Build query
    const query = {};
    if (phase) query.phase = phase;
    if (group) query.group = group;
    if (status) query.status = status;
    
    const matches = await Match.find(query)
      .sort({ date: 1, matchNumber: 1 });
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
exports.getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches by phase
// @route   GET /api/matches/phase/:phase
// @access  Public
exports.getMatchesByPhase = async (req, res, next) => {
  try {
    const matches = await Match.find({ phase: req.params.phase.toUpperCase() })
      .sort({ date: 1, matchNumber: 1 });
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get matches by group
// @route   GET /api/matches/group/:group
// @access  Public
exports.getMatchesByGroup = async (req, res, next) => {
  try {
    const matches = await Match.find({ 
      phase: 'GROUP',
      group: req.params.group.toUpperCase() 
    }).sort({ date: 1, matchNumber: 1 });
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new match (Admin only)
// @route   POST /api/matches
// @access  Private/Admin
exports.createMatch = async (req, res, next) => {
  try {
    const match = await Match.create(req.body);
    
    res.status(201).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update match (Admin only)
// @route   PUT /api/matches/:id
// @access  Private/Admin
exports.updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update match result (Admin only)
// @route   PUT /api/matches/:id/result
// @access  Private/Admin
exports.updateMatchResult = async (req, res, next) => {
  try {
    const { homeScore, awayScore, penalties } = req.body;
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }
    
    // Update result
    match.result.homeScore = homeScore;
    match.result.awayScore = awayScore;
    
    if (penalties) {
      match.result.penalties = penalties;
    }
    
    // Determine winner
    match.result.winner = match.getWinner();
    
    // Update status
    match.status = 'FINISHED';
    
    await match.save();
    
    res.status(200).json({
      success: true,
      data: match,
      message: 'Match result updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete match (Admin only)
// @route   DELETE /api/matches/:id
// @access  Private/Admin
exports.deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Match deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming matches
// @route   GET /api/matches/upcoming
// @access  Public
exports.getUpcomingMatches = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const matches = await Match.find({
      status: 'SCHEDULED',
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live matches
// @route   GET /api/matches/live
// @access  Public
exports.getLiveMatches = async (req, res, next) => {
  try {
    const matches = await Match.find({ status: 'LIVE' })
      .sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get finished matches
// @route   GET /api/matches/finished
// @access  Public
exports.getFinishedMatches = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const matches = await Match.find({ status: 'FINISHED' })
      .sort({ date: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob