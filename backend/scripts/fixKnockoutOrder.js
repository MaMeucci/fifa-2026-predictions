const mongoose = require('mongoose');
require('dotenv').config();

const KnockoutResults = require('../src/models/KnockoutResults');

async function fixKnockoutOrder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get current knockout results
    const results = await KnockoutResults.findOne();
    
    if (!results) {
      console.log('❌ No knockout results found');
      return;
    }

    console.log('\n📊 Current data:');
    console.log('Round32 matches:', results.round32.length);
    console.log('Round16 matches:', results.round16.length);
    console.log('QuarterFinals matches:', results.quarterFinals.length);
    console.log('SemiFinals matches:', results.semiFinals.length);

    // Sort each phase by matchNumber
    if (results.round32 && results.round32.length > 0) {
      results.round32.sort((a, b) => a.matchNumber - b.matchNumber);
      console.log('\n✅ Sorted round32 by matchNumber');
    }

    if (results.round16 && results.round16.length > 0) {
      results.round16.sort((a, b) => a.matchNumber - b.matchNumber);
      console.log('✅ Sorted round16 by matchNumber');
    }

    if (results.quarterFinals && results.quarterFinals.length > 0) {
      results.quarterFinals.sort((a, b) => a.matchNumber - b.matchNumber);
      console.log('✅ Sorted quarterFinals by matchNumber');
    }

    if (results.semiFinals && results.semiFinals.length > 0) {
      results.semiFinals.sort((a, b) => a.matchNumber - b.matchNumber);
      console.log('✅ Sorted semiFinals by matchNumber');
    }

    // Save the sorted results
    await results.save();
    console.log('\n✅ Knockout results order fixed and saved!');

    // Display first few teams from round32 to verify
    console.log('\n📋 First 6 teams in round32 (after fix):');
    results.round32.slice(0, 3).forEach((match, i) => {
      console.log(`  Match ${match.matchNumber}: ${match.team1?.name || '-'} vs ${match.team2?.name || '-'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixKnockoutOrder();

// Made with Bob
