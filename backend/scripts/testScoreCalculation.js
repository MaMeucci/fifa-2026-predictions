require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('../src/models/Match');
const Prediction = require('../src/models/Prediction');
const User = require('../src/models/User');
const Score = require('../src/models/Score');
const { calculateAllScores } = require('../src/services/scoreCalculationService');

const testScoreCalculation = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Check for finished matches
    console.log('📊 Checking for finished matches...');
    const finishedMatches = await Match.find({ status: 'FINISHED' });
    console.log(`Found ${finishedMatches.length} finished matches\n`);

    if (finishedMatches.length > 0) {
      console.log('Sample finished matches:');
      finishedMatches.slice(0, 3).forEach(match => {
        console.log(`  - ${match.homeTeam.name} ${match.result.homeScore}-${match.result.awayScore} ${match.awayTeam.name}`);
      });
      console.log('');
    }

    // 2. Check for users with predictions
    console.log('👥 Checking for users with predictions...');
    const users = await User.find({ role: 'user', isActive: true });
    console.log(`Found ${users.length} active users\n`);

    const predictions = await Prediction.find();
    console.log(`Found ${predictions.length} predictions\n`);

    if (predictions.length > 0) {
      console.log('Sample predictions:');
      for (const pred of predictions.slice(0, 2)) {
        const user = await User.findById(pred.user);
        console.log(`  - User: ${user.username}`);
        console.log(`    Group stage predictions: ${pred.groupStage.length}`);
        console.log('');
      }
    }

    // 3. Calculate scores
    console.log('🧮 Calculating scores...');
    const result = await calculateAllScores();
    
    console.log('\n📈 Calculation Results:');
    console.log(`  Success: ${result.success}`);
    console.log(`  Message: ${result.message}`);
    console.log(`  Scores calculated: ${result.scoresCalculated}\n`);

    if (result.results && result.results.length > 0) {
      console.log('Individual results:');
      result.results.forEach(r => {
        if (r.success) {
          console.log(`  ✅ ${r.username}: ${r.totalPoints} points`);
        } else {
          console.log(`  ❌ ${r.username}: ${r.error}`);
        }
      });
      console.log('');
    }

    // 4. Display leaderboard
    console.log('🏆 Current Leaderboard:');
    const scores = await Score.find()
      .populate('user', 'username')
      .sort({ totalPoints: -1 })
      .limit(10);

    if (scores.length === 0) {
      console.log('  No scores found yet.\n');
    } else {
      scores.forEach((score, index) => {
        if (score.user) {
          console.log(`  ${index + 1}. ${score.user.username}: ${score.totalPoints} points`);
          if (score.breakdown && score.breakdown.groupStage) {
            console.log(`     - Exact results: ${score.breakdown.groupStage.exactResults}`);
            console.log(`     - Correct signs: ${score.breakdown.groupStage.correctSigns}`);
            console.log(`     - Bonuses: ${score.breakdown.groupStage.bonuses}`);
          }
        }
      });
      console.log('');
    }

    // 5. Detailed breakdown for top user
    if (scores.length > 0 && scores[0].user && scores[0].breakdown && scores[0].breakdown.groupStage) {
      console.log(`📊 Detailed breakdown for ${scores[0].user.username}:`);
      const topScore = scores[0];
      console.log(`  Group Stage:`);
      console.log(`    - Exact results: ${topScore.breakdown.groupStage.exactResults} (${topScore.breakdown.groupStage.exactResults * 6} points)`);
      console.log(`    - Correct signs: ${topScore.breakdown.groupStage.correctSigns} (${topScore.breakdown.groupStage.correctSigns * 3} points)`);
      console.log(`    - Bonuses: ${topScore.breakdown.groupStage.bonuses} (${topScore.breakdown.groupStage.bonuses * 5} points)`);
      console.log(`    - Total: ${topScore.breakdown.groupStage.points} points`);
      console.log('');
    }

    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Error during test:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the test
testScoreCalculation()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });

// Made with Bob