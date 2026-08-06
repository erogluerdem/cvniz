import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, Wand2, Copy, Check, RefreshCw, 
    Briefcase, Code, Rocket, Target, Zap, ChevronRight,
    FileText, ArrowRight, Lightbulb, Loader2, Bot
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'

// Proje türleri
const PROJECT_TYPES = [
    { id: 'web', label: 'Web Uygulaması', icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { id: 'mobile', label: 'Mobil Uygulama', icon: '📱', color: 'from-purple-500 to-pink-500' },
    { id: 'api', label: 'API / Backend', icon: '⚙️', color: 'from-emerald-500 to-teal-500' },
    { id: 'data', label: 'Data / ML', icon: '📊', color: 'from-orange-500 to-amber-500' },
    { id: 'devops', label: 'DevOps / Infra', icon: '🔧', color: 'from-slate-500 to-gray-500' },
    { id: 'other', label: 'Diğer', icon: '💡', color: 'from-indigo-500 to-violet-500' }
]

export default function AIProjectWriter({ isOpen, onClose, onInsert, existingProject }) {
    const { isPremium } = useAuth()
    const [step, setStep] = useState(1)
    
    // State
    const [projectType, setProjectType] = useState('web')
    const [input, setInput] = useState({
        name: existingProject?.title || '',
        tech: existingProject?.technologies?.join(', ') || '',
        features: '',
        impact: '',
        role: ''
    })
    
    // AI Response State
    const [generatedData, setGeneratedData] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)
    const [outputType, setOutputType] = useState('paragraph') // paragraph, bullets

    const handleGenerate = async () => {
        if (!input.name || !input.tech) {
            toast.error('Lütfen proje adı ve teknolojileri girin.');
            return;
        }

        setIsGenerating(true)
        
        try {
            const response = await aiAPI.generateProject({
                input,
                type: projectType,
                outputType
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
                setGeneratedData(parsedData);
                setStep(3);
            } else {
                toast.error(response.error || 'Proje oluşturulamadı.');
            }
        } catch (error) {
            console.error('Project generation error:', error)
            toast.error('Bağlantı hatası oluştu.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Kopyalandı!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleInsert = (text) => {
        if (onInsert) {
            onInsert(text)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent opacity-50"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Wand2 className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">AI Proje Yazıcı</h2>
                                <p className="text-sm text-gray-400">Projelerinizi profesyonel bir CV diline çevirin</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative z-10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 py-4 border-b border-white/5 bg-black/20">
                        <div className="flex items-center gap-4 max-w-md mx-auto">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        step >= s 
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                                            : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {step > s ? <Check size={16} /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                                            step > s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/5'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Project Type */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">Proje Türü Seçin</h3>
                                        <p className="text-gray-400">Ne tür bir proje geliştirdiniz?</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {PROJECT_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => {
                                                    setProjectType(type.id)
                                                    setStep(2)
                                                }}
                                                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center group hover:-translate-y-1 ${
                                                    projectType === type.id
                                                        ? 'bg-gradient-to-b from-white/10 to-transparent border-purple-500/50 shadow-[0_8px_30px_rgba(168,85,247,0.2)]'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-xl'
                                                }`}
                                            >
                                                <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center text-3xl bg-gradient-to-br ${type.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                                    {type.icon}
                                                </div>
                                                <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                                                    {type.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: Project Details */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Proje Adı / Konusu *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={input.name}
                                                        onChange={e => setInput({...input, name: e.target.value})}
                                                        placeholder="Örn: E-ticaret Platformu"
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Kullanılan Teknolojiler *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={input.tech}
                                                        onChange={e => setInput({...input, tech: e.target.value})}
                                                        placeholder="Örn: React, Node.js, MongoDB"
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Rolünüz
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={input.role}
                                                        onChange={e => setInput({...input, role: e.target.value})}
                                                        placeholder="Örn: Full Stack Developer"
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Temel Özellikler
                                                    </label>
                                                    <textarea
                                                        value={input.features}
                                                        onChange={e => setInput({...input, features: e.target.value})}
                                                        placeholder="Örn: Gerçek zamanlı mesajlaşma, sepet yönetimi..."
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none resize-none h-24"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Etki / Sonuç
                                                    </label>
                                                    <textarea
                                                        value={input.impact}
                                                        onChange={e => setInput({...input, impact: e.target.value})}
                                                        placeholder="Örn: %40 performans artışı, 10 bin yeni kullanıcı..."
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none resize-none h-24"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/10">
                                            <label className="block text-sm font-medium text-gray-300 mb-4">
                                                Çıktı Formatı Seçin
                                            </label>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setOutputType('paragraph')}
                                                    className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                                                        outputType === 'paragraph'
                                                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <FileText size={18} />
                                                    Özet Paragraf
                                                </button>
                                                <button
                                                    onClick={() => setOutputType('bullets')}
                                                    className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                                                        outputType === 'bullets'
                                                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <Check size={18} />
                                                    Madde İşaretleri
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Results */}
                            {step === 3 && generatedData && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 relative group">
                                            <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                                                <Bot size={18} className="text-white" />
                                            </div>
                                            
                                            <div className="text-gray-300 leading-relaxed space-y-3">
                                                {outputType === 'paragraph' ? (
                                                    <p>{generatedData.description}</p>
                                                ) : (
                                                    <ul className="space-y-2">
                                                        {generatedData.bullets?.map((bullet, idx) => (
                                                            <li key={idx} className="flex gap-3">
                                                                <Zap size={16} className="text-purple-400 shrink-0 mt-1" />
                                                                <span>{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {generatedData.keywords && generatedData.keywords.length > 0 && (
                                                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                                                    {generatedData.keywords.map((kw, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-48 shrink-0 flex flex-col gap-4">
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                                <div className="text-sm text-gray-400 mb-1">Etki Skoru</div>
                                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                                    {generatedData.impact_score}
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleCopy(outputType === 'paragraph' ? generatedData.description : generatedData.bullets?.join('\n'))}
                                                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center justify-center gap-2 transition-colors"
                                            >
                                                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                                {copied ? 'Kopyalandı' : 'Kopyala'}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleInsert(outputType === 'paragraph' ? generatedData.description : generatedData.bullets?.join('\n'))}
                                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-opacity"
                                            >
                                                CV'ye Ekle
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-black/40 flex justify-between items-center">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                            >
                                Geri
                            </button>
                        ) : <div></div>}

                        {step === 2 && (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !isPremium}
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/25"
                            >
                                {isGenerating ? (
                                    <><Loader2 size={20} className="animate-spin" /> Üretiliyor...</>
                                ) : (
                                    <><Sparkles size={20} /> Projeyi Yaz</>
                                )}
                            </button>
                        )}
                        
                        {step === 3 && (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="px-6 py-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl flex items-center gap-2 transition-colors border border-white/10"
                            >
                                <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""} />
                                Yeniden Üret
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
