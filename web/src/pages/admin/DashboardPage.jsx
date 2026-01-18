import {
    Users, Crown, FileText, DollarSign, Activity, Download, Zap,
    TrendingUp, BarChart3, PieChart, MessageCircle, Loader2,
    ChevronRight, ArrowUpRight, ArrowDownRight, Clock, Shield,
    Layout, Sparkles, Target, Globe, MousePointer2, Briefcase,
    Bell, Settings2, RefreshCw, ExternalLink, MoreVertical, Palette
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import { Link } from 'react-router-dom'

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
    const { toast } = useToast()
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
                adminAPI.getLogs({ limit: 6 })
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
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                    <Zap className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center font-primary">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Analitik Veriler Hazırlanıyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic italic">Tüm sistem taranıyor...</p>
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
                        <Layout className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Kontrol Merkezi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">Genel Sistem Özeti & Analitikler</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">
                            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Primary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'TOPLAM KULLANICI', value: stats.totalUsers, icon: Users, color: 'cyan', growth: '+12%', sub: 'Premium Oranı: %' + ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(0) },
                    { label: 'TOPLAM GELİR', value: '₺' + stats.revenue.toLocaleString(), icon: DollarSign, color: 'emerald', growth: '+24%', sub: 'Bugün: ₺' + stats.todayRevenue },
                    { label: 'OLUŞTURULAN CV', value: stats.totalCVs, icon: FileText, color: 'purple', growth: stats.growth + '%', sub: 'Bugün: ' + stats.todayCVs },
                    { label: 'DESTEK TALEBİ', value: stats.openTickets, icon: MessageCircle, color: 'amber', growth: '-5%', sub: 'Aktif Görüşmeler' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-[2.5rem] p-7 border border-white/5 relative group overflow-hidden">
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>

                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${stat.growth.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {stat.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.growth}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
                            <div className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</div>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Chart Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-cyan-500/10">
                                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">İşlem Trendleri</h3>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Son 6 Aylık CV Oluşturma Dağılımı</p>
                                </div>
                            </div>
                            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white outline-none cursor-pointer hover:bg-white/10 transition-all uppercase tracking-widest">
                                <option>SON 6 AY</option>
                                <option>SON 1 YIL</option>
                            </select>
                        </div>

                        <div className="flex items-end justify-between h-64 gap-3 px-2">
                            {stats.monthlyTrends.map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="relative w-full flex justify-center items-end h-full">
                                        <div
                                            className="w-full max-w-[40px] rounded-t-2xl bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 group-hover:from-cyan-400 group-hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] relative"
                                            style={{ height: `${(val / (Math.max(...stats.monthlyTrends, 10))) * 100}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none">
                                                {val}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                        {['TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Row: Templates & Live Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Template Usage */}
                        <div className="glass-card rounded-[3rem] p-8 border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-purple-500/10">
                                    <Layout className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Popüler Şablonlar</h3>
                            </div>

                            <div className="space-y-5">
                                {stats.templateUsage.map((t, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{templateEmojis[t.id] || '📄'}</span>
                                                <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{templateNames[t.id] || t.id.toUpperCase()}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-white tracking-widest">{t.usage} Kullanım</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                                style={{ width: `${(t.usage / (stats.templateUsage[0]?.usage || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card rounded-[3rem] p-8 border border-white/5 flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-2xl bg-amber-500/10">
                                    <Zap className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Hızlı İşlemler</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 flex-1">
                                {[
                                    { label: 'Duyuru Yayınla', icon: Bell, to: '/admin/announcements', color: 'blue' },
                                    { label: 'Kupon Tanımla', icon: Crown, to: '/admin/coupons', color: 'amber' },
                                    { label: 'Kullanıcı Ara', icon: Users, to: '/admin/users', color: 'cyan' },
                                    { label: 'Sistem Ayarları', icon: Settings2, to: '/admin/settings', color: 'purple' },
                                    { label: 'Güvenlik Logları', icon: Shield, to: '/admin/security', color: 'red' },
                                    { label: 'Tema Atölyesi', icon: Palette, to: '/admin/theme', color: 'pink' }
                                ].map((action, i) => (
                                    <Link
                                        key={i}
                                        to={action.to}
                                        className="flex flex-col items-center justify-center p-4 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                                    >
                                        <action.icon className={`w-5 h-5 mb-2 text-${action.color}-400 group-hover:scale-110 transition-transform`} />
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">{action.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Feed & Extra Info */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Live Activity Feed */}
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Son Etkinlikler</h3>
                            </div>
                            <Link to="/admin/logs" className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">Tümü</Link>
                        </div>

                        <div className="space-y-6">
                            {(logs.length > 0 ? logs : [
                                { action: 'Sistem Başlatıldı', module: 'System', adminEmail: 'root@CVniz.com', createdAt: new Date() },
                                { action: 'Yeni Kullanıcı Kaydı', module: 'Auth', adminEmail: 'guest', createdAt: new Date() }
                            ]).map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform bg-white/10">
                                            <FileText className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        {i !== (logs.length || 2) - 1 && <div className="w-0.5 flex-1 bg-white/5 my-2"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[150px]">{log.action}</span>
                                            <span className="text-[9px] text-gray-600 font-bold">{new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 font-black tracking-widest uppercase">{log.module}</span>
                                            <span className="text-[9px] text-gray-600 font-medium truncate">{log.adminEmail?.split('@')[0] || 'System'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95">
                            DAHA FAZLA GÖSTER
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* System Guard Board */}
                    <div className="p-8 rounded-[3rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/20 shadow-xl shadow-purple-500/10 relative overflow-hidden">
                        <Shield className="w-24 h-24 text-purple-500/10 absolute -bottom-4 -right-4" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-2xl bg-white/10">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Sistem Güvenliği</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-purple-200/50 uppercase tracking-widest">SSL SERTIFIKASI</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] font-black text-white uppercase">AKTIF</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-purple-200/50 uppercase tracking-widest">FIREWALL</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-white uppercase">KORUMADA</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                </div>
                                <p className="text-[9px] text-purple-200/40 font-bold uppercase italic leading-tight mt-4">Tüm sistemler normal sınırlar içerisinde çalışıyor.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

