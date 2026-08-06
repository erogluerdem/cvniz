import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import {
    X, Mic, MicOff, Play, Pause, ChevronRight, CheckCircle,
    AlertCircle, Lightbulb, Star, Target, Trophy, Clock,
    RotateCcw, Crown, Lock, Loader2, Volume2, FileText,
    BarChart2, Award, Zap, ArrowRight, MessageSquare
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const DIFFICULTY_LEVELS = [
    { id: 'easy', name: 'Kolay', icon: '😊', description: '3-4 temel soru' },
    { id: 'medium', name: 'Orta', icon: '🎯', description: '5-6 standart soru' },
    { id: 'hard', name: 'Zor', icon: '🔥', description: '6-7 zorlu soru' }
]

export default function InterviewCoachPro({ isOpen, onClose }) {
    const { isPremium, token } = useAuth()
    const { cvs } = useCV()

    const [step, setStep] = useState('setup') // setup, practice, results
    const [selectedCV, setSelectedCV] = useState(null)
    const [targetPosition, setTargetPosition] = useState('')
    const [difficulty, setDifficulty] = useState('medium')
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [scores, setScores] = useState([])
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isEvaluating, setIsEvaluating] = useState(false)
    const [currentEvaluation, setCurrentEvaluation] = useState(null)
    const [timer, setTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [showTips, setShowTips] = useState(false)
    const [error, setError] = useState(null)
    const [sessionResults, setSessionResults] = useState(null)

    const timerRef = useRef(null)

    // Timer effect
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1)
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [isTimerRunning])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    // Generate questions from CV
    const handleStart = async () => {
        if (!selectedCV) {
            setError('Lütfen bir CV seçin')
            return
        }

        if (!isPremium) {
            setError('premium')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const response = await fetch(`${API_URL}/interview/generate-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cvData: cv?.data || cv,
                    targetPosition: targetPosition || undefined,
                    difficulty
                })
            })

            if (response.ok) {
                const data = await response.json()
                setQuestions(data.questions)
                setAnswers(new Array(data.questions.length).fill(''))
                setScores(new Array(data.questions.length).fill(0))
                setStep('practice')
                setCurrentIndex(0)
                setIsTimerRunning(true)
            } else if (response.status === 403) {
                setError('premium')
            } else {
                const data = await response.json()
                setError(data.error || 'Sorular oluşturulamadı')
            }
        } catch (err) {
            console.error('Question generation error:', err)
            setError('Bağlantı hatası')
        }

        setIsLoading(false)
    }

    // Submit current answer
    const handleSubmitAnswer = async () => {
        if (!currentAnswer.trim()) return

        setIsEvaluating(true)

        try {
            const response = await fetch(`${API_URL}/interview/evaluate-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question: questions[currentIndex].q,
                    answer: currentAnswer,
                    questionType: questions[currentIndex].type
                })
            })

            if (response.ok) {
                const data = await response.json()
                setCurrentEvaluation(data.evaluation)

                // Save answer and score
                const newAnswers = [...answers]
                newAnswers[currentIndex] = currentAnswer
                setAnswers(newAnswers)

                const newScores = [...scores]
                newScores[currentIndex] = data.evaluation.overallScore
                setScores(newScores)
            }
        } catch (err) {
            console.error('Evaluation error:', err)
        }

        setIsEvaluating(false)
    }

    // Next question
    const handleNext = () => {
        setCurrentEvaluation(null)
        setCurrentAnswer('')
        setShowTips(false)

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            handleComplete()
        }
    }

    // Complete session
    const handleComplete = async () => {
        setIsTimerRunning(false)
        setStep('results')

        try {
            const response = await fetch(`${API_URL}/interview/complete-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    questions,
                    answers,
                    scores,
                    targetPosition
                })
            })

            if (response.ok) {
                const data = await response.json()
                setSessionResults(data.summary)
            }
        } catch (err) {
            console.error('Session completion error:', err)
        }
    }

    // Reset
    const handleReset = () => {
        setStep('setup')
        setQuestions([])
        setAnswers([])
        setScores([])
        setCurrentIndex(0)
        setCurrentAnswer('')
        setCurrentEvaluation(null)
        setTimer(0)
        setIsTimerRunning(false)
        setSessionResults(null)
        setError(null)
        setShowTips(false)
    }

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
                                <MessageSquare className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    AI Mülakat Koçu <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm text-gray-400">CV'ne göre mülakat provası</p>
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
                    {step === 'practice' && questions.length > 0 && (
                        <div className="w-full bg-black/40 border-b border-white/5 p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>İlerleme</span>
                                <span className="text-[#10B981]">{currentIndex + 1} / {questions.length} Soru</span>
                            </div>
                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        
                        <AnimatePresence mode="wait">
                            {/* Premium Error */}
                            {error === 'premium' && (
                                <motion.div 
                                    key="premium"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-10 max-w-lg mx-auto"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] border border-amber-500/20">
                                        <Lock className="w-12 h-12 text-amber-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Premium Özellik</h3>
                                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                        AI Mülakat Koçu ile sınırsız soru üretmek ve değerlendirme almak için Premium abonelik gerektirir.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                                        <button
                                            onClick={() => setError(null)}
                                            className="px-6 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                        >
                                            Geri Dön
                                        </button>
                                        <Link
                                            to="/pricing"
                                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
                                        >
                                            <Crown className="w-5 h-5" />
                                            Premium'a Yükselt
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Setup Step */}
                            {step === 'setup' && error !== 'premium' && (
                                <motion.div 
                                    key="setup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Info Banner */}
                                    <div className="p-6 rounded-3xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/20 relative overflow-hidden group">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#10B981]/10 rounded-full blur-3xl group-hover:bg-[#10B981]/20 transition-all"></div>
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 border border-[#10B981]/30">
                                                <Lightbulb className="w-6 h-6 text-[#10B981]" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-2 text-lg">CV'ne Göre Özel Soru Üretimi</h4>
                                                <p className="text-gray-300 leading-relaxed font-medium">
                                                    AI, CV'ndeki deneyim boşluklarını, teknik becerilerini ve başarı iddialarını analiz ederek
                                                    sana özel, gerçekçi bir mülakat simülasyonu hazırlar.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Left Column: CV & Target */}
                                        <div className="space-y-6">
                                            <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                    <FileText className="w-5 h-5 text-[#10B981]" /> CV Seçin
                                                </label>
                                                <div className="grid gap-3">
                                                    {cvs?.map(cv => (
                                                        <button
                                                            key={cv.id}
                                                            onClick={() => setSelectedCV(cv.id)}
                                                            className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between group ${selectedCV === cv.id
                                                                ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                                                                }`}
                                                        >
                                                            <div>
                                                                <div className={`font-bold ${selectedCV === cv.id ? 'text-[#10B981]' : 'text-white'}`}>{cv.name}</div>
                                                                <div className="text-xs text-gray-400 mt-1">Şablon: {cv.template}</div>
                                                            </div>
                                                            {selectedCV === cv.id && <CheckCircle className="w-5 h-5 text-[#10B981]" />}
                                                        </button>
                                                    ))}
                                                    {(!cvs || cvs.length === 0) && (
                                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                            Henüz bir CV'niz bulunmuyor. Lütfen önce bir CV oluşturun.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                    <Target className="w-5 h-5 text-[#10B981]" /> Hedef Pozisyon <span className="text-xs text-gray-500 font-normal ml-auto">(Opsiyonel)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={targetPosition}
                                                    onChange={(e) => setTargetPosition(e.target.value)}
                                                    placeholder="Örn: Kıdemli Yazılım Mühendisi..."
                                                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column: Difficulty & Start */}
                                        <div className="space-y-6">
                                            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 h-full flex flex-col">
                                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                    <Zap className="w-5 h-5 text-[#10B981]" /> Zorluk Seviyesi
                                                </label>
                                                <div className="grid gap-3 mb-8">
                                                    {DIFFICULTY_LEVELS.map(d => (
                                                        <button
                                                            key={d.id}
                                                            onClick={() => setDifficulty(d.id)}
                                                            className={`p-5 rounded-2xl flex items-center gap-4 transition-all ${difficulty === d.id
                                                                ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-black/40 shadow-inner ${difficulty === d.id ? 'border border-[#10B981]/50' : ''}`}>
                                                                {d.icon}
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <div className={`font-bold mb-1 ${difficulty === d.id ? 'text-[#10B981]' : 'text-white'}`}>{d.name}</div>
                                                                <div className="text-xs text-gray-400 font-medium">{d.description}</div>
                                                            </div>
                                                            {difficulty === d.id && <CheckCircle className="w-5 h-5 text-[#10B981]" />}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="mt-auto">
                                                    {/* Error */}
                                                    {error && error !== 'premium' && (
                                                        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={handleStart}
                                                        disabled={!selectedCV || isLoading}
                                                        className="w-full py-5 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                                                                Mülakata Başla
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Practice Step */}
                            {step === 'practice' && questions.length > 0 && (
                                <motion.div 
                                    key="practice"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 max-w-3xl mx-auto"
                                >
                                    {/* Current Question */}
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        
                                        <div className="flex items-start gap-5 relative z-10">
                                            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 border border-[#10B981]/30 mt-1 shadow-inner">
                                                <MessageSquare className="w-6 h-6 text-[#10B981]" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <span className="text-xs font-bold px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-gray-300 uppercase tracking-widest shadow-inner">
                                                        {questions[currentIndex].category}
                                                    </span>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-lg border uppercase tracking-widest shadow-inner ${
                                                        questions[currentIndex].difficulty === 'hard'
                                                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                            : questions[currentIndex].difficulty === 'easy'
                                                                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30'
                                                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                        }`}>
                                                        {questions[currentIndex].difficulty === 'hard' ? 'Zor' : questions[currentIndex].difficulty === 'easy' ? 'Kolay' : 'Orta'}
                                                    </span>
                                                </div>
                                                <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">{questions[currentIndex].q}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tips Toggle */}
                                    <button
                                        onClick={() => setShowTips(!showTips)}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#10B981] bg-[#10B981]/10 px-4 py-2 rounded-xl hover:bg-[#10B981]/20 transition-colors border border-[#10B981]/20"
                                    >
                                        <Lightbulb className="w-4 h-4" />
                                        {showTips ? 'İpuçlarını Gizle' : 'Bu soruya nasıl cevap verilmeli?'}
                                    </button>

                                    <AnimatePresence>
                                        {showTips && questions[currentIndex].tips && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-5 rounded-2xl bg-black/40 border border-[#10B981]/20">
                                                    <h4 className="font-bold text-sm mb-3 text-[#10B981] flex items-center gap-2">
                                                        <Star className="w-4 h-4 fill-current" /> Altın İpuçları:
                                                    </h4>
                                                    <ul className="text-sm text-gray-300 space-y-2">
                                                        {questions[currentIndex].tips.map((tip, i) => (
                                                            <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                                <ChevronRight className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                                <span className="font-medium leading-relaxed">{tip}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Answer Input */}
                                    {!currentEvaluation ? (
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="relative group">
                                                <textarea
                                                    value={currentAnswer}
                                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                                    placeholder="Cevabınızı buraya yazın... (STAR metodunu kullanmayı deneyin: Situation → Task → Action → Result)"
                                                    rows={7}
                                                    className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none resize-none text-white leading-relaxed transition-all shadow-inner placeholder-gray-600"
                                                />
                                                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-lg text-xs font-bold text-gray-400 border border-white/10 backdrop-blur-sm pointer-events-none">
                                                    {currentAnswer.split(/\s+/).filter(Boolean).length} Kelime
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleSubmitAnswer}
                                                    disabled={!currentAnswer.trim() || isEvaluating}
                                                    className="px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                                >
                                                    {isEvaluating ? (
                                                        <><Loader2 className="w-5 h-5 animate-spin" /> Değerlendiriliyor...</>
                                                    ) : (
                                                        <><Zap className="w-5 h-5 fill-current" /> AI Değerlendirmesi Al</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Evaluation Result */
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6 pt-4 border-t border-white/5"
                                        >
                                            {/* Score Card */}
                                            <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${getScoreBg(currentEvaluation.overallScore)} ${getScoreColor(currentEvaluation.overallScore).replace('text-', 'border-').replace('400', '500/30')}`}>
                                                <div className="flex items-center gap-5">
                                                    <div className={`text-6xl font-black ${getScoreColor(currentEvaluation.overallScore)} drop-shadow-md`}>
                                                        {currentEvaluation.overallScore}
                                                    </div>
                                                    <div>
                                                        <div className={`text-xl font-bold ${getScoreColor(currentEvaluation.overallScore)} mb-1`}>
                                                            {currentEvaluation.grade.label}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-400 bg-black/20 px-3 py-1 rounded-lg inline-block border border-white/5">
                                                            {currentEvaluation.wordCount} kelime uzunluğunda
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
                                                    {Object.entries(currentEvaluation.scores).map(([key, value]) => (
                                                        <div key={key} className="text-center bg-black/20 p-3 rounded-xl border border-white/5">
                                                            <div className={`text-2xl font-black mb-1 ${getScoreColor(value)}`}>{value}</div>
                                                            <div className="text-xs font-bold text-gray-400 capitalize">{key}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Feedback List */}
                                            <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                                                <h4 className="font-bold mb-4 flex items-center gap-2 text-white">
                                                    <Award className="w-5 h-5 text-cyan-400" />
                                                    Koçun Geri Bildirimi
                                                </h4>
                                                <ul className="space-y-3">
                                                    {currentEvaluation.feedback.map((fb, i) => {
                                                        const isPositive = currentEvaluation.overallScore >= 70 || fb.toLowerCase().includes('iyi') || fb.toLowerCase().includes('başarılı');
                                                        return (
                                                            <li key={i} className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                                                                <div className={`mt-0.5 flex-shrink-0 p-1 rounded-full ${isPositive ? 'bg-[#10B981]/20' : 'bg-amber-500/20'}`}>
                                                                    {isPositive ? (
                                                                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                                                                    ) : (
                                                                        <AlertCircle className="w-4 h-4 text-amber-400" />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-300 leading-relaxed">{fb}</span>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>

                                            {/* Next Button */}
                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={handleNext}
                                                    className="px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    {currentIndex < questions.length - 1 ? (
                                                        <>
                                                            Sıradaki Soruya Geç
                                                            <ArrowRight className="w-5 h-5" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Mülakatı Bitir ve Sonuçları Gör
                                                            <Trophy className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* Results Step */}
                            {step === 'results' && (
                                <motion.div 
                                    key="results"
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
                                        <h3 className="text-3xl font-black text-white mb-2">Mülakat Tamamlandı! 🎉</h3>
                                        <p className="text-gray-400 font-medium">İşte performansının detaylı analizi.</p>
                                    </div>

                                    {sessionResults && (
                                        <div className="space-y-6">
                                            {/* Top Stats */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden sm:col-span-2">
                                                    <div className={`absolute inset-0 opacity-10 ${getScoreBg(sessionResults.averageScore)}`}></div>
                                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1 relative z-10">Ortalama Başarı</div>
                                                    <div className={`text-6xl font-black mb-1 relative z-10 ${getScoreColor(sessionResults.averageScore)}`}>
                                                        {sessionResults.averageScore}
                                                    </div>
                                                    <div className={`text-lg font-bold relative z-10 ${getScoreColor(sessionResults.averageScore)}`}>
                                                        {sessionResults.grade?.label}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                                                    <div className="p-5 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center">
                                                        <div className="text-3xl font-black text-white mb-1">{sessionResults.totalQuestions}</div>
                                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Soru</div>
                                                    </div>
                                                    <div className="p-5 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center">
                                                        <div className="text-3xl font-black text-white mb-1">{formatTime(timer)}</div>
                                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Süre</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Strengths & Improvements */}
                                            <div className="grid md:grid-cols-2 gap-4 text-left">
                                                {sessionResults.strengths?.length > 0 && (
                                                    <div className="p-6 rounded-3xl bg-[#10B981]/5 border border-[#10B981]/20">
                                                        <h4 className="font-bold text-[#10B981] mb-4 flex items-center gap-2">
                                                            <CheckCircle className="w-5 h-5" /> Güçlü Yönlerin
                                                        </h4>
                                                        <div className="flex flex-col gap-3">
                                                            {sessionResults.strengths.map((s, i) => (
                                                                <div key={i} className="px-4 py-3 bg-black/40 text-gray-300 rounded-xl text-sm font-medium border border-[#10B981]/10 flex items-start gap-3">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0"></div>
                                                                    {s}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {sessionResults.improvements?.length > 0 && (
                                                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                                                        <h4 className="font-bold text-amber-500 mb-4 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" /> Gelişim Alanları
                                                        </h4>
                                                        <div className="flex flex-col gap-3">
                                                            {sessionResults.improvements.map((imp, i) => (
                                                                <div key={i} className="px-4 py-3 bg-black/40 text-gray-300 rounded-xl text-sm font-medium border border-amber-500/10 flex items-start gap-3">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                                                                    {imp}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                        <button
                                            onClick={handleReset}
                                            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-2 transition-all border border-white/5"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                            Yeni Mülakat Başlat
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
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
