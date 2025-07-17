const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  },
  hackathonProject: {
    type: String,
    maxlength: 200
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
  productivityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
connectionSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });
connectionSchema.index({ status: 1 });
connectionSchema.index({ createdAt: -1 });

// Virtual for checking if connection is active
connectionSchema.virtual('isActive').get(function() {
  return this.status === 'accepted';
});

// Method to check if users can connect
connectionSchema.statics.canConnect = async function(userId1, userId2) {
  if (userId1.toString() === userId2.toString()) {
    return false; // Can't connect to yourself
  }
  
  const existingConnection = await this.findOne({
    $or: [
      { fromUser: userId1, toUser: userId2 },
      { fromUser: userId2, toUser: userId1 }
    ]
  });
  
  return !existingConnection;
};

// Method to get connection status between two users
connectionSchema.statics.getConnectionStatus = async function(userId1, userId2) {
  const connection = await this.findOne({
    $or: [
      { fromUser: userId1, toUser: userId2 },
      { fromUser: userId2, toUser: userId1 }
    ]
  });
  
  return connection ? connection.status : null;
};

module.exports = mongoose.model('Connection', connectionSchema); 