import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
    Alert, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
    const { register } = useAuth();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert('Uyarı', 'Adınızı girin');
            nameRef.current?.focus();
            return;
        }
        if (!email.trim()) {
            Alert.alert('Uyarı', 'E-posta adresinizi girin');
            emailRef.current?.focus();
            return;
        }
        if (!password || password.length < 6) {
            Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalı');
            passwordRef.current?.focus();
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Uyarı', 'Şifreler eşleşmiyor');
            confirmPasswordRef.current?.focus();
            return;
        }
        if (!acceptedTerms) {
            Alert.alert('Uyarı', 'Kullanım koşullarını kabul etmelisiniz');
            return;
        }

        setLoading(true);
        const result = await register(name.trim(), email.trim(), password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Kayıt Başarısız', result.error || 'Bir hata oluştu');
        }
    };

    const getPasswordStrength = () => {
        if (!password) return { level: 0, text: '', color: '#E2E8F0' };
        if (password.length < 6) return { level: 1, text: 'Zayıf', color: '#EF4444' };
        if (password.length < 8) return { level: 2, text: 'Orta', color: '#F59E0B' };
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { level: 4, text: 'Güçlü', color: '#10B981' };
        }
        return { level: 3, text: 'İyi', color: '#6366F1' };
    };

    const passwordStrength = getPasswordStrength();

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
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Hesap Oluştur</Text>
                        <Text style={styles.headerSubtitle}>CVniz'a ücretsiz kaydolun</Text>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        {/* Name Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Ad Soyad</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedInput === 'name' && styles.inputContainerFocused
                            ]}>
                                <Text style={styles.inputIcon}>👤</Text>
                                <TextInput
                                    ref={nameRef}
                                    style={styles.input}
                                    placeholder="Adınız Soyadınız"
                                    placeholderTextColor="#94A3B8"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    onFocus={() => setFocusedInput('name')}
                                    onBlur={() => setFocusedInput(null)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => emailRef.current?.focus()}
                                />
                            </View>
                        </View>

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
                                    placeholder="En az 6 karakter"
                                    placeholderTextColor="#94A3B8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setFocusedInput('password')}
                                    onBlur={() => setFocusedInput(null)}
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeBtn}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Password Strength */}
                            {password.length > 0 && (
                                <View style={styles.strengthContainer}>
                                    <View style={styles.strengthBars}>
                                        {[1, 2, 3, 4].map(level => (
                                            <View 
                                                key={level}
                                                style={[
                                                    styles.strengthBar,
                                                    { backgroundColor: level <= passwordStrength.level ? passwordStrength.color : '#E2E8F0' }
                                                ]} 
                                            />
                                        ))}
                                    </View>
                                    <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                                        {passwordStrength.text}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Şifre Tekrar</Text>
                            <View style={[
                                styles.inputContainer,
                                focusedInput === 'confirmPassword' && styles.inputContainerFocused,
                                confirmPassword && password !== confirmPassword && styles.inputContainerError
                            ]}>
                                <Text style={styles.inputIcon}>🔐</Text>
                                <TextInput
                                    ref={confirmPasswordRef}
                                    style={styles.input}
                                    placeholder="Şifrenizi tekrar girin"
                                    placeholderTextColor="#94A3B8"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setFocusedInput('confirmPassword')}
                                    onBlur={() => setFocusedInput(null)}
                                    returnKeyType="done"
                                    onSubmitEditing={handleRegister}
                                />
                                {confirmPassword && password === confirmPassword && (
                                    <Text style={styles.checkIcon}>✓</Text>
                                )}
                            </View>
                        </View>

                        {/* Terms Checkbox */}
                        <TouchableOpacity 
                            style={styles.termsRow}
                            onPress={() => setAcceptedTerms(!acceptedTerms)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                                {acceptedTerms && <Text style={styles.checkboxIcon}>✓</Text>}
                            </View>
                            <Text style={styles.termsText}>
                                <Text style={styles.termsLink}>Kullanım Koşulları</Text>
                                {' '}ve{' '}
                                <Text style={styles.termsLink}>Gizlilik Politikası</Text>
                                'nı kabul ediyorum
                            </Text>
                        </TouchableOpacity>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={[styles.registerBtn, !acceptedTerms && styles.registerBtnDisabled]}
                            onPress={handleRegister}
                            disabled={loading || !acceptedTerms}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={acceptedTerms ? ['#6366F1', '#8B5CF6'] : ['#CBD5E1', '#94A3B8']}
                                style={styles.registerGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.registerText}>Kayıt Ol</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Login Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footerLink}>Giriş Yapın</Text>
                        </TouchableOpacity>
                    </View>
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
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255,255,255,0.08)',
        top: -80,
        right: -80,
    },
    circle2: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.05)',
        bottom: 150,
        left: -60,
    },

    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 70 : 50,
        paddingBottom: 40,
    },

    // Header
    header: {
        marginBottom: 24,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    backIcon: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: '300',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
    },

    // Form Card
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.15,
        shadowRadius: 32,
        elevation: 16,
    },

    // Input
    inputWrapper: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        paddingHorizontal: 14,
    },
    inputContainerFocused: {
        borderColor: '#6366F1',
        backgroundColor: '#FFF',
    },
    inputContainerError: {
        borderColor: '#EF4444',
    },
    inputIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 52,
        fontSize: 16,
        color: '#0F172A',
    },
    eyeBtn: {
        padding: 8,
    },
    eyeIcon: {
        fontSize: 18,
    },
    checkIcon: {
        fontSize: 18,
        color: '#10B981',
        fontWeight: '700',
    },

    // Password Strength
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 12,
    },
    strengthBars: {
        flexDirection: 'row',
        gap: 4,
    },
    strengthBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Terms
    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
        marginTop: 8,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    checkboxIcon: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
    },
    termsLink: {
        color: '#6366F1',
        fontWeight: '600',
    },

    // Register Button
    registerBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    registerBtnDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    registerGradient: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 28,
    },
    footerText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
    },
    footerLink: {
        fontSize: 15,
        color: '#FFF',
        fontWeight: '700',
    },
});

