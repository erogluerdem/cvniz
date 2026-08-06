import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInterview, QUESTION_BANKS, STAR_TEMPLATE } from '../context/InterviewContext'
import {
    X, Mic, MicOff, ChevronLeft, ChevronRight, Play, Pause,
    CheckCircle, AlertCircle, Lightbulb, MessageSquare, Star,
    Target, Trophy, Clock, ArrowRight, RotateCcw, Volume2, Zap
} from 'lucide-react'

export default function InterviewCoach({ isOpen, onClose }) {
    const {
        currentSession, startSession, saveAnswer, analyzeAnswer,
        nextQuestion, prevQuestion, completeSession
    } = useInterview() || {}

    const [step, setStep] = useState('select') // select, practice, review
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [targetPosition, setTargetPosition] = useState('')
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showSTAR, setShowSTAR] = useState(false)
    const [starAnswers, setStarAnswers] = useState({ S: '', T: '', A: '', R: '' })
    const [timer, setTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [showTips, setShowTips] = useState(false)

    // Timer
    useEffect(() => {
        let interval
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(t => t + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isTimerRunning])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Start practice
    const handleStart = () => {
        if (!selectedCategory || !startSession) return
        startSession(selectedCategory, targetPosition)
        setStep('practice')
        setIsTimerRunning(true)
    }

    // Submit answer
    const handleSubmitAnswer = async () => {
        if (!currentSession || !saveAnswer) return

        const question = currentSession.questions[currentSession.currentIndex]
        const finalAnswer = showSTAR
            ? Object.values(starAnswers).filter(Boolean).join('\n\n')
            : currentAnswer

        saveAnswer(question.id, finalAnswer, showSTAR ? starAnswers : null)

        setIsAnalyzing(true)
        if (analyzeAnswer) {
            await analyzeAnswer(question.id)
        }
        setIsAnalyzing(false)
    }

    // Next question
    const handleNext = () => {
        if (!nextQuestion) return
        nextQuestion()
        setCurrentAnswer('')
        setStarAnswers({ S: '', T: '', A: '', R: '' })
        setShowTips(false)
    }

    // Complete and show results
    const handleComplete = () => {
        if (!completeSession) return
        const result = completeSession()
        setStep('review')
        setIsTimerRunning(false)
    }

    // Get current question
    const question = currentSession?.questions?.[currentSession.currentIndex]
    const progress = currentSession ? ((currentSession.currentIndex + 1) / currentSession.questions.length) * 100 : 0

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-[#10B981]' // Neon Green
        if (score >= 60) return 'text-cyan-400'
        if (score >= 40) return 'text-amber-400'
        return 'text-red-400'
    }
    
    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-[#10B981]/20'
        if (score >= 60) return 'bg-cyan-500/20'
        if (score >= 40) return 'bg-amber-500/20'
        return 'bg-red-500/20'
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
                                <Mic className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    AI Mülakat Koçu <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md border border-[#10B981]/20">FREE</span>
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {step === 'select' && 'Kategori seçin ve pratik yapın'}
                                    {step === 'practice' && `Soru ${currentSession?.currentIndex + 1}/${currentSession?.questions.length}`}
                                    {step === 'review' && 'Sonuçlarınız'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto relative z-10">
                            {step === 'practice' && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-[#10B981]/30 shadow-inner">
                                    <Clock className="w-4 h-4 text-[#10B981]" />
                                    <span className="font-mono font-bold text-white">{formatTime(timer)}</span>
                                </div>
                            )}
                            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {step === 'practice' && question && (
                        <div className="w-full bg-black/40 border-b border-white/5 p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>İlerleme</span>
                                <span className="text-[#10B981]">{currentSession?.currentIndex + 1} / {currentSession?.questions.length} Soru</span>
                            </div>
                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            
                            {/* Category Selection */}
                            {step === 'select' && (
                                <motion.div 
                                    key="select"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <Target className="w-5 h-5 text-[#10B981]" /> Hedef Pozisyon <span className="text-xs text-gray-500 font-normal ml-auto">(Opsiyonel)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={targetPosition}
                                            onChange={(e) => setTargetPosition(e.target.value)}
                                            placeholder="Ör: Frontend Developer"
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                        />
                                    </div>

                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <MessageSquare className="w-5 h-5 text-[#10B981]" /> Soru Kategorisi Seçin
                                        </label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {Object.entries(QUESTION_BANKS).map(([key, cat]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedCategory(key)}
                                                    className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden group ${selectedCategory === key
                                                        ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    {selectedCategory === key && (
                                                        <div className="absolute top-4 right-4">
                                                            <CheckCircle className="w-6 h-6 text-[#10B981]" />
                                                        </div>
                                                    )}
                                                    <h3 className={`font-bold mb-1 text-lg pr-8 ${selectedCategory === key ? 'text-[#10B981]' : 'text-white'}`}>{cat.name}</h3>
                                                    <p className="text-sm text-gray-400 mb-3">{cat.description}</p>
                                                    <div className="text-xs font-bold text-gray-500 bg-black/40 inline-block px-3 py-1 rounded-lg border border-white/5">{cat.questions.length} soru</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* STAR Method Info */}
                                    <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                                            <Star className="w-5 h-5 text-cyan-400 fill-current" />
                                            STAR Yöntemi
                                        </h4>
                                        <p className="text-sm text-gray-300 mb-4 font-medium relative z-10">
                                            Davranışsal sorularda STAR yöntemini kullanarak daha etkili cevaplar verebilirsiniz.
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                                            {Object.entries(STAR_TEMPLATE).map(([key, val]) => (
                                                <div key={key} className="p-4 rounded-2xl bg-black/40 border border-cyan-500/10 hover:border-cyan-500/30 transition-colors">
                                                    <div className="font-black text-xl text-cyan-400 mb-1">{key}</div>
                                                    <div className="text-xs text-gray-300 font-medium leading-relaxed">{val.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleStart}
                                            disabled={!selectedCategory}
                                            className="w-full md:w-auto px-10 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            Mülakata Başla <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Practice Mode */}
                            {step === 'practice' && question && (
                                <motion.div 
                                    key="practice"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 max-w-3xl mx-auto"
                                >
                                    {/* Question */}
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        
                                        <div className="flex items-start gap-5 relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 border border-[#10B981]/30 mt-1 shadow-inner">
                                                <MessageSquare className="w-6 h-6 text-[#10B981]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">{question.question}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Answer Mode Toggle */}
                                    <div className="flex gap-3 bg-black/20 p-2 rounded-2xl w-fit border border-white/5">
                                        <button
                                            onClick={() => setShowSTAR(false)}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${!showSTAR ? 'bg-[#10B981] text-black shadow-md' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            Serbest Cevap
                                        </button>
                                        <button
                                            onClick={() => setShowSTAR(true)}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${showSTAR ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <Star className="w-4 h-4 fill-current" />
                                            STAR Yöntemi
                                        </button>
                                    </div>

                                    {/* Answer Input */}
                                    {!showSTAR ? (
                                        <div className="relative group">
                                            <textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="Cevabınızı buraya yazın..."
                                                className="w-full h-48 px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none resize-none text-white leading-relaxed transition-all shadow-inner placeholder-gray-600"
                                            />
                                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-lg text-xs font-bold text-gray-400 border border-white/10 backdrop-blur-sm pointer-events-none">
                                                {currentAnswer.split(/\s+/).filter(Boolean).length} Kelime
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {Object.entries(STAR_TEMPLATE).map(([key, val]) => (
                                                <div key={key} className="p-4 rounded-2xl bg-black/20 border border-white/5 focus-within:border-cyan-500/50 focus-within:bg-black/40 transition-colors">
                                                    <label className="block text-sm font-bold mb-3 flex items-center gap-2">
                                                        <span className="text-cyan-400 bg-cyan-500/10 w-8 h-8 flex items-center justify-center rounded-lg">{key}</span> 
                                                        <span className="text-gray-300">{val.label}</span>
                                                    </label>
                                                    <textarea
                                                        value={starAnswers[key]}
                                                        onChange={(e) => setStarAnswers({ ...starAnswers, [key]: e.target.value })}
                                                        placeholder={val.example}
                                                        className="w-full h-24 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-500 focus:outline-none resize-none text-sm text-white placeholder-gray-600 transition-colors shadow-inner"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => prevQuestion?.()}
                                                disabled={currentSession?.currentIndex === 0}
                                                className="flex-1 sm:flex-none p-4 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors border border-white/5"
                                            >
                                                <ChevronLeft className="w-6 h-6 mx-auto" />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={currentSession?.currentIndex === currentSession?.questions?.length - 1}
                                                className="flex-1 sm:flex-none p-4 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors border border-white/5"
                                            >
                                                <ChevronRight className="w-6 h-6 mx-auto" />
                                            </button>
                                        </div>

                                        <div className="flex gap-3 w-full sm:w-auto">
                                            {!question?.feedback && (
                                                <button
                                                    onClick={handleSubmitAnswer}
                                                    disabled={isAnalyzing || (!currentAnswer && !Object.values(starAnswers).some(Boolean))}
                                                    className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#059669] transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    {isAnalyzing ? (
                                                        <><Loader2 className="w-5 h-5 animate-spin" /> Analiz...</>
                                                    ) : (
                                                        <><Zap className="w-5 h-5 fill-current" /> Değerlendir</>
                                                    )}
                                                </button>
                                            )}
                                            {currentSession?.currentIndex === currentSession?.questions?.length - 1 && (
                                                <button
                                                    onClick={handleComplete}
                                                    className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                                >
                                                    Bitir <Trophy className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Feedback (Score Card) */}
                                    <AnimatePresence>
                                        {question.feedback && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-8 space-y-6"
                                            >
                                                {/* Score Header */}
                                                <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${getScoreBg(question.score)} ${getScoreColor(question.score).replace('text-', 'border-').replace('400', '500/30')}`}>
                                                    <div className="flex items-center gap-5">
                                                        <div className={`text-6xl font-black ${getScoreColor(question.score)} drop-shadow-md`}>
                                                            {question.score}
                                                        </div>
                                                        <div>
                                                            <div className="text-xl font-bold text-white mb-1">Analiz Sonucu</div>
                                                            <div className="text-sm font-medium text-gray-400 bg-black/20 px-3 py-1 rounded-lg inline-block border border-white/5">
                                                                100 üzerinden
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 text-left">
                                                    {question.feedback.strengths?.length > 0 && (
                                                        <div className="p-6 rounded-3xl bg-[#10B981]/5 border border-[#10B981]/20">
                                                            <h4 className="font-bold text-[#10B981] mb-4 flex items-center gap-2">
                                                                <CheckCircle className="w-5 h-5" /> Güçlü Yönlerin
                                                            </h4>
                                                            <div className="flex flex-col gap-3">
                                                                {question.feedback.strengths.map((s, i) => (
                                                                    <div key={i} className="px-4 py-3 bg-black/40 text-gray-300 rounded-xl text-sm font-medium border border-[#10B981]/10 flex items-start gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0"></div>
                                                                        {s}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {question.feedback.improvements?.length > 0 && (
                                                        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                                                            <h4 className="font-bold text-amber-500 mb-4 flex items-center gap-2">
                                                                <AlertCircle className="w-5 h-5" /> Gelişim Alanları
                                                            </h4>
                                                            <div className="flex flex-col gap-3">
                                                                {question.feedback.improvements.map((imp, i) => (
                                                                    <div key={i} className="px-4 py-3 bg-black/40 text-gray-300 rounded-xl text-sm font-medium border border-amber-500/10 flex items-start gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                                                                        {imp}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Review Mode */}
                            {step === 'review' && (
                                <motion.div 
                                    key="review"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8 max-w-2xl mx-auto text-center"
                                >
                                    <div className="relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl"></div>
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10 border-4 border-[#0F1115]">
                                            <Trophy className="w-14 h-14 text-black" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-black text-white mb-2">Mülakat Pratiği Tamamlandı! 🎉</h3>
                                        <p className="text-gray-400 font-medium">Toplam Pratik Süresi: {formatTime(timer)}</p>
                                    </div>

                                    {/* Score Summary */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center">
                                            <div className="text-5xl font-black text-white mb-2">
                                                {currentSession?.questions?.length || 0}
                                            </div>
                                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Soru</div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center">
                                            <div className="text-5xl font-black text-cyan-400 mb-2">
                                                {currentSession?.questions?.filter(q => q.score !== null).length || 0}
                                            </div>
                                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Yanıtlanan</div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                                            <div className={`absolute inset-0 opacity-10 ${getScoreBg(currentSession?.overallScore || 0)}`}></div>
                                            <div className={`text-5xl font-black mb-2 relative z-10 ${getScoreColor(currentSession?.overallScore || 0)}`}>
                                                {currentSession?.overallScore || 0}
                                            </div>
                                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest relative z-10">Ortalama Puan</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                        <button
                                            onClick={() => { setStep('select'); setSelectedCategory(null); setTimer(0); }}
                                            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-2 transition-all border border-white/5"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                            Yeniden Başla
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Paneli Kapat
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
