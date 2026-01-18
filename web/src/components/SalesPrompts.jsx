import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, Gift, Clock, ArrowRight, Sparkles, Crown, Zap } from 'lucide-react'

// Exit Intent Popup - Shows when user tries to leave the page
export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [hasShown, setHasShown] = useState(false)
    const couponCode = 'BEKLE20'

    useEffect(() => {
        // Check if already shown in this session
        if (sessionStorage.getItem('exitPopupShown')) {
            setHasShown(true)
            return
        }

        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true)
                setHasShown(true)
                sessionStorage.setItem('exitPopupShown', 'true')
            }
        }

        document.addEventListener('mouseleave', handleMouseLeave)
        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [hasShown])

    const handleCopy = () => {
        navigator.clipboard.writeText(couponCode)
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsVisible(false)} />

            <div className="relative z-10 max-w-md w-full animate-scale-in">
                <div className="glass-card rounded-3xl p-8 border border-cyan-500/30 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative z-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mx-auto mb-6">
                            <Gift className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Dur! Sana Özel Fırsat 🎁</h2>
                        <p className="text-gray-400 mb-6">
                            Şimdi ayrılma! Sana özel <span className="text-cyan-400 font-bold">%20 indirim</span> kuponu hazırladık.
                        </p>

                        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-dashed border-cyan-500/50">
                            <div className="text-xs text-gray-500 mb-1">KUPON KODU</div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-2xl font-mono font-bold text-cyan-400">{couponCode}</span>
                                <button
                                    onClick={handleCopy}
                                    className="px-3 py-1 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition-colors"
                                >
                                    Kopyala
                                </button>
                            </div>
                        </div>

                        <Link
                            to="/checkout?plan=pro&cycle=yearly"
                            onClick={() => setIsVisible(false)}
                            className="btn-premium w-full py-4 flex items-center justify-center gap-2 mb-3"
                        >
                            <Crown className="w-5 h-5" />
                            İndirimli Pro'ya Geç
                        </Link>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            Hayır, tam fiyat ödemeyi tercih ederim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Countdown Timer Component
export function CountdownTimer({ endTime, onExpire }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    function calculateTimeLeft() {
        const difference = new Date(endTime) - new Date()
        if (difference <= 0) return null

        return {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft()
            setTimeLeft(newTimeLeft)
            if (!newTimeLeft && onExpire) {
                onExpire()
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    if (!timeLeft) return null

    return (
        <div className="flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl px-4 py-3">
            <Clock className="w-5 h-5 text-red-400 animate-pulse" />
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Bu fiyat şu sürede sona eriyor:</span>
                <div className="flex items-center gap-1 font-mono font-bold text-red-400">
                    <span className="bg-red-500/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span>:</span>
                    <span className="bg-red-500/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span>:</span>
                    <span className="bg-red-500/20 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
            </div>
        </div>
    )
}

// Premium Preview Lock Overlay
export function PremiumPreviewLock({ templateName, onUpgrade }) {
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in">
            <div className="text-center p-6 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Şablon</h3>
                <p className="text-gray-400 text-sm mb-4">
                    "{templateName}" şablonunu kullanmak için Pro'ya yükseltin.
                </p>
                <button
                    onClick={onUpgrade}
                    className="btn-premium w-full py-3 flex items-center justify-center gap-2"
                >
                    <Zap className="w-5 h-5" />
                    Pro'ya Yükselt
                </button>
            </div>
        </div>
    )
}

// Pro Upsell Popup - Shows after first CV creation
export function ProUpsellPopup({ isOpen, onClose, cvName }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 max-w-lg w-full animate-scale-in">
                <div className="glass-card rounded-3xl p-8 border border-purple-500/30 relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="font-bold">CV Oluşturuldu! 🎉</div>
                                <div className="text-sm text-gray-400">{cvName}</div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">
                            CV'nizi <span className="gradient-text">3 Kat Daha Etkili</span> Yapın
                        </h2>

                        <div className="space-y-3 mb-6">
                            {[
                                { icon: '🎨', text: '107+ Premium şablonla öne çıkın' },
                                { icon: '🤖', text: 'AI ile profesyonel içerik oluşturun' },
                                { icon: '📥', text: 'Watermark olmadan sınırsız indirin' },
                                { icon: '⚡', text: 'ATS uyumluluğu ile daha fazla görüşme' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-gray-300">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-4 mb-6 border border-purple-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-400">Özel Fırsat</div>
                                    <div className="text-2xl font-bold">29₺<span className="text-sm text-gray-500">/ay</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500 line-through">49₺/ay</div>
                                    <div className="text-green-400 text-sm font-bold">%40 Tasarruf</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
                            >
                                Sonra
                            </button>
                            <Link
                                to="/checkout?plan=pro&cycle=yearly"
                                onClick={onClose}
                                className="flex-1 btn-premium py-3 flex items-center justify-center gap-2"
                            >
                                <Crown className="w-4 h-4" />
                                Pro'ya Geç
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Sticky Bottom CTA Bar
export function StickyBottomCTA({ show = true }) {
    const [isVisible, setIsVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        if (dismissed) return

        const handleScroll = () => {
            const scrollY = window.scrollY
            const windowHeight = window.innerHeight
            const docHeight = document.documentElement.scrollHeight

            // Show after scrolling 30% of the page
            if (scrollY > windowHeight * 0.3 && scrollY < docHeight - windowHeight * 1.5) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [dismissed])

    if (!show || !isVisible || dismissed) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
            <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-t border-white/10 py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <span className="text-gray-300">
                                <span className="font-bold text-white">107+ Premium Şablon</span> ile hayalinizdeki işe ulaşın
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/checkout?plan=pro&cycle=yearly"
                            className="btn-premium px-6 py-2.5 flex items-center gap-2 text-sm whitespace-nowrap"
                        >
                            <Crown className="w-4 h-4" />
                            Pro'ya Geç - 29₺/ay
                        </Link>
                        <button
                            onClick={() => setDismissed(true)}
                            className="text-gray-500 hover:text-white transition-colors p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
