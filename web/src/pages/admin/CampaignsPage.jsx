import { useState, useEffect, useMemo} from 'react'
import {
 Target, Plus, Play, Pause, Trash2, Edit, Calendar, Users, TrendingUp, Eye, X,
 RefreshCw, Search, Zap, DollarSign, Clock, CheckCircle2, AlertCircle,
 BarChart3, MousePointerClick, Tag, Rocket, PauseCircle, FileText
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/admin/Modal'
import { useOutletContext } from 'react-router-dom'

const typeConfig = {
 discount: { label: 'İndirim', color: 'bg-green-500/20 text-green-400', icon: Tag},
 trial: { label: 'Deneme', color: 'bg-blue-500/20 text-blue-400', icon: Clock},
 bonus: { label: 'Bonus', color: 'bg-purple-500/20 text-purple-400', icon: Zap},
 flash_sale: { label: 'Flash Sale', color: 'bg-red-500/20 text-red-400', icon: Rocket},
 seasonal: { label: 'Sezonluk', color: 'bg-amber-500/20 text-amber-400', icon: Calendar}
}

const statusConfig = {
 draft: { label: 'Taslak', color: 'bg-gray-500/20 text-gray-400', icon: FileText},
 active: { label: 'Aktif', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2},
 paused: { label: 'Duraklatıldı', color: 'bg-amber-500/20 text-amber-400', icon: PauseCircle},
 ended: { label: 'Bitti', color: 'bg-red-500/20 text-red-400', icon: AlertCircle},
 scheduled: { label: 'Planlandı', color: 'bg-blue-500/20 text-blue-400', icon: Clock}
}

const audienceConfig = {
 all: 'Tüm Kullanıcılar',
 new_users: 'Yeni Kullanıcılar',
 premium: 'Premium Üyeler',
 expired_premium: 'Premium Süresi Bitenler',
 inactive: 'Pasif Kullanıcılar'
}

export default function CampaignsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast, confirm } = useToast()
    const [campaigns, setCampaigns] = useState([])
 const [stats, setStats] = useState({ total: 0, active: 0, paused: 0, draft: 0, totalViews: 0, totalClicks: 0, totalConversions: 0, totalRevenue: 0})
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [editingCampaign, setEditingCampaign] = useState(null)
 const [searchQuery, setSearchQuery] = useState('')
 const [activeFilter, setActiveFilter] = useState('all')
 const [formData, setFormData] = useState({
 name: '',
 description: '',
 type: 'discount',
 discount: 20,
 discountType: 'percent',
 couponCode: '',
 targetAudience: 'all',
 startDate: '',
 endDate: '',
 status: 'draft'
})

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [campaignsRes, statsRes] = await Promise.all([
 adminAPI.getCampaigns(),
 adminAPI.getCampaignStats()
 ])
 if (campaignsRes.success) setCampaigns(campaignsRes.campaigns)
 if (statsRes.success) setStats(statsRes.stats)
} catch (error) {
 toast.error('Veriler yüklenirken hata: ' + error.message)
} finally {
 setLoading(false)
}
}

 const generateCouponCode = () => {
 const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
 let code = ''
 for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
 setFormData({ ...formData, couponCode: code})
}

 const handleSubmit = async (e) => {
 e.preventDefault()
 try {
 let response
 if (editingCampaign) {
 response = await adminAPI.updateCampaign(editingCampaign._id, formData)
 toast.success('Kampanya güncellendi!')
} else {
 response = await adminAPI.createCampaign(formData)
 toast.success('Yeni kampanya oluşturuldu!')
}
 if (response.success) {
 setShowModal(false)
 setEditingCampaign(null)
 resetForm()
 fetchData()
}
} catch (error) {
 toast.error('İşlem başarısız: ' + error.message)
}
}

 const resetForm = () => {
 setFormData({
 name: '', description: '', type: 'discount', discount: 20, discountType: 'percent',
 couponCode: '', targetAudience: 'all', startDate: '', endDate: '', status: 'draft'
})
}

 const openEditModal = (campaign) => {
 setEditingCampaign(campaign)
 setFormData({
 name: campaign.name,
 description: campaign.description || '',
 type: campaign.type,
 discount: campaign.discount,
 discountType: campaign.discountType || 'percent',
 couponCode: campaign.couponCode || '',
 targetAudience: campaign.targetAudience || 'all',
 startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
 endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
 status: campaign.status
})
 setShowModal(true)
}

 const toggleStatus = async (campaign) => {
 const newStatus = campaign.status === 'active' ? 'paused' : 'active'
 try {
 const response = await adminAPI.updateCampaign(campaign._id, { status: newStatus})
 if (response.success) {
 setCampaigns(campaigns.map(c => c._id === campaign._id ? { ...c, status: newStatus} : c))
 toast.success(newStatus === 'active' ? 'Kampanya başlatıldı!' : 'Kampanya duraklatıldı!')
 fetchData()
}
} catch (error) {
 toast.error('Durum güncellenemedi.')
}
}

 const deleteCampaign = async (id) => {
 const confirmed = await confirm({
 title: 'Kampanyayı Sil',
 message: 'Bu kampanyayı kalıcı olarak silmek istediğinize emin misiniz?',
 confirmText: 'Evet, Sil',
 type: 'danger'
})
 if (!confirmed) return

 try {
 const response = await adminAPI.deleteCampaign(id)
 if (response.success) {
 setCampaigns(campaigns.filter(c => c._id !== id))
 toast.success('Kampanya silindi.')
}
} catch (error) {
 toast.error('Kampanya silinemedi.')
}
}

 const filteredCampaigns = campaigns.filter(c => {
 const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase())
 if (activeFilter === 'all') return matchesSearch
 return matchesSearch && c.status === activeFilter
})

 if (loading && campaigns.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin"></div>
 <Target className="w-8 h-8 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">KAMPANYALAR YÜKLENİYOR</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Veriler senkronize ediliyor...</p>
 </div>
 </div>
 )
}

    return (
        <>
        <div className="space-y-6 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-semibold text-white mb-1 uppercase flex items-center gap-3">
 <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20">
 <Target className="w-6 h-6 text-orange-400" />
 </div>
 Kampanya Yönetimi
 </h2>
 <p className="text-gray-400 text-sm font-medium">Pazarlama kampanyaları oluşturun ve performansı takip edin.</p>
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={fetchData}
 className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
 >
 <RefreshCw className="w-5 h-5" />
 </button>
 <button
 onClick={() => { resetForm(); setEditingCampaign(null); setShowModal(true)}}
 className="px-6 py-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
 >
 <Plus className="w-4 h-4" /> YENİ KAMPANYA
 </button>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'TOPLAM', value: stats.total, icon: <Target className="w-4 h-4" />, color: 'cyan'},
 { label: 'AKTİF', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green'},
 { label: 'GÖRÜNTÜLEME', value: stats.totalViews?.toLocaleString() || 0, icon: <Eye className="w-4 h-4" />, color: 'purple'},
 { label: 'DÖNÜŞÜM', value: stats.totalConversions?.toLocaleString() || 0, icon: <TrendingUp className="w-4 h-4" />, color: 'amber'}
 ].map((stat, i) => (
 <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
 <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
 <div className="flex items-center gap-3 mb-2">
 <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
 {stat.icon}
 </div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
 </div>
 <div className="text-3xl font-semibold text-white">{stat.value}</div>
 </div>
 ))}
 </div>

 {/* Toolbar */}
 <div className="glass-card rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="relative w-full md:w-80">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Kampanya ara..."
 className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500/30 transition-all w-full font-bold"
 />
 </div>
 <div className="flex items-center gap-2 flex-wrap">
 {['all', 'active', 'paused', 'draft'].map(f => (
 <button
 key={f}
 onClick={() => setActiveFilter(f)}
 className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${activeFilter === f
 ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
 : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
}`}
 >
 {f === 'all' ? 'TÜMÜ' : f === 'active' ? 'AKTİF' : f === 'paused' ? 'DURAKLATILMIŞ' : 'TASLAK'}
 </button>
 ))}
 </div>
 </div>

 {/* Campaigns Grid */}
 <div className="grid md:grid-cols-2 gap-5">
 {filteredCampaigns.map(campaign => {
 const type = typeConfig[campaign.type] || typeConfig.discount
 const status = statusConfig[campaign.status] || statusConfig.draft
 const TypeIcon = type.icon
 const StatusIcon = status.icon
 const conversionRate = campaign.views > 0 ? ((campaign.conversions / campaign.views) * 100).toFixed(1) : 0

 return (
 <div key={campaign._id} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-red-500/5 blur-2xl -z-10"></div>

 {/* Header */}
 <div className="flex items-start justify-between mb-5">
 <div className="flex items-center gap-3">
 <div className={`p-3 rounded-2xl ${type.color}`}>
 <TypeIcon className="w-5 h-5" />
 </div>
 <div>
 <h4 className="font-semibold text-white text-sm uppercase tracking-tight">{campaign.name}</h4>
 <span className="text-xs text-gray-500 font-bold">{audienceConfig[campaign.targetAudience] || 'Tüm Kullanıcılar'}</span>
 </div>
 </div>
 <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase flex items-center gap-1.5 ${status.color}`}>
 <StatusIcon className="w-3 h-3" />
 {status.label}
 </span>
 </div>

 {/* Metrics */}
 <div className="grid grid-cols-4 gap-3 mb-5">
 {[
 { label: 'Görüntüleme', value: campaign.views?.toLocaleString() || 0, icon: <Eye className="w-3 h-3" />},
 { label: 'Tıklama', value: campaign.clicks?.toLocaleString() || 0, icon: <MousePointerClick className="w-3 h-3" />},
 { label: 'Dönüşüm', value: campaign.conversions || 0, icon: <Users className="w-3 h-3" />},
 { label: 'Oran', value:`${conversionRate}%`, icon: <TrendingUp className="w-3 h-3" />}
 ].map((m, i) => (
 <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
 <div className="text-gray-500 mb-1 flex justify-center">{m.icon}</div>
 <div className="font-semibold text-sm text-white">{m.value}</div>
 <div className="text-xs text-gray-500 uppercase font-bold">{m.label}</div>
 </div>
 ))}
 </div>

 {/* Discount & Date */}
 <div className="flex items-center gap-4 mb-5 text-xs">
 {campaign.discount > 0 && (
 <span className="flex items-center gap-1.5 font-bold text-green-400">
 <Tag className="w-3.5 h-3.5" />
 {campaign.discountType === 'percent' ?`%${campaign.discount}` :`₺${campaign.discount}`} İndirim
 </span>
 )}
 {campaign.startDate && (
 <span className="flex items-center gap-1.5 text-gray-400">
 <Calendar className="w-3.5 h-3.5" />
 {new Date(campaign.startDate).toLocaleDateString('tr-TR')} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('tr-TR') : '∞'}
 </span>
 )}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2 pt-4 border-t border-white/5">
 {campaign.status !== 'draft' && (
 <button
 onClick={() => toggleStatus(campaign)}
 className={`flex-1 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${campaign.status === 'active'
 ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
 : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
}`}
 >
 {campaign.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
 {campaign.status === 'active' ? 'Duraklat' : 'Başlat'}
 </button>
 )}
 <button
 onClick={() => openEditModal(campaign)}
 className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
 >
 <Edit className="w-4 h-4" />
 </button>
 <button
 onClick={() => deleteCampaign(campaign._id)}
 className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 )
})}

 {filteredCampaigns.length === 0 && (
 <div className="md:col-span-2 text-center py-20 glass-card rounded-2xl border border-dashed border-white/10">
 <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
 <h4 className="text-lg font-semibold text-white uppercase mb-1">KAMPANYA BULUNAMADI</h4>
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kriterlere uyan kampanya yok.</p>
 </div>
 )}
 </div>

    </div>

            <Modal 
                isOpen={showModal} 
                onClose={() => { setShowModal(false); setEditingCampaign(null) }}
                title={editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya Oluştur'}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name & Description */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>KAMPANYA ADI</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Yeni Yıl Kampanyası"
                            className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-orange-500/30'
                            }`}
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>AÇIKLAMA</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Kampanya detayları..."
                            className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all resize-none ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-orange-500/30'
                            }`}
                            rows={2}
                        />
                    </div>

                    {/* Type & Audience */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>KAMPANYA TÜRÜ</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-orange-500/30'
                                }`}
                            >
                                <option value="discount">İndirim</option>
                                <option value="trial">Deneme Süresi</option>
                                <option value="bonus">Bonus</option>
                                <option value="flash_sale">Flash Sale</option>
                                <option value="seasonal">Sezonluk</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>HEDEF KİTLE</label>
                            <select
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-orange-500/30'
                                }`}
                            >
                                <option value="all">Tüm Kullanıcılar</option>
                                <option value="new_users">Yeni Kullanıcılar</option>
                                <option value="premium">Premium Üyeler</option>
                                <option value="expired_premium">Premium Süresi Bitenler</option>
                                <option value="inactive">Pasif Kullanıcılar</option>
                            </select>
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>İNDİRİM TÜRÜ</label>
                            <select
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-orange-500/30'
                                }`}
                            >
                                <option value="percent">Yüzde (%)</option>
                                <option value="fixed">Sabit (₺)</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>MİKTAR</label>
                            <input
                                type="number"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-orange-500/30'
                                }`}
                                min="0"
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>KUPON KODU</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.couponCode}
                                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                                    placeholder="YENIYIL"
                                    className={`flex-1 px-4 py-3.5 rounded-2xl text-sm font-semibold uppercase focus:outline-none transition-all ${
                                        isDayMode 
                                            ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                            : 'bg-white/5 border border-white/10 text-white focus:border-orange-500/30'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={generateCouponCode}
                                    className={`px-3 py-3.5 rounded-2xl transition-all ${
                                        isDayMode ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                                    }`}
                                >
                                    <Zap className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>BAŞLANGIÇ TARİHİ</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-orange-500/30'
                                }`}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>BİTİŞ TARİHİ</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className={`w-full px-4 py-3.5 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-orange-500/30'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => { setShowModal(false); setEditingCampaign(null) }}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                                isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-gray-300'
                            }`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
                                isDayMode ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : 'bg-gradient-to-br from-orange-500 to-red-600 hover:scale-[1.02] shadow-orange-500/20'
                            }`}
                        >
                            {editingCampaign ? 'GÜNCELLE' : 'OLUŞTUR'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
