const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  customizations: Object,
});

module.exports = mongoose.model('Company', companySchema);