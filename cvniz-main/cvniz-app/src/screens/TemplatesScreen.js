import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, ScrollView, StatusBar, Dimensions, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
    TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory
} from '../constants';
import TemplatePreviewModal from '../components/TemplatePreviewModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Template Card Component
function TemplateCard({ template, onPress, isPremiumUser }) {
    const isLocked = template.premium && !isPremiumUser;

    const cardColors = {
        'modern': ['#6366F1', '#8B5CF6'],
        'minimal': ['#10B981', '#059669'],
        'creative': ['#F59E0B', '#D97706'],
        'professional': ['#3B82F6', '#1D4ED8'],
        'classic': ['#6B7280', '#4B5563'],
    };

    const colors = cardColors[template.category] || ['#6366F1', '#8B5CF6'];

    return (
        <TouchableOpacity
            style={styles.templateCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Preview Area */}
            <View style={styles.templatePreview}>
                <LinearGradient
                    colors={[colors[0] + '15', colors[1] + '08']}
                    style={styles.previewGradient}
                >
                    {/* Mini CV Preview */}
                    <View style={styles.miniCV}>
                        <View style={[styles.miniHeader, { backgroundColor: colors[0] }]} />
                        <View style={styles.miniBody}>
                            <View style={[styles.miniLine, { width: '60%' }]} />
                            <View style={[styles.miniLine, { width: '80%' }]} />
                            <View style={[styles.miniLine, { width: '40%' }]} />
                            <View style={styles.miniSection}>
                                <View style={[styles.miniDot, { backgroundColor: colors[0] }]} />
                                <View style={[styles.miniLine, { flex: 1 }]} />
                            </View>
                            <View style={styles.miniSection}>
                                <View style={[styles.miniDot, { backgroundColor: colors[0] }]} />
                                <View style={[styles.miniLine, { flex: 1 }]} />
                            </View>
                        </View>
                    </View>

                    {/* Lock Overlay */}
                    {isLocked && (
                        <View style={styles.lockOverlay}>
                            <View style={styles.lockBadge}>
                                <Text style={styles.lockIcon}>🔒</Text>
                            </View>
                        </View>
                    )}

                    {/* Premium Badge */}
                    {template.premium && (
                        <View style={styles.premiumBadge}>
                            <LinearGradient
                                colors={['#F59E0B', '#D97706']}
                                style={styles.premiumGradient}
                            >
                                <Text style={styles.premiumText}>PRO</Text>
                            </LinearGradient>
                        </View>
                    )}
                </LinearGradient>
            </View>

            {/* Info */}
            <View style={styles.templateInfo}>
                <Text style={styles.templateName} numberOfLines={1}>
                    {template.name}
                </Text>
                <View style={styles.templateMeta}>
                    <View style={[styles.categoryDot, { backgroundColor: colors[0] }]} />
                    <Text style={styles.categoryText}>{template.category}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// Category Chip
function CategoryChip({ category, isActive, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.categoryChip, isActive && styles.categoryChipActive]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.categoryChipIcon}>{category.icon}</Text>
            <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
}

export default function TemplatesScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const isPremiumUser = user?.isPremium || user?.role === 'admin';

    const filteredTemplates = useMemo(() => {
        let templates = getTemplatesByCategory(selectedCategory);
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            templates = templates.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query)
            );
        }
        return templates;
    }, [selectedCategory, searchQuery]);

    const handleTemplatePress = (template) => {
        setPreviewTemplate(template);
        setShowPreview(true);
    };

    const handleSelectTemplate = () => {
        if (previewTemplate) {
            setShowPreview(false);
            navigation.navigate('Editor', { templateId: previewTemplate.id, newCV: true });
        }
    };

    const stats = {
        total: TEMPLATES.length,
        free: TEMPLATES.filter(t => !t.premium).length,
        premium: TEMPLATES.filter(t => t.premium).length,
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Şablonlar</Text>
                        <Text style={styles.headerSubtitle}>
                            {stats.total} profesyonel CV şablonu
                        </Text>
                    </View>
                    {!isPremiumUser && (
                        <TouchableOpacity 
                            style={styles.proButton}
                            onPress={() => navigation.navigate('Premium')}
                        >
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={styles.proButtonGradient}
                            >
                                <Text style={styles.proButtonText}>👑 PRO</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Şablon ara..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            style={styles.clearBtn}
                            onPress={() => setSearchQuery('')}
                        >
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.statPill, styles.statPillFree]}>
                        <Text style={styles.statPillText}>✓ {stats.free} Ücretsiz</Text>
                    </View>
                    <View style={[styles.statPill, styles.statPillPro]}>
                        <Text style={styles.statPillTextPro}>👑 {stats.premium} Premium</Text>
                    </View>
                </View>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {TEMPLATE_CATEGORIES.map(cat => (
                    <CategoryChip
                        key={cat.id}
                        category={cat}
                        isActive={selectedCategory === cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                    />
                ))}
            </ScrollView>

            {/* Results Info */}
            <View style={styles.resultsBar}>
                <Text style={styles.resultsText}>
                    {filteredTemplates.length} şablon bulundu
                </Text>
            </View>

            {/* Templates Grid */}
            <FlatList
                data={filteredTemplates}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                renderItem={({ item }) => (
                    <TemplateCard
                        template={item}
                        onPress={() => handleTemplatePress(item)}
                        isPremiumUser={isPremiumUser}
                    />
                )}
                contentContainerStyle={styles.gridContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconBox}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                        </View>
                        <Text style={styles.emptyTitle}>Şablon bulunamadı</Text>
                        <Text style={styles.emptyDesc}>
                            Farklı bir arama terimi deneyin
                        </Text>
                    </View>
                }
            />

            {/* Preview Modal */}
            <TemplatePreviewModal
                visible={showPreview}
                template={previewTemplate}
                onClose={() => setShowPreview(false)}
                onSelect={handleSelectTemplate}
                colors={colors}
                isPremiumUser={isPremiumUser}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },

    // Header
    header: {
        backgroundColor: '#FFF',
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    proButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    proButtonGradient: {
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    proButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },

    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 12,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#0F172A',
    },
    clearBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearIcon: {
        fontSize: 12,
        color: '#64748B',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statPillFree: {
        backgroundColor: '#D1FAE5',
    },
    statPillPro: {
        backgroundColor: '#FEF3C7',
    },
    statPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },
    statPillTextPro: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D97706',
    },

    // Categories
    categoriesContainer: {
        backgroundColor: '#FFF',
        maxHeight: 56,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#6366F1',
    },
    categoryChipIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    categoryChipTextActive: {
        color: '#FFF',
    },

    // Results
    resultsBar: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    resultsText: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },

    // Grid
    gridContent: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    gridRow: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    // Template Card
    templateCard: {
        width: CARD_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    templatePreview: {
        height: 140,
        overflow: 'hidden',
    },
    previewGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },

    // Mini CV
    miniCV: {
        width: '85%',
        height: '90%',
        backgroundColor: '#FFF',
        borderRadius: 6,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    miniHeader: {
        height: 24,
    },
    miniBody: {
        padding: 8,
        gap: 6,
    },
    miniLine: {
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
    },
    miniSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    miniDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    // Lock
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockIcon: {
        fontSize: 18,
    },

    // Premium Badge
    premiumBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        borderRadius: 6,
        overflow: 'hidden',
    },
    premiumGradient: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    premiumText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },

    // Template Info
    templateInfo: {
        padding: 14,
    },
    templateName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 6,
    },
    templateMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 12,
        color: '#94A3B8',
        textTransform: 'capitalize',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyIconBox: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyIcon: {
        fontSize: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
    },
});
