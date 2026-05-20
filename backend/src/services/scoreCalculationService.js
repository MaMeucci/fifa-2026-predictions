const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const Score = require('../models/Score');
const User = require('../models/User');

/**
 * Calculate scores for all users based on their predictions and match results
 */
const calculateAllScores = async () => {
  try {
    // Get all users with role 'user' and active status
    const users = await User.find({ role: 'user', isActive: true });
    
    if (users.length === 0) {
      return { success: true, message: 'No active users found', scoresCalculated: 0 };
    }

    // Get all finished matches
    const finishedMatches = await Match.find({ status: 'FINISHED' });
    
    if (finishedMatches.length === 0) {
      return { success: true, message: 'No finished matches found', scoresCalculated: 0 };
    }

    const results = [];

    // Calculate scores for each user
    for (const user of users) {
      try {
        const userScore = await calculateUserScore(user._id, finishedMatches);
        results.push({
          userId: user._id,
          username: user.username,
          totalPoints: userScore.totalPoints,
          success: true
        });
      } catch (error) {
        console.error(`Error calculating score for user ${user.username}:`, error);
        results.push({
          userId: user._id,
          username: user.username,
          error: error.message,
          success: false
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return {
      success: true,
      message: `Scores calculated for ${successCount} out of ${users.length} users`,
      scoresCalculated: successCount,
      results
    };
  } catch (error) {
    console.error('Error in calculateAllScores:', error);
    throw error;
  }
};

/**
 * Calculate score for a single user
 */
const calculateUserScore = async (userId, finishedMatches = null) => {
  try {
    // Get user's prediction
    const prediction = await Prediction.findOne({ user: userId });
    
    if (!prediction) {
      // Create empty score for users without predictions
      const score = await Score.findOneAndUpdate(
        { user: userId },
        {
          user: userId,
          totalPoints: 0,
          breakdown: {
            groupStage: { exactResults: 0, correctSigns: 0, bonuses: 0, points: 0 },
            knockoutStage: {
              round16: { correctTeams: 0, exactPositions: 0, points: 0 },
              quarterFinals: { correctTeams: 0, points: 0 },
              semiFinals: { correctTeams: 0, points: 0 },
              final: { correctTeams: 0, points: 0 }
            },
            finalRankings: { first: 0, second: 0, third: 0, fourth: 0, points: 0 },
            topScorer: { correct: false, points: 0 },
            capiscione: { top: 0, outsider: 0, materasso: 0, points: 0 }
          },
          lastCalculated: new Date()
        },
        { upsert: true, new: true }
      );
      return score;
    }

    // Get finished matches if not provided
    if (!finishedMatches) {
      finishedMatches = await Match.find({ status: 'FINISHED' });
    }

    // Initialize score breakdown
    const breakdown = {
      groupStage: { exactResults: 0, correctSigns: 0, bonuses: 0, points: 0 },
      knockoutStage: {
        round16: { correctTeams: 0, exactPositions: 0, points: 0 },
        quarterFinals: { correctTeams: 0, points: 0 },
        semiFinals: { correctTeams: 0, points: 0 },
        final: { correctTeams: 0, points: 0 }
      },
      finalRankings: { first: 0, second: 0, third: 0, fourth: 0, points: 0 },
      topScorer: { correct: false, points: 0 },
      capiscione: { top: 0, outsider: 0, materasso: 0, points: 0 }
    };

    // Calculate group stage points
    const groupStagePoints = calculateGroupStagePoints(prediction, finishedMatches, breakdown);
    
    // Calculate knockout stage points (TODO: implement when knockout results are available)
    // const knockoutPoints = calculateKnockoutPoints(prediction, breakdown);
    
    // Calculate final rankings points (TODO: implement when tournament ends)
    // const finalRankingsPoints = calculateFinalRankingsPoints(prediction, breakdown);
    
    // Calculate top scorer points (TODO: implement when tournament ends)
    // const topScorerPoints = calculateTopScorerPoints(prediction, breakdown);
    
    // Calculate capiscione points (TODO: implement when tournament ends)
    // const capiscionePoints = calculateCapiscionePoints(prediction, breakdown);

    // Calculate total points
    const totalPoints = groupStagePoints; // + knockoutPoints + finalRankingsPoints + topScorerPoints + capiscionePoints;

    // Save or update score
    const score = await Score.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        totalPoints,
        breakdown,
        lastCalculated: new Date()
      },
      { upsert: true, new: true }
    );

    return score;
  } catch (error) {
    console.error(`Error calculating score for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Calculate group stage points
 */
const calculateGroupStagePoints = (prediction, finishedMatches, breakdown) => {
  let points = 0;
  let exactResults = 0;
  let correctSigns = 0;

  // Create a map of finished matches by match ID
  const matchResultsMap = new Map();
  finishedMatches.forEach(match => {
    if (match.phase === 'GROUP' && match.result.homeScore !== null && match.result.awayScore !== null) {
      matchResultsMap.set(match._id.toString(), match);
    }
  });

  // Check each prediction against actual results
  prediction.groupStage.forEach(pred => {
    const matchId = pred.match.toString();
    const actualMatch = matchResultsMap.get(matchId);
    
    if (!actualMatch) return; // Match not finished yet

    const predictedHome = pred.homeScore;
    const predictedAway = pred.awayScore;
    const actualHome = actualMatch.result.homeScore;
    const actualAway = actualMatch.result.awayScore;

    // Check for exact result (6 points)
    if (predictedHome === actualHome && predictedAway === actualAway) {
      points += 6;
      exactResults++;
    } else {
      // Check for correct sign (3 points)
      // The user's sign (pred.sign) should match the actual result sign
      const actualSign = getSign(actualHome, actualAway);
      
      if (pred.sign === actualSign) {
        points += 3;
        correctSigns++;
      }
    }
  });

  // Add bonus for every 5 exact results (5 points)
  const bonuses = Math.floor(exactResults / 5);
  const bonusPoints = bonuses * 5;
  points += bonusPoints;

  // Update breakdown
  breakdown.groupStage.exactResults = exactResults;
  breakdown.groupStage.correctSigns = correctSigns;
  breakdown.groupStage.bonuses = bonuses;
  breakdown.groupStage.points = points;

  return points;
};

/**
 * Get sign from scores (1=Home win, X=Draw, 2=Away win)
 */
const getSign = (homeScore, awayScore) => {
  if (homeScore > awayScore) return '1';
  if (homeScore < awayScore) return '2';
  return 'X';
};

/**
 * Calculate knockout stage points
 * TODO: Implement when knockout results are available
 */
const calculateKnockoutPoints = (prediction, breakdown) => {
  let points = 0;
  
  // Round of 16: 20 points per correct team, +5 for exact position
  // Quarter-finals: 20 points per correct team
  // Semi-finals: 30 points per correct team
  // Final: 50 points per correct team
  
  // This will be implemented when we have actual knockout results
  
  return points;
};

/**
 * Calculate final rankings points
 * TODO: Implement when tournament ends
 */
const calculateFinalRankingsPoints = (prediction, breakdown) => {
  let points = 0;
  
  // 1st place: 80 points
  // 2nd place: 50 points
  // 3rd place: 25 points
  // 4th place: 25 points
  
  // This will be implemented when tournament ends
  
  return points;
};

/**
 * Calculate top scorer points
 * TODO: Implement when tournament ends
 */
const calculateTopScorerPoints = (prediction, breakdown) => {
  let points = 0;
  
  // Correct top scorer: 30 points
  
  // This will be implemented when tournament ends
  
  return points;
};

/**
 * Calculate capiscione points
 * TODO: Implement when tournament ends
 */
const calculateCapiscionePoints = (prediction, breakdown) => {
  let points = 0;
  
  // Top group: 25 points
  // Outsider group: 20 points
  // Materasso group: 15 points
  
  // This will be implemented when tournament ends
  
  return points;
};

module.exports = {
  calculateAllScores,
  calculateUserScore
};

// Made with Bob