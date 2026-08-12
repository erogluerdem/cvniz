import {
 Users, Crown, FileText, DollarSign, Activity, Download, Zap,
 TrendingUp, BarChart3, PieChart, MessageCircle, Loader2,
 ChevronRight, ArrowUpRight, ArrowDownRight, Clock, Shield,
 Layout, Sparkles, Target, Globe, MousePointer2, Briefcase,
 Bell, Settings2, RefreshCw, ExternalLink, MoreVertical, Palette
} from 'lucide-react'
import { useState, useEffect} from 'react'
import { adminAPI} from '../../services/api'
import { useToast} from '../../context/ToastContext'
import { Link, useOutletContext} from 'react-router-dom'

const templateEmojis = {
 modern: '🎨',
 minimalist: '⚡',
 corporate: '🏢',
 creative: '🌈',
 tech: '💻',
 professional: '👔',
 default: '📄'
}

const templateNames = {
 modern: 'Modern Sanat',
 minimalist: 'Sade & Şık',
 corporate: 'Kurumsal Vizyon',
 creative: 'Yaratıcı Zihin',
 tech: 'Dijital Gelecek',
 professional: 'Profesyonel Elit'
}

export default function DashboardPage() {
 const { toast} = useToast()
 const { isDayMode} = useOutletContext() || { isDayMode: false}
 const [stats, setStats] = useState({
 totalUsers: 0,
 premiumUsers: 0,
 totalCVs: 0,
 revenue: 0,
 todayCVs: 0,
 todayRevenue: 0,
 activeUsers: 0,
 downloads: 0,
 openTickets: 0,
 templateUsage: [],
 monthlyTrends: [],
 growth: 0
})
 const [logs, setLogs] = useState([])
 const [loading, setLoading] = useState(true)
 const [refreshing, setRefreshing] = useState(false)

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setRefreshing(true)
 try {
 const [statsRes, logsRes] = await Promise.all([
 adminAPI.getStats(),
 adminAPI.getLogs({ limit: 6})
 ])
 if (statsRes.success) setStats(statsRes.stats)
 if (logsRes.success) setLogs(logsRes.logs)
} catch (error) {
 toast.error('Dashboard verileri yüklenemedi')
} finally {
 setLoading(false)
 setRefreshing(false)
}
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className={`w-24 h-24 rounded-full border-4 border-t-cyan-500 animate-spin ${isDayMode ? 'border-cyan-100' : 'border-cyan-500/10'}`}></div>
 <Zap className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center font-primary">
 <h3 className={`font-semibold uppercase tracking-wider text-xs mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Analitik Veriler Hazırlanıyor</h3>
 <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Tüm sistem taranıyor...</p>
 </div>
 </div>
 )
}

 return (
 <div className="space-y-8 font-primary">
 {/* Header Area */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="flex items-center gap-4">
 <div className="p-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
 <Layout className="w-8 h-8 text-cyan-500" />
 </div>
 <div>
 <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Kontrol Merkezi</h2>
 <div className="flex items-center gap-2">
 <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
 <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Genel Sistem Özeti & Analitikler</p>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={fetchData}
 disabled={refreshing}
 className={`p-4 rounded-2xl border transition-all active:scale-95 ${isDayMode ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
 >
 <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
 </button>
 <div className={`px-6 py-3.5 rounded-2xl border flex items-center gap-3 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
 <Clock className="w-4 h-4 text-cyan-500" />
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
 {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long'})}
 </span>
 </div>
 </div>
 </div>

 {/* Primary Stats Row */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: 'TOPLAM KULLANICI', value: stats.totalUsers, icon: Users, color: 'cyan', growth: '+0%', sub: 'Premium Oranı: %' + (stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(0) : 0)},
 { label: 'TOPLAM GELİR', value: '₺' + stats.revenue.toLocaleString(), icon: DollarSign, color: 'emerald', growth: '+0%', sub: 'Bugün: ₺' + (stats.todayRevenue || 0)},
 { label: 'OLUŞTURULAN CV', value: stats.totalCVs, icon: FileText, color: 'purple', growth: (stats.growth || 0) + '%', sub: 'Bugün: ' + (stats.todayCVs || 0)},
 { label: 'DESTEK TALEBİ', value: stats.openTickets, icon: MessageCircle, color: 'amber', growth: '0%', sub: 'Aktif Görüşmeler'}
 ].map((stat, i) => (
 <div key={i} className={`rounded-2xl p-7 border relative group overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>

 <div className="flex items-center justify-between mb-6">
 <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
 <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
 </div>
 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${stat.growth.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
 {stat.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
 {stat.growth}
 </div>
 </div>

 <div className="space-y-1 relative z-10">
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
 <div className={`text-3xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
 <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.sub}</p>
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 {/* Main Chart Area */}
 <div className="lg:col-span-8 space-y-6">
 <div className={`rounded-2xl p-8 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="flex items-center justify-between mb-10">
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-2xl bg-cyan-500/10">
 <TrendingUp className="w-6 h-6 text-cyan-500" />
 </div>
 <div>
 <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>İşlem Trendleri</h3>
 <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Son 6 Aylık CV Oluşturma Dağılımı</p>
 </div>
 </div>
 </div>

 <div className="flex items-end justify-between h-64 gap-3 px-2">
 {stats.monthlyTrends.map((t, i) => (
 <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
 <div className="relative w-full flex justify-center items-end h-full">
 <div
 className="w-full max-w-[40px] rounded-t-2xl bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 group-hover:from-cyan-400 group-hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] relative"
 style={{ height:`${(t.count / (Math.max(...stats.monthlyTrends.map(x => x.count), 10))) * 100}%`}}
 >
 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-xs font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none">
 {t.count}
 </div>
 </div>
 </div>
 <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
 {t.label}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Secondary Row: Templates & Live Activity */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Template Usage */}
 <div className={`rounded-2xl p-8 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 rounded-2xl bg-purple-500/10">
 <Layout className="w-5 h-5 text-purple-500" />
 </div>
 <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Popüler Şablonlar</h3>
 </div>

 <div className="space-y-5">
 {stats.templateUsage.map((t, i) => (
 <div key={i} className="space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-lg">{templateEmojis[t.id] || '📄'}</span>
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>{templateNames[t.id] || t.id.toUpperCase()}</span>
 </div>
 <span className={`text-xs font-semibold tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{t.usage} Kullanım</span>
 </div>
 <div className={`h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
 <div
 className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"
 style={{ width:`${(t.usage / (stats.templateUsage[0]?.usage || 1)) * 100}%`}}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Quick Actions */}
 <div className={`rounded-2xl p-8 border flex flex-col ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 rounded-2xl bg-amber-500/10">
 <Zap className="w-5 h-5 text-amber-500" />
 </div>
 <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Hızlı İşlemler</h3>
 </div>

 <div className="grid grid-cols-2 gap-3 flex-1">
 {[
 { label: 'Duyuru Yayınla', icon: Bell, to: '/admin/announcements', color: 'blue'},
 { label: 'Kupon Tanımla', icon: Crown, to: '/admin/coupons', color: 'amber'},
 { label: 'Kullanıcı Ara', icon: Users, to: '/admin/users', color: 'cyan'},
 { label: 'Sistem Ayarları', icon: Settings2, to: '/admin/settings', color: 'purple'},
 { label: 'Güvenlik Logları', icon: Shield, to: '/admin/security', color: 'red'},
 { label: 'Tema Atölyesi', icon: Palette, to: '/admin/theme', color: 'pink'}
 ].map((action, i) => (
 <Link
 key={i}
 to={action.to}
 className={`flex flex-col items-center justify-center p-4 rounded-[2rem] border transition-all group ${isDayMode ? 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-200' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
 >
 <action.icon className={`w-5 h-5 mb-2 text-${action.color}-500 group-hover:scale-110 transition-transform`} />
 <span className={`text-xs font-semibold uppercase tracking-wider text-center leading-tight ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{action.label}</span>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Activity Feed & Extra Info */}
 <div className="lg:col-span-4 space-y-6">
 {/* Live Activity Feed */}
 <div className={`rounded-2xl p-8 border h-full ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-2xl bg-emerald-500/10">
 <Activity className="w-5 h-5 text-emerald-500" />
 </div>
 <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Son Etkinlikler</h3>
 </div>
 <Link to="/admin/logs" className={`text-xs font-semibold transition-colors uppercase tracking-wider ${isDayMode ? 'text-cyan-600 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'}`}>Tümü</Link>
 </div>

 <div className="space-y-6">
 {logs.length > 0 ? logs.map((log, i) => (
 <div key={i} className="flex gap-4 group">
 <div className="relative flex flex-col items-center">
 <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10 group-hover:bg-white/10'}`}>
 <FileText className="w-4 h-4 text-cyan-500" />
 </div>
 {i !== logs.length - 1 && <div className={`w-0.5 flex-1 my-2 ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}></div>}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-0.5">
 <span className={`text-xs font-semibold uppercase tracking-wider truncate max-w-[150px] ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{log.action}</span>
 <span className={`text-xs font-bold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>{new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit'})}</span>
 </div>
 <div className="flex items-center gap-2">
 <span className={`text-xs px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase ${isDayMode ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-gray-500'}`}>{log.module}</span>
 <span className={`text-xs font-medium truncate ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>{log.adminEmail?.split('@')[0] || 'System'}</span>
 </div>
 </div>
 </div>
 )) : (
 <div className="py-10 text-center">
 <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>Henüz etkinlik bulunmuyor</p>
 </div>
 )}
 </div>

 <button className={`w-full mt-10 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 active:scale-95 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'}`}>
 DAHA FAZLA GÖSTER
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>

 {/* System Guard Board */}
 <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/20 shadow-xl shadow-purple-500/10 relative overflow-hidden">
 <Shield className="w-24 h-24 text-purple-500/10 absolute -bottom-4 -right-4" />
 <div className="relative z-10">
 <div className="flex items-center gap-3 mb-6">
 <div className="p-2.5 rounded-2xl bg-white/10">
 <Shield className="w-5 h-5 text-purple-400" />
 </div>
 <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Sistem Güvenliği</h4>
 </div>
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-purple-200/50 uppercase tracking-wider">SSL SERTIFIKASI</span>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${stats.systemStatus?.ssl ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
 <span className="text-xs font-semibold text-white uppercase">{stats.systemStatus?.ssl ? 'AKTIF' : 'PASIF'}</span>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold text-purple-200/50 uppercase tracking-wider">FIREWALL</span>
 <div className="flex items-center gap-2">
 <div className={`w-2 h-2 rounded-full ${stats.systemStatus?.firewall ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
 <span className="text-xs font-semibold text-white uppercase">{stats.systemStatus?.firewall ? 'KORUMADA' : 'DEVRE DISI'}</span>
 </div>
 </div>
 <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
 <div className={`h-full w-full ${stats.systemStatus?.ssl && stats.systemStatus?.firewall ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-red-500'}`}></div>
 </div>
 <p className="text-xs text-purple-200/40 font-bold uppercase leading-tight mt-4">{stats.systemStatus?.status || 'Sistem durumu bekleniyor...'}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}

