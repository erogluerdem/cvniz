import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, Gift, Clock, ArrowRight, Sparkles, Crown, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'

// Smart Sales Popup - Responds to various user behaviors
export function ExitIntentPopup() {
    const { isAdmin } = useAuth()
    const [isVisible, setIsVisible] = useState(false)
    const [hasShown, setHasShown] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)
    const [triggerType, setTriggerType] = useState(null) // 'exit', 'time', 'scroll'
    const couponCode = 'BEKLE20'
    const timerRef = useRef(null)

    useEffect(() => {
        if (isAdmin) return; // Skip logic but keep hook count

        // Check if already shown in this session
        if (sessionStorage.getItem('exitPopupShown')) {
            setHasShown(true)
            return
        }

        // Trigger 1: Exit Intent (Fast mouse move to top)
        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 && !hasShown) {
                triggerPopup('exit')
            }
        }

        // Trigger 2: Time on Page (45 seconds)
        timerRef.current = setTimeout(() => {
            if (!hasShown) {
                triggerPopup('time')
            }
        }, 45000)

        // Trigger 3: Scroll Depth (60%)
        const handleScroll = () => {
            if (hasShown) return
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            if (scrollPercentage > 60) {
                triggerPopup('scroll')
            }
        }

        const triggerPopup = (type) => {
            setIsVisible(true)
            setHasShown(true)
            setTriggerType(type)
            sessionStorage.setItem('exitPopupShown', 'true')
            window.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('scroll', handleScroll)
            if (timerRef.current) clearTimeout(timerRef.current)
        }

        document.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('scroll', handleScroll)

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('scroll', handleScroll)
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [hasShown, isAdmin])

    const handleCopy = () => {
        navigator.clipboard.writeText(couponCode)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
    }

    if (isAdmin) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {showConfetti && (
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            recycle={false}
                            numberOfPieces={200}
                            colors={['#00f2ff', '#a855f7', '#3b82f6', '#ffffff']}
                        />
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setIsVisible(false)}
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0, rotateX: 15 }}
                        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative z-10 max-w-md w-full"
                    >
                        <div className="relative group">
                            {/* Animated Outer Glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                            <div className="relative glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/10 overflow-hidden bg-slate-900/40 backdrop-blur-2xl">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
                                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all transform hover:rotate-90"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="relative z-10 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-[0_10px_40px_rgba(0,242,255,0.3)] relative"
                                    >
                                        <div className="absolute inset-0 rounded-3xl animate-ping bg-cyan-400/20" />
                                        <Gift className="w-10 h-10 text-white relative z-10" />
                                    </motion.div>

                                    <h2 className="text-3xl font-black mb-3 tracking-tight">
                                        Dur! Kaçırma 🚀
                                    </h2>
                                    <p className="text-gray-300 mb-8 leading-relaxed">
                                        Yolculuğun burada bitmesin! Sana özel <span className="text-cyan-400 font-bold px-1.5 py-0.5 bg-cyan-400/10 rounded-md">%20 İNDİRİM</span> tanımladık.
                                    </p>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 relative group/coupon overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 opacity-0 group-hover/coupon:opacity-100 transition-opacity" />
                                        <div className="text-[10px] font-black tracking-[0.2em] text-cyan-500/60 mb-2 uppercase">KUPONUNUZ HAZIR</div>
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="text-3xl font-mono font-black text-white tracking-widest leading-none">
                                                {couponCode}
                                            </span>
                                            <button
                                                onClick={handleCopy}
                                                className={`px-4 py-2 rounded-xl transition-all font-bold text-xs flex items-center gap-2 ${showConfetti
                                                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                                    : 'bg-white/10 text-cyan-400 hover:bg-white/20'
                                                    }`}
                                            >
                                                {showConfetti ? 'Kopyalandı!' : 'Kopyala'}
                                            </button>
                                        </div>
                                    </motion.div>

                                    <div className="space-y-4">
                                        <Link
                                            to="/checkout?plan=pro&cycle=yearly"
                                            onClick={() => setIsVisible(false)}
                                            className="group/btn relative w-full inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(0,242,255,0.2)]"
                                        >
                                            <Crown className="w-6 h-6 animate-bounce" />
                                            İndirimli Pro'ya Geç
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>

                                        <button
                                            onClick={() => setIsVisible(false)}
                                            className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                                        >
                                            Hayır, tam fiyat öderim
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
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
    const { isAdmin } = useAuth()
    if (!isOpen || isAdmin) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative z-10 max-w-lg w-full"
                >
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/10 relative overflow-hidden bg-slate-900/40 backdrop-blur-2xl shadow-2xl">
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all transform hover:rotate-90"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <motion.div
                                    initial={{ rotate: -20, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20"
                                >
                                    <Sparkles className="w-7 h-7 text-white" />
                                </motion.div>
                                <div>
                                    <div className="font-black text-xl tracking-tight text-white">Harika İş! 🎉</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{cvName} Hazır!</div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black mb-6 leading-tight tracking-tight">
                                CV'nizi <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent underline decoration-cyan-500/30 underline-offset-8">10 Kat Daha Etkili</span> Yapın
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: '🎨', text: '200+ Premium Şablon' },
                                    { icon: '🤖', text: 'AI İçerik Asistanı' },
                                    { icon: '📥', text: 'Sınırsız PDF İndirme' },
                                    { icon: '⚡', text: 'ATS Dostu Format' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl p-6 mb-8 border border-purple-500/20 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <div className="text-[10px] font-black tracking-widest text-purple-400 mb-1 uppercase">LANSMAN ÖZEL</div>
                                        <div className="text-3xl font-black text-white">29₺<span className="text-sm font-normal text-gray-500 ml-1 uppercase">/ay</span></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 line-through font-bold">49₺</div>
                                        <div className="text-green-400 text-xs font-black bg-green-400/10 px-2 py-1 rounded-lg mt-1 uppercase">%40İNDİRİM</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white"
                                >
                                    Daha Sonra
                                </button>
                                <Link
                                    to="/checkout?plan=pro&cycle=yearly"
                                    onClick={onClose}
                                    className="flex-1 btn-premium py-4 flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <Crown className="w-5 h-5 animate-pulse" />
                                    <span className="font-black uppercase tracking-widest text-sm text-white">Pro'ya Geç</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

// Sticky Bottom CTA Bar
export function StickyBottomCTA({ show = true }) {
    const { isAdmin } = useAuth()
    const [isVisible, setIsVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)
    const [isDayMode, setIsDayMode] = useState(false)

    // Listen for theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return

        const checkTheme = () => {
            const storedTheme = window.localStorage.getItem('CVniz-home-theme')
            setIsDayMode(storedTheme === 'day')
        }

        checkTheme()

        const handleThemeChange = (event) => {
            setIsDayMode(event.detail === 'day')
        }

        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

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

    if (isAdmin || !show || !isVisible || dismissed) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className={`relative border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden ${isDayMode
                    ? 'bg-white/90 border-slate-200'
                    : 'bg-slate-900/90 border-white/5'
                    }`}
            >
                {/* Visual Accent - Animated Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-purple-600 animate-pulse" />

                <div className="backdrop-blur-xl py-4 px-6 md:px-8">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDayMode ? 'bg-sky-50' : 'bg-white/5'}`}>
                                    <Sparkles className={`w-5 h-5 ${isDayMode ? 'text-sky-500' : 'text-cyan-400 opacity-80'}`} />
                                </div>
                                <span className={isDayMode ? 'text-slate-600' : 'text-gray-300'}>
                                    <span className={`font-black uppercase tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>200+ Premium Şablon</span>
                                    <span className="ml-2 opacity-60 font-medium">ile kariyerinizde fark yaratın</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/checkout?plan=pro&cycle=yearly"
                                    className="btn-premium px-8 py-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest whitespace-nowrap shadow-lg shadow-cyan-500/20"
                                >
                                    <Crown className="w-4 h-4" />
                                    Pro'ya Geç - 29₺
                                </Link>
                            </motion.div>
                            <button
                                onClick={() => setDismissed(true)}
                                className={`transition-all p-2 rounded-full hover:bg-black/5 ${isDayMode ? 'text-slate-400 hover:text-slate-800' : 'text-gray-500 hover:text-white'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
