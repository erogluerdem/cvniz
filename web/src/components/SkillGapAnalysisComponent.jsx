/**
 * Skill Gap Analysis Component
 * AI-powered skill assessment and recommendations
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SkillGapAnalysisComponent = () => {
    const { user } = useAuth();
    const [assessment, setAssessment] = useState(null);
    const [skillGap, setSkillGap] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [jobMatches, setJobMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState('assessment'); // assessment, analysis, recommendations

    useEffect(() => {
        loadAssessment();
    }, []);

    const loadAssessment = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/skill-matching/assessment', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setAssessment(data);
            
            if (data._id) {
                await Promise.all([
                    loadSkillGap(),
                    loadRecommendations(),
                    loadJobMatches()
                ]);
                setStep('analysis');
            }
        } catch (error) {
            console.error('Değerlendirme yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSkillGap = async () => {
        try {
            const response = await fetch('/api/skill-matching/gap', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setSkillGap(data);
        } catch (error) {
            console.error('Beceri boşluğu yüklenemedi:', error);
        }
    };

    const loadRecommendations = async () => {
        try {
            const response = await fetch('/api/skill-matching/recommendations', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            console.error('Öneriler yüklenemedi:', error);
        }
    };

    const loadJobMatches = async () => {
        try {
            const response = await fetch('/api/skill-matching/job-matches', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            setJobMatches(data);
        } catch (error) {
            console.error('İş eşleşmeleri yüklenemedi:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Beceri Boşluğu Analizi
                </h1>

                {step === 'analysis' && (
                    <div className="space-y-8">
                        {/* Skill Gaps */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Target className="w-6 h-6 text-blue-600" />
                                Geliştirilmesi Gereken Beceriler
                            </h2>

                            <div className="space-y-4">
                                {skillGap.slice(0, 5).map((gap, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-gray-900">
                                                {gap.skillName}
                                            </h3>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                {gap.importance}
                                            </span>
                                        </div>

                                        {/* Skill Progress */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">
                                                    Mevcut: {gap.currentLevel}/10
                                                </span>
                                                <span className="text-gray-600">
                                                    Hedef: {gap.targetLevel}/10
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(gap.currentLevel / gap.targetLevel) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            <strong>Tahmini Zaman:</strong> {gap.estimatedTimeToAcquire}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Job Matches */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                Uygun İş Pozisyonları
                            </h2>

                            <div className="space-y-3">
                                {jobMatches.slice(0, 5).map((match, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {match.title} - {match.company}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${match.matchScore}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    %{match.matchScore}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                {match.missingSkills.length > 0
                                                    ? `${match.missingSkills.length} beceri eksik`
                                                    : 'Hazır!'}
                                            </p>
                                            {match.estimatedTimeToQualify && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {match.estimatedTimeToQualify}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Learning Recommendations */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                                Öğrenme Önerileri
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {recommendations.slice(0, 4).map((rec, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3">
                                            {rec.skillName}
                                        </h3>

                                        {/* Courses */}
                                        <div className="space-y-2 mb-4">
                                            {rec.courses?.slice(0, 2).map((course, cidx) => (
                                                <div key={cidx} className="text-sm">
                                                    <p className="font-medium text-gray-900">
                                                        {course.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {course.provider} • {course.duration}
                                                    </p>
                                                    <p className="text-xs text-blue-600 font-semibold">
                                                        ${course.cost}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Roadmap */}
                                        <div className="bg-gray-50 rounded p-3">
                                            <p className="text-xs font-semibold text-gray-900 mb-2">
                                                Öğrenme Yolu:
                                            </p>
                                            <ol className="text-xs text-gray-600 space-y-1">
                                                {rec.roadmap?.slice(0, 3).map((step, sidx) => (
                                                    <li key={sidx} className="ml-3">
                                                        {sidx + 1}. {step}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <Award className="w-6 h-6" />
                                Sonraki Adımlar
                            </h2>
                            <ol className="space-y-2 ml-3">
                                <li>✓ Önerilen kurslara kaydol</li>
                                <li>✓ Becerilerinizi pratik yaparak geliştirin</li>
                                <li>✓ İnşaat projelerine katılın</li>
                                <li>✓ Portföyünüzü güncelleyin</li>
                                <li>✓ Kimliğinizi doğrulayın ve bekleme listesine çıkın</li>
                            </ol>
                        </div>
                    </div>
                )}

                {step === 'assessment' && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <p className="text-center text-gray-600">
                            Değerlendirme verileriniz henüz yüklenmedi. Lütfen daha sonra tekrar deneyin.
                        </p>
                        <button
                            onClick={loadAssessment}
                            className="mx-auto block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Yeniden Yükle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillGapAnalysisComponent;
