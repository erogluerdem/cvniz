import { lazy } from 'react'

const templateImporters = {
    modern: () => import('./ModernTemplate'),
    minimalist: () => import('./MinimalistTemplate'),
    corporate: () => import('./CorporateTemplate'),
    creative: () => import('./CreativeTemplate'),
    tech: () => import('./TechTemplate'),
    executive: () => import('./ExecutiveTemplate'),
    elegant: () => import('./ElegantTemplate'),
    healthcare: () => import('./HealthcareTemplate'),
    academic: () => import('./AcademicTemplate'),
    finance: () => import('./FinanceTemplate'),
    legal: () => import('./LegalTemplate'),
    marketing: () => import('./MarketingTemplate'),
    engineer: () => import('./EngineerTemplate'),
    retail: () => import('./RetailTemplate'),
    hospitality: () => import('./HospitalityTemplate'),
    government: () => import('./GovernmentTemplate'),
    freelancer: () => import('./FreelancerTemplate'),
    startup: () => import('./StartupTemplate'),
    international: () => import('./InternationalTemplate'),
    portfolio: () => import('./PortfolioTemplate'),
    // New 20 templates
    scientist: () => import('./ScientistTemplate'),
    artist: () => import('./ArtistTemplate'),
    teacher: () => import('./TeacherTemplate'),
    chef: () => import('./ChefTemplate'),
    photographer: () => import('./PhotographerTemplate'),
    musician: () => import('./MusicianTemplate'),
    athlet: () => import('./AthletTemplate'),
    pilot: () => import('./PilotTemplate'),
    construction: () => import('./ConstructionTemplate'),
    environment: () => import('./EnvironmentTemplate'),
    journalist: () => import('./JournalistTemplate'),
    nurse: () => import('./NurseTemplate'),
    logistics: () => import('./LogisticsTemplate'),
    security: () => import('./SecurityTemplate'),
    architect: () => import('./ArchitectTemplate'),
    hr: () => import('./HRTemplate'),
    datascience: () => import('./DataScienceTemplate'),
    gamer: () => import('./GamerTemplate'),
    consultant: () => import('./ConsultantTemplate'),
    beauty: () => import('./BeautyTemplate'),
    lawyer_pro: () => import('./LawyerProTemplate'),
    realestate: () => import('./RealEstateTemplate'),
    logistic_pro: () => import('./LogisticProTemplate'),
    agriculture: () => import('./AgricultureTemplate'),
    media_pro: () => import('./MediaProTemplate'),
    fitness: () => import('./FitnessTemplate'),
    ecommerce: () => import('./EcommerceTemplate'),
    tourism_elite: () => import('./TourismEliteTemplate'),
    fashion: () => import('./FashionTemplate'),
    architecture_pro: () => import('./ArchitectureProTemplate'),
    pilot_pro: () => import('./PilotProTemplate'),
    psychologist: () => import('./PsychologistTemplate'),
    socialmedia: () => import('./SocialMediaTemplate'),
    blockchain: () => import('./BlockchainTemplate'),
    productmanager: () => import('./ProductManagerTemplate'),
    customersuccess: () => import('./CustomerSuccessTemplate'),
    dataanalyst: () => import('./DataAnalystTemplate'),
    translator: () => import('./TranslatorTemplate'),
    veterinary: () => import('./VeterinaryTemplate'),
    civilengineer: () => import('./CivilEngineerTemplate'),
    // High-End Premium 15
    cyberpunk_v2: () => import('./CyberpunkV2Template'),
    brutalist_pro: () => import('./BrutalistProTemplate'),
    executive_gold: () => import('./ExecutiveGoldTemplate'),
    swiss_grid: () => import('./SwissGridTemplate'),
    magazine_vogue: () => import('./MagazineVogueTemplate'),
    glass_dream: () => import('./GlassDreamTemplate'),
    minimal_mono: () => import('./MinimalMonoTemplate'),
    future_slate: () => import('./FutureSlateTemplate'),
    soft_pill: () => import('./SoftPillTemplate'),
    vertical_timeline: () => import('./VerticalTimelineTemplate'),
    metro_ui: () => import('./MetroUITemplate'),
    aurora_premium: () => import('./AuroraPremiumTemplate'),
    academic_serif: () => import('./AcademicSerifTemplate'),
    dark_zen: () => import('./DarkZenTemplate'),
    creative_chaos: () => import('./CreativeChaosTemplate'),
    // Ultra Premium Collection v2 - 30 New Templates
    // Modern & Minimalist
    neo_gradient: () => import('./NeoGradientTemplate'),
    paper_cut: () => import('./PaperCutTemplate'),
    duo_tone: () => import('./DuoToneTemplate'),
    grid_master: () => import('./GridMasterTemplate'),
    type_first: () => import('./TypeFirstTemplate'),
    white_space: () => import('./WhiteSpaceTemplate'),
    shadow_play: () => import('./ShadowPlayTemplate'),
    clean_slate: () => import('./CleanSlateTemplate'),
    // Corporate & Professional
    board_room: () => import('./BoardRoomTemplate'),
    corporate_edge: () => import('./CorporateEdgeTemplate'),
    power_point: () => import('./PowerPointTemplate'),
    vintage_class: () => import('./VintageClassTemplate'),
    luxury_matte: () => import('./LuxuryMatteTemplate'),
    diploma_style: () => import('./DiplomaStyleTemplate'),
    // Tech & Futuristic
    terminal_hacker: () => import('./TerminalHackerTemplate'),
    hologram_ui: () => import('./HologramUITemplate'),
    neural_net: () => import('./NeuralNetTemplate'),
    quantum_blue: () => import('./QuantumBlueTemplate'),
    data_stream: () => import('./DataStreamTemplate'),
    robotics_core: () => import('./RoboticsCoreTemplate'),
    // Creative & Artsy
    water_color: () => import('./WaterColorTemplate'),
    neon_night: () => import('./NeonNightTemplate'),
    retro_wave: () => import('./RetroWaveTemplate'),
    ink_splash: () => import('./InkSplashTemplate'),
    origami_paper: () => import('./OrigamiPaperTemplate'),
    pop_art: () => import('./PopArtTemplate'),
    // Industry & Niche
    medical_pro: () => import('./MedicalProTemplate'),
    architect_blue: () => import('./ArchitectBlueTemplate'),
    legal_brief: () => import('./LegalBriefTemplate'),
    startup_pitch: () => import('./StartupPitchTemplate'),
    // ========== WEB CV TEMPLATES (Online Portfolios) ==========
    corporate_web: () => import('./web/CorporateWebTemplate'),
    creative_web: () => import('./web/CreativeWebTemplate'),
    dark_web: () => import('./web/DarkWebTemplate'),
    glass_web: () => import('./web/GlassWebTemplate'),
    gradient_web: () => import('./web/GradientWebTemplate'),
    magazine_web: () => import('./web/MagazineWebTemplate'),
    minimal_web: () => import('./web/MinimalWebTemplate'),
    neon_web: () => import('./web/NeonWebTemplate'),
    paper_web: () => import('./web/PaperWebTemplate'),
    portfolio_web: () => import('./web/PortfolioWebTemplate'),
    retro_wave_web: () => import('./web/RetroWaveWebTemplate'),
    terminal_web: () => import('./web/TerminalWebTemplate'),
    // New 18 Unique Web CV Templates
    aurora_web: () => import('./web/AuroraWebTemplate'),
    synthwave_web: () => import('./web/SynthWaveWebTemplate'),
    brutalism_web: () => import('./web/BrutalismWebTemplate'),
    aquaris_web: () => import('./web/AquarisWebTemplate'),
    neo_tokyo_web: () => import('./web/NeoTokyoWebTemplate'),
    cinematic_web: () => import('./web/CinematicWebTemplate'),
    solaris_web: () => import('./web/SolarisWebTemplate'),
    infinity_web: () => import('./web/InfinityWebTemplate'),
    origami_web: () => import('./web/OrigamiWebTemplate'),
    wilderness_web: () => import('./web/WildernessWebTemplate'),
    arcade_web: () => import('./web/ArcadeWebTemplate'),
    timeline_web: () => import('./web/TimelineWebTemplate'),
    holographic_web: () => import('./web/HolographicWebTemplate'),
    museum_web: () => import('./web/MuseumWebTemplate'),
    dataviz_web: () => import('./web/DataVizWebTemplate'),
    journal_web: () => import('./web/JournalWebTemplate'),
    spotify_web: () => import('./web/SpotifyWebTemplate'),
    chatgpt_web: () => import('./web/ChatGPTWebTemplate'),
    // Ultra Premium v3 - 13 Special Templates
    bauhaus_legacy: () => import('./BauhausLegacyTemplate'),
    glassmorphism_pro: () => import('./GlassmorphismProTemplate'),
    midnight_glow: () => import('./MidnightGlowTemplate'),
    newspaper_class: () => import('./NewspaperClassTemplate'),
    luxury_velvet: () => import('./LuxuryVelvetTemplate'),
    organic_leaves: () => import('./OrganicLeavesTemplate'),
    blueprint_precision: () => import('./BlueprintPrecisionTemplate'),
    pop_art_pulse: () => import('./PopArtPulseTemplate'),
    scandi_minimal: () => import('./ScandiMinimalTemplate'),
    futuro_hologram: () => import('./FuturoHologramTemplate'),
    industrial_raw: () => import('./IndustrialRawTemplate'),
    vogue_elite: () => import('./VogueEliteTemplate'),
    zen_coda: () => import('./ZenCodaTemplate')
}

const lazyCache = new Map()

function normalizeTemplateId(templateId) {
    return templateImporters[templateId] ? templateId : 'modern'
}

export function preloadTemplate(templateId) {
    const normalized = normalizeTemplateId(templateId)
    return templateImporters[normalized]()
}

export function getLazyTemplate(templateId) {
    const normalized = normalizeTemplateId(templateId)

    const cached = lazyCache.get(normalized)
    if (cached) return cached

    const LazyComponent = lazy(templateImporters[normalized])
    lazyCache.set(normalized, LazyComponent)
    return LazyComponent
}
