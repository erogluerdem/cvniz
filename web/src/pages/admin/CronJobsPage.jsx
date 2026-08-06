import { useState } from 'react'
import { Clock, Play, Settings, Terminal, CheckCircle2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function CronJobsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [jobs, setJobs] = useState([
        { id: 1, name: 'Günlük Veritabanı Yedeği', schedule: 'Her Gece 03:00', lastRun: 'Bugün 03:00', status: 'success' },
        { id: 2, name: 'Abonelik Kontrolü', schedule: 'Her Saat Başı', lastRun: '15 dk önce', status: 'success' },
        { id: 3, name: 'Pasif Kullanıcı Maili', schedule: 'Pazartesi 09:00', lastRun: 'Geçen Hafta', status: 'success' },
    ])

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Zamanlanmış Görevler (Cron)</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Arka planda çalışan otomatik görevleri yönetin ve izleyin.</p>
                </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/5'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`text-xs uppercase tracking-wider ${isDayMode ? 'bg-slate-50 text-slate-500' : 'bg-white/5 text-gray-400'}`}>
                            <tr>
                                <th className="p-4 font-semibold">Görev Adı</th>
                                <th className="p-4 font-semibold">Zamanlama (Cron)</th>
                                <th className="p-4 font-semibold">Son Çalışma</th>
                                <th className="p-4 font-semibold">Durum</th>
                                <th className="p-4 font-semibold text-right">Aksiyonlar</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDayMode ? 'divide-slate-200' : 'divide-white/5'}`}>
                            {jobs.map((job) => (
                                <tr key={job.id} className={isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}>
                                    <td className="p-4">
                                        <div className={`font-semibold flex items-center gap-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            <Terminal className={`w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} /> {job.name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded bg-slate-200/50 dark:bg-white/10 w-max ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            <Clock className="w-3 h-3" /> {job.schedule}
                                        </div>
                                    </td>
                                    <td className={`p-4 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{job.lastRun}</td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 w-max px-2 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                                            <CheckCircle2 className="w-3 h-3" /> Başarılı
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className={`p-2 rounded-lg transition-colors border ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button className={`p-2 rounded-lg transition-colors border ${isDayMode ? 'bg-cyan-50 border-cyan-200 text-cyan-600 hover:bg-cyan-100' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'}`}>
                                                <Play className="w-4 h-4" />
                                            </button>
                                        </div>
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
