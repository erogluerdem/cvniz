import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform,
    Animated, Dimensions, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCV } from '../context/CVContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

const { width } = Dimensions.get('window');

// ============ MODERN ANIMATED SECTION ============
function Section({ title, iconName, children, expanded, onToggle, onAdd, addLabel, badge, color = COLORS.primary }) {
    const heightAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;
    const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(heightAnim, { toValue: expanded ? 1 : 0, friction: 8, useNativeDriver: false }),
            Animated.spring(rotateAnim, { toValue: expanded ? 1 : 0, friction: 8, useNativeDriver: true }),
        ]).start();
    }, [expanded]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle?.();
    };

    const handleAdd = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onAdd?.();
    };

    return (
        <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={handleToggle} activeOpacity={0.8}>
                <View style={styles.sectionLeft}>
                    <LinearGradient
                        colors={[color, color + 'DD']}
                        style={styles.sectionIconBox}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Feather name={iconName} size={18} color="#FFF" />
                    </LinearGradient>
                    <View>
                        <Text style={styles.sectionTitle}>{title}</Text>
                        {badge > 0 && (
                            <Text style={styles.sectionBadge}>{badge} öğe</Text>
                        )}
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <Feather name="chevron-down" size={20} color={COLORS.textTertiary} />
                </Animated.View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.sectionContent}>
                    {children}
                    {onAdd && (
                        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#F8FAFC', '#F1F5F9']}
                                style={styles.addButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Feather name="plus" size={16} color={color} />
                                <Text style={[styles.addButtonText, { color }]}>{addLabel || 'Ekle'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

// ============ MODERN INPUT FIELD ============
function InputField({ label, value, onChangeText, placeholder, multiline, iconName, color = COLORS.primary }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.inputGroup}>
            <View style={styles.inputLabelContainer}>
                {iconName && <Feather name={iconName} size={14} color={color} style={styles.inputLabelIcon} />}
                <Text style={styles.inputLabel}>{label}</Text>
            </View>
            <TextInput
                style={[
                    styles.textInput,
                    multiline && styles.textArea,
                    isFocused && [styles.textInputFocused, { borderColor: color }]
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
}

// ============ MODERN EXPERIENCE CARD ============
function ExperienceCard({ item, index, onEdit, onDelete }) {
    const handleEdit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onEdit(index);
    };

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onDelete(index);
    };

    return (
        <View style={styles.itemCard}>
            <View style={styles.itemTimeline}>
                <View style={[styles.itemDot, { backgroundColor: COLORS.primary }]} />
                <View style={[styles.itemLine, { backgroundColor: `${COLORS.primary}30` }]} />
            </View>
            <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.position || 'Pozisyon'}</Text>
                        <Text style={styles.itemCompany}>{item.company || 'Şirket'}</Text>
                        <View style={styles.itemDateRow}>
                            <Feather name="calendar" size={12} color={COLORS.textTertiary} />
                            <Text style={styles.itemDate}>
                                {item.startDate || 'Başlangıç'} - {item.current ? 'Devam Ediyor' : (item.endDate || 'Bitiş')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.itemActions}>
                        <TouchableOpacity style={[styles.itemActionBtn, { backgroundColor: `${COLORS.primary}15` }]} onPress={handleEdit}>
                            <Feather name="edit-2" size={14} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.itemActionBtn, { backgroundColor: `${COLORS.error}15` }]} onPress={handleDelete}>
                            <Feather name="trash-2" size={14} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>
                {item.description && (
                    <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                )}
            </View>
        </View>
    );
}

// ============ MODERN EDUCATION CARD ============
function EducationCard({ item, index, onEdit, onDelete }) {
    const handleEdit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onEdit(index);
    };

    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onDelete(index);
    };

    return (
        <View style={styles.itemCard}>
            <View style={styles.itemTimeline}>
                <View style={[styles.itemDot, { backgroundColor: COLORS.success }]} />
                <View style={[styles.itemLine, { backgroundColor: `${COLORS.success}30` }]} />
            </View>
            <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.degree || 'Derece'}</Text>
                        <Text style={styles.itemCompany}>{item.school || 'Okul'}</Text>
                        <View style={styles.itemDateRow}>
                            <Feather name="book" size={12} color={COLORS.textTertiary} />
                            <Text style={styles.itemDate}>
                                {item.startDate || 'Başlangıç'} - {item.endDate || 'Bitiş'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.itemActions}>
                        <TouchableOpacity style={[styles.itemActionBtn, { backgroundColor: `${COLORS.success}15` }]} onPress={handleEdit}>
                            <Feather name="edit-2" size={14} color={COLORS.success} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.itemActionBtn, { backgroundColor: `${COLORS.error}15` }]} onPress={handleDelete}>
                            <Feather name="trash-2" size={14} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

// ============ MODERN SKILL TAG ============
function SkillTag({ skill, onDelete }) {
    const handleDelete = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onDelete?.();
    };

    return (
        <View style={styles.skillTag}>
            <Feather name="zap" size={12} color={COLORS.primary} style={styles.skillIcon} />
            <Text style={styles.skillText}>{skill}</Text>
            <TouchableOpacity onPress={handleDelete} style={styles.skillDelete}>
                <Feather name="x" size={12} color={COLORS.textTertiary} />
            </TouchableOpacity>
        </View>
    );
}

// ============ EDIT MODAL ============
function EditModal({ visible, onClose, onSave, title, fields, data, setData }) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                    style={styles.modalWrapper}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                                <Feather name="x" size={20} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            {fields.map((field, i) => (
                                <InputField
                                    key={i}
                                    label={field.label}
                                    value={data[field.key] || ''}
                                    onChangeText={(v) => setData(prev => ({ ...prev, [field.key]: v }))}
                                    placeholder={field.placeholder}
                                    multiline={field.multiline}
                                    icon={field.icon}
                                />
                            ))}
                        </ScrollView>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                                <Text style={styles.modalCancelText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSave} activeOpacity={0.8}>
                                <LinearGradient
                                    colors={['#6366F1', '#8B5CF6']}
                                    style={styles.modalSaveBtn}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Feather name="save" size={16} color="#FFF" />
                                    <Text style={styles.modalSaveText}>Kaydet</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

// ============ PREVIEW MODAL ============
function PreviewModal({ visible, onClose, cvData }) {
    const { personalInfo, experience = [], education = [], skills = [] } = cvData.data;
    
    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.previewContainer}>
                <StatusBar barStyle="light-content" />
                
                {/* Header */}
                <LinearGradient
                    colors={['#0F172A', '#1E293B']}
                    style={styles.previewHeader}
                >
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }} style={styles.previewBackBtn}>
                        <View style={styles.previewBackContent}>
                            <Feather name="arrow-left" size={18} color="#FFF" />
                            <Text style={styles.previewBackText}>Geri</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.previewHeaderTitle}>CV Önizleme</Text>
                    <View style={{ width: 60 }} />
                </LinearGradient>

                <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
                    {/* Profile Card */}
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6', '#A855F7']}
                        style={styles.previewProfileCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.previewAvatar}>
                            <Text style={styles.previewAvatarText}>
                                {(personalInfo.fullName || 'CV').split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </Text>
                        </View>
                        <Text style={styles.previewName}>{personalInfo.fullName || 'Adınız Soyadınız'}</Text>
                        <Text style={styles.previewJobTitle}>{personalInfo.title || 'Ünvanınız'}</Text>
                        
                        <View style={styles.previewContactRow}>
                            {personalInfo.email && (
                                <View style={styles.previewContactItem}>
                                    <Text style={styles.previewContactIcon}>✉️</Text>
                                    <Text style={styles.previewContactText}>{personalInfo.email}</Text>
                                </View>
                            )}
                            {personalInfo.phone && (
                                <View style={styles.previewContactItem}>
                                    <Text style={styles.previewContactIcon}>📱</Text>
                                    <Text style={styles.previewContactText}>{personalInfo.phone}</Text>
                                </View>
                            )}
                            {personalInfo.location && (
                                <View style={styles.previewContactItem}>
                                    <Text style={styles.previewContactIcon}>📍</Text>
                                    <Text style={styles.previewContactText}>{personalInfo.location}</Text>
                                </View>
                            )}
                        </View>
                    </LinearGradient>

                    {/* Summary */}
                    {personalInfo.summary && (
                        <View style={styles.previewSection}>
                            <Text style={styles.previewSectionTitle}>📝 Hakkında</Text>
                            <Text style={styles.previewSummaryText}>{personalInfo.summary}</Text>
                        </View>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <View style={styles.previewSection}>
                            <Text style={styles.previewSectionTitle}>💼 Deneyim</Text>
                            {experience.map((exp, i) => (
                                <View key={i} style={styles.previewExpItem}>
                                    <View style={styles.previewExpDot} />
                                    <View style={styles.previewExpContent}>
                                        <Text style={styles.previewExpPosition}>{exp.position}</Text>
                                        <Text style={styles.previewExpCompany}>{exp.company}</Text>
                                        <Text style={styles.previewExpDate}>
                                            {exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}
                                        </Text>
                                        {exp.description && (
                                            <Text style={styles.previewExpDesc}>{exp.description}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <View style={styles.previewSection}>
                            <Text style={styles.previewSectionTitle}>🎓 Eğitim</Text>
                            {education.map((edu, i) => (
                                <View key={i} style={styles.previewEduItem}>
                                    <Text style={styles.previewEduDegree}>{edu.degree}</Text>
                                    <Text style={styles.previewEduSchool}>{edu.school}</Text>
                                    <Text style={styles.previewEduDate}>{edu.startDate} - {edu.endDate}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <View style={styles.previewSection}>
                            <Text style={styles.previewSectionTitle}>⚡ Yetenekler</Text>
                            <View style={styles.previewSkills}>
                                {skills.map((skill, i) => (
                                    <View key={i} style={styles.previewSkillTag}>
                                        <Text style={styles.previewSkillText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
}

// ============ MAIN COMPONENT ============
export default function EditorScreen({ route, navigation }) {
    const { cvId } = route.params || {};
    const { getCV, updateCV, createCV } = useCV();
    const { colors } = useTheme();

    const [loading, setLoading] = useState(!!cvId);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [cvData, setCvData] = useState({
        name: 'Yeni CV',
        template: 'modern',
        data: {
            personalInfo: { fullName: '', title: '', email: '', phone: '', summary: '', location: '', linkedin: '' },
            experience: [],
            education: [],
            skills: []
        }
    });
    const [expandedSections, setExpandedSections] = useState({ 
        personal: true, 
        experience: false, 
        education: false, 
        skills: false 
    });

    // Modal states
    const [expModal, setExpModal] = useState({ visible: false, index: -1 });
    const [eduModal, setEduModal] = useState({ visible: false, index: -1 });
    const [expData, setExpData] = useState({});
    const [eduData, setEduData] = useState({});
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (cvId) {
            const result = getCV(cvId);
            if (result.success) {
                setCvData(result.cv);
            }
            setLoading(false);
        }
    }, [cvId]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const updatePersonalInfo = (field, value) => {
        setCvData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                personalInfo: { ...prev.data.personalInfo, [field]: value }
            }
        }));
    };

    // Experience handlers
    const openAddExperience = () => { setExpData({}); setExpModal({ visible: true, index: -1 }); };
    const openEditExperience = (index) => { setExpData(cvData.data.experience[index]); setExpModal({ visible: true, index }); };
    const saveExperience = () => {
        setCvData(prev => {
            const newExp = [...prev.data.experience];
            if (expModal.index === -1) newExp.push(expData);
            else newExp[expModal.index] = expData;
            return { ...prev, data: { ...prev.data, experience: newExp } };
        });
        setExpModal({ visible: false, index: -1 });
    };
    const deleteExperience = (index) => {
        Alert.alert('Sil', 'Bu deneyimi silmek istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Sil', style: 'destructive', onPress: () => {
                setCvData(prev => ({
                    ...prev,
                    data: { ...prev.data, experience: prev.data.experience.filter((_, i) => i !== index) }
                }));
            }}
        ]);
    };

    // Education handlers
    const openAddEducation = () => { setEduData({}); setEduModal({ visible: true, index: -1 }); };
    const openEditEducation = (index) => { setEduData(cvData.data.education[index]); setEduModal({ visible: true, index }); };
    const saveEducation = () => {
        setCvData(prev => {
            const newEdu = [...prev.data.education];
            if (eduModal.index === -1) newEdu.push(eduData);
            else newEdu[eduModal.index] = eduData;
            return { ...prev, data: { ...prev.data, education: newEdu } };
        });
        setEduModal({ visible: false, index: -1 });
    };
    const deleteEducation = (index) => {
        Alert.alert('Sil', 'Bu eğitimi silmek istediğinize emin misiniz?', [
            { text: 'İptal', style: 'cancel' },
            { text: 'Sil', style: 'destructive', onPress: () => {
                setCvData(prev => ({
                    ...prev,
                    data: { ...prev.data, education: prev.data.education.filter((_, i) => i !== index) }
                }));
            }}
        ]);
    };

    // Skills handlers
    const addSkill = () => {
        if (newSkill.trim()) {
            setCvData(prev => ({
                ...prev,
                data: { ...prev.data, skills: [...prev.data.skills, newSkill.trim()] }
            }));
            setNewSkill('');
        }
    };
    const deleteSkill = (index) => {
        setCvData(prev => ({
            ...prev,
            data: { ...prev.data, skills: prev.data.skills.filter((_, i) => i !== index) }
        }));
    };

    const handleSave = async () => {
        if (!cvData.name.trim()) {
            Alert.alert('Uyarı', 'CV adı gerekli');
            return;
        }
        setSaving(true);
        const result = cvId
            ? await updateCV(cvId, { name: cvData.name, template: cvData.template, data: cvData.data })
            : await createCV({ name: cvData.name, template: cvData.template, data: cvData.data });
        setSaving(false);
        if (result.success) navigation.goBack();
        else Alert.alert('Hata', result.error);
    };

    // Completion percentage
    const calculateCompletion = () => {
        let total = 0;
        let filled = 0;
        const pi = cvData.data.personalInfo;
        ['fullName', 'title', 'email', 'phone', 'location', 'summary'].forEach(key => {
            total++;
            if (pi[key]) filled++;
        });
        total += 2;
        if (cvData.data.experience.length > 0) filled++;
        if (cvData.data.education.length > 0) filled++;
        total++;
        if (cvData.data.skills.length > 0) filled++;
        return Math.round((filled / total) * 100);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingLogo}>
                    <Feather name="file-text" size={32} color={COLORS.primary} />
                </View>
                <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 24 }} />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    const experienceFields = [
        { key: 'company', label: 'Şirket', placeholder: 'Şirket adı', iconName: 'briefcase' },
        { key: 'position', label: 'Pozisyon', placeholder: 'Pozisyon', iconName: 'user' },
        { key: 'startDate', label: 'Başlangıç', placeholder: 'Ocak 2020', iconName: 'calendar' },
        { key: 'endDate', label: 'Bitiş', placeholder: 'Şubat 2023', iconName: 'calendar' },
        { key: 'description', label: 'Açıklama', placeholder: 'Görev tanımı...', multiline: true, iconName: 'align-left' },
    ];

    const educationFields = [
        { key: 'school', label: 'Okul', placeholder: 'Üniversite/Okul adı', iconName: 'home' },
        { key: 'degree', label: 'Derece', placeholder: 'Lisans, Yüksek Lisans vb.', iconName: 'award' },
        { key: 'startDate', label: 'Başlangıç', placeholder: '2016', iconName: 'calendar' },
        { key: 'endDate', label: 'Bitiş', placeholder: '2020', iconName: 'calendar' },
    ];

    const completion = calculateCompletion();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <LinearGradient
                colors={['#0F172A', '#1E293B']}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.goBack(); }} style={styles.backBtn}>
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{cvId ? 'CV Düzenle' : 'Yeni CV'}</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.previewBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowPreview(true); }}>
                            <Feather name="eye" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); handleSave(); }} disabled={saving} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={styles.saveBtn}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <View style={styles.saveBtnContent}>
                                        <Feather name="save" size={16} color="#FFF" />
                                        <Text style={styles.saveBtnText}>Kaydet</Text>
                                    </View>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressLabel}>Tamamlanma</Text>
                        <Text style={styles.progressPercent}>{completion}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#6366F1', '#8B5CF6']}
                            style={[styles.progressFill, { width: `${completion}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </View>
                </View>
            </LinearGradient>

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CV Name */}
                <View style={styles.nameCard}>
                    <View style={styles.nameIcon}>
                        <Feather name="file-text" size={20} color={COLORS.primary} />
                    </View>
                    <TextInput
                        style={styles.nameInput}
                        value={cvData.name}
                        onChangeText={(text) => setCvData(prev => ({ ...prev, name: text }))}
                        placeholder="CV Adı"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Sections */}
                <Section
                    title="Kişisel Bilgiler"
                    iconName="user"
                    color={COLORS.primary}
                    expanded={expandedSections.personal}
                    onToggle={() => toggleSection('personal')}
                >
                    <InputField label="Ad Soyad" value={cvData.data.personalInfo.fullName} onChangeText={(v) => updatePersonalInfo('fullName', v)} placeholder="Adınız Soyadınız" iconName="user" />
                    <InputField label="Ünvan" value={cvData.data.personalInfo.title} onChangeText={(v) => updatePersonalInfo('title', v)} placeholder="ör. Yazılım Mühendisi" iconName="briefcase" />
                    <InputField label="E-posta" value={cvData.data.personalInfo.email} onChangeText={(v) => updatePersonalInfo('email', v)} placeholder="ornek@email.com" iconName="mail" />
                    <InputField label="Telefon" value={cvData.data.personalInfo.phone} onChangeText={(v) => updatePersonalInfo('phone', v)} placeholder="+90 555 123 4567" iconName="phone" />
                    <InputField label="Konum" value={cvData.data.personalInfo.location} onChangeText={(v) => updatePersonalInfo('location', v)} placeholder="İstanbul, Türkiye" iconName="map-pin" />
                    <InputField label="LinkedIn" value={cvData.data.personalInfo.linkedin} onChangeText={(v) => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/kullanici" iconName="linkedin" />
                    <InputField label="Özet" value={cvData.data.personalInfo.summary} onChangeText={(v) => updatePersonalInfo('summary', v)} placeholder="Kendinizi kısaca tanıtın..." multiline iconName="align-left" />
                </Section>

                <Section
                    title="İş Deneyimi"
                    iconName="briefcase"
                    color={COLORS.primary}
                    badge={cvData.data.experience.length}
                    expanded={expandedSections.experience}
                    onToggle={() => toggleSection('experience')}
                    onAdd={openAddExperience}
                    addLabel="Deneyim Ekle"
                >
                    {cvData.data.experience.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Feather name="briefcase" size={32} color={COLORS.textTertiary} style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>Henüz iş deneyimi eklenmedi</Text>
                            <Text style={styles.emptyHint}>İlk deneyiminizi eklemek için aşağıdaki butona tıklayın</Text>
                        </View>
                    ) : (
                        cvData.data.experience.map((item, i) => (
                            <ExperienceCard key={i} item={item} index={i} onEdit={openEditExperience} onDelete={deleteExperience} />
                        ))
                    )}
                </Section>

                <Section
                    title="Eğitim"
                    iconName="book"
                    color={COLORS.success}
                    badge={cvData.data.education.length}
                    expanded={expandedSections.education}
                    onToggle={() => toggleSection('education')}
                    onAdd={openAddEducation}
                    addLabel="Eğitim Ekle"
                >
                    {cvData.data.education.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Feather name="book" size={32} color={COLORS.success} style={styles.emptyIcon} />
                            <Text style={styles.emptyText}>Henüz eğitim bilgisi eklenmedi</Text>
                            <Text style={styles.emptyHint}>Eğitim geçmişinizi eklemek için butona tıklayın</Text>
                        </View>
                    ) : (
                        cvData.data.education.map((item, i) => (
                            <EducationCard key={i} item={item} index={i} onEdit={openEditEducation} onDelete={deleteEducation} />
                        ))
                    )}
                </Section>

                <Section
                    title="Yetenekler"
                    iconName="zap"
                    color={COLORS.accent}
                    badge={cvData.data.skills.length}
                    expanded={expandedSections.skills}
                    onToggle={() => toggleSection('skills')}
                >
                    <View style={styles.skillsContainer}>
                        {cvData.data.skills.map((skill, i) => (
                            <SkillTag key={i} skill={skill} onDelete={() => deleteSkill(i)} />
                        ))}
                    </View>
                    <View style={styles.skillInputRow}>
                        <TextInput
                            style={styles.skillInput}
                            value={newSkill}
                            onChangeText={setNewSkill}
                            placeholder="Yeni yetenek ekle..."
                            placeholderTextColor="#9CA3AF"
                            onSubmitEditing={addSkill}
                            returnKeyType="done"
                        />
                        <TouchableOpacity onPress={addSkill} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#6366F1', '#8B5CF6']}
                                style={styles.skillAddBtn}
                            >
                                <Feather name="plus" size={20} color="#FFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Section>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modals */}
            <EditModal
                visible={expModal.visible}
                onClose={() => setExpModal({ visible: false, index: -1 })}
                onSave={saveExperience}
                title={expModal.index === -1 ? 'Deneyim Ekle' : 'Deneyim Düzenle'}
                fields={experienceFields}
                data={expData}
                setData={setExpData}
            />
            <EditModal
                visible={eduModal.visible}
                onClose={() => setEduModal({ visible: false, index: -1 })}
                onSave={saveEducation}
                title={eduModal.index === -1 ? 'Eğitim Ekle' : 'Eğitim Düzenle'}
                fields={educationFields}
                data={eduData}
                setData={setEduData}
            />
            <PreviewModal
                visible={showPreview}
                onClose={() => setShowPreview(false)}
                cvData={cvData}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8FAFC' 
    },
    
    // Loading
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F8FAFC'
    },
    loadingLogo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingLogoText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748B',
    },

    // Header
    header: { 
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backBtn: { 
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerTitle: { 
        flex: 1, 
        color: '#FFFFFF', 
        fontSize: 20, 
        fontWeight: '700',
        textAlign: 'center',
    },
    headerActions: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8,
    },
    previewBtn: { 
        width: 40, 
        height: 40, 
        borderRadius: 12, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    previewBackContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    saveBtn: { 
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        borderRadius: 12,
    },
    saveBtnText: { 
        color: '#FFFFFF', 
        fontSize: 14, 
        fontWeight: '600',
    },
    inputLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    inputLabelIcon: {
        marginTop: 1,
    },
    skillIcon: {
        marginRight: 4,
    },

    // Progress
    progressContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 12,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    },
    progressPercent: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },

    // Scroll
    scrollView: { 
        flex: 1,
    },
    scrollContent: { 
        padding: 16, 
        gap: 16,
    },

    // Name Card
    nameCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    nameIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    nameIconText: {
        fontSize: 24,
    },
    nameInput: { 
        flex: 1, 
        fontSize: 18, 
        fontWeight: '700',
        color: '#0F172A',
    },

    // Section
    section: { 
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: { 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    sectionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIconBox: { 
        width: 44, 
        height: 44, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12,
    },
    sectionIcon: {
        fontSize: 20,
    },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: '700',
        color: '#0F172A',
    },
    sectionBadge: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    sectionContent: { 
        padding: 16, 
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },

    // Input
    inputGroup: { 
        marginBottom: 16,
    },
    inputLabel: { 
        fontSize: 13, 
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    textInput: { 
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12, 
        padding: 14, 
        fontSize: 15,
        color: '#0F172A',
    },
    textInputFocused: {
        borderColor: '#6366F1',
        backgroundColor: '#FFFFFF',
    },
    textArea: { 
        height: 100, 
        textAlignVertical: 'top',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    emptyText: { 
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    emptyHint: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
    },

    // Item Cards
    itemCard: { 
        flexDirection: 'row',
        marginBottom: 12,
    },
    itemTimeline: {
        alignItems: 'center',
        marginRight: 12,
    },
    itemDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#6366F1',
    },
    itemLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#E0E7FF',
        marginTop: 4,
    },
    itemContent: { 
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
    },
    itemHeader: {
        flexDirection: 'row',
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: { 
        fontSize: 15, 
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    itemCompany: { 
        fontSize: 14, 
        fontWeight: '600',
        color: '#6366F1',
        marginBottom: 4,
    },
    itemDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    itemDate: { 
        fontSize: 12,
        color: '#64748B',
    },
    itemDescription: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 8,
        lineHeight: 18,
    },
    itemActions: { 
        flexDirection: 'row', 
        gap: 6,
    },
    itemActionBtn: { 
        width: 32, 
        height: 32, 
        borderRadius: 8, 
        backgroundColor: '#E0E7FF',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    itemDeleteBtn: {
        backgroundColor: '#FEE2E2',
    },

    // Skills
    skillsContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginBottom: 12,
        gap: 8,
    },
    skillTag: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12, 
        paddingVertical: 8, 
        borderRadius: 20,
    },
    skillText: { 
        fontSize: 14, 
        fontWeight: '500',
        color: '#6366F1',
    },
    skillDelete: { 
        marginLeft: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skillDeleteText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    skillInputRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8,
    },
    skillInput: { 
        flex: 1, 
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12, 
        padding: 12, 
        fontSize: 15,
        color: '#0F172A',
    },
    skillAddBtn: { 
        width: 48, 
        height: 48, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    skillAddText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
    },

    // Add Button
    addButton: { 
        marginTop: 8,
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 12, 
        padding: 14,
    },
    addButtonText: { 
        fontSize: 15, 
        fontWeight: '600',
    },

    // Modal
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'flex-end',
    },
    modalWrapper: { 
        maxHeight: '90%',
    },
    modalContent: { 
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24, 
        borderTopRightRadius: 24,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
    },
    modalHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20,
        borderBottomWidth: 1, 
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: '700',
        color: '#0F172A',
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        color: '#64748B',
    },
    modalBody: { 
        padding: 20,
        maxHeight: 400,
    },
    modalFooter: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        gap: 12, 
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    modalCancelBtn: { 
        paddingHorizontal: 24, 
        paddingVertical: 14, 
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    modalCancelText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '600',
    },
    modalSaveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    modalSaveText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },

    // Preview
    previewContainer: { 
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    previewBackBtn: {
        width: 60,
    },
    previewBackText: {
        color: '#94A3B8',
        fontSize: 16,
    },
    previewHeaderTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    previewScroll: {
        flex: 1,
    },
    previewProfileCard: {
        margin: 16,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    previewAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    previewAvatarText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    previewName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    previewJobTitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        marginBottom: 16,
    },
    previewContactRow: {
        width: '100%',
    },
    previewContactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    previewContactIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    previewContactText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    previewSection: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
    },
    previewSectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 16,
    },
    previewSummaryText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#64748B',
    },
    previewExpItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    previewExpDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#6366F1',
        marginRight: 12,
        marginTop: 5,
    },
    previewExpContent: {
        flex: 1,
    },
    previewExpPosition: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    previewExpCompany: {
        fontSize: 14,
        color: '#6366F1',
        marginTop: 2,
    },
    previewExpDate: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    previewExpDesc: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 8,
        lineHeight: 18,
    },
    previewEduItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    previewEduDegree: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },
    previewEduSchool: {
        fontSize: 14,
        color: '#6366F1',
        marginTop: 2,
    },
    previewEduDate: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    previewSkills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    previewSkillTag: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    previewSkillText: {
        color: '#6366F1',
        fontSize: 14,
        fontWeight: '500',
    },
});
