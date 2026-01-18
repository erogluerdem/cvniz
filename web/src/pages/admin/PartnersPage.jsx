import { useState, useEffect } from 'react'
import {
    Users, Plus, Edit, Trash2, ExternalLink, Mail, DollarSign, TrendingUp, X,
    RefreshCw, Search, CheckCircle2, Clock, PauseCircle, AlertCircle, Crown,
    Link2, Globe, Phone, Building2, Award, Percent, Copy, Check, Star
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const typeConfig = {
    integration: { label: 'Entegrasyon', color: 'bg-cyan-500/20 text-cyan-400', icon: Link2 },
    referral: { label: 'Referans', color: 'bg-purple-500/20 text-purple-400', icon: Users },
    affiliate: { label: 'Affiliate', color: 'bg-green-500/20 text-green-400', icon: TrendingUp },
    education: { label: 'Eğitim', color: 'bg-amber-500/20 text-amber-400', icon: Award },
    reseller: { label: 'Bayi', color: 'bg-blue-500/20 text-blue-400', icon: Building2 },
    strategic: { label: 'Stratejik', color: 'bg-pink-500/20 text-pink-400', icon: Star }
}

const statusConfig = {
    pending: { label: 'Beklemede', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
    active: { label: 'Aktif', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
    paused: { label: 'Duraklatılmış', color: 'bg-gray-500/20 text-gray-400', icon: PauseCircle },
    suspended: { label: 'Askıya Alındı', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
    terminated: { label: 'Sonlandırıldı', color: 'bg-red-700/20 text-red-500', icon: X }
}

const tierConfig = {
    bronze: { label: 'Bronze', color: 'from-orange-600/30 to-orange-800/30 border-orange-500/40', text: 'text-orange-400' },
    silver: { label: 'Silver', color: 'from-gray-400/30 to-gray-600/30 border-gray-400/40', text: 'text-gray-300' },
    gold: { label: 'Gold', color: 'from-amber-500/30 to-yellow-600/30 border-amber-400/40', text: 'text-amber-400' },
    platinum: { label: 'Platinum', color: 'from-slate-300/30 to-slate-500/30 border-slate-400/40', text: 'text-slate-300' },
    diamond: { label: 'Diamond', color: 'from-cyan-400/30 to-blue-500/30 border-cyan-400/40', text: 'text-cyan-400' }
}

export default function PartnersPage() {
    const { toast, confirm } = useToast()
    const [partners, setPartners] = useState([])
    const [stats, setStats] = useState({ total: 0, active: 0, totalReferrals: 0, totalEarnings: 0 })
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingPartner, setEditingPartner] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [copiedEmail, setCopiedEmail] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        logo: '🤝',
        website: '',
        type: 'referral',
        tier: 'bronze',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        commission: 15,
        notes: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [partnersRes, statsRes] = await Promise.all([
                adminAPI.getPartners(),
                adminAPI.getPartnerStats()
            ])
            if (partnersRes.success) setPartners(partnersRes.partners)
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
            if (editingPartner) {
                response = await adminAPI.updatePartner(editingPartner._id, formData)
                toast.success('Partner güncellendi!')
            } else {
                response = await adminAPI.createPartner(formData)
                toast.success('Yeni partner eklendi!')
            }
            if (response.success) {
                setShowModal(false)
                setEditingPartner(null)
                resetForm()
                fetchData()
            }
        } catch (error) {
            toast.error('İşlem başarısız: ' + error.message)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '', logo: '🤝', website: '', type: 'referral', tier: 'bronze',
            contactName: '', contactEmail: '', contactPhone: '', commission: 15, notes: ''
        })
    }

    const openEditModal = (partner) => {
        setEditingPartner(partner)
        setFormData({
            name: partner.name,
            logo: partner.logo || '🤝',
            website: partner.website || '',
            type: partner.type,
            tier: partner.tier || 'bronze',
            contactName: partner.contactName || '',
            contactEmail: partner.contactEmail || '',
            contactPhone: partner.contactPhone || '',
            commission: partner.commission || 15,
            notes: partner.notes || ''
        })
        setShowModal(true)
    }

    const toggleStatus = async (partner) => {
        const newStatus = partner.status === 'active' ? 'paused' : 'active'
        try {
            const response = await adminAPI.updatePartner(partner._id, { status: newStatus })
            if (response.success) {
                setPartners(partners.map(p => p._id === partner._id ? { ...p, status: newStatus } : p))
                toast.success(newStatus === 'active' ? 'Partner aktifleştirildi!' : 'Partner duraklatıldı!')
            }
        } catch (error) {
            toast.error('Durum güncellenemedi.')
        }
    }

    const copyEmail = (email) => {
        navigator.clipboard.writeText(email)
        setCopiedEmail(email)
        toast.success('E-posta kopyalandı!')
        setTimeout(() => setCopiedEmail(null), 2000)
    }

    const deletePartner = async (id) => {
        const confirmed = await confirm({
            title: 'Partner\'ı Sil',
            message: 'Bu partner\'ı kalıcı olarak silmek istediğinize emin misiniz?',
            confirmText: 'Evet, Sil',
            type: 'danger'
        })
        if (!confirmed) return

        try {
            const response = await adminAPI.deletePartner(id)
            if (response.success) {
                setPartners(partners.filter(p => p._id !== id))
                toast.success('Partner silindi.')
            }
        } catch (error) {
            toast.error('Partner silinemedi.')
        }
    }

    const filteredPartners = partners.filter(p => {
        const matchesSearch =
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase())
        if (activeFilter === 'all') return matchesSearch
        return matchesSearch && p.status === activeFilter
    })

    if (loading && partners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
                    <Users className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">PARTNERLAR YÜKLENİYOR</h3>
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
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        Partner Yönetimi
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">İş ortaklarınızı yönetin ve performanslarını takip edin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setEditingPartner(null); setShowModal(true) }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> YENİ PARTNER
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOPLAM PARTNER', value: stats.total, icon: <Users className="w-4 h-4" />, color: 'purple' },
                    { label: 'AKTİF', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
                    { label: 'REFERANS', value: stats.totalReferrals, icon: <TrendingUp className="w-4 h-4" />, color: 'cyan' },
                    { label: 'ÖDENEN KOMİSYON', value: `₺${(stats.totalEarnings || 0).toLocaleString()}`, icon: <DollarSign className="w-4 h-4" />, color: 'amber' }
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
                        placeholder="Partner ara..."
                        className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/30 transition-all w-full font-bold"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'active', 'pending', 'paused'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === f
                                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f === 'all' ? 'TÜMÜ' : f === 'active' ? 'AKTİF' : f === 'pending' ? 'BEKLEYEN' : 'DURAKLATILMIŞ'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-2 gap-5">
                {filteredPartners.map(partner => {
                    const type = typeConfig[partner.type] || typeConfig.referral
                    const status = statusConfig[partner.status] || statusConfig.pending
                    const tier = tierConfig[partner.tier] || tierConfig.bronze
                    const StatusIcon = status.icon
                    const TypeIcon = type.icon

                    return (
                        <div key={partner._id} className={`glass-card rounded-[2.5rem] p-6 border border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden bg-gradient-to-br ${tier.color}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10"></div>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                                        {partner.logo || '🤝'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{partner.name}</h3>
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${tier.text} bg-white/10`}>
                                                {tier.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 ${type.color}`}>
                                                <TypeIcon className="w-3 h-3" /> {type.label}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 ${status.color}`}>
                                                <StatusIcon className="w-3 h-3" /> {status.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-4 gap-3 mb-5">
                                {[
                                    { label: 'Komisyon', value: `%${partner.commission}`, icon: <Percent className="w-3 h-3" /> },
                                    { label: 'Referans', value: partner.referrals || 0, icon: <Users className="w-3 h-3" /> },
                                    { label: 'Dönüşüm', value: partner.conversions || 0, icon: <TrendingUp className="w-3 h-3" /> },
                                    { label: 'Kazanç', value: `₺${(partner.earnings || 0).toLocaleString()}`, icon: <DollarSign className="w-3 h-3" /> }
                                ].map((m, i) => (
                                    <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
                                        <div className="text-gray-500 mb-1 flex justify-center">{m.icon}</div>
                                        <div className="font-black text-sm text-white">{m.value}</div>
                                        <div className="text-[9px] text-gray-500 uppercase font-bold">{m.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Info */}
                            <div className="flex items-center gap-4 mb-4 text-xs text-gray-400 font-bold">
                                {partner.website && (
                                    <a href={`https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-400 transition-all">
                                        <Globe className="w-3.5 h-3.5" /> {partner.website}
                                    </a>
                                )}
                                {partner.contactEmail && (
                                    <button
                                        onClick={() => copyEmail(partner.contactEmail)}
                                        className="flex items-center gap-1 hover:text-purple-400 transition-all"
                                    >
                                        {copiedEmail === partner.contactEmail ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                                        {partner.contactEmail}
                                    </button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => toggleStatus(partner)}
                                    className={`flex-1 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${partner.status === 'active'
                                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                        }`}
                                >
                                    {partner.status === 'active' ? <PauseCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {partner.status === 'active' ? 'Duraklat' : 'Aktifleştir'}
                                </button>
                                <button
                                    onClick={() => openEditModal(partner)}
                                    className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deletePartner(partner._id)}
                                    className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}

                {filteredPartners.length === 0 && (
                    <div className="md:col-span-2 text-center py-20 glass-card rounded-[3rem] border border-dashed border-white/10">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic mb-1">PARTNER BULUNAMADI</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kriterlere uyan partner yok.</p>
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
                                    {editingPartner ? 'PARTNER DÜZENLE' : 'YENİ PARTNER'}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">Partner bilgilerini girin.</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditingPartner(null) }} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name & Logo */}
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">LOGO</label>
                                    <input
                                        type="text"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-2xl text-center focus:outline-none focus:border-purple-500/30"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">PARTNER ADI</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="LinkedIn, Kariyer.net vb."
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Type, Tier & Commission */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">PARTNER TÜRÜ</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
                                    >
                                        {Object.entries(typeConfig).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">SEVİYE</label>
                                    <select
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
                                    >
                                        {Object.entries(tierConfig).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KOMİSYON %</label>
                                    <input
                                        type="number"
                                        value={formData.commission}
                                        onChange={(e) => setFormData({ ...formData, commission: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">WEB SİTESİ</label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="example.com"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">İLETİŞİM ADI</label>
                                    <input
                                        type="text"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        placeholder="Ahmet Yılmaz"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">E-POSTA</label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        placeholder="partner@example.com"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TELEFON</label>
                                    <input
                                        type="text"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        placeholder="+90 5xx xxx xx xx"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">NOTLAR</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Partner hakkında notlar..."
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30 resize-none"
                                    rows={2}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingPartner(null) }}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {editingPartner ? 'GÜNCELLE' : 'PARTNER EKLE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
