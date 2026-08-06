import { useState } from 'react'
import { ShieldAlert, AlertOctagon, UserX, Globe, Crosshair, Lock, Search, Activity, Ban } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

const MOCK_ALERTS = [
    { id: 1, type: 'Temp Mail', user: 'johndoe123@temp-mail.org', ip: '192.168.1.45', time: '5 dk önce', action: 'Otomatik Engellendi', severity: 'low' },
    { id: 2, type: 'AI İstismar', user: 'ahmet.y@gmail.com', ip: '85.100.22.14', time: '12 dk önce', action: 'Limit Aşımı (Bloke)', severity: 'high' },
    { id: 3, type: 'Fraud (Ödeme)', user: 'fake.buyer@yahoo.com', ip: '45.22.11.9', time: '1 saat önce', action: 'Iyzico 3D Secure İptal', severity: 'critical' },
]

export default function AntiFraudPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [alerts] = useState(MOCK_ALERTS)

    return (
        <div className="space-y-8 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight mb-2 flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        <ShieldAlert className="w-8 h-8 text-rose-500" /> Kötüye Kullanım & Fraud Koruması
                    </h2>
                    <p className={`text-base ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Sisteminizi spam hesaplardan, geçici (temp) maillerden ve kredi kartı fraud girişimlerinden koruyan akıllı kalkan.
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border font-bold text-sm ${isDayMode ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                    <Activity className="w-4 h-4 animate-pulse" /> Kalkan Aktif (Korunuyor)
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Engellenen Bot/Temp-Mail', count: '1,245', icon: <UserX className="w-6 h-6" />, color: 'rose' },
                    { title: 'Durdurulan AI İstismarı', count: '89', icon: <Crosshair className="w-6 h-6" />, color: 'amber' },
                    { title: 'Bloklanan Fraud Ödeme', count: '12', icon: <Lock className="w-6 h-6" />, color: 'red' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-3xl border flex items-center gap-5 ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0F111A] border-white/5'}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDayMode ? `bg-${stat.color}-100 text-${stat.color}-600` : `bg-${stat.color}-500/20 text-${stat.color}-400`}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.title}</div>
                            <div className={`text-3xl font-black ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.count}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Settings Toggles */}
            <div className={`rounded-3xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0F111A] border-white/10'}`}>
                <div className={`p-6 border-b ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        <AlertOctagon className="w-5 h-5 text-indigo-500" /> Güvenlik Kuralları (Filtreler)
                    </h3>
                </div>
                <div className="p-2">
                    {[
                        { title: 'Geçici (Disposable) E-postaları Engelle', desc: '10MinuteMail, Temp-Mail gibi domainlerden üye olunmasını reddeder.', active: true },
                        { title: 'AI İstismar Limiti (Rate Limiting)', desc: '1 saat içinde 20\'den fazla AI isteği atan IP adreslerini 24 saatliğine dondurur.', active: true },
                        { title: 'Şüpheli IP (VPN/Proxy) Tespiti', desc: 'Sürekli farklı ülke/IP değiştiren hesaplardan ödeme alımını durdurur.', active: false },
                    ].map((rule, idx) => (
                        <div key={idx} className={`p-4 mx-4 my-2 rounded-2xl flex items-center justify-between border ${isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}>
                            <div>
                                <h4 className={`font-bold ${isDayMode ? 'text-slate-800' : 'text-gray-200'}`}>{rule.title}</h4>
                                <p className={`text-sm mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{rule.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                                <input type="checkbox" className="sr-only peer" defaultChecked={rule.active} />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Alerts Table */}
            <div className={`rounded-3xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0F111A] border-white/10'}`}>
                 <div className={`p-6 border-b flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <h3 className={`text-lg font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Canlı Tehdit Algılama (Son 24 Saat)</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`text-xs uppercase font-bold ${isDayMode ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-gray-400'}`}>
                            <tr>
                                <th className="px-6 py-4">Tehdit Türü</th>
                                <th className="px-6 py-4">Kullanıcı / IP</th>
                                <th className="px-6 py-4">Alınan Aksiyon</th>
                                <th className="px-6 py-4">Zaman</th>
                                <th className="px-6 py-4">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                            {alerts.map((alert) => (
                                <tr key={alert.id} className={isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                            alert.severity === 'low' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                            alert.severity === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                        }`}>
                                            <Ban className="w-3.5 h-3.5" /> {alert.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`font-semibold ${isDayMode ? 'text-slate-800' : 'text-gray-200'}`}>{alert.user}</div>
                                        <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{alert.ip}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>{alert.action}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{alert.time}</td>
                                    <td className="px-6 py-4">
                                        <button className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${isDayMode ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-white/20 hover:bg-white/10 text-white'}`}>
                                            Karalisteye Al
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
