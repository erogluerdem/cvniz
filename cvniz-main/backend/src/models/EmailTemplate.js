const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    htmlContent: String,
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    channel: {
        type: String,
        enum: ['email', 'sms'],
        default: 'email'
    },
    type: {
        type: String,
        enum: ['welcome', 'premium', 'password', 'reminder', 'notification', 'marketing', 'newsletter', 'custom'],
        default: 'custom'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    variables: [{
        key: String,
        description: String,
        defaultValue: String
    }],
    usageCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
