import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, isDayMode }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Panel */}
            <div className={`relative z-10 w-full max-w-lg transform overflow-hidden rounded-3xl text-left align-middle shadow-2xl transition-all ${
                isDayMode ? 'bg-white border border-slate-200' : 'bg-[#0f172a] border border-white/10'
            }`}>
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDayMode ? 'border-slate-100' : 'border-white/10'}`}>
                    <h3 className={`text-lg font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-colors ${
                            isDayMode ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-gray-400 hover:text-white'
                        }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
