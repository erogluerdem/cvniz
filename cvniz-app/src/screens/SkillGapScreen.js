import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, TextInput, Alert, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';

// Target positions with required skills
const POSITIONS = [
    { id: 'frontend', name: 'Frontend Developer', icon: '🎨' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: '🔄' },
    { id: 'mobile', name: 'Mobile Developer', icon: '📱' },
    { id: 'devops', name: 'DevOps Engineer', icon: '🚀' },
    { id: 'data', name: 'Data Scientist', icon: '📊' },
    { id: 'pm', name: 'Product Manager', icon: '📋' },
    { id: 'uiux', name: 'UI/UX Designer', icon: '✨' },
];

// Skill requirements by position
const SKILL_REQUIREMENTS = {
    frontend: [
        { name: 'React', required: 90, category: 'framework' },
        { name: 'TypeScript', required: 80, category: 'language' },
        { name: 'CSS/SCSS', required: 85, category: 'styling' },
        { name: 'JavaScript', required: 95, category: 'language' },
        { name: 'Git', required: 80, category: 'tool' },
        { name: 'Testing', required: 70, category: 'skill' },
    ],
    backend: [
        { name: 'Node.js', required: 85, category: 'runtime' },
        { name: 'Python', required: 80, category: 'language' },
        { name: 'SQL', required: 85, category: 'database' },
        { name: 'API Design', required: 80, category: 'skill' },
        { name: 'Docker', required: 75, category: 'tool' },
        { name: 'Security', required: 70, category: 'skill' },
    ],
    fullstack: [
        { name: 'React', required: 80, category: 'framework' },
        { name: 'Node.js', required: 80, category: 'runtime' },
        { name: 'TypeScript', required: 75, category: 'language' },
        { name: 'SQL', required: 75, category: 'database' },
        { name: 'Git', required: 80, category: 'tool' },
        { name: 'DevOps', required: 60, category: 'skill' },
    ],
    mobile: [
        { name: 'React Native', required: 85, category: 'framework' },
        { name: 'Swift/Kotlin', required: 70, category: 'language' },
        { name: 'UI/UX', required: 75, category: 'skill' },
        { name: 'API Integration', required: 80, category: 'skill' },
        { name: 'App Store', required: 65, category: 'knowledge' },
    ],
    devops: [
        { name: 'Docker', required: 90, category: 'tool' },
        { name: 'Kubernetes', required: 85, category: 'tool' },
        { name: 'CI/CD', required: 85, category: 'skill' },
        { name: 'Cloud (AWS/GCP)', required: 80, category: 'platform' },
        { name: 'Linux', required: 85, category: 'os' },
        { name: 'Scripting', required: 75, category: 'skill' },
    ],
    data: [
        { name: 'Python', required: 90, category: 'language' },
        { name: 'SQL', required: 85, category: 'database' },
        { name: 'Machine Learning', required: 80, category: 'skill' },
        { name: 'Statistics', required: 85, category: 'skill' },
        { name: 'Data Visualization', required: 75, category: 'skill' },
    ],
    pm: [
        { name: 'Agile/Scrum', required: 90, category: 'methodology' },
        { name: 'Product Strategy', required: 85, category: 'skill' },
        { name: 'User Research', required: 80, category: 'skill' },
        { name: 'Analytics', required: 75, category: 'skill' },
        { name: 'Roadmapping', required: 85, category: 'skill' },
    ],
    uiux: [
        { name: 'Figma', required: 90, category: 'tool' },
        { name: 'User Research', required: 85, category: 'skill' },
        { name: 'Prototyping', required: 85, category: 'skill' },
        { name: 'Design Systems', required: 80, category: 'skill' },
        { name: 'Accessibility', required: 75, category: 'skill' },
    ],
};

// Learning resources
const LEARNING_RESOURCES = {
    'React': [
        { name: 'React Docs', url: 'https://react.dev', type: 'docs' },
        { name: 'Udemy Course', url: '#', type: 'course' },
    ],
    'TypeScript': [
        { name: 'TS Handbook', url: 'https://typescriptlang.org', type: 'docs' },
    ],
    'Node.js': [
        { name: 'Node.js Docs', url: 'https://nodejs.org', type: 'docs' },
    ],
};

export default function SkillGapScreen({ navigation }) {
    const { user } = useAuth();
    const { cvs, selectedCV } = useCV();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const [step, setStep] = useState('select'); // select, analyzing, result
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [customPosition, setCustomPosition] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const cv = cvs?.find(c => c.id === selectedCV) || cvs?.[0];

    // Extract skills from CV
    const extractCVSkills = () => {
        const skills = cv?.data?.skills || [];
        return skills.map(s => ({
            name: s.name || s,
            level: s.level || 70
        }));
    };

    // Analyze skill gap
    const handleAnalyze = async () => {
        if (!selectedPosition) {
            Alert.alert('Uyarı', 'Lütfen bir pozisyon seçin.');
            return;
        }

        setIsLoading(true);
        setStep('analyzing');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const requirements = SKILL_REQUIREMENTS[selectedPosition] || SKILL_REQUIREMENTS.frontend;
        const cvSkills = extractCVSkills();

        // Calculate match for each required skill
        const skillAnalysis = requirements.map(req => {
            const found = cvSkills.find(s => 
                s.name.toLowerCase().includes(req.name.toLowerCase()) ||
                req.name.toLowerCase().includes(s.name.toLowerCase())
            );

            const currentLevel = found?.level || 0;
            const gap = Math.max(0, req.required - currentLevel);
            const match = Math.min(100, Math.round((currentLevel / req.required) * 100));

            return {
                ...req,
                currentLevel,
                gap,
                match,
                status: match >= 90 ? 'excellent' : match >= 70 ? 'good' : match >= 40 ? 'developing' : 'missing'
            };
        });

        // Calculate overall score
        const overallScore = Math.round(
            skillAnalysis.reduce((sum, s) => sum + s.match, 0) / skillAnalysis.length
        );

        // Identify gaps and strengths
        const gaps = skillAnalysis.filter(s => s.status === 'missing' || s.status === 'developing');
        const strengths = skillAnalysis.filter(s => s.status === 'excellent' || s.status === 'good');

        setAnalysis({
            position: POSITIONS.find(p => p.id === selectedPosition),
            overallScore,
            skills: skillAnalysis,
            gaps,
            strengths,
            recommendations: [
                gaps.length > 0 ? `${gaps[0].name} becerinizi geliştirin` : 'Harika gidiyorsunuz!',
                'Proje portföyünüzü genişletin',
                'Sertifika programlarını değerlendirin'
            ]
        });

        setIsLoading(false);
        setStep('result');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent': return '#10B981';
            case 'good': return '#3B82F6';
            case 'developing': return '#F59E0B';
            case 'missing': return '#EF4444';
            default: return '#64748B';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'excellent': return 'Mükemmel';
            case 'good': return 'İyi';
            case 'developing': return 'Gelişiyor';
            case 'missing': return 'Eksik';
            default: return '-';
        }
    };

    // Position Selection
    const renderSelectStep = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroCard}>
                <LinearGradient
                    colors={['#F97316', '#EA580C']}
                    style={styles.heroGradient}
                >
                    <Text style={styles.heroIcon}>🎯</Text>
                    <Text style={styles.heroTitle}>Beceri Açığı Analizi</Text>
                    <Text style={styles.heroSubtitle}>
                        Hedef pozisyonunuz için eksik becerilerinizi keşfedin
                    </Text>
                </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>🎯 Hedef Pozisyon Seçin</Text>

            <View style={styles.positionsGrid}>
                {POSITIONS.map(pos => (
                    <TouchableOpacity
                        key={pos.id}
                        style={[
                            styles.positionCard,
                            selectedPosition === pos.id && styles.positionCardSelected
                        ]}
                        onPress={() => setSelectedPosition(pos.id)}
                    >
                        <Text style={styles.positionIcon}>{pos.icon}</Text>
                        <Text style={[
                            styles.positionName,
                            selectedPosition === pos.id && styles.positionNameSelected
                        ]}>
                            {pos.name}
                        </Text>
                        {selectedPosition === pos.id && (
                            <View style={styles.positionCheck}>
                                <Text style={styles.positionCheckIcon}>✓</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Position */}
            <View style={styles.customSection}>
                <Text style={styles.inputLabel}>Veya özel pozisyon yazın:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ör: AI Engineer"
                    placeholderTextColor="#94A3B8"
                    value={customPosition}
                    onChangeText={setCustomPosition}
                />
            </View>

            <TouchableOpacity
                style={[styles.analyzeBtn, !selectedPosition && styles.analyzeBtnDisabled]}
                onPress={handleAnalyze}
                disabled={!selectedPosition}
            >
                <LinearGradient
                    colors={selectedPosition ? ['#F97316', '#EA580C'] : ['#CBD5E1', '#CBD5E1']}
                    style={styles.analyzeBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.analyzeBtnText}>🔍 Analiz Et</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    // Analyzing
    const renderAnalyzingStep = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F97316" />
            <Text style={styles.loadingText}>CV'niz analiz ediliyor...</Text>
            <Text style={styles.loadingSubtext}>Becerileriniz değerlendiriliyor</Text>
        </View>
    );

    // Results
    const renderResultStep = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Score Card */}
            <View style={styles.scoreCard}>
                <LinearGradient
                    colors={
                        analysis.overallScore >= 80 ? ['#10B981', '#059669'] :
                        analysis.overallScore >= 60 ? ['#3B82F6', '#2563EB'] :
                        analysis.overallScore >= 40 ? ['#F59E0B', '#D97706'] :
                        ['#EF4444', '#DC2626']
                    }
                    style={styles.scoreGradient}
                >
                    <Text style={styles.scorePosition}>
                        {analysis.position?.icon} {analysis.position?.name}
                    </Text>
                    <Text style={styles.scoreValue}>{analysis.overallScore}%</Text>
                    <Text style={styles.scoreLabel}>Uyum Oranı</Text>
                </LinearGradient>
            </View>

            {/* Skill Breakdown */}
            <Text style={styles.sectionTitle}>📊 Beceri Analizi</Text>
            <View style={styles.skillsCard}>
                {analysis.skills.map((skill, index) => (
                    <View key={index} style={styles.skillItem}>
                        <View style={styles.skillHeader}>
                            <Text style={styles.skillName}>{skill.name}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(skill.status) + '20' }]}>
                                <Text style={[styles.statusText, { color: getStatusColor(skill.status) }]}>
                                    {getStatusLabel(skill.status)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.skillBars}>
                            <View style={styles.skillBarTrack}>
                                <View 
                                    style={[
                                        styles.skillBarFill, 
                                        { 
                                            width: `${skill.currentLevel}%`,
                                            backgroundColor: getStatusColor(skill.status)
                                        }
                                    ]} 
                                />
                                <View 
                                    style={[
                                        styles.skillBarRequired,
                                        { left: `${skill.required}%` }
                                    ]}
                                />
                            </View>
                            <View style={styles.skillLevels}>
                                <Text style={styles.skillLevelText}>Sizin: {skill.currentLevel}%</Text>
                                <Text style={styles.skillLevelText}>Gerekli: {skill.required}%</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Gaps */}
            {analysis.gaps.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>⚠️ Gelişim Alanları</Text>
                    <View style={styles.gapsCard}>
                        {analysis.gaps.map((gap, index) => (
                            <View key={index} style={styles.gapItem}>
                                <View style={styles.gapInfo}>
                                    <Text style={styles.gapName}>{gap.name}</Text>
                                    <Text style={styles.gapLevel}>+{gap.gap}% gerekli</Text>
                                </View>
                                <TouchableOpacity style={styles.learnBtn}>
                                    <Text style={styles.learnBtnText}>📚 Öğren</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>💪 Güçlü Yönler</Text>
                    <View style={styles.strengthsCard}>
                        {analysis.strengths.map((str, index) => (
                            <View key={index} style={styles.strengthItem}>
                                <Text style={styles.strengthIcon}>✓</Text>
                                <Text style={styles.strengthName}>{str.name}</Text>
                                <Text style={styles.strengthLevel}>{str.currentLevel}%</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {/* Recommendations */}
            <Text style={styles.sectionTitle}>💡 Öneriler</Text>
            <View style={styles.recsCard}>
                {analysis.recommendations.map((rec, index) => (
                    <View key={index} style={styles.recItem}>
                        <Text style={styles.recNumber}>{index + 1}</Text>
                        <Text style={styles.recText}>{rec}</Text>
                    </View>
                ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.retryBtn} onPress={() => { setStep('select'); setAnalysis(null); }}>
                    <Text style={styles.retryBtnText}>🔄 Yeniden Analiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn}>
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        style={styles.shareBtnGradient}
                    >
                        <Text style={styles.shareBtnText}>📤 Paylaş</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>🎯 Skill Gap</Text>
                    <Text style={styles.headerSubtitle}>
                        {step === 'select' && 'Pozisyon seçin'}
                        {step === 'analyzing' && 'Analiz ediliyor...'}
                        {step === 'result' && 'Sonuçlar'}
                    </Text>
                </View>
                {!isPremium && (
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                )}
            </View>

            {step === 'select' && renderSelectStep()}
            {step === 'analyzing' && renderAnalyzingStep()}
            {step === 'result' && renderResultStep()}
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

    // Hero Card
    heroCard: {
        marginBottom: 24,
    },
    heroGradient: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    heroIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },

    // Positions Grid
    positionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
        marginBottom: 20,
    },
    positionCard: {
        width: '50%',
        padding: 6,
    },
    positionCardSelected: {},
    positionCardInner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    positionIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    positionName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
        textAlign: 'center',
    },
    positionNameSelected: {
        color: '#F97316',
    },
    positionCheck: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
    },
    positionCheckIcon: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // Custom Section
    customSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
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

    // Analyze Button
    analyzeBtn: {
        marginBottom: 20,
    },
    analyzeBtnDisabled: {
        opacity: 0.6,
    },
    analyzeBtnGradient: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    analyzeBtnText: {
        fontSize: 16,
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
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginTop: 20,
    },
    loadingSubtext: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
    },

    // Score Card
    scoreCard: {
        marginBottom: 24,
    },
    scoreGradient: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    scorePosition: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    scoreLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },

    // Skills Card
    skillsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    skillItem: {
        marginBottom: 16,
    },
    skillHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    skillName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    skillBars: {},
    skillBarTrack: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'visible',
        position: 'relative',
    },
    skillBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    skillBarRequired: {
        position: 'absolute',
        top: -4,
        width: 2,
        height: 16,
        backgroundColor: '#0F172A',
    },
    skillLevels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    skillLevelText: {
        fontSize: 11,
        color: '#64748B',
    },

    // Gaps Card
    gapsCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    gapItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FECACA',
    },
    gapInfo: {
        flex: 1,
    },
    gapName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    gapLevel: {
        fontSize: 12,
        color: '#EF4444',
        marginTop: 2,
    },
    learnBtn: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    learnBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },

    // Strengths Card
    strengthsCard: {
        backgroundColor: '#ECFDF5',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    strengthItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    strengthIcon: {
        fontSize: 16,
        color: '#10B981',
        marginRight: 10,
        fontWeight: '700',
    },
    strengthName: {
        flex: 1,
        fontSize: 14,
        color: '#0F172A',
    },
    strengthLevel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
    },

    // Recommendations Card
    recsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    recItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
    },
    recNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        textAlign: 'center',
        lineHeight: 24,
        fontSize: 12,
        fontWeight: '700',
        color: '#6366F1',
        marginRight: 12,
    },
    recText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },

    // Action Row
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    retryBtn: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    retryBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    shareBtn: {
        flex: 1,
    },
    shareBtnGradient: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    shareBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
