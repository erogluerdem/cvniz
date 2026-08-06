import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
    X, Plus, Briefcase, Calendar, Clock, MapPin, Trash2, Edit2,
    ChevronRight, AlertCircle, CheckCircle, Building, Link2,
    GripVertical, Sparkles, Bell, ExternalLink, MoreVertical,
    Phone, Video, Users, MessageSquare, TrendingUp, Target, Loader2
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const STATUSES = [
    { id: 'wishlist', name: 'İlgileniyor', color: 'gray', icon: Target, border: 'border-gray-500/30' },
    { id: 'applied', name: 'Başvuruldu', color: 'blue', icon: Briefcase, border: 'border-blue-500/30' },
    { id: 'screening', name: 'Ön Eleme', color: 'cyan', icon: Users, border: 'border-cyan-500/30' },
    { id: 'interview', name: 'Mülakat', color: 'purple', icon: MessageSquare, border: 'border-purple-500/30' },
    { id: 'offer', name: 'Teklif', color: 'green', icon: CheckCircle, border: 'border-green-500/30' },
    { id: 'rejected', name: 'Red', color: 'red', icon: X, border: 'border-red-500/30' }
]

const INTERVIEW_TYPES = [
    { id: 'video', name: 'Video Görüşme', icon: Video },
    { id: 'phone', name: 'Telefon', icon: Phone },
    { id: 'onsite', name: 'Yüz Yüze', icon: Users }
]

export default function ApplicationCRM({ isOpen, onClose }) {
    const { token } = useAuth()
    const [applications, setApplications] = useState([])
    const [grouped, setGrouped] = useState({})
    const [stats, setStats] = useState(null)
    const [upcomingInterviews, setUpcomingInterviews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showInterviewModal, setShowInterviewModal] = useState(null)
    const [draggedItem, setDraggedItem] = useState(null)
    const [dragOverColumn, setDragOverColumn] = useState(null)

    // Form state
    const [form, setForm] = useState({ company: '', position: '', jobUrl: '', salary: '', notes: '' })
    const [interviewForm, setInterviewForm] = useState({ date: '', time: '', type: 'video', notes: '', location: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch data
    useEffect(() => {
        if (isOpen) {
            fetchApplications()
            fetchUpcomingInterviews()
        }
    }, [isOpen])

    const fetchApplications = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setApplications(data.applications)
                setGrouped(data.grouped)
                setStats(data.stats)
            }
        } catch (err) {
            console.error('Fetch error:', err)
        }
        setIsLoading(false)
    }

    const fetchUpcomingInterviews = async () => {
        try {
            const response = await fetch(`${API_URL}/applications/upcoming-interviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setUpcomingInterviews(data.upcoming)
            }
        } catch (err) {
            console.error('Upcoming interviews error:', err)
        }
    }

    // Add application
    const handleAddApplication = async () => {
        if (!form.company || !form.position) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })
            if (response.ok) {
                setShowAddModal(false)
                setForm({ company: '', position: '', jobUrl: '', salary: '', notes: '' })
                toast.success('Başvuru eklendi!')
                fetchApplications()
            } else {
                toast.error('Başvuru eklenirken bir hata oluştu.')
            }
        } catch (err) {
            console.error('Add error:', err)
            toast.error('Bağlantı hatası.')
        }
        setIsSubmitting(false)
    }

    // Update status (drag & drop)
    const handleDrop = async (appId, newStatus) => {
        setDragOverColumn(null)
        if (!appId) return

        // Optimistic update
        const app = applications.find(a => a.id === appId)
        if (app && app.status !== newStatus) {
            const oldStatus = app.status;
            
            // Update local state temporarily
            setGrouped(prev => {
                const updated = { ...prev }
                if (updated[oldStatus]) {
                    updated[oldStatus] = updated[oldStatus].filter(a => a.id !== appId)
                }
                if (!updated[newStatus]) updated[newStatus] = []
                updated[newStatus] = [...updated[newStatus], { ...app, status: newStatus }]
                return updated
            })

            try {
                const response = await fetch(`${API_URL}/applications/${appId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                })
                
                if (response.ok) {
                    toast.success('Durum güncellendi!')
                    fetchApplications()
                } else {
                    toast.error('Durum güncellenemedi.')
                    fetchApplications() // revert
                }
            } catch (err) {
                console.error('Update error:', err)
                toast.error('Bağlantı hatası.')
                fetchApplications() // revert
            }
        }
        setDraggedItem(null)
    }

    // Add interview
    const handleAddInterview = async () => {
        if (!interviewForm.date || !showInterviewModal) return

        setIsSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/applications/${showInterviewModal}/interview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(interviewForm)
            })
            if (response.ok) {
                setShowInterviewModal(null)
                setInterviewForm({ date: '', time: '', type: 'video', notes: '', location: '' })
                toast.success('Mülakat eklendi!')
                fetchApplications()
                fetchUpcomingInterviews()
            } else {
                toast.error('Mülakat eklenemedi.')
            }
        } catch (err) {
            console.error('Add interview error:', err)
            toast.error('Bağlantı hatası.')
        }
        setIsSubmitting(false)
    }

    // Delete application
    const handleDelete = async (id) => {
        if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return

        try {
            const response = await fetch(`${API_URL}/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                toast.success('Başvuru silindi.')
                fetchApplications()
            }
        } catch (err) {
            console.error('Delete error:', err)
            toast.error('Bağlantı hatası.')
        }
    }

    const getStatusStyle = (color) => {
        const styles = {
            gray: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
            cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
            green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
            red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
        }
        return styles[color] || styles.gray
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col bg-[#09090B]"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 bg-[#0F1115]/90 backdrop-blur-xl relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Briefcase className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Başvuru Takip <Sparkles size={16} className="text-[#10B981]" />
                                </h2>
                                <p className="text-sm text-gray-400">Gelişmiş Başvuru Yönetimi (CRM)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            {/* Stats */}
                            {stats && (
                                <div className="flex items-center gap-6 text-sm border-r border-white/10 pr-6 hidden md:flex">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white">{stats.total}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Toplam</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-[#10B981]">{stats.responseRate}%</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Dönüş Oranı</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-purple-400">{stats.interviewRate}%</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Mülakat Oranı</div>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-5 py-2.5 rounded-xl bg-[#10B981] text-black font-bold flex items-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                <Plus className="w-5 h-5" />
                                Yeni Ekle
                            </button>
                            <button onClick={onClose} className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Interviews Alert */}
                {upcomingInterviews.length > 0 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-purple-500/10 border-b border-purple-500/20 overflow-hidden"
                    >
                        <div className="max-w-7xl mx-auto p-3 flex items-center gap-4 overflow-x-auto scrollbar-none">
                            <Bell className="w-5 h-5 text-purple-400 flex-shrink-0" />
                            <span className="text-sm text-purple-300 font-bold flex-shrink-0">Yaklaşan Mülakatlar:</span>
                            {upcomingInterviews.slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-1.5 bg-purple-500/20 rounded-lg flex-shrink-0 border border-purple-500/30">
                                    <span className="font-bold text-white">{item.application.company}</span>
                                    <span className="text-xs text-purple-300 font-medium bg-purple-900/50 px-2 py-0.5 rounded">
                                        {item.interview.daysUntil === 0 ? 'Bugün' : item.interview.daysUntil === 1 ? 'Yarın' : `${item.interview.daysUntil} gün`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="flex gap-6 min-w-max h-full max-w-7xl mx-auto pb-4">
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center h-full w-full absolute inset-0">
                                <Loader2 className="w-10 h-10 text-[#10B981] animate-spin" />
                            </div>
                        ) : (
                            STATUSES.map(status => {
                                const StatusIcon = status.icon
                                const apps = grouped[status.id] || []
                                const style = getStatusStyle(status.color)
                                const isDragOver = dragOverColumn === status.id

                                return (
                                    <div
                                        key={status.id}
                                        className={`w-[320px] flex-shrink-0 flex flex-col rounded-2xl border transition-all duration-300 ${
                                            isDragOver ? `bg-white/10 border-white/30 scale-[1.02]` : `bg-[#0F1115]/50 border-white/5`
                                        }`}
                                        onDragOver={(e) => {
                                            e.preventDefault()
                                            setDragOverColumn(status.id)
                                        }}
                                        onDragLeave={() => setDragOverColumn(null)}
                                        onDrop={() => handleDrop(draggedItem, status.id)}
                                    >
                                        {/* Column Header */}
                                        <div className={`p-4 border-b border-white/5 ${style.bg} rounded-t-2xl flex items-center justify-between`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${style.bg} ${style.border} border`}>
                                                    <StatusIcon className={`w-4 h-4 ${style.text}`} />
                                                </div>
                                                <span className={`font-bold ${style.text}`}>{status.name}</span>
                                            </div>
                                            <span className="text-xs font-bold bg-black/40 text-gray-300 px-2.5 py-1 rounded-full">
                                                {apps.length}
                                            </span>
                                        </div>

                                        {/* Cards */}
                                        <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-none">
                                            <AnimatePresence>
                                                {apps.map(app => (
                                                    <motion.div
                                                        key={app.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        draggable
                                                        onDragStart={() => setDraggedItem(app.id)}
                                                        onDragEnd={() => {
                                                            setDraggedItem(null)
                                                            setDragOverColumn(null)
                                                        }}
                                                        className={`p-4 bg-[#181A20] rounded-xl border border-white/5 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
                                                            draggedItem === app.id ? 'opacity-50' : ''
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-white text-base truncate mb-1">{app.position}</h4>
                                                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                                                    <Building className="w-3.5 h-3.5 text-gray-500" />
                                                                    <span className="truncate">{app.company}</span>
                                                                </div>
                                                            </div>
                                                            <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
                                                                <button
                                                                    onClick={() => setShowInterviewModal(app.id)}
                                                                    className="p-1.5 hover:bg-purple-500/20 text-gray-500 hover:text-purple-400 rounded-lg transition-colors"
                                                                    title="Mülakat Ekle"
                                                                >
                                                                    <Calendar className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(app.id)}
                                                                    className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                                                                    title="Sil"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Details Badges */}
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {app.salary && (
                                                                <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-md text-xs font-medium flex items-center gap-1">
                                                                    ₺ {app.salary}
                                                                </span>
                                                            )}
                                                            {app.interviews?.length > 0 && (
                                                                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-xs font-medium flex items-center gap-1">
                                                                    <Video className="w-3 h-3" /> {app.interviews.length} Görüşme
                                                                </span>
                                                            )}
                                                            {app.jobUrl && (
                                                                <a
                                                                    href={app.jobUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-xs font-medium flex items-center gap-1 hover:bg-cyan-500/20 transition-colors"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Link2 className="w-3 h-3" /> İlan
                                                                </a>
                                                            )}
                                                        </div>

                                                        <div className="mt-4 text-[11px] text-gray-600 flex items-center justify-between">
                                                            <span>{new Date(app.appliedAt).toLocaleDateString('tr-TR')}</span>
                                                            <GripVertical className="w-3 h-3 opacity-30" />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {apps.length === 0 && (
                                                <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-600 text-sm font-medium">
                                                    Buraya sürükle
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Add Application Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        >
                            <motion.div 
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="w-full max-w-lg bg-[#0F1115] border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] rounded-3xl overflow-hidden"
                            >
                                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center">
                                                <Plus className="text-black w-5 h-5" />
                                            </div>
                                            Yeni Başvuru Ekle
                                        </h3>
                                        <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-1">Şirket Adı *</label>
                                            <input
                                                type="text"
                                                value={form.company}
                                                onChange={(e) => setForm({ ...form, company: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] outline-none transition-all"
                                                placeholder="Apple"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-1">Pozisyon *</label>
                                            <input
                                                type="text"
                                                value={form.position}
                                                onChange={(e) => setForm({ ...form, position: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] outline-none transition-all"
                                                placeholder="Frontend Developer"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-1">İlan Linki (Opsiyonel)</label>
                                        <input
                                            type="url"
                                            value={form.jobUrl}
                                            onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-1">Maaş Beklentisi / Teklifi (Opsiyonel)</label>
                                        <input
                                            type="text"
                                            value={form.salary}
                                            onChange={(e) => setForm({ ...form, salary: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] outline-none transition-all"
                                            placeholder="₺80.000 - ₺100.000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-1">Özel Notlar</label>
                                        <textarea
                                            value={form.notes}
                                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] outline-none transition-all resize-none"
                                            placeholder="Görüşme harika geçti, teknik mülakat bekleniyor..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleAddApplication}
                                        disabled={!form.company || !form.position || isSubmitting}
                                        className="w-full py-4 mt-2 bg-[#10B981] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kaydet'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add Interview Modal */}
                <AnimatePresence>
                    {showInterviewModal && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        >
                            <motion.div 
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="w-full max-w-lg bg-[#0F1115] border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.1)] rounded-3xl overflow-hidden"
                            >
                                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                                <Calendar className="text-white w-5 h-5" />
                                            </div>
                                            Mülakat Planla
                                        </h3>
                                        <button onClick={() => setShowInterviewModal(null)} className="text-gray-400 hover:text-white">
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-1">Tarih *</label>
                                            <input
                                                type="date"
                                                value={interviewForm.date}
                                                onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-1">Saat</label>
                                            <input
                                                type="time"
                                                value={interviewForm.time}
                                                onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-purple-500 outline-none transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">Görüşme Tipi</label>
                                        <div className="flex gap-2">
                                            {INTERVIEW_TYPES.map(type => {
                                                const Icon = type.icon
                                                return (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setInterviewForm({ ...interviewForm, type: type.id })}
                                                        className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-2 transition-all font-bold text-sm ${
                                                            interviewForm.type === type.id
                                                                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        {type.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-1">Konum / Link</label>
                                        <input
                                            type="text"
                                            value={interviewForm.location}
                                            onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 outline-none transition-all"
                                            placeholder="Google Meet, Zoom linki veya ofis adresi"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-1">Hazırlık Notları</label>
                                        <textarea
                                            value={interviewForm.notes}
                                            onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-purple-500 outline-none transition-all resize-none"
                                            placeholder="Sistem mimarisi sorulacak, sunum hazırlanacak..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleAddInterview}
                                        disabled={!interviewForm.date || isSubmitting}
                                        className="w-full py-4 mt-2 bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mülakatı Kaydet'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    )
}
