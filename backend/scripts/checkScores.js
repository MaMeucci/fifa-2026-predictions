require('dotenv').config();
const mongoose = require('mongoose');
const Score = require('../src/models/Score');
const User = require('../src/models/User');

const checkScores = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all scores
    const scores = await Score.find().populate('user', 'username role');
    
    console.log(`📊 Found ${scores.length} scores in database\n`);
    
    scores.forEach(score => {
      if (score.user) {
        console.log(`👤 User: ${score.user.username} (${score.user.role})`);
        console.log(`   Total Points: ${score.totalPoints}`);
        console.log(`   Breakdown:`, JSON.stringify(score.breakdown, null, 2));
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkScores()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Made with Bob