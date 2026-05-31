import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, Alert, TextInput, Platform, Image, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCV } from '../context/CVContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { ModernCard, Badge, ProgressBar } from '../components/ModernUIComponents';

const { width } = Dimensions.get('window');

// Modern Stat Card Component
function StatCard({ iconName, value, label, color, delay = 0 }) {
    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, delay }}
        >
            <ModernCard style={[styles.statCard, { borderLeftColor: color }]}>
                <Feather name={iconName} size={20} color={color} />
                <Text style={[styles.statValue, { color }]}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </ModernCard>
        </MotiView>
    );
}

// Modern Achievement Badge
function AchievementBadge({ iconName, title, description, unlocked, color = COLORS.primary }) {
    return (
        <ModernCard 
            style={[styles.achievementBadge, !unlocked && styles.achievementLocked]}
            intensity={unlocked ? 50 : 20}
        >
            <View style={[styles.achievementIcon, !unlocked && styles.achievementIconLocked, { backgroundColor: unlocked ? `${color}20` : '#F1F5F9' }]}>
                <Feather name={iconName} size={20} color={unlocked ? color : '#94A3B8'} />
            </View>
            <Text style={[styles.achievementTitle, !unlocked && styles.achievementTitleLocked]}>
                {title}
            </Text>
            <Text style={styles.achievementDesc}>{description}</Text>
            {!unlocked && (
                <View style={styles.achievementLockOverlay}>
                    <Feather name="lock" size={16} color="#94A3B8" />
                </View>
            )}
        </ModernCard>
    );
}

// Modern Activity Item
function ActivityItem({ iconName, title, time, type }) {
    const typeColors = {
        create: '#10B981',
        edit: '#6366F1',
        view: '#F59E0B',
        share: '#EC4899',
    };
    
    const typeIcons = {
        create: 'plus-circle',
        edit: 'edit-2',
        view: 'eye',
        share: 'share-2',
    };
    
    return (
        <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: `${typeColors[type]}20` }]}>
                <Feather name={typeIcons[type] || 'activity'} size={16} color={typeColors[type]} />
            </View>
            <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{title}</Text>
                <Text style={styles.activityTime}>{time}</Text>
            </View>
        </View>
    );
}

export default function ProfileScreen({ navigation }) {
    const { user, updateUser } = useAuth();
    const { colors, isDark } = useTheme();
    const { cvs } = useCV();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');

    const isPremium = user?.isPremium || user?.role === 'admin';

    const handleSaveProfile = async () => {
        if (updateUser && name.trim()) {
            await updateUser({ name: name.trim(), bio: bio.trim() });
            setEditMode(false);
            Alert.alert('Başarılı', 'Profil güncellendi!');
        }
    };

    const memberSince = user?.createdAt 
        ? new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
        : 'Ocak 2025';

    // Calculate stats
    const totalViews = 156; // Mock data
    const totalDownloads = 42;
    const profileCompletion = 75;

    // Achievements with vector icons
    const achievements = [
        { iconName: 'file-plus', title: 'İlk CV', description: 'İlk CV\'nizi oluşturdunuz', unlocked: cvs.length > 0, color: '#6366F1' },
        { iconName: 'layers', title: '5 CV', description: '5 CV oluşturdunuz', unlocked: cvs.length >= 5, color: '#10B981' },
        { iconName: 'crown', title: 'Premium', description: 'Premium üye oldunuz', unlocked: isPremium, color: '#F59E0B' },
        { iconName: 'zap', title: '7 Gün', description: '7 gün üst üste aktif', unlocked: false, color: '#EC4899' },
        { iconName: 'check-circle', title: 'Tam Profil', description: 'Profili %100 tamamladınız', unlocked: profileCompletion === 100, color: '#8B5CF6' },
        { iconName: 'share-2', title: 'Paylaşımcı', description: 'CV\'nizi paylaştınız', unlocked: false, color: '#06B6D4' },
    ];

    // Recent activity
    const recentActivity = [
        { title: 'Yazılım CV düzenlendi', time: '2 saat önce', type: 'edit' },
        { title: 'Tasarımcı CV görüntülendi', time: '5 saat önce', type: 'view' },
        { title: 'Yeni CV oluşturuldu', time: 'Dün', type: 'create' },
        { title: 'CV paylaşıldı', time: '3 gün önce', type: 'share' },
    ];

    const getInitials = (name) => {
        return name
            ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'CV';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#6366F1', '#8B5CF6', '#A855F7']}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Decorative circles */}
                    <View style={styles.decorCircle1} />
                    <View style={styles.decorCircle2} />

                    {/* Modern Edit Button */}
                    <TouchableOpacity 
                        style={styles.editBtn}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setEditMode(!editMode);
                        }}
                    >
                        <Feather name={editMode ? 'x' : 'edit-2'} size={18} color="#FFF" />
                    </TouchableOpacity>

                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#FFFFFF', '#F1F5F9']}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                        </LinearGradient>
                        {isPremium && (
                            <View style={styles.premiumBadgeProfile}>
                                <MaterialCommunityIcons name="crown" size={12} color="#FFF" />
                            </View>
                        )}
                    </View>

                    {/* Name & Email */}
                    {editMode ? (
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.nameInput}
                                value={name}
                                onChangeText={setName}
                                placeholder="Adınız"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                            <TextInput
                                style={styles.bioInput}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="Kısa bio (opsiyonel)"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                multiline
                            />
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                                <Feather name="check" size={16} color="#FFF" />
                                <Text style={styles.saveBtnText}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
                            <Text style={styles.userEmail}>{user?.email}</Text>
                            {bio ? <Text style={styles.userBio}>{bio}</Text> : null}
                        </>
                    )}

                    {/* Member info */}
                    <View style={styles.memberInfo}>
                        <Feather name="calendar" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.memberText}> {memberSince}'den beri üye</Text>
                    </View>
                </LinearGradient>

                {/* Modern Profile Completion */}
                <ModernCard style={styles.completionCard}>
                    <View style={styles.completionHeader}>
                        <Text style={styles.completionTitle}>Profil Tamamlama</Text>
                        <Badge text={`${profileCompletion}%`} color={COLORS.primary} size="small" />
                    </View>
                    <ProgressBar progress={profileCompletion / 100} color={COLORS.primary} showPercentage={false} />
                    <View style={styles.completionHint}>
                        <Feather name="info" size={14} color={COLORS.textTertiary} />
                        <Text style={styles.completionHintText}>Bio ekleyerek profilinizi tamamlayın</Text>
                    </View>
                </ModernCard>

                {/* Modern Stats */}
                <View style={styles.statsContainer}>
                    <StatCard iconName="file-text" value={cvs.length} label="CV" color="#6366F1" delay={0} />
                    <StatCard iconName="eye" value={totalViews} label="Görüntülenme" color="#10B981" delay={100} />
                    <StatCard iconName="download" value={totalDownloads} label="İndirme" color="#F59E0B" delay={200} />
                </View>

                {/* Premium Banner */}
                {!isPremium && (
                    <TouchableOpacity 
                        style={styles.premiumBanner}
                        onPress={() => navigation.navigate('Premium')}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#F59E0B', '#D97706']}
                            style={styles.premiumGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.premiumContent}>
                                <View style={styles.premiumIconBox}>
                                    <MaterialCommunityIcons name="crown" size={24} color="#FFF" />
                                </View>
                                <View style={styles.premiumText}>
                                    <Text style={styles.premiumTitle}>Premium'a Yükselt</Text>
                                    <Text style={styles.premiumDesc}>Sınırsız CV, şablon ve özellik</Text>
                                </View>
                            </View>
                            <Feather name="arrow-right" size={20} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Modern Achievements */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Feather name="award" size={20} color={COLORS.text} />
                            <Text style={styles.sectionTitle}>Başarılar</Text>
                        </View>
                        <Badge 
                            text={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`} 
                            color={COLORS.primary} 
                            size="small"
                        />
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.achievementsList}
                    >
                        {achievements.map((achievement, index) => (
                            <AchievementBadge key={index} {...achievement} />
                        ))}
                    </ScrollView>
                </View>

                {/* Modern Recent Activity */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Feather name="activity" size={20} color={COLORS.text} />
                        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
                    </View>
                    <ModernCard style={styles.activityCard}>
                        {recentActivity.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </ModernCard>
                </View>

                {/* Modern Quick Actions */}
                <View style={styles.section}>
                    <View style={styles.sectionTitleContainer}>
                        <Feather name="zap" size={20} color={COLORS.text} />
                        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
                    </View>
                    <View style={styles.quickActions}>
                        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0 }}>
                            <TouchableOpacity 
                                style={styles.quickActionBtn}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    navigation.navigate('Editor', {});
                                }}
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.primary}
                                    style={styles.quickActionGradient}
                                >
                                    <Feather name="plus" size={24} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Yeni CV</Text>
                            </TouchableOpacity>
                        </MotiView>

                        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 100 }}>
                            <TouchableOpacity 
                                style={styles.quickActionBtn}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    navigation.navigate('ATSAnalysis');
                                }}
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.success}
                                    style={styles.quickActionGradient}
                                >
                                    <Feather name="bar-chart-2" size={24} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>ATS Analiz</Text>
                            </TouchableOpacity>
                        </MotiView>

                        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 200 }}>
                            <TouchableOpacity 
                                style={styles.quickActionBtn}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    navigation.navigate('CoverLetter');
                                }}
                            >
                                <LinearGradient
                                    colors={COLORS.gradients.sunset}
                                    style={styles.quickActionGradient}
                                >
                                    <Feather name="edit-3" size={24} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Ön Yazı</Text>
                            </TouchableOpacity>
                        </MotiView>

                        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 300 }}>
                            <TouchableOpacity 
                                style={styles.quickActionBtn}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    navigation.navigate('Settings');
                                }}
                            >
                                <LinearGradient
                                    colors={['#64748B', '#475569']}
                                    style={styles.quickActionGradient}
                                >
                                    <Feather name="settings" size={24} color="#FFF" />
                                </LinearGradient>
                                <Text style={styles.quickActionText}>Ayarlar</Text>
                            </TouchableOpacity>
                        </MotiView>
                    </View>
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
    scrollView: {
        flex: 1,
    },

    // Header
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingBottom: 30,
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    editBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 35,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBtnText: {
        fontSize: 18,
    },

    // Avatar
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: '#6366F1',
    },
    premiumBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#8B5CF6',
    },
    premiumBadgeText: {
        fontSize: 16,
    },
    premiumBadgeProfile: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#8B5CF6',
    },

    // User Info
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    userBio: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        paddingHorizontal: 40,
        fontStyle: 'italic',
    },
    memberInfo: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
    },
    memberText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
    },

    // Edit Mode
    editContainer: {
        width: '100%',
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    nameInput: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    bioInput: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
        minHeight: 60,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    saveBtnText: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: 14,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    completionHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    completionHintText: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    activityIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementLockOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    premiumIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    // Completion Card
    completionCard: {
        margin: 16,
        marginTop: -20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    completionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    completionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    completionPercent: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6366F1',
    },
    completionBar: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    completionFill: {
        height: '100%',
        borderRadius: 4,
    },
    completionHint: {
        fontSize: 13,
        color: '#64748B',
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderLeftWidth: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },

    // Premium Banner
    premiumBanner: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    premiumGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    premiumContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    premiumText: {},
    premiumTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    premiumDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    premiumArrow: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // Section
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },

    // Achievements
    achievementsList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    achievementBadge: {
        width: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginRight: 12,
    },
    achievementLocked: {
        opacity: 0.6,
    },
    achievementIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    achievementIconLocked: {
        backgroundColor: '#F1F5F9',
    },
    achievementEmoji: {
        fontSize: 24,
    },
    achievementTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 4,
    },
    achievementTitleLocked: {
        color: '#94A3B8',
    },
    achievementDesc: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'center',
    },
    lockOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    lockIcon: {
        fontSize: 12,
    },

    // Activity
    activityCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    activityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0F172A',
    },
    activityTime: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },

    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    quickActionBtn: {
        flex: 1,
        alignItems: 'center',
    },
    quickActionGradient: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionIcon: {
        fontSize: 24,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
});
