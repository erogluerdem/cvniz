const mongoose = require('mongoose');
const { skillAssessmentSchema } = require('../services/SkillMatchingService');

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);
