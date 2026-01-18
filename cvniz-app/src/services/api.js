import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API_BASE_URL } from '../constants';

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

export const setAuthToken = async (token) => {
    authToken = token;
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
};

export const getAuthToken = () => authToken;

// Initialize token from storage
export const initializeToken = async () => {
    try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (storedToken) {
            authToken = storedToken;
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        return storedToken;
    } catch (error) {
        console.error('Initialize token error:', error);
        return null;
    }
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        config.headers['x-platform'] = 'mobile';
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
                    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                    if (refreshToken) {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken
                        });

                        if (response.data.success) {
                            await setAuthToken(response.data.token);
                            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                            return api(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    await setAuthToken(null);
                    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                }
            }
        }

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
};

// ============ TEMPLATE API ============
export const templateAPI = {
    getAll: () =>
        api.get('/templates'),

    getById: (id) =>
        api.get(`/templates/${id}`),
};

// ============ LETTER API ============
export const letterAPI = {
    generate: (data) =>
        api.post('/letters/generate', data),

    getAll: () =>
        api.get('/letters'),

    getById: (id) =>
        api.get(`/letters/${id}`),

    delete: (id) =>
        api.delete(`/letters/${id}`),
};

// ============ REVIEW API ============
export const reviewAPI = {
    getATS: (cvId) =>
        api.post('/review/ats', { cvId }),

    getAISuggestions: (cvId) =>
        api.post('/review/ai-suggestions', { cvId }),

    requestExpertReview: (cvId, data) =>
        api.post('/review/expert', { cvId, ...data }),

    getReviews: () =>
        api.get('/review'),
};

// ============ TRANSLATE API ============
export const translateAPI = {
    translate: (cvId, targetLanguage) =>
        api.post('/cv/translate', { cvId, targetLanguage }),

    getSupportedLanguages: () =>
        api.get('/cv/languages'),
};

// ============ SHARE API ============
export const shareAPI = {
    createLink: (cvId, options = {}) =>
        api.post(`/cvs/${cvId}/share`, options),

    getShareSettings: (cvId) =>
        api.get(`/cvs/${cvId}/share`),

    updateShareSettings: (cvId, settings) =>
        api.put(`/cvs/${cvId}/share`, settings),

    deleteShareLink: (cvId) =>
        api.delete(`/cvs/${cvId}/share`),
};

// ============ ANALYTICS API ============
export const analyticsAPI = {
    getCVStats: (cvId) =>
        api.get(`/cvs/${cvId}/analytics`),

    getDashboardStats: () =>
        api.get('/analytics/dashboard'),

    getViewHistory: (cvId) =>
        api.get(`/cvs/${cvId}/views`),
};

// ============ JOB API ============
export const jobAPI = {
    search: (params) =>
        api.get('/salary/search-jobs', { params }),

    getRecommended: () =>
        api.get('/salary/recommended-jobs'),

    getSalaryInfo: (params) =>
        api.post('/salary/info', params),
};

// ============ AI API ============
export const aiAPI = {
    generateSummary: (data) =>
        api.post('/cv/ai/summary', data),

    improveBulletPoint: (text) =>
        api.post('/cv/ai/improve-bullet', { text }),

    generateSkills: (jobTitle) =>
        api.post('/cv/ai/skills', { jobTitle }),

    targetFit: (cvId, jobDescription) =>
        api.post('/target-fit/analyze', { cvId, jobDescription }),

    interviewQuestions: (cvId, jobTitle) =>
        api.post('/interview/questions', { cvId, jobTitle }),
};

// ============ NOTIFICATION API ============
export const notificationAPI = {
    getAll: () =>
        api.get('/notifications'),

    markAsRead: (id) =>
        api.put(`/notifications/${id}/read`),

    markAllAsRead: () =>
        api.put('/notifications/read-all'),

    getUnreadCount: () =>
        api.get('/notifications/unread-count'),
};

// ============ USER API ============
export const userAPI = {
    getProfile: () =>
        api.get('/user/profile'),

    updateProfile: (data) =>
        api.put('/user/profile', data),

    changePassword: (currentPassword, newPassword) =>
        api.post('/user/change-password', { currentPassword, newPassword }),

    getActivityLog: () =>
        api.get('/user/activity'),

    deleteAccount: () =>
        api.delete('/user/account'),
};

// ============ PAYMENT API ============
export const paymentAPI = {
    getPlans: () =>
        api.get('/payment/plans'),

    subscribe: (planId, paymentMethod) =>
        api.post('/payment/subscribe', { planId, paymentMethod }),

    cancelSubscription: () =>
        api.post('/payment/cancel'),

    getHistory: () =>
        api.get('/payment/history'),
};

export default api;
