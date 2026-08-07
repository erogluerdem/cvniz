import { useState, useEffect} from 'react'
import { Megaphone, Plus, Bell, Shield, Info, AlertTriangle, CheckCircle, X, Loader2, Power, Trash2, Users, Calendar, Filter, Search, ChevronRight, Zap, Target} from 'lucide-react'
import { adminAPI} from '../../services/api'
import { StatusBadge, FilterTabs} from '../../components/admin/SharedComponents'
import Modal from '../../components/admin/Modal'
import { useOutletContext } from 'react-router-dom'

export default function AnnouncementsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [announcements, setAnnouncements] = useState([])
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [activeFilter, setActiveFilter] = useState('all')
 const [searchQuery, setSearchQuery] = useState('')

 const [formData, setFormData] = useState({
 title: '',
 content: '',
 type: 'info',
 target: 'all',
 showUntil: '',
 imageUrl: '',
 buttonText: '',
 buttonLink: '',
 couponCode: '',
 startAfter: 3000
})
 const [submitting, setSubmitting] = useState(false)

 useEffect(() => {
 fetchAnnouncements()
}, [])

 const fetchAnnouncements = async () => {
 setLoading(true)
 try {
 const response = await adminAPI.getAnnouncements()
 if (response.success) {
 setAnnouncements(response.announcements)
}
} catch (error) {
 console.error('Announcements fetch error:', error)
} finally {
 setLoading(false)
}
}

 const handleSubmit = async (e) => {
 e.preventDefault()
 setSubmitting(true)
 try {
 const response = await adminAPI.createAnnouncement(formData)
 if (response.success) {
 setShowModal(false)
 fetchAnnouncements()
 setFormData({
 title: '', content: '', type: 'info', target: 'all', showUntil: '',
 imageUrl: '', buttonText: '', buttonLink: '', couponCode: '', startAfter: 3000
})
}
} catch (error) {
 alert('Duyuru yayınlanamadı: ' + error.message)
} finally {
 setSubmitting(false)
}
}

 const toggleStatus = async (id) => {
 try {
 const response = await adminAPI.toggleAnnouncement(id)
 if (response.success) {
 setAnnouncements(announcements.map(ann =>
 ann._id === id ? { ...ann, isActive: !ann.isActive} : ann
 ))
}
} catch (error) {
 alert('Durum güncellenemedi')
}
}

 const handleDelete = async (id) => {
 if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return
 try {
 const response = await adminAPI.deleteAnnouncement(id)
 if (response.success) {
 setAnnouncements(announcements.filter(ann => ann._id !== id))
}
} catch (error) {
 alert('Silme hatası: ' + error.message)
}
}

 const typeConfigs = {
 info: { label: 'Bilgi', color: 'cyan', icon: <Info className="w-4 h-4" />},
 success: { label: 'Başarı', color: 'emerald', icon: <CheckCircle className="w-4 h-4" />},
 warning: { label: 'Uyarı', color: 'amber', icon: <AlertTriangle className="w-4 h-4" />},
 error: { label: 'Kritik', color: 'red', icon: <Shield className="w-4 h-4" />}
}

 const targetLabels = {
 all: 'Herkes',
 premium: 'PRO Üyeler',
 free: 'Ücretsiz Üyeler'
}

 const filteredAnnouncements = announcements.filter(ann => {
 const matchesFilter = activeFilter === 'all' ||
 (activeFilter === 'active' && ann.isActive) ||
 (activeFilter === 'passive' && !ann.isActive)
 const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
 ann.content.toLowerCase().includes(searchQuery.toLowerCase())
 return matchesFilter && matchesSearch
})

 const stats = {
 total: announcements.length,
 active: announcements.filter(a => a.isActive).length,
 targets: new Set(announcements.map(a => a.target)).size,
 last24h: announcements.filter(a => new Date(a.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length
}

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-semibold text-white mb-1 uppercase flex items-center gap-3">
 <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/20">
 <Megaphone className="w-6 h-6 text-purple-400" />
 </div>
 Duyuru Merkezi
 </h2>
 <p className="text-gray-400 text-sm font-medium">Sistem genelinde önemli haberleri ve güncellemeleri yönetin.</p>
 </div>
 <button
 onClick={() => setShowModal(true)}
 className="px-6 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
 >
 <Plus className="w-5 h-5" /> Yeni Duyuru Yayınla
 </button>
 </div>

 {/* Stats Overview */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'Toplam Duyuru', val: stats.total, icon: <Bell className="text-purple-400" />, color: 'purple'},
 { label: 'Yayında Olanlar', val: stats.active, icon: <Zap className="text-amber-400" />, color: 'amber'},
 { label: 'Hedef Gruplar', val: stats.targets, icon: <Target className="text-blue-400" />, color: 'blue'},
 { label: 'Son 24 Saat', val: stats.last24h, icon: <Users className="text-emerald-400" />, color: 'emerald'}
 ].map((stat, i) => (
 <div key={i} className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
 <div>
 <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">{stat.label}</div>
 <div className="text-2xl font-semibold text-white">{stat.val}</div>
 </div>
 <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20 shadow-lg shadow-${stat.color}-500/5 group-hover:scale-110 transition-transform`}>
 {stat.icon}
 </div>
 </div>
 ))}
 </div>

 {/* Filters & Search */}
 <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
 <FilterTabs
 tabs={[
 { id: 'all', label: 'Tümü'},
 { id: 'active', label: 'Aktifler'},
 { id: 'passive', label: 'Pasifler'}
 ]}
 activeTab={activeFilter}
 onChange={setActiveFilter}
 />
 <div className="relative w-full md:w-64">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Duyurularda ara..."
 className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-all text-white font-medium"
 />
 </div>
 </div>

 {/* Announcements List */}
 {loading ? (
 <div className="flex flex-col items-center justify-center py-24 gap-4">
 <div className="relative">
 <div className="w-16 h-16 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <Megaphone className="w-6 h-6 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <span className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Veriler Senkronize Ediliyor...</span>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {filteredAnnouncements.map((ann) => {
 const config = typeConfigs[ann.type] || typeConfigs.info
 return (
 <div key={ann._id} className={`glass-card p-6 rounded-3xl border transition-all relative overflow-hidden group ${ann.isActive ? 'border-white/5' : 'border-white/5 opacity-50 grayscale'}`}>
 {/* Status Ring */}
 <div className={`absolute top-0 right-0 w-32 h-32 bg-${config.color}-500/5 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700`}></div>

 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-4">
 <div className={`w-12 h-12 rounded-2xl bg-${config.color}-500/10 border border-${config.color}-500/20 flex items-center justify-center shadow-lg shadow-${config.color}-500/5`}>
 <div className={`text-${config.color}-400`}>{config.icon}</div>
 </div>
 <div>
 <div className="flex items-center gap-2 mb-1">
 <h3 className="font-semibold text-white uppercase tracking-tight leading-none">{ann.title}</h3>
 <span className={`text-xs px-2 py-0.5 rounded-full bg-${config.color}-500/10 text-${config.color}-400 border border-${config.color}-500/20 font-semibold uppercase tracking-wider`}>
 {config.label}
 </span>
 </div>
 <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase">
 <div className="flex items-center gap-1">
 <Target className="w-3 h-3" />
 {targetLabels[ann.target]}
 </div>
 <div className="flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 {new Date(ann.createdAt).toLocaleDateString('tr-TR')}
 </div>
 </div>
 </div>
 </div>
 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() => toggleStatus(ann._id)}
 className={`p-2.5 rounded-xl transition-all border ${ann.isActive ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'}`}
 title={ann.isActive ? 'Durdur' : 'Yayınla'}
 >
 <Power className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDelete(ann._id)}
 className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
 title="Sil"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>

 <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4 font-medium">
 {ann.content}
 </p>

 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
 <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
 {ann.isActive ? 'YAYINDA' : 'PASİF'}
 </div>
 <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
 <ChevronRight className="w-4 h-4" />
 </div>
 </div>
 </div>
 )
})}
 {filteredAnnouncements.length === 0 && (
 <div className="md:col-span-2 py-32 text-center glass-card rounded-3xl border border-dashed border-white/10 relative overflow-hidden group">
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <Bell className="w-16 h-16 text-gray-700 mx-auto mb-6 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
 <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Sistemde kayıtlı duyuru bulunamadı.</p>
 <button
 onClick={() => setShowModal(true)}
 className="mt-6 px-6 py-2.5 rounded-xl border border-white/10 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-all"
 >
 İLK DUYURUYU OLUŞTUR
 </button>
 </div>
 )}
 </div>
 )}

            {/* Modern Modal */}
            <Modal 
                isOpen={showModal} 
                onClose={() => { if(!submitting) setShowModal(false) }}
                title="Duyuru Oluştur"
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Duyuru Başlığı</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 shadow-inner'
                                }`}
                                placeholder="Kısa ve etkileyici bir başlık..."
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Görünüm Tipi</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all appearance-none cursor-pointer ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500/50 shadow-inner'
                                }`}
                            >
                                <option value="info">Bilgilendirme (Mavi)</option>
                                <option value="success">Başarı (Yeşil)</option>
                                <option value="warning">Uyarı (Turuncu)</option>
                                <option value="error">Kritik (Kırmızı)</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Hedef Kitle</label>
                            <select
                                value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all appearance-none cursor-pointer ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-cyan-500/50 shadow-inner'
                                }`}
                            >
                                <option value="all">Herkes</option>
                                <option value="premium">Sadece PRO Üyeler</option>
                                <option value="free">Ücretsiz Üyeler</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Duyuru Mesajı</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={4}
                                className={`w-full p-5 rounded-3xl text-sm font-medium resize-none focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 shadow-inner'
                                }`}
                                placeholder="Kullanıcılara ileteceğiniz mesajın detayları..."
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => setShowModal(false)}
                            className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50 ${
                                isDayMode 
                                    ? 'border-slate-200 text-slate-500 hover:bg-slate-100' 
                                    : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-[2] py-4 rounded-2xl text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${
                                isDayMode 
                                    ? 'bg-cyan-600 shadow-xl shadow-cyan-600/20 hover:bg-cyan-700' 
                                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95'
                            }`}
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            ŞİMDİ YAYINLA
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
