import React, { useState } from 'react'
import { Wand2, Sparkles, Check, ChevronDown, Loader2 } from 'lucide-react'

export default function MagicWandButton({ text, onImprove, className = '' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

    const handleImprove = async (mode) => {
        if (!text || text.length < 10) {
            alert('Lütfen düzenlemek için en az 10 karakter girin.')
            return
        }

        setLoading(true)
        setIsOpen(false)

        try {
            const response = await fetch(`${API_URL}/ai/improve-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('CVniz_token')}`
                },
                body: JSON.stringify({
                    text,
                    lang: 'tr',
                    mode
                })
            })

            const data = await response.json()

            if (data.success && data.options && data.options.length > 0) {
                // If options returned, pick the first one or let user choose (simplified for now to pick first)
                onImprove(data.options[0])
            }
        } catch (error) {
            console.error('AI Improve Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-1 group"
                title="AI ile İyileştir"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium hidden group-hover:block transition-all">AI</span>
                    </>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1d24] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 border-b border-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Sihirli Değnek
                        </div>
                        <div className="p-1">
                            {[
                                { id: 'professional', label: 'Daha Profesyonel', icon: Sparkles },
                                { id: 'fix_grammar', label: 'Gramer Düzelt', icon: Check },
                                { id: 'shorter', label: 'Daha Kısa', icon: ChevronDown }, // Using ChevronDown as placeholder for shrink
                                { id: 'longer', label: 'Daha Detaylı', icon: ChevronDown, className: 'rotate-180' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleImprove(opt.id)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 flex items-center gap-2 transition-colors"
                                >
                                    <opt.icon className={`w-3.5 h-3.5 ${opt.className || ''}`} />
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
