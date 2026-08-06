import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LayoutDashboard, Users, CreditCard, Settings, Activity, X } from 'lucide-react'

export default function CommandPalette({ isOpen, onClose, menuGroups, isDayMode }) {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')

    // Handle escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    // Flatten all menu items
    const allItems = menuGroups.flatMap(group => group.items)
    
    // Filter items based on query
    const filteredItems = allItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase())
    )

    const handleSelect = (path) => {
        navigate(path)
        onClose()
        setQuery('')
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${isDayMode ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-slate-900 border-white/10'}`}>
                {/* Search Input */}
                <div className={`flex items-center px-4 border-b ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                    <Search className={`w-5 h-5 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Sayfa ara veya bir komut yazın... (Örn: Kullanıcılar)"
                        className={`w-full p-4 bg-transparent border-none focus:outline-none focus:ring-0 text-sm ${isDayMode ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-gray-500'}`}
                    />
                    <button onClick={onClose} className={`p-1 rounded-md ${isDayMode ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-gray-400'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                    {filteredItems.length > 0 ? (
                        <div className="space-y-1">
                            {filteredItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleSelect(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDayMode ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/5 text-gray-300'}`}
                                >
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${isDayMode ? 'bg-slate-100 text-cyan-600' : 'bg-white/5 text-cyan-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Search className={`w-8 h-8 mx-auto mb-3 opacity-20 ${isDayMode ? 'text-slate-900' : 'text-white'}`} />
                            <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Sonuç bulunamadı.</p>
                        </div>
                    )}
                </div>
                
                {/* Footer hints */}
                <div className={`px-4 py-3 border-t text-[10px] font-bold uppercase tracking-widest flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-950/50 border-white/10 text-gray-500'}`}>
                    <span>Yön tuşları ile gezin (Yakında)</span>
                    <span className="flex items-center gap-2">Kapatmak için <kbd className={`px-2 py-0.5 rounded border ${isDayMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`}>ESC</kbd></span>
                </div>
            </div>
        </div>
    )
}
