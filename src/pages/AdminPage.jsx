import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import {
    FileText, Users, Settings, LogOut, LayoutDashboard,
    TrendingUp, Download, Crown, Trash2, Shield, Search
} from 'lucide-react'

export default function AdminPage() {
    const { user, logout, isAdmin } = useAuth()
    const { getAllCVs } = useCV()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard')
    const [searchQuery, setSearchQuery] = useState('')

    if (!isAdmin) {
        navigate('/')
        return null
    }

    const allUsers = JSON.parse(localStorage.getItem('cvify_users') || '[]')
    const allCVs = getAllCVs()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const deleteUser = (userId) => {
        if (userId === 'admin') return
        const users = allUsers.filter(u => u.id !== userId)
        localStorage.setItem('cvify_users', JSON.stringify(users))
        // Also delete user's CVs
        const cvs = allCVs.filter(cv => cv.userId !== userId)
        localStorage.setItem('cvify_cvs', JSON.stringify(cvs))
        window.location.reload()
    }

    const togglePremium = (userId) => {
        const users = allUsers.map(u => {
            if (u.id === userId) return { ...u, isPremium: !u.isPremium }
            return u
        })
        localStorage.setItem('cvify_users', JSON.stringify(users))
        window.location.reload()
    }

    const filteredUsers = allUsers.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        totalUsers: allUsers.length,
        premiumUsers: allUsers.filter(u => u.isPremium).length,
        totalCVs: allCVs.length,
        todayCVs: allCVs.filter(cv => {
            const today = new Date().toDateString()
            return new Date(cv.createdAt).toDateString() === today
        }).length
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/5 border-r border-white/10 p-4 flex flex-col">
                <Link to="/" className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">CVify</span>
                </Link>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Kullanıcılar
                    </button>
                    <button
                        onClick={() => setActiveTab('cvs')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cvs' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        CV'ler
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        Ayarlar
                    </button>
                </nav>

                <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-sm">{user?.name}</div>
                            <div className="text-xs text-gray-500">Admin</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="w-8 h-8 text-cyan-400" />
                                    <span className="text-green-400 text-sm">+12%</span>
                                </div>
                                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                                <div className="text-gray-400 text-sm">Toplam Kullanıcı</div>
                            </div>
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Crown className="w-8 h-8 text-amber-400" />
                                    <span className="text-green-400 text-sm">+5%</span>
                                </div>
                                <div className="text-3xl font-bold">{stats.premiumUsers}</div>
                                <div className="text-gray-400 text-sm">Premium Kullanıcı</div>
                            </div>
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <FileText className="w-8 h-8 text-purple-400" />
                                    <span className="text-green-400 text-sm">+18%</span>
                                </div>
                                <div className="text-3xl font-bold">{stats.totalCVs}</div>
                                <div className="text-gray-400 text-sm">Toplam CV</div>
                            </div>
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <TrendingUp className="w-8 h-8 text-green-400" />
                                </div>
                                <div className="text-3xl font-bold">{stats.todayCVs}</div>
                                <div className="text-gray-400 text-sm">Bugün Oluşturulan</div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4">Son Aktiviteler</h2>
                            <div className="space-y-3">
                                {allCVs.slice(-5).reverse().map(cv => {
                                    const cvUser = allUsers.find(u => u.id === cv.userId)
                                    return (
                                        <div key={cv.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-lg">
                                                    {cv.template === 'modern' ? '🎨' : '📄'}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{cvUser?.name || 'Bilinmeyen'}</div>
                                                    <div className="text-sm text-gray-400">{cv.name} oluşturdu</div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                                            </div>
                                        </div>
                                    )
                                })}
                                {allCVs.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">Henüz aktivite yok</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold">Kullanıcılar</h1>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Kullanıcı ara..."
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Kullanıcı</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">E-posta</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rol</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Durum</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">CV</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => {
                                        const userCVs = allCVs.filter(cv => cv.userId === u.id)
                                        return (
                                            <tr key={u.id} className="border-t border-white/10">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${u.role === 'admin'
                                                                ? 'bg-gradient-to-br from-red-500 to-orange-500'
                                                                : 'bg-gradient-to-br from-cyan-500 to-purple-600'
                                                            }`}>
                                                            {u.name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <span>{u.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.isPremium ? (
                                                        <span className="flex items-center gap-1 text-amber-400">
                                                            <Crown className="w-4 h-4" /> Premium
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Ücretsiz</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">{userCVs.length}</td>
                                                <td className="px-6 py-4">
                                                    {u.role !== 'admin' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => togglePremium(u.id)}
                                                                className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                                                                title={u.isPremium ? 'Premium İptal' : 'Premium Yap'}
                                                            >
                                                                <Crown className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteUser(u.id)}
                                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                                title="Sil"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'cvs' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-8">Tüm CV'ler</h1>
                        <div className="glass-card rounded-2xl p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {allCVs.map(cv => {
                                    const cvUser = allUsers.find(u => u.id === cv.userId)
                                    return (
                                        <div key={cv.id} className="bg-white/5 rounded-xl p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">{getTemplateEmoji(cv.template)}</span>
                                                <div>
                                                    <h3 className="font-semibold">{cv.name}</h3>
                                                    <p className="text-sm text-gray-400">{cvUser?.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                                            </div>
                                        </div>
                                    )
                                })}
                                {allCVs.length === 0 && (
                                    <p className="col-span-3 text-center text-gray-500 py-8">Henüz CV oluşturulmamış</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h1 className="text-3xl font-bold mb-8">Ayarlar</h1>
                        <div className="glass-card rounded-2xl p-6 max-w-2xl">
                            <h2 className="text-xl font-bold mb-6">Genel Ayarlar</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Site Adı</label>
                                    <input
                                        type="text"
                                        defaultValue="CVify"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Pro Fiyatı (₺)</label>
                                    <input
                                        type="number"
                                        defaultValue="29"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
                                    />
                                </div>
                                <button className="btn-premium">Kaydet</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function getTemplateEmoji(template) {
    const emojis = {
        modern: '🎨', minimalist: '⚡', corporate: '🏢', creative: '🌈', tech: '💻',
        executive: '👔', elegant: '✨', healthcare: '🏥', academic: '📚', finance: '💰',
        legal: '⚖️', marketing: '📢', engineer: '⚙️', retail: '🛍️', hospitality: '🏨',
        government: '🏛️', freelancer: '💼', startup: '🚀', international: '🌍', portfolio: '🖼️'
    }
    return emojis[template] || '📄'
}
