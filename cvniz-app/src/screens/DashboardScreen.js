import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    RefreshControl, Alert, StatusBar, Dimensions, Platform, Animated
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { useTheme } from '../context/ThemeContext';
import { 
    ModernCard, AnimatedButton, StatCard as ModernStatCard, 
    SectionHeader, Badge, Chip, SkeletonLoader, FloatingActionButton 
} from '../components/ModernUIComponents';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW, ANIMATION, scale, moderateScale, isSmallScreen, SCREEN_WIDTH } from '../constants';

const { width, height } = Dimensions.get('window');

// Responsive helpers
const rs = (size) => isSmallScreen ? scale(size * 0.85) : scale(size);
const fontSize = (size) => moderateScale(isSmallScreen ? size * 0.9 : size);

// Modern Animated Header Component
const ModernHeader = ({ user, navigation, greeting }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const notifScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                delay: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleNotifPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.sequence([
            Animated.spring(notifScale, {
                toValue: 0.8,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(notifScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();
        navigation.navigate('Notifications');
    };

    return (
        <Animated.View style={[
            styles.modernHeader,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            isSmallScreen && { paddingHorizontal: SPACING.md }
        ]}>
            <View style={styles.headerLeft}>
                <View style={styles.greetingContainer}>
                    <Feather name="sun" size={isSmallScreen ? 12 : 14} color={COLORS.textTertiary} style={styles.greetingIcon} />
                    <Text style={[styles.greeting, isSmallScreen && { fontSize: 12 }]}>{greeting}</Text>
                </View>
                <Text style={[styles.userName, isSmallScreen && { fontSize: 22 }]}>{user?.name || 'Kullanıcı'}</Text>
                <Text style={[styles.userRole, isSmallScreen && { fontSize: 11 }]}>Premium Üye</Text>
            </View>
            <View style={[styles.headerRight, isSmallScreen && { gap: 6 }]}>
                <Animated.View style={{ transform: [{ scale: notifScale }] }}>
                    <TouchableOpacity 
                        style={[styles.headerBtn, isSmallScreen && { width: 40, height: 40 }]}
                        onPress={handleNotifPress}
                        activeOpacity={0.8}
                    >
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                        <Feather name="bell" size={20} color={COLORS.text} />
                        <View style={styles.notifBadge}>
                            <Text style={styles.notifBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity 
                        style={[styles.avatar, isSmallScreen && { width: 40, height: 40 }]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.navigate('Profile');
                        }}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={COLORS.gradients.primary}
                            style={styles.avatarGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.avatarText}>
                                {(user?.name || 'U')[0].toUpperCase()}
                            </Text>
                        </LinearGradient>
                        <View style={styles.onlineIndicator} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

// Modern Premium Banner Component
const ModernPremiumBanner = ({ onPress }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            delay: 300,
            useNativeDriver: true,
        }).start();

        // Shimmer animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Pulse animation for crown
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const shimmerOpacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.7, 0.3],
    });

    return (
        <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 200 }}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                    style={styles.modernPremiumBanner}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onPress();
                    }}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.premiumGradient}
                    >
                        {/* Decorative Animated Elements */}
                        <Animated.View style={[styles.premiumCircle1, { opacity: shimmerOpacity }]} />
                        <Animated.View style={[styles.premiumCircle2, { opacity: shimmerOpacity }]} />
                        
                        {/* Glass overlay */}
                        <BlurView intensity={10} tint="light" style={styles.premiumBlur} />
                        
                        <View style={styles.premiumContent}>
                            <View style={styles.premiumBadge}>
                                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                    <MaterialCommunityIcons name="crown" size={14} color="#F59E0B" />
                                </Animated.View>
                                <Text style={styles.premiumBadgeText}>PRO</Text>
                            </View>
                            <Text style={styles.premiumTitle}>Premium'a Yükselt</Text>
                            <View style={styles.premiumFeatures}>
                                <View style={styles.featureItem}>
                                    <Feather name="cpu" size={12} color="rgba(255,255,255,0.9)" />
                                    <Text style={styles.featureText}>AI</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Feather name="layout" size={12} color="rgba(255,255,255,0.9)" />
                                    <Text style={styles.featureText}>Sınırsız</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Feather name="headphones" size={12} color="rgba(255,255,255,0.9)" />
                                    <Text style={styles.featureText}>Destek</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.premiumIconBox}>
                            <Feather name="star" size={24} color="#FCD34D" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </MotiView>
    );
};

// Modern Quick Action Button
const ModernQuickAction = ({ icon, iconName = 'plus', title, colors, onPress, delay = 0 }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150, delay }}
        >
            <TouchableOpacity 
                onPress={handlePress}
                activeOpacity={0.9}
                style={styles.modernActionBtn}
            >
                <LinearGradient
                    colors={colors}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                    <View style={styles.actionIconContainer}>
                        <Feather name={iconName} size={20} color="#fff" />
                    </View>
                    <Text style={styles.actionText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </MotiView>
    );
};

// Modern CV Card Component
const ModernCVCard = ({ cv, index, onPress, onEdit, onDelete, formatDate }) => {
    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];
    const cardColor = colors[index % colors.length];

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    return (
        <MotiView
            from={{ opacity: 0, translateX: 30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 15, delay: index * 80 }}
        >
            <ModernCard
                onPress={handlePress}
                style={styles.modernCvCard}
            >
                {/* Color Accent */}
                <View style={[styles.cvAccent, { backgroundColor: cardColor }]} />
                
                <View style={styles.cvLeft}>
                    <View style={[styles.cvIconBox, { backgroundColor: `${cardColor}20` }]}>
                        <Feather name="file-text" size={22} color={cardColor} />
                    </View>
                    <View style={styles.cvInfo}>
                        <Text style={styles.cvName} numberOfLines={1}>{cv.name}</Text>
                        <View style={styles.cvMeta}>
                            <Feather name="clock" size={12} color={COLORS.textTertiary} />
                            <Text style={styles.cvDate}>
                                {formatDate(cv.updatedAt || cv.createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cvActions}>
                    <TouchableOpacity 
                        style={[styles.cvActionBtn, { backgroundColor: `${COLORS.primary}15` }]}
                        onPress={(e) => {
                            e.stopPropagation();
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onEdit?.();
                        }}
                    >
                        <Feather name="edit-2" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.cvActionBtn, { backgroundColor: `${COLORS.error}15` }]}
                        onPress={(e) => {
                            e.stopPropagation();
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onDelete?.();
                        }}
                    >
                        <Feather name="trash-2" size={16} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            </ModernCard>
        </MotiView>
    );
};

export default function DashboardScreen({ navigation }) {
    const { user } = useAuth();
    const { cvs, loading, loadCVs, deleteCV } = useCV();
    const { colors, isDark } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const isPremium = user?.isPremium || user?.role === 'admin';

    useFocusEffect(useCallback(() => { loadCVs(); }, []));

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCVs();
        setRefreshing(false);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 6) return 'İyi geceler';
        if (hour < 12) return 'Günaydın';
        if (hour < 18) return 'İyi günler';
        if (hour < 22) return 'İyi akşamlar';
        return 'İyi geceler';
    };

    const handleDeleteCV = (cv) => {
        Alert.alert('CV\'yi Sil', `"${cv.name}" kalıcı olarak silinecek.`, [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Sil', style: 'destructive', onPress: () => deleteCV(cv.id) }
        ]);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Bugün';
        if (days === 1) return 'Dün';
        if (days < 7) return `${days} gün önce`;
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    // Modern Menu Item Component
    const ModernMenuItem = ({ iconName, title, subtitle, onPress, color = COLORS.primary }) => {
        return (
            <TouchableOpacity 
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress?.();
                }}
                activeOpacity={0.8}
            >
                <View style={styles.modernMenuItem}>
                    <View style={[styles.menuIconBox, { backgroundColor: `${color}15` }]}>
                        <Feather name={iconName} size={20} color={color} />
                    </View>
                    <View style={styles.menuContent}>
                        <Text style={styles.menuTitle}>{title}</Text>
                        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
                    </View>
                    <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
            
            <Animated.ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor="#6366F1"
                        colors={['#6366F1']}
                    />
                }
            >
                {/* Modern Header */}
                <ModernHeader user={user} navigation={navigation} greeting={getGreeting()} />

                {/* Stats Cards with Modern Design - Responsive */}
                <View style={[styles.statsGrid, isSmallScreen && { paddingHorizontal: SPACING.md, gap: 8 }]}>
                    <ModernStatCard
                        title={isSmallScreen ? "CV'ler" : "Toplam CV"}
                        value={cvs.length.toString()}
                        subtitle={isSmallScreen ? "Aktif" : "Aktif CV'leriniz"}
                        iconName="file-text"
                        iconType="feather"
                        color="#6366F1"
                        delay={100}
                    />
                    <ModernStatCard
                        title="Şablonlar"
                        value="106"
                        subtitle={isSmallScreen ? "Premium" : "Premium şablonlar"}
                        iconName="layout"
                        iconType="feather"
                        color="#10B981"
                        trend={isSmallScreen ? null : "Yeni"}
                        trendUp={true}
                        delay={200}
                    />
                    <ModernStatCard
                        title={isSmallScreen ? "Görünt." : "Görüntülenme"}
                        value="0"
                        subtitle="Bu ay"
                        iconName="eye"
                        iconType="feather"
                        color="#F59E0B"
                        delay={300}
                    />
                </View>

                {/* Modern Premium Banner */}
                {!isPremium && (
                    <ModernPremiumBanner onPress={() => navigation.navigate('Premium')} />
                )}

                {/* Modern Quick Actions - Responsive */}
                <View style={styles.section}>
                    <SectionHeader 
                        title="Hızlı İşlemler" 
                        subtitle={isSmallScreen ? null : "Hemen başlayın"}
                        icon={<Feather name="zap" size={isSmallScreen ? 16 : 18} color={COLORS.primary} />}
                    />
                    <View style={[styles.actionsRow, isSmallScreen && { paddingHorizontal: SPACING.md, gap: 8 }]}>
                        <ModernQuickAction
                            iconName="plus"
                            title={isSmallScreen ? "CV" : "Yeni CV"}
                            colors={COLORS.gradients.primary}
                            onPress={() => navigation.navigate('Templates')}
                            delay={100}
                        />
                        <ModernQuickAction
                            iconName="grid"
                            title={isSmallScreen ? "Şablon" : "Şablonlar"}
                            colors={COLORS.gradients.success}
                            onPress={() => navigation.navigate('Templates')}
                            delay={200}
                        />
                        <ModernQuickAction
                            iconName="share-2"
                            title={isSmallScreen ? "Paylaş" : "Paylaş"}
                            colors={COLORS.gradients.ocean}
                            onPress={() => navigation.navigate('CVShare')}
                            delay={300}
                        />
                    </View>
                </View>

                {/* CV List with Modern Cards */}
                <View style={styles.section}>
                    <SectionHeader 
                        title="CV'lerim" 
                        subtitle="Son güncellenenler"
                        icon={<Feather name="folder" size={18} color={COLORS.primary} />}
                        actionText={cvs.length > 3 ? "Tümü" : null}
                        onAction={() => {}}
                    />

                    {loading ? (
                        <View style={styles.cvList}>
                            {[1, 2, 3].map(i => (
                                <ModernCard key={i} style={{ marginBottom: SPACING.md }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: SPACING.md }}>
                                        <SkeletonLoader width={48} height={48} circle />
                                        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                                            <SkeletonLoader width="60%" height={16} style={{ marginBottom: 8 }} />
                                            <SkeletonLoader width="40%" height={12} />
                                        </View>
                                    </View>
                                </ModernCard>
                            ))}
                        </View>
                    ) : cvs.length === 0 ? (
                        <ModernCard style={styles.emptyStateCard}>
                            <Feather name="inbox" size={48} color={COLORS.textTertiary} />
                            <Text style={styles.emptyStateTitle}>Henüz CV'niz yok</Text>
                            <Text style={styles.emptyStateSubtitle}>
                                Profesyonel CV'nizi dakikalar içinde oluşturun
                            </Text>
                            <AnimatedButton
                                title="CV Oluştur"
                                onPress={() => navigation.navigate('Templates')}
                                iconName="plus"
                                style={{ marginTop: SPACING.lg }}
                            />
                        </ModernCard>
                    ) : (
                        <View style={styles.cvList}>
                            {cvs.slice(0, 5).map((cv, index) => (
                                <ModernCVCard
                                    key={cv.id}
                                    cv={cv}
                                    index={index}
                                    onPress={() => navigation.navigate('Editor', { cvId: cv.id })}
                                    onEdit={() => navigation.navigate('Editor', { cvId: cv.id })}
                                    onDelete={() => handleDeleteCV(cv)}
                                    formatDate={formatDate}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Tools Menu - Modern */}
                <View style={styles.section}>
                    <SectionHeader 
                        title="Araçlar" 
                        subtitle="CV'nizi güçlendirin"
                        icon={<Feather name="tool" size={18} color={COLORS.primary} />}
                    />
                    <ModernCard style={styles.menuCard}>
                        <ModernMenuItem 
                            iconName="bar-chart-2" 
                            title="ATS Analizi" 
                            subtitle="CV puanınızı öğrenin"
                            color="#6366F1"
                            onPress={() => navigation.navigate('ATSAnalysis')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="edit-3" 
                            title="Ön Yazı Oluştur" 
                            subtitle="AI destekli yazım"
                            color="#10B981"
                            onPress={() => navigation.navigate('CoverLetter')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="globe" 
                            title="CV Çeviri" 
                            subtitle="25+ dil desteği"
                            color="#F59E0B"
                            onPress={() => navigation.navigate('CVTranslator')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="briefcase" 
                            title="İş Ara" 
                            subtitle="Uygun pozisyonlar"
                            color="#EF4444"
                            onPress={() => navigation.navigate('JobSearch')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="share-2" 
                            title="CV Paylaş" 
                            subtitle="Link oluştur"
                            color="#8B5CF6"
                            onPress={() => navigation.navigate('CVShare')}
                        />
                    </ModernCard>
                </View>

                {/* Advanced Features - Modern */}
                <View style={styles.section}>
                    <SectionHeader 
                        title="Gelişmiş Özellikler" 
                        subtitle="Kariyerinizi ilerletin"
                        icon={<Feather name="award" size={18} color={COLORS.primary} />}
                    />
                    <ModernCard style={styles.menuCard}>
                        <ModernMenuItem 
                            iconName="mic" 
                            title="Mülakat Simülatörü" 
                            subtitle="AI ile pratik yapın"
                            color="#EC4899"
                            onPress={() => navigation.navigate('Interview')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="clipboard" 
                            title="Başvuru Takip" 
                            subtitle="CRM ile yönetin"
                            color="#06B6D4"
                            onPress={() => navigation.navigate('ApplicationCRM')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="target" 
                            title="Yetkinlik Analizi" 
                            subtitle="Eksik becerilerinizi keşfedin"
                            color="#F59E0B"
                            onPress={() => navigation.navigate('SkillGap')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="dollar-sign" 
                            title="Maaş Karşılaştırma" 
                            subtitle="Piyasa değerinizi öğrenin"
                            color="#10B981"
                            onPress={() => navigation.navigate('Salary')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="map" 
                            title="Kariyer Yolu" 
                            subtitle="Geleceğinizi planlayın"
                            color="#8B5CF6"
                            onPress={() => navigation.navigate('CareerPath')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="linkedin" 
                            title="LinkedIn Import" 
                            subtitle="Profilinizi aktarın"
                            color="#0077B5"
                            onPress={() => navigation.navigate('LinkedInImport')}
                        />
                        <View style={styles.menuDivider} />
                        <ModernMenuItem 
                            iconName="grid" 
                            title="QR Kartvizit" 
                            subtitle="Dijital kartvizit oluşturun"
                            color="#6366F1"
                            onPress={() => navigation.navigate('QRCode')}
                        />
                    </ModernCard>
                </View>

                {/* Tips - Modern */}
                <View style={styles.section}>
                    <ModernCard style={styles.tipCard} gradient={['#6366F108', '#8B5CF608']}>
                        <View style={styles.tipContent}>
                            <View style={styles.tipIconBox}>
                                <Feather name="lightbulb" size={24} color={COLORS.primary} />
                            </View>
                            <View style={styles.tipTextContainer}>
                                <Text style={styles.tipTitle}>Profesyonel İpucu</Text>
                                <Text style={styles.tipText}>
                                    ATS analizi ile CV'nizin işe alım sistemleriyle uyumunu kontrol edin.
                                </Text>
                            </View>
                        </View>
                    </ModernCard>
                </View>

                <View style={{ height: 140 }} />
            </Animated.ScrollView>

            {/* Modern FAB */}
            <View style={styles.fabContainer}>
                <FloatingActionButton
                    onPress={() => navigation.navigate('Templates')}
                    icon="plus"
                    colors={COLORS.gradients.primary}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 140,
    },

    // Header
    // Modern Header
    modernHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: isSmallScreen ? SPACING.md : SPACING.lg,
        paddingTop: Platform.OS === 'ios' ? (isSmallScreen ? 50 : 60) : (isSmallScreen ? 40 : 48),
        paddingBottom: isSmallScreen ? SPACING.md : SPACING.lg,
        backgroundColor: '#FAFBFC',
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    greetingIcon: {
        marginRight: 6,
    },
    userRole: {
        fontSize: 12,
        color: COLORS.success,
        fontWeight: '600',
        marginTop: 2,
    },
    notifBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.error,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FAFBFC',
    },
    notifBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.success,
        borderWidth: 2.5,
        borderColor: '#FAFBFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 20,
        backgroundColor: '#FAFBFC',
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: moderateScale(14),
        color: '#94A3B8',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    userName: {
        fontSize: moderateScale(isSmallScreen ? 24 : 28),
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 4,
        letterSpacing: -0.8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerBtn: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    headerBtnIcon: {
        fontSize: 20,
    },
    notifDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#EF4444',
        borderWidth: 2.5,
        borderColor: '#F1F5F9',
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    avatarGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        paddingHorizontal: isSmallScreen ? SPACING.md : 20,
        gap: isSmallScreen ? 8 : 12,
        marginBottom: isSmallScreen ? 16 : 24,
    },

    // Modern Premium Banner
    modernPremiumBanner: {
        marginHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.xxl,
        overflow: 'hidden',
        marginBottom: SPACING.xl,
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.35,
                shadowRadius: 24,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    premiumBlur: {
        ...StyleSheet.absoluteFillObject,
    },
    premiumFeatures: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.md,
        gap: 4,
    },
    featureText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    // Premium Banner (legacy support)
    premiumBanner: {
        marginHorizontal: 20,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 28,
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.35,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    premiumGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 22,
        overflow: 'hidden',
    },
    premiumCircle1: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    premiumCircle2: {
        position: 'absolute',
        bottom: -40,
        left: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    premiumContent: {
        flex: 1,
    },
    premiumBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    premiumBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    premiumTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    premiumDesc: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '500',
    },
    premiumIconBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumIcon: {
        fontSize: 30,
    },

    // Section
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        paddingHorizontal: 20,
        marginBottom: 14,
        letterSpacing: -0.3,
    },
    seeAllBtn: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '700',
    },

    // Modern Actions Row
    actionsRow: {
        flexDirection: 'row',
        paddingHorizontal: isSmallScreen ? SPACING.md : SPACING.lg,
        gap: isSmallScreen ? 8 : SPACING.md,
    },
    modernActionBtn: {
        flex: 1,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: isSmallScreen ? 4 : 6 },
                shadowOpacity: isSmallScreen ? 0.2 : 0.25,
                shadowRadius: isSmallScreen ? 8 : 12,
            },
            android: {
                elevation: isSmallScreen ? 4 : 6,
            },
        }),
    },
    actionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    // Legacy
    actionBtn: {
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    actionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 10,
    },
    actionIcon: {
        fontSize: 22,
    },
    actionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.2,
    },

    // Modern CV List
    modernCvCard: {
        marginBottom: SPACING.md,
    },
    emptyStateCard: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xxl,
        marginHorizontal: SPACING.lg,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: SPACING.md,
    },
    emptyStateSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    // CV List (legacy)
    cvList: {
        paddingHorizontal: 20,
        gap: 12,
    },
    cvCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: 14,
        paddingLeft: 4,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cvAccent: {
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        width: 4,
        borderRadius: 2,
    },
    cvLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 12,
    },
    cvIconBox: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cvIcon: {
        fontSize: 24,
    },
    cvInfo: {
        marginLeft: 14,
        flex: 1,
    },
    cvName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    cvMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cvDate: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
    cvActions: {
        flexDirection: 'row',
        gap: 6,
    },
    cvActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cvActionIcon: {
        fontSize: 16,
    },

    // Modern Menu
    modernMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    // Menu Card (legacy)
    menuCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 22,
    },
    menuContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        letterSpacing: -0.2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 3,
        fontWeight: '500',
    },
    menuArrow: {
        fontSize: 24,
        color: '#CBD5E1',
        fontWeight: '300',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 76,
    },

    // Modern Tip Card
    tipCard: {
        marginHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
    },
    tipIconBox: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: `${COLORS.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    tipTextContainer: {
        flex: 1,
    },
    // Legacy
    tipGradient: {
        flexDirection: 'row',
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 18,
    },
    tipIcon: {
        fontSize: 28,
        marginRight: 14,
    },
    tipContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fabContainer: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: 100,
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6366F1',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
        fontWeight: '500',
    },
});
