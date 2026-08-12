import axios from 'axios';

// API Configuration - Use environment variable or default to relative /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management
let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('CVniz_auth_token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('CVniz_auth_token');
    }
};

// Initialize token from storage
export const initializeToken = () => {
    const storedToken = localStorage.getItem('CVniz_auth_token');
    if (storedToken) {
        authToken = storedToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    return storedToken;
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        config.headers['x-platform'] = 'web';
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
            if (!originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem('CVniz_refresh_token');
                    if (refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken
                        });

                        if (response.data.success) {
                            setAuthToken(response.data.token);
                            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                            return api(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    // Refresh failed, logout user
                    setAuthToken(null);
                    localStorage.removeItem('CVniz_refresh_token');
                    window.location.href = '/login';
                }
            }
        }

        // Extract error message
        const message = error.response?.data?.error || error.message || 'Bir hata oluştu';
        const enhancedError = new Error(message);
        enhancedError.status = error.response?.status;
        enhancedError.code = error.response?.data?.code;

        return Promise.reject(enhancedError);
    }
);

// ============ AUTH API ============
export const authAPI = {
    register: (name, email, password) =>
        api.post('/auth/register', { name, email, password }),

    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    logout: (refreshToken) =>
        api.post('/auth/logout', { refreshToken }),

    getMe: () =>
        api.get('/auth/me'),

    refresh: (refreshToken) =>
        api.post('/auth/refresh', { refreshToken }),

    socialLogin: (provider, data) =>
        api.post('/auth/social', { provider, ...data }),

    changePassword: (currentPassword, newPassword) =>
        api.post('/auth/change-password', { currentPassword, newPassword }),
};

// ============ CV API ============
export const cvAPI = {
    getAll: (params = {}) =>
        api.get('/cvs', { params }),

    getById: (id) =>
        api.get(`/cvs/${id}`),

    create: (data) =>
        api.post('/cvs', data),

    update: (id, data) =>
        api.put(`/cvs/${id}`, data),

    delete: (id) =>
        api.delete(`/cvs/${id}`),

    duplicate: (id) =>
        api.post(`/cvs/${id}/duplicate`),

    archive: (id) =>
        api.patch(`/cvs/${id}/archive`),

    // Versions
    saveVersion: (id, name) =>
        api.post(`/cvs/${id}/versions`, { name }),

    restoreVersion: (cvId, versionId) =>
        api.post(`/cvs/${cvId}/versions/${versionId}/restore`),

    // Public
    getPublic: (publicUrl) =>
        api.get(`/cvs/public/${publicUrl}`),
};

// ============ SYNC API ============
export const syncAPI = {
    getStatus: (lastSyncAt) =>
        api.get('/sync/status', { params: { lastSyncAt } }),

    fullSync: () =>
        api.get('/sync/full'),

    push: (changes) =>
        api.post('/sync/push', { changes }),

    pull: (lastSyncAt) =>
        api.get('/sync/pull', { params: { lastSyncAt } }),

    resolveConflict: (cvId, resolution, mergedData) =>
        api.post('/sync/resolve-conflict', { cvId, resolution, mergedData }),
};

// ============ USER API ============
export const userAPI = {
    updateUser: (data) => api.put('/user/profile', data),
    getAnnouncements: () => api.get('/users/announcements/active'),
    validateCoupon: (code) => api.get(`/users/coupons/validate/${code}`),
    updateSettings: (settings) =>
        api.put('/users/settings', { settings }),

    getNotifications: () => api.get('/users/notifications'),
    markNotificationRead: (id) => api.patch(`/users/notifications/${id}/read`),
    getActivities: () => api.get('/users/activities'),
    getDownloadHistory: () => api.get('/users/download-history'),
    getAchievements: () => api.get('/users/achievements'),

    deleteAccount: () =>
        api.delete('/users/account'),
    // Admin: Get all users with search
    getUsers: (params = {}) =>
        api.get('/users', { params }),

    // Admin: Create user
    createUser: (data) =>
        api.post('/users', data),

    // Admin: Update user
    updateUser: (id, data) =>
        api.put(`/users/${id}`, data),

    // Admin: Get user login logs
    getLoginLogs: (id) =>
        api.get(`/users/${id}/login-logs`),

    // Admin: Reset user password
    resetPassword: (id, password) =>
        api.post(`/users/${id}/reset-password`, { password }),
};

// ============ SUPPORT API ============
export const supportAPI = {
    create: (data) =>
        api.post('/support', data),

    getTickets: () =>
        api.get('/support'),

    getAllTicketsAdmin: () =>
        api.get('/support/admin/all'),

    getById: (id) =>
        api.get(`/support/${id}`),

    updateStatus: (id, status) =>
        api.put(`/support/${id}/status`, { status }),

    addMessage: (id, content, sender) =>
        api.post(`/support/${id}/message`, { content, sender }),
};

// ============ PAYMENT API ============
export const paymentAPI = {
    getAll: () =>
        api.get('/payments'),

    getMy: () =>
        api.get('/payments/my'),

    process: (data) =>
        api.post('/payments', data),

    init: (data) =>
        api.post('/payments/init', data),

    bankTransfer: (data) =>
        api.post('/payments/bank-transfer', data),

    // Admin
    approve: (id) =>
        api.put(`/payments/${id}/approve`),

    reject: (id, adminNote) =>
        api.put(`/payments/${id}/reject`, { adminNote }),
};

// ============ ADMIN API ============
export const adminAPI = {
    getStats: () =>
        api.get('/admin/stats'),

    // Coupons
    getCoupons: () =>
        api.get('/admin/coupons'),
    createCoupon: (data) =>
        api.post('/admin/coupons', data),
    updateCoupon: (id, data) =>
        api.put(`/admin/coupons/${id}`, data),
    deleteCoupon: (id) =>
        api.delete(`/admin/coupons/${id}`),

    // Announcements
    getAnnouncements: () =>
        api.get('/admin/announcements'),
    createAnnouncement: (data) =>
        api.post('/admin/announcements', data),
    toggleAnnouncement: (id) =>
        api.patch(`/admin/announcements/${id}/toggle`),
    deleteAnnouncement: (id) =>
        api.delete(`/admin/announcements/${id}`),

    // Feedbacks
    getFeedbacks: () =>
        api.get('/admin/feedbacks'),
    // Logs
    getLogs: (params = {}) =>
        api.get('/admin/logs', { params }),
    getLogStats: () =>
        api.get('/admin/logs/stats'),

    // CVs
    getCVs: () =>
        api.get('/admin/cvs'),
    getCVById: (id) =>
        api.get(`/admin/cvs/${id}`),
    updateCV: (id, data) =>
        api.put(`/admin/cvs/${id}`, data),
    deleteCV: (id) =>
        api.delete(`/admin/cvs/${id}`),

    // Settings
    getSettings: () =>
        api.get('/admin/settings'),
    updateSetting: (key, value) =>
        api.post('/admin/settings', { key, value }),
    updateSettingsBatch: (settings) =>
        api.put('/admin/settings/batch', { settings }),
    getSystemStatus: () =>
        api.get('/admin/settings/system-check'),
    getAnalytics: (params) =>
        api.get('/admin/analytics', { params }),
    getLiveStats: () =>
        api.get('/admin/live-stats'),
    getReports: (params) =>
        api.get('/admin/reports', { params }),

    // Referrals
    getReferrals: () =>
        api.get('/admin/referrals'),
    getReferralStats: () =>
        api.get('/admin/referrals/stats'),
    updateReferral: (id, data) =>
        api.put(`/admin/referrals/${id}`, data),
    deleteReferral: (id) =>
        api.delete(`/admin/referrals/${id}`),

    // Campaigns
    getCampaigns: () =>
        api.get('/admin/campaigns'),
    getCampaignStats: () =>
        api.get('/admin/campaigns/stats'),
    createCampaign: (data) =>
        api.post('/admin/campaigns', data),
    updateCampaign: (id, data) =>
        api.put(`/admin/campaigns/${id}`, data),
    deleteCampaign: (id) =>
        api.delete(`/admin/campaigns/${id}`),

    // A/B Tests
    getABTests: () =>
        api.get('/admin/abtests'),
    getABTestStats: () =>
        api.get('/admin/abtests/stats'),
    createABTest: (data) =>
        api.post('/admin/abtests', data),
    updateABTest: (id, data) =>
        api.put(`/admin/abtests/${id}`, data),
    deleteABTest: (id) =>
        api.delete(`/admin/abtests/${id}`),

    // Jobs
    getJobs: () =>
        api.get('/admin/jobs'),
    getJobStats: () =>
        api.get('/admin/jobs/stats'),
    createJob: (data) =>
        api.post('/admin/jobs', data),
    updateJob: (id, data) =>
        api.put(`/admin/jobs/${id}`, data),
    deleteJob: (id) =>
        api.delete(`/admin/jobs/${id}`),

    // Partners
    getPartners: () =>
        api.get('/admin/partners'),
    getPartnerStats: () =>
        api.get('/admin/partners/stats'),
    createPartner: (data) =>
        api.post('/admin/partners', data),
    updatePartner: (id, data) =>
        api.put(`/admin/partners/${id}`, data),
    deletePartner: (id) =>
        api.delete(`/admin/partners/${id}`),

    // Enterprises
    getEnterprises: () =>
        api.get('/admin/enterprises'),
    getEnterpriseStats: () =>
        api.get('/admin/enterprises/stats'),
    createEnterprise: (data) =>
        api.post('/admin/enterprises', data),
    updateEnterprise: (id, data) =>
        api.put(`/admin/enterprises/${id}`, data),
    deleteEnterprise: (id) =>
        api.delete(`/admin/enterprises/${id}`),

    // Emails
    getEmails: () =>
        api.get('/admin/emails'),
    getEmailStats: () =>
        api.get('/admin/emails/stats'),
    createEmail: (data) =>
        api.post('/admin/emails', data),
    updateEmail: (id, data) =>
        api.put(`/admin/emails/${id}`, data),
    deleteEmail: (id) =>
        api.delete(`/admin/emails/${id}`),

    // Email Templates
    getEmailTemplates: () =>
        api.get('/admin/email-templates'),
    createEmailTemplate: (data) =>
        api.post('/admin/email-templates', data),
    updateEmailTemplate: (id, data) =>
        api.put(`/admin/email-templates/${id}`, data),
    deleteEmailTemplate: (id) =>
        api.delete(`/admin/email-templates/${id}`),

    // Security
    getSecuritySettings: () =>
        api.get('/admin/security/settings'),
    updateSecuritySettings: (data) =>
        api.put('/admin/security/settings', data),
    getSecurityStats: () =>
        api.get('/admin/security/stats'),
    getLoginLogs: () =>
        api.get('/admin/security/login-logs'),

    // Anti Fraud
    getFraudAlerts: () =>
        api.get('/admin/fraud-alerts'),
    createFraudAlert: (data) =>
        api.post('/admin/fraud-alerts', data),

    // GDPR Compliance
    getGDPRRequests: () =>
        api.get('/admin/gdpr-requests'),
    createGDPRRequest: (data) =>
        api.post('/admin/gdpr-requests', data),
    updateGDPRRequest: (id, data) =>
        api.put(`/admin/gdpr-requests/${id}`, data),

    // Premium Plans
    getPremiumPlans: () =>
        api.get('/admin/premium-plans'),
    createPremiumPlan: (data) =>
        api.post('/admin/premium-plans', data),
    updatePremiumPlan: (id, data) =>
        api.put(`/admin/premium-plans/${id}`, data),
    deletePremiumPlan: (id) =>
        api.delete(`/admin/premium-plans/${id}`),

    // Payment Gateways
    getPaymentGateways: () =>
        api.get('/admin/payment-gateways'),
    updatePaymentGateways: (data) =>
        api.put('/admin/payment-gateways', data),

    // SMS Providers
    getSmsProviders: () =>
        api.get('/admin/sms-providers'),
    updateSmsProviders: (data) =>
        api.put('/admin/sms-providers', data),

    // Storage Monitor
    getStorageStats: () =>
        api.get('/admin/storage-stats'),

    blockIP: (ip, reason) =>
        api.post('/admin/security/block-ip', { ip, reason }),
    unblockIP: (ip) =>
        api.delete(`/admin/security/block-ip/${encodeURIComponent(ip)}`),

    // API Keys
    getApiKeys: () =>
        api.get('/admin/api-keys'),
    getApiKeyStats: () =>
        api.get('/admin/api-keys/stats'),
    createApiKey: (data) =>
        api.post('/admin/api-keys', data),
    updateApiKey: (id, data) =>
        api.put(`/admin/api-keys/${id}`, data),
    regenerateApiKey: (id) =>
        api.post(`/admin/api-keys/${id}/regenerate`),
    deleteApiKey: (id) =>
        api.delete(`/admin/api-keys/${id}`),

    // AI Settings
    getAISettings: () =>
        api.get('/admin/ai-settings'),
    updateAISettings: (data) =>
        api.put('/admin/ai-settings', data),
    getAISettingsStats: () =>
        api.get('/admin/ai-settings/stats'),
    testAIConnection: (data) =>
        api.post('/admin/ai-settings/test', data),

    // Themes
    getThemes: () =>
        api.get('/admin/themes'),
    createTheme: (data) =>
        api.post('/admin/themes', data),
    updateTheme: (id, data) =>
        api.put(`/admin/themes/${id}`, data),
    deleteTheme: (id) =>
        api.delete(`/admin/themes/${id}`),
    setActiveTheme: (slug) =>
        api.post('/admin/themes/set-active', { slug }),
    // Blog
    getBlogPosts: () => api.get('/admin/blog'),
    createBlogPost: (data) => api.post('/admin/blog', data),
    updateBlogPost: (id, data) => api.put(`/admin/blog/${id}`, data),
    deleteBlogPost: (id) => api.delete(`/admin/blog/${id}`),

    // FAQ
    getFaqs: () => api.get('/admin/faqs'),
    createFaq: (data) => api.post('/admin/faqs', data),
    updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
    deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),

    // Career Paths
    getCareerPaths: () => api.get('/admin/career-paths'),
    createCareerPath: (data) => api.post('/admin/career-paths', data),
    updateCareerPath: (id, data) => api.put(`/admin/career-paths/${id}`, data),
    deleteCareerPath: (id) => api.delete(`/admin/career-paths/${id}`),

    // SEO
    getSeoSettings: () => api.get('/admin/seo'),
    createSeoSetting: (data) => api.post('/admin/seo', data),
    updateSeoSetting: (id, data) => api.put(`/admin/seo/${id}`, data),
    deleteSeoSetting: (id) => api.delete(`/admin/seo/${id}`),

    // Affiliate
    getAffiliates: () => api.get('/admin/affiliates'),
    createAffiliate: (data) => api.post('/admin/affiliates', data),
    updateAffiliate: (id, data) => api.put(`/admin/affiliates/${id}`, data),
    deleteAffiliate: (id) => api.delete(`/admin/affiliates/${id}`),

    // Email Templates
    getEmailTemplates: () => api.get('/admin/email-templates'),
    createEmailTemplate: (data) => api.post('/admin/email-templates', data),
    updateEmailTemplate: (id, data) => api.put(`/admin/email-templates/${id}`, data),
    deleteEmailTemplate: (id) => api.delete(`/admin/email-templates/${id}`),
};

// ============ AI API ============
export const aiAPI = {
    generateSummary: (jobTitle, experienceLevel, lang = 'tr') =>
        api.post('/ai/generate-summary', { jobTitle, experienceLevel, lang }),

    improveText: (text, lang = 'tr') =>
        api.post('/ai/improve-text', { text, lang }),

    generateExperience: (jobTitle, lang = 'tr') =>
        api.post('/ai/generate-experience', { jobTitle, lang }),

    // Premium AI Features
    optimizeLinkedIn: (data) => api.post('/ai/optimize-linkedin', data),
    generateEmail: (data) => api.post('/ai/generate-email', data),
    generateHeadshot: (data) => api.post('/ai/generate-headshot', data),
    writeProject: (data) => api.post('/ai/write-project', data),
    generateProject: (data) => api.post('/ai/project', data),
    writeReferenceLetter: (data) => api.post('/ai/write-reference', data),
    simulateInterview: (data) => api.post('/ai/simulate-interview', data),
    analyzeATS: (data) => api.post('/ai/analyze-ats', data),
    generateCoverLetter: (data) => api.post('/ai/generate-cover-letter', data),
    analyzeSalary: (data) => api.post('/ai/analyze-salary', data),
    targetFitAnalysis: (data) => api.post('/ai/target-fit', data),
    assistantChat: async (data) => {
        return handleMockResponse({
            content: "Bu bölümü şu şekilde güçlendirebilirsiniz: 'Proaktif olarak müşteri memnuniyetini %25 artıran çözümler geliştirdim.'"
        }, 1500)
    },
};

// ============ ANALYTICS API ============
export const analyticsAPI = {
    // Track a visit (usually called by public view) - handled by page load
    track: (cvId, data) => api.post(`/analytics/track/${cvId}`, data),

    // Get stats for a CV (Owner/Admin)
    getStats: (cvId) => api.get(`/analytics/stats/${cvId}`),
};

// ============ AB TEST API ============
export const abTestAPI = {
    getActive: (key, visitorId) =>
        api.get(`/abtests/active/${key}`, { params: { visitorId } }),

    track: (key, variantName) =>
        api.post('/abtests/track', { key, variantName }),

    // Admin
    getAll: () =>
        api.get('/abtests/admin/all'),

    create: (data) =>
        api.post('/abtests/admin', data),

    update: (id, data) =>
        api.put(`/abtests/admin/${id}`, data),

    delete: (id) =>
        api.delete(`/abtests/admin/${id}`),
};

// Check if API is available (for offline detection)
export const checkAPIHealth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, {
            timeout: 5000
        });
        return response.data.status === 'ok';
    } catch {
        return false;
    }
};

// ============ REVIEW API ============
export const reviewAPI = {
    getReviews: () =>
        api.get('/reviews'),

    updateStatus: (id, status) =>
        api.patch(`/reviews/${id}/status`, { status }),

    completeReview: (id, data) =>
        api.patch(`/reviews/${id}/complete`, data),
};

export const contentAPI = {
    getLandingPageContent: () => api.get('/content/landing'),
};

// ============ MEDIA API ============
export const mediaAPI = {
    getAll: () =>
        api.get('/media'),

    upload: (formData, onProgress) =>
        api.post('/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        }),

    delete: (id) =>
        api.delete(`/media/${id}`),
};

// ============ TEMPLATE API ============
export const templateAPI = {
    getAll: (admin = false) =>
        api.get('/templates', { headers: { 'x-admin-request': admin ? 'true' : 'false' } }),

    sync: (templates) =>
        api.post('/templates', { templates }),

    save: (data) =>
        api.post('/templates', data),

    toggle: (id) =>
        api.patch(`/templates/${id}/toggle`),

    delete: (id) =>
        api.delete(`/templates/${id}`),
};

// ============ TRANSLATION API ============
export const translationAPI = {
    getAll: (locale) =>
        api.get(`/translations/${locale}`),

    getAllAdmin: () =>
        api.get('/translations/admin/all'),

    upsert: (data) =>
        api.post('/translations', data),

    delete: (id) =>
        api.delete(`/translations/${id}`),

    init: (translations) =>
        api.post('/translations/init', { translations }),
};

export default api;

