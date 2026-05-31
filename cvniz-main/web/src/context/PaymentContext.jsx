import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { paymentAPI, userAPI } from '../services/api'

const PaymentContext = createContext()

export function usePayment() {
    return useContext(PaymentContext)
}

// Plan definitions
export const PLANS = {
    free: {
        id: 'free',
        name: 'Ücretsiz',
        price: { monthly: 0, yearly: 0, lifetime: 0 },
        features: ['1 CV', '1 Şablon', 'PDF İndirme'],
        isPremium: false
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: { monthly: 49, yearly: 29, lifetime: 149 },
        features: ['Sınırsız CV', '200+ Şablon', 'AI Özellikler', 'Öncelikli Destek'],
        isPremium: true,
        popular: true
    },
    enterprise: {
        id: 'enterprise',
        name: 'Kurumsal',
        price: { monthly: 149, yearly: 99, lifetime: 499 },
        features: ['Tüm Pro özellikler', 'API Erişimi', 'Özel Branding', 'SLA Garantisi'],
        isPremium: true
    }
}

// Coupon definitions
const COUPONS = {
    'HOSGELDIN': { discount: 20, type: 'percent', expires: '2025-12-31', maxUses: 100 },
    'YENI2024': { discount: 30, type: 'percent', expires: '2025-01-31', maxUses: 50 },
    'INDIRIM50': { discount: 50, type: 'fixed', expires: '2025-03-01', maxUses: 20 },
    'BEKLE20': { discount: 20, type: 'percent', expires: '2025-12-31', maxUses: 500 }
}

export function PaymentProvider({ children }) {
    const { user, updateUser } = useAuth()
    const [payments, setPayments] = useState([])
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [billingCycle, setBillingCycle] = useState('yearly') // monthly, yearly, lifetime
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Load payments from backend
    useEffect(() => {
        if (user) {
            loadPayments()
        } else {
            setPayments([])
        }
    }, [user])

    const loadPayments = async () => {
        try {
            const response = await paymentAPI.getMy()
            if (response.success) {
                setPayments(response.payments)
            }
        } catch (error) {
            console.error('Ödemeler yüklenirken hata:', error)
        }
    }

    // Calculate price with discount
    const calculatePrice = (plan, cycle, coupon = null) => {
        if (!plan) return 0

        let basePrice = plan.price[cycle]
        if (cycle === 'yearly') {
            basePrice = basePrice * 12 // Yearly total
        }

        if (coupon) {
            if (coupon.type === 'percent') {
                basePrice = basePrice * (1 - coupon.discount / 100)
            } else {
                basePrice = Math.max(0, basePrice - coupon.discount)
            }
        }

        return Math.round(basePrice)
    }

    // Validate coupon
    const validateCoupon = (code) => {
        // First check static coupons
        const coupon = COUPONS[code.toUpperCase()]
        if (coupon) {
            const now = new Date()
            const expires = new Date(coupon.expires)
            if (now > expires) {
                return { valid: false, error: 'Kupon süresi dolmuş' }
            }
            return { valid: true, coupon: { code: code.toUpperCase(), ...coupon } }
        }

        // Check referral coupons in localStorage
        const storedCoupons = JSON.parse(localStorage.getItem('CVniz_coupons') || '[]')
        const referralCoupon = storedCoupons.find(c => c.code === code.toUpperCase() && !c.used)

        if (referralCoupon) {
            const now = new Date()
            const expires = new Date(referralCoupon.expiresAt)
            if (now > expires) {
                return { valid: false, error: 'Kupon süresi dolmuş' }
            }

            // Check if coupon belongs to current user
            if (referralCoupon.userId !== user?.id) {
                return { valid: false, error: 'Bu kupon size ait değil' }
            }

            return {
                valid: true,
                coupon: {
                    code: code.toUpperCase(),
                    discount: referralCoupon.discount,
                    type: referralCoupon.type,
                    isReferral: true
                }
            }
        }

        return { valid: false, error: 'Geçersiz kupon kodu' }
    }

    // Apply coupon
    const applyCoupon = async (code) => {
        try {
            const response = await userAPI.validateCoupon(code.toUpperCase());
            if (response.data.success) {
                setAppliedCoupon(response.data.coupon);
                return { valid: true, coupon: response.data.coupon };
            } else {
                return { valid: false, error: response.data.error || 'Geçersiz kupon' };
            }
        } catch (error) {
            return { valid: false, error: error.response?.data?.error || 'Kupon doğrulanırken bir hata oluştu' };
        }
    }

    // Remove coupon
    const removeCoupon = () => {
        setAppliedCoupon(null)
    }

    // Process payment (Real Iyzico Init)
    const processPayment = async (paymentData) => {
        if (!user) {
            return { success: false, error: 'Lütfen giriş yapın' }
        }

        if (!selectedPlan || selectedPlan.id === 'free') {
            return { success: false, error: 'Geçerli bir plan seçin' }
        }

        setIsProcessing(true)

        try {
            const finalPrice = calculatePrice(selectedPlan, billingCycle, appliedCoupon);

            const response = await paymentAPI.init({
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                billingCycle,
                amount: finalPrice,
                price: finalPrice.toString(), // Iyzico expects string usually, but verified backend handles it
                user: user
            })

            if (response.success) {
                // Return the HTML content for CheckoutPage to render
                setIsProcessing(false)
                return {
                    success: true,
                    htmlContent: response.htmlContent,
                    paymentPageUrl: response.paymentPageUrl,
                    token: response.token
                }
            } else {
                setIsProcessing(false)
                return { success: false, error: response.error || 'Ödeme başlatılamadı' }
            }
        } catch (error) {
            setIsProcessing(false)
            console.error(error);
            return { success: false, error: error.message || 'Ödeme hatası' }
        }
    }

    // Get user's payment history
    const getUserPayments = () => {
        if (!user) return []
        return payments.filter(p => p.userId === user.id)
    }

    // Get all payments (admin)
    const getAllPayments = () => {
        return payments
    }

    // Check if user has active subscription
    const hasActiveSubscription = () => {
        if (!user) return false

        const userPayments = getUserPayments()
        const now = new Date()

        return userPayments.some(p => {
            if (p.status !== 'completed') return false
            if (p.billingCycle === 'lifetime') return true
            if (!p.expiresAt) return true
            return new Date(p.expiresAt) > now
        })
    }

    const value = {
        // Plans
        PLANS,
        selectedPlan,
        setSelectedPlan,
        billingCycle,
        setBillingCycle,

        // Coupon
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        validateCoupon,

        // Price calculation
        calculatePrice,

        // Payment processing
        processPayment,
        isProcessing,

        // Payment history
        payments,
        getUserPayments,
        getAllPayments,
        hasActiveSubscription
    }

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    )
}

