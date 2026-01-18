import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, TextInput, Alert, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';

// Sectors
const SECTORS = [
    { id: 'yazilim', name: 'Yazılım / IT', icon: '💻' },
    { id: 'finans', name: 'Finans', icon: '💰' },
    { id: 'pazarlama', name: 'Pazarlama', icon: '📢' },
    { id: 'uretim', name: 'Üretim', icon: '🏭' },
    { id: 'insan_kaynaklari', name: 'İnsan Kaynakları', icon: '👥' },
    { id: 'satis', name: 'Satış', icon: '🎯' },
    { id: 'saglik', name: 'Sağlık', icon: '🏥' },
    { id: 'egitim', name: 'Eğitim', icon: '📚' },
];

// Locations
const LOCATIONS = [
    { id: 'istanbul', name: 'İstanbul', multiplier: 1.2 },
    { id: 'ankara', name: 'Ankara', multiplier: 1.0 },
    { id: 'izmir', name: 'İzmir', multiplier: 0.95 },
    { id: 'bursa', name: 'Bursa', multiplier: 0.9 },
    { id: 'antalya', name: 'Antalya', multiplier: 0.85 },
    { id: 'remote', name: 'Remote', multiplier: 1.1 },
];

// Experience levels
const EXPERIENCE_LEVELS = [
    { id: 'junior', name: 'Junior (0-2 yıl)', range: [25000, 45000] },
    { id: 'mid', name: 'Mid-Level (2-5 yıl)', range: [45000, 75000] },
    { id: 'senior', name: 'Senior (5-10 yıl)', range: [75000, 120000] },
    { id: 'lead', name: 'Lead/Manager (10+ yıl)', range: [100000, 180000] },
];

// Company sizes
const COMPANY_SIZES = [
    { id: 'startup', name: 'Startup', icon: '🚀', multiplier: 0.9 },
    { id: 'kucuk', name: 'Küçük', icon: '🏢', multiplier: 0.95 },
    { id: 'orta', name: 'Orta', icon: '🏛️', multiplier: 1.0 },
    { id: 'buyuk', name: 'Büyük', icon: '🏰', multiplier: 1.15 },
    { id: 'cokuluslu', name: 'Çok Uluslu', icon: '🌍', multiplier: 1.3 },
];

export default function SalaryScreen({ navigation }) {
    const { user } = useAuth();
    const { cvs, selectedCV } = useCV();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const [step, setStep] = useState('select'); // select, result
    const [sector, setSector] = useState(null);
    const [location, setLocation] = useState(null);
    const [experience, setExperience] = useState(null);
    const [companySize, setCompanySize] = useState(null);
    const [customTitle, setCustomTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const cv = cvs?.find(c => c.id === selectedCV) || cvs?.[0];

    const handleAnalyze = async () => {
        if (!sector || !location || !experience) {
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Calculate salary range
        const expLevel = EXPERIENCE_LEVELS.find(e => e.id === experience);
        const loc = LOCATIONS.find(l => l.id === location);
        const company = COMPANY_SIZES.find(c => c.id === companySize) || { multiplier: 1 };

        const baseMin = expLevel.range[0];
        const baseMax = expLevel.range[1];

        const adjustedMin = Math.round(baseMin * loc.multiplier * company.multiplier);
        const adjustedMax = Math.round(baseMax * loc.multiplier * company.multiplier);
        const median = Math.round((adjustedMin + adjustedMax) / 2);

        // Calculate percentile (mock)
        const percentile = Math.floor(Math.random() * 30) + 50;

        setResult({
            title: customTitle || cv?.data?.personalInfo?.title || 'Profesyonel',
            sector: SECTORS.find(s => s.id === sector),
            location: loc,
            experience: expLevel,
            companySize: company,
            salary: {
                min: adjustedMin,
                max: adjustedMax,
                median: median,
                percentile: percentile,
            },
            factors: [
                { name: 'Lokasyon', impact: loc.multiplier > 1 ? '+' : '-', value: `${Math.round((loc.multiplier - 1) * 100)}%` },
                { name: 'Şirket Büyüklüğü', impact: company.multiplier > 1 ? '+' : '-', value: `${Math.round((company.multiplier - 1) * 100)}%` },
                { name: 'Deneyim', impact: '+', value: expLevel.name.split(' ')[0] },
            ],
            tips: [
                '💡 Maaş pazarlığında ilk teklifinizi %15 yüksek tutun',
                '💡 Yan hakları (sigorta, yemek, ulaşım) değerlendirin',
                '💡 Performans bonusu ve hisse opsiyonlarını sorun',
            ],
        });

        setIsLoading(false);
        setStep('result');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Select Step
    const renderSelectStep = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={styles.heroCard}>
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.heroGradient}
                >
                    <Text style={styles.heroIcon}>💰</Text>
                    <Text style={styles.heroTitle}>Maaş Karşılaştırma</Text>
                    <Text style={styles.heroSubtitle}>
                        Piyasa değerinizi öğrenin
                    </Text>
                </LinearGradient>
            </View>

            {/* Position */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>👤 Pozisyon</Text>
                <TextInput
                    style={styles.input}
                    placeholder={cv?.data?.personalInfo?.title || "Ör: Frontend Developer"}
                    placeholderTextColor="#94A3B8"
                    value={customTitle}
                    onChangeText={setCustomTitle}
                />
            </View>

            {/* Sector */}
            <Text style={styles.sectionTitle}>🏢 Sektör</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {SECTORS.map(s => (
                    <TouchableOpacity
                        key={s.id}
                        style={[styles.optionChip, sector === s.id && styles.optionChipActive]}
                        onPress={() => setSector(s.id)}
                    >
                        <Text style={styles.optionIcon}>{s.icon}</Text>
                        <Text style={[styles.optionText, sector === s.id && styles.optionTextActive]}>
                            {s.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Location */}
            <Text style={styles.sectionTitle}>📍 Lokasyon</Text>
            <View style={styles.optionsGrid}>
                {LOCATIONS.map(l => (
                    <TouchableOpacity
                        key={l.id}
                        style={[styles.gridOption, location === l.id && styles.gridOptionActive]}
                        onPress={() => setLocation(l.id)}
                    >
                        <Text style={[styles.gridOptionText, location === l.id && styles.gridOptionTextActive]}>
                            {l.name}
                        </Text>
                        {location === l.id && <Text style={styles.gridCheck}>✓</Text>}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Experience */}
            <Text style={styles.sectionTitle}>📊 Deneyim Seviyesi</Text>
            <View style={styles.experienceList}>
                {EXPERIENCE_LEVELS.map(e => (
                    <TouchableOpacity
                        key={e.id}
                        style={[styles.experienceOption, experience === e.id && styles.experienceOptionActive]}
                        onPress={() => setExperience(e.id)}
                    >
                        <View style={[styles.experienceRadio, experience === e.id && styles.experienceRadioActive]}>
                            {experience === e.id && <View style={styles.experienceRadioInner} />}
                        </View>
                        <Text style={styles.experienceText}>{e.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Company Size */}
            <Text style={styles.sectionTitle}>🏛️ Şirket Büyüklüğü</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {COMPANY_SIZES.map(c => (
                    <TouchableOpacity
                        key={c.id}
                        style={[styles.companyChip, companySize === c.id && styles.companyChipActive]}
                        onPress={() => setCompanySize(c.id)}
                    >
                        <Text style={styles.companyIcon}>{c.icon}</Text>
                        <Text style={[styles.companyText, companySize === c.id && styles.companyTextActive]}>
                            {c.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Analyze Button */}
            <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze}>
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.analyzeBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.analyzeBtnText}>💰 Maaş Hesapla</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    // Result Step
    const renderResultStep = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Result Header */}
            <View style={styles.resultHeader}>
                <Text style={styles.resultPosition}>{result.title}</Text>
                <Text style={styles.resultMeta}>
                    {result.sector?.icon} {result.sector?.name} • 📍 {result.location?.name}
                </Text>
            </View>

            {/* Salary Card */}
            <View style={styles.salaryCard}>
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.salaryGradient}
                >
                    <Text style={styles.salaryLabel}>Tahmini Maaş Aralığı</Text>
                    <View style={styles.salaryRange}>
                        <View style={styles.salaryBound}>
                            <Text style={styles.salaryBoundLabel}>Min</Text>
                            <Text style={styles.salaryBoundValue}>{formatCurrency(result.salary.min)}</Text>
                        </View>
                        <View style={styles.salaryMedian}>
                            <Text style={styles.salaryMedianLabel}>Medyan</Text>
                            <Text style={styles.salaryMedianValue}>{formatCurrency(result.salary.median)}</Text>
                        </View>
                        <View style={styles.salaryBound}>
                            <Text style={styles.salaryBoundLabel}>Max</Text>
                            <Text style={styles.salaryBoundValue}>{formatCurrency(result.salary.max)}</Text>
                        </View>
                    </View>

                    {/* Visual Range */}
                    <View style={styles.rangeBar}>
                        <View style={styles.rangeTrack}>
                            <View style={styles.rangeFill} />
                            <View style={styles.rangeMedian} />
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Percentile */}
            <View style={styles.percentileCard}>
                <View style={styles.percentileInfo}>
                    <Text style={styles.percentileLabel}>Piyasa Pozisyonu</Text>
                    <Text style={styles.percentileValue}>{result.salary.percentile}. yüzdelik</Text>
                </View>
                <View style={styles.percentileBar}>
                    <View style={[styles.percentileFill, { width: `${result.salary.percentile}%` }]} />
                    <View style={[styles.percentileMarker, { left: `${result.salary.percentile}%` }]} />
                </View>
                <Text style={styles.percentileDesc}>
                    Bu pozisyondaki çalışanların %{result.salary.percentile}'inden daha yüksek maaş alabilirsiniz.
                </Text>
            </View>

            {/* Factors */}
            <Text style={styles.sectionTitle}>📈 Etkileyen Faktörler</Text>
            <View style={styles.factorsCard}>
                {result.factors.map((factor, i) => (
                    <View key={i} style={styles.factorItem}>
                        <Text style={styles.factorName}>{factor.name}</Text>
                        <View style={[styles.factorBadge, { backgroundColor: factor.impact === '+' ? '#DCFCE7' : '#FEE2E2' }]}>
                            <Text style={[styles.factorValue, { color: factor.impact === '+' ? '#10B981' : '#EF4444' }]}>
                                {factor.impact}{factor.value}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Tips */}
            <Text style={styles.sectionTitle}>💡 Pazarlık İpuçları</Text>
            <View style={styles.tipsCard}>
                {result.tips.map((tip, i) => (
                    <Text key={i} style={styles.tipItem}>{tip}</Text>
                ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity 
                    style={styles.retryBtn} 
                    onPress={() => { setStep('select'); setResult(null); }}
                >
                    <Text style={styles.retryBtnText}>🔄 Yeniden Hesapla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtn}>
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6']}
                        style={styles.shareBtnGradient}
                    >
                        <Text style={styles.shareBtnText}>📤 Paylaş</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>💰 Maaş Benchmark</Text>
                    <Text style={styles.headerSubtitle}>
                        {step === 'select' ? 'Bilgilerinizi girin' : 'Sonuçlar'}
                    </Text>
                </View>
                {!isPremium && (
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                )}
            </View>

            {step === 'select' && renderSelectStep()}
            {step === 'result' && renderResultStep()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#F8FAFC',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    backIcon: {
        fontSize: 20,
        color: '#0F172A',
    },
    headerCenter: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    proBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: '#FEF3C7',
    },
    proBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#D97706',
    },

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },

    // Hero
    heroCard: {
        marginBottom: 24,
    },
    heroGradient: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    heroIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },

    // Input Section
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    // Section Title
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
        marginTop: 4,
    },

    // Horizontal Scroll
    horizontalScroll: {
        marginBottom: 16,
        marginLeft: -4,
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    optionChipActive: {
        backgroundColor: '#DCFCE7',
        borderColor: '#10B981',
    },
    optionIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    optionText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    optionTextActive: {
        color: '#10B981',
        fontWeight: '600',
    },

    // Options Grid
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    gridOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    gridOptionActive: {
        backgroundColor: '#DCFCE7',
        borderColor: '#10B981',
    },
    gridOptionText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    gridOptionTextActive: {
        color: '#10B981',
        fontWeight: '600',
    },
    gridCheck: {
        fontSize: 14,
        color: '#10B981',
        marginLeft: 6,
        fontWeight: '700',
    },

    // Experience List
    experienceList: {
        marginBottom: 16,
    },
    experienceOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    experienceOptionActive: {
        borderColor: '#10B981',
        backgroundColor: '#DCFCE7',
    },
    experienceRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    experienceRadioActive: {
        borderColor: '#10B981',
    },
    experienceRadioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#10B981',
    },
    experienceText: {
        fontSize: 14,
        color: '#0F172A',
    },

    // Company Chips
    companyChip: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    companyChipActive: {
        backgroundColor: '#DCFCE7',
        borderColor: '#10B981',
    },
    companyIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    companyText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    companyTextActive: {
        color: '#10B981',
        fontWeight: '600',
    },

    // Analyze Button
    analyzeBtn: {
        marginTop: 8,
        marginBottom: 20,
    },
    analyzeBtnGradient: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    analyzeBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Result Header
    resultHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resultPosition: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    resultMeta: {
        fontSize: 14,
        color: '#64748B',
    },

    // Salary Card
    salaryCard: {
        marginBottom: 20,
    },
    salaryGradient: {
        borderRadius: 20,
        padding: 24,
    },
    salaryLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 16,
    },
    salaryRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    salaryBound: {
        alignItems: 'center',
    },
    salaryBoundLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
    },
    salaryBoundValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    salaryMedian: {
        alignItems: 'center',
    },
    salaryMedianLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    salaryMedianValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    rangeBar: {
        height: 8,
    },
    rangeTrack: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        position: 'relative',
    },
    rangeFill: {
        position: 'absolute',
        left: '10%',
        right: '10%',
        top: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    rangeMedian: {
        position: 'absolute',
        left: '50%',
        top: -4,
        width: 4,
        height: 16,
        backgroundColor: '#FEF3C7',
        borderRadius: 2,
        marginLeft: -2,
    },

    // Percentile Card
    percentileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    percentileInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    percentileLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    percentileValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10B981',
    },
    percentileBar: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        marginBottom: 12,
        position: 'relative',
    },
    percentileFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 4,
    },
    percentileMarker: {
        position: 'absolute',
        top: -4,
        width: 4,
        height: 16,
        backgroundColor: '#0F172A',
        borderRadius: 2,
        marginLeft: -2,
    },
    percentileDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },

    // Factors Card
    factorsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    factorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    factorName: {
        fontSize: 14,
        color: '#0F172A',
    },
    factorBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    factorValue: {
        fontSize: 13,
        fontWeight: '600',
    },

    // Tips Card
    tipsCard: {
        backgroundColor: '#FEF3C7',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    tipItem: {
        fontSize: 14,
        color: '#92400E',
        marginBottom: 8,
        lineHeight: 20,
    },

    // Action Row
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    retryBtn: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    retryBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    shareBtn: {
        flex: 1,
    },
    shareBtnGradient: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    shareBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
