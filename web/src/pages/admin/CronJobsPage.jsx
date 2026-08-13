import { useState, useEffect } from 'react'
import { Clock, Play, Settings, Terminal, CheckCircle2, Plus, Edit2, Trash2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/admin/Modal'

export default function CronJobsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingJob, setEditingJob] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        schedule: '',
        status: 'pending',
        lastRun: 'Henüz çalışmadı'
    })

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const res = await adminAPI.getCronJobs()
            if (res.success) {
                setJobs(res.jobs)
            }
        } catch (error) {
            toast.error('Zamanlanmış görevler yüklenemedi')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (job = null) => {
        if (job) {
            setEditingJob(job)
            setFormData({
                name: job.name || '',
                schedule: job.schedule || '',
                status: job.status || 'pending',
                lastRun: job.lastRun || 'Henüz çalışmadı'
            })
        } else {
            setEditingJob(null)
            setFormData({
                name: '',
                schedule: '',
                status: 'pending',
                lastRun: 'Henüz çalışmadı'
            })
        }
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingJob) {
                const res = await adminAPI.updateCronJob(editingJob._id, formData)
                if (res.success) {
                    setJobs(jobs.map(j => j._id === editingJob._id ? res.job : j))
                    toast.success('Görev güncellendi')
                }
            } else {
                const res = await adminAPI.createCronJob(formData)
                if (res.success) {
                    setJobs([res.job, ...jobs])
                    toast.success('Yeni görev eklendi')
                }
            }
            setShowModal(false)
        } catch (error) {
            toast.error('İşlem başarısız')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return
        try {
            const res = await adminAPI.deleteCronJob(id)
            if (res.success) {
                setJobs(jobs.filter(j => j._id !== id))
                toast.success('Görev silindi')
            }
        } catch (error) {
            toast.error('Silme işlemi başarısız')
        }
    }


    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Zamanlanmış Görevler (Cron)</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Arka planda çalışan otomatik görevleri yönetin ve izleyin.</p>
                </div>
                <button 
                  onClick={() => openModal()}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Görev
                </button>
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
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-500">Yükleniyor...</td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-500">Kayıtlı görev bulunamadı.</td>
                                </tr>
                            ) : jobs.map((job) => (
                                <tr key={job._id} className={isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}>
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
                                    <td className={`p-4 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{job.lastRun || 'Henüz çalışmadı'}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1 w-max px-2 py-1 rounded-md text-xs font-semibold ${
                                            job.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                                            job.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                            job.status === 'running' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-slate-500/10 text-slate-500'
                                        }`}>
                                            <CheckCircle2 className="w-3 h-3" /> {
                                                job.status === 'success' ? 'Başarılı' :
                                                job.status === 'failed' ? 'Hatalı' :
                                                job.status === 'running' ? 'Çalışıyor' : 'Bekliyor'
                                            }
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(job)} className={`p-2 rounded-lg transition-colors border ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(job._id)} className={`p-2 rounded-lg transition-colors border ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600' : 'bg-transparent border-white/10 text-gray-400 hover:text-red-500 hover:bg-white/10'}`}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingJob ? "Görevi Düzenle" : "Yeni Görev Oluştur"}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Görev Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="örn: Günlük Veritabanı Yedeği"
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Zamanlama (Cron İfadesi veya Metin)</label>
                        <input
                            type="text"
                            required
                            value={formData.schedule}
                            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                            placeholder="örn: 0 3 * * * veya Her Gece 03:00"
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Durum</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        >
                            <option value="pending">Bekliyor</option>
                            <option value="success">Başarılı</option>
                            <option value="failed">Hatalı</option>
                            <option value="running">Çalışıyor</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className={`flex-1 py-3 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all border ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex-1 py-3 rounded-2xl text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg ${isDayMode ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:scale-[1.02] active:scale-95'}`}
                        >
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
        </div>
    )
}

