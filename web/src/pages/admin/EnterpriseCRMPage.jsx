import { useState } from 'react'
import { Building2, PhoneCall, Mail, Calendar, MoreVertical, Plus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function EnterpriseCRMPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const stages = ['Görüşülüyor', 'Teklif Verildi', 'Kazanıldı']
    const [deals, setDeals] = useState([
        { id: 1, company: 'TechCorp A.Ş.', stage: 'Görüşülüyor', value: '₺50,000', contact: 'Ahmet Y.', lastAction: 'E-posta Gönderildi' },
        { id: 2, holding: 'Global Holding', stage: 'Teklif Verildi', value: '₺120,000', contact: 'Selin B.', lastAction: 'Toplantı Yapıldı' },
        { id: 3, company: 'KobiSoft', stage: 'Kazanıldı', value: '₺25,000', contact: 'Can K.', lastAction: 'Sözleşme İmzalandı' },
    ])

    return (
        <div className="space-y-6 font-primary min-h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Kurumsal CRM (B2B)</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Şirketlerle olan görüşmeleri ve kurumsal satış sürecini yönetin.</p>
                </div>
                <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Fırsat Ekle
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {stages.map(stage => (
                    <div key={stage} className={`flex flex-col rounded-2xl border ${isDayMode ? 'bg-slate-50/50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <div className={`p-4 border-b font-semibold flex items-center justify-between ${isDayMode ? 'border-slate-200 text-slate-900' : 'border-white/10 text-white'}`}>
                            {stage}
                            <span className="text-xs font-normal text-slate-500 px-2 py-1 bg-slate-200 dark:bg-white/10 rounded-full">
                                {deals.filter(d => d.stage === stage).length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4">
                            {deals.filter(d => d.stage === stage).map(deal => (
                                <div key={deal.id} className={`p-4 rounded-xl border shadow-sm ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#12151D] border-white/10'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{deal.company || deal.holding}</h4>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className={`text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-4`}>{deal.value}</div>
                                    
                                    <div className="space-y-2 text-xs text-slate-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2"><PhoneCall className="w-3 h-3" /> {deal.contact}</div>
                                        <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {deal.lastAction}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
