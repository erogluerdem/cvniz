import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
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

// Layout
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import { ExitIntentPopup, StickyBottomCTA } from './components/SalesPrompts'
import WelcomePopup from './components/WelcomePopup'
import AbandonedCartModal from './components/AbandonedCartModal'
import MarketingPopup from './components/MarketingPopup'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'))
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (user) {
        return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
    }

    return children
}

function AppRoutes() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <Routes>
                {/* Public Routes with Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/faq" element={<FAQPage />} />

                    {/* Legal Routes */}
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/cookies" element={<CookiePolicyPage />} />
                    <Route path="/gdpr" element={<KVKKPage />} />

                    {/* Support & Content Routes */}
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/help" element={<HelpCenterPage />} />
                    <Route path="/support" element={<SupportPage />} />
                </Route>

                {/* Public CV View - No Layout */}
                <Route path="/v/:cvId" element={<PublicCVViewer />} />

                {/* Living CV - Dynamic QR Landing Page */}
                <Route path="/cv/:publicUrl" element={<LivingCVPage />} />

                {/* Auth Routes - No Layout */}
                <Route path="/login" element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                } />
                <Route path="/register" element={
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                } />

                {/* Protected Routes - No Layout */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />

                {/* CV Analytics */}
                <Route path="/dashboard/analytics/:cvId" element={
                    <ProtectedRoute>
                        <CVAnalyticsPage />
                    </ProtectedRoute>
                } />

                {/* Admin Routes - Multi-page */}
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="cvs" element={<AdminCVsPage />} />
                    <Route path="payments" element={<AdminPaymentsPage />} />
                    <Route path="templates" element={<AdminTemplatesPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                    <Route path="analytics" element={<AdminAnalyticsPage />} />
                    <Route path="live-stats" element={<AdminLiveStatsPage />} />
                    <Route path="site-content" element={<AdminSiteContentPage />} />
                    <Route path="announcements" element={<AdminAnnouncementsPage />} />
                    <Route path="coupons" element={<AdminCouponsPage />} />
                    <Route path="emails" element={<AdminEmailsPage />} />
                    <Route path="media" element={<AdminMediaPage />} />
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
                        <CheckoutPage />
                    </ProtectedRoute>
                } />

                {/* Editor - No Layout */}
                <Route path="/editor" element={<EditorPage />} />
                <Route
                    path="/editor/:cvId"
                    element={
                        <ProtectedRoute>
                            <EditorPage />
                        </ProtectedRoute>
                    }
                />

                {/* Enterprise Routes */}
                <Route
                    path="/enterprise"
                    element={
                        <ProtectedRoute>
                            <EnterpriseDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/enterprise/signup" element={<EnterpriseSignup />} />

                {/* Partner Routes */}
                <Route
                    path="/partner"
                    element={
                        <ProtectedRoute>
                            <PartnerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    )
}

export default function App() {
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
                                                                                                                    <ScrollToTop />
                                                                                                                    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
                                                                                                                        {/* Floating Orbs */}
                                                                                                                        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                                                                                                                            <div className="orb w-96 h-96 bg-cyan-500/20 top-20 -left-48 animate-float"></div>
                                                                                                                            <div className="orb w-80 h-80 bg-slate-200/10 bottom-20 -right-40 animate-float-delayed"></div>
                                                                                                                            <div className="orb w-64 h-64 bg-cyan-400/10 top-1/2 left-1/3 animate-float"></div>
                                                                                                                        </div>

                                                                                                                        {/* Main Content */}
                                                                                                                        <div className="relative z-10">
                                                                                                                            <AppRoutes />
                                                                                                                        </div>

                                                                                                                        {/* Sales Prompts */}
                                                                                                                        <ExitIntentPopup />
                                                                                                                        <StickyBottomCTA />

                                                                                                                        {/* Campaign Popups */}
                                                                                                                        <WelcomePopup />
                                                                                                                        <AbandonedCartModal />
                                                                                                                        <MarketingPopup />
                                                                                                                    </div>
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
                </TranslationProvider>
            </CoverLetterProvider>
        </CVProvider>
    </ReferralProvider>
</NotificationProvider>
</AuthProvider>
        </BrowserRouter >
    )
}
