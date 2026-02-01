import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import api from '../services/api';

/**
 * Hook for managing feature flags
 * @returns {Object} flags object and utility functions
 */
export const useFeatureFlags = () => {
    const { user } = useAuth();
    const [flags, setFlags] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch flags on mount and when user changes
    useEffect(() => {
        if (!user?.id) return;

        const fetchFlags = async () => {
            try {
                setLoading(true);
                const response = await api.get('/experiments/feature-flags');

                if (response.data.success) {
                    // Convert array to object for easy access
                    const flagsObject = {};
                    response.data.flags.forEach(flag => {
                        flagsObject[flag.name] = flag.enabled;
                    });
                    setFlags(flagsObject);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch feature flags:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlags();
    }, [user?.id]);

    // Check if specific feature is enabled
    const isFeatureEnabled = useCallback(async (featureName) => {
        try {
            const response = await api.get(`/experiments/feature-enabled/${featureName}`);
            return response.data.enabled;
        } catch (err) {
            console.error(`Failed to check feature ${featureName}:`, err);
            return flags[featureName] || false;
        }
    }, [flags]);

    // Get feature flag status (local, faster)
    const getFeatureStatus = useCallback((featureName) => {
        return flags[featureName] || false;
    }, [flags]);

    // Check multiple features at once
    const checkFeatures = useCallback((featureNames) => {
        return featureNames.reduce((acc, name) => {
            acc[name] = flags[name] || false;
            return acc;
        }, {});
    }, [flags]);

    return {
        flags,
        loading,
        error,
        isFeatureEnabled: getFeatureStatus,
        checkFeatures,
        getFeatureStatus,
        isFeatureEnabledAsync: isFeatureEnabled
    };
};

/**
 * Hook to conditionally render based on feature flag
 */
export const FeatureFlag = ({ name, children, fallback = null }) => {
    const { isFeatureEnabled, loading } = useFeatureFlags();

    if (loading) return fallback;
    if (!isFeatureEnabled(name)) return fallback;

    return children;
};
