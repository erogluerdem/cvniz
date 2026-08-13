import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Building2, Users, FileText, DollarSign, Plus, Edit, Trash2, Eye, Mail, X,
  RefreshCw, Search, CheckCircle2, Clock, PauseCircle, AlertCircle, Crown,
  Globe, Link2, Key, Headphones, Palette, Calendar, TrendingUp, Shield
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const planConfig = {
  starter: { label: 'Starter', color: 'bg-gray-500/20 text-gray-400', price: '₺999' },
  business: { label: 'Business', color: 'bg-cyan-500/20 text-cyan-400', price: '₺2.499' },
  enterprise: { label: 'Enterprise', color: 'bg-purple-500/20 text-purple-400', price: '₺4.999' },
  custom: { label: 'Custom', color: 'bg-amber-500/20 text-amber-400', price: 'Özel' }
}

const statusConfig = {
  trial: { label: 'Deneme', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  active: { label: 'Aktif', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  suspended: { label: 'Askıda', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
  cancelled: { label: 'İptal', color: 'bg-gray-500/20 text-gray-400', icon: X },
  expired: { label: 'Süresi Doldu', color: 'bg-red-700/20 text-red-500', icon: PauseCircle }
}

export default function EnterprisePage() {
  const { toast, confirm } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [enterprises, setEnterprises] = useState([])
 const [stats, setStats] = useState({ total: 0, active: 0, totalUsers: 0, monthlyRevenue: 0})
 const [loading, setLoading] = useState(true)
 const [showModal, setShowModal] = useState(false)
 const [editingEnterprise, setEditingEnterprise] = useState(null)
 const [searchQuery, setSearchQuery] = useState('')
 const [activeFilter, setActiveFilter] = useState('all')
 const [formData, setFormData] = useState({
 name: '',
 domain: '',
 plan: 'starter',
 userLimit: 10,
 cvLimit: 100,
 monthlyFee: 999,
 billingCycle: 'monthly',
 contactName: '',
 contactEmail: '',
 contactPhone: '',
 contactTitle: '',
 customBranding: false,
 apiAccess: false,
 ssoEnabled: false,
 dedicatedSupport: false,
 notes: ''
})

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [enterprisesRes, statsRes] = await Promise.all([
 adminAPI.getEnterprises(),
 adminAPI.getEnterpriseStats()
 ])
 if (enterprisesRes.success) setEnterprises(enterprisesRes.enterprises)
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
 if (editingEnterprise) {
 response = await adminAPI.updateEnterprise(editingEnterprise._id, formData)
 toast.success('Kurumsal hesap güncellendi!')
} else {
 response = await adminAPI.createEnterprise({ ...formData, status: 'trial'})
 toast.success('Yeni kurumsal hesap oluşturuldu!')
}
 if (response.success) {
 setShowModal(false)
 setEditingEnterprise(null)
 resetForm()
 fetchData()
}
} catch (error) {
 toast.error('İşlem başarısız: ' + error.message)
}
}

 const resetForm = () => {
 setFormData({
 name: '', domain: '', plan: 'starter', userLimit: 10, cvLimit: 100,
 monthlyFee: 999, billingCycle: 'monthly', contactName: '', contactEmail: '',
 contactPhone: '', contactTitle: '', customBranding: false, apiAccess: false,
 ssoEnabled: false, dedicatedSupport: false, notes: ''
})
}

 const openEditModal = (enterprise) => {
 setEditingEnterprise(enterprise)
 setFormData({
 name: enterprise.name,
 domain: enterprise.domain,
 plan: enterprise.plan,
 userLimit: enterprise.userLimit || 10,
 cvLimit: enterprise.cvLimit || 100,
 monthlyFee: enterprise.monthlyFee || 999,
 billingCycle: enterprise.billingCycle || 'monthly',
 contactName: enterprise.contactName || '',
 contactEmail: enterprise.contactEmail || '',
 contactPhone: enterprise.contactPhone || '',
 contactTitle: enterprise.contactTitle || '',
 customBranding: enterprise.customBranding || false,
 apiAccess: enterprise.apiAccess || false,
 ssoEnabled: enterprise.ssoEnabled || false,
 dedicatedSupport: enterprise.dedicatedSupport || false,
 notes: enterprise.notes || ''
})
 setShowModal(true)
}

 const toggleStatus = async (enterprise) => {
 const newStatus = enterprise.status === 'active' ? 'suspended' : 'active'
 try {
 const response = await adminAPI.updateEnterprise(enterprise._id, { status: newStatus})
 if (response.success) {
 setEnterprises(enterprises.map(e => e._id === enterprise._id ? { ...e, status: newStatus} : e))
 toast.success(newStatus === 'active' ? 'Hesap aktifleştirildi!' : 'Hesap askıya alındı!')
 fetchData()
}
} catch (error) {
 toast.error('Durum güncellenemedi.')
}
}

 const deleteEnterprise = async (id) => {
 const confirmed = await confirm({
 title: 'Kurumsal Hesabı Sil',
 message: 'Bu kurumsal hesabı kalıcı olarak silmek istediğinize emin misiniz?',
 confirmText: 'Evet, Sil',
 type: 'danger'
})
 if (!confirmed) return

 try {
 const response = await adminAPI.deleteEnterprise(id)
 if (response.success) {
 setEnterprises(enterprises.filter(e => e._id !== id))
 toast.success('Kurumsal hesap silindi.')
}
} catch (error) {
 toast.error('Kurumsal hesap silinemedi.')
}
}

 const filteredEnterprises = enterprises.filter(e => {
 const matchesSearch =
 e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 e.domain?.toLowerCase().includes(searchQuery.toLowerCase())
 if (activeFilter === 'all') return matchesSearch
 return matchesSearch && e.status === activeFilter
})

 if (loading && enterprises.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
 <Building2 className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">KURUMSAL HESAPLAR YÜKLENİYOR</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Veriler senkronize ediliyor...</p>
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
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
              <Building2 className="w-6 h-6 text-purple-500" />
            </div>
            Kurumsal Hesaplar
          </h2>
          <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>B2B müşterilerinizi yönetin ve büyütün.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className={`p-3 rounded-2xl border transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => { resetForm(); setEditingEnterprise(null); setShowModal(true) }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> YENİ HESAP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'KURUMSAL HESAP', value: stats.total, icon: <Building2 className="w-4 h-4" />, color: 'purple' },
          { label: 'AKTİF', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
          { label: 'TOPLAM KULLANICI', value: stats.totalUsers, icon: <Users className="w-4 h-4" />, color: 'cyan' },
          { label: 'AYLIK GELİR', value: `₺${(stats.monthlyRevenue || 0).toLocaleString()}`, icon: <DollarSign className="w-4 h-4" />, color: 'amber' }
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

      {/* Toolbar */}
      <div className={`rounded-2xl p-4 border flex flex-col md:flex-row items-center justify-between gap-4 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Şirket veya domain ara..."
            className={`border rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:outline-none focus:border-purple-500/30 transition-all w-full font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/5 text-white'}`}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'active', 'trial', 'suspended'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${activeFilter === f
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-600 dark:text-purple-400'
                  : (isDayMode ? 'bg-transparent border-transparent text-slate-500 hover:text-slate-900' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300')
                }`}
            >
              {f === 'all' ? 'TÜMÜ' : f === 'active' ? 'AKTİF' : f === 'trial' ? 'DENEME' : 'ASKIDA'}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprises Table */}
      <div className={`rounded-2xl overflow-hidden border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <table className="w-full">
          <thead className={isDayMode ? 'bg-slate-50 border-b border-slate-200' : 'bg-white/5'}>
            <tr>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ŞİRKET</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>PLAN</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KULLANIM</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>AYLIK</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ÖZELLİKLER</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DURUM</th>
              <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İŞLEM</th>
            </tr>
          </thead>
          <tbody className={isDayMode ? 'divide-y divide-slate-100' : 'divide-y divide-white/5'}>
            {filteredEnterprises.map(enterprise => {
              const plan = planConfig[enterprise.plan] || planConfig.starter
              const status = statusConfig[enterprise.status] || statusConfig.trial
              const StatusIcon = status.icon
              const usagePercent = enterprise.cvLimit > 0 ? Math.round((enterprise.usedCVs || 0) / enterprise.cvLimit * 100) : 0

              return (
                <tr key={enterprise._id} className={`transition-all ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-lg font-semibold text-purple-500">
                        {enterprise.name?.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{enterprise.name}</div>
                        <div className={`text-xs ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>{enterprise.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase ${plan.color}`}>
                      {plan.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-bold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                      {enterprise.activeUsers || 0} / {enterprise.userLimit} kullanıcı
                    </div>
                    <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/10'}`}>
                      <div
                        className={`h-full rounded-full ${usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>₺{(enterprise.monthlyFee || 0).toLocaleString()}</div>
                    <div className={`text-xs uppercase ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>{enterprise.billingCycle === 'annual' ? 'Yıllık' : 'Aylık'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {enterprise.customBranding && <Palette className="w-3.5 h-3.5 text-pink-500" title="Custom Branding" />}
                      {enterprise.apiAccess && <Key className="w-3.5 h-3.5 text-cyan-500" title="API Erişimi" />}
                      {enterprise.ssoEnabled && <Shield className="w-3.5 h-3.5 text-green-500" title="SSO" />}
                      {enterprise.dedicatedSupport && <Headphones className="w-3.5 h-3.5 text-amber-500" title="Özel Destek" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase flex items-center gap-1.5 w-fit ${status.color}`}>
                      <StatusIcon className="w-3 h-3" /> {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(enterprise)}
                        className={`p-2 rounded-xl transition-all ${enterprise.status === 'active'
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                          }`}
                      >
                        {enterprise.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(enterprise)}
                        className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-cyan-600' : 'bg-white/5 border-white/5 text-gray-500 hover:text-cyan-400'}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEnterprise(enterprise._id)}
                        className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-red-600' : 'bg-white/5 border-white/5 text-gray-500 hover:text-red-400'}`}
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

        {filteredEnterprises.length === 0 && (
          <div className="text-center py-20">
            <Building2 className={`w-12 h-12 mx-auto mb-4 ${isDayMode ? 'text-slate-300' : 'text-gray-600'}`} />
            <h4 className={`text-lg font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>KURUMSAL HESAP BULUNAMADI</h4>
            <p className={`text-xs font-bold uppercase tracking-wide ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Arama kriterlerine uygun hesap bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className={`rounded-2xl p-8 max-w-3xl w-full border relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto ${isDayMode ? 'bg-white border-slate-200 shadow-2xl' : 'glass-card border-white/10'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-2xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                  {editingEnterprise ? 'HESABI DÜZENLE' : 'YENİ KURUMSAL HESAP'}
                </h3>
                <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Kurumsal hesap bilgilerini girin.</p>
              </div>
              <button onClick={() => { setShowModal(false); setEditingEnterprise(null) }} className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Domain */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ŞİRKET ADI</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Koç Holding"
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DOMAİN</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="koc.com.tr"
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                    required
                  />
                </div>
              </div>

              {/* Plan & Billing */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>PLAN</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`}
                  >
                    {Object.entries(planConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label} ({val.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>FATURA</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`}
                  >
                    <option value="monthly">Aylık</option>
                    <option value="annual">Yıllık (%20 İndirim)</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KULLANICI LİMİT</label>
                  <input
                    type="number"
                    value={formData.userLimit}
                    onChange={(e) => setFormData({ ...formData, userLimit: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                    min="1"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>CV LİMİT</label>
                  <input
                    type="number"
                    value={formData.cvLimit}
                    onChange={(e) => setFormData({ ...formData, cvLimit: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                    min="1"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>AYLIK ÜCRET (₺)</label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) })}
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                  min="0"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İLETİŞİM ADI</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ÜNVAN</label>
                  <input
                    type="text"
                    value={formData.contactTitle}
                    onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                    placeholder="IT Müdürü"
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>E-POSTA</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>TELEFON</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-500/30 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>EKSTRA ÖZELLİKLER</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: 'customBranding', label: 'Custom Branding', icon: Palette },
                    { key: 'apiAccess', label: 'API Erişimi', icon: Key },
                    { key: 'ssoEnabled', label: 'SSO/SAML', icon: Shield },
                    { key: 'dedicatedSupport', label: 'Özel Destek', icon: Headphones }
                  ].map(feature => {
                    const Icon = feature.icon
                    return (
                      <label key={feature.key} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${formData[feature.key]
                          ? 'bg-purple-500/20 border-purple-500/30'
                          : (isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10')
                        }`}>
                        <input
                          type="checkbox"
                          checked={formData[feature.key]}
                          onChange={(e) => setFormData({ ...formData, [feature.key]: e.target.checked })}
                          className="hidden"
                        />
                        <Icon className={`w-4 h-4 ${formData[feature.key] ? 'text-purple-500' : 'text-gray-500'}`} />
                        <span className={`text-xs font-bold ${formData[feature.key] ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>{feature.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>NOTLAR</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Hesap hakkında notlar..."
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-medium focus:outline-none focus:border-purple-500/30 resize-none ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                  rows={2}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingEnterprise(null) }}
                  className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                >
                  İPTAL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingEnterprise ? 'GÜNCELLE' : 'HESAP OLUŞTUR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
