const mongoose = require('mongoose');
const { DocumentProcessingService } = require('../services/DocumentProcessingService');
const { documentProcessingSchema } = require('../services/DocumentProcessingService');

module.exports = mongoose.model('DocumentProcessing', documentProcessingSchema);
