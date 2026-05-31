import { useState, useEffect, useRef } from 'react'
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
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-cyan-400'
        if (score >= 40) return 'text-amber-400'
        return 'text-red-400'
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-4xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    AI Mülakat Koçu
                                    <Crown className="w-4 h-4 text-amber-400" />
                                </h2>
                                <p className="text-sm text-gray-400">CV'ne göre mülakat provası</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {step === 'practice' && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <span className="font-mono font-bold">{formatTime(timer)}</span>
                                </div>
                            )}
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Progress */}
                    {step === 'practice' && questions.length > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-400">İlerleme</span>
                                <span className="font-bold">{currentIndex + 1} / {questions.length}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 max-h-[65vh] overflow-y-auto">
                    {/* Premium Error */}
                    {error === 'premium' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-10 h-10 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Premium Özellik</h3>
                            <p className="text-gray-400 mb-6">
                                AI Mülakat Koçu Premium abonelik gerektirir
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link
                                    to="/pricing"
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center gap-2"
                                >
                                    <Crown className="w-5 h-5" />
                                    Premium'a Yükselt
                                </Link>
                                <button
                                    onClick={() => setError(null)}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                >
                                    Geri
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Setup Step */}
                    {step === 'setup' && error !== 'premium' && (
                        <div className="space-y-6">
                            {/* Info */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-white mb-1">CV'ne Göre Soru Üretimi</h4>
                                        <p className="text-sm text-gray-400">
                                            AI, CV'ndeki deneyim boşluklarını, teknik becerilerini ve başarı iddialarını analiz ederek
                                            sana özel mülakat soruları hazırlar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CV Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    📄 CV Seçin
                                </label>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {cvs?.map(cv => (
                                        <button
                                            key={cv.id}
                                            onClick={() => setSelectedCV(cv.id)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedCV === cv.id
                                                ? 'bg-orange-500/20 border-2 border-orange-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium">{cv.name}</div>
                                            <div className="text-sm text-gray-400">{cv.template}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Position */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    🎯 Hedef Pozisyon (Opsiyonel)
                                </label>
                                <input
                                    type="text"
                                    value={targetPosition}
                                    onChange={(e) => setTargetPosition(e.target.value)}
                                    placeholder="Yazılım Mühendisi, Proje Yöneticisi..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none"
                                />
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    ⚡ Zorluk Seviyesi
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {DIFFICULTY_LEVELS.map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => setDifficulty(d.id)}
                                            className={`p-4 rounded-xl text-center transition-all ${difficulty === d.id
                                                ? 'bg-orange-500/20 border-2 border-orange-500'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{d.icon}</div>
                                            <div className="font-medium">{d.name}</div>
                                            <div className="text-xs text-gray-500">{d.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Error */}
                            {error && error !== 'premium' && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Start Button */}
                            <div className="text-center">
                                <button
                                    onClick={handleStart}
                                    disabled={!selectedCV || isLoading}
                                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Play className="w-6 h-6" />
                                    )}
                                    Mülakata Başla
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Practice Step */}
                    {step === 'practice' && questions.length > 0 && (
                        <div className="space-y-6">
                            {/* Current Question */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400">
                                                {questions[currentIndex].category}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${questions[currentIndex].difficulty === 'hard'
                                                ? 'bg-red-500/20 text-red-400'
                                                : questions[currentIndex].difficulty === 'easy'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {questions[currentIndex].difficulty === 'hard' ? 'Zor' : questions[currentIndex].difficulty === 'easy' ? 'Kolay' : 'Orta'}
                                            </span>
                                        </div>
                                        <p className="text-lg font-medium">{questions[currentIndex].q}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tips Toggle */}
                            <button
                                onClick={() => setShowTips(!showTips)}
                                className="text-sm text-orange-400 flex items-center gap-1 hover:underline"
                            >
                                <Lightbulb className="w-4 h-4" />
                                {showTips ? 'İpuçlarını Gizle' : 'İpuçlarını Göster'}
                            </button>

                            {showTips && questions[currentIndex].tips && (
                                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <h4 className="font-bold text-sm mb-2 text-orange-400">💡 İpuçları:</h4>
                                    <ul className="text-sm text-gray-400 space-y-1">
                                        {questions[currentIndex].tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <ChevronRight className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Answer Input */}
                            {!currentEvaluation ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Cevabınızı buraya yazın... (STAR metodunu kullanmayı deneyin: Situation → Task → Action → Result)"
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500 focus:outline-none resize-none"
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            {currentAnswer.split(/\s+/).filter(Boolean).length} kelime
                                        </span>
                                        <button
                                            onClick={handleSubmitAnswer}
                                            disabled={!currentAnswer.trim() || isEvaluating}
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isEvaluating ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Zap className="w-5 h-5" />
                                            )}
                                            Değerlendir
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Evaluation Result */
                                <div className="space-y-4">
                                    {/* Score */}
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className={`text-4xl font-black ${getScoreColor(currentEvaluation.overallScore)}`}>
                                                {currentEvaluation.overallScore}
                                            </div>
                                            <div>
                                                <div className={`font-bold ${getScoreColor(currentEvaluation.overallScore)}`}>
                                                    {currentEvaluation.grade.label}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {currentEvaluation.wordCount} kelime
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {Object.entries(currentEvaluation.scores).map(([key, value]) => (
                                                <div key={key} className="text-center">
                                                    <div className={`text-lg font-bold ${getScoreColor(value)}`}>{value}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{key}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-cyan-400" />
                                            Geri Bildirim
                                        </h4>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            {currentEvaluation.feedback.map((fb, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    {currentEvaluation.overallScore >= 70 ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    {fb}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Next Button */}
                                    <div className="text-center">
                                        <button
                                            onClick={handleNext}
                                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold flex items-center gap-2 mx-auto"
                                        >
                                            {currentIndex < questions.length - 1 ? (
                                                <>
                                                    Sonraki Soru
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            ) : (
                                                <>
                                                    Sonuçları Gör
                                                    <Trophy className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Results Step */}
                    {step === 'results' && (
                        <div className="space-y-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mx-auto">
                                <Trophy className="w-12 h-12 text-orange-400" />
                            </div>

                            <h3 className="text-2xl font-bold">Mülakat Tamamlandı! 🎉</h3>

                            {sessionResults && (
                                <div className="max-w-md mx-auto space-y-4">
                                    {/* Average Score */}
                                    <div className="p-6 rounded-2xl bg-white/5">
                                        <div className={`text-5xl font-black ${getScoreColor(sessionResults.averageScore)}`}>
                                            {sessionResults.averageScore}
                                        </div>
                                        <div className="text-gray-400">Ortalama Puan</div>
                                        <div className={`mt-2 ${getScoreColor(sessionResults.averageScore)}`}>
                                            {sessionResults.grade?.label}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl bg-white/5">
                                            <div className="text-2xl font-bold">{sessionResults.totalQuestions}</div>
                                            <div className="text-sm text-gray-500">Soru</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5">
                                            <div className="text-2xl font-bold">{formatTime(timer)}</div>
                                            <div className="text-sm text-gray-500">Süre</div>
                                        </div>
                                    </div>

                                    {/* Strengths & Improvements */}
                                    {sessionResults.strengths?.length > 0 && (
                                        <div className="p-4 rounded-xl bg-green-500/10 text-left">
                                            <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Güçlü Yönler
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {sessionResults.strengths.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {sessionResults.improvements?.length > 0 && (
                                        <div className="p-4 rounded-xl bg-amber-500/10 text-left">
                                            <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" /> Gelişim Alanları
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {sessionResults.improvements.map((imp, i) => (
                                                    <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-sm">
                                                        {imp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 justify-center pt-4">
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Tekrar Dene
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold"
                                >
                                    Tamam
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
