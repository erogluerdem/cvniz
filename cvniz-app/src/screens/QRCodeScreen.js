import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, Share, Alert, Platform, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// QR Code Component (Simple SVG-like pattern)
function QRCodePattern({ size = 180, data }) {
    // Create a simple pattern grid to simulate QR code
    const gridSize = 15;
    const cellSize = size / gridSize;
    
    // Generate pseudo-random pattern based on data
    const generatePattern = () => {
        const pattern = [];
        const hash = data.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            // Create visually interesting pattern
            const isBorder = i < gridSize || i >= gridSize * (gridSize - 1) || 
                           i % gridSize === 0 || i % gridSize === gridSize - 1;
            const isCorner = (i < gridSize * 3 && (i % gridSize < 3 || i % gridSize >= gridSize - 3)) ||
                           (i >= gridSize * (gridSize - 3) && (i % gridSize < 3 || i % gridSize >= gridSize - 3));
            const fill = isCorner || ((hash + i) % 3 === 0);
            pattern.push(fill);
        }
        return pattern;
    };

    const pattern = generatePattern();

    return (
        <View style={[styles.qrContainer, { width: size, height: size }]}>
            <View style={styles.qrGrid}>
                {pattern.map((filled, index) => (
                    <View
                        key={index}
                        style={[
                            styles.qrCell,
                            { 
                                width: cellSize - 1, 
                                height: cellSize - 1,
                                backgroundColor: filled ? '#0F172A' : '#FFFFFF'
                            }
                        ]}
                    />
                ))}
            </View>
            {/* Center logo */}
            <View style={styles.qrLogo}>
                <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={styles.qrLogoGradient}
                >
                    <Text style={styles.qrLogoText}>CV</Text>
                </LinearGradient>
            </View>
        </View>
    );
}

export default function QRCodeScreen({ navigation, route }) {
    const { user } = useAuth();
    const { cvs, selectedCV } = useCV();
    const [selectedStyle, setSelectedStyle] = useState('modern');
    
    const cv = cvs?.find(c => c.id === selectedCV) || cvs?.[0];
    const profileUrl = `https://CVniz.app/p/${user?.id || 'demo'}`;

    const cardStyles = {
        modern: {
            name: 'Modern',
            gradient: ['#6366F1', '#8B5CF6'],
            textColor: '#FFFFFF'
        },
        classic: {
            name: 'Klasik',
            gradient: ['#1F2937', '#374151'],
            textColor: '#FFFFFF'
        },
        minimal: {
            name: 'Minimal',
            gradient: ['#FFFFFF', '#F8FAFC'],
            textColor: '#0F172A'
        },
        ocean: {
            name: 'Okyanus',
            gradient: ['#0EA5E9', '#0284C7'],
            textColor: '#FFFFFF'
        },
        sunset: {
            name: 'Günbatımı',
            gradient: ['#F97316', '#EA580C'],
            textColor: '#FFFFFF'
        }
    };

    const currentStyle = cardStyles[selectedStyle];

    const handleShare = async () => {
        try {
            await Share.share({
                message: `📋 CV'm: ${profileUrl}`,
                url: profileUrl,
                title: 'CV\'mi Paylaş'
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopyLink = async () => {
        await Clipboard.setStringAsync(profileUrl);
        Alert.alert('✅ Kopyalandı', 'Link panoya kopyalandı!');
    };

    const handleDownload = () => {
        Alert.alert(
            '📥 İndir',
            'QR kod kartınız nasıl indirilsin?',
            [
                { text: 'PNG olarak', onPress: () => Alert.alert('İndiriliyor...', 'Kart PNG olarak kaydedildi.') },
                { text: 'PDF olarak', onPress: () => Alert.alert('İndiriliyor...', 'Kart PDF olarak kaydedildi.') },
                { text: 'Vazgeç', style: 'cancel' }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>📱 QR Kartvizit</Text>
                    <Text style={styles.headerSubtitle}>Dijital CV kartınız</Text>
                </View>
                <TouchableOpacity style={styles.shareHeaderBtn} onPress={handleShare}>
                    <Text style={styles.shareHeaderIcon}>↗</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* QR Card Preview */}
                <View style={styles.cardPreview}>
                    <LinearGradient
                        colors={currentStyle.gradient}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {/* Card Header */}
                        <View style={styles.cardHeader}>
                            <View style={[styles.avatar, { borderColor: currentStyle.textColor + '40' }]}>
                                <Text style={[styles.avatarText, { color: currentStyle.textColor }]}>
                                    {user?.name?.charAt(0) || 'U'}
                                </Text>
                            </View>
                            <Text style={[styles.cardName, { color: currentStyle.textColor }]}>
                                {user?.name || 'Kullanıcı'}
                            </Text>
                            <Text style={[styles.cardTitle, { color: currentStyle.textColor + 'CC' }]}>
                                {cv?.data?.personalInfo?.title || 'Profesyonel'}
                            </Text>
                        </View>

                        {/* QR Code */}
                        <View style={styles.qrWrapper}>
                            <View style={styles.qrBackground}>
                                <QRCodePattern size={160} data={profileUrl} />
                            </View>
                        </View>

                        {/* Card Footer */}
                        <View style={styles.cardFooter}>
                            <Text style={[styles.cardUrl, { color: currentStyle.textColor + 'AA' }]}>
                                CVniz.app/p/{user?.id?.slice(0, 8) || 'demo'}
                            </Text>
                            <View style={styles.cardBrand}>
                                <Text style={[styles.cardBrandText, { color: currentStyle.textColor }]}>
                                    CVniz
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Style Selector */}
                <Text style={styles.sectionTitle}>🎨 Kart Stili</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.styleScroll}
                    contentContainerStyle={styles.styleContent}
                >
                    {Object.entries(cardStyles).map(([key, style]) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.styleOption,
                                selectedStyle === key && styles.styleOptionActive
                            ]}
                            onPress={() => setSelectedStyle(key)}
                        >
                            <LinearGradient
                                colors={style.gradient}
                                style={styles.stylePreview}
                            />
                            <Text style={styles.styleName}>{style.name}</Text>
                            {selectedStyle === key && (
                                <View style={styles.styleCheck}>
                                    <Text style={styles.styleCheckIcon}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Profile Link */}
                <View style={styles.linkCard}>
                    <View style={styles.linkHeader}>
                        <Text style={styles.linkIcon}>🔗</Text>
                        <Text style={styles.linkTitle}>Profil Linkiniz</Text>
                    </View>
                    <View style={styles.linkBox}>
                        <Text style={styles.linkUrl} numberOfLines={1}>{profileUrl}</Text>
                        <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink}>
                            <Text style={styles.copyIcon}>📋</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Tarama</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Görüntülenme</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Paylaşım</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionEmoji}>📥</Text>
                        </View>
                        <Text style={styles.actionText}>İndir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionEmoji}>↗️</Text>
                        </View>
                        <Text style={styles.actionText}>Paylaş</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleCopyLink}>
                        <View style={styles.actionIcon}>
                            <Text style={styles.actionEmoji}>📋</Text>
                        </View>
                        <Text style={styles.actionText}>Kopyala</Text>
                    </TouchableOpacity>
                </View>

                {/* Tips */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}>💡</Text>
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>İpucu</Text>
                        <Text style={styles.tipText}>
                            QR kodunuzu kartvizit arkasına veya LinkedIn profilinize ekleyebilirsiniz.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
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
    shareHeaderBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareHeaderIcon: {
        fontSize: 18,
        color: '#6366F1',
    },

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },

    // Card Preview
    cardPreview: {
        alignItems: 'center',
        marginBottom: 24,
    },
    cardGradient: {
        width: SCREEN_WIDTH - 64,
        aspectRatio: 0.6,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    cardHeader: {
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '700',
    },
    cardName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 14,
    },
    qrWrapper: {
        alignItems: 'center',
    },
    qrBackground: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
    },
    qrContainer: {
        position: 'relative',
    },
    qrGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    qrCell: {
        margin: 0.5,
    },
    qrLogo: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    qrLogoGradient: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrLogoText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    cardFooter: {
        alignItems: 'center',
    },
    cardUrl: {
        fontSize: 12,
        marginBottom: 8,
    },
    cardBrand: {},
    cardBrandText: {
        fontSize: 16,
        fontWeight: '700',
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 12,
    },

    // Style Selector
    styleScroll: {
        marginBottom: 24,
    },
    styleContent: {
        gap: 12,
    },
    styleOption: {
        alignItems: 'center',
        marginRight: 12,
    },
    styleOptionActive: {},
    stylePreview: {
        width: 56,
        height: 56,
        borderRadius: 16,
        marginBottom: 6,
    },
    styleName: {
        fontSize: 12,
        color: '#64748B',
    },
    styleCheck: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleCheckIcon: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // Link Card
    linkCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    linkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    linkIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    linkTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    linkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        padding: 12,
    },
    linkUrl: {
        flex: 1,
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '500',
    },
    copyBtn: {
        padding: 4,
    },
    copyIcon: {
        fontSize: 18,
    },

    // Stats Card
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },

    // Actions
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20,
    },
    actionBtn: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionEmoji: {
        fontSize: 24,
    },
    actionText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },

    // Tip Card
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 14,
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
        lineHeight: 18,
    },
});

