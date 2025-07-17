const mongoose = require('mongoose');

const productivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  activities: [{ type: String }],
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('ProductivityLog', productivityLogSchema);
