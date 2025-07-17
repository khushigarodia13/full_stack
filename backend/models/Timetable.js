const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true }, // e.g., '07:00', '08:00'
  completed: { type: Boolean, default: false }
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true },
  tasks: [taskSchema]
});

const timetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  schedule: [daySchema]
});

module.exports = mongoose.model('Timetable', timetableSchema); 