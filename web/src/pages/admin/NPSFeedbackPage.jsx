import { useState, useEffect } from 'react'
import { Star, MessageSquare, TrendingUp, Filter, Loader2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function NPSFeedbackPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [feedbacks, setFeedbacks] = useState([])
    const [stats, setStats] = useState({ total: 0, averageScore: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await adminAPI.getFeedbacks()
                if (response.success) {
                    setFeedbacks(response.feedbacks)
                    setStats(response.stats)
                }
            } catch (error) {
                toast.error('Geri bildirimler getirilemedi.')
            } finally {
                setLoading(false)
            }
        }
        fetchFeedbacks()
    }, [toast])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 font-primary">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <span className={`font-semibold uppercase tracking-wider text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    Geri Bildirimler Yükleniyor...
                </span>
            </div>
        )
    }

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
                    <div className={`text-4xl font-bold mb-1 ${isDayMode ? 'text-emerald-800' : 'text-white'}`}>{stats.averageScore} <span className="text-xl text-emerald-500/50">/ 10</span></div>
                    <div className={`flex items-center gap-1 text-sm ${isDayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                        <TrendingUp className="w-4 h-4" /> Toplam {stats.total} değerlendirme
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className={`rounded-2xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/5'}`}>
                        <div className={`px-6 py-4 border-b font-semibold ${isDayMode ? 'border-slate-200 text-slate-900' : 'border-white/5 text-white'}`}>
                            Son Geri Bildirimler
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-white/5">
                            {feedbacks.length === 0 ? (
                                <div className={`p-8 text-center text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Henüz geri bildirim bulunmuyor.
                                </div>
                            ) : feedbacks.map((item) => (
                                <div key={item._id} className={`p-6 transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                                                {item.userName ? item.userName.charAt(0) : 'U'}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.userName || 'Kullanıcı'}</div>
                                                <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</div>
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
