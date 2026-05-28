const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    breakdown: {
      // Group stage points
      exactResults: {
        count: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      correctSigns: {
        count: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      bonusExactResults: {
        count: { type: Number, default: 0 }, // Number of 5-result bonuses
        points: { type: Number, default: 0 },
      },
      
      // Knockout stage points
      round16Teams: {
        correct: { type: Number, default: 0 },
        exactPosition: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      quarterTeams: {
        correct: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      semiTeams: {
        correct: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      finalTeams: {
        correct: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      finalMatchTeams: {
        correct: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
      },
      
      // Final standings
      winner: {
        correct: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
      },
      runnerUp: {
        correct: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
      },
      third: {
        correct: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
      },
      fourth: {
        correct: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
      },
      topScorer: {
        correct: { type: Boolean, default: false },
        points: { type: Number, default: 0 },
      },
      
      // Capiscione
      capiscione: {
        top: {
          correct: { type: Boolean, default: false },
          points: { type: Number, default: 0 },
        },
        outsider: {
          correct: { type: Boolean, default: false },
          points: { type: Number, default: 0 },
        },
        materasso: {
          correct: { type: Boolean, default: false },
          points: { type: Number, default: 0 },
        },
      },
    },
    lastCalculated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
scoreSchema.index({ totalPoints: -1 });
scoreSchema.index({ user: 1 });

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;

// Made with Bob