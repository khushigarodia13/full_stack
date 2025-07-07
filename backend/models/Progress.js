const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nodeId: String,
  status: String,
  completedAt: Date,
  githubSync: Object,
});

module.exports = mongoose.model('Progress', progressSchema);