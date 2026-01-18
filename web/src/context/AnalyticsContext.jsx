import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }) {
    const { user } = useAuth()
    const [analytics, setAnalytics] = useState({
        cvViews: {},      // { cvId: { total: N, views: [{ date, referrer, device }] } }
        pageViews: {},    // { pagePath: count }
        events: [],       // [{ type, data, timestamp }]
        userMetrics: {}   // Aggregated metrics
    })

    // Load analytics from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_analytics')
        if (stored) {
            try {
                setAnalytics(JSON.parse(stored))
            } catch (e) {
                console.error('Analytics load error:', e)
            }
        }
    }, [])

    // Save analytics to localStorage
    const saveAnalytics = (newAnalytics) => {
        setAnalytics(newAnalytics)
        localStorage.setItem('CVniz_analytics', JSON.stringify(newAnalytics))
    }

    // Generate unique share link with tracking ID
    const generateShareLink = (cvId, cvName) => {
        const trackingId = `${cvId}_${Date.now()}`
        const baseUrl = window.location.origin
        return {
            url: `${baseUrl}/view/${trackingId}`,
            trackingId,
            cvId,
            cvName
        }
    }

    // Record CV view
    const recordCVView = (cvId, viewData = {}) => {
        const view = {
            date: new Date().toISOString(),
            referrer: document.referrer || 'direct',
            device: getDeviceType(),
            userAgent: navigator.userAgent,
            ...viewData
        }

        setAnalytics(prev => {
            const cvViews = { ...prev.cvViews }
            if (!cvViews[cvId]) {
                cvViews[cvId] = { total: 0, views: [] }
            }
            cvViews[cvId].total += 1
            cvViews[cvId].views = [...cvViews[cvId].views, view].slice(-100) // Keep last 100 views

            const newAnalytics = { ...prev, cvViews }
            localStorage.setItem('CVniz_analytics', JSON.stringify(newAnalytics))
            return newAnalytics
        })
    }

    // Get CV view stats
    const getCVViewStats = (cvId) => {
        const stats = analytics.cvViews[cvId] || { total: 0, views: [] }

        // Calculate additional metrics
        const now = new Date()
        const last24h = stats.views.filter(v =>
            new Date(v.date) > new Date(now - 24 * 60 * 60 * 1000)
        ).length
        const last7d = stats.views.filter(v =>
            new Date(v.date) > new Date(now - 7 * 24 * 60 * 60 * 1000)
        ).length
        const last30d = stats.views.filter(v =>
            new Date(v.date) > new Date(now - 30 * 24 * 60 * 60 * 1000)
        ).length

        // Device breakdown
        const devices = stats.views.reduce((acc, v) => {
            acc[v.device] = (acc[v.device] || 0) + 1
            return acc
        }, {})

        return {
            total: stats.total,
            last24h,
            last7d,
            last30d,
            devices,
            recentViews: stats.views.slice(-10).reverse()
        }
    }

    // Get all CV stats for dashboard
    const getAllCVStats = () => {
        const allStats = {}
        for (const [cvId, data] of Object.entries(analytics.cvViews)) {
            allStats[cvId] = getCVViewStats(cvId)
        }
        return allStats
    }

    // Record page view
    const recordPageView = (pagePath) => {
        setAnalytics(prev => {
            const pageViews = { ...prev.pageViews }
            pageViews[pagePath] = (pageViews[pagePath] || 0) + 1

            const newAnalytics = { ...prev, pageViews }
            localStorage.setItem('CVniz_analytics', JSON.stringify(newAnalytics))
            return newAnalytics
        })
    }

    // Record custom event
    const recordEvent = (eventType, eventData = {}) => {
        const event = {
            type: eventType,
            data: eventData,
            timestamp: new Date().toISOString(),
            userId: user?.id || 'anonymous'
        }

        setAnalytics(prev => {
            const events = [...prev.events, event].slice(-500) // Keep last 500 events
            const newAnalytics = { ...prev, events }
            localStorage.setItem('CVniz_analytics', JSON.stringify(newAnalytics))
            return newAnalytics
        })
    }

    // Get aggregated metrics for admin dashboard
    const getAggregatedMetrics = () => {
        const allUsers = JSON.parse(localStorage.getItem('CVniz_users') || '[]')
        const allCVs = JSON.parse(localStorage.getItem('CVniz_cvs') || '[]')
        const payments = JSON.parse(localStorage.getItem('CVniz_payments') || '[]')

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today - 30 * 24 * 60 * 60 * 1000)

        // User metrics
        const totalUsers = allUsers.length
        const newUsersToday = allUsers.filter(u =>
            new Date(u.createdAt || u.joinDate) >= today
        ).length
        const newUsersWeek = allUsers.filter(u =>
            new Date(u.createdAt || u.joinDate) >= weekAgo
        ).length
        const premiumUsers = allUsers.filter(u => u.isPremium).length
        const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0

        // CV metrics
        const totalCVs = allCVs.length
        const totalViews = Object.values(analytics.cvViews).reduce((sum, cv) => sum + cv.total, 0)

        // Revenue metrics (estimated based on premium users)
        const estimatedRevenue = premiumUsers * 99 // Assuming 99 TL per premium

        // Event metrics
        const downloadsToday = analytics.events.filter(e =>
            e.type === 'cv_download' && new Date(e.timestamp) >= today
        ).length

        return {
            users: {
                total: totalUsers,
                newToday: newUsersToday,
                newWeek: newUsersWeek,
                premium: premiumUsers,
                conversionRate: parseFloat(conversionRate)
            },
            cvs: {
                total: totalCVs,
                totalViews,
                avgViewsPerCV: totalCVs > 0 ? (totalViews / totalCVs).toFixed(1) : 0
            },
            revenue: {
                estimated: estimatedRevenue,
                currency: 'TRY'
            },
            activity: {
                downloadsToday,
                pageViews: analytics.pageViews,
                recentEvents: analytics.events.slice(-20).reverse()
            }
        }
    }

    // Helper to detect device type
    const getDeviceType = () => {
        const ua = navigator.userAgent
        if (/mobile/i.test(ua)) return 'mobile'
        if (/tablet|ipad/i.test(ua)) return 'tablet'
        return 'desktop'
    }

    return (
        <AnalyticsContext.Provider value={{
            analytics,
            generateShareLink,
            recordCVView,
            getCVViewStats,
            getAllCVStats,
            recordPageView,
            recordEvent,
            getAggregatedMetrics
        }}>
            {children}
        </AnalyticsContext.Provider>
    )
}

export const useAnalytics = () => useContext(AnalyticsContext)

