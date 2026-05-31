import { createContext, useContext, useEffect, useState } from 'react'
import { contentAPI } from '../services/api'

const LandingThemeContext = createContext(null)

// Varsayılan tema değerleri (sunucu cevap vermeden önce görünüm tutarlı kalır)
const DEFAULT_THEME = {
    colors: {
        primary: '#22d3ee',
        secondary: '#a855f7',
        accent: '#f59e0b',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        textMuted: '#94a3b8'
    },
    typography: {
        fontFamily: 'Inter',
        baseSize: '16px'
    },
    ui: {
        borderRadius: 12,
        glassmorphism: true,
        shadows: 'soft'
    },
    landing: {
        heroGradient: 'mesh',
        heroOverlayOpacity: 0.4,
        heroAnimation: 'orbs',
        cardBlur: 10,
        buttonStyle: 'rounded',
        headerTransparent: true,
        sectionSpacing: 'normal'
    }
}

// CSS değişkenlerini DOM'a uygula
function applyThemeToDOM(theme) {
    if (!theme) return
    const root = document.documentElement

    // Renkler
    if (theme.colors) {
        root.style.setProperty('--color-primary', theme.colors.primary || DEFAULT_THEME.colors.primary)
        root.style.setProperty('--color-secondary', theme.colors.secondary || DEFAULT_THEME.colors.secondary)
        root.style.setProperty('--color-accent', theme.colors.accent || DEFAULT_THEME.colors.accent)
        root.style.setProperty('--color-background', theme.colors.background || DEFAULT_THEME.colors.background)
        root.style.setProperty('--color-surface', theme.colors.surface || DEFAULT_THEME.colors.surface)
        root.style.setProperty('--color-text', theme.colors.text || DEFAULT_THEME.colors.text)
        root.style.setProperty('--color-text-muted', theme.colors.textMuted || DEFAULT_THEME.colors.textMuted)
    }

    // Tipografi
    if (theme.typography) {
        root.style.setProperty('--font-family', theme.typography.fontFamily || 'Inter')
        root.style.setProperty('--font-size-base', theme.typography.baseSize || '16px')
    }

    // UI
    if (theme.ui) {
        root.style.setProperty('--border-radius', `${theme.ui.borderRadius ?? 12}px`)
        root.style.setProperty('--glassmorphism', theme.ui.glassmorphism ? '1' : '0')
    }

    // Landing specific
    if (theme.landing) {
        root.style.setProperty('--hero-overlay-opacity', theme.landing.heroOverlayOpacity ?? 0.4)
        root.style.setProperty('--card-blur', `${theme.landing.cardBlur ?? 10}px`)
        root.style.setProperty('--hero-gradient', theme.landing.heroGradient || 'mesh')
        root.style.setProperty('--hero-animation', theme.landing.heroAnimation || 'orbs')
        root.style.setProperty('--button-style', theme.landing.buttonStyle || 'rounded')
        root.style.setProperty('--section-spacing', theme.landing.sectionSpacing || 'normal')
    }
}

export function LandingThemeProvider({ children }) {
    const [activeTheme, setActiveTheme] = useState(DEFAULT_THEME)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Varsayılan temayı hemen uygula
        applyThemeToDOM(DEFAULT_THEME)

        // Sunucudan aktif temayı çek
        const fetchActiveTheme = async () => {
            try {
                const response = await contentAPI.getActiveTheme()
                if (response.success && response.theme) {
                    setActiveTheme(response.theme)
                    applyThemeToDOM(response.theme)
                }
            } catch {
                // Hata durumunda varsayılan tema kullan
            } finally {
                setLoading(false)
            }
        }

        fetchActiveTheme()
    }, [])

    return (
        <LandingThemeContext.Provider value={{ activeTheme, loading, applyThemeToDOM }}>
            {children}
        </LandingThemeContext.Provider>
    )
}

export function useLandingTheme() {
    return useContext(LandingThemeContext)
}
