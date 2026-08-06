import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Trophy, ArrowRight, BrainCircuit, Rocket, Target, Star, Sparkles, Lock, Crown } from 'lucide-react'

const questions = [
    {
        id: 1,
        question: "Hangi ortamda daha verimli çalışırsınız?",
        options: [
            { text: "Düzenli, sessiz ve odaklanabileceğim bir ofis", value: "professional" },
            { text: "Kaotik ama yaratıcı bir stüdyo veya kafe", value: "creative" },
            { text: "Her an her yerde, dijital göçebe olarak", value: "tech" }
        ]
    },
    {
        id: 2,
        question: "Bir sorunu çözerken yaklaşımınız nasıldır?",
        options: [
            { text: "Verileri analiz eder, mantıklı adımlar izlerim", value: "tech" },
            { text: "İnsanlarla konuşur, empati kurarım", value: "professional" },
            { text: "Alışılagelmişin dışında, sanatsal düşünürüm", value: "creative" }
        ]
    },
    {
        id: 3,
        question: "Hangi araçlar sizi daha çok heyecanlandırır?",
        options: [
            { text: "Kod editörleri, terminaller, yeni diller", value: "tech" },
            { text: "Adobe paketleri, kameralar, fırçalar", value: "creative" },
            { text: "Takvimler, sunum dosyaları, yönetim araçları", value: "professional" }
        ]
    },
    {
        id: 4,
        question: "Bir projede en çok neyi seversiniz?",
        options: [
            { text: "Mükemmel çalışan bir sistem inşa etmeyi", value: "tech" },
            { text: "İnsanların hayatına dokunmayı ve onlara yardım etmeyi", value: "professional" },
            { text: "Estetik ve unutulmaz bir deneyim yaratmayı", value: "creative" }
        ]
    }
]

const results = {
    tech: {
        title: "Teknoloji Mimarı",
        description: "Mantıksal düşünme yeteneğiniz ve teknik merakınız sizi dijital dünyanın lideri yapabilir.",
        suggestions: ["Software Engineer", "Data Scientist", "DevOps Specialist"],
        icon: <BrainCircuit className="w-16 h-16 text-[#10B981] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
    },
    creative: {
        title: "Yaratıcı Vizyoner",
        description: "Dünyayı farklı bir perspektiften görüyor ve estetiği işlerinizin merkezine koyuyorsunuz.",
        suggestions: ["UI/UX Designer", "Art Director", "Content Strategist"],
        icon: <Star className="w-16 h-16 text-[#10B981] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
    },
    professional: {
        title: "Stratejik Lider",
        description: "İnsan ilişkileri ve organizasyon kabiliyetiniz sizi mükemmel bir yönetici adayı yapıyor.",
        suggestions: ["Project Manager", "HR Specialist", "Business Consultant"],
        icon: <Trophy className="w-16 h-16 text-[#10B981] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
    }
}

export default function CareerTestModal({ isOpen, onClose, isPremium }) {
    const [step, setStep] = useState(0) // 0: Start, 1-4: Questions, 5: Result
    const [answers, setAnswers] = useState([])
    const [finalResult, setFinalResult] = useState(null)
    const [isCalculating, setIsCalculating] = useState(false)

    const handleAnswer = (value) => {
        const newAnswers = [...answers, value]
        setAnswers(newAnswers)

        if (step < questions.length) {
            setStep(step + 1)
        } else {
            setIsCalculating(true)
            setStep(step + 1)
            // Yapay Zeka analiz simülasyonu
            setTimeout(() => {
                calculateResult(newAnswers)
                setIsCalculating(false)
            }, 2000)
        }
    }

    const calculateResult = (finalAnswers) => {
        const counts = finalAnswers.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1
            return acc
        }, {})

        const winner = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
        setFinalResult(results[winner])
    }

    // Reset state on close
    const handleClose = () => {
        setTimeout(() => {
            setStep(0)
            setAnswers([])
            setFinalResult(null)
        }, 300)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && handleClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] w-full max-w-lg rounded-3xl border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] p-8 relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Close Button */}
                    <button 
                        onClick={handleClose} 
                        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative z-10">
                        <AnimatePresence mode="wait">
                            {/* Başlangıç Ekranı */}
                            {step === 0 && (
                                <motion.div 
                                    key="start"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center py-6"
                                >
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-[#10B981]/20 rounded-3xl blur-xl animate-pulse"></div>
                                        <div className="relative w-full h-full bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                            <BrainCircuit className="w-12 h-12 text-black" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4 flex items-center justify-center gap-3">
                                        Kariyer Haritanı Çiz <Crown className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                                    </h2>
                                    <p className="text-gray-400 font-medium mb-10 leading-relaxed max-w-sm mx-auto">
                                        Sadece 4 soruda senin için en uygun profesyonel kimliği ve CV başlıklarını keşfedelim.
                                    </p>
                                    
                                    {!isPremium && (
                                        <div className="mb-8 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 flex flex-col items-center justify-center text-center">
                                            <Lock className="w-8 h-8 text-amber-500 mb-2" />
                                            <h3 className="text-white font-bold mb-1">Premium Özellik</h3>
                                            <p className="text-sm text-gray-400">Yapay zeka destekli kariyer testini çözmek ve profilinizi keşfetmek için Pro'ya geçin.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={!isPremium}
                                        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all group disabled:opacity-50 ${isPremium ? 'bg-[#10B981] hover:bg-[#059669] text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {!isPremium ? (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                PREMIUM GEREKLİ
                                            </>
                                        ) : (
                                            <>
                                                TESTE BAŞLA 
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {/* Soru Ekranları */}
                            {step > 0 && step <= questions.length && (
                                <motion.div 
                                    key={`step-${step}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
                                            Soru {step} / {questions.length}
                                        </span>
                                        <div className="flex gap-2">
                                            {questions.map((q, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-10 h-1.5 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-8 leading-tight">
                                        {questions[step - 1].question}
                                    </h3>
                                    <div className="space-y-4">
                                        {questions[step - 1].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(opt.value)}
                                                className="w-full p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-[#10B981]/10 hover:border-[#10B981]/50 text-left transition-all group relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/0 via-[#10B981]/5 to-[#10B981]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span className="text-gray-300 group-hover:text-white font-medium">{opt.text}</span>
                                                    <CheckCircle2 className="w-5 h-5 text-[#10B981] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading / Analiz Ekranı */}
                            {isCalculating && (
                                <motion.div 
                                    key="calculating"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="text-center py-16"
                                >
                                    <div className="relative w-24 h-24 mx-auto mb-8">
                                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-[#10B981] rounded-full border-t-transparent animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-[#10B981] animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Yapay Zeka Analiz Ediyor...</h3>
                                    <p className="text-gray-400 font-medium">Cevaplarınız kariyer profilleriyle eşleştiriliyor</p>
                                </motion.div>
                            )}

                            {/* Sonuç Ekranı */}
                            {finalResult && !isCalculating && (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6"
                                >
                                    <div className="relative w-32 h-32 mx-auto mb-8">
                                        <div className="absolute inset-0 bg-[#10B981]/20 rounded-full blur-2xl animate-pulse"></div>
                                        <div className="relative w-full h-full bg-black/50 border border-[#10B981]/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                                            {finalResult.icon}
                                        </div>
                                    </div>
                                    
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-black uppercase tracking-widest mb-4">
                                        KARİYER PROFİLİNİZ
                                    </div>
                                    
                                    <h3 className="text-4xl font-black text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {finalResult.title}
                                    </h3>
                                    
                                    <p className="text-gray-400 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                                        {finalResult.description}
                                    </p>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5 text-[#10B981]" /> Önerilen CV Başlıkları
                                        </h4>
                                        <div className="flex flex-wrap gap-2 relative z-10">
                                            {finalResult.suggestions.map((s, i) => (
                                                <span key={i} className="px-3 py-2 rounded-xl bg-black/40 border border-[#10B981]/20 text-[#10B981] text-sm font-bold shadow-inner">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleClose}
                                        className="w-full py-4 rounded-2xl bg-white hover:bg-gray-100 text-black font-black text-lg transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        DASHBOARD'A DÖN 
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
