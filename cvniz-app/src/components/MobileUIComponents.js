/**
 * Mobile UI/UX Components
 * Splash screen, tab bar customization, animations, gestures
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

/**
 * Splash Screen Component
 */
export const MobileSplashScreen = () => {
    const { colors } = useTheme();
    const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.ease,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    return (
        <View style={[styles.splashContainer, { backgroundColor: colors.background }]}>
            <Animated.View
                style={[
                    styles.splashContent,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim
                    }
                ]}
            >
                <View style={[styles.splashLogo, { backgroundColor: COLORS.primary }]}>
                    <Text style={styles.splashLogoText}>CV</Text>
                </View>

                <Text style={[styles.splashTitle, { color: colors.text }]}>CVniz</Text>
                <Text style={[styles.splashSubtitle, { color: colors.textSecondary }]}>
                    Kariyer Yönetim Platformu
                </Text>
            </Animated.View>

            <Animated.View style={[{ opacity: opacityAnim }]}>
                <Text style={[styles.splashVersion, { color: colors.textSecondary }]}>v1.0.0</Text>
            </Animated.View>
        </View>
    );
};

/**
 * Enhanced Tab Bar with Animations
 */
export const AnimatedTabBar = ({ state, descriptors, navigation }) => {
    const { colors } = useTheme();
    const animatedValues = React.useRef(
        state.routes.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        Animated.parallel(
            animatedValues.map((anim, index) =>
                Animated.timing(anim, {
                    toValue: index === state.index ? 1 : 0,
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            )
        ).start();
    }, [state.index]);

    const tabIcons = {
        Home: '🏠',
        Templates: '📋',
        Profile: '👤',
        Settings: '⚙️'
    };

    return (
        <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        preventDefault: false
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const scale = animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                });

                const opacity = animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                });

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        <Animated.View
                            style={[
                                styles.tabIconContainer,
                                {
                                    transform: [{ scale }],
                                    opacity
                                }
                            ]}
                        >
                            <Text style={styles.tabIcon}>{tabIcons[route.name]}</Text>
                        </Animated.View>

                        <Text
                            style={[
                                styles.tabLabel,
                                {
                                    color: isFocused ? COLORS.primary : colors.textSecondary,
                                    fontWeight: isFocused ? '600' : '400'
                                }
                            ]}
                        >
                            {route.name}
                        </Text>

                        {isFocused && <View style={[styles.tabIndicator, { backgroundColor: COLORS.primary }]} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

/**
 * Loading Skeleton
 */
export const SkeletonLoader = ({ count = 3, height = 100 }) => {
    const shimmerAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7]
    });

    return (
        <View style={styles.skeletonContainer}>
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.skeletonItem,
                            { height, opacity }
                        ]}
                    />
                ))}
        </View>
    );
};

/**
 * Bounce Animation Button
 */
export const BounceButton = ({ onPress, children, style }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true
        }).start();
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                style={style}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};

/**
 * Slide-up Modal Animation
 */
export const SlideUpModal = ({ visible, onClose, children, title }) => {
    const slideAnim = React.useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <View style={styles.modalOverlay}>
            <TouchableOpacity
                style={styles.modalBackdrop}
                onPress={onClose}
                activeOpacity={1}
            />

            <Animated.View
                style={[
                    styles.modalContent,
                    { transform: [{ translateY: slideAnim }] }
                ]}
            >
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.modalClose}>✕</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>{children}</View>
            </Animated.View>
        </View>
    );
};

/**
 * Pull-to-Refresh Indicator
 */
export const PullToRefreshIndicator = ({ isRefreshing, progress }) => {
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isRefreshing) {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [isRefreshing]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View
            style={[
                styles.refreshIndicator,
                { transform: [{ rotate: rotation }] }
            ]}
        >
            <Text style={styles.refreshIcon}>🔄</Text>
        </Animated.View>
    );
};

/**
 * Floating Action Button with Animation
 */
export const FloatingActionButton = ({ onPress, icon = '+' }) => {
    const scaleAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true
        }).start();
    }, []);

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.9,
                useNativeDriver: true
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true
            })
        ]).start(() => onPress());
    };

    return (
        <Animated.View
            style={[
                styles.fab,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <TouchableOpacity
                style={styles.fabButton}
                onPress={handlePress}
            >
                <Text style={styles.fabIcon}>{icon}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

/**
 * Progress Ring Animation
 */
export const ProgressRing = ({ progress = 0.75, size = 100 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.light}
                    strokeWidth="8"
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={COLORS.primary}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            <View style={styles.progressText}>
                <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
            </View>
        </View>
    );
};

/**
 * Toast Notification
 */
export const ToastNotification = ({ message, type = 'info', duration = 3000 }) => {
    const [visible, setVisible] = useState(true);
    const slideAnim = React.useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true
            }).start(() => setVisible(false));
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };

    return (
        <Animated.View
            style={[
                styles.toast,
                { backgroundColor: colors[type], transform: [{ translateY: slideAnim }] }
            ]}
        >
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    // Splash Screen
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    splashContent: {
        alignItems: 'center'
    },
    splashLogo: {
        width: 120,
        height: 120,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 24
    },
    splashLogoText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#FFFFFF'
    },
    splashTitle: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8
    },
    splashSubtitle: {
        fontSize: 16,
        fontWeight: '500'
    },
    splashVersion: {
        fontSize: 12,
        marginTop: 40
    },

    // Tab Bar
    tabBar: {
        flexDirection: 'row',
        height: 70,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 8
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    tabIcon: {
        fontSize: 24
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500'
    },
    tabIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 24,
        height: 3,
        borderRadius: 1.5
    },

    // Skeleton Loader
    skeletonContainer: {
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    skeletonItem: {
        backgroundColor: '#E5E7EB',
        borderRadius: 8
    },

    // Modal
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end'
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.8,
        paddingBottom: 24
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600'
    },
    modalClose: {
        fontSize: 24,
        color: '#6B7280'
    },
    modalBody: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },

    // Refresh Indicator
    refreshIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    refreshIcon: {
        fontSize: 20
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30
    },
    fabButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8
    },
    fabIcon: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '600'
    },

    // Progress Text
    progressText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressPercent: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary
    },

    // Toast
    toast: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        zIndex: 1000
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500'
    }
});

export default {
    MobileSplashScreen,
    AnimatedTabBar,
    SkeletonLoader,
    BounceButton,
    SlideUpModal,
    PullToRefreshIndicator,
    FloatingActionButton,
    ProgressRing,
    ToastNotification
};
