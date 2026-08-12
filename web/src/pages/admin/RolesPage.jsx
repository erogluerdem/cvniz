import { useState } from 'react'
import { Users, Shield, Plus, Lock, Key, Check, X, Save } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

export default function RolesPage() {
    const { toast } = useToast()
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [roles, setRoles] = useState([
        { id: 1, name: 'Süper Admin', users: 2, description: 'Sistemin tüm ayarlarına tam erişim.', color: 'red', permissions: ['dashboard', 'users', 'payments', 'support', 'settings', 'security'] },
        { id: 2, name: 'İçerik Yöneticisi', users: 5, description: 'Blog, duyuru, içerik ve şablon yönetimi.', color: 'blue', permissions: ['dashboard', 'templates', 'site-content', 'media'] },
        { id: 3, name: 'Destek Uzmanı', users: 8, description: 'Sadece destek talepleri ve kullanıcı profil inceleme.', color: 'emerald', permissions: ['dashboard', 'users', 'support'] },
        { id: 4, name: 'Finans Analisti', users: 3, description: 'Sadece ödemeler, faturalar ve finansal raporlar.', color: 'amber', permissions: ['dashboard', 'payments', 'reports'] }
    ])

    const [selectedRole, setSelectedRole] = useState(null)
    const [editingPermissions, setEditingPermissions] = useState([])

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

    const handleOpenEdit = (role) => {
        setSelectedRole(role)
        setEditingPermissions([...role.permissions])
    }

    const togglePermission = (permId) => {
        if (editingPermissions.includes(permId)) {
            setEditingPermissions(editingPermissions.filter(p => p !== permId))
        } else {
            setEditingPermissions([...editingPermissions, permId])
        }
    }

    const handleSavePermissions = () => {
        setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: editingPermissions } : r))
        toast.success(`${selectedRole.name} rolü için izinler güncellendi!`)
        setSelectedRole(null)
    }

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Rol ve Yetki Yönetimi (RBAC)</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Alt admin hesapları ve destek uzmanları için sayfa bazlı izin matrisi.</p>
                </div>
                <button 
                    onClick={() => toast.info('Yeni rol ekleme modülü aktiftir.')}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${isDayMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                >
                    <Plus className="w-4 h-4" /> YENİ ROL EKLE
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className={`rounded-2xl border p-6 flex flex-col justify-between ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-${role.color}-500/10 text-${role.color}-500`}>
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-${role.color}-500/10 text-${role.color}-500`}>
                                    {role.users} Kullanıcı
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

                        <button 
                            onClick={() => handleOpenEdit(role)}
                            className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                        >
                            <Key className="w-4 h-4 text-indigo-500" /> İzin Matrisini Düzenle
                        </button>
                    </div>
                ))}
            </div>

            {/* Permissions Modal */}
            {selectedRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-primary">
                    <div className={`rounded-2xl p-8 max-w-lg w-full border relative shadow-2xl ${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                            <div>
                                <h3 className={`text-xl font-bold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedRole.name} - İzin Matrisi</h3>
                                <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Erişilebilir modülleri seçin veya kaldırın.</p>
                            </div>
                            <button onClick={() => setSelectedRole(null)} className={`p-2 rounded-xl border ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {allPermissions.map(perm => {
                                const isChecked = editingPermissions.includes(perm.id)
                                return (
                                    <div
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.id)}
                                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isChecked
                                            ? (isDayMode ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-500/10 border-indigo-500/30')
                                            : (isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5')
                                        }`}
                                    >
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{perm.name}</span>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : (isDayMode ? 'border-slate-300' : 'border-gray-600')}`}>
                                            {isChecked && <Check className="w-3.5 h-3.5" />}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className={`flex-1 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider border ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            >
                                İPTAL
                            </button>
                            <button
                                onClick={handleSavePermissions}
                                className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> KAYDET
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
