import { useState } from 'react'
import { useReview, REVIEW_TYPES } from '../context/ReviewContext'
import {
    X, Check, Zap, User, Crown, Star, Clock, CreditCard,
    FileText, AlertCircle, ChevronRight, Loader2
} from 'lucide-react'

export default function CVReviewRequest({ isOpen, onClose, cv }) {
    const { requestReview, getUserReviews } = useReview() || {}
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState('ai')
    const [notes, setNotes] = useState('')
    const [processing, setProcessing] = useState(false)
    const [completedReview, setCompletedReview] = useState(null)

    const handleRequest = async () => {
        if (!cv?.data || !requestReview) return

        setProcessing(true)
        const result = requestReview(cv.id, cv.data, selectedType, notes)

        if (result.success) {
            setCompletedReview(result.review)
            setStep(3)

            // For AI reviews, wait for completion
            if (selectedType === 'ai') {
                setTimeout(() => {
                    const reviews = getUserReviews?.() || []
                    const updated = reviews.find(r => r.id === result.review.id)
                    if (updated) setCompletedReview(updated)
                }, 3000)
            }
        }

        setProcessing(false)
    }

    if (!isOpen) return null

    const types = Object.values(REVIEW_TYPES)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl glass-card text-white rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">CV İnceleme Servisi</h2>
                                <p className="text-sm text-gray-400">{cv?.name || 'CV'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-500'
                                    }`}>
                                    {step > s ? <Check className="w-4 h-4" /> : s}
                                </div>
                                {s < 3 && (
                                    <div className={`w-16 h-0.5 mx-2 ${step > s ? 'bg-purple-500' : 'bg-white/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Select Type */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg mb-4">İnceleme Türü Seçin</h3>

                            {types.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-4 ${selectedType === type.id
                                        ? 'bg-purple-500/20 border-2 border-purple-500'
                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.id === 'ai' ? 'bg-cyan-500/20' :
                                        type.id === 'expert' ? 'bg-purple-500/20' : 'bg-amber-500/20'
                                        }`}>
                                        {type.id === 'ai' ? <Zap className="w-6 h-6 text-cyan-400" /> :
                                            type.id === 'expert' ? <User className="w-6 h-6 text-purple-400" /> :
                                                <Crown className="w-6 h-6 text-amber-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold">{type.name}</span>
                                            <span className="text-lg font-bold text-purple-400">₺{type.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {type.duration}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {type.features.map((f, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedType === type.id ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
                                        }`}>
                                        {selectedType === type.id && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Notes & Confirm */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">{REVIEW_TYPES[selectedType].name}</span>
                                    <span className="text-xl font-bold text-purple-400">
                                        ₺{REVIEW_TYPES[selectedType].price}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">{REVIEW_TYPES[selectedType].description}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Özel Notlarınız (İsteğe bağlı)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none resize-none"
                                    placeholder="Özellikle dikkat edilmesini istediğiniz noktalar..."
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-amber-400 mb-1">Ödeme Bilgisi</p>
                                        <p className="text-gray-400">
                                            Demo modunda ödeme alınmayacaktır. Gerçek entegrasyon için
                                            ödeme sağlayıcısı (Iyzico, PayTR vb.) entegre edilmelidir.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Result */}
                    {step === 3 && (
                        <div className="text-center py-4">
                            {completedReview?.status === 'completed' && completedReview.feedback ? (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                                        <Check className="w-10 h-10 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">İnceleme Tamamlandı!</h3>
                                        <p className="text-gray-400">AI analiziniz hazır</p>
                                    </div>

                                    {/* Score */}
                                    <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                                        <div className={`text-4xl font-black ${completedReview.feedback.overallScore >= 70 ? 'text-green-400' :
                                            completedReview.feedback.overallScore >= 50 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            {completedReview.feedback.overallScore}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm text-gray-400">Genel Puan</div>
                                            <div className="font-medium">100 üzerinden</div>
                                        </div>
                                    </div>

                                    {/* Sections */}
                                    <div className="space-y-3 text-left">
                                        {completedReview.feedback.sections?.map((section, i) => (
                                            <div key={i} className="p-3 rounded-xl bg-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">{section.name}</span>
                                                    <span className={`font-bold ${section.score >= 70 ? 'text-green-400' :
                                                        section.score >= 50 ? 'text-amber-400' : 'text-red-400'
                                                        }`}>
                                                        {section.score}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${section.score >= 70 ? 'bg-green-500' :
                                                            section.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${section.score}%` }}
                                                    />
                                                </div>
                                                {section.issues.length > 0 && (
                                                    <div className="mt-2 text-sm text-red-400">
                                                        • {section.issues[0]}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Top Suggestions */}
                                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-left">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-cyan-400" />
                                            Öneriler
                                        </h4>
                                        <ul className="space-y-1 text-sm text-gray-300">
                                            {completedReview.feedback.topSuggestions?.map((s, i) => (
                                                <li key={i}>• {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">
                                        {selectedType === 'ai' ? 'AI Analiz Yapılıyor...' : 'Talebiniz Alındı!'}
                                    </h3>
                                    <p className="text-gray-400">
                                        {selectedType === 'ai'
                                            ? 'CV\'niz yapay zeka tarafından inceleniyor'
                                            : `Uzmanımız ${REVIEW_TYPES[selectedType].duration} içinde sizinle iletişime geçecek`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    {step === 1 && (
                        <div className="flex justify-between">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center gap-2"
                            >
                                Devam
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                            >
                                Geri
                            </button>
                            <button
                                onClick={handleRequest}
                                disabled={processing}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        ₺{REVIEW_TYPES[selectedType].price} Öde
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 rounded-xl bg-purple-500 text-white font-bold"
                        >
                            Tamam
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
