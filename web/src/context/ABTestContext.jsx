import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const ABTestContext = createContext(null)

// Default A/B Tests
const DEFAULT_TESTS = {
    pricingLayout: {
        id: 'pricingLayout',
        name: 'Fiyatlandırma Sayfası Düzeni',
        description: 'Horizontal vs Vertical fiyat kartları',
        status: 'running',
        variants: {
            A: { name: 'Horizontal (Kontrol)', weight: 50 },
            B: { name: 'Vertical (Test)', weight: 50 }
        },
        metrics: {
            A: { views: 0, conversions: 0, revenue: 0 },
            B: { views: 0, conversions: 0, revenue: 0 }
        },
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString()
    },
    ctaButtonColor: {
        id: 'ctaButtonColor',
        name: 'CTA Buton Rengi',
        description: 'Cyan vs Gradient buton rengi',
        status: 'running',
        variants: {
            A: { name: 'Cyan (Kontrol)', weight: 50 },
            B: { name: 'Gradient (Test)', weight: 50 }
        },
        metrics: {
            A: { views: 0, clicks: 0 },
            B: { views: 0, clicks: 0 }
        },
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString()
    },
    heroHeadline: {
        id: 'heroHeadline',
        name: 'Hero Başlık Testi',
        description: 'Farklı başlık metinleri',
        status: 'paused',
        variants: {
            A: { name: 'Profesyonel CV (Kontrol)', weight: 50 },
            B: { name: 'Hayalindeki İş (Test)', weight: 50 }
        },
        metrics: {
            A: { views: 0, signups: 0 },
            B: { views: 0, signups: 0 }
        },
        createdAt: new Date().toISOString()
    },
    templateShowcase: {
        id: 'templateShowcase',
        name: 'Şablon Gösterim Sayısı',
        description: 'Ana sayfada gösterilen şablon sayısı',
        status: 'completed',
        variants: {
            A: { name: '6 Şablon (Kontrol)', weight: 50 },
            B: { name: '9 Şablon (Test)', weight: 50 }
        },
        metrics: {
            A: { views: 234, templateClicks: 45 },
            B: { views: 241, templateClicks: 72 }
        },
        winner: 'B',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
}

export function ABTestProvider({ children }) {
    const { user } = useAuth()
    const [tests, setTests] = useState({})
    const [userVariants, setUserVariants] = useState({})

    // Load tests from localStorage
    useEffect(() => {
        const savedTests = localStorage.getItem('CVniz_ab_tests')
        if (savedTests) {
            setTests(JSON.parse(savedTests))
        } else {
            setTests(DEFAULT_TESTS)
            localStorage.setItem('CVniz_ab_tests', JSON.stringify(DEFAULT_TESTS))
        }

        // Load user's assigned variants
        const savedVariants = localStorage.getItem('CVniz_ab_variants')
        if (savedVariants) {
            setUserVariants(JSON.parse(savedVariants))
        }
    }, [])

    // Assign user to a variant for a test
    const getVariant = useCallback((testId) => {
        // Check if user already has a variant assigned
        if (userVariants[testId]) {
            return userVariants[testId]
        }

        const test = tests[testId]
        if (!test || test.status !== 'running') {
            return 'A' // Default to control
        }

        // Assign based on weight (random)
        const random = Math.random() * 100
        let cumulativeWeight = 0
        let assignedVariant = 'A'

        for (const [variant, config] of Object.entries(test.variants)) {
            cumulativeWeight += config.weight
            if (random <= cumulativeWeight) {
                assignedVariant = variant
                break
            }
        }

        // Save assignment
        const newVariants = { ...userVariants, [testId]: assignedVariant }
        setUserVariants(newVariants)
        localStorage.setItem('CVniz_ab_variants', JSON.stringify(newVariants))

        return assignedVariant
    }, [tests, userVariants])

    // Track a view for a test
    const trackView = useCallback((testId) => {
        const variant = getVariant(testId)
        const test = tests[testId]

        if (!test || test.status !== 'running') return variant

        const updated = { ...tests }
        if (updated[testId].metrics[variant].views !== undefined) {
            updated[testId].metrics[variant].views++
        }
        setTests(updated)
        localStorage.setItem('CVniz_ab_tests', JSON.stringify(updated))

        return variant
    }, [tests, getVariant])

    // Track a conversion/event for a test
    const trackEvent = useCallback((testId, eventType) => {
        const variant = userVariants[testId] || 'A'
        const test = tests[testId]

        if (!test) return

        const updated = { ...tests }
        const metrics = updated[testId].metrics[variant]

        // Increment the appropriate metric
        if (metrics[eventType] !== undefined) {
            metrics[eventType]++
        } else if (metrics.conversions !== undefined) {
            metrics.conversions++
        }

        setTests(updated)
        localStorage.setItem('CVniz_ab_tests', JSON.stringify(updated))
    }, [tests, userVariants])

    // Get test results with statistical analysis
    const getTestResults = useCallback((testId) => {
        const test = tests[testId]
        if (!test) return null

        const results = {}
        let bestVariant = null
        let bestRate = 0

        for (const [variant, metrics] of Object.entries(test.metrics)) {
            const views = metrics.views || 0
            const conversions = metrics.conversions || metrics.clicks || metrics.signups || metrics.templateClicks || 0
            const rate = views > 0 ? (conversions / views) * 100 : 0

            results[variant] = {
                views,
                conversions,
                rate: Math.round(rate * 100) / 100,
                name: test.variants[variant]?.name || variant
            }

            if (rate > bestRate) {
                bestRate = rate
                bestVariant = variant
            }
        }

        // Calculate improvement
        const controlRate = results.A?.rate || 0
        const testRate = results.B?.rate || 0
        const improvement = controlRate > 0
            ? Math.round(((testRate - controlRate) / controlRate) * 100)
            : 0

        return {
            testId,
            name: test.name,
            status: test.status,
            results,
            bestVariant,
            improvement,
            winner: test.winner
        }
    }, [tests])

    // Admin: Update test status
    const updateTestStatus = useCallback((testId, status) => {
        const updated = { ...tests }
        if (updated[testId]) {
            updated[testId].status = status
            if (status === 'running' && !updated[testId].startedAt) {
                updated[testId].startedAt = new Date().toISOString()
            }
            if (status === 'completed') {
                updated[testId].completedAt = new Date().toISOString()
            }
            setTests(updated)
            localStorage.setItem('CVniz_ab_tests', JSON.stringify(updated))
        }
    }, [tests])

    // Admin: Declare winner
    const declareWinner = useCallback((testId, winner) => {
        const updated = { ...tests }
        if (updated[testId]) {
            updated[testId].winner = winner
            updated[testId].status = 'completed'
            updated[testId].completedAt = new Date().toISOString()
            setTests(updated)
            localStorage.setItem('CVniz_ab_tests', JSON.stringify(updated))
        }
    }, [tests])

    // Admin: Create new test
    const createTest = useCallback((testData) => {
        const testId = testData.id || `test_${Date.now()}`
        const newTest = {
            id: testId,
            name: testData.name,
            description: testData.description || '',
            status: 'paused',
            variants: {
                A: { name: testData.variantAName || 'Kontrol', weight: 50 },
                B: { name: testData.variantBName || 'Test', weight: 50 }
            },
            metrics: {
                A: { views: 0, conversions: 0 },
                B: { views: 0, conversions: 0 }
            },
            createdAt: new Date().toISOString()
        }

        const updated = { ...tests, [testId]: newTest }
        setTests(updated)
        localStorage.setItem('CVniz_ab_tests', JSON.stringify(updated))

        return testId
    }, [tests])

    // Admin: Get all tests
    const getAllTests = useCallback(() => Object.values(tests), [tests])

    // Admin: Get test statistics summary
    const getTestStats = useCallback(() => {
        const allTests = Object.values(tests)
        return {
            total: allTests.length,
            running: allTests.filter(t => t.status === 'running').length,
            paused: allTests.filter(t => t.status === 'paused').length,
            completed: allTests.filter(t => t.status === 'completed').length,
            averageImprovement: calculateAverageImprovement(allTests)
        }
    }, [tests])

    const calculateAverageImprovement = (allTests) => {
        const completedTests = allTests.filter(t => t.status === 'completed' && t.winner === 'B')
        if (completedTests.length === 0) return 0

        let totalImprovement = 0
        completedTests.forEach(test => {
            const result = getTestResults(test.id)
            if (result) {
                totalImprovement += result.improvement
            }
        })

        return Math.round(totalImprovement / completedTests.length)
    }

    return (
        <ABTestContext.Provider value={{
            // User-facing
            getVariant,
            trackView,
            trackEvent,

            // Admin
            getAllTests,
            getTestResults,
            getTestStats,
            updateTestStatus,
            declareWinner,
            createTest
        }}>
            {children}
        </ABTestContext.Provider>
    )
}

export const useABTest = () => useContext(ABTestContext)

// Custom hook for using A/B tests in components
export function useABTestVariant(testId) {
    const { getVariant, trackView } = useABTest()
    const [variant, setVariant] = useState('A')

    useEffect(() => {
        const assignedVariant = trackView(testId)
        setVariant(assignedVariant)
    }, [testId, trackView])

    return variant
}

