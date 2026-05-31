/**
 * Deep Linking Configuration
 * Handles URI schemes, route mapping, and navigation
 */

// App URI scheme: cvniz://
// Web URL: https://cvniz.com

const deepLinkingConfiguration = {
    // Android intent filter + iOS Universal Links
    prefixes: ['cvniz://', 'https://cvniz.com', 'https://www.cvniz.com'],

    // Route mapping
    config: {
        screens: {
            // Authentication
            Login: 'auth/login/:email',
            Register: 'auth/register/:code',
            ResetPassword: 'auth/reset/:token',

            // Main app tabs
            Home: {
                path: 'home',
                screens: {
                    HomeScreen: 'home',
                    CVList: 'cvs',
                    JobsScreen: 'jobs',
                    ProfileScreen: 'profile'
                }
            },

            // CV Management
            CVDetail: 'cv/:cvId',
            CVCreate: 'cv/create',
            CVEdit: 'cv/:cvId/edit',
            CVTemplate: 'cv/template/:templateId',

            // Jobs
            JobDetail: 'job/:jobId',
            JobApply: 'job/:jobId/apply',
            JobSearch: 'jobs/search/:query',
            JobsBySkill: 'jobs/skill/:skill',
            JobsByLocation: 'jobs/location/:location',

            // Applications
            ApplicationList: 'applications',
            ApplicationDetail: 'application/:appId',
            ApplicationStatus: 'application/:appId/status',

            // Recommendations
            Recommendations: 'recommendations',
            RecommendationDetail: 'recommendation/:recId',

            // AI Features
            InterviewPrep: 'ai/interview',
            InterviewDetail: 'ai/interview/:topicId',
            SkillGap: 'ai/skill-gap',
            CVScore: 'ai/cv-score',
            CVScore Detail: 'ai/cv-score/:cvId',

            // Reviews
            ReviewCreate: 'review/:cvId/create',
            ReviewDetail: 'review/:reviewId',

            // Admin Panel
            AdminPanel: 'admin',
            AdminDashboard: 'admin/dashboard',
            AdminUsers: 'admin/users',
            AdminAnalytics: 'admin/analytics',
            FeatureFlagAdmin: 'admin/flags',
            ABTestDashboard: 'admin/ab-tests',

            // Support
            SupportCenter: 'support',
            SupportArticle: 'support/:articleId',
            SupportTicket: 'support/ticket/:ticketId',

            // Settings
            Settings: 'settings',
            SettingsProfile: 'settings/profile',
            SettingsNotifications: 'settings/notifications',
            SettingsSecurity: 'settings/security',

            // Premium
            PremiumPlans: 'premium',
            PremiumCheckout: 'premium/checkout/:planId',

            // 404
            NotFound: '*'
        }
    }
};

/**
 * Parse deep link and extract parameters
 */
export const parseDeepLink = (url) => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        
        // Parse path segments
        const segments = pathname.split('/').filter(Boolean);
        
        return {
            scheme: urlObj.protocol.replace(':', ''),
            domain: urlObj.hostname,
            path: pathname,
            segments,
            query: Object.fromEntries(urlObj.searchParams)
        };
    } catch (error) {
        console.error('Parse deep link error:', error);
        return null;
    }
};

/**
 * Build deep link from parameters
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
        case 'InterviewPrep':
            path = 'ai/interview';
            break;
        case 'ReviewDetail':
            path = `review/${params.reviewId}`;
            break;
        case 'AdminDashboard':
            path = 'admin/dashboard';
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
 * Linking configuration for React Navigation
 */
export const linking = {
    ...deepLinkingConfiguration,

    async getInitialURL() {
        // Check if deep link is available
        const url = await getInitialURL();
        
        if (url != null) {
            console.log('🔗 Initial URL:', url);
            return url;
        }

        return undefined;
    },

    subscribe(listener) {
        // Listen for deep links from dynamic links
        const onReceiveURL = ({ url }) => {
            if (url != null && url.startsWith('cvniz://')) {
                listener(url);
            }
        };

        // Listen for notification deep links
        const unsubscribeNotification = () => {
            // Implementation with notification handler
        };

        // Cleanup function
        return () => {
            unsubscribeNotification();
        };
    }
};

/**
 * Get initial URL (for when app is launched with deep link)
 */
async function getInitialURL() {
    // Check if deep link is available (Android)
    const url = await Linking.getInitialURL();
    if (url != null) {
        return url;
    }

    return undefined;
}

/**
 * Navigation linking options
 */
export const navigationLinkingOptions = {
    screens: deepLinkingConfiguration.config.screens,

    // Fallback screen for unmatched routes
    fallback: 'NotFound'
};

/**
 * Helper to navigate using deep link
 */
export const navigateViaDeepLink = (navigation, deepLink) => {
    try {
        const parsed = parseDeepLink(deepLink);

        if (!parsed) {
            console.warn('Invalid deep link:', deepLink);
            return false;
        }

        const [screenName, ...params] = parsed.segments;

        // Map screen names
        const screenMap = {
            'cv': { name: 'CVDetail', param: 'cvId' },
            'job': { name: 'JobDetail', param: 'jobId' },
            'admin': { name: 'AdminPanel' },
            'settings': { name: 'Settings' },
            'support': { name: 'SupportCenter' },
            'review': { name: 'ReviewDetail', param: 'reviewId' },
            'ai': { name: 'AIFeatures' },
            'recommendations': { name: 'Recommendations' }
        };

        const mappedScreen = screenMap[screenName];

        if (mappedScreen) {
            const screenParams = mappedScreen.param && params[0]
                ? { [mappedScreen.param]: params[0] }
                : { ...parsed.query };

            navigation.navigate(mappedScreen.name, screenParams);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Navigate via deep link error:', error);
        return false;
    }
};

export default deepLinkingConfiguration;
