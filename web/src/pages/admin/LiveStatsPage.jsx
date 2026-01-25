import { useState, useEffect, useRef } from 'react'
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
    const [isLive, setIsLive] = useState(true)
    const [stats, setStats] = useState(null)
    const [recentActions, setRecentActions] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [performanceHistory, setPerformanceHistory] = useState([])

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
        try {
            const res = await adminAPI.getLiveStats()
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
        try {
            const res = await adminAPI.getLiveStats()
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
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Veri Akışı Başlatılıyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic italic">Real-time kanalına bağlanılıyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 font-primary">
            {/* Header / Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
                        <Satellite className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Canlı Monitör</h2>
                        <div className="flex items-center gap-2">
                            <span className={`flex h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-none">
                                {isLive ? 'SİSTEM ÇEVRİMİÇİ / CANLI VERİ' : 'VERİ AKIŞI DURAKLATILDI'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-right">
                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">GECİKME</div>
                            <div className="text-xs font-black text-emerald-400">14ms</div>
                        </div>
                        <div className="w-px h-6 bg-white/10"></div>
                        <div className="text-right">
                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">LOKASYON</div>
                            <div className="text-xs font-black text-white italic">TR-EUROPE</div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95 ${isLive
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
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
                    <div key={i} className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative group overflow-hidden">
                        {item.pulse && (
                            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full bg-${item.color}-500 animate-ping opacity-75`}></div>
                        )}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${item.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>

                        <item.icon className={`w-8 h-8 text-${item.color}-400 mb-6`} />
                        <div className="space-y-1">
                            <div className="text-4xl font-black text-white italic tracking-tighter">{item.value || 0}</div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Monitor / Map Placeholder */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card rounded-[3rem] p-10 border border-white/5 relative overflow-hidden h-[400px] flex flex-col justify-center items-center bg-gradient-to-b from-transparent to-cyan-500/5">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-24 h-24 rounded-full border border-cyan-500/20 flex items-center justify-center mx-auto bg-cyan-500/5 relative">
                                <Globe className="w-10 h-10 text-cyan-400 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/50 animate-spin"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Global Erişim Haritası</h3>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                    Dünya üzerindeki aktif kullanıcıların lokasyonlarını gerçek zamanlı olarak takip edin.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                {(stats?.locations?.length > 0 ? stats.locations : ['TÜRKİYE: 0']).map((loc, i) => (
                                    <div key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-cyan-200/50 uppercase tracking-widest">
                                        {loc}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scan Line Animation */}
                        <div className="absolute left-0 w-full h-px bg-cyan-500/20 top-0 animate-scan"></div>
                    </div>

                    {/* Performance History Chart */}
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">İŞLEMCİ YÜKÜ TRENDİ (CPU)</h4>
                            </div>
                            <span className="text-xs font-black text-emerald-400 italic">AKTİF YÜK: %{stats?.server?.cpu}</span>
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
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Canlı Akış</h3>
                            </div>
                            {refreshing && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
                        </div>

                        <div className="space-y-6">
                            {(recentActions.length > 0 ? recentActions : []).map((action, i) => (
                                <div key={i} className="flex gap-4 group animate-fade-in">
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${(i % 3 === 0) ? 'bg-cyan-500/10 border border-cyan-500/20' :
                                            (i % 3 === 1) ? 'bg-purple-500/10 border border-purple-500/20' :
                                                'bg-amber-500/10 border border-amber-500/20'
                                            }`}>
                                            <MousePointer2 className={`w-4 h-4 ${(i % 3 === 0) ? 'text-cyan-400' :
                                                (i % 3 === 1) ? 'text-purple-400' :
                                                    'text-amber-400'
                                                }`} />
                                        </div>
                                        {i !== recentActions.length - 1 && <div className="w-0.5 flex-1 bg-white/5 my-2"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">{action.action}</span>
                                            <span className="text-[9px] text-gray-600 font-bold">{new Date(action.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 font-black tracking-widest uppercase">{action.type}</span>
                                            <span className="text-[9px] text-gray-600 font-medium truncate italic">{action.user}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health Indicators */}
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-indigo-500/10">
                                <Server className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Sistem Sağlığı</h3>
                        </div>

                        {[
                            { label: 'CPU LOAD', value: stats?.server?.cpu, icon: CpuIcon, color: 'cyan' },
                            { label: 'RAM USAGE', value: stats?.server?.ram, icon: Database, color: 'purple' },
                            { label: 'DISK I/O', value: 42, icon: HardDrive, color: 'amber' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <stat.icon className={`w-3.5 h-3.5 text-${stat.color}-400`} />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</span>
                                    </div>
                                    <span className={`text-[10px] font-black text-${stat.color}-400`}>%{stat.value}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                                    <div
                                        className={`h-full bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-400 rounded-full transition-all duration-1000`}
                                        style={{ width: `${stat.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Tüm sistemler kararlı</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
