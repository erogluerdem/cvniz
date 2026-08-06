import { useState } from 'react'
import { Activity, Power, AlertTriangle, Search, ShieldAlert } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function SessionsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [sessions, setSessions] = useState([
        { id: 1, ip: '192.168.1.100', user: 'Ahmet Y.', location: 'İstanbul, TR', browser: 'Chrome / Windows', status: 'active', threat: 'low' },
        { id: 2, ip: '45.22.11.90', user: 'Ayşe K.', location: 'Ankara, TR', browser: 'Safari / iOS', status: 'active', threat: 'low' },
        { id: 3, ip: '104.28.19.11', user: 'Mehmet C.', location: 'Bilinmeyen (VPN)', browser: 'Firefox / Linux', status: 'suspicious', threat: 'high' },
    ])

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Aktif Oturumlar & Güvenlik</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Sistemde çevrimiçi olan kullanıcıları izleyin ve şüpheli işlemlere müdahale edin.</p>
                </div>
                <button className="px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                    <Power className="w-4 h-4" /> Tümünü Kapat (Acil)
                </button>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/5'}`}>
                <div className={`p-4 border-b flex justify-between items-center ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border w-64 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white'}`}>
                        <Search className="w-4 h-4 opacity-50" />
                        <input type="text" placeholder="IP veya Kullanıcı ara..." className="bg-transparent border-none outline-none text-sm w-full" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`text-xs uppercase tracking-wider ${isDayMode ? 'bg-slate-50 text-slate-500' : 'bg-white/5 text-gray-400'}`}>
                            <tr>
                                <th className="p-4 font-semibold">Kullanıcı</th>
                                <th className="p-4 font-semibold">IP & Konum</th>
                                <th className="p-4 font-semibold">Cihaz</th>
                                <th className="p-4 font-semibold">Durum</th>
                                <th className="p-4 font-semibold text-right">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDayMode ? 'divide-slate-200' : 'divide-white/5'}`}>
                            {sessions.map((session) => (
                                <tr key={session.id} className={isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}>
                                    <td className={`p-4 font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{session.user}</td>
                                    <td className="p-4">
                                        <div className={isDayMode ? 'text-slate-900' : 'text-gray-300'}>{session.ip}</div>
                                        <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{session.location}</div>
                                    </td>
                                    <td className={`p-4 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{session.browser}</td>
                                    <td className="p-4">
                                        {session.threat === 'high' ? (
                                            <span className="flex items-center gap-1 w-max px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-500">
                                                <AlertTriangle className="w-3 h-3" /> Şüpheli
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 w-max px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                                                <Activity className="w-3 h-3" /> Aktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                            Oturumu Kapat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
