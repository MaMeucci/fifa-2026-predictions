const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Tournament configuration
  tournament: {
    name: {
      type: String,
      default: 'FIFA World Cup 2026',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    hosts: {
      type: [String],
      default: ['USA', 'Canada', 'Mexico'],
    },
  },
  
  // Predictions lock date
  predictionsLockDate: {
    type: Date,
    required: true,
  },
  
  // Scoring rules
  scoring: {
    groupStage: {
      exactResult: {
        type: Number,
        default: 6,
      },
      correctSign: {
        type: Number,
        default: 3,
      },
      bonusEvery5ExactResults: {
        type: Number,
        default: 5,
      },
    },
    knockoutStage: {
      round16Correct: {
        type: Number,
        default: 20,
      },
      round16ExactPosition: {
        type: Number,
        default: 5,
      },
      quarterFinalsCorrect: {
        type: Number,
        default: 20,
      },
      semiFinalsCorrect: {
        type: Number,
        default: 30,
      },
      finalCorrect: {
        type: Number,
        default: 50,
      },
    },
    finalRankings: {
      first: {
        type: Number,
        default: 80,
      },
      second: {
        type: Number,
        default: 50,
      },
      third: {
        type: Number,
        default: 25,
      },
      fourth: {
        type: Number,
        default: 25,
      },
    },
    topScorer: {
      type: Number,
      default: 30,
    },
    capiscione: {
      top: {
        type: Number,
        default: 25,
      },
      outsider: {
        type: Number,
        default: 20,
      },
      materasso: {
        type: Number,
        default: 15,
      },
    },
  },
  
  // Capiscione groups
  capiscioneGroups: {
    top: [{
      name: String,
      code: String,
    }],
    outsider: [{
      name: String,
      code: String,
    }],
    materasso: [{
      name: String,
      code: String,
    }],
  },
  
  // Feature flags
  features: {
    allowRegistration: {
      type: Boolean,
      default: true,
    },
    allowPredictionModification: {
      type: Boolean,
      default: true,
    },
    showLeaderboard: {
      type: Boolean,
      default: false,
    },
    showOtherPredictions: {
      type: Boolean,
      default: false,
    },
  },
  
  // Singleton pattern - only one settings document
  _id: {
    type: String,
    default: 'app_settings',
  },
}, {
  timestamps: true,
});

// Static method to get settings (singleton)
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findById('app_settings');
  
  if (!settings) {
    // Create default settings
    settings = await this.create({
      _id: 'app_settings',
      tournament: {
        name: 'FIFA World Cup 2026',
        startDate: new Date('2026-06-11'),
        endDate: new Date('2026-07-19'),
        hosts: ['USA', 'Canada', 'Mexico'],
      },
      predictionsLockDate: new Date('2026-06-10'),
    });
  }
  
  return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updates) {
  return this.findByIdAndUpdate(
    'app_settings',
    updates,
    { new: true, runValidators: true }
  );
};

// Method to check if predictions are locked
settingsSchema.methods.arePredictionsLocked = function() {
  return new Date() >= this.predictionsLockDate;
};

// Method to check if tournament has started
settingsSchema.methods.hasTournamentStarted = function() {
  return new Date() >= this.tournament.startDate;
};

// Method to check if tournament has ended
settingsSchema.methods.hasTournamentEnded = function() {
  return new Date() >= this.tournament.endDate;
};

module.exports = mongoose.model('Settings', settingsSchema);

// Made with Bob