import { useState } from 'react'
import { X, CheckCircle2, Trophy, ArrowRight, BrainCircuit, Rocket, Target, Star } from 'lucide-react'

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
        icon: <BrainCircuit className="w-12 h-12 text-cyan-400" />
    },
    creative: {
        title: "Yaratıcı Vizyoner",
        description: "Dünyayı farklı bir perspektiften görüyor ve estetiği işlerinizin merkezine koyuyorsunuz.",
        suggestions: ["UI/UX Designer", "Art Director", "Content Strategist"],
        icon: <Star className="w-12 h-12 text-purple-400" />
    },
    professional: {
        title: "Stratejik Lider",
        description: "İnsan ilişkileri ve organizasyon kabiliyetiniz sizi mükemmel bir yönetici adayı yapıyor.",
        suggestions: ["Project Manager", "HR Specialist", "Business Consultant"],
        icon: <Trophy className="w-12 h-12 text-amber-400" />
    }
}

export default function CareerTestModal({ isOpen, onClose }) {
    const [step, setStep] = useState(0) // 0: Start, 1-4: Questions, 5: Result
    const [answers, setAnswers] = useState([])
    const [finalResult, setFinalResult] = useState(null)

    const handleAnswer = (value) => {
        const newAnswers = [...answers, value]
        setAnswers(newAnswers)

        if (step < questions.length) {
            setStep(step + 1)
        } else {
            calculateResult(newAnswers)
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-card max-w-lg w-full rounded-[2rem] p-8 relative overflow-hidden animate-scale-in">
                {/* Close */}
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                {step === 0 && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <BrainCircuit className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 italic">Kariyer Haritanı Çiz 🗺️</h2>
                        <p className="text-gray-400 mb-8">
                            Sadece 4 soruda senin için en uygun profesyonel kimliği ve CV başlıklarını keşfedelim.
                        </p>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95"
                        >
                            TESTE BAŞLA <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {step > 0 && step <= questions.length && (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Soru {step} / {questions.length}</span>
                            <div className="flex gap-1">
                                {questions.map((q, i) => (
                                    <div key={i} className={`w-8 h-1 rounded-full ${i + 1 <= step ? 'bg-cyan-500' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-6">
                            {questions[step - 1].question}
                        </h3>
                        <div className="space-y-3">
                            {questions[step - 1].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt.value)}
                                    className="w-full p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 text-left transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300 group-hover:text-white">{opt.text}</span>
                                        <CheckCircle2 className="w-5 h-5 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step > questions.length && finalResult && (
                    <div className="text-center py-6 animate-scale-in">
                        <div className="mb-6 flex justify-center">{finalResult.icon}</div>
                        <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">ANALİZ TAMAMLANDI</h2>
                        <h3 className="text-3xl font-black text-white italic mb-4">{finalResult.title}</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                            {finalResult.description}
                        </p>

                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Önerilen CV Başlıkları:</h4>
                            <div className="flex flex-wrap gap-2">
                                {finalResult.suggestions.map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            DASHBOARD'A DÖN <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
