import { Link, Outlet, useLocation } from 'react-router-dom'
import { FileText, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Layout() {
    const { user, logout, isAdmin } = useAuth()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { path: '/', label: 'Ana Sayfa' },
        { path: '/features', label: 'Özellikler' },
        { path: '/templates', label: 'Şablonlar' },
        { path: '/pricing', label: 'Fiyatlar' },
        { path: '/faq', label: 'SSS' }
    ]

    const isActive = (path) => location.pathname === path

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">CVify</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm transition-colors ${isActive(link.path)
                                        ? 'text-cyan-400 font-medium'
                                        : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    to={isAdmin ? '/admin' : '/dashboard'}
                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="hidden sm:inline text-sm">{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Çıkış Yap"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm hidden sm:block">
                                    Giriş Yap
                                </Link>
                                <Link to="/editor" className="btn-premium text-sm">
                                    CV Oluştur
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-400 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10 px-6 py-4">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`py-2 transition-colors ${isActive(link.path)
                                            ? 'text-cyan-400 font-medium'
                                            : 'text-gray-300'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 text-gray-300"
                                >
                                    Giriş Yap
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold gradient-text">CVify</span>
                            </Link>
                            <p className="text-gray-400 text-sm">
                                AI destekli profesyonel CV oluşturucu.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Ürün</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/features" className="hover:text-white transition-colors">Özellikler</Link></li>
                                <li><Link to="/templates" className="hover:text-white transition-colors">Şablonlar</Link></li>
                                <li><Link to="/pricing" className="hover:text-white transition-colors">Fiyatlar</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Destek</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/faq" className="hover:text-white transition-colors">SSS</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">İletişim</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Yasal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/privacy" className="hover:text-white transition-colors">Gizlilik</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition-colors">Kullanım Şartları</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                        <div className="text-gray-500">© 2024 CVify. Tüm hakları saklıdır.</div>
                        <div className="text-gray-500">Türkiye'de 🇹🇷 ❤️ ile yapıldı</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
