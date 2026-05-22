const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Group Stage Predictions
  groupStage: [{
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    homeScore: {
      type: Number,
      required: true,
      min: 0,
    },
    awayScore: {
      type: Number,
      required: true,
      min: 0,
    },
    sign: {
      type: String,
      required: true,
      enum: ['1', 'X', '2'], // 1=Home win, X=Draw, 2=Away win
    },
  }],
  
  // Knockout Stage Predictions
  knockoutStage: {
    // Round of 16 qualified teams (32 teams)
    round16: [{
      team: {
        name: String,
        code: String,
      },
      position: {
        type: Number,
        min: 1,
        max: 32,
      },
    }],
    
    // Quarter-finals (16 teams)
    quarterFinals: [{
      team: {
        name: String,
        code: String,
      },
    }],
    
    // Semi-finals (8 teams)
    semiFinals: [{
      team: {
        name: String,
        code: String,
      },
    }],
    
    // Final (4 teams - semifinalists)
    final: [{
      team: {
        name: String,
        code: String,
      },
    }],
    
    // Finalists (2 teams)
    finalists: [{
      team: {
        name: String,
        code: String,
      },
    }],
  },
  
  // Final Rankings
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
    },
  },
  
  // Top Scorer
  topScorer: {
    playerName: String,
    team: {
      name: String,
      code: String,
    },
  },
  
  // Angolo del Capiscione
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
    },
  },
  
  // Metadata
  isLocked: {
    type: Boolean,
    default: false,
  },
  
  lockedAt: {
    type: Date,
    default: null,
  },
  
  lastModified: {
    type: Date,
    default: Date.now,
  },
  
  // Calculated scores
  scores: {
    groupStage: {
      type: Number,
      default: 0,
    },
    knockoutStage: {
      type: Number,
      default: 0,
    },
    finalRankings: {
      type: Number,
      default: 0,
    },
    topScorer: {
      type: Number,
      default: 0,
    },
    capiscione: {
      type: Number,
      default: 0,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Indexes
predictionSchema.index({ user: 1 }, { unique: true });
predictionSchema.index({ isLocked: 1 });
predictionSchema.index({ 'scores.total': -1 });

// Update lastModified before save
predictionSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('scores')) {
    this.lastModified = new Date();
  }
  next();
});

// Method to lock predictions
predictionSchema.methods.lock = function() {
  this.isLocked = true;
  this.lockedAt = new Date();
  return this.save();
};

// Method to check if predictions can be modified
predictionSchema.methods.canModify = function() {
  return !this.isLocked;
};

// Method to calculate total score
predictionSchema.methods.calculateTotalScore = function() {
  this.scores.total = 
    this.scores.groupStage +
    this.scores.knockoutStage +
    this.scores.finalRankings +
    this.scores.topScorer +
    this.scores.capiscione +
    this.scores.bonuses;
  return this.scores.total;
};

// Static method to get leaderboard
predictionSchema.statics.getLeaderboard = async function(limit = 10) {
  return this.find({ isLocked: true })
    .populate('user', 'username email')
    .sort({ 'scores.total': -1 })
    .limit(limit)
    .select('user scores');
};

module.exports = mongoose.model('Prediction', predictionSchema);

// Made with Bob