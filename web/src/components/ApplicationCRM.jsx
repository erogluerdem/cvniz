import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    X, Plus, Briefcase, Calendar, Clock, MapPin, Trash2, Edit2,
    ChevronRight, AlertCircle, CheckCircle, Building, Link2,
    GripVertical, Sparkles, Bell, ExternalLink, MoreVertical,
    Phone, Video, Users, MessageSquare, TrendingUp, Target
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const STATUSES = [
    { id: 'wishlist', name: 'İlgileniyor', color: 'gray', icon: Target },
    { id: 'applied', name: 'Başvuruldu', color: 'blue', icon: Briefcase },
    { id: 'screening', name: 'Ön Eleme', color: 'cyan', icon: Users },
    { id: 'interview', name: 'Mülakat', color: 'purple', icon: MessageSquare },
    { id: 'offer', name: 'Teklif', color: 'green', icon: CheckCircle },
    { id: 'rejected', name: 'Red', color: 'red', icon: X }
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
    const [selectedApp, setSelectedApp] = useState(null)
    const [draggedItem, setDraggedItem] = useState(null)

    // Form state
    const [form, setForm] = useState({ company: '', position: '', jobUrl: '', salary: '', notes: '' })
    const [interviewForm, setInterviewForm] = useState({ date: '', time: '', type: 'video', notes: '', location: '' })

    // Fetch data
    useEffect(() => {
        if (isOpen) {
            fetchApplications()
            fetchUpcomingInterviews()
        }
    }, [isOpen])

    const fetchApplications = async () => {
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
                fetchApplications()
            }
        } catch (err) {
            console.error('Add error:', err)
        }
    }

    // Update status (drag & drop)
    const handleDrop = async (appId, newStatus) => {
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
                fetchApplications()
            }
        } catch (err) {
            console.error('Update error:', err)
        }
        setDraggedItem(null)
    }

    // Add interview
    const handleAddInterview = async () => {
        if (!interviewForm.date || !showInterviewModal) return

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
                fetchApplications()
                fetchUpcomingInterviews()
            }
        } catch (err) {
            console.error('Add interview error:', err)
        }
    }

    // Delete application
    const handleDelete = async (id) => {
        if (!confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return

        try {
            await fetch(`${API_URL}/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            fetchApplications()
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    const getStatusColor = (color) => {
        const colors = {
            gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            green: 'bg-green-500/20 text-green-400 border-green-500/30',
            red: 'bg-red-500/20 text-red-400 border-red-500/30'
        }
        return colors[color] || colors.gray
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gray-900/80 backdrop-blur-md">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Başvuru Takip</h2>
                            <p className="text-sm text-gray-400">Trello tarzı iş başvuru yönetimi</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Stats */}
                        {stats && (
                            <div className="flex items-center gap-4 mr-4 text-sm">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-white">{stats.total}</div>
                                    <div className="text-xs text-gray-500">Toplam</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-cyan-400">{stats.responseRate}%</div>
                                    <div className="text-xs text-gray-500">Dönüş</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-purple-400">{stats.interviewRate}%</div>
                                    <div className="text-xs text-gray-500">Mülakat</div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Başvuru Ekle
                        </button>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Upcoming Interviews Alert */}
            {upcomingInterviews.length > 0 && (
                <div className="p-3 bg-purple-500/10 border-b border-purple-500/30">
                    <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto">
                        <Bell className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <span className="text-sm text-purple-300 font-medium flex-shrink-0">Yaklaşan Mülakatlar:</span>
                        {upcomingInterviews.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-lg flex-shrink-0">
                                <span className="font-medium text-white">{item.application.company}</span>
                                <span className="text-xs text-purple-300">
                                    {item.interview.daysUntil === 0 ? 'Bugün' : item.interview.daysUntil === 1 ? 'Yarın' : `${item.interview.daysUntil} gün`}
                                </span>
                                {item.preparation && (
                                    <button className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Hazırlık
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto p-4">
                <div className="flex gap-4 min-w-max h-full max-w-7xl mx-auto">
                    {STATUSES.map(status => {
                        const StatusIcon = status.icon
                        const apps = grouped[status.id] || []

                        return (
                            <div
                                key={status.id}
                                className="w-72 flex-shrink-0 flex flex-col bg-white/5 rounded-xl border border-white/10"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => draggedItem && handleDrop(draggedItem, status.id)}
                            >
                                {/* Column Header */}
                                <div className={`p-3 border-b border-white/10 ${getStatusColor(status.color)} rounded-t-xl`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className="w-4 h-4" />
                                            <span className="font-medium">{status.name}</span>
                                        </div>
                                        <span className="text-sm opacity-70">{apps.length}</span>
                                    </div>
                                </div>

                                {/* Cards */}
                                <div className="flex-1 p-2 overflow-y-auto space-y-2">
                                    {apps.map(app => (
                                        <div
                                            key={app.id}
                                            draggable
                                            onDragStart={() => setDraggedItem(app.id)}
                                            className="p-3 bg-gray-800/50 rounded-lg border border-white/10 cursor-move hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-white truncate">{app.position}</h4>
                                                    <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                                                        <Building className="w-3 h-3" />
                                                        {app.company}
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                                    <button
                                                        onClick={() => setShowInterviewModal(app.id)}
                                                        className="p-1 hover:bg-white/10 rounded"
                                                        title="Mülakat Ekle"
                                                    >
                                                        <Calendar className="w-4 h-4 text-purple-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(app.id)}
                                                        className="p-1 hover:bg-white/10 rounded"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Interview badge */}
                                            {app.interviews?.length > 0 && (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
                                                    <Calendar className="w-3 h-3" />
                                                    {app.interviews.filter(i => i.status === 'scheduled').length} mülakat planlandı
                                                </div>
                                            )}

                                            {/* Job URL */}
                                            {app.jobUrl && (
                                                <a
                                                    href={app.jobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 text-xs text-cyan-400 flex items-center gap-1 hover:underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-3 h-3" /> İlanı Gör
                                                </a>
                                            )}

                                            {/* Date */}
                                            <div className="mt-2 text-xs text-gray-500">
                                                {new Date(app.appliedAt).toLocaleDateString('tr-TR')}
                                            </div>
                                        </div>
                                    ))}

                                    {apps.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 text-sm">
                                            Buraya sürükle
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Add Application Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div className="w-full max-w-md glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-cyan-400" />
                            Yeni Başvuru
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Şirket *</label>
                                <input
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                                    placeholder="ABC Teknoloji"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Pozisyon *</label>
                                <input
                                    type="text"
                                    value={form.position}
                                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                                    placeholder="Frontend Developer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">İlan Linki</label>
                                <input
                                    type="url"
                                    value={form.jobUrl}
                                    onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Maaş Beklentisi</label>
                                <input
                                    type="text"
                                    value={form.salary}
                                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none"
                                    placeholder="50.000₺ - 70.000₺"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Notlar</label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
                                    placeholder="Ek notlar..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddApplication}
                                disabled={!form.company || !form.position}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium disabled:opacity-50"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Interview Modal */}
            {showInterviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div className="w-full max-w-md glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            Mülakat Ekle
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Tarih *</label>
                                    <input
                                        type="date"
                                        value={interviewForm.date}
                                        onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Saat</label>
                                    <input
                                        type="time"
                                        value={interviewForm.time}
                                        onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Mülakat Tipi</label>
                                <div className="flex gap-2">
                                    {INTERVIEW_TYPES.map(type => {
                                        const Icon = type.icon
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => setInterviewForm({ ...interviewForm, type: type.id })}
                                                className={`flex-1 p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${interviewForm.type === type.id
                                                    ? 'bg-purple-500/20 border border-purple-500'
                                                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-xs">{type.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Konum / Link</label>
                                <input
                                    type="text"
                                    value={interviewForm.location}
                                    onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                    placeholder="Zoom linki veya adres"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Notlar</label>
                                <textarea
                                    value={interviewForm.notes}
                                    onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                                    placeholder="Görüşmeciler, hazırlık notları..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowInterviewModal(null)}
                                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddInterview}
                                disabled={!interviewForm.date}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium disabled:opacity-50"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
