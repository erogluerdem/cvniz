const mongoose = require('mongoose');

const { documentProcessingSchema } = require('../services/DocumentProcessingService');

module.exports = mongoose.model('DocumentProcessing', documentProcessingSchema);
