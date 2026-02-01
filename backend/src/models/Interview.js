const mongoose = require('mongoose');
const { InterviewSimulatorService } = require('../services/InterviewSimulatorService');
const { interviewSchema } = require('../services/InterviewSimulatorService');

module.exports = mongoose.model('Interview', interviewSchema);
