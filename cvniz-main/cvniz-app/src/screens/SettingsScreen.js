import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, Switch, Alert, Platform, Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Setting Item Component
function SettingItem({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onPress, 
    hasSwitch, 
    switchValue, 
    onSwitchChange,
    isDanger,
    showArrow = true,
    disabled
}) {
    return (
        <TouchableOpacity
            style={[styles.settingItem, disabled && styles.settingItemDisabled]}
            onPress={onPress}
            activeOpacity={hasSwitch ? 1 : 0.6}
            disabled={hasSwitch || disabled}
        >
            <View style={[styles.iconBox, isDanger && styles.iconBoxDanger]}>
                <Text style={styles.icon}>{icon}</Text>
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
                    onValueChange={onSwitchChange}
                    trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
                    thumbColor="#FFF"
                    style={{ transform: [{ scale: 0.9 }] }}
                />
            ) : (
                <>
                    {value && <Text style={styles.settingValue}>{value}</Text>}
                    {showArrow && <Text style={styles.settingArrow}>›</Text>}
                </>
            )}
        </TouchableOpacity>
    );
}

// Section Component
function Section({ title, description, children }) {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {description && <Text style={styles.sectionDesc}>{description}</Text>}
            </View>
            <View style={styles.sectionCard}>
                {React.Children.map(children, (child, index) => (
                    <>
                        {child}
                        {index < React.Children.count(children) - 1 && (
                            <View style={styles.divider} />
                        )}
                    </>
                ))}
            </View>
        </View>
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

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>⚙️ Ayarlar</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Appearance */}
                <Section title="Görünüm" description="Uygulama teması ve dil ayarları">
                    <SettingItem
                        icon={themeIcons[themeMode]}
                        title="Tema"
                        value={themeLabels[themeMode]}
                        onPress={handleThemeChange}
                    />
                    <SettingItem
                        icon="🌐"
                        title="Uygulama Dili"
                        value="Türkçe"
                        onPress={handleLanguageChange}
                    />
                    <SettingItem
                        icon="📳"
                        title="Titreşim"
                        subtitle="Dokunmatik geri bildirim"
                        hasSwitch
                        switchValue={haptic}
                        onSwitchChange={setHaptic}
                    />
                </Section>

                {/* Notifications */}
                <Section title="Bildirimler" description="Bildirim tercihlerinizi yönetin">
                    <SettingItem
                        icon="🔔"
                        title="Push Bildirimleri"
                        subtitle="Anlık uygulama bildirimleri"
                        hasSwitch
                        switchValue={notifications}
                        onSwitchChange={setNotifications}
                    />
                    <SettingItem
                        icon="📧"
                        title="E-posta Bildirimleri"
                        subtitle="Haftalık özet ve ipuçları"
                        hasSwitch
                        switchValue={emailUpdates}
                        onSwitchChange={setEmailUpdates}
                    />
                </Section>

                {/* CV Settings */}
                <Section title="CV Ayarları" description="CV oluşturma ve düzenleme ayarları">
                    <SettingItem
                        icon="💾"
                        title="Otomatik Kaydet"
                        subtitle="Değişiklikleri otomatik kaydet"
                        hasSwitch
                        switchValue={autoSave}
                        onSwitchChange={setAutoSave}
                    />
                    <SettingItem
                        icon="☁️"
                        title="Bulut Senkronizasyon"
                        subtitle="CV'leri tüm cihazlarda senkronize et"
                        hasSwitch
                        switchValue={cloudSync}
                        onSwitchChange={setCloudSync}
                    />
                    <SettingItem
                        icon="📤"
                        title="Verileri Dışa Aktar"
                        subtitle="Tüm CV'leri indir"
                        onPress={handleExportData}
                    />
                </Section>

                {/* Security */}
                <Section title="Güvenlik" description="Hesap güvenliği ve gizlilik">
                    <SettingItem
                        icon="🔐"
                        title="Biyometrik Giriş"
                        subtitle="Face ID / Parmak İzi ile giriş"
                        hasSwitch
                        switchValue={biometric}
                        onSwitchChange={setBiometric}
                    />
                    <SettingItem
                        icon="🔒"
                        title="Şifre Değiştir"
                        onPress={() => {}}
                    />
                    <SettingItem
                        icon="📊"
                        title="Analitik Paylaşımı"
                        subtitle="Anonim kullanım verileri"
                        hasSwitch
                        switchValue={analytics}
                        onSwitchChange={setAnalytics}
                    />
                </Section>

                {/* Storage */}
                <Section title="Depolama" description="Önbellek ve veri yönetimi">
                    <SettingItem
                        icon="🗑️"
                        title="Önbelleği Temizle"
                        subtitle="12.4 MB kullanılıyor"
                        onPress={handleClearCache}
                    />
                </Section>

                {/* Support */}
                <Section title="Destek" description="Yardım ve iletişim">
                    <SettingItem
                        icon="❓"
                        title="Yardım Merkezi"
                        onPress={() => Linking.openURL('https://CVniz.app/help')}
                    />
                    <SettingItem
                        icon="💬"
                        title="Geri Bildirim Gönder"
                        onPress={() => Linking.openURL('mailto:destek@CVniz.app')}
                    />
                    <SettingItem
                        icon="⭐"
                        title="Uygulamayı Değerlendir"
                        onPress={() => Linking.openURL('https://play.google.com/store')}
                    />
                </Section>

                {/* Legal */}
                <Section title="Yasal" description="Politikalar ve koşullar">
                    <SettingItem
                        icon="📜"
                        title="Gizlilik Politikası"
                        onPress={() => Linking.openURL('https://CVniz.app/privacy')}
                    />
                    <SettingItem
                        icon="📋"
                        title="Kullanım Koşulları"
                        onPress={() => Linking.openURL('https://CVniz.app/terms')}
                    />
                    <SettingItem
                        icon="📄"
                        title="Açık Kaynak Lisansları"
                        onPress={() => {}}
                    />
                </Section>

                {/* Account Actions */}
                <Section title="Hesap İşlemleri">
                    <SettingItem
                        icon="🚪"
                        title="Çıkış Yap"
                        onPress={handleLogout}
                        showArrow={false}
                    />
                </Section>

                {/* Danger Zone */}
                <View style={styles.dangerSection}>
                    <View style={styles.dangerHeader}>
                        <Text style={styles.dangerIcon}>⚠️</Text>
                        <Text style={styles.dangerTitle}>Tehlikeli Bölge</Text>
                    </View>
                    <View style={styles.dangerCard}>
                        <SettingItem
                            icon="🗑️"
                            title="Hesabı Sil"
                            subtitle="Bu işlem geri alınamaz"
                            onPress={handleDeleteAccount}
                            isDanger
                        />
                    </View>
                </View>

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

    // Header
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#F8FAFC',
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

    // Section
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        marginBottom: 12,
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
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconBoxDanger: {
        backgroundColor: '#FEE2E2',
    },
    icon: {
        fontSize: 18,
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

