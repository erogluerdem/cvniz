import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FileText, User, LogOut, Menu, X, Sun, Moon, Sparkles, Zap, ChevronDown, Plus, LayoutGrid, Settings as SettingsIcon, Home as HomeIcon, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import CookieConsent from './CookieConsent'
import NotificationBell from './NotificationBell'
import LanguageSwitcher from './LanguageSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
    const { user, logout, isAdmin } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [theme, setTheme] = useState('day')
    const [isStandalone, setIsStandalone] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pullProgress, setPullProgress] = useState(0)
    const userMenuRef = useRef(null)
    const mainRef = useRef(null)
    const touchStartY = useRef(0)
    const isDayMode = theme === 'day'
    
    // Check if running as installed PWA
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
                || window.navigator.standalone 
                || document.referrer.includes('android-app://')
            setIsStandalone(isStandaloneMode)
        }
    }, [])

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

    // Pull to refresh handler
    const handleTouchStart = useCallback((e) => {
        if (mainRef.current && mainRef.current.scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY
        }
    }, [])
    
    const handleTouchMove = useCallback((e) => {
        if (mainRef.current && mainRef.current.scrollTop === 0) {
            const touchY = e.touches[0].clientY
            const diff = touchY - touchStartY.current
            if (diff > 0 && diff < 150) {
                setPullProgress(diff / 150)
            }
        }
    }, [])
    
    const handleTouchEnd = useCallback(() => {
        if (pullProgress > 0.6) {
            setIsRefreshing(true)
            setTimeout(() => {
                window.location.reload()
            }, 500)
        }
        setPullProgress(0)
    }, [pullProgress])
    
    // Swipe navigation
    const touchStartX = useRef(0)
    const handleSwipeStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX
    }, [])
    
    const handleSwipeEnd = useCallback((e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        const navPaths = ['/', '/features', '/templates', '/pricing', '/faq']
        const currentIndex = navPaths.indexOf(location.pathname)
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < navPaths.length - 1) {
                // Swipe left - go next
                navigate(navPaths[currentIndex + 1])
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - go prev
                navigate(navPaths[currentIndex - 1])
            }
        }
    }, [location.pathname, navigate])

    const footerHeadingText = isDayMode ? 'text-slate-900' : 'text-white'
    const footerMutedText = isDayMode ? 'text-slate-600' : 'text-gray-400'
    const footerLinkBase = isDayMode ? 'text-slate-600 hover:text-sky-600' : 'text-gray-400 hover:text-cyan-400'

    return (
        <div className={`min-h-screen flex flex-col ${isStandalone ? 'standalone-mode' : ''}`}>
            {/* Aurora Background Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <CookieConsent />

            {/* Premium Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-smooth ${scrolled
                ? 'py-3 glass border-b border-white/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]'
                : 'py-6 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-cyan-400 group-hover:border-cyan-400/50 transition-all duration-500 group-hover:scale-110 shadow-2xl overflow-hidden">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-cyan-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute -inset-2 rounded-2xl bg-cyan-400 opacity-0 group-hover:opacity-10 blur-xl transition-opacity animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white italic tracking-tighter group-hover:text-cyan-400 transition-colors">CVniz</span>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] -mt-1 hidden sm:block">AI Architect</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center">
                        <div className="flex items-center gap-1 p-1.5 rounded-2xl glass-card border-white/5">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative text-sm px-5 py-2.5 rounded-xl transition-all duration-500 font-bold tracking-tight ${isActive(link.path)
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    {isActive(link.path) && (
                                        <motion.div 
                                            layoutId="nav-active"
                                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
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
                                <Link to="/editor" className="btn-premium text-sm group">
                                    <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                                    <span>CV Oluştur</span>
                                    <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
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

                        {/* Mobile Menu Button - Enhanced */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl glass-card border-white/10 text-gray-400 hover:text-white"
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenuOpen ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                        <Menu className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Immersive Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="lg:hidden fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-2xl flex flex-col p-8 pt-24 overflow-y-auto"
                        >
                            {/* Close Button Inside Menu */}
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            <div className="flex flex-col gap-6">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="group flex flex-col">
                                    <span className="text-4xl font-black text-white group-hover:text-cyan-400 transition-colors">Ana Sayfa</span>
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Giriş ve Dashboard</span>
                                </Link>
                                
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex flex-col"
                                    >
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <span className={`text-4xl font-black transition-colors ${isActive(link.path) ? 'text-cyan-400' : 'text-white/60 group-hover:text-white'}`}>
                                                {link.label}
                                            </span>
                                        </motion.div>
                                    </Link>
                                ))}

                                <div className="mt-12 pt-8 border-t border-white/10">
                                    {!user ? (
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="btn-premium w-full py-5 text-xl font-black"
                                        >
                                            Giriş Yap
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-black text-white">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                                className="w-full py-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all"
                                            >
                                                Güvenli Çıkış
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Pull to Refresh Indicator */}
            {pullProgress > 0 && (
                <div 
                    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
                    style={{ 
                        paddingTop: 'calc(env(safe-area-inset-top) + 10px)',
                        opacity: pullProgress,
                        transform: `translateY(${(1 - pullProgress) * -20}px)`
                    }}
                >
                    <div className="glass-card rounded-full p-3 flex items-center gap-2">
                        <RefreshCw 
                            className={`w-5 h-5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`}
                            style={{ transform: `rotate(${pullProgress * 360}deg)` }}
                        />
                        <span className="text-xs font-medium text-white">
                            {isRefreshing ? 'Yenileniyor...' : 'Yenilemek için bırakın'}
                        </span>
                    </div>
                </div>
            )}

            {/* Main Content with Touch Handlers */}
            <main 
                ref={mainRef}
                className="flex-1 scroll-momentum overflow-y-auto"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ 
                    paddingTop: isStandalone ? 'env(safe-area-inset-top)' : undefined,
                    paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)'
                }}
            >
                <div onTouchStart={handleSwipeStart} onTouchEnd={handleSwipeEnd}>
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className={`relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900' : ''}`}>
                {/* Background Effects */}
                <div className={`absolute inset-0 pointer-events-none ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50 to-transparent' : 'bg-gradient-to-t from-cyan-950/20 to-transparent'}`} />
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDayMode ? 'bg-sky-100/70' : 'bg-cyan-500/5'}`} />
                <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isDayMode ? 'bg-rose-100/60' : 'bg-slate-200/5'}`} />

                <div className={`relative ${isDayMode ? 'border-t border-slate-200/70 bg-white/70 backdrop-blur' : 'border-t border-white/10'}`}>
                    {/* Newsletter Section */}
                    <div className={`py-16 px-6 relative overflow-hidden ${isDayMode ? 'border-b border-slate-200/70' : 'border-b border-white/5'}`}>
                        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <h3 className={`text-3xl font-black mb-3 italic tracking-tighter ${footerHeadingText}`}>📬 Kariyer İpuçları Al</h3>
                                <p className={`${footerMutedText} text-lg font-medium opacity-80`}>Haftalık CV ve kariyer önerileri için 50.000+ profesyonele katılın.</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto p-2 glass-card rounded-2xl border-white/5">
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className={`flex-1 md:w-80 px-6 py-4 rounded-xl text-lg focus:outline-none transition-all ${isDayMode
                                        ? 'bg-slate-50 border border-slate-200/70 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                                        : 'bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10'
                                        }`}
                                />
                                <button className="btn-premium px-8 py-4 text-lg font-black tracking-tight">
                                    KATIL
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

            {/* Mobile Bottom Navigation Bar - Only on smaller screens */}
            <div className="lg:hidden fixed-bottom-nav px-8 py-4 flex items-center justify-between gap-4">
                <Link to="/" className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${isActive('/') ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-white'}`}>
                    <div className={`p-2 rounded-xl ${isActive('/') ? 'bg-cyan-500/10' : ''}`}>
                        <HomeIcon className="w-5 h-5" />
                    </div>
                </Link>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${location.pathname.includes('dashboard') || location.pathname.includes('admin') ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-white'}`}>
                    <div className={`p-2 rounded-xl ${location.pathname.includes('dashboard') || location.pathname.includes('admin') ? 'bg-cyan-500/10' : ''}`}>
                        <LayoutGrid className="w-5 h-5" />
                    </div>
                </Link>
                <Link to="/editor" className="flex flex-col items-center gap-1 flex-1 -mt-12 group">
                    <div className="w-16 h-16 rounded-3xl bg-slate-950 border-4 border-slate-900 flex items-center justify-center text-cyan-400 shadow-[0_0_40px_-5px_rgba(34,211,238,0.4)] transition-transform group-active:scale-95">
                        <Plus className="w-9 h-9" />
                    </div>
                </Link>
                <Link to="/templates" className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${isActive('/templates') ? 'text-cyan-400 scale-110' : 'text-gray-500 hover:text-white'}`}>
                    <div className={`p-2 rounded-xl ${isActive('/templates') ? 'bg-cyan-500/10' : ''}`}>
                        <FileText className="w-5 h-5" />
                    </div>
                </Link>
                <button onClick={toggleTheme} className="flex flex-col items-center gap-1.5 flex-1 text-gray-500">
                    <div className="p-2">
                        {isDayMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    </div>
                </button>
            </div>
        </div >
    )
}

