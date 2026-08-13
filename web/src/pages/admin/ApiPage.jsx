import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCcw, AlertTriangle, Check, X,
  Shield, Code, Zap, Clock, Server, Globe, Lock, Settings
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const environmentConfig = {
  production: { label: 'Production', color: 'bg-green-500/20 text-green-400', short: 'prod' },
  staging: { label: 'Staging', color: 'bg-amber-500/20 text-amber-400', short: 'stg' },
  development: { label: 'Development', color: 'bg-blue-500/20 text-blue-400', short: 'dev' },
  test: { label: 'Test', color: 'bg-gray-500/20 text-gray-400', short: 'test' }
}

const statusConfig = {
  active: { label: 'Aktif', color: 'bg-green-500/20 text-green-400' },
  inactive: { label: 'Pasif', color: 'bg-gray-500/20 text-gray-400' },
  revoked: { label: 'İptal', color: 'bg-red-500/20 text-red-400' },
  expired: { label: 'Süresi Dolmuş', color: 'bg-amber-500/20 text-amber-400' }
}

export default function ApiPage() {
  const { toast, confirm } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
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
          <h2 className={`text-2xl font-semibold mb-1 uppercase flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
              <Key className="w-6 h-6 text-purple-500" />
            </div>
            API Yönetimi
          </h2>
          <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>API anahtarlarını oluşturun ve yönetin.</p>
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
          { label: 'TOPLAM ANAHTAR', value: stats.total, icon: <Key className="w-4 h-4" />, color: 'cyan' },
          { label: 'AKTİF', value: stats.active, icon: <Check className="w-4 h-4" />, color: 'green' },
          { label: 'TOPLAM İSTEK', value: (stats.totalRequests || 0).toLocaleString(), icon: <Zap className="w-4 h-4" />, color: 'purple' },
          { label: 'API VERSİYONU', value: stats.version || 'v1.0', icon: <Code className="w-4 h-4" />, color: 'amber' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
            </div>
            <div className={`text-3xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className={`rounded-2xl p-5 border flex items-start gap-4 ${isDayMode ? 'bg-amber-50 border-amber-200' : 'glass-card border-amber-500/20 bg-amber-500/5'}`}>
        <div className="p-2 rounded-xl bg-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className={`text-sm font-bold ${isDayMode ? 'text-amber-900' : 'text-amber-200'}`}>API Anahtarı Güvenliği</p>
          <p className={`text-xs mt-1 ${isDayMode ? 'text-amber-700' : 'text-gray-400'}`}>API anahtarlarınızı asla paylaşmayın. Sızdırılmış anahtarları hemen yenileyin veya iptal edin.</p>
        </div>
      </div>

      {/* API Keys Table */}
      <div className={`rounded-2xl overflow-hidden border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <table className="w-full">
          <thead className={isDayMode ? 'bg-slate-50 border-b border-slate-200' : 'bg-white/5'}>
            <tr>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>AD</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ANAHTAR</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ORTAM</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İSTEK</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DURUM</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İŞLEM</th>
            </tr>
          </thead>
          <tbody className={isDayMode ? 'divide-y divide-slate-100' : 'divide-y divide-white/5'}>
            {apiKeys.map(apiKey => {
              const env = environmentConfig[apiKey.environment] || environmentConfig.production
              const status = statusConfig[apiKey.status] || statusConfig.active

              return (
                <tr key={apiKey._id} className={`transition-all ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                  <td className="px-6 py-4">
                    <div className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{apiKey.name}</div>
                    <div className={`text-xs ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {new Date(apiKey.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className={`px-3 py-1.5 rounded-xl text-xs font-mono border ${isDayMode ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-white/5 text-gray-300 border-white/5'}`}>
                        {visibleKeys[apiKey._id] ? apiKey.key : (apiKey.maskedKey || '••••••••••••••••')}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey._id)}
                        className={`p-1.5 rounded-lg border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                      >
                        {visibleKeys[apiKey._id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyKey(apiKey._id, apiKey.key)}
                        className={`p-1.5 rounded-lg border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                      >
                        {copiedId === apiKey._id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase ${env.color}`}>
                      {env.label}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
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
                        className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
                        title="Yenile"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(apiKey._id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
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
            <Key className={`w-12 h-12 mx-auto mb-4 ${isDayMode ? 'text-slate-300' : 'text-gray-600'}`} />
            <h4 className={`text-lg font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>API ANAHTARI YOK</h4>
            <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Henüz API anahtarı oluşturulmamış.</p>
          </div>
        )}
      </div>

      {/* Documentation Link */}
      <div className={`rounded-2xl p-6 border flex items-center justify-between ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10">
            <Code className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <div className={`font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>API Dokümantasyonu</div>
            <div className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Entegrasyon rehberi ve endpoint listesi</div>
          </div>
        </div>
        <button className="px-6 py-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-all">
          Dokümantasyona Git →
        </button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className={`rounded-2xl p-8 max-w-lg w-full border relative overflow-hidden animate-scale-in ${isDayMode ? 'bg-white border-slate-200 shadow-2xl' : 'glass-card border-white/10'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-2xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>YENİ API ANAHTARI</h3>
                <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Yeni bir API anahtarı oluşturun.</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ANAHTAR ADI</label>
                <input
                  type="text"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  placeholder="Örn: Production API, Mobile App"
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ORTAM</label>
                  <select
                    value={newKeyData.environment}
                    onChange={(e) => setNewKeyData({ ...newKeyData, environment: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`}
                  >
                    {Object.entries(environmentConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>RATE LIMIT (saat)</label>
                  <input
                    type="number"
                    value={newKeyData.rateLimit}
                    onChange={(e) => setNewKeyData({ ...newKeyData, rateLimit: parseInt(e.target.value) || 1000 })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>YETKİLER</label>
                <div className="flex gap-2 flex-wrap">
                  {['read', 'write', 'delete', 'admin'].map(perm => (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => togglePermission(perm)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${newKeyData.permissions.includes(perm)
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          : (isDayMode ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-white/5 text-gray-500 border border-transparent')
                        }`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>AÇIKLAMA (OPSİYONEL)</label>
                <textarea
                  value={newKeyData.description}
                  onChange={(e) => setNewKeyData({ ...newKeyData, description: e.target.value })}
                  rows={2}
                  placeholder="Bu anahtar ne için kullanılacak?"
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-500/30 resize-none ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
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
