const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
    locale: {
        type: String,
        required: true,
        enum: ['tr', 'en', 'de', 'fr', 'es'],
        index: true
    },
    key: {
        type: String,
        required: true,
        index: true
    },
    value: {
        type: String,
        required: true
    },
    group: {
        type: String,
        default: 'common'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Compound index just to be safe, though key+locale should be unique
TranslationSchema.index({ locale: 1, key: 1 }, { unique: true });

module.exports = mongoose.models.Translation || mongoose.model('Translation', TranslationSchema);
