/**
 * Mobile Analytics Service
 * Firebase Analytics, Crashlytics, Performance monitoring
 */

import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import * as Sentry from '@sentry/react-native';

/**
 * Initialize analytics
 */
export const initializeAnalytics = async () => {
    try {
        // Enable analytics collection
        await analytics().setAnalyticsCollectionEnabled(true);
        console.log('✅ Analytics initialized');

        // Enable crashlytics collection
        await crashlytics().setCrashlyticsCollectionEnabled(true);
        console.log('✅ Crashlytics initialized');

        // Set user ID for analytics
        // await analytics().setUserId(userId);

        // Set user properties
        // await analytics().setUserProperties({
        //     plan: 'premium',
        //     language: 'tr',
        //     country: 'TR'
        // });

    } catch (error) {
        console.error('Analytics initialization error:', error);
    }
};

/**
 * Hook for tracking screen views
 */
export const useAnalyticsScreenTracking = (screenName) => {
    React.useEffect(() => {
        trackScreenView(screenName);
    }, [screenName]);
};

/**
 * Track screen view
 */
export const trackScreenView = async (screenName, params = {}) => {
    try {
        await analytics().logScreenView({
            screen_name: screenName,
            screen_class: screenName,
            ...params
        });

        console.log(`📊 Screen viewed: ${screenName}`);
    } catch (error) {
        console.error('Track screen view error:', error);
    }
};

/**
 * Track custom events
 */
export const trackEvent = async (eventName, params = {}) => {
    try {
        // Firebase Analytics
        await analytics().logEvent(eventName, params);

        // Sentry Breadcrumb
        Sentry.addBreadcrumb({
            category: 'analytics',
            message: eventName,
            level: 'info',
            data: params
        });

        console.log(`📊 Event tracked: ${eventName}`, params);
    } catch (error) {
        console.error('Track event error:', error);
    }
};

/**
 * Track user actions with timing
 */
export const trackTimedEvent = async (eventName, duration, params = {}) => {
    try {
        await trackEvent(eventName, {
            ...params,
            duration_ms: Math.round(duration)
        });
    } catch (error) {
        console.error('Track timed event error:', error);
    }
};

/**
 * Track common events
 */
export const Analytics = {
    // Authentication
    trackLogin: (method) => trackEvent('login', { method }),
    trackRegister: () => trackEvent('sign_up'),
    trackLogout: () => trackEvent('logout'),
    trackForgotPassword: () => trackEvent('forgot_password'),

    // CV Management
    trackCVCreated: (templateId) => trackEvent('cv_created', { template_id: templateId }),
    trackCVEdited: (cvId) => trackEvent('cv_edited', { cv_id: cvId }),
    trackCVDeleted: (cvId) => trackEvent('cv_deleted', { cv_id: cvId }),
    trackCVViewed: (cvId) => trackEvent('cv_viewed', { cv_id: cvId }),
    trackCVShared: (cvId, method) => trackEvent('cv_shared', { cv_id: cvId, method }),
    trackCVDownloaded: (cvId, format) => trackEvent('cv_downloaded', { cv_id: cvId, format }),

    // Templates
    trackTemplateViewed: (templateId) => trackEvent('template_viewed', { template_id: templateId }),
    trackTemplateUsed: (templateId) => trackEvent('template_used', { template_id: templateId }),

    // Premium/Payments
    trackPremiumViewed: () => trackEvent('premium_viewed'),
    trackPlanUpgraded: (plan, price) => trackEvent('plan_upgraded', { plan, price }),
    trackSubscriptionCreated: (plan) => trackEvent('subscription_created', { plan }),
    trackSubscriptionCancelled: (plan) => trackEvent('subscription_cancelled', { plan }),
    trackPaymentFailed: (reason) => trackEvent('payment_failed', { reason }),

    // AI Features
    trackInterviewPrepStarted: (topic) => trackEvent('interview_prep_started', { topic }),
    trackSkillGapAnalyzed: (cvId) => trackEvent('skill_gap_analyzed', { cv_id: cvId }),
    trackCVScored: (cvId, score) => trackEvent('cv_scored', { cv_id: cvId, score }),

    // Search & Discovery
    trackJobSearched: (query) => trackEvent('job_searched', { query }),
    trackJobViewed: (jobId) => trackEvent('job_viewed', { job_id: jobId }),
    trackJobApplied: (jobId) => trackEvent('job_applied', { job_id: jobId }),

    // Notifications
    trackNotificationReceived: (type) => trackEvent('notification_received', { type }),
    trackNotificationOpened: (type, screen) => trackEvent('notification_opened', { type, screen }),

    // Offline
    trackOfflineSyncStarted: () => trackEvent('offline_sync_started'),
    trackOfflineSyncCompleted: (itemCount) => trackEvent('offline_sync_completed', { item_count: itemCount }),
    trackOfflineSyncFailed: (reason) => trackEvent('offline_sync_failed', { reason }),

    // Performance Issues
    trackPerformanceIssue: (type, duration) => trackEvent('performance_issue', { type, duration_ms: duration }),

    // Errors
    trackError: (errorType, errorMessage) => trackEvent('app_error', { 
        error_type: errorType, 
        error_message: errorMessage 
    })
};

/**
 * Set user properties for analytics
 */
export const setUserProperties = async (userId, properties) => {
    try {
        // Firebase Analytics
        await analytics().setUserId(userId);
        await analytics().setUserProperties(properties);

        // Sentry
        Sentry.setUser({
            id: userId,
            ...properties
        });

        console.log('📊 User properties set:', properties);
    } catch (error) {
        console.error('Set user properties error:', error);
    }
};

/**
 * Record exception in Crashlytics
 */
export const recordException = async (error, context = {}) => {
    try {
        // Crashlytics
        if (crashlytics().isCrashlyticsCollectionEnabled) {
            crashlytics().recordError(error);
        }

        // Sentry
        Sentry.captureException(error, { extra: context });

        console.error('❌ Exception recorded:', error);
    } catch (err) {
        console.error('Record exception error:', err);
    }
};

/**
 * Start performance trace
 */
export const startPerformanceTrace = (traceName) => {
    let trace = null;

    return {
        start: async () => {
            try {
                trace = await perf().startTrace(traceName);
                console.log(`⏱️ Performance trace started: ${traceName}`);
            } catch (error) {
                console.error('Start trace error:', error);
            }
        },

        stop: async (metrics = {}) => {
            try {
                if (trace) {
                    // Add metrics
                    Object.entries(metrics).forEach(([key, value]) => {
                        trace.putMetric(key, value);
                    });

                    await trace.stop();
                    console.log(`✅ Performance trace completed: ${traceName}`);
                }
            } catch (error) {
                console.error('Stop trace error:', error);
            }
        },

        addMetric: (metricName, value) => {
            if (trace) {
                trace.putMetric(metricName, value);
            }
        }
    };
};

/**
 * Performance monitoring hook
 */
export const usePerformanceTrace = (traceName) => {
    const traceRef = React.useRef(null);

    React.useEffect(() => {
        const trace = startPerformanceTrace(traceName);
        trace.start();
        traceRef.current = trace;

        return () => {
            trace.stop();
        };
    }, [traceName]);

    return {
        addMetric: (name, value) => traceRef.current?.addMetric(name, value)
    };
};

/**
 * Session tracking
 */
export const trackSessionStart = async (userId) => {
    try {
        await trackEvent('session_start', { 
            user_id: userId,
            timestamp: new Date().toISOString()
        });

        console.log('📊 Session started');
    } catch (error) {
        console.error('Track session start error:', error);
    }
};

export const trackSessionEnd = async (userId, durationSeconds) => {
    try {
        await trackEvent('session_end', { 
            user_id: userId,
            duration_seconds: durationSeconds,
            timestamp: new Date().toISOString()
        });

        console.log('📊 Session ended');
    } catch (error) {
        console.error('Track session end error:', error);
    }
};

/**
 * Funnel tracking
 */
export const trackFunnelStep = async (funnelName, step, stepNumber) => {
    try {
        await trackEvent('funnel_step', {
            funnel_name: funnelName,
            step_name: step,
            step_number: stepNumber
        });

        console.log(`📊 Funnel step: ${funnelName} > ${step}`);
    } catch (error) {
        console.error('Track funnel step error:', error);
    }
};

/**
 * A/B Test tracking
 */
export const trackABTestExposure = async (testId, variant) => {
    try {
        await trackEvent('ab_test_exposure', {
            test_id: testId,
            variant
        });

        console.log(`📊 A/B Test exposed: ${testId} > ${variant}`);
    } catch (error) {
        console.error('Track A/B test error:', error);
    }
};

/**
 * Deep link tracking (already handled by DeepLinkingService)
 * But can be extended here for more detailed analytics
 */
export const trackDeepLink = async (deepLink, source) => {
    try {
        await trackEvent('deep_link_opened', {
            deep_link: deepLink,
            source
        });

        console.log(`📊 Deep link: ${deepLink} from ${source}`);
    } catch (error) {
        console.error('Track deep link error:', error);
    }
};

export default {
    initializeAnalytics,
    trackScreenView,
    trackEvent,
    trackTimedEvent,
    Analytics,
    setUserProperties,
    recordException,
    startPerformanceTrace,
    usePerformanceTrace,
    trackSessionStart,
    trackSessionEnd,
    trackFunnelStep,
    trackABTestExposure,
    trackDeepLink
};
