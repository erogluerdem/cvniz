import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { usePayment, PLANS } from './PaymentContext'

const SubscriptionContext = createContext()

export function useSubscription() {
    return useContext(SubscriptionContext)
}

export function SubscriptionProvider({ children }) {
    const { user, updateUser } = useAuth()
    const { payments } = usePayment()
    const [subscription, setSubscription] = useState(null)
    const [loading, setLoading] = useState(true)

    // Abonelik durumlarını yükle
    useEffect(() => {
        if (user) {
            loadSubscription()
        } else {
            setSubscription(null)
            setLoading(false)
        }
    }, [user, payments])

    const loadSubscription = () => {
        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        const userSub = storedSubs[user?.id]
        
        if (userSub) {
            // Abonelik durumunu kontrol et
            const now = new Date()
            const expiresAt = userSub.expiresAt ? new Date(userSub.expiresAt) : null
            
            if (userSub.status === 'frozen') {
                // Dondurulmuş abonelik
                setSubscription(userSub)
            } else if (expiresAt && now > expiresAt) {
                // Süresi dolmuş
                userSub.status = 'expired'
                storedSubs[user.id] = userSub
                localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
                setSubscription(userSub)
            } else {
                setSubscription(userSub)
            }
        } else if (user?.isPremium) {
            // Mevcut premium kullanıcı için subscription oluştur
            const lastPayment = payments.find(p => p.userId === user.id && p.status === 'completed')
            if (lastPayment) {
                const newSub = {
                    id: `sub_${Date.now()}`,
                    planId: lastPayment.planId || 'pro',
                    billingCycle: lastPayment.billingCycle || 'yearly',
                    status: 'active',
                    startedAt: lastPayment.createdAt,
                    expiresAt: lastPayment.expiresAt,
                    autoRenew: true,
                    frozenAt: null,
                    frozenUntil: null,
                    freezeReason: null
                }
                storedSubs[user.id] = newSub
                localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
                setSubscription(newSub)
            }
        }
        setLoading(false)
    }

    // Plan değiştir
    const changePlan = async (newPlanId, newBillingCycle) => {
        if (!user || !subscription) {
            return { success: false, error: 'Aktif abonelik bulunamadı' }
        }

        const newPlan = PLANS[newPlanId]
        if (!newPlan) {
            return { success: false, error: 'Geçersiz plan' }
        }

        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        
        // Upgrade/downgrade hesapla
        const currentPlan = PLANS[subscription.planId]
        const isUpgrade = newPlan.price.monthly > currentPlan.price.monthly

        // Yeni bitiş tarihi hesapla
        let newExpiresAt = subscription.expiresAt
        if (newBillingCycle === 'lifetime') {
            newExpiresAt = null
        } else if (newBillingCycle === 'yearly') {
            newExpiresAt = new Date()
            newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1)
        } else {
            newExpiresAt = new Date()
            newExpiresAt.setMonth(newExpiresAt.getMonth() + 1)
        }

        const updatedSub = {
            ...subscription,
            planId: newPlanId,
            billingCycle: newBillingCycle,
            changedAt: new Date().toISOString(),
            previousPlan: subscription.planId,
            expiresAt: newExpiresAt?.toISOString() || null
        }

        storedSubs[user.id] = updatedSub
        localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
        setSubscription(updatedSub)

        // User'ı güncelle
        if (updateUser) {
            updateUser({
                ...user,
                premiumPlan: newPlanId
            })
        }

        return { 
            success: true, 
            subscription: updatedSub,
            isUpgrade,
            message: isUpgrade ? 'Planınız yükseltildi!' : 'Plan değişikliği bir sonraki dönemde geçerli olacak'
        }
    }

    // Aboneliği iptal et
    const cancelSubscription = async (reason = '') => {
        if (!user || !subscription) {
            return { success: false, error: 'Aktif abonelik bulunamadı' }
        }

        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        
        const updatedSub = {
            ...subscription,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            cancelReason: reason,
            autoRenew: false
            // Mevcut dönem sonuna kadar erişim devam eder
        }

        storedSubs[user.id] = updatedSub
        localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
        setSubscription(updatedSub)

        return { 
            success: true, 
            subscription: updatedSub,
            message: `Aboneliğiniz iptal edildi. ${subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('tr-TR') + ' tarihine kadar erişiminiz devam edecek.' : ''}`
        }
    }

    // Aboneliği dondur (1-3 ay)
    const freezeSubscription = async (months = 1, reason = '') => {
        if (!user || !subscription) {
            return { success: false, error: 'Aktif abonelik bulunamadı' }
        }

        if (subscription.status !== 'active') {
            return { success: false, error: 'Sadece aktif abonelikler dondurulabilir' }
        }

        if (months < 1 || months > 3) {
            return { success: false, error: 'Dondurma süresi 1-3 ay arasında olmalıdır' }
        }

        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        
        const frozenUntil = new Date()
        frozenUntil.setMonth(frozenUntil.getMonth() + months)

        // Bitiş tarihini de uzat
        let newExpiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : null
        if (newExpiresAt) {
            newExpiresAt.setMonth(newExpiresAt.getMonth() + months)
        }

        const updatedSub = {
            ...subscription,
            status: 'frozen',
            frozenAt: new Date().toISOString(),
            frozenUntil: frozenUntil.toISOString(),
            freezeReason: reason,
            expiresAt: newExpiresAt?.toISOString() || null
        }

        storedSubs[user.id] = updatedSub
        localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
        setSubscription(updatedSub)

        return { 
            success: true, 
            subscription: updatedSub,
            message: `Aboneliğiniz ${frozenUntil.toLocaleDateString('tr-TR')} tarihine kadar donduruldu.`
        }
    }

    // Aboneliği yeniden aktifleştir
    const unfreezeSubscription = async () => {
        if (!user || !subscription) {
            return { success: false, error: 'Aktif abonelik bulunamadı' }
        }

        if (subscription.status !== 'frozen') {
            return { success: false, error: 'Abonelik dondurulmuş değil' }
        }

        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        
        const updatedSub = {
            ...subscription,
            status: 'active',
            frozenAt: null,
            frozenUntil: null,
            freezeReason: null,
            unfrozenAt: new Date().toISOString()
        }

        storedSubs[user.id] = updatedSub
        localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
        setSubscription(updatedSub)

        return { 
            success: true, 
            subscription: updatedSub,
            message: 'Aboneliğiniz yeniden aktifleştirildi!'
        }
    }

    // Otomatik yenilemeyi aç/kapat
    const toggleAutoRenew = async () => {
        if (!user || !subscription) {
            return { success: false, error: 'Aktif abonelik bulunamadı' }
        }

        const storedSubs = JSON.parse(localStorage.getItem('CVniz_subscriptions') || '{}')
        
        const updatedSub = {
            ...subscription,
            autoRenew: !subscription.autoRenew
        }

        storedSubs[user.id] = updatedSub
        localStorage.setItem('CVniz_subscriptions', JSON.stringify(storedSubs))
        setSubscription(updatedSub)

        return { 
            success: true, 
            subscription: updatedSub,
            message: updatedSub.autoRenew ? 'Otomatik yenileme açıldı' : 'Otomatik yenileme kapatıldı'
        }
    }

    // Kalan gün hesapla
    const getRemainingDays = () => {
        if (!subscription || !subscription.expiresAt) return null
        const now = new Date()
        const expires = new Date(subscription.expiresAt)
        const diff = expires - now
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    // Abonelik durumu
    const getSubscriptionStatus = () => {
        if (!subscription) return 'none'
        return subscription.status
    }

    const value = {
        subscription,
        loading,
        
        // Actions
        changePlan,
        cancelSubscription,
        freezeSubscription,
        unfreezeSubscription,
        toggleAutoRenew,
        
        // Helpers
        getRemainingDays,
        getSubscriptionStatus,
        
        // Reload
        loadSubscription
    }

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    )
}

