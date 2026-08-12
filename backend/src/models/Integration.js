const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'inactive',
        enum: ['active', 'inactive']
    },
    color: {
        type: String,
        default: 'indigo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Integration', integrationSchema);
