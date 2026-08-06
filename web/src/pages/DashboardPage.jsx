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

import { userAPI } from '../services/api'

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

    // Dynamic Data States
    const [activities, setActivities] = useState([])
    const [downloadHistory, setDownloadHistory] = useState([])
    const [userAchievements, setUserAchievements] = useState([])

    // Sample notifications (can be moved to Context or userAPI)
    const notifications = [
        { message: 'Yeni şablonlar eklendi! 🎉', time: '2 saat önce', type: 'info', icon: <Gift className="w-4 h-4 text-cyan-400" />, read: false },
        { message: 'CV\'niz başarıyla indirildi', time: '1 gün önce', type: 'success', icon: <Download className="w-4 h-4 text-green-400" />, read: true },
        { message: 'Pro üyeliğiniz 7 gün sonra bitiyor', time: '3 gün önce', type: 'warning', icon: <AlertCircle className="w-4 h-4 text-amber-400" />, read: true }
    ]

    // Achievements derived from state
    const achievements = [
        { id: 'first-cv', title: 'İlk CV', icon: <FileText className="w-5 h-5 text-white" />, unlocked: userAchievements.includes('first-cv') || (cvs?.length > 0), color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
        { id: 'pro-member', title: 'Pro Üye', icon: <Crown className="w-5 h-5 text-white" />, unlocked: isPremium, color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
        { id: 'five-cvs', title: '5 CV Master', icon: <Trophy className="w-5 h-5 text-white" />, unlocked: (cvs?.length || 0) >= 5, color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
        { id: 'downloader', title: 'İndirici', icon: <Download className="w-5 h-5 text-white" />, unlocked: userAchievements.includes('downloader'), color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
        { id: 'sharer', title: 'Paylaşımcı', icon: <Share2 className="w-5 h-5 text-white" />, unlocked: userAchievements.includes('sharer'), color: 'bg-gradient-to-br from-blue-500 to-indigo-600' }
    ]

    useEffect(() => {
        // Fetch dynamic user data
        const loadDashboardData = async () => {
            try {
                const [acts, dlHistory, achieves] = await Promise.all([
                    userAPI.getActivities(),
                    userAPI.getDownloadHistory(),
                    userAPI.getAchievements()
                ]);
                if (acts.success) setActivities(acts.data || []);
                if (dlHistory.success) setDownloadHistory(dlHistory.data || []);
                if (achieves.success) setUserAchievements(achieves.data || []);
            } catch (error) {
                console.error("Dashboard data load error", error);
            }
        };
        loadDashboardData();
    }, []);

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
        addToast('Özgeçmiş başarıyla silindi', 'success')
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
        <div className={`min-h-screen pb-20 font-sans transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-[#0a0a0f] to-cosmic-900/40 text-slate-100 selection:bg-aurora-500/30' : 'bg-slate-50 text-slate-900 selection:bg-sky-200'}`}>
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
                isPremium={isPremium}
            />
            <ATSReportModal
                isOpen={showATSModal}
                onClose={() => setShowATSModal(false)}
                cvData={selectedCVForATS?.data}
                cvName={selectedCVForATS?.name || 'CV'}
                isPremium={isPremium}
            />
            <CVTranslator
                isOpen={showTranslatorModal}
                onClose={() => setShowTranslatorModal(false)}
                cv={selectedCVForTranslate}
                isPremium={isPremium}
            />
            <CVVoiceReader
                isOpen={showVoiceReader}
                onClose={() => setShowVoiceReader(false)}
                cvData={selectedCVForVoice?.data}
                isPremium={isPremium}
            />
            <CSSEditorModal
                isOpen={showCSSEditor}
                onClose={() => setShowCSSEditor(false)}
                cv={selectedCVForCSS}
                isPremium={isPremium}
                onSave={async (id, css) => {
                    await updateCV(id, { customStyles: css })
                    setShowCSSEditor(false)
                }}
            />
            <VideoCVModal
                isOpen={showVideoCV}
                onClose={() => setShowVideoCV(false)}
                cv={selectedCVForDesign}
                isPremium={isPremium}
            />
            <AnimatedCVModal
                isOpen={showAnimatedCV}
                onClose={() => setShowAnimatedCV(false)}
                cv={selectedCVForDesign}
                isPremium={isPremium}
            />
            <LayoutManagerModal
                isOpen={showLayoutManager}
                onClose={() => setShowLayoutManager(false)}
                cv={selectedCVForDesign}
                isPremium={isPremium}
                onSave={async (id, layout) => {
                    await updateCV(id, { data: { ...selectedCVForDesign.data, layout } })
                    setShowLayoutManager(false)
                }}
            />
            <CareerTestModal
                isOpen={showCareerTest}
                onClose={() => setShowCareerTest(false)}
                isPremium={isPremium}
            />
            <AnalyticsModal
                isOpen={showAnalyticsModal}
                onClose={() => setShowAnalyticsModal(false)}
                cv={selectedCVForAnalytics}
                isPremium={isPremium}
            />

            {/* Header */}
            <header className={`border-b sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${darkMode ? 'glass border-white/5 bg-slate-950/40 shadow-glow-sm' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${darkMode ? 'bg-gradient-to-br from-cyan-400 to-slate-200 ring-1 ring-white/10 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-md group-hover:shadow-lg'}`}>
                            <FileText className={`w-5 h-5 ${darkMode ? 'text-slate-900' : 'text-white'}`} />
                        </div>
                        <span className={`text-xl font-bold ${darkMode ? 'gradient-text' : 'bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-blue-800'}`}>CVniz</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
                            title={darkMode ? 'Açık Tema' : 'Koyu Tema'}
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                        </button>

                        {/* Help */}
                        <button
                            onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
                            title="Yardım"
                        >
                            <HelpCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`} />
                        </button>

                        {/* Notifications - Living CV */}
                        <NotificationBell />

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={`flex items-center gap-3 rounded-xl p-2 transition-all border ${darkMode ? 'hover:bg-white/5 border-transparent hover:border-white/10' : 'hover:bg-slate-100 border-transparent hover:border-slate-200'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center ring-2 ring-white/20 shadow-lg">
                                    <span className="text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <div className="hidden sm:block text-left leading-tight">
                                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user?.name || 'Kullanıcı'}</div>
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
                                        className={`absolute right-0 top-full mt-3 w-64 backdrop-blur-2xl rounded-2xl overflow-hidden py-2 z-50 ${darkMode ? 'bg-slate-950/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5' : 'bg-white/95 border border-slate-200 shadow-xl'}`}
                                    >
                                        <div className={`px-4 py-2 border-b mb-2 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Giriş Yapılan Hesap</p>
                                            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user?.email}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                setShowProfileModal(true)
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
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
                        <h1 className={`text-3xl md:text-4xl font-display font-extrabold tracking-tight drop-shadow-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Kullanıcı'}</span>! 👋
                        </h1>
                        <p className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Kariyer yolculuğunda bugün ne yapmak istersin?</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowJobSearch(true)}
                            className={`px-5 py-2.5 rounded-xl border transition-colors flex items-center gap-2 text-sm font-semibold ${darkMode ? 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10 text-blue-300' : 'bg-white border-slate-200 hover:border-blue-500/30 hover:bg-blue-50/50 text-blue-600 shadow-sm'}`}
                        >
                            <Briefcase className="w-4 h-4" /> İş Bul
                        </button>
                        <button
                            onClick={() => setShowCompareModal(true)}
                            className={`px-5 py-2.5 rounded-xl border transition-colors flex items-center gap-2 text-sm font-semibold ${darkMode ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 shadow-sm'}`}
                        >
                            <Columns className="w-4 h-4" /> Karşılaştır
                        </button>
                        <button
                            onClick={() => setShowCoverLetterModal(true)}
                            className={`px-5 py-2.5 rounded-xl border transition-colors flex items-center gap-2 text-sm font-semibold ${darkMode ? 'bg-white/5 border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300' : 'bg-white border-slate-200 hover:border-cyan-500/30 hover:bg-cyan-50/50 text-cyan-600 shadow-sm'}`}
                        >
                            <PenTool className="w-4 h-4" /> Ön Yazı
                        </button>
                        <Link to="/editor" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2 text-sm font-semibold">
                            <Plus className="w-4 h-4" /> Yeni CV
                        </Link>
                    </div>
                </div>

                <AnnouncementBanner />

                {/* Compact Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Toplam CV', value: cvs?.length || 0, color: darkMode ? 'text-cyan-400' : 'text-cyan-600', icon: <FileText className="w-5 h-5" />, bg: darkMode ? 'bg-cyan-500/10' : 'bg-cyan-100' },
                        { label: 'Şablonlar', value: isPremium ? '65+' : '1', color: darkMode ? 'text-purple-400' : 'text-purple-600', icon: <LayoutGrid className="w-5 h-5" />, bg: darkMode ? 'bg-purple-500/10' : 'bg-purple-100' },
                        { label: 'İndirme', value: downloadHistory.length, color: darkMode ? 'text-green-400' : 'text-green-600', icon: <Download className="w-5 h-5" />, bg: darkMode ? 'bg-green-500/10' : 'bg-green-100' },
                        { label: 'Rozetler', value: `${achievements.filter(a => a.unlocked).length}/${achievements.length}`, color: darkMode ? 'text-amber-400' : 'text-amber-600', icon: <Trophy className="w-5 h-5" />, bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-100' }
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl p-5 flex items-center gap-4 border transition-all duration-300 group cursor-default shadow-lg ${darkMode ? 'glass border-white/5 hover:border-white/10 hover:bg-white/[0.03] shadow-black/20' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl shadow-slate-200/50'}`}>
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform border ${darkMode ? 'border-white/5' : 'border-transparent'}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                <div className={`text-[11px] font-semibold uppercase tracking-widest mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area: CV List First */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* CV List Section */}
                        <div className={`rounded-[2.5rem] p-8 border transition-all duration-500 relative overflow-hidden ${darkMode ? 'glass border-white/10 shadow-glass bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                            {/* Decorative Background for Section */}
                            {darkMode && <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />}

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div>
                                    <h2 className={`text-2xl font-display font-bold drop-shadow-sm flex items-center gap-3 ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400' : 'text-slate-900'}`}>
                                        <FileText className={`w-6 h-6 ${darkMode ? 'text-cyan-400/80' : 'text-sky-500'}`} />
                                        Özgeçmişlerim
                                    </h2>
                                    <p className={`text-xs font-semibold mt-1.5 uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Profesyonel döküman yönetimi</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${darkMode ? 'bg-black/20 border-white/5 focus-within:border-cyan-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-sky-500/50'}`}>
                                        <Search className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            placeholder="Ara..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`bg-transparent border-none text-sm focus:outline-none w-32 font-medium ${darkMode ? 'placeholder-slate-600 text-slate-200' : 'placeholder-slate-400 text-slate-800'}`}
                                        />
                                    </div>
                                    <div className={`flex rounded-xl p-1 border ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
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
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`relative rounded-[2.5rem] border backdrop-blur-xl p-10 overflow-hidden group ${darkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-500 mb-6 ring-1 ring-cyan-500/30 shadow-inner">
                                                <Sparkles className="w-8 h-8" />
                                            </div>
                                            <h3 className={`text-3xl font-black mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Kariyerinize İlk Adımı Atın</h3>
                                            <p className={`mb-8 max-w-md leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Henüz bir özgeçmiş oluşturmadınız. Şablonlarımızı kullanarak dakikalar içinde profesyonel bir CV hazırlayabilir veya yapay zeka ile otomatik doldurabilirsiniz.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                                <Link 
                                                    to="/editor" 
                                                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg text-white font-bold text-sm uppercase tracking-widest hover:shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" /> CV Oluştur
                                                </Link>
                                                <button className={`px-8 py-4 rounded-2xl border font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 ${darkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'}`}>
                                                    Şablonları İncele
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="hidden md:block w-72 relative perspective-1000">
                                            <motion.div 
                                                animate={{ 
                                                    rotateY: [-5, 5, -5],
                                                    rotateX: [5, -5, 5],
                                                    y: [-10, 10, -10]
                                                }}
                                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                className="relative w-full aspect-[1/1.4] rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl p-4 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                                <div className="h-4 w-1/2 bg-white/20 rounded-full mb-4" />
                                                <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
                                                <div className="h-2 w-5/6 bg-white/10 rounded-full mb-6" />
                                                
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    <div className="h-16 bg-white/5 rounded-lg" />
                                                    <div className="h-16 bg-white/5 rounded-lg" />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                                    {filteredCVs.map((cv) => (
                                        <div
                                            key={cv.id}
                                            className={`group relative backdrop-blur-md rounded-3xl p-5 border transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/10 hover:border-aurora-400/50 hover:bg-white/10 shadow-glass hover:shadow-glow-cyan' : 'bg-slate-50 border-slate-200 hover:border-sky-400/50 hover:bg-white shadow-sm hover:shadow-lg'}`}
                                        >
                                            <div className="flex gap-5">
                                                {/* CV Miniature */}
                                                <div className={`w-24 h-32 rounded-2xl border flex-shrink-0 relative overflow-hidden transition-all ${darkMode ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 group-hover:border-cyan-500/30' : 'bg-white border-slate-200 group-hover:border-sky-500/30 shadow-inner'}`}>
                                                    <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-125 transition-transform duration-500">
                                                        {getTemplateEmoji(cv.template)}
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                        <Link to={`/editor/${cv.id}`} className="p-2 rounded-full bg-cyan-500 text-slate-950 shadow-xl hover:scale-110 transition-transform">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className={`text-lg font-bold truncate transition-colors ${darkMode ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-sky-600'}`}>
                                                            {cv.name}
                                                        </h3>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => duplicateCV(cv.id)}
                                                                className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
                                                                title="Kopyala"
                                                            >
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(cv.id)}
                                                                className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-100 text-slate-500 hover:text-red-600'}`}
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
                                                            className={`flex-1 py-2 px-3 rounded-xl border transition-all text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 ${darkMode ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                                                        >
                                                            <Edit className="w-3 h-3" /> Düzenle
                                                        </Link>
                                                        <button
                                                            onClick={() => handleShare(cv)}
                                                            className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-cyan-500/10 border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' : 'bg-sky-50 border-sky-100 text-sky-600 hover:bg-sky-100 shadow-sm'}`}
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Action Bar (Hidden by default, shown on hover/complex layout) */}
                                            <div className={`mt-4 pt-4 border-t flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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
                                                        className={`p-1.5 rounded-lg transition-all ${darkMode ? 'bg-white/5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10' : 'bg-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-100'}`}
                                                        title="ATS Analiz"
                                                    >
                                                        <Target className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedCVForVoice(cv); setShowVoiceReader(true); }}
                                                        className={`p-1.5 rounded-lg transition-all ${darkMode ? 'bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10' : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100'}`}
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
                        <div className={`rounded-[2.5rem] p-8 border transition-all duration-500 ${darkMode ? 'glass border-white/10 shadow-glass bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className={`text-2xl font-display font-bold drop-shadow-sm flex items-center gap-3 ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400' : 'text-slate-900'}`}>
                                        <Zap className={`w-6 h-6 ${darkMode ? 'text-yellow-400/80' : 'text-amber-500'}`} />
                                        Araç Seti
                                    </h2>
                                    <p className={`text-xs font-semibold mt-1.5 uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Kariyerini güçlendirecek araçlar</p>
                                </div>

                                <div className={`flex rounded-full p-1.5 border self-start shadow-inner ${darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-slate-200/50 border-slate-200/50'}`}>
                                    {[
                                        { id: 'quick', label: 'Hızlı', icon: <Zap className="w-3.5 h-3.5" /> },
                                        { id: 'ai', label: 'AI Araçları', icon: <Sparkles className="w-3.5 h-3.5" /> },
                                        { id: 'design', label: 'Tasarım', icon: <Palette className="w-3.5 h-3.5" /> }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveToolTab(tab.id)}
                                            className={`px-5 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeToolTab === tab.id
                                                ? (darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105' : 'bg-white text-slate-900 shadow-md shadow-slate-200/50 scale-105')
                                                : (darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50')
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
                                            { to: '/editor?new=true', label: 'Yeni CV', icon: <Plus />, color: 'from-cyan-500 to-blue-600' },
                                            { onClick: () => setShowCVImporter(true), label: 'CV Yükle', icon: <Upload />, color: 'from-emerald-500 to-green-600', badge: 'YENİ' },
                                            { to: '/templates', label: 'Şablonlar', icon: <LayoutGrid />, color: 'from-purple-500 to-pink-600' },
                                            { onClick: () => setShowCompareModal(true), label: 'Karşılaştır', icon: <Columns />, color: 'from-green-500 to-emerald-600' },
                                            { onClick: () => setShowCoverLetterModal(true), label: 'Ön Yazı', icon: <FileText />, color: 'from-amber-500 to-orange-600' }
                                        ].map((tool, i) => {
                                            const CardContent = (
                                                <>
                                                    {tool.badge && (
                                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm ${darkMode ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20' : 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border border-sky-200/50'}`}>
                                                            {tool.badge}
                                                        </div>
                                                    )}
                                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-slate-900/10 text-white relative z-10`}>
                                                        <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <span className="relative z-10">{tool.icon}</span>
                                                    </div>
                                                    <div className={`text-[13px] font-black uppercase tracking-widest mt-1 transition-colors ${darkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{tool.label}</div>
                                                </>
                                            );
                                            
                                            const baseClasses = `group p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden transform hover:-translate-y-1 ${darkMode ? 'bg-gradient-to-b from-white/[0.04] to-transparent border-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]' : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100'}`;

                                            return tool.to ? (
                                                <Link key={i} to={tool.to} className={baseClasses}>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem]"></div>
                                                    {CardContent}
                                                </Link>
                                            ) : (
                                                <button key={i} onClick={tool.onClick} className={baseClasses}>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem]"></div>
                                                    {CardContent}
                                                </button>
                                            );
                                        })}
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
                                            <button key={i} onClick={tool.onClick} className={`group p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden transform hover:-translate-y-1 ${darkMode ? 'bg-gradient-to-b from-white/[0.04] to-transparent border-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]' : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100'}`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem]"></div>
                                                {tool.badge && (
                                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm ${darkMode ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20' : 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 border border-sky-200/50'}`}>
                                                        {tool.badge}
                                                    </div>
                                                )}
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-slate-900/10 text-white relative z-10`}>
                                                    <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <span className="relative z-10">{tool.icon}</span>
                                                </div>
                                                <div className={`text-[13px] font-black uppercase tracking-widest mb-1.5 transition-colors ${darkMode ? 'text-white group-hover:text-cyan-100' : 'text-slate-800 group-hover:text-slate-950'}`}>{tool.label}</div>
                                                <div className={`text-[11px] font-medium leading-relaxed px-2 ${darkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-700'}`}>{tool.desc}</div>
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
                                            <button key={i} onClick={tool.onClick} className={`group p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden transform hover:-translate-y-1 ${darkMode ? 'bg-gradient-to-b from-white/[0.04] to-transparent border-white/10 hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]' : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100'}`}>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem]"></div>
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-slate-900/10 text-white relative z-10`}>
                                                    <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <span className="relative z-10">{tool.icon}</span>
                                                </div>
                                                <div className={`text-[13px] font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-white group-hover:text-purple-100' : 'text-slate-800 group-hover:text-slate-950'}`}>{tool.label}</div>
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
                        <div className={`rounded-[2rem] p-6 border shadow-xl ${darkMode ? 'glass-card border-white/5' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
                            <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Trophy className="w-4 h-4 text-amber-400" />
                                Başarı Rozetleri
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
                        <div className={`rounded-[2rem] p-6 border shadow-xl ${darkMode ? 'glass-card border-white/5' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
                            <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                <History className="w-4 h-4 text-purple-400" />
                                Son Aktivite
                            </h3>
                            <div className="space-y-4">
                                {activities.length === 0 ? (
                                    <div className="text-sm text-gray-500 italic py-4">Henüz aktivite bulunmuyor.</div>
                                ) : (
                                    activities.map((activity, i) => (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="relative flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all group-hover:scale-110 ${darkMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-900' : 'bg-sky-100 border-sky-200 text-sky-600 group-hover:bg-sky-500 group-hover:text-white'}`}>
                                                    <Activity className="w-4 h-4" />
                                                </div>
                                                {i !== activities.length - 1 && <div className={`w-px h-8 my-1 ${darkMode ? 'bg-white/5' : 'bg-slate-200'}`}></div>}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{activity.action} <span className={darkMode ? 'text-cyan-400' : 'text-sky-600'}>{activity.cv}</span></p>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Referral & Pro */}
                        <div className="space-y-4">
                            {!isPremium && (
                                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-600 shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
                                    <Crown className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:scale-125 transition-transform duration-700" />
                                    <h3 className="text-lg font-bold text-slate-950 mb-1">Pro Üyeliğe Geç</h3>
                                    <p className="text-slate-950/70 text-[11px] font-semibold uppercase tracking-wider mb-4">Sınırsız Şablon ve AI Gücü</p>
                                    <Link to="/pricing" className="w-full py-3 rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-widest text-center block hover:scale-[1.02] transition-all">
                                        Şimdi Yükselt
                                    </Link>
                                </div>
                            )}

                            {/* Revenue Features */}
                            <div className={`rounded-[2rem] p-5 border ${darkMode ? 'glass-card border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    Hesap & Kazanç
                                </h3>
                                <div className="space-y-2">
                                    {isPremium && (
                                        <button
                                            onClick={() => setShowSubscriptionManager(true)}
                                            className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 group ${darkMode ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-cyan-500/30' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-sky-300'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${darkMode ? 'bg-cyan-500/20' : 'bg-sky-100'}`}>
                                                <Settings className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-sky-600'}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Abonelik Yönetimi</p>
                                                <p className={`text-[9px] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>Plan değiştir, dondur</p>
                                            </div>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowGiftCard(true)}
                                        className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 group ${darkMode ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-pink-500/30' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-pink-300'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${darkMode ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                                            <Gift className={`w-4 h-4 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Hediye Kartı</p>
                                            <p className={`text-[9px] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>Premium hediye et</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setShowAffiliate(true)}
                                        className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 group ${darkMode ? 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-purple-500/30' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-purple-300'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                            <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Affiliate Program</p>
                                            <p className={`text-[9px] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>Paylaş ve kazan</p>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <div className={`backdrop-blur-3xl rounded-[2rem] p-8 max-w-sm w-full animate-scale-in shadow-2xl ring-1 ${darkMode ? 'bg-slate-950/90 border border-white/10 shadow-black/50 ring-white/5' : 'bg-white/95 border border-slate-200 shadow-slate-300/50 ring-slate-100'}`}>
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>CV'yi Sil</h3>
                            <p className={`mb-6 text-center ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Bu işlem geri alınamaz.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className={`flex-1 py-3 rounded-xl border transition-colors ${darkMode ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg shadow-red-500/30"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && setShowSubscriptionManager(false)}>
                    <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl ring-1 ${darkMode ? 'bg-slate-950/95 border border-white/10 shadow-cyan-500/10 ring-white/5' : 'bg-white/95 border border-slate-200 shadow-slate-300/50 ring-slate-100'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Abonelik Yönetimi</h2>
                            <button onClick={() => setShowSubscriptionManager(false)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}>
                                <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-600'}`} />
                            </button>
                        </div>
                        <SubscriptionManager />
                    </div>
                </div>
            )}

            {showGiftCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && setShowGiftCard(false)}>
                    <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl ring-1 ${darkMode ? 'bg-slate-950/95 border border-white/10 shadow-pink-500/10 ring-white/5' : 'bg-white/95 border border-slate-200 shadow-slate-300/50 ring-slate-100'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>🎁 Hediye Kartları</h2>
                            <button onClick={() => setShowGiftCard(false)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}>
                                <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-600'}`} />
                            </button>
                        </div>
                        <GiftCardManager />
                    </div>
                </div>
            )}

            {showAffiliate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={(e) => e.target === e.currentTarget && setShowAffiliate(false)}>
                    <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl ring-1 ${darkMode ? 'bg-slate-950/95 border border-white/10 shadow-purple-500/10 ring-white/5' : 'bg-white/95 border border-slate-200 shadow-slate-300/50 ring-slate-100'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>💰 Affiliate Program</h2>
                            <button onClick={() => setShowAffiliate(false)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}>
                                <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-600'}`} />
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

            {/* Mobile Bottom Navigation (App Experience) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
                <div className={`backdrop-blur-2xl rounded-[2rem] shadow-2xl p-2 flex items-center justify-between pointer-events-auto border ${darkMode ? 'bg-slate-950/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${darkMode ? 'text-cyan-400 bg-cyan-500/10' : 'text-sky-600 bg-sky-50'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Ana Sayfa</span>
                    </button>
                    
                    <button 
                        onClick={() => setShowJobSearch(true)} 
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}
                    >
                        <Briefcase className="w-5 h-5" />
                        <span className="text-[10px] font-bold">İş Bul</span>
                    </button>
                    
                    <Link 
                        to="/editor"
                        className={`flex-shrink-0 w-12 h-12 -mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center border-4 hover:scale-105 transition-transform ${darkMode ? 'shadow-lg shadow-cyan-500/30 border-slate-950' : 'shadow-md border-white'}`}
                    >
                        <Plus className="w-6 h-6" />
                    </Link>
                    
                    <button 
                        onClick={() => {
                            if (!isPremium) {
                                setShowUpsell(true);
                                setUpsellType('generic');
                            } else {
                                setShowSubscriptionManager(true);
                            }
                        }} 
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}
                    >
                        <Crown className="w-5 h-5" />
                        <span className="text-[10px] font-bold">{isPremium ? 'Pro' : 'Premium'}</span>
                    </button>
                    
                    <button 
                        onClick={() => setShowProfileModal(true)} 
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50'}`}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Profil</span>
                    </button>
                </div>
            </div>

            {/* Added padding at the bottom of the main content to avoid overlap with bottom bar */}
            <div className="h-24 md:h-0"></div>
            
        </div >
    )
}

