import { useState, useEffect } from 'react'
import {
    Palette, Type, Sliders, Eye, Save, RotateCcw,
    Plus, Trash2, Check, Layers, Sparkles, Monitor,
    Smartphone, Tablet, CheckCircle2, Settings2, Image as ImageIcon,
    Layout, Zap, Globe, Wand2, Star
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const fontOptions = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Outfit', value: "'Outfit', sans-serif" },
    { name: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" }
]

const defaultThemeData = {
    name: 'Yeni Tema',
    slug: 'new-theme',
    colors: {
        primary: '#22d3ee',
        secondary: '#a855f7',
        accent: '#f59e0b',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        textMuted: '#94a3b8'
    },
    typography: {
        fontFamily: 'Inter',
        baseSize: '16px'
    },
    ui: {
        borderRadius: 12,
        glassmorphism: true,
        shadows: 'soft'
    },
    landing: {
        heroGradient: 'mesh',
        heroOverlayOpacity: 0.4,
        heroAnimation: 'orbs',
        cardBlur: 10,
        buttonStyle: 'rounded',
        headerTransparent: true,
        sectionSpacing: 'normal'
    }
}

const EDITOR_TABS = [
    { id: 'colors', label: 'Renkler', icon: <Palette className="w-4 h-4" /> },
    { id: 'typography', label: 'Tipografi', icon: <Type className="w-4 h-4" /> },
    { id: 'ui', label: 'Arayüz', icon: <Sliders className="w-4 h-4" /> },
    { id: 'landing', label: 'Landing', icon: <Globe className="w-4 h-4" /> },
]

export default function ThemePage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [themes, setThemes] = useState([])
    const [activeThemeSlug, setActiveThemeSlug] = useState('default')
    const [selectedTheme, setSelectedTheme] = useState(defaultThemeData)
    const [previewDevice, setPreviewDevice] = useState('desktop')
    const [editorTab, setEditorTab] = useState('colors')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await adminAPI.getThemes()
            if (response.success) {
                setThemes(response.themes)
                setActiveThemeSlug(response.activeThemeSlug)
                const active = response.themes.find(t => t.slug === response.activeThemeSlug)
                if (active) setSelectedTheme(active)
                else if (response.themes.length > 0) setSelectedTheme(response.themes[0])
            }
        } catch (error) {
            toast.error('Temalar yüklenirken hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            let response
            if (selectedTheme._id) {
                response = await adminAPI.updateTheme(selectedTheme._id, selectedTheme)
            } else {
                response = await adminAPI.createTheme(selectedTheme)
            }
            if (response.success) {
                toast.success('Tema başarıyla kaydedildi!')
                fetchData()
            }
        } catch (error) {
            toast.error('Tema kaydedilemedi')
        } finally {
            setSaving(false)
        }
    }

    const handleSetActive = async (slug) => {
        try {
            const response = await adminAPI.setActiveTheme(slug)
            if (response.success) {
                setActiveThemeSlug(slug)
                toast.success('Aktif tema değiştirildi! Sayfa yenileme yapılıyor...')
                setTimeout(() => window.location.reload(), 1500)
            }
        } catch (error) {
            toast.error('Aktif tema ayarlanamadı')
        }
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Bu temayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')
        if (!confirmed) return

        try {
            const response = await adminAPI.deleteTheme(id)
            if (response.success) {
                toast.success('Tema silindi')
                fetchData()
            }
        } catch (error) {
            toast.error(error.message || 'Tema silinemedi')
        }
    }

    const handleNewTheme = () => {
        setSelectedTheme({
            ...defaultThemeData,
            name: `Yeni Tema ${themes.length + 1}`,
            slug: `theme-${Date.now()}`
        })
    }

    const updateColor = (key, value) => {
        setSelectedTheme(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }))
    }

    const updateUI = (key, value) => {
        setSelectedTheme(prev => ({ ...prev, ui: { ...prev.ui, [key]: value } }))
    }

    const updateLanding = (key, value) => {
        setSelectedTheme(prev => ({ ...prev, landing: { ...(prev.landing || {}), [key]: value } }))
    }

    const landing = selectedTheme.landing || defaultThemeData.landing

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
                    <Palette className="w-10 h-10 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center font-primary">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Stil Merkezi Yükleniyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic">Renkler ve dokular hazırlanıyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 shadow-xl shadow-purple-500/10">
                        <Palette className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Görünüm Atölyesi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">Landing Tema Özelleştirme</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleNewTheme}
                        className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95"
                    >
                        <Plus className="w-4 h-4 text-purple-400" />
                        YENİ PRESET
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        KAYDET
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Presets */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass-card rounded-[2.5rem] p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-2xl bg-purple-500/10">
                                <Layers className="w-4 h-4 text-purple-400" />
                            </div>
                            <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">Presetler</h3>
                        </div>
                        <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                            {themes.map(t => (
                                <div
                                    key={t._id}
                                    onClick={() => setSelectedTheme(t)}
                                    className={`group p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedTheme._id === t._id
                                        ? 'bg-purple-500/10 border-purple-500/30'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-1.5">
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-900" style={{ backgroundColor: t.colors.primary }}></div>
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-900" style={{ backgroundColor: t.colors.secondary }}></div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-0.5">{t.name}</h4>
                                                <div className="flex items-center gap-1.5">
                                                    {activeThemeSlug === t.slug && (
                                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-1.5 py-0.5 rounded">AKTİF</span>
                                                    )}
                                                    <span className="text-[8px] text-gray-600 font-bold">{t.slug}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {activeThemeSlug !== t.slug && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSetActive(t.slug); }}
                                                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                                    title="Aktif Yap"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }}
                                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {themes.length === 0 && (
                                <div className="text-center py-8">
                                    <Sparkles className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Henüz tema yok</p>
                                    <p className="text-[9px] text-gray-700 mt-1">YENİ PRESET butonunu kullanın</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="p-4 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/20 mt-0.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Canlı Yayın</h5>
                            <p className="text-[9px] text-amber-200/50 font-bold uppercase leading-relaxed">Aktif yapılan tema anında landing page'e uygulanır.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Editor + Preview */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Editor */}
                        <div className="glass-card rounded-[3rem] p-8 border border-white/5 space-y-6">
                            {/* Preset Name */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Preset Adı</label>
                                <input
                                    type="text"
                                    value={selectedTheme.name}
                                    onChange={(e) => setSelectedTheme(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs focus:border-purple-500/50 outline-none transition-all uppercase tracking-widest"
                                />
                            </div>

                            {/* Editor Tabs */}
                            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/5">
                                {EDITOR_TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setEditorTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${editorTab === tab.id
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:block">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Colors Tab */}
                            {editorTab === 'colors' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Palette className="w-3.5 h-3.5 text-purple-400" />
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Renk Paleti</label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { key: 'primary', label: 'Ana Renk' },
                                            { key: 'secondary', label: 'İkincil' },
                                            { key: 'accent', label: 'Vurgu' },
                                            { key: 'background', label: 'Arka Plan' },
                                            { key: 'surface', label: 'Yüzey' },
                                            { key: 'text', label: 'Yazı Rengi' }
                                        ].map(color => (
                                            <div key={color.key} className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">{color.label}</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="relative group">
                                                        <div className="w-9 h-9 rounded-xl border border-white/10 overflow-hidden shadow-lg group-hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: selectedTheme.colors[color.key] }}>
                                                            <input
                                                                type="color"
                                                                value={selectedTheme.colors[color.key]}
                                                                onChange={(e) => updateColor(color.key, e.target.value)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={selectedTheme.colors[color.key]}
                                                        onChange={(e) => updateColor(color.key, e.target.value)}
                                                        className="flex-1 px-2.5 py-1.5 bg-black/20 border border-white/5 rounded-lg text-[9px] font-mono text-white focus:border-purple-500/30 outline-none uppercase"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Typography Tab */}
                            {editorTab === 'typography' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Type className="w-3.5 h-3.5 text-cyan-400" />
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Yazı Tipi</label>
                                    </div>
                                    <select
                                        value={selectedTheme.typography.fontFamily}
                                        onChange={(e) => setSelectedTheme(prev => ({ ...prev, typography: { ...prev.typography, fontFamily: e.target.value } }))}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-2xl text-white font-bold text-xs appearance-none focus:border-cyan-500/50 focus:outline-none transition-all cursor-pointer"
                                    >
                                        {fontOptions.map(font => (
                                            <option key={font.name} value={font.name} style={{ fontFamily: font.value }}>{font.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Önizleme</p>
                                        <p className="text-white text-xl font-bold" style={{ fontFamily: fontOptions.find(f => f.name === selectedTheme.typography.fontFamily)?.value }}>
                                            Kariyer Hedeflerinize Ulaşın
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: fontOptions.find(f => f.name === selectedTheme.typography.fontFamily)?.value }}>
                                            Yapay zeka destekli CV oluşturucu
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* UI Tab */}
                            {editorTab === 'ui' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest">UI Parametreleri</label>
                                    </div>
                                    <div className="space-y-4 p-4 rounded-[1.5rem] bg-black/20 border border-white/5">
                                        <div>
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Köşe Radüsü</span>
                                                <span className="text-xs font-black text-emerald-400">{selectedTheme.ui.borderRadius}px</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="32"
                                                value={selectedTheme.ui.borderRadius}
                                                onChange={(e) => updateUI('borderRadius', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                        <div
                                            onClick={() => updateUI('glassmorphism', !selectedTheme.ui.glassmorphism)}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                                                </div>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Glassmorphism</span>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full relative transition-all ${selectedTheme.ui.glassmorphism ? 'bg-emerald-500' : 'bg-gray-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${selectedTheme.ui.glassmorphism ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Gölge Stili</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['none', 'soft', 'heavy'].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => updateUI('shadows', s)}
                                                        className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${selectedTheme.ui.shadows === s ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                                    >
                                                        {s === 'none' ? 'YOK' : s === 'soft' ? 'YUMUŞAK' : 'GÜÇLÜ'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Landing Tab */}
                            {editorTab === 'landing' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Landing Görünümü</label>
                                    </div>
                                    <div className="space-y-4 p-4 rounded-[1.5rem] bg-black/20 border border-white/5">

                                        {/* Hero Gradient */}
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Hero Gradient</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { val: 'mesh', label: 'Mesh' },
                                                    { val: 'radial', label: 'Radial' },
                                                    { val: 'linear', label: 'Linear' },
                                                    { val: 'none', label: 'Yok' }
                                                ].map(g => (
                                                    <button
                                                        key={g.val}
                                                        onClick={() => updateLanding('heroGradient', g.val)}
                                                        className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${landing.heroGradient === g.val ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'}`}
                                                    >
                                                        {g.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hero Animation */}
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Arka Plan Animasyonu</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { val: 'orbs', label: '✦ Orbs' },
                                                    { val: 'particles', label: '· Particles' },
                                                    { val: 'grid', label: '⊞ Grid' },
                                                    { val: 'none', label: '× Yok' }
                                                ].map(a => (
                                                    <button
                                                        key={a.val}
                                                        onClick={() => updateLanding('heroAnimation', a.val)}
                                                        className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${landing.heroAnimation === a.val ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'}`}
                                                    >
                                                        {a.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Overlay Opacity */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Overlay Opaklığı</span>
                                                <span className="text-xs font-black text-cyan-400">{Math.round((landing.heroOverlayOpacity ?? 0.4) * 100)}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="100"
                                                value={Math.round((landing.heroOverlayOpacity ?? 0.4) * 100)}
                                                onChange={(e) => updateLanding('heroOverlayOpacity', parseInt(e.target.value) / 100)}
                                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>

                                        {/* Card Blur */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Kart Blur</span>
                                                <span className="text-xs font-black text-purple-400">{landing.cardBlur ?? 10}px</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="40"
                                                value={landing.cardBlur ?? 10}
                                                onChange={(e) => updateLanding('cardBlur', parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500"
                                            />
                                        </div>

                                        {/* Button Style */}
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Buton Stili</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { val: 'rounded', label: 'Yuvarlak' },
                                                    { val: 'sharp', label: 'Keskin' },
                                                    { val: 'pill', label: 'Hap' }
                                                ].map(b => (
                                                    <button
                                                        key={b.val}
                                                        onClick={() => updateLanding('buttonStyle', b.val)}
                                                        className={`py-2 text-[8px] font-black uppercase tracking-widest transition-all border ${landing.buttonStyle === b.val ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'} ${b.val === 'rounded' ? 'rounded-xl' : b.val === 'sharp' ? 'rounded-none' : 'rounded-full'}`}
                                                    >
                                                        {b.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Section Spacing */}
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Bölüm Boşluğu</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { val: 'compact', label: 'Sıkı' },
                                                    { val: 'normal', label: 'Normal' },
                                                    { val: 'spacious', label: 'Geniş' }
                                                ].map(sp => (
                                                    <button
                                                        key={sp.val}
                                                        onClick={() => updateLanding('sectionSpacing', sp.val)}
                                                        className={`py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${landing.sectionSpacing === sp.val ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-gray-500 border-white/5 hover:text-white'}`}
                                                    >
                                                        {sp.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Header Transparent */}
                                        <div
                                            onClick={() => updateLanding('headerTransparent', !landing.headerTransparent)}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-cyan-500/10">
                                                    <Layout className="w-3.5 h-3.5 text-cyan-400" />
                                                </div>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Şeffaf Header</span>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full relative transition-all ${landing.headerTransparent ? 'bg-cyan-500' : 'bg-gray-800'}`}>
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${landing.headerTransparent ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="space-y-4">
                            <div className="glass-card rounded-[3rem] p-6 border border-white/5 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-2xl bg-amber-500/10">
                                            <Eye className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <h3 className="text-sm font-black text-white italic uppercase tracking-tighter">Önizleme</h3>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[
                                            { id: 'desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
                                            { id: 'tablet', icon: <Tablet className="w-3.5 h-3.5" /> },
                                            { id: 'mobile', icon: <Smartphone className="w-3.5 h-3.5" /> }
                                        ].map(dev => (
                                            <button
                                                key={dev.id}
                                                onClick={() => setPreviewDevice(dev.id)}
                                                className={`p-2 rounded-xl transition-all ${previewDevice === dev.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-500 border border-transparent hover:text-white'}`}
                                            >
                                                {dev.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center justify-center p-3 bg-slate-900/50 rounded-[2rem] border border-white/5 shadow-inner overflow-hidden">
                                    <div
                                        className="transition-all duration-500 shadow-2xl relative overflow-hidden"
                                        style={{
                                            width: previewDevice === 'mobile' ? '260px' : previewDevice === 'tablet' ? '380px' : '100%',
                                            height: previewDevice === 'desktop' ? '480px' : '520px',
                                            backgroundColor: selectedTheme.colors.background,
                                            borderRadius: `${selectedTheme.ui.borderRadius}px`,
                                            fontFamily: fontOptions.find(f => f.name === selectedTheme.typography.fontFamily)?.value || 'sans-serif',
                                        }}
                                    >
                                        {/* Background animation preview */}
                                        {landing.heroAnimation === 'orbs' && (
                                            <>
                                                <div className="absolute w-48 h-48 rounded-full -top-12 -left-12 blur-3xl opacity-30" style={{ backgroundColor: selectedTheme.colors.primary }}></div>
                                                <div className="absolute w-40 h-40 rounded-full bottom-10 -right-10 blur-3xl opacity-20" style={{ backgroundColor: selectedTheme.colors.secondary }}></div>
                                            </>
                                        )}
                                        {landing.heroAnimation === 'grid' && (
                                            <div className="absolute inset-0 opacity-10" style={{
                                                backgroundImage: `linear-gradient(${selectedTheme.colors.primary}40 1px, transparent 1px), linear-gradient(90deg, ${selectedTheme.colors.primary}40 1px, transparent 1px)`,
                                                backgroundSize: '30px 30px'
                                            }}></div>
                                        )}

                                        {/* Mock UI Contents */}
                                        <div className="p-5 space-y-5 overflow-y-auto h-full custom-scrollbar relative z-10">
                                            {/* Nav */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})` }}></div>
                                                    <span style={{ color: selectedTheme.colors.text }} className="text-sm font-black tracking-tighter uppercase italic">CVniz</span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {['Şablonlar', 'Fiyat'].map(item => (
                                                        <span key={item} style={{ color: selectedTheme.colors.textMuted }} className="text-[8px] font-bold">{item}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Hero */}
                                            <div className="space-y-3">
                                                <div
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 text-[8px] font-black uppercase tracking-widest"
                                                    style={{
                                                        backgroundColor: `${selectedTheme.colors.primary}15`,
                                                        color: selectedTheme.colors.primary,
                                                        borderRadius: landing.buttonStyle === 'pill' ? '999px' : landing.buttonStyle === 'sharp' ? '2px' : '8px',
                                                        border: `1px solid ${selectedTheme.colors.primary}30`
                                                    }}
                                                >
                                                    <Star className="w-2.5 h-2.5 fill-current" /> Yeni Nesil CV Oluşturucu
                                                </div>
                                                <h1 style={{ color: selectedTheme.colors.text }} className="text-xl font-black leading-tight tracking-tight uppercase">
                                                    Profesyonel <span style={{ color: selectedTheme.colors.primary }}>CV'nizi</span><br />Dakikalar İçinde
                                                </h1>
                                                <p style={{ color: selectedTheme.colors.textMuted }} className="text-[9px] font-bold leading-relaxed">
                                                    AI destekli platform ile kariyer hedeflerinize ulaşın.
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        style={{
                                                            backgroundColor: selectedTheme.colors.primary,
                                                            color: selectedTheme.colors.background,
                                                            borderRadius: landing.buttonStyle === 'pill' ? '999px' : landing.buttonStyle === 'sharp' ? '2px' : `${selectedTheme.ui.borderRadius / 2}px`
                                                        }}
                                                        className="px-4 py-1.5 text-[8px] font-black uppercase tracking-widest shadow-lg"
                                                    >
                                                        Hemen Başla
                                                    </button>
                                                    <button
                                                        style={{
                                                            backgroundColor: `${selectedTheme.colors.secondary}15`,
                                                            borderColor: `${selectedTheme.colors.secondary}40`,
                                                            color: selectedTheme.colors.secondary,
                                                            borderRadius: landing.buttonStyle === 'pill' ? '999px' : landing.buttonStyle === 'sharp' ? '2px' : `${selectedTheme.ui.borderRadius / 2}px`
                                                        }}
                                                        className="px-4 py-1.5 text-[8px] font-black uppercase tracking-widest border"
                                                    >
                                                        İncele
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Feature Card */}
                                            <div
                                                style={{
                                                    backgroundColor: selectedTheme.ui.glassmorphism ? 'rgba(255,255,255,0.03)' : selectedTheme.colors.surface,
                                                    backdropFilter: selectedTheme.ui.glassmorphism ? `blur(${landing.cardBlur ?? 10}px)` : 'none',
                                                    borderRadius: `${selectedTheme.ui.borderRadius}px`,
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    boxShadow: selectedTheme.ui.shadows === 'none' ? 'none' : selectedTheme.ui.shadows === 'soft' ? '0 8px 24px rgba(0,0,0,0.1)' : '0 16px 48px rgba(0,0,0,0.3)'
                                                }}
                                                className="p-4 flex items-center gap-3"
                                            >
                                                <div style={{ backgroundColor: `${selectedTheme.colors.primary}20` }} className="p-2.5 rounded-xl">
                                                    <Zap className="w-4 h-4" style={{ color: selectedTheme.colors.primary }} />
                                                </div>
                                                <div>
                                                    <h4 style={{ color: selectedTheme.colors.text }} className="text-[9px] font-black uppercase tracking-widest">AI Destekli</h4>
                                                    <p style={{ color: selectedTheme.colors.textMuted }} className="text-[8px]">İçerik önerileri</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <CheckCircle2 className="w-4 h-4" style={{ color: selectedTheme.colors.accent }} />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { val: '100K+', label: 'Kullanıcı' },
                                                    { val: '107+', label: 'Şablon' },
                                                    { val: '%98', label: 'Memnuniyet' }
                                                ].map(stat => (
                                                    <div key={stat.label} className="text-center p-2 rounded-xl" style={{ backgroundColor: `${selectedTheme.colors.surface}80` }}>
                                                        <div className="text-sm font-black" style={{ color: selectedTheme.colors.primary }}>{stat.val}</div>
                                                        <div className="text-[7px] font-bold uppercase" style={{ color: selectedTheme.colors.textMuted }}>{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-4 italic">Gerçek Zamanlı Önizleme</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
