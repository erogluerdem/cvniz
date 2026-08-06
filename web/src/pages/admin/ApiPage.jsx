import { useState, useEffect} from 'react'
import {
 Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCcw, AlertTriangle, Check, X,
 Shield, Code, Zap, Clock, Server, Globe, Lock, Settings
} from 'lucide-react'
import { adminAPI} from '../../services/api'
import { useToast} from '../../context/ToastContext'

const environmentConfig = {
 production: { label: 'Production', color: 'bg-green-500/20 text-green-400', short: 'prod'},
 staging: { label: 'Staging', color: 'bg-amber-500/20 text-amber-400', short: 'stg'},
 development: { label: 'Development', color: 'bg-blue-500/20 text-blue-400', short: 'dev'},
 test: { label: 'Test', color: 'bg-gray-500/20 text-gray-400', short: 'test'}
}

const statusConfig = {
 active: { label: 'Aktif', color: 'bg-green-500/20 text-green-400'},
 inactive: { label: 'Pasif', color: 'bg-gray-500/20 text-gray-400'},
 revoked: { label: 'İptal', color: 'bg-red-500/20 text-red-400'},
 expired: { label: 'Süresi Dolmuş', color: 'bg-amber-500/20 text-amber-400'}
}

export default function ApiPage() {
 const { toast, confirm} = useToast()
 const [loading, setLoading] = useState(true)
 const [apiKeys, setApiKeys] = useState([])
 const [stats, setStats] = useState({ total: 0, active: 0, totalRequests: 0, version: 'v1.0'})
 const [showModal, setShowModal] = useState(false)
 const [visibleKeys, setVisibleKeys] = useState({})
 const [copiedId, setCopiedId] = useState(null)
 const [newKeyData, setNewKeyData] = useState({
 name: '',
 environment: 'production',
 permissions: ['read'],
 rateLimit: 1000,
 description: ''
})

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [keysRes, statsRes] = await Promise.all([
 adminAPI.getApiKeys(),
 adminAPI.getApiKeyStats()
 ])
 if (keysRes.success) setApiKeys(keysRes.apiKeys)
 if (statsRes.success) setStats(statsRes.stats)
} catch (error) {
 toast.error('Veriler yüklenirken hata: ' + error.message)
} finally {
 setLoading(false)
}
}

 const toggleKeyVisibility = (id) => {
 setVisibleKeys(prev => ({ ...prev, [id]: !prev[id]}))
}

 const copyKey = (id, key) => {
 navigator.clipboard.writeText(key)
 setCopiedId(id)
 toast.success('API anahtarı kopyalandı!')
 setTimeout(() => setCopiedId(null), 2000)
}

 const toggleStatus = async (apiKey) => {
 try {
 const newStatus = apiKey.status === 'active' ? 'inactive' : 'active'
 const response = await adminAPI.updateApiKey(apiKey._id, { status: newStatus})
 if (response.success) {
 setApiKeys(keys => keys.map(k => k._id === apiKey._id ? response.apiKey : k))
 toast.success(`Anahtar ${newStatus === 'active' ? 'aktif' : 'pasif'} edildi!`)
}
} catch (error) {
 toast.error('Durum güncellenemedi')
}
}

 const handleRegenerate = async (id) => {
 const confirmed = await confirm({
 title: 'Anahtarı Yenile',
 message: 'Bu anahtar yenilenecek. Eski anahtar geçersiz olacak. Devam etmek istiyor musunuz?',
 confirmText: 'Evet, Yenile',
 type: 'warning'
})
 if (!confirmed) return

 try {
 const response = await adminAPI.regenerateApiKey(id)
 if (response.success) {
 setApiKeys(keys => keys.map(k => k._id === id ? response.apiKey : k))
 setVisibleKeys(prev => ({ ...prev, [id]: true}))
 toast.success('API anahtarı yenilendi! Yeni anahtarı kopyalamayı unutmayın.')
}
} catch (error) {
 toast.error('Anahtar yenilenemedi')
}
}

 const handleDelete = async (id) => {
 const confirmed = await confirm({
 title: 'Anahtarı Sil',
 message: 'Bu API anahtarı kalıcı olarak silinecek. Bu işlem geri alınamaz!',
 confirmText: 'Evet, Sil',
 type: 'danger'
})
 if (!confirmed) return

 try {
 const response = await adminAPI.deleteApiKey(id)
 if (response.success) {
 setApiKeys(keys => keys.filter(k => k._id !== id))
 toast.success('API anahtarı silindi!')
 fetchData()
}
} catch (error) {
 toast.error('Anahtar silinemedi')
}
}

 const handleCreate = async (e) => {
 e.preventDefault()
 if (!newKeyData.name.trim()) {
 toast.error('Anahtar adı gerekli')
 return
}

 try {
 const response = await adminAPI.createApiKey(newKeyData)
 if (response.success) {
 setApiKeys([response.apiKey, ...apiKeys])
 setVisibleKeys(prev => ({ ...prev, [response.apiKey._id]: true}))
 setNewKeyData({ name: '', environment: 'production', permissions: ['read'], rateLimit: 1000, description: ''})
 setShowModal(false)
 toast.success('API anahtarı oluşturuldu! Anahtarı güvenli bir yere kaydedin.')
 fetchData()
}
} catch (error) {
 toast.error('Anahtar oluşturulamadı')
}
}

 const togglePermission = (perm) => {
 setNewKeyData(prev => ({
 ...prev,
 permissions: prev.permissions.includes(perm)
 ? prev.permissions.filter(p => p !== perm)
 : [...prev.permissions, perm]
}))
}

 if (loading && apiKeys.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
 <Key className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">API ANAHTARLARI YÜKLENİYOR</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Veriler alınıyor...</p>
 </div>
 </div>
 )
}

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-semibold text-white mb-1 uppercase flex items-center gap-3">
 <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
 <Key className="w-6 h-6 text-purple-400" />
 </div>
 API Yönetimi
 </h2>
 <p className="text-gray-400 text-sm font-medium">API anahtarlarını oluşturun ve yönetin.</p>
 </div>
 <button
 onClick={() => setShowModal(true)}
 className="px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
 >
 <Plus className="w-4 h-4" /> YENİ ANAHTAR
 </button>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'TOPLAM ANAHTAR', value: stats.total, icon: <Key className="w-4 h-4" />, color: 'cyan'},
 { label: 'AKTİF', value: stats.active, icon: <Check className="w-4 h-4" />, color: 'green'},
 { label: 'TOPLAM İSTEK', value: (stats.totalRequests || 0).toLocaleString(), icon: <Zap className="w-4 h-4" />, color: 'purple'},
 { label: 'API VERSİYONU', value: stats.version || 'v1.0', icon: <Code className="w-4 h-4" />, color: 'amber'}
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

 {/* Warning */}
 <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
 <div className="p-2 rounded-xl bg-amber-500/20">
 <AlertTriangle className="w-5 h-5 text-amber-400" />
 </div>
 <div>
 <p className="text-sm text-amber-200 font-bold">API Anahtarı Güvenliği</p>
 <p className="text-xs text-gray-400 mt-1">API anahtarlarınızı asla paylaşmayın. Sızdırılmış anahtarları hemen yenileyin veya iptal edin.</p>
 </div>
 </div>

 {/* API Keys Table */}
 <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
 <table className="w-full">
 <thead className="bg-white/5">
 <tr>
 <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">AD</th>
 <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ANAHTAR</th>
 <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ORTAM</th>
 <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">İSTEK</th>
 <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">DURUM</th>
 <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">İŞLEM</th>
 </tr>
 </thead>
 <tbody>
 {apiKeys.map(apiKey => {
 const env = environmentConfig[apiKey.environment] || environmentConfig.production
 const status = statusConfig[apiKey.status] || statusConfig.active

 return (
 <tr key={apiKey._id} className="border-t border-white/5 hover:bg-white/5 transition-all">
 <td className="px-6 py-4">
 <div className="font-bold text-white text-sm">{apiKey.name}</div>
 <div className="text-xs text-gray-500">
 {new Date(apiKey.createdAt).toLocaleDateString('tr-TR')}
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <code className="px-3 py-1.5 bg-white/5 rounded-xl text-xs font-mono text-gray-300">
 {visibleKeys[apiKey._id] ? apiKey.key : (apiKey.maskedKey || '••••••••••••••••')}
 </code>
 <button
 onClick={() => toggleKeyVisibility(apiKey._id)}
 className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all"
 >
 {visibleKeys[apiKey._id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
 </button>
 <button
 onClick={() => copyKey(apiKey._id, apiKey.key)}
 className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all"
 >
 {copiedId === apiKey._id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
 </button>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase ${env.color}`}>
 {env.label}
 </span>
 </td>
 <td className="px-6 py-4 text-sm font-bold text-white">
 {(apiKey.totalRequests || 0).toLocaleString()}
 </td>
 <td className="px-6 py-4">
 <button
 onClick={() => toggleStatus(apiKey)}
 className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${status.color}`}
 >
 {status.label}
 </button>
 </td>
 <td className="px-6 py-4">
 <div className="flex gap-2">
 <button
 onClick={() => handleRegenerate(apiKey._id)}
 className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
 title="Yenile"
 >
 <RefreshCcw className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDelete(apiKey._id)}
 className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
 title="Sil"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 )
})}
 </tbody>
 </table>

 {apiKeys.length === 0 && (
 <div className="text-center py-16">
 <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
 <h4 className="text-lg font-semibold text-white uppercase mb-1">API ANAHTARI YOK</h4>
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Henüz API anahtarı oluşturulmamış.</p>
 </div>
 )}
 </div>

 {/* Documentation Link */}
 <div className="glass-card rounded-2xl p-6 border border-white/5 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-2xl bg-cyan-500/10">
 <Code className="w-6 h-6 text-cyan-400" />
 </div>
 <div>
 <div className="font-bold text-white">API Dokümantasyonu</div>
 <div className="text-sm text-gray-500">Entegrasyon rehberi ve endpoint listesi</div>
 </div>
 </div>
 <button className="px-6 py-3 rounded-2xl bg-cyan-500/10 text-cyan-400 font-semibold text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-all">
 Dokümantasyona Git →
 </button>
 </div>

 {/* Create Modal */}
 {showModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
 <div className="glass-card rounded-2xl p-8 max-w-lg w-full border border-white/10 relative overflow-hidden animate-scale-in">
 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl -z-10"></div>

 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-2xl font-semibold text-white uppercase">YENİ API ANAHTARI</h3>
 <p className="text-sm text-gray-400 font-medium">Yeni bir API anahtarı oluşturun.</p>
 </div>
 <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
 <X className="w-6 h-6" />
 </button>
 </div>

 <form onSubmit={handleCreate} className="space-y-5">
 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ANAHTAR ADI</label>
 <input
 type="text"
 value={newKeyData.name}
 onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value})}
 placeholder="Örn: Production API, Mobile App"
 className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
 required
 />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ORTAM</label>
 <select
 value={newKeyData.environment}
 onChange={(e) => setNewKeyData({ ...newKeyData, environment: e.target.value})}
 className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
 >
 {Object.entries(environmentConfig).map(([key, val]) => (
 <option key={key} value={key}>{val.label}</option>
 ))}
 </select>
 </div>
 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">RATE LIMIT (saat)</label>
 <input
 type="number"
 value={newKeyData.rateLimit}
 onChange={(e) => setNewKeyData({ ...newKeyData, rateLimit: parseInt(e.target.value) || 1000})}
 className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-purple-500/30"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">YETKİLER</label>
 <div className="flex gap-2 flex-wrap">
 {['read', 'write', 'delete', 'admin'].map(perm => (
 <button
 key={perm}
 type="button"
 onClick={() => togglePermission(perm)}
 className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${newKeyData.permissions.includes(perm)
 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
 : 'bg-white/5 text-gray-500 border border-transparent'
}`}
 >
 {perm}
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AÇIKLAMA (OPSİYONEL)</label>
 <textarea
 value={newKeyData.description}
 onChange={(e) => setNewKeyData({ ...newKeyData, description: e.target.value})}
 rows={2}
 placeholder="Bu anahtar ne için kullanılacak?"
 className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-purple-500/30 resize-none"
 />
 </div>

 <div className="flex gap-4 pt-4">
 <button
 type="button"
 onClick={() => setShowModal(false)}
 className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
 >
 İPTAL
 </button>
 <button
 type="submit"
 className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
 >
 ANAHTAR OLUŞTUR
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 )
}
