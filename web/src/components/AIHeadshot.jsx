import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
    X, Camera, Upload, Sparkles, Loader2, CheckCircle, Download,
    Crown, CreditCard, Image, User, Briefcase, Palette, Zap,
    FileText, MessageSquare, Copy, ChevronRight, RefreshCw, Check
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
                toast.success('Fotoğraf başarıyla oluşturuldu!')
            } else if (response.status === 403) {
                setError('credits')
            } else {
                const data = await response.json()
                setError(data.error || 'Fotoğraf işlenemedi')
                toast.error(data.error || 'Fotoğraf işlenemedi')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setError('Bağlantı hatası')
            toast.error('Bağlantı hatası')
        }

        setIsUploading(false)
    }

    // Generate bio
    const handleGenerateBio = async () => {
        if (!selectedCV) {
            toast.error('Lütfen bir CV seçin')
            return
        }

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
                toast.success('Bio oluşturuldu!')
            } else {
                toast.error('Bio oluşturulamadı')
            }
        } catch (err) {
            console.error('Bio generation error:', err)
            toast.error('Bağlantı hatası')
        }

        setIsGenerating(false)
    }

    // Generate elevator pitch
    const handleGeneratePitch = async () => {
        if (!selectedCV) {
            toast.error('Lütfen bir CV seçin')
            return
        }

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
                toast.success('Elevator Pitch oluşturuldu!')
            } else {
                toast.error('Elevator Pitch oluşturulamadı')
            }
        } catch (err) {
            console.error('Pitch generation error:', err)
            toast.error('Bağlantı hatası')
        }

        setIsGenerating(false)
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Panoya kopyalandı!')
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
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden my-4 flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Camera className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    AI Profil & Bio <Sparkles size={16} className="text-[#10B981]" />
                                </h2>
                                <p className="text-sm text-gray-400">Profesyonel fotoğraf ve biyografi</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto relative z-10">
                            {tab === 'headshot' && (
                                <div className="px-4 py-2 rounded-xl bg-black/40 border border-[#10B981]/30 flex items-center gap-2 shadow-inner">
                                    <CreditCard className="w-4 h-4 text-[#10B981]" />
                                    <span className="text-sm font-bold text-white">{credits} Kredi</span>
                                </div>
                            )}
                            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-4 border-b border-white/5 bg-black/20 overflow-x-auto scrollbar-none">
                        <button
                            onClick={() => setTab('headshot')}
                            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold whitespace-nowrap ${tab === 'headshot'
                                ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Camera className="w-4 h-4" />
                            Headshot
                        </button>
                        <button
                            onClick={() => setTab('bio')}
                            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold whitespace-nowrap ${tab === 'bio'
                                ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            LinkedIn Bio
                        </button>
                        <button
                            onClick={() => setTab('pitch')}
                            className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold whitespace-nowrap ${tab === 'pitch'
                                ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Elevator Pitch
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        
                        {/* Credits Error Section */}
                        {error === 'credits' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 max-w-lg mx-auto"
                            >
                                <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <CreditCard className="w-10 h-10 text-[#10B981]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Kredi Gerekli</h3>
                                <p className="text-gray-400 mb-8">
                                    Profesyonel headshot oluşturmak için krediniz bulunmuyor.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 text-center transition-all hover:border-white/10">
                                        <div className="text-3xl font-bold text-white mb-1">1</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Fotoğraf</div>
                                        <div className="text-xl font-bold text-[#10B981]">{HEADSHOT_PRICE}₺</div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 text-center relative transition-all hover:border-[#10B981]/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#10B981] text-black text-xs font-bold rounded-full whitespace-nowrap shadow-md">
                                            Popüler Seçim
                                        </span>
                                        <div className="text-3xl font-bold text-white mb-1">3</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Fotoğraf</div>
                                        <div className="text-xl font-bold text-[#10B981]">{BUNDLE_PRICE}₺</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => setError(null)}
                                        className="px-6 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                                    >
                                        Geri Dön
                                    </button>
                                    <Link
                                        to="/pricing?product=headshot"
                                        className="px-8 py-4 rounded-xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Kredi Satın Al
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {/* Headshot Tab */}
                            {tab === 'headshot' && error !== 'credits' && (
                                <motion.div
                                    key="headshot"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {!result ? (
                                        <>
                                            {/* Upload Area */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`relative border-2 border-dashed rounded-3xl p-10 md:p-12 text-center cursor-pointer transition-all duration-300 ${
                                                    preview
                                                    ? 'border-[#10B981]/50 bg-[#10B981]/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                                                    : 'border-white/10 hover:border-[#10B981]/50 hover:bg-[#10B981]/5'
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
                                                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                                        <div className="relative group">
                                                            <img
                                                                src={preview}
                                                                alt="Preview"
                                                                className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-xl"
                                                            />
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); resetHeadshot(); }}
                                                                className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                        <div className="text-4xl text-gray-500 rotate-90 md:rotate-0">→</div>
                                                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 flex items-center justify-center border border-[#10B981]/30 relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-[#10B981]/10 blur-xl"></div>
                                                            <Sparkles className="w-16 h-16 text-[#10B981] relative z-10" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-8">
                                                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                                            <Upload className="w-10 h-10 text-gray-400" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white mb-2">Fotoğrafınızı Yükleyin</h3>
                                                        <p className="text-gray-400 mb-4">
                                                            Yüzünüzün net göründüğü, iyi ışıklandırılmış bir selfie seçin.
                                                        </p>
                                                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-medium tracking-wide">
                                                            JPEG, PNG veya WebP • Max 10MB
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Style Selection */}
                                            {preview && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-black/20 border border-white/5 rounded-3xl p-6"
                                                >
                                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                        <Palette className="w-5 h-5 text-[#10B981]" /> Stil Seçimi
                                                    </label>
                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                        {HEADSHOT_STYLES.map(style => (
                                                            <button
                                                                key={style.id}
                                                                onClick={() => setSelectedStyle(style.id)}
                                                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${selectedStyle === style.id
                                                                    ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                                    : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                                                                    }`}
                                                            >
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                                                                    selectedStyle === style.id ? 'bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-black/40 text-gray-400'
                                                                }`}>
                                                                    {style.icon}
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className={`font-bold text-sm mb-1 ${selectedStyle === style.id ? 'text-[#10B981]' : 'text-white'}`}>{style.name}</div>
                                                                    <div className="text-xs text-gray-500 line-clamp-1">{style.description}</div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Error */}
                                            {error && error !== 'credits' && (
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                    {error}
                                                </div>
                                            )}

                                            {/* Generate Button */}
                                            {preview && (
                                                <div className="text-center pt-4">
                                                    <button
                                                        onClick={handleUpload}
                                                        disabled={isUploading}
                                                        className="w-full md:w-auto md:min-w-[300px] px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-3 mx-auto hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                                    >
                                                        {isUploading ? (
                                                            <><Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...</>
                                                        ) : (
                                                            <><Sparkles className="w-5 h-5" /> Oluştur (1 Kredi)</>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        /* Result Display */
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center"
                                        >
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/20 mb-6">
                                                <CheckCircle className="w-8 h-8 text-[#10B981]" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">İşlem Başarılı!</h3>
                                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                                Fotoğrafınız işleniyor. Hazır olduğunda email ile bilgilendirileceksiniz ve panelinizde görebileceksiniz.
                                            </p>

                                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 max-w-sm mx-auto mb-8">
                                                <div className="w-32 h-32 mx-auto relative mb-6">
                                                    <div className="absolute inset-0 border-4 border-[#10B981]/30 border-t-[#10B981] rounded-full animate-spin"></div>
                                                    <div className="absolute inset-2 bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-full flex items-center justify-center">
                                                        <Image className="w-10 h-10 text-[#10B981]" />
                                                    </div>
                                                </div>
                                                <div className="font-bold text-white">Tahmini Süre: ~2 Dk</div>
                                                <div className="text-sm text-gray-500">Stil: {HEADSHOT_STYLES.find(s => s.id === result.style)?.name}</div>
                                            </div>

                                            <button
                                                onClick={resetHeadshot}
                                                className="px-8 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                                            >
                                                Yeni Fotoğraf Yükle
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* LinkedIn Bio Tab */}
                            {tab === 'bio' && (
                                <motion.div
                                    key="bio"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                            <FileText className="w-5 h-5 text-[#10B981]" /> Kaynak CV
                                        </label>
                                        <select
                                            value={selectedCV || ''}
                                            onChange={(e) => setSelectedCV(e.target.value)}
                                            className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">Profilinizi seçin...</option>
                                            {cvs?.map(cv => (
                                                <option key={cv.id || cv._id} value={cv.id || cv._id} className="bg-[#0F1115]">
                                                    {cv.name || 'İsimsiz CV'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {!generatedBio ? (
                                        <button
                                            onClick={handleGenerateBio}
                                            disabled={isGenerating || !selectedCV}
                                            className="w-full py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> Oluşturuluyor...</>
                                            ) : (
                                                <><Sparkles className="w-5 h-5" /> LinkedIn Bio Oluştur</>
                                            )}
                                        </button>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 relative group">
                                                <button
                                                    onClick={() => handleCopy(generatedBio)}
                                                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-[#10B981]/10 text-gray-400 hover:text-[#10B981] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Kopyala"
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                                                    {generatedBio}
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setGeneratedBio(null)}
                                                    className="px-6 py-4 rounded-2xl bg-white/5 text-gray-300 font-bold hover:bg-white/10 transition-colors"
                                                >
                                                    Yeniden Dene
                                                </button>
                                                <button
                                                    onClick={() => handleCopy(generatedBio)}
                                                    className="flex-1 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                    Panoya Kopyala
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* Elevator Pitch Tab */}
                            {tab === 'pitch' && (
                                <motion.div
                                    key="pitch"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6 space-y-6">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                                <FileText className="w-5 h-5 text-[#10B981]" /> Kaynak CV
                                            </label>
                                            <select
                                                value={selectedCV || ''}
                                                onChange={(e) => setSelectedCV(e.target.value)}
                                                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#10B981] outline-none transition-all cursor-pointer"
                                            >
                                                <option value="">Profilinizi seçin...</option>
                                                {cvs?.map(cv => (
                                                    <option key={cv.id || cv._id} value={cv.id || cv._id} className="bg-[#0F1115]">
                                                        {cv.name || 'İsimsiz CV'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                                <Target className="w-5 h-5 text-[#10B981]" /> Kullanım Amacı
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {PITCH_PURPOSES.map(purpose => (
                                                    <button
                                                        key={purpose.id}
                                                        onClick={() => setPitchPurpose(purpose.id)}
                                                        className={`p-4 rounded-xl flex flex-col items-start gap-1 transition-all ${
                                                            pitchPurpose === purpose.id
                                                                ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <span className={`font-bold text-sm ${pitchPurpose === purpose.id ? 'text-[#10B981]' : 'text-white'}`}>
                                                            {purpose.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 text-left">{purpose.description}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {!generatedPitch ? (
                                        <button
                                            onClick={handleGeneratePitch}
                                            disabled={isGenerating || !selectedCV}
                                            className="w-full py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> Oluşturuluyor...</>
                                            ) : (
                                                <><Sparkles className="w-5 h-5" /> Konuşma Metnini Hazırla</>
                                            )}
                                        </button>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 relative group">
                                                <button
                                                    onClick={() => handleCopy(generatedPitch.content || generatedPitch)}
                                                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-[#10B981]/10 text-gray-400 hover:text-[#10B981] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    title="Kopyala"
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                                <div className="flex gap-4 items-start">
                                                    <div className="text-4xl">💬</div>
                                                    <div className="text-gray-300 font-medium italic text-lg leading-relaxed">
                                                        "{generatedPitch.content || generatedPitch}"
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setGeneratedPitch(null)}
                                                    className="px-6 py-4 rounded-2xl bg-white/5 text-gray-300 font-bold hover:bg-white/10 transition-colors"
                                                >
                                                    Yeniden Dene
                                                </button>
                                                <button
                                                    onClick={() => handleCopy(generatedPitch.content || generatedPitch)}
                                                    className="flex-1 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                    Panoya Kopyala
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
