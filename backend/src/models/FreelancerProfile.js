const mongoose = require('mongoose');
const { freelancerProfileSchema, projectSchema } = require('../services/FreelancerService');

module.exports = {
    FreelancerProfile: mongoose.model('FreelancerProfile', freelancerProfileSchema),
    Project: mongoose.model('Project', projectSchema)
};
