import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSiteContent } from '../context/SiteContentContext'
import { useState, useEffect, useRef, useMemo } from 'react'
import { templateAPI } from '../services/api'
import {
    FileText, Users, Settings, LogOut, LayoutDashboard, TrendingUp, Download, Crown,
    Trash2, Shield, Search, Bell, ChevronRight, Eye, Edit, Ban, Check, X, Mail,
    CreditCard, Tag, Database, Activity, Server, Globe, Clock, Calendar, Filter,
    PieChart, BarChart3, DollarSign, Package, Zap, AlertTriangle, Info, RefreshCw,
    Send, Copy, Plus, Minus, Percent, Gift, Lock, Unlock, UserPlus, UserMinus,
    FileDown, FileUp, HardDrive, Cpu, MemoryStick as Memory, Wifi, WifiOff, Home,
    Type, Image, MessageSquare, Star, Quote, HelpCircle, Palette, Save, RotateCcw,
    Megaphone, FileSpreadsheet, History, Key, Languages, MousePointer2,
    EyeOff, Globe2, Wallet, Folder, Sparkles, Play, Video, ArrowRight, ChevronDown, CheckCircle, Timer, Award, Rocket
} from 'lucide-react'
import AIDemo from '../components/AIDemo'
import TiltCard from '../components/TiltCard'

// Particle Background Component
function ParticleBackground({ isDayMode }) {
    const palette = isDayMode
        ? ['rgba(14,165,233,0.25)', 'rgba(251,191,36,0.2)', 'rgba(125,211,252,0.3)']
        : ['rgba(6,182,212,0.35)', 'rgba(148,163,184,0.25)', 'rgba(6,182,212,0.2)']

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full animate-float-particle"
                    style={{
                        backgroundColor: palette[i % palette.length],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 10}s`,
                        boxShadow: isDayMode
                            ? '0 0 12px rgba(250,204,21,0.35)'
                            : '0 0 10px rgba(6,182,212,0.45)'
                    }}
                />
            ))}
        </div>
    )
}

// Cursor Glow Effect
function CursorGlow({ isDayMode }) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
            setIsVisible(true)
        }
        const handleMouseLeave = () => setIsVisible(false)

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div
            className="fixed w-96 h-96 rounded-full pointer-events-none z-50 transition-opacity duration-300 mix-blend-screen"
            style={{
                left: position.x - 192,
                top: position.y - 192,
                background: isDayMode
                    ? 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
                opacity: isVisible ? 1 : 0
            }}
        />
    )
}

// Gradient Wave Component
function GradientWave({ isDayMode }) {
    const gradientId = isDayMode ? 'waveGradientDay' : 'waveGradientNight'
    const stops = isDayMode
        ? ['rgba(14,165,233,0.35)', 'rgba(248,250,252,0.5)', 'rgba(251,146,60,0.35)']
        : ['rgba(6,182,212,0.3)', 'rgba(148,163,184,0.2)', 'rgba(6,182,212,0.3)']

    return (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-32 z-0">
            <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={stops[0]} />
                        <stop offset="50%" stopColor={stops[1]} />
                        <stop offset="100%" stopColor={stops[2]} />
                    </linearGradient>
                </defs>
                <path
                    fill={`url(#${gradientId})`}
                    d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
                    className="animate-wave"
                />
                <path
                    fill={`url(#${gradientId})`}
                    d="M0,80 C360,40 720,120 1080,80 C1260,60 1380,90 1440,80 L1440,120 L0,120 Z"
                    className="animate-wave-slow"
                    style={{ opacity: 0.5 }}
                />
            </svg>
        </div>
    )
}

function DaytimeBackdrop() {
    const clouds = [
        { top: '12%', left: '8%', delay: 0, duration: 26, scale: 1 },
        { top: '24%', left: '60%', delay: 4, duration: 32, scale: 1.15 },
        { top: '38%', left: '30%', delay: 8, duration: 30, scale: 0.9 }
    ]

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-white to-amber-50" />
            <div className="absolute w-96 h-96 bg-gradient-to-br from-amber-200 via-yellow-200 to-rose-100 rounded-full blur-[120px] top-10 right-16 opacity-80 day-sun" />
            {clouds.map((cloud, index) => (
                <div
                    key={index}
                    className="day-cloud"
                    style={{
                        top: cloud.top,
                        left: cloud.left,
                        '--cloud-delay': `${cloud.delay}s`,
                        '--cloud-duration': `${cloud.duration}s`,
                        '--cloud-scale': `${cloud.scale}`
                    }}
                />
            ))}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-emerald-100/60 via-transparent to-transparent" />
        </div>
    )
}

// Sticky Progress Bar
function StickyProgressBar({ isDayMode }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPosition = window.scrollY
            setProgress((scrollPosition / totalHeight) * 100)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className={`fixed top-0 left-0 right-0 h-1 z-50 ${isDayMode ? 'bg-slate-900/10' : 'bg-white/5'}`}>
            <div
                className={`h-full rounded-full transition-all duration-150 ${isDayMode
                    ? 'bg-gradient-to-r from-sky-400 via-amber-300 to-rose-300'
                    : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500'
                    }`}
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

// Interactive Stat Card
function InteractiveStatCard({ value, suffix, label, detail, icon: Icon }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="text-center relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    <AnimatedCounter end={parseInt(value)} />
                    {suffix}
                </div>
                <div className="text-gray-400">{label}</div>
            </div>
            {isHovered && detail && (
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 glass-card rounded-xl px-4 py-2 text-sm text-cyan-300 whitespace-nowrap z-20 animate-fade-in">
                    {detail}
                </div>
            )}
        </div>
    )
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000 }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(null)
    const hasStarted = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted.current) {
                    hasStarted.current = true
                    const start = Date.now()
                    const timer = setInterval(() => {
                        const now = Date.now()
                        const progress = Math.min((now - start) / duration, 1)
                        setCount(Math.floor(end * progress))
                        if (progress === 1) clearInterval(timer)
                    }, 16)
                }
            },
            { threshold: 0.1 }
        )
        if (countRef.current) observer.observe(countRef.current)
        return () => observer.disconnect()
    }, [])

    return <span ref={countRef}>{count}</span>
}

// Video Modal Component
function VideoModal({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-4xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src="about:blank"
                        title="CVniz Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                    />
                </div>
            </div>
        </div>
    )
}

// FAQ Accordion Component
const FAQAccordion = () => {
    const { content } = useSiteContent()
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <div className="space-y-4">
            {content.faqs?.map((faq, index) => (
                <div
                    key={index}
                    className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                        <span className="font-bold text-lg group-hover:text-cyan-300 transition-colors">
                            {faq.question}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    {openIndex === index && (
                        <div className="px-6 pb-5 text-gray-400 animate-slide-down">
                            {faq.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// Infinite Logo Carousel
function LogoCarousel({ isDayMode = false }) {
    const logos = [
        { name: 'Google', color: '#4285F4' },
        { name: 'Microsoft', color: '#00A4EF' },
        { name: 'Trendyol', color: '#F27A1A' },
        { name: 'Amazon', color: '#FF9900' },
        { name: 'Getir', color: '#5D3EBC' },
        { name: 'Netflix', color: '#E50914' },
        { name: 'Hepsiburada', color: '#FF6000' },
        { name: 'Tesla', color: '#CC0000' },
        { name: 'N11', color: '#7B2CBF' },
        { name: 'Spotify', color: '#1DB954' },
        { name: 'Turkcell', color: '#FFD000' },
        { name: 'Garanti', color: '#00653E' }
    ]

    return (
        <div className="relative overflow-hidden py-8">
            <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 ${isDayMode ? 'bg-gradient-to-r from-white to-transparent' : 'bg-gradient-to-r from-slate-950 to-transparent'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 ${isDayMode ? 'bg-gradient-to-l from-white to-transparent' : 'bg-gradient-to-l from-slate-950 to-transparent'}`} />
            <div className="flex animate-scroll-left">
                {[...logos, ...logos].map((logo, i) => (
                    <div
                        key={i}
                        className={`flex-shrink-0 mx-8 px-6 py-3 rounded-xl border transition-all hover:scale-105 ${isDayMode ? 'bg-white border-slate-200/70 shadow-day' : 'bg-white/5 border-white/10 hover:border-cyan-500/50'}`}
                    >
                        <span
                            className="text-xl font-bold tracking-wide"
                            style={{ color: logo.color }}
                        >
                            {logo.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const TestimonialCarousel = () => {
    const { content } = useSiteContent()
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        if (!content.testimonials?.length) return

        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % content.testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [content.testimonials?.length])

    return (
        <div className="relative max-w-4xl mx-auto px-6">
            <div className="relative aspect-[21/9] md:aspect-[21/7] overflow-hidden rounded-3xl">
                {content.testimonials?.map((testimonial, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center p-8 md:p-12 transition-all duration-700 ease-in-out ${activeIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                            }`}
                    >
                        <div className="text-center">
                            <Quote className="w-12 h-12 text-cyan-500/20 mx-auto mb-6" />
                            <p className="text-xl md:text-2xl text-white font-medium mb-8 italic leading-relaxed">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                                    {testimonial.name?.[0] || 'C'}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-lg">{testimonial.name}</div>
                                    <div className="text-cyan-400 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
                {content.testimonials?.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 bg-cyan-500' : 'bg-white/20'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

// Live Proof Notification
function LiveProofNotification({ isDayMode }) {
    const names = ['Ahmet', 'Ayşe', 'Ali', 'Fatma', 'Mehmet', 'Zeynep', 'Emre', 'Elif', 'Hasan', 'Hülya']
    const actions = ['CV oluşturdu', 'Şablon seçti', 'Premium satın aldı', 'PDF indirdi', 'İşe girdi', 'Görüşmeye davet aldı']
    const [currentEvent, setCurrentEvent] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const showNotification = () => {
            const randomName = names[Math.floor(Math.random() * names.length)]
            const randomAction = actions[Math.floor(Math.random() * actions.length)]
            setCurrentEvent({ name: randomName, action: randomAction })
            setIsVisible(true)
            setTimeout(() => setIsVisible(false), 4000)
        }

        showNotification()
        const timer = setInterval(showNotification, 8000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={`fixed bottom-8 left-8 z-40 hidden lg:block transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            {currentEvent && (
                <div className={`glass-card rounded-xl p-4 max-w-sm ${isDayMode ? 'border border-slate-200/60 shadow-day bg-white/90' : 'border border-white/10 shadow-[0_25px_80px_-40px_rgba(34,211,238,0.6)]'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${isDayMode ? 'bg-gradient-to-br from-sky-200 to-emerald-100 text-slate-800 ring-1 ring-white/70' : 'bg-gradient-to-br from-cyan-300 to-slate-200 text-slate-900'}`}>
                            {currentEvent.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{currentEvent.name} K.</p>
                            <p className={`text-xs mt-1 ${isDayMode ? 'text-sky-600' : 'text-cyan-300'}`}>✨ {currentEvent.action}</p>
                            <p className={`text-xs mt-1 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Şimdi</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Scroll Animation Hook
function useScrollAnimation() {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return [ref, isVisible]
}

// Animated Section Wrapper
function AnimatedSection({ children, className = '', delay = 0 }) {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    )
}

export default function HomePage() {
    const { user, isAdmin } = useAuth()
    const { content } = useSiteContent()
    const [videoModalOpen, setVideoModalOpen] = useState(false)
    const [backendTemplates, setBackendTemplates] = useState([])
    const [theme, setTheme] = useState('day')
    const isDayMode = theme === 'day'

    useEffect(() => {
        if (typeof window === 'undefined') return
        const storedTheme = window.localStorage.getItem('CVniz-home-theme')
        if (storedTheme === 'day' || storedTheme === 'night') {
            setTheme(storedTheme)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem('CVniz-home-theme', theme)
    }, [theme])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handleThemeChange = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

    // Fetch backend templates for thumbnails
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await templateAPI.getAll()
                if (res.success && res.templates) {
                    setBackendTemplates(res.templates)
                }
            } catch (err) {
                console.log('Backend templates fetch failed')
            }
        }
        fetchTemplates()
    }, [])

    // Static web template definitions with backend thumbnail override
    const webTemplates = useMemo(() => {
        const staticTemplates = [
            { id: 'minimal_web', name: 'Minimal', color: 'from-white to-gray-100', textColor: 'text-gray-900' },
            { id: 'dark_web', name: 'Dark', color: 'from-gray-900 to-black', textColor: 'text-cyan-400' },
            { id: 'glass_web', name: 'Glass', color: 'from-purple-600 to-pink-600', textColor: 'text-white' },
            { id: 'gradient_web', name: 'Gradient', color: 'from-orange-500 to-pink-600', textColor: 'text-white' },
            { id: 'creative_web', name: 'Creative', color: 'from-amber-100 to-orange-200', textColor: 'text-orange-700' },
            { id: 'corporate_web', name: 'Corporate', color: 'from-blue-600 to-indigo-700', textColor: 'text-white' }
        ]
        return staticTemplates.map(t => {
            const backendT = backendTemplates.find(bt => bt.templateId === t.id)
            return { ...t, thumbnail: backendT?.thumbnail || null }
        })
    }, [backendTemplates])

    const cvExamples = [
        '/images/resume474544.png',
        '/images/resume689896.png',
        '/images/resume656564.png',
        '/images/resume565656.png',
        '/images/resume457874.png',
        '/images/resume65677.png'
    ]

    const heroRibbonClasses = isDayMode
        ? 'bg-white/80 border border-sky-200 text-sky-600 shadow-sm'
        : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'

    const trustPillClasses = isDayMode
        ? 'bg-white/90 border border-slate-200 text-slate-600 shadow-sm'
        : 'bg-white/5 border border-white/10 text-gray-400'

    const featureGradient = isDayMode
        ? 'bg-gradient-to-b from-white via-sky-50 to-amber-50/40'
        : 'bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent'

    return (
        <div className={`min-h-screen relative overflow-hidden home-page ${isDayMode ? 'home-day' : 'home-night'}`}>
            {!isDayMode && (
                <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            )}
            {isDayMode && <DaytimeBackdrop />}
            <ParticleBackground isDayMode={isDayMode} />
            <CursorGlow isDayMode={isDayMode} />
            <StickyProgressBar isDayMode={isDayMode} />
            <LiveProofNotification isDayMode={isDayMode} />
            <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />

            {/* Floating CTA Button - Hidden on mobile, shown on desktop */}
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 animate-float hidden md:block">
                <Link
                    to="/editor"
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 btn-premium rounded-full shadow-[0_25px_80px_-35px_rgba(34,211,238,0.95)] hover:scale-105 transition-transform"
                >
                    <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden md:inline">Hemen Başla</span>
                </Link>
            </div>

            {/* Hero Section */}
            <AnimatedSection className="pt-20 md:pt-28 pb-8 md:pb-16 px-4 md:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
                        {/* Left - Text Content */}
                        <div>
                            <div className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 ${heroRibbonClasses}`}>
                                <Sparkles className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                                <span className={`text-xs md:text-sm ${isDayMode ? 'text-sky-600' : 'text-cyan-300'}`}>Türkiye'nin #1 CV Oluşturucu</span>
                            </div>

                            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}>{content.hero.title} </span>
                                <span className="gradient-text">{content.hero.titleHighlight}</span>
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}> {content.hero.titleEnd}</span>
                            </h1>
                            <p className="text-base md:text-xl text-gray-500 mb-6 md:mb-8 leading-relaxed">
                                {content.hero.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8">
                                <Link to="/editor" className="btn-premium text-base md:text-lg px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2 group">
                                    {content.hero.ctaPrimary}
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => setVideoModalOpen(true)}
                                    className="btn-secondary px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2 group"
                                >
                                    {content.hero.ctaSecondary}
                                    <Play className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            {/* Trust Badges - Compact on mobile */}
                            <div className={`flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-sm ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                                <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full ${trustPillClasses}`}>
                                    <Shield className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? 'text-emerald-500' : 'text-green-400'}`} />
                                    <span>Ücretsiz</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full ${trustPillClasses}`}>
                                    <CheckCircle className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                                    <span>Kart Gerekmez</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full ${trustPillClasses}`}>
                                    <Award className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? 'text-amber-500' : 'text-amber-400'}`} />
                                    <span>7 Gün İade</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Image - Hidden on mobile for cleaner look */}
                        <div className="relative hidden md:block">
                            <div className="relative z-10">
                                <img
                                    src="/images/1415454.png"
                                    alt="CV Builder"
                                    className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                                />
                            </div>
                            {/* Floating Stats - Desktop only */}
                            <div className="absolute -bottom-6 -left-6 glass-card rounded-xl p-3 z-20 animate-float hidden lg:block">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center ring-2 ring-white/20">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">100K+</div>
                                        <div className="text-xs text-gray-400">CV Oluşturuldu</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 glass-card rounded-xl p-3 z-20 animate-float-delayed hidden lg:block">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500"></div>
                                        <div className="w-6 h-6 rounded-full bg-cyan-300"></div>
                                        <div className="w-6 h-6 rounded-full bg-slate-300"></div>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                                    </div>
                                </div>
                            </div>
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-slate-200/10 rounded-2xl blur-3xl -z-10"></div>
                        </div>
                    </div>

                    {/* Gradient Wave at bottom of hero */}
                    <GradientWave isDayMode={isDayMode} />

                    {/* How It Works - Mini Steps - Horizontal scroll on mobile */}
                    <div className="mt-8 md:mt-20">
                        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            {content.steps?.map((step, i) => (
                                <div key={i} className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 group relative flex-shrink-0 w-[200px] md:w-auto">
                                    <div className="text-2xl md:text-4xl font-extrabold text-white/10 absolute top-2 md:top-4 right-3 md:right-6">{String(i + 1).padStart(2, '0')}</div>
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-300 to-slate-200 flex items-center justify-center mx-auto mb-2 md:mb-4 ring-1 ring-white/10 text-slate-950">
                                        {step.icon === 'FileText' && <FileText className="w-5 h-5 md:w-8 md:h-8" />}
                                        {step.icon === 'Zap' && <Zap className="w-5 h-5 md:w-8 md:h-8" />}
                                        {step.icon === 'Download' && <Download className="w-5 h-5 md:w-8 md:h-8" />}
                                        {!['FileText', 'Zap', 'Download'].includes(step.icon) && <Sparkles className="w-5 h-5 md:w-8 md:h-8" />}
                                    </div>
                                    <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">{step.title}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm line-clamp-2">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Stats Section with Animated Counter */}
            <AnimatedSection className={`py-8 md:py-12 px-4 md:px-6 ${isDayMode ? '' : 'border-y border-white/10'}`}>
                <div className={`max-w-6xl mx-auto ${isDayMode ? 'bg-white/80 border border-slate-200/70 rounded-2xl md:rounded-[32px] p-6 md:p-10 shadow-day backdrop-blur-lg' : ''}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {content.stats?.map((stat, i) => (
                            <InteractiveStatCard
                                key={i}
                                value={stat.value}
                                suffix={stat.suffix}
                                label={stat.label}
                                detail={stat.detail || `${stat.label} hakkında daha fazla bilgi`}
                            />
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* AI Experience Section */}
            <AnimatedSection className={`py-12 md:py-20 px-4 md:px-6 ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50/70 to-white' : ''}`}>
                <div className={`max-w-6xl mx-auto ${isDayMode ? 'rounded-2xl md:rounded-[32px] border border-slate-200/70 p-4 md:p-10 shadow-day bg-white/90 backdrop-blur-lg' : ''}`}>
                    <AIDemo />
                </div>
            </AnimatedSection>

            {/* Video Demo Section */}
            <AnimatedSection className={`py-12 md:py-20 px-4 md:px-6 ${isDayMode ? 'bg-gradient-to-b from-sky-50 via-white to-sky-50/60' : ''}`}>
                <div className="max-w-6xl mx-auto">
                    <div className={`glass-card rounded-2xl md:rounded-3xl p-6 md:p-12 text-center relative overflow-hidden ${isDayMode ? 'bg-white/95 border border-slate-200/60 shadow-day' : ''}`}>
                        <div className={`absolute inset-0 ${isDayMode ? 'bg-gradient-to-br from-white/60 via-sky-100/50 to-amber-50/50' : 'bg-gradient-to-br from-cyan-500/10 to-slate-200/10'}`}></div>
                        <div className={`absolute top-10 left-10 w-24 md:w-32 h-24 md:h-32 rounded-full blur-3xl ${isDayMode ? 'bg-sky-200/50' : 'bg-cyan-500/25'}`}></div>
                        <div className={`absolute bottom-10 right-10 w-24 md:w-32 h-24 md:h-32 rounded-full blur-3xl ${isDayMode ? 'bg-amber-100/60' : 'bg-slate-200/20'}`}></div>

                        <div className="relative z-10">
                            <Video className={`w-10 h-10 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                                <span className="gradient-text">Nasıl Çalışıyor?</span>
                            </h2>
                            <p className="text-gray-400 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">
                                2 dakikalık demo video ile CVniz'nin gücünü keşfet
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                <button
                                    onClick={() => setVideoModalOpen(true)}
                                    className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2 group"
                                >
                                    <Play className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" /> Demo Videoyu İzle
                                </button>
                                <Link to="/editor" className="btn-secondary px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2">
                                    <Zap className="w-4 h-4 md:w-5 md:h-5" /> Hemen Dene
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* 🚀 ANIMATED WEB CV SECTION */}
            <AnimatedSection className={`py-12 md:py-24 px-4 md:px-6 relative overflow-hidden ${isDayMode ? 'bg-gradient-to-r from-sky-50 via-white to-amber-50/60' : ''}`}>
                {/* Background Effects */}
                <div className={`absolute inset-0 ${isDayMode ? 'bg-gradient-to-r from-sky-100 via-white to-amber-50/60' : 'bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5'}`}></div>
                <div className={`absolute top-20 left-1/4 w-48 md:w-72 h-48 md:h-72 rounded-full blur-[120px] ${isDayMode ? 'bg-sky-200/60' : 'bg-cyan-500/20'}`}></div>
                <div className={`absolute bottom-20 right-1/4 w-48 md:w-72 h-48 md:h-72 rounded-full blur-[120px] ${isDayMode ? 'bg-amber-100/70' : 'bg-purple-500/20'}`}></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-16">
                        <div className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 ${isDayMode ? 'bg-white border border-slate-200 text-sky-600 shadow-sm' : 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'}`}>
                            <Sparkles className={`w-3 h-3 md:w-5 md:h-5 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                            <span className={`text-xs md:text-sm font-bold ${isDayMode ? 'text-sky-600' : 'text-cyan-300'}`}>YENİ ÖZELLİK</span>
                            <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${isDayMode ? 'bg-gradient-to-r from-sky-400 to-amber-300 text-slate-900' : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'}`}>BETA</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">
                            <span className="gradient-text">Animated Web CV</span>
                        </h2>
                        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
                            CV'nizi canlı bir web sitesine dönüştürün
                        </p>
                    </div>

                    {/* Feature Grid - Horizontal scroll on mobile */}
                    <div className="mb-8 md:mb-12 -mx-4 md:mx-0">
                        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
                            {[
                                { icon: <Globe2 className="w-5 h-5 md:w-8 md:h-8" />, title: 'Kendi URL', desc: 'CVniz.com/senin-ismin' },
                                { icon: <Sparkles className="w-5 h-5 md:w-8 md:h-8" />, title: '30+ Şablon', desc: 'Minimal, Dark, Glass' },
                                { icon: <Zap className="w-5 h-5 md:w-8 md:h-8" />, title: 'Animasyonlar', desc: 'Scroll, Hover, Parallax' }
                            ].map((feature, i) => (
                                <div key={i} className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-transform duration-300 group flex-shrink-0 w-[180px] md:w-auto">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-2 md:mb-4 text-white group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-xs md:text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Template Preview Cards - Horizontal scroll on mobile */}
                    <div className="mb-8 md:mb-12 -mx-4 md:mx-0">
                        <div className="flex md:grid md:grid-cols-6 gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
                            {webTemplates.map((template, i) => (
                                <div
                                    key={i}
                                    className="aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-lg md:shadow-xl relative flex-shrink-0 w-28 md:w-auto"
                                    style={{ background: template.thumbnail ? 'transparent' : undefined }}
                                >
                                    {template.thumbnail ? (
                                        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${template.color} p-2 md:p-4 flex flex-col justify-end`}>
                                            <span className={`text-[10px] md:text-sm font-bold ${template.textColor}`}>{template.name}</span>
                                        </div>
                                    )}
                                    {template.thumbnail && (
                                        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/80 to-transparent">
                                            <span className="text-[10px] md:text-sm font-bold text-white">{template.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:scale-105 transition-transform shadow-2xl shadow-cyan-500/30"
                        >
                            <Globe2 className="w-4 h-4 md:w-6 md:h-6" />
                            Web CV Oluştur
                            <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                        </Link>
                        <p className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4">
                            Ücretsiz şablonlarla başlayın
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            {/* CV Examples Section */}
            <AnimatedSection className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="gradient-text">200+ Profesyonel Şablon</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Her sektör ve kariyer seviyesi için özel tasarlanmış premium şablonlar
                        </p>
                    </div>

                    {/* Interactive Template Slider */}
                    <div className="relative">
                        <div className="flex overflow-x-auto gap-8 pb-8 scrollbar-hide px-4">
                            {cvExamples.map((img, i) => (
                                <TiltCard key={i} className="flex-shrink-0 w-72">
                                    <Link
                                        to="/templates"
                                        className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-white/5 block border border-white/10 hover:border-cyan-500/50 transition-all shadow-2xl"
                                    >
                                        <img
                                            src={img}
                                            alt={`CV Template ${i + 1}`}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="text-white font-bold text-xl mb-2">Modern Pro</div>
                                                <span className="btn-premium py-2 text-sm flex items-center justify-center gap-2">
                                                    Hemen Kullan <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                        {i < 3 && (
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                                                ÜCRETSİZ
                                            </div>
                                        )}
                                    </Link>
                                </TiltCard>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/templates" className="btn-premium inline-flex items-center gap-2">
                            Tüm Şablonları Gör <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </AnimatedSection>

            {/* Company Logo Carousel */}
            <AnimatedSection className={`py-12 ${isDayMode ? 'bg-white border-y border-slate-200/70' : 'border-y border-white/10'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-gray-500 text-sm mb-6">Kullanıcılarımız bu şirketlerde çalışıyor</p>
                    <LogoCarousel isDayMode={isDayMode} />
                </div>
            </AnimatedSection>

            {/* Features Section */}
            <AnimatedSection className={`py-20 px-6 ${featureGradient}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <img
                                src="/images/45454545.png"
                                alt="CV Editor"
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Neden <span className="gradient-text">CVniz?</span>
                            </h2>
                            <div className="space-y-4">
                                {content.features?.map((feature, i) => (
                                    <AnimatedSection key={i} delay={i * 100} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center flex-shrink-0 ring-1 ring-white/10 text-slate-900 group-hover:scale-110 transition-transform">
                                            {/* Static icons for now, but could be dynamic if we store icon names */}
                                            {i === 0 && <Sparkles className="w-6 h-6" />}
                                            {i === 1 && <FileText className="w-6 h-6" />}
                                            {i === 2 && <Download className="w-6 h-6" />}
                                            {i === 3 && <Clock className="w-6 h-6" />}
                                            {i > 3 && <Zap className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </AnimatedSection>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Testimonials Carousel Section */}
            <AnimatedSection className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Kullanıcılarımız <span className="gradient-text">Ne Diyor?</span>
                        </h2>
                        <p className="text-gray-400">Binlerce profesyonelden aldığımız geribildirimler</p>
                    </div>
                    <TestimonialCarousel />
                </div>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection className={`py-20 px-6 ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50 to-transparent' : 'bg-gradient-to-b from-cyan-950/10 to-transparent'}`}>
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="gradient-text">Sık Sorulan Sorular</span>
                        </h2>
                        <p className="text-gray-400">Merak ettiklerinizin cevapları</p>
                    </div>
                    <FAQAccordion />
                </div>
            </AnimatedSection>

            {/* Feature Comparison Table */}
            <AnimatedSection className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="gradient-text">Plana Göre Karşılaştırma</span>
                        </h2>
                    </div>

                    <div className="glass-card rounded-3xl p-8 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 font-semibold">Özellik</th>
                                    <th className="text-center py-4 px-4 font-semibold"><span className="text-sm">Ücretsiz</span></th>
                                    <th className="text-center py-4 px-4 font-semibold text-cyan-300"><span className="text-sm">Pro</span></th>
                                    <th className="text-center py-4 px-4 font-semibold text-cyan-300"><span className="text-sm">Kurumsal</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'Temel Şablonlar', free: true, pro: true, enterprise: true },
                                    { feature: 'Premium Şablonlar (200+)', free: false, pro: true, enterprise: true },
                                    { feature: 'AI İçerik Önerisi', free: false, pro: true, enterprise: true },
                                    { feature: 'Sınırsız İndirme', free: false, pro: true, enterprise: true },
                                    { feature: 'Öncelikli Destek', free: false, pro: false, enterprise: true },
                                    { feature: 'API Erişimi', free: false, pro: false, enterprise: true }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-gray-300">{row.feature}</td>
                                        <td className="text-center py-4 px-4">{row.free ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <span className="text-gray-500">✕</span>}</td>
                                        <td className="text-center py-4 px-4">{row.pro ? <Check className="w-5 h-5 text-cyan-300 mx-auto" /> : <span className="text-gray-500">✕</span>}</td>
                                        <td className="text-center py-4 px-4">{row.enterprise ? <Check className="w-5 h-5 text-cyan-300 mx-auto" /> : <span className="text-gray-500">✕</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimatedSection>

            {/* CTA Section */}
            <AnimatedSection className={`py-20 px-6 ${isDayMode ? 'bg-gradient-to-b from-white via-amber-50/80 to-white' : ''}`}>
                <div className="max-w-4xl mx-auto">
                    <div
                        className={`glass-card rounded-3xl p-12 relative overflow-hidden ${isDayMode ? 'border border-slate-200/60 shadow-day' : ''}`}
                        style={isDayMode ? { backgroundColor: 'rgba(255, 255, 255, 0.95)' } : {}}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 opacity-10">
                            <img src="/images/455645454.png" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className={`absolute inset-0 ${isDayMode ? 'bg-gradient-to-br from-sky-50/80 via-white to-amber-50/60' : 'bg-gradient-to-br from-cyan-500/20 to-slate-200/10'}`}></div>

                        {/* Urgency Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg animate-pulse">
                                <Timer className="w-4 h-4" />
                                Sınırlı Süre: Ücretsiz Premium Şablon!
                            </div>
                        </div>

                        <div className="relative z-10 text-center">
                            <Award className={`w-16 h-16 mx-auto mb-6 ${isDayMode ? 'text-amber-500' : 'text-cyan-400'}`} />
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Kariyerinize <span className="gradient-text">Bugün Başlayın</span>
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                100.000+ profesyonele katılın ve hayalinizdeki işe giden yolda ilk adımı atın.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/editor" className="btn-premium text-lg px-10 py-4 flex items-center gap-2 group">
                                    <Crown className="w-5 h-5" /> Ücretsiz CV Oluştur
                                </Link>
                                <Link to="/pricing" className="btn-secondary px-10 py-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Premium Özellikler
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Trust Section */}
            <AnimatedSection className={`py-12 px-6 ${isDayMode ? 'border-t border-slate-200/70 bg-gradient-to-b from-white via-sky-50/60 to-white' : 'border-t border-white/10'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold mb-4">Güvenilir Platform</h3>
                        <div className={`flex items-center justify-center gap-4 text-sm flex-wrap ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-cyan-300" />
                                <span>127 Aktif Kullanıcı</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span>%95 Memnuniyet</span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-wrap justify-center gap-6 md:gap-8 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                        {[
                            { icon: <Shield className="w-5 h-5 text-cyan-300" />, text: 'SSL Güvenlik' },
                            { icon: <Clock className="w-5 h-5 text-cyan-400" />, text: '7/24 Erişim' },
                            { icon: <Users className="w-5 h-5 text-slate-200" />, text: '100K+ Kullanıcı' },
                            { icon: <Award className="w-5 h-5 text-yellow-400" />, text: '%95 Memnuniyet' },
                            { icon: <CheckCircle className="w-5 h-5 text-green-400" />, text: '300 DPI PDF' },
                            { icon: <Zap className="w-5 h-5 text-purple-400" />, text: 'AI Destekli' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>
        </div>
    )
}

