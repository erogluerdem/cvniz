import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ReferralContext = createContext(null)

// Referral kod oluşturma helper
const generateCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

export function ReferralProvider({ children }) {
    const { user } = useAuth()
    const [referralStats, setReferralStats] = useState({
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        earnedCoupons: []
    })

    // Kullanıcının referral kodunu al veya oluştur
    const getReferralCode = () => {
        if (!user) return null
        
        const referralData = JSON.parse(localStorage.getItem('CVniz_referrals') || '{}')
        
        if (referralData[user.id]?.code) {
            return referralData[user.id].code
        }
        
        // Yeni kod oluştur
        const newCode = `CVF${generateCode(6)}`
        referralData[user.id] = {
            code: newCode,
            createdAt: new Date().toISOString(),
            referrals: []
        }
        localStorage.setItem('CVniz_referrals', JSON.stringify(referralData))
        return newCode
    }

    // Referral linkini al
    const getReferralLink = () => {
        const code = getReferralCode()
        if (!code) return null
        return `${window.location.origin}/register?ref=${code}`
    }

    // Referral kodunu doğrula
    const validateReferralCode = (code) => {
        const referralData = JSON.parse(localStorage.getItem('CVniz_referrals') || '{}')
        
        for (const [userId, data] of Object.entries(referralData)) {
            if (data.code === code) {
                return { valid: true, referrerId: userId }
            }
        }
        return { valid: false }
    }

    // Referral takibi
    const trackReferral = (referralCode, newUserId, newUserEmail) => {
        const validation = validateReferralCode(referralCode)
        if (!validation.valid) return { success: false, error: 'Geçersiz referral kodu' }

        const referralData = JSON.parse(localStorage.getItem('CVniz_referrals') || '{}')
        const referrerData = referralData[validation.referrerId]

        if (!referrerData) return { success: false, error: 'Referrer bulunamadı' }

        // Zaten referral yapılmış mı kontrol et
        const existingReferral = referrerData.referrals?.find(r => r.userId === newUserId)
        if (existingReferral) {
            return { success: false, error: 'Bu kullanıcı zaten kayıtlı' }
        }

        // Yeni referral ekle
        const newReferral = {
            userId: newUserId,
            email: newUserEmail,
            status: 'pending', // pending, completed
            createdAt: new Date().toISOString(),
            completedAt: null,
            couponGenerated: false
        }

        if (!referrerData.referrals) {
            referrerData.referrals = []
        }
        referrerData.referrals.push(newReferral)

        localStorage.setItem('CVniz_referrals', JSON.stringify(referralData))
        
        return { success: true, referrerId: validation.referrerId }
    }

    // Referral'ı tamamla (kullanıcı satın alım yaptığında)
    const completeReferral = (userId) => {
        const referralData = JSON.parse(localStorage.getItem('CVniz_referrals') || '{}')
        
        for (const [referrerId, data] of Object.entries(referralData)) {
            const referral = data.referrals?.find(r => r.userId === userId && r.status === 'pending')
            if (referral) {
                referral.status = 'completed'
                referral.completedAt = new Date().toISOString()
                
                // Kupon oluştur
                if (!referral.couponGenerated) {
                    const couponCode = createReferralCoupon(referrerId)
                    referral.couponGenerated = true
                    referral.couponCode = couponCode
                }
                
                localStorage.setItem('CVniz_referrals', JSON.stringify(referralData))
                return { success: true, referrerId }
            }
        }
        return { success: false }
    }

    // Referral kuponu oluştur (%20 indirim)
    const createReferralCoupon = (userId) => {
        const couponCode = `REF${generateCode(6)}`
        
        // Kuponları al veya oluştur
        const coupons = JSON.parse(localStorage.getItem('CVniz_coupons') || '[]')
        
        const newCoupon = {
            code: couponCode,
            type: 'percent',
            discount: 20,
            userId: userId,
            isReferral: true,
            used: false,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün
            createdAt: new Date().toISOString()
        }
        
        coupons.push(newCoupon)
        localStorage.setItem('CVniz_coupons', JSON.stringify(coupons))
        
        // Kazanılan kuponlar listesine ekle
        const earnedCoupons = JSON.parse(localStorage.getItem(`CVniz_earned_coupons_${userId}`) || '[]')
        earnedCoupons.push(newCoupon)
        localStorage.setItem(`CVniz_earned_coupons_${userId}`, JSON.stringify(earnedCoupons))
        
        return couponCode
    }

    // Kullanıcının kazandığı kuponları al
    const getEarnedCoupons = () => {
        if (!user) return []
        return JSON.parse(localStorage.getItem(`CVniz_earned_coupons_${user.id}`) || '[]')
    }

    // Referral istatistiklerini güncelle
    const loadReferralStats = () => {
        if (!user) return
        
        const referralData = JSON.parse(localStorage.getItem('CVniz_referrals') || '{}')
        const userData = referralData[user.id]
        
        if (!userData) {
            setReferralStats({
                totalReferrals: 0,
                pendingReferrals: 0,
                completedReferrals: 0,
                earnedCoupons: []
            })
            return
        }

        const referrals = userData.referrals || []
        const earnedCoupons = getEarnedCoupons()
        
        setReferralStats({
            totalReferrals: referrals.length,
            pendingReferrals: referrals.filter(r => r.status === 'pending').length,
            completedReferrals: referrals.filter(r => r.status === 'completed').length,
            earnedCoupons
        })
    }

    // Admin için tüm referral verilerini al
    const getAllReferrals = () => {
        const referralData = JSON.parse(localStorage.getItem('CVniz_referrals') || '{}')
        const users = JSON.parse(localStorage.getItem('CVniz_users') || '[]')
        
        const allReferrals = []
        
        for (const [userId, data] of Object.entries(referralData)) {
            const referrer = users.find(u => u.id === userId)
            const referrals = data.referrals || []
            
            referrals.forEach(referral => {
                const referredUser = users.find(u => u.id === referral.userId)
                allReferrals.push({
                    id: `${userId}-${referral.userId}`,
                    referrerName: referrer?.name || 'Bilinmiyor',
                    referrerEmail: referrer?.email || 'Bilinmiyor',
                    referredName: referredUser?.name || 'Bilinmiyor',
                    referredEmail: referral.email,
                    status: referral.status,
                    createdAt: referral.createdAt,
                    completedAt: referral.completedAt,
                    couponCode: referral.couponCode
                })
            })
        }
        
        return allReferrals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Admin istatistikleri
    const getAdminStats = () => {
        const allReferrals = getAllReferrals()
        const coupons = JSON.parse(localStorage.getItem('CVniz_coupons') || '[]')
        const referralCoupons = coupons.filter(c => c.isReferral)
        
        return {
            totalReferrals: allReferrals.length,
            pendingReferrals: allReferrals.filter(r => r.status === 'pending').length,
            completedReferrals: allReferrals.filter(r => r.status === 'completed').length,
            totalCouponsGenerated: referralCoupons.length,
            couponsUsed: referralCoupons.filter(c => c.used).length,
            conversionRate: allReferrals.length > 0 
                ? Math.round((allReferrals.filter(r => r.status === 'completed').length / allReferrals.length) * 100) 
                : 0
        }
    }

    useEffect(() => {
        loadReferralStats()
    }, [user])

    return (
        <ReferralContext.Provider value={{
            getReferralCode,
            getReferralLink,
            validateReferralCode,
            trackReferral,
            completeReferral,
            getEarnedCoupons,
            referralStats,
            loadReferralStats,
            getAllReferrals,
            getAdminStats
        }}>
            {children}
        </ReferralContext.Provider>
    )
}

export const useReferral = () => useContext(ReferralContext)

