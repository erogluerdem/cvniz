import { useState, useEffect } from 'react'
import { useJobBoard } from '../context/JobBoardContext'
import { useCV } from '../context/CVContext'
import {
    X, Search, MapPin, Briefcase, Clock, Heart, Send, Filter,
    Building2, DollarSign, Check, ChevronDown, Loader2, FileText,
    Star, TrendingUp, ExternalLink
} from 'lucide-react'

export default function JobSearch({ isOpen, onClose }) {
    const {
        searchJobs, getJob, applyToJob, toggleFavorite, isFavorite,
        calculateMatchScore, getLocations, getJobTypes, getUserApplications
    } = useJobBoard() || {}
    const { cvs } = useCV()

    const [searchQuery, setSearchQuery] = useState('')
    const [locationFilter, setLocationFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [remoteFilter, setRemoteFilter] = useState(null)
    const [filteredJobs, setFilteredJobs] = useState([])
    const [selectedJob, setSelectedJob] = useState(null)
    const [showApplyModal, setShowApplyModal] = useState(false)
    const [selectedCV, setSelectedCV] = useState(null)
    const [coverLetter, setCoverLetter] = useState('')
    const [applying, setApplying] = useState(false)
    const [applied, setApplied] = useState(false)

    const locations = getLocations?.() || []
    const jobTypes = getJobTypes?.() || []
    const userApps = getUserApplications?.() || []

    useEffect(() => {
        if (searchJobs) {
            const results = searchJobs({
                search: searchQuery,
                location: locationFilter,
                type: typeFilter,
                remote: remoteFilter
            })
            setFilteredJobs(results)
        }
    }, [searchQuery, locationFilter, typeFilter, remoteFilter, searchJobs])

    const handleApply = async () => {
        if (!selectedJob || !selectedCV || !applyToJob) return

        setApplying(true)
        const cv = cvs.find(c => c.id === selectedCV)
        const result = applyToJob(selectedJob.id, selectedCV, cv?.data, coverLetter)

        if (result.success) {
            setApplied(true)
            setTimeout(() => {
                setShowApplyModal(false)
                setApplied(false)
                setCoverLetter('')
            }, 2000)
        }

        setApplying(false)
    }

    const isApplied = (jobId) => userApps.some(a => a.jobId === jobId)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-md overflow-hidden">
            <div className="w-full max-w-6xl mx-auto flex flex-col h-[90vh] my-auto bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 text-white">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">İş Bul</h2>
                                <p className="text-sm text-gray-400">{filteredJobs.length} ilan bulundu</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Pozisyon, şirket veya anahtar kelime..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                            />
                        </div>

                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none min-w-[150px]"
                        >
                            <option value="">Tüm Lokasyonlar</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none min-w-[150px]"
                        >
                            <option value="">Tüm Türler</option>
                            {jobTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => setRemoteFilter(remoteFilter === true ? null : true)}
                            className={`px-4 py-3 rounded-xl border transition-colors ${remoteFilter === true
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-white/10 border-white/10 text-gray-400 hover:bg-white/20'
                                }`}
                        >
                            🏠 Remote
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Job List */}
                    <div className="w-1/2 border-r border-white/10 overflow-y-auto p-4 space-y-3">
                        {filteredJobs.map(job => {
                            const matchScore = cvs[0] ? calculateMatchScore?.(cvs[0]?.data, job) : 0
                            const hasApplied = isApplied(job.id)

                            return (
                                <button
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${selectedJob?.id === job.id
                                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold">{job.title}</h3>
                                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                {job.company}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite?.(job.id) }}
                                            className="p-1.5"
                                        >
                                            <Heart className={`w-5 h-5 ${isFavorite?.(job.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'
                                                }`} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {job.location}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                                            {job.type}
                                        </span>
                                        {job.remote && (
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                                                Remote
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-cyan-400">{job.salary}</span>
                                        <div className="flex items-center gap-2">
                                            {matchScore > 0 && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${matchScore >= 70 ? 'bg-green-500/20 text-green-400' :
                                                    matchScore >= 40 ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    %{matchScore} eşleşme
                                                </span>
                                            )}
                                            {hasApplied && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                                                    Başvurdunuz
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Aramanıza uygun ilan bulunamadı</p>
                            </div>
                        )}
                    </div>

                    {/* Job Detail */}
                    <div className="w-1/2 overflow-y-auto p-6">
                        {selectedJob ? (
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">{selectedJob.title}</h2>
                                        <p className="text-gray-400 flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            {selectedJob.company}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite?.(selectedJob.id)}
                                        className="p-2 rounded-xl hover:bg-white/10"
                                    >
                                        <Heart className={`w-6 h-6 ${isFavorite?.(selectedJob.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-cyan-400" />
                                        {selectedJob.location}
                                    </span>
                                    <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-purple-400" />
                                        {selectedJob.type}
                                    </span>
                                    <span className="px-3 py-1.5 rounded-xl bg-white/10 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-400" />
                                        {selectedJob.salary}
                                    </span>
                                    {selectedJob.remote && (
                                        <span className="px-3 py-1.5 rounded-xl bg-green-500/20 text-green-400">
                                            🏠 Remote Çalışma
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-bold mb-2">İş Tanımı</h3>
                                    <p className="text-gray-300">{selectedJob.description}</p>
                                </div>

                                <div>
                                    <h3 className="font-bold mb-2">Gereksinimler</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.requirements?.map((req, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    {isApplied(selectedJob.id) ? (
                                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
                                            <Check className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                            <p className="font-medium">Bu ilana başvurdunuz</p>
                                            <p className="text-sm text-gray-400">Başvurunuz inceleniyor</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowApplyModal(true)}
                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            Başvur
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Detayları görmek için bir ilan seçin</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && selectedJob && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="w-full max-w-md bg-slate-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 rounded-[2rem] overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-lg font-bold">Başvuru Yap</h3>
                            <p className="text-sm text-gray-400">{selectedJob.title} - {selectedJob.company}</p>
                        </div>

                        {applied ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-400" />
                                </div>
                                <h4 className="text-xl font-bold mb-2">Başvurunuz Gönderildi!</h4>
                                <p className="text-gray-400">Şirket sizinle iletişime geçecek</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">CV Seçin</label>
                                        <div className="space-y-2">
                                            {cvs.map(cv => (
                                                <button
                                                    key={cv.id}
                                                    onClick={() => setSelectedCV(cv.id)}
                                                    className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-colors ${selectedCV === cv.id
                                                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <FileText className="w-5 h-5 text-cyan-400" />
                                                    <span className="font-medium">{cv.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Ön Yazı (İsteğe bağlı)</label>
                                        <textarea
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none resize-none"
                                            placeholder="Kendinizi kısaca tanıtın..."
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/10 flex gap-3">
                                    <button
                                        onClick={() => setShowApplyModal(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        disabled={!selectedCV || applying}
                                        className="flex-1 py-3 rounded-xl bg-cyan-500 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {applying ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Gönder
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
