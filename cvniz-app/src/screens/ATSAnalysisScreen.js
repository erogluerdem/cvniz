// Professional ATS Analysis Screen
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, StatusBar, Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';
import { reviewAPI } from '../services/api';

const { width } = Dimensions.get('window');

function ScoreCircle({ score, size = 120, colors }) {
    const getScoreColor = (s) => {
        if (s >= 80) return '#10B981';
        if (s >= 60) return '#F59E0B';
        return '#EF4444';
    };

    const color = getScoreColor(score);

    return (
        <View style={[styles.scoreCircle, { width: size, height: size }]}>
            <LinearGradient
                colors={[color + '30', color + '10']}
                style={[styles.scoreCircleInner, { width: size - 10, height: size - 10 }]}
            >
                <Text style={[styles.scoreValue, { color, fontSize: size * 0.35 }]}>{score}</Text>
                <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>/ 100</Text>
            </LinearGradient>
        </View>
    );
}

function CategoryCard({ category, colors }) {
    const getStatusIcon = (status) => {
        if (status === 'good') return '✅';
        if (status === 'warning') return '⚠️';
        return '❌';
    };

    const getStatusColor = (status) => {
        if (status === 'good') return '#10B981';
        if (status === 'warning') return '#F59E0B';
        return '#EF4444';
    };

    return (
        <View style={[styles.categoryCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
            <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: getStatusColor(category.status) + '20' }]}>
                    <Text style={{ fontSize: 20 }}>{category.icon}</Text>
                </View>
                <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                    <Text style={[styles.categoryScore, { color: getStatusColor(category.status) }]}>
                        {category.score}%
                    </Text>
                </View>
                <Text style={{ fontSize: 20 }}>{getStatusIcon(category.status)}</Text>
            </View>
            <Text style={[styles.categoryDesc, { color: colors.textSecondary }]}>{category.description}</Text>
            {category.suggestions && category.suggestions.length > 0 && (
                <View style={styles.suggestionList}>
                    {category.suggestions.map((s, i) => (
                        <View key={i} style={styles.suggestionItem}>
                            <Text style={styles.suggestionBullet}>💡</Text>
                            <Text style={[styles.suggestionText, { color: colors.text }]}>{s}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

function KeywordTag({ keyword, found, colors }) {
    return (
        <View style={[
            styles.keywordTag,
            { backgroundColor: found ? '#10B981' + '20' : '#EF4444' + '20' }
        ]}>
            <Text style={{ fontSize: 12 }}>{found ? '✓' : '✗'}</Text>
            <Text style={[
                styles.keywordText,
                { color: found ? '#10B981' : '#EF4444' }
            ]}>
                {keyword}
            </Text>
        </View>
    );
}

export default function ATSAnalysisScreen({ navigation, route }) {
    const { colors, isDark } = useTheme();
    const { cvs, getCV } = useCV();
    const { user } = useAuth();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const cvId = route.params?.cvId;
    const [selectedCV, setSelectedCV] = useState(cvId || null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const mockAnalysis = {
        overallScore: 72,
        categories: [
            {
                id: 'contact',
                name: 'İletişim Bilgileri',
                icon: '📞',
                score: 100,
                status: 'good',
                description: 'Tüm iletişim bilgileri mevcut.',
                suggestions: [],
            },
            {
                id: 'experience',
                name: 'Deneyim Bölümü',
                icon: '💼',
                score: 75,
                status: 'warning',
                description: 'Deneyim bölümü iyi ancak iyileştirilebilir.',
                suggestions: [
                    'Başarılarınızı rakamlarla destekleyin',
                    'Eylem fiilleri kullanın',
                ],
            },
            {
                id: 'keywords',
                name: 'Anahtar Kelimeler',
                icon: '🔑',
                score: 60,
                status: 'warning',
                description: 'Bazı önemli anahtar kelimeler eksik.',
                suggestions: [
                    'Sektör terimlerini ekleyin',
                    'İş ilanındaki kelimeleri kullanın',
                ],
            },
            {
                id: 'format',
                name: 'Format ve Yapı',
                icon: '📋',
                score: 85,
                status: 'good',
                description: 'CV formatı ATS uyumlu.',
                suggestions: [],
            },
            {
                id: 'skills',
                name: 'Yetenekler',
                icon: '⚡',
                score: 50,
                status: 'error',
                description: 'Yetenek bölümü yetersiz.',
                suggestions: [
                    'Teknik yeteneklerinizi listeleyin',
                    'Sertifikalarınızı ekleyin',
                ],
            },
        ],
        keywords: {
            found: ['JavaScript', 'React', 'Node.js', 'Git'],
            missing: ['TypeScript', 'AWS', 'Docker', 'CI/CD'],
        },
        recommendations: [
            'CV\'nizde ölçülebilir başarılar ekleyin',
            'Teknik yetenek bölümünü genişletin',
            'Sertifika ve eğitimlerinizi belirtin',
            'LinkedIn profilinizi ekleyin',
        ],
    };

    const handleAnalyze = async () => {
        if (!selectedCV) return;

        setLoading(true);
        try {
            // Gerçek API çağrısı
            const response = await reviewAPI.getATS(selectedCV);
            if (response.success) {
                setAnalysis(response.analysis);
            } else {
                // Mock data kullan
                setAnalysis(mockAnalysis);
            }
        } catch (error) {
            // Mock data kullan demo için
            setAnalysis(mockAnalysis);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCV) {
            handleAnalyze();
        }
    }, [selectedCV]);

    const renderCVSelection = () => (
        <View style={styles.cvSelection}>
            <Text style={[styles.selectionTitle, { color: colors.text }]}>Analiz Edilecek CV</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cvs.map(cv => (
                    <TouchableOpacity
                        key={cv.id || cv._id}
                        style={[
                            styles.cvCard,
                            { backgroundColor: selectedCV === (cv.id || cv._id) ? COLORS.primary + '20' : colors.surface },
                            selectedCV === (cv.id || cv._id) && { borderColor: COLORS.primary, borderWidth: 2 },
                            SHADOW.sm
                        ]}
                        onPress={() => setSelectedCV(cv.id || cv._id)}
                    >
                        <Text style={styles.cvEmoji}>📄</Text>
                        <Text style={[styles.cvName, { color: colors.text }]} numberOfLines={1}>
                            {cv.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderAnalysis = () => (
        <ScrollView style={styles.analysisContent} showsVerticalScrollIndicator={false}>
            {/* Overall Score */}
            <View style={[styles.scoreSection, { backgroundColor: colors.surface }, SHADOW.md]}>
                <View style={styles.scoreHeader}>
                    <ScoreCircle score={analysis.overallScore} colors={colors} />
                    <View style={styles.scoreInfo}>
                        <Text style={[styles.scoreTitle, { color: colors.text }]}>ATS Uyumluluk Skoru</Text>
                        <Text style={[styles.scoreDesc, { color: colors.textSecondary }]}>
                            {analysis.overallScore >= 80 ? 'Harika! CV\'niz ATS sistemlerinde yüksek performans gösterecek.' :
                                analysis.overallScore >= 60 ? 'İyi! Birkaç iyileştirme ile daha yüksek skor alabilirsiniz.' :
                                    'Geliştirme gerekli. Önerileri takip edin.'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Categories */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Detaylı Analiz</Text>
            {analysis.categories.map(cat => (
                <CategoryCard key={cat.id} category={cat} colors={colors} />
            ))}

            {/* Keywords */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Anahtar Kelime Analizi</Text>
            <View style={[styles.keywordsSection, { backgroundColor: colors.surface }, SHADOW.sm]}>
                <Text style={[styles.keywordsSubtitle, { color: '#10B981' }]}>✅ Bulunan Kelimeler</Text>
                <View style={styles.keywordGrid}>
                    {analysis.keywords.found.map((k, i) => (
                        <KeywordTag key={i} keyword={k} found colors={colors} />
                    ))}
                </View>

                <Text style={[styles.keywordsSubtitle, { color: '#EF4444', marginTop: SPACING.md }]}>
                    ❌ Eksik Kelimeler
                </Text>
                <View style={styles.keywordGrid}>
                    {analysis.keywords.missing.map((k, i) => (
                        <KeywordTag key={i} keyword={k} found={false} colors={colors} />
                    ))}
                </View>
            </View>

            {/* Recommendations */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Öneriler</Text>
            <View style={[styles.recommendationsSection, { backgroundColor: colors.surface }, SHADOW.sm]}>
                {analysis.recommendations.map((rec, i) => (
                    <View key={i} style={styles.recommendationItem}>
                        <View style={styles.recommendationNumber}>
                            <Text style={styles.recommendationNumberText}>{i + 1}</Text>
                        </View>
                        <Text style={[styles.recommendationText, { color: colors.text }]}>{rec}</Text>
                    </View>
                ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Editor', { cvId: selectedCV })}
                >
                    <LinearGradient colors={COLORS.gradients.primary} style={styles.actionBtnGradient}>
                        <Text style={styles.actionBtnText}>✏️ CV'yi Düzenle</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtnSecondary, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.actionBtnSecondaryText, { color: colors.text }]}>📤 Raporu Paylaş</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <LinearGradient colors={COLORS.gradients.dark} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: '#fff' }}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>ATS Analizi</Text>
                    <Text style={styles.headerSubtitle}>CV Uyumluluk Kontrolü</Text>
                </View>
                <View style={styles.headerIcon}>
                    <Text style={{ fontSize: 28 }}>🎯</Text>
                </View>
            </LinearGradient>

            {/* CV Selection */}
            {renderCVSelection()}

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        CV analiz ediliyor...
                    </Text>
                </View>
            ) : analysis ? (
                renderAnalysis()
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📊</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>CV Seçin</Text>
                    <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                        Analiz için yukarıdan bir CV seçin
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
    },
    backButton: { padding: SPACING.sm },
    headerCenter: { flex: 1, marginLeft: SPACING.sm },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
    headerIcon: { padding: SPACING.sm },

    cvSelection: { padding: SPACING.md },
    selectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: SPACING.sm },
    cvCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginRight: SPACING.sm,
        alignItems: 'center',
        minWidth: 100,
    },
    cvEmoji: { fontSize: 28, marginBottom: SPACING.xs },
    cvName: { fontSize: 12, fontWeight: '600' },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { marginTop: SPACING.md, fontSize: 14 },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.md },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: SPACING.xs },
    emptyDesc: { fontSize: 14, textAlign: 'center' },

    analysisContent: { flex: 1, padding: SPACING.md },

    scoreSection: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.lg,
    },
    scoreHeader: { flexDirection: 'row', alignItems: 'center' },
    scoreCircle: {
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    scoreCircleInner: {
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreValue: { fontWeight: '800' },
    scoreLabel: { fontSize: 14 },
    scoreInfo: { flex: 1, marginLeft: SPACING.md },
    scoreTitle: { fontSize: 18, fontWeight: '700', marginBottom: SPACING.xs },
    scoreDesc: { fontSize: 13, lineHeight: 18 },

    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: SPACING.md, marginTop: SPACING.sm },

    categoryCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
    },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryInfo: { flex: 1, marginLeft: SPACING.sm },
    categoryName: { fontSize: 15, fontWeight: '600' },
    categoryScore: { fontSize: 13, fontWeight: '700' },
    categoryDesc: { fontSize: 13, marginBottom: SPACING.sm },
    suggestionList: { marginTop: SPACING.xs },
    suggestionItem: { flexDirection: 'row', marginBottom: SPACING.xs },
    suggestionBullet: { fontSize: 12, marginRight: SPACING.xs },
    suggestionText: { fontSize: 13, flex: 1 },

    keywordsSection: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
    },
    keywordsSubtitle: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.sm },
    keywordGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    keywordTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
        marginRight: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    keywordText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },

    recommendationsSection: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
    },
    recommendationItem: { flexDirection: 'row', marginBottom: SPACING.md },
    recommendationNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    recommendationNumberText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    recommendationText: { fontSize: 14, flex: 1, lineHeight: 20 },

    actionButtons: { marginTop: SPACING.lg },
    actionBtn: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.sm },
    actionBtnGradient: { padding: SPACING.md, alignItems: 'center' },
    actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    actionBtnSecondary: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
    },
    actionBtnSecondaryText: { fontSize: 16, fontWeight: '600' },
});
