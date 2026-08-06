const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'Briefcase'
    },
    color: {
        type: String,
        default: 'blue'
    },
    steps: [{
        title: String,
        description: String,
        duration: String,
        skills: [String]
    }],
    activeUsers: {
        type: Number,
        default: 0
    },
    successRate: {
        type: Number,
        default: 0
    },
    averageSalary: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CareerPath', careerPathSchema);
