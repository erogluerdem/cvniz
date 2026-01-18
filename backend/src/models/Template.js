const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templateId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['popular', 'professional', 'tech', 'creative', 'modern', 'premium'],
        default: 'professional'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: String, // URL to image in /uploads
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
