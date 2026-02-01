import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';

/**
 * Hook for Firebase Push Notifications
 */
export const usePushNotifications = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [fcmToken, setFcmToken] = useState(null);
    const [isTokenRefreshed, setIsTokenRefreshed] = useState(false);

    // Request notification permission
    useEffect(() => {
        requestUserPermission();
    }, []);

    // Listen for messages
    useEffect(() => {
        setupMessageListeners();
    }, []);

    const requestUserPermission = async () => {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('✅ Notification permission granted');
                await getFCMToken();
            }
        } catch (error) {
            console.error('❌ Permission request error:', error);
            Sentry.captureException(error);
        }
    };

    const getFCMToken = async () => {
        try {
            const token = await messaging().getToken();
            setFcmToken(token);
            console.log('🔑 FCM Token:', token);

            // Register with backend
            await registerTokenWithBackend(token);
        } catch (error) {
            console.error('❌ Get FCM token error:', error);
            Sentry.captureException(error);
        }
    };

    const registerTokenWithBackend = async (token) => {
        try {
            // This should be implemented with actual API call
            console.log('📝 Token registered with backend');
        } catch (error) {
            console.error('❌ Register token error:', error);
        }
    };

    const setupMessageListeners = () => {
        // Handle notifications when app is in foreground
        const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
            console.log('📬 Foreground notification:', remoteMessage);

            const notification = {
                id: remoteMessage.messageId,
                title: remoteMessage.notification?.title,
                body: remoteMessage.notification?.body,
                data: remoteMessage.data,
                timestamp: Date.now()
            };

            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show local notification UI
            showNotificationUI(notification);
        });

        // Handle notification when app opened from background
        const unsubscribeBackground = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('📲 Background notification opened:', remoteMessage);

            if (remoteMessage) {
                handleNotificationPress(remoteMessage);
            }
        });

        // Check if app was opened from notification
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log('💌 App opened from notification:', remoteMessage);
                    handleNotificationPress(remoteMessage);
                }
            });

        // Listen for token refresh
        const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
            console.log('🔄 FCM token refreshed:', token);
            setFcmToken(token);
            setIsTokenRefreshed(true);
            registerTokenWithBackend(token);
        });

        return () => {
            unsubscribeForeground();
            unsubscribeBackground();
            unsubscribeTokenRefresh();
        };
    };

    const handleNotificationPress = useCallback((remoteMessage) => {
        const { deepLink, screen, params } = remoteMessage.data || {};

        // Navigate based on deep link
        if (deepLink) {
            navigation.navigate(screen || 'Home', params ? JSON.parse(params) : {});
        } else if (screen) {
            navigation.navigate(screen, params ? JSON.parse(params) : {});
        }

        // Mark as read
        if (remoteMessage.messageId) {
            markNotificationAsRead(remoteMessage.messageId);
        }
    }, [navigation]);

    const showNotificationUI = useCallback((notification) => {
        // Could show local notification UI here
        // Or trigger a toast/alert
        console.log('🔔 Showing notification UI:', notification.title);
    }, []);

    const markNotificationAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const deleteNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (unreadCount > 0) {
            setUnreadCount(prev => prev - 1);
        }
    }, [unreadCount]);

    return {
        notifications,
        unreadCount,
        fcmToken,
        isTokenRefreshed,
        markNotificationAsRead,
        markAllAsRead,
        clearNotifications,
        deleteNotification,
        handleNotificationPress
    };
};

/**
 * Hook for notification subscriptions
 */
export const useNotificationSubscriptions = () => {
    const [subscribedTopics, setSubscribedTopics] = useState([]);
    const [loading, setLoading] = useState(false);

    const subscribe = useCallback(async (topic) => {
        try {
            setLoading(true);
            await messaging().subscribeToTopic(topic);
            setSubscribedTopics(prev => {
                if (!prev.includes(topic)) {
                    return [...prev, topic];
                }
                return prev;
            });
            console.log(`✅ Subscribed to topic: ${topic}`);
        } catch (error) {
            console.error(`❌ Subscribe error: ${topic}`, error);
            Sentry.captureException(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async (topic) => {
        try {
            setLoading(true);
            await messaging().unsubscribeFromTopic(topic);
            setSubscribedTopics(prev => prev.filter(t => t !== topic));
            console.log(`✅ Unsubscribed from topic: ${topic}`);
        } catch (error) {
            console.error(`❌ Unsubscribe error: ${topic}`, error);
            Sentry.captureException(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const subscribeMultiple = useCallback(async (topics) => {
        try {
            setLoading(true);
            for (const topic of topics) {
                await messaging().subscribeToTopic(topic);
            }
            setSubscribedTopics(prev => {
                const newTopics = new Set([...prev, ...topics]);
                return Array.from(newTopics);
            });
            console.log(`✅ Subscribed to ${topics.length} topics`);
        } catch (error) {
            console.error('❌ Subscribe multiple error:', error);
            Sentry.captureException(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        subscribedTopics,
        loading,
        subscribe,
        unsubscribe,
        subscribeMultiple
    };
};

/**
 * Component for displaying notifications
 */
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export const NotificationCenter = ({ notifications, onPress, onDelete }) => {
    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900">
            {notifications.length === 0 ? (
                <View className="flex-1 items-center justify-center p-6">
                    <Text className="text-gray-500 dark:text-gray-400">
                        Bildirim yok
                    </Text>
                </View>
            ) : (
                <View>
                    {notifications.map((notification) => (
                        <TouchableOpacity
                            key={notification.id}
                            onPress={() => onPress?.(notification)}
                            className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                                notification.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'
                            }`}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1 mr-4">
                                    <Text className="font-semibold text-gray-900 dark:text-white">
                                        {notification.title}
                                    </Text>
                                    <Text className="text-gray-600 dark:text-gray-400 mt-1">
                                        {notification.body}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => onDelete?.(notification.id)}
                                    className="p-2"
                                >
                                    <Text className="text-red-500">✕</Text>
                                </TouchableOpacity>
                            </View>

                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(notification.timestamp), {
                                    addSuffix: true,
                                    locale: tr
                                })}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};
