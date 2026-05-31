// Deep Linking Configuration
// URL scheme: exp://192.168.1.110:8083/--/path

export const linkingConfig = {
    prefixes: ['exp://', 'cvniz://', 'https://cvniz.app'],

    config: {
        screens: {
            // Main Tabs
            MainTabs: {
                screens: {
                    Dashboard: 'dashboard',
                    Templates: 'templates',
                    Profile: 'profile',
                    Settings: 'settings',
                },
            },

            // Auth
            Login: 'login',
            Register: 'register',
            ForgotPassword: 'forgot-password',

            // CV
            Editor: 'cv/:cvId/edit',
            Preview: 'cv/:cvId/preview',
            Export: 'cv/:cvId/export',

            // Premium
            Premium: 'premium',

            // AI Features
            ATSAnalysis: 'ai/ats-analysis/:cvId',
            CoverLetter: 'ai/cover-letter',

            // Other
            Notifications: 'notifications',
            Onboarding: 'onboarding',
        },
    },
};

/**
 * Parse a deep link URL
 * @param {string} url - The URL to parse
 * @returns {Object|null} - Parsed link data or null
 */
export function parseDeepLink(url) {
    if (!url) return null;

    // Remove prefix
    let path = url;
    const prefixes = ['exp://', 'cvniz://', 'https://cvniz.app', '/--/'];
    for (const prefix of prefixes) {
        if (path.startsWith(prefix)) {
            path = path.slice(prefix.length);
        }
    }

    // Parse path and query params
    const [pathPart, queryPart] = path.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    const params = {};
    if (queryPart) {
        queryPart.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
    }

    return {
        path: pathPart,
        segments,
        params,
    };
}

/**
 * Navigate via deep link
 * @param {Object} navigation - React Navigation object
 * @param {Object} linkData - Parsed link data from parseDeepLink
 */
export function navigateViaDeepLink(navigation, linkData) {
    if (!linkData || !linkData.segments.length) return;

    const [mainRoute, ...subRoutes] = linkData.segments;
    const { params } = linkData;

    switch (mainRoute) {
        case 'dashboard':
            navigation.navigate('MainTabs', { screen: 'Dashboard' });
            break;
        case 'templates':
            navigation.navigate('MainTabs', { screen: 'Templates' });
            break;
        case 'profile':
            navigation.navigate('MainTabs', { screen: 'Profile' });
            break;
        case 'settings':
            navigation.navigate('MainTabs', { screen: 'Settings' });
            break;
        case 'login':
            navigation.navigate('Login');
            break;
        case 'register':
            navigation.navigate('Register');
            break;
        case 'premium':
            navigation.navigate('Premium');
            break;
        case 'notifications':
            navigation.navigate('Notifications');
            break;
        case 'cv':
            if (subRoutes[0] && params.cvId) {
                const action = subRoutes[1] || 'edit';
                switch (action) {
                    case 'edit':
                        navigation.navigate('Editor', { cvId: params.cvId });
                        break;
                    case 'preview':
                        navigation.navigate('Preview', { cvId: params.cvId });
                        break;
                    case 'export':
                        navigation.navigate('Export', { cvId: params.cvId });
                        break;
                }
            }
            break;
        case 'ai':
            if (subRoutes[0] === 'ats-analysis' && params.cvId) {
                navigation.navigate('ATSAnalysis', { cvId: params.cvId });
            } else if (subRoutes[0] === 'cover-letter') {
                navigation.navigate('CoverLetter');
            }
            break;
        default:
            console.warn('Unknown deep link route:', mainRoute);
    }
}
