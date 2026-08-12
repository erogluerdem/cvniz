const mongoose = require('mongoose');

const aiPromptSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        default: 'System',
        enum: ['System', 'User', 'Assistant']
    },
    version: {
        type: String,
        required: true,
        default: 'v1.0'
    },
    content: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AIPrompt', aiPromptSchema);
