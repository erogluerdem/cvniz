import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CVProvider } from './context/CVContext'

// Layout
import Layout from './components/Layout'

// Pages
import HomePage from './pages/HomePage'
import TemplatesPage from './pages/TemplatesPage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import FAQPage from './pages/FAQPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import EditorPage from './pages/EditorPage'
import PaymentPage from './pages/PaymentPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

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
        <Routes>
            {/* Public Routes with Layout */}
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq" element={<FAQPage />} />
            </Route>

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
            <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                    <AdminPage />
                </ProtectedRoute>
            } />

            {/* Payment Routes */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment/success" element={
                <ProtectedRoute>
                    <PaymentSuccessPage />
                </ProtectedRoute>
            } />

            {/* Editor - No Layout */}
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:cvId" element={
                <ProtectedRoute>
                    <EditorPage />
                </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CVProvider>
                    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
                        {/* Floating Orbs */}
                        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                            <div className="orb w-96 h-96 bg-cyan-500/20 top-20 -left-48 animate-float"></div>
                            <div className="orb w-80 h-80 bg-purple-500/20 bottom-20 -right-40 animate-float-delayed"></div>
                            <div className="orb w-64 h-64 bg-pink-500/10 top-1/2 left-1/3 animate-float"></div>
                        </div>

                        {/* Main Content */}
                        <div className="relative z-10">
                            <AppRoutes />
                        </div>
                    </div>
                </CVProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
