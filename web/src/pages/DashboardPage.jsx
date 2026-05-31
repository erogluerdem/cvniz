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
                                className="flex items-center gap-3 hover:bg-white/5 rounded-2xl p-2 transition-all border border-transparent hover:border-white/10 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative w-10 h-10 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center ring-2 ring-white/10 shadow-lg">
                                        <span className="text-sm font-black text-cyan-400">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-left leading-tight">
                                    <div className="text-sm font-black text-white italic">{user?.name || 'Kullanıcı'}</div>
                                    <div className="text-[9px] text-gray-500 flex items-center gap-1 font-black uppercase tracking-widest">
                                        {isPremium ? (
                                            <>
                                                <Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                                <span className="text-amber-500">Premium Plus</span>
                                            </>
                                        ) : (
                                            <span>Free Account</span>
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Sistem Online</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black mb-2 text-white italic tracking-tighter">
                            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Kullanıcı'}</span>!
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Kariyer paneline hoş geldin</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowJobSearch(true)}
                            className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center gap-2 text-gray-400 hover:text-blue-400 font-bold text-xs uppercase tracking-widest"
                        >
                            <Briefcase className="w-4 h-4" /> İş Bul
                        </button>
                        <button
                            onClick={() => setShowCompareModal(true)}
                            className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all flex items-center gap-2 text-gray-400 hover:text-cyan-400 font-bold text-xs uppercase tracking-widest"
                        >
                            <Columns className="w-4 h-4" /> Karşılaştır
                        </button>
                        <Link to="/editor" className="h-12 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 flex items-center gap-2 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                            <Plus className="w-5 h-5" /> Yeni CV
                        </Link>
                    </div>
                </div>

                <AnnouncementBanner />

                {/* Compact Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Aktif CV', value: cvs?.length || 0, color: 'cyan', icon: <FileText /> },
                        { label: 'Görüntülenme', value: cvs?.reduce((acc, cv) => acc + (getCVViewStats?.(cv.id)?.total || 0), 0) || 12, color: 'purple', icon: <Eye /> },
                        { label: 'İndirme', value: downloadHistory.length, color: 'emerald', icon: <Download /> },
                        { label: 'Puan', value: '4.9/5', color: 'amber', icon: <Star /> }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bento-card border-beam p-6 relative overflow-hidden group cursor-default`}
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl pointer-events-none transition-all group-hover:bg-${stat.color}-500/10`} />

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="text-3xl font-black text-white mb-1 italic tracking-tighter">{stat.value}</div>
                                    <div className={`text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]`}>{stat.label}</div>
                                </div>
                                <div className={`w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform shadow-xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area: CV List First */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* CV List Section */}
                        <div className="bento-card border-beam p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white italic flex items-center gap-3 tracking-tighter">
                                        <FileText className="w-6 h-6 text-cyan-400" />
                                        BELGELERİM
                                    </h2>
                                    <p className="text-[10px] text-gray-500 font-black mt-1 uppercase tracking-[0.2em]">Kariyerinizi yönetin</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 focus-within:border-cyan-500/50 transition-all group">
                                        <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400" />
                                        <input
                                            type="text"
                                            placeholder="Ara..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-transparent border-none text-xs focus:outline-none w-full sm:w-28 placeholder-gray-700 text-white font-bold"
                                        />
                                    </div>
                                    <div className="flex bg-slate-900 rounded-2xl p-1 border border-white/10 shadow-inner">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {filteredCVs.length === 0 ? (
                                <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                        <FileText className="w-8 h-8 text-gray-700" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2 italic">Daha Fazlasını Hedefle</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto text-xs font-bold uppercase tracking-widest">Henüz bir CV oluşturmadın</p>
                                    <Link to="/editor" className="h-12 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 inline-flex items-center gap-2 group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                                        <Plus className="w-5 h-5" /> İLK CV'Nİ YARAT
                                    </Link>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                                    {filteredCVs.map((cv, i) => (
                                        <motion.div
                                            key={cv.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group relative bg-slate-950/40 rounded-3xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-slate-950/60 shadow-2xl overflow-hidden"
                                        >
                                            {/* Glow Effect on Hover */}
                                            <div className="absolute -inset-24 bg-cyan-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                            <div className="flex gap-6 relative z-10">
                                                {/* CV Miniature Refined */}
                                                <div className="w-28 h-36 rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0 relative overflow-hidden group-hover:border-cyan-500/50 transition-all shadow-xl">
                                                    <div className="absolute inset-0 flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform duration-700">
                                                        {getTemplateEmoji(cv.template)}
                                                    </div>

                                                    {/* Quick Actions Overlay */}
                                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                                        <Link to={`/editor/${cv.id}`} className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => handleShare(cv)} className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-lg font-black text-white truncate group-hover:text-cyan-400 transition-colors italic tracking-tighter">
                                                                {cv.name}
                                                            </h3>
                                                            <button
                                                                onClick={() => setDeleteConfirm(cv.id)}
                                                                className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                                title="Sil"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest mb-4">
                                                            <Layout className="w-3 h-3 text-cyan-500" />
                                                            {cv.template} Şablonu
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1 text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                                                <Clock className="w-3 h-3 text-gray-600" />
                                                                {formatTimeAgo(cv.updatedAt)}
                                                            </div>
                                                            {getCVViewStats && getCVViewStats(cv.id)?.total > 0 && (
                                                                <div className="flex items-center gap-1 text-[9px] font-black text-cyan-500 uppercase tracking-tighter">
                                                                    <Eye className="w-3 h-3" />
                                                                    {getCVViewStats(cv.id).total}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            <button
                                                                onClick={() => { setSelectedCVForATS(cv); setShowATSModal(true); }}
                                                                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 text-gray-500 hover:text-purple-400 hover:border-purple-500/30 transition-all flex items-center justify-center"
                                                                title="ATS Analizi"
                                                            >
                                                                <Target className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedCVForAnalytics(cv); setShowAnalyticsModal(true); }}
                                                                className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all flex items-center justify-center"
                                                                title="Analitik"
                                                            >
                                                                <BarChart3 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-8 mt-8">
                                {/* Bento Toolbox Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
                                    {/* Large AI Feature Card */}
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => navigate('/editor')}
                                        className="md:col-span-2 md:row-span-1 bento-card border-beam p-8 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl group-hover:bg-white/10 transition-all" />
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xl">
                                                    <Sparkles className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2 uppercase">Gelişmiş Editör</h3>
                                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">AI Destekli Akıllı CV Oluşturucu</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.2em] mt-8 group-hover:translate-x-2 transition-transform">
                                                HEMEN BAŞLA <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* ATS Card */}
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => setShowATSModal(true)}
                                        className="md:col-span-1 bento-card border-beam p-6 cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Target className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-1">ATS Analiz</h4>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">İşveren Radarına Yakalanın</p>
                                        </div>
                                    </motion.div>

                                    {/* Job Search Card */}
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => setShowJobSearch(true)}
                                        className="md:col-span-1 bento-card border-beam p-6 bg-gradient-to-tr from-emerald-600/10 to-transparent cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-1">İş Bulucu</h4>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Size Özel Fırsatlar</p>
                                        </div>
                                    </motion.div>

                                    {/* Tools Row 2 */}
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => setShowInterviewCoach(true)}
                                        className="md:col-span-1 bento-card border-beam p-6 cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-white italic uppercase tracking-tighter mb-1 font-black">Mülakat Koçu</h4>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">AI ile Prova Yapın</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => setShowSalaryBenchmark(true)}
                                        className="md:col-span-1 bento-card border-beam p-6 cursor-pointer group flex flex-col justify-between"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <DollarSign className="w-6 h-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-white italic uppercase tracking-tighter mb-1 font-black">Maaş Karşılaştır</h4>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Piyasa Değerinizi Öğrenin</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => setShowTranslatorModal(true)}
                                        className="md:col-span-2 bento-card border-beam p-6 bg-slate-900/60 cursor-pointer group relative overflow-hidden flex items-center gap-6"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                            <Globe2 className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1">Profesyonel Çevirmen</h4>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">CV'nizi 50+ Dile Anında Çevirin</p>
                                            <div className="flex gap-1">
                                                {['TR', 'EN', 'DE', 'FR', 'ES'].map(lang => (
                                                    <span key={lang} className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black text-gray-600 uppercase">{lang}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Secondary Tools Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {[
                                        { onClick: () => setShowAIHeadshot(true), label: 'AI Photo', icon: <Camera />, color: 'pink' },
                                        { onClick: () => setShowCareerPath(true), label: 'Route', icon: <TrendingUp />, color: 'indigo' },
                                        { onClick: () => setShowLinkedInOptimizer(true), label: 'Linkdn', icon: <Share2 />, color: 'blue' },
                                        { onClick: () => setShowPortfolioBuilder(true), label: 'Portfo', icon: <Layout />, color: 'rose' },
                                        { onClick: () => setShowEmailGenerator(true), label: 'E-Email', icon: <Mail />, color: 'emerald' },
                                        { onClick: () => setShowCVImporter(true), label: 'Import', icon: <Upload />, color: 'cyan' }
                                    ].map((tool, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            onClick={tool.onClick}
                                            className="p-4 rounded-3xl bg-slate-900/40 border border-white/5 flex flex-col items-center text-center group transition-all"
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center text-${tool.color}-400 mb-3 group-hover:scale-110 transition-transform`}>
                                                {tool.icon}
                                            </div>
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{tool.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Social & Activity */}
                <div className="space-y-8">
                    {/* Achievements Mini */}
                    <div className="bento-card border-beam p-6 relative overflow-hidden">
                        <h3 className="text-[10px] font-black text-gray-500 italic mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            BAŞARI ROZETLERİ
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {achievements.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${badge.unlocked ? badge.color + ' shadow-lg scale-100 hover:scale-110' : 'bg-slate-900 border border-white/5 grayscale opacity-20 cursor-help hover:opacity-40'}`}
                                    title={badge.title}
                                >
                                    <div className="scale-90">{badge.icon}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity Mini */}
                    <div className="bento-card border-beam p-6 relative overflow-hidden">
                        <h3 className="text-[10px] font-black text-gray-500 italic mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <History className="w-4 h-4 text-purple-400" />
                            SON AKTİVİTE
                        </h3>
                        <div className="space-y-4">
                            {activities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                                        <div className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                                            {activity.icon}
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase truncate group-hover:text-cyan-400 transition-colors">{activity.cv}</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{activity.action} • {activity.time}</p>
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
                        <div className="bento-card border-beam p-5 relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-gray-500 italic mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <DollarSign className="w-4 h-4 text-emerald-500" />
                                HESAP & KAZANÇ
                            </h3>
                            <div className="space-y-2">
                                {isPremium && (
                                    <button
                                        onClick={() => setShowSubscriptionManager(true)}
                                        className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Settings className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Abonelik</p>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase">Planı Yönet</p>
                                        </div>
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowGiftCard(true)}
                                    className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-pink-500/30 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Gift className="w-5 h-5 text-pink-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Hediye</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase">Kart Gönder</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setShowAffiliate(true)}
                                    className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-purple-500/30 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Affiliate</p>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase">Kazanmaya Başla</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <ReferralWidget />
                    </div>
                </div>
            </main>

        {/* Delete Modal */ }
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

    {/* CV Review Modal */ }
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

    {/* New Feature Modals */ }
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

    {/* Revenue Feature Modals */ }
    {
        showSubscriptionManager && (
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
        )
    }

    {
        showGiftCard && (
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
        )
    }

    {
        showAffiliate && (
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
        )
    }

    <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        triggerType={upsellType}
        onUpgrade={() => {
            setShowUpsell(false)
            navigate('/pricing')
        }}
    />

    {/* AI Feature Modals */ }
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

    {/* CV Importer Modal */ }
    <CVImporter
        isOpen={showCVImporter}
        onClose={() => setShowCVImporter(false)}
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

