// Mock AnalyticsService
export const getCVAnalytics = (cvId) => {
    return {
        totalViews: Math.floor(Math.random() * 100),
        locations: []
    }
}
