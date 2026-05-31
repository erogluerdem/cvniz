import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, Switch, Alert, Platform, Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { ModernCard, Badge } from '../components/ModernUIComponents';

// Modern Setting Item Component
function SettingItem({ 
    iconName, 
    iconType = 'feather',
    title, 
    subtitle, 
    value, 
    onPress, 
    hasSwitch, 
    switchValue, 
    onSwitchChange,
    isDanger,
    showArrow = true,
    disabled,
    color = COLORS.primary
}) {
    const handlePress = () => {
        if (!hasSwitch && !disabled && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    const handleSwitchChange = (val) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSwitchChange?.(val);
    };

    const getIcon = () => {
        const iconProps = { size: 20, color: isDanger ? COLORS.error : color };
        switch (iconType) {
            case 'material':
                return <MaterialCommunityIcons name={iconName} {...iconProps} />;
            case 'ionicons':
                return <Ionicons name={iconName} {...iconProps} />;
            default:
                return <Feather name={iconName} {...iconProps} />;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.settingItem, disabled && styles.settingItemDisabled]}
            onPress={handlePress}
            activeOpacity={hasSwitch ? 1 : 0.8}
            disabled={hasSwitch || disabled}
        >
            <View style={[styles.iconBox, isDanger && styles.iconBoxDanger, { backgroundColor: isDanger ? `${COLORS.error}15` : `${color}15` }]}>
                {getIcon()}
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDanger && styles.settingTitleDanger]}>
                    {title}
                </Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {hasSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={handleSwitchChange}
                    trackColor={{ false: '#E2E8F0', true: color }}
                    thumbColor="#FFF"
                    style={{ transform: [{ scale: 0.9 }] }}
                />
            ) : (
                <>
                    {value && <Text style={styles.settingValue}>{value}</Text>}
                    {showArrow && <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />}
                </>
            )}
        </TouchableOpacity>
    );
}

// Modern Section Component
function Section({ title, description, iconName, children, delay = 0 }) {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, delay }}
            style={styles.section}
        >
            <View style={styles.sectionHeader}>
                {iconName && <Feather name={iconName} size={18} color={COLORS.primary} style={styles.sectionIcon} />}
                <Text style={styles.sectionTitle}>{title}</Text>
                {description && <Text style={styles.sectionDesc}>{description}</Text>}
            </View>
            <ModernCard style={styles.sectionCard}>
                {React.Children.map(children, (child, index) => (
                    <>
                        {child}
                        {index < React.Children.count(children) - 1 && (
                            <View style={styles.divider} />
                        )}
                    </>
                ))}
            </ModernCard>
        </MotiView>
    );
}

export default function SettingsScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { colors, isDark, themeMode, setTheme } = useTheme();
    
    // Settings states
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [cloudSync, setCloudSync] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [biometric, setBiometric] = useState(false);
    const [haptic, setHaptic] = useState(true);

    const isPremium = user?.isPremium || user?.role === 'admin';

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Hesabınızdan çıkmak istediğinize emin misiniz?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'Çıkış Yap', style: 'destructive', onPress: logout }
            ]
        );
    };

    const handleThemeChange = () => {
        const options = [
            { text: '☀️ Açık Tema', onPress: () => setTheme('light') },
            { text: '🌙 Koyu Tema', onPress: () => setTheme('dark') },
            { text: '⚙️ Sistem Teması', onPress: () => setTheme('system') },
            { text: 'İptal', style: 'cancel' }
        ];
        Alert.alert('Tema Seçin', 'Uygulama temasını seçin', options);
    };

    const handleLanguageChange = () => {
        Alert.alert(
            'Dil Seçin',
            'Uygulama dilini seçin',
            [
                { text: '🇹🇷 Türkçe', onPress: () => {} },
                { text: '🇬🇧 English', onPress: () => {} },
                { text: '🇩🇪 Deutsch', onPress: () => {} },
                { text: 'İptal', style: 'cancel' }
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Önbelleği Temizle',
            'Tüm önbellek verileri silinecek. Bu işlem uygulamayı hızlandırabilir.',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { 
                    text: 'Temizle', 
                    onPress: () => Alert.alert('✅ Başarılı', 'Önbellek temizlendi.')
                }
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert(
            'Verileri Dışa Aktar',
            'Tüm CV ve verileriniz ZIP dosyası olarak indirilecek.',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'İndir', onPress: () => Alert.alert('📥', 'İndirme başlatıldı...') }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            '⚠️ Hesabı Sil',
            'Bu işlem geri alınamaz! Tüm CV\'leriniz ve verileriniz kalıcı olarak silinecektir.',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { 
                    text: 'Hesabımı Sil', 
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            '⚠️ Son Uyarı',
                            'Hesabınız ve tüm verileriniz kalıcı olarak silinecek. Emin misiniz?',
                            [
                                { text: 'Vazgeç', style: 'cancel' },
                                { text: 'Evet, Sil', style: 'destructive', onPress: logout }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const themeLabels = { light: 'Açık', dark: 'Koyu', system: 'Sistem' };
    const themeIcons = { light: '☀️', dark: '🌙', system: '⚙️' };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Modern Header */}
            <View style={styles.header}>
                <Feather name="settings" size={24} color={COLORS.text} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Ayarlar</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Appearance */}
                <Section title="Görünüm" description="Uygulama teması ve dil ayarları" iconName="eye" delay={0}>
                    <SettingItem
                        iconName={themeMode === 'dark' ? 'moon' : themeMode === 'system' ? 'monitor' : 'sun'}
                        title="Tema"
                        value={themeLabels[themeMode]}
                        onPress={handleThemeChange}
                        color={COLORS.primary}
                    />
                    <SettingItem
                        iconName="globe"
                        title="Uygulama Dili"
                        value="Türkçe"
                        onPress={handleLanguageChange}
                        color={COLORS.tertiary}
                    />
                    <SettingItem
                        iconName="smartphone"
                        title="Titreşim"
                        subtitle="Dokunmatik geri bildirim"
                        hasSwitch
                        switchValue={haptic}
                        onSwitchChange={setHaptic}
                        color={COLORS.accent}
                    />
                </Section>

                {/* Notifications */}
                <Section title="Bildirimler" description="Bildirim tercihlerinizi yönetin" iconName="bell" delay={100}>
                    <SettingItem
                        iconName="message-square"
                        title="Push Bildirimleri"
                        subtitle="Anlık uygulama bildirimleri"
                        hasSwitch
                        switchValue={notifications}
                        onSwitchChange={setNotifications}
                        color="#6366F1"
                    />
                    <SettingItem
                        iconName="mail"
                        title="E-posta Bildirimleri"
                        subtitle="Haftalık özet ve ipuçları"
                        hasSwitch
                        switchValue={emailUpdates}
                        onSwitchChange={setEmailUpdates}
                        color="#3B82F6"
                    />
                </Section>

                {/* CV Settings */}
                <Section title="CV Ayarları" description="CV oluşturma ve düzenleme ayarları" iconName="file-text" delay={200}>
                    <SettingItem
                        iconName="save"
                        title="Otomatik Kaydet"
                        subtitle="Değişiklikleri otomatik kaydet"
                        hasSwitch
                        switchValue={autoSave}
                        onSwitchChange={setAutoSave}
                        color="#10B981"
                    />
                    <SettingItem
                        iconName="cloud"
                        title="Bulut Senkronizasyon"
                        subtitle="CV'leri tüm cihazlarda senkronize et"
                        hasSwitch
                        switchValue={cloudSync}
                        onSwitchChange={setCloudSync}
                        color="#06B6D4"
                    />
                    <SettingItem
                        iconName="download-cloud"
                        title="Verileri Dışa Aktar"
                        subtitle="Tüm CV'leri indir"
                        onPress={handleExportData}
                        color="#F59E0B"
                    />
                </Section>

                {/* Security */}
                <Section title="Güvenlik" description="Hesap güvenliği ve gizlilik" iconName="shield" delay={300}>
                    <SettingItem
                        iconName="fingerprint"
                        title="Biyometrik Giriş"
                        subtitle="Face ID / Parmak İzi ile giriş"
                        hasSwitch
                        switchValue={biometric}
                        onSwitchChange={setBiometric}
                        color="#8B5CF6"
                    />
                    <SettingItem
                        iconName="lock"
                        title="Şifre Değiştir"
                        onPress={() => {}}
                        color="#EC4899"
                    />
                    <SettingItem
                        iconName="bar-chart-2"
                        title="Analitik Paylaşımı"
                        subtitle="Anonim kullanım verileri"
                        hasSwitch
                        switchValue={analytics}
                        onSwitchChange={setAnalytics}
                        color="#64748B"
                    />
                </Section>

                {/* Storage */}
                <Section title="Depolama" description="Önbellek ve veri yönetimi" iconName="hard-drive" delay={400}>
                    <SettingItem
                        iconName="trash-2"
                        title="Önbelleği Temizle"
                        subtitle="12.4 MB kullanılıyor"
                        onPress={handleClearCache}
                        color="#F59E0B"
                    />
                </Section>

                {/* Support */}
                <Section title="Destek" description="Yardım ve iletişim" iconName="help-circle" delay={500}>
                    <SettingItem
                        iconName="book-open"
                        title="Yardım Merkezi"
                        onPress={() => Linking.openURL('https://CVniz.app/help')}
                        color="#06B6D4"
                    />
                    <SettingItem
                        iconName="message-circle"
                        title="Geri Bildirim Gönder"
                        onPress={() => Linking.openURL('mailto:destek@CVniz.app')}
                        color="#10B981"
                    />
                    <SettingItem
                        iconName="star"
                        title="Uygulamayı Değerlendir"
                        onPress={() => Linking.openURL('https://play.google.com/store')}
                        color="#F59E0B"
                    />
                </Section>

                {/* Legal */}
                <Section title="Yasal" description="Politikalar ve koşullar" iconName="file-text" delay={600}>
                    <SettingItem
                        iconName="shield"
                        title="Gizlilik Politikası"
                        onPress={() => Linking.openURL('https://CVniz.app/privacy')}
                        color="#6366F1"
                    />
                    <SettingItem
                        iconName="file-minus"
                        title="Kullanım Koşulları"
                        onPress={() => Linking.openURL('https://CVniz.app/terms')}
                        color="#6366F1"
                    />
                    <SettingItem
                        iconName="code"
                        title="Açık Kaynak Lisansları"
                        onPress={() => {}}
                        color="#6366F1"
                    />
                </Section>

                {/* Account Actions */}
                <Section title="Hesap İşlemleri" iconName="user" delay={700}>
                    <SettingItem
                        iconName="log-out"
                        title="Çıkış Yap"
                        onPress={handleLogout}
                        showArrow={false}
                        color="#64748B"
                    />
                </Section>

                {/* Danger Zone */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', damping: 15, delay: 800 }}
                    style={styles.dangerSection}
                >
                    <View style={styles.dangerHeader}>
                        <Feather name="alert-triangle" size={20} color={COLORS.error} />
                        <Text style={styles.dangerTitle}>Tehlikeli Bölge</Text>
                    </View>
                    <ModernCard style={styles.dangerCard}>
                        <SettingItem
                            iconName="trash"
                            title="Hesabı Sil"
                            subtitle="Bu işlem geri alınamaz"
                            onPress={handleDeleteAccount}
                            isDanger
                        />
                    </ModernCard>
                </MotiView>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerLogo}>
                        <LinearGradient
                            colors={['#6366F1', '#8B5CF6']}
                            style={styles.footerLogoGradient}
                        >
                            <Text style={styles.footerLogoText}>CV</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.footerAppName}>CVniz</Text>
                    <Text style={styles.footerVersion}>Versiyon 1.0.0 (Build 1)</Text>
                    <Text style={styles.footerCopyright}>© 2025 CVniz. Tüm hakları saklıdır.</Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Modern Header
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#F8FAFC',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerIcon: {
        marginTop: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
    },

    // Scroll
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },

    // Modern Section
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionIcon: {
        marginRight: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 13,
        color: '#64748B',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 64,
    },

    // Setting Item
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    settingItemDisabled: {
        opacity: 0.5,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconBoxDanger: {
        backgroundColor: '#FEE2E2',
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    settingTitleDanger: {
        color: '#DC2626',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    settingValue: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '500',
        marginRight: 8,
    },
    settingArrow: {
        fontSize: 20,
        color: '#CBD5E1',
        fontWeight: '300',
    },

    // Danger Zone
    dangerSection: {
        marginBottom: 24,
    },
    dangerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dangerIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    dangerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#DC2626',
    },
    dangerCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
        overflow: 'hidden',
    },

    // Footer
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    footerLogo: {
        marginBottom: 12,
    },
    footerLogoGradient: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLogoText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    footerAppName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    footerVersion: {
        fontSize: 13,
        color: '#94A3B8',
    },
    footerCopyright: {
        fontSize: 12,
        color: '#CBD5E1',
        marginTop: 4,
    },
});

