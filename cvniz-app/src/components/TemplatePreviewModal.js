// Template Preview Modal Component
import React from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView,
    Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';

const { width, height } = Dimensions.get('window');

// Sample CV Data for Preview
const SAMPLE_CV_DATA = {
    personal: {
        name: 'Ahmet Yılmaz',
        title: 'Senior Software Developer',
        email: 'ahmet.yilmaz@email.com',
        phone: '+90 555 123 4567',
        location: 'İstanbul, Türkiye',
        linkedin: 'linkedin.com/in/ahmetyilmaz',
        summary: 'Full-stack developer with 8+ years of experience in building scalable web applications. Passionate about clean code and modern technologies.'
    },
    experience: [
        {
            company: 'Tech Corp',
            position: 'Senior Developer',
            period: '2021 - Günümüz',
            description: 'Led a team of 5 developers in building microservices architecture.'
        },
        {
            company: 'Startup Inc',
            position: 'Full Stack Developer',
            period: '2018 - 2021',
            description: 'Developed and maintained React/Node.js applications.'
        }
    ],
    education: [
        {
            school: 'İstanbul Teknik Üniversitesi',
            degree: 'Bilgisayar Mühendisliği, Lisans',
            period: '2014 - 2018'
        }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'AWS', 'Docker', 'Git']
};

// Template Styles
const TEMPLATE_STYLES = {
    modern: {
        headerBg: ['#06B6D4', '#A855F7'],
        accentColor: '#06B6D4',
        textColor: '#1F2937',
        sectionBg: '#F8FAFC',
    },
    minimalist: {
        headerBg: ['#374151', '#1F2937'],
        accentColor: '#374151',
        textColor: '#1F2937',
        sectionBg: '#FFFFFF',
    },
    creative: {
        headerBg: ['#EC4899', '#F59E0B'],
        accentColor: '#EC4899',
        textColor: '#1F2937',
        sectionBg: '#FDF2F8',
    },
    corporate: {
        headerBg: ['#1E40AF', '#3B82F6'],
        accentColor: '#1E40AF',
        textColor: '#1E293B',
        sectionBg: '#F1F5F9',
    },
    tech: {
        headerBg: ['#10B981', '#06B6D4'],
        accentColor: '#10B981',
        textColor: '#0F172A',
        sectionBg: '#ECFDF5',
    },
    executive: {
        headerBg: ['#7C3AED', '#A855F7'],
        accentColor: '#7C3AED',
        textColor: '#1F2937',
        sectionBg: '#FAF5FF',
    },
    default: {
        headerBg: ['#3B82F6', '#6366F1'],
        accentColor: '#3B82F6',
        textColor: '#1F2937',
        sectionBg: '#F8FAFC',
    }
};

function getTemplateStyle(templateId) {
    return TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES.default;
}

export default function TemplatePreviewModal({ visible, template, onClose, onSelect, colors, isPremiumUser }) {
    if (!template) return null;

    const style = getTemplateStyle(template.id);
    const isLocked = template.premium && !isPremiumUser;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="light-content" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeBtnText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{template.name}</Text>
                    <View style={styles.headerRight}>
                        {template.premium && (
                            <LinearGradient colors={COLORS.gradients.premium} style={styles.premiumBadge}>
                                <Text style={styles.premiumText}>👑 PRO</Text>
                            </LinearGradient>
                        )}
                    </View>
                </View>

                {/* CV Preview */}
                <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
                    <View style={[styles.cvContainer, SHADOW.lg]}>
                        {/* CV Header */}
                        <LinearGradient
                            colors={style.headerBg}
                            style={styles.cvHeader}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {SAMPLE_CV_DATA.personal.name.charAt(0)}
                                </Text>
                            </View>
                            <Text style={styles.cvName}>{SAMPLE_CV_DATA.personal.name}</Text>
                            <Text style={styles.cvTitle}>{SAMPLE_CV_DATA.personal.title}</Text>
                            <View style={styles.contactRow}>
                                <Text style={styles.contactItem}>📧 {SAMPLE_CV_DATA.personal.email}</Text>
                                <Text style={styles.contactItem}>📱 {SAMPLE_CV_DATA.personal.phone}</Text>
                            </View>
                        </LinearGradient>

                        {/* CV Body */}
                        <View style={[styles.cvBody, { backgroundColor: style.sectionBg }]}>
                            {/* Summary */}
                            <View style={styles.cvSection}>
                                <View style={[styles.sectionTitleBar, { backgroundColor: style.accentColor }]} />
                                <Text style={[styles.sectionTitle, { color: style.textColor }]}>Özet</Text>
                                <Text style={[styles.sectionText, { color: style.textColor + 'CC' }]}>
                                    {SAMPLE_CV_DATA.personal.summary}
                                </Text>
                            </View>

                            {/* Experience */}
                            <View style={styles.cvSection}>
                                <View style={[styles.sectionTitleBar, { backgroundColor: style.accentColor }]} />
                                <Text style={[styles.sectionTitle, { color: style.textColor }]}>Deneyim</Text>
                                {SAMPLE_CV_DATA.experience.map((exp, i) => (
                                    <View key={i} style={styles.expItem}>
                                        <View style={styles.expHeader}>
                                            <Text style={[styles.expCompany, { color: style.textColor }]}>{exp.company}</Text>
                                            <Text style={[styles.expPeriod, { color: style.accentColor }]}>{exp.period}</Text>
                                        </View>
                                        <Text style={[styles.expPosition, { color: style.textColor + 'BB' }]}>{exp.position}</Text>
                                        <Text style={[styles.expDesc, { color: style.textColor + '99' }]}>{exp.description}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Education */}
                            <View style={styles.cvSection}>
                                <View style={[styles.sectionTitleBar, { backgroundColor: style.accentColor }]} />
                                <Text style={[styles.sectionTitle, { color: style.textColor }]}>Eğitim</Text>
                                {SAMPLE_CV_DATA.education.map((edu, i) => (
                                    <View key={i} style={styles.eduItem}>
                                        <Text style={[styles.eduSchool, { color: style.textColor }]}>{edu.school}</Text>
                                        <Text style={[styles.eduDegree, { color: style.textColor + 'BB' }]}>{edu.degree}</Text>
                                        <Text style={[styles.eduPeriod, { color: style.accentColor }]}>{edu.period}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Skills */}
                            <View style={styles.cvSection}>
                                <View style={[styles.sectionTitleBar, { backgroundColor: style.accentColor }]} />
                                <Text style={[styles.sectionTitle, { color: style.textColor }]}>Yetenekler</Text>
                                <View style={styles.skillsContainer}>
                                    {SAMPLE_CV_DATA.skills.map((skill, i) => (
                                        <View key={i} style={[styles.skillTag, { backgroundColor: style.accentColor + '20' }]}>
                                            <Text style={[styles.skillText, { color: style.accentColor }]}>{skill}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Actions */}
                <View style={[styles.footer, { backgroundColor: colors.surface }, SHADOW.lg]}>
                    {isLocked ? (
                        <TouchableOpacity style={styles.upgradeBtn}>
                            <LinearGradient colors={COLORS.gradients.premium} style={styles.upgradeBtnGradient}>
                                <Text style={styles.upgradeBtnText}>👑 Pro'ya Yükselt</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.selectBtn} onPress={onSelect}>
                            <LinearGradient colors={COLORS.gradients.primary} style={styles.selectBtnGradient}>
                                <Text style={styles.selectBtnText}>Bu Şablonu Kullan</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        paddingTop: SPACING.lg,
    },
    closeBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center', alignItems: 'center',
    },
    closeBtnText: { fontSize: 18, fontWeight: '600' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerRight: { width: 80, alignItems: 'flex-end' },
    premiumBadge: {
        paddingHorizontal: SPACING.sm, paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    premiumText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    // Preview
    previewScroll: { flex: 1, padding: SPACING.md },
    cvContainer: {
        backgroundColor: '#fff',
        borderRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        marginBottom: SPACING.xl,
    },

    // CV Header
    cvHeader: {
        padding: SPACING.lg,
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: SPACING.sm, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
    cvName: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
    cvTitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: SPACING.sm },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
    contactItem: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginHorizontal: SPACING.sm },

    // CV Body
    cvBody: { padding: SPACING.md },
    cvSection: { marginBottom: SPACING.lg },
    sectionTitleBar: { width: 4, height: 20, borderRadius: 2, marginBottom: SPACING.xs },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.sm },
    sectionText: { fontSize: 13, lineHeight: 20 },

    // Experience
    expItem: { marginBottom: SPACING.md, paddingLeft: SPACING.sm, borderLeftWidth: 2, borderLeftColor: '#E5E7EB' },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    expCompany: { fontSize: 14, fontWeight: '600' },
    expPeriod: { fontSize: 11, fontWeight: '500' },
    expPosition: { fontSize: 12, marginTop: 2 },
    expDesc: { fontSize: 11, marginTop: 4, lineHeight: 16 },

    // Education
    eduItem: { marginBottom: SPACING.sm },
    eduSchool: { fontSize: 14, fontWeight: '600' },
    eduDegree: { fontSize: 12, marginTop: 2 },
    eduPeriod: { fontSize: 11, marginTop: 2 },

    // Skills
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    skillTag: {
        paddingHorizontal: SPACING.sm, paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm, marginRight: SPACING.xs, marginBottom: SPACING.xs,
    },
    skillText: { fontSize: 11, fontWeight: '500' },

    // Footer
    footer: {
        padding: SPACING.md,
        paddingBottom: SPACING.xl,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
    },
    selectBtn: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
    selectBtnGradient: { padding: SPACING.md, alignItems: 'center' },
    selectBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    upgradeBtn: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden' },
    upgradeBtnGradient: { padding: SPACING.md, alignItems: 'center' },
    upgradeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
