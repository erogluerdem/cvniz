import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { cvAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CVContext = createContext(null);

export function CVProvider({ children }) {
    const { user } = useAuth();
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load CVs when user changes
    useEffect(() => {
        if (user) {
            loadCVs();
        } else {
            setCvs([]);
        }
    }, [user]);

    const loadCVs = async () => {
        setLoading(true);
        try {
            const response = await cvAPI.getAll();
            if (response.success) {
                setCvs(response.cvs);
                // Cache locally
                await AsyncStorage.setItem(STORAGE_KEYS.CVS, JSON.stringify(response.cvs));
            }
        } catch (error) {
            console.error('Load CVs error:', error);
            // Try to load from cache
            try {
                const cached = await AsyncStorage.getItem(STORAGE_KEYS.CVS);
                if (cached) {
                    setCvs(JSON.parse(cached));
                }
            } catch (cacheError) {
                console.error('Cache error:', cacheError);
            }
        } finally {
            setLoading(false);
        }
    };

    const createCV = async (cvData) => {
        try {
            const response = await cvAPI.create({
                name: cvData.name || 'Adsız CV',
                template: cvData.template || 'modern',
                data: cvData.data || { personalInfo: {}, experience: [], education: [], skills: [] }
            });

            if (response.success) {
                setCvs(prev => [response.cv, ...prev]);
                return { success: true, cv: response.cv };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updateCV = async (cvId, updates) => {
        try {
            const response = await cvAPI.update(cvId, updates);

            if (response.success) {
                setCvs(prev => prev.map(cv => cv._id === cvId || cv.id === cvId ? response.cv : cv));
                return { success: true, cv: response.cv };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const deleteCV = async (cvId) => {
        try {
            const response = await cvAPI.delete(cvId);

            if (response.success) {
                setCvs(prev => prev.filter(cv => cv._id !== cvId && cv.id !== cvId));
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const duplicateCV = async (cvId) => {
        try {
            const response = await cvAPI.duplicate(cvId);

            if (response.success) {
                setCvs(prev => [response.cv, ...prev]);
                return { success: true, cv: response.cv };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getCV = useCallback((cvId) => {
        const cv = cvs.find(cv => cv._id === cvId || cv.id === cvId);
        return cv ? { success: true, cv } : { success: false, error: 'CV bulunamadı' };
    }, [cvs]);

    const value = {
        cvs,
        loading,
        loadCVs,
        createCV,
        updateCV,
        deleteCV,
        duplicateCV,
        getCV
    };

    return (
        <CVContext.Provider value={value}>
            {children}
        </CVContext.Provider>
    );
}

export const useCV = () => {
    const context = useContext(CVContext);
    if (!context) {
        throw new Error('useCV must be used within CVProvider');
    }
    return context;
};
