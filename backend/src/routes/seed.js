const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Settings = require('../models/Settings');

// Import seed data generator
const { generateGroupMatches, generateKnockoutMatches, createSettingsData } = require('../../scripts/seedDataGenerator');

// Seed endpoint - protected by secret key
router.post('/database', async (req, res) => {
  try {
    // Check for seed secret key
    const seedSecret = req.headers['x-seed-secret'] || req.body.secret;
    
    if (!seedSecret || seedSecret !== process.env.SEED_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Invalid or missing seed secret. Provide X-Seed-Secret header or secret in body.'
      });
    }

    console.log('🌱 Starting database seed via API...');

    // Clear existing data
    await Match.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Cleared existing data');

    // Generate matches
    const groupMatches = generateGroupMatches();
    const knockoutMatches = generateKnockoutMatches();
    const allMatches = [...groupMatches, ...knockoutMatches];

    // Insert matches
    await Match.insertMany(allMatches);
    console.log(`✅ Created ${allMatches.length} matches`);

    // Create settings
    const settingsData = createSettingsData();
    const settings = new Settings(settingsData);
    await settings.save();
    console.log('✅ Settings created');

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        matches: allMatches.length,
        groupMatches: groupMatches.length,
        knockoutMatches: knockoutMatches.length,
        settings: 1
      }
    });

  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Status endpoint to check if database is seeded
router.get('/status', async (req, res) => {
  try {
    const matchCount = await Match.countDocuments();
    const settingsCount = await Settings.countDocuments();
    const groupMatchCount = await Match.countDocuments({ phase: 'GROUP' });
    const knockoutMatchCount = await Match.countDocuments({ phase: { $ne: 'GROUP' } });
    
    res.status(200).json({
      success: true,
      data: {
        isSeeded: matchCount > 0 && settingsCount > 0,
        matches: {
          total: matchCount,
          group: groupMatchCount,
          knockout: knockoutMatchCount
        },
        settings: settingsCount,
        expectedMatches: 104
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking seed status',
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob