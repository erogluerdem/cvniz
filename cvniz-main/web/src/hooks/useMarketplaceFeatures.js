/**
 * Custom Hooks for Marketplace Features
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for premium/subscription management
 */
export const usePremium = () => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [status, setStatus] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadPlans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/premium/plans', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setPlans(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const checkStatus = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/premium/status', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setStatus(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const subscribe = useCallback(async (planId, billingCycle) => {
        try {
            setLoading(true);
            const response = await fetch('/api/premium/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ planId, billingCycle })
            });
            const data = await response.json();
            setSubscription(data);
            await checkStatus();
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const upgrade = useCallback(async (planId) => {
        try {
            setLoading(true);
            const response = await fetch('/api/premium/upgrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ planId })
            });
            const data = await response.json();
            await checkStatus();
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const cancel = useCallback(async (immediate = false) => {
        try {
            setLoading(true);
            const response = await fetch('/api/premium/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ immediate })
            });
            const data = await response.json();
            await checkStatus();
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    return {
        subscription,
        status,
        plans,
        loading,
        error,
        loadPlans,
        checkStatus,
        subscribe,
        upgrade,
        cancel
    };
};

/**
 * Hook for marketplace services
 */
export const useMarketplace = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchServices = useCallback(async (query) => {
        try {
            setLoading(true);
            const params = new URLSearchParams(query);
            const response = await fetch(`/api/marketplace/search?${params}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setServices(data.listings || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const createListing = useCallback(async (listingData) => {
        try {
            setLoading(true);
            const response = await fetch('/api/marketplace/service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(listingData)
            });
            const data = await response.json();
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const placeOrder = useCallback(async (serviceId, orderData) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/marketplace/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ serviceId, ...orderData })
            });
            const data = await response.json();
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const loadOrders = useCallback(async (role = 'buyer') => {
        try {
            setLoading(true);
            const response = await fetch(`/api/marketplace/orders?role=${role}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setOrders(data.orders || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const submitDeliverable = useCallback(async (orderId, deliverableData) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/marketplace/orders/${orderId}/deliverable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(deliverableData)
            });
            const data = await response.json();
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const leaveReview = useCallback(async (orderId, rating, comment, isProvider = false) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/marketplace/orders/${orderId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ rating, comment, isProvider })
            });
            const data = await response.json();
            await loadOrders(isProvider ? 'provider' : 'buyer');
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    return {
        services,
        orders,
        loading,
        error,
        searchServices,
        createListing,
        placeOrder,
        loadOrders,
        submitDeliverable,
        leaveReview
    };
};

/**
 * Hook for skill matching
 */
export const useSkillMatching = () => {
    const { user } = useAuth();
    const [assessment, setAssessment] = useState(null);
    const [skillGap, setSkillGap] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [jobMatches, setJobMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createAssessment = useCallback(async (currentSkills, targetSkills) => {
        try {
            setLoading(true);
            const response = await fetch('/api/skill-matching/assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ currentSkills, targetSkills })
            });
            const data = await response.json();
            setAssessment(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const analyzeGap = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/skill-matching/gap', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setSkillGap(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const getRecommendations = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/skill-matching/recommendations', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setRecommendations(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const getJobMatches = useCallback(async (limit = 10) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/skill-matching/job-matches?limit=${limit}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setJobMatches(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    return {
        assessment,
        skillGap,
        recommendations,
        jobMatches,
        loading,
        error,
        createAssessment,
        analyzeGap,
        getRecommendations,
        getJobMatches
    };
};

/**
 * Hook for freelancer management
 */
export const useFreelancer = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [freelancers, setFreelancers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProfile = useCallback(async (profileData) => {
        try {
            setLoading(true);
            const response = await fetch('/api/freelancer/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(profileData)
            });
            const data = await response.json();
            setProfile(data);
            setError(null);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const searchFreelancers = useCallback(async (query) => {
        try {
            setLoading(true);
            const params = new URLSearchParams(query);
            const response = await fetch(`/api/freelancer/search?${params}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setFreelancers(data.freelancers || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    return {
        profile,
        freelancers,
        projects,
        loading,
        error,
        createProfile,
        searchFreelancers
    };
};
