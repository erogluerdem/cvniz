import { useState, useEffect} from 'react'
import { FileSearch, Star, Check, X, Clock, User, MessageCircle, Eye, ThumbsUp, ThumbsDown, Loader2, Search, Filter, AlertCircle, ChevronRight, Layout, TrendingUp} from 'lucide-react'
import { reviewAPI} from '../../services/api'
import { StatusBadge, FilterTabs} from '../../components/admin/SharedComponents'
import { Link} from 'react-router-dom'

export default function CVReviewsPage() {
 const [reviews, setReviews] = useState([])
 const [loading, setLoading] = useState(true)
 const [selectedReview, setSelectedReview] = useState(null)
 const [activeFilter, setActiveFilter] = useState('all')
 const [searchQuery, setSearchQuery] = useState('')

 // Review Form State
 const [feedback, setFeedback] = useState('')
 const [score, setScore] = useState(75)
 const [submitting, setSubmitting] = useState(false)

 useEffect(() => {
 fetchReviews()
}, [])

 const fetchReviews = async () => {
 setLoading(true)
 try {
 const response = await reviewAPI.getReviews()
 if (response.success) {
 setReviews(response.reviews)
}
} catch (error) {
 console.error('İncelemeler yüklenirken hata:', error)
} finally {
 setLoading(false)
}
}

 const handleStartReview = async (id) => {
 try {
 const response = await reviewAPI.updateStatus(id, 'in_review')
 if (response.success) {
 setReviews(reviews.map(r => r.id === id || r._id === id ? { ...r, status: 'in_review'} : r))
 fetchReviews() // Refresh data to get assignment info
}
} catch (error) {
 alert('Durum güncellenemedi: ' + error.message)
}
}

 const handleComplete = async (id) => {
 if (!feedback) return alert('Lütfen geri bildirim girin.')
 setSubmitting(true)
 try {
 const response = await reviewAPI.completeReview(id, { score, feedback})
 if (response.success) {
 setReviews(reviews.map(r => r.id === id || r._id === id ? { ...r, status: 'completed', score, feedback} : r))
 setSelectedReview(null)
 setFeedback('')
 setScore(75)
 fetchReviews()
}
} catch (error) {
 alert('Tamamlama hatası: ' + error.message)
} finally {
 setSubmitting(false)
}
}

 const statusConfig = {
 pending: { label: 'Beklemede', color: 'amber', icon: <Clock className="w-3 h-3" />},
 in_review: { label: 'İnceleniyor', color: 'blue', icon: <Eye className="w-3 h-3" />},
 completed: { label: 'Tamamlandı', color: 'green', icon: <Check className="w-3 h-3" />},
 rejected: { label: 'Reddedildi', color: 'red', icon: <X className="w-3 h-3" />}
}

 const filteredReviews = reviews.filter(r => {
 const matchesFilter = activeFilter === 'all' || r.status === activeFilter
 const matchesSearch = r.cvId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 r.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 r.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
 return matchesFilter && matchesSearch
})

 const stats = {
 total: reviews.length,
 pending: reviews.filter(r => r.status === 'pending').length,
 inReview: reviews.filter(r => r.status === 'in_review').length,
 completed: reviews.filter(r => r.status === 'completed').length
}

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-bold text-white mb-1">CV Analiz Merkezi</h2>
 <p className="text-gray-400 text-sm">Uzman görüşü bekleyen özgeçmişleri değerlendirin ve puanlayın.</p>
 </div>
 </div>

 {/* Stats Row */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'Toplam Talep', val: stats.total, icon: <FileSearch className="text-purple-400" />, color: 'purple'},
 { label: 'Sıradakiler', val: stats.pending, icon: <Clock className="text-amber-400" />, color: 'amber'},
 { label: 'Aktif İnceleme', val: stats.inReview, icon: <Eye className="text-blue-400" />, color: 'blue'},
 { label: 'Yanıtlandı', val: stats.completed, icon: <Check className="text-emerald-400" />, color: 'emerald'}
 ].map((stat, i) => (
 <div key={i} className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between">
 <div>
 <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">{stat.label}</div>
 <div className="text-2xl font-semibold text-white">{stat.val}</div>
 </div>
 <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20 shadow-lg shadow-${stat.color}-500/5`}>
 {stat.icon}
 </div>
 </div>
 ))}
 </div>

 <div className="grid lg:grid-cols-12 gap-6">
 {/* Left Column: ListView */}
 <div className="lg:col-span-8 space-y-4">
 {/* Filters & Search */}
 <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
 <FilterTabs
 tabs={[
 { id: 'all', label: 'Tümü'},
 { id: 'pending', label: 'Sıradakiler'},
 { id: 'in_review', label: 'İncelenenler'},
 { id: 'completed', label: 'Bitmiş'}
 ]}
 activeTab={activeFilter}
 onChange={setActiveFilter}
 />
 </div>
 <div className="relative w-full md:w-64">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="İsim veya mail ara..."
 className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-all text-white"
 />
 </div>
 </div>

 {/* Talepler Listesi */}
 {loading ? (
 <div className="flex flex-col items-center justify-center py-20 gap-3">
 <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
 <span className="text-gray-400 font-medium">Talepler getiriliyor...</span>
 </div>
 ) : (
 <div className="space-y-4">
 {filteredReviews.map(review => (
 <div
 key={review._id || review.id}
 onClick={() => setSelectedReview(review)}
 className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer group ${selectedReview?._id === review._id || selectedReview?.id === review.id
 ? 'border-cyan-500/50 bg-cyan-500/5 shadow-neon-cyan'
 : 'border-white/5 hover:border-white/10'
}`}
 >
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
 <FileSearch className="w-6 h-6 text-gray-400" />
 </div>
 <div>
 <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
 {review.cvId?.name || 'İsimsiz CV'}
 </h4>
 <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
 <User className="w-3 h-3" />
 {review.userId?.name} <span className="opacity-30">|</span> {review.userId?.email}
 </div>
 </div>
 </div>
 <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-${statusConfig[review.status]?.color}-500/10 text-${statusConfig[review.status]?.color}-400 border border-${statusConfig[review.status]?.color}-500/20 shadow-sm`}>
 {statusConfig[review.status]?.icon}
 {statusConfig[review.status]?.label}
 </div>
 </div>

 {review.notes && (
 <div className="px-4 py-3 bg-white/5 rounded-xl text-xs text-gray-400 mb-4 border border-white/5 flex items-start gap-3">
 <MessageCircle className="w-4 h-4 text-gray-600 shrink-0" />
"{review.notes}"
 </div>
 )}

 <div className="flex items-center justify-between pt-4 border-t border-white/5">
 <div className="flex items-center gap-6">
 <div className="flex flex-col">
 <span className="text-xs text-gray-600 uppercase font-semibold">İstek Tarihi</span>
 <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
 </div>
 {review.status === 'completed' && (
 <div className="flex flex-col">
 <span className="text-xs text-gray-600 uppercase font-semibold">Verilen Puan</span>
 <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
 <Star className="w-3 h-3 fill-amber-400" />
 {review.score}/100
 </div>
 </div>
 )}
 </div>
 <div className="flex gap-2">
 {review.status === 'pending' && (
 <button
 onClick={(e) => { e.stopPropagation(); handleStartReview(review._id || review.id);}}
 className="px-4 py-1.5 rounded-xl bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
 >
 İncelemeye Başla
 </button>
 )}
 <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-cyan-400 transition-colors">
 <ChevronRight className="w-4 h-4" />
 </div>
 </div>
 </div>
 </div>
 ))}
 {filteredReviews.length === 0 && (
 <div className="py-20 text-center glass-card rounded-2xl border border-dashed border-white/10">
 <FileSearch className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-20" />
 <p className="text-gray-500 text-sm font-medium">Bu kriterlere uygun analiz talebi bulunamadı.</p>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Right Column: Review Panel */}
 <div className="lg:col-span-4 lg:sticky lg:top-6 h-fit">
 <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-2xl overflow-hidden relative group">
 {/* Background Decor */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>

 <div className="flex items-center gap-3 mb-6">
 <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
 <TrendingUp className="w-5 h-5 text-cyan-400" />
 </div>
 <h3 className="text-xl font-semibold text-white uppercase">İnceleme Paneli</h3>
 </div>

 {selectedReview ? (
 <div className="space-y-6">
 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
 <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Şu an İnceleniyor</div>
 <div className="font-bold text-white text-lg leading-tight">{selectedReview.cvId?.name}</div>
 <div className="text-xs text-cyan-400 font-medium mt-0.5">{selectedReview.userId?.name}</div>
 </div>

 {selectedReview.status === 'completed' ? (
 <div className="space-y-4">
 <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
 <div className="flex items-center justify-between mb-3">
 <span className="text-xs font-bold text-emerald-400">ANALİZ TAMAMLANDI</span>
 <div className="flex items-center gap-1 text-amber-400 font-semibold">
 <Star className="w-4 h-4 fill-amber-400" />
 {selectedReview.score}
 </div>
 </div>
 <p className="text-sm text-gray-400 leading-relaxed">
"{selectedReview.feedback}"
 </p>
 </div>
 <button
 onClick={() => setSelectedReview(null)}
 className="w-full py-3 rounded-2xl border border-white/10 text-gray-400 text-xs font-bold hover:bg-white/5 transition-all"
 >
 PANELE DÖN
 </button>
 </div>
 ) : (
 <div className="space-y-6">
 {/* Score Slider */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CV Puanı</label>
 <span className={`text-4xl font-semibold ${score > 70 ? 'text-emerald-400' : score > 40 ? 'text-amber-400' : 'text-red-400'}`}>
 {score}
 </span>
 </div>
 <input
 type="range"
 min="0"
 max="100"
 value={score}
 onChange={(e) => setScore(parseInt(e.target.value))}
 className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500 transition-all hover:bg-white/10"
 />
 <div className="flex justify-between text-xs text-gray-600 mt-2 font-semibold">
 <span>KRİTİK</span>
 <span>İDEAL</span>
 <span>MÜKEMMEL</span>
 </div>
 </div>

 {/* Feedback Area */}
 <div>
 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Uzman Görüşü (Geri Bildirim)</label>
 <textarea
 value={feedback}
 onChange={(e) => setFeedback(e.target.value)}
 rows={5}
 className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner"
 placeholder="CV'nin güçlü ve zayıf yönlerini yazın..."
 />
 </div>

 {/* Action Buttons */}
 <div className="grid grid-cols-2 gap-3 pt-2">
 <button
 disabled={submitting}
 onClick={() => handleComplete(selectedReview._id || selectedReview.id)}
 className="py-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
 >
 {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
 ONAYLA
 </button>
 <button
 disabled={submitting}
 className="py-3.5 rounded-2xl bg-white/5 border border-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center gap-2"
 >
 <ThumbsDown className="w-4 h-4" />
 REDDET
 </button>
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="flex flex-col items-center justify-center py-20 text-center">
 <div className="w-20 h-20 rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500">
 <AlertCircle className="w-10 h-10 text-gray-700" />
 </div>
 <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[200px]">
 İncelemeye başlamak için soldan bir talep seçin.
 </p>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )
}
