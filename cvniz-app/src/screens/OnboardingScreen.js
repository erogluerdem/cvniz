import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Dimensions,
    Animated, StatusBar, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        icon: '📄',
        title: 'Profesyonel CV\'ler',
        subtitle: 'Dakikalar içinde etkileyici CV\'ler oluşturun',
        description: 'Modern şablonlar ve AI destekli içerik önerileri ile öne çıkan CV\'ler hazırlayın.',
        color: ['#6366F1', '#8B5CF6'],
    },
    {
        id: 2,
        icon: '🎯',
        title: 'ATS Uyumlu',
        subtitle: 'İşe alım sistemlerini geçin',
        description: 'CV\'nizi analiz edin ve ATS sistemlerinden yüksek skor alın.',
        color: ['#10B981', '#059669'],
    },
    {
        id: 3,
        icon: '🌐',
        title: 'Her Yerde Erişin',
        subtitle: 'PC\'de başlayın, mobilde devam edin',
        description: 'Tüm cihazlarınızda senkronize çalışın. CV\'leriniz her zaman yanınızda.',
        color: ['#F59E0B', '#D97706'],
    },
    {
        id: 4,
        icon: '🚀',
        title: 'Hayalinizdeki İşe',
        subtitle: 'Kariyerinizi bir üst seviyeye taşıyın',
        description: 'Ön yazı, iş arama, CV paylaşımı ve daha fazlası tek uygulamada.',
        color: ['#EC4899', '#DB2777'],
    },
];

export default function OnboardingScreen({ navigation, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slideRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
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
                        onPress={() => setCurrentIndex(index)}
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
                colors={currentSlide.color}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Skip Button */}
                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                    <Text style={styles.skipText}>Atla</Text>
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    {/* Decorative Circles */}
                    <View style={styles.decorCircle1} />
                    <View style={styles.decorCircle2} />
                    <View style={styles.decorCircle3} />

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconInner}>
                            <Text style={styles.icon}>{currentSlide.icon}</Text>
                        </View>
                    </View>

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{currentSlide.title}</Text>
                        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
                        <Text style={styles.description}>{currentSlide.description}</Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {renderDots()}

                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <View style={styles.nextBtnInner}>
                            <Text style={styles.nextBtnText}>
                                {currentIndex === SLIDES.length - 1 ? 'Başlayın' : 'Devam'}
                            </Text>
                            <Text style={styles.nextBtnArrow}>→</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                        <TouchableOpacity onPress={completeOnboarding}>
                            <Text style={styles.loginLink}>Giriş Yapın</Text>
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
        top: Platform.OS === 'ios' ? 60 : 45,
        right: 20,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
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
        paddingHorizontal: 40,
        paddingTop: 80,
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
    icon: {
        fontSize: 70,
    },

    // Text
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Bottom Section
    bottomSection: {
        paddingHorizontal: 40,
        paddingBottom: Platform.OS === 'ios' ? 50 : 30,
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
        marginBottom: 24,
    },
    nextBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    nextBtnText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    nextBtnArrow: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0F172A',
        marginLeft: 8,
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
    loginLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textDecorationLine: 'underline',
    },
});
