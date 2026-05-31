import { useState } from 'react';
import api from '../services/api';

/**
 * useRecommendations Hook
 * Manages job recommendations, matching, and user interactions
 * @returns {Object} Recommendation methods and state
 */
export const useRecommendations = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [trending, setTrending] = useState(null);
    const [salary, setSalary] = useState(null);
    const [match, setMatch] = useState(null);
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Get personalized job recommendations
     */
    const getRecommendations = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();

            if (filters.limit) params.append('limit', filters.limit);
            if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
            if (filters.location) params.append('location', filters.location);
            if (filters.locationType) params.append('locationType', filters.locationType);
            if (filters.jobType) params.append('jobType', filters.jobType);
            if (filters.minSalary) params.append('minSalary', filters.minSalary);

            const response = await api.get(`/recommendations/jobs?${params}`);

            setRecommendations(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch recommendations';
            setError(errorMsg);
            console.error('Recommendations fetch error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get trending jobs
     */
    const getTrendingJobs = async (skills = [], limit = 10) => {
        setLoading(true);
        setError(null);
        try {
            const skillsParam = Array.isArray(skills) ? skills.join(',') : skills;
            const response = await api.get(
                `/recommendations/trending?skills=${skillsParam}&limit=${limit}`
            );

            setTrending(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch trending jobs';
            setError(errorMsg);
            console.error('Trending jobs error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get salary prediction for a role
     */
    const getSalaryPrediction = async (jobTitle, experienceLevel, location = 'Turkey') => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/recommendations/salary', {
                params: {
                    jobTitle,
                    experienceLevel,
                    location
                }
            });

            setSalary(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to predict salary';
            setError(errorMsg);
            console.error('Salary prediction error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get match score between user's CV and a job
     */
    const getJobMatch = async (jobId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/recommendations/match', { jobId });

            setMatch(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to calculate match score';
            setError(errorMsg);
            console.error('Match calculation error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Record job interaction (view, apply, save, dismiss)
     */
    const recordInteraction = async (jobId, type, duration = null) => {
        try {
            const payload = { jobId, type };
            if (duration) payload.duration = duration;

            const response = await api.post('/recommendations/interact', payload);
            return response.data;
        } catch (err) {
            console.error('Interaction recording error:', err);
            // Don't throw - interactions are non-critical
        }
    };

    /**
     * Save a job
     */
    const saveJob = async (jobId) => {
        try {
            await recordInteraction(jobId, 'save');
            setSaved(prev => [...new Set([...prev, jobId])]);
            return true;
        } catch (err) {
            console.error('Save job error:', err);
            return false;
        }
    };

    /**
     * Unsave a job
     */
    const unsaveJob = async (jobId) => {
        try {
            setSaved(prev => prev.filter(id => id !== jobId));
            return true;
        } catch (err) {
            console.error('Unsave job error:', err);
            return false;
        }
    };

    /**
     * Get saved jobs
     */
    const getSavedJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/recommendations/saved');
            setSaved(response.data.jobs.map(job => job._id));
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to fetch saved jobs';
            setError(errorMsg);
            console.error('Saved jobs error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if job is saved
     */
    const isJobSaved = (jobId) => {
        return saved.includes(jobId);
    };

    return {
        // State
        recommendations,
        trending,
        salary,
        match,
        saved,
        loading,
        error,
        isJobSaved,

        // Methods
        getRecommendations,
        getTrendingJobs,
        getSalaryPrediction,
        getJobMatch,
        recordInteraction,
        saveJob,
        unsaveJob,
        getSavedJobs
    };
};

export default useRecommendations;
