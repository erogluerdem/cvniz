import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSiteContent } from '../context/SiteContentContext'
import React, { useState, useEffect, useRef, useMemo } from 'react'
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
import VideoPlayerModal from '../components/VideoPlayerModal'

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
function InteractiveStatCard({ value, suffix, label, detail, icon: Icon, isDayMode }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="text-center relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                <div className={`text-3xl md:text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-600' : 'from-cyan-400 to-purple-500'}`}>
                    <AnimatedCounter end={parseInt(value)} />
                    {suffix}
                </div>
                <div className={`text-sm md:text-base font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{label}</div>
            </div>
            {isHovered && detail && (
                <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2 text-sm whitespace-nowrap z-20 animate-fade-in shadow-xl ${isDayMode ? 'bg-white border border-slate-200 text-slate-700' : 'glass-card text-cyan-300 shimmer-glass'}`}>
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

    return <span ref={countRef}>{count.toLocaleString('tr-TR')}</span>
}

// FAQ Accordion Component
const FAQAccordion = ({ isDayMode }) => {
    const { content } = useSiteContent()
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <div className="space-y-4 md:space-y-5 stagger-animate">
            {content.faqs?.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                <div
                    key={index}
                    className={`rounded-2xl md:rounded-[1.5rem] overflow-hidden transition-all duration-500 cursor-pointer ${isDayMode ? `bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md border ${isOpen ? 'border-purple-400 shadow-[0_10px_30px_rgba(168,85,247,0.15)]' : 'border-slate-200/60 hover:border-purple-300'}` : `glass-card border hover:border-cyan-500/50 ${isOpen ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-cyan-950/20' : 'border-white/5'}`}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                    <button
                        className="w-full px-6 py-5 md:py-6 flex items-center justify-between text-left group"
                    >
                        <span className={`font-bold text-base md:text-lg transition-colors duration-300 pr-4 ${isDayMode ? (isOpen ? 'text-purple-700' : 'text-slate-800 group-hover:text-purple-600') : (isOpen ? 'text-cyan-300' : 'text-white group-hover:text-cyan-400')}`}>
                            {faq.question}
                        </span>
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} ${isDayMode ? (isOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 group-hover:bg-purple-50 group-hover:text-purple-500') : (isOpen ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-cyan-500 group-hover:bg-white/10')}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </button>
                    <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className={`px-6 pb-5 md:pb-6 text-sm md:text-base leading-relaxed ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                </div>
            )})}
        </div>
    )
}

// Infinite Logo Carousel
function LogoCarousel({ isDayMode = false }) {
    const logos = [
        { name: 'Amazon', src: '/images/logo/Amazon_2024.svg.png' },
        { name: 'Ford Otosan', src: '/images/logo/Ford_Otosan_logo.svg.png' },
        { name: 'Hepsiburada', src: '/images/logo/Hepsiburada_logo_official.svg.png' },
        { name: 'Koç Holding', src: '/images/logo/Koc-Holding-Logo.png' },
        { name: 'Microsoft', src: '/images/logo/Microsoft_logo_(2012).svg.png' },
        { name: 'Netflix', src: '/images/logo/Netflix_2015_logo.svg.png' },
        { name: 'Sabancı', src: '/images/logo/Sabancı_Holding_logo.svg.png' },
        { name: 'Tesla', src: '/images/logo/Tesla_Motors.svg.png' },
        { name: 'Trendyol', src: '/images/logo/Trendyol_logo.svg.png' },
        { name: 'Turkish Airlines', src: '/images/logo/Turkish_Airlines_logo_2019_compact.svg.png' },
        { name: 'Tüpraş', src: '/images/logo/Tüpraş_logo.svg.png' }
    ]

    return (
        <div className="relative overflow-hidden py-4">
            <div className={`absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none ${isDayMode ? 'bg-gradient-to-r from-white to-transparent' : 'bg-gradient-to-r from-slate-950 to-transparent'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 pointer-events-none ${isDayMode ? 'bg-gradient-to-l from-white to-transparent' : 'bg-gradient-to-l from-slate-950 to-transparent'}`} />
            <div className="flex animate-scroll-left group-hover:[animation-play-state:paused]">
                {[...logos, ...logos].map((logo, i) => (
                    <div
                        key={i}
                        className={`flex-shrink-0 mx-4 md:mx-6 px-5 py-3 rounded-xl border transition-all hover:scale-105 h-16 w-40 flex items-center justify-center ${isDayMode ? 'bg-white/95 border-slate-200/70 shadow-day' : 'bg-white/95 border-white/10 hover:border-cyan-500/50'}`}
                    >
                        <img
                            src={logo.src}
                            alt={logo.name}
                            className="h-8 w-auto object-contain max-w-[120px]"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

const TestimonialCarousel = ({ isDayMode }) => {
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
        <div className="relative max-w-4xl mx-auto px-4 md:px-6">
            <div className={`relative overflow-hidden rounded-3xl md:rounded-[3rem] shadow-2xl transition-colors duration-500 ${isDayMode ? 'bg-white/80 border border-slate-200/60 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl' : 'glass-card border border-white/10 shadow-cyan-900/20'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                <div className="relative aspect-[4/3] sm:aspect-[21/9] md:aspect-[21/8]">
                    {content.testimonials?.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 transition-all duration-700 ease-in-out ${activeIndex === index ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'}`}
                        >
                            <div className="text-center relative w-full">
                                <div className={`absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center blur-[2px] ${isDayMode ? 'bg-gradient-to-b from-sky-100/80 to-transparent text-sky-400' : 'bg-gradient-to-b from-cyan-500/10 to-transparent text-cyan-500/40'}`}>
                                    <Quote className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                                </div>
                                <p className={`relative z-10 text-xl md:text-3xl font-medium mb-8 md:mb-12 italic leading-relaxed ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center justify-center gap-4 md:gap-5">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${isDayMode ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/30' : 'bg-cyan-500 text-slate-950 shadow-cyan-500/30'}`}>
                                        {testimonial.name?.[0] || 'C'}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-black text-base md:text-lg ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{testimonial.name}</div>
                                        <div className={`text-sm md:text-base font-medium ${isDayMode ? 'text-sky-600' : 'text-cyan-400'}`}>{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-3 mt-8 md:mt-10">
                {content.testimonials?.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 rounded-full transition-all duration-500 ${activeIndex === index ? (isDayMode ? 'w-10 bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-500/40' : 'w-10 bg-cyan-500 shadow-lg shadow-cyan-500/40') : (isDayMode ? 'w-2.5 bg-slate-300 hover:bg-slate-400' : 'w-2.5 bg-white/20 hover:bg-white/40')}`}
                        aria-label={`Go to testimonial ${index + 1}`}
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
    const [showFAB, setShowFAB] = useState(false)
    const isDayMode = theme === 'day'

    useEffect(() => {
        const handleScroll = () => setShowFAB(window.scrollY > 500)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
            { id: 'minimal_web', name: 'Minimal', color: 'from-white to-gray-100', textColor: 'text-gray-900', fallbackThumbnail: '/images/web_minimal.png' },
            { id: 'dark_web', name: 'Dark', color: 'from-gray-900 to-black', textColor: 'text-cyan-400', fallbackThumbnail: '/images/web_dark.png' },
            { id: 'glass_web', name: 'Glass', color: 'from-purple-600 to-pink-600', textColor: 'text-white', fallbackThumbnail: '/images/web_glass.png' },
            { id: 'gradient_web', name: 'Gradient', color: 'from-orange-500 to-pink-600', textColor: 'text-white', fallbackThumbnail: '/images/web_gradient.png' },
            { id: 'creative_web', name: 'Creative', color: 'from-amber-100 to-orange-200', textColor: 'text-orange-700', fallbackThumbnail: '/images/web_creative.png' },
            { id: 'corporate_web', name: 'Corporate', color: 'from-blue-600 to-indigo-700', textColor: 'text-white', fallbackThumbnail: '/images/web_corporate.png' }
        ]
        return staticTemplates.map(t => {
            const backendT = backendTemplates.find(bt => bt.templateId === t.id)
            return { ...t, thumbnail: backendT?.thumbnail || t.fallbackThumbnail }
        })
    }, [backendTemplates])

    const cvExamples = [
        { img: '/images/web_minimal.png', name: 'Minimalist' },
        { img: '/images/web_dark.png', name: 'Dark Mode' },
        { img: '/images/web_glass.png', name: 'Glassmorphism' },
        { img: '/images/web_gradient.png', name: 'Gradient Flow' },
        { img: '/images/web_creative.png', name: 'Creative Studio' },
        { img: '/images/web_corporate.png', name: 'Corporate Elite' }
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
            <VideoPlayerModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />

            {/* Floating CTA Button - Hidden on mobile, shown on desktop */}
            <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 hero-float-card hidden md:block transition-all duration-500 ${showFAB ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <Link
                    to="/editor"
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 hero-cta-premium rounded-full shadow-[0_25px_80px_-35px_rgba(34,211,238,0.95)] hover:scale-105 transition-transform text-white font-semibold"
                >
                    <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden md:inline">Hemen Başla</span>
                </Link>
            </div>

            {/* Hero Section V2 - Cinematic */}
            <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center pt-20 md:pt-28 pb-16 md:pb-24 px-4 md:px-6 lg:px-12 overflow-hidden">
                {/* Animated Mesh Gradient Background */}
                <div className="hero-mesh-gradient" />

                {/* Glowing Orbs */}
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />
                <div className="hero-orb hero-orb-3" />

                {/* Content */}
                <div className="max-w-7xl mx-auto w-full relative z-10 hero-cinematic">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        {/* Left - Text Content */}
                        <div className="text-center md:text-left">
                            {/* Badge */}
                            <div className="hero-badge-v2 mb-6 md:mb-8 mx-auto md:mx-0 font-semibold text-[15px]">
                                <Sparkles className="w-4 h-4" />
                                <span>Türkiye'nin #1 CV Oluşturucu</span>
                            </div>

                            {/* Title */}
                            <h1 className="hero-title-v2 mb-6">
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}>
                                    Profesyonel CV&apos;nizi
                                </span>
                                <br />
                                <span className={`hero-title-gradient-v2 text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-600' : 'from-cyan-400 to-purple-400'}`} data-text="Dakikalar İçinde Oluşturun">
                                    Dakikalar İçinde Oluşturun
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className={`text-lg md:text-xl mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                                Yapay zeka destekli CV oluşturucu ile kariyer hedeflerinize ulaşın.
                                <span className={isDayMode ? 'text-sky-600' : 'text-cyan-400'}> 200+ profesyonel şablon</span>, anında PDF indirme.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start">
                                <Link to="/editor" className="hero-cta-v2">
                                    Ücretsiz Başla
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => setVideoModalOpen(true)}
                                    className={`inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full font-semibold transition-all border ${
                                        isDayMode
                                            ? 'bg-white/80 border-slate-200 text-slate-800 hover:bg-white hover:border-sky-300'
                                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDayMode ? 'bg-sky-100' : 'bg-cyan-500/20'}`}>
                                        <Play className={`w-5 h-5 ${isDayMode ? 'text-sky-600' : 'text-cyan-400'} ml-0.5`} />
                                    </div>
                                    Demo İzle
                                </button>
                            </div>

                            {/* Trust Pills */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="hero-trust-pill">
                                    <Shield className={`w-4 h-4 ${isDayMode ? 'text-cyan-600' : 'text-cyan-400'}`} />
                                    <span className={isDayMode ? 'text-slate-700 font-medium' : 'text-gray-300'}>Ücretsiz</span>
                                </div>
                                <div className="hero-trust-pill">
                                    <CheckCircle className={`w-4 h-4 ${isDayMode ? 'text-cyan-600' : 'text-cyan-400'}`} />
                                    <span className={isDayMode ? 'text-slate-700 font-medium' : 'text-gray-300'}>Kart Gerekmez</span>
                                </div>
                                <div className="hero-trust-pill">
                                    <Award className={`w-4 h-4 ${isDayMode ? 'text-cyan-600' : 'text-cyan-400'}`} />
                                    <span className={isDayMode ? 'text-slate-700 font-medium' : 'text-gray-300'}>7 Gün İade</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Image with 3D Effect */}
                        <div className="relative hidden md:block">
                            <div className="hero-image-3d relative">
                                <img
                                    src="/images/1415454.png"
                                    alt="CV Builder"
                                    className="w-full max-w-lg mx-auto"
                                />

                                {/* Floating Stats Card - Left */}
                                <div className="hero-stat-card hero-stat-card-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold hero-title-gradient-v2">100K+</div>
                                            <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>CV Oluşturuldu</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Rating Card - Right */}
                                <div className="hero-stat-card hero-stat-card-right transform -translate-y-8 translate-x-4 md:-translate-y-12 md:translate-x-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                                            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                            <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>4.9/5 Puan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gradient Wave at bottom of hero */}
            <GradientWave isDayMode={isDayMode} />

            {/* How It Works - Mini Steps */}
            <AnimatedSection className="py-12 md:py-20 px-4 md:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                            Nasıl Çalışır?
                        </h2>
                        <p className={`${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                            3 kolay adımda profesyonel CV&apos;nizi oluşturun
                        </p>
                    </div>
                    <div className="relative">
                        {/* Connecting Line (Hidden on Mobile) */}
                        <div className={`hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 -translate-y-1/2 border-t-2 border-dashed ${isDayMode ? 'border-sky-200' : 'border-white/10'}`} />
                        
                        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 stagger-animate relative z-10">
                            {content.steps?.map((step, i) => (
                                <div key={i} className={`rounded-[2rem] p-8 text-center hover:-translate-y-2 transition-all duration-300 group relative flex-shrink-0 w-[240px] md:w-auto ${isDayMode ? 'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]' : 'glass-card border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)]'}`}>
                                    <div className={`text-6xl font-black absolute -top-4 -right-2 opacity-50 ${isDayMode ? 'text-sky-50' : 'text-white/5'} group-hover:text-cyan-400/20 transition-colors pointer-events-none`}>{String(i + 1).padStart(2, '0')}</div>
                                    <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6 text-white shadow-[0_10px_20px_rgba(34,211,238,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                                        {step.icon === 'FileText' && <FileText className="w-10 h-10" />}
                                        {step.icon === 'Zap' && <Zap className="w-10 h-10" />}
                                        {step.icon === 'Download' && <Download className="w-10 h-10" />}
                                        {!['FileText', 'Zap', 'Download'].includes(step.icon) && <Sparkles className="w-10 h-10" />}
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{step.title}</h3>
                                    <p className={`text-sm md:text-base font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{step.description}</p>
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
                                isDayMode={isDayMode}
                            />
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* AI Experience Section */}
            <AnimatedSection className={`py-12 md:py-20 px-4 md:px-6 ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50/70 to-white' : ''}`}>
                <div className={`max-w-6xl mx-auto ${isDayMode ? 'rounded-2xl md:rounded-[32px] border border-slate-200/70 p-4 md:p-10 shadow-day bg-white/90 backdrop-blur-lg' : ''}`}>
                    <AIDemo isDayMode={isDayMode} />
                </div>
            </AnimatedSection>

            {/* Video Demo Section */}
            <AnimatedSection className={`py-12 md:py-20 px-4 md:px-6 ${isDayMode ? 'bg-gradient-to-b from-sky-50 via-white to-sky-50/60' : ''}`}>
                <div className="max-w-6xl mx-auto">
                    <div className={`glass-card rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden transition-colors duration-500 ${isDayMode ? 'bg-white/90 border border-slate-200/60 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl' : ''}`}>
                        <div className={`absolute inset-0 ${isDayMode ? 'bg-gradient-to-br from-white/80 via-sky-50/50 to-blue-50/50' : 'bg-gradient-to-br from-cyan-500/10 to-slate-200/10'}`}></div>
                        <div className={`absolute top-0 right-1/4 w-32 md:w-64 h-32 md:h-64 rounded-full blur-[80px] ${isDayMode ? 'bg-sky-300/30' : 'bg-cyan-500/20'}`}></div>
                        <div className={`absolute bottom-0 left-1/4 w-32 md:w-64 h-32 md:h-64 rounded-full blur-[80px] ${isDayMode ? 'bg-blue-300/20' : 'bg-purple-500/20'}`}></div>

                        <div className="relative z-10">
                            {/* Animated Video Icon Container */}
                            <div className="relative inline-flex items-center justify-center mb-8">
                                <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${isDayMode ? 'bg-sky-400/40' : 'bg-cyan-500/30'}`}></div>
                                <div className={`relative p-5 md:p-6 rounded-3xl flex items-center justify-center border shadow-2xl transition-transform hover:scale-110 cursor-pointer ${isDayMode ? 'bg-white border-sky-100/50 shadow-sky-200/50 text-sky-500' : 'bg-black/50 border-white/10 shadow-cyan-900/30 text-cyan-400'}`} onClick={() => setVideoModalOpen(true)}>
                                    <Video className="w-8 h-8 md:w-12 md:h-12" />
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4">
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>Nasıl Çalışıyor?</span>
                            </h2>
                            
                            <p className={`mb-8 md:mb-10 max-w-xl mx-auto text-base md:text-lg ${isDayMode ? 'text-slate-600 font-medium' : 'text-gray-400'}`}>
                                2 dakikalık demo video ile CVniz'in gücünü keşfedin ve profesyonel profilinizi nasıl hızla oluşturabileceğinizi görün.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => setVideoModalOpen(true)}
                                    className={`w-full sm:w-auto text-base md:text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-bold shadow-xl hover:-translate-y-1 group ${isDayMode ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/30 hover:shadow-sky-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40'}`}
                                >
                                    <div className="p-1 rounded-full bg-white/20 group-hover:scale-110 transition-transform">
                                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                    </div>
                                    Demo Videoyu İzle
                                </button>
                                
                                <Link to="/editor" className={`w-full sm:w-auto text-base md:text-lg px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-bold border hover:-translate-y-1 ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 shadow-sm' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}>
                                    <Zap className="w-5 h-5" /> Hemen Dene
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
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 md:mb-6">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>Animated Web CV</span>
                        </h2>
                        <p className={`text-base md:text-xl max-w-2xl mx-auto ${isDayMode ? 'text-slate-600 font-medium' : 'text-gray-400'}`}>
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
                                <div key={i} className={`rounded-[2rem] p-6 md:p-8 text-center hover:-translate-y-2 transition-all duration-300 group flex-shrink-0 w-[220px] md:w-auto relative overflow-hidden ${isDayMode ? 'bg-white/80 border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]' : 'glass-card border border-white/10 hover:border-white/20'}`}>
                                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[1.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 md:mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl ${isDayMode ? 'shadow-cyan-500/20' : 'shadow-cyan-500/40'}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className={`text-base md:text-xl font-bold mb-2 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{feature.title}</h3>
                                    <p className={`text-sm md:text-base ${isDayMode ? 'text-slate-500 font-medium' : 'text-gray-400'}`}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Template Preview Cards - Horizontal scroll on mobile */}
                    <div className="mb-8 md:mb-12 -mx-4 md:mx-0">
                        <div className="flex md:grid md:grid-cols-6 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide px-4 md:px-0">
                            {webTemplates.map((template, i) => (
                                <div key={i} className="flex flex-col items-center flex-shrink-0 w-32 md:w-auto group">
                                    <div
                                        className={`w-full aspect-[3/4] rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer hover:-translate-y-3 transition-all duration-500 shadow-lg relative group ${isDayMode ? 'border-[6px] border-white shadow-[0_20px_50px_rgba(15,23,42,0.1)] hover:shadow-[0_30px_60px_rgba(14,165,233,0.2)] bg-slate-100' : 'border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] bg-black/50'}`}
                                    >
                                        {/* Subtle glare effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                                        <img 
                                            src={template.thumbnail} 
                                            alt={template.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mt-4 md:mt-5 transition-colors tracking-wide ${isDayMode ? 'bg-white border border-slate-200 text-slate-700 shadow-sm' : 'bg-white/10 border border-white/10 text-white'}`}>
                                        {template.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-6 md:mt-8">
                        <Link
                            to="/dashboard"
                            className={`inline-flex items-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-base md:text-xl transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden ${isDayMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_15px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_25px_50px_rgba(14,165,233,0.4)]' : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50'}`}
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-1000 -skew-x-12 -translate-x-full"></div>
                            <Globe2 className="w-5 h-5 md:w-7 md:h-7" />
                            Web CV Oluştur
                            <ArrowRight className="w-5 h-5 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <p className={`text-xs md:text-sm mt-4 font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            Ücretsiz şablonlarla başlayın
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            {/* CV Examples Section */}
            <AnimatedSection className={`py-12 md:py-24 px-4 md:px-6 relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-amber-50/60 to-white' : ''}`}>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-extrabold mb-4 md:mb-6">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-purple-400 to-pink-500'}`}>200+ Profesyonel Şablon</span>
                        </h2>
                        <p className={`text-base md:text-xl max-w-2xl mx-auto font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                            Her sektör ve kariyer seviyesi için özel tasarlanmış premium şablonlar
                        </p>
                    </div>

                    {/* Interactive Template Slider */}
                    <div className="relative">
                        {/* Edge Gradients for smooth scrolling illusion */}
                        <div className={`absolute top-0 bottom-0 left-0 w-8 md:w-32 z-10 pointer-events-none bg-gradient-to-r ${isDayMode ? 'from-white to-transparent' : 'from-[#0B1120] to-transparent'}`}></div>
                        <div className={`absolute top-0 bottom-0 right-0 w-8 md:w-32 z-10 pointer-events-none bg-gradient-to-l ${isDayMode ? 'from-white to-transparent' : 'from-[#0B1120] to-transparent'}`}></div>
                        
                        <div className="flex overflow-x-auto gap-6 md:gap-10 pb-10 pt-4 scrollbar-hide px-8 md:px-16 snap-x snap-mandatory">
                            {cvExamples.map((item, i) => (
                                <TiltCard key={i} className="flex-shrink-0 w-64 md:w-80 snap-center">
                                    <Link
                                        to="/templates"
                                        className={`group relative overflow-hidden rounded-2xl md:rounded-[2rem] aspect-[3/4] block transition-all duration-500 shadow-xl md:shadow-2xl hover:-translate-y-4 ${isDayMode ? 'bg-white border-[8px] border-white shadow-[0_20px_50px_rgba(15,23,42,0.1)] hover:shadow-[0_30px_60px_rgba(168,85,247,0.2)]' : 'bg-black/50 border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                                        <img
                                            src={item.img || item}
                                            alt={item.name || `CV Template ${i + 1}`}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 md:p-8 z-20">
                                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="text-white font-black text-xl md:text-2xl mb-2">{item.name || 'Premium Şablon'}</div>
                                                <span className={`py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isDayMode ? 'bg-white text-slate-900 hover:bg-sky-50' : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30'}`}>
                                                    Hemen Kullan <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                        {i < 3 && (
                                            <div className={`absolute top-4 right-4 md:top-6 md:right-6 px-4 py-1.5 rounded-full text-xs font-black shadow-lg z-20 ${isDayMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'}`}>
                                                ÜCRETSİZ
                                            </div>
                                        )}
                                    </Link>
                                </TiltCard>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12 md:mt-16">
                        <Link to="/templates" className={`inline-flex items-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-base md:text-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl relative group overflow-hidden ${isDayMode ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50' : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50'}`}>
                            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-1000 -skew-x-12 -translate-x-full"></div>
                            <Sparkles className="w-5 h-5 md:w-7 md:h-7" />
                            Tüm Şablonları Gör
                            <ArrowRight className="w-5 h-5 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform" />
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
                    <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                        {/* Image Presentation */}
                        <div className="relative group">
                            <div className={`absolute -inset-4 md:-inset-6 rounded-[2.5rem] md:rounded-[3rem] blur-2xl transition-all duration-700 opacity-60 group-hover:opacity-100 ${isDayMode ? 'bg-gradient-to-r from-sky-300 to-blue-300' : 'bg-gradient-to-r from-cyan-500/50 to-purple-500/50'}`}></div>
                            <div className={`relative rounded-3xl md:rounded-[2.5rem] overflow-hidden p-6 md:p-10 transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02] shadow-2xl ${isDayMode ? 'bg-white border border-slate-200 shadow-sky-900/10' : 'bg-[#0B1120] border border-white/10'}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
                                <img
                                    src="/images/45454545.png"
                                    alt="CV Editor"
                                    className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
                                />
                            </div>
                        </div>

                        {/* Features Content */}
                        <div>
                            <h2 className="text-2xl md:text-4xl font-extrabold mb-8 md:mb-12">
                                Neden <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>CVniz?</span>
                            </h2>
                            <div className="space-y-3 md:space-y-4 stagger-animate">
                                {content.features?.map((feature, i) => (
                                    <AnimatedSection key={i} delay={i * 100} className={`flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${isDayMode ? 'hover:bg-white hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)] border border-transparent hover:border-slate-100' : 'hover:bg-white/5 hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] border border-transparent hover:border-white/5'}`}>
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${isDayMode ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/30' : 'bg-gradient-to-br from-cyan-400 to-purple-600 text-white shadow-cyan-500/20'}`}>
                                            {i === 0 && <Sparkles className="w-6 h-6 md:w-7 md:h-7" />}
                                            {i === 1 && <FileText className="w-6 h-6 md:w-7 md:h-7" />}
                                            {i === 2 && <Download className="w-6 h-6 md:w-7 md:h-7" />}
                                            {i === 3 && <Clock className="w-6 h-6 md:w-7 md:h-7" />}
                                            {i > 3 && <Zap className="w-6 h-6 md:w-7 md:h-7" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-black text-lg md:text-xl mb-1 md:mb-2 transition-colors ${isDayMode ? 'text-slate-800 group-hover:text-blue-700' : 'text-white group-hover:text-cyan-400'}`}>{feature.title}</h3>
                                            <p className={`text-sm md:text-base leading-relaxed ${isDayMode ? 'text-slate-500 font-medium' : 'text-gray-400'}`}>{feature.description}</p>
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
                        <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
                            Kullanıcılarımız <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-purple-400 to-pink-500'}`}>Ne Diyor?</span>
                        </h2>
                        <p className={`text-base md:text-xl font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Binlerce profesyonelden aldığımız geribildirimler</p>
                    </div>
                    <TestimonialCarousel isDayMode={isDayMode} />
                </div>
            </AnimatedSection>

            {/* Blog / Resources Section */}
            <AnimatedSection className={`py-24 px-6 ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 transition-all duration-300 hover:scale-105 ${isDayMode ? 'bg-white border border-slate-200 text-sky-600 shadow-sm hover:shadow-md' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
                            <FileText className={`w-4 h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                            <span className={`text-sm font-bold tracking-wide uppercase ${isDayMode ? 'text-sky-600' : 'text-cyan-300'}`}>Kariyer Rehberi</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-extrabold mb-6">
                            Faydalı <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-purple-400 to-pink-500'}`}>İçerikler</span>
                        </h2>
                        <p className={`max-w-2xl mx-auto text-base md:text-xl font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                            CV hazırlama, mülakat teknikleri ve kariyer gelişimi hakkında uzman tavsiyeleri ile her zaman bir adım önde olun.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Mükemmel CV Nasıl Yazılır?',
                                description: 'İşverenlerin dikkatini çeken bir CV hazırlamanın altın kurallarını keşfedin.',
                                category: 'CV Hazırlama',
                                readTime: '5 dk',
                                gradient: 'from-purple-500 to-pink-500',
                                icon: <FileText className="w-12 h-12 text-white" />
                            },
                            {
                                title: 'Mülakat Soruları ve Cevapları',
                                description: 'En sık sorulan mülakat sorularına nasıl profesyonelce cevap verilir?',
                                category: 'Mülakat',
                                readTime: '8 dk',
                                gradient: 'from-cyan-400 to-blue-600',
                                icon: <Zap className="w-12 h-12 text-white" />
                            },
                            {
                                title: '2026 İş Piyasası Trendleri',
                                description: 'Bu yıl en çok aranan yetenekler ve geleceğin kariyer fırsatları.',
                                category: 'Kariyer',
                                readTime: '6 dk',
                                gradient: 'from-emerald-400 to-teal-500',
                                icon: <Sparkles className="w-12 h-12 text-white" />
                            }
                        ].map((article, i) => (
                            <div key={i} className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 ${isDayMode ? 'bg-white border border-slate-100 shadow-[0_10px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]' : 'bg-slate-900 border border-white/10 hover:border-cyan-500/30'}`}>
                                {/* Gradient Thumbnail */}
                                <div className={`relative h-48 md:h-56 bg-gradient-to-br ${article.gradient} overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0"></div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] mix-blend-overlay"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-xl">
                                        {article.icon}
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${isDayMode ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white'}`}>
                                            {article.category}
                                        </span>
                                        <div className={`flex items-center gap-1.5 text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <Clock className="w-3.5 h-3.5" />
                                            {article.readTime} okuma
                                        </div>
                                    </div>
                                    <h3 className={`font-black text-xl mb-3 transition-colors duration-300 ${isDayMode ? 'text-slate-900 group-hover:text-purple-600' : 'text-white group-hover:text-cyan-400'}`}>
                                        {article.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                                        {article.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/blog" className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 group border-2 ${isDayMode ? 'border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 hover:shadow-lg hover:shadow-purple-500/20' : 'border-white/20 text-white hover:border-cyan-500 hover:text-cyan-400'}`}>
                            Tüm Yazıları Gör 
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Link>
                    </div>
                </div>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection className={`py-24 px-6 ${isDayMode ? 'bg-gradient-to-b from-white via-purple-50/30 to-transparent' : 'bg-gradient-to-b from-cyan-950/10 to-transparent'}`}>
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-4xl font-extrabold mb-6">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-cyan-400 to-purple-500'}`}>Sık Sorulan Sorular</span>
                        </h2>
                        <p className={`text-base md:text-xl font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Merak ettiklerinizin cevapları</p>
                    </div>
                    <FAQAccordion isDayMode={isDayMode} />
                </div>
            </AnimatedSection>

            {/* Feature Comparison Table */}
            <AnimatedSection className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-cyan-400 to-purple-500'}`}>Plana Göre Karşılaştırma</span>
                        </h2>
                        <p className={`text-base md:text-xl font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>İhtiyacınıza en uygun paketi seçin</p>
                    </div>

                    <div className={`rounded-3xl p-6 md:p-10 overflow-x-auto shadow-2xl transition-colors duration-500 ${isDayMode ? 'bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.06)]' : 'glass-card border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'}`}>
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className={`border-b ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                                    <th className={`text-left py-6 px-4 font-bold text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Özellik</th>
                                    <th className="text-center py-6 px-4 font-bold w-1/4">
                                        <span className={`text-base md:text-lg ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>Ücretsiz</span>
                                    </th>
                                    <th className={`text-center py-6 px-4 font-black w-1/4 rounded-t-2xl border-x border-t ${isDayMode ? 'bg-gradient-to-b from-purple-50 to-transparent border-purple-100 text-purple-600' : 'bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-300'}`}>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg md:text-xl">Pro</span>
                                            <span className={`text-[10px] uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full ${isDayMode ? 'bg-purple-200 text-purple-700' : 'bg-cyan-500/20 text-cyan-300'}`}>Önerilen</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-6 px-4 font-bold w-1/4">
                                        <span className={`text-base md:text-lg ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>Kurumsal</span>
                                    </th>
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
                                    <tr key={i} className={`border-b transition-colors duration-300 group ${isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}>
                                        <td className={`py-5 px-4 font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{row.feature}</td>
                                        <td className="text-center py-5 px-4">
                                            {row.free ? <Check className={`w-5 h-5 md:w-6 md:h-6 mx-auto ${isDayMode ? 'text-emerald-500' : 'text-green-400'}`} strokeWidth={3} /> : <X className={`w-5 h-5 mx-auto opacity-50 ${isDayMode ? 'text-slate-300' : 'text-gray-600'}`} strokeWidth={2} />}
                                        </td>
                                        <td className={`text-center py-5 px-4 border-x transition-colors duration-300 ${isDayMode ? 'border-purple-50 bg-purple-50/30 group-hover:bg-purple-50/80' : 'border-cyan-500/10 bg-cyan-950/20 group-hover:bg-cyan-900/30'}`}>
                                            {row.pro ? <Check className={`w-5 h-5 md:w-6 md:h-6 mx-auto ${isDayMode ? 'text-purple-600' : 'text-cyan-400'}`} strokeWidth={3} /> : <X className={`w-5 h-5 mx-auto opacity-50 ${isDayMode ? 'text-purple-300' : 'text-cyan-900'}`} strokeWidth={2} />}
                                        </td>
                                        <td className="text-center py-5 px-4">
                                            {row.enterprise ? <Check className={`w-5 h-5 md:w-6 md:h-6 mx-auto ${isDayMode ? 'text-blue-600' : 'text-cyan-300'}`} strokeWidth={3} /> : <X className={`w-5 h-5 mx-auto opacity-50 ${isDayMode ? 'text-slate-300' : 'text-gray-600'}`} strokeWidth={2} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/pricing" className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 group border-2 ${isDayMode ? 'border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 hover:shadow-lg hover:shadow-purple-500/20' : 'border-white/20 text-white hover:border-cyan-500 hover:text-cyan-400'}`}>
                            Tüm Fiyatlandırma Detayları 
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Link>
                    </div>
                </div>
            </AnimatedSection>

            {/* Newsletter Section */}
            <AnimatedSection className={`py-16 px-6 ${isDayMode ? 'bg-gradient-to-r from-sky-50 via-white to-amber-50/60' : 'bg-gradient-to-r from-cyan-950/20 via-slate-950 to-cyan-950/20'}`}>
                <div className="max-w-3xl mx-auto text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDayMode ? 'bg-white border border-slate-200 text-sky-600 shadow-sm' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
                        <Mail className={`w-4 h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                        <span className={`text-sm font-medium ${isDayMode ? 'text-sky-600' : 'text-cyan-300'}`}>Bültenimize Katılın</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        <span className="gradient-text">Kariyer İpuçları & Güncellemeler</span>
                    </h2>
                    <p className={`mb-8 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
                        CV hazırlama ipuçları, iş arama stratejileri ve yeni özellikler hakkında haftalık güncellemeler alın.
                    </p>
                    <form className={`relative flex items-center max-w-lg mx-auto p-1.5 rounded-2xl md:rounded-full transition-all duration-300 ${isDayMode ? 'bg-white border border-slate-200 focus-within:border-purple-400 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.15)] shadow-sm' : 'bg-white/5 border border-white/10 focus-within:border-cyan-500/50'}`} onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className={`flex-1 px-5 py-3.5 bg-transparent border-none focus:outline-none focus:ring-0 text-base ${isDayMode ? 'text-slate-800 placeholder-slate-400' : 'text-white placeholder-gray-500'}`}
                        />
                        <button
                            type="submit"
                            className={`px-8 py-3.5 rounded-xl md:rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${isDayMode ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105'}`}
                        >
                            Abone Ol <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className={`text-sm mt-5 font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Spam göndermeyiz. İstediğiniz zaman abonelikten çıkabilirsiniz.
                    </p>
                </div>
            </AnimatedSection>

            {/* CTA Section */}
            <AnimatedSection className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div
                        className={`rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl transition-all duration-500 ${isDayMode ? 'bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-[0_30px_60px_rgba(192,38,211,0.25)]' : 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900 border border-white/10 shadow-cyan-900/30'}`}
                    >
                        {/* Background Mesh/Patterns */}
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPC9zdmc+')]"></div>
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10 text-center flex flex-col items-center">
                            {/* Fixed Urgency Badge inside padding flow */}
                            <div className={`mb-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-lg animate-pulse ${isDayMode ? 'bg-white/20 text-white border border-white/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                                <Timer className="w-5 h-5" />
                                Sınırlı Süre: Ücretsiz Premium Şablon!
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                                Kariyerinize <span className={isDayMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-100' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300'}>Bugün Başlayın</span>
                            </h2>
                            <p className={`text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed ${isDayMode ? 'text-white/90' : 'text-gray-300'}`}>
                                100.000+ profesyonele katılın ve hayalinizdeki işe giden yolda ilk adımı atın.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
                                <Link to="/editor" className={`text-lg font-bold px-10 py-5 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 w-full sm:w-auto ${isDayMode ? 'bg-white text-purple-600 shadow-[0_15px_30px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.4)]' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_10px_30px_rgba(34,211,238,0.2)]'}`}>
                                    <Rocket className="w-6 h-6" /> Hemen Ücretsiz Başla
                                </Link>
                                <Link to="/pricing" className={`text-lg font-bold px-10 py-5 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto border-2 ${isDayMode ? 'border-white/40 text-white hover:bg-white/10 hover:border-white' : 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400'}`}>
                                    <Crown className="w-6 h-6" /> Premium Özellikler
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Trust Section */}
            <AnimatedSection className={`py-12 px-6 pb-24 ${isDayMode ? 'bg-white' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className={`glass-card rounded-[2rem] p-8 md:p-10 flex flex-col items-center gap-8 shadow-xl transition-all duration-500 ${isDayMode ? 'bg-slate-50/50 border border-slate-200/60 shadow-[0_10px_40px_rgba(15,23,42,0.04)]' : 'border border-white/5'}`}>
                        <div className="text-center shrink-0">
                            <h3 className={`text-xl md:text-2xl font-black mb-1 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Güvenilir Platform</h3>
                            <p className={`text-sm md:text-base font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Dünya standartlarında güvenlik</p>
                        </div>

                        <div className={`flex flex-wrap justify-center gap-4 md:gap-8 font-semibold text-sm md:text-base ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>
                            {[
                                { icon: <Shield className={`w-5 h-5 md:w-6 md:h-6 ${isDayMode ? 'text-sky-500' : 'text-cyan-300'}`} />, text: 'SSL Güvenlik' },
                                { icon: <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isDayMode ? 'text-blue-500' : 'text-cyan-400'}`} />, text: '7/24 Erişim' },
                                { icon: <Users className={`w-5 h-5 md:w-6 md:h-6 ${isDayMode ? 'text-indigo-500' : 'text-slate-200'}`} />, text: '100K+ Kullanıcı' },
                                { icon: <Award className={`w-5 h-5 md:w-6 md:h-6 ${isDayMode ? 'text-amber-500' : 'text-yellow-400'}`} />, text: '%95 Memnuniyet' },
                                { icon: <CheckCircle className={`w-5 h-5 md:w-6 md:h-6 ${isDayMode ? 'text-emerald-500' : 'text-green-400'}`} />, text: '300 DPI PDF' },
                                { icon: <Zap className={`w-5 h-5 md:w-6 md:h-6 ${isDayMode ? 'text-purple-500' : 'text-purple-400'}`} />, text: 'AI Destekli' }
                            ].map((item, i) => (
                                <div key={i} className={`flex items-center gap-2 md:gap-3 px-4 py-2 rounded-xl transition-colors ${isDayMode ? 'hover:bg-white/60' : 'hover:bg-white/5'}`}>
                                    {item.icon}
                                    <span className="whitespace-nowrap">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    )
}

