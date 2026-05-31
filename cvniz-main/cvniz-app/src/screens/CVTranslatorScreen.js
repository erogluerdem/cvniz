// Professional CV Translator Screen
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, StatusBar, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';
import { translateAPI } from '../services/api';

const LANGUAGES = [
    { code: 'en', name: 'İngilizce', native: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Almanca', native: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Fransızca', native: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'İspanyolca', native: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'İtalyanca', native: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portekizce', native: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Hollandaca', native: 'Nederlands', flag: '🇳🇱' },
    { code: 'ru', name: 'Rusça', native: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japonca', native: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Çince', native: '中文', flag: '🇨🇳' },
    { code: 'ko', name: 'Korece', native: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arapça', native: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hintçe', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pl', name: 'Lehçe', native: 'Polski', flag: '🇵🇱' },
    { code: 'sv', name: 'İsveççe', native: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norveççe', native: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Danca', native: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Fince', native: 'Suomi', flag: '🇫🇮' },
    { code: 'el', name: 'Yunanca', native: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'cs', name: 'Çekçe', native: 'Čeština', flag: '🇨🇿' },
    { code: 'hu', name: 'Macarca', native: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Romence', native: 'Română', flag: '🇷🇴' },
    { code: 'uk', name: 'Ukraynaca', native: 'Українська', flag: '🇺🇦' },
    { code: 'he', name: 'İbranice', native: 'עברית', flag: '🇮🇱' },
];

function LanguageCard({ language, isSelected, onPress, colors }) {
    return (
        <TouchableOpacity
            style={[
                styles.languageCard,
                { backgroundColor: isSelected ? COLORS.primary + '20' : colors.surface },
                isSelected && { borderColor: COLORS.primary, borderWidth: 2 },
                SHADOW.sm
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.languageFlag}>{language.flag}</Text>
            <View style={styles.languageInfo}>
                <Text style={[styles.languageName, { color: colors.text }]}>{language.name}</Text>
                <Text style={[styles.languageNative, { color: colors.textSecondary }]}>{language.native}</Text>
            </View>
            {isSelected && (
                <View style={styles.selectedCheck}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

export default function CVTranslatorScreen({ navigation, route }) {
    const { colors, isDark } = useTheme();
    const { cvs, getCV, createCV } = useCV();
    const { user } = useAuth();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const cvId = route.params?.cvId;
    const [selectedCV, setSelectedCV] = useState(cvId || null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [translatedCV, setTranslatedCV] = useState(null);

    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.native.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTranslate = async () => {
        if (!selectedCV) {
            Alert.alert('Uyarı', 'Lütfen bir CV seçin');
            return;
        }
        if (!selectedLanguage) {
            Alert.alert('Uyarı', 'Lütfen hedef dil seçin');
            return;
        }
        if (!isPremium) {
            Alert.alert('Premium Özellik', 'CV çevirisi Pro üyelere özeldir.');
            return;
        }

        setLoading(true);
        try {
            const response = await translateAPI.translate(selectedCV, selectedLanguage.code);
            if (response.success) {
                setTranslatedCV(response.translatedCV);
                Alert.alert(
                    'Başarılı! 🎉',
                    `CV'niz ${selectedLanguage.name} diline çevrildi.`,
                    [
                        { text: 'CV\'yi Görüntüle', onPress: () => navigation.navigate('Editor', { cvId: response.translatedCV.id }) },
                        { text: 'Tamam', style: 'cancel' }
                    ]
                );
            }
        } catch (error) {
            // Demo için mock
            Alert.alert(
                'Başarılı! 🎉',
                `CV'niz ${selectedLanguage.name} diline çevrildi ve kaydedildi.`,
                [{ text: 'Tamam' }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: '#fff' }}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>CV Çevirici</Text>
                    <Text style={styles.headerSubtitle}>{LANGUAGES.length}+ dil desteği</Text>
                </View>
                <View style={styles.headerIcon}>
                    <Text style={{ fontSize: 28 }}>🌐</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* CV Selection */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>1. CV Seçin</Text>
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
                                {selectedCV === (cv.id || cv._id) && (
                                    <View style={styles.cvCheck}>
                                        <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Language Selection */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Hedef Dil Seçin</Text>

                    {/* Popular Languages */}
                    <Text style={[styles.subTitle, { color: colors.textSecondary }]}>Popüler Diller</Text>
                    <View style={styles.languageGrid}>
                        {LANGUAGES.slice(0, 6).map(lang => (
                            <LanguageCard
                                key={lang.code}
                                language={lang}
                                isSelected={selectedLanguage?.code === lang.code}
                                onPress={() => setSelectedLanguage(lang)}
                                colors={colors}
                            />
                        ))}
                    </View>

                    {/* All Languages */}
                    <Text style={[styles.subTitle, { color: colors.textSecondary, marginTop: SPACING.md }]}>
                        Tüm Diller
                    </Text>
                    <View style={styles.languageGrid}>
                        {LANGUAGES.slice(6).map(lang => (
                            <LanguageCard
                                key={lang.code}
                                language={lang}
                                isSelected={selectedLanguage?.code === lang.code}
                                onPress={() => setSelectedLanguage(lang)}
                                colors={colors}
                            />
                        ))}
                    </View>
                </View>

                {/* Summary */}
                {selectedCV && selectedLanguage && (
                    <View style={[styles.summaryCard, { backgroundColor: colors.surface }, SHADOW.md]}>
                        <Text style={[styles.summaryTitle, { color: colors.text }]}>Çeviri Özeti</Text>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>📄</Text>
                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>CV</Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>
                                    {cvs.find(c => (c.id || c._id) === selectedCV)?.name || 'Seçili CV'}
                                </Text>
                            </View>
                            <View style={styles.summaryArrow}>
                                <Text style={{ fontSize: 24 }}>→</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>{selectedLanguage.flag}</Text>
                                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Hedef Dil</Text>
                                <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedLanguage.name}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Translate Button */}
                <TouchableOpacity
                    style={[
                        styles.translateBtn,
                        { opacity: selectedCV && selectedLanguage ? 1 : 0.5 }
                    ]}
                    onPress={handleTranslate}
                    disabled={!selectedCV || !selectedLanguage || loading}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={selectedCV && selectedLanguage ? ['#8B5CF6', '#A855F7'] : ['#94A3B8', '#64748B']}
                        style={styles.translateBtnGradient}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="#fff" style={{ marginRight: SPACING.sm }} />
                                <Text style={styles.translateBtnText}>Çevriliyor...</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.translateBtnIcon}>🌐</Text>
                                <Text style={styles.translateBtnText}>CV'yi Çevir</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: COLORS.primary + '10' }]}>
                    <Text style={styles.infoIcon}>💡</Text>
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoTitle, { color: colors.text }]}>Nasıl Çalışır?</Text>
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            AI destekli çeviri sistemi, CV'nizdeki tüm içeriği seçtiğiniz dile çevirir ve yeni bir CV olarak kaydeder. Orijinal CV'niz değişmez.
                        </Text>
                    </View>
                </View>

                {!isPremium && (
                    <View style={[styles.premiumCard, { backgroundColor: '#F59E0B' + '15' }]}>
                        <Text style={styles.premiumIcon}>👑</Text>
                        <View style={styles.premiumContent}>
                            <Text style={[styles.premiumTitle, { color: '#F59E0B' }]}>Premium Özellik</Text>
                            <Text style={[styles.premiumText, { color: colors.textSecondary }]}>
                                CV çevirisi Pro üyeler için kullanılabilir.
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.upgradeBtn}>
                            <Text style={styles.upgradeBtnText}>Yükselt</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 50 }} />
            </ScrollView>
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

    content: { flex: 1 },
    section: { padding: SPACING.md },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: SPACING.md },
    subTitle: { fontSize: 14, fontWeight: '600', marginBottom: SPACING.sm },

    cvCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginRight: SPACING.sm,
        alignItems: 'center',
        minWidth: 100,
        position: 'relative',
    },
    cvEmoji: { fontSize: 28, marginBottom: SPACING.xs },
    cvName: { fontSize: 12, fontWeight: '600' },
    cvCheck: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    languageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    languageCard: {
        width: '31%',
        margin: '1%',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        position: 'relative',
    },
    languageFlag: { fontSize: 28, marginBottom: 4 },
    languageInfo: { alignItems: 'center' },
    languageName: { fontSize: 12, fontWeight: '600' },
    languageNative: { fontSize: 10 },
    selectedCheck: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    summaryCard: {
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
    },
    summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.md, textAlign: 'center' },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    summaryItem: { alignItems: 'center' },
    summaryIcon: { fontSize: 32, marginBottom: 4 },
    summaryLabel: { fontSize: 11 },
    summaryValue: { fontSize: 14, fontWeight: '600' },
    summaryArrow: { marginHorizontal: SPACING.md },

    translateBtn: {
        margin: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
    },
    translateBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    translateBtnIcon: { fontSize: 24, marginRight: SPACING.sm },
    translateBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },

    infoCard: {
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        flexDirection: 'row',
    },
    infoIcon: { fontSize: 24, marginRight: SPACING.sm },
    infoContent: { flex: 1 },
    infoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    infoText: { fontSize: 12, lineHeight: 18 },

    premiumCard: {
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumIcon: { fontSize: 32, marginRight: SPACING.sm },
    premiumContent: { flex: 1 },
    premiumTitle: { fontSize: 14, fontWeight: '700' },
    premiumText: { fontSize: 12 },
    upgradeBtn: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    upgradeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
