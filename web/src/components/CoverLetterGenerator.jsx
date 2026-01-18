import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCoverLetter } from '../context/CoverLetterContext'
import { useCV } from '../context/CVContext'
import { useAuth } from '../context/AuthContext'
import {
    X, FileText, Sparkles, Building2, Briefcase, MessageSquare,
    ChevronDown, Check, Loader2, Copy, Download, Edit3, ArrowRight
} from 'lucide-react'

export default function CoverLetterGenerator({ isOpen, onClose, onSuccess }) {
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
        if (onSuccess) onSuccess()
        handleClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">AI Ön Yazı Oluşturucu</h2>
                                <p className="text-sm text-gray-400">İş ilanına özel profesyonel ön yazı</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 1 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>
                            <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-sm flex items-center justify-center">1</span>
                            <span className="text-sm font-medium">Bilgiler</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-white/10" />
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 2 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>
                            <span className={`w-6 h-6 rounded-full text-sm flex items-center justify-center ${step >= 2 ? 'bg-cyan-500 text-white' : 'bg-white/10'}`}>2</span>
                            <span className="text-sm font-medium">Önizleme</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* CV Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    CV Seç (Opsiyonel)
                                </label>
                                <select
                                    value={selectedCvId}
                                    onChange={(e) => setSelectedCvId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none"
                                >
                                    <option value="">CV seçmeden devam et</option>
                                    {cvs.map(cv => (
                                        <option key={cv.id} value={cv.id}>{cv.name}</option>
                                    ))}
                                </select>
                                {selectedCv && (
                                    <p className="text-xs text-cyan-400 mt-2">
                                        ✓ {selectedCv.data?.personal?.fullName || 'CV'} seçildi - beceriler ve deneyimler kullanılacak
                                    </p>
                                )}
                            </div>

                            {/* Job Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    <Briefcase className="w-4 h-4 inline mr-2" />
                                    Pozisyon Adı *
                                </label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="örn: Frontend Developer, Proje Yöneticisi"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    <Building2 className="w-4 h-4 inline mr-2" />
                                    Şirket Adı (Opsiyonel)
                                </label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="örn: ABC Teknoloji, XYZ Holding"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            {/* Job Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    <MessageSquare className="w-4 h-4 inline mr-2" />
                                    İş İlanı Açıklaması (Opsiyonel)
                                </label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="İş ilanının açıklama kısmını buraya yapıştırın..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none resize-none"
                                />
                            </div>

                            {/* Tone Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-3">Yazım Tonu</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(tonePresets).map(([key, preset]) => (
                                        <button
                                            key={key}
                                            onClick={() => setTone(key)}
                                            className={`p-4 rounded-xl border transition-all text-left ${tone === key
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-white'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="font-medium text-sm">{preset.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Generated Letter Preview */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">Oluşturulan Ön Yazı</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${isEditing ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        {isEditing ? 'Düzenleniyor' : 'Düzenle'}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2 text-sm"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Kopyalandı!' : 'Kopyala'}
                                    </button>
                                </div>
                            </div>

                            {/* Letter Info */}
                            <div className="flex gap-4 mb-4">
                                <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs">
                                    <span className="text-gray-500">Pozisyon:</span> <span className="text-white">{generatedLetter?.jobTitle}</span>
                                </div>
                                {generatedLetter?.company && (
                                    <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs">
                                        <span className="text-gray-500">Şirket:</span> <span className="text-white">{generatedLetter.company}</span>
                                    </div>
                                )}
                                <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs">
                                    <span className="text-gray-500">Ton:</span> <span className="text-white">{tonePresets[generatedLetter?.tone]?.name}</span>
                                </div>
                            </div>

                            {/* Letter Content */}
                            {isEditing ? (
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full h-[400px] p-6 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none resize-none font-mono text-sm leading-relaxed"
                                />
                            ) : (
                                <div className="p-6 rounded-xl bg-white/5 border border-white/10 whitespace-pre-line leading-relaxed text-gray-300">
                                    {editedContent}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    {step === 1 ? (
                        <div className="flex justify-between">
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !jobTitle.trim()}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center gap-2 disabled:opacity-50 hover:from-cyan-400 hover:to-purple-500 transition-all"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Oluşturuluyor...
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
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Geri Dön
                            </button>
                            <button
                                onClick={handleDone}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center gap-2 hover:from-green-400 hover:to-emerald-500 transition-all"
                            >
                                <Check className="w-5 h-5" />
                                Tamamla
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
