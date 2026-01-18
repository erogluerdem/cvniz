import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, TextInput, Alert, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

// Soru Kategorileri
const QUESTION_BANKS = {
    general: {
        name: 'Genel Sorular',
        icon: '💼',
        color: ['#6366F1', '#8B5CF6'],
        questions: [
            { id: 1, text: 'Kendinizi tanıtır mısınız?', difficulty: 'kolay' },
            { id: 2, text: 'Güçlü ve zayıf yönleriniz nelerdir?', difficulty: 'orta' },
            { id: 3, text: 'Neden bu şirkette çalışmak istiyorsunuz?', difficulty: 'orta' },
            { id: 4, text: '5 yıl sonra kendinizi nerede görüyorsunuz?', difficulty: 'orta' },
            { id: 5, text: 'Stresle nasıl başa çıkarsınız?', difficulty: 'zor' },
        ]
    },
    behavioral: {
        name: 'Davranışsal',
        icon: '🧠',
        color: ['#EC4899', '#F43F5E'],
        questions: [
            { id: 1, text: 'Bir ekip çatışmasını nasıl çözdünüz?', difficulty: 'zor' },
            { id: 2, text: 'Başarısız olduğunuz bir projeyi anlatın.', difficulty: 'zor' },
            { id: 3, text: 'Zor bir müşteriyle nasıl başa çıktınız?', difficulty: 'orta' },
            { id: 4, text: 'Liderlik gösterdiğiniz bir durumu anlatın.', difficulty: 'orta' },
            { id: 5, text: 'Baskı altında nasıl çalışırsınız?', difficulty: 'orta' },
        ]
    },
    technical: {
        name: 'Teknik',
        icon: '💻',
        color: ['#10B981', '#059669'],
        questions: [
            { id: 1, text: 'Bu pozisyonda kullanacağınız teknolojiler nelerdir?', difficulty: 'kolay' },
            { id: 2, text: 'En karmaşık teknik probleminizi anlatın.', difficulty: 'zor' },
            { id: 3, text: 'Kod kalitesini nasıl sağlarsınız?', difficulty: 'orta' },
            { id: 4, text: 'Yeni teknolojileri nasıl öğrenirsiniz?', difficulty: 'kolay' },
            { id: 5, text: 'Debugging sürecinizi anlatın.', difficulty: 'orta' },
        ]
    },
    salary: {
        name: 'Maaş Görüşmesi',
        icon: '💰',
        color: ['#F59E0B', '#D97706'],
        questions: [
            { id: 1, text: 'Maaş beklentiniz nedir?', difficulty: 'zor' },
            { id: 2, text: 'Mevcut maaşınız nedir?', difficulty: 'orta' },
            { id: 3, text: 'Yan haklar konusundaki beklentileriniz?', difficulty: 'orta' },
            { id: 4, text: 'Neden zam istiyorsunuz?', difficulty: 'zor' },
        ]
    }
};

// STAR Metodu Template
const STAR_TEMPLATE = {
    S: { title: 'Durum (Situation)', placeholder: 'Durumu kısaca açıklayın...' },
    T: { title: 'Görev (Task)', placeholder: 'Sorumluluğunuz neydi?' },
    A: { title: 'Eylem (Action)', placeholder: 'Ne yaptınız?' },
    R: { title: 'Sonuç (Result)', placeholder: 'Sonuç ne oldu?' }
};

export default function InterviewScreen({ navigation }) {
    const { user } = useAuth();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const [step, setStep] = useState('select'); // select, practice, review
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [targetPosition, setTargetPosition] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [showSTAR, setShowSTAR] = useState(false);
    const [starAnswers, setStarAnswers] = useState({ S: '', T: '', A: '', R: '' });
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        if (!selectedCategory) {
            Alert.alert('Uyarı', 'Lütfen bir kategori seçin.');
            return;
        }
        setStep('practice');
        setIsTimerRunning(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
    };

    const getCurrentQuestion = () => {
        if (!selectedCategory) return null;
        return QUESTION_BANKS[selectedCategory].questions[currentQuestionIndex];
    };

    const handleNextQuestion = () => {
        const finalAnswer = showSTAR
            ? `Durum: ${starAnswers.S}\nGörev: ${starAnswers.T}\nEylem: ${starAnswers.A}\nSonuç: ${starAnswers.R}`
            : currentAnswer;

        setAnswers([...answers, {
            question: getCurrentQuestion(),
            answer: finalAnswer,
            time: timer
        }]);

        const questions = QUESTION_BANKS[selectedCategory].questions;
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setCurrentAnswer('');
            setStarAnswers({ S: '', T: '', A: '', R: '' });
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        setIsTimerRunning(false);
        setIsAnalyzing(true);

        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockAnalysis = {
            overallScore: Math.floor(Math.random() * 30) + 70,
            strengths: [
                'Net ve özlü cevaplar',
                'İyi yapılandırılmış örnekler',
                'Profesyonel iletişim'
            ],
            improvements: [
                'Daha spesifik metrikler kullanın',
                'STAR metodunu daha tutarlı uygulayın',
                'Şirket araştırması yapın'
            ],
            tips: [
                '💡 Cevaplarınızı 2-3 dakika arasında tutun',
                '💡 Somut rakamlar ve başarılar ekleyin',
                '💡 Göz teması ve beden dili önemli'
            ]
        };

        setAnalysisResult(mockAnalysis);
        setIsAnalyzing(false);
        setStep('review');
    };

    const resetPractice = () => {
        setStep('select');
        setSelectedCategory(null);
        setTargetPosition('');
        setCurrentQuestionIndex(0);
        setCurrentAnswer('');
        setShowSTAR(false);
        setStarAnswers({ S: '', T: '', A: '', R: '' });
        setTimer(0);
        setAnswers([]);
        setAnalysisResult(null);
    };

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'kolay': return '#10B981';
            case 'orta': return '#F59E0B';
            case 'zor': return '#EF4444';
            default: return '#6366F1';
        }
    };

    // Category Selection Step
    const renderSelectStep = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Target Position */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>🎯 Hedef Pozisyon (Opsiyonel)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ör: Frontend Developer"
                    placeholderTextColor="#94A3B8"
                    value={targetPosition}
                    onChangeText={setTargetPosition}
                />
            </View>

            {/* Categories */}
            <Text style={styles.sectionTitle}>📋 Soru Kategorisi Seçin</Text>
            <View style={styles.categoriesGrid}>
                {Object.entries(QUESTION_BANKS).map(([key, category]) => (
                    <TouchableOpacity
                        key={key}
                        style={[
                            styles.categoryCard,
                            selectedCategory === key && styles.categoryCardSelected
                        ]}
                        onPress={() => setSelectedCategory(key)}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={selectedCategory === key ? category.color : ['#F1F5F9', '#F1F5F9']}
                            style={styles.categoryGradient}
                        >
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text style={[
                                styles.categoryName,
                                selectedCategory === key && styles.categoryNameSelected
                            ]}>
                                {category.name}
                            </Text>
                            <Text style={[
                                styles.categoryCount,
                                selectedCategory === key && styles.categoryCountSelected
                            ]}>
                                {category.questions.length} soru
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tips */}
            <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>💡 İpuçları</Text>
                <Text style={styles.tipItem}>• STAR metodunu kullanarak cevap verin</Text>
                <Text style={styles.tipItem}>• Somut örnekler ve rakamlar kullanın</Text>
                <Text style={styles.tipItem}>• Cevaplarınızı 2-3 dakika arasında tutun</Text>
            </View>

            {/* Start Button */}
            <TouchableOpacity 
                style={[styles.startButton, !selectedCategory && styles.startButtonDisabled]}
                onPress={handleStart}
                disabled={!selectedCategory}
            >
                <LinearGradient
                    colors={selectedCategory ? ['#6366F1', '#8B5CF6'] : ['#CBD5E1', '#CBD5E1']}
                    style={styles.startButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.startButtonText}>🎤 Pratiğe Başla</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    // Practice Step
    const renderPracticeStep = () => {
        const question = getCurrentQuestion();
        const category = QUESTION_BANKS[selectedCategory];
        const progress = ((currentQuestionIndex + 1) / category.questions.length) * 100;

        return (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Progress & Timer */}
                <View style={styles.progressBar}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                            Soru {currentQuestionIndex + 1}/{category.questions.length}
                        </Text>
                        <View style={styles.timerBadge}>
                            <Text style={styles.timerText}>⏱️ {formatTime(timer)}</Text>
                        </View>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                {/* Question Card */}
                <View style={styles.questionCard}>
                    <View style={styles.difficultyBadge}>
                        <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(question.difficulty) }]} />
                        <Text style={styles.difficultyText}>{question.difficulty}</Text>
                    </View>
                    <Text style={styles.questionText}>{question.text}</Text>
                </View>

                {/* STAR Toggle */}
                <TouchableOpacity
                    style={[styles.starToggle, showSTAR && styles.starToggleActive]}
                    onPress={() => setShowSTAR(!showSTAR)}
                >
                    <Text style={styles.starToggleIcon}>⭐</Text>
                    <Text style={[styles.starToggleText, showSTAR && styles.starToggleTextActive]}>
                        STAR Metodu Kullan
                    </Text>
                </TouchableOpacity>

                {/* Answer Input */}
                {showSTAR ? (
                    <View style={styles.starContainer}>
                        {Object.entries(STAR_TEMPLATE).map(([key, item]) => (
                            <View key={key} style={styles.starItem}>
                                <Text style={styles.starLabel}>
                                    <Text style={styles.starKey}>{key}</Text> - {item.title}
                                </Text>
                                <TextInput
                                    style={styles.starInput}
                                    placeholder={item.placeholder}
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                    value={starAnswers[key]}
                                    onChangeText={(text) => setStarAnswers({...starAnswers, [key]: text})}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <TextInput
                        style={styles.answerInput}
                        placeholder="Cevabınızı buraya yazın..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        value={currentAnswer}
                        onChangeText={setCurrentAnswer}
                    />
                )}

                {/* Navigation Buttons */}
                <View style={styles.navButtons}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleNextQuestion}
                    >
                        <Text style={styles.skipButtonText}>Atla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNextQuestion}
                    >
                        <LinearGradient
                            colors={['#6366F1', '#8B5CF6']}
                            style={styles.nextButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentQuestionIndex === category.questions.length - 1 ? 'Bitir' : 'Sonraki'} →
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        );
    };

    // Review Step
    const renderReviewStep = () => {
        if (isAnalyzing) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.loadingText}>🤖 AI cevaplarınızı analiz ediyor...</Text>
                </View>
            );
        }

        return (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Score Card */}
                <View style={styles.scoreCard}>
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        style={styles.scoreGradient}
                    >
                        <Text style={styles.scoreLabel}>Genel Puan</Text>
                        <Text style={styles.scoreValue}>{analysisResult?.overallScore}</Text>
                        <Text style={styles.scoreMax}>/100</Text>
                    </LinearGradient>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⏱️</Text>
                        <Text style={styles.statValue}>{formatTime(timer)}</Text>
                        <Text style={styles.statLabel}>Toplam Süre</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>❓</Text>
                        <Text style={styles.statValue}>{answers.length}</Text>
                        <Text style={styles.statLabel}>Cevaplanan</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={styles.statValue}>{Math.floor(timer / answers.length)}s</Text>
                        <Text style={styles.statLabel}>Ort. Süre</Text>
                    </View>
                </View>

                {/* Strengths */}
                <View style={styles.feedbackCard}>
                    <View style={styles.feedbackHeader}>
                        <Text style={styles.feedbackIcon}>💪</Text>
                        <Text style={styles.feedbackTitle}>Güçlü Yönler</Text>
                    </View>
                    {analysisResult?.strengths.map((item, i) => (
                        <View key={i} style={styles.feedbackItem}>
                            <Text style={styles.feedbackCheck}>✓</Text>
                            <Text style={styles.feedbackText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Improvements */}
                <View style={[styles.feedbackCard, styles.improvementCard]}>
                    <View style={styles.feedbackHeader}>
                        <Text style={styles.feedbackIcon}>📈</Text>
                        <Text style={styles.feedbackTitle}>Gelişim Alanları</Text>
                    </View>
                    {analysisResult?.improvements.map((item, i) => (
                        <View key={i} style={styles.feedbackItem}>
                            <Text style={styles.feedbackArrow}>→</Text>
                            <Text style={styles.feedbackText}>{item}</Text>
                        </View>
                    ))}
                </View>

                {/* Tips */}
                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>💡 Öneriler</Text>
                    {analysisResult?.tips.map((tip, i) => (
                        <Text key={i} style={styles.tipItem}>{tip}</Text>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.retryButton} onPress={resetPractice}>
                        <Text style={styles.retryButtonText}>🔄 Tekrar Dene</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.shareButton}
                        onPress={() => Alert.alert('Paylaş', 'Sonuçlar paylaşıldı!')}
                    >
                        <LinearGradient
                            colors={['#6366F1', '#8B5CF6']}
                            style={styles.shareButtonGradient}
                        >
                            <Text style={styles.shareButtonText}>📤 Paylaş</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => step === 'select' ? navigation.goBack() : resetPractice()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>🎤 Mülakat Koçu</Text>
                    <Text style={styles.headerSubtitle}>
                        {step === 'select' && 'Kategori seçin'}
                        {step === 'practice' && 'Pratik yapın'}
                        {step === 'review' && 'Sonuçlar'}
                    </Text>
                </View>
                {!isPremium && (
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            {step === 'select' && renderSelectStep()}
            {step === 'practice' && renderPracticeStep()}
            {step === 'review' && renderReviewStep()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#F8FAFC',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    backIcon: {
        fontSize: 20,
        color: '#0F172A',
    },
    headerCenter: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    proBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: '#FEF3C7',
    },
    proBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#D97706',
    },

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },

    // Input Section
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },

    // Categories Grid
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
        marginBottom: 20,
    },
    categoryCard: {
        width: '50%',
        padding: 6,
    },
    categoryCardSelected: {},
    categoryGradient: {
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 4,
    },
    categoryNameSelected: {
        color: '#FFFFFF',
    },
    categoryCount: {
        fontSize: 12,
        color: '#64748B',
    },
    categoryCountSelected: {
        color: 'rgba(255,255,255,0.8)',
    },

    // Tips Card
    tipsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tipsTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 10,
    },
    tipItem: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 6,
        lineHeight: 20,
    },

    // Start Button
    startButton: {
        marginBottom: 20,
    },
    startButtonDisabled: {
        opacity: 0.6,
    },
    startButtonGradient: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Progress Bar
    progressBar: {
        marginBottom: 20,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    timerBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    timerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },
    progressTrack: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 3,
    },

    // Question Card
    questionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    difficultyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    difficultyText: {
        fontSize: 12,
        color: '#64748B',
        textTransform: 'capitalize',
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        lineHeight: 26,
    },

    // STAR Toggle
    starToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    starToggleActive: {
        backgroundColor: '#FEF3C7',
    },
    starToggleIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    starToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    starToggleTextActive: {
        color: '#D97706',
    },

    // STAR Container
    starContainer: {
        marginBottom: 16,
    },
    starItem: {
        marginBottom: 12,
    },
    starLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 6,
    },
    starKey: {
        fontWeight: '700',
        color: '#6366F1',
    },
    starInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 60,
        textAlignVertical: 'top',
    },

    // Answer Input
    answerInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 150,
        textAlignVertical: 'top',
        marginBottom: 16,
    },

    // Navigation Buttons
    navButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    skipButton: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    nextButton: {
        flex: 2,
    },
    nextButtonGradient: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 16,
    },

    // Score Card
    scoreCard: {
        marginBottom: 20,
    },
    scoreGradient: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    scoreMax: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.6)',
    },

    // Stats Row
    statsRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },

    // Feedback Cards
    feedbackCard: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    improvementCard: {
        backgroundColor: '#FEF3C7',
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    feedbackIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    feedbackTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    feedbackItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    feedbackCheck: {
        fontSize: 14,
        color: '#10B981',
        marginRight: 8,
        fontWeight: '700',
    },
    feedbackArrow: {
        fontSize: 14,
        color: '#D97706',
        marginRight: 8,
        fontWeight: '700',
    },
    feedbackText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    retryButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    retryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    shareButton: {
        flex: 1,
    },
    shareButtonGradient: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    shareButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
