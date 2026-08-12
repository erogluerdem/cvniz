import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Users, Gift, TrendingUp, DollarSign, Copy, Check, Link2, Award,
  RefreshCw, Search, Filter, Trash2, CheckCircle2, Clock, XCircle,
  Settings, Save, AlertCircle, Zap, Crown, Medal, ExternalLink
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const rankColors = [
  { bg: 'bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/30' },
  { bg: 'bg-gray-400/20', text: 'text-gray-400', border: 'border-gray-400/30' },
  { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30' }
]

const statusConfig = {
  pending: { label: 'Beklemede', color: 'bg-amber-500/20 text-amber-500', icon: Clock },
  completed: { label: 'Tamamlandı', color: 'bg-green-500/20 text-green-500', icon: CheckCircle2 },
  expired: { label: 'Süresi Dolmuş', color: 'bg-red-500/20 text-red-500', icon: XCircle },
  cancelled: { label: 'İptal Edildi', color: 'bg-gray-500/20 text-gray-500', icon: XCircle }
}

export default function ReferralsPage() {
  const { toast, confirm } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({ totalReferrals: 0, converted: 0, pending: 0, totalEarnings: 0, conversionRate: 0 })
  const [topReferrers, setTopReferrers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    enabled: true,
    referrerReward: 20,
    referredReward: 10,
    maxRewards: 1000
  })
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [referralsRes, statsRes] = await Promise.all([
        adminAPI.getReferrals(),
        adminAPI.getReferralStats()
      ])

      if (referralsRes.success) setReferrals(referralsRes.referrals)
      if (statsRes.success) {
        setStats(statsRes.stats)
        setTopReferrers(statsRes.topReferrers || [])
      }
    } catch (error) {
      toast.error('Veriler yüklenirken hata: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('Referans kodu kopyalandı!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const updateReferralStatus = async (id, status) => {
    try {
      const response = await adminAPI.updateReferral(id, { status })
      if (response.success) {
        setReferrals(referrals.map(r => r._id === id ? { ...r, status } : r))
        toast.success('Referans durumu güncellendi.')
        fetchData()
      }
    } catch (error) {
      toast.error('Durum güncellenemedi.')
    }
  }

  const markAsPaid = async (id) => {
    try {
      const response = await adminAPI.updateReferral(id, { isPaid: true, paidAt: new Date() })
      if (response.success) {
        setReferrals(referrals.map(r => r._id === id ? { ...r, isPaid: true } : r))
        toast.success('Ödeme tamamlandı olarak işaretlendi.')
      }
    } catch (error) {
      toast.error('İşlem başarısız.')
    }
  }

  const deleteReferral = async (id) => {
    const confirmed = await confirm({
      title: 'Referansı Sil',
      message: 'Bu referansı kalıcı olarak silmek istediğinize emin misiniz?',
      confirmText: 'Evet, Sil',
      type: 'danger'
    })
    if (!confirmed) return

    try {
      const response = await adminAPI.deleteReferral(id)
      if (response.success) {
        setReferrals(referrals.filter(r => r._id !== id))
        toast.success('Referans silindi.')
      }
    } catch (error) {
      toast.error('Referans silinemedi.')
    }
  }

  const saveSettings = async () => {
    try {
      toast.success('Ayarlar kaydedildi.')
      setShowSettings(false)
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi.')
    }
  }

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch =
      r.referralCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referrer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referred?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === 'all') return matchesSearch
    return matchesSearch && r.status === activeFilter
  })

  if (loading && referrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
          <Link2 className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">REFERANSLAR YÜKLENİYOR</h3>
          <p className="text-gray-500 text-xs font-bold uppercase">Veriler senkronize ediliyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-semibold mb-1 uppercase flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
              <Link2 className="w-6 h-6 text-purple-500" />
            </div>
            Referans Yönetimi
          </h2>
          <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Davet sistemini yönetin ve kullanıcı kazançlarını takip edin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl border transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={fetchData}
            className={`p-3 rounded-2xl border transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOPLAM REFERANS', value: stats.totalReferrals, icon: <Users className="w-4 h-4" />, color: 'cyan' },
          { label: 'DÖNÜŞEN', value: stats.converted, icon: <TrendingUp className="w-4 h-4" />, color: 'green' },
          { label: 'BEKLEYEN', value: stats.pending, icon: <Clock className="w-4 h-4" />, color: 'amber' },
          { label: 'TOPLAM KAZANÇ', value: `₺${stats.totalEarnings}`, icon: <DollarSign className="w-4 h-4" />, color: 'purple' }
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

      {/* Settings Panel (Collapsible) */}
      {showSettings && (
        <div className={`rounded-2xl p-6 border animate-scale-in ${isDayMode ? 'bg-white border-purple-200 shadow-lg' : 'glass-card border-purple-500/20'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-purple-500 uppercase tracking-wider flex items-center gap-2">
              <Gift className="w-4 h-4" /> REFERANS AYARLARI
            </h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>SİSTEM DURUMU</label>
              <button
                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                className={`w-full py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${settings.enabled
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                  }`}
              >
                {settings.enabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {settings.enabled ? 'AKTİF' : 'PASİF'}
              </button>
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DAVET EDEN ÖDÜLÜ (₺)</label>
              <input
                type="number"
                value={settings.referrerReward}
                onChange={(e) => setSettings({ ...settings, referrerReward: parseInt(e.target.value) })}
                className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DAVET EDİLEN ÖDÜLÜ (₺)</label>
              <input
                type="number"
                value={settings.referredReward}
                onChange={(e) => setSettings({ ...settings, referredReward: parseInt(e.target.value) })}
                className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>MAX ÖDÜL LİMİTİ (₺)</label>
              <input
                type="number"
                value={settings.maxRewards}
                onChange={(e) => setSettings({ ...settings, maxRewards: parseInt(e.target.value) })}
                className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
              />
            </div>
          </div>
          <button
            onClick={saveSettings}
            className="px-8 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> AYARLARI KAYDET
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Referrers */}
        <div className={`rounded-2xl p-6 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
          <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Crown className="w-4 h-4" /> EN İYİ REFERANSÇILAR
          </h3>
          {topReferrers.length > 0 ? (
            <div className="space-y-3">
              {topReferrers.map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/5 border-white/5 hover:bg-white/10'} ${i < 3 ? rankColors[i]?.border : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm ${i < 3 ? `${rankColors[i]?.bg} ${rankColors[i]?.text}` : (isDayMode ? 'bg-slate-200 text-slate-600' : 'bg-white/10 text-gray-400')}`}>
                      {i === 0 ? <Crown className="w-5 h-5" /> : i === 1 ? <Medal className="w-5 h-5" /> : i + 1}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{user.name}</div>
                      <div className={`text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{user.referrals} referans</div>
                    <div className="text-xs text-green-500 font-bold">₺{user.earnings} kazandı</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 opacity-50">
              <Award className={`w-12 h-12 mx-auto mb-3 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`} />
              <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Henüz referansçı yok</p>
            </div>
          )}
        </div>

        {/* Referrals List */}
        <div className={`lg:col-span-2 rounded-2xl p-6 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xs font-semibold text-purple-500 uppercase tracking-wider flex items-center gap-2">
              <Link2 className="w-4 h-4" /> SON REFERANSLAR
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ara..."
                  className={`border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500/30 w-40 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/5 text-white'}`}
                />
              </div>
              {['all', 'pending', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${activeFilter === f
                      ? 'bg-purple-500/20 text-purple-500 font-bold'
                      : (isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-500 hover:text-gray-300')
                    }`}
                >
                  {f === 'all' ? 'TÜMÜ' : f === 'pending' ? 'BEKLEYEN' : 'TAMAMLANAN'}
                </button>
              ))}
            </div>
          </div>

          {filteredReferrals.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredReferrals.map((ref) => {
                const status = statusConfig[ref.status] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <div key={ref._id} className={`p-4 rounded-2xl border transition-all group ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{ref.referrer?.name || 'Bilinmiyor'}</span>
                            <span className="text-gray-400 text-xs">→</span>
                            <span className={`font-medium text-sm ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{ref.referred?.name || 'Bekliyor'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => copyCode(ref.referralCode)}
                              className="flex items-center gap-1 text-xs font-bold text-purple-500 hover:text-purple-600 transition-all"
                            >
                              {copiedCode === ref.referralCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {ref.referralCode}
                            </button>
                            <span className={`text-xs ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              {new Date(ref.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase flex items-center gap-1.5 ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {ref.referrerReward > 0 && (
                          <span className="text-xs font-bold text-green-500">₺{ref.referrerReward}</span>
                        )}
                        {ref.status === 'completed' && !ref.isPaid && (
                          <button
                            onClick={() => markAsPaid(ref._id)}
                            className="p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all opacity-0 group-hover:opacity-100"
                            title="Ödendi İşaretle"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteReferral(ref._id)}
                          className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${isDayMode ? 'bg-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50' : 'bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 opacity-50">
              <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`} />
              <h4 className={`text-sm font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>REFERANS BULUNAMADI</h4>
              <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Kriterlere uyan referans yok.</p>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Rate Card */}
      <div className={`rounded-2xl p-6 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-cyan-500/10 blur-3xl -z-10"></div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DÖNÜŞÜM ORANI</h3>
            <div className={`text-5xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
              {stats.conversionRate}%
            </div>
          </div>
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isDayMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${stats.conversionRate}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
