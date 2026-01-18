import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
    const { token, user } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    // Fetch notifications from backend
    const fetchNotifications = useCallback(async () => {
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/notifications?limit=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setNotifications(data.notifications || [])
                setUnreadCount(data.unreadCount || 0)
            }
        } catch (error) {
            console.error('Fetch notifications error:', error)
        }
    }, [token])

    // Fetch unread count only (lighter request)
    const fetchUnreadCount = useCallback(async () => {
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setUnreadCount(data.count || 0)
            }
        } catch (error) {
            console.error('Fetch unread count error:', error)
        }
    }, [token])

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Mark as read error:', error)
        }
    }

    // Mark all as read
    const markAllAsRead = async () => {
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/notifications/read-all`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
                setUnreadCount(0)
            }
        } catch (error) {
            console.error('Mark all as read error:', error)
        }
    }

    // Delete notification
    const deleteNotification = async (notificationId) => {
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const wasUnread = notifications.find(n => n.id === notificationId && !n.isRead)
                setNotifications(prev => prev.filter(n => n.id !== notificationId))
                if (wasUnread) {
                    setUnreadCount(prev => Math.max(0, prev - 1))
                }
            }
        } catch (error) {
            console.error('Delete notification error:', error)
        }
    }

    // Clear all notifications
    const clearAll = async () => {
        if (!token) return

        try {
            const response = await fetch(`${API_URL}/notifications`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                setNotifications([])
                setUnreadCount(0)
            }
        } catch (error) {
            console.error('Clear all error:', error)
        }
    }

    // Initial fetch when user logs in
    useEffect(() => {
        if (token && user) {
            fetchNotifications()
        } else {
            setNotifications([])
            setUnreadCount(0)
        }
    }, [token, user, fetchNotifications])

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        if (!token || !user) return

        const interval = setInterval(() => {
            fetchUnreadCount()
        }, 30000)

        return () => clearInterval(interval)
    }, [token, user, fetchUnreadCount])

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearAll,
            refresh: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}
