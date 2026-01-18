import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertTriangle, Info, XCircle, X, Loader2 } from 'lucide-react'

const ToastContext = createContext()

export function useToast() {
    return useContext(ToastContext)
}

const toastIcons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    loading: <Loader2 className="w-5 h-5 animate-spin" />
}

const toastColors = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    info: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
    loading: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const [confirmModal, setConfirmModal] = useState(null)

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        if (type !== 'loading') {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, duration)
        }
        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const toast = {
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        warning: (message) => addToast(message, 'warning'),
        info: (message) => addToast(message, 'info'),
        loading: (message) => addToast(message, 'loading', 60000),
        dismiss: (id) => removeToast(id)
    }

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfirmModal({
                title: options.title || 'Emin misiniz?',
                message: options.message || 'Bu işlem geri alınamaz.',
                confirmText: options.confirmText || 'Evet, Devam Et',
                cancelText: options.cancelText || 'İptal',
                type: options.type || 'warning',
                onConfirm: () => {
                    setConfirmModal(null)
                    resolve(true)
                },
                onCancel: () => {
                    setConfirmModal(null)
                    resolve(false)
                }
            })
        })
    }, [])

    return (
        <ToastContext.Provider value={{ toast, confirm }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-in-right ${toastColors[t.type]}`}
                    >
                        <div className="shrink-0">{toastIcons[t.type]}</div>
                        <p className="text-sm font-bold pr-4">{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="absolute top-1/2 -translate-y-1/2 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors opacity-50 hover:opacity-100"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Ultra Modern Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop with blur */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-fade-in"
                        onClick={confirmModal.onCancel}
                    />

                    {/* Modal Card */}
                    <div className="relative w-full max-w-sm animate-scale-in">
                        {/* Outer glow ring */}
                        <div className={`absolute -inset-[1px] rounded-[2rem] ${confirmModal.type === 'danger'
                                ? 'bg-gradient-to-br from-red-500/50 via-transparent to-red-500/30'
                                : confirmModal.type === 'warning'
                                    ? 'bg-gradient-to-br from-amber-500/50 via-transparent to-amber-500/30'
                                    : 'bg-gradient-to-br from-cyan-500/50 via-purple-500/30 to-purple-500/50'
                            } blur-sm`} />

                        {/* Main card */}
                        <div className="relative bg-[#1a1a2e]/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden">
                            {/* Animated background orbs */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 ${confirmModal.type === 'danger' ? 'bg-red-500' : confirmModal.type === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'
                                }`} style={{ animation: 'pulse 3s ease-in-out infinite' }} />
                            <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${confirmModal.type === 'danger' ? 'bg-red-400' : confirmModal.type === 'warning' ? 'bg-orange-400' : 'bg-purple-500'
                                }`} style={{ animation: 'pulse 4s ease-in-out infinite' }} />

                            {/* Content */}
                            <div className="relative p-8">
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className={`relative p-5 rounded-2xl ${confirmModal.type === 'danger'
                                            ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400'
                                            : confirmModal.type === 'warning'
                                                ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/10 text-amber-400'
                                                : 'bg-gradient-to-br from-cyan-500/20 to-purple-600/10 text-cyan-400'
                                        }`}>
                                        {/* Icon glow */}
                                        <div className={`absolute inset-0 rounded-2xl ${confirmModal.type === 'danger' ? 'bg-red-500/20' : confirmModal.type === 'warning' ? 'bg-amber-500/20' : 'bg-cyan-500/20'
                                            } blur-xl opacity-60`} />
                                        <AlertTriangle className="relative w-8 h-8" style={{ animation: 'shake 0.5s ease-in-out' }} />
                                    </div>
                                </div>

                                {/* Title & Message */}
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                                        {confirmModal.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed px-2">
                                        {confirmModal.message}
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={confirmModal.onCancel}
                                        className="flex-1 py-3.5 px-6 rounded-xl bg-white/5 text-gray-300 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all duration-200 border border-white/5 hover:border-white/10"
                                    >
                                        {confirmModal.cancelText}
                                    </button>
                                    <button
                                        onClick={confirmModal.onConfirm}
                                        className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${confirmModal.type === 'danger'
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
                                                : confirmModal.type === 'warning'
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                                                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                                            }`}
                                    >
                                        {confirmModal.confirmText}
                                    </button>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className={`h-1 w-full ${confirmModal.type === 'danger'
                                    ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent'
                                    : confirmModal.type === 'warning'
                                        ? 'bg-gradient-to-r from-transparent via-amber-500 to-transparent'
                                        : 'bg-gradient-to-r from-transparent via-cyan-500 to-transparent'
                                }`} />
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    )
}
