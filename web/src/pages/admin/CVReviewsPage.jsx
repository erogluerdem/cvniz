import { useState, useEffect } from 'react'
import { FileSearch, Star, Check, X, Clock, User, MessageCircle, Eye, ThumbsUp, ThumbsDown, Loader2, Search, Filter, AlertCircle, ChevronRight, Layout, TrendingUp } from 'lucide-react'
import { reviewAPI } from '../../services/api'
import { StatusBadge, FilterTabs } from '../../components/admin/SharedComponents'
import { Link, useOutletContext } from 'react-router-dom'

export default function CVReviewsPage() {
  const { isDayMode } = useOutletContext() || { isDayMode: false }
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
          <h2 className={`text-2xl font-bold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>CV Analiz Merkezi</h2>
          <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Uzman görüşü bekleyen özgeçmişleri değerlendirin ve puanlayın.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Talep', val: stats.total, icon: <FileSearch className="text-purple-500" />, color: 'purple' },
          { label: 'Sıradakiler', val: stats.pending, icon: <Clock className="text-amber-500" />, color: 'amber' },
          { label: 'Aktif İnceleme', val: stats.inReview, icon: <Eye className="text-blue-500" />, color: 'blue' },
          { label: 'Yanıtlandı', val: stats.completed, icon: <Check className="text-emerald-500" />, color: 'emerald' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div>
              <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</div>
              <div className={`text-2xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.val}</div>
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
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <FilterTabs
                tabs={[
                  { id: 'all', label: 'Tümü' },
                  { id: 'pending', label: 'Sıradakiler' },
                  { id: 'in_review', label: 'İncelenenler' },
                  { id: 'completed', label: 'Bitmiş' }
                ]}
                activeTab={activeFilter}
                onChange={setActiveFilter}
              />
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İsim veya mail ara..."
                className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
              />
            </div>
          </div>

          {/* Talepler Listesi */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
              <span className={`font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Talepler getiriliyor...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div
                  key={review._id || review.id}
                  onClick={() => setSelectedReview(review)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer group ${isDayMode ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' : 'glass-card border-white/5 hover:border-white/10'} ${selectedReview?._id === review._id || selectedReview?.id === review.id
                      ? (isDayMode ? 'border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500' : 'border-cyan-500/50 bg-cyan-500/5 shadow-neon-cyan')
                      : ''
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <FileSearch className={`w-6 h-6 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h4 className={`font-bold group-hover:text-cyan-500 transition-colors uppercase tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                          {review.cvId?.name || 'İsimsiz CV'}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          <User className="w-3 h-3" />
                          {review.userId?.name} <span className="opacity-30">|</span> {review.userId?.email}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-${statusConfig[review.status]?.color}-500/10 text-${statusConfig[review.status]?.color}-500 border border-${statusConfig[review.status]?.color}-500/20 shadow-sm`}>
                      {statusConfig[review.status]?.icon}
                      {statusConfig[review.status]?.label}
                    </div>
                  </div>

                  {review.notes && (
                    <div className={`px-4 py-3 rounded-xl text-xs mb-4 border flex items-start gap-3 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                      <MessageCircle className="w-4 h-4 text-slate-400 dark:text-gray-600 shrink-0" />
                      "{review.notes}"
                    </div>
                  )}

                  <div className={`flex items-center justify-between pt-4 border-t ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className={`text-xs uppercase font-semibold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>İstek Tarihi</span>
                        <span className={`text-xs ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      {review.status === 'completed' && (
                        <div className="flex flex-col">
                          <span className={`text-xs uppercase font-semibold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>Verilen Puan</span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {review.score}/100
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartReview(review._id || review.id); }}
                          className="px-4 py-1.5 rounded-xl bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
                        >
                          İncelemeye Başla
                        </button>
                      )}
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 group-hover:text-cyan-600' : 'bg-white/5 border-white/10 text-gray-500 group-hover:text-cyan-400'}`}>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <div className={`py-20 text-center rounded-2xl border border-dashed ${isDayMode ? 'bg-white border-slate-200' : 'glass-card border-white/10'}`}>
                  <FileSearch className="w-12 h-12 text-slate-400 dark:text-gray-600 mx-auto mb-3 opacity-20" />
                  <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Bu kriterlere uygun analiz talebi bulunamadı.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Review Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 h-fit">
          <div className={`rounded-3xl border p-6 shadow-2xl overflow-hidden relative group ${isDayMode ? 'bg-white border-slate-200' : 'glass-card border-white/10'}`}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
              </div>
              <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>İnceleme Paneli</h3>
            </div>

            {selectedReview ? (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                  <div className={`text-xs uppercase font-semibold tracking-wider mb-1 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Şu an İnceleniyor</div>
                  <div className={`font-bold text-lg leading-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedReview.cvId?.name}</div>
                  <div className="text-xs text-cyan-500 font-medium mt-0.5">{selectedReview.userId?.name}</div>
                </div>

                {selectedReview.status === 'completed' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-emerald-500">ANALİZ TAMAMLANDI</span>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-4 h-4 fill-amber-500" />
                          {selectedReview.score}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>
                        "{selectedReview.feedback}"
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className={`w-full py-3 rounded-2xl border text-xs font-bold transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                    >
                      PANELE DÖN
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Score Slider */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>CV Puanı</label>
                        <span className={`text-4xl font-semibold ${score > 70 ? 'text-emerald-500' : score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                          {score}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500 transition-all"
                      />
                      <div className={`flex justify-between text-xs mt-2 font-semibold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        <span>KRİTİK</span>
                        <span>İDEAL</span>
                        <span>MÜKEMMEL</span>
                      </div>
                    </div>

                    {/* Feedback Area */}
                    <div>
                      <label className={`text-xs font-semibold uppercase tracking-wider block mb-3 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Uzman Görüşü (Geri Bildirim)</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        className={`w-full border rounded-2xl p-4 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white placeholder-gray-600'}`}
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
                        className={`py-3.5 rounded-2xl border text-red-500 text-xs font-semibold uppercase tracking-wider hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 ${isDayMode ? 'bg-red-50 border-red-200' : 'bg-white/5 border-white/10'}`}
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
                <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500 ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-dashed border-white/10'}`}>
                  <AlertCircle className={`w-10 h-10 ${isDayMode ? 'text-slate-300' : 'text-gray-700'}`} />
                </div>
                <p className={`text-sm font-medium leading-relaxed max-w-[200px] ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
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
