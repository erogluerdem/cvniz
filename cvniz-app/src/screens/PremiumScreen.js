import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, Alert, Dimensions, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';

const { width } = Dimensions.get('window');

// ============ MODERN FEATURE ITEM ============
function FeatureItem({ iconName, text, included, colors }) {
    return (
        <View style={styles.featureItem}>
            {included ? (
                <View style={[styles.featureIconBox, { backgroundColor: `${COLORS.success}20` }]}>
                    <Feather name="check" size={16} color={COLORS.success} />
                </View>
            ) : (
                <View style={[styles.featureIconBox, { backgroundColor: `${COLORS.error}20` }]}>
                    <Feather name="x" size={16} color={COLORS.error} />
                </View>
            )}
            <Text style={[
                styles.featureText,
                { color: included ? colors.text : colors.textSecondary }
            ]}>
                {text}
            </Text>
        </View>
    );
}

// ============ MODERN PLAN CARD ============
function PlanCard({ plan, isSelected, onSelect, colors }) {
    const isPopular = plan.popular;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(plan.id);
    };

    return (
        <TouchableOpacity
            style={[
                styles.planCard,
                { backgroundColor: colors.surface },
                isSelected && styles.planCardSelected,
                SHADOW.md
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            {isPopular && (
                <LinearGradient
                    colors={COLORS.gradients.premium}
                    style={styles.popularBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Feather name="star" size={12} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.popularText}>En Popüler</Text>
                </LinearGradient>
            )}

            <View style={styles.planHeader}>
                <View style={[styles.planIconBox, { backgroundColor: plan.iconColor + '20' }]}>
                    <Feather name={plan.iconName} size={24} color={plan.iconColor} />
                </View>
                <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
            </View>

            <View style={styles.priceContainer}>
                <Text style={[styles.priceOld, { color: colors.textSecondary }]}>
                    {plan.oldPrice}
                </Text>
                <Text style={[styles.price, { color: COLORS.primary }]}>
                    {plan.price}
                </Text>
                <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>
                    /{plan.period}
                </Text>
            </View>

            {plan.save && (
                <View style={[styles.saveBadge, { backgroundColor: '#10B981' + '20' }]}>
                    <Text style={[styles.saveText, { color: '#10B981' }]}>{plan.save}</Text>
                </View>
            )}

            <View style={styles.planFeatures}>
                {plan.features.map((feature, i) => (
                    <View key={i} style={styles.planFeatureItem}>
                        <Feather name="check" size={14} color={COLORS.success} />
                        <Text style={[styles.planFeatureText, { color: colors.textSecondary }]}>
                            {feature}
                        </Text>
                    </View>
                ))}
            </View>

            {isSelected && (
                <View style={styles.selectedIndicator}>
                    <LinearGradient
                        colors={COLORS.gradients.primary}
                        style={styles.selectedDot}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}

// ============ MAIN COMPONENT ============
export default function PremiumScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState('yearly');
    const [loading, setLoading] = useState(false);

    const isPremium = user?.isPremium || user?.role === 'admin';

    const plans = [
        {
            id: 'monthly',
            name: 'Aylık',
            iconName: 'calendar',
            iconColor: '#6366F1',
            price: '₺99',
            oldPrice: '₺149',
            period: 'ay',
            popular: false,
            features: ['Tüm şablonlar', 'AI araçları', 'Sınırsız CV'],
        },
        {
            id: 'yearly',
            name: 'Yıllık',
            iconName: 'star',
            iconColor: '#F59E0B',
            price: '₺599',
            oldPrice: '₺1788',
            period: 'yıl',
            popular: true,
            save: '%66 Tasarruf',
            features: ['Tüm şablonlar', 'AI araçları', 'Sınırsız CV', 'Öncelikli destek'],
        },
        {
            id: 'lifetime',
            name: 'Ömür Boyu',
            iconName: 'crown',
            iconColor: '#8B5CF6',
            price: '₺999',
            oldPrice: '₺2999',
            period: 'tek seferlik',
            popular: false,
            save: '%67 Tasarruf',
            features: ['Tüm şablonlar', 'AI araçları', 'Sınırsız CV', 'Öncelikli destek', 'Gelecek güncellemeler'],
        },
    ];

    const allFeatures = [
        { iconName: 'layout', text: '106+ Premium Şablon', free: false },
        { iconName: 'cpu', text: 'AI ile CV Yazımı', free: false },
        { iconName: 'bar-chart-2', text: 'ATS Uyumluluk Analizi', free: false },
        { iconName: 'globe', text: '25+ Dil Desteği', free: false },
        { iconName: 'edit-3', text: 'AI Ön Yazı Oluşturucu', free: false },
        { iconName: 'briefcase', text: 'İş Eşleştirme', free: false },
        { iconName: 'file-plus', text: 'Sınırsız CV Oluşturma', free: false },
        { iconName: 'download', text: 'PDF/Word İndirme', free: true },
        { iconName: 'share-2', text: 'Online CV Paylaşımı', free: false },
        { iconName: 'headphones', text: 'Öncelikli Destek', free: false },
    ];

    const handlePurchase = async () => {
        setLoading(true);
        // Simüle edilmiş satın alma
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
            'Tebrikler!',
            'Premium üyeliğiniz aktif edildi. Artık tüm özelliklere erişebilirsiniz!',
            [{ text: 'Harika!', onPress: () => navigation.goBack() }]
        );
    };

    if (isPremium) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.header}>
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.goBack(); }} style={styles.backBtn}>
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Premium</Text>
                    <View style={{ width: 60 }} />
                </LinearGradient>

                <View style={styles.alreadyPremium}>
                    <LinearGradient colors={COLORS.gradients.premium} style={styles.premiumBadgeLarge}>
                        <MaterialCommunityIcons name="crown" size={48} color="#FFF" />
                    </LinearGradient>
                    <Text style={[styles.premiumTitle, { color: colors.text }]}>Premium Üyesiniz!</Text>
                    <Text style={[styles.premiumDesc, { color: colors.textSecondary }]}>
                        Tüm premium özelliklere erişiminiz var.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.header}>
                <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.goBack(); }} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Premium</Text>
                <View style={{ width: 60 }} />
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <LinearGradient
                    colors={COLORS.gradients.premium}
                    style={styles.hero}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <MaterialCommunityIcons name="crown" size={64} color="#FFF" />
                    <Text style={styles.heroTitle}>CVniz Premium</Text>
                    <Text style={styles.heroSubtitle}>
                        Kariyerini bir üst seviyeye taşı
                    </Text>
                </LinearGradient>

                {/* Plans */}
                <View style={styles.plansSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Plan Seçin</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.plansScroll}
                    >
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isSelected={selectedPlan === plan.id}
                                onSelect={setSelectedPlan}
                                colors={colors}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Features */}
                <View style={styles.featuresSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Premium Özellikleri
                    </Text>
                    <View style={[styles.featuresCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
                        {allFeatures.map((feature, i) => (
                            <FeatureItem
                                key={i}
                                iconName={feature.iconName}
                                text={feature.text}
                                included={true}
                                colors={colors}
                            />
                        ))}
                    </View>
                </View>

                {/* Guarantee */}
                <View style={[styles.guaranteeCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
                    <View style={styles.guaranteeIconBox}>
                        <Feather name="shield" size={24} color={COLORS.success} />
                    </View>
                    <View style={styles.guaranteeContent}>
                        <Text style={[styles.guaranteeTitle, { color: colors.text }]}>
                            7 Gün Para İade Garantisi
                        </Text>
                        <Text style={[styles.guaranteeDesc, { color: colors.textSecondary }]}>
                            Memnun kalmazsan paranı iade ediyoruz
                        </Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Purchase Button */}
            <View style={[styles.purchaseContainer, { backgroundColor: colors.background }]}>
                <TouchableOpacity
                    onPress={handlePurchase}
                    disabled={loading}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={COLORS.gradients.premium}
                        style={styles.purchaseBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <View style={styles.purchaseBtnContent}>
                                <MaterialCommunityIcons name="crown" size={20} color="#FFF" />
                                <Text style={styles.purchaseBtnText}>Premium'a Yükselt</Text>
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={[styles.purchaseNote, { color: colors.textSecondary }]}>
                    İstediğin zaman iptal edebilirsin
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
    },
    backBtn: { padding: SPACING.sm },
    headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },

    // Content
    content: { flex: 1 },

    // Hero
    hero: {
        padding: SPACING.xl,
        alignItems: 'center',
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        borderRadius: BORDER_RADIUS.xxl,
    },
    heroTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: SPACING.xs },
    heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16 },

    // Plans
    plansSection: { marginTop: SPACING.xl },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: SPACING.md, paddingHorizontal: SPACING.md },
    plansScroll: { paddingHorizontal: SPACING.md },
    planCard: {
        width: width * 0.7,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xxl,
        marginRight: SPACING.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    planCardSelected: {
        borderColor: COLORS.primary,
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    popularText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    planIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    planName: { fontSize: 20, fontWeight: '700' },
    priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: SPACING.sm },
    priceOld: { fontSize: 14, textDecorationLine: 'line-through', marginRight: SPACING.xs },
    price: { fontSize: 32, fontWeight: '700' },
    pricePeriod: { fontSize: 14 },
    saveBadge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md },
    saveText: { fontSize: 12, fontWeight: '600' },
    planFeatures: { marginTop: SPACING.sm },
    planFeatureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
    planFeatureText: { marginLeft: SPACING.sm, fontSize: 13 },
    selectedIndicator: { position: 'absolute', top: SPACING.md, right: SPACING.md },
    selectedDot: { width: 24, height: 24, borderRadius: 12 },

    // Features
    featuresSection: { marginTop: SPACING.xl, paddingHorizontal: SPACING.md },
    featuresCard: { borderRadius: BORDER_RADIUS.xxl, padding: SPACING.lg },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    featureIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    featureText: { fontSize: 15 },

    // Guarantee
    guaranteeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SPACING.md,
        marginTop: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
    },
    guaranteeIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: `${COLORS.success}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    guaranteeContent: { flex: 1 },
    guaranteeTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    guaranteeDesc: { fontSize: 13 },

    // Purchase
    purchaseContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
    },
    purchaseBtn: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    purchaseBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    purchaseBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    purchaseNote: { textAlign: 'center', marginTop: SPACING.sm, fontSize: 12 },

    // Already Premium
    alreadyPremium: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
    premiumBadgeLarge: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
    premiumTitle: { fontSize: 24, fontWeight: '700', marginBottom: SPACING.sm },
    premiumDesc: { fontSize: 16, textAlign: 'center' },
});

