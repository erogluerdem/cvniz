import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const HeatmapContext = createContext(null)

export function HeatmapProvider({ children }) {
    const [clickData, setClickData] = useState({}) // { pagePath: [{ x, y, timestamp, element }] }
    const [isTracking, setIsTracking] = useState(true)
    const [showOverlay, setShowOverlay] = useState(false)

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_heatmap')
        if (stored) {
            try {
                setClickData(JSON.parse(stored))
            } catch (e) {
                console.error('Heatmap load error:', e)
            }
        }
    }, [])

    // Track click
    const trackClick = useCallback((event) => {
        if (!isTracking || showOverlay) return

        const pagePath = window.location.pathname
        const rect = document.body.getBoundingClientRect()

        const clickInfo = {
            x: ((event.clientX / window.innerWidth) * 100).toFixed(2),
            y: ((event.clientY / window.innerHeight) * 100).toFixed(2),
            absoluteX: event.clientX,
            absoluteY: event.clientY,
            timestamp: new Date().toISOString(),
            element: event.target?.tagName?.toLowerCase() || 'unknown',
            className: event.target?.className?.slice?.(0, 50) || ''
        }

        setClickData(prev => {
            const updated = { ...prev }
            if (!updated[pagePath]) {
                updated[pagePath] = []
            }
            updated[pagePath] = [...updated[pagePath], clickInfo].slice(-500) // Keep last 500 per page

            localStorage.setItem('CVniz_heatmap', JSON.stringify(updated))
            return updated
        })
    }, [isTracking, showOverlay])

    // Set up global click listener
    useEffect(() => {
        if (isTracking && !showOverlay) {
            document.addEventListener('click', trackClick)
            return () => document.removeEventListener('click', trackClick)
        }
    }, [isTracking, showOverlay, trackClick])

    // Get heatmap data for a specific page
    const getPageHeatmap = (pagePath) => {
        return clickData[pagePath] || []
    }

    // Get all tracked pages
    const getTrackedPages = () => {
        return Object.keys(clickData).map(path => ({
            path,
            clickCount: clickData[path].length
        })).sort((a, b) => b.clickCount - a.clickCount)
    }

    // Clear heatmap data
    const clearHeatmapData = (pagePath = null) => {
        if (pagePath) {
            setClickData(prev => {
                const updated = { ...prev }
                delete updated[pagePath]
                localStorage.setItem('CVniz_heatmap', JSON.stringify(updated))
                return updated
            })
        } else {
            setClickData({})
            localStorage.removeItem('CVniz_heatmap')
        }
    }

    // Calculate hot zones (areas with high click density)
    const getHotZones = (pagePath) => {
        const clicks = clickData[pagePath] || []
        if (clicks.length < 5) return []

        // Grid-based aggregation (10x10 grid)
        const gridSize = 10
        const grid = {}

        clicks.forEach(click => {
            const gridX = Math.floor(parseFloat(click.x) / gridSize)
            const gridY = Math.floor(parseFloat(click.y) / gridSize)
            const key = `${gridX}-${gridY}`

            if (!grid[key]) {
                grid[key] = {
                    x: gridX * gridSize + gridSize / 2,
                    y: gridY * gridSize + gridSize / 2,
                    count: 0
                }
            }
            grid[key].count++
        })

        return Object.values(grid)
            .filter(zone => zone.count >= 2)
            .sort((a, b) => b.count - a.count)
    }

    // Get element click statistics
    const getElementStats = (pagePath) => {
        const clicks = clickData[pagePath] || []
        const elementCounts = {}

        clicks.forEach(click => {
            const key = click.element
            elementCounts[key] = (elementCounts[key] || 0) + 1
        })

        return Object.entries(elementCounts)
            .map(([element, count]) => ({ element, count }))
            .sort((a, b) => b.count - a.count)
    }

    return (
        <HeatmapContext.Provider value={{
            clickData,
            isTracking,
            setIsTracking,
            showOverlay,
            setShowOverlay,
            trackClick,
            getPageHeatmap,
            getTrackedPages,
            clearHeatmapData,
            getHotZones,
            getElementStats
        }}>
            {children}
        </HeatmapContext.Provider>
    )
}

export const useHeatmap = () => useContext(HeatmapContext)

