import React, { useState, useRef, useCallback, useEffect } from 'react'
import { GripVertical, Layout, Eye, Edit3 } from 'lucide-react'

/**
 * SplitView Component - Faz 1: Split View (Resize Handle ile)
 * Form ve Preview arasında sürüklenebilir bölme çubuğu
 * Modlar: Split | Form Only | Preview Only
 */
export default function SplitView({
    leftPanel,      // Form editor
    rightPanel,     // Preview
    defaultSplit = 50, // Varsayılan bölme yüzdesi
    minLeftWidth = 30, // Minimum sol panel genişliği (%)
    maxLeftWidth = 70, // Maksimum sol panel genişliği (%)
    isDayMode = false,
    isMobile = false
}) {
    const [splitPosition, setSplitPosition] = useState(defaultSplit)
    const [mode, setMode] = useState('split') // 'split' | 'left' | 'right'
    const [isDragging, setIsDragging] = useState(false)
    const containerRef = useRef(null)
    const splitRef = useRef(defaultSplit)

    // Drag handling
    const handleMouseDown = useCallback((e) => {
        if (mode !== 'split') return
        setIsDragging(true)
        e.preventDefault()
    }, [mode])

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return
        
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = (x / rect.width) * 100
        
        // Clamp between min and max
        const clamped = Math.max(minLeftWidth, Math.min(maxLeftWidth, percentage))
        splitRef.current = clamped
        setSplitPosition(clamped)
    }, [isDragging, minLeftWidth, maxLeftWidth])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // Touch handling for mobile
    const handleTouchStart = useCallback((e) => {
        if (mode !== 'split') return
        setIsDragging(true)
    }, [mode])

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return
        
        const container = containerRef.current
        const rect = container.getBoundingClientRect()
        const touch = e.touches[0]
        const x = touch.clientX - rect.left
        const percentage = (x / rect.width) * 100
        
        const clamped = Math.max(minLeftWidth, Math.min(maxLeftWidth, percentage))
        splitRef.current = clamped
        setSplitPosition(clamped)
    }, [isDragging, minLeftWidth, maxLeftWidth])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('touchmove', handleTouchMove)
            document.addEventListener('touchend', handleMouseUp)
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
                document.removeEventListener('touchmove', handleTouchMove)
                document.removeEventListener('touchend', handleMouseUp)
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

    // Mode değiştiğinde position'ı koru
    const handleModeChange = (newMode) => {
        if (newMode === 'split' && mode !== 'split') {
            setMode('split')
        } else {
            setMode(newMode)
        }
    }

    // Mobil'de split mod desteklenmez
    const effectiveMode = isMobile ? mode : mode

    if (isMobile) {
        // Mobile: Tam ekran geçiş
        return (
            <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
                {/* Left Panel (Form) */}
                <div 
                    className={`absolute inset-0 transition-transform duration-300 ${
                        mode === 'left' ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {leftPanel}
                </div>

                {/* Right Panel (Preview) */}
                <div 
                    className={`absolute inset-0 transition-transform duration-300 ${
                        mode === 'right' ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {rightPanel}
                </div>

                {/* Mode Toggle */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-2xl border backdrop-blur-xl z-50 ${
                    isDayMode 
                        ? 'bg-white/90 border-slate-200 shadow-lg' 
                        : 'bg-[#0f1115]/90 border-white/10'
                }`}>
                    <button
                        onClick={() => handleModeChange('left')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            mode === 'left'
                                ? 'bg-cyan-500 text-slate-950'
                                : isDayMode ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                        }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        Düzenle
                    </button>
                    <button
                        onClick={() => handleModeChange('right')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            mode === 'right'
                                ? 'bg-cyan-500 text-slate-950'
                                : isDayMode ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                        }`}
                    >
                        <Eye className="w-4 h-4" />
                        Önizleme
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
            {/* Left Panel */}
            <div 
                className="h-full overflow-hidden transition-all duration-200 ease-out"
                style={{ 
                    width: mode === 'split' ? `${splitPosition}%` : mode === 'left' ? '100%' : '0%',
                    minWidth: mode === 'left' ? '100%' : '0%',
                    opacity: mode === 'right' ? 0 : 1,
                    pointerEvents: mode === 'right' ? 'none' : 'auto'
                }}
            >
                {leftPanel}
            </div>

            {/* Resize Handle */}
            {mode === 'split' && (
                <div
                    className={`relative z-20 flex items-center justify-center cursor-col-resize group ${
                        isDragging ? 'cursor-col-resize' : ''
                    }`}
                    style={{ width: '16px', marginLeft: '-8px', marginRight: '-8px' }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* Handle Line */}
                    <div className={`h-full w-px transition-all duration-200 ${
                        isDragging 
                            ? 'bg-cyan-500' 
                            : 'bg-white/10 group-hover:bg-cyan-500/50'
                    }`} />
                    
                    {/* Handle Knob */}
                    <div className={`absolute w-6 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isDragging
                            ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/30'
                            : isDayMode
                                ? 'bg-white border border-slate-200 text-slate-400 group-hover:text-cyan-500 group-hover:border-cyan-300'
                                : 'bg-white/10 border border-white/20 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30'
                    }`}>
                        <GripVertical className="w-3 h-3" />
                    </div>

                    {/* Visual Indicator */}
                    {isDragging && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none">
                            <div className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap">
                                {Math.round(splitPosition)}%
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Right Panel */}
            <div 
                className="h-full overflow-hidden transition-all duration-200 ease-out"
                style={{ 
                    width: mode === 'split' ? `${100 - splitPosition}%` : mode === 'right' ? '100%' : '0%',
                    minWidth: mode === 'right' ? '100%' : '0%',
                    opacity: mode === 'left' ? 0 : 1,
                    pointerEvents: mode === 'left' ? 'none' : 'auto'
                }}
            >
                {rightPanel}
            </div>

            {/* View Mode Controls - Moved to bottom left to avoid overlap */}
            <div className={`absolute bottom-6 left-6 flex gap-1 p-1.5 rounded-xl border backdrop-blur-xl z-30 shadow-lg ${
                isDayMode 
                    ? 'bg-white/95 border-slate-200' 
                    : 'bg-[#0f1115]/95 border-white/10'
            }`}>
                <button
                    onClick={() => handleModeChange('left')}
                    title="Sadece Form"
                    className={`p-2 rounded-lg transition-all ${
                        mode === 'left'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : isDayMode ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                    }`}
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleModeChange('split')}
                    className={`p-2 rounded-lg transition-all ${
                        mode === 'split'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : isDayMode ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                    }`}
                    title="Bölünmüş Görünüm"
                >
                    <Layout className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleModeChange('right')}
                    title="Sadece Önizleme"
                    className={`p-2 rounded-lg transition-all ${
                        mode === 'right'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : isDayMode ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'
                    }`}
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            {/* Overlay when dragging */}
            {isDragging && (
                <div className="fixed inset-0 z-10 cursor-col-resize" />
            )}
        </div>
    )
}
