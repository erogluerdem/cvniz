import { useState, useEffect } from 'react'
import {
    Palette, Sun, Moon, Type, Sliders, Eye, Save, RotateCcw,
    Plus, Trash2, Check, Layout, Sparkles, Wand2, Monitor,
    Smartphone, Tablet, CheckCircle2, AlertTriangle, Layers,
    ChevronRight, Settings2, Image as ImageIcon
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
    }
}

export default function ThemePage() {
    const { toast, confirm } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [themes, setThemes] = useState([])
    const [activeThemeSlug, setActiveThemeSlug] = useState('default')
    const [selectedTheme, setSelectedTheme] = useState(defaultThemeData)
    const [previewDevice, setPreviewDevice] = useState('desktop') // desktop, tablet, mobile

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
                toast.success('Aktif tema değiştirildi!')
            }
        } catch (error) {
            toast.error('Aktif tema ayarlanamadı')
        }
    }

    const handleDelete = async (id) => {
        const confirmed = await confirm({
            title: 'Temayı Sil',
            message: 'Bu temayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            confirmText: 'Evet, Sil',
            type: 'danger'
        })
        if (!confirmed) return

        try {
            const response = await adminAPI.deleteTheme(id)
            if (response.success) {
                toast.success('Tema silindi')
                fetchData()
            }
        } catch (error) {
            toast.error('Tema silinemedi')
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
        setSelectedTheme(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }))
    }

    const updateUI = (key, value) => {
        setSelectedTheme(prev => ({
            ...prev,
            ui: { ...prev.ui, [key]: value }
        }))
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
                    <Palette className="w-10 h-10 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center font-primary">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Stil Merkezi Yükleniyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic italic">Renkler ve dokular hazırlanıyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 font-primary">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 shadow-xl shadow-purple-500/10">
                        <Palette className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Görünüm Atölyesi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">Marka Kimliği Özelleştirme</p>
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
                        DEĞIŞIKLIKLERI KAYDET
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Preset List & Settings */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Theme Presets */}
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-purple-500/10">
                                    <Layers className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Presetler</h3>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {themes.map(t => (
                                <div
                                    key={t._id}
                                    onClick={() => setSelectedTheme(t)}
                                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedTheme._id === t._id
                                            ? 'bg-purple-500/10 border-purple-500/30'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-900" style={{ backgroundColor: t.colors.primary }}></div>
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-900" style={{ backgroundColor: t.colors.secondary }}></div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">{t.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    {activeThemeSlug === t.slug && (
                                                        <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest bg-purple-400/10 px-1.5 py-0.5 rounded">AKTİF</span>
                                                    )}
                                                    <span className="text-[8px] text-gray-500 font-bold uppercase">{t.slug}</span>
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
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }}
                                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent blur-xl -z-10 group-hover:scale-150 transition-transform"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="p-6 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                        <div className="p-2.5 rounded-2xl bg-amber-500/20 mt-1">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h5 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1">Görsel Tutarlılık</h5>
                            <p className="text-[10px] text-amber-200/60 font-bold uppercase leading-relaxed">Değişikliklerin sistem geneline yansıması için temanın 'Aktif' olarak seçilmesi ve kaydedilmesi gerekmektedir.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Editor & Preview */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Settings Form */}
                        <div className="glass-card rounded-[3rem] p-8 border border-white/5 space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 rounded-2xl bg-cyan-500/10">
                                    <Settings2 className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Düzenleyici</h3>
                            </div>

                            {/* Preset Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Preset Adı</label>
                                <input
                                    type="text"
                                    value={selectedTheme.name}
                                    onChange={(e) => setSelectedTheme(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs focus:border-purple-500/50 outline-none transition-all uppercase tracking-widest"
                                />
                            </div>

                            {/* Colors */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Palette className="w-4 h-4 text-purple-400" />
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Renk Paleti</label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'primary', label: 'Ana Renk' },
                                        { key: 'secondary', label: 'İkincil' },
                                        { key: 'accent', label: 'Vurgu' },
                                        { key: 'background', label: 'Arka Plan' },
                                        { key: 'surface', label: 'Yüzey' },
                                        { key: 'text', label: 'Yazı Rengi' }
                                    ].map(color => (
                                        <div key={color.key} className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{color.label}</label>
                                            <div className="flex items-center gap-2">
                                                <div className="relative group">
                                                    <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden shadow-lg group-hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: selectedTheme.colors[color.key] }}>
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
                                                    className="flex-1 px-3 py-2 bg-black/20 border border-white/5 rounded-xl text-[10px] font-mono text-white focus:border-purple-500/30 outline-none uppercase"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Typography */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Type className="w-4 h-4 text-cyan-400" />
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Tipografi</label>
                                </div>
                                <div className="space-y-3">
                                    <select
                                        value={selectedTheme.typography.fontFamily}
                                        onChange={(e) => setSelectedTheme(prev => ({ ...prev, typography: { ...prev.typography, fontFamily: e.target.value } }))}
                                        className="w-full px-5 py-3.5 bg-slate-900/50 border border-white/10 rounded-2xl text-white font-bold text-xs appearance-none focus:border-cyan-500/50 focus:outline-none transition-all cursor-pointer"
                                    >
                                        {fontOptions.map(font => (
                                            <option key={font.name} value={font.name} style={{ fontFamily: font.value }}>{font.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* UI Components */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sliders className="w-4 h-4 text-emerald-400" />
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">UI Elementleri</label>
                                </div>

                                <div className="space-y-4 p-5 rounded-[2rem] bg-black/20 border border-white/5">
                                    <div>
                                        <div className="flex justify-between items-end mb-2 px-1">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Köşe Radüsü</span>
                                            <span className="text-xs font-black text-emerald-400">{selectedTheme.ui.borderRadius}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="32"
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
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Glassmorphism</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition-all ${selectedTheme.ui.glassmorphism ? 'bg-emerald-500' : 'bg-gray-800'}`}>
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${selectedTheme.ui.glassmorphism ? 'right-1' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Preview */}
                        <div className="space-y-6">
                            <div className="glass-card rounded-[3rem] p-8 border border-white/5 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-amber-500/10">
                                            <Eye className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">İnteraktif Önizleme</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'desktop', icon: <Monitor className="w-4 h-4" /> },
                                            { id: 'tablet', icon: <Tablet className="w-4 h-4" /> },
                                            { id: 'mobile', icon: <Smartphone className="w-4 h-4" /> }
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

                                <div className="flex-1 flex items-center justify-center p-4 bg-slate-900/50 rounded-[2.5rem] border border-white/5 shadow-inner">
                                    <div
                                        className="transition-all duration-500 shadow-2xl relative overflow-hidden"
                                        style={{
                                            width: previewDevice === 'mobile' ? '280px' : previewDevice === 'tablet' ? '400px' : '100%',
                                            height: previewDevice === 'desktop' ? '500px' : '550px',
                                            backgroundColor: selectedTheme.colors.background,
                                            borderRadius: `${selectedTheme.ui.borderRadius}px`,
                                            fontFamily: fontOptions.find(f => f.name === selectedTheme.typography.fontFamily)?.value || 'sans-serif',
                                        }}
                                    >
                                        {/* Mock UI Contents */}
                                        <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span style={{ color: selectedTheme.colors.text }} className="text-lg font-black tracking-tighter uppercase italic">CVIFY</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                                                    <Sun className="w-4 h-4" style={{ color: selectedTheme.colors.primary }} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h1 style={{ color: selectedTheme.colors.primary }} className="text-2xl font-black leading-tight tracking-tight uppercase italic">Geleceğini <br />Burada İnşa Et</h1>
                                                <p style={{ color: selectedTheme.colors.textMuted }} className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">Modern, hızlı ve etkileyici CV'ler oluşturun. ATS dostu şablonlarla bir adım önde olun.</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    style={{
                                                        backgroundColor: selectedTheme.colors.primary,
                                                        borderRadius: `${selectedTheme.ui.borderRadius / 1.5}px`
                                                    }}
                                                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
                                                >
                                                    Hemen Başla
                                                </button>
                                                <button
                                                    style={{
                                                        backgroundColor: `${selectedTheme.colors.secondary}20`,
                                                        borderColor: `${selectedTheme.colors.secondary}40`,
                                                        borderRadius: `${selectedTheme.ui.borderRadius / 1.5}px`,
                                                        color: selectedTheme.colors.secondary
                                                    }}
                                                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border"
                                                >
                                                    İncele
                                                </button>
                                            </div>

                                            <div
                                                className="p-5 relative overflow-hidden"
                                                style={{
                                                    backgroundColor: selectedTheme.ui.glassmorphism ? 'rgba(255,255,255,0.03)' : selectedTheme.colors.surface,
                                                    backdropFilter: selectedTheme.ui.glassmorphism ? 'blur(10px)' : 'none',
                                                    borderRadius: `${selectedTheme.ui.borderRadius}px`,
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    boxShadow: selectedTheme.ui.shadows === 'soft' ? '0 10px 30px rgba(0,0,0,0.1)' : '0 15px 50px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div style={{ backgroundColor: `${selectedTheme.colors.primary}20` }} className="p-3 rounded-2xl border border-white/5">
                                                        <Sparkles className="w-5 h-5" style={{ color: selectedTheme.colors.primary }} />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ color: selectedTheme.colors.text }} className="text-xs font-black uppercase tracking-widest mb-1">AI Özellikleri</h4>
                                                        <p style={{ color: selectedTheme.colors.textMuted }} className="text-[9px] font-bold uppercase tracking-tighter italic">Yeni Nesil Deneyim</p>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent blur-3xl"></div>
                                            </div>

                                            <div className="space-y-3">
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest ml-1 block opacity-50">Trend Şablonlar</span>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[1, 2].map(i => (
                                                        <div
                                                            key={i}
                                                            className="aspect-[3/4] rounded-2xl relative overflow-hidden group shadow-lg"
                                                            style={{
                                                                backgroundColor: selectedTheme.colors.surface,
                                                                borderRadius: `${selectedTheme.ui.borderRadius / 1.2}px`,
                                                                border: '1px solid rgba(255,255,255,0.05)'
                                                            }}
                                                        >
                                                            <div className="absolute inset-x-2 top-2 bottom-8 bg-white/5 rounded-lg border border-white/5 space-y-2 p-2">
                                                                <div className="w-1/2 h-1.5 bg-white/10 rounded-full"></div>
                                                                <div className="w-full h-1 bg-white/10 rounded-full"></div>
                                                                <div className="w-3/4 h-1 bg-white/10 rounded-full"></div>
                                                            </div>
                                                            <div className="absolute inset-x-0 bottom-0 py-2 px-3 bg-black/40 backdrop-blur-md flex items-center justify-between">
                                                                <span className="text-[10px] font-black text-white uppercase">{i === 1 ? 'ELEGANT' : 'ELITE'}</span>
                                                                <Plus className="w-3 h-3 text-cyan-400" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6 italic">Tema Önizlemesi Gerçek Zamanlıdır</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
