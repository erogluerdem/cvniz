import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const AffiliateContext = createContext()

export function useAffiliate() {
    return useContext(AffiliateContext)
}

// Affiliate kodu oluştur
const generateAffiliateCode = (name) => {
    const cleanName = name?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'AFF'
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${cleanName}${random}`
}

// Komisyon oranları (%)
export const COMMISSION_TIERS = {
    bronze: {
        id: 'bronze',
        name: 'Bronze',
        minSales: 0,
        commission: 15,
        color: '#CD7F32',
        benefits: ['%15 Komisyon', 'Temel Dashboard', 'Haftalık Ödeme']
    },
    silver: {
        id: 'silver',
        name: 'Silver',
        minSales: 10,
        commission: 20,
        color: '#C0C0C0',
        benefits: ['%20 Komisyon', 'Gelişmiş Analytics', 'Haftalık Ödeme', 'Özel Kupon Kodları']
    },
    gold: {
        id: 'gold',
        name: 'Gold',
        minSales: 50,
        commission: 25,
        color: '#FFD700',
        benefits: ['%25 Komisyon', 'Öncelikli Destek', 'Günlük Ödeme', 'Özel Landing Page']
    },
    platinum: {
        id: 'platinum',
        name: 'Platinum',
        minSales: 200,
        commission: 30,
        color: '#E5E4E2',
        benefits: ['%30 Komisyon', 'Dedike Account Manager', 'Anında Ödeme', 'Co-Branding İmkanı']
    }
}

export function AffiliateProvider({ children }) {
    const { user } = useAuth()
    const [affiliateData, setAffiliateData] = useState(null)
    const [isAffiliate, setIsAffiliate] = useState(false)
    const [loading, setLoading] = useState(true)
    const [pendingWithdrawal, setPendingWithdrawal] = useState(null)

    // Affiliate verilerini yükle
    useEffect(() => {
        if (user) {
            loadAffiliateData()
        } else {
            setAffiliateData(null)
            setIsAffiliate(false)
            setLoading(false)
        }
    }, [user])

    const loadAffiliateData = () => {
        const allAffiliates = JSON.parse(localStorage.getItem('CVniz_affiliates') || '{}')
        const userAffiliate = allAffiliates[user?.id]
        
        if (userAffiliate) {
            // Tier'ı güncelle
            const currentTier = calculateTier(userAffiliate.totalSales || 0)
            if (userAffiliate.tier !== currentTier.id) {
                userAffiliate.tier = currentTier.id
                allAffiliates[user.id] = userAffiliate
                localStorage.setItem('CVniz_affiliates', JSON.stringify(allAffiliates))
            }
            
            setAffiliateData(userAffiliate)
            setIsAffiliate(true)
        }
        setLoading(false)
    }

    // Tier hesapla
    const calculateTier = (totalSales) => {
        if (totalSales >= COMMISSION_TIERS.platinum.minSales) return COMMISSION_TIERS.platinum
        if (totalSales >= COMMISSION_TIERS.gold.minSales) return COMMISSION_TIERS.gold
        if (totalSales >= COMMISSION_TIERS.silver.minSales) return COMMISSION_TIERS.silver
        return COMMISSION_TIERS.bronze
    }

    // Affiliate programına başvur
    const applyForAffiliate = async (applicationData) => {
        if (!user) {
            return { success: false, error: 'Lütfen giriş yapın' }
        }

        const allAffiliates = JSON.parse(localStorage.getItem('CVniz_affiliates') || '{}')
        
        if (allAffiliates[user.id]) {
            return { success: false, error: 'Zaten affiliate programına kayıtlısınız' }
        }

        const affiliateCode = generateAffiliateCode(applicationData.brandName || user.name)
        
        const newAffiliate = {
            id: `aff_${Date.now()}`,
            userId: user.id,
            email: user.email,
            code: affiliateCode,
            brandName: applicationData.brandName || '',
            website: applicationData.website || '',
            socialMedia: applicationData.socialMedia || {},
            audienceSize: applicationData.audienceSize || '',
            niche: applicationData.niche || '',
            tier: 'bronze',
            status: 'active', // pending, active, suspended
            createdAt: new Date().toISOString(),
            
            // Stats
            totalClicks: 0,
            totalSignups: 0,
            totalSales: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            paidEarnings: 0,
            
            // Tracking
            clicks: [],
            conversions: [],
            payouts: [],
            
            // Payment info
            paymentMethod: applicationData.paymentMethod || 'bank',
            paymentDetails: applicationData.paymentDetails || {}
        }

        allAffiliates[user.id] = newAffiliate
        localStorage.setItem('CVniz_affiliates', JSON.stringify(allAffiliates))
        
        setAffiliateData(newAffiliate)
        setIsAffiliate(true)

        return { 
            success: true, 
            affiliate: newAffiliate,
            message: 'Affiliate programına başarıyla katıldınız!'
        }
    }

    // Affiliate linkini al
    const getAffiliateLink = (campaign = '') => {
        if (!affiliateData) return null
        const baseUrl = window.location.origin
        let link = `${baseUrl}/?ref=${affiliateData.code}`
        if (campaign) {
            link += `&utm_campaign=${encodeURIComponent(campaign)}`
        }
        return link
    }

    // Tıklama kaydet
    const trackClick = (affiliateCode, metadata = {}) => {
        const allAffiliates = JSON.parse(localStorage.getItem('CVniz_affiliates') || '{}')
        
        for (const [userId, affiliate] of Object.entries(allAffiliates)) {
            if (affiliate.code === affiliateCode) {
                affiliate.totalClicks++
                affiliate.clicks.push({
                    timestamp: new Date().toISOString(),
                    ip: metadata.ip || 'unknown',
                    userAgent: metadata.userAgent || navigator.userAgent,
                    referrer: metadata.referrer || document.referrer,
                    campaign: metadata.campaign || ''
                })
                
                allAffiliates[userId] = affiliate
                localStorage.setItem('CVniz_affiliates', JSON.stringify(allAffiliates))
                
                // Cookie kaydet (30 gün)
                document.cookie = `CVniz_affiliate=${affiliateCode}; max-age=${30 * 24 * 60 * 60}; path=/`
                
                return { success: true }
            }
        }
        return { success: false }
    }

    // Kayıt dönüşümü kaydet
    const trackSignup = (affiliateCode, newUserId) => {
        const allAffiliates = JSON.parse(localStorage.getItem('CVniz_affiliates') || '{}')
        
        for (const [userId, affiliate] of Object.entries(allAffiliates)) {
            if (affiliate.code === affiliateCode) {
                affiliate.totalSignups++
                affiliate.conversions.push({
                    type: 'signup',
                    userId: newUserId,
                    timestamp: new Date().toISOString(),
                    converted: false,
                    conversionValue: 0
                })
                
                allAffiliates[userId] = affiliate
                localStorage.setItem('CVniz_affiliates', JSON.stringify(allAffiliates))
                
                return { success: true }
            }
        }
        return { success: false }
    }

    // Satış dönüşümü kaydet
    const trackSale = (affiliateCode, saleData) => {
        const allAffiliates = JSON.parse(localStorage.getItem('CVniz_affiliates') || '{}')
        
        for (const [oduserId, affiliate] of Object.entries(allAffiliates)) {
            if (affiliate.code === affiliateCode) {
                const tier = calculateTier(affiliate.totalSales)
                const commission = (saleData.amount * tier.commission) / 100
                
                affiliate.totalSales++
                affiliate.totalEarnings += commission
                affiliate.pendingEarnings += commission
                
                affiliate.conversions.push({
                    type: 'sale',
                    userId: saleData.userId,
                    orderId: saleData.orderId,
                    amount: saleData.amount,
                    commission,
                    commissionRate: tier.commission,
                    timestamp: new Date().toISOString(),
                    status: 'pending' // pending, approved, paid
                })
                
                // Tier upgrade kontrol
                const newTier = calculateTier(affiliate.totalSales)
                if (newTier.id !== affiliate.tier) {
                    affiliate.tier = newTier.id
                    affiliate.tierUpgradedAt = new Date().toISOString()
                }
                
                allAffiliates[oduserId] = affiliate
                localStorage.setItem('CVniz_affiliates', JSON.stringify(allAffiliates))
                
                // Güncel veriyi yükle
                if (user && oduserId === user.id) {
                    setAffiliateData(affiliate)
                }
                
                return { success: true, commission, tier: newTier }
            }
        }
        return { success: false }
    }

    // Para çekme talebi
    const requestWithdrawal = async (amount) => {
        if (!affiliateData) {
            return { success: false, error: 'Affiliate verisi bulunamadı' }
        }

        if (amount > affiliateData.pendingEarnings) {
            return { success: false, error: 'Yetersiz bakiye' }
        }

        const minWithdrawal = 100 // Minimum 100 TL
        if (amount < minWithdrawal) {
            return { success: false, error: `Minimum çekim tutarı ${minWithdrawal} TL'dir` }
        }

        const allAffiliates = JSON.parse(localStorage.getItem('CVniz_affiliates') || '{}')
        
        const payout = {
            id: `payout_${Date.now()}`,
            amount,
            status: 'pending', // pending, processing, completed, rejected
            requestedAt: new Date().toISOString(),
            processedAt: null,
            paymentMethod: affiliateData.paymentMethod,
            paymentDetails: affiliateData.paymentDetails
        }

        allAffiliates[user.id].payouts.push(payout)
        allAffiliates[user.id].pendingEarnings -= amount
        
        localStorage.setItem('CVniz_affiliates', JSON.stringify(allAffiliates))
        setAffiliateData(allAffiliates[user.id])
        setPendingWithdrawal(payout)

        return { 
            success: true, 
            payout,
            message: `${amount} TL çekim talebiniz alındı. 3-5 iş günü içinde hesabınıza aktarılacaktır.`
        }
    }

    // Analytics
    const getAnalytics = (period = 30) => {
        if (!affiliateData) return null

        const now = new Date()
        const startDate = new Date(now.getTime() - period * 24 * 60 * 60 * 1000)

        const recentClicks = affiliateData.clicks.filter(c => new Date(c.timestamp) >= startDate)
        const recentConversions = affiliateData.conversions.filter(c => new Date(c.timestamp) >= startDate)
        const recentSales = recentConversions.filter(c => c.type === 'sale')

        const conversionRate = recentClicks.length > 0 
            ? ((recentConversions.length / recentClicks.length) * 100).toFixed(2)
            : 0

        const totalRevenue = recentSales.reduce((sum, s) => sum + (s.commission || 0), 0)

        // Günlük breakdown
        const dailyData = []
        for (let i = period - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
            const dateStr = date.toISOString().split('T')[0]
            
            const dayClicks = recentClicks.filter(c => c.timestamp.startsWith(dateStr)).length
            const daySales = recentSales.filter(c => c.timestamp.startsWith(dateStr))
            const dayRevenue = daySales.reduce((sum, s) => sum + (s.commission || 0), 0)

            dailyData.push({
                date: dateStr,
                clicks: dayClicks,
                sales: daySales.length,
                revenue: dayRevenue
            })
        }

        return {
            period,
            clicks: recentClicks.length,
            signups: recentConversions.filter(c => c.type === 'signup').length,
            sales: recentSales.length,
            revenue: totalRevenue,
            conversionRate,
            dailyData,
            currentTier: calculateTier(affiliateData.totalSales)
        }
    }

    // Özel kupon kodu oluştur (Silver+ için)
    const createCustomCoupon = async (discountPercent, maxUses = 100) => {
        if (!affiliateData) {
            return { success: false, error: 'Affiliate verisi bulunamadı' }
        }

        const tier = calculateTier(affiliateData.totalSales)
        if (tier.minSales < COMMISSION_TIERS.silver.minSales) {
            return { success: false, error: 'Özel kupon oluşturmak için Silver tier gerekli' }
        }

        if (discountPercent > 25) {
            return { success: false, error: 'Maksimum indirim oranı %25' }
        }

        const couponCode = `${affiliateData.code}${discountPercent}`
        
        // Kuponları kaydet
        const coupons = JSON.parse(localStorage.getItem('CVniz_affiliate_coupons') || '[]')
        coupons.push({
            code: couponCode,
            affiliateId: affiliateData.id,
            affiliateCode: affiliateData.code,
            discount: discountPercent,
            type: 'percent',
            maxUses,
            usedCount: 0,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 gün
        })
        localStorage.setItem('CVniz_affiliate_coupons', JSON.stringify(coupons))

        return {
            success: true,
            coupon: couponCode,
            message: `Kupon kodu oluşturuldu: ${couponCode}`
        }
    }

    const value = {
        // State
        affiliateData,
        isAffiliate,
        loading,
        pendingWithdrawal,
        
        // Tiers
        COMMISSION_TIERS,
        calculateTier,
        
        // Actions
        applyForAffiliate,
        getAffiliateLink,
        trackClick,
        trackSignup,
        trackSale,
        requestWithdrawal,
        createCustomCoupon,
        
        // Analytics
        getAnalytics,
        
        // Reload
        loadAffiliateData
    }

    return (
        <AffiliateContext.Provider value={value}>
            {children}
        </AffiliateContext.Provider>
    )
}

