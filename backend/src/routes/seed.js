const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Settings = require('../models/Settings');

// Import seed script
const path = require('path');
const seedScriptPath = path.join(__dirname, '../../scripts/seedDatabase.js');

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

    // Load and execute seed script functions
    delete require.cache[require.resolve(seedScriptPath)];
    const seedModule = require(seedScriptPath);
    
    // Since the seed script doesn't export functions, we'll recreate them inline
    // This is a simplified version that calls the MongoDB operations directly
    
    // Execute the seed by spawning the script
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
      const { stdout, stderr } = await execPromise('node scripts/seedDatabase.js', {
        cwd: path.join(__dirname, '../..'),
        env: { ...process.env }
      });
      
      console.log('Seed output:', stdout);
      if (stderr) console.error('Seed errors:', stderr);
      
      // Count documents
      const matchCount = await Match.countDocuments();
      const settingsCount = await Settings.countDocuments();
      
      res.status(200).json({
        success: true,
        message: 'Database seeded successfully via script execution',
        data: {
          matches: matchCount,
          settings: settingsCount,
          output: stdout
        }
      });
    } catch (execError) {
      throw new Error(`Seed script execution failed: ${execError.message}`);
    }

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