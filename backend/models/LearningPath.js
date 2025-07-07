const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  title: String,
  description: String,
  prerequisites: [String],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  faangCustomizations: Object,
});

const learningPathSchema = new mongoose.Schema({
  name: String,
  description: String,
  nodes: [nodeSchema],
});

module.exports = mongoose.model('LearningPath', learningPathSchema);