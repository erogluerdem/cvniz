import { useState, useEffect } from 'react'
import {
    FlaskConical, Plus, Play, Pause, Trash2, TrendingUp, Users, Target, X,
    RefreshCw, Search, Eye, Award, Clock, CheckCircle2, AlertCircle,
    BarChart3, Zap, Layers, MousePointerClick, PauseCircle, Edit, Trophy
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const statusConfig = {
    draft: { label: 'Taslak', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
    running: { label: 'Devam Ediyor', color: 'bg-green-500/20 text-green-400', icon: Play },
    paused: { label: 'Duraklatıldı', color: 'bg-amber-500/20 text-amber-400', icon: PauseCircle },
    completed: { label: 'Tamamlandı', color: 'bg-cyan-500/20 text-cyan-400', icon: CheckCircle2 },
    archived: { label: 'Arşivlendi', color: 'bg-purple-500/20 text-purple-400', icon: Layers }
}

const elementConfig = {
    button: 'Buton',
    heading: 'Başlık',
    pricing: 'Fiyatlandırma',
    layout: 'Düzen',
    form: 'Form',
    image: 'Görsel',
    color: 'Renk',
    copy: 'Metin',
    other: 'Diğer'
}

const variantColors = [
    'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    'from-rose-500/20 to-red-500/20 border-rose-500/30'
]

export default function ABTestsPage() {
    const { toast, confirm } = useToast()
    const [tests, setTests] = useState([])
    const [stats, setStats] = useState({ total: 0, running: 0, paused: 0, completed: 0, avgImprovement: 0 })
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTest, setEditingTest] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        element: 'button',
        variants: [{ name: 'Kontrol (A)' }, { name: 'Varyant B' }],
        trafficPercentage: 50,
        targetPage: '',
        status: 'draft'
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [testsRes, statsRes] = await Promise.all([
                adminAPI.getABTests(),
                adminAPI.getABTestStats()
            ])
            if (testsRes.success) setTests(testsRes.tests)
            if (statsRes.success) setStats(statsRes.stats)
        } catch (error) {
            toast.error('Veriler yüklenirken hata: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let response
            if (editingTest) {
                response = await adminAPI.updateABTest(editingTest._id, formData)
                toast.success('A/B test güncellendi!')
            } else {
                response = await adminAPI.createABTest({ ...formData, startDate: new Date() })
                toast.success('Yeni A/B test oluşturuldu!')
            }
            if (response.success) {
                setShowModal(false)
                setEditingTest(null)
                resetForm()
                fetchData()
            }
        } catch (error) {
            toast.error('İşlem başarısız: ' + error.message)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '', description: '', element: 'button',
            variants: [{ name: 'Kontrol (A)' }, { name: 'Varyant B' }],
            trafficPercentage: 50, targetPage: '', status: 'draft'
        })
    }

    const openEditModal = (test) => {
        setEditingTest(test)
        setFormData({
            name: test.name,
            description: test.description || '',
            element: test.element || 'other',
            variants: test.variants?.length > 0 ? test.variants : [{ name: 'Kontrol (A)' }, { name: 'Varyant B' }],
            trafficPercentage: test.trafficPercentage || 50,
            targetPage: test.targetPage || '',
            status: test.status
        })
        setShowModal(true)
    }

    const addVariant = () => {
        const letter = String.fromCharCode(65 + formData.variants.length)
        setFormData({ ...formData, variants: [...formData.variants, { name: `Varyant ${letter}` }] })
    }

    const removeVariant = (index) => {
        if (formData.variants.length <= 2) return
        setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) })
    }

    const updateVariantName = (index, name) => {
        const newVariants = [...formData.variants]
        newVariants[index] = { ...newVariants[index], name }
        setFormData({ ...formData, variants: newVariants })
    }

    const toggleStatus = async (test) => {
        if (test.status === 'completed') return
        const newStatus = test.status === 'running' ? 'paused' : 'running'
        try {
            const response = await adminAPI.updateABTest(test._id, { status: newStatus })
            if (response.success) {
                setTests(tests.map(t => t._id === test._id ? { ...t, status: newStatus } : t))
                toast.success(newStatus === 'running' ? 'Test başlatıldı!' : 'Test duraklatıldı!')
                fetchData()
            }
        } catch (error) {
            toast.error('Durum güncellenemedi.')
        }
    }

    const declareWinner = async (testId, variantName) => {
        try {
            const response = await adminAPI.updateABTest(testId, { status: 'completed', winnerVariant: variantName })
            if (response.success) {
                setTests(tests.map(t => t._id === testId ? { ...t, status: 'completed', winnerVariant: variantName } : t))
                toast.success(`${variantName} kazanan olarak belirlendi!`)
            }
        } catch (error) {
            toast.error('İşlem başarısız.')
        }
    }

    const deleteTest = async (id) => {
        const confirmed = await confirm({
            title: 'A/B Testi Sil',
            message: 'Bu testi kalıcı olarak silmek istediğinize emin misiniz?',
            confirmText: 'Evet, Sil',
            type: 'danger'
        })
        if (!confirmed) return

        try {
            const response = await adminAPI.deleteABTest(id)
            if (response.success) {
                setTests(tests.filter(t => t._id !== id))
                toast.success('A/B test silindi.')
            }
        } catch (error) {
            toast.error('A/B test silinemedi.')
        }
    }

    const filteredTests = tests.filter(t => {
        const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase())
        if (activeFilter === 'all') return matchesSearch
        return matchesSearch && t.status === activeFilter
    })

    if (loading && tests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
                    <FlaskConical className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">A/B TESTLER YÜKLENİYOR</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">Veriler senkronize ediliyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter flex items-center gap-3 italic">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                            <FlaskConical className="w-6 h-6 text-purple-400" />
                        </div>
                        A/B Test Yönetimi
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Deneyler oluşturun, varyantları test edin ve sonuçları analiz edin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setEditingTest(null); setShowModal(true) }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> YENİ TEST
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOPLAM TEST', value: stats.total, icon: <FlaskConical className="w-4 h-4" />, color: 'purple' },
                    { label: 'DEVAM EDEN', value: stats.running, icon: <Play className="w-4 h-4" />, color: 'green' },
                    { label: 'TAMAMLANAN', value: stats.completed, icon: <Target className="w-4 h-4" />, color: 'cyan' },
                    { label: 'ORT. İYİLEŞME', value: `+${stats.avgImprovement}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="glass-card rounded-[2.5rem] p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Test ara..."
                        className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all w-full font-bold"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'running', 'paused', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === f
                                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f === 'all' ? 'TÜMÜ' : f === 'running' ? 'DEVAM EDEN' : f === 'paused' ? 'DURAKLATILMIŞ' : 'TAMAMLANAN'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tests List */}
            <div className="space-y-5">
                {filteredTests.map(test => {
                    const status = statusConfig[test.status] || statusConfig.draft
                    const StatusIcon = status.icon
                    const totalViews = test.variants?.reduce((sum, v) => sum + (v.views || 0), 0) || 0
                    const totalConversions = test.variants?.reduce((sum, v) => sum + (v.conversions || 0), 0) || 0

                    return (
                        <div key={test._id} className="glass-card rounded-[2.5rem] p-6 border border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 blur-3xl -z-10"></div>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{test.name}</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-bold">
                                        <span className="flex items-center gap-1">
                                            <Layers className="w-3 h-3" />
                                            {elementConfig[test.element] || 'Diğer'}
                                        </span>
                                        {test.startDate && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(test.startDate).toLocaleDateString('tr-TR')}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Trafik: {test.trafficPercentage}%
                                        </span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 ${status.color}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {status.label}
                                </span>
                            </div>

                            {/* Variants */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                                {test.variants?.map((variant, i) => {
                                    const views = variant.views || 0
                                    const conversions = variant.conversions || 0
                                    const rate = views > 0 ? ((conversions / views) * 100).toFixed(1) : 0
                                    const isWinner = test.winnerVariant === variant.name
                                    const colorClass = variantColors[i % variantColors.length]

                                    return (
                                        <div
                                            key={i}
                                            className={`p-4 rounded-2xl bg-gradient-to-br ${colorClass} border relative transition-all ${isWinner ? 'ring-2 ring-green-500' : ''}`}
                                        >
                                            {isWinner && (
                                                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                                                    <Trophy className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm text-white">{variant.name}</span>
                                                {isWinner && <span className="text-[9px] text-green-400 font-black">KAZANAN</span>}
                                            </div>
                                            <div className="text-2xl font-black text-white mb-1">{rate}%</div>
                                            <div className="text-[10px] text-gray-400 font-bold">
                                                {views} görüntüleme · {conversions} dönüşüm
                                            </div>
                                            {test.status === 'running' && !test.winnerVariant && (
                                                <button
                                                    onClick={() => declareWinner(test._id, variant.name)}
                                                    className="mt-2 w-full py-1.5 rounded-lg bg-green-500/20 text-green-400 text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    Kazanan Seç
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Overall Stats */}
                            <div className="flex items-center gap-6 mb-4 text-xs font-bold">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Eye className="w-4 h-4" />
                                    <span>Toplam: {totalViews} görüntüleme</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MousePointerClick className="w-4 h-4" />
                                    <span>{totalConversions} dönüşüm</span>
                                </div>
                                {test.confidenceLevel > 0 && (
                                    <div className="flex items-center gap-2 text-purple-400">
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Güven: %{test.confidenceLevel}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                {test.status !== 'completed' && (
                                    <button
                                        onClick={() => toggleStatus(test)}
                                        className={`flex-1 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${test.status === 'running'
                                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {test.status === 'running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                        {test.status === 'running' ? 'Duraklat' : 'Başlat'}
                                    </button>
                                )}
                                <button
                                    onClick={() => openEditModal(test)}
                                    className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteTest(test._id)}
                                    className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}

                {filteredTests.length === 0 && (
                    <div className="text-center py-20 glass-card rounded-[3rem] border border-dashed border-white/10">
                        <FlaskConical className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic mb-1">A/B TEST BULUNAMADI</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kriterlere uyan test yok.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card rounded-[3rem] p-8 max-w-2xl w-full border border-white/10 relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl -z-10"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                    {editingTest ? 'TESTİ DÜZENLE' : 'YENİ A/B TEST'}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">Test detaylarını ve varyantları belirleyin.</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditingTest(null) }} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TEST ADI</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Hero CTA Button Color"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
                                    required
                                />
                            </div>

                            {/* Element & Traffic */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TEST EDİLEN ELEMENT</label>
                                    <select
                                        value={formData.element}
                                        onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
                                    >
                                        {Object.entries(elementConfig).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TRAFİK: {formData.trafficPercentage}%</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={formData.trafficPercentage}
                                        onChange={(e) => setFormData({ ...formData, trafficPercentage: parseInt(e.target.value) })}
                                        className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Variants */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">VARYANTLAR</label>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="text-[10px] font-black text-purple-400 hover:text-purple-300 transition-all flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> VARYANT EKLE
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.variants.map((v, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <input
                                                type="text"
                                                value={v.name}
                                                onChange={(e) => updateVariantName(i, e.target.value)}
                                                placeholder={`Varyant ${String.fromCharCode(65 + i)}`}
                                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30"
                                            />
                                            {formData.variants.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(i)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Target Page */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">HEDEF SAYFA (OPSİYONEL)</label>
                                <input
                                    type="text"
                                    value={formData.targetPage}
                                    onChange={(e) => setFormData({ ...formData, targetPage: e.target.value })}
                                    placeholder="/pricing, /signup vb."
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingTest(null) }}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {editingTest ? 'GÜNCELLE' : 'TEST BAŞLAT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
