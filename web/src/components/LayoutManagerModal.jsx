import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GripVertical, ChevronUp, ChevronDown, Check, Layout, Lock } from 'lucide-react'

export default function LayoutManagerModal({ isOpen, onClose, cv, onSave, isPremium }) {
    const [sections, setSections] = useState([])

    useEffect(() => {
        if (cv?.data) {
            // Identify available sections in cvData
            const availableSections = [
                { id: 'personal', name: 'Kişisel Bilgiler', fixed: true },
                { id: 'experience', name: 'İş Deneyimi', fixed: false },
                { id: 'education', name: 'Eğitim', fixed: false },
                { id: 'skills', name: 'Beceriler', fixed: false },
                { id: 'projects', name: 'Projeler', fixed: false },
                { id: 'languages', name: 'Diller', fixed: false },
                { id: 'references', name: 'Referanslar', fixed: false }
            ]

            // Get current order from cvData.layout if exists, else default
            const currentLayout = cv.data.layout || availableSections.map(s => s.id)
            const orderedSections = currentLayout.map(id => availableSections.find(s => s.id === id)).filter(Boolean)

            // Add any missing sections
            availableSections.forEach(s => {
                if (!orderedSections.find(os => os.id === s.id)) {
                    orderedSections.push(s)
                }
            })

            setSections(orderedSections)
        }
    }, [cv])

    const moveSection = (index, direction) => {
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= sections.length) return

        const newSections = [...sections]
        const [movedItems] = newSections.splice(index, 1)
        newSections.splice(newIndex, 0, movedItems)
        setSections(newSections)
    }

    const handleSave = () => {
        if (!isPremium) return;
        const layoutOrder = sections.map(s => s.id)
        onSave(cv.id, layoutOrder)
    }

    if (!isOpen || !cv) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] border border-[#10B981]/20 rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-md overflow-hidden relative"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

                    <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                <Layout className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight">Layout Düzenle</h2>
                                <p className="text-[10px] text-[#10B981]/80 font-bold uppercase tracking-widest mt-0.5">Bölüm Sıralamasını Belirle</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 relative z-10">
                        {!isPremium && (
                            <div className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 flex flex-col items-center justify-center text-center">
                                <Lock className="w-8 h-8 text-gray-500 mb-2" />
                                <h3 className="text-white font-bold mb-1">Premium Özellik</h3>
                                <p className="text-sm text-gray-400">CV bölümlerinin sırasını değiştirmek için Premium plana ihtiyacınız var.</p>
                            </div>
                        )}
                        <div className="space-y-3 relative">
                            {/* Overlay if not premium to prevent interaction visually although buttons can be disabled */}
                            {!isPremium && <div className="absolute inset-0 z-10"></div>}
                            {sections.map((section, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={section.id}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${section.fixed || !isPremium
                                            ? 'bg-black/40 border-white/5 opacity-50'
                                            : 'bg-white/5 border-white/10 hover:border-[#10B981]/50 hover:bg-white/10 group shadow-lg shadow-black/20'
                                        }`}
                                >
                                    <div className={`transition-colors ${(section.fixed || !isPremium) ? 'text-gray-600' : 'text-gray-500 group-hover:text-[#10B981]'}`}>
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <span className={`flex-1 font-bold ${(section.fixed || !isPremium) ? 'text-gray-500' : 'text-gray-200'}`}>{section.name}</span>
                                    {(!section.fixed && isPremium) && (
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => moveSection(index, 'up')}
                                                disabled={index === 0 || sections[index - 1].fixed}
                                                className="p-2 hover:bg-[#10B981]/20 rounded-xl text-gray-400 hover:text-[#10B981] disabled:opacity-0 transition-colors"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveSection(index, 'down')}
                                                disabled={index === sections.length - 1}
                                                className="p-2 hover:bg-[#10B981]/20 rounded-xl text-gray-400 hover:text-[#10B981] disabled:opacity-0 transition-colors"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    {section.fixed && (
                                        <span className="text-[10px] uppercase font-black text-gray-500 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">Sabit</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!isPremium}
                            className={`w-full mt-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${isPremium ? 'bg-[#10B981] hover:bg-[#059669] text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                            {isPremium ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            {isPremium ? 'SIRALAMAYI KAYDET' : 'PREMIUM GEREKLİ'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
