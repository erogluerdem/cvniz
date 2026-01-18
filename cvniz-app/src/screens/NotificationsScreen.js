import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, RefreshControl, Switch, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';

// ============ NOTIFICATION ITEM ============
function NotificationItem({ notification, colors, onPress }) {
    const typeConfig = {
        success: { icon: '✅', color: '#10B981' },
        info: { icon: 'ℹ️', color: '#06B6D4' },
        warning: { icon: '⚠️', color: '#F59E0B' },
        promo: { icon: '🎁', color: '#A855F7' },
        update: { icon: '🔄', color: '#6366F1' },
    };

    const config = typeConfig[notification.type] || typeConfig.info;

    return (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                { backgroundColor: colors.surface },
                !notification.read && styles.unreadItem,
                SHADOW.sm
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.notificationIcon, { backgroundColor: config.color + '20' }]}>
                <Text style={{ fontSize: 20 }}>{config.icon}</Text>
            </View>
            <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]} numberOfLines={1}>
                    {notification.title}
                </Text>
                <Text style={[styles.notificationMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                    {notification.message}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                    {notification.time}
                </Text>
            </View>
            {!notification.read && (
                <View style={[styles.unreadDot, { backgroundColor: COLORS.primary }]} />
            )}
        </TouchableOpacity>
    );
}

// ============ SETTINGS SECTION ============
function NotificationSettings({ colors, settings, onToggle }) {
    const options = [
        { key: 'push', label: 'Push Bildirimleri', icon: '🔔', desc: 'Anlık bildirimler al' },
        { key: 'email', label: 'E-posta Bildirimleri', icon: '✉️', desc: 'Güncellemeler için e-posta' },
        { key: 'marketing', label: 'Pazarlama', icon: '📢', desc: 'İndirim ve kampanyalar' },
        { key: 'cvViews', label: 'CV Görüntülenme', icon: '👁️', desc: 'CV görüntülendiğinde bildir' },
        { key: 'tips', label: 'İpuçları', icon: '💡', desc: 'Kariyer önerileri' },
    ];

    return (
        <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Bildirim Ayarları</Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
                {options.map((option, i) => (
                    <View
                        key={option.key}
                        style={[
                            styles.settingItem,
                            i < options.length - 1 && styles.settingBorder
                        ]}
                    >
                        <Text style={styles.settingIcon}>{option.icon}</Text>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>{option.label}</Text>
                            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{option.desc}</Text>
                        </View>
                        <Switch
                            value={settings[option.key]}
                            onValueChange={(value) => onToggle(option.key, value)}
                            trackColor={{ false: colors.border, true: COLORS.primary + '50' }}
                            thumbColor={settings[option.key] ? COLORS.primary : '#f4f3f4'}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}

// ============ MAIN COMPONENT ============
export default function NotificationsScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, unread, settings
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'success', title: 'CV İndirildi', message: 'Modern CV şablonunuz başarıyla indirildi.', time: '5 dk önce', read: false },
        { id: 2, type: 'promo', title: '🎉 Yeni Yıl İndirimi!', message: 'Premium üyelikte %50 indirim. Sınırlı süre!', time: '1 saat önce', read: false },
        { id: 3, type: 'info', title: 'Yeni Şablonlar', message: '15 yeni profesyonel CV şablonu eklendi.', time: '2 saat önce', read: true },
        { id: 4, type: 'update', title: 'Uygulama Güncellendi', message: 'Yeni özellikler ve performans iyileştirmeleri.', time: 'Dün', read: true },
        { id: 5, type: 'success', title: 'CV Görüntülendi', message: 'CV\'niz bir işveren tarafından görüntülendi.', time: '2 gün önce', read: true },
    ]);
    const [settings, setSettings] = useState({
        push: true,
        email: true,
        marketing: false,
        cvViews: true,
        tips: true,
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const onRefresh = async () => {
        setRefreshing(true);
        // API'den bildirimleri yeniden yükle
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const handleNotificationPress = (notification) => {
        // Bildirimi okundu olarak işaretle
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
    };

    const handleToggleSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const filteredNotifications = activeTab === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const tabs = [
        { key: 'all', label: 'Tümü', count: notifications.length },
        { key: 'unread', label: 'Okunmamış', count: unreadCount },
        { key: 'settings', label: 'Ayarlar', count: null },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bildirimler</Text>
                {unreadCount > 0 && activeTab !== 'settings' && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
                        <Text style={styles.markAllText}>Tümünü Oku</Text>
                    </TouchableOpacity>
                )}
            </LinearGradient>

            {/* Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === tab.key ? COLORS.primary : colors.textSecondary }
                        ]}>
                            {tab.label}
                        </Text>
                        {tab.count !== null && tab.count > 0 && (
                            <View style={[
                                styles.tabBadge,
                                { backgroundColor: activeTab === tab.key ? COLORS.primary : colors.border }
                            ]}>
                                <Text style={styles.tabBadgeText}>{tab.count}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {activeTab === 'settings' ? (
                    <NotificationSettings
                        colors={colors}
                        settings={settings}
                        onToggle={handleToggleSetting}
                    />
                ) : filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔔</Text>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {activeTab === 'unread' ? 'Okunmamış bildirim yok' : 'Bildirim yok'}
                        </Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            Yeni bildirimler burada görünecek
                        </Text>
                    </View>
                ) : (
                    <View style={styles.notificationsList}>
                        {filteredNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                colors={colors}
                                onPress={() => handleNotificationPress(notification)}
                            />
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
    },
    backBtn: { padding: SPACING.sm },
    backText: { color: '#94A3B8', fontSize: 16 },
    headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
    markAllBtn: { padding: SPACING.sm },
    markAllText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        marginRight: SPACING.sm,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: { fontSize: 15, fontWeight: '500' },
    tabBadge: {
        marginLeft: SPACING.xs,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tabBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

    // Content
    content: { flex: 1 },
    notificationsList: { padding: SPACING.md },

    // Notification Item
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.sm,
    },
    unreadItem: {
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    notificationIcon: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    notificationTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    notificationMessage: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
    notificationTime: { fontSize: 11 },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },

    // Settings
    settingsSection: { padding: SPACING.md },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
        marginLeft: SPACING.sm,
    },
    settingsCard: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    settingBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    settingIcon: { fontSize: 24, marginRight: SPACING.md },
    settingContent: { flex: 1 },
    settingLabel: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
    settingDesc: { fontSize: 12 },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: SPACING.xs },
    emptyDesc: { fontSize: 14 },
});
