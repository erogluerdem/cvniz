/**
 * Deep Linking Service
 * Handles deep link processing, routing, and analytics
 */

import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as Sentry from '@sentry/react-native';
import { parseDeepLink, navigateViaDeepLink } from './DeepLinkingConfig';

/**
 * Hook for handling deep links
 */
export const useDeepLinking = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Handle deep links when app is already open
        const handleDeepLink = ({ url }) => {
            if (url == null) return;

            try {
                // Process deep link
                const parsed = parseDeepLink(url);
                
                if (parsed) {
                    console.log('📱 Deep link received:', parsed);
                    
                    // Track deep link analytics
                    trackDeepLinkEvent({
                        url,
                        screen: parsed.segments[0] || 'unknown',
                        source: 'notification' // or 'share', 'manual', etc.
                    });

                    // Navigate
                    navigateViaDeepLink(navigation, url);
                }
            } catch (error) {
                Sentry.captureException(error, {
                    tags: { feature: 'deep-linking' },
                    extra: { url }
                });
                console.error('Deep link handling error:', error);
            }
        };

        // Subscribe to deep links
        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, [navigation]);
};

/**
 * Hook for handling notification deep links
 */
export const useNotificationDeepLinking = () => {
    const navigation = useNavigation();

    return {
        /**
         * Handle notification navigation
         */
        handleNotificationNavigation: (notification) => {
            try {
                const { data, deepLink } = notification;

                if (deepLink) {
                    // Use deep link if available
                    navigateViaDeepLink(navigation, deepLink);
                } else if (data) {
                    // Fallback to data-based navigation
                    const screen = data.screen || 'Home';
                    const params = {
                        ...data,
                        fromNotification: true,
                        notificationId: notification.messageId
                    };

                    navigation.navigate(screen, params);
                }

                // Track notification navigation
                trackNotificationNavigation({
                    screen: data?.screen || 'unknown',
                    source: 'notification',
                    deepLink: !!deepLink
                });
            } catch (error) {
                Sentry.captureException(error, {
                    tags: { feature: 'notification-deep-linking' },
                    extra: { notification }
                });
                console.error('Notification navigation error:', error);
            }
        },

        /**
         * Build notification deep link
         */
        buildNotificationDeepLink: (screen, params) => {
            const links = {
                'CVDetail': `cvniz://cv/${params?.cvId}`,
                'JobDetail': `cvniz://job/${params?.jobId}`,
                'ReviewDetail': `cvniz://review/${params?.reviewId}`,
                'AdminDashboard': 'cvniz://admin/dashboard',
                'InterviewPrep': 'cvniz://ai/interview',
                'SkillGap': 'cvniz://ai/skill-gap',
                'ApplicationDetail': `cvniz://application/${params?.appId}`,
                'RecommendationDetail': `cvniz://recommendation/${params?.recId}`
            };

            return links[screen] || null;
        }
    };
};

/**
 * Analytics event tracking for deep links
 */
export const trackDeepLinkEvent = (options) => {
    const { url, screen, source, params } = options;

    try {
        // Send to analytics service
        console.log(`📊 Deep Link Event: ${screen} from ${source}`);

        // Track in Sentry Breadcrumb
        Sentry.addBreadcrumb({
            category: 'navigation',
            message: `Deep link: ${screen}`,
            level: 'info',
            data: {
                url,
                screen,
                source,
                params
            }
        });

        // Add custom tracking here (Firebase Analytics, Mixpanel, etc.)
        // await analytics().logEvent('deep_link_opened', {
        //     screen,
        //     source,
        //     url
        // });
    } catch (error) {
        console.error('Track deep link event error:', error);
    }
};

/**
 * Analytics event tracking for notification navigation
 */
export const trackNotificationNavigation = (options) => {
    const { screen, source, deepLink } = options;

    try {
        console.log(`📊 Notification Navigation: ${screen}`);

        Sentry.addBreadcrumb({
            category: 'navigation',
            message: `Notification nav: ${screen}`,
            level: 'info',
            data: {
                screen,
                source,
                deepLink
            }
        });
    } catch (error) {
        console.error('Track notification navigation error:', error);
    }
};

/**
 * Share screen via deep link
 */
export const shareScreen = async (screen, params = {}) => {
    try {
        // Build deep link
        const deepLink = buildDeepLink(screen, params, true); // Use web URL

        const message = getShareMessage(screen);
        
        await Linking.openURL(
            `https://wa.me/?text=${encodeURIComponent(`${message}\n${deepLink}`)}`
        );

        // Track share event
        console.log(`📤 Shared: ${screen}`);

    } catch (error) {
        console.error('Share screen error:', error);
        Sentry.captureException(error, {
            tags: { feature: 'share' },
            extra: { screen }
        });
    }
};

/**
 * Get share message for screen
 */
const getShareMessage = (screen) => {
    const messages = {
        'CVDetail': 'Benim CV\'mi kontrol et! 📄',
        'JobDetail': 'Bu iş ilanı ilgi çekici! 💼',
        'ReviewDetail': 'Bu CV değerlendirmesini oku! ⭐',
        'InterviewPrep': 'Mülakat hazırlığı için AI asistanı! 🤖'
    };

    return messages[screen] || 'CVniz\'te benimle bağlantı kur!';
};

/**
 * Build deep link helper
 */
export const buildDeepLink = (screen, params = {}, useWeb = false) => {
    const scheme = useWeb ? 'https' : 'cvniz';
    const domain = useWeb ? 'cvniz.com' : '';

    let path = '';

    switch (screen) {
        case 'CVDetail':
            path = `cv/${params.cvId}`;
            break;
        case 'JobDetail':
            path = `job/${params.jobId}`;
            break;
        case 'ReviewDetail':
            path = `review/${params.reviewId}`;
            break;
        case 'ApplicationDetail':
            path = `application/${params.appId}`;
            break;
        case 'RecommendationDetail':
            path = `recommendation/${params.recId}`;
            break;
        case 'InterviewPrep':
            path = 'ai/interview';
            break;
        case 'SkillGap':
            path = 'ai/skill-gap';
            break;
        default:
            path = screen.toLowerCase();
    }

    // Add query parameters
    const queryParams = new URLSearchParams(params);
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    return useWeb
        ? `${scheme}://${domain}/${path}${query}`
        : `${scheme}://${path}${query}`;
};

/**
 * Handle URL scheme for Android intent filters
 */
export const setupAndroidIntentFilters = () => {
    // This is configured in android/app/build.gradle
    // and android/app/src/main/AndroidManifest.xml

    const intentFilters = [
        {
            action: 'android.intent.action.VIEW',
            category: ['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE'],
            data: {
                scheme: 'cvniz',
                host: '*'
            }
        },
        {
            action: 'android.intent.action.VIEW',
            category: ['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE'],
            data: {
                scheme: 'https',
                host: 'cvniz.com',
                pathPrefix: '/'
            }
        }
    ];

    console.log('📱 Android intent filters configured:', intentFilters);

    return intentFilters;
};

/**
 * Setup iOS Universal Links
 */
export const setupIOSUniversalLinks = () => {
    // This requires apple-app-site-association file on server:
    // https://cvniz.com/.well-known/apple-app-site-association

    const config = {
        appID: 'TEAM_ID.com.cvniz',
        paths: [
            '/cv/*',
            '/job/*',
            '/review/*',
            '/ai/*',
            '/admin/*',
            '/settings/*'
        ]
    };

    console.log('📱 iOS Universal Links configured:', config);

    return config;
};

/**
 * Validate deep link
 */
export const isValidDeepLink = (url) => {
    if (!url) return false;

    const validSchemes = ['cvniz://', 'https://cvniz.com', 'https://www.cvniz.com'];
    return validSchemes.some(scheme => url.startsWith(scheme));
};

export default {
    useDeepLinking,
    useNotificationDeepLinking,
    trackDeepLinkEvent,
    trackNotificationNavigation,
    shareScreen,
    buildDeepLink,
    isValidDeepLink,
    setupAndroidIntentFilters,
    setupIOSUniversalLinks
};
