import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
    Alert, Animated, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0)).current;
    const formSlide = useRef(new Animated.Value(50)).current;

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 4,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                delay: 100,
                useNativeDriver: true,
            }),
            Animated.spring(formSlide, {
                toValue: 0,
                friction: 8,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Uyarı', 'E-posta adresinizi girin');
            emailRef.current?.focus();
            return;
        }
        if (!password) {
            Alert.alert('Uyarı', 'Şifrenizi girin');
            passwordRef.current?.focus();
            return;
        }

        setLoading(true);
        const result = await login(email.trim(), password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Giriş Başarısız', result.error || 'E-posta veya şifre hatalı');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
            'Şifremi Unuttum',
            'Şifre sıfırlama bağlantısı e-posta adresinize gönderilecek.',
            [
                { text: 'İptal', style: 'cancel' },
                { text: 'Gönder', onPress: () => Alert.alert('Başarılı', 'E-posta gönderildi!') }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
            
            {/* Background Gradient */}
            <LinearGradient
                colors={['#6366F1', '#8B5CF6', '#A855F7']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative Circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Animated.View style={[
                        styles.header,
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}>
                        <Animated.View style={[
                            styles.logoBox,
                            { transform: [{ scale: logoScale }] }
                        ]}>
                            <Text style={styles.logoText}>CV</Text>
                        </Animated.View>
                        <Text style={styles.appName}>CVniz</Text>
                        <Text style={styles.tagline}>Profesyonel CV'nizi dakikalar içinde oluşturun</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View style={[
                        styles.formCard,
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateY: formSlide }]
                        }
                    ]}>
                        <Text style={styles.formTitle}>Giriş Yap</Text>
                        <Text style={styles.formSubtitle}>Hesabınıza giriş yapın</Text>

                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>E-posta</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedInput === 'email' && styles.inputContainerFocused
                            ]}>
                                <Text style={styles.inputIcon}>📧</Text>
                                <TextInput
                                    ref={emailRef}
                                    style={styles.input}
                                    placeholder="ornek@email.com"
                                    placeholderTextColor="#94A3B8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Şifre</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedInput === 'password' && styles.inputContainerFocused
                            ]}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    ref={passwordRef}
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#94A3B8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeBtn}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity 
                            style={styles.forgotBtn}
                            onPress={handleForgotPassword}
                        >
                            <Text style={styles.forgotText}>Şifremi Unuttum</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={styles.loginGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.loginText}>Giriş Yap</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>veya</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login */}
                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Text style={styles.socialIcon}>🍎</Text>
                                <Text style={styles.socialText}>Apple</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Text style={styles.socialIcon}>G</Text>
                                <Text style={styles.socialText}>Google</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Register Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Hesabınız yok mu? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.footerLink}>Kayıt Olun</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms */}
                    <Text style={styles.termsText}>
                        Giriş yaparak{' '}
                        <Text style={styles.termsLink}>Kullanım Koşulları</Text>
                        {' '}ve{' '}
                        <Text style={styles.termsLink}>Gizlilik Politikası</Text>
                        'nı kabul etmiş olursunuz.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6366F1',
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    // Decorative Circles
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.08)',
        top: -100,
        right: -100,
    },
    circle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: 100,
        left: -80,
    },
    circle3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.06)',
        bottom: 100,
        right: -50,
    },

    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 40,
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoBox: {
        width: 88,
        height: 88,
        borderRadius: 28,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#6366F1',
        letterSpacing: -1,
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },

    // Form Card
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 28,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.18,
                shadowRadius: 40,
            },
            android: {
                elevation: 20,
            },
        }),
    },
    formTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    formSubtitle: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 28,
        fontWeight: '500',
    },

    // Input
    inputWrapper: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 10,
        letterSpacing: -0.2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
    },
    inputContainerFocused: {
        borderColor: '#6366F1',
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    inputIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '500',
    },
    eyeBtn: {
        padding: 10,
    },
    eyeIcon: {
        fontSize: 20,
    },

    // Forgot Password
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 28,
        paddingVertical: 4,
    },
    forgotText: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '700',
    },

    // Login Button
    loginBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    loginGradient: {
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },

    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 13,
        color: '#94A3B8',
    },

    // Social Login
    socialRow: {
        flexDirection: 'row',
        gap: 14,
    },
    socialBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        paddingVertical: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        gap: 10,
    },
    socialIcon: {
        fontSize: 20,
        fontWeight: '800',
        color: '#334155',
    },
    socialText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
    },
    footerLink: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '800',
    },

    // Terms
    termsText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 20,
        fontWeight: '500',
    },
    termsLink: {
        color: 'rgba(255,255,255,0.95)',
        fontWeight: '700',
    },
});

