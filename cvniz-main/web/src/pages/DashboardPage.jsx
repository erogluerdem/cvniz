import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCV } from '../context/CVContext'
import { useAnalytics } from '../context/AnalyticsContext'
import { useJobBoard } from '../context/JobBoardContext'

// Dashboard Components (modular)
import {
    NotificationPanel,
    ProfileModal,
    OnboardingTour,
    AchievementBadge,
    CompareModal,
    formatTimeAgo,
    getTemplateEmoji,
    sampleNotifications,
    getAchievements
} from '../components/dashboard/DashboardComponents'

// Feature Components
import ReferralWidget from '../components/ReferralWidget'
import CoverLetterGenerator from '../components/CoverLetterGenerator'
import ATSReportModal from '../components/ATSReportModal'
import CVTranslator from '../components/CVTranslator'
import CVReviewRequest from '../components/CVReviewRequest'
import JobSearch from '../components/JobSearch'
import InterviewCoach from '../components/InterviewCoach'
import SalaryNegotiator from '../components/SalaryNegotiator'
import CareerPathVisualizer from '../components/CareerPathVisualizer'
import SkillsGapAnalyzer from '../components/SkillsGapAnalyzer'
import PortfolioBuilder from '../components/PortfolioBuilder'
import CVShare from '../components/CVShare'
import CVVoiceReader from '../components/CVVoiceReader'
import CSSEditorModal from '../components/CSSEditorModal'
import VideoCVModal from '../components/VideoCVModal'
import AnimatedCVModal from '../components/AnimatedCVModal'
import LayoutManagerModal from '../components/LayoutManagerModal'
import CareerTestModal from '../components/CareerTestModal'
import AnnouncementBanner from '../components/dashboard/AnnouncementBanner'
import NotificationBell from '../components/NotificationBell'

// New Premium Features
import TargetFitAI from '../components/TargetFitAI'
import LetterGenerator from '../components/LetterGenerator'
import ApplicationCRM from '../components/ApplicationCRM'
import AIHeadshot from '../components/AIHeadshot'
import InterviewCoachPro from '../components/InterviewCoachPro'
import SalaryBenchmark from '../components/SalaryBenchmark'
import AnalyticsModal from '../components/AnalyticsModal'

// Revenue Features
import SubscriptionManager from '../components/SubscriptionManager'
import GiftCardManager from '../components/GiftCardManager'
import AffiliateDashboard from '../components/AffiliateDashboard'
import UpsellModal from '../components/UpsellModal'

// AI Features
import AIProjectWriter from '../components/AIProjectWriter'
import AILinkedInOptimizer from '../components/AILinkedInOptimizer'
import AIEmailGenerator from '../components/AIEmailGenerator'
import AIReferenceLetter from '../components/AIReferenceLetter'

// Import Feature
import CVImporter from '../components/CVImporter'

import {
    FileText, Plus, Edit, Trash2, Copy, Download, LogOut, User, Crown,
    Clock, Settings, Bell, ChevronRight, Sparkles, TrendingUp,
    Zap, Star, Lightbulb, CheckCircle, LayoutGrid, List, Search,
    X, Share2, Link2, Eye, Award, Trophy, Target, Medal, Gift,
    Sun, Moon, HelpCircle, ArrowRight, ExternalLink, Mail, Lock,
    Camera, Check, AlertCircle, History, Columns, Play, PenTool, Globe2, Briefcase,
    DollarSign, BarChart3, Layout, Volume2, Palette, Video, Upload, ChevronDown
} from 'lucide-react'

// ============ MAIN COMPONENT ============

export default function DashboardPage() {
    const { user, logout, isPremium, saveProfile, getProfile, updateUser } = useAuth()
    const { cvs, deleteCV, duplicateCV, updateCV } = useCV()
    const { getCVViewStats } = useAnalytics() || {}
    const navigate = useNavigate()
    const { toast } = useToast()

    // States
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [greeting, setGreeting] = useState('Merhaba')
    const [showNotifications, setShowNotifications] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const userMenuRef = useRef(null)
    const [showShareModal, setShowShareModal] = useState(false)
    const [selectedCVForShare, setSelectedCVForShare] = useState(null)
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [onboardingStep, setOnboardingStep] = useState(0)
    const [showCompareModal, setShowCompareModal] = useState(false)
    const [showCoverLetterModal, setShowCoverLetterModal] = useState(false)
    const [showATSModal, setShowATSModal] = useState(false)
    const [selectedCVForATS, setSelectedCVForATS] = useState(null)
    const [showTranslatorModal, setShowTranslatorModal] = useState(false)
    const [selectedCVForTranslate, setSelectedCVForTranslate] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [selectedCVForReview, setSelectedCVForReview] = useState(null)
    const [showJobSearch, setShowJobSearch] = useState(false)
    const [showInterviewCoach, setShowInterviewCoach] = useState(false)
    const [showSalaryNegotiator, setShowSalaryNegotiator] = useState(false)
    const [showCareerPath, setShowCareerPath] = useState(false)
    const [showSkillsGap, setShowSkillsGap] = useState(false)
    const [showPortfolioBuilder, setShowPortfolioBuilder] = useState(false)
    const [showVoiceReader, setShowVoiceReader] = useState(false)
    const [selectedCVForVoice, setSelectedCVForVoice] = useState(null)
    const [showCSSEditor, setShowCSSEditor] = useState(false)
    const [selectedCVForCSS, setSelectedCVForCSS] = useState(null)
    const [showVideoCV, setShowVideoCV] = useState(false)
    const [showAnimatedCV, setShowAnimatedCV] = useState(false)
    const [showLayoutManager, setShowLayoutManager] = useState(false)
    const [selectedCVForDesign, setSelectedCVForDesign] = useState(null)
    const [showCareerTest, setShowCareerTest] = useState(false)
    const [activeToolTab, setActiveToolTab] = useState('quick')

    // New Feature States
    const [showTargetFit, setShowTargetFit] = useState(false)
    const [showLetterGenerator, setShowLetterGenerator] = useState(false)
    const [showApplicationCRM, setShowApplicationCRM] = useState(false)
    const [showAIHeadshot, setShowAIHeadshot] = useState(false)
    const [showInterviewCoachPro, setShowInterviewCoachPro] = useState(false)
    const [showSalaryBenchmark, setShowSalaryBenchmark] = useState(false)

    // Revenue Feature States
    const [showSubscriptionManager, setShowSubscriptionManager] = useState(false)
    const [showGiftCard, setShowGiftCard] = useState(false)
    const [showAffiliate, setShowAffiliate] = useState(false)
    const [showUpsell, setShowUpsell] = useState(false)
    const [upsellType, setUpsellType] = useState('download')

    // AI Feature States
    const [showProjectWriter, setShowProjectWriter] = useState(false)
    const [showLinkedInOptimizer, setShowLinkedInOptimizer] = useState(false)
    const [showEmailGenerator, setShowEmailGenerator] = useState(false)
    const [showReferenceLetter, setShowReferenceLetter] = useState(false)

    // CV Importer State
    const [showCVImporter, setShowCVImporter] = useState(false)

    // Analytics
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
    const [selectedCVForAnalytics, setSelectedCVForAnalytics] = useState(null)

    // Sample notifications
    const notifications = [
        { message: 'Yeni şablonlar eklendi! 🎉', time: '2 saat önce', type: 'info', icon: <Gift className="w-4 h-4 text-cyan-400" />, read: false },
        { message: 'CV\'niz başarıyla indirildi', time: '1 gün önce', type: 'success', icon: <Download className="w-4 h-4 text-green-400" />, read: true },
        { message: 'Pro üyeliğiniz 7 gün sonra bitiyor', time: '3 gün önce', type: 'warning', icon: <AlertCircle className="w-4 h-4 text-amber-400" />, read: true }
    ]

    // Sample activity
    const activities = [
        { action: 'CV düzenledi', cv: 'Modern CV', time: '2 saat önce', icon: <Edit className="w-4 h-4" /> },
        { action: 'PDF indirdi', cv: 'Kurumsal CV', time: '1 gün önce', icon: <Download className="w-4 h-4" /> },
        { action: 'Yeni CV oluşturdu', cv: 'Tech CV', time: '3 gün önce', icon: <Plus className="w-4 h-4" /> }
    ]

    // Sample achievements
    const achievements = [
        { id: 'first-cv', title: 'İlk CV', icon: <FileText className="w-5 h-5 text-white" />, unlocked: true, color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
        { id: 'pro-member', title: 'Pro Üye', icon: <Crown className="w-5 h-5 text-white" />, unlocked: isPremium, color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
        { id: 'five-cvs', title: '5 CV Master', icon: <Trophy className="w-5 h-5 text-white" />, unlocked: (cvs?.length || 0) >= 5, color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
        { id: 'downloader', title: 'İndirici', icon: <Download className="w-5 h-5 text-white" />, unlocked: true, color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
        { id: 'sharer', title: 'Paylaşımcı', icon: <Share2 className="w-5 h-5 text-white" />, unlocked: false, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' }
    ]

    // Download history
    const downloadHistory = [
        { name: 'Modern_CV.pdf', date: '25 Ara 2024', size: '245 KB' },
        { name: 'Kurumsal_CV.pdf', date: '24 Ara 2024', size: '312 KB' },
        { name: 'Tech_CV.pdf', date: '23 Ara 2024', size: '198 KB' }
    ]

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Günaydın')
        else if (hour < 18) setGreeting('İyi Günler')
        else setGreeting('İyi Akşamlar')

        // Check if first visit
        const hasSeenTour = localStorage.getItem('CVniz_tour_completed')
        if (!hasSeenTour) {
            setShowOnboarding(true)
        }

        // Load saved theme preference
        const savedTheme = localStorage.getItem('CVniz-home-theme') || localStorage.getItem('CVniz_theme')
        if (savedTheme === 'day' || savedTheme === 'light') {
            setDarkMode(false)
        } else if (savedTheme === 'night' || savedTheme === 'dark') {
            setDarkMode(true)
        }
    }, [])

    // Theme toggle effect
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('theme-day', !darkMode)
            document.documentElement.classList.toggle('theme-night', darkMode)
        }
        const nextTheme = darkMode ? 'night' : 'day'
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('CVniz-home-theme', nextTheme)
            window.localStorage.setItem('CVniz_theme', darkMode ? 'dark' : 'light')
            window.dispatchEvent(new CustomEvent('CVniz-theme-change', { detail: nextTheme }))
        }
    }, [darkMode])

    // Close user menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleDelete = (cvId) => {
        deleteCV(cvId)
        setDeleteConfirm(null)
    }

    const handleShare = (cv) => {
        setSelectedCVForShare(cv)
        setShowShareModal(true)
    }

    const handleCloseTour = () => {
        setShowOnboarding(false)
        localStorage.setItem('CVniz_tour_completed', 'true')
    }

    const formatTimeAgo = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 60) return `${minutes} dk önce`
        if (hours < 24) return `${hours} saat önce`
        return `${days} gün önce`
    }

    const filteredCVs = cvs?.filter(cv =>
        cv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.template?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    const getTemplateEmoji = (template) => {
        const emojis = {
            modern: '🎨', minimalist: '⚡', corporate: '🏢', creative: '🌈', tech: '💻',
            executive: '👔', elegant: '✨', healthcare: '🏥', academic: '📚', finance: '💰',
            legal: '⚖️', marketing: '📢', engineer: '⚙️', retail: '🛍️', hospitality: '🏨',
            government: '🏛️', freelancer: '💼', startup: '🚀', international: '🌍', portfolio: '🖼️',
            scientist: '🔬', artist: '🎨', teacher: '📖', chef: '👨‍🍳', photographer: '📷',
            musician: '🎵', athlet: '🏆', pilot: '✈️', construction: '🏗️', environment: '🌱',
            journalist: '📰', nurse: '💉', logistics: '🚚', security: '🛡️', architect: '🏛️',
            hr: '👥', datascience: '📊', gamer: '🎮', consultant: '💡', beauty: '💅'
        }
        return emojis[template] || '📄'
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Modals */}
            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={user}
                savedProfile={getProfile ? getProfile() : null}
                onSave={(profileData) => {
                    saveProfile && saveProfile(profileData)
                    updateUser({
                        name: profileData.fullName,
                        birthDate: profileData.birthDate
                    })
                }}
            />
            <CVShare isOpen={showShareModal} onClose={() => setShowShareModal(false)} cv={selectedCVForShare} />
            <OnboardingTour isOpen={showOnboarding} onClose={handleCloseTour} step={onboardingStep} setStep={setOnboardingStep} />
            <CompareModal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} cvs={cvs || []} />
            <CoverLetterGenerator
                isOpen={showCoverLetterModal}
                onClose={() => setShowCoverLetterModal(false)}
                onSuccess={() => setShowCoverLetterModal(false)}
            />
            <ATSReportModal
                isOpen={showATSModal}
                onClose={() => setShowATSModal(false)}
                cvData={selectedCVForATS?.data}
                cvName={selectedCVForATS?.name || 'CV'}
            />
            <CVTranslator
                isOpen={showTranslatorModal}
                onClose={() => setShowTranslatorModal(false)}
                cv={selectedCVForTranslate}
            />
            <CVVoiceReader
                isOpen={showVoiceReader}
                onClose={() => setShowVoiceReader(false)}
                cvData={selectedCVForVoice?.data}
            />
            <CSSEditorModal
                isOpen={showCSSEditor}
                onClose={() => setShowCSSEditor(false)}
                cv={selectedCVForCSS}
                onSave={async (id, css) => {
                    await updateCV(id, { customStyles: css })
                    setShowCSSEditor(false)
                }}
            />
            <VideoCVModal
                isOpen={showVideoCV}
                onClose={() => setShowVideoCV(false)}
                cv={selectedCVForDesign}
            />
            <AnimatedCVModal
                isOpen={showAnimatedCV}
                onClose={() => setShowAnimatedCV(false)}
                cv={selectedCVForDesign}
            />
            <LayoutManagerModal
                isOpen={showLayoutManager}
                onClose={() => setShowLayoutManager(false)}
                cv={selectedCVForDesign}
                onSave={async (id, layout) => {
                    await updateCV(id, { data: { ...selectedCVForDesign.data, layout } })
                    setShowLayoutManager(false)
                }}
            />
            <CareerTestModal
                isOpen={showCareerTest}
                onClose={() => setShowCareerTest(false)}
            />
            <AnalyticsModal
                isOpen={showAnalyticsModal}
                onClose={() => setShowAnalyticsModal(false)}
                cv={selectedCVForAnalytics}
            />

            {/* Header */}
            <header className="glass border-b border-white/10 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center ring-1 ring-white/10">
                            <FileText className="w-5 h-5 text-slate-900" />
                        </div>
                        <span className="text-xl font-bold gradient-text">CVniz</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            title={darkMode ? 'Açık Tema' : 'Koyu Tema'}
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-400" />}
                        </button>

                        {/* Help */}
                        <button
                            onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            title="Yardım"
                        >
                            <HelpCircle className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Notifications - Living CV */}
                        <NotificationBell />

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 hover:bg-white/5 rounded-xl p-2 transition-all border border-transparent hover:border-white/10"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center ring-2 ring-white/20 shadow-lg">
                                    <span className="text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <div className="hidden sm:block text-left leading-tight">
                                    <div className="text-sm font-semibold text-white">{user?.name || 'Kullanıcı'}</div>
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold uppercase tracking-widest">
                                        {isPremium ? (
                                            <>
                                                <Crown className="w-2.5 h-2.5 text-amber-400" />
                                                <span className="text-amber-400">Pro Üye</span>
                                            </>
                                        ) : (
                                            <span>Ücretsiz Plan</span>
                                        )}
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-white/5 mb-2">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Giriş Yapılan Hesap</p>
                                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                setShowProfileModal(true)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-purple-400" />
                                            <span>Profil Ayarları</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                setShowSubscriptionManager(true)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <Crown className="w-4 h-4 text-amber-400" />
                                            <span>Abonelik Yönetimi</span>
                                        </button>

                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-cyan-400" />
                                                <span>Yönetici Paneli</span>
                                            </Link>
                                        )}

                                        <div className="my-2 border-t border-white/5"></div>

                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                handleLogout()
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Güvenli Çıkış</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Kullanıcı'}</span>! 👋
                        </h1>
                        <p className="text-gray-400">Kariyer yolculuğunda bugün ne yapmak istersin?</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowJobSearch(true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:bg-white/10 transition-colors flex items-center gap-2 text-blue-400"
                        >
                            <Briefcase className="w-4 h-4" /> İş Bul
                        </button>
                        <button
                            onClick={() => setShowCompareModal(true)}
                            className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <Columns className="w-4 h-4" /> Karşılaştır
                        </button>
                        <button
                            onClick={() => setShowCoverLetterModal(true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:bg-white/10 transition-colors flex items-center gap-2 text-cyan-400"
                        >
                            <PenTool className="w-4 h-4" /> Ön Yazı
                        </button>
                        <Link to="/editor" className="btn-premium flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Yeni CV
                        </Link>
                    </div>
                </div>

                <AnnouncementBanner />

                {/* Compact Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Toplam CV', value: cvs?.length || 0, color: 'text-cyan-400', icon: <FileText className="w-5 h-5" />, bg: 'bg-cyan-500/10' },
                        { label: 'Şablonlar', value: isPremium ? '65+' : '1', color: 'text-purple-400', icon: <LayoutGrid className="w-5 h-5" />, bg: 'bg-purple-500/10' },
                        { label: 'İndirme', value: downloadHistory.length, color: 'text-green-400', icon: <Download className="w-5 h-5" />, bg: 'bg-green-500/10' },
                        { label: 'Rozetler', value: `${achievements.filter(a => a.unlocked).length}/${achievements.length}`, color: 'text-amber-400', icon: <Trophy className="w-5 h-5" />, bg: 'bg-amber-500/10' }
                    ].map((stat, i) => (
                        <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-all group cursor-default">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area: CV List First */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* CV List Section */}
                        <div className="glass-card rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                            {/* Decorative Background for Section */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white italic flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-cyan-400" />
                                        ÖZGEÇMİŞLERİM
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Profesyonel döküman yönetimi</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-white/5 focus-within:border-cyan-500/50 transition-all">
                                        <Search className="w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Ara..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent border-none text-sm focus:outline-none w-32 placeholder-slate-600 font-medium"
                                        />
                                    </div>
                                    <div className="flex bg-black/20 rounded-xl p-1 border border-white/5">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {filteredCVs.length === 0 ? (
                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6">
                                        <FileText className="w-10 h-10 text-cyan-400 opacity-50" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 italic">Daha Fazlasını Hedefle 🎯</h3>
                                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Hayalindeki işe bir adım daha yaklaşmak için ilk CV'ni hemen oluştur.</p>
                                    <Link to="/editor" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-cyan-500/40 transition-all active:scale-95 inline-flex items-center gap-2">
                                        <Plus className="w-5 h-5" /> İLK CV'Nİ YARAT
                                    </Link>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                                    {filteredCVs.map((cv) => (
                                        <div
                                            key={cv.id}
                                            className="group relative bg-slate-900/40 rounded-3xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-slate-900/60 shadow-xl"
                                        >
                                            <div className="flex gap-5">
                                                {/* CV Miniature */}
                                                <div className="w-24 h-32 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex-shrink-0 relative overflow-hidden group-hover:border-cyan-500/30 transition-all">
                                                    <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-125 transition-transform duration-500">
                                                        {getTemplateEmoji(cv.template)}
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                        <Link to={`/editor/${cv.id}`} className="p-2 rounded-full bg-cyan-500 text-slate-950 shadow-xl">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-lg font-black text-white truncate group-hover:text-cyan-400 transition-colors italic">
                                                            {cv.name}
                                                        </h3>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => duplicateCV(cv.id)}
                                                                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                                                                title="Kopyala"
                                                            >
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(cv.id)}
                                                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                                                title="Sil"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                                                        {cv.template} ŞABLONU
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            to={`/editor/${cv.id}`}
                                                            className="flex-1 py-2 px-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                                                        >
                                                            <Edit className="w-3 h-3" /> DÜZENLE
                                                        </Link>
                                                        <button
                                                            onClick={() => handleShare(cv)}
                                                            className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Action Bar (Hidden by default, shown on hover/complex layout) */}
                                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                                        <Clock className="w-3 h-3" />
                                                        {formatTimeAgo(cv.updatedAt)}
                                                    </div>
                                                    {getCVViewStats && getCVViewStats(cv.id)?.total > 0 && (
                                                        <button
                                                            onClick={() => { setSelectedCVForAnalytics(cv); setShowAnalyticsModal(true); }}
                                                            className="flex items-center gap-1 text-[10px] font-bold text-cyan-500/80 bg-cyan-500/5 px-2 py-0.5 rounded-full hover:bg-cyan-500/20 transition-colors cursor-pointer"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            {getCVViewStats(cv.id).total} Görüntülenme
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setSelectedCVForATS(cv); setShowATSModal(true); }}
                                                        className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                                                        title="ATS Analiz"
                                                    >
                                                        <Target className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedCVForVoice(cv); setShowVoiceReader(true); }}
                                                        className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                                                        title="Sesli Oku"
                                                    >
                                                        <Volume2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Toolbox Section - Tabbed Interface */}
                        <div className="glass-card rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-white italic flex items-center gap-3">
                                        <Zap className="w-6 h-6 text-yellow-400" />
                                        ARAÇ SETİ
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Kariyerini güçlendirecek araçlar</p>
                                </div>

                                <div className="flex bg-black/40 rounded-2xl p-1.5 border border-white/5 self-start">
                                    {[
                                        { id: 'quick', label: 'Hızlı', icon: <Zap className="w-3.5 h-3.5" /> },
                                        { id: 'ai', label: 'AI Araçları', icon: <Sparkles className="w-3.5 h-3.5" /> },
                                        { id: 'design', label: 'Tasarım', icon: <Palette className="w-3.5 h-3.5" /> }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveToolTab(tab.id)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeToolTab === tab.id
                                                ? 'bg-white text-slate-950 shadow-lg'
                                                : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            {tab.icon} {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="animate-fade-in">
                                {activeToolTab === 'quick' && (
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {[
                                            { to: '/editor', label: 'Yeni CV', icon: <Plus />, color: 'from-cyan-500 to-blue-600' },
                                            { onClick: () => setShowCVImporter(true), label: 'CV Yükle', icon: <Upload />, color: 'from-emerald-500 to-green-600', badge: 'YENİ' },
                                            { to: '/templates', label: 'Şablonlar', icon: <LayoutGrid />, color: 'from-purple-500 to-pink-600' },
                                            { onClick: () => setShowCompareModal(true), label: 'Karşılaştır', icon: <Columns />, color: 'from-green-500 to-emerald-600' },
                                            { onClick: () => setShowCoverLetterModal(true), label: 'Ön Yazı', icon: <FileText />, color: 'from-amber-500 to-orange-600' }
                                        ].map((tool, i) => (
                                            tool.to ? (
                                                <Link key={i} to={tool.to} className="group p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] relative">
                                                    {tool.badge && (
                                                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[8px] font-black tracking-widest animate-pulse">
                                                            {tool.badge}
                                                        </div>
                                                    )}
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-lg`}>
                                                        {tool.icon}
                                                    </div>
                                                    <div className="text-xs font-black text-white uppercase tracking-widest">{tool.label}</div>
                                                </Link>
                                            ) : (
                                                <button key={i} onClick={tool.onClick} className="group p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] flex flex-col items-center text-center relative">
                                                    {tool.badge && (
                                                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[8px] font-black tracking-widest animate-pulse">
                                                            {tool.badge}
                                                        </div>
                                                    )}
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-lg`}>
                                                        {tool.icon}
                                                    </div>
                                                    <div className="text-xs font-black text-white uppercase tracking-widest">{tool.label}</div>
                                                </button>
                                            )
                                        ))}
                                    </div>
                                )}

                                {activeToolTab === 'ai' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {[
                                            { onClick: () => setShowProjectWriter(true), label: 'Proje Yazıcı', icon: <Sparkles />, color: 'from-purple-500 to-pink-600', desc: 'Proje açıklamalarını AI ile yaz', badge: 'YENİ' },
                                            { onClick: () => setShowLinkedInOptimizer(true), label: 'LinkedIn AI', icon: <Target />, color: 'from-blue-600 to-blue-400', desc: 'LinkedIn profilini optimize et', badge: 'YENİ' },
                                            { onClick: () => setShowEmailGenerator(true), label: 'E-posta AI', icon: <Mail />, color: 'from-emerald-500 to-teal-500', desc: 'Profesyonel başvuru e-postaları', badge: 'YENİ' },
                                            { onClick: () => setShowReferenceLetter(true), label: 'Referans Mektubu', icon: <FileText />, color: 'from-amber-500 to-orange-500', desc: 'AI ile referans mektubu oluştur', badge: 'YENİ' },
                                            { onClick: () => setShowTargetFit(true), label: 'Target-Fit AI', icon: <Target />, color: 'from-purple-500 to-pink-600', desc: 'CV\'yi ilana özel düzenle', badge: 'SICAK' },
                                            { onClick: () => setShowLetterGenerator(true), label: 'Mektup Yazıcı', icon: <Mail />, color: 'from-indigo-500 to-purple-600', desc: 'Niyet & Referans mektubu' },
                                            { onClick: () => setShowApplicationCRM(true), label: 'Başvuru Takip', icon: <Briefcase />, color: 'from-blue-500 to-cyan-600', desc: 'Trello tarzı iş takibi', badge: 'ÜCRETSİZ' },
                                            { onClick: () => setShowAIHeadshot(true), label: 'AI Headshot', icon: <Camera />, color: 'from-pink-500 to-rose-600', desc: 'Profesyonel fotoğraf + bio' },
                                            { onClick: () => setShowSalaryBenchmark(true), label: 'Maaş Değerin', icon: <DollarSign />, color: 'from-green-500 to-emerald-600', desc: 'Senin değerin ne?' },
                                            { onClick: () => setShowInterviewCoachPro(true), label: 'Mülakat Koçu Pro', icon: <Play />, color: 'from-orange-500 to-red-600', desc: 'CV\'ye göre soru üretimi', badge: 'SICAK' },
                                            { onClick: () => setShowInterviewCoach(true), label: 'Mülakat Provası', icon: <Play />, color: 'from-emerald-500 to-green-600', desc: 'AI ile mülakat provası yapın' },
                                            { onClick: () => setShowSalaryNegotiator(true), label: 'Maaş Pazarlığı', icon: <DollarSign />, color: 'from-green-500 to-emerald-600', desc: 'Maaşınızı AI ile optimize edin' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForReview(cvs[0]), setShowReviewModal(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'CV İnceleme', icon: <Star />, color: 'from-purple-500 to-pink-600', desc: 'Expert veya AI incelemesi (Ücretli)', badge: 'SICAK' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForATS(cvs[0]), setShowATSModal(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'ATS Analizi', icon: <Target />, color: 'from-cyan-500 to-blue-600', desc: 'ATS uyumluluğunu test edin' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForTranslate(cvs[0]), setShowTranslatorModal(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'Çevirmen', icon: <Globe2 />, color: 'from-indigo-500 to-purple-600', desc: 'CV\'nizi 50+ dile çevirin' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForVoice(cvs[0]), setShowVoiceReader(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'Sesli Okuyucu', icon: <Volume2 />, color: 'from-orange-500 to-red-600', desc: 'CV\'nizi sesli olarak dinleyin' },
                                            { onClick: () => setShowCareerPath(true), label: 'Yol Haritası', icon: <TrendingUp />, color: 'from-indigo-500 to-purple-600', desc: 'Kariyer adımlarınızı planlayın' },
                                            { onClick: () => setShowSkillsGap(true), label: 'Beceri Analizi', icon: <BarChart3 />, color: 'from-orange-500 to-red-600', desc: 'Eksik becerilerinizi bulun' },
                                            { onClick: () => setShowPortfolioBuilder(true), label: 'Portfolio', icon: <Layout />, color: 'from-pink-500 to-rose-600', desc: 'Web sitenize özel portfolyo' },
                                            { onClick: () => setShowCareerTest(true), label: 'Kariyer Testi', icon: <Target />, color: 'from-yellow-500 to-orange-600', desc: 'Sana en uygun mesleği bul' }
                                        ].map((tool, i) => (
                                            <button key={i} onClick={tool.onClick} className="group p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] flex flex-col items-center text-center relative overflow-hidden">
                                                {tool.badge && (
                                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[8px] font-black tracking-widest animate-pulse">
                                                        {tool.badge}
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-lg text-white`}>
                                                    {tool.icon}
                                                </div>
                                                <div className="text-xs font-black text-white uppercase tracking-widest mb-1">{tool.label}</div>
                                                <div className="text-[10px] text-slate-500 font-medium leading-tight">{tool.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {activeToolTab === 'design' && (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForCSS(cvs[0]), setShowCSSEditor(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'CSS Editörü', icon: <PenTool />, color: 'from-blue-500 to-indigo-600' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForDesign(cvs[0]), setShowLayoutManager(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'Sürükle-Bırak', icon: <LayoutGrid />, color: 'from-cyan-500 to-blue-600' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForDesign(cvs[0]), setShowVideoCV(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'Video CV', icon: <Video />, color: 'from-red-500 to-rose-600' },
                                            { onClick: () => cvs?.length > 0 ? (setSelectedCVForDesign(cvs[0]), setShowAnimatedCV(true)) : toast.warning('Önce CV oluşturmanız gerekiyor'), label: 'Animated CV', icon: <Zap />, color: 'from-purple-500 to-pink-600' }
                                        ].map((tool, i) => (
                                            <button key={i} onClick={tool.onClick} className="group p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] flex flex-col items-center text-center">
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-lg`}>
                                                    {tool.icon}
                                                </div>
                                                <div className="text-xs font-black text-white uppercase tracking-widest">{tool.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Social & Activity */}
                    <div className="space-y-8">
                        {/* Achievements Mini */}
                        <div className="glass-card rounded-[2rem] p-6 border border-white/5 shadow-xl">
                            <h3 className="text-sm font-black text-white italic mb-6 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                BAŞARI ROZETLERİ
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {achievements.map((badge) => (
                                    <div key={badge.id} className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${badge.unlocked ? badge.color + ' shadow-lg' : 'bg-white/5 grayscale opacity-30 cursor-help'}`} title={badge.title}>
                                        {badge.icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Mini */}
                        <div className="glass-card rounded-[2rem] p-6 border border-white/5 shadow-xl">
                            <h3 className="text-sm font-black text-white italic mb-6 flex items-center gap-2">
                                <History className="w-4 h-4 text-purple-400" />
                                SON AKTİVİTE
                            </h3>
                            <div className="space-y-4">
                                {activities.map((activity, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                            {activity.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-white uppercase truncate">{activity.cv}</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">{activity.action} • {activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Referral & Pro */}
                        <div className="space-y-4">
                            {!isPremium && (
                                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-600 shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
                                    <Crown className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:scale-125 transition-transform duration-700" />
                                    <h3 className="text-lg font-black text-slate-950 mb-1 italic">PRO ÜYELİĞE GEÇ!</h3>
                                    <p className="text-slate-950/70 text-[10px] font-bold uppercase tracking-wider mb-4">SINIRSIZ ŞABLON VE AI GÜCÜ</p>
                                    <Link to="/pricing" className="w-full py-3 rounded-xl bg-slate-950 text-white font-black text-xs uppercase tracking-widest text-center block hover:scale-[1.02] transition-all">
                                        ŞİMDİ YÜKSELT
                                    </Link>
                                </div>
                            )}

                            {/* Revenue Features */}
                            <div className="glass-card rounded-[2rem] p-5 border border-white/5">
                                <h3 className="text-sm font-black text-white italic mb-4 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    HESAP & KAZANÇ
                                </h3>
                                <div className="space-y-2">
                                    {isPremium && (
                                        <button
                                            onClick={() => setShowSubscriptionManager(true)}
                                            className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-3 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Settings className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-white">Abonelik Yönetimi</p>
                                                <p className="text-[9px] text-gray-500">Plan değiştir, dondur</p>
                                            </div>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowGiftCard(true)}
                                        className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/30 transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Gift className="w-4 h-4 text-pink-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-white">Hediye Kartı</p>
                                            <p className="text-[9px] text-gray-500">Premium hediye et</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setShowAffiliate(true)}
                                        className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <TrendingUp className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-white">Affiliate Program</p>
                                            <p className="text-[9px] text-gray-500">Paylaş ve kazan</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <ReferralWidget />
                        </div>
                    </div>
                </div>

            </main>

            {/* Delete Modal */}
            {
                deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="glass-card rounded-2xl p-6 max-w-sm w-full animate-scale-in">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-center">CV'yi Sil</h3>
                            <p className="text-gray-400 mb-6 text-center">Bu işlem geri alınamaz.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-colors"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* CV Review Modal */}
            <CVReviewRequest
                isOpen={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false)
                    setSelectedCVForReview(null)
                }}
                cv={selectedCVForReview}
            />

            <JobSearch
                isOpen={showJobSearch}
                onClose={() => setShowJobSearch(false)}
            />

            <InterviewCoach
                isOpen={showInterviewCoach}
                onClose={() => setShowInterviewCoach(false)}
            />

            <SalaryNegotiator
                isOpen={showSalaryNegotiator}
                onClose={() => setShowSalaryNegotiator(false)}
            />

            <CareerPathVisualizer
                isOpen={showCareerPath}
                onClose={() => setShowCareerPath(false)}
            />

            <SkillsGapAnalyzer
                isOpen={showSkillsGap}
                onClose={() => setShowSkillsGap(false)}
            />

            <PortfolioBuilder
                isOpen={showPortfolioBuilder}
                onClose={() => setShowPortfolioBuilder(false)}
            />

            {/* New Feature Modals */}
            <TargetFitAI
                isOpen={showTargetFit}
                onClose={() => setShowTargetFit(false)}
            />

            <LetterGenerator
                isOpen={showLetterGenerator}
                onClose={() => setShowLetterGenerator(false)}
            />

            <ApplicationCRM
                isOpen={showApplicationCRM}
                onClose={() => setShowApplicationCRM(false)}
            />

            <AIHeadshot
                isOpen={showAIHeadshot}
                onClose={() => setShowAIHeadshot(false)}
            />

            <InterviewCoachPro
                isOpen={showInterviewCoachPro}
                onClose={() => setShowInterviewCoachPro(false)}
            />

            <SalaryBenchmark
                isOpen={showSalaryBenchmark}
                onClose={() => setShowSalaryBenchmark(false)}
            />

            {/* Revenue Feature Modals */}
            {showSubscriptionManager && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowSubscriptionManager(false)}>
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Abonelik Yönetimi</h2>
                            <button onClick={() => setShowSubscriptionManager(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <SubscriptionManager />
                    </div>
                </div>
            )}

            {showGiftCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowGiftCard(false)}>
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">🎁 Hediye Kartları</h2>
                            <button onClick={() => setShowGiftCard(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <GiftCardManager />
                    </div>
                </div>
            )}

            {showAffiliate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowAffiliate(false)}>
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">💰 Affiliate Program</h2>
                            <button onClick={() => setShowAffiliate(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <AffiliateDashboard />
                    </div>
                </div>
            )}

            <UpsellModal
                isOpen={showUpsell}
                onClose={() => setShowUpsell(false)}
                triggerType={upsellType}
                onUpgrade={() => {
                    setShowUpsell(false)
                    navigate('/pricing')
                }}
            />

            {/* AI Feature Modals */}
            <AIProjectWriter
                isOpen={showProjectWriter}
                onClose={() => setShowProjectWriter(false)}
                onInsert={(data) => {
                    toast.success('Proje açıklaması oluşturuldu!')
                    console.log('Project data:', data)
                }}
            />

            <AILinkedInOptimizer
                isOpen={showLinkedInOptimizer}
                onClose={() => setShowLinkedInOptimizer(false)}
            />

            <AIEmailGenerator
                isOpen={showEmailGenerator}
                onClose={() => setShowEmailGenerator(false)}
            />

            <AIReferenceLetter
                isOpen={showReferenceLetter}
                onClose={() => setShowReferenceLetter(false)}
            />

            {/* CV Importer Modal */}
            <CVImporter
                isOpen={showCVImporter}
                onClose={() => setShowCVImporter(false)}
                darkMode={darkMode}
                onImport={(importedCV) => {
                    if (importedCV) {
                        toast.success('CV başarıyla içe aktarıldı!')
                        navigate(`/editor/${importedCV.id}`)
                    }
                }}
            />
        </div >
    )
}

