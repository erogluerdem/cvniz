import { useState, useEffect, useMemo } from 'react'
import {
    Tag, Plus, Trash2, Calendar, Users, Percent, DollarSign, X,
    Copy, Check, RefreshCw, Search, Filter, ToggleLeft, ToggleRight,
    TrendingUp, Gift, Clock, Zap, AlertCircle, CheckCircle2, Edit
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

// Kupon renk paletleri
const couponColors = [
    { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', accent: 'text-cyan-400' },
    { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', accent: 'text-purple-400' },
    { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', accent: 'text-emerald-400' },
    { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', accent: 'text-amber-400' },
    { bg: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30', accent: 'text-rose-400' }
]

const getColorIndex = (code) => {
    let hash = 0
    for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash)
    return Math.abs(hash) % couponColors.length
}

export default function CouponsPage() {
    const { toast, confirm } = useToast()
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [copiedCode, setCopiedCode] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        type: 'percent',
        discount: 20,
        expiryDate: '',
        usageLimit: '',
        isActive: true
    })

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        setLoading(true)
        try {
            const response = await adminAPI.getCoupons()
            if (response.success) {
                setCoupons(response.coupons)
            }
        } catch (error) {
            toast.error('Kuponlar yüklenirken hata: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
        setFormData({ ...formData, code })
    }

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        toast.success('Kupon kodu kopyalandı!')
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                discount: parseFloat(formData.discount),
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
            }

            let response
            if (editingCoupon) {
                response = await adminAPI.updateCoupon(editingCoupon._id, payload)
                toast.success('Kupon güncellendi!')
            } else {
                response = await adminAPI.createCoupon(payload)
                toast.success('Yeni kupon oluşturuldu!')
            }

            if (response.success) {
                setShowModal(false)
                setEditingCoupon(null)
                fetchCoupons()
                resetForm()
            }
        } catch (error) {
            toast.error('İşlem başarısız: ' + error.message)
        }
    }

    const resetForm = () => {
        setFormData({ code: '', type: 'percent', discount: 20, expiryDate: '', usageLimit: '', isActive: true })
    }

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon)
        setFormData({
            code: coupon.code,
            type: coupon.type,
            discount: coupon.discount,
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            usageLimit: coupon.usageLimit || '',
            isActive: coupon.isActive
        })
        setShowModal(true)
    }

    const toggleCouponStatus = async (coupon) => {
        try {
            const response = await adminAPI.updateCoupon(coupon._id, { isActive: !coupon.isActive })
            if (response.success) {
                setCoupons(coupons.map(c => c._id === coupon._id ? { ...c, isActive: !c.isActive } : c))
                toast.success(coupon.isActive ? 'Kupon devre dışı bırakıldı.' : 'Kupon aktif edildi.')
            }
        } catch (error) {
            toast.error('Durum güncellenemedi.')
        }
    }

    const deleteCoupon = async (id) => {
        const confirmed = await confirm({
            title: 'Kuponu Sil',
            message: 'Bu kuponu kalıcı olarak silmek istediğinize emin misiniz?',
            confirmText: 'Evet, Sil',
            type: 'danger'
        })
        if (!confirmed) return

        try {
            const response = await adminAPI.deleteCoupon(id)
            if (response.success) {
                setCoupons(coupons.filter(c => c._id !== id))
                toast.success('Kupon silindi.')
            }
        } catch (error) {
            toast.error('Kupon silinemedi.')
        }
    }

    // İstatistikler
    const stats = useMemo(() => ({
        total: coupons.length,
        active: coupons.filter(c => c.isActive).length,
        expired: coupons.filter(c => c.expiryDate && new Date(c.expiryDate) < new Date()).length,
        totalUsage: coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0)
    }), [coupons])

    // Filtreleme
    const filteredCoupons = coupons.filter(c => {
        const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase())
        if (activeFilter === 'active') return matchesSearch && c.isActive
        if (activeFilter === 'inactive') return matchesSearch && !c.isActive
        if (activeFilter === 'expired') return matchesSearch && c.expiryDate && new Date(c.expiryDate) < new Date()
        return matchesSearch
    })

    const isExpired = (date) => date && new Date(date) < new Date()

    if (loading && coupons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                    <Tag className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">KUPONLAR YÜKLENİYOR</h3>
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
                        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20">
                            <Gift className="w-6 h-6 text-amber-400" />
                        </div>
                        Kupon Yönetimi
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">İndirim kuponları oluşturun ve yönetin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchCoupons}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setEditingCoupon(null); setShowModal(true) }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> YENİ KUPON
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOPLAM KUPON', value: stats.total, icon: <Tag className="w-4 h-4" />, color: 'cyan' },
                    { label: 'AKTİF', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
                    { label: 'SÜRESİ DOLMUŞ', value: stats.expired, icon: <Clock className="w-4 h-4" />, color: 'red' },
                    { label: 'TOPLAM KULLANIM', value: stats.totalUsage, icon: <TrendingUp className="w-4 h-4" />, color: 'purple' }
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
                        placeholder="Kupon kodu ara..."
                        className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500/30 transition-all w-full font-bold uppercase"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {[
                        { id: 'all', label: 'TÜMÜ' },
                        { id: 'active', label: 'AKTİF' },
                        { id: 'inactive', label: 'PASİF' },
                        { id: 'expired', label: 'SÜRESİ DOLMUŞ' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === f.id
                                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCoupons.map((coupon) => {
                    const colorIdx = getColorIndex(coupon.code)
                    const colors = couponColors[colorIdx]
                    const expired = isExpired(coupon.expiryDate)

                    return (
                        <div
                            key={coupon._id}
                            className={`glass-card rounded-[2.5rem] p-6 relative group border transition-all overflow-hidden ${expired ? 'opacity-50 border-red-500/20' :
                                    !coupon.isActive ? 'opacity-60 border-gray-500/20' :
                                        `${colors.border} hover:scale-[1.02]`
                                }`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-30 -z-10`}></div>

                            {/* Status Indicator */}
                            <div className="absolute top-5 right-5 flex items-center gap-2">
                                {expired && (
                                    <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[9px] font-black uppercase">Süresi Dolmuş</span>
                                )}
                                <div className={`w-3 h-3 rounded-full ${coupon.isActive && !expired ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'}`}></div>
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-2xl bg-white/10 ${colors.accent}`}>
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-black tracking-[0.2em] text-white uppercase">{coupon.code}</h3>
                                        <button
                                            onClick={() => copyToClipboard(coupon.code)}
                                            className="text-[10px] font-bold text-gray-500 hover:text-white transition-all flex items-center gap-1"
                                        >
                                            {copiedCode === coupon.code ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                            {copiedCode === coupon.code ? 'Kopyalandı!' : 'Kodu Kopyala'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`flex items-center gap-2 text-2xl font-black ${colors.accent}`}>
                                    {coupon.type === 'percent' ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                                    <span>{coupon.discount}</span>
                                    <span className="text-sm font-bold text-gray-500">{coupon.type === 'percent' ? 'İndirim' : '₺ İndirim'}</span>
                                </div>
                            </div>

                            {/* Usage & Expiry */}
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{coupon.usageLimit ? `${coupon.usageCount || 0}/${coupon.usageLimit}` : `${coupon.usageCount || 0} Kullanım`}</span>
                                </div>
                                {coupon.expiryDate && (
                                    <div className={`flex items-center gap-1.5 ${expired ? 'text-red-400' : ''}`}>
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(coupon.expiryDate).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => toggleCouponStatus(coupon)}
                                    className={`flex-1 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${coupon.isActive
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                        }`}
                                >
                                    {coupon.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                    {coupon.isActive ? 'Devre Dışı' : 'Aktif Et'}
                                </button>
                                <button
                                    onClick={() => openEditModal(coupon)}
                                    className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteCoupon(coupon._id)}
                                    className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}

                {filteredCoupons.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-20 glass-card rounded-[3rem] border border-dashed border-white/10">
                        <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic mb-1">KUPON BULUNAMADI</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kriterlere uyan kupon yok.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card rounded-[3rem] p-8 max-w-lg w-full border border-white/10 relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl -z-10"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                    {editingCoupon ? 'KUPONU DÜZENLE' : 'YENİ KUPON'}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">İndirim kuponu oluşturun veya düzenleyin.</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditingCoupon(null) }} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Kupon Kodu */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KUPON KODU</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="YENIYIL2024"
                                        className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-black uppercase tracking-widest focus:outline-none focus:border-amber-500/30"
                                        required
                                        disabled={!!editingCoupon}
                                    />
                                    {!editingCoupon && (
                                        <button
                                            type="button"
                                            onClick={generateCode}
                                            className="px-4 py-3.5 rounded-2xl bg-amber-500/10 text-amber-400 font-black text-xs hover:bg-amber-500/20 transition-all"
                                        >
                                            <Zap className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Tür & Miktar */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">İNDİRİM TÜRÜ</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-amber-500/30"
                                    >
                                        <option value="percent">Yüzde (%)</option>
                                        <option value="fixed">Sabit (₺)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">MİKTAR</label>
                                    <input
                                        type="number"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-amber-500/30"
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Kullanım Limiti */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KULLANIM LİMİTİ</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    placeholder="Sınırsız için boş bırakın"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-amber-500/30"
                                    min="1"
                                />
                            </div>

                            {/* Son Kullanma Tarihi */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">SON KULLANMA TARİHİ</label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-amber-500/30"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingCoupon(null) }}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {editingCoupon ? 'GÜNCELLE' : 'KUPON OLUŞTUR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
