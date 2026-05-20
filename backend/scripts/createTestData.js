require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('../src/models/Match');
const Prediction = require('../src/models/Prediction');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

const createTestData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Create test users
    console.log('👥 Creating test users...');
    
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const testUsers = [
      {
        username: 'mario_rossi',
        email: 'mario.rossi@test.com',
        passwordHash: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        username: 'luigi_verdi',
        email: 'luigi.verdi@test.com',
        passwordHash: hashedPassword,
        role: 'user',
        isActive: true
      },
      {
        username: 'anna_bianchi',
        email: 'anna.bianchi@test.com',
        passwordHash: hashedPassword,
        role: 'user',
        isActive: true
      }
    ];

    // Delete existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    
    const createdUsers = await User.insertMany(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users\n`);

    // 2. Get first 5 matches from the database
    console.log('🏟️  Getting matches...');
    const matches = await Match.find({ phase: 'GROUP' })
      .sort({ date: 1 })
      .limit(5);
    
    if (matches.length === 0) {
      console.log('❌ No matches found in database. Please seed matches first.');
      return;
    }
    
    console.log(`✅ Found ${matches.length} matches\n`);

    // 3. Set some matches as FINISHED with results
    console.log('⚽ Setting match results...');
    
    const matchResults = [
      { homeScore: 2, awayScore: 1 }, // Home win
      { homeScore: 1, awayScore: 1 }, // Draw
      { homeScore: 0, awayScore: 2 }, // Away win
      { homeScore: 3, awayScore: 0 }, // Home win
      { homeScore: 2, awayScore: 2 }, // Draw
    ];

    for (let i = 0; i < Math.min(matches.length, matchResults.length); i++) {
      matches[i].status = 'FINISHED';
      matches[i].result.homeScore = matchResults[i].homeScore;
      matches[i].result.awayScore = matchResults[i].awayScore;
      
      if (matchResults[i].homeScore > matchResults[i].awayScore) {
        matches[i].result.winner = 'HOME';
      } else if (matchResults[i].homeScore < matchResults[i].awayScore) {
        matches[i].result.winner = 'AWAY';
      } else {
        matches[i].result.winner = 'DRAW';
      }
      
      await matches[i].save();
      console.log(`  ✅ ${matches[i].homeTeam.name} ${matchResults[i].homeScore}-${matchResults[i].awayScore} ${matches[i].awayTeam.name}`);
    }
    console.log('');

    // 4. Create predictions for each user
    console.log('📝 Creating predictions...');
    
    // Delete existing predictions for test users
    await Prediction.deleteMany({ user: { $in: createdUsers.map(u => u._id) } });

    for (const user of createdUsers) {
      const groupStagePredictions = [];
      
      // User 1 (mario_rossi): 3 exact results, 1 correct sign
      // User 2 (luigi_verdi): 1 exact result, 2 correct signs
      // User 3 (anna_bianchi): 2 exact results, 1 correct sign
      
      let predictions;
      if (user.username === 'mario_rossi') {
        predictions = [
          { homeScore: 2, awayScore: 1, sign: '1' }, // Exact
          { homeScore: 1, awayScore: 1, sign: 'X' }, // Exact
          { homeScore: 0, awayScore: 2, sign: '2' }, // Exact
          { homeScore: 2, awayScore: 0, sign: '1' }, // Correct sign only
          { homeScore: 1, awayScore: 1, sign: 'X' }, // Wrong
        ];
      } else if (user.username === 'luigi_verdi') {
        predictions = [
          { homeScore: 2, awayScore: 1, sign: '1' }, // Exact
          { homeScore: 2, awayScore: 0, sign: '1' }, // Wrong
          { homeScore: 1, awayScore: 2, sign: '2' }, // Correct sign only
          { homeScore: 3, awayScore: 1, sign: '1' }, // Correct sign only
          { homeScore: 0, awayScore: 0, sign: 'X' }, // Wrong
        ];
      } else {
        predictions = [
          { homeScore: 2, awayScore: 1, sign: '1' }, // Exact
          { homeScore: 0, awayScore: 0, sign: 'X' }, // Wrong
          { homeScore: 0, awayScore: 2, sign: '2' }, // Exact
          { homeScore: 2, awayScore: 0, sign: '1' }, // Wrong
          { homeScore: 3, awayScore: 1, sign: '1' }, // Wrong
        ];
      }

      for (let i = 0; i < Math.min(matches.length, predictions.length); i++) {
        groupStagePredictions.push({
          match: matches[i]._id,
          homeScore: predictions[i].homeScore,
          awayScore: predictions[i].awayScore,
          sign: predictions[i].sign
        });
      }

      const prediction = new Prediction({
        user: user._id,
        groupStage: groupStagePredictions,
        knockoutStage: {
          round16: [],
          quarterFinals: [],
          semiFinals: [],
          final: []
        },
        finalRankings: {},
        topScorer: {},
        capiscione: {}
      });

      await prediction.save();
      console.log(`  ✅ Created predictions for ${user.username}`);
    }
    console.log('');

    console.log('✅ Test data created successfully!');
    console.log('\nExpected scores:');
    console.log('  - mario_rossi: 3 exact (18 pts) + 1 sign (3 pts) = 21 points');
    console.log('  - luigi_verdi: 1 exact (6 pts) + 2 signs (6 pts) = 12 points');
    console.log('  - anna_bianchi: 2 exact (12 pts) + 0 signs = 12 points');
    console.log('\nRun: node scripts/testScoreCalculation.js to verify');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the script
createTestData()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });

// Made with Bob