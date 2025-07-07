const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  nodeId: String,
  type: String,
  url: String,
  title: String,
  description: String,
});

module.exports = mongoose.model('Resource', resourceSchema);