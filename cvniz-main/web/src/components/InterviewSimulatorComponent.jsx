/**
 * Interview Simulator Component
 * Mock interview interface with scoring
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mic, Square, Play, SkipForward, ChevronRight, TrendingUp } from 'lucide-react';

export const InterviewSimulatorComponent = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [currentInterview, setCurrentInterview] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const interviewTypes = [
        { value: 'behavioral', label: 'Davranışsal' },
        { value: 'technical', label: 'Teknik' },
        { value: 'case_study', label: 'Vaka Analizi' },
        { value: 'competency', label: 'Yeterlilik' }
    ];

    const difficulties = [
        { value: 'junior', label: 'Başlangıç' },
        { value: 'mid', label: 'Orta' },
        { value: 'senior', label: 'Üst Düzey' },
        { value: 'lead', label: 'Liderlik' }
    ];

    useEffect(() => {
        loadStats();
        loadInterviews();
    }, []);

    const loadStats = async () => {
        try {
            const response = await fetch('/api/interview/stats', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('İstatistikler yüklenemedi:', error);
        }
    };

    const loadInterviews = async () => {
        try {
            const response = await fetch('/api/interview/history', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setInterviews(data);
        } catch (error) {
            console.error('Mülakatlar yüklenemedi:', error);
        }
    };

    const startInterview = async (type, difficulty) => {
        setLoading(true);
        try {
            const response = await fetch('/api/interview/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    type,
                    difficulty,
                    questionCount: 5
                })
            });

            const data = await response.json();
            setCurrentInterview(data.interviewId);
            setQuestions([data.firstQuestion]);
            setCurrentQuestionIdx(0);
            setAnswers({});
            setScores({});
        } catch (error) {
            console.error('Mülakat başlatılamadı:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (answer) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/interview/${currentInterview}/answer`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        questionIndex: currentQuestionIdx,
                        answer
                    })
                }
            );

            const data = await response.json();

            setAnswers(prev => ({
                ...prev,
                [currentQuestionIdx]: answer
            }));

            setScores(prev => ({
                ...prev,
                [currentQuestionIdx]: data.evaluation
            }));

            if (data.completed) {
                // Interview completed
                setTimeout(() => {
                    alert('Mülakat tamamlandı!');
                    loadInterviews();
                    loadStats();
                    setCurrentInterview(null);
                }, 1000);
            } else if (data.nextQuestion) {
                setQuestions(prev => [...prev, data.nextQuestion]);
                setCurrentQuestionIdx(prev => prev + 1);
            }
        } catch (error) {
            console.error('Cevap gönderilemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    // If interview is not started
    if (!currentInterview) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Mülakat Simülatörü
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Gerçekçi mülakat pratiği yapın ve geri bildirim alın
                    </p>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm font-medium">
                                    Toplam Mülakatlar
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats.totalInterviews}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm font-medium">
                                    Ortalama Skor
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats.averageScore}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 text-sm font-medium">
                                    En Güçlü Alan
                                </p>
                                <p className="text-lg font-bold text-gray-900 mt-2">
                                    {stats.strongestType || '-'}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                                <p className="text-gray-600 text-sm font-medium">
                                    İlerleme
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mülakat Seçenekleri */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Yeni Mülakat Başlat
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Mülakat Türü */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Mülakat Türü
                                </label>
                                <div className="space-y-2">
                                    {interviewTypes.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => startInterview(type.value, 'mid')}
                                            disabled={loading}
                                            className="w-full text-left p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition disabled:opacity-50"
                                        >
                                            <p className="font-medium text-gray-900">
                                                {type.label}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {type.value === 'behavioral' && 'Kişisel ve takım becerilerinizi test edin'}
                                                {type.value === 'technical' && 'Teknik bilginizi gösterin'}
                                                {type.value === 'case_study' && 'Problem çözme yeteneğini gösterin'}
                                                {type.value === 'competency' && 'Yetenek alanlarını değerlendir'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Zorluk Seviyesi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Zorluk Seviyesi
                                </label>
                                <div className="space-y-2">
                                    {difficulties.map(diff => (
                                        <button
                                            key={diff.value}
                                            onClick={() => startInterview('behavioral', diff.value)}
                                            disabled={loading}
                                            className="w-full text-left p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition disabled:opacity-50"
                                        >
                                            <p className="font-medium text-gray-900">
                                                {diff.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Geçmiş Mülakatlar */}
                    {interviews.length > 0 && (
                        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Mülakatlar
                            </h2>
                            <div className="space-y-3">
                                {interviews.map(interview => (
                                    <div
                                        key={interview._id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {interviewTypes.find(t => t.value === interview.type)?.label}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(interview.createdAt).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {interview.summary?.totalScore && (
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {interview.summary.totalScore.toFixed(1)}
                                                </p>
                                            )}
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Interview in progress
    const question = questions[currentQuestionIdx];
    const answerText = answers[currentQuestionIdx] || '';
    const score = scores[currentQuestionIdx];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-600">
                            Soru {currentQuestionIdx + 1} / {questions.length}
                        </p>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                    width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <p className="text-2xl font-bold text-gray-900">
                        {question?.text}
                    </p>
                    <p className="text-sm text-gray-600 mt-3">
                        Kategori: {question?.category}
                    </p>
                </div>

                {/* Answer Input */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                        Cevabınız
                    </label>
                    <textarea
                        value={answerText}
                        onChange={(e) => {
                            setAnswers(prev => ({
                                ...prev,
                                [currentQuestionIdx]: e.target.value
                            }));
                        }}
                        placeholder="Cevabınızı yazın..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => {
                                setIsRecording(!isRecording);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                                isRecording
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {isRecording ? (
                                <>
                                    <Square className="w-4 h-4" />
                                    Ses Kaydını Durdur
                                </>
                            ) : (
                                <>
                                    <Mic className="w-4 h-4" />
                                    Ses Kaydı
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Score Display */}
                {score && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Skor</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {score.score}/10
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Güven</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    Yüksek
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">Güçlü Yönler</p>
                                <ul className="space-y-1">
                                    {score.strengths?.map((s, i) => (
                                        <li key={i} className="text-sm text-gray-700">
                                            ✓ {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 mb-2">
                                    İyileştirilecek Alanlar
                                </p>
                                <ul className="space-y-1">
                                    {score.improvements?.map((i, idx) => (
                                        <li key={idx} className="text-sm text-gray-700">
                                            • {i}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setCurrentQuestionIdx(prev =>
                                Math.max(0, prev - 1)
                            );
                        }}
                        disabled={currentQuestionIdx === 0}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Önceki
                    </button>

                    <button
                        onClick={() => submitAnswer(answerText)}
                        disabled={loading || !answerText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {currentQuestionIdx === questions.length - 1 ? (
                            <>
                                <Play className="w-4 h-4" />
                                Tamamla
                            </>
                        ) : (
                            <>
                                <SkipForward className="w-4 h-4" />
                                Sonraki
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewSimulatorComponent;
