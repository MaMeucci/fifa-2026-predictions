const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const Score = require('../models/Score');
const User = require('../models/User');
const KnockoutResults = require('../models/KnockoutResults');

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

    // Initialize score breakdown matching Score model structure
    const breakdown = {
      exactResults: { count: 0, points: 0 },
      correctSigns: { count: 0, points: 0 },
      bonusExactResults: { count: 0, points: 0 },
      round16Teams: { correct: 0, exactPosition: 0, points: 0 },
      quarterTeams: { correct: 0, points: 0 },
      semiTeams: { correct: 0, points: 0 },
      finalTeams: { correct: 0, points: 0 },
      winner: { correct: false, points: 0 },
      runnerUp: { correct: false, points: 0 },
      third: { correct: false, points: 0 },
      fourth: { correct: false, points: 0 },
      topScorer: { correct: false, points: 0 },
      capiscione: {
        top: { correct: false, points: 0 },
        outsider: { correct: false, points: 0 },
        materasso: { correct: false, points: 0 }
      }
    };

    // Calculate group stage points
    const groupStagePoints = calculateGroupStagePoints(prediction, finishedMatches, breakdown);
    
    // Calculate knockout stage points
    const knockoutPoints = await calculateKnockoutPoints(prediction, breakdown);
    
    // Calculate final rankings points
    const finalRankingsPoints = await calculateFinalRankingsPoints(prediction, breakdown);
    
    // Calculate top scorer points
    const topScorerPoints = await calculateTopScorerPoints(prediction, breakdown);
    
    // Calculate capiscione points
    const capiscionePoints = await calculateCapiscionePoints(prediction, breakdown);

    // Calculate total points
    const totalPoints = groupStagePoints + knockoutPoints + finalRankingsPoints + topScorerPoints + capiscionePoints;

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
    }
    
    // ALWAYS check for correct sign (3 points) - independent from exact result
    // The user's sign (pred.sign) should match the actual result sign
    const actualSign = getSign(actualHome, actualAway);
    
    if (pred.sign === actualSign) {
      points += 3;
      correctSigns++;
    }
  });

  // Add bonus for every 5 exact results (5 points)
  const bonuses = Math.floor(exactResults / 5);
  const bonusPoints = bonuses * 5;
  points += bonusPoints;

  // Update breakdown matching Score model structure
  breakdown.exactResults.count = exactResults;
  breakdown.exactResults.points = exactResults * 6;
  breakdown.correctSigns.count = correctSigns;
  breakdown.correctSigns.points = correctSigns * 3;
  breakdown.bonusExactResults.count = bonuses;
  breakdown.bonusExactResults.points = bonusPoints;

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
 */
const calculateKnockoutPoints = async (prediction, breakdown) => {
  let points = 0;
  
  try {
    const knockoutResults = await KnockoutResults.findOne();
    
    if (!knockoutResults) {
      return 0; // No results yet
    }
    
    // Round of 32 (Sedicesimi): 20 points per correct team
    if (prediction.knockoutStage?.round16 && knockoutResults.round32) {
      const predictedTeams = prediction.knockoutStage.round16
        .map(t => t.team?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      const actualTeams = knockoutResults.round32
        .map(m => m.winner?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      
      let correctTeams = 0;
      let exactPositions = 0;
      
      predictedTeams.forEach((teamCode, index) => {
        if (teamCode && actualTeams.includes(teamCode)) {
          correctTeams++;
          points += 20;
          
          // Check if position is exact (+5 points)
          if (actualTeams[index] === teamCode) {
            exactPositions++;
            points += 5;
          }
        }
      });
      
      breakdown.round16Teams.correct = correctTeams;
      breakdown.round16Teams.exactPosition = exactPositions;
      breakdown.round16Teams.points = correctTeams * 20 + exactPositions * 5;
    }
    
    // Round of 16 (Ottavi): 20 points per correct team
    if (prediction.knockoutStage?.quarterFinals && knockoutResults.round16) {
      const predictedTeams = prediction.knockoutStage.quarterFinals
        .map(t => t.team?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      const actualTeams = knockoutResults.round16
        .map(m => m.winner?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      
      let correctTeams = 0;
      predictedTeams.forEach(teamCode => {
        if (teamCode && actualTeams.includes(teamCode)) {
          correctTeams++;
          points += 20;
        }
      });
      
      breakdown.quarterTeams.correct = correctTeams;
      breakdown.quarterTeams.points = correctTeams * 20;
    }
    
    // Quarter-finals (Quarti): 30 points per correct team
    if (prediction.knockoutStage?.semiFinals && knockoutResults.quarterFinals) {
      const predictedTeams = prediction.knockoutStage.semiFinals
        .map(t => t.team?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      const actualTeams = knockoutResults.quarterFinals
        .map(m => m.winner?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      
      let correctTeams = 0;
      predictedTeams.forEach(teamCode => {
        if (teamCode && actualTeams.includes(teamCode)) {
          correctTeams++;
          points += 30;
        }
      });
      
      breakdown.semiTeams.correct = correctTeams;
      breakdown.semiTeams.points = correctTeams * 30;
    }
    
    // Semi-finals (Semifinali): 50 points per correct team
    if (prediction.knockoutStage?.final && knockoutResults.semiFinals) {
      const predictedTeams = prediction.knockoutStage.final
        .map(t => t.team?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      const actualTeams = knockoutResults.semiFinals
        .map(m => m.winner?.code)
        .filter(code => code && code.trim() !== ''); // Filter out empty strings
      
      let correctTeams = 0;
      predictedTeams.forEach(teamCode => {
        if (teamCode && actualTeams.includes(teamCode)) {
          correctTeams++;
          points += 50;
        }
      });
      
      breakdown.finalTeams.correct = correctTeams;
      breakdown.finalTeams.points = correctTeams * 50;
    }
    
  } catch (error) {
    console.error('Error calculating knockout points:', error);
  }
  
  return points;
};

/**
 * Calculate final rankings points
 */
const calculateFinalRankingsPoints = async (prediction, breakdown) => {
  let points = 0;
  
  try {
    const knockoutResults = await KnockoutResults.findOne();
    
    if (!knockoutResults || !knockoutResults.finalRankings) {
      return 0;
    }
    
    const actualRankings = knockoutResults.finalRankings;
    
    // 1st place: 80 points
    if (prediction.finalRankings?.first?.code &&
        actualRankings.first?.code &&
        prediction.finalRankings.first.code.trim() !== '' &&
        prediction.finalRankings.first.code === actualRankings.first.code) {
      points += 80;
      breakdown.winner.correct = true;
      breakdown.winner.points = 80;
    }
    
    // 2nd place: 50 points
    if (prediction.finalRankings?.second?.code &&
        actualRankings.second?.code &&
        prediction.finalRankings.second.code.trim() !== '' &&
        prediction.finalRankings.second.code === actualRankings.second.code) {
      points += 50;
      breakdown.runnerUp.correct = true;
      breakdown.runnerUp.points = 50;
    }
    
    // 3rd place: 25 points
    if (prediction.finalRankings?.third?.code &&
        actualRankings.third?.code &&
        prediction.finalRankings.third.code.trim() !== '' &&
        prediction.finalRankings.third.code === actualRankings.third.code) {
      points += 25;
      breakdown.third.correct = true;
      breakdown.third.points = 25;
    }
    
    // 4th place: 25 points
    if (prediction.finalRankings?.fourth?.code &&
        actualRankings.fourth?.code &&
        prediction.finalRankings.fourth.code.trim() !== '' &&
        prediction.finalRankings.fourth.code === actualRankings.fourth.code) {
      points += 25;
      breakdown.fourth.correct = true;
      breakdown.fourth.points = 25;
    }
    
  } catch (error) {
    console.error('Error calculating final rankings points:', error);
  }
  
  return points;
};

/**
 * Calculate top scorer points
 */
const calculateTopScorerPoints = async (prediction, breakdown) => {
  let points = 0;
  
  try {
    const knockoutResults = await KnockoutResults.findOne();
    
    if (!knockoutResults || !knockoutResults.topScorer) {
      return 0;
    }
    
    // Correct top scorer: 30 points
    if (prediction.topScorer?.playerName &&
        knockoutResults.topScorer.playerName &&
        prediction.topScorer.playerName.trim() !== '' &&
        prediction.topScorer.playerName === knockoutResults.topScorer.playerName) {
      points += 30;
      breakdown.topScorer.correct = true;
      breakdown.topScorer.points = 30;
    }
    
  } catch (error) {
    console.error('Error calculating top scorer points:', error);
  }
  
  return points;
};

/**
 * Calculate capiscione points
 */
const calculateCapiscionePoints = async (prediction, breakdown) => {
  let points = 0;
  
  try {
    const knockoutResults = await KnockoutResults.findOne();
    
    if (!knockoutResults || !knockoutResults.capiscione) {
      return 0;
    }
    
    const actualCapiscione = knockoutResults.capiscione;
    
    // Top group: 25 points
    if (prediction.capiscione?.top?.name &&
        actualCapiscione.top?.name &&
        prediction.capiscione.top.name.trim() !== '' &&
        prediction.capiscione.top.name === actualCapiscione.top.name) {
      points += 25;
      breakdown.capiscione.top.correct = true;
      breakdown.capiscione.top.points = 25;
    }
    
    // Outsider group: 20 points
    if (prediction.capiscione?.outsider?.name &&
        actualCapiscione.outsider?.name &&
        prediction.capiscione.outsider.name.trim() !== '' &&
        prediction.capiscione.outsider.name === actualCapiscione.outsider.name) {
      points += 20;
      breakdown.capiscione.outsider.correct = true;
      breakdown.capiscione.outsider.points = 20;
    }
    
    // Materasso group: 15 points
    if (prediction.capiscione?.materasso?.name &&
        actualCapiscione.materasso?.name &&
        prediction.capiscione.materasso.name.trim() !== '' &&
        prediction.capiscione.materasso.name === actualCapiscione.materasso.name) {
      points += 15;
      breakdown.capiscione.materasso.correct = true;
      breakdown.capiscione.materasso.points = 15;
    }
    
  } catch (error) {
    console.error('Error calculating capiscione points:', error);
  }
  
  return points;
};

module.exports = {
  calculateAllScores,
  calculateUserScore
};

// Made with Bob