import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
    { name: 'Dashboard', label: "CV'lerim", icon: '📄', color: '#6366F1' },
    { name: 'Templates', label: 'Şablonlar', icon: '🎨', color: '#8B5CF6' },
    { name: 'Profile', label: 'Profil', icon: '👤', color: '#EC4899' },
    { name: 'Settings', label: 'Ayarlar', icon: '⚙️', color: '#10B981' },
];

const TabButton = ({ tab, isFocused, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const bgOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: isFocused ? 1.02 : 1,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.timing(bgOpacity, {
                toValue: isFocused ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isFocused]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: isFocused ? 1.02 : 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.tabButton}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    styles.tabContent,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                {/* Background pill for active state */}
                <Animated.View 
                    style={[
                        styles.activePill,
                        { 
                            backgroundColor: tab.color + '15',
                            opacity: bgOpacity,
                        }
                    ]} 
                />
                
                {/* Icon with background */}
                <View style={[
                    styles.iconContainer,
                    isFocused && { backgroundColor: tab.color }
                ]}>
                    <Text style={styles.icon}>{tab.icon}</Text>
                </View>

                {/* Label */}
                <Text
                    style={[
                        styles.label,
                        { color: isFocused ? tab.color : '#64748B' },
                        isFocused && styles.labelActive,
                    ]}
                    numberOfLines={1}
                >
                    {tab.label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function CustomTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(80)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            friction: 8,
            tension: 50,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View 
            style={[
                styles.container, 
                { 
                    paddingBottom: Math.max(insets.bottom, 8),
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
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
                        />
                    );
                })}
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
        paddingHorizontal: 16,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
        }),
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 16,
        position: 'relative',
        minWidth: 72,
    },
    activePill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        marginBottom: 4,
    },
    icon: {
        fontSize: 18,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    labelActive: {
        fontWeight: '700',
    },
});
