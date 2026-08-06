import { useState } from 'react'
import { Scale, FileText, Download, Trash2, CheckCircle, Clock, ShieldCheck, Mail } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

const MOCK_REQUESTS = [
    { id: 'REQ-101', user: 'ayse.y@example.com', type: 'Veri Silme (Unutulma Hakkı)', status: 'Bekliyor', date: 'Bugün, 14:30', sla: '28 Gün Kaldı' },
    { id: 'REQ-102', user: 'mehmet.k@gmail.com', type: 'Veri İndirme (JSON Dışa Aktarım)', status: 'Tamamlandı', date: 'Dün, 09:15', sla: '-' },
    { id: 'REQ-103', user: 'info@sirket.com.tr', type: 'Çerez İzni İptali', status: 'Otomatik İşlendi', date: '3 Gün Önce', sla: '-' },
]

export default function GDPRCompliancePage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [requests] = useState(MOCK_REQUESTS)

    return (
        <div className="space-y-8 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight mb-2 flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        <Scale className="w-8 h-8 text-blue-500" /> KVKK & GDPR Uyum Merkezi
                    </h2>
                    <p className={`text-base ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Kullanıcı gizlilik taleplerini yönetin, veri silme işlemlerini yasal sürelere uygun şekilde gerçekleştirin.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border flex items-start gap-4 ${isDayMode ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/10 border-blue-500/20'}`}>
                    <div className={`p-3 rounded-2xl ${isDayMode ? 'bg-blue-200 text-blue-700' : 'bg-blue-500/20 text-blue-400'}`}>
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold mb-1 ${isDayMode ? 'text-blue-900' : 'text-blue-100'}`}>Aydınlatma Metni & Politikalar</h3>
                        <p className={`text-sm mb-4 ${isDayMode ? 'text-blue-700' : 'text-blue-300/70'}`}>
                            Kullanıcı kayıt olurken onaylanan Gizlilik Sözleşmesi ve KVKK metinlerinin versiyonlarını güncelleyin.
                        </p>
                        <button className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${isDayMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                            Metinleri Düzenle
                        </button>
                    </div>
                </div>

                <div className={`p-6 rounded-3xl border flex items-start gap-4 ${isDayMode ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-900/10 border-emerald-500/20'}`}>
                    <div className={`p-3 rounded-2xl ${isDayMode ? 'bg-emerald-200 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold mb-1 ${isDayMode ? 'text-emerald-900' : 'text-emerald-100'}`}>Çerez (Cookie) Onay Geçmişi</h3>
                        <p className={`text-sm mb-4 ${isDayMode ? 'text-emerald-700' : 'text-emerald-300/70'}`}>
                            Ziyaretçilerin çerez banner'ına verdikleri "Kabul Et" veya "Reddet" aksiyonlarının yasal log kayıtları.
                        </p>
                        <button className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${isDayMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
                            Logları İndir (CSV)
                        </button>
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className={`rounded-3xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0F111A] border-white/10'}`}>
                 <div className={`p-6 border-b flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <div>
                        <h3 className={`text-lg font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Kullanıcı Talepleri (Data Subject Requests)</h3>
                        <p className={`text-sm mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Yasal süre (SLA) bitmeden taleplere yanıt verin.</p>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`text-xs uppercase font-bold ${isDayMode ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-gray-400'}`}>
                            <tr>
                                <th className="px-6 py-4">Talep ID / Kullanıcı</th>
                                <th className="px-6 py-4">Talep Türü</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4">Yasal Süre</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                            {requests.map((req) => (
                                <tr key={req.id} className={isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}>
                                    <td className="px-6 py-4">
                                        <div className={`font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{req.id}</div>
                                        <div className={`text-xs flex items-center gap-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                            <Mail className="w-3 h-3" /> {req.user}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{req.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{req.date}</td>
                                    <td className="px-6 py-4">
                                        {req.sla !== '-' ? (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400`}>
                                                <Clock className="w-3.5 h-3.5" /> {req.sla}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === 'Bekliyor' ? (
                                            <span className={`font-medium text-amber-600 dark:text-amber-400`}>Bekliyor</span>
                                        ) : (
                                            <span className={`font-medium flex items-center gap-1 text-emerald-600 dark:text-emerald-400`}>
                                                <CheckCircle className="w-4 h-4" /> {req.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === 'Bekliyor' && req.type.includes('Silme') && (
                                            <button className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${isDayMode ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'}`}>
                                                <Trash2 className="w-4 h-4" /> Kalıcı Olarak Sil
                                            </button>
                                        )}
                                        {req.status === 'Bekliyor' && req.type.includes('İndirme') && (
                                            <button className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${isDayMode ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
                                                <Download className="w-4 h-4" /> JSON Oluştur & Gönder
                                            </button>
                                        )}
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
