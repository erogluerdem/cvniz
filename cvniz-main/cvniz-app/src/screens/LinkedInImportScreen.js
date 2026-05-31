import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, Alert, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../context/AuthContext';

// Parse LinkedIn JSON data
const parseLinkedInData = (data) => {
    try {
        const parsed = {
            personal: {
                fullName: data.firstName && data.lastName
                    ? `${data.firstName} ${data.lastName}`
                    : data.profile?.firstName
                        ? `${data.profile.firstName} ${data.profile.lastName || ''}`
                        : '',
                title: data.headline || data.profile?.headline || '',
                email: data.emailAddress || data.email || '',
                phone: '',
                location: data.location?.name || data.geoLocation?.full || data.profile?.locationName || '',
                linkedin: data.publicProfileUrl || data.profile?.publicProfileUrl || '',
                website: data.websites?.[0]?.url || '',
                summary: data.summary || data.profile?.summary || ''
            },
            experience: [],
            education: [],
            skills: [],
            certifications: []
        };

        // Parse positions
        const positions = data.positions?.values || data.positions || data.profile?.positions || [];
        parsed.experience = positions.map(pos => ({
            company: pos.company?.name || pos.companyName || '',
            position: pos.title || '',
            startDate: pos.startDate ? `${pos.startDate.year}-${String(pos.startDate.month || 1).padStart(2, '0')}` : '',
            endDate: pos.isCurrent ? '' : (pos.endDate ? `${pos.endDate.year}-${String(pos.endDate.month || 1).padStart(2, '0')}` : ''),
            current: pos.isCurrent || false,
            description: pos.summary || pos.description || ''
        }));

        // Parse education
        const educations = data.educations?.values || data.educations || data.profile?.educations || [];
        parsed.education = educations.map(edu => ({
            school: edu.schoolName || edu.school?.name || '',
            degree: edu.degree || '',
            field: edu.fieldOfStudy || edu.field || '',
            startDate: edu.startDate?.year?.toString() || '',
            endDate: edu.endDate?.year?.toString() || ''
        }));

        // Parse skills
        const skills = data.skills?.values || data.skills || data.profile?.skills || [];
        parsed.skills = skills.map(skill => ({
            name: skill.skill?.name || skill.name || skill,
            level: 75
        }));

        // Parse certifications
        const certs = data.certifications?.values || data.certifications || data.profile?.certifications || [];
        parsed.certifications = certs.map(cert => ({
            name: cert.name || '',
            issuer: cert.authority || cert.issuer || '',
            date: cert.startDate?.year?.toString() || ''
        }));

        return parsed;
    } catch (err) {
        console.error('Parse error:', err);
        throw new Error('LinkedIn verileri ayrıştırılamadı');
    }
};

export default function LinkedInImportScreen({ navigation }) {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Instructions, 2: Upload, 3: Preview, 4: Success
    const [isLoading, setIsLoading] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            setIsLoading(true);
            setError(null);

            const file = result.assets[0];
            const response = await fetch(file.uri);
            const text = await response.text();
            const json = JSON.parse(text);

            const parsed = parseLinkedInData(json);
            setParsedData(parsed);
            setStep(3);
        } catch (err) {
            setError('Geçersiz JSON dosyası. LinkedIn export dosyanızı kontrol edin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = () => {
        if (!parsedData) return;
        // Here you would typically save to CV context
        Alert.alert(
            '✅ Başarılı',
            'LinkedIn verileriniz içe aktarıldı! Şimdi CV editöründe düzenleyebilirsiniz.',
            [{ text: 'Tamam', onPress: () => navigation.goBack() }]
        );
        setStep(4);
    };

    const countItems = () => {
        if (!parsedData) return { experience: 0, education: 0, skills: 0 };
        return {
            experience: parsedData.experience?.length || 0,
            education: parsedData.education?.length || 0,
            skills: parsedData.skills?.length || 0
        };
    };

    // Step 1: Instructions
    const renderInstructions = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroCard}>
                <LinearGradient
                    colors={['#0A66C2', '#0077B5']}
                    style={styles.heroGradient}
                >
                    <Text style={styles.heroIcon}>💼</Text>
                    <Text style={styles.heroTitle}>LinkedIn'den İçe Aktar</Text>
                    <Text style={styles.heroSubtitle}>
                        LinkedIn profilinizi JSON olarak içe aktarın ve saniyeler içinde CV'nizi oluşturun.
                    </Text>
                </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>📋 Adımlar</Text>

            {/* Step Cards */}
            <View style={styles.stepCard}>
                <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>LinkedIn Ayarlarına Git</Text>
                    <Text style={styles.stepDesc}>
                        LinkedIn → Ayarlar → Veri Gizliliği → Verilerin bir kopyasını al
                    </Text>
                </View>
            </View>

            <View style={styles.stepCard}>
                <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Arşivi İndir</Text>
                    <Text style={styles.stepDesc}>
                        "Daha büyük veri arşivi iste" seçeneğini seçin ve indirin.
                    </Text>
                </View>
            </View>

            <View style={styles.stepCard}>
                <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>JSON Dosyasını Yükle</Text>
                    <Text style={styles.stepDesc}>
                        Arşivden "Profile.json" dosyasını buraya yükleyin.
                    </Text>
                </View>
            </View>

            {/* Tips */}
            <View style={styles.tipCard}>
                <Text style={styles.tipIcon}>💡</Text>
                <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>İpucu</Text>
                    <Text style={styles.tipText}>
                        LinkedIn verileri genellikle 24 saat içinde hazır olur.
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.continueBtn} onPress={() => setStep(2)}>
                <LinearGradient
                    colors={['#0A66C2', '#0077B5']}
                    style={styles.continueBtnGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.continueBtnText}>Devam Et →</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    // Step 2: Upload
    const renderUpload = () => (
        <View style={styles.content}>
            <View style={styles.uploadArea}>
                <TouchableOpacity 
                    style={styles.uploadBox}
                    onPress={handlePickFile}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0A66C2" />
                    ) : (
                        <>
                            <Text style={styles.uploadIcon}>📄</Text>
                            <Text style={styles.uploadTitle}>JSON Dosyası Seç</Text>
                            <Text style={styles.uploadSubtitle}>
                                Profile.json dosyanızı seçin
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.backBtn}
                    onPress={() => setStep(1)}
                >
                    <Text style={styles.backBtnText}>← Geri</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Step 3: Preview
    const renderPreview = () => {
        const counts = countItems();

        return (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.successBanner}>
                    <Text style={styles.successIcon}>✅</Text>
                    <Text style={styles.successText}>Dosya başarıyla okundu!</Text>
                </View>

                {/* Personal Info */}
                <View style={styles.previewCard}>
                    <View style={styles.previewHeader}>
                        <Text style={styles.previewIcon}>👤</Text>
                        <Text style={styles.previewTitle}>Kişisel Bilgiler</Text>
                    </View>
                    <View style={styles.previewItem}>
                        <Text style={styles.previewLabel}>İsim</Text>
                        <Text style={styles.previewValue}>{parsedData?.personal?.fullName || '-'}</Text>
                    </View>
                    <View style={styles.previewItem}>
                        <Text style={styles.previewLabel}>Unvan</Text>
                        <Text style={styles.previewValue}>{parsedData?.personal?.title || '-'}</Text>
                    </View>
                    <View style={styles.previewItem}>
                        <Text style={styles.previewLabel}>Konum</Text>
                        <Text style={styles.previewValue}>{parsedData?.personal?.location || '-'}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{counts.experience}</Text>
                        <Text style={styles.statLabel}>Deneyim</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{counts.education}</Text>
                        <Text style={styles.statLabel}>Eğitim</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{counts.skills}</Text>
                        <Text style={styles.statLabel}>Beceri</Text>
                    </View>
                </View>

                {/* Experience Preview */}
                {parsedData?.experience?.length > 0 && (
                    <View style={styles.previewCard}>
                        <View style={styles.previewHeader}>
                            <Text style={styles.previewIcon}>💼</Text>
                            <Text style={styles.previewTitle}>Deneyimler</Text>
                        </View>
                        {parsedData.experience.slice(0, 3).map((exp, i) => (
                            <View key={i} style={styles.expItem}>
                                <Text style={styles.expPosition}>{exp.position}</Text>
                                <Text style={styles.expCompany}>{exp.company}</Text>
                            </View>
                        ))}
                        {parsedData.experience.length > 3 && (
                            <Text style={styles.moreText}>
                                +{parsedData.experience.length - 3} daha fazla
                            </Text>
                        )}
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity 
                        style={styles.cancelBtn}
                        onPress={() => { setStep(2); setParsedData(null); }}
                    >
                        <Text style={styles.cancelBtnText}>İptal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            style={styles.importBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.importBtnText}>✓ İçe Aktar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.headerBackBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.headerBackIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>🔗 LinkedIn Import</Text>
                    <Text style={styles.headerSubtitle}>
                        Adım {step}/3
                    </Text>
                </View>
            </View>

            {/* Progress */}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
            </View>

            {/* Content */}
            {step === 1 && renderInstructions()}
            {step === 2 && renderUpload()}
            {step === 3 && renderPreview()}
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
    headerBackBtn: {
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
    headerBackIcon: {
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

    // Progress
    progressBar: {
        height: 4,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 16,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#0A66C2',
        borderRadius: 2,
    },

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },

    // Hero Card
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
        textAlign: 'center',
        lineHeight: 20,
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },

    // Step Cards
    stepCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6366F1',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 4,
    },
    stepDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },

    // Tip Card
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 14,
        marginTop: 8,
        marginBottom: 24,
    },
    tipIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400E',
        marginBottom: 2,
    },
    tipText: {
        fontSize: 13,
        color: '#92400E',
    },

    // Continue Button
    continueBtn: {
        marginBottom: 20,
    },
    continueBtnGradient: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    continueBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Upload
    uploadArea: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 80,
    },
    uploadBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    uploadIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    uploadTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    uploadSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
    },
    errorIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: '#DC2626',
    },
    backBtn: {
        marginTop: 20,
        alignItems: 'center',
    },
    backBtnText: {
        fontSize: 15,
        color: '#64748B',
    },

    // Preview
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DCFCE7',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    successIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    successText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#166534',
    },
    previewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    previewIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    previewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    previewLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    previewValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6366F1',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    expItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    expPosition: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    expCompany: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    moreText: {
        fontSize: 13,
        color: '#6366F1',
        fontWeight: '500',
        marginTop: 8,
        textAlign: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
    },
    importBtn: {
        flex: 2,
    },
    importBtnGradient: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    importBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
