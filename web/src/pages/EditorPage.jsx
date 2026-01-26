import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import {
    ArrowLeft, Download, Eye, Printer, ChevronLeft, ChevronRight, Save, LogIn, Crown, Sparkles,
    UserPlus, Lock, Shield, Check, X, AlertTriangle, Layout, Type, Palette, Settings as SettingsIcon,
    History, Share2, ZoomIn, ZoomOut, Maximize2, Monitor, Laptop, Tablet, Smartphone, Search,
    User, Briefcase, GraduationCap, Wrench, Menu, Trophy, FolderKanban, Award, Users, Heart, GitBranch, Linkedin, FileText, Globe2,
    Edit3, PanelLeft
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useCV } from '../context/CVContext'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import PremiumFeaturesPanel from '../components/PremiumFeaturesPanel'
import { sampleCVData, emptyCV } from '../data/sampleData'
import { exportToPDF, printCV, exportToPNG, exportToJSON, exportToHTML, exportToDOCX } from '../utils/pdfExport'
import { preloadTemplate } from '../templates/templateLoader'
import { useTemplates } from '../context/TemplateContext'
import TemplateSwitcher from '../components/TemplateSwitcher'
import AuthRequiredModal from '../components/AuthRequiredModal'
import VersionHistoryModal from '../components/VersionHistoryModal'
import LinkedInImport from '../components/LinkedInImport'
import CVImporter from '../components/CVImporter'
import { usePersistence } from '../context/PersistenceContext'
import { Undo2, Redo2, Cloud, CloudOff, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import UpsellModal from '../components/UpsellModal'

const editorTabs = [
    { id: 'personal', label: 'Kişisel', icon: <User className="w-5 h-5" /> },
    { id: 'experience', label: 'Deneyim', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'education', label: 'Eğitim', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'skills', label: 'Beceriler', icon: <Wrench className="w-5 h-5" /> },
    { id: 'projects', label: 'Projeler', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'certifications', label: 'Sertifikalar', icon: <Award className="w-5 h-5" /> },
    { id: 'custom', label: 'Özel', icon: <Type className="w-5 h-5" /> },
    { id: 'references', label: 'Referanslar', icon: <Users className="w-5 h-5" /> },
    { id: 'hobbies', label: 'Hobiler', icon: <Heart className="w-5 h-5" /> },
    { id: 'templates', label: 'Şablonlar', icon: <Layout className="w-5 h-5" /> },
    { id: 'styling', label: 'Görünüm', icon: <Palette className="w-5 h-5" /> },
    { id: 'settings', label: 'Ayarlar', icon: <SettingsIcon className="w-5 h-5" /> }
]

export default function EditorPage() {
    const { cvId } = useParams()
    const navigate = useNavigate()
    const { user, isPremium, getProfile, saveProfile } = useAuth()
    const { toast } = useToast()
    const { cvs, saveCV, updateCV, getVersions } = useCV()
    const { templates, getTemplateConfig } = useTemplates()
    const [searchParams] = useSearchParams()
    const {
        syncStatus, lastSynced, undo, redo, addToHistory,
        syncToCloud, canUndo, canRedo, isOnline
    } = usePersistence()

    const [cvData, setCvData] = useState(emptyCV)
    const [selectedTemplate, setSelectedTemplate] = useState('modern')
    const [cvName, setCvName] = useState('Yeni Özgeçmiş')
    const [activeTab, setActiveTab] = useState('personal')
    const [zoom, setZoom] = useState(100)
    const [isExporting, setIsExporting] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [showPremiumPanel, setShowPremiumPanel] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)
    const exportMenuRef = useRef(null)

    // Check if current template is premium
    const isTemplatePremium = useMemo(() => {
        const currentTemplate = getTemplateConfig(selectedTemplate)
        return currentTemplate?.premium ?? false
    }, [selectedTemplate, getTemplateConfig])

    // Can user download? (Free template OR premium user)
    const canDownload = !isTemplatePremium || isPremium
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [highlightedField, setHighlightedField] = useState(null)
    const [theme, setTheme] = useState({
        accentColor: '#06b6d4',
        fontSize: 'Normal',
        language: 'tr',
        showQrCode: false,
        fontFamily: 'Inter',
        webAccentColor: '#2563eb',
        webBackgroundColor: '#ffffff',
        webTextColor: '#111827',
        webFontFamily: 'Inter',
        webPattern: 'grid'
    })
    const [viewportMode, setViewportMode] = useState('desktop')
    const [showClearModal, setShowClearModal] = useState(false)
    const [showATSModal, setShowATSModal] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [activeAuthFeature, setActiveAuthFeature] = useState('')
    const [atsScore, setAtsScore] = useState(0)
    const [atsTips, setAtsTips] = useState([])
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
    const [showVersionModal, setShowVersionModal] = useState(false)
    const [showLinkedInModal, setShowLinkedInModal] = useState(false)
    const [showCVImporter, setShowCVImporter] = useState(false)
    const [showUpsellModal, setShowUpsellModal] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Update local theme when template changes to use admin defaults
    useEffect(() => {
        const config = getTemplateConfig(selectedTemplate)
        if (config && config.colors && Object.keys(config.colors).length > 0) {
            setTheme(prev => ({
                ...prev,
                webAccentColor: config.colors.accent || prev.webAccentColor,
                webBackgroundColor: config.colors.bg || prev.webBackgroundColor,
                webTextColor: config.colors.text || prev.webTextColor,
                webFontFamily: config.styles?.fontFamily?.replace(/'/g, "") || prev.webFontFamily,
                accentColor: config.colors.accent || prev.accentColor
            }))
        }
    }, [selectedTemplate, getTemplateConfig])
    const [upsellTriggerType, setUpsellTriggerType] = useState('download')
    const scrollRef = useRef(null)
    const [uiTheme, setUiTheme] = useState('day')

    // Mobile-specific states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobilePreviewMode, setMobilePreviewMode] = useState(false)

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    const isDayMode = uiTheme === 'day'
    const selectionColor = isDayMode ? 'selection:bg-sky-200/70' : 'selection:bg-cyan-500/30'
    const versionOptions = useMemo(() => (cvId ? getVersions(cvId) : []), [cvId, getVersions])

    const calculateATSScore = () => {
        if (!user) {
            setActiveAuthFeature('ATS Analizini')
            setShowAuthModal(true)
            return
        }

        let score = 0
        let tips = []

        // Summary check
        if (cvData.personal.summary?.length > 100) {
            score += 20
        } else {
            tips.push("Profesyonel özetinizi biraz daha detaylandırın (min. 100 karakter).")
        }

        // Skills check
        if (cvData.skills.length >= 5) {
            score += 20
        } else {
            tips.push("En az 5 teknik beceri eklemek görünürlüğünüzü artırır.")
        }

        // Experience check
        if (cvData.experience.length > 0) {
            score += 30
            const hasLongDesc = cvData.experience.some(e => e.description?.length > 50)
            if (hasLongDesc) score += 10
            else tips.push("İş deneyimi açıklamalarınıza başarılarınızı ekleyin.")
        } else {
            tips.push("En az bir iş deneyimi veya staj eklemelisiniz.")
        }

        // Contact info
        if (cvData.personal.email && cvData.personal.phone && cvData.personal.location) {
            score += 20
        } else {
            tips.push("E-posta, telefon ve konum bilgilerinin tam olduğundan emin olun.")
        }

        setAtsScore(score)
        setAtsTips(tips)
        setShowATSModal(true)
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem('CVniz-home-theme')
        if (stored === 'day' || stored === 'night') {
            setUiTheme(stored)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handler = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setUiTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handler)
        return () => window.removeEventListener('CVniz-theme-change', handler)
    }, [])

    // History & Auto-save logic
    useEffect(() => {
        if (!cvData) return

        // Add to history for undo/redo
        addToHistory(cvData)

        // Auto-save logic
        const timer = setTimeout(() => {
            if (cvId && user) {
                syncToCloud(cvId, cvData, selectedTemplate, cvName)
            } else if (!cvId) {
                localStorage.setItem('cv_draft_data', JSON.stringify({
                    data: cvData,
                    template: selectedTemplate,
                    name: cvName,
                    theme: theme
                }))
            }
        }, 30000) // 30 seconds auto-save requirement

        return () => clearTimeout(timer)
    }, [cvData, cvName, selectedTemplate])

    const handleUndo = () => {
        const prevState = undo()
        if (prevState) setCvData(prevState)
    }

    const handleRedo = () => {
        const nextState = redo()
        if (nextState) setCvData(nextState)
    }

    useEffect(() => {
        if (cvId && cvs.length > 0) {
            const existingCV = cvs.find(c => c.id === cvId)
            if (existingCV) {
                setCvData(existingCV.data)
                setSelectedTemplate(existingCV.template)
                setCvName(existingCV.name)
                if (existingCV.theme) setTheme(existingCV.theme)
            }
        }
    }, [cvId, cvs])

    // Auto-save logic (to localStorage for guests)
    useEffect(() => {
        if (!user && !cvId) {
            localStorage.setItem('cv_draft_data', JSON.stringify({
                data: cvData,
                template: selectedTemplate,
                name: cvName,
                theme: theme
            }))
        }
    }, [cvData, selectedTemplate, cvName, theme, user, cvId])

    // Load draft on mount for guests
    useEffect(() => {
        if (!user && !cvId) {
            const draft = localStorage.getItem('cv_draft_data')
            if (draft) {
                try {
                    const parsed = JSON.parse(draft)
                    setCvData(parsed.data)
                    setSelectedTemplate(parsed.template)
                    setCvName(parsed.name)
                    if (parsed.theme) setTheme(parsed.theme)
                } catch (e) { console.error('Draft load error', e) }
            }
        }
    }, [])

    // URL params initialization
    useEffect(() => {
        const templateParam = searchParams.get('template')
        const sampleParam = searchParams.get('sample')
        const aiParam = searchParams.get('ai')

        if (templateParam && templates.some(t => t.id === templateParam)) {
            setSelectedTemplate(templateParam)
        }

        if (sampleParam === 'true') {
            setCvData(sampleCVData)
        }

        // Load AI-generated data from homepage
        if (aiParam === 'true') {
            const aiData = localStorage.getItem('CVniz_ai_generated')
            if (aiData) {
                try {
                    const { jobTitle, summary } = JSON.parse(aiData)
                    setCvData(prev => ({
                        ...prev,
                        personal: {
                            ...prev.personal,
                            title: jobTitle || prev.personal.title
                        },
                        summary: summary || prev.summary
                    }))
                    setCvName(`${jobTitle || 'AI'} CV`)
                    // Clear the stored data
                    localStorage.removeItem('CVniz_ai_generated')
                } catch (err) {
                    console.error('AI data parse error:', err)
                }
            }
        }
    }, [searchParams])

    // Auto-fill from saved profile for new CVs
    useEffect(() => {
        if (!cvId && user && getProfile) {
            const savedProfile = getProfile()
            if (savedProfile) {
                setCvData(prev => ({
                    ...prev,
                    personal: {
                        ...prev.personal,
                        fullName: savedProfile.fullName || prev.personal.fullName,
                        title: savedProfile.title || prev.personal.title,
                        email: savedProfile.email || user.email || prev.personal.email,
                        phone: savedProfile.phone || prev.personal.phone,
                        location: savedProfile.location || prev.personal.location,
                        website: savedProfile.website || prev.personal.website,
                        linkedin: savedProfile.linkedin || prev.personal.linkedin,
                        photo: savedProfile.photo || prev.personal.photo
                    },
                    summary: savedProfile.summary || prev.summary
                }))
            } else if (user?.name || user?.email) {
                // At minimum, use the registered name and email
                setCvData(prev => ({
                    ...prev,
                    personal: {
                        ...prev.personal,
                        fullName: user.name || prev.personal.fullName,
                        email: user.email || prev.personal.email
                    }
                }))
            }
        }
    }, [cvId, user, getProfile])

    // Track if data has changed for auto-save
    const lastSavedDataRef = useRef(null)
    const isSavingRef = useRef(false)

    // Auto-save every 5 seconds (only if data changed)
    useEffect(() => {
        const autoSaveInterval = setInterval(async () => {
            // Create a snapshot of current data
            const currentSnapshot = JSON.stringify({ data: cvData, template: selectedTemplate, name: cvName })

            // Skip if nothing changed or already saving
            if (currentSnapshot === lastSavedDataRef.current || isSavingRef.current) {
                return
            }

            // Save to localStorage always (as backup/draft)
            localStorage.setItem('CVniz_draft', JSON.stringify({
                data: cvData,
                template: selectedTemplate,
                name: cvName,
                theme,
                lastSaved: new Date().toISOString()
            }))

            // If user is logged in and has an existing CV, update it
            if (user && cvId) {
                isSavingRef.current = true
                try {
                    const result = await updateCV(cvId, { data: cvData, template: selectedTemplate, name: cvName })
                    if (result.success) {
                        lastSavedDataRef.current = currentSnapshot
                        console.log('✅ Auto-saved to cloud')
                    }
                } catch (err) {
                    console.error('Auto-save error:', err)
                } finally {
                    isSavingRef.current = false
                }
            } else {
                // For guests or new CVs, just save to localStorage
                lastSavedDataRef.current = currentSnapshot
            }
        }, 5000) // 5 seconds

        return () => clearInterval(autoSaveInterval)
    }, [cvData, selectedTemplate, cvName, theme, user, cvId, updateCV])

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault()
                    handleUndo()
                } else if (e.key === 'y') {
                    e.preventDefault()
                    handleRedo()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [canUndo, canRedo, cvData]) // Dependencies for handleUndo/redo

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        let isDown = false
        let startX
        let scrollLeft

        const onWheel = (e) => {
            if (e.deltaY === 0) return
            e.preventDefault()
            el.scrollLeft += e.deltaY * 1.5
        }

        const onMouseDown = (e) => {
            isDown = true
            el.classList.add('active')
            startX = e.pageX - el.offsetLeft
            scrollLeft = el.scrollLeft
        }

        const onMouseLeave = () => {
            isDown = false
            el.classList.remove('active')
        }

        const onMouseUp = () => {
            isDown = false
            el.classList.remove('active')
        }

        const onMouseMove = (e) => {
            if (!isDown) return
            e.preventDefault()
            const x = e.pageX - el.offsetLeft
            const walk = (x - startX) * 2 // Scroll speed
            el.scrollLeft = scrollLeft - walk
        }

        el.addEventListener('wheel', onWheel, { passive: false })
        el.addEventListener('mousedown', onMouseDown)
        el.addEventListener('mouseleave', onMouseLeave)
        el.addEventListener('mouseup', onMouseUp)
        el.addEventListener('mousemove', onMouseMove)

        // Right-click prevention for non-logged users
        const handleContextMenu = (e) => {
            if (!user) {
                e.preventDefault()
                setActiveAuthFeature('Özel Araçları')
                setShowAuthModal(true)
            }
        }
        window.addEventListener('contextmenu', handleContextMenu)

        return () => {
            el.removeEventListener('wheel', onWheel)
            el.removeEventListener('mousedown', onMouseDown)
            el.removeEventListener('mouseleave', onMouseLeave)
            el.removeEventListener('mouseup', onMouseUp)
            el.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [user])

    useEffect(() => {
        preloadTemplate(selectedTemplate)
    }, [selectedTemplate])

    const handleSave = async () => {
        if (!user) {
            setActiveAuthFeature('Özgeçmişinizi Kaydetmek')
            setShowAuthModal(true)
            return
        }

        try {
            let result
            if (cvId) {
                result = await updateCV(cvId, { data: cvData, template: selectedTemplate, name: cvName })
            } else {
                result = await saveCV(cvData, selectedTemplate, cvName)
            }

            if (result.success) {
                setSaveSuccess(true)
                setTimeout(() => setSaveSuccess(false), 2000)
                if (!cvId && result.cv) {
                    navigate(`/editor/${result.cv.id}`, { replace: true })
                }
            } else {
                console.error('Save error:', result.error)
                toast.error('Kaydetme hatası: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            console.error('Save exception:', error)
            toast.error('Kaydetme hatası: ' + error.message)
        }
    }

    const handleLoadSample = () => {
        setCvData(sampleCVData)
    }

    const handleClearAll = () => {
        setShowClearModal(true)
    }

    const confirmClear = () => {
        setCvData(emptyCV)
        if (!cvId) localStorage.removeItem('cv_draft_data')
        setShowClearModal(false)
    }

    const handleFormatExport = async (format) => {
        if (!user) {
            setActiveAuthFeature('İndirme Özelliğini')
            setShowAuthModal(true)
            setShowExportMenu(false)
            return
        }

        const currentTemplate = templates.find(t => t.id === selectedTemplate)
        const isTemplatePremium = currentTemplate?.isPremium ?? false

        if (isTemplatePremium && !isPremium) {
            // Show upsell modal for premium templates
            setUpsellTriggerType('template')
            setShowUpsellModal(true)
            setShowExportMenu(false)
            return
        }

        // Show upsell after first 2 downloads for free users
        if (!isPremium) {
            const downloadCount = parseInt(localStorage.getItem('CVniz_download_count') || '0')
            if (downloadCount >= 2) {
                setUpsellTriggerType('download')
                setShowUpsellModal(true)
                setShowExportMenu(false)
                return
            }
            localStorage.setItem('CVniz_download_count', String(downloadCount + 1))
        }

        setIsExporting(true)
        setShowExportMenu(false)

        try {
            const rawName = cvData.personal.fullName || 'Özgeçmiş'
            const safeName = rawName.trim().replace(/\s+/g, '_')
            const filename = `${safeName}_CV.${format}`

            switch (format) {
                case 'pdf':
                    await exportToPDF('cv-preview-frame', filename, isPremium)
                    break
                case 'png':
                    await exportToPNG('cv-preview-frame', filename)
                    break
                case 'json':
                    exportToJSON(cvData, filename)
                    break
                case 'html':
                    exportToHTML('cv-preview-frame', filename)
                    break
                case 'docx':
                    exportToDOCX('cv-preview-frame', filename)
                    break
                default:
                    break
            }
        } catch (error) {
            console.error(`${format} export failed:`, error)
        }
        setIsExporting(false)
    }

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const shellClasses = isDayMode
        ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900'
        : 'bg-[#0f1115] text-slate-200'
    const headerClasses = isDayMode
        ? 'bg-white/95 border-slate-200/80 text-slate-900 shadow-day'
        : 'bg-[#0f1115]/80 border-white/5 text-slate-200'
    const sidebarClasses = isDayMode
        ? 'bg-white border-slate-200/80 text-slate-800 shadow-day'
        : 'bg-[#0d0f12] border-white/5 text-slate-200'
    const formPanelClasses = isDayMode
        ? 'bg-white border-slate-200/80 text-slate-900 shadow-day'
        : 'bg-[#0f1115] border-white/5 text-white'
    const previewClasses = isDayMode
        ? 'bg-gradient-to-b from-slate-50 via-white to-slate-100'
        : 'bg-[#090a0d]'
    const toolbarClasses = isDayMode
        ? 'bg-white/90 border-slate-200/80 text-slate-700 shadow-day'
        : 'bg-[#0f1115]/40 border-white/5 text-slate-300'

    return (
        <div className={`fixed inset-0 flex flex-col overflow-hidden editor-page-shell mobile-full-height ${shellClasses} ${selectionColor}`}>
            {/* Mobile Backdrop for Sidebar */}
            {isMobile && (
                <div
                    className={`mobile-backdrop ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Top Bar - Responsive Header */}
            <header className={`h-14 md:h-20 border-b backdrop-blur-xl flex items-center justify-between px-3 md:px-6 shrink-0 z-50 ${headerClasses}`}>
                {/* Left Section */}
                <div className="flex items-center gap-2 md:gap-6">
                    {/* Mobile: Hamburger Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all md:hidden touch-target"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Desktop: Back Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hidden md:flex p-2 mr-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* CV Name - Compact on Mobile */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 md:gap-3">
                            <input
                                type="text"
                                value={cvName}
                                onChange={(e) => setCvName(e.target.value)}
                                className={`bg-transparent border-none text-sm font-bold tracking-tight focus:outline-none focus:ring-0 ${isDayMode ? 'text-slate-900' : 'text-white'} w-24 md:w-40`}
                            />

                            {/* Sync Status - Compact */}
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                {isOnline ? (
                                    syncStatus === 'syncing' ? (
                                        <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                                    ) : (
                                        <Cloud className="w-3 h-3 text-emerald-500" />
                                    )
                                ) : (
                                    <CloudOff className="w-3 h-3 text-amber-500" />
                                )}
                                <span className="hidden sm:inline font-black uppercase tracking-widest text-[8px]">
                                    {isOnline ? (syncStatus === 'syncing' ? 'Eşitleniyor' : 'Senkronize') : 'Çevrimdışı'}
                                </span>
                            </div>

                            {/* Undo/Redo - Hidden on Mobile */}
                            <div className={`hidden md:flex rounded-lg p-0.5 border ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                                <button
                                    onClick={handleUndo}
                                    disabled={!canUndo}
                                    className={`p-1 rounded transition-all ${canUndo ? 'text-slate-200 hover:bg-white/5' : 'text-slate-600'}`}
                                    title="Geri Al (Ctrl+Z)"
                                >
                                    <Undo2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={handleRedo}
                                    disabled={!canRedo}
                                    className={`p-1 rounded transition-all ${canRedo ? 'text-slate-200 hover:bg-white/5' : 'text-slate-600'}`}
                                    title="İleri Al (Ctrl+Y)"
                                >
                                    <Redo2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions - Hidden on Mobile */}
                        <div className="hidden lg:flex gap-2 mt-1">
                            <button onClick={handleLoadSample} className="text-[9px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-500/5 transition-all active:scale-95">Örnek Doldur</button>
                            <button onClick={() => setShowCVImporter(true)} className="text-[9px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/5 transition-all active:scale-95 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> CV Yükle
                            </button>
                            <button onClick={() => setShowLinkedInModal(true)} className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5 transition-all active:scale-95 flex items-center gap-1">
                                <Linkedin className="w-3 h-3" /> LinkedIn
                            </button>
                            <button onClick={handleClearAll} className="text-[9px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5 transition-all active:scale-95">Temizle</button>
                        </div>
                    </div>
                </div>

                {/* Mini Template Gallery - Hidden on Mobile/Tablet */}
                <div
                    ref={scrollRef}
                    className={`hidden xl:flex flex-1 max-w-4xl mx-12 items-center gap-4 overflow-x-auto no-scrollbar px-4 h-14 border-x cursor-grab active:cursor-grabbing select-none ${isDayMode ? 'border-slate-200/80 bg-white/60 rounded-[18px] shadow-inner text-slate-700' : 'border-white/5'}`}
                >
                    {templates.map((t) => {
                        const isSelected = selectedTemplate === t.id
                        const selectedCard = isDayMode
                            ? 'bg-sky-100 border-sky-300 text-slate-900 shadow-lg shadow-sky-200/80'
                            : 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                        const defaultCard = isDayMode
                            ? 'bg-white border border-slate-200 text-slate-600 hover:border-sky-200 hover:bg-slate-50 shadow-sm'
                            : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:bg-white/10'
                        return (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all relative group ${isSelected ? selectedCard : defaultCard}`}
                                title={t.name}
                            >
                                <span className="text-xl mb-0.5">{t.emoji}</span>
                                <div className="flex gap-0.5 w-6 h-[2px]">
                                    <div className={`h-full flex-1 rounded-full ${isSelected ? (isDayMode ? 'bg-slate-900' : 'bg-white') : isDayMode ? 'bg-slate-200 group-hover:bg-slate-300' : 'bg-slate-700 group-hover:bg-slate-500'}`} />
                                    <div className={`h-full flex-1 rounded-full ${isSelected ? (isDayMode ? 'bg-slate-500/60' : 'bg-white/50') : isDayMode ? 'bg-slate-100' : 'bg-slate-800'}`} />
                                </div>
                                {isSelected && (
                                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${isDayMode ? 'bg-sky-500 text-white border-white' : 'bg-cyan-500 text-slate-950 border-[#0f1115]'}`}>
                                        <Check className="w-2.5 h-2.5" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => setShowTemplateModal(true)}
                        className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl border border-dashed transition-all ${isDayMode
                            ? 'bg-white text-slate-500 border-slate-200 hover:border-sky-200 hover:text-slate-700 hover:bg-slate-50 shadow-sm'
                            : 'bg-white/5 text-slate-500 border-white/20 hover:text-white hover:border-white/40 hover:bg-white/10'
                            }`}
                    >
                        <Layout className="w-5 h-5 mb-1" />
                        <span className="text-[8px] font-black uppercase tracking-tight">Daha Fazla</span>
                    </button>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* AI Button - Desktop Only */}
                    <button
                        id="premium-panel-trigger"
                        onClick={() => setShowPremiumPanel(true)}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-cyan-500/20 transition-all font-bold text-xs"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI
                    </button>

                    {/* Save Button - Icon only on Mobile */}
                    <button
                        onClick={handleSave}
                        disabled={saveSuccess}
                        className={`flex items-center justify-center gap-2 p-2.5 md:px-4 md:py-2 rounded-xl border transition-all font-bold text-xs touch-target ${saveSuccess ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'}`}
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden md:inline">{saveSuccess ? 'KAYDEDİLDİ' : 'KAYDET'}</span>
                    </button>

                    {/* Version Button - Desktop Only */}
                    {cvId && (
                        <button
                            onClick={() => setShowVersionModal(true)}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all font-bold text-xs"
                            title="Versiyon Geçmişi"
                        >
                            <GitBranch className="w-4 h-4" />
                            VERSİYON
                        </button>
                    )}

                    {/* Download Button */}
                    <div className="relative" ref={exportMenuRef}>
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            disabled={isExporting}
                            className={`flex items-center justify-center gap-2 p-2.5 md:px-6 md:py-2 rounded-xl text-xs font-black shadow-xl transition-all touch-target ${canDownload ? 'btn-premium shadow-cyan-500/20' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20'}`}
                        >
                            {isExporting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : canDownload ? (
                                <Download className="w-4 h-4" />
                            ) : (
                                <Lock className="w-4 h-4" />
                            )}
                            <span className="hidden md:inline">
                                {isExporting ? 'İŞLENİYOR...' : canDownload ? 'İNDİR' : 'İNDİR (PRO)'}
                            </span>
                            <ChevronRight className={`hidden md:block w-3.5 h-3.5 transition-transform ${showExportMenu ? 'rotate-90' : ''}`} />
                        </button>

                        {showExportMenu && (
                            <div className={`absolute top-full right-0 mt-2 w-56 rounded-2xl border shadow-2xl py-2 overflow-hidden z-[100] animate-scale-in ${isDayMode
                                ? 'bg-white border-slate-200 shadow-lg'
                                : 'bg-[#1a1d24] border-white/20'
                                }`}>
                                {[
                                    { id: 'pdf', label: 'PDF Olarak İndir', icon: <FileText className="w-4 h-4" /> },
                                    { id: 'png', label: 'Resim (PNG)', icon: <Layout className="w-4 h-4" /> },
                                    { id: 'html', label: 'Web (HTML)', icon: <Globe2 className="w-4 h-4" /> },
                                    { id: 'docx', label: 'Word (DOCX)', icon: <Briefcase className="w-4 h-4" /> },
                                    { id: 'json', label: 'Veri (JSON)', icon: <Type className="w-4 h-4" /> }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleFormatExport(item.id)}
                                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${isDayMode
                                            ? 'hover:bg-sky-50 text-slate-700'
                                            : 'hover:bg-cyan-500/20 text-white'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDayMode
                                            ? 'bg-slate-100 text-sky-500'
                                            : 'bg-white/10 text-cyan-400'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        <span className={`text-sm font-semibold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Side Navigation - Slide-in Drawer on Mobile */}
                <nav className={`
                    ${isMobile
                        ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : 'relative w-20 lg:w-64'
                    } 
                    border-r flex flex-col shrink-0 ${sidebarClasses}
                `}>
                    {/* Mobile Drawer Header */}
                    {isMobile && (
                        <div className={`p-4 border-b flex items-center justify-between ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                            <span className={`text-sm font-black uppercase tracking-widest ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                                Menü
                            </span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-xl hover:bg-white/10 text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="flex-1 py-4 md:py-8 flex flex-col gap-2 px-3 md:px-4 overflow-y-auto custom-scrollbar">
                        {editorTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id)
                                    if (isMobile) {
                                        setMobileMenuOpen(false)
                                        setMobilePreviewMode(false)
                                    }
                                }}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative touch-target ${activeTab === tab.id
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'
                                    }`}
                            >
                                <div className={`${activeTab === tab.id ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:scale-110'} transition-transform`}>
                                    {tab.icon}
                                </div>
                                <span className={`text-sm font-bold tracking-tight whitespace-nowrap ${isMobile ? 'opacity-100' : (sidebarCollapsed ? 'opacity-0 lg:hidden' : 'opacity-100')}`}>
                                    {tab.label}
                                </span>
                                {activeTab === tab.id && (
                                    <div className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full" />
                                )}
                            </button>
                        ))}

                        {/* Mobile Quick Actions */}
                        {isMobile && (
                            <div className={`mt-4 pt-4 border-t space-y-2 ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                                <button
                                    onClick={() => { handleLoadSample(); setMobileMenuOpen(false) }}
                                    className="w-full mobile-menu-item"
                                >
                                    <Sparkles className="w-5 h-5 text-cyan-400" />
                                    Örnek Doldur
                                </button>
                                <button
                                    onClick={() => { setShowCVImporter(true); setMobileMenuOpen(false) }}
                                    className="w-full mobile-menu-item"
                                >
                                    <FileText className="w-5 h-5 text-emerald-400" />
                                    CV Yükle
                                </button>
                                <button
                                    onClick={() => { setShowLinkedInModal(true); setMobileMenuOpen(false) }}
                                    className="w-full mobile-menu-item"
                                >
                                    <Linkedin className="w-5 h-5 text-blue-400" />
                                    LinkedIn'den İçe Aktar
                                </button>
                                <button
                                    onClick={() => { handleClearAll(); setMobileMenuOpen(false) }}
                                    className="w-full mobile-menu-item text-red-400"
                                >
                                    <X className="w-5 h-5" />
                                    Temizle
                                </button>
                            </div>
                        )}
                    </div>

                    {/* CV Strength - Desktop Only */}
                    <div className={`hidden md:block p-4 border-t mt-auto ${isDayMode ? 'border-slate-200/80' : 'border-white/5'}`}>
                        <div className={`rounded-2xl p-4 border ${isDayMode ? 'bg-slate-50 border-slate-200 shadow-day text-slate-700' : 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/5'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDayMode ? 'bg-emerald-100 text-emerald-500' : 'bg-emerald-500/20'}`}>
                                    <Trophy className="w-4 h-4 text-current" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>CV GÜCÜ</span>
                            </div>
                            <div className={`h-1.5 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                                <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_8px_#10b981]" />
                            </div>
                            <p className={`text-[10px] mt-2 font-medium ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                %80'e ulaşmak için yetenek ekleyin
                            </p>
                        </div>
                    </div>
                </nav>

                {/* Form Editor Area - Conditional on Mobile */}
                <main className={`
                    ${isMobile
                        ? `absolute inset-0 transition-transform duration-300 ${mobilePreviewMode ? '-translate-x-full' : 'translate-x-0'}`
                        : 'relative w-full lg:w-[480px] shrink-0'
                    } 
                    border-r flex flex-col overflow-hidden ${formPanelClasses}
                `}>
                    <div className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar editor-form-container ${isMobile ? 'pb-24' : ''}`}>
                        <div className="max-w-md mx-auto">
                            <h2 className={`text-xl md:text-2xl font-black mb-2 tracking-tight uppercase italic flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                {editorTabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <div className="text-slate-500 text-xs md:text-sm mb-6 md:mb-10 font-bold uppercase tracking-widest flex items-center gap-3">
                                <div className={`w-6 md:w-8 h-px ${isDayMode ? 'bg-slate-300' : 'bg-slate-800'}`} />
                                <span className="hidden sm:inline">Profesyonel Editör Çekirdeği</span>
                                <span className="sm:hidden">Editör</span>
                            </div>

                            <CVForm
                                cvData={cvData}
                                setCvData={setCvData}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                isPremium={isPremium}
                                cvName={cvName}
                                setCvName={setCvName}
                                theme={theme}
                                setTheme={setTheme}
                                handleClearAll={handleClearAll}
                                setHighlightedField={setHighlightedField}
                                user={user}
                                selectedTemplate={selectedTemplate}
                                setSelectedTemplate={setSelectedTemplate}
                                cvId={cvId}
                                versions={versionOptions}
                            />
                        </div>
                    </div>
                </main>

                {/* Preview Area - Conditional on Mobile */}
                <section className={`
                    ${isMobile
                        ? `absolute inset-0 transition-transform duration-300 ${mobilePreviewMode ? 'translate-x-0' : 'translate-x-full'}`
                        : 'relative flex-1'
                    } 
                    overflow-hidden flex flex-col ${previewClasses}
                `}>
                    {/* Viewport Toolbar - Hidden on Mobile */}
                    <div className={`hidden md:flex h-14 border-b items-center justify-between px-8 z-20 backdrop-blur-2xl ${toolbarClasses}`}>
                        <div className="flex items-center gap-8">
                            {/* Device Mode Switcher */}
                            <div className={`flex items-center rounded-[14px] p-1 border shadow-inner ${isDayMode ? 'bg-white border-slate-200/70' : 'bg-black/40 border-white/5'}`}>
                                {[
                                    { id: 'desktop', icon: Monitor, label: 'Masaüstü' },
                                    { id: 'laptop', icon: Laptop, label: 'Dizüstü' },
                                    { id: 'tablet', icon: Tablet, label: 'Tablet' },
                                    { id: 'mobile', icon: Smartphone, label: 'Mobil' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setViewportMode(item.id)}
                                        className={`p-2 rounded-xl transition-all duration-300 relative group ${viewportMode === item.id
                                            ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                                            }`}
                                        title={item.label}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {viewportMode === item.id && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="h-4 w-px bg-white/10" />

                            {/* Zoom Controls */}
                            <div className={`flex items-center gap-1 rounded-xl px-2 py-1 border ${isDayMode ? 'bg-white border-slate-200/70 text-slate-600' : 'bg-black/20 border-white/5'}`}>
                                <button
                                    onClick={() => setZoom(z => Math.max(z - 10, 30))}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <div className="px-3 min-w-[60px] text-center">
                                    <span className="text-[10px] font-black text-cyan-400/80 uppercase tracking-[0.2em]">{zoom}%</span>
                                </div>
                                <button
                                    onClick={() => setZoom(z => Math.min(z + 10, 200))}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => setZoom(100)}
                                    className="ml-2 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                                >
                                    SIFIRLA
                                </button>
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 group cursor-help">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-emerald-400 transition-colors">
                                    Canlı Önizleme Aktif
                                </span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <button
                                onClick={calculateATSScore}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
                            >
                                <Sparkles className="w-3 h-3" /> ATS SKORU
                            </button>
                            <div className="h-4 w-px bg-white/10" />
                            <button className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Preview Header */}
                    {isMobile && mobilePreviewMode && (
                        <div className={`h-12 border-b flex items-center justify-between px-4 ${toolbarClasses}`}>
                            <span className={`text-sm font-bold ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                                Önizleme
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setZoom(z => Math.max(z - 10, 30))}
                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 touch-target"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="text-[10px] font-black text-cyan-400">{zoom}%</span>
                                <button
                                    onClick={() => setZoom(z => Math.min(z + 10, 200))}
                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 touch-target"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Infinite Canvas Container */}
                    <div
                        className={`flex-1 overflow-auto p-4 md:p-12 lg:p-24 relative flex justify-center custom-scrollbar bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] ${isMobile ? 'pb-24' : ''}`}
                        onContextMenu={(e) => {
                            if (!isPremium) {
                                e.preventDefault()
                                setContextMenu({ visible: true, x: e.clientX, y: e.clientY })
                            }
                        }}
                        onClick={() => setContextMenu({ visible: false, x: 0, y: 0 })}
                    >
                        <div
                            className="transition-all duration-300 origin-top shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/5 rounded-sm overflow-hidden bg-white flex flex-col"
                            style={{
                                width: isMobile ? '100%' : (viewportMode === 'mobile' ? '375px' : viewportMode === 'tablet' ? '768px' : '210mm'),
                                maxWidth: isMobile ? '100%' : 'none',
                                minHeight: viewportMode === 'mobile' ? '667px' : viewportMode === 'tablet' ? '1024px' : '297mm',
                                transform: isMobile ? `scale(${Math.min(zoom / 100, 0.9)})` : `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                                height: 'fit-content'
                            }}
                        >
                            <div id="cv-preview-frame" className="h-full">
                                <CVPreview
                                    cvData={cvData}
                                    template={selectedTemplate}
                                    showWatermark={!isPremium}
                                    theme={theme}
                                    highlightedField={highlightedField}
                                />
                            </div>
                        </div>

                        {/* Right-click Context Menu for Free Users */}
                        {contextMenu.visible && (
                            <div
                                className="fixed z-[200] glass-card rounded-xl border border-white/20 shadow-2xl py-2 min-w-[200px] animate-scale-in"
                                style={{ left: contextMenu.x, top: contextMenu.y }}
                            >
                                <button
                                    onClick={() => {
                                        setContextMenu({ visible: false, x: 0, y: 0 })
                                        setShowPremiumPanel(true)
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                                >
                                    <Crown className="w-5 h-5 text-amber-400" />
                                    <div>
                                        <div className="font-bold text-sm">Premium'a Geç</div>
                                        <div className="text-xs text-gray-400">Watermark'sız PDF indir</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setContextMenu({ visible: false, x: 0, y: 0 })
                                        navigate('/checkout?plan=pro&cycle=yearly')
                                    }}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                                >
                                    <Sparkles className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <div className="font-bold text-sm">200+ Şablon Aç</div>
                                        <div className="text-xs text-gray-400">Tüm premium şablonlar</div>
                                    </div>
                                </button>
                                <div className="border-t border-white/10 my-2" />
                                <button
                                    onClick={() => setContextMenu({ visible: false, x: 0, y: 0 })}
                                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-gray-400 text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Kapat
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Mobile Bottom Toggle Bar */}
                {isMobile && (
                    <div className={`mobile-toggle-bar ${isDayMode ? 'mobile-toggle-bar-day' : ''}`}>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setMobilePreviewMode(false)}
                                className={`mobile-toggle-btn ${!mobilePreviewMode ? 'active' : ''}`}
                            >
                                <Edit3 className="w-5 h-5" />
                                <span>Düzenle</span>
                            </button>
                            <button
                                onClick={() => setMobilePreviewMode(true)}
                                className={`mobile-toggle-btn ${mobilePreviewMode ? 'active' : ''}`}
                            >
                                <Eye className="w-5 h-5" />
                                <span>Önizleme</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ATS Score Modal */}
            {showATSModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className={`absolute inset-0 backdrop-blur-sm animate-in fade-in duration-300 ${isDayMode ? 'bg-slate-900/20' : 'bg-[#0f1115]/80'}`}
                        onClick={() => setShowATSModal(false)}
                    />
                    <div className={`relative w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border ${isDayMode ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#161920] border-white/5'}`}>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-2">
                                        Analiz Raporu
                                    </div>
                                    <h2 className="text-2xl font-black text-white italic">ATS Optimizasyonu</h2>
                                </div>
                                <button
                                    onClick={() => setShowATSModal(false)}
                                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center mb-10">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="64" cy="64" r="58"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            className="text-white/5"
                                        />
                                        <circle
                                            cx="64" cy="64" r="58"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="10"
                                            strokeDasharray={364}
                                            strokeDashoffset={364 - (364 * atsScore) / 100}
                                            className={`${atsScore > 80 ? 'text-emerald-500' : atsScore > 50 ? 'text-cyan-500' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-white">{atsScore}</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Puan</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">İyileştirme Önerileri</h3>
                                <div className="space-y-2 max-h-[200px] overflow-auto custom-scrollbar pr-2">
                                    {atsTips.length > 0 ? atsTips.map((tip, i) => (
                                        <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-4 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                            <p className="text-xs font-medium text-slate-300 leading-relaxed">{tip}</p>
                                        </div>
                                    )) : (
                                        <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-center">
                                            <Check className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                                            <p className="text-xs font-bold text-emerald-400">Harika! Özgeçmişiniz ATS dostu ve optimize edilmiş durumda.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/5 flex gap-3">
                            <button
                                onClick={() => setShowATSModal(false)}
                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                            >
                                KAPAT
                            </button>
                            {atsScore < 100 && (
                                <button
                                    onClick={() => {
                                        setShowATSModal(false)
                                        setActiveTab('personal')
                                    }}
                                    className="flex-1 py-4 bg-cyan-500 text-slate-950 hover:bg-cyan-400 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    DÜZENLEMEYE GİT
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <TemplateSwitcher
                isOpen={showTemplateModal || activeTab === 'templates'}
                onClose={() => {
                    setShowTemplateModal(false)
                    if (activeTab === 'templates') setActiveTab('personal')
                }}
                selectedTemplate={selectedTemplate}
                onSelect={(id) => {
                    setSelectedTemplate(id)
                    setShowTemplateModal(false)
                    if (activeTab === 'templates') setActiveTab('personal')
                }}
                isPremium={isPremium}
                uiTheme={uiTheme}
            />

            {/* Auth Required Modal */}
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                featureName={activeAuthFeature}
            />

            {/* Hidden Button for triggers from CVForm or other child components */}
            <button
                id="auth-modal-trigger"
                className="hidden"
                onClick={(e) => {
                    const feature = e.currentTarget.getAttribute('data-feature') || 'Bu özelliği'
                    setActiveAuthFeature(feature)
                    setShowAuthModal(true)
                }}
            />

            {/* Hidden Button for trigger from CVForm */}
            <button id="template-modal-trigger" className="hidden" onClick={() => setShowTemplateModal(true)} />

            {/* Premium Features Overlay */}
            {showPremiumPanel && (
                <PremiumFeaturesPanel
                    cvData={cvData}
                    setCVData={setCvData}
                    onClose={() => setShowPremiumPanel(false)}
                />
            )}

            {/* Modern Clear Confirmation Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowClearModal(false)}
                    />
                    <div className={`relative w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border ${isDayMode ? 'bg-white border-slate-200/80 text-slate-900' : 'bg-[#16181d] border-white/10'}`}>
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-lg shadow-red-500/5 rotate-3">
                                <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic mt-2">
                                EMİN MİSİNİZ?
                            </h3>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 px-4">
                                Tüm verileriniz kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowClearModal(false)}
                                    className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                >
                                    İPTAL ET
                                </button>
                                <button
                                    onClick={confirmClear}
                                    className="px-6 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                                >
                                    VERİLERİ SİL
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowClearModal(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Version History Modal */}
            <VersionHistoryModal
                cvId={cvId}
                cvName={cvName}
                isOpen={showVersionModal}
                onClose={() => setShowVersionModal(false)}
                onRestore={() => {
                    // Reload CV data after version restore
                    const allCVs = JSON.parse(localStorage.getItem('CVniz_cvs') || '[]')
                    const cv = allCVs.find(c => c.id === cvId)
                    if (cv) {
                        setCvData(cv.data)
                        setSelectedTemplate(cv.template)
                    }
                }}
            />

            {/* LinkedIn Import Modal */}
            <LinkedInImport
                isOpen={showLinkedInModal}
                onClose={() => setShowLinkedInModal(false)}
                onImport={(data) => {
                    if (data?.personal) {
                        setCvData(prev => ({
                            ...prev,
                            personal: { ...prev.personal, ...data.personal },
                            experience: data.experience?.length ? data.experience : prev.experience,
                            education: data.education?.length ? data.education : prev.education,
                            skills: data.skills?.length ? data.skills : prev.skills,
                            certifications: data.certifications?.length ? data.certifications : prev.certifications
                        }))
                    }
                }}
            />

            {/* CV Importer Modal */}
            <CVImporter
                isOpen={showCVImporter}
                onClose={() => setShowCVImporter(false)}
                onImport={(importedCV) => {
                    if (importedCV) {
                        // Transform imported data to match our CV structure
                        setCvData(prev => ({
                            ...prev,
                            personal: {
                                ...prev.personal,
                                name: importedCV.personalInfo?.name || prev.personal.name,
                                title: importedCV.personalInfo?.title || prev.personal.title,
                                email: importedCV.personalInfo?.email || prev.personal.email,
                                phone: importedCV.personalInfo?.phone || prev.personal.phone,
                                location: importedCV.personalInfo?.location || prev.personal.location,
                                linkedin: importedCV.personalInfo?.linkedin || prev.personal.linkedin,
                                github: importedCV.personalInfo?.github || prev.personal.github,
                                website: importedCV.personalInfo?.website || prev.personal.website,
                                summary: importedCV.personalInfo?.summary || prev.personal.summary
                            },
                            experience: importedCV.experience?.length ? importedCV.experience : prev.experience,
                            education: importedCV.education?.length ? importedCV.education : prev.education,
                            skills: importedCV.skills?.length ? importedCV.skills : prev.skills,
                            languages: importedCV.languages?.length ? importedCV.languages : prev.languages,
                            certifications: importedCV.certificates?.length ? importedCV.certificates : prev.certifications,
                            projects: importedCV.projects?.length ? importedCV.projects : prev.projects
                        }))
                        toast.success('CV bilgileri başarıyla yüklendi!')
                    }
                }}
            />

            {/* Upsell Modal */}
            <UpsellModal
                isOpen={showUpsellModal}
                onClose={() => setShowUpsellModal(false)}
                triggerType={upsellTriggerType}
                onUpgrade={() => {
                    setShowUpsellModal(false)
                    navigate('/pricing')
                }}
            />
        </div>
        // End of EditorPage component - Fixed ReferenceError upsell v2
    )
}

