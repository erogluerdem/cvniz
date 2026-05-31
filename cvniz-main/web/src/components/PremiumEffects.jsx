import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Rocket, MessageCircle, ArrowUp, X } from 'lucide-react'

// Floating Action Button with Multiple Actions
export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const actions = [
        { icon: <Sparkles className="w-5 h-5" />, label: 'CV Oluştur', to: '/editor', gradient: 'from-cyan-500 to-blue-600' },
        { icon: <MessageCircle className="w-5 h-5" />, label: 'Destek', to: '/support', gradient: 'from-purple-500 to-pink-600' },
    ]

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-end gap-3">
            {/* Scroll to Top */}
            {showScrollTop && !isOpen && (
                <button
                    onClick={scrollToTop}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 animate-fade-in shadow-lg"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}

            {/* Action Buttons */}
            {isOpen && actions.map((action, index) => (
                <Link
                    key={index}
                    to={action.to}
                    className="flex items-center gap-3 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-lg text-sm font-medium text-white whitespace-nowrap">
                        {action.label}
                    </span>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg shadow-black/20 hover:scale-110 transition-transform`}>
                        {action.icon}
                    </div>
                </Link>
            ))}

            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-500 group ${
                    isOpen 
                        ? 'bg-slate-800 hover:bg-slate-700 rotate-45' 
                        : 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 hover:scale-110'
                }`}
                style={{
                    boxShadow: isOpen 
                        ? '0 10px 30px rgba(0,0,0,0.3)' 
                        : '0 10px 40px rgba(0, 212, 255, 0.4), 0 0 60px rgba(124, 58, 237, 0.2)'
                }}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                )}
            </button>
        </div>
    )
}

// Cursor Glow Effect Component
export function CursorGlow() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
            setIsVisible(true)
        }
        const handleMouseLeave = () => setIsVisible(false)

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div
            className="fixed pointer-events-none z-50 transition-opacity duration-300 mix-blend-screen"
            style={{
                left: position.x - 150,
                top: position.y - 150,
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%)',
                opacity: isVisible ? 1 : 0,
            }}
        />
    )
}

// Aurora Background Component
export function AuroraBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Main gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            
            {/* Aurora orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            
            {/* Mesh overlay */}
            <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px'
                }}
            />
        </div>
    )
}

// Animated Gradient Border
export function GradientBorder({ children, className = '', animate = true }) {
    return (
        <div className={`relative p-[1px] rounded-2xl overflow-hidden ${className}`}>
            <div 
                className={`absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 ${
                    animate ? 'animate-gradient-x' : ''
                }`}
                style={{ backgroundSize: '200% 200%' }}
            />
            <div className="relative bg-slate-900 rounded-2xl">
                {children}
            </div>
        </div>
    )
}

// Glow Button
export function GlowButton({ children, className = '', onClick, as: Component = 'button', to, ...props }) {
    const Wrapper = to ? Link : Component

    return (
        <Wrapper
            to={to}
            onClick={onClick}
            className={`
                relative inline-flex items-center justify-center gap-2 
                px-8 py-4 rounded-xl font-semibold
                bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600
                text-white overflow-hidden
                transition-all duration-300
                hover:scale-105 hover:-translate-y-1
                active:scale-100
                group
                ${className}
            `}
            style={{
                boxShadow: '0 10px 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(124, 58, 237, 0.15)'
            }}
            {...props}
        >
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </Wrapper>
    )
}

// Animated Stats Counter
export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2000 }) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        if (hasAnimated) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true)
                    const start = Date.now()
                    const numValue = parseInt(value.toString().replace(/\D/g, ''), 10)
                    
                    const timer = setInterval(() => {
                        const now = Date.now()
                        const progress = Math.min((now - start) / duration, 1)
                        const easeOut = 1 - Math.pow(1 - progress, 3)
                        setCount(Math.floor(numValue * easeOut))
                        
                        if (progress === 1) clearInterval(timer)
                    }, 16)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById(`counter-${value}`)
        if (element) observer.observe(element)
        
        return () => observer.disconnect()
    }, [value, duration, hasAnimated])

    return (
        <span id={`counter-${value}`} className="tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    )
}

// Scroll Progress Indicator
export function ScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPosition = window.scrollY
            setProgress((scrollPosition / totalHeight) * 100)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-slate-800/50">
            <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

// Magnetic Button (follows cursor slightly)
export function MagneticButton({ children, className = '', strength = 0.3 }) {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) * strength
        const y = (e.clientY - rect.top - rect.height / 2) * strength
        setPosition({ x, y })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <button
            className={`transition-transform duration-200 ${className}`}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </button>
    )
}

// Reveal on Scroll Animation
export function RevealOnScroll({ children, className = '', delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )

        const element = document.getElementById(`reveal-${delay}`)
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [delay])

    return (
        <div
            id={`reveal-${delay}`}
            className={`transition-all duration-700 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    )
}

// Export all components
export default {
    FloatingActionButton,
    CursorGlow,
    AuroraBackground,
    GradientBorder,
    GlowButton,
    AnimatedCounter,
    ScrollProgress,
    MagneticButton,
    RevealOnScroll
}
