// API Configuration
// For Android Emulator use: 'http://10.0.2.2:3001/api'
// For iOS Simulator use: 'http://localhost:3001/api'
// For physical device use your PC's IP: 'http://192.168.1.168:3001/api'
export const API_BASE_URL = __DEV__ 
    ? 'http://192.168.1.168:3001/api'  // Development
    : 'https://api.CVniz.com/api';      // Production

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'CVniz_auth_token',
    REFRESH_TOKEN: 'CVniz_refresh_token',
    USER: 'CVniz_user',
    CVS: 'CVniz_cvs',
    THEME: 'CVniz_theme',
    PENDING_SYNC: 'CVniz_pending_sync',
    LAST_SYNC: 'CVniz_last_sync'
};

// Colors - Premium Theme
export const COLORS = {
    // Premium Gradient Colors
    primary: '#6366F1',      // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    secondary: '#8B5CF6',    // Purple
    secondaryDark: '#7C3AED',
    accent: '#EC4899',       // Pink
    tertiary: '#06B6D4',     // Cyan
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Gradient presets
    gradients: {
        primary: ['#6366F1', '#8B5CF6'],
        secondary: ['#8B5CF6', '#EC4899'],
        premium: ['#F59E0B', '#EF4444'],
        success: ['#10B981', '#059669'],
        info: ['#3B82F6', '#0EA5E9'],
        dark: ['#1E293B', '#0F172A'],
        sunset: ['#F59E0B', '#EC4899'],
        ocean: ['#06B6D4', '#3B82F6'],
        aurora: ['#6366F1', '#EC4899', '#F59E0B'],
    },

    light: {
        background: '#FAFBFC',
        surface: '#FFFFFF',
        surfaceSecondary: '#F1F5F9',
        surfaceElevated: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        border: '#E2E8F0',
        borderLight: '#F1F5F9',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        surfaceSecondary: '#334155',
        surfaceElevated: '#1E293B',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: '#334155',
        borderLight: '#1E293B',
        cardBg: 'rgba(30, 41, 59, 0.95)',
        overlay: 'rgba(0, 0, 0, 0.7)',
    }
};

// Spacing
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Border Radius
export const BORDER_RADIUS = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 40,
    full: 9999,
};

// Shadow - Enhanced with Platform Support
import { Platform } from 'react-native';

const createShadow = (iosShadow, androidElevation) => {
    if (Platform.OS === 'ios') {
        return iosShadow;
    }
    return { elevation: androidElevation };
};

export const SHADOW = {
    none: {},
    xs: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
    }, 1),
    sm: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    }, 2),
    md: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    }, 4),
    lg: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
    }, 8),
    xl: createShadow({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 28,
    }, 12),
    glow: (color = '#6366F1') => createShadow({
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
    }, 8),
    soft: createShadow({
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
    }, 6),
};

// Typography
export const TYPOGRAPHY = {
    h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
    h2: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
    h3: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
    h4: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
    bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    captionSmall: { fontSize: 11, fontWeight: '500', lineHeight: 14 },
    button: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
    buttonSmall: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
    overline: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
};

// Animation Durations
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
    spring: {
        friction: 8,
        tension: 100,
    },
    springBouncy: {
        friction: 4,
        tension: 120,
    },
};

// Template Categories
export const TEMPLATE_CATEGORIES = [
    { id: 'all', name: 'Tümü', icon: '📋' },
    { id: 'popular', name: 'Popüler', icon: '⭐' },
    { id: 'modern', name: 'Modern', icon: '✨' },
    { id: 'professional', name: 'Profesyonel', icon: '💼' },
    { id: 'creative', name: 'Yaratıcı', icon: '🎨' },
    { id: 'tech', name: 'Teknoloji', icon: '💻' },
    { id: 'premium', name: 'Premium', icon: '👑' },
];

// All CV Templates (synced with web)
export const TEMPLATES = [
    // === POPULAR & BASIC (Free) ===
    { id: 'modern', name: 'Modern', category: 'popular', premium: false, color: '#3B82F6' },
    { id: 'minimalist', name: 'Minimalist', category: 'popular', premium: false, color: '#6B7280' },
    { id: 'creative', name: 'Yaratıcı', category: 'creative', premium: false, color: '#EC4899' },

    // === PROFESSIONAL ===
    { id: 'corporate', name: 'Kurumsal', category: 'professional', premium: true, color: '#1F2937' },
    { id: 'executive', name: 'Yönetici', category: 'professional', premium: true, color: '#7C3AED' },
    { id: 'elegant', name: 'Zarif', category: 'professional', premium: true, color: '#8B5CF6' },
    { id: 'consultant', name: 'Danışman', category: 'professional', premium: true, color: '#6366F1' },
    { id: 'freelancer', name: 'Freelancer', category: 'professional', premium: true, color: '#10B981' },
    { id: 'startup', name: 'Startup', category: 'professional', premium: true, color: '#F59E0B' },
    { id: 'international', name: 'Uluslararası', category: 'professional', premium: true, color: '#0EA5E9' },

    // === INDUSTRY SPECIFIC ===
    { id: 'tech', name: 'Teknoloji', category: 'tech', premium: true, color: '#06B6D4' },
    { id: 'healthcare', name: 'Sağlık', category: 'professional', premium: true, color: '#EF4444' },
    { id: 'academic', name: 'Akademik', category: 'professional', premium: true, color: '#1E40AF' },
    { id: 'finance', name: 'Finans', category: 'professional', premium: true, color: '#16A34A' },
    { id: 'legal', name: 'Hukuk', category: 'professional', premium: true, color: '#7C2D12' },
    { id: 'marketing', name: 'Pazarlama', category: 'creative', premium: true, color: '#DB2777' },
    { id: 'engineer', name: 'Mühendis', category: 'tech', premium: true, color: '#EA580C' },
    { id: 'retail', name: 'Perakende', category: 'professional', premium: true, color: '#65A30D' },
    { id: 'hospitality', name: 'Otelcilik', category: 'professional', premium: true, color: '#0891B2' },
    { id: 'government', name: 'Kamu', category: 'professional', premium: true, color: '#4338CA' },
    { id: 'portfolio', name: 'Portfolyo', category: 'creative', premium: true, color: '#A21CAF' },

    // === SPECIALIZED PROFESSIONAL ===
    { id: 'scientist', name: 'Bilim İnsanı', category: 'professional', premium: true, color: '#0D9488' },
    { id: 'artist', name: 'Sanatçı', category: 'creative', premium: true, color: '#F472B6' },
    { id: 'teacher', name: 'Öğretmen', category: 'professional', premium: true, color: '#2DD4BF' },
    { id: 'chef', name: 'Şef', category: 'professional', premium: true, color: '#FB923C' },
    { id: 'photographer', name: 'Fotoğrafçı', category: 'creative', premium: true, color: '#A3A3A3' },
    { id: 'musician', name: 'Müzisyen', category: 'creative', premium: true, color: '#8B5CF6' },
    { id: 'athlet', name: 'Sporcu', category: 'creative', premium: true, color: '#22C55E' },
    { id: 'pilot', name: 'Pilot', category: 'professional', premium: true, color: '#0284C7' },
    { id: 'construction', name: 'İnşaat', category: 'professional', premium: true, color: '#F97316' },
    { id: 'environment', name: 'Çevre', category: 'professional', premium: true, color: '#16A34A' },
    { id: 'journalist', name: 'Gazeteci', category: 'creative', premium: true, color: '#374151' },
    { id: 'nurse', name: 'Hemşire', category: 'professional', premium: true, color: '#EC4899' },
    { id: 'logistics', name: 'Lojistik', category: 'professional', premium: true, color: '#78716C' },
    { id: 'security', name: 'Güvenlik', category: 'professional', premium: true, color: '#1F2937' },
    { id: 'architect', name: 'Mimar', category: 'creative', premium: true, color: '#0F766E' },
    { id: 'hr', name: 'İK', category: 'professional', premium: true, color: '#7C3AED' },
    { id: 'datascience', name: 'Veri Bilimi', category: 'tech', premium: true, color: '#2563EB' },
    { id: 'gamer', name: 'Gamer', category: 'creative', premium: true, color: '#7C3AED' },
    { id: 'beauty', name: 'Güzellik', category: 'creative', premium: true, color: '#F9A8D4' },

    // === PRO VERSIONS ===
    { id: 'lawyer_pro', name: 'Avukat Pro', category: 'premium', premium: true, color: '#44403C' },
    { id: 'realestate', name: 'Emlak', category: 'professional', premium: true, color: '#059669' },
    { id: 'logistic_pro', name: 'Lojistik Pro', category: 'premium', premium: true, color: '#57534E' },
    { id: 'agriculture', name: 'Tarım', category: 'professional', premium: true, color: '#65A30D' },
    { id: 'media_pro', name: 'Medya Pro', category: 'premium', premium: true, color: '#DC2626' },
    { id: 'fitness', name: 'Fitness', category: 'creative', premium: true, color: '#EF4444' },
    { id: 'ecommerce', name: 'E-Ticaret', category: 'tech', premium: true, color: '#8B5CF6' },
    { id: 'tourism_elite', name: 'Turizm Elite', category: 'premium', premium: true, color: '#0EA5E9' },
    { id: 'fashion', name: 'Moda', category: 'creative', premium: true, color: '#EC4899' },
    { id: 'architecture_pro', name: 'Mimarlık Pro', category: 'premium', premium: true, color: '#1E3A5F' },
    { id: 'pilot_pro', name: 'Pilot Pro', category: 'premium', premium: true, color: '#1E40AF' },
    { id: 'psychologist', name: 'Psikolog', category: 'professional', premium: true, color: '#A78BFA' },
    { id: 'socialmedia', name: 'Sosyal Medya', category: 'creative', premium: true, color: '#F472B6' },
    { id: 'blockchain', name: 'Blockchain', category: 'tech', premium: true, color: '#F59E0B' },
    { id: 'productmanager', name: 'Ürün Yöneticisi', category: 'tech', premium: true, color: '#8B5CF6' },
    { id: 'customersuccess', name: 'Müşteri Başarısı', category: 'professional', premium: true, color: '#10B981' },
    { id: 'dataanalyst', name: 'Veri Analisti', category: 'tech', premium: true, color: '#3B82F6' },
    { id: 'translator', name: 'Çevirmen', category: 'professional', premium: true, color: '#6366F1' },
    { id: 'veterinary', name: 'Veteriner', category: 'professional', premium: true, color: '#22C55E' },
    { id: 'civilengineer', name: 'İnşaat Mühendisi', category: 'professional', premium: true, color: '#EA580C' },

    // === HIGH-END PREMIUM ===
    { id: 'cyberpunk_v2', name: 'Cyberpunk V2', category: 'premium', premium: true, color: '#F0ABFC' },
    { id: 'brutalist_pro', name: 'Brutalist Pro', category: 'premium', premium: true, color: '#44403C' },
    { id: 'executive_gold', name: 'Executive Gold', category: 'premium', premium: true, color: '#F59E0B' },
    { id: 'swiss_grid', name: 'Swiss Grid', category: 'premium', premium: true, color: '#EF4444' },
    { id: 'magazine_vogue', name: 'Magazine Vogue', category: 'premium', premium: true, color: '#1F2937' },
    { id: 'glass_dream', name: 'Glass Dream', category: 'premium', premium: true, color: '#38BDF8' },
    { id: 'minimal_mono', name: 'Minimal Mono', category: 'modern', premium: true, color: '#18181B' },
    { id: 'future_slate', name: 'Future Slate', category: 'premium', premium: true, color: '#475569' },
    { id: 'soft_pill', name: 'Soft Pill', category: 'modern', premium: true, color: '#F9A8D4' },
    { id: 'vertical_timeline', name: 'Vertical Timeline', category: 'premium', premium: true, color: '#0EA5E9' },
    { id: 'metro_ui', name: 'Metro UI', category: 'tech', premium: true, color: '#2563EB' },
    { id: 'aurora_premium', name: 'Aurora Premium', category: 'premium', premium: true, color: '#8B5CF6' },
    { id: 'academic_serif', name: 'Akademik Serif', category: 'premium', premium: true, color: '#1E3A8A' },
    { id: 'dark_zen', name: 'Dark Zen', category: 'premium', premium: true, color: '#18181B' },
    { id: 'creative_chaos', name: 'Creative Chaos', category: 'creative', premium: true, color: '#EC4899' },

    // === ULTRA PREMIUM v2 - Modern & Minimalist ===
    { id: 'neo_gradient', name: 'Neo Gradient', category: 'modern', premium: true, color: '#8B5CF6' },
    { id: 'paper_cut', name: 'Paper Cut', category: 'creative', premium: true, color: '#F97316' },
    { id: 'duo_tone', name: 'Duo Tone', category: 'modern', premium: true, color: '#6366F1' },
    { id: 'grid_master', name: 'Grid Master', category: 'modern', premium: true, color: '#0EA5E9' },
    { id: 'type_first', name: 'Type First', category: 'modern', premium: true, color: '#18181B' },
    { id: 'white_space', name: 'White Space', category: 'modern', premium: true, color: '#E5E7EB' },
    { id: 'shadow_play', name: 'Shadow Play', category: 'modern', premium: true, color: '#374151' },
    { id: 'clean_slate', name: 'Clean Slate', category: 'modern', premium: true, color: '#64748B' },

    // === ULTRA PREMIUM v2 - Corporate & Professional ===
    { id: 'board_room', name: 'Board Room', category: 'professional', premium: true, color: '#1F2937' },
    { id: 'corporate_edge', name: 'Corporate Edge', category: 'professional', premium: true, color: '#1E40AF' },
    { id: 'power_point', name: 'Power Point', category: 'professional', premium: true, color: '#DC2626' },
    { id: 'vintage_class', name: 'Vintage Class', category: 'premium', premium: true, color: '#78350F' },
    { id: 'luxury_matte', name: 'Luxury Matte', category: 'premium', premium: true, color: '#1C1917' },
    { id: 'diploma_style', name: 'Diploma Style', category: 'professional', premium: true, color: '#7C2D12' },

    // === ULTRA PREMIUM v2 - Tech & Futuristic ===
    { id: 'terminal_hacker', name: 'Terminal Hacker', category: 'tech', premium: true, color: '#22C55E' },
    { id: 'hologram_ui', name: 'Hologram UI', category: 'tech', premium: true, color: '#06B6D4' },
    { id: 'neural_net', name: 'Neural Net', category: 'tech', premium: true, color: '#8B5CF6' },
    { id: 'quantum_blue', name: 'Quantum Blue', category: 'tech', premium: true, color: '#2563EB' },
    { id: 'data_stream', name: 'Data Stream', category: 'tech', premium: true, color: '#10B981' },
    { id: 'robotics_core', name: 'Robotics Core', category: 'tech', premium: true, color: '#6366F1' },

    // === ULTRA PREMIUM v2 - Creative & Artsy ===
    { id: 'water_color', name: 'Water Color', category: 'creative', premium: true, color: '#38BDF8' },
    { id: 'neon_night', name: 'Neon Night', category: 'creative', premium: true, color: '#F0ABFC' },
    { id: 'retro_wave', name: 'Retro Wave', category: 'creative', premium: true, color: '#F472B6' },
    { id: 'ink_splash', name: 'Ink Splash', category: 'creative', premium: true, color: '#1F2937' },
    { id: 'origami_paper', name: 'Origami Paper', category: 'creative', premium: true, color: '#FCD34D' },
    { id: 'pop_art', name: 'Pop Art', category: 'creative', premium: true, color: '#EF4444' },

    // === ULTRA PREMIUM v2 - Industry & Niche ===
    { id: 'medical_pro', name: 'Medical Pro', category: 'premium', premium: true, color: '#0EA5E9' },
    { id: 'architect_blue', name: 'Architect Blue', category: 'premium', premium: true, color: '#1E40AF' },
    { id: 'legal_brief', name: 'Legal Brief', category: 'premium', premium: true, color: '#44403C' },
    { id: 'startup_pitch', name: 'Startup Pitch', category: 'premium', premium: true, color: '#F59E0B' },
];

// Get templates by category
export const getTemplatesByCategory = (categoryId) => {
    if (categoryId === 'all') return TEMPLATES;
    if (categoryId === 'popular') return TEMPLATES.filter(t => ['modern', 'minimalist', 'creative', 'tech', 'corporate'].includes(t.id));
    return TEMPLATES.filter(t => t.category === categoryId);
};

// Get free templates
export const getFreeTemplates = () => TEMPLATES.filter(t => !t.premium);

// Get premium templates
export const getPremiumTemplates = () => TEMPLATES.filter(t => t.premium);

