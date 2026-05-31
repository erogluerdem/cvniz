import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for AI service interactions
 * Provides all AI features for CV building
 */
export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const apiClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    // Retry logic for API calls
    const callAI = useCallback(async (endpoint, data) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.post(`/ai/${endpoint}`, data);
            setResult(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            console.error(`AI Error (${endpoint}):`, errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Generate CV Summary suggestions
     */
    const generateSummary = useCallback(async (jobTitle, experienceLevel = 'Mid-Level', lang = 'tr') => {
        return await callAI('generate-summary', {
            jobTitle,
            experienceLevel,
            lang
        });
    }, [callAI]);

    /**
     * Generate Cover Letter
     */
    const generateCoverLetter = useCallback(async (jobTitle, company, tone, cvData, lang = 'tr') => {
        return await callAI('generate-cover-letter', {
            jobTitle,
            company,
            tone: tone || 'Professional',
            cvData,
            lang
        });
    }, [callAI]);

    /**
     * Improve Text (Grammar, Professional tone, etc.)
     */
    const improveText = useCallback(async (text, lang = 'tr', mode = 'professional') => {
        return await callAI('improve-text', {
            text,
            lang,
            mode // 'professional', 'fix_grammar', 'shorter', 'longer'
        });
    }, [callAI]);

    /**
     * Generate Experience bullet points
     */
    const generateExperience = useCallback(async (jobTitle, lang = 'tr') => {
        return await callAI('generate-experience', {
            jobTitle,
            lang
        });
    }, [callAI]);

    /**
     * Generate Interview Preparation
     */
    const generateInterviewPrep = useCallback(async (jobTitle, experience = '', lang = 'tr') => {
        return await callAI('interview-prep', {
            jobTitle,
            experience,
            lang
        });
    }, [callAI]);

    /**
     * Analyze Skill Gaps
     */
    const analyzeSkillGap = useCallback(async (currentSkills, targetJobTitle, lang = 'tr') => {
        return await callAI('skill-gap', {
            currentSkills: Array.isArray(currentSkills) ? currentSkills : currentSkills.split(','),
            targetJobTitle,
            lang
        });
    }, [callAI]);

    /**
     * Get CV Score and Analysis
     */
    const analyzeCVScore = useCallback(async (cvData, lang = 'tr') => {
        return await callAI('cv-score', {
            cvData,
            lang
        });
    }, [callAI]);

    /**
     * Get Formatting Tips
     */
    const getFormattingTips = useCallback(async (lang = 'tr') => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get(`/ai/formatting-tips?lang=${lang}`);
            setResult(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    // Clear error state
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        result,
        clearError,
        generateSummary,
        generateCoverLetter,
        improveText,
        generateExperience,
        generateInterviewPrep,
        analyzeSkillGap,
        analyzeCVScore,
        getFormattingTips
    };
};

export default useAI;
