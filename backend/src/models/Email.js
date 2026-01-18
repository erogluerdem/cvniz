const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    htmlContent: String,
    type: {
        type: String,
        enum: ['campaign', 'transactional', 'newsletter', 'notification', 'reminder'],
        default: 'campaign'
    },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
        default: 'draft'
    },
    recipients: {
        type: String,
        enum: ['all', 'premium', 'free', 'inactive', 'new', 'custom'],
        default: 'all'
    },
    recipientCount: {
        type: Number,
        default: 0
    },
    customRecipients: [String],
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailTemplate'
    },
    scheduledDate: Date,
    sentDate: Date,
    // Metrics
    delivered: {
        type: Number,
        default: 0
    },
    opened: {
        type: Number,
        default: 0
    },
    clicked: {
        type: Number,
        default: 0
    },
    bounced: {
        type: Number,
        default: 0
    },
    unsubscribed: {
        type: Number,
        default: 0
    },
    // Settings
    fromName: {
        type: String,
        default: 'CVniz'
    },
    fromEmail: {
        type: String,
        default: 'noreply@CVniz.com'
    },
    replyTo: String,
    tags: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Açılma oranı
emailSchema.virtual('openRate').get(function () {
    if (this.recipientCount === 0) return 0;
    return ((this.opened / this.recipientCount) * 100).toFixed(1);
});

// Tıklama oranı
emailSchema.virtual('clickRate').get(function () {
    if (this.opened === 0) return 0;
    return ((this.clicked / this.opened) * 100).toFixed(1);
});

emailSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Email', emailSchema);

