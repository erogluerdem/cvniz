import { useState } from 'react'
import { WEB_CV_CATEGORIES, WEB_CV_TEMPLATES, getTemplatesByCategory } from '../data/webCVTemplates'
import { Crown, Check, Eye, ChevronRight } from 'lucide-react'

export default function TemplateSelector({ selectedTemplate, onSelect, onPreview }) {
    const [activeCategory, setActiveCategory] = useState('minimal')
    const [hoveredTemplate, setHoveredTemplate] = useState(null)

    const templates = getTemplatesByCategory(activeCategory)

    return (
        <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {WEB_CV_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm font-bold ${activeCategory === cat.id
                                ? 'bg-white text-slate-900 shadow-lg'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        <span className="text-lg">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Category Description */}
            <p className="text-sm text-slate-500">
                {WEB_CV_CATEGORIES.find(c => c.id === activeCategory)?.description}
            </p>

            {/* Templates Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {templates.map(template => (
                    <div
                        key={template.id}
                        onClick={() => onSelect(template)}
                        onMouseEnter={() => setHoveredTemplate(template.id)}
                        onMouseLeave={() => setHoveredTemplate(null)}
                        className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${selectedTemplate?.id === template.id
                                ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-950 scale-[1.02]'
                                : 'hover:scale-[1.03]'
                            }`}
                    >
                        {/* Preview Image */}
                        <div className="aspect-[3/4] relative overflow-hidden">
                            <img
                                src={template.preview}
                                alt={template.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Premium Badge */}
                            {template.premium && (
                                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-amber-500/90 text-[10px] font-black text-black flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    PRO
                                </div>
                            )}

                            {/* Selected Check */}
                            {selectedTemplate?.id === template.id && (
                                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {/* Hover Actions */}
                            <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                                }`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onPreview(template)
                                    }}
                                    className="px-4 py-2 rounded-xl bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1 hover:bg-white transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    Önizle
                                </button>
                            </div>

                            {/* Template Name */}
                            <div className="absolute bottom-0 inset-x-0 p-3">
                                <h4 className="text-white font-bold text-sm">{template.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div
                                        className="w-3 h-3 rounded-full border border-white/30"
                                        style={{ background: template.colors.accent }}
                                    />
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                                        {template.styles.heroLayout}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Template Count */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-slate-500">
                    {WEB_CV_TEMPLATES.length} şablon mevcut • {WEB_CV_TEMPLATES.filter(t => !t.premium).length} ücretsiz
                </span>
                {selectedTemplate && (
                    <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                        Seçilen: {selectedTemplate.name}
                        <ChevronRight className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    )
}
