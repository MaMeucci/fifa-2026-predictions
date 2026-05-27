const mongoose = require('mongoose');

const knockoutResultsSchema = new mongoose.Schema(
  {
    // Round of 32 (16 matches, 32 teams) - FIFA 2026 matches 73-88
    round32: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 88  // Allow FIFA 2026 match numbers (73-88)
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
    
    // Round of 16 (8 matches, 16 teams) - FIFA 2026: matches 89-96
    round16: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 96
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
    
    // Quarter-finals (4 matches, 8 teams) - FIFA 2026: matches 97-100
    quarterFinals: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 100
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
    
    // Semi-finals (2 matches, 4 teams) - FIFA 2026: matches 101-102
    semiFinals: [{
      matchNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 102
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
    
    // Capiscione
    capiscione: {
      top: {
        name: String,
        code: String,
      },
      outsider: {
        name: String,
        code: String,
      },
      materasso: {
        name: String,
        code: String,
      }
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
