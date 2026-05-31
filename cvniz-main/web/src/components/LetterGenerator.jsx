import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import {
    X, FileText, Mail, Users, Sparkles, Loader2, CheckCircle,
    Copy, Download, Crown, Lock, ChevronRight, Edit3, Send,
    Briefcase, Building, Award, Heart, GraduationCap
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const COVER_LETTER_STYLES = [
    { id: 'professional', name: 'Profesyonel', icon: Briefcase, description: 'Kurumsal ve ciddi ton' },
    { id: 'creative', name: 'Yaratıcı', icon: Heart, description: 'Dinamik ve samimi ton' },
    { id: 'formal', name: 'Resmi', icon: Award, description: 'Geleneksel ve resmi ton' }
]

const REFERENCE_TYPES = [
    { id: 'recommendation', name: 'Tavsiye Mektubu', icon: Award, description: 'İş başvuruları için' },
    { id: 'character', name: 'Karakter Referansı', icon: Heart, description: 'Kişisel özellikler için' },
    { id: 'academic', name: 'Akademik Referans', icon: GraduationCap, description: 'Akademik başvurular için' }
]

export default function LetterGenerator({ isOpen, onClose }) {
    const { isPremium, token } = useAuth()
    const { cvs } = useCV()

    const [tab, setTab] = useState('cover') // cover, reference
    const [selectedCV, setSelectedCV] = useState(null)
    const [style, setStyle] = useState('professional')
    const [referenceType, setReferenceType] = useState('recommendation')
    const [jobUrl, setJobUrl] = useState('')
    const [targetPosition, setTargetPosition] = useState('')
    const [targetCompany, setTargetCompany] = useState('')
    const [jobData, setJobData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    // Generate letter
    const handleGenerate = async () => {
        if (!selectedCV) {
            setError('Lütfen bir CV seçin')
            return
        }

        setIsLoading(true)
        setError(null)
        setResult(null)

        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const endpoint = tab === 'cover' ? '/api/letters/cover' : '/api/letters/reference'

            const body = {
                cvData: cv?.data || cv,
                style: tab === 'cover' ? style : undefined,
                referenceType: tab === 'reference' ? referenceType : undefined,
                jobData: jobData || {
                    title: targetPosition || 'İş Pozisyonu',
                    company: targetCompany || undefined
                },
                targetPosition: targetPosition || undefined
            }

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            if (response.ok) {
                const data = await response.json()
                setResult(tab === 'cover' ? data.coverLetter : data.referenceLetter)
            } else if (response.status === 403) {
                setError('subscription')
            } else {
                const data = await response.json()
                setError(data.error || 'Mektup oluşturulamadı')
            }
        } catch (err) {
            console.error('Letter generation error:', err)
            setError('Bağlantı hatası')
        }

        setIsLoading(false)
    }

    // Copy to clipboard
    const handleCopy = () => {
        if (result?.content) {
            navigator.clipboard.writeText(result.content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Download as TXT
    const handleDownload = () => {
        if (result?.content) {
            const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = tab === 'cover' ? 'niyet-mektubu.txt' : 'referans-mektubu.txt'
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    const resetFlow = () => {
        setResult(null)
        setError(null)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Mektup Oluşturucu
                                    <Crown className="w-4 h-4 text-amber-400" />
                                </h2>
                                <p className="text-sm text-gray-400">Niyet & Referans Mektupları</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => { setTab('cover'); resetFlow(); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${tab === 'cover'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Niyet Mektubu
                        </button>
                        <button
                            onClick={() => { setTab('reference'); resetFlow(); }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${tab === 'reference'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Referans Mektubu
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Subscription Error */}
                    {error === 'subscription' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-10 h-10 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Abonelik Gerekli</h3>
                            <p className="text-gray-400 mb-6">
                                Mektup oluşturma özelliği Pro abonelik gerektirir
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link
                                    to="/pricing"
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center gap-2"
                                >
                                    <Crown className="w-5 h-5" />
                                    Pro'ya Yükselt
                                </Link>
                                <button
                                    onClick={() => setError(null)}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                >
                                    Geri
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input Form */}
                    {!result && error !== 'subscription' && (
                        <div className="space-y-6">
                            {/* CV Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    📄 CV Seçin
                                </label>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {cvs?.map(cv => (
                                        <button
                                            key={cv.id}
                                            onClick={() => setSelectedCV(cv.id)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedCV === cv.id
                                                ? 'bg-indigo-500/20 border-2 border-indigo-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium">{cv.name}</div>
                                            <div className="text-sm text-gray-400">{cv.template}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Style/Type Selection */}
                            {tab === 'cover' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                                        ✍️ Mektup Stili
                                    </label>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        {COVER_LETTER_STYLES.map(s => {
                                            const Icon = s.icon
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setStyle(s.id)}
                                                    className={`p-4 rounded-xl text-left transition-all ${style === s.id
                                                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <Icon className={`w-5 h-5 mb-2 ${style === s.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                                                    <div className="font-medium">{s.name}</div>
                                                    <div className="text-xs text-gray-500">{s.description}</div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                                        📜 Referans Türü
                                    </label>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        {REFERENCE_TYPES.map(r => {
                                            const Icon = r.icon
                                            return (
                                                <button
                                                    key={r.id}
                                                    onClick={() => setReferenceType(r.id)}
                                                    className={`p-4 rounded-xl text-left transition-all ${referenceType === r.id
                                                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <Icon className={`w-5 h-5 mb-2 ${referenceType === r.id ? 'text-indigo-400' : 'text-gray-400'}`} />
                                                    <div className="font-medium">{r.name}</div>
                                                    <div className="text-xs text-gray-500">{r.description}</div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Target Info */}
                            {tab === 'cover' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Hedef Pozisyon</label>
                                        <input
                                            type="text"
                                            value={targetPosition}
                                            onChange={(e) => setTargetPosition(e.target.value)}
                                            placeholder="Yazılım Mühendisi"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Şirket Adı</label>
                                        <input
                                            type="text"
                                            value={targetCompany}
                                            onChange={(e) => setTargetCompany(e.target.value)}
                                            placeholder="ABC Teknoloji"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {tab === 'reference' && (
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    <div className="flex items-start gap-3">
                                        <Send className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Nasıl Kullanılır?</h4>
                                            <p className="text-sm text-gray-400">
                                                Oluşturulan taslağı eski yöneticinize gönderin. Köşeli parantezleri doldurup imzalamasını isteyin.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && error !== 'subscription' && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Generate Button */}
                            <div className="text-center">
                                <button
                                    onClick={handleGenerate}
                                    disabled={!selectedCV || isLoading}
                                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-6 h-6" />
                                    )}
                                    {tab === 'cover' ? 'Niyet Mektubu Oluştur' : 'Referans Taslağı Oluştur'}
                                </button>
                                {!isPremium && (
                                    <p className="text-xs text-amber-400 mt-3 flex items-center justify-center gap-1">
                                        <Crown className="w-3 h-3" /> Pro abonelik gerektirir
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    {tab === 'cover' ? 'Niyet Mektubunuz Hazır!' : 'Referans Taslağı Hazır!'}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-1 text-sm"
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Kopyalandı' : 'Kopyala'}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-1 text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        İndir
                                    </button>
                                </div>
                            </div>

                            {/* Letter Content */}
                            <div className="p-6 rounded-xl bg-white/5 border border-white/10 font-serif text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {result.content}
                            </div>

                            {/* Instructions for reference */}
                            {tab === 'reference' && result.instructions && (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-sm text-amber-300">
                                        💡 {result.instructions}
                                    </p>
                                </div>
                            )}

                            {/* New Letter Button */}
                            <div className="text-center pt-4">
                                <button
                                    onClick={resetFlow}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    Yeni Mektup Oluştur
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
