import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * useAnalytics Hook
 * Manages analytics and monitoring data retrieval
 */
export const useAnalytics = () => {
    const [health, setHealth] = useState(null);
    const [features, setFeatures] = useState(null);
    const [retention, setRetention] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [database, setDatabase] = useState(null);
    const [cache, setCache] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Get system health status
     */
    const getSystemHealth = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/health');
            setHealth(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch system health';
            setError(errorMsg);
            console.error('Health check error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get feature adoption metrics
     */
    const getFeatureMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/features');
            setFeatures(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch feature metrics';
            setError(errorMsg);
            console.error('Feature metrics error:', err);
            // Don't throw - this is not critical
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get user retention metrics
     */
    const getRetentionMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/retention');
            setRetention(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch retention metrics';
            setError(errorMsg);
            console.error('Retention metrics error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get API performance metrics
     */
    const getPerformanceMetrics = useCallback(async (endpoint = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (endpoint) params.append('endpoint', endpoint);

            const response = await api.get(`/monitoring/performance?${params}`);
            setPerformance(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch performance metrics';
            setError(errorMsg);
            console.error('Performance metrics error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get database performance metrics
     */
    const getDatabaseMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/database');
            setDatabase(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch database metrics';
            setError(errorMsg);
            console.error('Database metrics error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get cache performance metrics
     */
    const getCacheMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/cache');
            setCache(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch cache metrics';
            setError(errorMsg);
            console.error('Cache metrics error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get system alerts
     */
    const getAlerts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/alerts');
            setAlerts(response.data.alerts || []);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch alerts';
            setError(errorMsg);
            console.error('Alerts error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get metrics report
     */
    const getMetricsReport = useCallback(async (startDate, endDate) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/monitoring/report', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to generate report';
            setError(errorMsg);
            console.error('Report generation error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Export metrics as CSV
     */
    const exportMetrics = useCallback(async (format = 'csv') => {
        try {
            const response = await api.get('/monitoring/export', {
                params: { format },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `metrics.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error('Export error:', err);
            setError('Failed to export metrics');
        }
    }, []);

    return {
        // State
        health,
        features,
        retention,
        performance,
        database,
        cache,
        alerts,
        loading,
        error,

        // Methods
        getSystemHealth,
        getFeatureMetrics,
        getRetentionMetrics,
        getPerformanceMetrics,
        getDatabaseMetrics,
        getCacheMetrics,
        getAlerts,
        getMetricsReport,
        exportMetrics
    };
};

export default useAnalytics;
