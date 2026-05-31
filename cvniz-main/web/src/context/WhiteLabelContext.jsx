import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WhiteLabelContext = createContext(null)

// Default theme configuration
export const DEFAULT_THEME = {
    primaryColor: '#22d3ee',
    secondaryColor: '#64748b',
    accentColor: '#a855f7',
    logoUrl: null,
    faviconUrl: null,
    companyName: 'CVniz',
    tagline: 'Profesyonel CV Oluşturucu',
    darkMode: true,
    customCSS: ''
}

// Partner pricing tiers
export const PARTNER_PLANS = {
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 999,
        revenue_share: 20, // %
        features: ['Temel branding', '1000 CV/ay', 'E-posta destek', 'API erişimi']
    },
    professional: {
        id: 'professional',
        name: 'Professional',
        price: 2499,
        revenue_share: 30,
        features: ['Tam branding', '5000 CV/ay', 'Öncelikli destek', 'Webhook', 'Özel domain']
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: null,
        revenue_share: 40,
        features: ['White label', 'Sınırsız CV', 'Dedike destek', 'SLA', 'On-premise']
    }
}

export function WhiteLabelProvider({ children }) {
    const { user } = useAuth()
    const [partners, setPartners] = useState([])
    const [currentPartner, setCurrentPartner] = useState(null)
    const [theme, setTheme] = useState(DEFAULT_THEME)

    // Load from localStorage
    useEffect(() => {
        const storedPartners = localStorage.getItem('CVniz_partners')
        const storedTheme = localStorage.getItem('CVniz_whitelabel_theme')

        if (storedPartners) {
            try {
                const data = JSON.parse(storedPartners)
                setPartners(data)
            } catch (e) { }
        }

        if (storedTheme) {
            try {
                setTheme({ ...DEFAULT_THEME, ...JSON.parse(storedTheme) })
            } catch (e) { }
        }
    }, [])

    // Save partners
    const savePartners = (newPartners) => {
        setPartners(newPartners)
        localStorage.setItem('CVniz_partners', JSON.stringify(newPartners))
    }

    // Save theme
    const saveTheme = (newTheme) => {
        setTheme(newTheme)
        localStorage.setItem('CVniz_whitelabel_theme', JSON.stringify(newTheme))
    }

    // Register new partner
    const registerPartner = (partnerData) => {
        const newPartner = {
            id: `partner_${Date.now()}`,
            ...partnerData,
            plan: partnerData.plan || 'starter',
            status: 'pending', // pending, active, suspended
            createdAt: new Date().toISOString(),
            apiKey: generateApiKey(),
            secretKey: generateSecretKey(),
            theme: { ...DEFAULT_THEME },
            stats: {
                totalCVs: 0,
                totalUsers: 0,
                revenue: 0,
                lastActive: null
            },
            domain: null,
            webhookUrl: null
        }

        const newPartners = [...partners, newPartner]
        savePartners(newPartners)

        return { success: true, partner: newPartner }
    }

    // Generate API key
    const generateApiKey = () => {
        return 'pk_' + Array.from({ length: 32 }, () =>
            Math.random().toString(36).charAt(2)
        ).join('')
    }

    // Generate secret key
    const generateSecretKey = () => {
        return 'sk_' + Array.from({ length: 32 }, () =>
            Math.random().toString(36).charAt(2)
        ).join('')
    }

    // Update partner
    const updatePartner = (partnerId, updates) => {
        const newPartners = partners.map(p =>
            p.id === partnerId ? { ...p, ...updates } : p
        )
        savePartners(newPartners)
        return { success: true }
    }

    // Update partner theme
    const updatePartnerTheme = (partnerId, themeUpdates) => {
        const partner = partners.find(p => p.id === partnerId)
        if (!partner) return { success: false }

        const newTheme = { ...partner.theme, ...themeUpdates }
        const newPartners = partners.map(p =>
            p.id === partnerId ? { ...p, theme: newTheme } : p
        )
        savePartners(newPartners)
        return { success: true }
    }

    // Regenerate API keys
    const regenerateApiKey = (partnerId) => {
        const newPartners = partners.map(p =>
            p.id === partnerId ? { ...p, apiKey: generateApiKey() } : p
        )
        savePartners(newPartners)
        return { success: true }
    }

    // Get partner by ID
    const getPartner = (partnerId) => {
        return partners.find(p => p.id === partnerId)
    }

    // Get partner by API key
    const getPartnerByApiKey = (apiKey) => {
        return partners.find(p => p.apiKey === apiKey)
    }

    // Get all partners (admin)
    const getAllPartners = () => {
        return partners
    }

    // Activate partner (admin)
    const activatePartner = (partnerId) => {
        return updatePartner(partnerId, { status: 'active' })
    }

    // Suspend partner (admin)
    const suspendPartner = (partnerId) => {
        return updatePartner(partnerId, { status: 'suspended' })
    }

    // Update partner stats
    const updatePartnerStats = (partnerId, statsUpdate) => {
        const partner = getPartner(partnerId)
        if (!partner) return

        const newStats = { ...partner.stats, ...statsUpdate, lastActive: new Date().toISOString() }
        updatePartner(partnerId, { stats: newStats })
    }

    // Calculate partner revenue
    const calculatePartnerRevenue = (partnerId) => {
        const partner = getPartner(partnerId)
        if (!partner) return 0

        const plan = PARTNER_PLANS[partner.plan]
        const baseRevenue = partner.stats?.revenue || 0
        return Math.round(baseRevenue * (plan.revenue_share / 100))
    }

    // Apply theme to document
    const applyTheme = (themeConfig) => {
        const root = document.documentElement
        root.style.setProperty('--primary-color', themeConfig.primaryColor)
        root.style.setProperty('--secondary-color', themeConfig.secondaryColor)
        root.style.setProperty('--accent-color', themeConfig.accentColor)
    }

    // Get API documentation
    const getApiDocs = () => {
        return {
            baseUrl: 'https://api.CVniz.com/v1',
            endpoints: [
                {
                    method: 'POST',
                    path: '/cv/create',
                    description: 'Yeni CV oluştur',
                    params: ['template', 'data']
                },
                {
                    method: 'GET',
                    path: '/cv/:id',
                    description: 'CV getir',
                    params: ['id']
                },
                {
                    method: 'POST',
                    path: '/cv/:id/pdf',
                    description: 'PDF indir',
                    params: ['id']
                },
                {
                    method: 'GET',
                    path: '/templates',
                    description: 'Şablonları listele',
                    params: []
                },
                {
                    method: 'GET',
                    path: '/stats',
                    description: 'Kullanım istatistikleri',
                    params: []
                }
            ],
            authentication: 'API Key header ile: X-API-Key: pk_xxx'
        }
    }

    return (
        <WhiteLabelContext.Provider value={{
            partners,
            currentPartner,
            theme,
            setTheme: saveTheme,
            registerPartner,
            updatePartner,
            updatePartnerTheme,
            regenerateApiKey,
            getPartner,
            getPartnerByApiKey,
            getAllPartners,
            activatePartner,
            suspendPartner,
            updatePartnerStats,
            calculatePartnerRevenue,
            applyTheme,
            getApiDocs,
            PARTNER_PLANS,
            DEFAULT_THEME
        }}>
            {children}
        </WhiteLabelContext.Provider>
    )
}

export const useWhiteLabel = () => useContext(WhiteLabelContext)

