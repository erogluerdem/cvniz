import { useState, useEffect } from 'react'
import {
    Activity, Shield, Clock, Mail, Globe, Monitor, Loader2,
    Search, Filter, Calendar, RefreshCw, ChevronRight, Eye,
    X, Download, Trash2, AlertCircle, CheckCircle2, Info
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const moduleColors = {
    'auth': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    'users': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'settings': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'support': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    'payments': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'coupons': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'announcements': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'api': 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    'security': 'text-red-400 bg-red-400/10 border-red-400/20',
    'default': 'text-gray-400 bg-gray-400/10 border-gray-400/20'
}

export default function LogsPage() {
    const { toast } = useToast()
    const [logs, setLogs] = useState([])
    const [stats, setStats] = useState({ total: 0, today: 0, mostActiveModule: '-', mostActiveAdmin: '-' })
    const [loading, setLoading] = useState(true)
    const [selectedLog, setSelectedLog] = useState(null)
    const [filters, setFilters] = useState({
        module: '',
        admin: '',
        startDate: '',
        endDate: '',
        limit: 100
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [logsRes, statsRes] = await Promise.all([
                adminAPI.getLogs(filters),
                adminAPI.getLogStats()
            ])
            if (logsRes.success) setLogs(logsRes.logs)
            if (statsRes.success) setStats(statsRes.stats)
        } catch (error) {
            toast.error('Veriler yüklenirken hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const resetFilters = () => {
        setFilters({
            module: '',
            admin: '',
            startDate: '',
            endDate: '',
            limit: 100
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
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Loglar Yükleniyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic">Sistem kayıtları taranıyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-primary">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
                        <Activity className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Audit Logs</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">Gerçek Zamanlı İzleme Aktif</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={fetchData}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(6,182,212,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-3 active:scale-95"
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
                    <div key={i} className="glass-card rounded-[2.5rem] p-7 border border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10 group-hover:scale-150 transition-all duration-700`}></div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-black text-white italic tracking-tighter leading-none truncate">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Global Controls & Search */}
            <div className="glass-card rounded-[2.5rem] p-6 border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="relative lg:col-span-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Modül</label>
                        <select
                            name="module"
                            value={filters.module}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs appearance-none focus:border-cyan-500/50 focus:outline-none transition-all cursor-pointer"
                        >
                            <option value="">TÜM MODÜLLER</option>
                            {Object.keys(moduleColors).filter(k => k !== 'default').map(m => (
                                <option key={m} value={m}>{m.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative lg:col-span-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Admin Email</label>
                        <div className="relative group">
                            <input
                                type="text"
                                name="admin"
                                value={filters.admin}
                                onChange={handleFilterChange}
                                placeholder="Email ara..."
                                className="w-full px-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-gray-600"
                            />
                            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                    </div>

                    <div className="relative lg:col-span-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Baslangıç</label>
                        <div className="relative group">
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="w-full px-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all"
                            />
                            <Calendar className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="relative lg:col-span-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Bitiş</label>
                        <div className="relative group">
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="w-full px-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all"
                            />
                            <Calendar className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            onClick={fetchData}
                            className="flex-1 py-3.5 rounded-2xl bg-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Filter className="w-3.5 h-3.5" /> FİLTRELE
                        </button>
                        <button
                            onClick={resetFilters}
                            className="p-3.5 rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-all"
                            title="Sıfırla"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left font-primary">
                        <thead className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Zaman Damgası</th>
                                <th className="px-8 py-5">Admin Operatörü</th>
                                <th className="px-8 py-5">Modül & İşlem</th>
                                <th className="px-8 py-5">Detay Analizi</th>
                                <th className="px-8 py-5 text-right">Erişim Bilgisi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => {
                                const modColor = moduleColors[log.module.toLowerCase()] || moduleColors['default']
                                return (
                                    <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                    {new Date(log.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {new Date(log.createdAt).toLocaleTimeString('tr-TR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                                                    <Shield className="w-5 h-5 text-cyan-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white capitalize">{log.adminEmail?.split('@')[0] || 'Sistem'}</span>
                                                    <span className="text-[10px] text-gray-500 font-medium truncate max-w-[150px]">{log.adminEmail || 'system@CVniz.com'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase border inline-flex w-fit ${modColor}`}>
                                                    {log.module}
                                                </span>
                                                <span className="text-sm text-gray-300 font-bold tracking-tight">
                                                    {log.action}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-gray-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all text-[10px] font-black uppercase tracking-widest border border-transparent group-hover:border-cyan-500/20"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> İNCELE
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex flex-col items-end gap-1.5">
                                                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                                                    <Globe className="w-3 h-3 text-cyan-500" />
                                                    <span className="text-[10px] text-gray-400 font-mono font-bold tracking-wider">{log.ipAddress || '127.0.0.1'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Monitor className="w-2.5 h-2.5" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest truncate max-w-[120px]">{log.userAgent?.split(' ')[0] || 'Web Agent'}</span>
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
                            <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 animate-pulse">
                                <Activity className="w-12 h-12 text-gray-800" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-lg font-black text-white uppercase tracking-tighter italic italic">Veri Bulunamadı</h4>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Belirtilen kriterlere uygun log kaydı bulunmuyor.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination / Total count */}
            <div className="flex items-center justify-between px-8 py-4 bg-white/5 rounded-[2rem] border border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Gösterilen Kayıt: <span className="text-cyan-400">{logs.length}</span> / {stats.total}
                </p>
                <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-20" disabled>
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-20" disabled>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card rounded-[3rem] p-8 max-w-2xl w-full border border-white/10 relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl -z-10"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                    <Eye className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">Log Analizi</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{selectedLog._id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all active:scale-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Modül & İşlem</span>
                                <p className="text-sm font-bold text-white uppercase">{selectedLog.module} / {selectedLog.action}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Zaman</span>
                                <p className="text-sm font-bold text-white">{new Date(selectedLog.createdAt).toLocaleString('tr-TR')}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Veri Paketi (Details)</label>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(selectedLog.details, null, 2))
                                        toast.success('Kopyalandı!')
                                    }}
                                    className="text-[10px] font-black text-cyan-400 hover:text-cyan-300"
                                >
                                    KOPYALA
                                </button>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-black/60 border border-white/10 font-mono text-xs overflow-auto max-h-[300px] custom-scrollbar text-cyan-500/80 leading-relaxed shadow-inner">
                                <pre>{formatJSON(selectedLog.details)}</pre>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-transparent"
                            >
                                KAPAT
                            </button>
                            <button
                                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
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

