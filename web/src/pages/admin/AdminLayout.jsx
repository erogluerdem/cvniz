import { useState, useEffect} from 'react'
import { Link, useLocation, useNavigate, Outlet} from 'react-router-dom'
import { useAuth} from '../../context/AuthContext'
import { useAdminNotifications} from '../../context/AdminNotificationContext'
import {
 LayoutDashboard, Users, FileText, CreditCard, Package, Tag, Mail, Settings, LogOut,
 Search, Bell, RefreshCw, Activity, Home, Megaphone, FileSpreadsheet, Key, Languages,
 Shield, Zap, Target, FlaskConical, Share2, MessageCircle, Image, Palette, Building2,
 Star, Briefcase, Users2, X, Trash2, ExternalLink, ChevronDown, ChevronRight, TrendingUp, Layout, Moon, Sun,
 Sparkles, Clock, Network, UserCog, HeartHandshake, Link as LinkIcon, Lock, Box, ShieldAlert, Scale, Cloud,
 BookOpen, HelpCircle, Globe, MailOpen, Cpu, Award, Building, MessageSquare
} from 'lucide-react'
import CommandPalette from '../../components/admin/CommandPalette'

const menuGroups = [
 {
 id: 'overview',
 label: 'Genel Bakış',
 icon: <LayoutDashboard className="w-4 h-4" />,
 items: [
 { path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', exact: true},
 { path: '/admin/analytics', icon: <Activity className="w-4 h-4" />, label: 'Analitik'},
 { path: '/admin/live-stats', icon: <Activity className="w-4 h-4" />, label: 'Canlı İstatistik'},
 { path: '/admin/reports', icon: <FileSpreadsheet className="w-4 h-4" />, label: 'Raporlar'},
 { path: '/admin/storage-monitor', icon: <Cloud className="w-4 h-4" />, label: 'Depolama & S3'},
 ]
},
 {
 id: 'users_content',
 label: 'Kullanıcı & İçerik',
 icon: <Users className="w-4 h-4" />,
 items: [
 { path: '/admin/users', icon: <Users className="w-4 h-4" />, label: 'Kullanıcılar'},
 { path: '/admin/cvs', icon: <FileText className="w-4 h-4" />, label: 'CV\'ler'},
 { path: '/admin/cv-reviews', icon: <Star className="w-4 h-4" />, label: 'CV İnceleme'},
 { path: '/admin/blog', icon: <BookOpen className="w-4 h-4" />, label: 'Blog Yönetimi'},
 { path: '/admin/site-content', icon: <Home className="w-4 h-4" />, label: 'Site İçeriği'},
 { path: '/admin/announcements', icon: <Megaphone className="w-4 h-4" />, label: 'Duyurular'},
 { path: '/admin/media', icon: <Image className="w-4 h-4" />, label: 'Medya'},
 { path: '/admin/templates', icon: <Package className="w-4 h-4" />, label: 'Şablonlar'},
 { path: '/admin/roles', icon: <UserCog className="w-4 h-4" />, label: 'Rol Yönetimi'},
 { path: '/admin/career-paths', icon: <Award className="w-4 h-4" />, label: 'Kariyer Yolları'},
 ]
},
 {
 id: 'finance',
 label: 'Finans',
 icon: <CreditCard className="w-4 h-4" />,
 items: [
 { path: '/admin/payments', icon: <CreditCard className="w-4 h-4" />, label: 'Ödemeler'},
 { path: '/admin/coupons', icon: <Tag className="w-4 h-4" />, label: 'Kuponlar'},
 { path: '/admin/payment-gateways', icon: <CreditCard className="w-4 h-4" />, label: 'Sanal POS\'lar'},
 { path: '/admin/subscription-plans', icon: <Box className="w-4 h-4" />, label: 'Abonelik Paketleri'},
 ]
},
 {
 id: 'growth',
 label: 'Pazarlama & Büyüme',
 icon: <TrendingUp className="w-4 h-4" />,
 items: [
 { path: '/admin/campaigns', icon: <Target className="w-4 h-4" />, label: 'Kampanyalar'},
 { path: '/admin/affiliate', icon: <Network className="w-4 h-4" />, label: 'Affiliate & Partner'},
 { path: '/admin/partners', icon: <HeartHandshake className="w-4 h-4" />, label: 'İş Ortakları'},
 { path: '/admin/referrals', icon: <Share2 className="w-4 h-4" />, label: 'Referral Sistemi'},
 { path: '/admin/abtests', icon: <FlaskConical className="w-4 h-4" />, label: 'A/B Testler'},
 { path: '/admin/job-board', icon: <Briefcase className="w-4 h-4" />, label: 'İş İlanları'},
 { path: '/admin/enterprise', icon: <Building className="w-4 h-4" />, label: 'Kurumsal Aboneler'},
 { path: '/admin/enterprise-crm', icon: <Building2 className="w-4 h-4" />, label: 'Kurumsal CRM'},
 ]
},
 {
 id: 'system',
 label: 'Sistem & Destek',
 icon: <Settings className="w-4 h-4" />,
 items: [
 { path: '/admin/emails', icon: <Mail className="w-4 h-4" />, label: 'E-posta'},
 { path: '/admin/email-templates', icon: <MailOpen className="w-4 h-4" />, label: 'E-posta Şablonları'},
 { path: '/admin/sms-providers', icon: <MessageCircle className="w-4 h-4" />, label: 'SMS Sağlayıcıları'},
 { path: '/admin/support', icon: <HelpCircle className="w-4 h-4" />, label: 'Destek Talepleri'},
 { path: '/admin/faq', icon: <MessageSquare className="w-4 h-4" />, label: 'SSS Yönetimi'},
 { path: '/admin/nps-feedback', icon: <HeartHandshake className="w-4 h-4" />, label: 'NPS & Geribildirim'},
 { path: '/admin/security', icon: <Shield className="w-4 h-4" />, label: 'Güvenlik'},
 { path: '/admin/anti-fraud', icon: <ShieldAlert className="w-4 h-4" />, label: 'Anti-Fraud'},
 { path: '/admin/gdpr-compliance', icon: <Scale className="w-4 h-4" />, label: 'KVKK & GDPR'},
 { path: '/admin/seo', icon: <Globe className="w-4 h-4" />, label: 'SEO Ayarları'},
 { path: '/admin/api', icon: <Key className="w-4 h-4" />, label: 'API Yönetimi'},
 { path: '/admin/ai-settings', icon: <Zap className="w-4 h-4" />, label: 'AI Ayarları'},
 { path: '/admin/ai-prompts', icon: <Sparkles className="w-4 h-4" />, label: 'AI Promptleri'},
 { path: '/admin/logs', icon: <Activity className="w-4 h-4" />, label: 'Sistem Logları'},
 { path: '/admin/theme', icon: <Palette className="w-4 h-4" />, label: 'Tema'},
 { path: '/admin/translations', icon: <Languages className="w-4 h-4" />, label: 'Çeviriler'},
 { path: '/admin/settings', icon: <Settings className="w-4 h-4" />, label: 'Ayarlar'},
 { path: '/admin/integrations', icon: <LinkIcon className="w-4 h-4" />, label: 'Entegrasyonlar'},
 { path: '/admin/sessions', icon: <Lock className="w-4 h-4" />, label: 'Aktif Oturumlar'},
 { path: '/admin/cron-jobs', icon: <Clock className="w-4 h-4" />, label: 'Zamanlanmış Görevler'},
 ]
}
]

export default function AdminLayout() {
 const { user, logout} = useAuth()
 const { notifications, unreadCount, markAsRead, clearAll} = useAdminNotifications()
 const location = useLocation()
 const navigate = useNavigate()
 const [searchQuery, setSearchQuery] = useState('')
 const [showNotifications, setShowNotifications] = useState(false)
 const [showCommandPalette, setShowCommandPalette] = useState(false)
 const [isDayMode, setIsDayMode] = useState(() => {
 return window.localStorage.getItem('CVniz-admin-theme') === 'day'
})
 const [openGroups, setOpenGroups] = useState(() => {
 // Initialize with the group that contains active path
 const activeGroup = menuGroups.find(group =>
 group.items.some(item =>
 item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
 )
 )
 return activeGroup ? [activeGroup.id] : ['overview']
})

 useEffect(() => {
 const handleKeyDown = (e) => {
 if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
 e.preventDefault()
 setShowCommandPalette(true)
}
}
 window.addEventListener('keydown', handleKeyDown)
 return () => window.removeEventListener('keydown', handleKeyDown)
}, [])

 const toggleTheme = () => {
 const nextTheme = isDayMode ? 'night' : 'day'
 setIsDayMode(!isDayMode)
 window.localStorage.setItem('CVniz-admin-theme', nextTheme)
 window.dispatchEvent(new CustomEvent('CVniz-theme-change', { detail: nextTheme}))
}

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
 <div className={`min-h-screen flex transition-colors duration-500 ${isDayMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'}`}>
 <CommandPalette 
 isOpen={showCommandPalette} 
 onClose={() => setShowCommandPalette(false)} 
 menuGroups={menuGroups} 
 />
 
 {/* Sidebar */}
 <aside className={`w-72 border-r p-5 flex flex-col fixed h-full z-20 transition-all duration-500 ${isDayMode ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl' : 'bg-[#0B1120]/95 backdrop-blur-2xl border-white/[0.05] shadow-[4px_0_24px_rgba(0,0,0,0.5)]'}`}>
 <Link to="/" className="flex items-center gap-3 mb-8 px-2 group">
 <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300`}>
 <FileText className="w-5 h-5 text-white" />
 </div>
 <div>
 <span className={`text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${isDayMode ? 'from-slate-900 to-slate-700' : 'from-white to-slate-300'}`}>CVniz</span>
 <span className="block text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] mt-0.5">Admin Panel</span>
 </div>
 </Link>

 <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar -mr-2">
 {menuGroups.map(group => {
 const isGroupOpen = openGroups.includes(group.id)
 const isAnyItemActive = group.items.some(item => isActive(item))

 return (
 <div key={group.id} className="space-y-1">
 <button
 onClick={() => toggleGroup(group.id)}
 className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${
 isAnyItemActive
 ? (isDayMode ? 'text-cyan-700 bg-cyan-50 shadow-sm border border-cyan-100' : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20')
 : (isDayMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50' : 'text-slate-400 hover:text-white hover:bg-white/5')
 } ${isGroupOpen && !isAnyItemActive ? (isDayMode ? 'bg-slate-50' : 'bg-white/[0.02]') : ''}`}
 >
 <div className="flex items-center gap-3">
 <div className={`w-5 h-5 flex items-center justify-center transition-colors ${
 isAnyItemActive ? (isDayMode ? 'text-cyan-600' : 'text-cyan-400') : (isDayMode ? 'text-slate-400 group-hover:text-cyan-500' : 'text-slate-500 group-hover:text-cyan-400')
 }`}>
 {group.icon}
 </div>
 <span className={`text-xs font-bold uppercase tracking-[0.1em] text-left transition-colors ${
 isAnyItemActive ? (isDayMode ? 'text-cyan-700' : 'text-cyan-400') : ''
 }`}>
 {group.label}
 </span>
 </div>
 <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isGroupOpen ? 'rotate-180 text-cyan-500' : 'opacity-40'}`} />
 </button>

 <div
 className={`grid transition-all duration-300 ease-in-out ${isGroupOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
 }`}
 >
 <div className={`overflow-hidden pl-5 border-l border-dashed ml-5 space-y-0.5 ${isDayMode ? 'border-slate-300' : 'border-white/10'}`}>
 {group.items.map(item => (
 <Link
 key={item.path}
 to={item.path}
 className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-[13px] group relative ${
 isActive(item)
 ? (isDayMode ? 'bg-white text-cyan-600 font-bold shadow-sm border border-slate-100' : 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]')
 : (isDayMode ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium')
 }`}
 >
 {isActive(item) && (
 <div className="absolute -left-[1.3rem] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
 )}
 <div className={`w-4 h-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
 isActive(item) ? (isDayMode ? 'text-cyan-600' : 'text-cyan-400') : (isDayMode ? 'text-slate-400 group-hover:text-cyan-500' : 'text-slate-500 group-hover:text-cyan-400')
 }`}>
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

 <div className={`mt-6 pt-4 border-t transition-colors ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
 <div className={`flex items-center gap-3 mb-4 p-3 rounded-2xl border transition-colors ${isDayMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
 <Shield className="w-5 h-5 text-white" />
 </div>
 <div className="flex-1 min-w-0">
 <div className={`font-bold text-sm truncate ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{user?.name || 'Admin'}</div>
 <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDayMode ? 'text-cyan-600' : 'text-cyan-400'}`}>Süper Admin</div>
 </div>
 </div>
 <button
 onClick={handleLogout}
 className={`w-full flex items-center justify-center gap-2 py-2.5 transition-all rounded-xl border ${
 isDayMode ? 'text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border-transparent' : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border-transparent'
 }`}
 >
 <LogOut className="w-4 h-4" />
 <span className="text-sm font-semibold">Güvenli Çıkış</span>
 </button>
 </div>
 </aside>

 {/* Main Content */}
 <main className={`flex-1 ml-72 p-8 min-h-screen transition-all duration-500 ${isDayMode ? 'bg-slate-50' : 'bg-[#050B14]'}`}>
 {/* Header */}
 <header className={`flex items-center justify-between mb-8 sticky top-0 z-30 py-3 backdrop-blur-xl -mx-8 px-8 border-b transition-colors duration-500 ${isDayMode ? 'bg-white/80 border-slate-200' : 'bg-[#0B1120]/80 border-white/5'}`}>
 <div>
 <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider mb-1">
 <Home className="w-3 h-3" />
 <span>Admin</span>
 <span>/</span>
 <span className={isDayMode ? 'text-cyan-600' : 'text-cyan-400'}>{currentPage?.label || 'Genel Bakış'}</span>
 </div>
 <h1 className="text-2xl font-bold tracking-tight">{currentPage?.label || 'Dashboard'}</h1>
 </div>

 <div className="flex items-center gap-4">
 <button
 onClick={toggleTheme}
 className={`p-2.5 rounded-xl transition-all duration-300 ${isDayMode 
 ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 border' 
 : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
}`}
 title={isDayMode ? 'Gece Moduna Geç' : 'Gündüz Moduna Geç'}
 >
 {isDayMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
 </button>
 <div className="relative group hidden md:block">
 <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDayMode ? 'text-slate-400 group-focus-within:text-cyan-600' : 'text-gray-500 group-focus-within:text-cyan-400'}`} />
 <div 
 onClick={() => setShowCommandPalette(true)}
 className={`pl-10 pr-4 py-2 border rounded-xl text-sm flex items-center justify-between w-72 transition-all cursor-pointer ${isDayMode ? 'bg-white border-slate-200 text-slate-500 hover:border-cyan-500/50' : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-500/50'}`}
 >
 <span>Hızlı ara...</span>
 <kbd className={`text-xs font-bold px-1.5 py-0.5 rounded border ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>⌘ K</kbd>
 </div>
 </div>

 {/* Notifications */}
 <div className="relative">
 <button
 onClick={() => setShowNotifications(!showNotifications)}
 className={`relative p-2.5 rounded-xl transition-all duration-300 ${showNotifications
 ? (isDayMode ? 'bg-cyan-50 text-cyan-600 ring-2 ring-cyan-200' : 'bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/20')
 : (isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 border' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-white/10')
}`}
 >
 <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce-slow' : ''}`} />
 {unreadCount > 0 && (
 <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs font-bold flex items-center justify-center text-white border-2 border-slate-950">
 {unreadCount > 9 ? '9+' : unreadCount}
 </span>
 )}
 </button>

 {showNotifications && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
 <div className={`absolute right-0 mt-3 w-80 border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
 <div className={`p-4 border-b flex items-center justify-between ${isDayMode ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/5'}`}>
 <div className="flex items-center gap-2">
 <h3 className={`font-bold ${isDayMode ? 'text-slate-900' : ''}`}>Bildirimler</h3>
 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDayMode ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-500/20 text-cyan-400'}`}>
 {unreadCount} Yeni
 </span>
 </div>
 <div className="flex items-center gap-2">
 <button
 onClick={clearAll}
 className={`text-xs uppercase tracking-wider font-bold transition-colors ${isDayMode ? 'text-slate-400 hover:text-red-500' : 'text-gray-500 hover:text-red-400'}`}
 >
 Temizle
 </button>
 <button onClick={() => setShowNotifications(false)}>
 <X className={`w-4 h-4 transition-colors ${isDayMode ? 'text-slate-400 hover:text-slate-700' : 'text-gray-500 hover:text-white'}`} />
 </button>
 </div>
 </div>

 <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
 {notifications.length > 0 ? (
 notifications.map(n => (
 <div
 key={n.id}
 className={`p-4 border-b transition-all group cursor-default ${isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}
 >
 <div className="flex gap-3">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${n.type === 'support' ? (isDayMode ? 'bg-amber-100 text-amber-600' : 'bg-amber-500/20 text-amber-400') :
 n.type === 'payment' ? (isDayMode ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400') :
 (isDayMode ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500/20 text-cyan-400')
}`}>
 {n.type === 'support' ? <MessageCircle className="w-5 h-5" /> :
 n.type === 'payment' ? <CreditCard className="w-5 h-5" /> :
 <Users className="w-5 h-5" />
}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex justify-between items-start gap-2">
 <p className={`text-sm font-semibold truncate ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{n.title}</p>
 <span className="text-xs text-gray-500 font-medium shrink-0">
 {new Date(n.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit'})}
 </span>
 </div>
 <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{n.message}</p>
 <div className="flex items-center gap-4 mt-3">
 <Link
 to={n.link}
 onClick={() => setShowNotifications(false)}
 className={`text-xs font-bold flex items-center gap-1 transition-colors ${isDayMode ? 'text-cyan-600 hover:text-cyan-700' : 'text-cyan-400 hover:text-cyan-300'}`}
 >
 İNCELE <ExternalLink className="w-3 h-3" />
 </Link>
 <button
 onClick={() => markAsRead(n.id)}
 className={`text-xs font-medium transition-colors ${isDayMode ? 'text-slate-400 hover:text-slate-700' : 'text-gray-500 hover:text-white'}`}
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
 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${isDayMode ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
 <Bell className={`w-8 h-8 ${isDayMode ? 'text-slate-300' : 'text-white/10'}`} />
 </div>
 <p className={`text-sm font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Yeni bildirim yok</p>
 <p className={`text-xs mt-1 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>Sisteminiz güncel ve sorunsuz.</p>
 </div>
 )}
 </div>

 <Link
 to="/admin/logs"
 onClick={() => setShowNotifications(false)}
 className={`block p-4 text-center text-xs font-bold transition-all border-t tracking-wider uppercase ${isDayMode ? 'text-cyan-600 hover:text-cyan-700 bg-slate-50 hover:bg-slate-100 border-slate-200' : 'text-cyan-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 border-white/10'}`}
 >
 Tüm Sistem Kayıtlarını Gör
 </Link>
 </div>
 </>
 )}
 </div>

 <div className={`h-8 w-[1px] hidden sm:block ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`}></div>

 <button className={`p-2.5 rounded-xl transition-all hidden sm:flex border ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5 hover:border-white/10'}`}>
 <RefreshCw className="w-5 h-5" />
 </button>
 </div>
 </header>

 {/* Page Content */}
 <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <Outlet context={{ isDayMode}} />
 </div>
 </main>
 </div>
 )
}

