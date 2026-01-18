import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useEnterprise, ENTERPRISE_PLANS } from '../context/EnterpriseContext'
import { useCV } from '../context/CVContext'
import {
    Building2, Users, FileText, Download, TrendingUp, Settings, Plus,
    Crown, Mail, Trash2, Edit, Check, X, ArrowLeft, UserPlus, BarChart3,
    CreditCard, Calendar, Shield, ChevronRight, Search, Filter, MoreVertical,
    Star
} from 'lucide-react'
import CVReviewRequest from '../components/CVReviewRequest'

export default function EnterpriseDashboard() {
    const { user } = useAuth()
    const { currentCompany, addEmployee, removeEmployee, updateEmployee, isEnterpriseAdmin } = useEnterprise() || {}
    const { cvs } = useCV()
    const navigate = useNavigate()
    const { toast } = useToast()

    const [activeTab, setActiveTab] = useState('overview')
    const [showAddModal, setShowAddModal] = useState(false)
    const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: 'member' })
    const [searchQuery, setSearchQuery] = useState('')
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [selectedCVForReview, setSelectedCVForReview] = useState(null)

    if (!currentCompany) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card rounded-3xl p-8 max-w-md text-center">
                    <Building2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Kurumsal Hesap Bulunamadı</h1>
                    <p className="text-gray-400 mb-6">
                        Şirketiniz için kurumsal hesap oluşturun veya mevcut bir hesaba katılın.
                    </p>
                    <Link
                        to="/enterprise/signup"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
                    >
                        <Plus className="w-5 h-5" />
                        Kurumsal Hesap Oluştur
                    </Link>
                </div>
            </div>
        )
    }

    const plan = ENTERPRISE_PLANS[currentCompany.plan]
    const usagePercent = (currentCompany.usedSeats / currentCompany.seats) * 100

    const filteredEmployees = currentCompany.employees?.filter(emp =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    const handleAddEmployee = () => {
        if (!newEmployee.email) return

        const result = addEmployee(currentCompany.id, newEmployee)
        if (result.success) {
            setShowAddModal(false)
            setNewEmployee({ name: '', email: '', role: 'member' })
        }
    }

    const tabs = [
        { id: 'overview', label: 'Genel Bakış', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'employees', label: 'Çalışanlar', icon: <Users className="w-5 h-5" /> },
        { id: 'billing', label: 'Faturalama', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> }
    ]

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Building2 className="w-7 h-7 text-cyan-400" />
                            {currentCompany.name}
                        </h1>
                        <p className="text-gray-400">{plan?.name} Planı</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentCompany.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                        }`}>
                        {currentCompany.status === 'active' ? 'Aktif' : 'Beklemede'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-cyan-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{currentCompany.usedSeats}/{currentCompany.seats}</div>
                            <div className="text-sm text-gray-400">Aktif Kullanıcı</div>
                            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-500 rounded-full"
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{currentCompany.stats?.totalCVs || 0}</div>
                            <div className="text-sm text-gray-400">Toplam CV</div>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Download className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{currentCompany.stats?.totalDownloads || 0}</div>
                            <div className="text-sm text-gray-400">İndirme</div>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-amber-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{currentCompany.stats?.activeUsers || 0}</div>
                            <div className="text-sm text-gray-400">Bu Ay Aktif</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Hızlı İşlemler</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                            >
                                <UserPlus className="w-6 h-6 text-cyan-400 mb-2" />
                                <div className="font-medium">Çalışan Ekle</div>
                                <div className="text-sm text-gray-500">Yeni kullanıcı davet et</div>
                            </button>
                            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
                                <Download className="w-6 h-6 text-purple-400 mb-2" />
                                <div className="font-medium">Rapor İndir</div>
                                <div className="text-sm text-gray-500">Aylık kullanım raporu</div>
                            </button>
                            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
                                <Crown className="w-6 h-6 text-amber-400 mb-2" />
                                <div className="font-medium">Plan Yükselt</div>
                                <div className="text-sm text-gray-500">Daha fazla kullanıcı</div>
                            </button>
                            <button
                                onClick={() => cvs?.length > 0 ? (setSelectedCVForReview(cvs[0]), setShowReviewModal(true)) : toast.warning('Önce CV oluşturmanız gerekiyor')}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                            >
                                <Star className="w-6 h-6 text-purple-400 mb-2" />
                                <div className="font-medium">CV İnceleme</div>
                                <div className="text-sm text-gray-500">Expert veya AI incelemesi</div>
                            </button>
                            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left">
                                <Shield className="w-6 h-6 text-green-400 mb-2" />
                                <div className="font-medium">Güvenlik</div>
                                <div className="text-sm text-gray-500">SSO ve 2FA ayarları</div>
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Son Aktiviteler</h3>
                        <div className="space-y-3">
                            {currentCompany.employees?.slice(0, 5).map((emp, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                        {emp.name?.charAt(0) || emp.email?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{emp.name || emp.email}</div>
                                        <div className="text-sm text-gray-500">
                                            {emp.joinedAt ? new Date(emp.joinedAt).toLocaleDateString('tr-TR') : 'N/A'} tarihinde katıldı
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-xs ${emp.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {emp.role === 'admin' ? 'Admin' : 'Üye'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Çalışan ara..."
                                className="pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none w-64"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium"
                        >
                            <UserPlus className="w-4 h-4" />
                            Çalışan Ekle
                        </button>
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Çalışan</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Rol</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Durum</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Katılım</th>
                                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, i) => (
                                    <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                                    {emp.name?.charAt(0) || emp.email?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{emp.name || 'İsim belirtilmedi'}</div>
                                                    <div className="text-sm text-gray-500">{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-lg text-xs ${emp.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {emp.role === 'admin' ? 'Admin' : 'Üye'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-lg text-xs ${emp.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                emp.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {emp.status === 'active' ? 'Aktif' : emp.status === 'pending' ? 'Bekliyor' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400">
                                            {emp.joinedAt ? new Date(emp.joinedAt).toLocaleDateString('tr-TR') : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {isEnterpriseAdmin() && emp.userId !== user?.id && (
                                                <button
                                                    onClick={() => removeEmployee(currentCompany.id, emp.id)}
                                                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Mevcut Plan</h3>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                            <div>
                                <div className="text-xl font-bold">{plan?.name}</div>
                                <div className="text-gray-400">{plan?.seats} kullanıcıya kadar</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    {plan?.price ? `₺${plan.price}` : 'Özel'}
                                </div>
                                <div className="text-sm text-gray-400">/ay</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Fatura Bilgileri</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5">
                                <Calendar className="w-5 h-5 text-cyan-400 mb-2" />
                                <div className="text-sm text-gray-400">Sonraki Fatura</div>
                                <div className="font-medium">
                                    {currentCompany.billing?.nextBillingDate
                                        ? new Date(currentCompany.billing.nextBillingDate).toLocaleDateString('tr-TR')
                                        : '-'
                                    }
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <CreditCard className="w-5 h-5 text-purple-400 mb-2" />
                                <div className="text-sm text-gray-400">Ödeme Yöntemi</div>
                                <div className="font-medium">
                                    {currentCompany.billing?.paymentMethod || 'Belirtilmedi'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Plan Karşılaştırma</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {Object.values(ENTERPRISE_PLANS).map(p => (
                                <div
                                    key={p.id}
                                    className={`p-4 rounded-xl border ${p.id === currentCompany.plan
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : 'border-white/10 bg-white/5'
                                        }`}
                                >
                                    <div className="font-bold mb-1">{p.name}</div>
                                    <div className="text-2xl font-bold text-cyan-400 mb-3">
                                        {p.price ? `₺${p.price}` : 'Özel'}
                                        <span className="text-sm text-gray-400">/ay</span>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        {p.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-gray-400">
                                                <Check className="w-4 h-4 text-green-400" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    {p.id !== currentCompany.plan && (
                                        <button className="w-full mt-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium">
                                            {p.price && p.price > (ENTERPRISE_PLANS[currentCompany.plan]?.price || 0)
                                                ? 'Yükselt' : 'Seç'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Şirket Bilgileri</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Şirket Adı</label>
                                <input
                                    type="text"
                                    defaultValue={currentCompany.name}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sektör</label>
                                <input
                                    type="text"
                                    defaultValue={currentCompany.industry || ''}
                                    placeholder="örn: Teknoloji"
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                />
                            </div>
                            <button className="px-6 py-2 rounded-xl bg-cyan-500 text-white font-medium">
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">Çalışan Ekle</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">İsim</label>
                                <input
                                    type="text"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                    placeholder="Çalışan adı"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">E-posta</label>
                                <input
                                    type="email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                    placeholder="calisan@sirket.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Rol</label>
                                <select
                                    value={newEmployee.role}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                >
                                    <option value="member">Üye</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddEmployee}
                                className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-medium"
                            >
                                Davet Gönder
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Review Modal */}
            <CVReviewRequest
                isOpen={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false)
                    setSelectedCVForReview(null)
                }}
                cv={selectedCVForReview}
            />
        </div>
    )
}
