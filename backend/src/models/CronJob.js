const mongoose = require('mongoose');

const cronJobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    schedule: {
        type: String,
        required: true
    },
    lastRun: {
        type: String
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'success', 'failed', 'running']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CronJob', cronJobSchema);
