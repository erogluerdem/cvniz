import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCoverLetter } from '../context/CoverLetterContext'
import { useCV } from '../context/CVContext'
import { useAuth } from '../context/AuthContext'
import {
    X, FileText, Sparkles, Building2, Briefcase, MessageSquare,
    ChevronDown, Check, Loader2, Copy, Download, Edit3, ArrowRight, Lock, Crown
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CoverLetterGenerator({ isOpen, onClose, onSuccess, isPremium }) {
    const { user } = useAuth()
    const { cvs } = useCV()
    const { generateCoverLetter, generating, tonePresets } = useCoverLetter()
    const navigate = useNavigate()

    const [step, setStep] = useState(1) // 1: Input, 2: Preview
    const [selectedCvId, setSelectedCvId] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [company, setCompany] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [tone, setTone] = useState('formal')
    const [generatedLetter, setGeneratedLetter] = useState(null)
    const [editedContent, setEditedContent] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [copied, setCopied] = useState(false)

    const selectedCv = cvs.find(cv => cv.id === selectedCvId)

    const handleGenerate = async () => {
        if (!jobTitle.trim()) return

        const result = await generateCoverLetter({
            cvData: selectedCv?.data || null,
            cvId: selectedCvId || null,
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            jobDescription: jobDescription.trim(),
            tone
        })

        if (result.success) {
            setGeneratedLetter(result.coverLetter)
            setEditedContent(result.coverLetter.content)
            setStep(2)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(editedContent)
        setCopied(true)
        toast.success("Panoya kopyalandı!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClose = () => {
        setStep(1)
        setGeneratedLetter(null)
        setEditedContent('')
        setIsEditing(false)
        onClose()
    }

    const handleDone = () => {
        if (onSuccess) onSuccess(editedContent)
        toast.success("İşlem tamamlandı!")
        handleClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && handleClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="w-full max-w-3xl bg-[#0F1115] border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] rounded-[2rem] overflow-hidden my-4 relative"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <Sparkles className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                                        AI Ön Yazı Oluşturucu <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                    </h2>
                                    <p className="text-sm font-medium text-[#10B981]/80">İş ilanına özel profesyonel ön yazı</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-2.5 rounded-xl transition-colors hover:bg-white/10 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center gap-4 mt-8 relative z-10">
                            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all ${step >= 1 ? 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border border-white/5 text-gray-500'}`}>
                                <span className={`w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${step >= 1 ? 'bg-[#10B981] text-black' : 'bg-white/10'}`}>1</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Bilgiler</span>
                            </div>
                            <div className={`flex-1 h-0.5 rounded-full ${step >= 2 ? 'bg-[#10B981]/50' : 'bg-white/10'}`} />
                            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all ${step >= 2 ? 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border border-white/5 text-gray-500'}`}>
                                <span className={`w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${step >= 2 ? 'bg-[#10B981] text-black' : 'bg-white/10'}`}>2</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Önizleme</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 max-h-[60vh] overflow-y-auto relative z-10">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    {/* CV Selection */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-3">
                                            <FileText className="w-4 h-4 inline mr-2 align-text-bottom" />
                                            CV Seç (Opsiyonel)
                                        </label>
                                        <select
                                            value={selectedCvId}
                                            onChange={(e) => setSelectedCvId(e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl font-medium bg-black/50 border border-white/10 text-white focus:border-[#10B981] hover:border-white/20 outline-none transition-all"
                                        >
                                            <option value="">CV seçmeden devam et</option>
                                            {cvs.map(cv => (
                                                <option key={cv.id} value={cv.id}>{cv.name}</option>
                                            ))}
                                        </select>
                                        {selectedCv && (
                                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-[#10B981] mt-3 flex items-center gap-1.5">
                                                <Check className="w-4 h-4" /> {selectedCv.data?.personal?.fullName || 'CV'} seçildi - beceriler ve deneyimler kullanılacak
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Job Title */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-3">
                                            <Briefcase className="w-4 h-4 inline mr-2 align-text-bottom" />
                                            Pozisyon Adı *
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="örn: Frontend Developer, Proje Yöneticisi"
                                            className="w-full px-5 py-4 rounded-xl font-medium bg-black/50 border border-white/10 text-white focus:border-[#10B981] hover:border-white/20 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-3">
                                            <Building2 className="w-4 h-4 inline mr-2 align-text-bottom" />
                                            Şirket Adı (Opsiyonel)
                                        </label>
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            placeholder="örn: ABC Teknoloji, XYZ Holding"
                                            className="w-full px-5 py-4 rounded-xl font-medium bg-black/50 border border-white/10 text-white focus:border-[#10B981] hover:border-white/20 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Job Description */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-3">
                                            <MessageSquare className="w-4 h-4 inline mr-2 align-text-bottom" />
                                            İş İlanı Açıklaması (Opsiyonel)
                                        </label>
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="İş ilanının açıklama kısmını buraya yapıştırın..."
                                            rows={4}
                                            className="w-full px-5 py-4 rounded-xl font-medium bg-black/50 border border-white/10 text-white focus:border-[#10B981] hover:border-white/20 outline-none resize-none transition-all"
                                        />
                                    </div>

                                    {/* Tone Selection */}
                                    <div className="relative">
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#10B981] mb-4">Yazım Tonu</label>
                                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${!isPremium ? 'opacity-50 blur-[1px] select-none' : ''}`}>
                                            {Object.entries(tonePresets).map(([key, preset]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedLang ? setTone(key) : null} // Just placeholder, tone is handled
                                                    disabled={!isPremium}
                                                    className={`p-5 rounded-2xl border transition-all text-left ${tone === key
                                                            ? 'bg-[#10B981]/10 border-[#10B981]/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-[#10B981]/20'
                                                            : 'bg-white/5 border-white/10 hover:border-[#10B981]/30 hover:bg-white/10 text-gray-400'
                                                        }`}
                                                >
                                                    <div className={`font-bold text-sm mb-1.5 ${tone === key ? 'text-[#10B981]' : 'text-gray-300'}`}>{preset.name}</div>
                                                    <div className="text-xs leading-relaxed opacity-80">{preset.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                        {!isPremium && (
                                            <div className="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 flex flex-col items-center justify-center text-center">
                                                <Lock className="w-8 h-8 text-amber-500 mb-2" />
                                                <h3 className="text-white font-bold mb-1">Premium Özellik</h3>
                                                <p className="text-sm text-gray-400">Yapay zeka ile ön yazı oluşturmak ve farklı tonlarda yazmak için Pro'ya geçin.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Generated Letter Preview */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-black text-xl text-white flex items-center gap-3">
                                            <div className="w-2 h-8 bg-[#10B981] rounded-full" />
                                            Oluşturulan Ön Yazı
                                        </h3>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all border ${isEditing ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                                                    }`}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                                {isEditing ? 'Düzenleniyor' : 'Düzenle'}
                                            </button>
                                            <button
                                                onClick={handleCopy}
                                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-2 text-sm font-bold border border-white/10 transition-all"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                                                {copied ? <span className="text-[#10B981]">Kopyalandı!</span> : 'Kopyala'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Letter Info */}
                                    <div className="flex flex-wrap gap-3">
                                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">
                                            <span className="text-gray-500 mr-2 uppercase tracking-wider text-[10px] font-black">Pozisyon:</span> 
                                            <span className="text-white">{generatedLetter?.jobTitle}</span>
                                        </div>
                                        {generatedLetter?.company && (
                                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">
                                                <span className="text-gray-500 mr-2 uppercase tracking-wider text-[10px] font-black">Şirket:</span> 
                                                <span className="text-white">{generatedLetter.company}</span>
                                            </div>
                                        )}
                                        <div className="px-4 py-2 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-medium">
                                            <span className="text-[#10B981]/70 mr-2 uppercase tracking-wider text-[10px] font-black">Ton:</span> 
                                            <span className="text-[#10B981]">{tonePresets[generatedLetter?.tone]?.name}</span>
                                        </div>
                                    </div>

                                    {/* Letter Content */}
                                    {isEditing ? (
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full h-[400px] p-6 rounded-2xl bg-black/30 border border-white/10 focus:border-[#10B981] outline-none resize-none font-medium text-sm leading-relaxed text-white transition-colors"
                                        />
                                    ) : (
                                        <div className="p-8 rounded-2xl bg-black/30 border border-white/10 whitespace-pre-line leading-relaxed text-gray-300 font-medium text-sm">
                                            {editedContent}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-10">
                        {step === 1 ? (
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={handleClose}
                                    className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating || !jobTitle.trim() || !isPremium}
                                    className={`px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all disabled:opacity-50 ${isPremium ? 'bg-[#10B981] text-black hover:bg-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Oluşturuluyor...
                                        </>
                                    ) : !isPremium ? (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            PREMIUM GEREKLİ
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            AI ile Oluştur
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10"
                                >
                                    Geri Dön
                                </button>
                                <button
                                    onClick={handleDone}
                                    className="px-8 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-black flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                                >
                                    <Check className="w-5 h-5" />
                                    Tamamla
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
