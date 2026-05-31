// Premium UI Components for Mobile App
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW, TYPOGRAPHY } from '../constants';

// ============ GLASS CARD ============
export function GlassCard({ children, style, colors }) {
    return (
        <View style={[
            styles.glassCard,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
            SHADOW.md,
            style
        ]}>
            {children}
        </View>
    );
}

// ============ STAT CARD ============
export function StatCard({ icon, value, label, colors, gradient }) {
    return (
        <View style={[styles.statCard, { backgroundColor: colors.surface }, SHADOW.sm]}>
            {gradient ? (
                <LinearGradient colors={gradient} style={styles.statIconGradient}>
                    <Text style={styles.statIcon}>{icon}</Text>
                </LinearGradient>
            ) : (
                <View style={[styles.statIconWrapper, { backgroundColor: COLORS.primary + '20' }]}>
                    <Text style={styles.statIcon}>{icon}</Text>
                </View>
            )}
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
    );
}

// ============ QUICK ACTION BUTTON ============
export function QuickAction({ icon, label, onPress, colors, isPrimary }) {
    if (isPrimary) {
        return (
            <TouchableOpacity style={styles.quickAction} onPress={onPress}>
                <LinearGradient colors={COLORS.gradients.primary} style={styles.quickActionGradient}>
                    <Text style={styles.quickActionIcon}>{icon}</Text>
                    <Text style={styles.quickActionLabelWhite}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: colors.surface }, SHADOW.sm]}
            onPress={onPress}
        >
            <Text style={styles.quickActionIcon}>{icon}</Text>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>{label}</Text>
        </TouchableOpacity>
    );
}

// ============ PREMIUM CV CARD ============
export function CVCardPremium({ cv, colors, onPress, onDelete, onDuplicate }) {
    const getTemplateEmoji = (template) => {
        const emojis = {
            modern: '✨', minimalist: '◽', creative: '🎨', corporate: '💼',
            tech: '💻', executive: '👔', elegant: '💎', default: '📄'
        };
        return emojis[template] || emojis.default;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    return (
        <TouchableOpacity
            style={[styles.cvCard, { backgroundColor: colors.surface }, SHADOW.md]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.cvCardHeader}>
                <LinearGradient
                    colors={COLORS.gradients.primary}
                    style={styles.cvEmojiBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.cvEmoji}>{getTemplateEmoji(cv.template)}</Text>
                </LinearGradient>
                <View style={styles.cvInfo}>
                    <Text style={[styles.cvName, { color: colors.text }]} numberOfLines={1}>
                        {cv.name || 'CV Başlıksız'}
                    </Text>
                    <View style={styles.cvMeta}>
                        <View style={[styles.templateBadge, { backgroundColor: COLORS.primary + '15' }]}>
                            <Text style={[styles.templateName, { color: COLORS.primary }]}>
                                {cv.template || 'Modern'}
                            </Text>
                        </View>
                        <Text style={[styles.cvDate, { color: colors.textSecondary }]}>
                            {formatDate(cv.updatedAt)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.cvActions}>
                <TouchableOpacity
                    style={[styles.cvActionBtn, { backgroundColor: COLORS.primary + '15' }]}
                    onPress={onDuplicate}
                >
                    <Text style={{ color: COLORS.primary, fontSize: 14 }}>📋</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.cvActionBtn, { backgroundColor: COLORS.error + '15' }]}
                    onPress={onDelete}
                >
                    <Text style={{ color: COLORS.error, fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

// ============ SECTION HEADER ============
export function SectionHeader({ title, subtitle, colors, actionLabel, onAction }) {
    return (
        <View style={styles.sectionHeader}>
            <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
                )}
            </View>
            {actionLabel && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={[styles.sectionAction, { color: COLORS.primary }]}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// ============ PREMIUM BADGE ============
export function PremiumBadge({ small }) {
    return (
        <LinearGradient
            colors={COLORS.gradients.premium}
            style={[styles.premiumBadge, small && styles.premiumBadgeSmall]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <Text style={[styles.premiumText, small && styles.premiumTextSmall]}>👑 PRO</Text>
        </LinearGradient>
    );
}

// ============ EMPTY STATE ============
export function EmptyState({ icon, title, subtitle, buttonLabel, onPress, colors }) {
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{icon}</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            {buttonLabel && (
                <TouchableOpacity onPress={onPress}>
                    <LinearGradient colors={COLORS.gradients.primary} style={styles.emptyButton}>
                        <Text style={styles.emptyButtonText}>{buttonLabel}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Glass Card
    glassCard: {
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        padding: SPACING.md,
    },

    // Stat Card
    statCard: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        marginHorizontal: SPACING.xs,
    },
    statIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    statIconGradient: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    statIcon: { fontSize: 20 },
    statValue: { fontSize: 22, fontWeight: '700' },
    statLabel: { fontSize: 11, marginTop: 2 },

    // Quick Action
    quickAction: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
        marginHorizontal: SPACING.xs,
        overflow: 'hidden',
    },
    quickActionGradient: {
        padding: SPACING.md,
        alignItems: 'center',
    },
    quickActionIcon: { fontSize: 24, marginBottom: SPACING.xs },
    quickActionLabel: { fontSize: 12, fontWeight: '500' },
    quickActionLabelWhite: { fontSize: 12, fontWeight: '600', color: '#fff' },

    // CV Card
    cvCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    cvCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    cvEmojiBadge: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cvEmoji: { fontSize: 22 },
    cvInfo: { flex: 1, marginLeft: SPACING.md },
    cvName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    cvMeta: { flexDirection: 'row', alignItems: 'center' },
    templateBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
        marginRight: SPACING.sm,
    },
    templateName: { fontSize: 11, fontWeight: '500', textTransform: 'capitalize' },
    cvDate: { fontSize: 12 },
    cvActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.sm },
    cvActionBtn: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    sectionSubtitle: { fontSize: 13, marginTop: 2 },
    sectionAction: { fontSize: 14, fontWeight: '600' },

    // Premium Badge
    premiumBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    premiumBadgeSmall: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
    },
    premiumText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    premiumTextSmall: { fontSize: 10 },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyIcon: { fontSize: 64, marginBottom: SPACING.md },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: SPACING.sm, textAlign: 'center' },
    emptySubtitle: { fontSize: 14, textAlign: 'center', marginBottom: SPACING.lg },
    emptyButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
    },
    emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
