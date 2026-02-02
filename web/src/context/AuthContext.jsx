import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setAuthToken, initializeToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStoredUser()
    }, [])

    const loadStoredUser = async () => {
        try {
            const token = initializeToken()
            const storedUser = localStorage.getItem('CVniz_user')

            if (token && storedUser) {
                setUser(JSON.parse(storedUser))

                // Verify token with server
                try {
                    const response = await authAPI.getMe()
                    if (response.success) {
                        setUser(response.user)
                        localStorage.setItem('CVniz_user', JSON.stringify(response.user))
                    }
                } catch (error) {
                    console.log('Token verification failed:', error)
                    if (error.response && error.response.status === 401) {
                        // Token invalid/expired and refresh failed
                        console.log('Session invalid, logging out...')
                        setAuthToken(null)
                        localStorage.removeItem('CVniz_refresh_token')
                        localStorage.removeItem('CVniz_user')
                        localStorage.removeItem('CVniz_auth_token')
                        setUser(null)
                    }
                    // For other errors (network, 500), keep cached user to allow offline usage
                }
            }
        } catch (error) {
            console.error('Load user error:', error)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password)

            if (response.success) {
                setAuthToken(response.token)
                localStorage.setItem('CVniz_refresh_token', response.refreshToken)
                localStorage.setItem('CVniz_user', JSON.stringify(response.user))
                setUser(response.user)
                return { success: true, user: response.user }
            }

            return { success: false, error: response.error || 'Giriş başarısız' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const register = async (name, email, password) => {
        try {
            const response = await authAPI.register(name, email, password)

            if (response.success) {
                setAuthToken(response.token)
                localStorage.setItem('CVniz_refresh_token', response.refreshToken)
                localStorage.setItem('CVniz_user', JSON.stringify(response.user))
                setUser(response.user)
                return { success: true, user: response.user }
            }

            return { success: false, error: response.error || 'Kayıt başarısız' }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('CVniz_refresh_token')
            if (refreshToken) {
                await authAPI.logout(refreshToken).catch(() => { })
            }
        } catch (error) {
            console.error('Logout API error:', error)
        } finally {
            setAuthToken(null)
            localStorage.removeItem('CVniz_refresh_token')
            localStorage.removeItem('CVniz_user')
            localStorage.removeItem('CVniz_cvs')
            setUser(null)
        }
    }

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem('CVniz_user', JSON.stringify(updatedUser))
    }

    const upgradeToPremium = () => {
        updateUser({ isPremium: true })
    }

    // Save user profile for auto-fill in CV
    const saveProfile = (profileData) => {
        if (!user) return false
        const profileKey = `CVniz_profile_${user.id || user._id}`
        const profile = { ...profileData, updatedAt: new Date().toISOString() }
        localStorage.setItem(profileKey, JSON.stringify(profile))
        return true
    }

    const getProfile = () => {
        if (!user) return null
        const profileKey = `CVniz_profile_${user.id || user._id}`
        const saved = localStorage.getItem(profileKey)
        return saved ? JSON.parse(saved) : null
    }

    const hasProfile = () => {
        if (!user) return false
        const profileKey = `CVniz_profile_${user.id || user._id}`
        return !!localStorage.getItem(profileKey)
    }

    const socialLogin = async (provider, userData) => {
        // For now, create user locally - TODO: implement social login API
        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            authProvider: provider,
            role: 'user',
            isPremium: false
        }
        setUser(newUser)
        localStorage.setItem('CVniz_user', JSON.stringify(newUser))
        return { success: true, user: newUser, isNewUser: true }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            upgradeToPremium,
            socialLogin,
            saveProfile,
            getProfile,
            hasProfile,
            isAdmin: user?.role === 'admin',
            isPremium: user?.isPremium || user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

