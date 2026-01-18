const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['cv_view', 'cv_download', 'cv_share', 'system', 'promo', 'achievement'],
        required: true,
        default: 'system'
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        maxlength: 500
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    icon: {
        type: String,
        default: 'bell'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

// Static: Get user notifications
notificationSchema.statics.getUserNotifications = function (userId, options = {}) {
    const { limit = 20, skip = 0, unreadOnly = false } = options;
    const query = { userId };
    if (unreadOnly) query.isRead = false;

    return this.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
};

// Static: Get unread count
notificationSchema.statics.getUnreadCount = function (userId) {
    return this.countDocuments({ userId, isRead: false });
};

// Static: Mark as read
notificationSchema.statics.markAsRead = async function (notificationId, userId) {
    return this.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
    );
};

// Static: Mark all as read
notificationSchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

// Static: Create CV view notification
notificationSchema.statics.createCVViewNotification = async function (userId, cvName, location) {
    const cityName = location?.city || 'Bilinmeyen konum';
    const countryName = location?.country || '';

    const locationText = countryName && countryName !== 'Bilinmiyor'
        ? `${cityName}, ${countryName}`
        : cityName;

    return this.create({
        userId,
        type: 'cv_view',
        title: 'CV\'niz İnceleniyor! 👀',
        message: `"${cvName}" CV'niz şu an ${locationText} konumundan görüntüleniyor.`,
        icon: 'eye',
        priority: 'high',
        data: {
            cvName,
            location: locationText,
            city: location?.city,
            country: location?.country
        }
    });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
