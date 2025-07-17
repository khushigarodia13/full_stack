const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nodeId: String,
  stepTitle: String, // <-- Add this line for subtopic progress
  status: String,
  completedAt: Date,
  githubSync: Object,
});

module.exports = mongoose.model('Progress', progressSchema);