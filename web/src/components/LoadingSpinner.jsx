import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, FileText, Loader2 } from 'lucide-react'

/**
 * Premium Loading Spinner Component for CVniz
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'fullscreen'
 * - text: Optional text to display below the loader
 * - premium: Whether to display the premium multi-color gradient style
 */
const LoadingSpinner = ({ size = 'md', text = '', premium = true }) => {
    // Spinner sizes
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        fullscreen: 'w-24 h-24'
    }

    const containerStyle = size === 'fullscreen' 
        ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md" 
        : "flex flex-col items-center justify-center p-4"

    return (
        <div className={containerStyle}>
            <div className="relative flex items-center justify-center">
                {/* 1. Outer Premium Rotating Gradient Aura */}
                {premium && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className={`absolute rounded-full bg-gradient-to-tr from-violet-500 via-cyan-400 to-amber-400 opacity-70 blur-md ${
                            size === 'sm' ? 'w-7 h-7' : 
                            size === 'md' ? 'w-14 h-14' : 
                            size === 'lg' ? 'w-22 h-22' : 'w-32 h-32'
                        }`}
                    />
                )}

                {/* 2. Middle Pulsing / Scaling Ring */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 0.4, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute rounded-full border border-white/20 ${
                        size === 'sm' ? 'w-6 h-6' : 
                        size === 'md' ? 'w-12 h-12' : 
                        size === 'lg' ? 'w-20 h-20' : 'w-28 h-28'
                    }`}
                />

                {/* 3. Core Rotating Element */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className={`flex items-center justify-center rounded-full bg-slate-900 shadow-xl border border-white/10 ${sizeClasses[size] || sizeClasses.md}`}
                >
                    {size === 'sm' ? (
                        <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                    ) : size === 'md' ? (
                        <Sparkles className="w-5 h-5 text-cyan-300" />
                    ) : (
                        <FileText className="w-8 h-8 text-violet-400" />
                    )}
                </motion.div>

                {/* 4. Little Orbiting Sparkle (for larger sizes) */}
                {size !== 'sm' && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-full"
                    >
                        <motion.div 
                            animate={{ scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]"
                        />
                    </motion.div>
                )}
            </div>

            {/* 5. Elegant Text */}
            {text && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 font-black tracking-widest text-center uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 ${
                        size === 'sm' ? 'text-[10px]' : 
                        size === 'md' ? 'text-xs' : 'text-sm'
                    }`}
                >
                    <span className="inline-flex items-center gap-1.5">
                        {text}
                        <span className="inline-flex gap-0.5">
                            <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                    </span>
                </motion.div>
            )}
        </div>
    )
}

export default LoadingSpinner
