import { useState, useEffect, useCallback } from 'react'
import {
    UserPlus, Crown, Mail, Ban, Unlock, Trash2, Loader2, Edit, X,
    Search, Filter, Shield, Key, FileText, ChevronRight, MoreVertical,
    Activity, Calendar, BadgeCheck, Globe, Smartphone, Laptop,
    CreditCard, ExternalLink, RefreshCw, UserCheck, AlertCircle,
    Download, LogIn, ChevronDown, CheckCircle2, User, Users
} from 'lucide-react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function UsersPage() {
    const { user: currentUser } = useAuth()
    const { toast } = useToast()
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Filters State
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all') // all, premium, banned, admin

    // UI State
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create') // create, edit, details
    const [selectedUser, setSelectedUser] = useState(null)
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'user', isActive: true, isPremium: false
    })
    const [submitting, setSubmitting] = useState(false)
    const [showLogsModal, setShowLogsModal] = useState(false)
    const [userLogs, setUserLogs] = useState([])
    const [loadingLogs, setLoadingLogs] = useState(false)

    useEffect(() => {
        fetchUsers()
        fetchStats()
    }, [])

    const fetchUsers = async (customParams = {}) => {
        setRefreshing(true)
        try {
            const params = {
                search: search || undefined,
                role: activeFilter === 'admin' ? 'admin' : undefined,
                isPremium: activeFilter === 'premium' ? 'true' : undefined,
                isActive: activeFilter === 'banned' ? 'false' : undefined,
                ...customParams
            }
            const res = await userAPI.getUsers(params)
            if (res.success) setUsers(res.users)
        } catch (error) {
            toast.error('Kullanıcılar yüklenemedi')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const fetchStats = async () => {
        try {
            // Stats API logic could be separate or part of users res
            // For now calculating locally but backend has the route
            const premiumCount = users.filter(u => u.isPremium).length
            const bannedCount = users.filter(u => !u.isActive).length
            const adminCount = users.filter(u => u.role === 'admin').length
            setStats({
                total: users.length,
                premium: premiumCount,
                banned: bannedCount,
                admins: adminCount
            })
        } catch (e) { }
    }

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loading) fetchUsers()
        }, 500)
        return () => clearTimeout(timer)
    }, [search, activeFilter])

    const handleOpenCreateModal = () => {
        setModalMode('create')
        setFormData({ name: '', email: '', password: '', role: 'user', isActive: true, isPremium: false })
        setShowModal(true)
    }

    const handleOpenEditModal = (user) => {
        setModalMode('edit')
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            isActive: user.isActive,
            isPremium: user.isPremium
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (modalMode === 'create') {
                const res = await userAPI.createUser(formData)
                if (res.success) {
                    toast.success('Kullanıcı başarıyla oluşturuldu')
                    setShowModal(false)
                    fetchUsers()
                }
            } else {
                const updateData = { ...formData }
                if (!updateData.password) delete updateData.password
                const res = await userAPI.updateUser(selectedUser.id, updateData)
                if (res.success) {
                    toast.success('Kullanıcı güncellendi')
                    setShowModal(false)
                    fetchUsers()
                }
            }
        } catch (error) {
            toast.error(error.message || 'İşlem başarısız')
        } finally {
            setSubmitting(false)
        }
    }

    const handleResetPassword = async (user) => {
        const newPassword = prompt(`${user.name} için yeni şifre girin (en az 6 karakter):`)
        if (!newPassword || newPassword.length < 6) return

        try {
            const res = await userAPI.resetPassword(user.id, newPassword)
            if (res.success) {
                toast.success('Şifre başarıyla güncellendi')
            }
        } catch (error) {
            toast.error('Şifre güncellenemedi')
        }
    }

    const handleViewLogs = async (user) => {
        setSelectedUser(user)
        setShowLogsModal(true)
        setLoadingLogs(true)
        try {
            const res = await userAPI.getLoginLogs(user.id)
            if (res.success) {
                setUserLogs(res.logs)
            }
        } catch (error) {
            toast.error('Giriş kayıtları yüklenemedi')
        } finally {
            setLoadingLogs(false)
        }
    }

    const toggleStatus = async (user, field) => {
        try {
            const updateData = field === 'isPremium'
                ? { isPremium: !user.isPremium }
                : { isActive: !user.isActive }

            const res = await userAPI.updateUser(user.id, updateData)
            if (res.success) {
                toast.success('Durum güncellendi')
                fetchUsers()
            }
        } catch (error) {
            toast.error('Güncelleme hatası')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                    <Users className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Kullanıcı Veritabanı</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic">Kritik veriler çekiliyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 font-primary">
            {/* Header / Stats */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20">
                            <Users className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Ekip & Üyeler</h2>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest pl-1">Toplam {users.length} kullanıcı aktif olarak sistemde</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {[
                        { label: 'Pro', value: stats?.premium, color: 'amber', icon: Crown },
                        { label: 'Admin', value: stats?.admins, color: 'purple', icon: Shield },
                        { label: 'Banned', value: stats?.banned, color: 'red', icon: Ban }
                    ].map((s, i) => (
                        <div key={i} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all cursor-default">
                            <s.icon className={`w-4 h-4 text-${s.color}-400 group-hover:scale-110 transition-transform`} />
                            <div>
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{s.label}</div>
                                <div className="text-sm font-black text-white italic leading-none">{s.value}</div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleOpenCreateModal}
                        className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <UserPlus className="w-4 h-4" />
                        YENİ EKLE
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="glass-card rounded-[2.5rem] p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="İsim, e-posta veya ID ile ara..."
                        className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] pl-16 pr-6 py-4 text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 focus:bg-white/10 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                    {[
                        { id: 'all', label: 'TÜMÜ', icon: Users },
                        { id: 'premium', label: 'PRO', icon: Crown },
                        { id: 'admin', label: 'ADMİN', icon: Shield },
                        { id: 'banned', label: 'BANNED', icon: Ban }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeFilter === tab.id
                                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => fetchUsers()}
                    className={`p-4 rounded-2xl border border-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* User List Table */}
            <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-10 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">KULLANICI PROFİLİ</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">ÜYELİK PLANI</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">İSTATİSTİK</th>
                                <th className="px-6 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">SON AKTİVİTE</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">EYLEMLER</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className={`group hover:bg-cyan-500/[0.03] transition-all ${!u.isActive ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="relative group/avatar cursor-pointer">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-xl transition-transform group-hover/avatar:scale-105 ${u.role === 'admin'
                                                    ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                                                    : u.isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
                                                    }`}>
                                                    {u.name?.[0].toUpperCase()}
                                                </div>
                                                {!u.isActive && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-slate-950 rounded-full flex items-center justify-center">
                                                        <Ban className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                )}
                                                {u.role === 'admin' && (
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 border-2 border-slate-950 rounded-full flex items-center justify-center">
                                                        <Shield className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-white italic truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{u.name}</h4>
                                                    {u.id === currentUser?.id && (
                                                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">SİZ</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-500 text-[10px] font-bold">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-cyan-400/50" /> {u.email}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                                                    <span className="flex items-center gap-1.5 cursor-help" title="Registration Date">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(u.createdAt).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        {u.isPremium ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-amber-400 font-black text-[10px] tracking-widest uppercase italic">
                                                    <Crown className="w-3.5 h-3.5 fill-amber-400/20" /> ULTRA PRO
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1 flex-1 bg-amber-400/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400" style={{ width: '85%' }}></div>
                                                    </div>
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Sınırsız</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500 font-black text-[10px] tracking-widest uppercase">
                                                <User className="w-3.5 h-3.5" /> STANDART
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="text-center group-hover:scale-110 transition-transform">
                                                <div className="text-sm font-black text-white italic mb-0.5">{u.cvCount || 0}</div>
                                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">CV</div>
                                            </div>
                                            <div className="w-px h-8 bg-white/5"></div>
                                            <div className="text-center group-hover:scale-110 transition-transform">
                                                <div className="text-sm font-black text-white italic mb-0.5">0</div>
                                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">LOG</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                                                Paneli Ziyaret Etti
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-600 pl-5 uppercase tracking-tighter italic">
                                                {u.lastLogin ? new Date(u.lastLogin).toLocaleString('tr-TR') : 'Hiç giriş yapmadı'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-end gap-2 pr-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleOpenEditModal(u)}
                                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-xl shadow-transparent hover:shadow-cyan-500/20"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleResetPassword(u)}
                                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all shadow-xl shadow-transparent hover:shadow-purple-500/20"
                                                title="Reset Password"
                                            >
                                                <Key className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleViewLogs(u)}
                                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-transparent hover:shadow-blue-500/20"
                                                title="Login Logs"
                                            >
                                                <Activity className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(u, 'isPremium')}
                                                className={`p-3 rounded-2xl border transition-all ${u.isPremium
                                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-slate-950'
                                                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-400/30'
                                                    }`}
                                                title={u.isPremium ? 'Cancel Premium' : 'Make Premium'}
                                            >
                                                <Crown className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(u, 'isActive')}
                                                className={`p-3 rounded-2xl border transition-all ${!u.isActive
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
                                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950'
                                                    }`}
                                                title={!u.isActive ? 'Unban User' : 'Ban User'}
                                            >
                                                {!u.isActive ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between pb-10">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">
                    Gösterilen: <span className="text-white italic">{users.length} kullanıcı</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-50 cursor-not-allowed">Önceki</button>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs italic shadow-lg shadow-cyan-500/20">1</button>
                        <button className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 hover:bg-white/10 font-black text-xs transition-all">2</button>
                    </div>
                    <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:bg-white/10 transition-all">Sonraki</button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card rounded-[3.5rem] p-10 max-w-xl w-full border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 right-0 p-24 bg-cyan-500/5 blur-3xl rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{modalMode === 'create' ? 'Yeni Personel' : 'Kartı Düzenle'}</h3>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">{modalMode === 'create' ? 'Veritabanına yeni giriş oluşturuluyor' : 'Mevcut veriler revize ediliyor'}</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2">AD SOYAD</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white font-medium"
                                            placeholder="Mehmet Yılmaz"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2">YETKİ SEVİYESİ</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-all text-white font-black text-[10px] uppercase tracking-widest"
                                        >
                                            <option value="user">Standart Kullanıcı</option>
                                            <option value="admin">Sistem Yöneticisi</option>
                                            <option value="enterprise">Kurumsal Hesap</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2">E-POSTA ADRESİ</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-16 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white font-medium italic"
                                            placeholder="ornek@domain.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-2">
                                        {modalMode === 'create' ? 'ERİŞİM ŞİFRESİ' : 'ŞİFRE SIFIRLA (OPSİYONEL)'}
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <input
                                            required={modalMode === 'create'}
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-16 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer" onClick={() => setFormData({ ...formData, isPremium: !formData.isPremium })}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg transition-all ${formData.isPremium ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-800 text-gray-600'}`}>
                                                <Crown className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full p-1 transition-all ${formData.isPremium ? 'bg-amber-500' : 'bg-gray-800'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full transition-all ${formData.isPremium ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg transition-all ${formData.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                                                {formData.isActive ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktif</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full p-1 transition-all ${formData.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 font-black text-xs text-gray-400 uppercase tracking-widest transition-all"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="flex-3 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        {modalMode === 'create' ? 'GİRİŞİ ONAYLA' : 'DEĞİŞİKLİKLERİ KAYDET'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Logs Modal */}
            {
                showLogsModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
                        <div className="glass-card rounded-[3.5rem] p-10 max-w-2xl w-full border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase">{selectedUser?.name} - GİRİŞ KAYITLARI</h3>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Son 50 başarılı giriş denemesi</p>
                                </div>
                                <button
                                    onClick={() => setShowLogsModal(false)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-gray-500 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {loadingLogs ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kayıtlar Sorgulanıyor...</span>
                                    </div>
                                ) : userLogs.length > 0 ? (
                                    <div className="space-y-3">
                                        {userLogs.map((log, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                                        {log.device?.type === 'mobile' ? <Smartphone className="w-4 h-4 text-cyan-400" /> : <Laptop className="w-4 h-4 text-cyan-400" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-black text-white uppercase italic">{log.location?.city || 'Bilinmeyen Şehir'}, {log.location?.country || 'TR'}</div>
                                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{log.ip} • {log.device?.os} {log.device?.browser}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                    {new Date(log.createdAt).toLocaleString('tr-TR')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center">
                                        <Activity className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Henüz bir giriş kaydı bulunamadı.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() => setShowLogsModal(false)}
                                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-black text-xs text-gray-400 uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    KAPAT
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
