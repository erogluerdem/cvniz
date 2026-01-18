import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Crown, Zap, Download, CheckCircle, ArrowRight, 
    Sparkles, Gift, Clock, TrendingUp, Star, Shield,
    FileText, Palette, Bot, Headphones
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePayment, PLANS } from '../context/PaymentContext'

const UPSELL_FEATURES = [
    {
        icon: Palette,
        title: '107+ Premium Şablon',
        description: 'Profesyonel tasarımlarla öne çıkın',
        highlight: true
    },
    {
        icon: Bot,
        title: 'AI Destekli İçerik',
        description: 'Yapay zeka ile mükemmel CV metinleri',
        highlight: true
    },
    {
        icon: FileText,
        title: 'Sınırsız CV Oluşturma',
        description: 'Her iş için farklı CV hazırlayın'
    },
    {
        icon: Shield,
        title: 'ATS Uyumluluk Garantisi',
        description: 'İşe alım sistemlerinden geçin'
    },
    {
        icon: Headphones,
        title: 'Öncelikli Destek',
        description: '7/24 uzman desteği'
    }
]

export default function UpsellModal({ 
    isOpen, 
    onClose, 
    triggerType = 'download', // download, template, ai, limit
    onUpgrade,
    customTitle,
    customDescription 
}) {
    const { user } = useAuth()
    const { PLANS, setBillingCycle, billingCycle, setSelectedPlan } = usePayment()
    const [selectedCycle, setSelectedCycle] = useState('yearly')
    const [showConfetti, setShowConfetti] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 dakika

    // Countdown timer
    useEffect(() => {
        if (!isOpen) return
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) return 0
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isOpen])

    // Reset timer when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeLeft(300)
        }
    }, [isOpen])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getContent = () => {
        switch (triggerType) {
            case 'download':
                return {
                    title: '📥 Premium PDF İndirme',
                    subtitle: 'Filigransız, yüksek kaliteli CV indirin',
                    urgency: 'Bu indirme için özel %40 indirim!',
                    discount: 40
                }
            case 'template':
                return {
                    title: '🎨 Premium Şablon',
                    subtitle: 'Bu şablonu kullanmak için Pro\'ya yükseltin',
                    urgency: 'İlk 100 kullanıcıya özel fırsat!',
                    discount: 30
                }
            case 'ai':
                return {
                    title: '🤖 AI Özelliklerinin Kilidini Açın',
                    subtitle: 'Yapay zeka ile mükemmel CV\'ler oluşturun',
                    urgency: 'AI kredileri sınırlı süreyle 2x!',
                    discount: 35
                }
            case 'limit':
                return {
                    title: '⚡ CV Limitinize Ulaştınız',
                    subtitle: 'Sınırsız CV oluşturmak için yükseltin',
                    urgency: 'Hemen yükseltin, anında erişim!',
                    discount: 25
                }
            default:
                return {
                    title: customTitle || '🚀 Pro\'ya Yükseltin',
                    subtitle: customDescription || 'Tüm özelliklerin kilidini açın',
                    urgency: 'Sınırlı süreli teklif!',
                    discount: 30
                }
        }
    }

    const content = getContent()
    const plan = PLANS.pro
    const originalPrice = plan.price[selectedCycle] * (selectedCycle === 'yearly' ? 12 : 1)
    const discountedPrice = Math.round(originalPrice * (1 - content.discount / 100))
    const savings = originalPrice - discountedPrice

    const handleUpgrade = () => {
        setShowConfetti(true)
        setBillingCycle(selectedCycle)
        setSelectedPlan(PLANS.pro)
        
        setTimeout(() => {
            onUpgrade?.()
            onClose()
        }, 1500)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700"
                >
                    {/* Confetti Effect */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none z-50">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ 
                                        x: '50%', 
                                        y: '50%',
                                        scale: 0 
                                    }}
                                    animate={{ 
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        scale: 1,
                                        rotate: Math.random() * 360
                                    }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="absolute w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 5]
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>

                    {/* Urgency Banner */}
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-3 text-white font-bold">
                            <Clock className="animate-pulse" size={20} />
                            <span>Teklif sona eriyor: {formatTime(timeLeft)}</span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                %{content.discount} İNDİRİM
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block mb-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                                    <Crown size={40} className="text-white" />
                                </div>
                            </motion.div>

                            <h2 className="text-3xl font-black text-white mb-2">
                                {content.title}
                            </h2>
                            <p className="text-gray-400 text-lg">
                                {content.subtitle}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {UPSELL_FEATURES.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-4 rounded-xl border ${
                                        feature.highlight 
                                            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30' 
                                            : 'bg-gray-800/50 border-gray-700'
                                    }`}
                                >
                                    <feature.icon size={24} className={feature.highlight ? 'text-cyan-400 mb-2' : 'text-gray-400 mb-2'} />
                                    <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button
                                onClick={() => setSelectedCycle('monthly')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedCycle === 'monthly'
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Aylık
                            </button>
                            <button
                                onClick={() => setSelectedCycle('yearly')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
                                    selectedCycle === 'yearly'
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                Yıllık
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    Tasarruf
                                </span>
                            </button>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Normal Fiyat</p>
                                    <p className="text-2xl text-gray-500 line-through">₺{originalPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-cyan-400 text-sm font-medium">Özel Fiyat</p>
                                    <p className="text-4xl font-black text-white">₺{discountedPrice}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg py-2 px-4">
                                <TrendingUp size={16} className="text-green-400" />
                                <span className="text-green-400 font-medium">₺{savings} tasarruf ediyorsunuz!</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            onClick={handleUpgrade}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-3 transition-all"
                        >
                            <Zap size={24} />
                            Hemen Pro'ya Yükselt
                            <ArrowRight size={20} />
                        </motion.button>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 mt-6 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Shield size={16} />
                                <span>30 Gün İade Garantisi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={16} />
                                <span>4.9/5 Kullanıcı Puanı</span>
                            </div>
                        </div>

                        {/* Skip Link */}
                        <button
                            onClick={onClose}
                            className="w-full mt-4 text-gray-500 hover:text-gray-400 text-sm transition-colors"
                        >
                            Hayır, teşekkürler. Ücretsiz devam edeceğim.
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// Hook for easy trigger
export function useUpsellModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [triggerType, setTriggerType] = useState('download')

    const showUpsell = (type = 'download') => {
        setTriggerType(type)
        setIsOpen(true)
    }

    const hideUpsell = () => {
        setIsOpen(false)
    }

    return {
        isOpen,
        triggerType,
        showUpsell,
        hideUpsell
    }
}
