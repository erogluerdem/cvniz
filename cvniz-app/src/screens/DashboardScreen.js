import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    RefreshControl, Alert, StatusBar, Dimensions, Platform, Animated
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { useTheme } from '../context/ThemeContext';
import { StatCard, MenuItem, FAB, SectionHeader, EmptyState, GradientButton, Skeleton } from '../components/UIComponents';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW, ANIMATION } from '../constants';

const { width, height } = Dimensions.get('window');

// Animated Header Component
const AnimatedHeader = ({ user, navigation, greeting }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
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
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
            <View style={styles.headerLeft}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.userName}>{user?.name || 'Kullanıcı'} 👋</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity 
                    style={styles.headerBtn}
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <Text style={styles.headerBtnIcon}>🔔</Text>
                    <View style={styles.notifDot} />
                </TouchableOpacity>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity 
                        style={styles.avatar}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <LinearGradient
                            colors={COLORS.gradients.primary}
                            style={styles.avatarGradient}
                        >
                            <Text style={styles.avatarText}>
                                {(user?.name || 'U')[0].toUpperCase()}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

// Premium Banner Component
const PremiumBanner = ({ onPress }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            delay: 300,
            useNativeDriver: true,
        }).start();

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
    }, []);

    const shimmerOpacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 1, 0.5],
    });

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
                style={styles.premiumBanner}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#6366F1', '#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.premiumGradient}
                >
                    {/* Decorative Elements */}
                    <Animated.View style={[styles.premiumCircle1, { opacity: shimmerOpacity }]} />
                    <Animated.View style={[styles.premiumCircle2, { opacity: shimmerOpacity }]} />
                    
                    <View style={styles.premiumContent}>
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumBadgeText}>👑 PRO</Text>
                        </View>
                        <Text style={styles.premiumTitle}>Premium'a Yükselt</Text>
                        <Text style={styles.premiumDesc}>
                            AI araçları • Sınırsız şablon • Öncelikli destek
                        </Text>
                    </View>
                    <View style={styles.premiumIconBox}>
                        <Text style={styles.premiumIcon}>✨</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Quick Action Button
const QuickActionButton = ({ icon, title, colors, onPress, delay = 0 }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            delay,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.95,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.actionBtn, { transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }] }]}>
            <TouchableOpacity 
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <LinearGradient
                    colors={colors}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.actionIcon}>{icon}</Text>
                    <Text style={styles.actionText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

// CV Card Component
const CVCard = ({ cv, index, onPress, onEdit, onDelete, formatDate }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(index * 80),
            Animated.parallel([
                Animated.spring(fadeAnim, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
    const cardColor = colors[index % colors.length];

    return (
        <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
        }}>
            <TouchableOpacity
                style={styles.cvCard}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {/* Color Accent */}
                <View style={[styles.cvAccent, { backgroundColor: cardColor }]} />
                
                <View style={styles.cvLeft}>
                    <View style={[styles.cvIconBox, { backgroundColor: cardColor + '15' }]}>
                        <Text style={styles.cvIcon}>📄</Text>
                    </View>
                    <View style={styles.cvInfo}>
                        <Text style={styles.cvName} numberOfLines={1}>{cv.name}</Text>
                        <View style={styles.cvMeta}>
                            <Text style={styles.cvDate}>
                                🕐 {formatDate(cv.updatedAt || cv.createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cvActions}>
                    <TouchableOpacity 
                        style={[styles.cvActionBtn, { backgroundColor: '#6366F110' }]}
                        onPress={onEdit}
                    >
                        <Text style={styles.cvActionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.cvActionBtn, { backgroundColor: '#EF444410' }]}
                        onPress={onDelete}
                    >
                        <Text style={styles.cvActionIcon}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
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

    // Menu Item Local Component
    const MenuItemLocal = ({ icon, title, subtitle, onPress, colors: gradientColors }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;
        
        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.98,
                friction: 8,
                useNativeDriver: true,
            }).start();
        };
        
        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }).start();
        };
        
        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={onPress} 
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <View style={[styles.menuIconBox, { backgroundColor: gradientColors[0] + '15' }]}>
                        <Text style={styles.menuIcon}>{icon}</Text>
                    </View>
                    <View style={styles.menuContent}>
                        <Text style={styles.menuTitle}>{title}</Text>
                        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
                    </View>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </Animated.View>
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
                {/* Header */}
                <AnimatedHeader user={user} navigation={navigation} greeting={getGreeting()} />

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="CV"
                        value={cvs.length}
                        icon="📄"
                        color="#6366F1"
                        delay={100}
                    />
                    <StatCard
                        title="Şablon"
                        value="106"
                        icon="🎨"
                        color="#10B981"
                        delay={200}
                    />
                    <StatCard
                        title="Görüntülenme"
                        value="0"
                        icon="👁"
                        color="#F59E0B"
                        delay={300}
                    />
                </View>

                {/* Premium Banner */}
                {!isPremium && (
                    <PremiumBanner onPress={() => navigation.navigate('Premium')} />
                )}

                {/* Quick Actions */}
                <View style={styles.section}>
                    <SectionHeader title="Hızlı İşlemler" icon="⚡" />
                    <View style={styles.actionsRow}>
                        <QuickActionButton
                            icon="✨"
                            title="Yeni CV"
                            colors={COLORS.gradients.primary}
                            onPress={() => navigation.navigate('Templates')}
                            delay={100}
                        />
                        <QuickActionButton
                            icon="🎨"
                            title="Şablonlar"
                            colors={COLORS.gradients.success}
                            onPress={() => navigation.navigate('Templates')}
                            delay={200}
                        />
                    </View>
                </View>

                {/* CV List */}
                <View style={styles.section}>
                    <SectionHeader 
                        title="CV'lerim" 
                        icon="📋"
                        actionText={cvs.length > 3 ? "Tümü" : null}
                        onAction={() => {}}
                    />

                    {loading ? (
                        <View style={styles.cvList}>
                            {[1, 2, 3].map(i => (
                                <View key={i} style={[styles.cvCard, { padding: 16 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Skeleton width={48} height={48} borderRadius={14} />
                                        <View style={{ marginLeft: 12, flex: 1 }}>
                                            <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
                                            <Skeleton width="40%" height={12} />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : cvs.length === 0 ? (
                        <EmptyState
                            icon="📋"
                            title="Henüz CV'niz yok"
                            subtitle="Profesyonel CV'nizi dakikalar içinde oluşturun"
                            actionLabel="CV Oluştur"
                            onAction={() => navigation.navigate('Templates')}
                        />
                    ) : (
                        <View style={styles.cvList}>
                            {cvs.slice(0, 5).map((cv, index) => (
                                <CVCard
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

                {/* Tools Menu */}
                <View style={styles.section}>
                    <SectionHeader title="Araçlar" icon="🛠️" />
                    <View style={styles.menuCard}>
                        <MenuItemLocal 
                            icon="📊" 
                            title="ATS Analizi" 
                            subtitle="CV puanınızı öğrenin"
                            colors={['#6366F1']}
                            onPress={() => navigation.navigate('ATSAnalysis')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="✍️" 
                            title="Ön Yazı Oluştur" 
                            subtitle="AI destekli yazım"
                            colors={['#10B981']}
                            onPress={() => navigation.navigate('CoverLetter')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="🌐" 
                            title="CV Çeviri" 
                            subtitle="25+ dil desteği"
                            colors={['#F59E0B']}
                            onPress={() => navigation.navigate('CVTranslator')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="💼" 
                            title="İş Ara" 
                            subtitle="Uygun pozisyonlar"
                            colors={['#EF4444']}
                            onPress={() => navigation.navigate('JobSearch')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="🔗" 
                            title="CV Paylaş" 
                            subtitle="Link oluştur"
                            colors={['#8B5CF6']}
                            onPress={() => navigation.navigate('CVShare')}
                        />
                    </View>
                </View>

                {/* Advanced Features */}
                <View style={styles.section}>
                    <SectionHeader title="Gelişmiş Özellikler" icon="🚀" />
                    <View style={styles.menuCard}>
                        <MenuItemLocal 
                            icon="🎙️" 
                            title="Mülakat Simülatörü" 
                            subtitle="AI ile pratik yapın"
                            colors={['#EC4899']}
                            onPress={() => navigation.navigate('Interview')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="📋" 
                            title="Başvuru Takip" 
                            subtitle="CRM ile yönetin"
                            colors={['#06B6D4']}
                            onPress={() => navigation.navigate('ApplicationCRM')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="💡" 
                            title="Yetkinlik Analizi" 
                            subtitle="Eksik becerilerinizi keşfedin"
                            colors={['#F59E0B']}
                            onPress={() => navigation.navigate('SkillGap')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="💰" 
                            title="Maaş Karşılaştırma" 
                            subtitle="Piyasa değerinizi öğrenin"
                            colors={['#10B981']}
                            onPress={() => navigation.navigate('Salary')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="🗺️" 
                            title="Kariyer Yolu" 
                            subtitle="Geleceğinizi planlayın"
                            colors={['#8B5CF6']}
                            onPress={() => navigation.navigate('CareerPath')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="📲" 
                            title="LinkedIn Import" 
                            subtitle="Profilinizi aktarın"
                            colors={['#0077B5']}
                            onPress={() => navigation.navigate('LinkedInImport')}
                        />
                        <View style={styles.menuDivider} />
                        <MenuItemLocal 
                            icon="🔲" 
                            title="QR Kartvizit" 
                            subtitle="Dijital kartvizit oluşturun"
                            colors={['#6366F1']}
                            onPress={() => navigation.navigate('QRCode')}
                        />
                    </View>
                </View>

                {/* Tips */}
                <View style={styles.section}>
                    <View style={styles.tipCard}>
                        <LinearGradient
                            colors={['#6366F108', '#8B5CF608']}
                            style={styles.tipGradient}
                        >
                            <Text style={styles.tipIcon}>💡</Text>
                            <View style={styles.tipContent}>
                                <Text style={styles.tipTitle}>Profesyonel İpucu</Text>
                                <Text style={styles.tipText}>
                                    ATS analizi ile CV'nizin işe alım sistemleriyle uyumunu kontrol edin.
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </Animated.ScrollView>

            {/* FAB */}
            <FAB
                onPress={() => navigation.navigate('Templates')}
                icon="+"
                colors={COLORS.gradients.primary}
            />
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
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    userName: {
        fontSize: 28,
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
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },

    // Premium Banner
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

    // Actions Row
    actionsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 14,
    },
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

    // CV List
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

    // Menu Card
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

    // Tip Card
    tipCard: {
        marginHorizontal: 20,
        borderRadius: 18,
        overflow: 'hidden',
    },
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
        flex: 1,
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
