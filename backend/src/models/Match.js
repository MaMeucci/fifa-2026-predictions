const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  // Match identification
  matchNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  
  // Tournament phase
  phase: {
    type: String,
    required: true,
    enum: ['GROUP', 'ROUND_16', 'ROUND_8', 'QUARTER', 'SEMI', 'THIRD_PLACE', 'FINAL'],
  },
  
  // Group information (for group stage matches)
  group: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', null],
    default: null,
  },
  
  // Teams
  homeTeam: {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  
  awayTeam: {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  
  // Match details
  date: {
    type: Date,
    required: true,
  },
  
  // Match result
  result: {
    homeScore: {
      type: Number,
      default: null,
    },
    awayScore: {
      type: Number,
      default: null,
    },
    winner: {
      type: String,
      enum: ['HOME', 'AWAY', 'DRAW', null],
      default: null,
    },
    // For knockout matches
    penalties: {
      homeScore: {
        type: Number,
        default: null,
      },
      awayScore: {
        type: Number,
        default: null,
      },
    },
  },
  
  // Match status
  status: {
    type: String,
    required: true,
    enum: ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'],
    default: 'SCHEDULED',
  },
  
  // Additional info
  attendance: {
    type: Number,
    default: null,
  },
  
  referee: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
matchSchema.index({ phase: 1, date: 1 });
matchSchema.index({ group: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ 'homeTeam.code': 1 });
matchSchema.index({ 'awayTeam.code': 1 });

// Virtual for match display name
matchSchema.virtual('displayName').get(function() {
  return `${this.homeTeam.name} vs ${this.awayTeam.name}`;
});

// Method to check if match is finished
matchSchema.methods.isFinished = function() {
  return this.status === 'FINISHED';
};

// Method to get match winner
matchSchema.methods.getWinner = function() {
  if (!this.isFinished()) return null;
  
  // Check penalties first (for knockout matches)
  if (this.result.penalties.homeScore !== null && this.result.penalties.awayScore !== null) {
    return this.result.penalties.homeScore > this.result.penalties.awayScore ? 'HOME' : 'AWAY';
  }
  
  // Regular time result
  if (this.result.homeScore > this.result.awayScore) return 'HOME';
  if (this.result.awayScore > this.result.homeScore) return 'AWAY';
  return 'DRAW';
};

module.exports = mongoose.model('Match', matchSchema);

// Made with Bob