import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import React, { Suspense, lazy, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CVProvider } from './context/CVContext'
import { SiteContentProvider } from './context/SiteContentContext'
import { SupportProvider } from './context/SupportContext'
import { PaymentProvider } from './context/PaymentContext'
import { ReferralProvider } from './context/ReferralContext'
import { CampaignProvider } from './context/CampaignContext'
import { ABTestProvider } from './context/ABTestContext'
import { CoverLetterProvider } from './context/CoverLetterContext'
import { TranslationProvider } from './context/TranslationContext'
import { AnalyticsProvider } from './context/AnalyticsContext'
import { AdminNotificationProvider } from './context/AdminNotificationContext'
import { NotificationProvider } from './context/NotificationContext'
import { HeatmapProvider } from './context/HeatmapContext'
import { EnterpriseProvider } from './context/EnterpriseContext'
import { ReviewProvider } from './context/ReviewContext'
import { JobBoardProvider } from './context/JobBoardContext'
import { WhiteLabelProvider } from './context/WhiteLabelContext'
import { InterviewProvider } from './context/InterviewContext'
import { SalaryProvider } from './context/SalaryContext'
import { CareerPathProvider } from './context/CareerPathContext'
import { SkillsGapProvider } from './context/SkillsGapContext'
import { PortfolioProvider } from './context/PortfolioContext'
import { MarketingAutomationProvider } from './context/MarketingAutomationContext'
import { PersistenceProvider } from './context/PersistenceContext'
import { ToastProvider } from './context/ToastContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { GiftCardProvider } from './context/GiftCardContext'
import { AffiliateProvider } from './context/AffiliateContext'
import { TemplateProvider } from './context/TemplateContext'
import { TourProvider } from './context/TourContext'
import LoadingSpinner from './components/LoadingSpinner'

// Layout
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import { ExitIntentPopup, StickyBottomCTA } from './components/SalesPrompts'
import WelcomePopup from './components/WelcomePopup'
import AbandonedCartModal from './components/AbandonedCartModal'
import MarketingPopup from './components/MarketingPopup'
import AnnouncementModal from './components/AnnouncementModal'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'))
const TemplateShowcasePage = lazy(() => import('./pages/TemplateShowcasePage'))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const EditorPage = lazy(() => import('./pages/EditorPage'))
const PublicCVViewer = lazy(() => import('./pages/PublicCVViewer'))
const LivingCVPage = lazy(() => import('./pages/LivingCVPage'))
const CVAnalyticsPage = lazy(() => import('./pages/CVAnalyticsPage'))

// Admin Pages - Multi-page Structure
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage'))
const AdminCVsPage = lazy(() => import('./pages/admin/CVsPage'))
const AdminPaymentsPage = lazy(() => import('./pages/admin/PaymentsPage'))
const AdminTemplatesPage = lazy(() => import('./pages/admin/TemplatesPage'))
const AdminSettingsPage = lazy(() => import('./pages/admin/SettingsPage'))

// Admin - Analytics & Monitoring
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'))
const AdminLiveStatsPage = lazy(() => import('./pages/admin/LiveStatsPage'))
const AdminLogsPage = lazy(() => import('./pages/admin/LogsPage'))
const AdminReportsPage = lazy(() => import('./pages/admin/ReportsPage'))

// Admin - Marketing
const AdminCouponsPage = lazy(() => import('./pages/admin/CouponsPage'))
const AdminEmailsPage = lazy(() => import('./pages/admin/EmailsPage'))
const AdminCampaignsPage = lazy(() => import('./pages/admin/CampaignsPage'))
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AnnouncementsPage'))
const AdminReferralsPage = lazy(() => import('./pages/admin/ReferralsPage'))
const AdminABTestsPage = lazy(() => import('./pages/admin/ABTestsPage'))

// Admin - Content & Design
const AdminSiteContentPage = lazy(() => import('./pages/admin/SiteContentPage'))
const AdminMediaPage = lazy(() => import('./pages/admin/MediaPage'))
const AdminThemePage = lazy(() => import('./pages/admin/ThemePage'))
const AdminTranslationsPage = lazy(() => import('./pages/admin/TranslationsPage'))

// Admin - System
const AdminSecurityPage = lazy(() => import('./pages/admin/SecurityPage'))
const AdminApiPage = lazy(() => import('./pages/admin/ApiPage'))
const AdminAISettingsPage = lazy(() => import('./pages/admin/AISettingsPage'))
const AdminSupportPage = lazy(() => import('./pages/admin/SupportPage'))

// Admin - Additional Pages
const AdminEnterprisePage = lazy(() => import('./pages/admin/EnterprisePage'))
const AdminCVReviewsPage = lazy(() => import('./pages/admin/CVReviewsPage'))
const AdminJobBoardPage = lazy(() => import('./pages/admin/JobBoardPage'))
const AdminPartnersPage = lazy(() => import('./pages/admin/PartnersPage'))

// Legal Pages
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const KVKKPage = lazy(() => import('./pages/KVKKPage'))

// Support & Content Pages
const ContactPage = lazy(() => import('./pages/ContactPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))

// Monetization Pages
const EnterpriseDashboard = lazy(() => import('./pages/EnterpriseDashboard'))
const EnterpriseSignup = lazy(() => import('./pages/EnterpriseSignup'))
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'))

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading, isAdmin } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <LoadingSpinner size="lg" text="Giriş Kontrol Ediliyor" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

// Guest Route - Redirect if already logged in
function GuestRoute({ children }) {
    const { user, loading, isAdmin } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <LoadingSpinner size="lg" text="Giriş Kontrol Ediliyor" />
            </div>
        )
    }

    if (user) {
        return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
    }

    return children
}

// Page Transition Wrapper - Native App Style
function PageTransition({ children }) {
    const location = useLocation()
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                }}
                style={{ 
                    width: '100%',
                    minHeight: '100%'
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

function AnimatedRoutes() {
    const location = useLocation()
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes with Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <HomePage />
                        </motion.div>
                    } />
                    <Route path="/features" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <FeaturesPage />
                        </motion.div>
                    } />
                    <Route path="/templates" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <TemplatesPage />
                        </motion.div>
                    } />
                    <Route path="/sablonlar/:templateId" element={
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <TemplateShowcasePage />
                        </motion.div>
                    } />
                    <Route path="/pricing" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <PricingPage />
                        </motion.div>
                    } />
                    <Route path="/faq" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <FAQPage />
                        </motion.div>
                    } />
                    {/* Legal Routes */}
                    <Route path="/privacy" element={
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <PrivacyPolicyPage />
                        </motion.div>
                    } />
                    <Route path="/terms" element={
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <TermsOfServicePage />
                        </motion.div>
                    } />
                    <Route path="/cookies" element={
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <CookiePolicyPage />
                        </motion.div>
                    } />
                    <Route path="/gdpr" element={
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <KVKKPage />
                        </motion.div>
                    } />

                    {/* Support & Content Routes */}
                    <Route path="/contact" element={
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <ContactPage />
                        </motion.div>
                    } />
                    <Route path="/blog" element={
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <BlogPage />
                        </motion.div>
                    } />
                    <Route path="/help" element={
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <HelpCenterPage />
                        </motion.div>
                    } />
                    <Route path="/support" element={
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <SupportPage />
                        </motion.div>
                    } />
                </Route>

                {/* Public CV View - No Layout */}
                <Route path="/v/:cvId" element={<PublicCVViewer />} />

                {/* Living CV - Dynamic QR Landing Page */}
                <Route path="/cv/:publicUrl" element={
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                        <LivingCVPage />
                    </motion.div>
                } />

                {/* Auth Routes - No Layout */}
                <Route path="/login" element={
                    <GuestRoute>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <LoginPage />
                        </motion.div>
                    </GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <RegisterPage />
                        </motion.div>
                    </GuestRoute>
                } />

                {/* Protected Routes - No Layout */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <DashboardPage />
                        </motion.div>
                    </ProtectedRoute>
                } />

                {/* CV Analytics */}
                <Route path="/dashboard/analytics/:cvId" element={
                    <ProtectedRoute>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <CVAnalyticsPage />
                        </motion.div>
                    </ProtectedRoute>
                } />

                {/* Admin Routes - Multi-page */}
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <AdminLayout />
                        </motion.div>
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="cvs" element={<AdminCVsPage />} />
                    <Route path="payments" element={<AdminPaymentsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                    <Route path="analytics" element={<AdminAnalyticsPage />} />
                    <Route path="live-stats" element={<AdminLiveStatsPage />} />
                    <Route path="site-content" element={<AdminSiteContentPage />} />
                    <Route path="ab-tests" element={<AdminABTestsPage />} />
                    <Route path="announcements" element={<AdminAnnouncementsPage />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
                    <Route path="emails" element={<AdminEmailsPage />} />
                    <Route path="media" element={<AdminMediaPage />} />
                    <Route path="templates" element={<AdminTemplatesPage />} />
                    <Route path="theme" element={<AdminThemePage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="security" element={<AdminSecurityPage />} />
                    <Route path="api" element={<AdminApiPage />} />
                    <Route path="ai-settings" element={<AdminAISettingsPage />} />
                    <Route path="translations" element={<AdminTranslationsPage />} />
                    <Route path="logs" element={<AdminLogsPage />} />
                    <Route path="campaigns" element={<AdminCampaignsPage />} />
                    <Route path="abtests" element={<AdminABTestsPage />} />
                    <Route path="referrals" element={<AdminReferralsPage />} />
                    <Route path="support" element={<AdminSupportPage />} />
                    <Route path="enterprise" element={<AdminEnterprisePage />} />
                    <Route path="cv-reviews" element={<AdminCVReviewsPage />} />
                    <Route path="job-board" element={<AdminJobBoardPage />} />
                    <Route path="partners" element={<AdminPartnersPage />} />
                </Route>

                {/* Checkout - No Layout */}
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <CheckoutPage />
                        </motion.div>
                    </ProtectedRoute>
                } />

                {/* Editor - No Layout */}
                <Route path="/editor" element={
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <EditorPage />
                    </motion.div>
                } />
                <Route path="/editor/:cvId" element={
                    <ProtectedRoute>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <EditorPage />
                        </motion.div>
                    </ProtectedRoute>
                } />

                {/* Enterprise Routes */}
                <Route path="/enterprise" element={
                    <ProtectedRoute>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <EnterpriseDashboard />
                        </motion.div>
                    </ProtectedRoute>
                } />
                <Route path="/enterprise/signup" element={
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <EnterpriseSignup />
                    </motion.div>
                } />

                {/* Partner Routes */}
                <Route path="/partner" element={
                    <ProtectedRoute>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <PartnerDashboard />
                        </motion.div>
                    </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    )
}

// Legacy AppRoutes for compatibility
function AppRoutes() {
    return <AnimatedRoutes />
}

export default function App() {
    const [theme, setTheme] = React.useState('day')
    const isDayMode = theme === 'day'

    useEffect(() => {
        if (typeof window === 'undefined') return
        const storedTheme = window.localStorage.getItem('CVniz-home-theme')
        if (storedTheme === 'day' || storedTheme === 'night') {
            setTheme(storedTheme)
        }

        const handleThemeChange = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

    useEffect(() => {
        if (typeof document === 'undefined') return
        const root = document.documentElement
        root.classList.toggle('theme-day', isDayMode)
        root.classList.toggle('theme-night', !isDayMode)
    }, [isDayMode])

    // DevTools Warning
    if (typeof window !== 'undefined') {
        const devToolsWarning = () => {
            console.log(
                '%c🛑 DUR!',
                'color: red; font-size: 48px; font-weight: bold;'
            )
            console.log(
                '%cBu tarayıcı özelliği geliştiriciler içindir.',
                'font-size: 16px;'
            )
            console.log(
                '%cBirisi size buraya bir şey yapıştırmanızı söylediyse, bu bir dolandırıcılık girişimidir ve hesabınıza erişim sağlayabilirler.',
                'font-size: 14px; color: orange;'
            )
            console.log(
                '%c⚠️ Premium şablonları kopyalamak yasaktır ve yasal işlem başlatılabilir.',
                'font-size: 14px; color: red;'
            )
        }
        devToolsWarning()
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <NotificationProvider>
                    <ReferralProvider>
                        <CVProvider>
                            <CoverLetterProvider>
                                <TranslationProvider>
                                    <TourProvider>
                                        <AnalyticsProvider>
                                            <HeatmapProvider>
                                                <EnterpriseProvider>
                                                    <ReviewProvider>
                                                        <JobBoardProvider>
                                                            <WhiteLabelProvider>
                                                                <PaymentProvider>
                                                                    <SubscriptionProvider>
                                                                        <GiftCardProvider>
                                                                            <AffiliateProvider>
                                                                                <CampaignProvider>
                                                                                    <ABTestProvider>
                                                                                        <SupportProvider>
                                                                                            <AdminNotificationProvider>
                                                                                                <SiteContentProvider>
                                                                                                    <InterviewProvider>
                                                                                                        <SalaryProvider>
                                                                                                            <CareerPathProvider>
                                                                                                                <SkillsGapProvider>
                                                                                                                    <PortfolioProvider>
                                                                                                                        <MarketingAutomationProvider>
                                                                                                                            <PersistenceProvider>
                                                                                                                                <ToastProvider>
                                                                                                                                    <TemplateProvider>
                                                                                                                                        <div className={`min-h-screen transition-colors duration-500 ${isDayMode
                                                                                                                                            ? 'bg-gradient-to-br from-white via-sky-50 to-amber-50 text-slate-900'
                                                                                                                                            : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
                                                                                                                                            }`}>
                                                                                                                                            {/* Floating Orbs */}
                                                                                                                                            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                                                                                                                                                <div className={`orb w-96 h-96 top-20 -left-48 animate-float ${isDayMode ? 'bg-sky-400/20' : 'bg-cyan-500/20'}`}></div>
                                                                                                                                                <div className={`orb w-80 h-80 bottom-20 -right-40 animate-float-delayed ${isDayMode ? 'bg-amber-400/10' : 'bg-slate-200/10'}`}></div>
                                                                                                                                                <div className={`orb w-64 h-64 top-1/2 left-1/3 animate-float ${isDayMode ? 'bg-sky-300/10' : 'bg-cyan-400/10'}`}></div>
                                                                                                                                            </div>

                                                                                                                                            {/* Scroll Progress */}
                                                                                                                                            <ScrollToTop />

                                                                                                                                            {/* Main Content */}
                                                                                                                                            <div className="relative z-10">
                                                                                                                                                <AppRoutes />
                                                                                                                                            </div>

                                                                                                                                            {/* Sales & Campaign Overlays */}
                                                                                                                                            <ExitIntentPopup />
                                                                                                                                            <StickyBottomCTA />
                                                                                                                                            <WelcomePopup />
                                                                                                                                            <AbandonedCartModal />
                                                                                                                                            <MarketingPopup />
                                                                                                                                            <AnnouncementModal />
                                                                                                                                        </div>
                                                                                                                                    </TemplateProvider>
                                                                                                                                </ToastProvider>
                                                                                                                            </PersistenceProvider>
                                                                                                                        </MarketingAutomationProvider>
                                                                                                                    </PortfolioProvider>
                                                                                                                </SkillsGapProvider>
                                                                                                            </CareerPathProvider>
                                                                                                        </SalaryProvider>
                                                                                                    </InterviewProvider>
                                                                                                </SiteContentProvider>
                                                                                            </AdminNotificationProvider>
                                                                                        </SupportProvider>
                                                                                    </ABTestProvider>
                                                                                </CampaignProvider>
                                                                            </AffiliateProvider>
                                                                        </GiftCardProvider>
                                                                    </SubscriptionProvider>
                                                                </PaymentProvider>
                                                            </WhiteLabelProvider>
                                                        </JobBoardProvider>
                                                    </ReviewProvider>
                                                </EnterpriseProvider>
                                            </HeatmapProvider>
                                        </AnalyticsProvider>
                                    </TourProvider>
                                </TranslationProvider>
                            </CoverLetterProvider>
                        </CVProvider>
                    </ReferralProvider>
                </NotificationProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
