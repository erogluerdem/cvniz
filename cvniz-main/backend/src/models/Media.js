const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['image', 'document', 'video', 'other'],
        default: 'other'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metadata: {
        width: Number,
        height: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Media', mediaSchema);
