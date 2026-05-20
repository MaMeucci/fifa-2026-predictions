const mongoose = require('mongoose');

const knockoutResultsSchema = new mongoose.Schema(
  {
    // Round of 32 (16 matches, 32 teams)
    round32: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 16
      },
      team1: {
        name: String,
        code: String,
      },
      team2: {
        name: String,
        code: String,
      },
      winner: {
        name: String,
        code: String,
      }
    }],
    
    // Round of 16 (8 matches, 16 teams)
    round16: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 8
      },
      team1: {
        name: String,
        code: String,
      },
      team2: {
        name: String,
        code: String,
      },
      winner: {
        name: String,
        code: String,
      }
    }],
    
    // Quarter-finals (4 matches, 8 teams)
    quarterFinals: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 4
      },
      team1: {
        name: String,
        code: String,
      },
      team2: {
        name: String,
        code: String,
      },
      winner: {
        name: String,
        code: String,
      }
    }],
    
    // Semi-finals (2 matches, 4 teams)
    semiFinals: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 2
      },
      team1: {
        name: String,
        code: String,
      },
      team2: {
        name: String,
        code: String,
      },
      winner: {
        name: String,
        code: String,
      }
    }],
    
    // Final (1 match, 2 teams)
    final: {
      team1: {
        name: String,
        code: String,
      },
      team2: {
        name: String,
        code: String,
      },
      winner: {
        name: String,
        code: String,
      }
    },
    
    // Third place match
    thirdPlace: {
      team1: {
        name: String,
        code: String,
      },
      team2: {
        name: String,
        code: String,
      },
      winner: {
        name: String,
        code: String,
      }
    },
    
    // Final rankings
    finalRankings: {
      first: {
        name: String,
        code: String,
      },
      second: {
        name: String,
        code: String,
      },
      third: {
        name: String,
        code: String,
      },
      fourth: {
        name: String,
        code: String,
      }
    },
    
    // Top scorer
    topScorer: {
      playerName: String,
      team: {
        name: String,
        code: String,
      },
      goals: Number
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// There should only be one document in this collection
knockoutResultsSchema.index({}, { unique: true });

module.exports = mongoose.model('KnockoutResults', knockoutResultsSchema);

// Made with Bob
