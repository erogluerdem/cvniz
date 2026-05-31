import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCampaign } from '../context/CampaignContext'
import { usePayment } from '../context/PaymentContext'
import { useAuth } from '../context/AuthContext'
import {
    X, Gift, Clock, ArrowRight, Shield,
    Check, Tag, Sparkles, AlertTriangle
} from 'lucide-react'

export default function AbandonedCartModal() {
    const { isAdmin } = useAuth()
    const { activeCampaign, dismissCampaign, trackCampaignClick, triggerCampaign, trackConversion } = useCampaign()
    const { applyCoupon, selectedPlan } = usePayment()
    const navigate = useNavigate()
    const location = useLocation()

    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [countdown, setCountdown] = useState(15 * 60) // 15 minutes in seconds
    const [couponApplied, setCouponApplied] = useState(false)

    // Detect checkout page exit
    const handleBeforeUnload = useCallback((e) => {
        if (location.pathname === '/checkout' && selectedPlan) {
            // Show the modal instead of browser default
            const campaign = triggerCampaign('checkout_exit')
            if (campaign) {
                e.preventDefault()
                e.returnValue = ''
                setIsVisible(true)
            }
        }
    }, [location.pathname, selectedPlan, triggerCampaign])

    useEffect(() => {
        // Add listener for page exit
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [handleBeforeUnload])

    // Show popup when activeCampaign is abandonedCart type
    useEffect(() => {
        if (activeCampaign?.id === 'abandonedCart') {
            setIsVisible(true)
        }
    }, [activeCampaign])

    // Countdown timer
    useEffect(() => {
        if (!isVisible) return

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleClose()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isVisible])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsVisible(false)
            setIsClosing(false)
            dismissCampaign()
        }, 300)
    }

    const handleApplyCoupon = () => {
        if (activeCampaign?.content?.couponCode) {
            const result = applyCoupon(activeCampaign.content.couponCode)
            if (result.valid) {
                setCouponApplied(true)
                trackCampaignClick('abandonedCart', 'coupon_applied')
                trackConversion('abandonedCart')
            }
        }
    }

    const handleContinueCheckout = () => {
        trackCampaignClick('abandonedCart', 'continue_checkout')
        if (!couponApplied) {
            handleApplyCoupon()
        }
        handleClose()
        // Stay on checkout page
    }

    const handleLater = () => {
        trackCampaignClick('abandonedCart', 'later')
        handleClose()
        navigate('/dashboard')
    }

    if (!isVisible || !activeCampaign || activeCampaign.id !== 'abandonedCart') return null

    const content = activeCampaign.content

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`max-w-md w-full glass-card rounded-3xl overflow-hidden relative transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20" />

                {/* Urgency Banner */}
                <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-2 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Bu teklif çok sınırlı!</span>
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-12 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="relative z-10 p-8 pt-6">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                        <Gift className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-2">
                        {content.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-center text-sm mb-6">
                        {content.subtitle}
                    </p>

                    {/* Countdown Timer */}
                    <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-amber-500/20">
                        <div className="flex items-center justify-center gap-3">
                            <Clock className="w-6 h-6 text-amber-400" />
                            <div className="text-3xl font-mono font-bold text-amber-400">
                                {formatTime(countdown)}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Teklif sona ermeden kullan!
                        </p>
                    </div>

                    {/* Coupon Display */}
                    <div className={`rounded-xl p-4 mb-6 transition-all ${couponApplied
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Tag className="w-5 h-5 text-amber-400" />
                                <div>
                                    <div className="font-mono font-bold text-lg">{content.couponCode}</div>
                                    <div className="text-xs text-gray-400">%{content.discount} Ekstra İndirim</div>
                                </div>
                            </div>
                            {couponApplied ? (
                                <span className="flex items-center gap-1 text-green-400 text-sm">
                                    <Check className="w-4 h-4" /> Uygulandı
                                </span>
                            ) : (
                                <button
                                    onClick={handleApplyCoupon}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition-colors"
                                >
                                    Uygula
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <p className="text-gray-300 text-center text-sm mb-6">
                        {content.body}
                    </p>

                    {/* CTAs */}
                    <div className="space-y-3">
                        <button
                            onClick={handleContinueCheckout}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/30"
                        >
                            <Sparkles className="w-5 h-5" />
                            {content.ctaPrimary}
                        </button>
                        <button
                            onClick={handleLater}
                            className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-gray-400"
                        >
                            {content.ctaSecondary}
                        </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
                        <Shield className="w-4 h-4" />
                        <span>7 gün para iade garantisi</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
