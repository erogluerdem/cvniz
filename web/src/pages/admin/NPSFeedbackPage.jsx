import { useState } from 'react'
import { Star, MessageSquare, TrendingUp, Filter } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function NPSFeedbackPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, user: 'Ali Yılmaz', score: 9, comment: 'Şablonlar harika, ancak daha fazla teknoloji şablonu bekliyorum.', date: '2 saat önce' },
        { id: 2, user: 'Ayşe K.', score: 10, comment: 'Sistem çok hızlı, premium özellikleri beğendim.', date: '5 saat önce' },
        { id: 3, user: 'Mehmet C.', score: 6, comment: 'Mobilde önyazı oluştururken takılmalar oluyor.', date: '1 gün önce' },
    ])

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Geri Bildirim & NPS</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Kullanıcı memnuniyet skorları ve toplanan geri bildirimler.</p>
                </div>
                <button className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium border transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                    <Filter className="w-4 h-4" /> Filtrele
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-semibold uppercase tracking-wider ${isDayMode ? 'text-emerald-700' : 'text-emerald-400'}`}>Ortalama NPS</span>
                        <Star className={`w-5 h-5 ${isDayMode ? 'text-emerald-600' : 'text-emerald-500'}`} />
                    </div>
                    <div className={`text-4xl font-bold mb-1 ${isDayMode ? 'text-emerald-800' : 'text-white'}`}>4.8 <span className="text-xl text-emerald-500/50">/ 5</span></div>
                    <div className={`flex items-center gap-1 text-sm ${isDayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                        <TrendingUp className="w-4 h-4" /> Geçen aya göre +0.2 artış
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className={`rounded-2xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/5'}`}>
                        <div className={`px-6 py-4 border-b font-semibold ${isDayMode ? 'border-slate-200 text-slate-900' : 'border-white/5 text-white'}`}>
                            Son Geri Bildirimler
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-white/5">
                            {feedbacks.map((item) => (
                                <div key={item.id} className={`p-6 transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                                                {item.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.user}</div>
                                                <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{item.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className={`text-sm font-bold ${isDayMode ? 'text-slate-700' : 'text-white'}`}>{item.score}/10</span>
                                        </div>
                                    </div>
                                    <p className={`text-sm mt-3 ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>{item.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
