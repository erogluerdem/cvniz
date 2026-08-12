import { useState, useEffect } from 'react'
import { Users, Shield, Plus, Lock, Key, Check, X, Save, Trash2, Edit2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function RolesPage() {
    const { toast } = useToast()
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)


    const [selectedRole, setSelectedRole] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: 'indigo',
        permissions: []
    })

    const allPermissions = [
        { id: 'dashboard', name: 'Dashboard Özeti' },
        { id: 'users', name: 'Kullanıcı Yönetimi' },
        { id: 'payments', name: 'Ödemeler & Finans' },
        { id: 'support', name: 'Destek Talepleri' },
        { id: 'templates', name: 'Şablon Katalogu' },
        { id: 'site-content', name: 'Site CMS İçeriği' },
        { id: 'media', name: 'Medya Kütüphanesi' },
        { id: 'reports', name: 'Analitik & Raporlar' },
        { id: 'security', name: 'Güvenlik & Loglar' },
        { id: 'settings', name: 'Sistem Ayarları' }
    ]

    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const res = await adminAPI.getAdminRoles()
            if (res.success) {
                setRoles(res.roles)
            }
        } catch (error) {
            toast.error('Roller yüklenemedi')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (role = null) => {
        if (role) {
            setSelectedRole(role)
            setFormData({
                name: role.name || '',
                description: role.description || '',
                color: role.color || 'indigo',
                permissions: role.permissions || []
            })
        } else {
            setSelectedRole(null)
            setFormData({
                name: '',
                description: '',
                color: 'indigo',
                permissions: []
            })
        }
        setShowModal(true)
    }

    const togglePermission = (permId) => {
        const { permissions } = formData
        if (permissions.includes(permId)) {
            setFormData({ ...formData, permissions: permissions.filter(p => p !== permId) })
        } else {
            setFormData({ ...formData, permissions: [...permissions, permId] })
        }
    }

    const handleSaveRole = async () => {
        if (!formData.name || !formData.description) {
            toast.error('Lütfen rol adı ve açıklamasını doldurun')
            return
        }

        setIsSaving(true)
        try {
            if (selectedRole) {
                const res = await adminAPI.updateAdminRole(selectedRole._id, formData)
                if (res.success) {
                    setRoles(roles.map(r => r._id === selectedRole._id ? res.role : r))
                    toast.success('Rol güncellendi')
                }
            } else {
                const res = await adminAPI.createAdminRole(formData)
                if (res.success) {
                    setRoles([res.role, ...roles])
                    toast.success('Yeni rol oluşturuldu')
                }
            }
            setShowModal(false)
        } catch (error) {
            toast.error('İşlem başarısız')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteRole = async (id) => {
        if (!window.confirm('Bu rolü silmek istediğinize emin misiniz?')) return
        try {
            const res = await adminAPI.deleteAdminRole(id)
            if (res.success) {
                setRoles(roles.filter(r => r._id !== id))
                toast.success('Rol silindi')
            }
        } catch (error) {
            toast.error('Silme işlemi başarısız')
        }
    }

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Rol ve Yetki Yönetimi (RBAC)</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Alt admin hesapları ve destek uzmanları için sayfa bazlı izin matrisi.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${isDayMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                >
                    <Plus className="w-4 h-4" /> YENİ ROL EKLE
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-slate-500">Yükleniyor...</div>
            ) : roles.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Kayıtlı rol bulunamadı.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {roles.map((role) => (
                        <div key={role._id} className={`rounded-2xl border p-6 flex flex-col justify-between ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-${role.color}-500/10 text-${role.color}-500`}>
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-${role.color}-500/10 text-${role.color}-500`}>
                                        {role.usersCount || 0} Kullanıcı
                                    </span>
                                </div>
                                <h3 className={`text-lg font-bold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{role.name}</h3>
                                <p className={`text-xs mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{role.description}</p>
                                
                                <div className="mb-6 space-y-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Etkin İzinler:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.map(p => (
                                            <span key={p} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isDayMode ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-gray-300'}`}>
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openModal(role)}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                >
                                    <Edit2 className="w-4 h-4 text-indigo-500" /> Düzenle
                                </button>
                                <button 
                                    onClick={() => handleDeleteRole(role._id)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600' : 'bg-white/5 border-white/10 text-gray-400 hover:text-red-500 hover:bg-white/10'}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Role Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-primary overflow-y-auto">
                    <div className={`rounded-2xl p-6 md:p-8 max-w-2xl w-full border relative shadow-2xl my-8 ${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                            <div>
                                <h3 className={`text-xl font-bold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedRole ? 'Rol Düzenle' : 'Yeni Rol Oluştur'}</h3>
                                <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Rol bilgilerini ve erişilebilir modülleri seçin.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-xl border ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Rol Adı</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                            isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-slate-800 border-white/10 focus:border-cyan-500/50 text-white'
                                        }`}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Renk Teması</label>
                                    <select
                                        value={formData.color}
                                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                                        className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                            isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-slate-800 border-white/10 focus:border-cyan-500/50 text-white'
                                        }`}
                                    >
                                        <option value="indigo">Mor (Indigo)</option>
                                        <option value="emerald">Yeşil (Emerald)</option>
                                        <option value="blue">Mavi (Blue)</option>
                                        <option value="red">Kırmızı (Red)</option>
                                        <option value="amber">Sarı (Amber)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Açıklama</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                        isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-slate-800 border-white/10 focus:border-cyan-500/50 text-white'
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <h4 className={`text-sm font-bold uppercase ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>İzin Matrisi</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {allPermissions.map(perm => {
                                const isChecked = formData.permissions.includes(perm.id)
                                return (
                                    <div
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.id)}
                                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isChecked
                                            ? (isDayMode ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-500/10 border-indigo-500/30')
                                            : (isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-white/5')
                                        }`}
                                    >
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{perm.name}</span>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : (isDayMode ? 'border-slate-300 bg-white' : 'border-gray-600 bg-slate-700')}`}>
                                            {isChecked && <Check className="w-3.5 h-3.5" />}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => setShowModal(false)}
                                className={`flex-1 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider border ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            >
                                İPTAL
                            </button>
                            <button
                                onClick={handleSaveRole}
                                disabled={isSaving}
                                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> {isSaving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
