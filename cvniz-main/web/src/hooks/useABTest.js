import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';

/**
 * Hook for A/B testing
 * @returns {Object} test data and tracking functions
 */
export const useABTest = (experimentId) => {
    const { user } = useAuth();
    const [variant, setVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get variant assignment for user
    useEffect(() => {
        if (!user?.id || !experimentId) return;

        const fetchVariant = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/experiments/ab-test/${experimentId}`);

                if (response.data.success) {
                    setVariant(response.data.variant);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch variant:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVariant();
    }, [user?.id, experimentId]);

    // Track event (assigned, view, click, conversion)
    const trackEvent = useCallback(async (eventType, metadata = {}) => {
        if (!variant || !experimentId) return;

        try {
            await api.post(`/experiments/ab-test/${experimentId}/event`, {
                variant,
                eventType,
                metadata
            });
        } catch (err) {
            console.error('Failed to track event:', err);
        }
    }, [variant, experimentId]);

    // Record conversion (purchase, subscription)
    const recordConversion = useCallback(async (amount = null, metadata = {}) => {
        return trackEvent('conversion', {
            amount,
            ...metadata
        });
    }, [trackEvent]);

    // Record engagement (time on page, interactions)
    const recordEngagement = useCallback(async (duration, metadata = {}) => {
        return trackEvent('engagement', {
            duration,
            ...metadata
        });
    }, [trackEvent]);

    // Record click
    const recordClick = useCallback(async (elementId, metadata = {}) => {
        return trackEvent('click', {
            elementId,
            ...metadata
        });
    }, [trackEvent]);

    // Record view
    const recordView = useCallback(async (metadata = {}) => {
        return trackEvent('view', metadata);
    }, [trackEvent]);

    return {
        variant,
        loading,
        error,
        isAssigned: !!variant,
        trackEvent,
        recordConversion,
        recordEngagement,
        recordClick,
        recordView
    };
};

/**
 * Hook to get A/B test results (Admin only)
 */
export const useABTestResults = (experimentId) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!experimentId) return;

        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/experiments/ab-test/${experimentId}/results`);

                if (response.data.success) {
                    setResults(response.data);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch results:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [experimentId]);

    return {
        results,
        loading,
        error,
        variants: results?.variants || [],
        metrics: results?.metrics || [],
        significance: results?.significance
    };
};

/**
 * Hook to manage A/B tests (Admin only)
 */
export const useABTestAdmin = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all experiments
    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                setLoading(true);
                const response = await api.get('/experiments/ab-tests');

                if (response.data.success) {
                    setExperiments(response.data.experiments || []);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch experiments:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiments();
    }, []);

    // Create experiment
    const createExperiment = useCallback(async (data) => {
        try {
            const response = await api.post('/experiments/ab-tests', data);

            if (response.data.success) {
                setExperiments(prev => [...prev, response.data.experiment]);
                return response.data.experiment;
            }
        } catch (err) {
            console.error('Failed to create experiment:', err);
            throw err;
        }
    }, []);

    // Start experiment
    const startExperiment = useCallback(async (experimentId) => {
        try {
            const response = await api.post(`/experiments/ab-tests/${experimentId}/start`);

            if (response.data.success) {
                setExperiments(prev =>
                    prev.map(exp =>
                        exp.id === experimentId
                            ? { ...exp, status: 'active' }
                            : exp
                    )
                );
                return response.data.experiment;
            }
        } catch (err) {
            console.error('Failed to start experiment:', err);
            throw err;
        }
    }, []);

    // Conclude experiment
    const concludeExperiment = useCallback(async (experimentId) => {
        try {
            const response = await api.post(`/experiments/ab-tests/${experimentId}/conclude`);

            if (response.data.success) {
                setExperiments(prev =>
                    prev.map(exp =>
                        exp.id === experimentId
                            ? { ...exp, status: 'concluded', winner: response.data.winner }
                            : exp
                    )
                );
                return response.data;
            }
        } catch (err) {
            console.error('Failed to conclude experiment:', err);
            throw err;
        }
    }, []);

    return {
        experiments,
        loading,
        error,
        createExperiment,
        startExperiment,
        concludeExperiment
    };
};
