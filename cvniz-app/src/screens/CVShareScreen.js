// Professional CV Share Screen
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Switch, Alert, ActivityIndicator, StatusBar,
    Share, Clipboard, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useCV } from '../context/CVContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';
import { shareAPI, analyticsAPI } from '../services/api';

function StatCard({ icon, value, label, colors }) {
    return (
        <View style={[styles.statCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
            <Text style={styles.statIcon}>{icon}</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );
}

function ShareOption({ icon, name, desc, onPress, colors, active }) {
    return (
        <TouchableOpacity
            style={[
                styles.shareOption,
                { backgroundColor: colors.surface },
                active && { borderColor: COLORS.primary, borderWidth: 2 },
                SHADOW.sm
            ]}
            onPress={onPress}
        >
            <View style={[styles.shareOptionIcon, { backgroundColor: COLORS.primary + '15' }]}>
                <Text style={{ fontSize: 24 }}>{icon}</Text>
            </View>
            <View style={styles.shareOptionInfo}>
                <Text style={[styles.shareOptionName, { color: colors.text }]}>{name}</Text>
                <Text style={[styles.shareOptionDesc, { color: colors.textSecondary }]}>{desc}</Text>
            </View>
            {active && <Text style={{ color: COLORS.primary, fontSize: 18 }}>✓</Text>}
        </TouchableOpacity>
    );
}

export default function CVShareScreen({ navigation, route }) {
    const { colors, isDark } = useTheme();
    const { cvs, getCV } = useCV();

    const cvId = route.params?.cvId;
    const cv = cvId ? getCV(cvId)?.cv : null;

    const [selectedCV, setSelectedCV] = useState(cvId || null);
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        isPublic: true,
        allowDownload: false,
        showContactInfo: true,
        expiresIn: 'never',
        password: '',
    });
    const [stats, setStats] = useState({
        views: 0,
        downloads: 0,
        uniqueVisitors: 0,
    });

    const expiryOptions = [
        { id: 'never', name: 'Süresiz', icon: '♾️' },
        { id: '7days', name: '7 Gün', icon: '📅' },
        { id: '30days', name: '30 Gün', icon: '📆' },
        { id: '90days', name: '90 Gün', icon: '🗓️' },
    ];

    useEffect(() => {
        if (selectedCV) {
            loadShareSettings();
            loadStats();
        }
    }, [selectedCV]);

    const loadShareSettings = async () => {
        try {
            const response = await shareAPI.getShareSettings(selectedCV);
            if (response.success && response.shareLink) {
                setShareLink(response.shareLink);
                setSettings(prev => ({ ...prev, ...response.settings }));
            }
        } catch (error) {
            console.log('Error loading share settings');
        }
    };

    const loadStats = async () => {
        try {
            const response = await analyticsAPI.getCVStats(selectedCV);
            if (response.success) {
                setStats(response.stats);
            }
        } catch (error) {
            // Mock stats
            setStats({ views: 127, downloads: 23, uniqueVisitors: 89 });
        }
    };

    const handleCreateLink = async () => {
        if (!selectedCV) {
            Alert.alert('Uyarı', 'Lütfen bir CV seçin');
            return;
        }

        setLoading(true);
        try {
            const response = await shareAPI.createLink(selectedCV, settings);
            if (response.success) {
                setShareLink(response.shareLink);
                Alert.alert('Başarılı', 'Paylaşım linki oluşturuldu!');
            } else {
                // Mock link
                setShareLink(`https://CVniz.app/cv/${selectedCV}`);
            }
        } catch (error) {
            // Mock link for demo
            setShareLink(`https://CVniz.app/cv/${selectedCV}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = async () => {
        if (shareLink) {
            await Clipboard.setString(shareLink);
            Alert.alert('Kopyalandı', 'Link panoya kopyalandı');
        }
    };

    const handleShare = async () => {
        if (shareLink) {
            try {
                await Share.share({
                    message: `CV'me göz atın: ${shareLink}`,
                    url: shareLink,
                    title: 'CV Paylaş',
                });
            } catch (error) {
                console.log('Share error:', error);
            }
        }
    };

    const handleDeleteLink = () => {
        Alert.alert(
            'Linki Sil',
            'Bu paylaşım linki silinecek ve artık erişilemeyecek.',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await shareAPI.deleteShareLink(selectedCV);
                            setShareLink('');
                            Alert.alert('Başarılı', 'Paylaşım linki silindi');
                        } catch (error) {
                            setShareLink('');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: '#fff' }}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>CV Paylaş</Text>
                    <Text style={styles.headerSubtitle}>Link ile paylaşın</Text>
                </View>
                <View style={styles.headerIcon}>
                    <Text style={{ fontSize: 28 }}>🔗</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* CV Selection */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>CV Seçin</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {cvs.map(cvItem => (
                            <TouchableOpacity
                                key={cvItem.id || cvItem._id}
                                style={[
                                    styles.cvCard,
                                    { backgroundColor: selectedCV === (cvItem.id || cvItem._id) ? COLORS.primary + '20' : colors.surface },
                                    selectedCV === (cvItem.id || cvItem._id) && { borderColor: COLORS.primary, borderWidth: 2 },
                                    SHADOW.sm
                                ]}
                                onPress={() => setSelectedCV(cvItem.id || cvItem._id)}
                            >
                                <Text style={styles.cvEmoji}>📄</Text>
                                <Text style={[styles.cvName, { color: colors.text }]} numberOfLines={1}>
                                    {cvItem.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Stats */}
                {shareLink && (
                    <View style={styles.statsRow}>
                        <StatCard icon="👁️" value={stats.views} label="Görüntüleme" colors={colors} />
                        <StatCard icon="⬇️" value={stats.downloads} label="İndirme" colors={colors} />
                        <StatCard icon="👤" value={stats.uniqueVisitors} label="Ziyaretçi" colors={colors} />
                    </View>
                )}

                {/* Share Link */}
                {shareLink ? (
                    <View style={[styles.linkContainer, { backgroundColor: colors.surface }, SHADOW.md]}>
                        <View style={styles.linkHeader}>
                            <Text style={{ fontSize: 24 }}>🔗</Text>
                            <Text style={[styles.linkTitle, { color: colors.text }]}>Paylaşım Linkiniz</Text>
                            <View style={styles.activeBadge}>
                                <Text style={styles.activeBadgeText}>Aktif</Text>
                            </View>
                        </View>

                        <View style={[styles.linkBox, { backgroundColor: colors.background }]}>
                            <Text style={[styles.linkText, { color: colors.text }]} numberOfLines={1}>
                                {shareLink}
                            </Text>
                        </View>

                        <View style={styles.linkActions}>
                            <TouchableOpacity style={[styles.linkBtn, { backgroundColor: COLORS.primary }]} onPress={handleCopyLink}>
                                <Text style={styles.linkBtnIcon}>📋</Text>
                                <Text style={styles.linkBtnText}>Kopyala</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#10B981' }]} onPress={handleShare}>
                                <Text style={styles.linkBtnIcon}>📤</Text>
                                <Text style={styles.linkBtnText}>Paylaş</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#EF4444' }]} onPress={handleDeleteLink}>
                                <Text style={styles.linkBtnIcon}>🗑️</Text>
                                <Text style={styles.linkBtnText}>Sil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.createLinkBtn}
                        onPress={handleCreateLink}
                        disabled={loading || !selectedCV}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={selectedCV ? COLORS.gradients.primary : ['#94A3B8', '#64748B']}
                            style={styles.createLinkBtnGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.createLinkBtnIcon}>🔗</Text>
                                    <Text style={styles.createLinkBtnText}>Paylaşım Linki Oluştur</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Paylaşım Ayarları</Text>

                    <View style={[styles.settingCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingName, { color: colors.text }]}>Herkese Açık</Text>
                                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                                    Link ile herkes görüntüleyebilir
                                </Text>
                            </View>
                            <Switch
                                value={settings.isPublic}
                                onValueChange={(v) => setSettings(prev => ({ ...prev, isPublic: v }))}
                                trackColor={{ false: colors.border, true: COLORS.primary + '50' }}
                                thumbColor={settings.isPublic ? COLORS.primary : colors.textSecondary}
                            />
                        </View>

                        <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingName, { color: colors.text }]}>İndirmeye İzin Ver</Text>
                                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                                    PDF olarak indirilebilir
                                </Text>
                            </View>
                            <Switch
                                value={settings.allowDownload}
                                onValueChange={(v) => setSettings(prev => ({ ...prev, allowDownload: v }))}
                                trackColor={{ false: colors.border, true: COLORS.primary + '50' }}
                                thumbColor={settings.allowDownload ? COLORS.primary : colors.textSecondary}
                            />
                        </View>

                        <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingName, { color: colors.text }]}>İletişim Bilgileri</Text>
                                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                                    Telefon ve e-posta göster
                                </Text>
                            </View>
                            <Switch
                                value={settings.showContactInfo}
                                onValueChange={(v) => setSettings(prev => ({ ...prev, showContactInfo: v }))}
                                trackColor={{ false: colors.border, true: COLORS.primary + '50' }}
                                thumbColor={settings.showContactInfo ? COLORS.primary : colors.textSecondary}
                            />
                        </View>
                    </View>
                </View>

                {/* Expiry Options */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Link Süresi</Text>
                    <View style={styles.expiryGrid}>
                        {expiryOptions.map(option => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.expiryCard,
                                    { backgroundColor: settings.expiresIn === option.id ? COLORS.primary + '20' : colors.surface },
                                    settings.expiresIn === option.id && { borderColor: COLORS.primary, borderWidth: 2 },
                                    SHADOW.sm
                                ]}
                                onPress={() => setSettings(prev => ({ ...prev, expiresIn: option.id }))}
                            >
                                <Text style={styles.expiryIcon}>{option.icon}</Text>
                                <Text style={[styles.expiryName, { color: colors.text }]}>{option.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Password Protection */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Şifre Koruması (Opsiyonel)</Text>
                    <View style={[styles.passwordContainer, { backgroundColor: colors.surface }, SHADOW.sm]}>
                        <Text style={styles.passwordIcon}>🔐</Text>
                        <TextInput
                            style={[styles.passwordInput, { color: colors.text }]}
                            placeholder="Şifre belirleyin"
                            placeholderTextColor={colors.textSecondary}
                            value={settings.password}
                            onChangeText={(text) => setSettings(prev => ({ ...prev, password: text }))}
                            secureTextEntry
                        />
                    </View>
                </View>

                {/* Share Options */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Hızlı Paylaşım</Text>
                    <View style={styles.quickShareRow}>
                        <TouchableOpacity style={[styles.quickShareBtn, { backgroundColor: '#25D366' }]}>
                            <Text style={styles.quickShareIcon}>📱</Text>
                            <Text style={styles.quickShareText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickShareBtn, { backgroundColor: '#0077B5' }]}>
                            <Text style={styles.quickShareIcon}>💼</Text>
                            <Text style={styles.quickShareText}>LinkedIn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickShareBtn, { backgroundColor: '#1DA1F2' }]}>
                            <Text style={styles.quickShareIcon}>🐦</Text>
                            <Text style={styles.quickShareText}>Twitter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickShareBtn, { backgroundColor: '#EA4335' }]}>
                            <Text style={styles.quickShareIcon}>📧</Text>
                            <Text style={styles.quickShareText}>E-posta</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.sm },

    cvCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginRight: SPACING.sm,
        alignItems: 'center',
        minWidth: 100,
    },
    cvEmoji: { fontSize: 28, marginBottom: SPACING.xs },
    cvName: { fontSize: 12, fontWeight: '600' },

    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    statIcon: { fontSize: 24, marginBottom: SPACING.xs },
    statValue: { fontSize: 20, fontWeight: '700' },
    statLabel: { fontSize: 11 },

    linkContainer: {
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
    },
    linkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    linkTitle: { fontSize: 16, fontWeight: '600', marginLeft: SPACING.sm, flex: 1 },
    activeBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    activeBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    linkBox: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
    },
    linkText: { fontSize: 14 },
    linkActions: { flexDirection: 'row', gap: SPACING.sm },
    linkBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    linkBtnIcon: { fontSize: 16, marginRight: 4 },
    linkBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },

    createLinkBtn: {
        margin: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
    },
    createLinkBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    createLinkBtnIcon: { fontSize: 24, marginRight: SPACING.sm },
    createLinkBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },

    settingCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    settingInfo: { flex: 1 },
    settingName: { fontSize: 15, fontWeight: '600' },
    settingDesc: { fontSize: 12, marginTop: 2 },
    settingDivider: { height: 1, marginVertical: SPACING.xs },

    expiryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    expiryCard: {
        width: '23%',
        margin: '1%',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    expiryIcon: { fontSize: 24, marginBottom: 4 },
    expiryName: { fontSize: 11, fontWeight: '600' },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
    },
    passwordIcon: { fontSize: 24, marginRight: SPACING.sm },
    passwordInput: { flex: 1, fontSize: 15 },

    quickShareRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    quickShareBtn: {
        width: '23%',
        margin: '1%',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    quickShareIcon: { fontSize: 24, marginBottom: 4 },
    quickShareText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});

