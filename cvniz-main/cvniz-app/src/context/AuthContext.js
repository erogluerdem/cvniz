import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { authAPI, setAuthToken, initializeToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const token = await initializeToken();
            const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));

                // Verify token with server
                try {
                    const response = await authAPI.getMe();
                    if (response.success) {
                        setUser(response.user);
                        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
                    }
                } catch (error) {
                    console.log('Token verification failed, using cached user');
                }
            }
        } catch (error) {
            console.error('Load user error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);

            if (response.success) {
                await setAuthToken(response.token);
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
                await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
                setUser(response.user);
                return { success: true };
            }

            return { success: false, error: response.error || 'Giriş başarısız' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await authAPI.register(name, email, password);

            if (response.success) {
                await setAuthToken(response.token);
                await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
                await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
                setUser(response.user);
                return { success: true };
            }

            return { success: false, error: response.error || 'Kayıt başarısız' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
                await authAPI.logout(refreshToken).catch(() => { });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            await setAuthToken(null);
            await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
            await AsyncStorage.removeItem(STORAGE_KEYS.CVS);
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isPremium: user?.isPremium || user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
