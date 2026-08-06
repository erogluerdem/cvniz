import { useState } from 'react'
import { Users, Shield, Plus, Lock, Key } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function RolesPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [roles, setRoles] = useState([
        { id: 1, name: 'Süper Admin', users: 2, description: 'Sistemin tüm ayarlarına tam erişim.', color: 'red' },
        { id: 2, name: 'İçerik Yöneticisi', users: 5, description: 'Blog, duyuru ve şablon yönetimi.', color: 'blue' },
        { id: 3, name: 'Destek Uzmanı', users: 8, description: 'Sadece destek talepleri ve kullanıcıları görebilir.', color: 'emerald' },
    ])

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Rol ve Yetki Yönetimi</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Alt admin hesapları ve destek uzmanları için izinleri yapılandırın.</p>
                </div>
                <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Rol Oluştur
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className={`rounded-2xl border p-6 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0B0D14] border-white/5'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${role.color}-500/10 text-${role.color}-500`}>
                                <Shield className="w-6 h-6" />
                            </div>
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold bg-${role.color}-500/10 text-${role.color}-500`}>
                                {role.users} Kullanıcı
                            </span>
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{role.name}</h3>
                        <p className={`text-sm mb-6 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{role.description}</p>
                        
                        <div className="space-y-3">
                            <button className={`w-full py-2 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                <Key className="w-4 h-4" /> İzinleri Düzenle
                            </button>
                            <button className={`w-full py-2 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                <Users className="w-4 h-4" /> Kullanıcıları Gör
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
