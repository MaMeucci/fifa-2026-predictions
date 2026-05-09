const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings (Admin only)
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.updateSettings(req.body);
    
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tournament status
// @route   GET /api/settings/status
// @access  Public
exports.getTournamentStatus = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    const status = {
      tournamentStarted: settings.hasTournamentStarted(),
      tournamentEnded: settings.hasTournamentEnded(),
      predictionsLocked: settings.arePredictionsLocked(),
      startDate: settings.tournament.startDate,
      endDate: settings.tournament.endDate,
      predictionsLockDate: settings.predictionsLockDate,
    };
    
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Capiscione groups
// @route   GET /api/settings/capiscione
// @access  Public
exports.getCapiscioneGroups = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: settings.capiscioneGroups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Capiscione groups (Admin only)
// @route   PUT /api/settings/capiscione
// @access  Private/Admin
exports.updateCapiscioneGroups = async (req, res, next) => {
  try {
    const settings = await Settings.updateSettings({
      capiscioneGroups: req.body,
    });
    
    res.status(200).json({
      success: true,
      data: settings.capiscioneGroups,
      message: 'Capiscione groups updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scoring rules
// @route   GET /api/settings/scoring
// @access  Public
exports.getScoringRules = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      data: settings.scoring,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

// Made with Bob