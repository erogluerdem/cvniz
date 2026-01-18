import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import {
    X, Camera, Upload, Sparkles, Loader2, CheckCircle, Download,
    Crown, CreditCard, Image, User, Briefcase, Palette, Zap,
    FileText, MessageSquare, Copy, ChevronRight, RefreshCw
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const HEADSHOT_STYLES = [
    { id: 'business_formal', name: 'Business Formal', icon: '👔', description: 'Klasik takım elbise' },
    { id: 'business_casual', name: 'Business Casual', icon: '👕', description: 'Gömlek, modern look' },
    { id: 'creative', name: 'Yaratıcı', icon: '🎨', description: 'Renkli, casual-chic' },
    { id: 'tech', name: 'Tech/Startup', icon: '💻', description: 'Modern, minimalist' },
    { id: 'linkedin', name: 'LinkedIn', icon: '🔵', description: 'Mavi gradient, pro' }
]

const PITCH_PURPOSES = [
    { id: 'jobseeker', name: 'İş Arayan', description: 'Mülakat ve networking için' },
    { id: 'networking', name: 'Networking', description: 'Etkinlik ve tanışmalar için' },
    { id: 'interview', name: 'Mülakat', description: 'İş görüşmeleri için' }
]

const HEADSHOT_PRICE = 199
const BUNDLE_PRICE = 449

export default function AIHeadshot({ isOpen, onClose }) {
    const { token, isPremium } = useAuth()
    const { cvs } = useCV()
    const fileInputRef = useRef(null)

    const [tab, setTab] = useState('headshot') // headshot, bio, pitch
    const [selectedStyle, setSelectedStyle] = useState('business_formal')
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [result, setResult] = useState(null)
    const [credits, setCredits] = useState(0)
    const [error, setError] = useState(null)

    // Bio/Pitch state
    const [selectedCV, setSelectedCV] = useState(null)
    const [pitchPurpose, setPitchPurpose] = useState('jobseeker')
    const [generatedBio, setGeneratedBio] = useState(null)
    const [generatedPitch, setGeneratedPitch] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)

    // Fetch credits
    useEffect(() => {
        if (isOpen && token) {
            fetchCredits()
        }
    }, [isOpen, token])

    const fetchCredits = async () => {
        try {
            const response = await fetch(`${API_URL}/headshot/history`, {
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

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
            setResult(null)
            setError(null)
        }
    }

    // Upload and process
    const handleUpload = async () => {
        if (!selectedFile) return

        if (credits < 1 && !isPremium) {
            setError('credits')
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('photo', selectedFile)
            formData.append('style', selectedStyle)

            const response = await fetch(`${API_URL}/headshot/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })

            if (response.ok) {
                const data = await response.json()
                setResult(data.job)
                if (!isPremium) setCredits(credits - 1)
            } else if (response.status === 403) {
                setError('credits')
            } else {
                const data = await response.json()
                setError(data.error || 'Fotoğraf işlenemedi')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setError('Bağlantı hatası')
        }

        setIsUploading(false)
    }

    // Generate bio
    const handleGenerateBio = async () => {
        if (!selectedCV) return

        setIsGenerating(true)
        setGeneratedBio(null)

        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const response = await fetch(`${API_URL}/headshot/bio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cvData: cv?.data || cv })
            })

            if (response.ok) {
                const data = await response.json()
                setGeneratedBio(data.bio)
            }
        } catch (err) {
            console.error('Bio generation error:', err)
        }

        setIsGenerating(false)
    }

    // Generate elevator pitch
    const handleGeneratePitch = async () => {
        if (!selectedCV) return

        setIsGenerating(true)
        setGeneratedPitch(null)

        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const response = await fetch(`${API_URL}/headshot/elevator-pitch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cvData: cv?.data || cv, purpose: pitchPurpose })
            })

            if (response.ok) {
                const data = await response.json()
                setGeneratedPitch(data)
            }
        } catch (err) {
            console.error('Pitch generation error:', err)
        }

        setIsGenerating(false)
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const resetHeadshot = () => {
        setSelectedFile(null)
        setPreview(null)
        setResult(null)
        setError(null)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">AI Headshot & Bio</h2>
                                <p className="text-sm text-gray-400">Profesyonel fotoğraf ve biyografi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {tab === 'headshot' && (
                                <div className="px-3 py-1.5 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-pink-400" />
                                    <span className="text-sm font-bold text-pink-400">{credits} Kredi</span>
                                </div>
                            )}
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setTab('headshot')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${tab === 'headshot'
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <Camera className="w-4 h-4" />
                            Headshot
                        </button>
                        <button
                            onClick={() => setTab('bio')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${tab === 'bio'
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            LinkedIn Bio
                        </button>
                        <button
                            onClick={() => setTab('pitch')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${tab === 'pitch'
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Elevator Pitch
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[65vh] overflow-y-auto">
                    {/* Credits Error */}
                    {error === 'credits' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-10 h-10 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Kredi Gerekli</h3>
                            <p className="text-gray-400 mb-6">
                                Profesyonel headshot oluşturmak için kredi gerekli
                            </p>

                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-2xl font-bold text-pink-400">1</div>
                                    <div className="text-xs text-gray-500">fotoğraf</div>
                                    <div className="text-lg font-semibold mt-1">{HEADSHOT_PRICE}₺</div>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-center relative">
                                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                                        Tasarruf!
                                    </span>
                                    <div className="text-2xl font-bold text-pink-400">3</div>
                                    <div className="text-xs text-gray-500">fotoğraf</div>
                                    <div className="text-lg font-semibold mt-1">{BUNDLE_PRICE}₺</div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <Link
                                    to="/pricing?product=headshot"
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Kredi Satın Al
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

                    {/* Headshot Tab */}
                    {tab === 'headshot' && error !== 'credits' && (
                        <div className="space-y-6">
                            {!result ? (
                                <>
                                    {/* Upload Area */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${preview
                                            ? 'border-pink-500/50 bg-pink-500/5'
                                            : 'border-white/20 hover:border-pink-500/50 hover:bg-white/5'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        {preview ? (
                                            <div className="flex items-center justify-center gap-8">
                                                <div className="relative">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="w-48 h-48 object-cover rounded-2xl"
                                                    />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); resetHeadshot(); }}
                                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-6xl">→</div>
                                                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                                    <Sparkles className="w-12 h-12 text-pink-400" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-bold mb-2">Selfie Yükle</h3>
                                                <p className="text-sm text-gray-400">
                                                    Yüzünüzün net göründüğü bir fotoğraf seçin
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    JPEG, PNG veya WebP • Max 10MB
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Style Selection */}
                                    {preview && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                                🎨 Stil Seçin
                                            </label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {HEADSHOT_STYLES.map(style => (
                                                    <button
                                                        key={style.id}
                                                        onClick={() => setSelectedStyle(style.id)}
                                                        className={`p-3 rounded-xl text-center transition-all ${selectedStyle === style.id
                                                            ? 'bg-pink-500/20 border-2 border-pink-500'
                                                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <div className="text-2xl mb-1">{style.icon}</div>
                                                        <div className="text-xs font-medium">{style.name}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && error !== 'credits' && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    {preview && (
                                        <div className="text-center">
                                            <button
                                                onClick={handleUpload}
                                                disabled={isUploading}
                                                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-pink-500/20 transition-all disabled:opacity-50"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-6 h-6" />
                                                )}
                                                Profesyonel Fotoğraf Oluştur
                                            </button>
                                            <p className="text-xs text-gray-500 mt-3">
                                                {isPremium ? 'Premium üye - ücretsiz' : `1 kredi kullanılacak (${HEADSHOT_PRICE}₺)`}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Result */
                                <div className="text-center py-8">
                                    <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden mb-6 shadow-2xl">
                                        <img
                                            src={result.resultUrl || preview}
                                            alt="Processed"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Fotoğrafınız Hazır! 🎉</h3>
                                    <p className="text-gray-400 mb-6">Profesyonel headshot'ınız oluşturuldu</p>

                                    <div className="flex gap-3 justify-center">
                                        <a
                                            href={result.resultUrl || preview}
                                            download="headshot.jpg"
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
                                            İndir
                                        </a>
                                        <button
                                            onClick={resetHeadshot}
                                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Yeni Fotoğraf
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bio Tab */}
                    {tab === 'bio' && (
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
                                                ? 'bg-pink-500/20 border-2 border-pink-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium">{cv.name}</div>
                                            <div className="text-sm text-gray-400">{cv.template}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="text-center">
                                <button
                                    onClick={handleGenerateBio}
                                    disabled={!selectedCV || isGenerating}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center gap-2 mx-auto disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-5 h-5" />
                                    )}
                                    LinkedIn "Hakkında" Oluştur
                                </button>
                            </div>

                            {/* Result */}
                            {generatedBio && (
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            LinkedIn Biyografiniz
                                        </h4>
                                        <button
                                            onClick={() => handleCopy(generatedBio.content)}
                                            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm flex items-center gap-1"
                                        >
                                            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                            {copied ? 'Kopyalandı' : 'Kopyala'}
                                        </button>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{generatedBio.content}</p>
                                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                                        <span>{generatedBio.characterCount} karakter</span>
                                        <span>Sektör: {generatedBio.industry}</span>
                                    </div>

                                    {generatedBio.suggestions && (
                                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <h5 className="text-sm font-bold text-amber-400 mb-2">💡 İyileştirme Önerileri</h5>
                                            <ul className="text-xs text-gray-400 space-y-1">
                                                {generatedBio.suggestions.map((s, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <ChevronRight className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pitch Tab */}
                    {tab === 'pitch' && (
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
                                                ? 'bg-pink-500/20 border-2 border-pink-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium">{cv.name}</div>
                                            <div className="text-sm text-gray-400">{cv.template}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Purpose Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    🎯 Kullanım Amacı
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {PITCH_PURPOSES.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPitchPurpose(p.id)}
                                            className={`p-3 rounded-xl text-center transition-all ${pitchPurpose === p.id
                                                ? 'bg-pink-500/20 border-2 border-pink-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium text-sm">{p.name}</div>
                                            <div className="text-xs text-gray-500">{p.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="text-center">
                                <button
                                    onClick={handleGeneratePitch}
                                    disabled={!selectedCV || isGenerating}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center gap-2 mx-auto disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <MessageSquare className="w-5 h-5" />
                                    )}
                                    30 Saniyelik Pitch Oluştur
                                </button>
                            </div>

                            {/* Result */}
                            {generatedPitch && (
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            Asansör Konuşmanız
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{generatedPitch.duration}</span>
                                            <button
                                                onClick={() => handleCopy(generatedPitch.pitch)}
                                                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm flex items-center gap-1"
                                            >
                                                {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                {copied ? 'Kopyalandı' : 'Kopyala'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-lg italic">
                                        "{generatedPitch.pitch}"
                                    </p>
                                    <div className="mt-4 text-xs text-gray-500">
                                        {generatedPitch.wordCount} kelime
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
