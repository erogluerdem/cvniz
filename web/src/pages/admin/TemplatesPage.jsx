import { useState, useEffect, useMemo} from 'react'
import { Link} from 'react-router-dom'
import {
 Plus, Crown, Star, Trash2, Edit, Eye, X, Save,
 Palette, Layout, Type, Copy, Check, RefreshCw,
 Filter, Search, Grid, List, AlertCircle, TrendingUp,
 CheckCircle2, Info, ArrowUpRight, Zap, Image, Upload
} from 'lucide-react'
import { templateAPI} from '../../services/api'
import { FilterTabs, StatusBadge} from '../../components/admin/SharedComponents'
import { useToast} from '../../context/ToastContext'
import { WEB_CV_TEMPLATES, WEB_CV_CATEGORIES} from '../../data/webCVTemplates'

// Original static list to be used for initial sync if DB is empty
const STATIC_TEMPLATES = [
 // Popular & Basic
 { id: 'modern', name: 'Modern', category: 'popular', premium: false},
 { id: 'minimalist', name: 'Minimalist', category: 'popular', premium: false},
 { id: 'creative', name: 'Yaratıcı', category: 'creative', premium: false},
 // Professional
 { id: 'corporate', name: 'Kurumsal', category: 'professional', premium: true},
 { id: 'executive', name: 'Yönetici', category: 'professional', premium: true},
 { id: 'elegant', name: 'Zarif', category: 'professional', premium: true},
 { id: 'consultant', name: 'Danışman', category: 'professional', premium: true},
 { id: 'freelancer', name: 'Freelancer', category: 'professional', premium: true},
 { id: 'startup', name: 'Startup', category: 'professional', premium: true},
 { id: 'international', name: 'Uluslararası', category: 'professional', premium: true},
 // Industry
 { id: 'healthcare', name: 'Sağlık', category: 'professional', premium: true},
 { id: 'academic', name: 'Akademik', category: 'professional', premium: true},
 { id: 'finance', name: 'Finans', category: 'professional', premium: true},
 { id: 'legal', name: 'Hukuk', category: 'professional', premium: true},
 { id: 'marketing', name: 'Pazarlama', category: 'creative', premium: true},
 { id: 'retail', name: 'Perakende', category: 'professional', premium: true},
 { id: 'hospitality', name: 'Otelcilik', category: 'professional', premium: true},
 { id: 'government', name: 'Kamu', category: 'professional', premium: true},
 { id: 'portfolio', name: 'Portfolyo', category: 'creative', premium: true},
 // Tech
 { id: 'tech', name: 'Tech', category: 'tech', premium: true},
 { id: 'datascience', name: 'Veri Bilimi', category: 'tech', premium: true},
 { id: 'blockchain', name: 'Blockchain', category: 'tech', premium: true},
 { id: 'productmanager', name: 'Ürün Yöneticisi', category: 'tech', premium: true},
 { id: 'dataanalyst', name: 'Veri Analisti', category: 'tech', premium: true},
 { id: 'engineer', name: 'Mühendis', category: 'tech', premium: true},
 { id: 'ecommerce', name: 'E-Ticaret', category: 'tech', premium: true},
 // Specialized
 { id: 'scientist', name: 'Bilim İnsanı', category: 'professional', premium: true},
 { id: 'artist', name: 'Sanatçı', category: 'creative', premium: true},
 { id: 'teacher', name: 'Öğretmen', category: 'professional', premium: true},
 { id: 'chef', name: 'Şef', category: 'professional', premium: true},
 { id: 'photographer', name: 'Fotoğrafçı', category: 'creative', premium: true},
 { id: 'musician', name: 'Müzisyen', category: 'creative', premium: true},
 { id: 'athlet', name: 'Sporcu', category: 'creative', premium: true},
 { id: 'pilot', name: 'Pilot', category: 'professional', premium: true},
 { id: 'construction', name: 'İnşaat', category: 'professional', premium: true},
 { id: 'environment', name: 'Çevre', category: 'professional', premium: true},
 { id: 'journalist', name: 'Gazeteci', category: 'creative', premium: true},
 { id: 'nurse', name: 'Hemşire', category: 'professional', premium: true},
 { id: 'logistics', name: 'Lojistik', category: 'professional', premium: true},
 { id: 'security', name: 'Güvenlik', category: 'professional', premium: true},
 { id: 'architect', name: 'Mimar', category: 'creative', premium: true},
 { id: 'hr', name: 'İK', category: 'professional', premium: true},
 { id: 'gamer', name: 'Gamer', category: 'creative', premium: true},
 { id: 'beauty', name: 'Güzellik', category: 'creative', premium: true},
 // Pro Versions
 { id: 'lawyer_pro', name: 'Avukat Pro', category: 'premium', premium: true},
 { id: 'realestate', name: 'Emlak', category: 'professional', premium: true},
 { id: 'logistic_pro', name: 'Lojistik Pro', category: 'premium', premium: true},
 { id: 'agriculture', name: 'Tarım', category: 'professional', premium: true},
 { id: 'media_pro', name: 'Medya Pro', category: 'premium', premium: true},
 { id: 'fitness', name: 'Fitness', category: 'creative', premium: true},
 { id: 'tourism_elite', name: 'Turizm Elite', category: 'premium', premium: true},
 { id: 'fashion', name: 'Moda', category: 'creative', premium: true},
 { id: 'architecture_pro', name: 'Mimarlık Pro', category: 'premium', premium: true},
 { id: 'pilot_pro', name: 'Pilot Pro', category: 'premium', premium: true},
 { id: 'psychologist', name: 'Psikolog', category: 'professional', premium: true},
 { id: 'socialmedia', name: 'Sosyal Medya', category: 'creative', premium: true},
 { id: 'customersuccess', name: 'Müşteri Başarısı', category: 'professional', premium: true},
 { id: 'translator', name: 'Çevirmen', category: 'professional', premium: true},
 { id: 'veterinary', name: 'Veteriner', category: 'professional', premium: true},
 { id: 'civilengineer', name: 'İnşaat Mühendisi', category: 'professional', premium: true},
 // High-End Premium
 { id: 'cyberpunk_v2', name: 'Cyberpunk V2', category: 'premium', premium: true},
 { id: 'brutalist_pro', name: 'Brutalist Pro', category: 'premium', premium: true},
 { id: 'executive_gold', name: 'Executive Gold', category: 'premium', premium: true},
 { id: 'swiss_grid', name: 'Swiss Grid', category: 'premium', premium: true},
 { id: 'magazine_vogue', name: 'Magazine Vogue', category: 'premium', premium: true},
 { id: 'glass_dream', name: 'Glass Dream', category: 'premium', premium: true},
 { id: 'minimal_mono', name: 'Minimal Mono', category: 'modern', premium: true},
 { id: 'future_slate', name: 'Future Slate', category: 'premium', premium: true},
 { id: 'soft_pill', name: 'Soft Pill', category: 'modern', premium: true},
 { id: 'vertical_timeline', name: 'Vertical Timeline', category: 'premium', premium: true},
 { id: 'metro_ui', name: 'Metro UI', category: 'tech', premium: true},
 { id: 'aurora_premium', name: 'Aurora Premium', category: 'premium', premium: true},
 { id: 'academic_serif', name: 'Akademik Serif', category: 'premium', premium: true},
 { id: 'dark_zen', name: 'Dark Zen', category: 'premium', premium: true},
 { id: 'creative_chaos', name: 'Creative Chaos', category: 'creative', premium: true},
 // Modern & Minimalist
 { id: 'neo_gradient', name: 'Neo Gradient', category: 'modern', premium: true},
 { id: 'paper_cut', name: 'Paper Cut', category: 'creative', premium: true},
 { id: 'duo_tone', name: 'Duo Tone', category: 'modern', premium: true},
 { id: 'grid_master', name: 'Grid Master', category: 'modern', premium: true},
 { id: 'type_first', name: 'Type First', category: 'modern', premium: true},
 { id: 'white_space', name: 'White Space', category: 'modern', premium: true},
 { id: 'shadow_play', name: 'Shadow Play', category: 'modern', premium: true},
 { id: 'clean_slate', name: 'Clean Slate', category: 'modern', premium: true},
 // Corporate & Professional
 { id: 'board_room', name: 'Board Room', category: 'professional', premium: true},
 { id: 'corporate_edge', name: 'Corporate Edge', category: 'professional', premium: true},
 { id: 'power_point', name: 'Power Point', category: 'professional', premium: true},
 { id: 'vintage_class', name: 'Vintage Class', category: 'premium', premium: true},
 { id: 'luxury_matte', name: 'Luxury Matte', category: 'premium', premium: true},
 { id: 'diploma_style', name: 'Diploma Style', category: 'professional', premium: true},
 // Tech & Futuristic
 { id: 'terminal_hacker', name: 'Terminal Hacker', category: 'tech', premium: true},
 { id: 'hologram_ui', name: 'Hologram UI', category: 'tech', premium: true},
 { id: 'neural_net', name: 'Neural Net', category: 'tech', premium: true},
 { id: 'quantum_blue', name: 'Quantum Blue', category: 'tech', premium: true},
 { id: 'data_stream', name: 'Data Stream', category: 'tech', premium: true},
 { id: 'robotics_core', name: 'Robotics Core', category: 'tech', premium: true},
 // Creative & Artsy
 { id: 'water_color', name: 'Water Color', category: 'creative', premium: true},
 { id: 'neon_night', name: 'Neon Night', category: 'creative', premium: true},
 { id: 'retro_wave', name: 'Retro Wave', category: 'creative', premium: true},
 { id: 'ink_splash', name: 'Ink Splash', category: 'creative', premium: true},
 { id: 'origami_paper', name: 'Origami Paper', category: 'creative', premium: true},
 { id: 'pop_art', name: 'Pop Art', category: 'creative', premium: true},
 // Industry & Niche
 { id: 'medical_pro', name: 'Medical Pro', category: 'premium', premium: true},
 { id: 'architect_blue', name: 'Architect Blue', category: 'premium', premium: true},
 { id: 'legal_brief', name: 'Legal Brief', category: 'premium', premium: true},
 { id: 'startup_pitch', name: 'Startup Pitch', category: 'premium', premium: true},
 // Web CV Templates (Site Özel Link ile Erişim)
 { id: 'corporate_web', name: 'Kurumsal Web', category: 'web', premium: true},
 { id: 'creative_web', name: 'Yaratıcı Web', category: 'web', premium: true},
 { id: 'dark_web', name: 'Dark Web', category: 'web', premium: true},
 { id: 'glass_web', name: 'Glass Web', category: 'web', premium: true},
 { id: 'gradient_web', name: 'Gradient Web', category: 'web', premium: true},
 { id: 'magazine_web', name: 'Magazine Web', category: 'web', premium: true},
 { id: 'minimal_web', name: 'Minimal Web', category: 'web', premium: true},
 { id: 'neon_web', name: 'Neon Web', category: 'web', premium: true},
 { id: 'paper_web', name: 'Paper Web', category: 'web', premium: true},
 { id: 'portfolio_web', name: 'Portfolio Web', category: 'web', premium: true},
 { id: 'retro_wave_web', name: 'Retro Wave Web', category: 'web', premium: true},
 { id: 'terminal_web', name: 'Terminal Web', category: 'web', premium: true},
 // New 18 Unique Web CV Templates
 { id: 'aurora_web', name: 'Aurora Web', category: 'web', premium: true},
 { id: 'synthwave_web', name: 'SynthWave Web', category: 'web', premium: true},
 { id: 'brutalism_web', name: 'Brutalism Web', category: 'web', premium: true},
 { id: 'aquaris_web', name: 'Aquaris Web', category: 'web', premium: true},
 { id: 'neo_tokyo_web', name: 'Neo Tokyo Web', category: 'web', premium: true},
 { id: 'cinematic_web', name: 'Cinematic Web', category: 'web', premium: true},
 { id: 'solaris_web', name: 'Solaris Web', category: 'web', premium: true},
 { id: 'infinity_web', name: 'Infinity Web', category: 'web', premium: true},
 { id: 'origami_web', name: 'Origami Web', category: 'web', premium: true},
 { id: 'wilderness_web', name: 'Wilderness Web', category: 'web', premium: true},
 { id: 'arcade_web', name: 'Arcade Web', category: 'web', premium: true},
 { id: 'timeline_web', name: 'Timeline Web', category: 'web', premium: true},
 { id: 'holographic_web', name: 'Holographic Web', category: 'web', premium: true},
 { id: 'museum_web', name: 'Museum Web', category: 'web', premium: true},
 { id: 'dataviz_web', name: 'DataViz Web', category: 'web', premium: true},
 { id: 'journal_web', name: 'Journal Web', category: 'web', premium: true},
 { id: 'spotify_web', name: 'Spotify Web', category: 'web', premium: true},
 { id: 'chatgpt_web', name: 'ChatGPT Web', category: 'web', premium: true},
 // Ultra Premium v3
 { id: 'bauhaus_legacy', name: 'Bauhaus Legacy', category: 'premium', premium: true},
 { id: 'glassmorphism_pro', name: 'Glassmorphism Pro', category: 'premium', premium: true},
 { id: 'midnight_glow', name: 'Midnight Glow', category: 'premium', premium: true},
 { id: 'newspaper_class', name: 'Newspaper Class', category: 'premium', premium: true},
 { id: 'luxury_velvet', name: 'Luxury Velvet', category: 'premium', premium: true},
 { id: 'organic_leaves', name: 'Organic Leaves', category: 'premium', premium: true},
 { id: 'blueprint_precision', name: 'Blueprint Precision', category: 'premium', premium: true},
 { id: 'pop_art_pulse', name: 'Pop Art Pulse', category: 'premium', premium: true},
 { id: 'scandi_minimal', name: 'Scandi Minimal', category: 'premium', premium: true},
 { id: 'futuro_hologram', name: 'Futuro Hologram', category: 'premium', premium: true},
 { id: 'industrial_raw', name: 'Industrial Raw', category: 'premium', premium: true},
 { id: 'vogue_elite', name: 'Vogue Elite', category: 'premium', premium: true},
 { id: 'zen_coda', name: 'Zen Coda', category: 'premium', premium: true}
];

const categoryTabs = [
 { id: 'all', label: 'TÜMÜ'},
 { id: 'popular', label: 'POPÜLER'},
 { id: 'professional', label: 'PROFESYONEL'},
 { id: 'tech', label: 'TEKNOLOJİ'},
 { id: 'creative', label: 'YARATICI'},
 { id: 'modern', label: 'MODERN'},
 { id: 'premium', label: 'PREMİUM'},
 { id: 'web', label: 'WEB CV'}
]
const FONT_OPTIONS = [
 { name: 'Inter', value:"'Inter', sans-serif"},
 { name: 'Roboto', value:"'Roboto', sans-serif"},
 { name: 'Poppins', value:"'Poppins', sans-serif"},
 { name: 'Outfit', value:"'Outfit', sans-serif"},
 { name: 'Playfair Display', value:"'Playfair Display', serif"},
 { name: 'JetBrains Mono', value:"'JetBrains Mono', monospace"}
]
const HERO_LAYOUTS = ['centered', 'left-aligned', 'split', 'editorial', 'traditional']
const CARD_STYLES = ['flat', 'bordered', 'elevated', 'glass', 'brutal', 'neon']

const getColor = (id) => {
 if (!id) return 'hsl(0, 50%, 50%)'
 let h = 0; for (let c of id) h = c.charCodeAt(0) + ((h << 5) - h)
 return`hsl(${h % 360}, 60%, 50%)`
}

export default function TemplatesPage() {
 const { toast, confirm} = useToast()
 const [templates, setTemplates] = useState([])
 const [loading, setLoading] = useState(true)
 const [syncing, setSyncing] = useState(false)
 const [activeCategory, setActiveCategory] = useState('all')
 const [searchQuery, setSearchQuery] = useState('')
 const [showModal, setShowModal] = useState(null)
 const [selected, setSelected] = useState(null)
 const [form, setForm] = useState({ templateId: '', name: '', category: 'professional', isPremium: false, thumbnail: '', description: '', config: { colors: {}, styles: {}}})
 const [modalTab, setModalTab] = useState('general') // 'general' or 'theme'
 const [uploading, setUploading] = useState(false)

 useEffect(() => {
 fetchTemplates()
}, [])

 const fetchTemplates = async () => {
 setLoading(true)
 try {
 const response = await templateAPI.getAll(true)
 if (response.success) {
 setTemplates(response.templates)
}
} catch (error) {
 console.error('Template fetch error:', error)
} finally {
 setLoading(false)
}
}

 const handleSync = async () => {
 const confirmed = await confirm({
 title: 'Senkronizasyon',
 message: 'Tüm şablonları (137 adet) veritabanına senkronize etmek istediğinize emin misiniz?',
 confirmText: 'Evet, Senkronize Et',
 type: 'warning'
})
 if (!confirmed) return
 setSyncing(true)
 try {
 const syncData = WEB_CV_TEMPLATES.map(t => ({
 templateId: t.id,
 name: t.name,
 category: t.category,
 isPremium: t.premium,
 thumbnail: t.preview,
 usageCount: Math.floor(Math.random() * 500),
 config: {
 colors: t.colors,
 styles: t.styles
}
}))
 const response = await templateAPI.sync(syncData)
 if (response.success) {
 toast.success('137 şablon başarıyla senkronize edildi!')
 fetchTemplates()
}
} catch (error) {
 toast.error('Hata: ' + error.message)
} finally {
 setSyncing(false)
}
}

 const handleSave = async (e) => {
 e.preventDefault()
 try {
 const data = {
 ...form,
 templateId: form.templateId || form.name.toLowerCase().replace(/\s+/g, '_')
}
 const response = await templateAPI.save(data)
 if (response.success) {
 toast.success('Şablon başarıyla kaydedildi.')
 fetchTemplates()
 setShowModal(null)
}
} catch (error) {
 toast.error('Hata: ' + error.message)
}
}

 const handleToggle = async (id) => {
 try {
 const response = await templateAPI.toggle(id)
 if (response.success) {
 setTemplates(templates.map(t => t._id === id ? { ...t, isActive: !t.isActive} : t))
 toast.success('Şablon durumu güncellendi.')
}
} catch (error) {
 toast.error('Hata: ' + error.message)
}
}

 const handleDelete = async (id) => {
 const confirmed = await confirm({
 title: 'Şablonu Sil',
 message: 'Bu şablonu kalıcı olarak silmek istediğinize emin misiniz?',
 confirmText: 'Evet, Sil',
 type: 'danger'
})
 if (!confirmed) return
 try {
 const response = await templateAPI.delete(id)
 if (response.success) {
 setTemplates(templates.filter(t => t._id !== id))
 toast.success('Şablon silindi.')
}
} catch (error) {
 toast.error('Hata: ' + error.message)
}
}

 const filtered = templates.filter(t =>
 (activeCategory === 'all' || t.category === activeCategory) &&
 t.name.toLowerCase().includes(searchQuery.toLowerCase())
 )

 const stats = useMemo(() => ({
 total: templates.length,
 premium: templates.filter(t => t.isPremium).length,
 active: templates.filter(t => t.isActive).length,
 usage: templates.reduce((s, t) => s + (t.usageCount || 0), 0)
}), [templates])

 if (loading && templates.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <Palette className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">Şablonlar Yükleniyor</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Marketplace verileri senkronize ediliyor...</p>
 </div>
 </div>
 )
}

 return (
 <div className="space-y-8">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-semibold text-white mb-1 uppercase flex items-center gap-3">
 <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/20">
 <Palette className="w-6 h-6 text-cyan-400" />
 </div>
 Şablon Katalogu
 </h2>
 <p className="text-gray-400 text-sm font-medium">Marketplace şablonlarını yönetin ve yapılandırın.</p>
 </div>
 <div className="flex gap-3">
 <button
 onClick={handleSync}
 disabled={syncing}
 className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-semibold text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 group"
 >
 <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-all duration-500 ${syncing ? 'animate-spin' : ''}`} />
 VERİLERİ EŞİTLE
 </button>
 <button
 onClick={() => { setForm({ templateId: '', name: '', category: 'professional', isPremium: false, config: { colors: {}, styles: {}}}); setModalTab('general'); setShowModal('add')}}
 className="px-8 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
 >
 <Plus className="w-5 h-5 shadow-inner" /> YENİ ŞABLON
 </button>
 </div>
 </div>

 {/* Conditional Rendering: List or Editor */}
 {(showModal === 'add' || showModal === 'edit') ? (
 <div className="bg-slate-900 rounded-2xl p-8 border border-white/10 relative overflow-hidden animate-fade-in shadow-2xl ring-1 ring-white/10">
 <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
 <div className="flex items-center gap-4">
 <button
 onClick={() => setShowModal(null)}
 className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
 >
 <ArrowUpRight className="w-5 h-5 rotate-[225deg] group-hover:-translate-x-1 transition-transform" />
 </button>
 <div>
 <h3 className="text-2xl font-semibold text-white uppercase">
 {showModal === 'add' ? 'YENİ ŞABLON OLUŞTUR' : 'ŞABLON DÜZENLE'}
 </h3>
 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">
 {showModal === 'add' ? 'Yeni bir tasarım dili oluşturun' :`${form.name} şablonunu yapılandırın`}
 </p>
 </div>
 </div>
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() => setShowModal(null)}
 className="px-6 py-3 rounded-2xl bg-white/5 text-gray-500 font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
 >
 İPTAL
 </button>
 <button
 onClick={handleSave}
 className="px-8 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
 >
 <Save className="w-4 h-4" />
 KAYDET
 </button>
 </div>
 </div>

 {/* Editor Tabs - In-Page Style */}
 <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8 max-w-md">
 <button
 onClick={() => setModalTab('general')}
 className={`flex-1 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${modalTab === 'general' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white'}`}
 >
 GENEL AYARLAR
 </button>
 <button
 onClick={() => setModalTab('theme')}
 className={`flex-1 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${modalTab === 'theme' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-white'}`}
 >
 TEMA DÜZENLEYİCİ
 </button>
 </div>

 <div className="max-w-4xl">
 {modalTab === 'general' ? (
 <div className="space-y-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-6">
 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">ŞABLON ADI</label>
 <input
 type="text"
 value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value})}
 className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all w-full font-bold"
 placeholder="Örn: Executive v2"
 required
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">KATEGORİ</label>
 <select
 value={form.category}
 onChange={(e) => setForm({ ...form, category: e.target.value})}
 className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all w-full font-bold appearance-none cursor-pointer"
 >
 <option value="popular">Popular</option>
 <option value="professional">Professional</option>
 <option value="tech">Tech</option>
 <option value="creative">Creative</option>
 <option value="modern">Modern</option>
 <option value="premium">Premium</option>
 <option value="web">Web CV</option>
 </select>
 </div>
 </div>

 <div className="space-y-6">
 {/* Thumbnail - URL or File Upload */}
 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">KAPAK RESMİ</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={form.thumbnail || ''}
 onChange={(e) => setForm({ ...form, thumbnail: e.target.value})}
 className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all font-bold text-xs"
 placeholder="URL veya dosya yükle →"
 />
 <label className={`px-4 py-4 rounded-2xl cursor-pointer transition-all flex items-center gap-2 ${uploading ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400'}`}>
 {uploading ? (
 <RefreshCw className="w-5 h-5 animate-spin" />
 ) : (
 <Upload className="w-5 h-5" />
 )}
 <input
 type="file"
 accept="image/*"
 className="hidden"
 disabled={uploading}
 onChange={async (e) => {
 const file = e.target.files?.[0]
 if (!file) return
 setUploading(true)
 try {
 const { mediaAPI} = await import('../../services/api')
 const formData = new FormData()
 formData.append('file', file)
 const res = await mediaAPI.upload(formData)
 if (res.success && res.media?.path) {
 const baseUrl = window.location.origin.replace(':5175', ':3001')
 setForm({ ...form, thumbnail: baseUrl + res.media.path})
 toast.success('Resim yüklendi!')
}
} catch (err) {
 toast.error('Yükleme hatası: ' + (err.message || 'Bilinmeyen hata'))
} finally {
 setUploading(false)
 e.target.value = ''
}
}}
 />
 </label>
 </div>
 </div>

 <div
 onClick={() => setForm({ ...form, isPremium: !form.isPremium})}
 className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all cursor-pointer ${form.isPremium ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}
 >
 <div className="flex items-center gap-4">
 <div className={`p-3 rounded-2xl ${form.isPremium ? 'bg-amber-500 text-white' : 'bg-white/5 text-gray-500'}`}>
 <Crown className="w-5 h-5" />
 </div>
 <span className={`text-xs font-semibold uppercase tracking-wider ${form.isPremium ? 'text-amber-500' : 'text-gray-500'}`}>PREMİUM ŞABLON</span>
 </div>
 <div className={`w-10 h-6 rounded-full p-1 transition-all ${form.isPremium ? 'bg-amber-500' : 'bg-white/10'}`}>
 <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${form.isPremium ? 'translate-x-4' : ''}`} />
 </div>
 </div>
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">AÇIKLAMA</label>
 <textarea
 value={form.description || ''}
 onChange={(e) => setForm({ ...form, description: e.target.value})}
 rows={4}
 className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all w-full font-bold resize-none"
 placeholder="Şablonun öne çıkan özelliklerini ve kullanım alanlarını açıklayın..."
 />
 </div>
 </div>
 ) : (
 <div className="grid grid-cols-12 gap-8 h-[calc(100vh-320px)]">
 {/* Sidebar Navigation for Theme Sections */}
 <div className="col-span-3 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
 {[
 { id: 'colors', label: 'Renkler', icon: Palette, desc: 'Temel ve vurgu renkleri'},
 { id: 'typography', label: 'Tipografi', icon: Type, desc: 'Font ve metin ayarları'},
 { id: 'layout', label: 'Yerleşim', icon: Layout, desc: 'Boşluk ve düzen'},
 { id: 'effects', label: 'Efektler', icon: Zap, desc: 'Gölge ve kenarlıklar'}
 ].map(section => (
 <button
 key={section.id}
 type="button"
 onClick={() => setModalTab('theme_' + section.id)}
 className={`w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden ${(modalTab === 'theme' || modalTab === 'theme_' + section.id || (modalTab === 'theme' && section.id === 'colors'))
 && (modalTab === 'theme_' + section.id || (modalTab === 'theme' && section.id === 'colors'))
 ? 'bg-cyan-500/10 border-cyan-500/30'
 : 'bg-white/5 border-white/5 hover:bg-white/10'
}`}
 >
 <div className="flex items-center gap-3 relative z-10">
 <div className={`p-2.5 rounded-xl ${(modalTab === 'theme_' + section.id || (modalTab === 'theme' && section.id === 'colors'))
 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
 : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
}`}>
 <section.icon className="w-5 h-5" />
 </div>
 <div>
 <h4 className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${(modalTab === 'theme_' + section.id || (modalTab === 'theme' && section.id === 'colors')) ? 'text-white' : 'text-gray-400 group-hover:text-white'
}`}>{section.label}</h4>
 <p className="text-xs text-gray-500 font-medium">{section.desc}</p>
 </div>
 </div>
 </button>
 ))}
 </div>

 {/* Main Editor Area */}
 <div className="col-span-9 bg-white/5 rounded-[2rem] border border-white/5 p-8 overflow-y-auto custom-scrollbar relative">
 {/* Default to Colors if just 'theme' is selected */}
 {(modalTab === 'theme' || modalTab === 'theme_colors') && (
 <div className="space-y-8 animate-fade-in">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
 <div>
 <h3 className="text-xl font-semibold text-white uppercase">Renk Yönetimi</h3>
 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Marka ve tema renklerini özelleştirin</p>
 </div>
 <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
 <Palette className="w-6 h-6" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6">
 {[
 { key: 'bg', label: 'Ana Arka Plan', desc: 'Sayfanın genel zemin rengi'},
 { key: 'surface', label: 'Kart Zemini', desc: 'İçerik kartlarının rengi'},
 { key: 'text', label: 'Ana Metin', desc: 'Başlık ve paragraf rengi'},
 { key: 'muted', label: 'İkincil Metin', desc: 'Açıklama yazı rengi'},
 { key: 'accent', label: 'Vurgu Rengi', desc: 'Buton ve link rengi'},
 { key: 'secondary', label: 'İkincil Vurgu', desc: 'Dekoratif renk'},
 { key: 'border', label: 'Kenarlıklar', desc: 'Çizgi ve sınır rengi'},
 { key: 'success', label: 'Onay/Başarı', desc: 'Pozitif durum rengi'}
 ].map(color => (
 <div key={color.key} className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all">
 <div className="flex justify-between items-start mb-3">
 <div>
 <label className="text-xs font-semibold text-white uppercase tracking-wider block">{color.label}</label>
 <span className="text-xs text-gray-500 font-medium">{color.desc}</span>
 </div>
 <div
 className="w-10 h-10 rounded-full shadow-lg border-2 border-white/10"
 style={{ backgroundColor: form.config?.colors?.[color.key] || '#cccccc'}}
 />
 </div>
 <div className="flex gap-2">
 <div className="relative flex-1 group">
 <input
 type="color"
 value={form.config?.colors?.[color.key] || '#cccccc'}
 onChange={(e) => setForm({
 ...form,
 config: {
 ...form.config,
 colors: { ...form.config.colors, [color.key]: e.target.value}
}
})}
 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
 />
 <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-mono text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: form.config?.colors?.[color.key] || '#cccccc'}} />
 Seç
 </div>
 </div>
 <div className="flex-[2]">
 <input
 type="text"
 value={form.config?.colors?.[color.key] || ''}
 onChange={(e) => setForm({
 ...form,
 config: {
 ...form.config,
 colors: { ...form.config.colors, [color.key]: e.target.value}
}
})}
 className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 uppercase"
 placeholder="#HIT"
 />
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {modalTab === 'theme_typography' && (
 <div className="space-y-8 animate-fade-in">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
 <div>
 <h3 className="text-xl font-semibold text-white uppercase">Tipografi Ayarları</h3>
 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Okunabilirlik ve font hiyerarşisi</p>
 </div>
 <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
 <Type className="w-6 h-6" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-xs font-semibold text-white uppercase tracking-wider block">Yazı Tipi Ailesi</label>
 <div className="grid grid-cols-1 gap-2">
 {FONT_OPTIONS.map(font => (
 <button
 key={font.name}
 type="button"
 onClick={() => setForm({
 ...form,
 config: {
 ...form.config,
 styles: { ...form.config.styles, fontFamily: font.value}
}
})}
 className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${form.config?.styles?.fontFamily === font.value
 ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
}`}
 >
 <span className="text-sm font-bold" style={{ fontFamily: font.value}}>{font.name}</span>
 {form.config?.styles?.fontFamily === font.value && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-4">
 <label className="text-xs font-semibold text-white uppercase tracking-wider block">Ölçeklendirme</label>

 {[
 { key: 'baseSize', label: 'Temel Font Boyutu', min: 12, max: 18, suffix: 'px'},
 { key: 'headingScale', label: 'Başlık Ölçeği', min: 1, max: 2, step: 0.1, suffix: 'x'},
 { key: 'lineHeight', label: 'Satır Yüksekliği', min: 1, max: 2, step: 0.1, suffix: ''}
 ].map(item => (
 <div key={item.key} className="bg-black/20 p-4 rounded-2xl border border-white/5">
 <div className="flex justify-between mb-2">
 <span className="text-xs text-gray-400 font-bold uppercase">{item.label}</span>
 <span className="text-xs text-cyan-400 font-mono">
 {form.config?.styles?.[item.key] || item.min}{item.suffix}
 </span>
 </div>
 <input
 type="range"
 min={item.min}
 max={item.max}
 step={item.step || 1}
 value={parseFloat(form.config?.styles?.[item.key]) || item.min}
 onChange={(e) => setForm({
 ...form,
 config: {
 ...form.config,
 styles: { ...form.config.styles, [item.key]: e.target.value}
}
})}
 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
 />
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {modalTab === 'theme_layout' && (
 <div className="space-y-8 animate-fade-in">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
 <div>
 <h3 className="text-xl font-semibold text-white uppercase">Yerleşim ve Düzen</h3>
 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Yapısal özellikler ve boşluklar</p>
 </div>
 <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
 <Layout className="w-6 h-6" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-6">
 <div className="space-y-3">
 <label className="text-xs font-semibold text-white uppercase tracking-wider block">Hero Bölümü</label>
 <div className="grid grid-cols-2 gap-3">
 {HERO_LAYOUTS.map(layout => (
 <button
 key={layout}
 type="button"
 onClick={() => setForm({
 ...form,
 config: {
 ...form.config,
 styles: { ...form.config.styles, heroLayout: layout}
}
})}
 className={`p-4 rounded-xl border text-center transition-all ${form.config?.styles?.heroLayout === layout
 ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
}`}
 >
 <div className="mb-2">
 {/* Simple Icon Representation could go here */}
 <div className="w-full h-12 rounded bg-current opacity-20 mx-auto" />
 </div>
 <span className="text-xs font-semibold uppercase tracking-wider">{layout}</span>
 </button>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-4">
 <label className="text-xs font-semibold text-white uppercase tracking-wider block">Kart Yapısı</label>
 <div className="grid grid-cols-1 gap-3">
 {CARD_STYLES.map(style => (
 <button
 key={style}
 type="button"
 onClick={() => setForm({
 ...form,
 config: {
 ...form.config,
 styles: { ...form.config.styles, cardStyle: style}
}
})}
 className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${form.config?.styles?.cardStyle === style
 ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
}`}
 >
 <div className={`w-4 h-4 rounded-full border ${form.config?.styles?.cardStyle === style ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'}`} />
 <span className="text-xs font-bold uppercase">{style}</span>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {modalTab === 'theme_effects' && (
 <div className="space-y-8 animate-fade-in">
 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
 <div>
 <h3 className="text-xl font-semibold text-white uppercase">Görsel Efektler</h3>
 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Radius, gölgeler ve detaylar</p>
 </div>
 <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
 <Zap className="w-6 h-6" />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-6">
 {[
 { key: 'borderRadius', label: 'Köşe Yuvarlama', min: 0, max: 32, suffix: 'px'},
 { key: 'borderWidth', label: 'Kenarlık Kalınlığı', min: 0, max: 4, suffix: 'px'},
 { key: 'blur', label: 'Blur Efekti', min: 0, max: 20, suffix: 'px'}
 ].map(item => (
 <div key={item.key} className="bg-black/20 p-5 rounded-2xl border border-white/5">
 <div className="flex justify-between mb-3">
 <span className="text-xs text-gray-400 font-bold uppercase">{item.label}</span>
 <span className="text-xs text-amber-400 font-mono">
 {form.config?.styles?.[item.key] || item.min}{item.suffix}
 </span>
 </div>
 <input
 type="range"
 min={item.min}
 max={item.max}
 value={parseInt(form.config?.styles?.[item.key]) || item.min}
 onChange={(e) => setForm({
 ...form,
 config: {
 ...form.config,
 styles: { ...form.config.styles, [item.key]: e.target.value}
}
})}
 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
 />
 </div>
 ))}
 </div>

 <div className="space-y-4">
 <label className="text-xs font-semibold text-white uppercase tracking-wider block">Özel Seçenekler</label>
 {[
 { key: 'glassmorphism', label: 'Glassmorphism Aktif', desc: 'Bulanık arka plan efekti'},
 { key: 'gradientBg', label: 'Gradyan Arka Plan', desc: 'Düz renk yerine geçişli zemin'},
 { key: 'animate', label: 'Animasyonlar', desc: 'Giriş ve hover efektleri'}
 ].map(opt => (
 <div
 key={opt.key}
 onClick={() => setForm({
 ...form,
 config: {
 ...form.config,
 styles: { ...form.config.styles, [opt.key]: !form.config?.styles?.[opt.key]}
}
})}
 className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${form.config?.styles?.[opt.key]
 ? 'bg-amber-500/10 border-amber-500/50'
 : 'bg-white/5 border-white/5 hover:border-white/10'
}`}
 >
 <div className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${form.config?.styles?.[opt.key] ? 'bg-amber-500 border-amber-500' : 'border-gray-600'
}`}>
 {form.config?.styles?.[opt.key] && <Check className="w-3 h-3 text-white" />}
 </div>
 <div>
 <h5 className={`text-xs font-semibold uppercase ${form.config?.styles?.[opt.key] ? 'text-white' : 'text-gray-400'
}`}>{opt.label}</h5>
 <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 ) : (
 <>
 {/* Stats Banner */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {/* ... (Existing Stats Content) ... */}
 </div>
 </>
 )}

 {/* Existing List View Content (Only render if NOT editing) */}
 {(!showModal) && (
 <>
 {/* Stats Banner */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label: 'TOPLAM ŞABLON', value: stats.total, icon: <Layout className="w-4 h-4" />, color: 'cyan'},
 { label: 'PREMİUM ÜYELİK', value: stats.premium, icon: <Crown className="w-4 h-4" />, color: 'purple'},
 { label: 'AKTİF ŞABLONLAR', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green'},
 { label: 'TOPLAM KULLANIM', value: stats.usage, icon: <TrendingUp className="w-4 h-4" />, color: 'amber'}
 ].map((stat, i) => (

 <div key={i} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group shadow-sm hover:shadow-lg transition-all">
 <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 dark:bg-${stat.color}-500/5 blur-3xl -z-10`}></div>
 <div className="flex items-center gap-3 mb-2">
 <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500 dark:text-${stat.color}-400`}>
 {stat.icon}
 </div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
 </div>
 <div className="text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</div>
 </div>
 ))}
 </div>

 {/* Toolbar */}
 <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
 {/* ... (Existing Toolbar Content) ... */}
 <div className="relative w-full md:w-96">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Şablon adı ile ara..."
 className="bg-gray-100 dark:bg-black/20 border-transparent dark:border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full font-medium"
 />
 </div>
 <FilterTabs
 tabs={categoryTabs}
 activeTab={activeCategory}
 onChange={setActiveCategory}
 />
 </div>

 {/* Templates Grid */}
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
 {/* ... (Existing Grid Content) ... */}
 {filtered.map(t => (
 <div key={t._id} className={`rounded-2xl p-3 transition-all border relative group ${t.isActive
 ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:border-cyan-500/30 shadow-sm hover:shadow-xl dark:shadow-none'
 : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 opacity-60 grayscale'
}`}>
 {/* Preview - Show thumbnail if available */}
 <div className="aspect-[3/4] rounded-[2rem] bg-gray-100 dark:bg-white/5 overflow-hidden relative mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500" style={{ background: t.thumbnail ? 'transparent' :`linear-gradient(135deg, ${getColor(t.templateId)}22, ${getColor(t.templateId + 'x')}44)`}}>
 {t.thumbnail ? (
 <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover" />
 ) : (
 <div className="text-center">
 <span className="text-4xl font-semibold text-gray-300 dark:text-white/20 uppercase select-none">{t.name.charAt(0)}</span>
 </div>
 )}
 <div className="absolute top-4 right-4 z-10">
 {t.isPremium && <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/10"><Crown className="w-4 h-4" /></div>}
 </div>

 {/* Actions Overlay - Darker for better contrast */}
 <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4">
 <Link
 to={`/editor?template=${t.templateId}&sample=true`}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full py-3 rounded-xl bg-cyan-500/20 text-cyan-400 font-semibold text-xs tracking-wider uppercase border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all text-center"
 >
 ÖNİZLEME
 </Link>
 <button
 onClick={() => handleToggle(t._id)}
 className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${t.isActive ? 'bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-green-500/20 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white'}`}
 >
 {t.isActive ? 'PASİF YAP' : 'AKTİF YAP'}
 </button>
 <button
 onClick={() => {
 const safeForm = {
 _id: t._id,
 templateId: t.templateId || '',
 name: t.name || '',
 category: t.category || 'professional',
 isPremium: !!t.isPremium,
 thumbnail: t.thumbnail || t.preview || '',
 description: t.description || '',
 isActive: !!t.isActive,
 usageCount: t.usageCount || 0,
 config: {
 colors: { ...(t.config?.colors || {})},
 styles: { ...(t.config?.styles || {})}
}
}
 setSelected(t)
 setForm(safeForm)
 setModalTab('general')
 setShowModal('edit')
 window.scrollTo({ top: 0, behavior: 'smooth'})
}}
 className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold text-xs tracking-wider uppercase border border-white/10 hover:bg-white/20 transition-all"
 >
 DÜZENLE
 </button>
 <button
 onClick={() => handleDelete(t._id)}
 className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-semibold text-xs tracking-wider uppercase hover:bg-red-500 hover:text-white transition-all"
 >
 SİL
 </button>
 </div>
 </div>

 {/* Info Area */}
 <div className="px-2">
 <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate mb-1 uppercase tracking-tight">{t.name}</h4>
 <div className="flex items-center justify-between text-xs font-bold text-gray-500">
 <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-cyan-500 dark:text-cyan-400" /> {t.usageCount || 0}</span>
 <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 uppercase text-gray-600 dark:text-gray-400">{t.category}</span>
 </div>
 </div>
 </div>
 ))}

 {/* Empty State */}
 {filtered.length === 0 && (
 <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-40">
 <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
 <h4 className="text-lg font-semibold text-white uppercase">ŞABLON BULUNAMADI</h4>
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Lütfen farklı bir kategori veya arama terimi deneyin.</p>
 </div>
 )}
 </div>
 </>
 )}
 </div>
 )
}
