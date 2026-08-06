import { useState } from 'react'
import { Webhook, Link2, CheckCircle2, XCircle, Settings2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function IntegrationsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'Slack', description: 'Yeni üye ve ödeme bildirimlerini kanala gönderir.', status: 'active', color: 'indigo' },
        { id: 2, name: 'Mailchimp', description: 'Kullanıcı e-postalarını bülten listesine otomatik ekler.', status: 'active', color: 'emerald' },
        { id: 3, name: 'Discord Webhook', description: 'Destek talepleri için geliştirici ekibine bildirim atar.', status: 'inactive', color: 'purple' },
        { id: 4, name: 'Google Analytics', description: 'Platform kullanım metriklerini izler.', status: 'active', color: 'amber' },
    ])

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Entegrasyonlar & Webhook'lar</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>3. parti araçlarla veri senkronizasyonunu yönetin.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((item) => (
                    <div key={item.id} className={`flex items-start gap-4 p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0B0D14] border-white/5'}`}>
                        <div className={`p-4 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500`}>
                            <Link2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`text-lg font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.name}</h3>
                                {item.status === 'active' ? (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                                        <CheckCircle2 className="w-3 h-3" /> Aktif
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                                        <XCircle className="w-3 h-3" /> Pasif
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{item.description}</p>
                            <div className="flex gap-2">
                                <button className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                    <Settings2 className="w-4 h-4" /> Yapılandır
                                </button>
                                <button className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                    <Webhook className="w-4 h-4" /> Loglar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
