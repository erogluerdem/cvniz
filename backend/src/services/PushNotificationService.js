const admin = require('firebase-admin');

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
    async sendToUser(userId, notification) {
        if (!firebaseInitialized) return { error: 'Firebase not configured' };

        try {
            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: {
                    ...notification.data,
                    userId: userId
                }
            };

            // To implement: Get user's FCM tokens from DB
            // For now, this is a template

            console.log(`📢 Notification sent to user ${userId}`);
            return { success: true };
        } catch (err) {
            console.error('Error sending push notification:', err);
            return { error: err.message };
        }
    },

    async sendToTopic(topic, notification) {
        if (!firebaseInitialized) return { error: 'Firebase not configured' };

        try {
            const message = {
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                topic: topic
            };

            await admin.messaging().send(message);
            console.log(`📢 Notification sent to topic: ${topic}`);
            return { success: true };
        } catch (err) {
            console.error('Error sending topic notification:', err);
            return { error: err.message };
        }
    },

    async subscribeToTopic(tokens, topic) {
        if (!firebaseInitialized) return { error: 'Firebase not configured' };

        try {
            await admin.messaging().subscribeToTopic(tokens, topic);
            console.log(`✅ Subscribed ${tokens.length} tokens to topic: ${topic}`);
            return { success: true };
        } catch (err) {
            console.error('Error subscribing to topic:', err);
            return { error: err.message };
        }
    },

    async unsubscribeFromTopic(tokens, topic) {
        if (!firebaseInitialized) return { error: 'Firebase not configured' };

        try {
            await admin.messaging().unsubscribeFromTopic(tokens, topic);
            console.log(`✅ Unsubscribed ${tokens.length} tokens from topic: ${topic}`);
            return { success: true };
        } catch (err) {
            console.error('Error unsubscribing from topic:', err);
            return { error: err.message };
        }
    }
};

module.exports = PushNotificationService;
