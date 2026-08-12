const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    comment: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
