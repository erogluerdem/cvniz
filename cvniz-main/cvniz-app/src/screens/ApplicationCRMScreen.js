import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, TextInput, Alert, Platform, Modal, FlatList, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Status definitions
const STATUSES = [
    { id: 'wishlist', name: 'İlgileniyor', color: '#64748B', icon: '🎯' },
    { id: 'applied', name: 'Başvuruldu', color: '#3B82F6', icon: '📨' },
    { id: 'screening', name: 'Ön Eleme', color: '#06B6D4', icon: '🔍' },
    { id: 'interview', name: 'Mülakat', color: '#8B5CF6', icon: '🎤' },
    { id: 'offer', name: 'Teklif', color: '#10B981', icon: '🎉' },
    { id: 'rejected', name: 'Red', color: '#EF4444', icon: '❌' }
];

// Interview types
const INTERVIEW_TYPES = [
    { id: 'video', name: 'Video Görüşme', icon: '📹' },
    { id: 'phone', name: 'Telefon', icon: '📞' },
    { id: 'onsite', name: 'Yüz Yüze', icon: '🤝' }
];

// Mock data for development
const MOCK_APPLICATIONS = [
    { id: '1', company: 'Google', position: 'Frontend Developer', status: 'interview', salary: '80.000 TL', appliedAt: new Date().toISOString(), nextInterview: { date: '2025-01-05', type: 'video' } },
    { id: '2', company: 'Microsoft', position: 'React Developer', status: 'applied', salary: '70.000 TL', appliedAt: new Date().toISOString() },
    { id: '3', company: 'Amazon', position: 'Full Stack Dev', status: 'screening', salary: '85.000 TL', appliedAt: new Date().toISOString() },
    { id: '4', company: 'Meta', position: 'Software Engineer', status: 'wishlist', salary: '90.000 TL', appliedAt: new Date().toISOString() },
    { id: '5', company: 'Apple', position: 'iOS Developer', status: 'offer', salary: '95.000 TL', appliedAt: new Date().toISOString() },
    { id: '6', company: 'Netflix', position: 'Backend Dev', status: 'rejected', salary: '75.000 TL', appliedAt: new Date().toISOString() },
];

// Application Card Component
function ApplicationCard({ app, onPress, onStatusChange }) {
    const status = STATUSES.find(s => s.id === app.status);
    
    return (
        <TouchableOpacity
            style={styles.appCard}
            onPress={() => onPress(app)}
            activeOpacity={0.7}
        >
            <View style={styles.appHeader}>
                <View style={[styles.companyAvatar, { backgroundColor: status.color + '20' }]}>
                    <Text style={[styles.companyInitial, { color: status.color }]}>
                        {app.company.charAt(0)}
                    </Text>
                </View>
                <View style={styles.appInfo}>
                    <Text style={styles.companyName}>{app.company}</Text>
                    <Text style={styles.positionName}>{app.position}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <Text style={styles.statusIcon}>{status.icon}</Text>
                </View>
            </View>

            <View style={styles.appDetails}>
                {app.salary && (
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>💰</Text>
                        <Text style={styles.detailText}>{app.salary}</Text>
                    </View>
                )}
                {app.nextInterview && (
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailText}>{app.nextInterview.date}</Text>
                    </View>
                )}
            </View>

            {/* Quick Status Change */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.quickStatus}
            >
                {STATUSES.map(s => (
                    <TouchableOpacity
                        key={s.id}
                        style={[
                            styles.quickStatusBtn,
                            app.status === s.id && { backgroundColor: s.color + '30', borderColor: s.color }
                        ]}
                        onPress={() => onStatusChange(app.id, s.id)}
                    >
                        <Text style={styles.quickStatusIcon}>{s.icon}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </TouchableOpacity>
    );
}

// Add Application Modal
function AddModal({ visible, onClose, onAdd }) {
    const [form, setForm] = useState({
        company: '',
        position: '',
        jobUrl: '',
        salary: '',
        notes: ''
    });

    const handleAdd = () => {
        if (!form.company || !form.position) {
            Alert.alert('Uyarı', 'Şirket ve pozisyon zorunludur.');
            return;
        }
        onAdd(form);
        setForm({ company: '', position: '', jobUrl: '', salary: '', notes: '' });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>➕ Yeni Başvuru</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.modalClose}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <Text style={styles.inputLabel}>Şirket *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ör: Google"
                            placeholderTextColor="#94A3B8"
                            value={form.company}
                            onChangeText={(text) => setForm({ ...form, company: text })}
                        />

                        <Text style={styles.inputLabel}>Pozisyon *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ör: Frontend Developer"
                            placeholderTextColor="#94A3B8"
                            value={form.position}
                            onChangeText={(text) => setForm({ ...form, position: text })}
                        />

                        <Text style={styles.inputLabel}>İş İlanı URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://..."
                            placeholderTextColor="#94A3B8"
                            value={form.jobUrl}
                            onChangeText={(text) => setForm({ ...form, jobUrl: text })}
                        />

                        <Text style={styles.inputLabel}>Maaş Beklentisi</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ör: 50.000 TL"
                            placeholderTextColor="#94A3B8"
                            value={form.salary}
                            onChangeText={(text) => setForm({ ...form, salary: text })}
                        />

                        <Text style={styles.inputLabel}>Notlar</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ek notlar..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            value={form.notes}
                            onChangeText={(text) => setForm({ ...form, notes: text })}
                        />
                    </ScrollView>

                    <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                        <LinearGradient
                            colors={['#6366F1', '#8B5CF6']}
                            style={styles.addButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.addButtonText}>✓ Ekle</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default function ApplicationCRMScreen({ navigation }) {
    const { user, token } = useAuth();
    const [applications, setApplications] = useState(MOCK_APPLICATIONS);
    const [filteredApps, setFilteredApps] = useState(MOCK_APPLICATIONS);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Stats
    const stats = {
        total: applications.length,
        active: applications.filter(a => !['rejected', 'offer'].includes(a.status)).length,
        interviews: applications.filter(a => a.status === 'interview').length,
        offers: applications.filter(a => a.status === 'offer').length,
    };

    // Filter applications
    useEffect(() => {
        let filtered = [...applications];
        
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(a => a.status === selectedStatus);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a => 
                a.company.toLowerCase().includes(query) ||
                a.position.toLowerCase().includes(query)
            );
        }
        
        setFilteredApps(filtered);
    }, [applications, selectedStatus, searchQuery]);

    // Add application
    const handleAddApplication = async (form) => {
        const newApp = {
            id: Date.now().toString(),
            ...form,
            status: 'wishlist',
            appliedAt: new Date().toISOString()
        };
        setApplications([newApp, ...applications]);
        Alert.alert('Başarılı', 'Başvuru eklendi!');
    };

    // Update status
    const handleStatusChange = (appId, newStatus) => {
        setApplications(apps => 
            apps.map(app => 
                app.id === appId ? { ...app, status: newStatus } : app
            )
        );
    };

    // Delete application
    const handleDelete = (appId) => {
        Alert.alert(
            'Başvuruyu Sil',
            'Bu başvuruyu silmek istediğinize emin misiniz?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { 
                    text: 'Sil', 
                    style: 'destructive',
                    onPress: () => setApplications(apps => apps.filter(a => a.id !== appId))
                }
            ]
        );
    };

    const handleAppPress = (app) => {
        Alert.alert(
            app.company,
            `Pozisyon: ${app.position}\nDurum: ${STATUSES.find(s => s.id === app.status)?.name}\nMaaş: ${app.salary || 'Belirtilmemiş'}`,
            [
                { text: 'Kapat', style: 'cancel' },
                { text: 'Sil', style: 'destructive', onPress: () => handleDelete(app.id) }
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
                    <Text style={styles.headerTitle}>📋 Başvuru Takip</Text>
                    <Text style={styles.headerSubtitle}>{stats.total} başvuru</Text>
                </View>
                <TouchableOpacity 
                    style={styles.addHeaderBtn}
                    onPress={() => setShowAddModal(true)}
                >
                    <Text style={styles.addHeaderBtnText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
                    <Text style={styles.statValue}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Toplam</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={styles.statValue}>{stats.active}</Text>
                    <Text style={styles.statLabel}>Aktif</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
                    <Text style={styles.statValue}>{stats.interviews}</Text>
                    <Text style={styles.statLabel}>Mülakat</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={styles.statValue}>{stats.offers}</Text>
                    <Text style={styles.statLabel}>Teklif</Text>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Şirket veya pozisyon ara..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Status Filter */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                <TouchableOpacity
                    style={[styles.filterBtn, selectedStatus === 'all' && styles.filterBtnActive]}
                    onPress={() => setSelectedStatus('all')}
                >
                    <Text style={[styles.filterText, selectedStatus === 'all' && styles.filterTextActive]}>
                        Tümü
                    </Text>
                </TouchableOpacity>
                {STATUSES.map(status => (
                    <TouchableOpacity
                        key={status.id}
                        style={[
                            styles.filterBtn,
                            selectedStatus === status.id && { backgroundColor: status.color + '20', borderColor: status.color }
                        ]}
                        onPress={() => setSelectedStatus(status.id)}
                    >
                        <Text style={styles.filterIcon}>{status.icon}</Text>
                        <Text style={[styles.filterText, selectedStatus === status.id && { color: status.color }]}>
                            {status.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Applications List */}
            <FlatList
                data={filteredApps}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ApplicationCard
                        app={item}
                        onPress={handleAppPress}
                        onStatusChange={handleStatusChange}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>Başvuru Bulunamadı</Text>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'Aramanızla eşleşen sonuç yok.' : 'Henüz başvuru eklemediniz.'}
                        </Text>
                    </View>
                }
            />

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowAddModal(true)}
            >
                <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={styles.fabGradient}
                >
                    <Text style={styles.fabIcon}>+</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Add Modal */}
            <AddModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddApplication}
            />
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
    addHeaderBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addHeaderBtnText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '300',
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },

    // Search
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0F172A',
    },

    // Filter
    filterContainer: {
        maxHeight: 44,
        marginBottom: 12,
    },
    filterContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginRight: 8,
    },
    filterBtnActive: {
        backgroundColor: '#EEF2FF',
        borderColor: '#6366F1',
    },
    filterIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    filterText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#6366F1',
    },

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },

    // App Card
    appCard: {
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
    appHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    companyAvatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyInitial: {
        fontSize: 18,
        fontWeight: '700',
    },
    appInfo: {
        flex: 1,
        marginLeft: 12,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    positionName: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    statusBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIcon: {
        fontSize: 16,
    },
    appDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#64748B',
    },
    quickStatus: {
        flexDirection: 'row',
    },
    quickStatusBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    quickStatusIcon: {
        fontSize: 16,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },

    // FAB
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 100,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    fabGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabIcon: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '300',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalClose: {
        fontSize: 24,
        color: '#64748B',
    },
    modalBody: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    addButton: {
        margin: 20,
    },
    addButtonGradient: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
