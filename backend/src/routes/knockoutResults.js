const express = require('express');
const router = express.Router();
const KnockoutResults = require('../models/KnockoutResults');
const { protect, admin } = require('../middleware/auth');

// Get knockout results (public for users to see)
router.get('/', protect, async (req, res) => {
  try {
    let results = await KnockoutResults.findOne();
    
    // If no results exist yet, create empty structure
    if (!results) {
      results = new KnockoutResults({
        round32: [],
        round16: [],
        quarterFinals: [],
        semiFinals: [],
        final: {},
        thirdPlace: {},
        finalRankings: {},
        topScorer: {}
      });
      await results.save();
    }
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching knockout results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching knockout results',
      error: error.message
    });
  }
});

// Update knockout results (admin only)
router.put('/', protect, admin, async (req, res) => {
  try {
    const {
      round32,
      round16,
      quarterFinals,
      semiFinals,
      final,
      thirdPlace,
      finalRankings,
      topScorer
    } = req.body;
    
    let results = await KnockoutResults.findOne();
    
    if (!results) {
      results = new KnockoutResults();
    }
    
    // Update only provided fields
    if (round32 !== undefined) results.round32 = round32;
    if (round16 !== undefined) results.round16 = round16;
    if (quarterFinals !== undefined) results.quarterFinals = quarterFinals;
    if (semiFinals !== undefined) results.semiFinals = semiFinals;
    if (final !== undefined) results.final = final;
    if (thirdPlace !== undefined) results.thirdPlace = thirdPlace;
    if (finalRankings !== undefined) results.finalRankings = finalRankings;
    if (topScorer !== undefined) results.topScorer = topScorer;
    
    results.lastUpdated = new Date();
    
    await results.save();
    
    res.json({
      success: true,
      message: 'Knockout results updated successfully',
      data: results
    });
  } catch (error) {
    console.error('Error updating knockout results:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating knockout results',
      error: error.message
    });
  }
});

// Update specific round (admin only)
router.put('/round/:roundName', protect, admin, async (req, res) => {
  try {
    const { roundName } = req.params;
    const roundData = req.body;
    
    const validRounds = ['round32', 'round16', 'quarterFinals', 'semiFinals', 'final', 'thirdPlace', 'finalRankings', 'topScorer'];
    
    if (!validRounds.includes(roundName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid round name. Must be one of: ${validRounds.join(', ')}`
      });
    }
    
    let results = await KnockoutResults.findOne();
    
    if (!results) {
      results = new KnockoutResults();
    }
    
    results[roundName] = roundData;
    results.lastUpdated = new Date();
    
    await results.save();
    
    res.json({
      success: true,
      message: `${roundName} updated successfully`,
      data: results
    });
  } catch (error) {
    console.error(`Error updating ${req.params.roundName}:`, error);
    res.status(500).json({
      success: false,
      message: `Error updating ${req.params.roundName}`,
      error: error.message
    });
  }
});

// Delete all knockout results (admin only, for testing)
router.delete('/', protect, admin, async (req, res) => {
  try {
    await KnockoutResults.deleteMany({});
    
    res.json({
      success: true,
      message: 'All knockout results deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting knockout results:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting knockout results',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob
