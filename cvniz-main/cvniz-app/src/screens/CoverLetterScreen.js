// Professional Cover Letter Generator Screen
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';
import { letterAPI } from '../services/api';

const LETTER_TYPES = [
    { id: 'cover', name: 'Ön Yazı', icon: '📝', desc: 'İş başvurusu için' },
    { id: 'motivation', name: 'Motivasyon', icon: '💪', desc: 'Kariyer hedefleri' },
    { id: 'recommendation', name: 'Referans Talebi', icon: '🤝', desc: 'Tavsiye mektubu' },
    { id: 'thank_you', name: 'Teşekkür', icon: '🙏', desc: 'Görüşme sonrası' },
    { id: 'resignation', name: 'İstifa', icon: '👋', desc: 'Profesyonel ayrılık' },
    { id: 'follow_up', name: 'Takip', icon: '📧', desc: 'Başvuru takibi' },
];

const TONES = [
    { id: 'professional', name: 'Profesyonel', icon: '💼' },
    { id: 'friendly', name: 'Samimi', icon: '😊' },
    { id: 'formal', name: 'Resmi', icon: '🎩' },
    { id: 'enthusiastic', name: 'Coşkulu', icon: '🚀' },
];

function TypeCard({ type, isSelected, onPress, colors }) {
    return (
        <TouchableOpacity
            style={[
                styles.typeCard,
                { backgroundColor: isSelected ? COLORS.primary + '20' : colors.surface },
                isSelected && { borderColor: COLORS.primary, borderWidth: 2 },
                SHADOW.sm
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.typeIcon}>{type.icon}</Text>
            <Text style={[styles.typeName, { color: colors.text }]}>{type.name}</Text>
            <Text style={[styles.typeDesc, { color: colors.textSecondary }]}>{type.desc}</Text>
        </TouchableOpacity>
    );
}

function ToneChip({ tone, isSelected, onPress, colors }) {
    return (
        <TouchableOpacity
            style={[
                styles.toneChip,
                { backgroundColor: isSelected ? COLORS.primary : colors.surface },
                SHADOW.sm
            ]}
            onPress={onPress}
        >
            <Text style={styles.toneIcon}>{tone.icon}</Text>
            <Text style={[styles.toneName, { color: isSelected ? '#fff' : colors.text }]}>
                {tone.name}
            </Text>
        </TouchableOpacity>
    );
}

export default function CoverLetterScreen({ navigation, route }) {
    const { colors, isDark } = useTheme();
    const { cvs } = useCV();
    const { user } = useAuth();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const [step, setStep] = useState(1);
    const [letterType, setLetterType] = useState('cover');
    const [tone, setTone] = useState('professional');
    const [selectedCV, setSelectedCV] = useState(route.params?.cvId || null);
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        highlights: '',
    });
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedLetters, setSavedLetters] = useState([]);

    useEffect(() => {
        loadSavedLetters();
    }, []);

    const loadSavedLetters = async () => {
        try {
            const response = await letterAPI.getAll();
            if (response.success) {
                setSavedLetters(response.letters || []);
            }
        } catch (error) {
            console.log('Error loading letters:', error);
        }
    };

    const handleGenerate = async () => {
        if (!formData.companyName || !formData.jobTitle) {
            Alert.alert('Uyarı', 'Şirket adı ve pozisyon gerekli');
            return;
        }

        if (!isPremium) {
            Alert.alert('Premium Özellik', 'Bu özellik Pro üyelere özeldir.');
            return;
        }

        setLoading(true);
        try {
            const response = await letterAPI.generate({
                type: letterType,
                tone,
                cvId: selectedCV,
                ...formData,
            });

            if (response.success) {
                setGeneratedLetter(response.letter);
                setStep(3);
            } else {
                Alert.alert('Hata', response.error || 'Mektup oluşturulamadı');
            }
        } catch (error) {
            Alert.alert('Hata', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Mektup Türü Seçin</Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                İhtiyacınıza uygun mektup türünü belirleyin
            </Text>

            <View style={styles.typeGrid}>
                {LETTER_TYPES.map(type => (
                    <TypeCard
                        key={type.id}
                        type={type}
                        isSelected={letterType === type.id}
                        onPress={() => setLetterType(type.id)}
                        colors={colors}
                    />
                ))}
            </View>

            <Text style={[styles.stepTitle, { color: colors.text, marginTop: SPACING.lg }]}>
                Yazım Tonu
            </Text>
            <View style={styles.toneRow}>
                {TONES.map(t => (
                    <ToneChip
                        key={t.id}
                        tone={t}
                        isSelected={tone === t.id}
                        onPress={() => setTone(t.id)}
                        colors={colors}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => setStep(2)}
                activeOpacity={0.8}
            >
                <LinearGradient colors={COLORS.gradients.primary} style={styles.continueBtnGradient}>
                    <Text style={styles.continueBtnText}>Devam Et →</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Detayları Girin</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                    AI, bu bilgileri kullanarak kişiselleştirilmiş mektup oluşturacak
                </Text>

                {/* CV Selection */}
                {cvs.length > 0 && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>CV Seçin (Opsiyonel)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {cvs.map(cv => (
                                <TouchableOpacity
                                    key={cv.id || cv._id}
                                    style={[
                                        styles.cvChip,
                                        { backgroundColor: selectedCV === (cv.id || cv._id) ? COLORS.primary : colors.surface },
                                    ]}
                                    onPress={() => setSelectedCV(cv.id || cv._id)}
                                >
                                    <Text style={{
                                        color: selectedCV === (cv.id || cv._id) ? '#fff' : colors.text,
                                        fontWeight: '600',
                                    }}>
                                        📄 {cv.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Şirket Adı *</Text>
                    <TextInput
                        style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        placeholder="ör. Google"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.companyName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Pozisyon *</Text>
                    <TextInput
                        style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        placeholder="ör. Yazılım Mühendisi"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.jobTitle}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, jobTitle: text }))}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>İş Tanımı</Text>
                    <TextInput
                        style={[styles.textInput, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        placeholder="İlan metnini yapıştırın (AI daha iyi sonuç üretir)"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.jobDescription}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, jobDescription: text }))}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>Öne Çıkarmak İstediğiniz Noktalar</Text>
                    <TextInput
                        style={[styles.textInput, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        placeholder="Deneyimleriniz, başarılarınız..."
                        placeholderTextColor={colors.textSecondary}
                        value={formData.highlights}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, highlights: text }))}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: colors.surface }]}
                        onPress={() => setStep(1)}
                    >
                        <Text style={[styles.backBtnText, { color: colors.text }]}>← Geri</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.generateBtn, { flex: 1 }]}
                        onPress={handleGenerate}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={COLORS.gradients.primary}
                            style={styles.generateBtnGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.generateBtnText}>✨ AI ile Oluştur</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );

    const renderStep3 = () => (
        <View style={styles.stepContent}>
            <View style={[styles.resultHeader, { backgroundColor: colors.surface }, SHADOW.sm]}>
                <View style={styles.resultHeaderLeft}>
                    <Text style={styles.resultIcon}>✅</Text>
                    <View>
                        <Text style={[styles.resultTitle, { color: colors.text }]}>Mektup Hazır!</Text>
                        <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>
                            {formData.companyName} - {formData.jobTitle}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={[styles.letterContainer, { backgroundColor: colors.surface }]}>
                <Text style={[styles.letterText, { color: colors.text }]}>
                    {generatedLetter}
                </Text>
            </ScrollView>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface }]}>
                    <Text style={styles.actionBtnIcon}>📋</Text>
                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Kopyala</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface }]}>
                    <Text style={styles.actionBtnIcon}>💾</Text>
                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface }]}>
                    <Text style={styles.actionBtnIcon}>📤</Text>
                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Paylaş</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.newLetterBtn}
                onPress={() => {
                    setStep(1);
                    setGeneratedLetter('');
                    setFormData({ companyName: '', jobTitle: '', jobDescription: '', highlights: '' });
                }}
            >
                <Text style={[styles.newLetterBtnText, { color: COLORS.primary }]}>+ Yeni Mektup Oluştur</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24 }}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Mektup Oluşturucu</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>AI Destekli</Text>
                </View>
                {!isPremium && (
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>👑 PRO</Text>
                    </View>
                )}
            </View>

            {/* Progress Steps */}
            <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
                {[1, 2, 3].map(s => (
                    <View key={s} style={styles.progressStep}>
                        <View style={[
                            styles.progressDot,
                            { backgroundColor: step >= s ? COLORS.primary : colors.border }
                        ]}>
                            <Text style={[styles.progressDotText, { color: step >= s ? '#fff' : colors.textSecondary }]}>
                                {s}
                            </Text>
                        </View>
                        <Text style={[styles.progressLabel, { color: step >= s ? colors.text : colors.textSecondary }]}>
                            {s === 1 ? 'Tür' : s === 2 ? 'Detaylar' : 'Sonuç'}
                        </Text>
                    </View>
                ))}
                <View style={[styles.progressLine, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressLineFill, { width: `${((step - 1) / 2) * 100}%` }]} />
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: { padding: SPACING.sm },
    headerCenter: { flex: 1, marginLeft: SPACING.sm },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerSubtitle: { fontSize: 12 },
    proBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    proBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        position: 'relative',
    },
    progressStep: { alignItems: 'center', zIndex: 1 },
    progressDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressDotText: { fontSize: 14, fontWeight: '700' },
    progressLabel: { fontSize: 11, marginTop: 4 },
    progressLine: {
        position: 'absolute',
        left: 50,
        right: 50,
        height: 3,
        top: 30,
        borderRadius: 2,
    },
    progressLineFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },

    content: { flex: 1 },
    stepContent: { padding: SPACING.md },
    stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: SPACING.xs },
    stepDesc: { fontSize: 14, marginBottom: SPACING.lg },

    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -SPACING.xs,
    },
    typeCard: {
        width: '47%',
        margin: '1.5%',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
    },
    typeIcon: { fontSize: 32, marginBottom: SPACING.xs },
    typeName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
    typeDesc: { fontSize: 11, textAlign: 'center' },

    toneRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: SPACING.sm,
    },
    toneChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    toneIcon: { fontSize: 16, marginRight: SPACING.xs },
    toneName: { fontSize: 13, fontWeight: '600' },

    continueBtn: { marginTop: SPACING.xl, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
    continueBtnGradient: { padding: SPACING.md, alignItems: 'center' },
    continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    inputGroup: { marginBottom: SPACING.md },
    inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.xs },
    textInput: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: 15,
    },
    textArea: { height: 100, textAlignVertical: 'top' },

    cvChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        marginRight: SPACING.sm,
    },

    buttonRow: {
        flexDirection: 'row',
        marginTop: SPACING.lg,
        gap: SPACING.sm,
    },
    backBtn: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
    },
    backBtnText: { fontSize: 14, fontWeight: '600' },
    generateBtn: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
    generateBtnGradient: { padding: SPACING.md, alignItems: 'center' },
    generateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
    },
    resultHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
    resultIcon: { fontSize: 32, marginRight: SPACING.sm },
    resultTitle: { fontSize: 18, fontWeight: '700' },
    resultSubtitle: { fontSize: 12 },

    letterContainer: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        maxHeight: 300,
    },
    letterText: { fontSize: 14, lineHeight: 22 },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SPACING.lg,
    },
    actionBtn: {
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        minWidth: 80,
    },
    actionBtnIcon: { fontSize: 24, marginBottom: 4 },
    actionBtnText: { fontSize: 12, fontWeight: '600' },

    newLetterBtn: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        padding: SPACING.md,
    },
    newLetterBtnText: { fontSize: 16, fontWeight: '600' },
});
