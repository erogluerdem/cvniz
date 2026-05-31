import React, { useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
    Dimensions, Platform, ActivityIndicator, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ============ GLASSMORPHISM CARD ============
export function GlassCard({ children, style, intensity = 20, colors }) {
    const bgColor = colors?.background || 'rgba(255, 255, 255, 0.95)';
    const borderColor = colors?.border || 'rgba(255, 255, 255, 0.4)';

    return (
        <View style={[styles.glassCard, { backgroundColor: bgColor, borderColor }, style]}>
            <View style={styles.glassInner}>
                {children}
            </View>
        </View>
    );
}

// ============ ANIMATED GRADIENT BUTTON ============
export function GradientButton({ 
    onPress, 
    title, 
    icon, 
    colors = ['#6366F1', '#8B5CF6'],
    loading = false,
    disabled = false,
    size = 'medium',
    style 
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shadowAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.timing(shadowAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const sizeStyles = {
        small: { paddingVertical: 10, paddingHorizontal: 16 },
        medium: { paddingVertical: 14, paddingHorizontal: 24 },
        large: { paddingVertical: 18, paddingHorizontal: 32 },
    };

    const textSizes = {
        small: 13,
        medium: 15,
        large: 17,
    };

    return (
        <Animated.View style={[
            { transform: [{ scale: scaleAnim }], opacity: disabled ? 0.5 : 1 },
            style
        ]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                disabled={disabled || loading}
            >
                <LinearGradient
                    colors={disabled ? ['#9CA3AF', '#6B7280'] : colors}
                    style={[styles.gradientButton, sizeStyles[size]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            {icon && <Text style={styles.buttonIcon}>{icon}</Text>}
                            <Text style={[styles.buttonText, { fontSize: textSizes[size] }]}>
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ============ ANIMATED STAT CARD ============
export function StatCard({ 
    title, 
    value, 
    icon, 
    color = '#6366F1', 
    trend, 
    delay = 0,
    onPress 
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
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

        // Pulse animation for icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.statCard,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <TouchableOpacity 
                onPress={onPress} 
                activeOpacity={onPress ? 0.7 : 1}
                style={styles.statCardInner}
            >
                {/* Background Glow */}
                <View style={[styles.statGlow, { backgroundColor: color + '10' }]} />
                
                {/* Icon */}
                <Animated.View 
                    style={[
                        styles.statIconBox, 
                        { backgroundColor: color + '15', transform: [{ scale: pulseAnim }] }
                    ]}
                >
                    <Text style={styles.statIcon}>{icon}</Text>
                </Animated.View>

                {/* Content */}
                <View style={styles.statContent}>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statTitle}>{title}</Text>
                </View>

                {/* Trend Indicator */}
                {trend && (
                    <View style={[
                        styles.trendBadge,
                        { backgroundColor: trend > 0 ? '#10B98120' : '#EF444420' }
                    ]}>
                        <Text style={[
                            styles.trendText,
                            { color: trend > 0 ? '#10B981' : '#EF4444' }
                        ]}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

// ============ FLOATING ACTION BUTTON ============
export function FAB({ 
    onPress, 
    icon = '+', 
    colors = ['#6366F1', '#8B5CF6'],
    style 
}) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            delay: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(rotateAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(rotateAnim, {
            toValue: 0,
            friction: 4,
            useNativeDriver: true,
        }).start();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <Animated.View 
            style={[
                styles.fabContainer,
                { transform: [{ scale: scaleAnim }] },
                style
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={colors}
                    style={styles.fab}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Animated.Text style={[styles.fabIcon, { transform: [{ rotate }] }]}>
                        {icon}
                    </Animated.Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ============ ANIMATED MENU ITEM ============
export function MenuItem({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    color = '#6366F1',
    badge,
    delay = 0,
    arrow = true 
}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
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
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.menuItem}
            >
                <View style={[styles.menuIconBox, { backgroundColor: color + '12' }]}>
                    <Text style={styles.menuIcon}>{icon}</Text>
                </View>
                <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{title}</Text>
                    {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
                </View>
                {badge && (
                    <View style={[styles.menuBadge, { backgroundColor: color }]}>
                        <Text style={styles.menuBadgeText}>{badge}</Text>
                    </View>
                )}
                {arrow && <Text style={styles.menuArrow}>›</Text>}
            </TouchableOpacity>
        </Animated.View>
    );
}

// ============ SKELETON LOADER ============
export function Skeleton({ width: w = '100%', height = 20, borderRadius = 8, style }) {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width: w,
                    height,
                    borderRadius,
                    backgroundColor: '#E2E8F0',
                    opacity,
                },
                style,
            ]}
        />
    );
}

// ============ SECTION HEADER ============
export function SectionHeader({ title, icon, actionText, onAction, style }) {
    return (
        <View style={[styles.sectionHeader, style]}>
            <View style={styles.sectionHeaderLeft}>
                {icon && <Text style={styles.sectionHeaderIcon}>{icon}</Text>}
                <Text style={styles.sectionHeaderTitle}>{title}</Text>
            </View>
            {actionText && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={styles.sectionHeaderAction}>{actionText} →</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// ============ CHIP / TAG ============
export function Chip({ label, icon, color = '#6366F1', selected, onPress, style }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
        onPress?.();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                style={[
                    styles.chip,
                    selected && { backgroundColor: color + '15', borderColor: color },
                    style,
                ]}
            >
                {icon && <Text style={styles.chipIcon}>{icon}</Text>}
                <Text style={[
                    styles.chipLabel,
                    selected && { color }
                ]}>
                    {label}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

// ============ EMPTY STATE ============
export function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -10,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.emptyState}>
            <Animated.Text 
                style={[styles.emptyIcon, { transform: [{ translateY: bounceAnim }] }]}
            >
                {icon}
            </Animated.Text>
            <Text style={styles.emptyTitle}>{title}</Text>
            <Text style={styles.emptySubtitle}>{subtitle}</Text>
            {actionLabel && (
                <GradientButton
                    onPress={onAction}
                    title={actionLabel}
                    size="small"
                    style={{ marginTop: 16 }}
                />
            )}
        </View>
    );
}

// ============ AVATAR ============
export function Avatar({ source, name, size = 48, color = '#6366F1', style }) {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
            {source ? (
                <Image source={source} style={styles.avatarImage} />
            ) : (
                <LinearGradient
                    colors={[color, color + 'CC']}
                    style={[styles.avatarGradient, { borderRadius: size / 2 }]}
                >
                    <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
                </LinearGradient>
            )}
        </View>
    );
}

// ============ NOTIFICATION DOT ============
export function NotificationDot({ count, style }) {
    if (!count) return null;
    
    return (
        <View style={[styles.notificationDot, style]}>
            <Text style={styles.notificationText}>
                {count > 99 ? '99+' : count}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    // Glass Card
    glassCard: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 24,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    glassInner: {
        padding: 16,
    },

    // Gradient Button
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    buttonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Stat Card
    statCard: {
        flex: 1,
        minWidth: 100,
    },
    statCardInner: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    statGlow: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    statIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statIcon: {
        fontSize: 22,
    },
    statContent: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    statTitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
        fontWeight: '500',
    },
    trendBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    trendText: {
        fontSize: 10,
        fontWeight: '700',
    },

    // FAB
    fabContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 100,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    fabIcon: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '300',
    },

    // Menu Item
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    menuIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        fontSize: 20,
    },
    menuContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
        letterSpacing: -0.2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    menuBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        marginRight: 8,
    },
    menuBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    menuArrow: {
        fontSize: 22,
        color: '#CBD5E1',
        fontWeight: '300',
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingHorizontal: 4,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionHeaderIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    sectionHeaderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: -0.3,
    },
    sectionHeaderAction: {
        fontSize: 13,
        color: '#6366F1',
        fontWeight: '600',
    },

    // Chip
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1.5,
        borderColor: 'transparent',
        marginRight: 8,
    },
    chipIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    chipLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Avatar
    avatar: {
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
    },

    // Notification Dot
    notificationDot: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#fff',
    },
    notificationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
});
