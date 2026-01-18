import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdminNotifications } from '../../context/AdminNotificationContext'
import {
    LayoutDashboard, Users, FileText, CreditCard, Package, Tag, Mail, Settings, LogOut,
    Search, Bell, RefreshCw, Activity, Home, Megaphone, FileSpreadsheet, Key, Languages,
    Shield, Zap, Target, FlaskConical, Share2, MessageCircle, Image, Palette, Building2,
    Star, Briefcase, Users2, X, Trash2, ExternalLink, ChevronDown, ChevronRight, TrendingUp, Layout
} from 'lucide-react'

const menuGroups = [
    {
        id: 'overview',
        label: 'Genel Bakış',
        icon: <LayoutDashboard className="w-4 h-4" />,
        items: [
            { path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', exact: true },
            { path: '/admin/analytics', icon: <Activity className="w-4 h-4" />, label: 'Analitik' },
            { path: '/admin/live-stats', icon: <Activity className="w-4 h-4" />, label: 'Canlı İstatistik' },
            { path: '/admin/reports', icon: <FileSpreadsheet className="w-4 h-4" />, label: 'Raporlar' },
        ]
    },
    {
        id: 'users_content',
        label: 'Kullanıcı & İçerik',
        icon: <Users className="w-4 h-4" />,
        items: [
            { path: '/admin/users', icon: <Users className="w-4 h-4" />, label: 'Kullanıcılar' },
            { path: '/admin/cvs', icon: <FileText className="w-4 h-4" />, label: 'CV\'ler' },
            { path: '/admin/cv-reviews', icon: <Star className="w-4 h-4" />, label: 'CV İnceleme' },
            { path: '/admin/announcements', icon: <Megaphone className="w-4 h-4" />, label: 'Duyurular' },
            { path: '/admin/site-content', icon: <Home className="w-4 h-4" />, label: 'Site İçeriği' },
            { path: '/admin/media', icon: <Image className="w-4 h-4" />, label: 'Medya' },
            { path: '/admin/templates', icon: <Package className="w-4 h-4" />, label: 'Şablonlar' },
        ]
    },
    {
        id: 'finance',
        label: 'Finans',
        icon: <CreditCard className="w-4 h-4" />,
        items: [
            { path: '/admin/payments', icon: <CreditCard className="w-4 h-4" />, label: 'Ödemeler' },
            { path: '/admin/coupons', icon: <Tag className="w-4 h-4" />, label: 'Kuponlar' },
        ]
    },
    {
        id: 'growth',
        label: 'Pazarlama & Büyüme',
        icon: <TrendingUp className="w-4 h-4" />,
        items: [
            { path: '/admin/referrals', icon: <Share2 className="w-4 h-4" />, label: 'Referral' },
            { path: '/admin/campaigns', icon: <Target className="w-4 h-4" />, label: 'Kampanyalar' },
            { path: '/admin/abtests', icon: <FlaskConical className="w-4 h-4" />, label: 'A/B Testler' },
            { path: '/admin/job-board', icon: <Briefcase className="w-4 h-4" />, label: 'İş İlanları' },
            { path: '/admin/partners', icon: <Users2 className="w-4 h-4" />, label: 'Partnerler' },
            { path: '/admin/enterprise', icon: <Building2 className="w-4 h-4" />, label: 'Kurumsal' },
        ]
    },
    {
        id: 'system',
        label: 'Sistem & Destek',
        icon: <Settings className="w-4 h-4" />,
        items: [
            { path: '/admin/emails', icon: <Mail className="w-4 h-4" />, label: 'E-posta' },
            { path: '/admin/support', icon: <MessageCircle className="w-4 h-4" />, label: 'Destek Talepleri' },
            { path: '/admin/security', icon: <Shield className="w-4 h-4" />, label: 'Güvenlik' },
            { path: '/admin/api', icon: <Key className="w-4 h-4" />, label: 'API Yönetimi' },
            { path: '/admin/ai-settings', icon: <Zap className="w-4 h-4" />, label: 'AI Ayarları' },
            { path: '/admin/logs', icon: <Activity className="w-4 h-4" />, label: 'Sistem Logları' },
            { path: '/admin/theme', icon: <Palette className="w-4 h-4" />, label: 'Tema' },
            { path: '/admin/translations', icon: <Languages className="w-4 h-4" />, label: 'Çeviriler' },
            { path: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Ayarlar' },
        ]
    }
]

export default function AdminLayout() {
    const { user, logout } = useAuth()
    const { notifications, unreadCount, markAsRead, clearAll } = useAdminNotifications()
    const location = useLocation()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [showNotifications, setShowNotifications] = useState(false)
    const [openGroups, setOpenGroups] = useState(() => {
        // Initialize with the group that contains active path
        const activeGroup = menuGroups.find(group =>
            group.items.some(item =>
                item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
            )
        )
        return activeGroup ? [activeGroup.id] : ['overview']
    })

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path
        }
        return location.pathname.startsWith(item.path)
    }

    const toggleGroup = (groupId) => {
        setOpenGroups(prev =>
            prev.includes(groupId) ? [] : [groupId]
        )
    }

    const currentPage = menuGroups.flatMap(g => g.items).find(item => isActive(item))

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/5 border-r border-white/10 p-4 flex flex-col fixed h-full shadow-2xl z-20">
                <Link to="/" className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                        <span className="text-xl font-bold gradient-text">CVniz</span>
                        <span className="block text-[10px] text-red-400 font-semibold uppercase tracking-widest">Admin Panel</span>
                    </div>
                </Link>

                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                    {menuGroups.map(group => {
                        const isGroupOpen = openGroups.includes(group.id)
                        const isAnyItemActive = group.items.some(item => isActive(item))

                        return (
                            <div key={group.id} className="space-y-1">
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${isAnyItemActive
                                        ? 'text-cyan-400 bg-cyan-500/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        } ${isGroupOpen ? 'bg-white/5' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 flex items-center justify-center transition-colors ${isAnyItemActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {group.icon}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] text-left transition-colors ${isAnyItemActive ? 'text-cyan-400' : ''}`}>
                                            {group.label}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-3 h-3 opacity-30 transition-transform duration-300 ${isGroupOpen ? 'rotate-180 opacity-60' : ''}`} />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isGroupOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                >
                                    <div className="overflow-hidden pl-4 border-l-2 border-white/5 ml-[1.35rem] space-y-1">
                                        {group.items.map(item => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[13px] group relative ${isActive(item)
                                                    ? 'bg-cyan-500/20 text-cyan-400 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                {isActive(item) && (
                                                    <div className="absolute left-0 w-1 h-3 bg-cyan-500 rounded-full" />
                                                )}
                                                <div className={`w-4 h-4 flex items-center justify-center ${isActive(item) ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-300'}`}>
                                                    {item.icon}
                                                </div>
                                                <span className="truncate">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </nav>

                <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-sm text-white">{user?.name || 'Admin'}</div>
                            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Süper Admin</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-400 hover:text-white transition-all rounded-xl hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Güvenli Çıkış</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6 min-h-screen bg-slate-950/50">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 sticky top-0 z-30 py-2 bg-slate-950/80 backdrop-blur-md -mx-6 px-6 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-1">
                            <Home className="w-3 h-3" />
                            <span>Admin</span>
                            <span>/</span>
                            <span className="text-cyan-400">{currentPage?.label || 'Genel Bakış'}</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">{currentPage?.label || 'Dashboard'}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Hızlı ara..."
                                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 w-72 transition-all"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2.5 rounded-xl transition-all duration-300 ${showNotifications
                                    ? 'bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/20'
                                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce-slow' : ''}`} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center text-white border-2 border-slate-950">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                    <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">Bildirimler</h3>
                                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                                                    {unreadCount} Yeni
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={clearAll}
                                                    className="text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-widest font-bold transition-colors"
                                                >
                                                    Temizle
                                                </button>
                                                <button onClick={() => setShowNotifications(false)}>
                                                    <X className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        className="p-4 border-b border-white/5 hover:bg-white/5 transition-all group cursor-default"
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${n.type === 'support' ? 'bg-amber-500/20 text-amber-400' :
                                                                n.type === 'payment' ? 'bg-green-500/20 text-green-400' :
                                                                    'bg-cyan-500/20 text-cyan-400'
                                                                }`}>
                                                                {n.type === 'support' ? <MessageCircle className="w-5 h-5" /> :
                                                                    n.type === 'payment' ? <CreditCard className="w-5 h-5" /> :
                                                                        <Users className="w-5 h-5" />
                                                                }
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start gap-2">
                                                                    <p className="text-sm font-semibold truncate text-white">{n.title}</p>
                                                                    <span className="text-[10px] text-gray-500 font-medium shrink-0">
                                                                        {new Date(n.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">{n.message}</p>
                                                                <div className="flex items-center gap-4 mt-3">
                                                                    <Link
                                                                        to={n.link}
                                                                        onClick={() => setShowNotifications(false)}
                                                                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                                                                    >
                                                                        İNCELE <ExternalLink className="w-3 h-3" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => markAsRead(n.id)}
                                                                        className="text-[10px] text-gray-500 hover:text-white font-medium transition-colors"
                                                                    >
                                                                        Okundu İşaretle
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-12 text-center">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                                        <Bell className="w-8 h-8 text-white/10" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-400">Yeni bildirim yok</p>
                                                    <p className="text-xs text-gray-600 mt-1">Sisteminiz güncel ve sorunsuz.</p>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            to="/admin/logs"
                                            onClick={() => setShowNotifications(false)}
                                            className="block p-4 text-center text-xs text-cyan-400 hover:text-cyan-300 font-bold bg-white/5 hover:bg-white/10 transition-all border-t border-white/10 tracking-widest uppercase"
                                        >
                                            Tüm Sistem Kayıtlarını Gör
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/10 transition-all hidden sm:flex">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

