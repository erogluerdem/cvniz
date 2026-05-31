import { Link, Outlet, useLocation } from 'react-router-dom'
import { FileText, User, LogOut, Menu, X, Sun, Moon, Sparkles, Zap, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import React, { useState, useEffect, useRef } from 'react'
import CookieConsent from './CookieConsent'
import NotificationBell from './NotificationBell'
import LanguageSwitcher from './LanguageSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
    const { user, logout, isAdmin } = useAuth()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [theme, setTheme] = useState('day')
    const userMenuRef = useRef(null)
    const isDayMode = theme === 'day'

    const navLinks = [
        { path: '/', label: 'Ana Sayfa' },
        { path: '/features', label: 'Özellikler' },
        { path: '/templates', label: 'Şablonlar' },
        { path: '/pricing', label: 'Fiyatlar' },
        { path: '/faq', label: 'SSS' },
        { path: '/support', label: 'Destek' }
    ]

    const isActive = (path) => location.pathname === path

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close user menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const storedTheme = window.localStorage.getItem('CVniz-home-theme')
        if (storedTheme === 'day' || storedTheme === 'night') {
            setTheme(storedTheme)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
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

    const applyTheme = (nextTheme) => {
        setTheme(nextTheme)
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('CVniz-home-theme', nextTheme)
            window.dispatchEvent(new CustomEvent('CVniz-theme-change', { detail: nextTheme }))
        }
    }

    const toggleTheme = () => applyTheme(isDayMode ? 'night' : 'day')

    const footerHeadingText = isDayMode ? 'text-slate-900' : 'text-white'
    const footerMutedText = isDayMode ? 'text-slate-600' : 'text-gray-400'
    const footerLinkBase = isDayMode ? 'text-slate-600 hover:text-sky-600' : 'text-gray-400 hover:text-cyan-400'

    return (
        <div className="min-h-screen flex flex-col">
            {/* Aurora Background Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <CookieConsent />

            {/* Premium Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'py-2 glass border-b border-white/10 shadow-lg shadow-black/5'
                : 'py-4 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all duration-300 group-hover:scale-110">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold gradient-text">CVniz</span>
                            <span className="text-[10px] text-gray-400 -mt-1 hidden sm:block">AI-Powered CV Builder</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1 p-1.5 rounded-2xl glass">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative text-sm px-4 py-2 rounded-xl transition-all duration-300 font-medium ${isActive(link.path)
                                        ? 'text-white bg-gradient-to-r from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <NotificationBell />

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold group-hover:scale-105 transition-transform shadow-lg">
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="hidden sm:flex flex-col items-start leading-tight">
                                            <span className="text-sm font-semibold text-white">{user.name?.split(' ')[0]}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{isAdmin ? 'Admin' : 'Üye'}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-white/5 mb-2">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hesap</p>
                                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                                </div>

                                                <Link
                                                    to={isAdmin ? '/admin' : '/dashboard'}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <Zap className="w-4 h-4 text-cyan-400" />
                                                    <span>Panel'e Git</span>
                                                </Link>

                                                <Link
                                                    to={isAdmin ? '/admin/settings' : '/dashboard'}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-purple-400" />
                                                    <span>Profil Ayarları</span>
                                                </Link>

                                                <div className="my-2 border-t border-white/5"></div>

                                                <button
                                                    onClick={() => {
                                                        setUserMenuOpen(false)
                                                        logout()
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Güvenli Çıkış</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                                >
                                    Giriş Yap
                                </Link>
                                <Link to="/editor" className="hidden sm:flex btn-premium !rounded-full px-5 py-2 text-sm group items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                                    <Sparkles className="w-4 h-4 group-hover:animate-spin shrink-0" />
                                    <span className="font-bold">CV Oluştur</span>
                                    <Zap className="hidden sm:block w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all shrink-0" />
                                </Link>
                            </>
                        )}

                        {/* Language Switcher */}
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-pressed={isDayMode}
                            title="Gece / Gündüz modu"
                            className={`hidden md:flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300 ${isDayMode
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                                }`}
                        >
                            {isDayMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Mobile Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-pressed={isDayMode}
                            className={`md:hidden p-2 rounded-xl border transition-colors ${isDayMode ? 'border-amber-200 text-amber-500 bg-white/70' : 'border-white/10 text-white bg-slate-900/70'}`}
                        >
                            {isDayMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 glass border-t border-white/10 animate-slide-down">
                        <nav className="flex flex-col p-4 gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`py-3 px-4 rounded-xl transition-colors ${isActive(link.path)
                                        ? 'text-cyan-300 bg-cyan-500/10 font-medium'
                                        : 'text-gray-300 hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="px-4 py-3 flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-3 px-4 rounded-xl text-gray-300 hover:bg-white/5 border border-white/5 text-center"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/editor"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="btn-premium w-full py-3 px-4 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>CV Oluştur</span>
                                </Link>
                            </div>
                            <div className="px-4 py-2 border-t border-white/5 mt-2">
                                <LanguageSwitcher />
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className={`relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900' : ''}`}>
                {/* Background Effects */}
                <div className={`absolute inset-0 pointer-events-none ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50 to-transparent' : 'bg-gradient-to-t from-cyan-950/20 to-transparent'}`} />
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDayMode ? 'bg-sky-100/70' : 'bg-cyan-500/5'}`} />
                <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDayMode ? 'bg-rose-100/60' : 'bg-slate-200/5'}`} />

                <div className={`relative ${isDayMode ? 'border-t border-slate-200/70 bg-white/70 backdrop-blur' : 'border-t border-white/10'}`}>
                    {/* Newsletter Section */}
                    <div className={`py-12 px-6 border-b ${isDayMode ? 'border-slate-200/70' : 'border-white/5'}`}>
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className={`text-xl font-bold mb-2 ${footerHeadingText}`}>📬 Kariyer İpuçları Al</h3>
                                <p className={`${footerMutedText} text-sm`}>Haftalık CV ve kariyer önerileri için bültenimize katılın.</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className={`flex-1 md:w-64 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition ${isDayMode
                                        ? 'bg-white border border-slate-200/70 text-slate-900 placeholder:text-slate-400 focus:ring-sky-100 shadow-day'
                                        : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:ring-cyan-500/30'
                                        }`}
                                />
                                <button className="btn-premium text-sm whitespace-nowrap">
                                    Abone Ol
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Footer Content */}
                    <div className={`py-12 px-6 ${isDayMode ? 'bg-white/60' : ''}`}>
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 mb-12">
                                {/* Brand Column - Hidden on mobile, shown on desktop */}
                                <div className="hidden md:block md:col-span-2">
                                    <Link to="/" className="flex items-center gap-2 mb-4 group">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center ring-1 ${isDayMode ? 'ring-slate-100 shadow-day' : 'ring-white/10'} group-hover:scale-110 transition-transform`}>
                                            <FileText className="w-5 h-5 text-slate-900" />
                                        </div>
                                        <span className="text-xl font-bold gradient-text">CVniz</span>
                                    </Link>
                                    <p className={`${footerMutedText} text-sm mb-6 leading-relaxed`}>
                                        AI destekli profesyonel CV oluşturucu. 65+ şablon, 50.000+ kullanıcı güveniyle Türkiye'nin #1 CV platformu.
                                    </p>
                                    {/* Social Icons */}
                                    <div className="flex gap-3">
                                        {[
                                            { name: 'Twitter', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                                            { name: 'LinkedIn', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                                            { name: 'Instagram', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> },
                                            { name: 'YouTube', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> }
                                        ].map((social, i) => (
                                            <a
                                                key={i}
                                                href="#"
                                                title={social.name}
                                                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-110 ${isDayMode
                                                    ? 'bg-white text-slate-500 border-slate-200/70 hover:text-sky-600 hover:border-sky-400/60 hover:bg-sky-50'
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                                                    }`}
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Links Columns - 3 column on mobile */}
                                <div>
                                    <h4 className={`font-bold mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wider ${footerHeadingText}`}>Ürün</h4>
                                    <ul className="space-y-1.5 md:space-y-3 text-xs md:text-sm">
                                        {[
                                            { to: '/features', label: 'Özellikler' },
                                            { to: '/templates', label: 'Şablonlar' },
                                            { to: '/pricing', label: 'Fiyatlar' },
                                            { to: '/editor', label: 'CV Editörü' }
                                        ].map((link, i) => (
                                            <li key={i}>
                                                <Link to={link.to} className={`${footerLinkBase} transition-colors`}>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className={`font-bold mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wider ${footerHeadingText}`}>Destek</h4>
                                    <ul className="space-y-1.5 md:space-y-3 text-xs md:text-sm">
                                        {[
                                            { to: '/faq', label: 'SSS' },
                                            { to: '/contact', label: 'İletişim' },
                                            { to: '/blog', label: 'Blog' },
                                            { to: '/help', label: 'Yardım' }
                                        ].map((link, i) => (
                                            <li key={i}>
                                                <Link to={link.to} className={`${footerLinkBase} transition-colors`}>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className={`font-bold mb-2 md:mb-4 text-xs md:text-sm uppercase tracking-wider ${footerHeadingText}`}>Yasal</h4>
                                    <ul className="space-y-1.5 md:space-y-3 text-xs md:text-sm">
                                        {[
                                            { to: '/privacy', label: 'Gizlilik' },
                                            { to: '/terms', label: 'Şartlar' },
                                            { to: '/cookies', label: 'Çerezler' },
                                            { to: '/gdpr', label: 'KVKK' }
                                        ].map((link, i) => (
                                            <li key={i}>
                                                <Link to={link.to} className={`${footerLinkBase} transition-colors`}>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Bottom Bar */}
                            <div className={`pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t ${isDayMode ? 'border-slate-200/70' : 'border-white/10'}`}>
                                <div className={`flex items-center gap-2 text-sm ${footerMutedText}`}>
                                    <span>© 2024 CVniz. Tüm hakları saklıdır.</span>
                                </div>

                                <img
                                    src="/images/iyzico-visa-mastercard-troy.png"
                                    alt="Ödeme Yöntemleri"
                                    className={`h-8 transition-all duration-300 ${isDayMode ? 'opacity-80' : 'opacity-60'} grayscale hover:grayscale-0 hover:opacity-100`}
                                />

                                <div className="flex items-center gap-6">
                                    <div className={`flex items-center gap-2 text-sm ${footerMutedText} hidden sm:flex`}>
                                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Tüm sistemler çalışıyor
                                    </div>
                                    <div className={`text-sm flex items-center gap-1 ${footerMutedText}`}>
                                        Türkiye'de <span className="text-lg">🇹🇷</span> <span className="text-red-500">❤️</span> ile yapıldı
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer >

        </div >
    )
}

