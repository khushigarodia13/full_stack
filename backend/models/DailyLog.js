const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  tasks: [{
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    name: String,
    time: String,
    duration: Number,
    completed: Boolean
  }],
  completedTasks: [{ 
    type: String 
  }],
  totalTasks: { 
    type: Number, 
    default: 0 
  },
  productivityScore: { 
    type: Number, 
    default: 0 
  },
  resumeActions: [{ 
    action: String,
    timestamp: { type: Date, default: Date.now }
  }],
  jobPrepProgress: { 
    type: Number, 
    default: 0 
  },
  notes: { 
    type: String 
  }
}, {
  timestamps: true
});

// Index for efficient queries
dailyLogSchema.index({ user: 1, date: 1 });

// Virtual for completion rate
dailyLogSchema.virtual('completionRate').get(function() {
  if (this.totalTasks === 0) return 0;
  return (this.completedTasks.length / this.totalTasks) * 100;
});

module.exports = mongoose.model('DailyLog', dailyLogSchema); 