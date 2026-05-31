import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW, scale, isSmallScreen } from '../constants';

const tabs = [
    { 
        name: 'Dashboard', 
        label: "CV'lerim", 
        icon: 'file-text', 
        activeIcon: 'file-text',
        color: '#6366F1' 
    },
    { 
        name: 'Templates', 
        label: 'Şablonlar', 
        icon: 'layout', 
        activeIcon: 'layout',
        color: '#8B5CF6' 
    },
    { 
        name: 'Profile', 
        label: 'Profil', 
        icon: 'user', 
        activeIcon: 'user',
        color: '#EC4899' 
    },
    { 
        name: 'Settings', 
        label: 'Ayarlar', 
        icon: 'settings', 
        activeIcon: 'settings',
        color: '#10B981' 
    },
];

const TabButton = ({ tab, isFocused, onPress, index }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const bgScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: isFocused ? -8 : 0,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.spring(bgScale, {
                toValue: isFocused ? 1 : 0,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isFocused]);

    const handlePressIn = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressOut = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePress = useCallback(() => {
        onPress();
    }, [onPress]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.tabButton}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={tab.label}
        >
            <Animated.View
                style={[
                    styles.tabContent,
                    { transform: [{ scale: scaleAnim }, { translateY }] },
                    isSmallScreen && { paddingHorizontal: 4, minWidth: 50 }
                ]}
            >
                {/* Active Background Circle */}
                <Animated.View 
                    style={[
                        styles.activeBackground,
                        { 
                            backgroundColor: tab.color,
                            transform: [{ scale: bgScale }],
                            opacity: bgScale.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        }
                    ]} 
                />
                
                {/* Icon */}
                <Animated.View style={[
                    styles.iconContainer,
                    isFocused && styles.iconContainerActive,
                    isSmallScreen && { width: 36, height: 36, borderRadius: 18 }
                ]}>
                    <Feather 
                        name={isFocused ? tab.activeIcon : tab.icon} 
                        size={isSmallScreen ? 18 : 22} 
                        color={isFocused ? '#FFFFFF' : '#64748B'} 
                        style={isFocused && styles.iconActive}
                    />
                </Animated.View>

                {/* Label with animation */}
                <Animated.Text
                    style={[
                        styles.label,
                        { 
                            color: isFocused ? tab.color : '#64748B',
                            opacity: isFocused ? 1 : 0.7,
                            transform: [{
                                translateY: isFocused ? 0 : 2
                            }]
                        },
                        isFocused && styles.labelActive,
                        isSmallScreen && { fontSize: 9, marginTop: 2 }
                    ]}
                    numberOfLines={1}
                >
                    {tab.label}
                </Animated.Text>

                {/* Active Indicator Dot */}
                {isFocused && (
                    <Animated.View 
                        style={[
                            styles.activeDot,
                            { backgroundColor: tab.color }
                        ]} 
                    />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

// Central Action Button
const CenterButton = ({ onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        onPress();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.centerButton}
                activeOpacity={1}
            >
                <View style={styles.centerButtonInner}>
                    <Feather name="plus" size={28} color="#FFFFFF" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function CustomTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 50,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleCenterPress = () => {
        navigation.navigate('Editor');
    };

    return (
        <Animated.View 
            style={[
                styles.container, 
                { 
                    paddingBottom: Math.max(insets.bottom, isSmallScreen ? 8 : 12),
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim
                }
            ]}
        >
            {/* Glassmorphism Background */}
            <View style={styles.tabBarContainer}>
                <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.tabBar}>
                    {state.routes.map((route, index) => {
                        // Skip middle position for center button
                        if (index === 2) {
                            return (
                                <View key="center" style={styles.centerPlaceholder}>
                                    <CenterButton onPress={handleCenterPress} />
                                </View>
                            );
                        }

                        const isFocused = state.index === index;
                        const tab = tabs.find((t) => t.name === route.name) || tabs[0];

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TabButton
                                key={route.key}
                                tab={tab}
                                isFocused={isFocused}
                                onPress={onPress}
                                index={index}
                            />
                        );
                    })}
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING.md,
    },
    tabBarContainer: {
        borderRadius: BORDER_RADIUS.xxl,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
            },
            android: {
                elevation: 16,
            },
        }),
    },
    tabBar: {
        flexDirection: 'row',
        paddingVertical: isSmallScreen ? SPACING.xs : SPACING.sm,
        paddingHorizontal: isSmallScreen ? 4 : SPACING.sm,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: isSmallScreen ? 4 : SPACING.sm,
        paddingVertical: isSmallScreen ? 2 : SPACING.xs,
        position: 'relative',
        minWidth: isSmallScreen ? 50 : 64,
    },
    activeBackground: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        top: -4,
    },
    iconContainer: {
        width: isSmallScreen ? 36 : 44,
        height: isSmallScreen ? 36 : 44,
        borderRadius: isSmallScreen ? 18 : 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(241, 245, 249, 0.8)',
        zIndex: 1,
    },
    iconContainerActive: {
        backgroundColor: 'transparent',
    },
    iconActive: {
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: -0.2,
        marginTop: 4,
    },
    labelActive: {
        fontWeight: '700',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    },
    centerPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerButton: {
        width: isSmallScreen ? 48 : 56,
        height: isSmallScreen ? 48 : 56,
        borderRadius: isSmallScreen ? 24 : 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: isSmallScreen ? -24 : -28,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: isSmallScreen ? 4 : 6 },
                shadowOpacity: isSmallScreen ? 0.3 : 0.4,
                shadowRadius: isSmallScreen ? 8 : 12,
            },
            android: {
                elevation: isSmallScreen ? 6 : 8,
            },
        }),
        borderWidth: isSmallScreen ? 3 : 4,
        borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    centerButtonInner: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
