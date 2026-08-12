import { useState, useEffect, useCallback} from 'react'
import {
 UserPlus, Crown, Mail, Ban, Unlock, Trash2, Loader2, Edit, X,
 Search, Filter, Shield, Key, FileText, ChevronRight, MoreVertical,
 Activity, Calendar, BadgeCheck, Globe, Smartphone, Laptop,
 CreditCard, ExternalLink, RefreshCw, UserCheck, AlertCircle,
 Download, LogIn, ChevronDown, CheckCircle2, User, Users
} from 'lucide-react'
import { userAPI} from '../../services/api'
import { useAuth} from '../../context/AuthContext'
import { useToast} from '../../context/ToastContext'
import { useOutletContext} from 'react-router-dom'

export default function UsersPage() {
 const { user: currentUser} = useAuth()
 const { toast} = useToast()
 const { isDayMode} = useOutletContext() || { isDayMode: false}
 const [users, setUsers] = useState([])
 const [selectedUsers, setSelectedUsers] = useState([])
 const [stats, setStats] = useState(null)
 const [loading, setLoading] = useState(true)
 const [refreshing, setRefreshing] = useState(false)
 const [page, setPage] = useState(1)
 const [totalUsers, setTotalUsers] = useState(0)
 const limit = 20

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
}, [])

 useEffect(() => {
 fetchStats()
}, [users])

 const fetchUsers = async (customParams = {}) => {
 setRefreshing(true)
 try {
 const params = {
 search: search || undefined,
 role: activeFilter === 'admin' ? 'admin' : undefined,
 isPremium: activeFilter === 'premium' ? 'true' : undefined,
 isActive: activeFilter === 'banned' ? 'false' : undefined,
 page,
 limit,
 ...customParams
}
 const res = await userAPI.getUsers(params)
 if (res.success) {
 setUsers(res.users)
 setTotalUsers(res.total || 0)
 if (res.page) setPage(res.page)
}
} catch (error) {
 toast.error('Kullanıcılar yüklenemedi')
} finally {
 setLoading(false)
 setRefreshing(false)
}
}

 const fetchStats = async () => {
 try {
 const premiumCount = users.filter(u => u.isPremium).length
 const bannedCount = users.filter(u => !u.isActive).length
 const adminCount = users.filter(u => u.role === 'admin').length
 setStats({
 total: users.length,
 premium: premiumCount,
 banned: bannedCount,
 admins: adminCount
})
} catch (e) {}
}

 // Debounced search
 useEffect(() => {
 const timer = setTimeout(() => {
 if (!loading) {
 if (page !== 1) {
 setPage(1) // Reset to page 1 on search or filter
} else {
 fetchUsers()
}
}
}, 500)
 return () => clearTimeout(timer)
}, [search, activeFilter])

 useEffect(() => {
 if (!loading) fetchUsers()
}, [page])

 const handleOpenCreateModal = () => {
 setModalMode('create')
 setFormData({ name: '', email: '', password: '', role: 'user', isActive: true, isPremium: false})
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
 const updateData = { ...formData}
 if (!updateData.password) delete updateData.password
 const res = await userAPI.updateUser(selectedUser.id || selectedUser._id, updateData)
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
 const res = await userAPI.resetPassword(user.id || user._id, newPassword)
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
 const res = await userAPI.getLoginLogs(user.id || user._id)
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
 ? { isPremium: !user.isPremium}
 : { isActive: !user.isActive}

 const res = await userAPI.updateUser(user.id || user._id, updateData)
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
 <div className={`w-24 h-24 rounded-full border-4 border-t-cyan-500 animate-spin ${isDayMode ? 'border-cyan-100' : 'border-cyan-500/10'}`}></div>
 <Users className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className={`font-semibold uppercase tracking-wider text-xs mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Kullanıcı Veritabanı</h3>
 <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Kritik veriler çekiliyor...</p>
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
 <Users className="w-6 h-6 text-cyan-500" />
 </div>
 <h2 className={`text-3xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Ekip & Üyeler</h2>
 </div>
 <p className={`text-xs font-bold uppercase tracking-wider pl-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Toplam {totalUsers} kullanıcı aktif olarak sistemde</p>
 </div>

 <div className="flex flex-wrap gap-4">
 {[
 { label: 'Pro', value: stats?.premium, color: 'amber', icon: Crown},
 { label: 'Admin', value: stats?.admins, color: 'purple', icon: Shield},
 { label: 'Banned', value: stats?.banned, color: 'red', icon: Ban}
 ].map((s, i) => (
 <div key={i} className={`px-6 py-3 rounded-2xl border flex items-center gap-4 group transition-all cursor-default ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
 <s.icon className={`w-4 h-4 ${s.color === 'amber' ? 'text-amber-500' : s.color === 'purple' ? 'text-purple-500' : 'text-red-500'} group-hover:scale-110 transition-transform`} />
 <div>
 <div className={`text-xs font-semibold uppercase tracking-wider leading-none mb-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{s.label}</div>
 <div className={`text-sm font-semibold leading-none ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{s.value}</div>
 </div>
 </div>
 ))}
 <button
 onClick={handleOpenCreateModal}
 className="px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-semibold text-xs uppercase tracking-wider shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
 >
 <UserPlus className="w-4 h-4" />
 YENİ EKLE
 </button>
 </div>
 </div>

 {/* Filter & Search Bar */}
 <div className={`rounded-2xl p-6 border flex flex-col md:flex-row items-center gap-6 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="relative flex-1 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="İsim, e-posta veya ID ile ara..."
 className={`w-full rounded-[1.5rem] pl-16 pr-6 py-4 text-sm font-medium focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500/30' : 'bg-white/5 border border-white/5 text-white placeholder-gray-600 focus:border-cyan-500/30 focus:bg-white/10'}`}
 />
 </div>

 <div className={`flex items-center gap-2 p-1.5 rounded-[1.5rem] border overflow-x-auto no-scrollbar max-w-full ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
 {[
 { id: 'all', label: 'TÜMÜ', icon: Users},
 { id: 'premium', label: 'PRO', icon: Crown},
 { id: 'admin', label: 'ADMİN', icon: Shield},
 { id: 'banned', label: 'BANNED', icon: Ban}
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveFilter(tab.id)}
 className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-semibold tracking-wider transition-all whitespace-nowrap ${activeFilter === tab.id
 ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
 : (isDayMode ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-500 hover:text-white hover:bg-white/5')
}`}
 >
 <tab.icon className="w-3.5 h-3.5" />
 {tab.label}
 </button>
 ))}
 </div>

 <button
 onClick={() => fetchUsers()}
 className={`p-4 rounded-2xl border transition-all ${refreshing ? 'animate-spin' : ''} ${isDayMode ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' : 'border-white/5 hover:bg-white/10 text-gray-500 hover:text-white'}`}
 >
 <RefreshCw className="w-5 h-5" />
 </button>
 </div>

 {/* Bulk Action Bar */}
 {selectedUsers.length > 0 && (
 <div className={`p-4 rounded-2xl border flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${isDayMode ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
 <div className="flex items-center gap-3">
 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isDayMode ? 'bg-indigo-200 text-indigo-700' : 'bg-indigo-500/30 text-indigo-300'}`}>{selectedUsers.length}</span>
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-indigo-900' : 'text-indigo-400'}`}>Kullanıcı Seçildi</span>
 </div>
 <div className="flex items-center gap-2">
 <button onClick={() => setSelectedUsers([])} className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${isDayMode ? 'text-slate-500 hover:bg-slate-200' : 'text-gray-400 hover:bg-white/10'}`}>İptal</button>
 <button onClick={() => {
 Promise.all(selectedUsers.map(id => userAPI.updateUser(id, { isActive: false}))).then(() => { toast.success('Seçili kullanıcılar banlandı'); setSelectedUsers([]); fetchUsers();})
}} className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${isDayMode ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'}`}><Ban className="w-3 h-3" /> Toplu Banla</button>
 <button onClick={() => {
 Promise.all(selectedUsers.map(id => userAPI.updateUser(id, { isActive: true}))).then(() => { toast.success('Seçili kullanıcıların banı açıldı'); setSelectedUsers([]); fetchUsers();})
}} className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${isDayMode ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}><Unlock className="w-3 h-3" /> Toplu Ban Aç</button>
 </div>
 </div>
 )}

 {/* User List Table */}
 <div className={`rounded-2xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[1000px]">
 <thead>
 <tr className={`${isDayMode ? 'bg-slate-50 border-b border-slate-200' : 'bg-white/5 border-b border-white/5'}`}>
 <th className="px-6 py-6 w-10 text-center">
 <input 
 type="checkbox" 
 className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
 checked={users.length > 0 && selectedUsers.length === users.length}
 onChange={(e) => setSelectedUsers(e.target.checked ? users.map(u => u.id || u._id) : [])}
 />
 </th>
 <th className={`px-4 py-6 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KULLANICI PROFİLİ</th>
 <th className={`px-6 py-6 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>ÜYELİK PLANI</th>
 <th className={`px-6 py-6 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İSTATİSTİK</th>
 <th className={`px-6 py-6 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>SON AKTİVİTE</th>
 <th className={`px-10 py-6 text-right text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>EYLEMLER</th>
 </tr>
 </thead>
 <tbody className={`divide-y ${isDayMode ? 'divide-slate-100' : 'divide-white/5'}`}>
 {users.map((u) => (
 <tr key={u.id || u._id} className={`group transition-all ${!u.isActive ? 'opacity-50 grayscale-[0.5]' : ''} ${selectedUsers.includes(u.id || u._id) ? (isDayMode ? 'bg-cyan-50' : 'bg-cyan-500/10') : (isDayMode ? 'hover:bg-slate-50' : 'hover:bg-cyan-500/[0.03]')}`}>
 <td className="px-6 py-8 text-center">
 <input 
 type="checkbox" 
 className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
 checked={selectedUsers.includes(u.id || u._id)}
 onChange={(e) => {
 if (e.target.checked) setSelectedUsers([...selectedUsers, u.id || u._id])
 else setSelectedUsers(selectedUsers.filter(id => id !== (u.id || u._id)))
}}
 />
 </td>
 <td className="px-4 py-8">
 <div className="flex items-center gap-5">
 <div className="relative group/avatar cursor-pointer">
 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-semibold shadow-xl transition-transform group-hover/avatar:scale-105 ${u.role === 'admin'
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
 <h4 className={`font-semibold truncate transition-colors uppercase tracking-tight ${isDayMode ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>{u.name}</h4>
 {(u.id === currentUser?.id || u._id === currentUser?._id) && (
 <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">SİZ</span>
 )}
 </div>
 <div className="flex items-center gap-3 text-gray-500 text-xs font-bold">
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
 <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
 <Crown className="w-3.5 h-3.5 fill-amber-400/20" /> ULTRA PRO
 </div>
 <div className="flex items-center gap-1.5">
 <div className="h-1 flex-1 bg-amber-400/10 rounded-full overflow-hidden">
 <div className="h-full bg-amber-400" style={{ width: '85%'}}></div>
 </div>
 <span className="text-xs text-gray-500 font-bold uppercase">Sınırsız</span>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-2 text-gray-500 font-semibold text-xs tracking-wider uppercase">
 <User className="w-3.5 h-3.5" /> STANDART
 </div>
 )}
 </td>
 <td className="px-6 py-8">
 <div className="flex items-center gap-5">
 <div className="text-center group-hover:scale-110 transition-transform">
 <div className={`text-sm font-semibold mb-0.5 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{u.cvCount || 0}</div>
 <div className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>CV</div>
 </div>
 <div className={`w-px h-8 ${isDayMode ? 'bg-slate-200' : 'bg-white/5'}`}></div>
 <div className="text-center group-hover:scale-110 transition-transform">
 <div className={`text-sm font-semibold mb-0.5 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{u.logCount || 0}</div>
 <div className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>LOG</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-8">
 <div className="space-y-1.5">
 <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
 <Activity className={`w-3.5 h-3.5 ${isDayMode ? 'text-cyan-500' : 'text-cyan-400'}`} />
 Paneli Ziyaret Etti
 </div>
 <div className={`text-xs font-bold pl-5 uppercase ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>
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
 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-4">
 Gösterilen: <span className="text-white">{users.length} kullanıcı</span> / Toplam {totalUsers}
 </div>
 {totalUsers > limit && (
 <div className="flex items-center gap-3">
 <button
 onClick={() => setPage(p => Math.max(1, p - 1))}
 disabled={page === 1}
 className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
 >
 Önceki
 </button>
 <div className="flex items-center gap-2">
 {Array.from({ length: Math.ceil(totalUsers / limit) }, (_, i) => i + 1).map((p) => (
 <button
 key={p}
 onClick={() => setPage(p)}
 className={`w-10 h-10 rounded-xl font-semibold text-xs transition-all ${
 page === p
 ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
 : 'bg-white/5 text-gray-500 hover:bg-white/10'
}`}
 >
 {p}
 </button>
 ))}
 </div>
 <button
 onClick={() => setPage(p => p + 1)}
 disabled={page >= Math.ceil(totalUsers / limit)}
 className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
 >
 Sonraki
 </button>
 </div>
 )}
 </div>

 {/* Modal */}
 {showModal && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
 <div className={`rounded-[3.5rem] p-10 max-w-xl w-full border shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-in ${isDayMode ? 'bg-white border-slate-200' : 'glass-card border-white/10'}`}>
 <div className="absolute top-0 right-0 p-24 bg-cyan-500/5 blur-3xl rounded-full"></div>

 <div className="relative z-10">
 <div className="flex items-center justify-between mb-10">
 <div className="space-y-1">
 <h3 className={`text-3xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{modalMode === 'create' ? 'Yeni Personel' : 'Kartı Düzenle'}</h3>
 <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{modalMode === 'create' ? 'Veritabanına yeni giriş oluşturuluyor' : 'Mevcut veriler revize ediliyor'}</p>
 </div>
 <button
 onClick={() => setShowModal(false)}
 className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
 >
 <X className="w-6 h-6" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className={`text-xs font-semibold uppercase tracking-wider pl-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>AD SOYAD</label>
 <input
 required
 type="text"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value})}
 className={`w-full px-6 py-4 border rounded-2xl focus:outline-none transition-all font-medium ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500' : 'bg-white/5 border-white/5 text-white focus:border-cyan-500/50 focus:bg-white/10'}`}
 placeholder="Mehmet Yılmaz"
 />
 </div>
 <div className="space-y-2">
 <label className={`text-xs font-semibold uppercase tracking-wider pl-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>YETKİ SEVİYESİ</label>
 <select
 value={formData.role}
 onChange={(e) => setFormData({ ...formData, role: e.target.value})}
 className={`w-full px-6 py-4 border rounded-2xl focus:outline-none transition-all font-semibold text-xs uppercase tracking-wider ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500' : 'bg-[#0a0a0a] border-white/5 text-white focus:border-cyan-500/50'}`}
 >
 <option value="user">Standart Kullanıcı</option>
 <option value="admin">Sistem Yöneticisi</option>
 <option value="enterprise">Kurumsal Hesap</option>
 </select>
 </div>
 </div>

 <div className="space-y-2">
 <label className={`text-xs font-semibold uppercase tracking-wider pl-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>E-POSTA ADRESİ</label>
 <div className="relative">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
 <input
 required
 type="email"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value})}
 className={`w-full pl-16 pr-6 py-4 border rounded-2xl focus:outline-none transition-all font-medium ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500' : 'bg-white/5 border-white/5 text-white focus:border-cyan-500/50 focus:bg-white/10'}`}
 placeholder="ornek@domain.com"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className={`text-xs font-semibold uppercase tracking-wider pl-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
 {modalMode === 'create' ? 'ERİŞİM ŞİFRESİ' : 'ŞİFRE SIFIRLA (OPSİYONEL)'}
 </label>
 <div className="relative">
 <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
 <input
 required={modalMode === 'create'}
 type="password"
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value})}
 className={`w-full pl-16 pr-6 py-4 border rounded-2xl focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500' : 'bg-white/5 border-white/5 text-white focus:border-cyan-500/50 focus:bg-white/10'}`}
 placeholder="••••••••"
 />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6 pt-4">
 <div className={`p-4 rounded-[1.5rem] border flex items-center justify-between group cursor-pointer ${isDayMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/5 border-white/5'}`} onClick={() => setFormData({ ...formData, isPremium: !formData.isPremium})}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-lg transition-all ${formData.isPremium ? 'bg-amber-500/20 text-amber-500' : (isDayMode ? 'bg-slate-200 text-slate-500' : 'bg-gray-800 text-gray-600')}`}>
 <Crown className="w-4 h-4" />
 </div>
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Premium</span>
 </div>
 <div className={`w-10 h-5 rounded-full p-1 transition-all ${formData.isPremium ? 'bg-amber-500' : (isDayMode ? 'bg-slate-300' : 'bg-gray-800')}`}>
 <div className={`w-3 h-3 bg-white rounded-full transition-all ${formData.isPremium ? 'translate-x-5' : 'translate-x-0'}`}></div>
 </div>
 </div>
 <div className={`p-4 rounded-[1.5rem] border flex items-center justify-between group cursor-pointer ${isDayMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/5 border-white/5'}`} onClick={() => setFormData({ ...formData, isActive: !formData.isActive})}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-lg transition-all ${formData.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
 {formData.isActive ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
 </div>
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Aktif</span>
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
 className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100' : 'border-white/10 hover:bg-white/5 text-gray-400'}`}
 >
 İptal
 </button>
 <button
 disabled={submitting}
 type="submit"
 className="flex-3 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-xs uppercase tracking-wider shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
 >
 {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
 {modalMode === 'create' ? 'GİRİŞİ ONAYLA' : 'DEĞİŞİKLİKLERİ KAYDET'}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 )}

 {/* Logs Modal */}
 {showLogsModal && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
 <div className={`rounded-[3.5rem] p-10 max-w-2xl w-full border shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-in ${isDayMode ? 'bg-white border-slate-200' : 'glass-card border-white/10'}`}>
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className={`text-2xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedUser?.name} - GİRİŞ KAYITLARI</h3>
 <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Son 50 başarılı giriş denemesi</p>
 </div>
 <button
 onClick={() => setShowLogsModal(false)}
 className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDayMode ? 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white'}`}
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
 {loadingLogs ? (
 <div className="py-20 flex flex-col items-center justify-center gap-4">
 <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Kayıtlar Sorgulanıyor...</span>
 </div>
 ) : userLogs.length > 0 ? (
 <div className="space-y-3">
 {userLogs.map((log, i) => (
 <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
 {log.device?.type === 'mobile' ? <Smartphone className={`w-4 h-4 ${isDayMode ? 'text-cyan-600' : 'text-cyan-400'}`} /> : <Laptop className={`w-4 h-4 ${isDayMode ? 'text-cyan-600' : 'text-cyan-400'}`} />}
 </div>
 <div>
 <div className={`text-xs font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{log.location?.city || 'Bilinmeyen Şehir'}, {log.location?.country || 'TR'}</div>
 <div className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{log.ip} • {log.device?.os} {log.device?.browser}</div>
 </div>
 </div>
 <div className={`text-right text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>
 {new Date(log.createdAt).toLocaleString('tr-TR')}
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-20 text-center">
 <Activity className={`w-12 h-12 mx-auto mb-4 ${isDayMode ? 'text-slate-200' : 'text-gray-800'}`} />
 <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>Henüz bir giriş kaydı bulunamadı.</p>
 </div>
 )}
 </div>

 <div className="mt-8">
 <button
 onClick={() => setShowLogsModal(false)}
 className={`w-full py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
 >
 KAPAT
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
