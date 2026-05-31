/**
 * Modern UI/UX Components
 * Premium glassmorphism, advanced animations, micro-interactions
 */

import React, { useRef, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, Animated, TouchableOpacity,
    Dimensions, ActivityIndicator, Platform, ViewStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW, TYPOGRAPHY, scale, moderateScale, isSmallScreen, SCREEN_WIDTH } from '../constants';

const { width } = Dimensions.get('window');

// Responsive sizing helpers
const rs = (size) => isSmallScreen ? scale(size * 0.9) : scale(size);

// ============ MODERN GLASS CARD ============
export function ModernCard({
    children,
    style,
    onPress,
    gradient,
    glassmorphism = true,
    intensity = 50,
    animated = true,
    delay = 0
}) {
    const Component = animated ? MotiView : View;
    const animationProps = animated ? {
        from: { opacity: 0, translateY: 20, scale: 0.95 },
        animate: { opacity: 1, translateY: 0, scale: 1 },
        transition: { type: 'spring', damping: 15, stiffness: 150, delay }
    } : {};

    const CardContent = () => (
        <View style={[styles.modernCard, style]}>
            {gradient && (
                <LinearGradient
                    colors={gradient}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            )}
            {glassmorphism && !gradient && (
                <BlurView
                    intensity={intensity}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                />
            )}
            <View style={styles.cardContent}>
                {children}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <Component {...animationProps}>
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.9}
                    style={styles.touchableCard}
                >
                    <CardContent />
                </TouchableOpacity>
            </Component>
        );
    }

    return (
        <Component {...animationProps}>
            <CardContent />
        </Component>
    );
}

// ============ ANIMATED BUTTON WITH HAPTICS ============
export function AnimatedButton({
    onPress,
    title,
    icon,
    iconName,
    iconType = 'feather',
    colors = COLORS.gradients.primary,
    loading = false,
    disabled = false,
    size = 'medium',
    variant = 'primary',
    fullWidth = false,
    style,
    haptic = true,
    delay = 0
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 8,
            tension: 300,
            useNativeDriver: true
        }).start();
    }, []);

    const handlePressOut = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 300,
            useNativeDriver: true
        }).start();
    }, []);

    const handlePress = useCallback(() => {
        if (haptic && !disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
    }, [onPress, disabled, loading, haptic]);

    const sizeStyles = {
        small: { paddingVertical: rs(10), paddingHorizontal: rs(16) },
        medium: { paddingVertical: rs(14), paddingHorizontal: rs(24) },
        large: { paddingVertical: rs(18), paddingHorizontal: rs(32) }
    };

    const textSizes = {
        small: moderateScale(13),
        medium: moderateScale(15),
        large: moderateScale(17)
    };

    const getIconComponent = () => {
        const iconProps = { size: size === 'small' ? 16 : size === 'large' ? 24 : 20, color: '#fff' };
        if (icon) return icon;
        if (!iconName) return null;

        switch (iconType) {
            case 'material':
                return <MaterialCommunityIcons name={iconName} {...iconProps} />;
            case 'ionicons':
                return <Ionicons name={iconName} {...iconProps} />;
            default:
                return <Feather name={iconName} {...iconProps} />;
        }
    };

    const buttonContent = (
        <Animated.View
            style={[
                { transform: [{ scale: scaleAnim }] },
                fullWidth && { width: '100%' },
                style
            ]}
        >
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                disabled={disabled || loading}
                style={[
                    styles.animatedButton,
                    sizeStyles[size],
                    fullWidth && styles.fullWidth,
                    disabled && styles.disabled
                ]}
            >
                {variant === 'primary' ? (
                    <LinearGradient
                        colors={disabled ? ['#9CA3AF', '#6B7280'] : colors}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                ) : (
                    <View style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: disabled ? '#E5E7EB' : 'transparent' }
                    ]} />
                )}
                <View style={styles.buttonContent}>
                    {loading ? (
                        <ActivityIndicator color={variant === 'primary' ? '#fff' : COLORS.primary} />
                    ) : (
                        <>
                            {iconName && getIconComponent()}
                            <Text style={[
                                styles.buttonText,
                                { fontSize: textSizes[size] },
                                variant === 'primary' && styles.primaryButtonText,
                                variant === 'outline' && styles.outlineButtonText,
                                disabled && styles.disabledText
                            ]}>
                                {title}
                            </Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    if (delay > 0) {
        return (
            <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay }}
            >
                {buttonContent}
            </MotiView>
        );
    }

    return buttonContent;
}

// ============ MODERN SKELETON LOADER ============
export function SkeletonLoader({ width: w = '100%', height: h = 20, circle = false, style }) {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
            })
        );
        animation.start();
        return () => animation.stop();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width]
    });

    return (
        <View
            style={[
                styles.skeleton,
                { width: w, height: h, borderRadius: circle ? h / 2 : BORDER_RADIUS.md },
                style
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    { transform: [{ translateX }] }
                ]}
            />
        </View>
    );
}

// ============ MODERN BADGE ============
export function Badge({
    text,
    color = COLORS.primary,
    size = 'medium',
    variant = 'solid',
    icon,
    pulse = false
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (pulse) {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true
                    })
                ])
            );
            animation.start();
            return () => animation.stop();
        }
    }, [pulse]);

    const sizeStyles = {
        small: { paddingHorizontal: rs(8), paddingVertical: rs(2) },
        medium: { paddingHorizontal: rs(12), paddingVertical: rs(4) },
        large: { paddingHorizontal: rs(16), paddingVertical: rs(6) }
    };

    const textSizes = {
        small: moderateScale(10),
        medium: moderateScale(12),
        large: moderateScale(14)
    };

    return (
        <Animated.View
            style={[
                styles.badge,
                sizeStyles[size],
                variant === 'solid' && { backgroundColor: color },
                variant === 'outline' && { borderColor: color, borderWidth: 1 },
                pulse && { transform: [{ scale: scaleAnim }] }
            ]}
        >
            {icon && <View style={styles.badgeIcon}>{icon}</View>}
            <Text style={[
                styles.badgeText,
                { fontSize: textSizes[size] },
                variant === 'solid' && styles.badgeTextSolid,
                variant === 'outline' && { color }
            ]}>
                {text}
            </Text>
        </Animated.View>
    );
}

// ============ STAT CARD (Modern Dashboard Card) ============
export function StatCard({
    title,
    value,
    subtitle,
    icon,
    iconName,
    iconType = 'feather',
    color = COLORS.primary,
    trend,
    trendUp,
    onPress,
    delay = 0
}) {
    const getIconComponent = () => {
        const iconProps = { size: 24, color };
        if (icon) return icon;
        if (!iconName) return <Feather name="activity" {...iconProps} />;

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
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay }}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                style={styles.statCardContainer}
            >
                <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.statCardContent}>
                    <View style={styles.statCardHeader}>
                        <View style={[styles.statIconContainer, { backgroundColor: `${color}20`, width: isSmallScreen ? 36 : 44, height: isSmallScreen ? 36 : 44 }]}>
                            {getIconComponent()}
                        </View>
                        {trend && (
                            <View style={[
                                styles.trendBadge,
                                { backgroundColor: trendUp ? `${COLORS.success}20` : `${COLORS.error}20` }
                            ]}>
                                <Feather
                                    name={trendUp ? 'trending-up' : 'trending-down'}
                                    size={12}
                                    color={trendUp ? COLORS.success : COLORS.error}
                                />
                                <Text style={[
                                    styles.trendText,
                                    { color: trendUp ? COLORS.success : COLORS.error }
                                ]}>
                                    {trend}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statTitle}>{title}</Text>
                    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
                </View>
            </TouchableOpacity>
        </MotiView>
    );
}

// ============ SECTION HEADER ============
export function SectionHeader({ title, subtitle, actionText, onAction, icon, delay = 0 }) {
    return (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay }}
            style={styles.sectionHeader}
        >
            <View style={styles.sectionTitleContainer}>
                {icon && (
                    <View style={styles.sectionIconContainer}>
                        {icon}
                    </View>
                )}
                <View>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {actionText && (
                <TouchableOpacity onPress={onAction} style={styles.actionButton}>
                    <Text style={styles.actionText}>{actionText}</Text>
                    <Feather name="chevron-right" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            )}
        </MotiView>
    );
}

// ============ PROGRESS BAR ============
export function ProgressBar({
    progress,
    color = COLORS.primary,
    height = 8,
    animated = true,
    showPercentage = false,
    style
}) {
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.spring(progressAnim, {
                toValue: progress,
                friction: 8,
                tension: 100,
                useNativeDriver: false
            }).start();
        } else {
            progressAnim.setValue(progress);
        }
    }, [progress, animated]);

    const widthInterpolated = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={style}>
            <View style={[styles.progressContainer, { height, borderRadius: height / 2 }]}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        { width: widthInterpolated, backgroundColor: color, borderRadius: height / 2 }
                    ]}
                />
            </View>
            {showPercentage && (
                <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            )}
        </View>
    );
}

// ============ FLOATING ACTION BUTTON ============
export function FloatingActionButton({
    onPress,
    icon = 'plus',
    iconType = 'feather',
    colors = COLORS.gradients.primary,
    size = 56,
    haptic = true,
    style
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 8,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true
        }).start();
    };

    const handlePress = () => {
        if (haptic) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        Animated.sequence([
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
        onPress?.();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    const getIcon = () => {
        const iconProps = { size: 24, color: '#fff' };
        switch (iconType) {
            case 'material':
                return <MaterialCommunityIcons name={icon} {...iconProps} />;
            case 'ionicons':
                return <Ionicons name={icon} {...iconProps} />;
            default:
                return <Feather name={icon} {...iconProps} />;
        }
    };

    return (
        <Animated.View
            style={[
                { transform: [{ scale: scaleAnim }, { rotate }] },
                style
            ]}
        >
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={[styles.fab, { width: size, height: size, borderRadius: size / 2 }]}
            >
                <LinearGradient
                    colors={colors}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                {getIcon()}
            </TouchableOpacity>
        </Animated.View>
    );
}

// ============ EMPTY STATE ============
export function EmptyState({
    icon,
    iconName = 'inbox',
    title,
    subtitle,
    actionText,
    onAction,
    delay = 0
}) {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay }}
            style={styles.emptyState}
        >
            <View style={styles.emptyIconContainer}>
                {icon || <Feather name={iconName} size={48} color={COLORS.textTertiary} />}
            </View>
            <Text style={styles.emptyTitle}>{title}</Text>
            {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
            {actionText && (
                <AnimatedButton
                    title={actionText}
                    onPress={onAction}
                    variant="outline"
                    size="medium"
                    style={{ marginTop: SPACING.lg }}
                />
            )}
        </MotiView>
    );
}

// ============ CHIP/TAG COMPONENT ============
export function Chip({
    text,
    selected = false,
    onPress,
    color = COLORS.primary,
    icon,
    disabled = false
}) {
    const handlePress = () => {
        if (!disabled && onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[
                styles.chip,
                selected && { backgroundColor: color, borderColor: color },
                disabled && styles.chipDisabled
            ]}
        >
            {icon && <View style={styles.chipIcon}>{icon}</View>}
            <Text style={[
                styles.chipText,
                selected && styles.chipTextSelected,
                disabled && styles.chipTextDisabled
            ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

// ============ STYLES ============
const styles = StyleSheet.create({
    // Modern Card
    modernCard: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...SHADOW.lg
    },
    touchableCard: {
        borderRadius: BORDER_RADIUS.xl,
    },
    cardContent: {
        padding: SPACING.lg,
    },

    // Animated Button
    animatedButton: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...SHADOW.md
    },
    fullWidth: {
        width: '100%'
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: 2
    },
    buttonText: {
        fontWeight: '700',
        letterSpacing: 0.3
    },
    primaryButtonText: {
        color: '#FFFFFF'
    },
    outlineButtonText: {
        color: COLORS.primary
    },
    disabled: {
        opacity: 0.5
    },
    disabledText: {
        color: '#9CA3AF'
    },

    // Skeleton
    skeleton: {
        backgroundColor: '#E2E8F0',
        overflow: 'hidden'
    },
    shimmer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: '100%'
    },

    // Badge
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.full,
        gap: 4
    },
    badgeText: {
        fontWeight: '600'
    },
    badgeTextSolid: {
        color: '#FFFFFF'
    },
    badgeIcon: {
        marginRight: 2
    },

    // Stat Card
    statCardContainer: {
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...SHADOW.md,
        minWidth: isSmallScreen ? 100 : 160,
        flex: 1,
    },
    statCardContent: {
        padding: isSmallScreen ? SPACING.md : SPACING.lg,
    },
    statCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center'
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
        gap: 4
    },
    trendText: {
        fontSize: 11,
        fontWeight: '600'
    },
    statValue: {
        fontSize: moderateScale(isSmallScreen ? 22 : 28),
        fontWeight: '800',
        color: COLORS.text,
        letterSpacing: -0.5
    },
    statTitle: {
        fontSize: moderateScale(isSmallScreen ? 12 : 14),
        color: COLORS.textSecondary,
        marginTop: 2
    },
    statSubtitle: {
        fontSize: moderateScale(11),
        color: COLORS.textTertiary,
        marginTop: 4
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm
    },
    sectionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: `${COLORS.primary}15`,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionTitle: {
        ...TYPOGRAPHY.h4,
        color: COLORS.text
    },
    sectionSubtitle: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginTop: 2
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary
    },

    // Progress Bar
    progressContainer: {
        backgroundColor: '#E2E8F0',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%'
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginTop: 4,
        textAlign: 'right'
    },

    // FAB
    fab: {
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOW.lg
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.xxl,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg
    },
    emptyTitle: {
        ...TYPOGRAPHY.h4,
        color: COLORS.text,
        textAlign: 'center'
    },
    emptySubtitle: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.xs,
        maxWidth: 280
    },

    // Chip
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm
    },
    chipDisabled: {
        opacity: 0.5
    },
    chipIcon: {
        marginRight: 6
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textSecondary
    },
    chipTextSelected: {
        color: '#FFFFFF'
    },
    chipTextDisabled: {
        color: COLORS.textTertiary
    }
});
