const mongoose = require('mongoose');
const { interviewSchema } = require('../services/InterviewSimulatorService');

module.exports = mongoose.model('Interview', interviewSchema);
