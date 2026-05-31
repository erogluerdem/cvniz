import React, { useState, useCallback } from 'react'
import { 
    GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, 
    Layout, Check, X, Sparkles, Trash2, Plus
} from 'lucide-react'

/**
 * SectionReorder - Faz 3: Sürükle-Bırak Bölüm Yönetimi
 * CV bölümlerinin sırasını değiştirme
 * Bölümleri göster/gizle (visibility toggle)
 * Özel bölüm oluşturucu
 */
const DEFAULT_SECTIONS = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: '👤', visible: true, locked: true },
    { id: 'summary', label: 'Profesyonel Özet', icon: '📝', visible: true },
    { id: 'experience', label: 'İş Deneyimi', icon: '💼', visible: true },
    { id: 'education', label: 'Eğitim', icon: '🎓', visible: true },
    { id: 'skills', label: 'Beceriler', icon: '🛠️', visible: true },
    { id: 'projects', label: 'Projeler', icon: '🚀', visible: true },
    { id: 'certifications', label: 'Sertifikalar', icon: '🏆', visible: true },
    { id: 'languages', label: 'Diller', icon: '🌍', visible: false },
    { id: 'references', label: 'Referanslar', icon: '👥', visible: false },
    { id: 'hobbies', label: 'Hobiler', icon: '🎨', visible: false }
]

export default function SectionReorder({
    sections = DEFAULT_SECTIONS,
    onReorder,
    onToggleVisibility,
    onAddCustom,
    onRemove,
    isDayMode = false,
    isPremium = false,
    onOpenUpsell
}) {
    const [items, setItems] = useState(sections)
    const [draggedItem, setDraggedItem] = useState(null)
    const [dragOverIndex, setDragOverIndex] = useState(null)
    const [showCustomForm, setShowCustomForm] = useState(false)
    const [customSectionName, setCustomSectionName] = useState('')

    // Calculate section strength
    const sectionStrength = useCallback(() => {
        const visibleCount = items.filter(i => i.visible).length
        const total = items.length
        return Math.round((visibleCount / total) * 100)
    }, [items])

    const handleDragStart = (index) => {
        if (!isPremium) {
            onOpenUpsell?.()
            return
        }
        setDraggedItem(index)
    }

    const handleDragOver = (e, index) => {
        e.preventDefault()
        if (draggedItem === null || draggedItem === index) return
        
        setDragOverIndex(index)
    }

    const handleDrop = (e, dropIndex) => {
        e.preventDefault()
        if (draggedItem === null || draggedItem === dropIndex) {
            setDraggedItem(null)
            setDragOverIndex(null)
            return
        }

        const newItems = [...items]
        const [removed] = newItems.splice(draggedItem, 1)
        newItems.splice(dropIndex, 0, removed)

        setItems(newItems)
        setDraggedItem(null)
        setDragOverIndex(null)
        onReorder?.(newItems)
    }

    const handleToggle = (id) => {
        const item = items.find(i => i.id === id)
        if (item?.locked) return // Can't hide locked sections

        const newItems = items.map(item => 
            item.id === id ? { ...item, visible: !item.visible } : item
        )
        setItems(newItems)
        onToggleVisibility?.(id, !item?.visible)
    }

    const handleMove = (index, direction) => {
        if (!isPremium) {
            onOpenUpsell?.()
            return
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= items.length) return

        const newItems = [...items]
        const [removed] = newItems.splice(index, 1)
        newItems.splice(newIndex, 0, removed)

        setItems(newItems)
        onReorder?.(newItems)
    }

    const handleAddCustom = () => {
        if (!customSectionName.trim()) return

        if (!isPremium) {
            onOpenUpsell?.()
            return
        }

        const newSection = {
            id: `custom-${Date.now()}`,
            label: customSectionName,
            icon: '📄',
            visible: true,
            isCustom: true
        }

        const newItems = [...items, newSection]
        setItems(newItems)
        setCustomSectionName('')
        setShowCustomForm(false)
        onAddCustom?.(newSection)
    }

    const handleRemove = (id) => {
        const item = items.find(i => i.id === id)
        if (item?.locked || !item?.isCustom) return

        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        onRemove?.(id)
    }

    const visibleSections = items.filter(i => i.visible).length
    const hiddenSections = items.filter(i => !i.visible).length

    return (
        <div className={`p-6 rounded-2xl border ${
            isDayMode ? 'bg-white border-slate-200' : 'bg-[#161920] border-white/10'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDayMode ? 'bg-slate-100' : 'bg-white/10'
                    }`}>
                        <Layout className={`w-5 h-5 ${isDayMode ? 'text-slate-700' : 'text-slate-300'}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                            Bölüm Düzeni
                        </h3>
                        <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Sürükle-bırak ile yeniden sıralayın
                        </p>
                    </div>
                </div>
                
                {/* Strength Indicator */}
                <div className="text-right">
                    <div className={`text-2xl font-black ${
                        visibleSections >= 5 ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                        {visibleSections}
                    </div>
                    <div className={`text-[10px] uppercase tracking-wider ${
                        isDayMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                        Aktif Bölüm
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className={`flex items-center gap-4 mb-4 p-3 rounded-xl ${
                isDayMode ? 'bg-slate-50' : 'bg-white/5'
            }`}>
                <div className="flex-1">
                    <div className={`h-2 rounded-full overflow-hidden ${
                        isDayMode ? 'bg-slate-200' : 'bg-white/10'
                    }`}>
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500"
                            style={{ width: `${(visibleSections / items.length) * 100}%` }}
                        />
                    </div>
                </div>
                <span className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {visibleSections}/{items.length}
                </span>
            </div>

            {/* Sections List */}
            <div className="space-y-2 mb-4">
                {items.map((section, index) => {
                    const isDragged = draggedItem === index
                    const isDragOver = dragOverIndex === index && draggedItem !== index

                    return (
                        <div
                            key={section.id}
                            draggable={isPremium && !section.locked}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={() => {
                                setDraggedItem(null)
                                setDragOverIndex(null)
                            }}
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                isDragged
                                    ? 'opacity-50 scale-95'
                                    : isDragOver
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : isDayMode
                                            ? 'border-slate-200 bg-white hover:border-slate-300'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                            } ${!isPremium && !section.locked ? 'cursor-pointer' : ''}`}
                        >
                            {/* Drag Handle */}
                            <div className={`${
                                isPremium && !section.locked
                                    ? 'cursor-grab active:cursor-grabbing text-slate-400'
                                    : 'text-slate-600 cursor-not-allowed'
                            }`}>
                                <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Icon */}
                            <span className="text-xl">{section.icon}</span>

                            {/* Label */}
                            <span className={`flex-1 font-medium text-sm ${
                                section.visible
                                    ? (isDayMode ? 'text-slate-700' : 'text-slate-200')
                                    : (isDayMode ? 'text-slate-400' : 'text-slate-500')
                            }`}>
                                {section.label}
                                {section.locked && (
                                    <span className={`ml-2 text-[10px] ${
                                        isDayMode ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                        (Zorunlu)
                                    </span>
                                )}
                            </span>

                            {/* Visibility Toggle */}
                            <button
                                onClick={() => handleToggle(section.id)}
                                disabled={section.locked}
                                className={`p-1.5 rounded-lg transition-all ${
                                    section.visible
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : (isDayMode ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-slate-500')
                                } ${section.locked ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Move Buttons */}
                            <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                                !isPremium ? 'hidden' : ''
                            }`}>
                                <button
                                    onClick={() => handleMove(index, 'up')}
                                    disabled={index === 0}
                                    className={`p-1 rounded transition-colors ${
                                        index === 0
                                            ? 'text-slate-600 cursor-not-allowed'
                                            : (isDayMode ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400')
                                    }`}
                                >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleMove(index, 'down')}
                                    disabled={index === items.length - 1}
                                    className={`p-1 rounded transition-colors ${
                                        index === items.length - 1
                                            ? 'text-slate-600 cursor-not-allowed'
                                            : (isDayMode ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400')
                                    }`}
                                >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Remove Button (custom sections only) */}
                            {section.isCustom && (
                                <button
                                    onClick={() => handleRemove(section.id)}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Add Custom Section */}
            {!showCustomForm ? (
                <button
                    onClick={() => {
                        if (!isPremium) {
                            onOpenUpsell?.()
                            return
                        }
                        setShowCustomForm(true)
                    }}
                    className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${
                        isDayMode
                            ? 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                            : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium text-sm">Özel Bölüm Ekle</span>
                    {!isPremium && <Sparkles className="w-3 h-3 text-amber-500" />}
                </button>
            ) : (
                <div className={`p-4 rounded-xl border ${
                    isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                }`}>
                    <input
                        type="text"
                        value={customSectionName}
                        onChange={(e) => setCustomSectionName(e.target.value)}
                        placeholder="Bölüm adı..."
                        className={`w-full px-3 py-2 rounded-lg border outline-none mb-3 ${
                            isDayMode
                                ? 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
                                : 'bg-[#0f1115] border-white/10 text-white placeholder:text-slate-500'
                        }`}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCustomForm(false)}
                            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                                isDayMode
                                    ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    : 'bg-white/10 text-slate-400 hover:bg-white/20'
                            }`}
                        >
                            <X className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                            onClick={handleAddCustom}
                            disabled={!customSectionName.trim()}
                            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                                customSectionName.trim()
                                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <Check className="w-4 h-4 mx-auto" />
                        </button>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className={`mt-4 p-4 rounded-xl ${
                isDayMode ? 'bg-amber-50 border border-amber-100' : 'bg-amber-500/10 border border-amber-500/20'
            }`}>
                <p className={`text-xs leading-relaxed ${
                    isDayMode ? 'text-amber-700' : 'text-amber-400'
                }`}>
                    💡 <strong>İpucu:</strong> CV'nizde 5-7 bölüm idealdir. Tüm bölümleri göstermek yerine en güçlü olanları seçin.
                </p>
            </div>
        </div>
    )
}
