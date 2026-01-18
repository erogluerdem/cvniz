import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import {
    X, Link2, Target, Sparkles, Loader2, CheckCircle, AlertCircle,
    FileText, ChevronRight, Zap, CreditCard, ExternalLink, Award,
    Copy, Download, ArrowRight, Tag, Briefcase, Building, Crown
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const CREDIT_PRICE = 49.90

export default function TargetFitAI({ isOpen, onClose }) {
    const { token } = useAuth()
    const { cvs, refreshCVs } = useCV()

    const [step, setStep] = useState('input') // input, analyzing, preview, success
    const [selectedCV, setSelectedCV] = useState(null)
    const [jobUrl, setJobUrl] = useState('')
    const [jobText, setJobText] = useState('')
    const [inputMode, setInputMode] = useState('url') // url, text
    const [isLoading, setIsLoading] = useState(false)
    const [jobData, setJobData] = useState(null)
    const [credits, setCredits] = useState(0)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    // Fetch credits on mount
    useEffect(() => {
        if (isOpen && token) {
            fetchCredits()
        }
    }, [isOpen, token])

    const fetchCredits = async () => {
        try {
            const response = await fetch(`${API_URL}/target-fit/credits`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setCredits(data.credits)
            }
        } catch (err) {
            console.error('Credits fetch error:', err)
        }
    }

    // Analyze job listing
    const handleAnalyze = async () => {
        if (!selectedCV) {
            setError('Lütfen bir CV seçin')
            return
        }
        if (inputMode === 'url' && !jobUrl.trim()) {
            setError('Lütfen iş ilanı linkini girin')
            return
        }
        if (inputMode === 'text' && !jobText.trim()) {
            setError('Lütfen iş ilanı metnini girin')
            return
        }

        setIsLoading(true)
        setError(null)
        setStep('analyzing')

        try {
            const response = await fetch(`${API_URL}/target-fit/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobUrl: inputMode === 'url' ? jobUrl : null,
                    jobText: inputMode === 'text' ? jobText : null
                })
            })

            if (response.ok) {
                const data = await response.json()
                setJobData(data.jobData)
                setStep('preview')
            } else {
                const data = await response.json()
                setError(data.error || 'İlan analiz edilemedi')
                setStep('input')
            }
        } catch (err) {
            console.error('Analysis error:', err)
            setError('Bağlantı hatası')
            setStep('input')
        }

        setIsLoading(false)
    }

    // Tailor CV
    const handleTailor = async () => {
        if (credits < 1) {
            setError('credits')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/target-fit/tailor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cvId: selectedCV,
                    jobUrl: inputMode === 'url' ? jobUrl : null,
                    jobText: inputMode === 'text' ? jobText : null,
                    jobData
                })
            })

            if (response.ok) {
                const data = await response.json()
                setResult(data)
                setCredits(data.creditsRemaining)
                setStep('success')
                refreshCVs?.()
            } else if (response.status === 403) {
                setError('credits')
            } else {
                const data = await response.json()
                setError(data.error || 'CV düzenlenemedi')
            }
        } catch (err) {
            console.error('Tailoring error:', err)
            setError('Bağlantı hatası')
        }

        setIsLoading(false)
    }

    const resetFlow = () => {
        setStep('input')
        setJobData(null)
        setResult(null)
        setError(null)
        setJobUrl('')
        setJobText('')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Target-Fit AI</h2>
                                <p className="text-sm text-gray-400">İlana özel CV oluştur</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Credit display */}
                            <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-purple-400" />
                                <span className="text-sm font-bold text-purple-400">{credits} Kredi</span>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Error: No credits */}
                    {error === 'credits' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-10 h-10 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Kredi Gerekli</h3>
                            <p className="text-gray-400 mb-6">
                                Her CV düzenleme 1 kredi harcar ({CREDIT_PRICE}₺)
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    to="/pricing?product=target-fit"
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Kredi Satın Al
                                </Link>
                                <button
                                    onClick={() => setError(null)}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                >
                                    Geri Dön
                                </button>
                            </div>

                            {/* Package options */}
                            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
                                {[
                                    { credits: 1, price: 49.90 },
                                    { credits: 5, price: 199, discount: '20%' },
                                    { credits: 10, price: 349, discount: '30%' }
                                ].map(pkg => (
                                    <div key={pkg.credits} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center relative">
                                        {pkg.discount && (
                                            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                                                {pkg.discount}
                                            </span>
                                        )}
                                        <div className="text-2xl font-bold text-purple-400">{pkg.credits}</div>
                                        <div className="text-xs text-gray-500">kredi</div>
                                        <div className="text-sm font-semibold mt-1">{pkg.price}₺</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 1: Input */}
                    {step === 'input' && error !== 'credits' && (
                        <div className="space-y-6">
                            {/* Info Card */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Nasıl Çalışır?</h4>
                                        <p className="text-sm text-gray-400">
                                            1. İş ilanı linkini yapıştırın → 2. AI anahtar kelimeleri çıkarır →
                                            3. CV'niz saniyeler içinde o ilana özel hale getirilir
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CV Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    📄 Düzenlenecek CV
                                </label>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {cvs?.map(cv => (
                                        <button
                                            key={cv.id}
                                            onClick={() => setSelectedCV(cv.id)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedCV === cv.id
                                                ? 'bg-purple-500/20 border-2 border-purple-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium">{cv.name}</div>
                                            <div className="text-sm text-gray-400">{cv.template}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Mode Toggle */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    🎯 İş İlanı
                                </label>
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setInputMode('url')}
                                        className={`px-4 py-2 rounded-lg transition-all ${inputMode === 'url'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <Link2 className="w-4 h-4 inline mr-2" />
                                        Link ile
                                    </button>
                                    <button
                                        onClick={() => setInputMode('text')}
                                        className={`px-4 py-2 rounded-lg transition-all ${inputMode === 'text'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Metin ile
                                    </button>
                                </div>

                                {inputMode === 'url' ? (
                                    <input
                                        type="url"
                                        value={jobUrl}
                                        onChange={(e) => setJobUrl(e.target.value)}
                                        placeholder="https://kariyer.net/is-ilani/..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none"
                                    />
                                ) : (
                                    <textarea
                                        value={jobText}
                                        onChange={(e) => setJobText(e.target.value)}
                                        placeholder="İş ilanı metnini buraya yapıştırın..."
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none resize-none"
                                    />
                                )}

                                <p className="text-xs text-gray-500 mt-2">
                                    Desteklenen siteler: Kariyer.net, LinkedIn, Indeed, SecretCV, Yenibiriş
                                </p>
                            </div>

                            {/* Error display */}
                            {error && error !== 'credits' && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Analyze Button */}
                            <div className="text-center">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!selectedCV || isLoading}
                                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
                                >
                                    <Target className="w-6 h-6" />
                                    İlanı Analiz Et
                                </button>
                                <p className="text-xs text-gray-500 mt-3">
                                    Analiz ücretsiz • Düzenleme 1 kredi ({CREDIT_PRICE}₺)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Analyzing */}
                    {step === 'analyzing' && (
                        <div className="text-center py-16">
                            <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
                            <h3 className="text-lg font-bold mb-2">İlan Analiz Ediliyor...</h3>
                            <p className="text-gray-400">Anahtar kelimeler ve gereksinimler çıkarılıyor</p>
                        </div>
                    )}

                    {/* Step 3: Preview */}
                    {step === 'preview' && jobData && (
                        <div className="space-y-6">
                            {/* Job Summary */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white">{jobData.title || 'İş İlanı'}</h3>
                                        {jobData.company && (
                                            <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                                                <Building className="w-4 h-4" />
                                                {jobData.company}
                                            </div>
                                        )}
                                        {jobData.url && (
                                            <a
                                                href={jobData.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 text-sm flex items-center gap-1 mt-1 hover:underline"
                                            >
                                                <ExternalLink className="w-3 h-3" /> İlanı Görüntüle
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Extracted Keywords */}
                            {jobData.skills?.length > 0 && (
                                <div>
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <Tag className="w-5 h-5 text-cyan-400" />
                                        Tespit Edilen Anahtar Kelimeler ({jobData.skills.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {jobData.skills.slice(0, 15).map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Requirements */}
                            {jobData.requirements?.length > 0 && (
                                <div>
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        Gereksinimler ({jobData.requirements.length})
                                    </h4>
                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {jobData.requirements.slice(0, 8).map((req, i) => (
                                            <div key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                                {req}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* What will happen */}
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                <h4 className="font-bold mb-2 text-purple-400">AI Ne Yapacak?</h4>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        Profesyonel özet bu ilana göre yeniden yazılacak
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        İlgili deneyimler öne çıkarılacak
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        Beceriler ilana uygun sıralanacak
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        Anahtar kelimeler doğal şekilde eklenecek
                                    </li>
                                </ul>
                            </div>

                            {/* Tailor Button */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setStep('input')}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={handleTailor}
                                    disabled={isLoading}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Zap className="w-5 h-5" />
                                    )}
                                    CV'yi Düzenle (1 Kredi)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && result && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">CV Hazır! 🎉</h3>
                            <p className="text-gray-400 mb-6">
                                "{result.tailoredCV?.name}" olarak kaydedildi
                            </p>

                            {/* Changes Made */}
                            {result.changes?.length > 0 && (
                                <div className="text-left max-w-md mx-auto mb-6">
                                    <h4 className="font-bold mb-3 text-center">Yapılan Değişiklikler</h4>
                                    <div className="space-y-2">
                                        {result.changes.map((change, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-white/5 flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-300">{change.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Link
                                    to={`/editor/${result.tailoredCV?.id || result.tailoredCV?._id}`}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold flex items-center gap-2"
                                >
                                    <FileText className="w-5 h-5" />
                                    CV'yi İncele
                                </Link>
                                <button
                                    onClick={resetFlow}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                    Başka İlan için Düzenle
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                Kalan kredi: {result.creditsRemaining}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
