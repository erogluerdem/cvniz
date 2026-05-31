import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { Sparkles, Zap, Brain, BookOpen, Award, Lightbulb } from 'lucide-react';

/**
 * AI Features Panel Component
 * Displays all AI-powered features for CV optimization
 */
export const AIFeaturesPanel = ({ cvData = {} }) => {
    const { loading, error, result, generateSummary, generateCoverLetter, improveText, 
             generateExperience, generateInterviewPrep, analyzeSkillGap, analyzeCVScore } = useAI();
    
    const [activeTab, setActiveTab] = useState('summary');
    const [selectedText, setSelectedText] = useState('');
    const [selectedMode, setSelectedMode] = useState('professional');
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        tone: 'Professional',
        experienceLevel: 'Mid-Level'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateSummary = async () => {
        if (!formData.jobTitle) {
            alert('Lütfen iş unvanını girin');
            return;
        }
        await generateSummary(formData.jobTitle, formData.experienceLevel);
    };

    const handleGenerateCoverLetter = async () => {
        if (!formData.jobTitle || !formData.company) {
            alert('Lütfen iş unvanı ve şirket adını girin');
            return;
        }
        await generateCoverLetter(formData.jobTitle, formData.company, formData.tone, cvData);
    };

    const handleImproveText = async () => {
        if (!selectedText) {
            alert('Lütfen iyileştirilecek metni girin');
            return;
        }
        await improveText(selectedText, 'tr', selectedMode);
    };

    const handleAnalyzeCVScore = async () => {
        await analyzeCVScore(cvData);
    };

    const handleInterviewPrep = async () => {
        if (!formData.jobTitle) {
            alert('Lütfen iş unvanını girin');
            return;
        }
        await generateInterviewPrep(formData.jobTitle, '');
    };

    const handleSkillGapAnalysis = async () => {
        if (!formData.jobTitle) {
            alert('Lütfen hedef iş unvanını girin');
            return;
        }
        const skills = cvData?.skills || [];
        await analyzeSkillGap(skills, formData.jobTitle);
    };

    const AITab = ({ icon: Icon, label, value, component }) => (
        <button
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
        >
            <Icon size={20} />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-purple-600" size={28} />
                    <h2 className="text-2xl font-bold text-gray-800">AI-Powered Features</h2>
                </div>
                <p className="text-gray-600">Yapay zeka ile CV'nizi optimize edin</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-gray-300 overflow-x-auto">
                <AITab icon={Sparkles} label="Summary" value="summary" />
                <AITab icon={BookOpen} label="Cover Letter" value="coverLetter" />
                <AITab icon={Zap} label="Improve Text" value="improveText" />
                <AITab icon={Award} label="Experience" value="experience" />
                <AITab icon={Brain} label="Interview" value="interview" />
                <AITab icon={Lightbulb} label="Skill Gap" value="skillGap" />
                <AITab icon={Award} label="CV Score" value="cvScore" />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                    ❌ {error}
                </div>
            )}

            {/* Content Area */}
            <div className="bg-white rounded-lg p-6 shadow-md">
                {/* Summary Tab */}
                {activeTab === 'summary' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">CV Summary Generator</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="İş Unvanı (örn: Frontend Developer)"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option>Junior</option>
                                <option>Mid-Level</option>
                                <option>Senior</option>
                                <option>Lead</option>
                            </select>
                            <button
                                onClick={handleGenerateSummary}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Oluşturuluyor...' : '✨ Özet Oluştur'}
                            </button>
                        </div>
                        {result?.options && (
                            <div className="mt-6 space-y-3">
                                <h4 className="font-semibold text-gray-800">Öneriler:</h4>
                                {result.options.map((option, idx) => (
                                    <div key={idx} className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Cover Letter Tab */}
                {activeTab === 'coverLetter' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Ön Yazı Oluşturucu</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="İş Unvanı"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                                type="text"
                                name="company"
                                placeholder="Şirket Adı"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <select
                                name="tone"
                                value={formData.tone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option>Professional</option>
                                <option>Friendly</option>
                                <option>Confident</option>
                            </select>
                            <button
                                onClick={handleGenerateCoverLetter}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Oluşturuluyor...' : '📝 Ön Yazı Oluştur'}
                            </button>
                        </div>
                        {result?.content && (
                            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded whitespace-pre-wrap">
                                {result.content}
                            </div>
                        )}
                    </div>
                )}

                {/* Improve Text Tab */}
                {activeTab === 'improveText' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Metni İyileştir</h3>
                        <div className="space-y-4">
                            <textarea
                                placeholder="İyileştirilecek metni girin..."
                                value={selectedText}
                                onChange={(e) => setSelectedText(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                            />
                            <select
                                value={selectedMode}
                                onChange={(e) => setSelectedMode(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="professional">Profesyonel</option>
                                <option value="fix_grammar">Gramer Düzelt</option>
                                <option value="shorter">Daha Kısa</option>
                                <option value="longer">Daha Uzun</option>
                            </select>
                            <button
                                onClick={handleImproveText}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'İşleniyor...' : '🚀 Metni İyileştir'}
                            </button>
                        </div>
                        {result?.options && (
                            <div className="mt-6 space-y-3">
                                <h4 className="font-semibold text-gray-800">Öneriler:</h4>
                                {result.options.map((option, idx) => (
                                    <div key={idx} className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Interview Prep Tab */}
                {activeTab === 'interview' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Mülakat Hazırlığı</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="İş Unvanı"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleInterviewPrep}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Hazırlanıyor...' : '🎤 Mülakat Soruları'}
                            </button>
                        </div>
                        {result && (
                            <div className="mt-6 space-y-4">
                                {result.likely_questions && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Muhtemel Sorular:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {result.likely_questions.map((q, idx) => (
                                                <li key={idx}>{q}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.answer_tips && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Cevaplama İpuçları:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {result.answer_tips.map((tip, idx) => (
                                                <li key={idx}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* CV Score Tab */}
                {activeTab === 'cvScore' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">CV Analizi</h3>
                        <button
                            onClick={handleAnalyzeCVScore}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Analiz ediliyor...' : '📊 CV'yi Analiz Et'}
                        </button>
                        {result?.overall_score && (
                            <div className="mt-6 space-y-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-purple-600">{result.overall_score}/100</div>
                                    <p className="text-gray-600">Genel Puan</p>
                                </div>
                                {result.strengths && (
                                    <div>
                                        <h4 className="font-semibold text-green-700 mb-2">✅ Güçlü Yönler:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {result.strengths.map((s, idx) => (
                                                <li key={idx}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.improvements && (
                                    <div>
                                        <h4 className="font-semibold text-orange-700 mb-2">⚠️ İyileştirilecek Alanlar:</h4>
                                        {result.improvements.map((imp, idx) => (
                                            <div key={idx} className="mb-2 p-2 bg-orange-50 rounded">
                                                <p className="font-semibold text-gray-800">{imp.area}</p>
                                                <p className="text-gray-700">{imp.suggestion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Skill Gap Tab */}
                {activeTab === 'skillGap' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Yetenek Analizi</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="Hedef İş Unvanı"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={handleSkillGapAnalysis}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Analiz ediliyor...' : '🎯 Eksik Yetenekleri Bul'}
                            </button>
                        </div>
                        {result?.missing_skills && (
                            <div className="mt-6 space-y-3">
                                <h4 className="font-semibold text-gray-800">Geliştirilmesi Gereken Yetenekler:</h4>
                                {result.missing_skills.map((skill, idx) => (
                                    <div key={idx} className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                                        <p className="font-semibold">{skill.skill}</p>
                                        <p className="text-sm text-gray-600">Önem: {skill.importance} | Süre: {skill.learning_time}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {result?.score && (
                            <div className="mt-4 p-4 bg-blue-50 rounded text-center">
                                <p className="text-sm text-gray-600">Uyum Puanı</p>
                                <p className="text-3xl font-bold text-blue-600">{result.score}%</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">İş Deneyimi Maddeleri</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="jobTitle"
                                placeholder="İş Unvanı"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={() => generateExperience(formData.jobTitle)}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Oluşturuluyor...' : '📋 Maddeler Oluştur'}
                            </button>
                        </div>
                        {result?.options && (
                            <div className="mt-6 space-y-2">
                                <h4 className="font-semibold text-gray-800">Önerilen Maddeler:</h4>
                                {result.options.map((option, idx) => (
                                    <div key={idx} className="p-3 bg-indigo-50 border-l-4 border-indigo-500 rounded">
                                        • {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Usage Stats */}
            <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-gray-600">
                <p>💡 AI Features, CV'nizi optimize etmenize yardımcı olmak için tasarlanmıştır. Saatlik kullanım limiti: 20 istek</p>
            </div>
        </div>
    );
};

export default AIFeaturesPanel;
