import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Activity, Shield, Clock, Mail, Globe, Monitor, Loader2,
  Search, Filter, Calendar, RefreshCw, ChevronRight, Eye,
  X, Download, Trash2, AlertCircle, CheckCircle2, Info
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const moduleColors = {
  'auth': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  'users': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  'settings': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  'support': 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  'payments': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  'coupons': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  'announcements': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'api': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  'security': 'text-red-500 bg-red-500/10 border-red-500/20',
  'default': 'text-gray-500 bg-gray-500/10 border-gray-500/20'
}

export default function LogsPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [logs, setLogs] = useState([])
 const [stats, setStats] = useState({ total: 0, today: 0, mostActiveModule: '-', mostActiveAdmin: '-'})
 const [loading, setLoading] = useState(true)
 const [selectedLog, setSelectedLog] = useState(null)
 const [filters, setFilters] = useState({
 module: '',
 admin: '',
 startDate: '',
 endDate: '',
 page: 1,
 limit: 20
})

 useEffect(() => {
 fetchData()
}, [filters.page])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [logsRes, statsRes] = await Promise.all([
 adminAPI.getLogs(filters),
 adminAPI.getLogStats()
 ])
 if (logsRes.success) {
   setLogs(logsRes.logs)
   setStats(prev => ({ ...prev, filteredTotal: logsRes.total })) // store total for pagination
 }
 if (statsRes.success) setStats(prev => ({ ...prev, ...statsRes.stats }))
} catch (error) {
 toast.error('Veriler yüklenirken hata oluştu')
} finally {
 setLoading(false)
}
}

 const handleFilterChange = (e) => {
 const { name, value} = e.target
 setFilters(prev => ({ ...prev, [name]: value, page: 1 }))
}

 const resetFilters = () => {
 setFilters({
 module: '',
 admin: '',
 startDate: '',
 endDate: '',
 page: 1,
 limit: 20
})
}

 const formatJSON = (json) => {
 try {
 return JSON.stringify(json, null, 2)
} catch (e) {
 return String(json)
}
}

 if (loading && logs.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <Activity className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">Loglar Yükleniyor</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Sistem kayıtları taranıyor...</p>
 </div>
 </div>
 )  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-primary">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
            <Activity className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Audit Logs</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Gerçek Zamanlı İzleme Aktif</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={fetchData}
            className={`p-4 rounded-2xl border transition-all active:scale-95 ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Dışa Aktar (.CSV)
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOPLAM KAYIT', value: stats.total.toLocaleString(), icon: <Activity className="w-4 h-4" />, color: 'cyan' },
          { label: 'BUGÜNKÜ İŞLEM', value: stats.today.toLocaleString(), icon: <Clock className="w-4 h-4" />, color: 'purple' },
          { label: 'EN AKTİF MODÜL', value: stats.mostActiveModule.toUpperCase(), icon: <Monitor className="w-4 h-4" />, color: 'pink' },
          { label: 'LİDER ADMİN', value: stats.mostActiveAdmin.split('@')[0].toUpperCase(), icon: <Shield className="w-4 h-4" />, color: 'orange' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-7 border relative overflow-hidden group ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10 group-hover:scale-150 transition-all duration-700`}></div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
            </div>
            <div className={`text-2xl font-semibold leading-none truncate ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Global Controls & Search */}
      <div className={`rounded-2xl p-6 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-1">
            <label className={`text-xs font-semibold uppercase tracking-wider ml-1 mb-2 block ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Modül</label>
            <select
              name="module"
              value={filters.module}
              onChange={handleFilterChange}
              className={`w-full px-4 py-3 border rounded-2xl font-bold text-xs appearance-none focus:border-cyan-500/50 focus:outline-none transition-all cursor-pointer ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
            >
              <option value="">TÜM MODÜLLER</option>
              {Object.keys(moduleColors).filter(k => k !== 'default').map(m => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="relative lg:col-span-1">
            <label className={`text-xs font-semibold uppercase tracking-wider ml-1 mb-2 block ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Admin Email</label>
            <div className="relative group">
              <input
                type="text"
                name="admin"
                value={filters.admin}
                onChange={handleFilterChange}
                placeholder="Email ara..."
                className={`w-full px-10 py-3 border rounded-2xl font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-gray-600'}`}
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-500 transition-colors" />
            </div>
          </div>

          <div className="relative lg:col-span-1">
            <label className={`text-xs font-semibold uppercase tracking-wider ml-1 mb-2 block ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Başlangıç</label>
            <div className="relative group">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className={`w-full px-10 py-3 border rounded-2xl font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
              />
              <Calendar className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="relative lg:col-span-1">
            <label className={`text-xs font-semibold uppercase tracking-wider ml-1 mb-2 block ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Bitiş</label>
            <div className="relative group">
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className={`w-full px-10 py-3 border rounded-2xl font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
              />
              <Calendar className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={fetchData}
              className={`flex-1 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Filter className="w-3.5 h-3.5" /> FİLTRELE
            </button>
            <button
              onClick={resetFilters}
              className={`p-3.5 rounded-2xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
              title="Sıfırla"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className={`rounded-2xl overflow-hidden border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-primary">
            <thead className={isDayMode ? 'bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider' : 'bg-white/5 text-gray-500 text-xs font-semibold uppercase tracking-wider'}>
              <tr>
                <th className="px-8 py-5">Zaman Damgası</th>
                <th className="px-8 py-5">Admin Operatörü</th>
                <th className="px-8 py-5">Modül & İşlem</th>
                <th className="px-8 py-5">Detay Analizi</th>
                <th className="px-8 py-5 text-right">Erişim Bilgisi</th>
              </tr>
            </thead>
            <tbody className={isDayMode ? 'divide-y divide-slate-100' : 'divide-y divide-white/5'}>
              {logs.map((log) => {
                const modColor = moduleColors[log.module.toLowerCase()] || moduleColors['default']
                return (
                  <tr key={log._id} className={`transition-colors group ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold group-hover:text-cyan-500 transition-colors ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                          {new Date(log.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        <span className={`text-xs font-bold uppercase flex items-center gap-1.5 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(log.createdAt).toLocaleTimeString('tr-TR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                          <Shield className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold capitalize ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{log.adminEmail?.split('@')[0] || 'Sistem'}</span>
                          <span className={`text-xs font-medium truncate max-w-[150px] ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{log.adminEmail || 'system@CVniz.com'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold tracking-wider uppercase border inline-flex w-fit ${modColor}`}>
                          {log.module}
                        </span>
                        <span className={`text-sm font-bold tracking-tight ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-600 group-hover:border-cyan-500 group-hover:text-cyan-600' : 'bg-white/5 border-transparent text-gray-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:border-cyan-500/20'}`}
                      >
                        <Eye className="w-3.5 h-3.5" /> İNCELE
                      </button>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                          <Globe className="w-3 h-3 text-cyan-500" />
                          <span className={`text-xs font-mono font-bold tracking-wider ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{log.ipAddress || '127.0.0.1'}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          <Monitor className="w-2.5 h-2.5" />
                          <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[120px]">{log.userAgent?.split(' ')[0] || 'Web Agent'}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className={`p-6 rounded-2xl border animate-pulse ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <Activity className={`w-12 h-12 ${isDayMode ? 'text-slate-300' : 'text-gray-800'}`} />
              </div>
              <div className="text-center">
                <h4 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Veri Bulunamadı</h4>
                <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Belirtilen kriterlere uygun log kaydı bulunmuyor.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination / Total count */}
      <div className={`flex items-center justify-between px-8 py-4 rounded-[2rem] border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
          Gösterilen Kayıt: <span className="text-cyan-500 font-bold">{logs.length}</span> / {stats.filteredTotal || stats.total}
        </p>
        {(stats.filteredTotal || stats.total) > filters.limit && (
          <div className="flex gap-2">
            <button 
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page === 1}
              className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white disabled:opacity-20'}`}
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil((stats.filteredTotal || stats.total) / filters.limit) }, (_, i) => i + 1).map((p) => {
                if (p === 1 || p === Math.ceil((stats.filteredTotal || stats.total) / filters.limit) || (p >= filters.page - 1 && p <= filters.page + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                      className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        filters.page === p
                          ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'
                          : isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      {p}
                    </button>
                  )
                } else if (p === filters.page - 2 || p === filters.page + 2) {
                  return <span key={p} className="px-1 text-gray-500">...</span>
                }
                return null;
              })}
            </div>

            <button 
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page >= Math.ceil((stats.filteredTotal || stats.total) / filters.limit)}
              className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white disabled:opacity-20'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className={`rounded-2xl p-8 max-w-2xl w-full border relative overflow-hidden animate-scale-in ${isDayMode ? 'bg-white border-slate-200 shadow-2xl' : 'glass-card border-white/10'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <Eye className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold uppercase leading-none mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Log Analizi</h3>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{selectedLog._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className={`p-2 rounded-xl border transition-all active:scale-90 ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-3xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <span className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Modül & İşlem</span>
                <p className={`text-sm font-bold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedLog.module} / {selectedLog.action}</p>
              </div>
              <div className={`p-4 rounded-3xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <span className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Zaman</span>
                <p className={`text-sm font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{new Date(selectedLog.createdAt).toLocaleString('tr-TR')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Veri Paketi (Details)</label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedLog.details, null, 2))
                    toast.success('Kopyalandı!')
                  }}
                  className="text-xs font-semibold text-cyan-500 hover:text-cyan-600"
                >
                  KOPYALA
                </button>
              </div>
              <div className={`p-6 rounded-[2rem] border font-mono text-xs overflow-auto max-h-[300px] custom-scrollbar text-cyan-600 dark:text-cyan-500/80 leading-relaxed shadow-inner ${isDayMode ? 'bg-slate-900 text-cyan-400 border-slate-800' : 'bg-black/60 border-white/10'}`}>
                <pre>{formatJSON(selectedLog.details)}</pre>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setSelectedLog(null)}
                className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
              >
                KAPAT
              </button>
              <button
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                RAPORU İNDİR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

