// Professional Job Search Screen
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, FlatList, ActivityIndicator, StatusBar, Linking,
    RefreshControl, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../constants';
import { jobAPI } from '../services/api';

const CATEGORIES = [
    { id: 'all', name: 'Tümü', icon: '📋' },
    { id: 'tech', name: 'Teknoloji', icon: '💻' },
    { id: 'finance', name: 'Finans', icon: '💰' },
    { id: 'marketing', name: 'Pazarlama', icon: '📢' },
    { id: 'design', name: 'Tasarım', icon: '🎨' },
    { id: 'sales', name: 'Satış', icon: '🤝' },
    { id: 'hr', name: 'İK', icon: '👥' },
];

const EXPERIENCE_LEVELS = [
    { id: 'entry', name: 'Yeni Mezun', icon: '🎓' },
    { id: 'junior', name: 'Junior', icon: '🌱' },
    { id: 'mid', name: 'Mid-Level', icon: '💼' },
    { id: 'senior', name: 'Senior', icon: '⭐' },
    { id: 'lead', name: 'Lead/Manager', icon: '👑' },
];

const WORK_TYPES = [
    { id: 'all', name: 'Tümü' },
    { id: 'remote', name: '🏠 Uzaktan' },
    { id: 'hybrid', name: '🔄 Hibrit' },
    { id: 'onsite', name: '🏢 Ofis' },
];

// Mock job data
const MOCK_JOBS = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Startup',
        location: 'İstanbul (Uzaktan)',
        salary: '80.000₺ - 120.000₺',
        type: 'remote',
        category: 'tech',
        experience: 'senior',
        posted: '2 saat önce',
        logo: '🚀',
        tags: ['React', 'TypeScript', 'Node.js'],
        description: 'Dinamik ekibimize Senior Frontend Developer arıyoruz...',
        isNew: true,
    },
    {
        id: '2',
        title: 'UX/UI Designer',
        company: 'Design Agency',
        location: 'Ankara (Hibrit)',
        salary: '50.000₺ - 70.000₺',
        type: 'hybrid',
        category: 'design',
        experience: 'mid',
        posted: '1 gün önce',
        logo: '🎨',
        tags: ['Figma', 'Adobe XD', 'Prototyping'],
        isNew: true,
    },
    {
        id: '3',
        title: 'Marketing Manager',
        company: 'E-Commerce Co.',
        location: 'İstanbul',
        salary: '60.000₺ - 90.000₺',
        type: 'onsite',
        category: 'marketing',
        experience: 'senior',
        posted: '3 gün önce',
        logo: '📈',
        tags: ['SEO', 'SEM', 'Analytics'],
    },
    {
        id: '4',
        title: 'Junior Software Developer',
        company: 'Fintech Company',
        location: 'İzmir (Uzaktan)',
        salary: '35.000₺ - 50.000₺',
        type: 'remote',
        category: 'tech',
        experience: 'junior',
        posted: '1 hafta önce',
        logo: '💳',
        tags: ['Java', 'Spring', 'PostgreSQL'],
    },
    {
        id: '5',
        title: 'Data Analyst',
        company: 'Analytics Firm',
        location: 'İstanbul (Hibrit)',
        salary: '55.000₺ - 75.000₺',
        type: 'hybrid',
        category: 'tech',
        experience: 'mid',
        posted: '5 gün önce',
        logo: '📊',
        tags: ['Python', 'SQL', 'Tableau'],
    },
];

function CategoryChip({ category, isSelected, onPress, colors }) {
    return (
        <TouchableOpacity
            style={[
                styles.categoryChip,
                { backgroundColor: isSelected ? COLORS.primary : colors.surface },
                SHADOW.sm
            ]}
            onPress={onPress}
        >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[styles.categoryName, { color: isSelected ? '#fff' : colors.text }]}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
}

function JobCard({ job, colors, onPress, onApply, onSave }) {
    return (
        <TouchableOpacity
            style={[styles.jobCard, { backgroundColor: colors.surface }, SHADOW.md]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {job.isNew && (
                <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>YENİ</Text>
                </View>
            )}

            <View style={styles.jobHeader}>
                <View style={[styles.companyLogo, { backgroundColor: COLORS.primary + '15' }]}>
                    <Text style={styles.companyLogoText}>{job.logo}</Text>
                </View>
                <View style={styles.jobInfo}>
                    <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                    <Text style={[styles.companyName, { color: colors.textSecondary }]}>{job.company}</Text>
                </View>
                <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
                    <Text style={{ fontSize: 20 }}>🔖</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{job.location}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>💰</Text>
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{job.salary}</Text>
                </View>
            </View>

            <View style={styles.tagRow}>
                {job.tags.map((tag, i) => (
                    <View key={i} style={[styles.tag, { backgroundColor: COLORS.primary + '15' }]}>
                        <Text style={[styles.tagText, { color: COLORS.primary }]}>{tag}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.jobFooter}>
                <Text style={[styles.postedTime, { color: colors.textSecondary }]}>🕐 {job.posted}</Text>
                <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
                    <LinearGradient colors={COLORS.gradients.primary} style={styles.applyBtnGradient}>
                        <Text style={styles.applyBtnText}>Başvur</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

function FilterModal({ visible, onClose, filters, setFilters, colors }) {
    if (!visible) return null;

    return (
        <View style={[styles.filterModal, { backgroundColor: colors.background }]}>
            <View style={[styles.filterHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.filterTitle, { color: colors.text }]}>Filtrele</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={{ fontSize: 24 }}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Deneyim Seviyesi</Text>
                <View style={styles.filterOptions}>
                    {EXPERIENCE_LEVELS.map(level => (
                        <TouchableOpacity
                            key={level.id}
                            style={[
                                styles.filterOption,
                                { backgroundColor: filters.experience === level.id ? COLORS.primary + '20' : colors.surface },
                                filters.experience === level.id && { borderColor: COLORS.primary, borderWidth: 2 },
                            ]}
                            onPress={() => setFilters(prev => ({ ...prev, experience: level.id }))}
                        >
                            <Text style={styles.filterOptionIcon}>{level.icon}</Text>
                            <Text style={[styles.filterOptionText, { color: colors.text }]}>{level.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.filterLabel, { color: colors.text }]}>Çalışma Şekli</Text>
                <View style={styles.filterOptions}>
                    {WORK_TYPES.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.filterOption,
                                { backgroundColor: filters.workType === type.id ? COLORS.primary + '20' : colors.surface },
                                filters.workType === type.id && { borderColor: COLORS.primary, borderWidth: 2 },
                            ]}
                            onPress={() => setFilters(prev => ({ ...prev, workType: type.id }))}
                        >
                            <Text style={[styles.filterOptionText, { color: colors.text }]}>{type.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.applyFilterBtn} onPress={onClose}>
                <LinearGradient colors={COLORS.gradients.primary} style={styles.applyFilterBtnGradient}>
                    <Text style={styles.applyFilterBtnText}>Uygula</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

export default function JobSearchScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        experience: 'all',
        workType: 'all',
    });
    const [savedJobs, setSavedJobs] = useState([]);

    const searchJobs = async () => {
        setLoading(true);
        try {
            const response = await jobAPI.search({
                query: searchQuery,
                category: selectedCategory,
                ...filters,
            });
            if (response.success) {
                setJobs(response.jobs);
            }
        } catch (error) {
            // Use mock data
            let filtered = MOCK_JOBS;
            if (selectedCategory !== 'all') {
                filtered = filtered.filter(j => j.category === selectedCategory);
            }
            if (searchQuery) {
                filtered = filtered.filter(j =>
                    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    j.company.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setJobs(filtered);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchJobs();
    }, [selectedCategory, filters]);

    const onRefresh = async () => {
        setRefreshing(true);
        await searchJobs();
        setRefreshing(false);
    };

    const handleSaveJob = (jobId) => {
        if (savedJobs.includes(jobId)) {
            setSavedJobs(prev => prev.filter(id => id !== jobId));
        } else {
            setSavedJobs(prev => [...prev, jobId]);
        }
    };

    const handleApply = (job) => {
        navigation.navigate('JobDetail', { job });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: '#fff' }}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>İş Ara</Text>
                    <Text style={styles.headerSubtitle}>{jobs.length} ilan bulundu</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
                    <Text style={{ fontSize: 24 }}>⚙️</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                <View style={[styles.searchBox, { backgroundColor: colors.background }]}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Pozisyon, şirket veya anahtar kelime"
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={searchJobs}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
            >
                {CATEGORIES.map(cat => (
                    <CategoryChip
                        key={cat.id}
                        category={cat}
                        isSelected={selectedCategory === cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        colors={colors}
                    />
                ))}
            </ScrollView>

            {/* Job List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        İlanlar yükleniyor...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <JobCard
                            job={item}
                            colors={colors}
                            onPress={() => handleApply(item)}
                            onApply={() => handleApply(item)}
                            onSave={() => handleSaveJob(item.id)}
                        />
                    )}
                    contentContainerStyle={styles.jobList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                            colors={[COLORS.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>İlan Bulunamadı</Text>
                            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                                Farklı anahtar kelimeler veya filtreler deneyin
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Filter Modal */}
            <FilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                setFilters={setFilters}
                colors={colors}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
    },
    backButton: { padding: SPACING.sm },
    headerCenter: { flex: 1, marginLeft: SPACING.sm },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
    headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
    filterBtn: { padding: SPACING.sm },

    searchContainer: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
    },
    searchIcon: { fontSize: 18, marginRight: SPACING.sm },
    searchInput: { flex: 1, fontSize: 15 },
    clearIcon: { fontSize: 16, padding: SPACING.xs },

    categoriesScroll: { maxHeight: 60 },
    categoriesContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        marginRight: SPACING.sm,
    },
    categoryIcon: { fontSize: 16, marginRight: SPACING.xs },
    categoryName: { fontSize: 13, fontWeight: '600' },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { marginTop: SPACING.md, fontSize: 14 },

    jobList: { padding: SPACING.md },
    jobCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.md,
        position: 'relative',
    },
    newBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: '#10B981',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    newBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyLogoText: { fontSize: 24 },
    jobInfo: { flex: 1, marginLeft: SPACING.sm },
    jobTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    companyName: { fontSize: 13 },
    saveBtn: { padding: SPACING.xs },

    jobMeta: { flexDirection: 'row', marginBottom: SPACING.sm },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: SPACING.md },
    metaIcon: { fontSize: 14, marginRight: 4 },
    metaText: { fontSize: 12 },

    tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.sm },
    tag: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
        marginRight: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    tagText: { fontSize: 11, fontWeight: '600' },

    jobFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    postedTime: { fontSize: 12 },
    applyBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden' },
    applyBtnGradient: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
    applyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

    emptyContainer: {
        padding: SPACING.xxl,
        alignItems: 'center',
    },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.md },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: SPACING.xs },
    emptyDesc: { fontSize: 14, textAlign: 'center' },

    filterModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        paddingTop: SPACING.xxl,
        borderBottomWidth: 1,
    },
    filterTitle: { fontSize: 20, fontWeight: '700' },
    filterContent: { flex: 1, padding: SPACING.md },
    filterLabel: { fontSize: 16, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
    filterOptions: { flexDirection: 'row', flexWrap: 'wrap' },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    filterOptionIcon: { fontSize: 16, marginRight: SPACING.xs },
    filterOptionText: { fontSize: 13, fontWeight: '500' },
    applyFilterBtn: {
        margin: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },
    applyFilterBtnGradient: { padding: SPACING.md, alignItems: 'center' },
    applyFilterBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
