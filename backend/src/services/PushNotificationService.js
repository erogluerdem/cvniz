const admin = require('firebase-admin');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Initialize Firebase Admin only if credentials are provided
let firebaseInitialized = false;

try {
    if (process.env.FIREBASE_CONFIG) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        firebaseInitialized = true;
        console.log('✅ Firebase initialized');
    }
} catch (err) {
    console.warn('⚠️ Firebase not initialized:', err.message);
}

const PushNotificationService = {
    async registerDeviceToken(userId, token, device = {}) {
        try {
            const user = await User.findById(userId);
            if (!user) {throw new Error('User not found');}

            if (!user.devices) {user.devices = [];}
            user.devices = user.devices.filter(d => d.token !== token);

            user.devices.push({
                token,
                platform: device.platform || 'unknown',
                type: device.type || 'unknown',
                registeredAt: new Date(),
                lastActive: new Date()
            });

            await user.save();
            console.log(`✅ Device registered: ${userId}`);
            return true;
        } catch (error) {
            console.error('Register device error:', error);
            throw error;
        }
    },

    async sendToUser(userId, notification) {
        if (!firebaseInitialized) {return { error: 'Firebase not configured' };}

        try {
            const user = await User.findById(userId);
            if (!user || !user.devices || user.devices.length === 0) {
                return { sent: 0, failed: 0 };
            }

            const tokens = user.devices.map(d => d.token);
            const { title, body, data = {}, deepLink = null, priority = 'high' } = notification;

            const payload = {
                notification: { title, body, clickAction: deepLink },
                data: { ...data, deepLink, timestamp: Date.now().toString() },
                android: {
                    priority: priority === 'high' ? 'high' : 'normal',
                    ttl: 86400,
                    notification: { sound: 'default', color: '#FF6B35' }
                }
            };

            const response = await admin.messaging().sendMulticast({
                ...payload,
                tokens
            });

            let sent = 0;
            response.responses.forEach((result, index) => {
                if (result.success) {
                    sent++;
                    user.devices[index].lastActive = new Date();
                } else if (result.error?.code?.includes('invalid-registration-token')) {
                    user.devices[index].invalidated = true;
                }
            });

            user.devices = user.devices.filter(d => !d.invalidated);
            await user.save();

            await Notification.create({
                userId,
                title,
                body,
                type: 'push',
                data,
                deepLink,
                sent: new Date(),
                status: 'delivered'
            });

            console.log(`✅ Notification sent to ${userId}: ${sent}/${tokens.length}`);
            return { sent, failed: tokens.length - sent };
        } catch (err) {
            console.error('Error sending push notification:', err);
            return { error: err.message };
        }
    },

    async sendBulkNotification(userIds, notification) {
        const results = { total: userIds.length, successful: 0, failed: 0 };

        for (const userId of userIds) {
            try {
                const result = await this.sendToUser(userId, notification);
                if (result.sent > 0) {results.successful++;}
                else {results.failed++;}
            } catch (error) {
                results.failed++;
            }
        }

        console.log(`✅ Bulk notification: ${results.successful}/${results.total} successful`);
        return results;
    },

    async sendToTopic(topic, notification) {
        if (!firebaseInitialized) {return { error: 'Firebase not configured' };}

        try {
            const { title, body, data = {}, priority = 'high' } = notification;
            const message = {
                notification: { title, body },
                data,
                topic,
                android: { priority: priority === 'high' ? 'high' : 'normal' }
            };

            const response = await admin.messaging().send(message);
            console.log(`📢 Topic notification sent: ${topic}`);
            return { success: true, messageId: response };
        } catch (err) {
            console.error('Error sending topic notification:', err);
            return { error: err.message };
        }
    },

    async subscribeToTopic(userId, topic) {
        if (!firebaseInitialized) {return { error: 'Firebase not configured' };}

        try {
            const user = await User.findById(userId);
            if (!user?.devices?.length) {return { subscribed: 0 };}

            const tokens = user.devices.map(d => d.token);
            await admin.messaging().subscribeToTopic(tokens, topic);

            if (!user.notificationTopics) {user.notificationTopics = [];}
            if (!user.notificationTopics.includes(topic)) {
                user.notificationTopics.push(topic);
                await user.save();
            }

            console.log(`✅ Subscribed ${userId} to topic: ${topic}`);
            return { success: true, subscribed: tokens.length };
        } catch (err) {
            console.error('Error subscribing to topic:', err);
            return { error: err.message };
        }
    },

    async unsubscribeFromTopic(userId, topic) {
        if (!firebaseInitialized) {return { error: 'Firebase not configured' };}

        try {
            const user = await User.findById(userId);
            if (!user?.devices?.length) {return { unsubscribed: 0 };}

            const tokens = user.devices.map(d => d.token);
            await admin.messaging().unsubscribeFromTopic(tokens, topic);

            if (user.notificationTopics) {
                user.notificationTopics = user.notificationTopics.filter(t => t !== topic);
                await user.save();
            }

            console.log(`✅ Unsubscribed ${userId} from topic: ${topic}`);
            return { success: true, unsubscribed: tokens.length };
        } catch (err) {
            console.error('Error unsubscribing:', err);
            return { error: err.message };
        }
    },

    async getUnreadNotifications(userId) {
        try {
            const notifications = await Notification.find({
                userId,
                read: false
            }).sort({ sent: -1 }).limit(50);
            return notifications;
        } catch (error) {
            console.error('Get unread error:', error);
            return [];
        }
    },

    async markAsRead(notificationId) {
        try {
            return await Notification.findByIdAndUpdate(
                notificationId,
                { read: true, readAt: new Date() },
                { new: true }
            );
        } catch (error) {
            console.error('Mark read error:', error);
            throw error;
        }
    },

    async updatePreferences(userId, preferences) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { notificationPreferences: preferences },
                { new: true }
            );
            return user?.notificationPreferences;
        } catch (error) {
            console.error('Update preferences error:', error);
            throw error;
        }
    }
};

module.exports = PushNotificationService;
