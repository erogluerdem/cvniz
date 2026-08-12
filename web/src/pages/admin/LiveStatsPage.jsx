import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Activity, Users, FileText, Download, TrendingUp, Globe, Zap,
  Clock, Cpu, HardDrive, Server, RefreshCw, Radio, Satellite,
  Shield, ArrowUpRight, MousePointer2, Bell, Terminal,
  Cpu as CpuIcon, Database
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function LiveStatsPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [isLive, setIsLive] = useState(true)
 const [stats, setStats] = useState(null)
 const [recentActions, setRecentActions] = useState([])
 const [loading, setLoading] = useState(true)
 const [refreshing, setRefreshing] = useState(false)
 const [performanceHistory, setPerformanceHistory] = useState([])
 const [latency, setLatency] = useState(0)

 // Polling interval ref
 const pollingRef = useRef(null)

 useEffect(() => {
 fetchData()
 startPolling()
 return () => stopPolling()
}, [])

 useEffect(() => {
 if (isLive) startPolling()
 else stopPolling()
}, [isLive])

 const startPolling = () => {
 stopPolling()
 pollingRef.current = setInterval(async () => {
 await fetchUpdates()
}, 5000)
}

 const stopPolling = () => {
 if (pollingRef.current) clearInterval(pollingRef.current)
}

 const fetchData = async () => {
 setLoading(true)
 const start = Date.now()
 try {
 const res = await adminAPI.getLiveStats()
 setLatency(Date.now() - start)
 if (res.success) {
 setStats(res.stats)
 setRecentActions(res.recentActions)
 setPerformanceHistory(prev => [...prev, res.stats.server.cpu].slice(-20))
}
} catch (error) {
 toast.error('Canlı veriler başlatılamadı')
} finally {
 setLoading(false)
}
}

 const fetchUpdates = async () => {
 setRefreshing(true)
 const start = Date.now()
 try {
 const res = await adminAPI.getLiveStats()
 setLatency(Date.now() - start)
 if (res.success) {
 setStats(res.stats)
 setRecentActions(res.recentActions)
 setPerformanceHistory(prev => [...prev, res.stats.server.cpu].slice(-20))
}
} catch (error) {
 console.error('Polling error:', error)
} finally {
 setRefreshing(false)
}
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <Radio className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center font-primary">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">Veri Akışı Başlatılıyor</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Real-time kanalına bağlanılıyor...</p>
 </div>
 </d  return (
    <div className="space-y-8 font-primary">
      {/* Header / Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[2rem] bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
            <Satellite className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Canlı Monitör</h2>
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400 dark:bg-gray-500'}`}></span>
              <p className={`text-xs font-semibold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                {isLive ? 'SİSTEM ÇEVRİMİÇİ / CANLI VERİ' : 'VERİ AKIŞI DURAKLATILDI'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden lg:flex items-center gap-4 px-6 py-3 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'}`}>
            <div className="text-right">
              <div className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>GECİKME</div>
              <div className="text-xs font-semibold text-emerald-500">{latency}ms</div>
            </div>
            <div className={`w-px h-6 ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`}></div>
            <div className="text-right">
              <div className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>SUNUCU</div>
              <div className={`text-xs font-semibold truncate max-w-[100px] ${isDayMode ? 'text-slate-800' : 'text-white'}`} title={stats?.server?.hostname}>
                {stats?.server?.hostname || 'LOKAL'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-8 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-3 active:scale-95 ${isLive
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
          >
            {isLive ? <Radio className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            {isLive ? 'YAYINI DURDUR' : 'YAYINI BAŞLAT'}
          </button>
        </div>
      </div>

      {/* Real-time Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'AKTİF KULLANICI', value: stats?.onlineUsers, icon: Users, color: 'cyan', pulse: true },
          { label: 'CV OTURUMLARI', value: stats?.activeCVSessions, icon: FileText, color: 'purple', pulse: true },
          { label: 'BEKLEYEN PDF', value: stats?.pdfGenerations, icon: Download, color: 'amber', pulse: false },
          { label: 'SİSTEM UPTIME', value: stats?.server?.uptime + 'h', icon: Clock, color: 'blue', pulse: false }
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl p-8 border relative group overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            {item.pulse && (
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-${item.color}-500 animate-ping opacity-75`}></div>
            )}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${item.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>

            <item.icon className={`w-8 h-8 text-${item.color}-500 mb-6`} />
            <div className="space-y-1">
              <div className={`text-4xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.value || 0}</div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Monitor / Map Placeholder */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`rounded-2xl p-10 border relative overflow-hidden h-[400px] flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-cyan-500/5 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 text-center space-y-6">
              <div className="w-24 h-24 rounded-full border border-cyan-500/20 flex items-center justify-center mx-auto bg-cyan-500/5 relative">
                <Globe className="w-10 h-10 text-cyan-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/50 animate-spin"></div>
              </div>
              <div>
                <h3 className={`text-2xl font-semibold uppercase mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Global Erişim Haritası</h3>
                <p className={`text-xs font-bold uppercase tracking-wider max-w-sm mx-auto leading-relaxed ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                  Dünya üzerindeki aktif kullanıcıların lokasyonlarını gerçek zamanlı olarak takip edin.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {stats?.locations?.length > 0 ? (
                  stats.locations.map((loc, i) => (
                    <div key={i} className={`px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/5 text-cyan-200/50'}`}>
                      {loc}
                    </div>
                  ))
                ) : (
                  <div className={`px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                    Canlı veri bekleniyor...
                  </div>
                )}
              </div>
            </div>

            {/* Scan Line Animation */}
            <div className="absolute left-0 w-full h-px bg-cyan-500/20 top-0 animate-scan"></div>
          </div>

          {/* Performance History Chart */}
          <div className={`rounded-2xl p-8 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>İŞLEMCİ YÜKÜ TRENDİ (CPU)</h4>
              </div>
              <span className="text-xs font-semibold text-emerald-500">AKTİF YÜK: %{stats?.server?.cpu}</span>
            </div>
            <div className="flex items-end h-20 gap-1 px-2">
              {performanceHistory.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-500/20 rounded-t-sm transition-all duration-500 hover:bg-emerald-500/50"
                  style={{ height: `${Math.max(val, 5)}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & System Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Activity Feed */}
          <div className={`rounded-2xl p-8 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Canlı Akış</h3>
              </div>
              {refreshing && <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" />}
            </div>

            <div className="space-y-6">
              {(recentActions.length > 0 ? recentActions : []).map((action, i) => (
                <div key={i} className="flex gap-4 group animate-fade-in">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${(i % 3 === 0) ? 'bg-cyan-500/10 border border-cyan-500/20' :
                        (i % 3 === 1) ? 'bg-purple-500/10 border border-purple-500/20' :
                          'bg-amber-500/10 border border-amber-500/20'
                      }`}>
                      <MousePointer2 className={`w-4 h-4 ${(i % 3 === 0) ? 'text-cyan-500' :
                          (i % 3 === 1) ? 'text-purple-500' :
                            'text-amber-500'
                        }`} />
                    </div>
                    {i !== recentActions.length - 1 && <div className={`w-0.5 flex-1 my-2 ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-semibold uppercase tracking-wider truncate ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{action.action}</span>
                      <span className={`text-xs font-bold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>{new Date(action.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase ${isDayMode ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-gray-500'}`}>{action.type}</span>
                      <span className={`text-xs font-medium truncate ${isDayMode ? 'text-slate-500' : 'text-gray-600'}`}>{action.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health Indicators */}
          <div className={`rounded-2xl p-8 border space-y-8 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10">
                <Server className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Sistem Sağlığı</h3>
            </div>

            {[
              { label: 'CPU LOAD', value: stats?.server?.cpu, icon: CpuIcon, color: 'cyan' },
              { label: 'RAM USAGE', value: stats?.server?.ram, icon: Database, color: 'purple' },
              { label: 'PLATFORM', value: (stats?.server?.platform === 'win32' ? 99 : 85), icon: HardDrive, color: 'amber', label2: stats?.server?.platform?.toUpperCase() }
            ].map((stat, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-3.5 h-3.5 text-${stat.color}-500`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{stat.label2 || stat.label}</span>
                  </div>
                  <span className={`text-xs font-semibold text-${stat.color}-500`}>{stat.label2 ? stat.label2 : '%' + stat.value}</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden p-0.5 ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                  <div
                    className={`h-full bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-400 rounded-full transition-all duration-1000`}
                    style={{ width: `${stat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="pt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Tüm sistemler kararlı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
