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
    X, Share2, Menu, Link2, Eye, Award, Trophy, Target, Medal, Gift,
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
    const [activeTab, setActiveTab] = useState('cvs')
    const [sidebarOpen, setSidebarOpen] = useState(false)
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
        { id: 'first-cv', title: 'İlk CV', icon: <FileText className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: true, color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
        { id: 'pro-member', title: 'Pro Üye', icon: <Crown className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: isPremium, color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
        { id: 'five-cvs', title: '5 CV Master', icon: <Trophy className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: (cvs?.length || 0) >= 5, color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
        { id: 'downloader', title: 'İndirici', icon: <Download className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: true, color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
        { id: 'sharer', title: 'Paylaşımcı', icon: <Share2 className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: false, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' }
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
            document.documentElement.classList.toggle('dark', darkMode)
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <motion.aside 
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-64 glass-card border-r border-slate-200 dark:border-white/10 flex flex-col bg-white dark:bg-slate-950 shadow-2xl"
                        >
                            <div className="p-4 flex items-center justify-between h-16 border-b border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 tracking-tight">CVniz</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                                <button onClick={() => { setActiveTab('cvs'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'cvs' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                                    <LayoutGrid className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">Panel</span>
                                </button>
                                <button onClick={() => { setActiveTab('tools'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'tools' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                                    <Briefcase className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">Kariyer Araçları</span>
                                </button>
                                <button onClick={() => { setActiveTab('ai'); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'ai' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                                    <Sparkles className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">Yapay Zeka</span>
                                </button>
                                <div className="my-4 border-t border-slate-200 dark:border-white/10"></div>
                                <button onClick={() => { setShowJobSearch(true); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-all">
                                    <Search className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">İş İlanları</span>
                                </button>
                                <button onClick={() => { setShowCompareModal(true); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-all">
                                    <Columns className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">Karşılaştır</span>
                                </button>
                                <button onClick={() => { setOnboardingStep(0); setShowOnboarding(true); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-all">
                                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">Yardım</span>
                                </button>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Desktop */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 hidden lg:flex flex-col flex-shrink-0 z-40 sticky top-0 h-screen shadow-sm">
                <div className="p-4 flex items-center gap-3 h-16 border-b border-slate-200 dark:border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">CVniz</span>
                </div>
                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    <button onClick={() => setActiveTab('cvs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'cvs' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-100 dark:border-cyan-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                        <LayoutGrid className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Panel</span>
                    </button>
                    <button onClick={() => setActiveTab('tools')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'tools' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-100 dark:border-cyan-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                        <Briefcase className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Kariyer Araçları</span>
                    </button>
                    <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'ai' ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-sm border border-cyan-100 dark:border-cyan-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                        <Sparkles className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Yapay Zeka</span>
                    </button>

                    <div className="my-4 border-t border-slate-200 dark:border-white/10"></div>
                    
                    <button onClick={() => setShowJobSearch(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium transition-all">
                        <Search className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">İş İlanları</span>
                    </button>
                    <button onClick={() => setShowCompareModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium transition-all">
                        <Columns className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Karşılaştır</span>
                    </button>
                    <button onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium transition-all">
                        <HelpCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">Yardım</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                
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

            
                {/* Header Topbar */}
                <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/10 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-xl shadow-sm">
                    {/* Mobile Logo & Menu Button */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-white/10">
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-gray-300"
                                title={darkMode ? 'Açık Tema' : 'Koyu Tema'}
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Notifications */}
                            <NotificationBell />

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 sm:gap-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl p-1.5 transition-all"
                                >
                                    <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center">
                                        <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                                    </div>
                                    <div className="hidden sm:block text-left pr-2">
                                        <div className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">{user?.name || 'Kullanıcı'}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 font-semibold">
                                            {isPremium ? (
                                                <><Crown className="w-3 h-3 text-amber-500" /><span className="text-amber-500">Premium</span></>
                                            ) : (<span>Ücretsiz Plan</span>)}
                                        </div>
                                    </div>
                                    <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden py-2 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-2 bg-slate-50/50 dark:bg-slate-900/50">
                                                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 mb-0.5">Hesap</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.email}</p>
                                            </div>

                                            <button onClick={() => { setUserMenuOpen(false); setShowProfileModal(true); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <User className="w-4 h-4 text-slate-400" /> Profil Ayarları
                                            </button>
                                            <button onClick={() => { setUserMenuOpen(false); setShowSubscriptionManager(true); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <Crown className="w-4 h-4 text-amber-500" /> Abonelik
                                            </button>
                                            
                                            <div className="my-2 border-t border-slate-100 dark:border-white/5"></div>
                                            <button onClick={() => { setUserMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                                <LogOut className="w-4 h-4" /> Güvenli Çıkış
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
                    <main className="max-w-6xl mx-auto space-y-8 pb-12">
                        
                        {/* Welcome Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                                    {greeting}, <span className="text-cyan-600 dark:text-cyan-400">{user?.name?.split(' ')[0] || 'Kullanıcı'}</span>
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Kariyer paneline hoş geldin. Bugün neler başarmak istiyorsun?</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link to="/editor" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 rounded-xl font-medium shadow-sm transition-all hover:-translate-y-0.5">
                                    <Plus className="w-4 h-4" />
                                    <span>Yeni CV Oluştur</span>
                                </Link>
                            </div>
                        </div>

                        {/* Top Navigation Tabs */}
                        <div className="flex overflow-x-auto custom-scrollbar p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl max-w-fit">
                            <button onClick={() => setActiveTab('cvs')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'cvs' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'}`}>
                                <FileText className="w-4 h-4" /> Özgeçmişlerim
                            </button>
                            <button onClick={() => setActiveTab('tools')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'tools' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'}`}>
                                <Briefcase className="w-4 h-4" /> Kariyer Araçları
                            </button>
                            <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'ai' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'}`}>
                                <Sparkles className="w-4 h-4" /> Yapay Zeka (AI)
                            </button>
                        </div>

                        {/* TAB 1: CVs */}
                        {activeTab === 'cvs' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Aktif Özgeçmiş', value: cvs?.length || 0, icon: <FileText className="text-blue-500" /> },
                                        { label: 'Görüntülenme', value: cvs?.reduce((acc, cv) => acc + (getCVViewStats?.(cv.id)?.total || 0), 0) || 0, icon: <Eye className="text-emerald-500" /> },
                                        { label: 'Başvurular', value: 3, icon: <Briefcase className="text-purple-500" /> },
                                        { label: 'Profil Skoru', value: 'B+', icon: <Star className="text-amber-500" /> }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{stat.label}</span>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                                    {stat.icon}
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* CV Grid */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <LayoutGrid className="w-5 h-5 text-cyan-500" />
                                            Kayıtlı Özgeçmişlerim
                                        </h2>
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text" 
                                                placeholder="CV Ara..." 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-700 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {filteredCVs.length === 0 ? (
                                        <div className="text-center py-16 px-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2">Henüz CV bulunamadı</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">Sistemde kayıtlı bir özgeçmişiniz yok. Hemen yeni bir tane oluşturarak kariyerinize yön verin.</p>
                                            <Link to="/editor" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium transition-colors">
                                                <Plus className="w-5 h-5" /> İlk Özgeçmişini Yarat
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredCVs.map((cv) => (
                                                <div key={cv.id} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all hover:shadow-lg relative overflow-hidden">
                                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                                        <div className="w-12 h-16 rounded-lg bg-white dark:bg-slate-700 shadow flex items-center justify-center text-2xl border border-slate-200 dark:border-white/10">
                                                            {getTemplateEmoji(cv.template)}
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Link to={`/editor/${cv.id}`} className="p-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-gray-300 hover:text-cyan-500 rounded-lg shadow-sm border border-slate-200 dark:border-white/10 transition-colors">
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                            <button onClick={() => handleShare(cv)} className="p-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-gray-300 hover:text-blue-500 rounded-lg shadow-sm border border-slate-200 dark:border-white/10 transition-colors">
                                                                <Share2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 dark:text-white truncate mb-1 relative z-10" title={cv.name}>{cv.name}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mb-4 relative z-10">{cv.template} Tema</p>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-white/10 relative z-10">
                                                        <span>Güncelleme: {formatTimeAgo(cv.updatedAt)}</span>
                                                        <button onClick={() => setDeleteConfirm(cv.id)} className="text-red-500 hover:text-red-600 p-1">Sil</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <ReferralWidget />
                                <AnnouncementBanner />
                            </motion.div>
                        )}

                        {/* TAB 2: TOOLS */}
                        {activeTab === 'tools' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white px-2">Profesyonel Kariyer Araçları</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <button onClick={() => setShowATSModal(true)} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all shadow-sm group">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">ATS Analizi</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left line-clamp-2">CV'nizi sistemler için optimize edin ve uyumluluk puanını görün.</p>
                                    </button>

                                    <button onClick={() => setShowCoverLetterModal(true)} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 rounded-2xl transition-all shadow-sm group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Ön Yazı Oluşturucu</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left line-clamp-2">Başvurduğunuz işe özel profesyonel ön yazılar (Cover Letter) hazırlayın.</p>
                                    </button>

                                    <button onClick={() => setShowTranslatorModal(true)} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 rounded-2xl transition-all shadow-sm group">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Globe2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Profesyonel Çevirmen</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left line-clamp-2">CV'nizi saniyeler içinde yabancı dillere eksiksiz çevirin.</p>
                                    </button>

                                    <button onClick={() => setShowInterviewCoach(true)} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 rounded-2xl transition-all shadow-sm group">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Mülakat Koçu</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left line-clamp-2">Sıkça sorulan sorularla mülakatlara hazırlanıp pratik yapın.</p>
                                    </button>
                                    
                                    <button onClick={() => setShowSalaryNegotiator(true)} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 rounded-2xl transition-all shadow-sm group">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Maaş Karşılaştır</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left line-clamp-2">Sektörel maaş beklentilerini analiz ederek doğru müzakere yapın.</p>
                                    </button>
                                    
                                    <button onClick={() => setShowCareerTest(true)} className="flex flex-col items-start p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 rounded-2xl transition-all shadow-sm group">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Kariyer Testi</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-left line-clamp-2">Kişilik testleri ile yeteneklerinize uygun ideal meslekleri bulun.</p>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 3: AI TOOLS */}
                        {activeTab === 'ai' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white px-2">Yapay Zeka Destekli Asistan</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <button onClick={() => setShowProjectWriter(true)} className="flex items-center gap-5 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-cyan-100 dark:border-white/5 hover:border-cyan-400 rounded-2xl transition-all shadow-sm group text-left">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                            <Sparkles className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">AI Proje Yazarı</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Projeleriniz için profesyonel açıklamalar ve vaka analizleri üretin.</p>
                                        </div>
                                    </button>

                                    <button onClick={() => setShowLinkedInOptimizer(true)} className="flex items-center gap-5 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border border-blue-100 dark:border-white/5 hover:border-blue-400 rounded-2xl transition-all shadow-sm group text-left">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                            <Link2 className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">LinkedIn Optimizer</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">LinkedIn profilinizi inceleyip daha dikkat çekici hale getirin.</p>
                                        </div>
                                    </button>
                                    
                                    <button onClick={() => setShowReferenceLetter(true)} className="flex items-center gap-5 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 border border-amber-100 dark:border-white/5 hover:border-amber-400 rounded-2xl transition-all shadow-sm group text-left">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                                            <Mail className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">AI Referans Mektubu</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Otomatik referans ve niyet mektupları hazırlayın.</p>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
