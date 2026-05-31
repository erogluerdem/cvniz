// Web CV Template Definitions
// Each template includes: id, name, category, preview, colors, and component styles

export const WEB_CV_CATEGORIES = [
    { id: 'minimal', name: 'Minimal', icon: '○', description: 'Temiz ve sade tasarımlar' },
    { id: 'dark', name: 'Dark Mode', icon: '●', description: 'Koyu tema severler için' },
    { id: 'glass', name: 'Glassmorphism', icon: '◈', description: 'Modern cam efektleri' },
    { id: 'gradient', name: 'Gradient', icon: '◐', description: 'Renkli geçişler' },
    { id: 'creative', name: 'Creative', icon: '✦', description: 'Yaratıcı portfolyo stilleri' },
    { id: 'corporate', name: 'Corporate', icon: '▣', description: 'Kurumsal ve profesyonel' },
    // NEW CATEGORIES
    { id: 'neon', name: 'Neon', icon: '⚡', description: 'Cyberpunk neon parlaklık' },
    { id: 'terminal', name: 'Terminal', icon: '⌘', description: 'Retro terminal hacker stili' },
    { id: 'retrowave', name: 'RetroWave', icon: '☀', description: '80ler synthwave estetiği' },
    { id: 'magazine', name: 'Magazine', icon: '📰', description: 'Dergi editöryel düzeni' },
    { id: 'portfolio', name: 'Portfolio', icon: '🎨', description: 'Ajans portfolyo stili' },
    { id: 'paper', name: 'Paper', icon: '📄', description: 'Vintage kağıt dokümantasyon' }
]

export const WEB_CV_TEMPLATES = [
    // ========== MINIMAL SERIES ==========
    {
        id: 'minimal-clean',
        name: 'Clean',
        category: 'minimal',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        colors: {
            bg: '#FFFFFF',
            text: '#1a1a1a',
            accent: '#0066FF',
            secondary: '#666666'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '0',
            cardStyle: 'flat'
        }
    },
    {
        id: 'minimal-swiss',
        name: 'Swiss',
        category: 'minimal',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
        colors: {
            bg: '#F2F2F2',
            text: '#000000',
            accent: '#E63946',
            secondary: '#457B9D'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            borderRadius: '0',
            cardStyle: 'bordered'
        }
    },
    {
        id: 'minimal-tokyo',
        name: 'Tokyo',
        category: 'minimal',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=400',
        colors: {
            bg: '#FAF9F6',
            text: '#242424',
            accent: '#D4AF37',
            secondary: '#8B8B8B'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Noto Sans JP', sans-serif",
            borderRadius: '2px',
            cardStyle: 'elevated'
        }
    },
    {
        id: 'minimal-mono',
        name: 'Mono',
        category: 'minimal',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        colors: {
            bg: '#000000',
            text: '#FFFFFF',
            accent: '#FFFFFF',
            secondary: '#666666'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'JetBrains Mono', monospace",
            borderRadius: '0',
            cardStyle: 'flat'
        }
    },
    {
        id: 'minimal-paper',
        name: 'Paper',
        category: 'minimal',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=400',
        colors: {
            bg: '#FFFBF2',
            text: '#2C2C2C',
            accent: '#5D4037',
            secondary: '#8D6E63'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Merriweather', serif",
            borderRadius: '0',
            cardStyle: 'paper'
        }
    },

    // ========== DARK SERIES ==========
    {
        id: 'dark-midnight',
        name: 'Midnight',
        category: 'dark',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400',
        colors: {
            bg: '#050505',
            text: '#FFFFFF',
            accent: '#00F0FF',
            secondary: '#4F46E5'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '32px',
            cardStyle: 'glass-dark'
        }
    },
    {
        id: 'dark-neon',
        name: 'Neon Cyber',
        category: 'dark',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400',
        colors: {
            bg: '#080808',
            text: '#FFFFFF',
            accent: '#FF00FF',
            secondary: '#00FFFF'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Space Grotesk', sans-serif",
            borderRadius: '0',
            cardStyle: 'brutal'
        }
    },
    {
        id: 'dark-obsidian',
        name: 'Obsidian',
        category: 'dark',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
        colors: {
            bg: '#0F172A',
            text: '#F8FAFC',
            accent: '#FDA4AF',
            secondary: '#94A3B8'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Outfit', sans-serif",
            borderRadius: '24px',
            cardStyle: 'elevated-dark'
        }
    },
    {
        id: 'dark-carbon',
        name: 'Carbon',
        category: 'dark',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        colors: {
            bg: '#121212',
            text: '#E5E5E5',
            accent: '#3B82F6',
            secondary: '#1F2937'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '12px',
            cardStyle: 'tile'
        }
    },

    // ========== GLASSMORPHISM SERIES ==========
    {
        id: 'glass-aurora',
        name: 'Aurora',
        category: 'glass',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
            text: '#FFFFFF',
            accent: '#818CF8',
            secondary: '#C084FC'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '40px',
            cardStyle: 'glass'
        }
    },
    {
        id: 'glass-sunset',
        name: 'Sunset Glass',
        category: 'glass',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
            text: '#FFFFFF',
            accent: '#F43F5E',
            secondary: '#FB923C'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Outfit', sans-serif",
            borderRadius: '32px',
            cardStyle: 'warm-glass'
        }
    },
    {
        id: 'glass-emerald',
        name: 'Emerald Frost',
        category: 'glass',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
            text: '#FFFFFF',
            accent: '#34D399',
            secondary: '#6EE7B7'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '24px',
            cardStyle: 'soft-glass'
        }
    },

    // ========== GRADIENT SERIES ==========
    {
        id: 'gradient-vibrant',
        name: 'Vibrant Flow',
        category: 'gradient',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
            text: '#FFFFFF',
            accent: '#FFFFFF',
            secondary: '#FDE047'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Montserrat', sans-serif",
            borderRadius: '48px',
            cardStyle: 'neon-glow'
        }
    },
    {
        id: 'gradient-ocean',
        name: 'Ocean Deep',
        category: 'gradient',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
            text: '#FFFFFF',
            accent: '#60A5FA',
            secondary: '#93C5FD'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '24px',
            cardStyle: 'depth'
        }
    },

    // ========== CREATIVE SERIES ==========
    {
        id: 'creative-brutalist',
        name: 'Brutalist Extra',
        category: 'creative',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        colors: {
            bg: '#F3F4F6',
            text: '#000000',
            accent: '#FFD700',
            secondary: '#FF3131'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Syne', sans-serif",
            borderRadius: '0',
            cardStyle: 'brutal'
        }
    },
    {
        id: 'creative-pop',
        name: 'Pop Vision',
        category: 'creative',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
        colors: {
            bg: '#FFFFFF',
            text: '#000000',
            accent: '#00F0FF',
            secondary: '#FF00FF'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Archivo Black', sans-serif",
            borderRadius: '0',
            cardStyle: 'pop'
        }
    },

    // ========== CORPORATE SERIES ==========
    {
        id: 'corporate-pro',
        name: 'Professional Pro',
        category: 'corporate',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
        colors: {
            bg: '#FFFFFF',
            text: '#0F172A',
            accent: '#2563EB',
            secondary: '#64748B'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '12px',
            cardStyle: 'corporate'
        }
    },
    {
        id: 'corporate-elite',
        name: 'Business Elite',
        category: 'corporate',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400',
        colors: {
            bg: '#F8FAFC',
            text: '#1E293B',
            accent: '#1E40AF',
            secondary: '#334155'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '16px',
            cardStyle: 'elite'
        }
    },
    {
        id: 'minimal-nordic',
        name: 'Nordic Clean',
        category: 'minimal',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
        colors: {
            bg: '#F0F4F8',
            text: '#243B53',
            accent: '#486581',
            secondary: '#829AB1'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '8px',
            cardStyle: 'flat'
        }
    },
    {
        id: 'minimal-zen',
        name: 'Zen Harmony',
        category: 'minimal',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400',
        colors: {
            bg: '#FAF7F2',
            text: '#433422',
            accent: '#8C7851',
            secondary: '#AD9F85'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Merriweather', serif",
            borderRadius: '0',
            cardStyle: 'paper'
        }
    },
    {
        id: 'dark-amoled',
        name: 'AMOLED Black',
        category: 'dark',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
        colors: {
            bg: '#000000',
            text: '#FFFFFF',
            accent: '#FF3131',
            secondary: '#1A1A1A'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Space Grotesk', sans-serif",
            borderRadius: '0',
            cardStyle: 'brutal'
        }
    },
    {
        id: 'dark-slate',
        name: 'Slate Professional',
        category: 'dark',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400',
        colors: {
            bg: '#1E293B',
            text: '#F1F5F9',
            accent: '#38BDF8',
            secondary: '#64748B'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Outfit', sans-serif",
            borderRadius: '20px',
            cardStyle: 'elevated-dark'
        }
    },
    {
        id: 'glass-frosted',
        name: 'Frosted White',
        category: 'glass',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            text: '#1E293B',
            accent: '#0D9488',
            secondary: '#5E718D'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '24px',
            cardStyle: 'soft-glass'
        }
    },
    {
        id: 'glass-royal',
        name: 'Royal Purple',
        category: 'glass',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #4C1D95 0%, #2E1065 100%)',
            text: '#FFFFFF',
            accent: '#FCD34D',
            secondary: '#A78BFA'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Outfit', sans-serif",
            borderRadius: '32px',
            cardStyle: 'glass'
        }
    },
    {
        id: 'gradient-sunset',
        name: 'Afternoon Sunset',
        category: 'gradient',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
            text: '#FFFFFF',
            accent: '#FDE047',
            secondary: 'rgba(255,255,255,0.7)'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            borderRadius: '40px',
            cardStyle: 'neon-glow'
        }
    },
    {
        id: 'gradient-emerald-deep',
        name: 'Emerald Sea',
        category: 'gradient',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        colors: {
            bg: 'linear-gradient(135deg, #065F46 0%, #064E3B 100%)',
            text: '#FFFFFF',
            accent: '#10B981',
            secondary: '#D1FAE5'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '24px',
            cardStyle: 'depth'
        }
    },
    {
        id: 'creative-retro-80s',
        name: '80s Retro Wave',
        category: 'creative',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
        colors: {
            bg: '#2D1B69',
            text: '#FFFFFF',
            accent: '#FF00FF',
            secondary: '#00FFFF'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Syne', sans-serif",
            borderRadius: '0',
            cardStyle: 'pop'
        }
    },
    {
        id: 'creative-future-hud',
        name: 'Future HUD',
        category: 'creative',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        colors: {
            bg: '#020617',
            text: '#94A3B8',
            accent: '#22D3EE',
            secondary: '#334155'
        },
        styles: {
            heroLayout: 'centered',
            fontFamily: "'JetBrains Mono', monospace",
            borderRadius: '4px',
            cardStyle: 'brutal'
        }
    },
    {
        id: 'corporate-global-biz',
        name: 'Global Business',
        category: 'corporate',
        premium: false,
        preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
        colors: {
            bg: '#FFFFFF',
            text: '#111827',
            accent: '#1D4ED8',
            secondary: '#6B7280'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Source Sans Pro', sans-serif",
            borderRadius: '4px',
            cardStyle: 'corporate'
        }
    },
    {
        id: 'corporate-modern-serif',
        name: 'Modern Strategic',
        category: 'corporate',
        premium: true,
        preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400',
        colors: {
            bg: '#FCFCFC',
            text: '#18181B',
            accent: '#3F3F46',
            secondary: '#71717A'
        },
        styles: {
            heroLayout: 'left-aligned',
            fontFamily: "'Inter', sans-serif",
            borderRadius: '2px',
            cardStyle: 'elite'
        }
    }
]

// Helper function to get templates by category
export const getTemplatesByCategory = (categoryId) => {
    return WEB_CV_TEMPLATES.filter(t => t.category === categoryId)
}

// ========== NEW TEMPLATES ==========

// NEON SERIES
const neonBaseTemplate = {
    id: 'neon-cyber',
    name: 'Cyber Neon',
    category: 'neon',
    premium: true,
    preview: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400',
    colors: {
        bg: '#000000',
        text: '#FFFFFF',
        accent: '#00FF88',
        secondary: '#FF00FF'
    },
    styles: {
        heroLayout: 'centered',
        fontFamily: "'Space Grotesk', sans-serif",
        borderRadius: '20px',
        cardStyle: 'neon'
    }
}

// TERMINAL SERIES
const terminalBaseTemplate = {
    id: 'terminal-hacker',
    name: 'Hacker Terminal',
    category: 'terminal',
    premium: true,
    preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    colors: {
        bg: '#000000',
        text: '#00FF00',
        accent: '#00FF00',
        secondary: '#00AA00'
    },
    styles: {
        heroLayout: 'left-aligned',
        fontFamily: "'Fira Code', monospace",
        borderRadius: '8px',
        cardStyle: 'terminal'
    }
}

// RETROWAVE SERIES
const retrowaveBaseTemplate = {
    id: 'retrowave-sunset',
    name: 'Sunset Wave',
    category: 'retrowave',
    premium: true,
    preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
    colors: {
        bg: '#0a0a1a',
        text: '#FFFFFF',
        accent: '#FF00FF',
        secondary: '#00FFFF'
    },
    styles: {
        heroLayout: 'centered',
        fontFamily: "'Orbitron', sans-serif",
        borderRadius: '16px',
        cardStyle: 'retrowave'
    }
}

// MAGAZINE SERIES
const magazineBaseTemplate = {
    id: 'magazine-editorial',
    name: 'Editorial',
    category: 'magazine',
    premium: true,
    preview: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
    colors: {
        bg: '#f8f6f1',
        text: '#1a1a1a',
        accent: '#000000',
        secondary: '#666666'
    },
    styles: {
        heroLayout: 'editorial',
        fontFamily: "'Playfair Display', serif",
        borderRadius: '0',
        cardStyle: 'magazine'
    }
}

// PORTFOLIO SERIES
const portfolioBaseTemplate = {
    id: 'portfolio-agency',
    name: 'Agency',
    category: 'portfolio',
    premium: true,
    preview: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400',
    colors: {
        bg: '#0a0a0a',
        text: '#FFFFFF',
        accent: '#FF6B35',
        secondary: '#AAAAAA'
    },
    styles: {
        heroLayout: 'split',
        fontFamily: "'Outfit', sans-serif",
        borderRadius: '24px',
        cardStyle: 'portfolio'
    }
}

// PAPER SERIES
const paperBaseTemplate = {
    id: 'paper-vintage',
    name: 'Vintage Document',
    category: 'paper',
    premium: true,
    preview: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=400',
    colors: {
        bg: '#faf3e3',
        text: '#2d2d2d',
        accent: '#996633',
        secondary: '#555555'
    },
    styles: {
        heroLayout: 'traditional',
        fontFamily: "'Merriweather', serif",
        borderRadius: '0',
        cardStyle: 'paper'
    }
}

// Add new templates to array
WEB_CV_TEMPLATES.push(
    neonBaseTemplate,
    terminalBaseTemplate,
    retrowaveBaseTemplate,
    magazineBaseTemplate,
    portfolioBaseTemplate,
    paperBaseTemplate
)

// Helper function to get template by ID
export const getTemplateById = (templateId) => {
    return WEB_CV_TEMPLATES.find(t => t.id === templateId)
}

// Helper function to get free templates only
export const getFreeTemplates = () => {
    return WEB_CV_TEMPLATES.filter(t => !t.premium)
}

// Helper function to get premium templates only
export const getPremiumTemplates = () => {
    return WEB_CV_TEMPLATES.filter(t => t.premium)
}
