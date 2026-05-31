import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, Alert, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

// Career paths
const CAREER_PATHS = {
    software: {
        name: 'Yazılım Mühendisliği',
        icon: '💻',
        color: ['#6366F1', '#8B5CF6'],
        stages: [
            { title: 'Junior Developer', years: '0-2 yıl', salary: '30-45K', skills: ['Temel programlama', 'Git', 'Problem çözme'] },
            { title: 'Mid-Level Developer', years: '2-4 yıl', salary: '45-70K', skills: ['Framework uzmanlığı', 'Code review', 'Mentoring'] },
            { title: 'Senior Developer', years: '4-7 yıl', salary: '70-100K', skills: ['Sistem tasarımı', 'Teknik liderlik', 'Mimari kararlar'] },
            { title: 'Tech Lead', years: '7-10 yıl', salary: '100-140K', skills: ['Ekip yönetimi', 'Stratejik planlama', 'Stakeholder yönetimi'] },
            { title: 'Engineering Manager', years: '10+ yıl', salary: '140-200K', skills: ['Organizasyon yönetimi', 'Bütçe planlama', 'Vizyon belirleme'] },
        ]
    },
    product: {
        name: 'Ürün Yönetimi',
        icon: '📋',
        color: ['#EC4899', '#F43F5E'],
        stages: [
            { title: 'Associate PM', years: '0-2 yıl', salary: '35-50K', skills: ['Kullanıcı araştırması', 'Analitik', 'İletişim'] },
            { title: 'Product Manager', years: '2-5 yıl', salary: '50-80K', skills: ['Roadmap yönetimi', 'Önceliklendirme', 'A/B testing'] },
            { title: 'Senior PM', years: '5-8 yıl', salary: '80-120K', skills: ['Strateji', 'Cross-functional liderlik', 'Metrik odaklı'] },
            { title: 'Director of Product', years: '8-12 yıl', salary: '120-180K', skills: ['Portföy yönetimi', 'Ekip kurma', 'Executive iletişim'] },
            { title: 'VP of Product', years: '12+ yıl', salary: '180-300K', skills: ['Vizyon belirleme', 'Organizasyon tasarımı', 'Board sunumları'] },
        ]
    },
    design: {
        name: 'Tasarım',
        icon: '🎨',
        color: ['#F59E0B', '#D97706'],
        stages: [
            { title: 'Junior Designer', years: '0-2 yıl', salary: '25-40K', skills: ['UI tasarımı', 'Figma', 'Temel UX'] },
            { title: 'Product Designer', years: '2-4 yıl', salary: '40-65K', skills: ['UX araştırması', 'Prototipleme', 'Design systems'] },
            { title: 'Senior Designer', years: '4-7 yıl', salary: '65-95K', skills: ['Stratejik tasarım', 'Mentoring', 'Workshop facilitating'] },
            { title: 'Design Lead', years: '7-10 yıl', salary: '95-130K', skills: ['Ekip yönetimi', 'Design ops', 'Stakeholder yönetimi'] },
            { title: 'Head of Design', years: '10+ yıl', salary: '130-180K', skills: ['Design culture', 'Organizasyon yapısı', 'Executive alignment'] },
        ]
    },
    data: {
        name: 'Veri Bilimi',
        icon: '📊',
        color: ['#10B981', '#059669'],
        stages: [
            { title: 'Data Analyst', years: '0-2 yıl', salary: '30-45K', skills: ['SQL', 'Excel', 'Görselleştirme'] },
            { title: 'Data Scientist', years: '2-4 yıl', salary: '45-75K', skills: ['Python', 'ML temelleri', 'İstatistik'] },
            { title: 'Senior Data Scientist', years: '4-7 yıl', salary: '75-110K', skills: ['Deep learning', 'MLOps', 'İş etkisi'] },
            { title: 'Lead Data Scientist', years: '7-10 yıl', salary: '110-150K', skills: ['Strateji', 'Ekip yönetimi', 'Stakeholder yönetimi'] },
            { title: 'Head of Data', years: '10+ yıl', salary: '150-220K', skills: ['Veri stratejisi', 'Organizasyon', 'Executive liderlik'] },
        ]
    },
};

// Milestone types
const MILESTONE_TYPES = [
    { id: 'promotion', name: 'Terfi', icon: '🚀', color: '#6366F1' },
    { id: 'skill', name: 'Yeni Beceri', icon: '💡', color: '#F59E0B' },
    { id: 'cert', name: 'Sertifika', icon: '📜', color: '#10B981' },
    { id: 'project', name: 'Proje', icon: '🎯', color: '#EC4899' },
];

export default function CareerPathScreen({ navigation }) {
    const { user } = useAuth();
    const isPremium = user?.isPremium || user?.role === 'admin';

    const [selectedPath, setSelectedPath] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [milestones, setMilestones] = useState([
        { id: 1, type: 'skill', title: 'React öğrendim', completed: true, date: '2024-01' },
        { id: 2, type: 'cert', title: 'AWS Certification', completed: true, date: '2024-06' },
        { id: 3, type: 'promotion', title: 'Mid-Level terfi', completed: false, date: '2025-01' },
    ]);
    const [goals, setGoals] = useState([
        { id: 1, title: 'Senior Developer olmak', deadline: '2026', progress: 60 },
        { id: 2, title: 'Tech Lead olmak', deadline: '2028', progress: 20 },
    ]);

    const toggleMilestone = (id) => {
        setMilestones(ms => ms.map(m => 
            m.id === id ? { ...m, completed: !m.completed } : m
        ));
    };

    const deleteMilestone = (id) => {
        Alert.alert(
            'Kilometre Taşını Sil',
            'Bu kilometre taşını silmek istediğinize emin misiniz?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'Sil', style: 'destructive', onPress: () => setMilestones(ms => ms.filter(m => m.id !== id)) }
            ]
        );
    };

    const getProgress = () => {
        if (!selectedPath) return 0;
        const path = CAREER_PATHS[selectedPath];
        return Math.round(((currentLevel + 1) / path.stages.length) * 100);
    };

    // Path Selection
    const renderPathSelection = () => (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.heroCard}>
                <LinearGradient
                    colors={['#8B5CF6', '#6366F1']}
                    style={styles.heroGradient}
                >
                    <Text style={styles.heroIcon}>🗺️</Text>
                    <Text style={styles.heroTitle}>Kariyer Yol Haritası</Text>
                    <Text style={styles.heroSubtitle}>
                        Kariyer yolculuğunuzu planlayın
                    </Text>
                </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>🎯 Kariyer Yolunuzu Seçin</Text>

            {Object.entries(CAREER_PATHS).map(([key, path]) => (
                <TouchableOpacity
                    key={key}
                    style={styles.pathCard}
                    onPress={() => setSelectedPath(key)}
                >
                    <LinearGradient
                        colors={path.color}
                        style={styles.pathIcon}
                    >
                        <Text style={styles.pathEmoji}>{path.icon}</Text>
                    </LinearGradient>
                    <View style={styles.pathInfo}>
                        <Text style={styles.pathName}>{path.name}</Text>
                        <Text style={styles.pathStages}>{path.stages.length} seviye</Text>
                    </View>
                    <Text style={styles.pathArrow}>→</Text>
                </TouchableOpacity>
            ))}

            <View style={{ height: 120 }} />
        </ScrollView>
    );

    // Path View
    const renderPathView = () => {
        const path = CAREER_PATHS[selectedPath];
        const progress = getProgress();

        return (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Progress Overview */}
                <View style={styles.progressCard}>
                    <LinearGradient
                        colors={path.color}
                        style={styles.progressGradient}
                    >
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressPath}>{path.icon} {path.name}</Text>
                            <Text style={styles.progressPercent}>{progress}%</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.progressCurrent}>
                            Mevcut: {path.stages[currentLevel].title}
                        </Text>
                    </LinearGradient>
                </View>

                {/* Career Timeline */}
                <Text style={styles.sectionTitle}>📈 Kariyer Yolculuğu</Text>
                <View style={styles.timeline}>
                    {path.stages.map((stage, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.timelineItem}
                            onPress={() => setCurrentLevel(index)}
                        >
                            <View style={styles.timelineLine}>
                                <View style={[
                                    styles.timelineDot,
                                    index < currentLevel && styles.timelineDotCompleted,
                                    index === currentLevel && styles.timelineDotCurrent
                                ]}>
                                    {index < currentLevel && <Text style={styles.timelineCheck}>✓</Text>}
                                    {index === currentLevel && <View style={styles.timelinePulse} />}
                                </View>
                                {index < path.stages.length - 1 && (
                                    <View style={[
                                        styles.timelineConnector,
                                        index < currentLevel && styles.timelineConnectorCompleted
                                    ]} />
                                )}
                            </View>
                            <View style={[
                                styles.timelineContent,
                                index === currentLevel && styles.timelineContentCurrent
                            ]}>
                                <View style={styles.timelineHeader}>
                                    <Text style={styles.timelineTitle}>{stage.title}</Text>
                                    <Text style={styles.timelineYears}>{stage.years}</Text>
                                </View>
                                <Text style={styles.timelineSalary}>💰 {stage.salary} TL</Text>
                                <View style={styles.timelineSkills}>
                                    {stage.skills.map((skill, i) => (
                                        <View key={i} style={styles.skillTag}>
                                            <Text style={styles.skillTagText}>{skill}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Milestones */}
                <Text style={styles.sectionTitle}>🏆 Kilometre Taşları</Text>
                <View style={styles.milestonesCard}>
                    {milestones.map(milestone => {
                        const type = MILESTONE_TYPES.find(t => t.id === milestone.type);
                        return (
                            <TouchableOpacity 
                                key={milestone.id} 
                                style={styles.milestoneItem}
                                onPress={() => toggleMilestone(milestone.id)}
                                onLongPress={() => deleteMilestone(milestone.id)}
                            >
                                <View style={[
                                    styles.milestoneIcon,
                                    { backgroundColor: type.color + '20' }
                                ]}>
                                    <Text style={styles.milestoneEmoji}>{type.icon}</Text>
                                </View>
                                <View style={styles.milestoneInfo}>
                                    <Text style={[
                                        styles.milestoneTitle,
                                        milestone.completed && styles.milestoneTitleCompleted
                                    ]}>
                                        {milestone.title}
                                    </Text>
                                    <Text style={styles.milestoneDate}>{milestone.date}</Text>
                                </View>
                                <View style={[
                                    styles.milestoneCheck,
                                    milestone.completed && styles.milestoneCheckCompleted
                                ]}>
                                    {milestone.completed && <Text style={styles.milestoneCheckIcon}>✓</Text>}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity style={styles.addMilestoneBtn}>
                        <Text style={styles.addMilestoneBtnText}>+ Yeni Kilometre Taşı</Text>
                    </TouchableOpacity>
                </View>

                {/* Goals */}
                <Text style={styles.sectionTitle}>🎯 Hedefler</Text>
                <View style={styles.goalsCard}>
                    {goals.map(goal => (
                        <View key={goal.id} style={styles.goalItem}>
                            <View style={styles.goalHeader}>
                                <Text style={styles.goalTitle}>{goal.title}</Text>
                                <Text style={styles.goalDeadline}>{goal.deadline}</Text>
                            </View>
                            <View style={styles.goalProgress}>
                                <View style={styles.goalProgressTrack}>
                                    <View style={[styles.goalProgressFill, { width: `${goal.progress}%` }]} />
                                </View>
                                <Text style={styles.goalProgressText}>{goal.progress}%</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Action Button */}
                <TouchableOpacity 
                    style={styles.changePathBtn}
                    onPress={() => setSelectedPath(null)}
                >
                    <Text style={styles.changePathBtnText}>← Farklı Yol Seç</Text>
                </TouchableOpacity>

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
                    style={styles.backButton} 
                    onPress={() => selectedPath ? setSelectedPath(null) : navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>🗺️ Kariyer Yolu</Text>
                    <Text style={styles.headerSubtitle}>
                        {selectedPath ? CAREER_PATHS[selectedPath].name : 'Yol seçin'}
                    </Text>
                </View>
                {!isPremium && (
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                )}
            </View>

            {selectedPath ? renderPathView() : renderPathSelection()}
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
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
        marginTop: 4,
    },

    // Path Cards
    pathCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    pathIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pathEmoji: {
        fontSize: 24,
    },
    pathInfo: {
        flex: 1,
        marginLeft: 14,
    },
    pathName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    pathStages: {
        fontSize: 13,
        color: '#64748B',
    },
    pathArrow: {
        fontSize: 20,
        color: '#CBD5E1',
    },

    // Progress Card
    progressCard: {
        marginBottom: 24,
    },
    progressGradient: {
        borderRadius: 20,
        padding: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressPath: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    progressPercent: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    progressCurrent: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },

    // Timeline
    timeline: {
        marginBottom: 24,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineLine: {
        alignItems: 'center',
        marginRight: 12,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineDotCompleted: {
        backgroundColor: '#10B981',
    },
    timelineDotCurrent: {
        backgroundColor: '#6366F1',
    },
    timelineCheck: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    timelinePulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    timelineConnector: {
        width: 2,
        flex: 1,
        backgroundColor: '#E2E8F0',
        minHeight: 60,
    },
    timelineConnectorCompleted: {
        backgroundColor: '#10B981',
    },
    timelineContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    timelineContentCurrent: {
        borderColor: '#6366F1',
        backgroundColor: '#EEF2FF',
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    timelineTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    timelineYears: {
        fontSize: 12,
        color: '#64748B',
    },
    timelineSalary: {
        fontSize: 13,
        color: '#10B981',
        marginBottom: 8,
    },
    timelineSkills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillTag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    skillTagText: {
        fontSize: 11,
        color: '#64748B',
    },

    // Milestones
    milestonesCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    milestoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    milestoneIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    milestoneEmoji: {
        fontSize: 18,
    },
    milestoneInfo: {
        flex: 1,
        marginLeft: 12,
    },
    milestoneTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    milestoneTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#64748B',
    },
    milestoneDate: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    milestoneCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    milestoneCheckCompleted: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    milestoneCheckIcon: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    addMilestoneBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    addMilestoneBtnText: {
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '600',
    },

    // Goals
    goalsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    goalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    goalTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    goalDeadline: {
        fontSize: 12,
        color: '#64748B',
    },
    goalProgress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalProgressTrack: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginRight: 12,
    },
    goalProgressFill: {
        height: '100%',
        backgroundColor: '#6366F1',
        borderRadius: 3,
    },
    goalProgressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
        width: 35,
    },

    // Change Path Button
    changePathBtn: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    changePathBtnText: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '600',
    },
});
