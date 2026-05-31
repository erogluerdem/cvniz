import React, { useState, useRef, useEffect } from 'react'
import { X, Check, Sparkles, Eye, Layout, FileText, Crown } from 'lucide-react'
import CVPreview from './CVPreview'

/**
 * TemplatePreviewTooltip - Faz 1: Gelişmiş Template Önizleme
 * Template hover'da büyük tooltip/live preview
 * Template karşılaştırma (A/B görünüm)
 */
export function TemplatePreviewTooltip({
    template,
    cvData,
    isVisible,
    position = { x: 0, y: 0 },
    onClose,
    onSelect,
    isDayMode = false,
    isPremium = false,
    compareMode = false,
    compareTemplate = null,
    onCompareToggle
}) {
    const tooltipRef = useRef(null)
    const [adjustedPosition, setAdjustedPosition] = useState(position)
    const [isHoveringTooltip, setIsHoveringTooltip] = useState(false)
    const closeTimeoutRef = useRef(null)

    // Adjust position to keep tooltip within viewport
    useEffect(() => {
        if (!isVisible) return
        
        const tooltipWidth = compareMode ? 900 : 420
        const tooltipHeight = 600 // approximate max height
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        let newX = position.x
        let newY = position.y
        
        // Adjust horizontal position - center tooltip
        if (newX < 10) newX = 10
        if (newX + tooltipWidth > viewportWidth) {
            newX = Math.max(10, viewportWidth - tooltipWidth - 10)
        }
        
        // Adjust vertical position - if too close to bottom, show above
        if (newY + tooltipHeight > viewportHeight) {
            newY = Math.max(10, position.y - tooltipHeight - 20)
        }
        if (newY < 10) newY = 10
        
        setAdjustedPosition({ x: newX, y: newY })
    }, [position, isVisible, compareMode])

    // Delayed close to allow moving mouse from button to tooltip
    useEffect(() => {
        if (!isVisible && !isHoveringTooltip) {
            closeTimeoutRef.current = setTimeout(() => {
                onClose?.()
            }, 200)
        }
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current)
            }
        }
    }, [isVisible, isHoveringTooltip, onClose])

    if (!isVisible || !template) return null

    const isTemplatePremium = template?.isPremium || false
    const canUse = !isTemplatePremium || isPremium

    return (
        <div
            ref={tooltipRef}
            data-template-tooltip="true"
            className={`fixed z-[9999] rounded-2xl shadow-2xl overflow-hidden animate-scale-in ${
                isDayMode 
                    ? 'bg-white border border-slate-200' 
                    : 'bg-[#161920] border border-white/10'
            }`}
            style={{
                left: adjustedPosition.x,
                top: adjustedPosition.y,
                width: compareMode ? 900 : 420,
                maxHeight: '85vh'
            }}
            onMouseEnter={() => setIsHoveringTooltip(true)}
            onMouseLeave={() => {
                setIsHoveringTooltip(false)
                onClose?.()
            }}
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
                isDayMode ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-white/5'
            }`}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{template.emoji || '📄'}</span>
                    <div>
                        <h4 className={`font-bold text-sm ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                            {template.name}
                        </h4>
                        <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {template.category}
                        </p>
                    </div>
                    {isTemplatePremium && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                            <Crown className="w-3 h-3" />
                            Pro
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    {onCompareToggle && (
                        <button
                            onClick={onCompareToggle}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                compareMode
                                    ? 'bg-cyan-500 text-slate-950'
                                    : isDayMode 
                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                        : 'bg-white/10 text-slate-400 hover:bg-white/20'
                            }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            {compareMode ? 'Karşılaştırma' : 'Karşılaştır'}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isDayMode 
                                ? 'hover:bg-slate-200 text-slate-400' 
                                : 'hover:bg-white/10 text-slate-400'
                        }`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className={`p-4 overflow-auto custom-scrollbar ${compareMode ? 'flex gap-4' : ''}`} 
                 style={{ maxHeight: 'calc(85vh - 140px)' }}>
                {/* Main Template */}
                <div className={`${compareMode ? 'flex-1' : ''}`}>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDayMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                        {compareMode ? 'Şablon A' : 'Önizleme'}
                    </div>
                    <div className={`rounded-xl overflow-hidden border ${
                        isDayMode ? 'border-slate-200' : 'border-white/10'
                    }`} style={{ height: compareMode ? 500 : 400 }}>
                        <div className="w-full h-full overflow-hidden" style={{ 
                            transform: 'scale(0.35)',
                            transformOrigin: 'top left',
                            width: '286%',
                            height: '286%'
                        }}>
                            <CVPreview
                                cvData={cvData}
                                template={template.id}
                                showWatermark={isTemplatePremium && !isPremium}
                                theme={{}}
                            />
                        </div>
                    </div>
                </div>

                {/* Compare Template */}
                {compareMode && compareTemplate && (
                    <div className="flex-1">
                        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                            isDayMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Şablon B: {compareTemplate.name}
                        </div>
                        <div className={`rounded-xl overflow-hidden border ${
                            isDayMode ? 'border-slate-200' : 'border-white/10'
                        }`} style={{ height: 500 }}>
                            <div className="w-full h-full overflow-hidden" style={{ 
                                transform: 'scale(0.35)',
                                transformOrigin: 'top left',
                                width: '286%',
                                height: '286%'
                            }}>
                                <CVPreview
                                    cvData={cvData}
                                    template={compareTemplate.id}
                                    showWatermark={compareTemplate.isPremium && !isPremium}
                                    theme={{}}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Description */}
            {template.description && !compareMode && (
                <div className={`px-4 py-3 border-t text-sm ${
                    isDayMode ? 'border-slate-100 text-slate-600' : 'border-white/10 text-slate-400'
                }`}>
                    {template.description}
                </div>
            )}

            {/* Footer Actions */}
            <div className={`flex items-center justify-between px-4 py-3 border-t ${
                isDayMode ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-white/5'
            }`}>
                <div className="flex items-center gap-3 text-xs">
                    {template.colors && (
                        <div className="flex items-center gap-1.5">
                            <span className={isDayMode ? 'text-slate-500' : 'text-slate-400'}>Renkler:</span>
                            <div className="flex gap-1">
                                {Object.values(template.colors).slice(0, 3).map((color, i) => (
                                    <div 
                                        key={i}
                                        className="w-4 h-4 rounded-full border border-white/20"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    {canUse ? (
                        <button
                            onClick={() => {
                                onSelect?.(template.id)
                                onClose?.()
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-cyan-400 transition-all"
                        >
                            <Check className="w-4 h-4" />
                            Seç
                        </button>
                    ) : (
                        <button
                            onClick={() => onSelect?.(template.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-400 transition-all"
                        >
                            <Crown className="w-4 h-4" />
                            Yükselt
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * TemplateQuickAccess - Favori template'ler için Quick Access Toolbar
 */
export function TemplateQuickAccess({
    templates,
    selectedTemplate,
    onSelect,
    onHover,
    favorites = [],
    onToggleFavorite,
    isDayMode = false
}) {
    const [showAll, setShowAll] = useState(false)
    const scrollRef = useRef(null)

    const handleWheel = (e) => {
        if (e.deltaY === 0) return
        e.preventDefault()
        scrollRef.current.scrollLeft += e.deltaY * 1.5
    }

    const displayTemplates = showAll ? templates : templates.slice(0, 8)

    return (
        <div className={`flex items-center gap-2 p-2 rounded-2xl border ${
            isDayMode 
                ? 'bg-white/90 border-slate-200 shadow-sm' 
                : 'bg-[#0f1115]/90 border-white/10'
        }`}>
            <div 
                ref={scrollRef}
                onWheel={handleWheel}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[600px]"
            >
                {displayTemplates.map((template) => {
                    const isSelected = selectedTemplate === template.id
                    const isFavorite = favorites.includes(template.id)
                    
                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            onMouseEnter={(e) => onHover?.(template, e)}
                            onMouseLeave={(e) => onHover?.(null, e)}
                            className={`relative group flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                                isSelected
                                    ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                    : isDayMode
                                        ? 'bg-slate-50 border border-slate-200 hover:border-cyan-300 hover:bg-white'
                                        : 'bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10'
                            }`}
                        >
                            <span className="text-xl mb-0.5">{template.emoji || '📄'}</span>
                            
                            {/* Favorite indicator */}
                            {isFavorite && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                                    <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                                </div>
                            )}
                            
                            {/* Premium indicator */}
                            {template.isPremium && !isSelected && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-amber-500/80">
                                    <Crown className="w-2 h-2 text-slate-950" />
                                </div>
                            )}
                            
                            {/* Selected indicator */}
                            {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-[#0f1115]">
                                    <Check className="w-3 h-3 text-slate-950" />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
            
            {!showAll && templates.length > 8 && (
                <button
                    onClick={() => setShowAll(true)}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border border-dashed transition-all ${
                        isDayMode
                            ? 'border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                            : 'border-white/20 text-slate-500 hover:border-white/40 hover:text-slate-300'
                    }`}
                >
                    <Layout className="w-5 h-5 mb-0.5" />
                    <span className="text-[8px] font-black">+{templates.length - 8}</span>
                </button>
            )}
        </div>
    )
}

export default TemplatePreviewTooltip
