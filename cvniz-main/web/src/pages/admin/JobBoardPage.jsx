import { useState, useEffect } from 'react'
import {
    Briefcase, Plus, Edit, Trash2, Eye, MapPin, Clock, DollarSign, Building2, Users, X,
    RefreshCw, Search, Star, Zap, CheckCircle2, PauseCircle, AlertCircle,
    Globe, Laptop, Home, TrendingUp, Calendar, Award
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const typeConfig = {
    'full-time': { label: 'Tam Zamanlı', color: 'bg-blue-500/20 text-blue-400' },
    'part-time': { label: 'Yarı Zamanlı', color: 'bg-purple-500/20 text-purple-400' },
    'contract': { label: 'Sözleşmeli', color: 'bg-amber-500/20 text-amber-400' },
    'internship': { label: 'Staj', color: 'bg-green-500/20 text-green-400' },
    'freelance': { label: 'Freelance', color: 'bg-cyan-500/20 text-cyan-400' }
}

const statusConfig = {
    draft: { label: 'Taslak', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
    active: { label: 'Aktif', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
    paused: { label: 'Duraklatılmış', color: 'bg-amber-500/20 text-amber-400', icon: PauseCircle },
    expired: { label: 'Süresi Dolmuş', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
    filled: { label: 'Doldu', color: 'bg-cyan-500/20 text-cyan-400', icon: CheckCircle2 }
}

const locationTypeConfig = {
    onsite: { label: 'Ofiste', icon: Building2 },
    remote: { label: 'Uzaktan', icon: Globe },
    hybrid: { label: 'Hibrit', icon: Home }
}

const experienceConfig = {
    entry: 'Giriş Seviyesi',
    junior: 'Junior',
    mid: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
    executive: 'Yönetici'
}

export default function JobBoardPage() {
    const { toast, confirm } = useToast()
    const [jobs, setJobs] = useState([])
    const [stats, setStats] = useState({ total: 0, active: 0, totalApplications: 0, companies: 0 })
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingJob, setEditingJob] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        locationType: 'onsite',
        salaryMin: '',
        salaryMax: '',
        type: 'full-time',
        experienceLevel: 'mid',
        description: '',
        featured: false,
        urgent: false
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [jobsRes, statsRes] = await Promise.all([
                adminAPI.getJobs(),
                adminAPI.getJobStats()
            ])
            if (jobsRes.success) setJobs(jobsRes.jobs)
            if (statsRes.success) setStats(statsRes.stats)
        } catch (error) {
            toast.error('Veriler yüklenirken hata: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let response
            if (editingJob) {
                response = await adminAPI.updateJob(editingJob._id, formData)
                toast.success('İş ilanı güncellendi!')
            } else {
                response = await adminAPI.createJob({ ...formData, status: 'active' })
                toast.success('Yeni iş ilanı yayınlandı!')
            }
            if (response.success) {
                setShowModal(false)
                setEditingJob(null)
                resetForm()
                fetchData()
            }
        } catch (error) {
            toast.error('İşlem başarısız: ' + error.message)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '', company: '', location: '', locationType: 'onsite',
            salaryMin: '', salaryMax: '', type: 'full-time', experienceLevel: 'mid',
            description: '', featured: false, urgent: false
        })
    }

    const openEditModal = (job) => {
        setEditingJob(job)
        setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            locationType: job.locationType || 'onsite',
            salaryMin: job.salaryMin || '',
            salaryMax: job.salaryMax || '',
            type: job.type,
            experienceLevel: job.experienceLevel || 'mid',
            description: job.description || '',
            featured: job.featured || false,
            urgent: job.urgent || false
        })
        setShowModal(true)
    }

    const toggleStatus = async (job) => {
        if (job.status === 'expired' || job.status === 'filled') return
        const newStatus = job.status === 'active' ? 'paused' : 'active'
        try {
            const response = await adminAPI.updateJob(job._id, { status: newStatus })
            if (response.success) {
                setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j))
                toast.success(newStatus === 'active' ? 'İlan yayınlandı!' : 'İlan duraklatıldı!')
            }
        } catch (error) {
            toast.error('Durum güncellenemedi.')
        }
    }

    const toggleFeatured = async (job) => {
        try {
            const response = await adminAPI.updateJob(job._id, { featured: !job.featured })
            if (response.success) {
                setJobs(jobs.map(j => j._id === job._id ? { ...j, featured: !j.featured } : j))
                toast.success(job.featured ? 'Öne çıkarma kaldırıldı.' : 'İlan öne çıkarıldı!')
            }
        } catch (error) {
            toast.error('İşlem başarısız.')
        }
    }

    const deleteJob = async (id) => {
        const confirmed = await confirm({
            title: 'İş İlanını Sil',
            message: 'Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?',
            confirmText: 'Evet, Sil',
            type: 'danger'
        })
        if (!confirmed) return

        try {
            const response = await adminAPI.deleteJob(id)
            if (response.success) {
                setJobs(jobs.filter(j => j._id !== id))
                toast.success('İş ilanı silindi.')
            }
        } catch (error) {
            toast.error('İş ilanı silinemedi.')
        }
    }

    const filteredJobs = jobs.filter(j => {
        const matchesSearch =
            j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.company?.toLowerCase().includes(searchQuery.toLowerCase())
        if (activeFilter === 'all') return matchesSearch
        return matchesSearch && j.status === activeFilter
    })

    if (loading && jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                    <Briefcase className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">İŞ İLANLARI YÜKLENİYOR</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">Veriler senkronize ediliyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter flex items-center gap-3 italic">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                            <Briefcase className="w-6 h-6 text-cyan-400" />
                        </div>
                        İş İlanları
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">İş ilanları yayınlayın ve başvuruları takip edin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setEditingJob(null); setShowModal(true) }}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> YENİ İLAN
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOPLAM İLAN', value: stats.total, icon: <Briefcase className="w-4 h-4" />, color: 'cyan' },
                    { label: 'AKTİF İLAN', value: stats.active, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
                    { label: 'BAŞVURU', value: stats.totalApplications, icon: <Users className="w-4 h-4" />, color: 'purple' },
                    { label: 'ŞİRKET', value: stats.companies, icon: <Building2 className="w-4 h-4" />, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="glass-card rounded-[2.5rem] p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pozisyon veya şirket ara..."
                        className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all w-full font-bold"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'active', 'paused', 'expired'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === f
                                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f === 'all' ? 'TÜMÜ' : f === 'active' ? 'AKTİF' : f === 'paused' ? 'DURAKLATILMIŞ' : 'SÜRESİ DOLMUŞ'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.map(job => {
                    const type = typeConfig[job.type] || typeConfig['full-time']
                    const status = statusConfig[job.status] || statusConfig.draft
                    const StatusIcon = status.icon
                    const locType = locationTypeConfig[job.locationType] || locationTypeConfig.onsite
                    const LocIcon = locType.icon

                    return (
                        <div key={job._id} className={`glass-card rounded-[2.5rem] p-6 border transition-all group relative overflow-hidden ${job.featured ? 'border-amber-500/30' : 'border-white/5 hover:border-cyan-500/20'
                            }`}>
                            {job.featured && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -z-10"></div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Title & Badges */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{job.title}</h3>
                                        {job.featured && (
                                            <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase flex items-center gap-1">
                                                <Star className="w-3 h-3" /> ÖNE ÇIKAN
                                            </span>
                                        )}
                                        {job.urgent && (
                                            <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-[9px] font-black uppercase flex items-center gap-1">
                                                <Zap className="w-3 h-3" /> ACİL
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 ${status.color}`}>
                                            <StatusIcon className="w-3 h-3" /> {status.label}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-bold mb-4">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5" /> {job.company}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <LocIcon className="w-3.5 h-3.5" /> {locType.label}
                                        </span>
                                        <span className={`px-2 py-1 rounded-lg ${type.color} text-[10px] font-black`}>
                                            {type.label}
                                        </span>
                                        {(job.salaryMin || job.salaryMax) && (
                                            <span className="flex items-center gap-1.5 text-green-400">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                {job.salaryMin && job.salaryMax
                                                    ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} TL`
                                                    : `${(job.salaryMin || job.salaryMax).toLocaleString()} TL`
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 text-xs font-bold">
                                        <span className="flex items-center gap-1.5 text-purple-400">
                                            <Users className="w-4 h-4" />
                                            <strong>{job.applications || 0}</strong> başvuru
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Eye className="w-4 h-4" />
                                            {job.views || 0} görüntüleme
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(job.createdAt).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleFeatured(job)}
                                        className={`p-2.5 rounded-xl transition-all ${job.featured
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'bg-white/5 text-gray-500 hover:text-amber-400 hover:bg-amber-500/10'
                                            }`}
                                        title={job.featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                    {job.status !== 'expired' && job.status !== 'filled' && (
                                        <button
                                            onClick={() => toggleStatus(job)}
                                            className={`p-2.5 rounded-xl transition-all ${job.status === 'active'
                                                    ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                }`}
                                        >
                                            {job.status === 'active' ? <PauseCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(job)}
                                        className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteJob(job._id)}
                                        className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {filteredJobs.length === 0 && (
                    <div className="text-center py-20 glass-card rounded-[3rem] border border-dashed border-white/10">
                        <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter italic mb-1">İŞ İLANI BULUNAMADI</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kriterlere uyan ilan yok.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card rounded-[3rem] p-8 max-w-2xl w-full border border-white/10 relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl -z-10"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                    {editingJob ? 'İLANI DÜZENLE' : 'YENİ İŞ İLANI'}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">İş ilanı detaylarını girin.</p>
                            </div>
                            <button onClick={() => { setShowModal(false); setEditingJob(null) }} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">POZİSYON</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Senior Frontend Developer"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    required
                                />
                            </div>

                            {/* Company & Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">ŞİRKET</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Tech Corp"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KONUM</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="İstanbul, Türkiye"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location Type & Job Type */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">ÇALIŞMA ŞEKLİ</label>
                                    <select
                                        value={formData.locationType}
                                        onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    >
                                        <option value="onsite">Ofiste</option>
                                        <option value="remote">Uzaktan</option>
                                        <option value="hybrid">Hibrit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">İŞ TÜRÜ</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    >
                                        {Object.entries(typeConfig).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">DENEYİM</label>
                                    <select
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    >
                                        {Object.entries(experienceConfig).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">MAAŞ (MIN)</label>
                                    <input
                                        type="number"
                                        value={formData.salaryMin}
                                        onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                        placeholder="30000"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">MAAŞ (MAX)</label>
                                    <input
                                        type="number"
                                        value={formData.salaryMax}
                                        onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                        placeholder="50000"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">AÇIKLAMA</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="İş tanımı ve gereksinimler..."
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-cyan-500/30 resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Flags */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 rounded-lg bg-white/10 border-none text-amber-500 focus:ring-0"
                                    />
                                    <span className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-400" /> Öne Çıkar
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.urgent}
                                        onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                                        className="w-5 h-5 rounded-lg bg-white/10 border-none text-red-500 focus:ring-0"
                                    />
                                    <span className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-red-400" /> Acil
                                    </span>
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingJob(null) }}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {editingJob ? 'GÜNCELLE' : 'YAYINLA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
