import { useState, useEffect } from 'react'
import { X, GripVertical, ChevronUp, ChevronDown, Check, Layout } from 'lucide-react'

export default function LayoutManagerModal({ isOpen, onClose, cv, onSave }) {
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
        const layoutOrder = sections.map(s => s.id)
        onSave(cv.id, layoutOrder)
    }

    if (!isOpen || !cv) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Layout Düzenle</h2>
                            <p className="text-xs text-gray-400">Bölümlerin sırasını değiştirin.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-2">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${section.fixed
                                        ? 'bg-white/5 border-transparent opacity-50'
                                        : 'bg-white/10 border-white/5 hover:border-cyan-500/30 group'
                                    }`}
                            >
                                <div className="text-gray-500 group-hover:text-cyan-400 transition-colors">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <span className="flex-1 font-medium text-gray-200">{section.name}</span>
                                {!section.fixed && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => moveSection(index, 'up')}
                                            disabled={index === 0 || sections[index - 1].fixed}
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white disabled:opacity-0"
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => moveSection(index, 'down')}
                                            disabled={index === sections.length - 1}
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white disabled:opacity-0"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {section.fixed && (
                                    <span className="text-[10px] uppercase font-bold text-gray-600 px-2 py-1 rounded bg-black/20">Sabit</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-black shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Check className="w-5 h-5" />
                        SIRALAMAYI KAYDET
                    </button>
                </div>
            </div>
        </div>
    )
}
