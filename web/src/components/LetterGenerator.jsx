import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, FileText, Copy, Check, Loader2,
    Briefcase, Building, Heart, Award, Target, ChevronRight,
    Download, Mail
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'

const COVER_LETTER_STYLES = [
    { 
        id: 'professional', 
        name: 'Profesyonel', 
        icon: Briefcase, 
        description: 'Kurumsal, ciddi ve net ton',
        emoji: '👔'
    },
    { 
        id: 'creative', 
        name: 'Yaratıcı', 
        icon: Heart, 
        description: 'Dinamik, tutkulu ve samimi ton',
        emoji: '🎨'
    },
    { 
        id: 'formal', 
        name: 'Resmi', 
        icon: Award, 
        description: 'Geleneksel, saygılı ve çok resmi ton',
        emoji: '📜'
    }
]

export default function LetterGenerator({ isOpen, onClose }) {
    const { isPremium } = useAuth()
    const { cvs } = useCV()
    
    const [step, setStep] = useState(1) // 1: Style, 2: Details, 3: Result
    
    // State
    const [selectedCV, setSelectedCV] = useState(null)
    const [style, setStyle] = useState('professional')
    const [input, setInput] = useState({
        targetCompany: '',
        targetPosition: ''
    })
    
    // AI Response State
    const [generatedLetter, setGeneratedLetter] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Mektup panoya kopyalandı!')
    }

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([generatedLetter], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "Niyet_Mektubu.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Mektup indirildi!');
    }

    const handleGenerate = async () => {
        if (!selectedCV) {
            toast.error('Lütfen bir CV seçin.');
            return;
        }

        if (!input.targetPosition || !input.targetCompany) {
            toast.error('Lütfen hedef şirket ve pozisyonu girin.');
            return;
        }

        setIsGenerating(true)
        
        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const cvData = cv?.data || cv

            const response = await aiAPI.generateCoverLetter({
                style,
                jobData: { company: input.targetCompany },
                targetPosition: input.targetPosition,
                cvData
            });
            
            if (response.success && response.data) {
                let parsedData = response.data;
                if (typeof parsedData === 'string') {
                    try {
                        parsedData = JSON.parse(parsedData);
                    } catch (e) {
                        const jsonStr = parsedData.substring(parsedData.indexOf('{'), parsedData.lastIndexOf('}') + 1);
                        parsedData = JSON.parse(jsonStr);
                    }
                }
                setGeneratedLetter(parsedData.content || parsedData);
                setStep(3);
            } else {
                toast.error(response.error || 'Niyet mektubu oluşturulamadı.');
            }
        } catch (error) {
            console.error('Cover letter generation error:', error)
            toast.error('Bağlantı hatası oluştu.')
        } finally {
            setIsGenerating(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
                                <Mail className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">AI Niyet Mektubu <Sparkles size={16} className="text-[#10B981]" /></h2>
                                <p className="text-sm text-gray-400">Yapay zeka ile kişiselleştirilmiş Cover Letter</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative z-10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 py-4 border-b border-white/5 bg-black/40">
                        <div className="flex items-center gap-4 max-w-sm">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        step >= s 
                                            ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                            : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                                            step > s ? 'bg-[#10B981]' : 'bg-white/10'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-[#10B981]/30 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Style Selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Mektup Tonunu Seçin</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {COVER_LETTER_STYLES.map(s => {
                                                const Icon = s.icon;
                                                return (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => setStyle(s.id)}
                                                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-4 items-center text-center group relative overflow-hidden ${
                                                            style === s.id
                                                                ? 'bg-[#10B981]/10 border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                                        }`}
                                                    >
                                                        {style === s.id && (
                                                            <div className="absolute top-0 right-0 p-2">
                                                                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
                                                            </div>
                                                        )}
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                                                            style === s.id ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-black/40 text-gray-400 group-hover:text-white group-hover:bg-black/60'
                                                        }`}>
                                                            {s.emoji}
                                                        </div>
                                                        <div>
                                                            <div className={`font-bold mb-1 text-lg ${style === s.id ? 'text-[#10B981]' : 'text-white'}`}>{s.name}</div>
                                                            <div className="text-sm text-gray-400 leading-relaxed">{s.description}</div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 bg-[#10B981] text-black font-bold rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    >
                                        Devam Et <ChevronRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: Details */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <Target className="text-[#10B981]" size={20} />
                                            Hedef Bilgileri
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Referans Alınacak CV *
                                                </label>
                                                <select
                                                    value={selectedCV || ''}
                                                    onChange={(e) => setSelectedCV(e.target.value)}
                                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                                >
                                                    <option value="">CV Seçiniz...</option>
                                                    {cvs?.map(cv => (
                                                        <option key={cv.id || cv._id} value={cv.id || cv._id} className="bg-[#0F1115]">
                                                            {cv.name || 'İsimsiz CV'}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-gray-500 mt-2">Yapay zeka mektubu yazarken buradaki deneyimlerinizi okuyacaktır.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Hedef Şirket Adı *</label>
                                                    <div className="relative">
                                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input
                                                            type="text"
                                                            value={input.targetCompany}
                                                            onChange={e => setInput({...input, targetCompany: e.target.value})}
                                                            placeholder="Örn: ABC Teknoloji"
                                                            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">Hedef Pozisyon *</label>
                                                    <div className="relative">
                                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                        <input
                                                            type="text"
                                                            value={input.targetPosition}
                                                            onChange={e => setInput({...input, targetPosition: e.target.value})}
                                                            placeholder="Örn: Kıdemli Yazılım Mühendisi"
                                                            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-4 bg-white/5 text-gray-300 font-bold rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !selectedCV || !input.targetCompany || !input.targetPosition}
                                            className="flex-1 py-4 bg-[#10B981] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <><Loader2 size={20} className="animate-spin" /> Oluşturuluyor...</>
                                            ) : (
                                                <><Sparkles size={20} /> Niyet Mektubu Üret</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Results */}
                            {step === 3 && generatedLetter && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden relative group">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={handleCopy}
                                                className="p-2 text-gray-400 hover:text-[#10B981] bg-black/60 hover:bg-[#10B981]/10 border border-white/5 hover:border-[#10B981]/20 rounded-xl transition-all backdrop-blur-md"
                                                title="Metni Kopyala"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="p-2 text-gray-400 hover:text-[#10B981] bg-black/60 hover:bg-[#10B981]/10 border border-white/5 hover:border-[#10B981]/20 rounded-xl transition-all backdrop-blur-md"
                                                title="Mektubu İndir"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                        <div className="p-6 md:p-8 text-gray-300 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                                            {generatedLetter}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-6 py-4 bg-white/5 text-gray-300 font-bold rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={handleCopy}
                                            className="flex-1 py-4 bg-[#10B981] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                        >
                                            {copied ? <Check size={20} /> : <Copy size={20} />}
                                            Panoya Kopyala
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
