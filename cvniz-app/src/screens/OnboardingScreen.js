import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions,
    Animated, StatusBar, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, BORDER_RADIUS, scale, moderateScale, isSmallScreen, isIOS } from '../constants';

const { width, height } = Dimensions.get('window');

// Responsive helpers
const rs = (size) => isSmallScreen ? scale(size * 0.9) : scale(size);

const SLIDES = [
    {
        id: 1,
        iconName: 'file-text',
        iconType: 'feather',
        title: 'Profesyonel CV\'ler',
        subtitle: 'Dakikalar içinde etkileyici CV\'ler oluşturun',
        description: 'Modern şablonlar ve AI destekli içerik önerileri ile öne çıkan CV\'ler hazırlayın.',
        colors: ['#6366F1', '#8B5CF6'],
    },
    {
        id: 2,
        iconName: 'target',
        iconType: 'feather',
        title: 'ATS Uyumlu',
        subtitle: 'İşe alım sistemlerini geçin',
        description: 'CV\'nizi analiz edin ve ATS sistemlerinden yüksek skor alın.',
        colors: ['#10B981', '#059669'],
    },
    {
        id: 3,
        iconName: 'globe',
        iconType: 'feather',
        title: 'Her Yerde Erişin',
        subtitle: 'PC\'de başlayın, mobilde devam edin',
        description: 'Tüm cihazlarınızda senkronize çalışın. CV\'leriniz her zaman yanınızda.',
        colors: ['#F59E0B', '#D97706'],
    },
    {
        id: 4,
        iconName: 'rocket',
        iconType: 'material',
        title: 'Hayalinizdeki İşe',
        subtitle: 'Kariyerinizi bir üst seviyeye taşıyın',
        description: 'Ön yazı, iş arama, CV paylaşımı ve daha fazlası tek uygulamada.',
        colors: ['#EC4899', '#DB2777'],
    },
];

export default function OnboardingScreen({ navigation, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slideRef = useRef(null);

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (currentIndex < SLIDES.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        completeOnboarding();
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'true');
        } catch (error) {
            console.log('Error saving onboarding status:', error);
        }
        if (onComplete) {
            onComplete();
        } else {
            navigation.replace('Auth');
        }
    };

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentIndex(index); }}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.dot,
                                isActive ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const currentSlide = SLIDES[currentIndex];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <LinearGradient
                colors={currentSlide.colors}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Skip Button */}
                <TouchableOpacity style={[styles.skipBtn, isSmallScreen && { top: isIOS ? 50 : 40, paddingHorizontal: 12, paddingVertical: 6 }]} onPress={handleSkip}>
                    <Feather name="skip-forward" size={isSmallScreen ? 14 : 16} color="rgba(255,255,255,0.9)" style={{ marginRight: 6 }} />
                    <Text style={[styles.skipText, isSmallScreen && { fontSize: 12 }]}>Atla</Text>
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    {/* Decorative Circles */}
                    <View style={styles.decorCircle1} />
                    <View style={styles.decorCircle2} />
                    <View style={styles.decorCircle3} />

                    {/* Modern Icon */}
                    <MotiView
                        key={currentSlide.id}
                        from={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        style={[styles.iconContainer, isSmallScreen && { marginBottom: 24 }]}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                            style={[styles.iconInner, isSmallScreen && { width: 110, height: 110, borderRadius: 55 }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            {currentSlide.iconType === 'material' ? (
                                <MaterialCommunityIcons name={currentSlide.iconName} size={isSmallScreen ? 50 : 64} color="#FFF" />
                            ) : (
                                <Feather name={currentSlide.iconName} size={isSmallScreen ? 44 : 56} color="#FFF" />
                            )}
                        </LinearGradient>
                    </MotiView>

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, isSmallScreen && { fontSize: 26, marginBottom: 8 }]}>{currentSlide.title}</Text>
                        <Text style={[styles.subtitle, isSmallScreen && { fontSize: 16, marginBottom: 12 }]}>{currentSlide.subtitle}</Text>
                        <Text style={[styles.description, isSmallScreen && { fontSize: 13, lineHeight: 18 }]}>{currentSlide.description}</Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={[styles.bottomSection, isSmallScreen && { paddingHorizontal: 24, paddingBottom: isIOS ? 40 : 20 }]}>
                    {renderDots()}

                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={handleNext}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#FFFFFF', '#F1F5F9']}
                            style={styles.nextBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.nextBtnText}>
                                {currentIndex === SLIDES.length - 1 ? 'Başlayın' : 'Devam'}
                            </Text>
                            <Feather name="arrow-right" size={20} color={currentSlide.colors[0]} />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); completeOnboarding(); }}>
                            <View style={styles.loginLinkContainer}>
                                <Feather name="log-in" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                <Text style={styles.loginLink}>Giriş Yapın</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    skipBtn: {
        position: 'absolute',
        top: isSmallScreen ? (Platform.OS === 'ios' ? 50 : 40) : (Platform.OS === 'ios' ? 60 : 45),
        right: 20,
        zIndex: 10,
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: isSmallScreen ? 6 : 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    skipText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    // Decorative
    decorCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    decorCircle2: {
        position: 'absolute',
        top: 100,
        left: -80,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    decorCircle3: {
        position: 'absolute',
        bottom: 50,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    // Content
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: isSmallScreen ? 30 : 40,
        paddingTop: isSmallScreen ? 60 : 80,
    },
    iconContainer: {
        marginBottom: 40,
    },
    iconInner: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },

    // Text
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: moderateScale(32),
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: moderateScale(15),
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: isSmallScreen ? 20 : 22,
    },

    // Bottom Section
    bottomSection: {
        paddingHorizontal: isSmallScreen ? 24 : 40,
        paddingBottom: Platform.OS === 'ios' ? (isSmallScreen ? 40 : 50) : (isSmallScreen ? 20 : 30),
    },

    // Dots
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    dot: {
        marginHorizontal: 4,
    },
    dotActive: {
        width: 32,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    dotInactive: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },

    // Next Button
    nextBtn: {
        marginBottom: isSmallScreen ? 16 : 24,
    },
    nextBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: isSmallScreen ? 14 : 18,
        paddingHorizontal: isSmallScreen ? 24 : 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        gap: 8,
    },
    nextBtnText: {
        fontSize: 18,
        fontWeight: '700',
    },

    // Login
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
});
