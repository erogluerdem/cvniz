const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: 'Bilinmeyen Konum'
    },
    browser: {
        type: String,
        default: 'Bilinmeyen Tarayıcı'
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive', 'suspicious']
    },
    threat: {
        type: String,
        default: 'low',
        enum: ['low', 'medium', 'high']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserSession', userSessionSchema);
