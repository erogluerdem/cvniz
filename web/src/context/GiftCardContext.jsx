import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const GiftCardContext = createContext()

export function useGiftCard() {
    return useContext(GiftCardContext)
}

// Gift card kodu oluştur
const generateGiftCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = 'GIFT-'
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        if (i < 3) code += '-'
    }
    return code
}

// Gift card planları
export const GIFT_PLANS = {
    pro_1month: {
        id: 'pro_1month',
        name: '1 Aylık Pro',
        planId: 'pro',
        duration: 1,
        durationType: 'month',
        price: 49,
        discountedPrice: 39
    },
    pro_3month: {
        id: 'pro_3month',
        name: '3 Aylık Pro',
        planId: 'pro',
        duration: 3,
        durationType: 'month',
        price: 147,
        discountedPrice: 99,
        popular: true
    },
    pro_6month: {
        id: 'pro_6month',
        name: '6 Aylık Pro',
        planId: 'pro',
        duration: 6,
        durationType: 'month',
        price: 294,
        discountedPrice: 179
    },
    pro_1year: {
        id: 'pro_1year',
        name: '1 Yıllık Pro',
        planId: 'pro',
        duration: 12,
        durationType: 'month',
        price: 348,
        discountedPrice: 249,
        bestValue: true
    }
}

export function GiftCardProvider({ children }) {
    const { user, updateUser } = useAuth()
    const [purchasedGifts, setPurchasedGifts] = useState([])
    const [receivedGifts, setReceivedGifts] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)

    // Gift card'ları yükle
    useEffect(() => {
        if (user) {
            loadGiftCards()
        } else {
            setPurchasedGifts([])
            setReceivedGifts([])
        }
    }, [user])

    const loadGiftCards = () => {
        const allGifts = JSON.parse(localStorage.getItem('CVniz_giftcards') || '[]')
        
        if (user) {
            setPurchasedGifts(allGifts.filter(g => g.purchaserId === user.id))
            setReceivedGifts(allGifts.filter(g => g.redeemedBy === user.id))
        }
    }

    // Gift card satın al
    const purchaseGiftCard = async (giftPlanId, recipientEmail, senderName, personalMessage = '') => {
        if (!user) {
            return { success: false, error: 'Lütfen giriş yapın' }
        }

        const giftPlan = GIFT_PLANS[giftPlanId]
        if (!giftPlan) {
            return { success: false, error: 'Geçersiz hediye planı' }
        }

        setIsProcessing(true)

        // Ödeme simülasyonu
        await new Promise(resolve => setTimeout(resolve, 1500))

        const giftCard = {
            id: `gift_${Date.now()}`,
            code: generateGiftCode(),
            giftPlanId,
            planId: giftPlan.planId,
            duration: giftPlan.duration,
            durationType: giftPlan.durationType,
            purchaserId: user.id,
            purchaserEmail: user.email,
            purchaserName: senderName || user.name || user.email,
            recipientEmail,
            personalMessage,
            amount: giftPlan.discountedPrice,
            status: 'active', // active, redeemed, expired
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 yıl geçerli
            redeemedAt: null,
            redeemedBy: null
        }

        const allGifts = JSON.parse(localStorage.getItem('CVniz_giftcards') || '[]')
        allGifts.push(giftCard)
        localStorage.setItem('CVniz_giftcards', JSON.stringify(allGifts))

        setPurchasedGifts(prev => [...prev, giftCard])
        setIsProcessing(false)

        return { 
            success: true, 
            giftCard,
            message: 'Hediye kartı başarıyla oluşturuldu!'
        }
    }

    // Gift card kullan
    const redeemGiftCard = async (code) => {
        if (!user) {
            return { success: false, error: 'Lütfen giriş yapın' }
        }

        const allGifts = JSON.parse(localStorage.getItem('CVniz_giftcards') || '[]')
        const giftIndex = allGifts.findIndex(g => g.code === code.toUpperCase().replace(/\s/g, ''))

        if (giftIndex === -1) {
            return { success: false, error: 'Geçersiz hediye kartı kodu' }
        }

        const gift = allGifts[giftIndex]

        if (gift.status === 'redeemed') {
            return { success: false, error: 'Bu hediye kartı zaten kullanılmış' }
        }

        if (gift.status === 'expired' || new Date(gift.expiresAt) < new Date()) {
            return { success: false, error: 'Bu hediye kartının süresi dolmuş' }
        }

        // Hediye kartını kullan
        allGifts[giftIndex] = {
            ...gift,
            status: 'redeemed',
            redeemedAt: new Date().toISOString(),
            redeemedBy: user.id,
            redeemedByEmail: user.email
        }

        localStorage.setItem('CVniz_giftcards', JSON.stringify(allGifts))

        // Kullanıcıyı premium yap
        const giftPlan = GIFT_PLANS[gift.giftPlanId]
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + giftPlan.duration)

        // Subscription oluştur
        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        storedSubs[user.id] = {
            id: `sub_gift_${Date.now()}`,
            planId: gift.planId,
            billingCycle: 'gift',
            status: 'active',
            startedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
            autoRenew: false,
            giftCardId: gift.id,
            giftedBy: gift.purchaserName
        }
        localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))

        // User güncelle
        if (updateUser) {
            updateUser({
                ...user,
                isPremium: true,
                premiumPlan: gift.planId
            })
        }

        loadGiftCards()

        return {
            success: true,
            gift: allGifts[giftIndex],
            message: `🎉 Tebrikler! ${giftPlan.name} hediyeniz aktifleştirildi!`,
            duration: giftPlan.duration,
            expiresAt
        }
    }

    // Gift card durumunu kontrol et
    const checkGiftCard = (code) => {
        const allGifts = JSON.parse(localStorage.getItem('CVniz_giftcards') || '[]')
        const gift = allGifts.find(g => g.code === code.toUpperCase().replace(/\s/g, ''))

        if (!gift) {
            return { valid: false, error: 'Geçersiz hediye kartı kodu' }
        }

        if (gift.status === 'redeemed') {
            return { valid: false, error: 'Bu hediye kartı zaten kullanılmış', gift }
        }

        if (new Date(gift.expiresAt) < new Date()) {
            return { valid: false, error: 'Bu hediye kartının süresi dolmuş', gift }
        }

        const giftPlan = GIFT_PLANS[gift.giftPlanId]
        return { 
            valid: true, 
            gift,
            giftPlan,
            message: `${giftPlan.name} hediye kartı - ${gift.purchaserName} tarafından gönderildi`
        }
    }

    // Gift card'ı email ile gönder (simülasyon)
    const sendGiftCardEmail = async (giftId) => {
        const allGifts = JSON.parse(localStorage.getItem('CVniz_giftcards') || '[]')
        const gift = allGifts.find(g => g.id === giftId)

        if (!gift) {
            return { success: false, error: 'Hediye kartı bulunamadı' }
        }

        // Email gönderim simülasyonu
        console.log(`📧 Email gönderildi: ${gift.recipientEmail}`)
        console.log(`Hediye Kodu: ${gift.code}`)
        console.log(`Mesaj: ${gift.personalMessage}`)

        return { 
            success: true, 
            message: `Hediye kartı ${gift.recipientEmail} adresine gönderildi!`
        }
    }

    const value = {
        // Gift Plans
        GIFT_PLANS,
        
        // Gift Cards
        purchasedGifts,
        receivedGifts,
        
        // Actions
        purchaseGiftCard,
        redeemGiftCard,
        checkGiftCard,
        sendGiftCardEmail,
        
        // State
        isProcessing
    }

    return (
        <GiftCardContext.Provider value={value}>
            {children}
        </GiftCardContext.Provider>
    )
}

