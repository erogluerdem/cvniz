import { useState, useEffect } from 'react'
import { Camera, Lock, User, Briefcase, GraduationCap, Wrench, Plus, Trash2, Languages, Link as LinkIcon, Mail, Phone, MapPin, Globe, Sparkles, Palette, Type, History, Settings as SettingsIcon, ChevronUp, ChevronDown, FolderKanban, Award, Check, Users, Heart, Layout as LayoutIcon, Search, Copy, QrCode, Share2, Image as ImageIcon, CalendarClock, RotateCcw, Play, GitBranch, BarChart3, Activity, Bell, MailOpen, FileText, Video, Quote, GripVertical, XCircle, Linkedin, Github, PenTool, SquareStack, Table, RefreshCw } from 'lucide-react'
import { templates } from '../data/templates'
import { aiAPI, mediaAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import QRCodeDisplay from './QRCodeDisplay'
import MagicWandButton from './MagicWandButton'
import AIHeadshotModal from './AIHeadshotModal'

export default function CVForm({
    cvData, setCvData, activeTab, setActiveTab, isPremium, cvName, setCvName,
    theme, setTheme, handleClearAll, setHighlightedField, user,
    selectedTemplate, setSelectedTemplate, cvId, versions = []
}) {
    const { toast } = useToast()
    const [newSkill, setNewSkill] = useState('')
    const [templateCategory, setTemplateCategory] = useState('Tümü')
    const [templateSearch, setTemplateSearch] = useState('')
    const [linkCopied, setLinkCopied] = useState(false)
    const [activeWidgetId, setActiveWidgetId] = useState(null)

    // AI States
    const [showAIModal, setShowAIModal] = useState(false)
    const [showHeadshotModal, setShowHeadshotModal] = useState(false)
    const [aiOptions, setAiOptions] = useState([])
    const [aiLoading, setAiLoading] = useState(false)
    const [aiTarget, setAiTarget] = useState(null) // { type: 'summary' | 'experience', id: optional }

    const isWebTemplate = selectedTemplate?.toLowerCase().includes('web')
    const webFontOptions = ['Inter', 'Space Grotesk', 'Sora', 'Playfair Display', 'Outfit', 'Poppins']
    const webPatternOptions = [
        { id: 'grid', label: 'Grid Dokusu' },
        { id: 'dots', label: 'Nokta Dokusu' },
        { id: 'plain', label: 'Düz Arka Plan' }
    ]
    const webPresets = [
        { name: 'Aurora', accent: '#7C3AED', bg: '#0F172A', text: '#E2E8F0', pattern: 'grid' },
        { name: 'Minimal', accent: '#111827', bg: '#F8FAFC', text: '#0F172A', pattern: 'plain' },
        { name: 'Sunset', accent: '#F97316', bg: '#1E1B4B', text: '#FDE68A', pattern: 'dots' },
        { name: 'Emerald', accent: '#10B981', bg: '#041F1E', text: '#D1FAE5', pattern: 'grid' }
    ]
    const widgetLibrary = [
        {
            type: 'blog',
            label: 'Blog Yazıları',
            icon: FileText,
            accent: 'from-fuchsia-500 via-pink-500 to-orange-400',
            description: 'RSS/Medium akışından son yazılarını listele.',
            defaults: () => ({
                heading: 'Son Blog Yazıları',
                subtitle: 'Teknoloji, ürün ve ekip kültürü üzerine notlarım.',
                layout: 'grid',
                posts: [
                    { title: 'Modern CV Funnel Tasarımı', url: 'https://blog.CVniz.app/posts/cv-funnel', date: '2024-10-03' },
                    { title: 'AI ile Kişiselleştirilmiş CV', url: 'https://blog.CVniz.app/posts/ai-cv', date: '2024-08-22' }
                ]
            })
        },
        {
            type: 'video',
            label: 'Video Gösterimi',
            icon: Video,
            accent: 'from-cyan-500 to-blue-500',
            description: 'Youtube/Vimeo embed ile demo yayınla.',
            defaults: () => ({
                heading: 'Tanıtım Videosu',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                caption: 'CV otomasyon sürecimi 90 saniyede izleyin.',
                poster: '',
                autoplay: false
            })
        },
        {
            type: 'testimonials',
            label: 'Referans Slider',
            icon: Quote,
            accent: 'from-emerald-500 to-lime-400',
            description: 'Partners & hiring managers feedback.',
            defaults: () => ({
                heading: 'Referanslar',
                theme: 'glass',
                quotes: [
                    { name: 'Eda T.', role: 'HR Lead', quote: 'Yeni CV funnelı ile teklif sayımız ikiye katlandı.' }
                ]
            })
        },
        {
            type: 'cta',
            label: 'CTA Butonu',
            icon: LinkIcon,
            accent: 'from-amber-500 to-red-500',
            description: 'Toplantı ya da başvuru çağrısı ekle.',
            defaults: () => ({
                heading: 'Birlikte Çalışalım',
                subheading: 'Takvimim açıldı, 15 dakikalık tanışma planlayalım.',
                buttonText: 'Görüşme Planla',
                buttonUrl: 'https://calendly.com/',
                style: 'gradient'
            })
        }
    ]

    const integrationProviders = [
        {
            key: 'linkedin',
            label: 'LinkedIn',
            description: 'Profil, deneyim ve becerileri otomatik çek.',
            icon: Linkedin,
            accent: 'from-sky-500 to-blue-500'
        },
        {
            key: 'behance',
            label: 'Behance',
            description: 'Portföy projelerini web CV’ye yansıt.',
            icon: PenTool,
            accent: 'from-purple-500 to-pink-500'
        },
        {
            key: 'github',
            label: 'GitHub',
            description: 'Pinned repo ve activity verilerini getir.',
            icon: Github,
            accent: 'from-slate-700 to-slate-900'
        },
        {
            key: 'notion',
            label: 'Notion',
            description: 'Proje database’i ile senkronize ol.',
            icon: SquareStack,
            accent: 'from-emerald-500 to-cyan-400'
        },
        {
            key: 'googleSheets',
            label: 'Google Sheets',
            description: 'Sheet tabloyu proje listesi olarak kullan.',
            icon: Table,
            accent: 'from-amber-500 to-orange-500'
        }
    ]

    const integrationFieldConfig = {
        linkedin: { field: 'profileUrl', placeholder: 'https://linkedin.com/in/kullanici', label: 'Profil URL' },
        behance: { field: 'profileUrl', placeholder: 'https://www.behance.net/..', label: 'Portföy URL' },
        github: { field: 'profileUrl', placeholder: 'https://github.com/..', label: 'Profil URL' },
        notion: { field: 'databaseId', placeholder: 'Notion database ID', label: 'Database ID' },
        googleSheets: { field: 'sheetUrl', placeholder: 'https://docs.google.com/spreadsheets/..', label: 'Sheet URL' }
    }

    const defaultPublicProfile = {
        slug: '',
        metaTitle: '',
        metaDescription: '',
        socialImage: '',
        isPublic: false,
        publishStatus: 'draft',
        liveVersionId: '',
        livePublishedAt: '',
        previousLiveVersionId: '',
        selectedVersionId: 'current',
        scheduledVersionId: '',
        scheduledAt: ''
    }

    const defaultAnalytics = {
        totalViews: 0,
        uniqueVisitors: 0,
        clickThroughRate: 0,
        avgTimeOnPage: 0,
        geo: [],
        topReferrers: [],
        timeline: []
    }

    const defaultNotificationPrefs = {
        weeklyEmail: false,
        pushAlerts: false,
        viewMilestones: false,
        referralDigest: false
    }

    const defaultIntegrationSettings = {
        linkedin: { connected: false, autoImport: false, lastSync: '', profileUrl: '' },
        behance: { connected: false, autoImport: false, lastSync: '', profileUrl: '' },
        github: { connected: false, autoImport: false, lastSync: '', profileUrl: '' },
        notion: { connected: false, autoImport: false, lastSync: '', databaseId: '' },
        googleSheets: { connected: false, autoImport: false, lastSync: '', sheetUrl: '' }
    }

    const publicProfile = cvData.publicProfile || defaultPublicProfile
    const analytics = cvData.analytics || defaultAnalytics
    const notificationPrefs = cvData.notificationPrefs || defaultNotificationPrefs
    const integrationSettings = cvData.integrationSettings || defaultIntegrationSettings
    const webWidgets = cvData.webWidgets || []
    const widgetDictionary = Object.fromEntries(widgetLibrary.map(item => [item.type, item]))
    const selectedWidget = webWidgets.find(widget => widget.id === activeWidgetId) || null
    const selectedWidgetDefinition = selectedWidget ? widgetDictionary[selectedWidget.type] : null
    const getWidgetLabel = (widget) => widget?.settings?.heading || widgetDictionary[widget?.type || '']?.label || 'Widget'

    const updatePublicProfile = (field, value) => {
        const updates = typeof field === 'object' ? field : { [field]: value }
        setCvData(prev => ({
            ...prev,
            publicProfile: {
                ...(prev.publicProfile || defaultPublicProfile),
                ...updates
            }
        }))
    }

    const updateNotificationPrefs = (field, value) => {
        const updates = typeof field === 'object' ? field : { [field]: value }
        setCvData(prev => ({
            ...prev,
            notificationPrefs: {
                ...(prev.notificationPrefs || defaultNotificationPrefs),
                ...updates
            }
        }))
    }

    const updateIntegrationSettings = (provider, updates) => {
        if (!provider) return
        setCvData(prev => ({
            ...prev,
            integrationSettings: {
                ...(prev.integrationSettings || defaultIntegrationSettings),
                [provider]: {
                    ...((prev.integrationSettings || defaultIntegrationSettings)[provider] || defaultIntegrationSettings[provider]),
                    ...updates
                }
            }
        }))
    }

    const slugify = (value = '') => {
        return value
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ğĞ]/g, 'g')
            .replace(/[şŞ]/g, 's')
            .replace(/[ıI]/g, 'i')
            .replace(/[çÇ]/g, 'c')
            .replace(/[öÖ]/g, 'o')
            .replace(/[üÜ]/g, 'u')
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase()
    }

    const generateSlug = () => {
        const source = cvData.personal.fullName || cvName || 'benim-cv'
        const newSlug = slugify(source)
        updatePublicProfile('slug', newSlug)
    }

    const baseShareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://CVniz.app'
    const shareUrl = publicProfile.slug ? `${baseShareUrl}/cv/${publicProfile.slug}` : ''

    const handleCopyLink = async () => {
        if (!shareUrl) return
        try {
            await navigator.clipboard.writeText(shareUrl)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch (err) {
            console.error('copy failed', err)
        }
    }

    useEffect(() => {
        if (!webWidgets.length) {
            if (activeWidgetId !== null) setActiveWidgetId(null)
            return
        }
        const exists = webWidgets.some(widget => widget.id === activeWidgetId)
        if (!exists) {
            setActiveWidgetId(webWidgets[0].id)
        }
    }, [webWidgets, activeWidgetId])

    const getWidgetDefinition = (type) => widgetLibrary.find(widget => widget.type === type)

    const addWidget = (type) => {
        const definition = getWidgetDefinition(type)
        if (!definition) return
        const defaults = definition.defaults()
        const newWidget = {
            id: `${type}-${Date.now()}`,
            type,
            enabled: true,
            settings: defaults
        }
        setCvData(prev => ({
            ...prev,
            webWidgets: [...(prev.webWidgets || []), newWidget]
        }))
        setActiveWidgetId(newWidget.id)
    }

    const updateWidget = (widgetId, updates = {}) => {
        setCvData(prev => ({
            ...prev,
            webWidgets: (prev.webWidgets || []).map(widget => {
                if (widget.id !== widgetId) return widget
                const next = { ...widget, ...updates }
                if (updates.settings) {
                    next.settings = { ...(widget.settings || {}), ...updates.settings }
                }
                return next
            })
        }))
    }

    const updateWidgetSettingsField = (widgetId, field, value) => {
        updateWidget(widgetId, { settings: { [field]: value } })
    }

    const updateWidgetSettingsList = (widgetId, field, nextList) => {
        updateWidget(widgetId, { settings: { [field]: nextList } })
    }

    const toggleWidget = (widgetId) => {
        setCvData(prev => ({
            ...prev,
            webWidgets: (prev.webWidgets || []).map(widget =>
                widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
            )
        }))
    }

    const removeWidget = (widgetId) => {
        setCvData(prev => ({
            ...prev,
            webWidgets: (prev.webWidgets || []).filter(widget => widget.id !== widgetId)
        }))
    }

    const moveWidget = (widgetId, direction) => {
        setCvData(prev => {
            const widgets = [...(prev.webWidgets || [])]
            const index = widgets.findIndex(widget => widget.id === widgetId)
            if (index === -1) return prev
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= widgets.length) return prev
            const [removed] = widgets.splice(index, 1)
            widgets.splice(targetIndex, 0, removed)
            return { ...prev, webWidgets: widgets }
        })
    }

    const renderWidgetEditor = () => {
        if (!selectedWidget) {
            return <p className="text-sm text-slate-500">Henüz widget eklemediniz. Soldan bir bileşen seçin.</p>
        }

        const settings = selectedWidget.settings || {}
        const baseInputClasses = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20'
        const baseTextAreaClasses = 'w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20'

        if (selectedWidget.type === 'blog') {
            const posts = Array.isArray(settings.posts) ? settings.posts : []
            const updatePost = (index, field, value) => {
                const nextPosts = posts.map((post, idx) => idx === index ? { ...post, [field]: value } : post)
                updateWidgetSettingsList(selectedWidget.id, 'posts', nextPosts)
            }
            const addPost = () => {
                updateWidgetSettingsList(selectedWidget.id, 'posts', [...posts, { title: 'Yeni Yazı', url: '', date: new Date().toISOString().slice(0, 10) }])
            }
            const removePost = (index) => {
                const nextPosts = posts.filter((_, idx) => idx !== index)
                updateWidgetSettingsList(selectedWidget.id, 'posts', nextPosts)
            }
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel label="Bölüm Başlığı" icon={Type} />
                        <input
                            value={settings.heading || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'heading', e.target.value)}
                            placeholder="Örn. Son Yazılar"
                            className={baseInputClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Kısa Açıklama" icon={Sparkles} />
                        <textarea
                            value={settings.subtitle || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'subtitle', e.target.value)}
                            placeholder="Okuyucular neler bulacak?"
                            className={baseTextAreaClasses}
                        />
                    </div>
                    <div className="space-y-2">
                        <InputLabel label="Yerleşim" icon={LayoutIcon} />
                        <div className="flex gap-2">
                            {['grid', 'list'].map((layout) => (
                                <button
                                    key={layout}
                                    onClick={() => updateWidgetSettingsField(selectedWidget.id, 'layout', layout)}
                                    className={`flex-1 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest ${settings.layout === layout ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
                                >
                                    {layout === 'grid' ? 'Grid' : 'Liste'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <InputLabel label="Blog Kartları" icon={FileText} />
                        {posts.map((post, index) => (
                            <div key={`${selectedWidget.id}-post-${index}`} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Yazı {index + 1}</span>
                                    <button onClick={() => removePost(index)} className="text-slate-500 hover:text-red-400">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    value={post.title || ''}
                                    onChange={(e) => updatePost(index, 'title', e.target.value)}
                                    placeholder="Başlık"
                                    className={baseInputClasses}
                                />
                                <input
                                    value={post.url || ''}
                                    onChange={(e) => updatePost(index, 'url', e.target.value)}
                                    placeholder="https://..."
                                    className={baseInputClasses}
                                />
                                <input
                                    type="date"
                                    value={post.date || ''}
                                    onChange={(e) => updatePost(index, 'date', e.target.value)}
                                    className={baseInputClasses}
                                />
                            </div>
                        ))}
                        <button onClick={addPost} className="w-full py-3 rounded-xl border border-dashed border-white/20 bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-cyan-500/40">
                            + Yazı Kartı Ekle
                        </button>
                    </div>
                </div>
            )
        }

        if (selectedWidget.type === 'video') {
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel label="Başlık" icon={Type} />
                        <input
                            value={settings.heading || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'heading', e.target.value)}
                            placeholder="Örn. Product Demo"
                            className={baseInputClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Embed URL" icon={LinkIcon} />
                        <input
                            value={settings.embedUrl || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'embedUrl', e.target.value)}
                            placeholder="https://www.youtube.com/embed/..."
                            className={baseInputClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Poster / Kapak" icon={ImageIcon} />
                        <input
                            value={settings.poster || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'poster', e.target.value)}
                            placeholder="Opsiyonel görsel"
                            className={baseInputClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Açıklama" icon={Sparkles} />
                        <textarea
                            value={settings.caption || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'caption', e.target.value)}
                            placeholder="Kısa açıklama veya CTA"
                            className={baseTextAreaClasses}
                        />
                    </div>
                    <button
                        onClick={() => updateWidgetSettingsField(selectedWidget.id, 'autoplay', !settings.autoplay)}
                        className={`w-full py-3 rounded-xl border flex items-center justify-between px-4 text-sm ${settings.autoplay ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                        <span>Otomatik oynat</span>
                        <div className={`w-10 h-5 rounded-full relative ${settings.autoplay ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.autoplay ? 'left-5' : 'left-0.5'}`} />
                        </div>
                    </button>
                </div>
            )
        }

        if (selectedWidget.type === 'testimonials') {
            const quotes = Array.isArray(settings.quotes) ? settings.quotes : []
            const updateQuote = (index, field, value) => {
                const nextQuotes = quotes.map((quote, idx) => idx === index ? { ...quote, [field]: value } : quote)
                updateWidgetSettingsList(selectedWidget.id, 'quotes', nextQuotes)
            }
            const addQuote = () => {
                updateWidgetSettingsList(selectedWidget.id, 'quotes', [...quotes, { name: 'Yeni Referans', role: '', quote: '' }])
            }
            const removeQuote = (index) => {
                updateWidgetSettingsList(selectedWidget.id, 'quotes', quotes.filter((_, idx) => idx !== index))
            }
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel label="Başlık" icon={Type} />
                        <input
                            value={settings.heading || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'heading', e.target.value)}
                            placeholder="Örn. Referanslar"
                            className={baseInputClasses}
                        />
                    </div>
                    <div className="space-y-2">
                        <InputLabel label="Tema" icon={Palette} />
                        <div className="flex gap-2">
                            {['glass', 'minimal', 'solid'].map((themeOption) => (
                                <button
                                    key={themeOption}
                                    onClick={() => updateWidgetSettingsField(selectedWidget.id, 'theme', themeOption)}
                                    className={`flex-1 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest ${settings.theme === themeOption ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                >
                                    {themeOption}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <InputLabel label="Referans Kartları" icon={Quote} />
                        {quotes.map((quote, index) => (
                            <div key={`${selectedWidget.id}-quote-${index}`} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Kişi {index + 1}</span>
                                    <button onClick={() => removeQuote(index)} className="text-slate-500 hover:text-red-400">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                                <input
                                    value={quote.name || ''}
                                    onChange={(e) => updateQuote(index, 'name', e.target.value)}
                                    placeholder="Ad Soyad"
                                    className={baseInputClasses}
                                />
                                <input
                                    value={quote.role || ''}
                                    onChange={(e) => updateQuote(index, 'role', e.target.value)}
                                    placeholder="Unvan / Şirket"
                                    className={baseInputClasses}
                                />
                                <textarea
                                    value={quote.quote || ''}
                                    onChange={(e) => updateQuote(index, 'quote', e.target.value)}
                                    placeholder="Söz / İçerik"
                                    className={baseTextAreaClasses}
                                />
                            </div>
                        ))}
                        <button onClick={addQuote} className="w-full py-3 rounded-xl border border-dashed border-white/20 bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-emerald-500/50">
                            + Referans Ekle
                        </button>
                    </div>
                </div>
            )
        }

        if (selectedWidget.type === 'cta') {
            return (
                <div className="space-y-4">
                    <div>
                        <InputLabel label="Başlık" icon={Type} />
                        <input
                            value={settings.heading || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'heading', e.target.value)}
                            placeholder="Örn. Birlikte Çalışalım"
                            className={baseInputClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Alt Başlık" icon={Sparkles} />
                        <textarea
                            value={settings.subheading || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'subheading', e.target.value)}
                            placeholder="Kısa açıklama / fayda"
                            className={baseTextAreaClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Buton Metni" icon={Type} />
                        <input
                            value={settings.buttonText || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'buttonText', e.target.value)}
                            placeholder="Örn. Toplantı Planla"
                            className={baseInputClasses}
                        />
                    </div>
                    <div>
                        <InputLabel label="Buton URL" icon={LinkIcon} />
                        <input
                            value={settings.buttonUrl || ''}
                            onChange={(e) => updateWidgetSettingsField(selectedWidget.id, 'buttonUrl', e.target.value)}
                            placeholder="https://..."
                            className={baseInputClasses}
                        />
                    </div>
                    <div className="space-y-2">
                        <InputLabel label="Stil" icon={Palette} />
                        <div className="flex gap-2">
                            {['gradient', 'outline', 'ghost'].map((styleOption) => (
                                <button
                                    key={styleOption}
                                    onClick={() => updateWidgetSettingsField(selectedWidget.id, 'style', styleOption)}
                                    className={`flex-1 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest ${settings.style === styleOption ? 'bg-amber-500/20 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                >
                                    {styleOption}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        return <p className="text-sm text-slate-500">Bu widget için düzenleme paneli yakında.</p>
    }

    const versionList = Array.isArray(versions) ? versions : []
    const selectedPublishVersion = publicProfile.selectedVersionId || 'current'
    const publishStatusKey = publicProfile.publishStatus || (publicProfile.isPublic ? 'live' : 'draft')
    const publishStatusThemes = {
        live: {
            label: 'Yayında',
            classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        },
        scheduled: {
            label: 'Planlandı',
            classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        },
        draft: {
            label: 'Taslak',
            classes: 'bg-white/5 text-slate-400 border-white/10'
        }
    }
    const publishStatusMeta = publishStatusThemes[publishStatusKey] || publishStatusThemes.draft

    const formatDateTime = (isoString) => {
        if (!isoString) return ''
        const date = new Date(isoString)
        return date.toLocaleString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const toDateTimeLocalValue = (isoString) => {
        if (!isoString) return ''
        const date = new Date(isoString)
        const pad = (value) => value.toString().padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    }
    const formatDuration = (seconds = 0) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.max(seconds - mins * 60, 0)
        if (mins <= 0) return `${secs}s`
        return `${mins}dk ${secs.toString().padStart(2, '0')}sn`
    }

    const formatIntegrationDate = (isoString) => isoString ? formatDateTime(isoString) : 'Hiç senkronize edilmedi'

    const handleIntegrationSync = (provider) => {
        if (!provider) return
        updateIntegrationSettings(provider, {
            connected: true,
            lastSync: new Date().toISOString()
        })
    }

    const handleIntegrationConnect = (provider) => {
        updateIntegrationSettings(provider, {
            connected: true,
            lastSync: new Date().toISOString()
        })
    }

    const toggleIntegrationAutoImport = (provider) => {
        const current = integrationSettings[provider]?.autoImport
        updateIntegrationSettings(provider, { autoImport: !current })
    }

    const handleIntegrationDisconnect = (provider) => {
        updateIntegrationSettings(provider, {
            connected: false,
            autoImport: false
        })
    }

    const scheduledInputValue = toDateTimeLocalValue(publicProfile.scheduledAt)

    const resolveVersionLabel = (id) => {
        if (!id || id === 'current') return 'Güncel taslak'
        const match = versionList.find(v => v.id === id || v._id === id)
        return match?.name || 'Versiyon'
    }

    const liveVersionLabel = resolveVersionLabel(publicProfile.liveVersionId)
    const scheduledVersionLabel = resolveVersionLabel(publicProfile.scheduledVersionId)
    const lastPublishedDisplay = publicProfile.livePublishedAt ? formatDateTime(publicProfile.livePublishedAt) : 'Henüz yayımlanmadı'
    const scheduledDisplay = publicProfile.scheduledAt ? formatDateTime(publicProfile.scheduledAt) : 'Plan yok'
    const canSchedule = Boolean(publicProfile.scheduledAt && selectedPublishVersion)

    const handleScheduleInput = (value) => {
        if (!value) {
            updatePublicProfile({ scheduledAt: '', scheduledVersionId: '' })
            return
        }
        updatePublicProfile('scheduledAt', new Date(value).toISOString())
    }

    const handlePublishNow = () => {
        const versionToPublish = selectedPublishVersion
        const previousLive = publicProfile.liveVersionId && publicProfile.liveVersionId !== versionToPublish
            ? publicProfile.liveVersionId
            : publicProfile.previousLiveVersionId

        updatePublicProfile({
            isPublic: true,
            publishStatus: 'live',
            liveVersionId: versionToPublish,
            livePublishedAt: new Date().toISOString(),
            previousLiveVersionId: previousLive || '',
            scheduledVersionId: '',
            scheduledAt: ''
        })
    }

    const handleSchedulePublish = () => {
        if (!publicProfile.scheduledAt || !selectedPublishVersion) return
        updatePublicProfile({
            publishStatus: 'scheduled',
            scheduledVersionId: selectedPublishVersion,
            isPublic: true
        })
    }

    const handleRollbackLive = () => {
        if (!publicProfile.previousLiveVersionId) return
        const currentLive = publicProfile.liveVersionId
        updatePublicProfile({
            selectedVersionId: publicProfile.previousLiveVersionId,
            liveVersionId: publicProfile.previousLiveVersionId,
            publishStatus: 'live',
            isPublic: true,
            livePublishedAt: new Date().toISOString(),
            previousLiveVersionId: currentLive && currentLive !== publicProfile.previousLiveVersionId ? currentLive : '',
            scheduledVersionId: '',
            scheduledAt: ''
        })
    }

    const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    const timelineData = (analytics.timeline && analytics.timeline.length > 0)
        ? analytics.timeline
        : weekDays.map(day => ({ day, views: 0 }))
    const maxTimelineValue = timelineData.reduce((max, entry) => Math.max(max, entry.views), 0) || 1

    // Template categories
    const templateCategories = ['Tümü', 'Modern', 'Professional', 'Tech', 'Creative', 'Industry']

    // Filtered templates
    const filteredTemplates = templates.filter(t => {
        const matchesCategory = templateCategory === 'Tümü' || t.category === templateCategory
        const matchesSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const updatePersonal = (field, value) => {
        setCvData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }))
    }

    const handlePhotoChange = async (e) => {
        if (!isPremium) return
        const file = e.target.files[0]
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır.')
                return
            }

            try {
                const formData = new FormData()
                formData.append('file', file)

                const loadingToast = toast.loading('Fotoğraf yükleniyor...')

                const response = await mediaAPI.upload(formData)

                toast.dismiss(loadingToast)

                if (response.success && response.media) {
                    // Construct full URL
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
                    const baseUrl = apiUrl.replace(/\/api$/, '')
                    const fullUrl = `${baseUrl}${response.media.path}`

                    updatePersonal('photo', fullUrl)
                    toast.success('Fotoğraf yüklendi')
                }
            } catch (error) {
                console.error('Photo upload error:', error)
                toast.error('Fotoğraf yüklenemedi: ' + (error.response?.data?.message || error.message))
            }
        }
    }

    const addExperience = () => {
        setCvData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: Date.now(),
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: ''
            }]
        }))
    }

    const updateExperience = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }))
    }

    const removeExperience = (id) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }))
    }

    const addEducation = () => {
        setCvData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now(),
                school: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: ''
            }]
        }))
    }

    const updateEducation = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }))
    }

    const removeEducation = (id) => {
        setCvData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }))
    }

    const addSkill = () => {
        if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
            setCvData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }))
            setNewSkill('')
        }
    }

    const moveExperience = (index, direction) => {
        const newExp = [...cvData.experience]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex >= 0 && newIndex < newExp.length) {
            [newExp[index], newExp[newIndex]] = [newExp[newIndex], newExp[index]]
            setCvData(prev => ({ ...prev, experience: newExp }))
        }
    }

    const moveEducation = (index, direction) => {
        const newEdu = [...cvData.education]
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex >= 0 && newIndex < newEdu.length) {
            [newEdu[index], newEdu[newIndex]] = [newEdu[newIndex], newEdu[index]]
            setCvData(prev => ({ ...prev, education: newEdu }))
        }
    }

    const removeSkill = (skillToRemove) => {
        setCvData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    // Projects CRUD
    const addProject = () => {
        setCvData(prev => ({
            ...prev,
            projects: [...(prev.projects || []), {
                id: Date.now(),
                name: '',
                description: '',
                link: ''
            }]
        }))
    }

    const updateProject = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            projects: prev.projects.map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        }))
    }

    const removeProject = (id) => {
        setCvData(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== id)
        }))
    }

    // Certifications CRUD
    const addCertification = () => {
        setCvData(prev => ({
            ...prev,
            certifications: [...(prev.certifications || []), {
                id: Date.now(),
                name: '',
                issuer: '',
                date: ''
            }]
        }))
    }

    const updateCertification = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            certifications: prev.certifications.map(c =>
                c.id === id ? { ...c, [field]: value } : c
            )
        }))
    }

    const removeCertification = (id) => {
        setCvData(prev => ({
            ...prev,
            certifications: prev.certifications.filter(c => c.id !== id)
        }))
    }

    // Custom Sections CRUD
    const addCustomSection = () => {
        setCvData(prev => ({
            ...prev,
            customSections: [...(prev.customSections || []), {
                id: Date.now(),
                title: 'Yeni Bölüm',
                content: ''
            }]
        }))
        setActiveTab('custom') // Switch to new tab to see it
    }

    const updateCustomSection = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            customSections: prev.customSections.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            )
        }))
    }

    const removeCustomSection = (id) => {
        setCvData(prev => ({
            ...prev,
            customSections: prev.customSections.filter(s => s.id !== id)
        }))
    }

    // References CRUD
    const addReference = () => {
        setCvData(prev => ({
            ...prev,
            references: [...(prev.references || []), {
                id: Date.now(),
                name: '',
                company: '',
                phone: '',
                email: ''
            }]
        }))
    }

    const updateReference = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            references: prev.references.map(r =>
                r.id === id ? { ...r, [field]: value } : r
            )
        }))
    }

    const removeReference = (id) => {
        setCvData(prev => ({
            ...prev,
            references: prev.references.filter(r => r.id !== id)
        }))
    }

    // Hobbies CRUD
    const addHobby = () => {
        setCvData(prev => ({
            ...prev,
            hobbies: [...(prev.hobbies || []), {
                id: Date.now(),
                name: '',
                icon: 'Heart'
            }]
        }))
    }

    const updateHobby = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            hobbies: prev.hobbies.map(h =>
                h.id === id ? { ...h, [field]: value } : h
            )
        }))
    }

    const removeHobby = (id) => {
        setCvData(prev => ({
            ...prev,
            hobbies: prev.hobbies.filter(h => h.id !== id)
        }))
    }


    const InputLabel = ({ label, icon: Icon }) => (
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            {Icon && <Icon className="w-3 h-3 text-cyan-500/50" />}
            {label}
        </label>
    )

    const TextInput = ({ label, icon, section, ...props }) => (
        <div className="group">
            <InputLabel label={label} icon={icon} />
            <input
                {...props}
                onFocus={() => setHighlightedField(section || label)}
                onBlur={() => setHighlightedField(null)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 transition-all group-hover:border-white/20"
            />
        </div>
    )

    const TextArea = ({ label, icon, section, ...props }) => (
        <div className="group">
            <InputLabel label={label} icon={icon} />
            <textarea
                {...props}
                onFocus={() => setHighlightedField(section || label)}
                onBlur={() => setHighlightedField(null)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 transition-all group-hover:border-white/20 resize-none min-h-[120px]"
            />
        </div>
    )

    const generateAISummary = async () => {
        if (!user) {
            const btn = document.getElementById('auth-modal-trigger')
            if (btn) {
                btn.setAttribute('data-feature', 'Yapay Zeka Asistanını')
                btn.click()
            }
            return
        }
        if (!isPremium) {
            document.getElementById('premium-panel-trigger')?.click()
            return
        }

        try {
            setAiLoading(true)
            setShowAIModal(true)
            setAiTarget({ type: 'summary' })
            setAiOptions([]) // Clear previous

            const title = cvData.personal.title || 'Profesyonel'
            const response = await aiAPI.generateSummary(title, 'Mid-Level', theme.language || 'tr')

            if (response.success && response.options) {
                setAiOptions(response.options)
            } else {
                // Fallback to mock if API fails or returns no options (should use toast in real app)
                setAiOptions([
                    `${title} olarak deneyimli ve sonuç odaklı bir profesyonelim.`,
                    `Kariyerimde ${title} olarak değer yaratmaya odaklandım.`,
                    `Yenilikçi çözümlerle ${title} pozisyonunda fark yaratıyorum.`
                ])
            }
        } catch (error) {
            console.error('AI Error:', error)
            setAiOptions([
                "AI servisine şu an ulaşılamıyor, lütfen tekrar deneyin.",
            ])
        } finally {
            setAiLoading(false)
        }
    }

    const generateAIExperience = async (id, company, position) => {
        if (!user) {
            const btn = document.getElementById('auth-modal-trigger')
            if (btn) {
                btn.setAttribute('data-feature', 'Yapay Zeka Önerilerini')
                btn.click()
            }
            return
        }
        if (!isPremium) {
            document.getElementById('premium-panel-trigger')?.click()
            return
        }

        try {
            setAiLoading(true)
            setShowAIModal(true)
            setAiTarget({ type: 'experience', id })
            setAiOptions([])

            const response = await aiAPI.generateExperience(position, theme.language || 'tr')

            if (response.success && response.options) {
                setAiOptions(response.options)
            } else {
                setAiOptions([
                    `${position} olarak ${company} bünyesinde verimliliği artıran süreçler geliştirdim.`,
                    `Projelerin zamanında teslim edilmesini sağladım.`,
                    `Yeni teknolojiler kullanarak sistem performansını iyileştirdim.`
                ])
            }
        } catch (error) {
            console.error('AI Error:', error)
            setAiOptions(["AI servisine ulaşılamıyor."])
        } finally {
            setAiLoading(false)
        }
    }

    const suggestSkills = () => {
        if (!user) {
            const btn = document.getElementById('auth-modal-trigger')
            if (btn) {
                btn.setAttribute('data-feature', 'Beceri Önerilerini')
                btn.click()
            }
            return
        }
        if (!isPremium) {
            document.getElementById('premium-panel-trigger')?.click()
            return
        }
        const categories = {
            'Teknoloji': ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'Docker', 'AWS', 'GraphQL'],
            'Yazılım': ['Python', 'Java', 'Go', 'PostgreSQL', 'Redis', 'Microservices', 'Git', 'CI/CD'],
            'Tasarım': ['Figma', 'UI/UX', 'Adobe Creative Suite', 'Responsive Design', 'Accessibility', 'Prototyping']
        }
        // Mevcut olmayan önerilerden 3 tanesini rastgele ekle
        const all = Object.values(categories).flat()
        const unadded = all.filter(s => !cvData.skills.includes(s))
        if (unadded.length > 0) {
            const random = unadded.sort(() => 0.5 - Math.random()).slice(0, 3)
            setCvData(prev => ({
                ...prev,
                skills: [...new Set([...prev.skills, ...random])]
            }))
        }
    }

    const sectionTips = {
        personal: { icon: User, title: 'Kişisel Bilgiler', text: 'İletişim bilgilerinizin güncel ve profesyonel olmasına dikkat edin. Fotoğrafınız net ve aydınlık olmalı.' },
        experience: { icon: Briefcase, title: 'İş Deneyimi', text: 'Deneyimlerinizi en sondan geriye doğru sıralayın. Elde ettiğiniz somut başarıları ve metrikleri (örn. "%20 artış sağladım") vurgulayın.' },
        education: { icon: GraduationCap, title: 'Eğitim', text: 'Yeni mezunsanız eğitimi üst sıralara taşıyabilirsiniz. İlgili dersler veya bitirme projenizi eklemeyi unutmayın.' },
        skills: { icon: Wrench, title: 'Beceriler', text: 'İş ilanlarındaki anahtar kelimelerle eşleşen becerilere öncelik verin. Hard-skill ve soft-skill olarak gruplayabilirsiniz.' },
        projects: { icon: FolderKanban, title: 'Projeler', text: 'Rolünüzü, kullandığınız teknolojileri ve projenin sonucunu açıkça belirtin. Varsa canlı link veya GitHub reposu ekleyin.' },
        certifications: { icon: Award, title: 'Sertifikalar', text: 'Aldığınız eğitimleri ve başarı belgelerini buraya ekleyin. Doğrulanabilir linkler (örn. Credly) güven verir.' }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
            {/* Section Helper Tooltip */}
            {sectionTips[activeTab] && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4 flex gap-4 items-start animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 shrink-0 mt-0.5">
                        {(() => {
                            const Icon = sectionTips[activeTab].icon;
                            return <Icon className="w-5 h-5 text-cyan-400" />
                        })()}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            {sectionTips[activeTab].title} İpuçları
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{sectionTips[activeTab].text}</p>
                    </div>
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'personal' && (
                <div className="space-y-6">
                    {/* Photo Upload Section */}
                    <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="relative shrink-0">
                            {cvData.personal.photo ? (
                                <img src={cvData.personal.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50" />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-dashed border-white/10">
                                    <User className="w-10 h-10 text-slate-600" />
                                </div>
                            )}
                            {isPremium && (
                                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                                    <Camera className="w-4 h-4 text-slate-950" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                </label>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    Profil Fotoğrafı
                                    {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
                                </h3>
                                {isPremium && (
                                    <button
                                        onClick={() => setShowHeadshotModal(true)}
                                        className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        AI Headshot
                                    </button>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">
                                {isPremium
                                    ? 'Özgeçmişinizi kişiselleştirmek için bir fotoğraf yükleyin veya yapay zeka ile profesyonel bir portre oluşturun.'
                                    : 'Fotoğraf özelliği Premium üyeler içindir.'}
                            </p>
                            {!isPremium && (
                                <button
                                    onClick={() => document.getElementById('premium-panel-trigger')?.click()}
                                    className="mt-3 text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors"
                                >
                                    PREMIUM'A GEÇ
                                </button>
                            )}
                        </div>
                        {cvData.personal.photo && isPremium && (
                            <button
                                onClick={() => updatePersonal('photo', '')}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <TextInput
                        label="Ad Soyad"
                        value={cvData.personal.fullName}
                        onChange={(e) => updatePersonal('fullName', e.target.value)}
                        placeholder="Örn. Ahmet Yılmaz"
                        icon={User}
                        section="personal"
                    />
                    <div className="relative">
                        <TextArea
                            label="Özet Giriş"
                            value={cvData.personal.summary}
                            onChange={(e) => updatePersonal('summary', e.target.value)}
                            placeholder="Kariyer hedeflerinizi ve uzmanlıklarınızı kısaca anlatın..."
                            icon={Sparkles}
                            section="personal_summary"
                        />
                        <div className="absolute top-0 right-0 flex gap-2">
                            <MagicWandButton
                                text={cvData.personal.summary}
                                onImprove={(newText) => updatePersonal('summary', newText)}
                                className="bg-white/5"
                            />
                            <button
                                onClick={generateAISummary}
                                className="py-1 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                            >
                                <Sparkles className="w-3 h-3" /> AI İLE YAZ
                            </button>
                        </div>
                    </div>
                    <TextInput
                        label="Ünvan"
                        value={cvData.personal.title}
                        onChange={(e) => updatePersonal('title', e.target.value)}
                        placeholder="Örn. Senior Software Engineer"
                        icon={Briefcase}
                        section="personal"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput
                            label="E-posta"
                            type="email"
                            value={cvData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            placeholder="mail@ornek.com"
                            icon={Mail}
                            section="personal"
                        />
                        <TextInput
                            label="Telefon"
                            value={cvData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            placeholder="+90 5XX"
                            icon={Phone}
                            section="personal"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput
                            label="Konum"
                            value={cvData.personal.location}
                            onChange={(e) => updatePersonal('location', e.target.value)}
                            placeholder="İstanbul, TR"
                            icon={MapPin}
                            section="personal"
                        />
                        <TextInput
                            label="LinkedIn"
                            value={cvData.personal.linkedin}
                            onChange={(e) => updatePersonal('linkedin', e.target.value)}
                            placeholder="linkedin.com/in/..."
                            icon={LinkIcon}
                            section="personal"
                        />
                    </div>
                </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
                <div className="space-y-6">
                    {cvData.experience.map((exp, index) => (
                        <div key={exp.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                                <button
                                    onClick={() => moveExperience(index, 'up')}
                                    disabled={index === 0}
                                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => moveExperience(index, 'down')}
                                    disabled={index === cvData.experience.length - 1}
                                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-cyan-400 font-bold text-[10px] uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">
                                    {index + 1}
                                </div>
                                Deneyim Kaydı
                            </div>

                            <div className="space-y-4">
                                <TextInput
                                    label="Şirket"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    placeholder="Google"
                                />
                                <TextInput
                                    label="Pozisyon"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                    placeholder="Senior Developer"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="Başlangıç"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                        placeholder="Ocak 2020"
                                    />
                                    <TextInput
                                        label="Bitiş"
                                        value={exp.endDate}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                        placeholder="Günümüz"
                                    />
                                </div>
                                <div className="relative">
                                    <TextArea
                                        label="Açıklama / Başarılar"
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        placeholder="Sorumluluklarınız ve elde ettiğiniz başarılar..."
                                        section="experience"
                                    />
                                    <div className="absolute top-0 right-0 flex gap-2">
                                        <MagicWandButton
                                            text={exp.description}
                                            onImprove={(newText) => updateExperience(exp.id, 'description', newText)}
                                            className="bg-white/5"
                                        />
                                        <button
                                            onClick={() => generateAIExperience(exp.id, exp.company, exp.position)}
                                            className="py-1 px-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all flex items-center gap-2"
                                        >
                                            <Sparkles className="w-3 h-3" /> AI ÖNERİSİ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addExperience}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Deneyim Ekle
                    </button>
                </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
                <div className="space-y-6">
                    {cvData.education.map((edu, index) => (
                        <div key={edu.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                                <button
                                    onClick={() => moveEducation(index, 'up')}
                                    disabled={index === 0}
                                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => moveEducation(index, 'down')}
                                    disabled={index === cvData.education.length - 1}
                                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-6 text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">
                                    {index + 1}
                                </div>
                                Eğitim Kaydı
                            </div>

                            <div className="space-y-4">
                                <TextInput
                                    label="Okul / Üniversite"
                                    value={edu.school}
                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                    placeholder="Stanford University"
                                    icon={GraduationCap}
                                    section="education"
                                />
                                <TextInput
                                    label="Bölüm / Derece"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    placeholder="Computer Science, MSc"
                                    section="education"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="Başlangıç"
                                        value={edu.startDate}
                                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                        placeholder="2016"
                                    />
                                    <TextInput
                                        label="Bitiş"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        placeholder="2020"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addEducation}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Eğitim Ekle
                    </button>
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <InputLabel label="Beceri Ekle" icon={Wrench} />
                            <button
                                onClick={suggestSkills}
                                className="mb-2 text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest bg-purple-500/5 px-2 py-1 rounded border border-purple-500/10 flex items-center gap-1"
                            >
                                <Sparkles className="w-2.5 h-2.5" /> ÖNERİ AL
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                                placeholder="Örn. React.js, Python, Leadership"
                            />
                            <button
                                onClick={addSkill}
                                className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                            >
                                <Plus className="w-5 h-5 inline mr-1" /> EKLE
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {cvData.skills.map((skill, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer"
                                onClick={() => removeSkill(skill)}
                            >
                                <span className="text-sm font-medium text-slate-300 group-hover:text-red-400 transition-colors">{skill}</span>
                                <Trash2 className="w-3 h-3 text-slate-600 group-hover:text-red-400 transition-colors" />
                            </div>
                        ))}
                    </div>

                    {cvData.skills.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.01]">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                <Wrench className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Henüz beceri eklenmedi</p>
                        </div>
                    )}
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    {(cvData.projects || []).map((project, index) => (
                        <div key={project.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                            <button
                                onClick={() => removeProject(project.id)}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                                    {index + 1}
                                </div>
                                Proje
                            </div>

                            <div className="space-y-4">
                                <TextInput
                                    label="Proje Adı"
                                    value={project.name}
                                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                    placeholder="Örn. E-Ticaret Platformu"
                                    icon={FolderKanban}
                                />
                                <TextInput
                                    label="Link"
                                    value={project.link}
                                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                    placeholder="github.com/user/project"
                                    icon={LinkIcon}
                                />
                                <TextArea
                                    label="Açıklama"
                                    value={project.description}
                                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                    placeholder="Proje hakkında kısa bir açıklama..."
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addProject}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Proje Ekle
                    </button>
                </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
                <div className="space-y-6">
                    {(cvData.certifications || []).map((cert, index) => (
                        <div key={cert.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                            <button
                                onClick={() => removeCertification(cert.id)}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-6 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">
                                    {index + 1}
                                </div>
                                Sertifika
                            </div>

                            <div className="space-y-4">
                                <TextInput
                                    label="Sertifika Adı"
                                    value={cert.name}
                                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                    placeholder="Örn. AWS Certified Developer"
                                    icon={Award}
                                />
                                <TextInput
                                    label="Veren Kurum"
                                    value={cert.issuer}
                                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                    placeholder="Örn. Amazon Web Services"
                                    icon={Briefcase}
                                />
                                <TextInput
                                    label="Alındığı Tarih"
                                    value={cert.date}
                                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                    placeholder="2023"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addCertification}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Sertifika Ekle
                    </button>
                </div>
            )}

            {/* Custom Sections Tab */}
            {activeTab === 'custom' && (
                <div className="space-y-6">
                    {(cvData.customSections || []).map((section, index) => (
                        <div key={section.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                            <button
                                onClick={() => removeCustomSection(section.id)}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-6 text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">
                                    {index + 1}
                                </div>
                                Özel Bölüm
                            </div>

                            <div className="space-y-4">
                                <TextInput
                                    label="Bölüm Başlığı"
                                    value={section.title}
                                    onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                                    placeholder="Örn. Referanslar veya Yayınlar"
                                    icon={Type}
                                />
                                <TextArea
                                    label="İçerik"
                                    value={section.content}
                                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                                    placeholder="Bu bölüme ait detayları buraya yazın..."
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addCustomSection}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Özel Bölüm Ekle
                    </button>

                    {(cvData.customSections || []).length === 0 && (
                        <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl opacity-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Henüz özel bölüm bulunmuyor.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* References Tab */}
            {activeTab === 'references' && (
                <div className="space-y-6">
                    {(cvData.references || []).map((ref, index) => (
                        <div key={ref.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                            <button
                                onClick={() => removeReference(ref.id)}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-6 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                                    {index + 1}
                                </div>
                                Referans
                            </div>

                            <div className="space-y-4">
                                <TextInput
                                    label="Ad Soyad"
                                    value={ref.name}
                                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                                    placeholder="Örn. Canan Dağdeviren"
                                    icon={User}
                                />
                                <TextInput
                                    label="Kurum / Pozisyon"
                                    value={ref.company}
                                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                                    placeholder="Örn. ABC Teknoloji - CTO"
                                    icon={Briefcase}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <TextInput
                                        label="Telefon"
                                        value={ref.phone}
                                        onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                                        placeholder="05XX XXX XX XX"
                                        icon={Phone}
                                    />
                                    <TextInput
                                        label="E-posta"
                                        value={ref.email}
                                        onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                                        placeholder="mail@ornek.com"
                                        icon={Mail}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addReference}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Yeni Referans Ekle
                    </button>
                </div>
            )}

            {/* Hobbies Tab */}
            {activeTab === 'hobbies' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {(cvData.hobbies || []).map((hobby) => (
                            <div key={hobby.id} className="p-4 bg-white/[0.02] border border-white/10 rounded-xl relative group/item">
                                <button
                                    onClick={() => removeHobby(hobby.id)}
                                    className="absolute -top-2 -right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover/item:opacity-100 transition-all shadow-lg scale-75"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <TextInput
                                    label="Hobi / İlgi Alanı"
                                    value={hobby.name}
                                    onChange={(e) => updateHobby(hobby.id, 'name', e.target.value)}
                                    placeholder="Örn. Doğa Fotoğrafçılığı"
                                    icon={Heart}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addHobby}
                        className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-pink-500/50 hover:text-pink-400 hover:bg-pink-500/5 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Hobi Ekle
                    </button>
                </div>
            )}

            {/* Templates Tab Preview Trigger */}
            {activeTab === 'templates' && (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.01]">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                        <Layout className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Şablon Seçici</h3>
                    <p className="text-sm text-slate-500 font-medium mb-8">Profesyonel şablonlar arasında geçiş yapın.</p>
                    <button
                        onClick={() => document.getElementById('template-modal-trigger')?.click()}
                        className="btn-premium px-8 py-3 rounded-xl text-xs font-black"
                    >
                        GALERİYİ AÇ
                    </button>
                </div>
            )}

            {/* Styling Tab */}
            {activeTab === 'styling' && (
                <div className="space-y-10">
                    {/* Template Selector */}
                    <div className="space-y-4">
                        <InputLabel label="Şablon Seçimi" icon={LayoutIcon} />

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {templateCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setTemplateCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${templateCategory === cat
                                        ? 'bg-cyan-500 text-slate-950'
                                        : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={templateSearch}
                                onChange={(e) => setTemplateSearch(e.target.value)}
                                placeholder="Şablon ara..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>

                        {/* Template Grid */}
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {filteredTemplates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${selectedTemplate === t.id
                                        ? 'bg-cyan-500/20 border-cyan-500 ring-1 ring-cyan-500/30'
                                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-lg">{t.emoji}</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-wide text-center leading-tight ${selectedTemplate === t.id ? 'text-cyan-400' : 'text-slate-500'
                                        }`}>
                                        {t.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Template count */}
                        <p className="text-[9px] text-slate-600 text-center font-medium">
                            {filteredTemplates.length} şablon gösteriliyor
                        </p>
                    </div>

                    {isWebTemplate && (
                        <div className="space-y-6 p-5 rounded-3xl border border-white/10 bg-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-white">Web Görünüm</p>
                                    <p className="text-[11px] text-slate-500">Canlı portföy renklerini ve fontlarını özelleştirin.</p>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1">Web CV</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Vurgu', key: 'webAccentColor' },
                                    { label: 'Arka Plan', key: 'webBackgroundColor' },
                                    { label: 'Metin', key: 'webTextColor' }
                                ].map(({ label, key }) => (
                                    <div key={key} className="space-y-2">
                                        <InputLabel label={label} icon={Palette} />
                                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
                                            <input
                                                type="color"
                                                value={theme[key] || '#000000'}
                                                onChange={(e) => setTheme(prev => ({ ...prev, [key]: e.target.value }))}
                                                className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer bg-transparent"
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {theme[key] || '#000000'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <InputLabel label="Web Yazı Tipi" icon={Type} />
                                <div className="grid grid-cols-2 gap-2">
                                    {webFontOptions.map(font => (
                                        <button
                                            key={font}
                                            onClick={() => setTheme(prev => ({ ...prev, webFontFamily: font }))}
                                            className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${theme.webFontFamily === font
                                                ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                                }`}
                                            style={{ fontFamily: font }}
                                        >
                                            {font}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <InputLabel label="Arka Plan Dokusu" icon={Palette} />
                                <div className="flex flex-wrap gap-2">
                                    {webPatternOptions.map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => setTheme(prev => ({ ...prev, webPattern: option.id }))}
                                            className={`flex-1 min-w-[120px] px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${theme.webPattern === option.id
                                                ? 'bg-white/10 border-cyan-500/40 text-white'
                                                : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <InputLabel label="Hızlı Renk Paketleri" icon={Sparkles} />
                                <div className="grid grid-cols-2 gap-3">
                                    {webPresets.map(preset => (
                                        <button
                                            key={preset.name}
                                            onClick={() => setTheme(prev => ({
                                                ...prev,
                                                webAccentColor: preset.accent,
                                                webBackgroundColor: preset.bg,
                                                webTextColor: preset.text,
                                                webPattern: preset.pattern
                                            }))}
                                            className={`p-3 rounded-2xl border flex flex-col gap-2 transition-all group ${theme.webAccentColor === preset.accent && theme.webBackgroundColor === preset.bg ? 'bg-white/10 border-cyan-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="flex gap-1 h-2 rounded-full overflow-hidden w-full">
                                                <div className="flex-1" style={{ backgroundColor: preset.bg }} />
                                                <div className="flex-1" style={{ backgroundColor: preset.text }} />
                                                <div className="flex-1" style={{ backgroundColor: preset.accent }} />
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{preset.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <InputLabel label="Yazı Tipi (Font)" icon={Type} />
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: 'Inter' },
                                { name: 'Montserrat' },
                                { name: 'Roboto' },
                                { name: 'Playfair Display' },
                                { name: 'Lato' },
                                { name: 'Poppins' }
                            ].map((font) => (
                                <button
                                    key={font.name}
                                    onClick={() => setTheme(prev => ({ ...prev, fontFamily: font.name }))}
                                    className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${theme.fontFamily === font.name
                                        ? 'bg-cyan-500 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                        }`}
                                    style={{ fontFamily: font.name }}
                                >
                                    {font.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InputLabel label="Renk Paketleri" icon={Palette} />
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: 'Royal Gold', colors: ['#D4AF37', '#1A1A1A'] },
                                { name: 'Midnight Blue', colors: ['#0F172A', '#38BDF8'] },
                                { name: 'Emerald Forest', colors: ['#064E3B', '#10B981'] },
                                { name: 'Modern Crimson', colors: ['#991B1B', '#F87171'] },
                                { name: 'Deep Purple', colors: ['#4C1D95', '#A78BFA'] },
                                { name: 'Slate Professional', colors: ['#1E293B', '#94A3B8'] }
                            ].map((palette) => (
                                <button
                                    key={palette.name}
                                    onClick={() => setTheme(prev => ({ ...prev, accentColor: palette.colors[palette.colors.length - 1], paletteName: palette.name }))}
                                    className={`p-3 rounded-2xl border flex flex-col gap-2 transition-all group ${theme.paletteName === palette.name
                                        ? 'bg-white/10 border-cyan-500/50 p-3 ring-1 ring-cyan-500/20'
                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex gap-1 h-2 rounded-full overflow-hidden w-full">
                                        {palette.colors.map((c, i) => (
                                            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest text-center ${theme.paletteName === palette.name ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                        {palette.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InputLabel label="Vurgu Rengi (Özel)" icon={Palette} />
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={theme.accentColor}
                                onChange={(e) => setTheme(prev => ({ ...prev, accentColor: e.target.value, paletteName: 'Custom' }))}
                                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1 cursor-pointer"
                            />
                            <div className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {theme.accentColor}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InputLabel label="Yazı Boyutu" icon={Type} />
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                            {['Küçük', 'Normal', 'Büyük'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setTheme(prev => ({ ...prev, fontSize: size }))}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${theme.fontSize === size ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <InputLabel label="Ekstra Özellikler" icon={Sparkles} />
                        <div className="space-y-3">
                            <button
                                onClick={() => setTheme(prev => ({ ...prev, showQrCode: !prev.showQrCode }))}
                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${theme.showQrCode ? 'bg-cyan-500/10 border-cyan-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">QR Kod (LinkedIn / Web)</span>
                                </div>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${theme.showQrCode ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme.showQrCode ? 'left-4.5' : 'left-0.5'}`} />
                                </div>
                            </button>

                            <button
                                onClick={addCustomSection}
                                className="w-full p-4 rounded-xl border border-dashed border-white/10 bg-white/5 text-slate-500 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:border-purple-500/50 hover:text-purple-400 transition-all"
                            >
                                <Plus className="w-4 h-4" /> ÖZEL BÖLÜM EKLE
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-cyan-400" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Akıllı Düzen</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Şablon üzerindeki boşluklar ve hiyerarşi, seçtiğiniz tasarıma göre yapay zeka tarafından otomatik optimize edilmektedir.</p>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-8">
                    <TextInput
                        label="Döküman Adı"
                        value={cvName}
                        onChange={(e) => setCvName(e.target.value)}
                        placeholder="Örn. Yazılım Geliştirici CV"
                        icon={SettingsIcon}
                    />

                    <div className="space-y-4">
                        <InputLabel label="Döküman Dili" icon={Globe} />
                        <select
                            value={theme.language}
                            onChange={(e) => setTheme(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 appearance-none cursor-pointer"
                        >
                            <option value="tr" className="bg-[#0f1115]">Türkçe</option>
                            <option value="en" className="bg-[#0f1115]">English</option>
                            <option value="de" className="bg-[#0f1115]">Deutsch</option>
                            <option value="fr" className="bg-[#0f1115]">Français</option>
                        </select>
                    </div>

                    <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-sm font-bold text-white">Yaşayan CV Ayarları</p>
                                <p className="text-[11px] text-slate-500">Özelleştirilmiş bağlantı ve paylaşım meta verileri.</p>
                            </div>
                            <button
                                onClick={() => updatePublicProfile('isPublic', !publicProfile.isPublic)}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${publicProfile.isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'}`}
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                {publicProfile.isPublic ? 'Yayında' : 'Taslak'}
                            </button>
                        </div>

                        <div className="space-y-3">
                            <InputLabel label="Özel Slug" icon={LinkIcon} />
                            <div className="flex gap-2 flex-col sm:flex-row">
                                <input
                                    value={publicProfile.slug}
                                    onChange={(e) => updatePublicProfile('slug', slugify(e.target.value))}
                                    placeholder="ornek-ad"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                />
                                <button
                                    onClick={generateSlug}
                                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-white/10"
                                >
                                    Otomatik
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <InputLabel label="Paylaşım Bağlantısı" icon={Globe} />
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-3">
                                    <span className="text-xs font-medium text-slate-400 truncate">{shareUrl || `${baseShareUrl}/cv/slug`}</span>
                                    <button
                                        onClick={handleCopyLink}
                                        disabled={!shareUrl}
                                        className={`p-2 rounded-lg border ${linkCopied ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                {shareUrl && (
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                                            <QrCode className="w-4 h-4" /> QR
                                        </div>
                                        <div className="bg-white p-2 rounded-2xl">
                                            <QRCodeDisplay url={shareUrl} size={96} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Meta Başlık"
                                value={publicProfile.metaTitle}
                                onChange={(e) => updatePublicProfile('metaTitle', e.target.value)}
                                placeholder="Örn. Ahmet Yılmaz | Frontend Developer"
                                icon={Type}
                            />
                            <TextInput
                                label="Sosyal Görsel URL"
                                value={publicProfile.socialImage}
                                onChange={(e) => updatePublicProfile('socialImage', e.target.value)}
                                placeholder="https://.../cover.png"
                                icon={ImageIcon}
                            />
                        </div>

                        <div>
                            <InputLabel label="Meta Açıklama" icon={Sparkles} />
                            <textarea
                                value={publicProfile.metaDescription}
                                onChange={(e) => updatePublicProfile('metaDescription', e.target.value)}
                                placeholder="LinkedIn paylaşımı için kısa açıklama..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 min-h-[100px]"
                            />
                        </div>

                        <div className="pt-6 border-t border-white/10 space-y-5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <p className="text-sm font-bold text-white">Versiyon & Yayınlama</p>
                                    <p className="text-[11px] text-slate-500">Taslağı yayına al, planla veya geri al.</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${publishStatusMeta.classes}`}>
                                    {publishStatusMeta.label}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <InputLabel label="Yayınlanacak Versiyon" icon={GitBranch} />
                                <div className="relative">
                                    <select
                                        value={selectedPublishVersion}
                                        onChange={(e) => updatePublicProfile('selectedVersionId', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                    >
                                        <option value="current" className="bg-[#0f1115]">Güncel taslak (editördeki hali)</option>
                                        {versionList.map((version) => {
                                            const value = version.id || version._id || version.name
                                            return (
                                                <option key={value} value={value} className="bg-[#0f1115]">
                                                    {version.name || 'Versiyon'} {version.createdAt ? `• ${formatDateTime(version.createdAt)}` : ''}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                {!cvId && (
                                    <p className="text-[11px] text-slate-600">Versiyon geçmişi, kaydedilen CV'ler için otomatik oluşur.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Canlı Sürüm</p>
                                    <p className="text-sm font-semibold text-white">{liveVersionLabel}</p>
                                    <p className="text-[11px] text-slate-500">Yayımlandı: {lastPublishedDisplay}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <InputLabel label="Yayın Planı" icon={CalendarClock} />
                                        {publicProfile.scheduledVersionId && (
                                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-300">
                                                {scheduledVersionLabel}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="datetime-local"
                                        value={scheduledInputValue}
                                        onChange={(e) => handleScheduleInput(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                    <p className="text-[11px] text-slate-500">Plan: {scheduledDisplay}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handlePublishNow}
                                    className="flex-1 min-w-[160px] px-4 py-3 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/25 transition-all"
                                >
                                    <Play className="w-4 h-4" /> Hemen Yayınla
                                </button>
                                <button
                                    onClick={handleSchedulePublish}
                                    disabled={!canSchedule}
                                    className={`flex-1 min-w-[160px] px-4 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${canSchedule ? 'bg-amber-500/15 text-amber-200 border-amber-500/40 hover:bg-amber-500/25' : 'bg-white/5 text-slate-600 border-white/10 cursor-not-allowed'}`}
                                >
                                    <CalendarClock className="w-4 h-4" /> Yayın Planla
                                </button>
                                <button
                                    onClick={handleRollbackLive}
                                    disabled={!publicProfile.previousLiveVersionId}
                                    className={`flex-1 min-w-[160px] px-4 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${publicProfile.previousLiveVersionId ? 'bg-white/5 text-slate-200 border-white/20 hover:bg-white/10' : 'bg-white/5 text-slate-600 border-white/10 cursor-not-allowed'}`}
                                >
                                    <RotateCcw className="w-4 h-4" /> Canlıyı Geri Al
                                </button>
                            </div>

                            {publicProfile.previousLiveVersionId && (
                                <p className="text-[11px] text-slate-500 flex items-center gap-2">
                                    <History className="w-3 h-3" /> Son canlı sürüm: {resolveVersionLabel(publicProfile.previousLiveVersionId)}
                                </p>
                            )}
                        </div>

                        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <p className="text-sm font-bold text-white">Analitik & Bildirimler</p>
                                    <p className="text-[11px] text-slate-500">Görüntülenme performansını takip edin, rapor alın.</p>
                                </div>
                                <BarChart3 className="w-5 h-5 text-cyan-400" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[{
                                    label: 'Toplam Görüntülenme',
                                    value: analytics.totalViews?.toLocaleString('tr-TR') || '0',
                                    badge: '+18% son hafta'
                                }, {
                                    label: 'Tekil Ziyaretçi',
                                    value: analytics.uniqueVisitors?.toLocaleString('tr-TR') || '0',
                                    badge: '+9 yeni şehir'
                                }, {
                                    label: 'Tıklama Oranı',
                                    value: `${analytics.clickThroughRate || 0}%`,
                                    badge: 'Paylaşımlardan'
                                }, {
                                    label: 'Sayfada Kalma',
                                    value: formatDuration(analytics.avgTimeOnPage),
                                    badge: 'Ortalama süre'
                                }].map((card, idx) => (
                                    <div key={card.label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{card.label}</p>
                                        <p className="text-2xl font-black text-white">{card.value}</p>
                                        <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest">{card.badge}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <InputLabel label="Haftalık Trafik" icon={Activity} />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Son 7 Gün</span>
                                    </div>
                                    <div className="flex items-end gap-2 h-32">
                                        {timelineData.map((point) => {
                                            const height = Math.max((point.views / maxTimelineValue) * 100, 5)
                                            return (
                                                <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                                                    <div
                                                        className="w-full rounded-t-lg bg-gradient-to-br from-cyan-500/50 to-cyan-300"
                                                        style={{ height: `${height}%` }}
                                                    />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{point.day}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <InputLabel label="Coğrafya & Kaynak" icon={Globe} />
                                    <div className="space-y-2">
                                        {(analytics.geo?.length ? analytics.geo : [{ country: 'Veri yok', value: 0 }]).map((item) => (
                                            <div key={item.country} className="flex items-center justify-between text-sm text-white/80">
                                                <span>{item.country}</span>
                                                <span className="text-[11px] font-black text-cyan-300">%{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-white/10 pt-3 space-y-2">
                                        {(analytics.topReferrers?.length ? analytics.topReferrers : [{ source: 'Henüz paylaşım yok', clicks: 0 }]).map((ref) => (
                                            <div key={ref.source} className="flex items-center justify-between text-sm text-slate-300">
                                                <span>{ref.source}</span>
                                                <span className="text-[11px] font-black text-white">{ref.clicks} tıklama</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/40 to-slate-900/20 p-5 space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <Bell className="w-5 h-5 text-amber-300" />
                                    <div>
                                        <p className="text-sm font-bold">Otomatik Bildirimler</p>
                                        <p className="text-[11px] text-slate-500">Haftalık rapor ve eşik uyarılarını al.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[{
                                        key: 'weeklyEmail',
                                        label: 'Haftalık E-posta Özeti',
                                        icon: MailOpen
                                    }, {
                                        key: 'pushAlerts',
                                        label: 'Anlık Push Uyarıları',
                                        icon: Bell
                                    }, {
                                        key: 'viewMilestones',
                                        label: '100/500 Görüntüleme Alarmları',
                                        icon: Activity
                                    }, {
                                        key: 'referralDigest',
                                        label: 'Kaynak Raporu (Ay Sonu)',
                                        icon: Globe
                                    }].map((pref) => {
                                        const enabled = notificationPrefs[pref.key]
                                        const Icon = pref.icon
                                        return (
                                            <button
                                                key={pref.key}
                                                onClick={() => updateNotificationPrefs(pref.key, !enabled)}
                                                className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition-all ${enabled ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <div>
                                                    <p className="text-xs font-bold">{pref.label}</p>
                                                    <p className="text-[10px] uppercase tracking-widest">{enabled ? 'Açık' : 'Kapalı'}</p>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <p className="text-sm font-bold text-white">Entegrasyonlar</p>
                                    <p className="text-[11px] text-slate-500">LinkedIn, Behance, GitHub ve veritabanı kaynaklarından içerik çek.</p>
                                </div>
                                <Globe className="w-5 h-5 text-cyan-300" />
                            </div>

                            <div className="space-y-4">
                                {integrationProviders.map((provider) => {
                                    const state = integrationSettings[provider.key] || defaultIntegrationSettings[provider.key]
                                    const Icon = provider.icon
                                    const config = integrationFieldConfig[provider.key]
                                    const connected = state?.connected
                                    return (
                                        <div key={provider.key} className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${provider.accent} flex items-center justify-center text-white`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{provider.label}</p>
                                                            <p className="text-[11px] text-slate-500">{provider.description}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${connected ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                                                            {connected ? 'Bağlı' : 'Hazır'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-1">Son senkron: {formatIntegrationDate(state?.lastSync)}</p>
                                                </div>
                                            </div>

                                            {config && (
                                                <div>
                                                    <InputLabel label={config.label} icon={LinkIcon} />
                                                    <input
                                                        value={state?.[config.field] || ''}
                                                        onChange={(e) => updateIntegrationSettings(provider.key, { [config.field]: e.target.value })}
                                                        placeholder={config.placeholder}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => connected ? handleIntegrationDisconnect(provider.key) : handleIntegrationConnect(provider.key)}
                                                    className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border flex items-center gap-2 ${connected ? 'border-red-500/40 text-red-300 bg-red-500/10' : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'}`}
                                                >
                                                    {connected ? 'Bağlantıyı Kes' : 'Bağlan'}
                                                </button>
                                                <button
                                                    onClick={() => handleIntegrationSync(provider.key)}
                                                    disabled={!connected}
                                                    className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border flex items-center gap-2 ${connected ? 'border-white/20 text-white bg-white/5 hover:bg-white/10' : 'border-white/5 text-slate-600 bg-white/5 cursor-not-allowed'}`}
                                                >
                                                    <RefreshCw className="w-4 h-4" /> Veri Çek
                                                </button>
                                                <button
                                                    onClick={() => toggleIntegrationAutoImport(provider.key)}
                                                    className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border flex items-center gap-2 ${state?.autoImport ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-white/10 text-slate-400 bg-white/5'}`}
                                                >
                                                    {state?.autoImport ? 'Oto Senkron Açık' : 'Oto Senkron Kapalı'}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-white/10 bg-white/5 space-y-6">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <p className="text-sm font-bold text-white">Modüler Widget Kütüphanesi</p>
                                    <p className="text-[11px] text-slate-500">Blog, video, referans ve CTA bileşenleriyle web CV'yi zenginleştir.</p>
                                </div>
                                <Sparkles className="w-5 h-5 text-cyan-300" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Hazır Bileşenler</p>
                                    <div className="space-y-3">
                                        {widgetLibrary.map(widget => (
                                            <button
                                                key={widget.type}
                                                onClick={() => addWidget(widget.type)}
                                                className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-4 text-left hover:border-cyan-500/40 hover:bg-white/10 transition-all"
                                            >
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${widget.accent} flex items-center justify-center text-white`}>
                                                    <widget.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-white">{widget.label}</p>
                                                    <p className="text-[11px] text-slate-500">{widget.description}</p>
                                                </div>
                                                <Plus className="w-4 h-4 text-slate-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Aktif Widgetlar</p>
                                    {webWidgets.length === 0 ? (
                                        <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 text-sm">
                                            Henüz widget eklenmedi. Soldan bir bileşen seçerek başlayın.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {webWidgets.map((widget, index) => {
                                                const definition = widgetDictionary[widget.type]
                                                return (
                                                    <div
                                                        key={widget.id}
                                                        onClick={() => setActiveWidgetId(widget.id)}
                                                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeWidgetId === widget.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'} `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <GripVertical className="w-4 h-4 text-slate-500" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-white">{getWidgetLabel(widget)}</p>
                                                                <p className="text-[11px] text-slate-500">{definition?.label || widget.type}</p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleWidget(widget.id) }}
                                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${widget.enabled ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/15 text-slate-400'}`}
                                                            >
                                                                {widget.enabled ? 'Aktif' : 'Pasif'}
                                                            </button>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); moveWidget(widget.id, 'up') }}
                                                                    disabled={index === 0}
                                                                    className={`p-2 rounded-lg border ${index === 0 ? 'border-white/5 text-slate-600 cursor-not-allowed' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                                                                >
                                                                    <ChevronUp className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); moveWidget(widget.id, 'down') }}
                                                                    disabled={index === webWidgets.length - 1}
                                                                    className={`p-2 rounded-lg border ${index === webWidgets.length - 1 ? 'border-white/5 text-slate-600 cursor-not-allowed' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                                                                >
                                                                    <ChevronDown className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); removeWidget(widget.id) }}
                                                                    className="p-2 rounded-lg border border-white/10 text-red-300 hover:text-red-200 hover:border-red-500/40"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-white">Widget Detayları</p>
                                        <p className="text-[11px] text-slate-500">{selectedWidgetDefinition?.label || 'Seçili widget yok'}</p>
                                    </div>
                                    {selectedWidget && (
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedWidget.enabled ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                                            {selectedWidget.enabled ? 'Aktif' : 'Pasif'}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {renderWidgetEditor()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <button
                            onClick={handleClearAll}
                            className="w-full py-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
                        >
                            <History className="w-4 h-4" />
                            TÜM VERİLERİ SIFIRLA
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Auto-save Indicator */}
            <div className="pt-12 mt-12 border-t border-white/5 flex items-center justify-end gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Buluta Kaydedildi
            </div>
            {/* AI Modal */}
            {showAIModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                AI Asistanı
                            </h3>
                            <button onClick={() => setShowAIModal(false)} className="text-slate-400 hover:text-white">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {aiLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm text-slate-400 animate-pulse">
                                        Yapay zeka içeriğinizi oluşturuyor...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-widest">
                                        ÖNERİLEN İÇERİKLER
                                    </p>
                                    {aiOptions.map((option, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                if (aiTarget?.type === 'summary') {
                                                    updatePersonal('summary', option)
                                                } else if (aiTarget?.type === 'experience' && aiTarget?.id) {
                                                    const currentExp = cvData.experience.find(e => e.id === aiTarget.id)
                                                    const newDesc = (currentExp?.description ? currentExp.description + "\n\n" : "") + option
                                                    updateExperience(aiTarget.id, 'description', newDesc)
                                                }
                                                setShowAIModal(false)
                                            }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/30 cursor-pointer transition-all group"
                                        >
                                            <p className="text-sm text-slate-300 group-hover:text-white leading-relaxed">
                                                {option}
                                            </p>
                                        </div>
                                    ))}
                                    {aiOptions.length === 0 && (
                                        <p className="text-center text-slate-500 py-4">Sonuç bulunamadı.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <AIHeadshotModal 
                isOpen={showHeadshotModal} 
                onClose={() => setShowHeadshotModal(false)} 
                onSelectImage={(img) => updatePersonal('photo', img)}
            />
        </div>
    )
}

function Layout({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
        </svg>
    )
}

