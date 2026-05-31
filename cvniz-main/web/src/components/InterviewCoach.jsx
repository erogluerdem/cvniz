import { useState, useEffect } from 'react'
import { useInterview, QUESTION_BANKS, STAR_TEMPLATE } from '../context/InterviewContext'
import {
    X, Mic, MicOff, ChevronLeft, ChevronRight, Play, Pause,
    CheckCircle, AlertCircle, Lightbulb, MessageSquare, Star,
    Target, Trophy, Clock, ArrowRight, RotateCcw, Volume2
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
        await new Promise(r => setTimeout(r, 1000)) // Simulate AI processing
        analyzeAnswer?.(question.id)
        setIsAnalyzing(false)
    }

    // Next question
    const handleNext = () => {
        if (!nextQuestion) return
        nextQuestion()
        setCurrentAnswer('')
        setStarAnswers({ S: '', T: '', A: '', R: '' })
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI Mülakat Koçu</h2>
                            <p className="text-sm text-gray-400">
                                {step === 'select' && 'Kategori seçin ve pratik yapın'}
                                {step === 'practice' && `Soru ${currentSession?.currentIndex + 1}/${currentSession?.questions.length}`}
                                {step === 'review' && 'Sonuçlarınız'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {step === 'practice' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span className="font-mono">{formatTime(timer)}</span>
                            </div>
                        )}
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Category Selection */}
                    {step === 'select' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Hedef Pozisyon (Opsiyonel)</label>
                                <input
                                    type="text"
                                    value={targetPosition}
                                    onChange={(e) => setTargetPosition(e.target.value)}
                                    placeholder="Ör: Frontend Developer"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-3">Soru Kategorisi Seçin</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {Object.entries(QUESTION_BANKS).map(([key, cat]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedCategory(key)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedCategory === key
                                                ? 'bg-purple-500/30 border-2 border-purple-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <h3 className="font-bold mb-1">{cat.name}</h3>
                                            <p className="text-sm text-gray-400">{cat.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">{cat.questions.length} soru</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STAR Method Info */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-400" />
                                    STAR Yöntemi
                                </h4>
                                <p className="text-sm text-gray-400 mb-3">
                                    Davranışsal sorularda STAR yöntemini kullanarak daha etkili cevaplar verebilirsiniz.
                                </p>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                    {Object.entries(STAR_TEMPLATE).map(([key, val]) => (
                                        <div key={key} className="p-2 rounded-lg bg-white/5">
                                            <div className="font-bold text-purple-400">{key}</div>
                                            <div className="text-gray-400">{val.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Practice Mode */}
                    {step === 'practice' && question && (
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Question */}
                            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                                <h3 className="text-xl font-bold mb-4">{question.question}</h3>
                                {question.tips && (
                                    <div className="flex flex-wrap gap-2">
                                        {question.tips.map((tip, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-1">
                                                <Lightbulb className="w-3 h-3 text-amber-400" />
                                                {tip}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Answer Mode Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowSTAR(false)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${!showSTAR ? 'bg-purple-500 text-white' : 'bg-white/10'
                                        }`}
                                >
                                    Serbest Cevap
                                </button>
                                <button
                                    onClick={() => setShowSTAR(true)}
                                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showSTAR ? 'bg-purple-500 text-white' : 'bg-white/10'
                                        }`}
                                >
                                    <Star className="w-4 h-4" />
                                    STAR Yöntemi
                                </button>
                            </div>

                            {/* Answer Input */}
                            {!showSTAR ? (
                                <textarea
                                    value={currentAnswer}
                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                    placeholder="Cevabınızı buraya yazın..."
                                    className="w-full h-40 px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none resize-none"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(STAR_TEMPLATE).map(([key, val]) => (
                                        <div key={key}>
                                            <label className="block text-sm font-medium mb-1">
                                                <span className="text-purple-400 font-bold">{key}</span> - {val.label}
                                            </label>
                                            <textarea
                                                value={starAnswers[key]}
                                                onChange={(e) => setStarAnswers({ ...starAnswers, [key]: e.target.value })}
                                                placeholder={val.example}
                                                className="w-full h-20 px-4 py-2 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none resize-none text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Feedback */}
                            {question.feedback && (
                                <div className="p-4 rounded-xl bg-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Analiz Sonucu</span>
                                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${question.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                            question.score >= 60 ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {question.score}/100
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {question.feedback.strengths?.map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                {s}
                                            </div>
                                        ))}
                                        {question.feedback.improvements?.map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-amber-400">
                                                <AlertCircle className="w-4 h-4" />
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Review Mode */}
                    {step === 'review' && (
                        <div className="space-y-6 text-center">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Mülakat Pratiği Tamamlandı!</h3>
                            <p className="text-gray-400">Toplam Süre: {formatTime(timer)}</p>

                            {/* Score Summary */}
                            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-3xl font-bold text-cyan-400">
                                        {currentSession?.questions?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-400">Soru</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-3xl font-bold text-green-400">
                                        {currentSession?.questions?.filter(q => q.score !== null).length || 0}
                                    </div>
                                    <div className="text-sm text-gray-400">Yanıtlanan</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-3xl font-bold text-purple-400">
                                        {currentSession?.overallScore || 0}
                                    </div>
                                    <div className="text-sm text-gray-400">Ortalama Puan</div>
                                </div>
                            </div>

                            <button
                                onClick={() => { setStep('select'); setSelectedCategory(null); setTimer(0); }}
                                className="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Yeniden Başla
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between">
                    {step === 'select' && (
                        <>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white/10">
                                İptal
                            </button>
                            <button
                                onClick={handleStart}
                                disabled={!selectedCategory}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold disabled:opacity-50 flex items-center gap-2"
                            >
                                Başla <Play className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {step === 'practice' && (
                        <>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => prevQuestion?.()}
                                    disabled={currentSession?.currentIndex === 0}
                                    className="px-4 py-3 rounded-xl bg-white/10 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentSession?.currentIndex === currentSession?.questions?.length - 1}
                                    className="px-4 py-3 rounded-xl bg-white/10 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {!question?.feedback && (
                                    <button
                                        onClick={handleSubmitAnswer}
                                        disabled={isAnalyzing || (!currentAnswer && !Object.values(starAnswers).some(Boolean))}
                                        className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold disabled:opacity-50"
                                    >
                                        {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
                                    </button>
                                )}
                                <button
                                    onClick={handleComplete}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
                                >
                                    Bitir
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'review' && (
                        <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white/10 ml-auto">
                            Kapat
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
