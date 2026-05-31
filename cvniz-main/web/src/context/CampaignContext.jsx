import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CampaignContext = createContext(null)

// Default campaign templates
const DEFAULT_CAMPAIGNS = {
    welcome: {
        id: 'welcome',
        name: 'Hoşgeldin Serisi',
        type: 'popup',
        trigger: 'registration',
        enabled: true,
        content: {
            title: 'CVniz\'a Hoş Geldiniz! 🎉',
            subtitle: 'Profesyonel CV\'nizi oluşturmaya hazır mısınız?',
            body: 'İlk CV\'nizi oluşturun ve %20 indirim kazanın! Arkadaşlarınızı davet ederek daha fazla indirim fırsatı yakalayın.',
            ctaPrimary: 'CV Oluştur',
            ctaSecondary: 'Şablonları Keşfet',
            image: null
        },
        stats: {
            shown: 0,
            clicked: 0,
            converted: 0
        }
    },
    abandonedCart: {
        id: 'abandonedCart',
        name: 'Terk Edilmiş Sepet',
        type: 'popup',
        trigger: 'checkout_exit',
        enabled: true,
        delayMinutes: 0,
        content: {
            title: 'Bekleyin! Özel Teklifimiz Var 🎁',
            subtitle: 'Satın alımınızı tamamlamak üzeresiniz!',
            body: 'Şu anda Pro\'ya geçerseniz ekstra %10 indirim kazanın! Bu teklif sadece 15 dakika geçerli.',
            ctaPrimary: 'İndirimi Al',
            ctaSecondary: 'Daha Sonra',
            couponCode: 'BEKLE10',
            discount: 10
        },
        stats: {
            shown: 0,
            clicked: 0,
            converted: 0
        }
    },
    firstCVReminder: {
        id: 'firstCVReminder',
        name: 'İlk CV Hatırlatıcı',
        type: 'notification',
        trigger: 'inactivity_24h',
        enabled: true,
        content: {
            title: 'CV\'nizi tamamlamadınız!',
            body: 'Profesyonel CV\'niz sizi bekliyor. Hemen tamamlayın ve iş fırsatlarını kaçırmayın.',
            ctaPrimary: 'Devam Et'
        },
        stats: {
            shown: 0,
            clicked: 0
        }
    },
    promoOffer: {
        id: 'promoOffer',
        name: 'Promosyon Teklifi',
        type: 'banner',
        trigger: 'manual',
        enabled: false,
        content: {
            title: '🎄 Yılbaşı İndirimi!',
            body: 'Pro üyelikte %30 indirim. Kod: YILBASI30',
            ctaPrimary: 'Şimdi Al'
        },
        startDate: null,
        endDate: null,
        stats: {
            shown: 0,
            clicked: 0,
            converted: 0
        }
    }
}

export function CampaignProvider({ children }) {
    const { user } = useAuth()
    const [campaigns, setCampaigns] = useState({})
    const [activeCampaign, setActiveCampaign] = useState(null)
    const [campaignHistory, setCampaignHistory] = useState([])

    // Load campaigns from localStorage
    useEffect(() => {
        const savedCampaigns = localStorage.getItem('CVniz_campaigns')
        if (savedCampaigns) {
            setCampaigns(JSON.parse(savedCampaigns))
        } else {
            setCampaigns(DEFAULT_CAMPAIGNS)
            localStorage.setItem('CVniz_campaigns', JSON.stringify(DEFAULT_CAMPAIGNS))
        }

        const savedHistory = localStorage.getItem('CVniz_campaign_history')
        if (savedHistory) {
            setCampaignHistory(JSON.parse(savedHistory))
        }
    }, [])

    // Check if user has seen a campaign
    const hasSeenCampaign = (campaignId) => {
        if (!user) return false
        const key = `CVniz_campaign_seen_${user.id}_${campaignId}`
        return localStorage.getItem(key) === 'true'
    }

    // Mark campaign as seen
    const markCampaignSeen = (campaignId) => {
        if (!user) return
        const key = `CVniz_campaign_seen_${user.id}_${campaignId}`
        localStorage.setItem(key, 'true')

        // Update campaign stats
        if (campaigns[campaignId]) {
            const updated = { ...campaigns }
            updated[campaignId].stats.shown++
            setCampaigns(updated)
            localStorage.setItem('CVniz_campaigns', JSON.stringify(updated))
        }

        // Add to history
        const historyEntry = {
            campaignId,
            userId: user.id,
            action: 'shown',
            timestamp: new Date().toISOString()
        }
        const updatedHistory = [...campaignHistory, historyEntry]
        setCampaignHistory(updatedHistory)
        localStorage.setItem('CVniz_campaign_history', JSON.stringify(updatedHistory))
    }

    // Track campaign click
    const trackCampaignClick = (campaignId, action = 'click') => {
        if (campaigns[campaignId]) {
            const updated = { ...campaigns }
            updated[campaignId].stats.clicked++
            setCampaigns(updated)
            localStorage.setItem('CVniz_campaigns', JSON.stringify(updated))
        }

        // Add to history
        if (user) {
            const historyEntry = {
                campaignId,
                userId: user.id,
                action,
                timestamp: new Date().toISOString()
            }
            const updatedHistory = [...campaignHistory, historyEntry]
            setCampaignHistory(updatedHistory)
            localStorage.setItem('CVniz_campaign_history', JSON.stringify(updatedHistory))
        }
    }

    // Track conversion
    const trackConversion = (campaignId) => {
        if (campaigns[campaignId]) {
            const updated = { ...campaigns }
            if (updated[campaignId].stats.converted !== undefined) {
                updated[campaignId].stats.converted++
            }
            setCampaigns(updated)
            localStorage.setItem('CVniz_campaigns', JSON.stringify(updated))
        }
    }

    // Trigger a campaign
    const triggerCampaign = (trigger) => {
        const campaign = Object.values(campaigns).find(
            c => c.trigger === trigger && c.enabled && !hasSeenCampaign(c.id)
        )

        if (campaign) {
            setActiveCampaign(campaign)
            return campaign
        }
        return null
    }

    // Dismiss active campaign
    const dismissCampaign = () => {
        if (activeCampaign) {
            markCampaignSeen(activeCampaign.id)
        }
        setActiveCampaign(null)
    }

    // Update campaign (admin)
    const updateCampaign = (campaignId, updates) => {
        const updated = { ...campaigns }
        if (updated[campaignId]) {
            updated[campaignId] = { ...updated[campaignId], ...updates }
            setCampaigns(updated)
            localStorage.setItem('CVniz_campaigns', JSON.stringify(updated))
            return true
        }
        return false
    }

    // Toggle campaign enabled state (admin)
    const toggleCampaign = (campaignId) => {
        const updated = { ...campaigns }
        if (updated[campaignId]) {
            updated[campaignId].enabled = !updated[campaignId].enabled
            setCampaigns(updated)
            localStorage.setItem('CVniz_campaigns', JSON.stringify(updated))
            return updated[campaignId].enabled
        }
        return null
    }

    // Get campaign stats (admin)
    const getCampaignStats = () => {
        const allCampaigns = Object.values(campaigns)
        const totalShown = allCampaigns.reduce((sum, c) => sum + (c.stats?.shown || 0), 0)
        const totalClicked = allCampaigns.reduce((sum, c) => sum + (c.stats?.clicked || 0), 0)
        const totalConverted = allCampaigns.reduce((sum, c) => sum + (c.stats?.converted || 0), 0)

        return {
            totalCampaigns: allCampaigns.length,
            activeCampaigns: allCampaigns.filter(c => c.enabled).length,
            totalShown,
            totalClicked,
            totalConverted,
            clickRate: totalShown > 0 ? Math.round((totalClicked / totalShown) * 100) : 0,
            conversionRate: totalClicked > 0 ? Math.round((totalConverted / totalClicked) * 100) : 0
        }
    }

    // Get all campaigns (admin)
    const getAllCampaigns = () => Object.values(campaigns)

    // Get campaign history (admin)
    const getCampaignHistory = () => campaignHistory.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 100)

    // Reset campaign for user (for testing)
    const resetCampaignForUser = (campaignId) => {
        if (user) {
            const key = `CVniz_campaign_seen_${user.id}_${campaignId}`
            localStorage.removeItem(key)
        }
    }

    return (
        <CampaignContext.Provider value={{
            campaigns,
            activeCampaign,
            triggerCampaign,
            dismissCampaign,
            hasSeenCampaign,
            markCampaignSeen,
            trackCampaignClick,
            trackConversion,
            updateCampaign,
            toggleCampaign,
            getCampaignStats,
            getAllCampaigns,
            getCampaignHistory,
            resetCampaignForUser
        }}>
            {children}
        </CampaignContext.Provider>
    )
}

export const useCampaign = () => useContext(CampaignContext)

