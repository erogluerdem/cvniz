import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSupport } from '../context/SupportContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageCircle, Plus, Clock, CheckCircle, AlertCircle, Send,
    ArrowLeft, ChevronRight, HelpCircle, CreditCard, User, Palette,
    Mail, X, Sparkles, Search, Filter, Hash, ExternalLink, Calendar
} from 'lucide-react'

const categories = [
    { id: 'technical', name: 'Teknik Sorun', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    { id: 'billing', name: 'Ödeme/Fatura', icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    { id: 'account', name: 'Hesap Yönetimi', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 'template', name: 'Şablon Önerisi', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { id: 'general', name: 'Genel Soru', icon: HelpCircle, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' }
]

const priorities = [
    { id: 'low', name: 'Düşük', color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    { id: 'medium', name: 'Normal', color: 'bg-amber-500', glow: 'shadow-amber-500/20' },
    { id: 'high', name: 'Yüksek', color: 'bg-red-500', glow: 'shadow-red-500/20' }
]

const statusLabels = {
    open: {
        label: 'Yanıt Bekliyor',
        color: 'bg-cyan-500/20 text-cyan-400',
        dayColor: 'bg-sky-100 text-sky-600 border border-sky-200',
        dot: 'bg-cyan-400',
        icon: Clock
    },
    in_progress: {
        label: 'İnceleniyor',
        color: 'bg-amber-500/20 text-amber-400',
        dayColor: 'bg-amber-100 text-amber-600 border border-amber-200',
        dot: 'bg-amber-400',
        icon: AlertCircle
    },
    resolved: {
        label: 'Çözümlendi',
        color: 'bg-emerald-500/20 text-emerald-400',
        dayColor: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
        dot: 'bg-emerald-400',
        icon: CheckCircle
    },
    closed: {
        label: 'Kapatıldı',
        color: 'bg-slate-500/20 text-slate-400',
        dayColor: 'bg-slate-100 text-slate-500 border border-slate-200',
        dot: 'bg-slate-400',
        icon: X
    }
}

export default function SupportPage() {
    const { user } = useAuth()
    const { tickets, createTicket, addMessage, getTicketById, loading } = useSupport()
    const [selectedTicketId, setSelectedTicketId] = useState(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const messageEndRef = useRef(null)
    const [theme, setTheme] = useState('day')
    const isDayMode = theme === 'day'
    const selectionColor = isDayMode ? 'selection:bg-sky-200/70' : 'selection:bg-cyan-500/30'

    // New ticket form state
    const [formData, setFormData] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        description: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const selectedTicket = tickets?.find(t => (t._id || t.id) === selectedTicketId)

    const themedStatus = (statusKey) => {
        const status = statusLabels[statusKey] || statusLabels.open
        return {
            ...status,
            badgeClass: isDayMode ? status.dayColor || status.color : status.color
        }
    }
    const detailStatus = selectedTicket ? themedStatus(selectedTicket.status) : null

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem('CVniz-home-theme')
        if (stored === 'day' || stored === 'night') {
            setTheme(stored)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handler = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handler)
        return () => window.removeEventListener('CVniz-theme-change', handler)
    }, [])

    useEffect(() => {
        if (selectedTicket && messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [selectedTicket?.messages])

    const handleSubmitTicket = async (e) => {
        e.preventDefault()
        if (!formData.subject || !formData.description) return

        setIsSubmitting(true)
        try {
            const result = await createTicket(formData)

            if (result.success) {
                setIsCreateModalOpen(false)
                setFormData({ subject: '', category: 'general', priority: 'medium', description: '' })

                // Biletin ID'sini tespiti için daha sağlam bir yol
                const tid = result.ticket?._id || result.ticket?.id
                if (tid) {
                    setSelectedTicketId(tid)
                }
            } else {
                alert('Talep oluşturulurken hata: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            alert('Sistem hatası: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicketId) return
        const res = await addMessage(selectedTicketId, newMessage)
        if (!res.success) {
            alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
        } else {
            setNewMessage('')
        }
    }

    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDayMode
                ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900'
                : 'bg-slate-950 text-white bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]'
                } ${selectionColor}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-md w-full text-center ${isDayMode ? 'bg-white/80 border border-slate-200/60 shadow-day rounded-[32px] p-10' : ''}`}
                >
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl ${isDayMode
                        ? 'bg-gradient-to-tr from-sky-400 to-blue-500 text-white shadow-sky-200/80'
                        : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/20'
                        }`}>
                        <MessageCircle className="w-10 h-10" />
                    </div>
                    <h1 className={`text-3xl font-black mb-4 tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Destek Merkezi</h1>
                    <p className={`${isDayMode ? 'text-slate-600' : 'text-slate-400'} mb-8 text-lg`}>
                        Hızlı ve profesyonel çözüm için hesabınıza giriş yapın.
                    </p>
                    <Link
                        to="/login"
                        className={`inline-flex items-center gap-2 px-8 py-4 font-black rounded-2xl transition-all shadow-xl ${isDayMode
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-white text-slate-950 hover:bg-cyan-50'
                            } hover:scale-105 active:scale-95`}
                    >
                        Hesabına Gir <ChevronRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className={`h-screen pt-[72px] flex overflow-hidden ${isDayMode
            ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
            : 'bg-slate-950 text-white'
            } ${selectionColor}`}>
            {/* Sidebar: Ticket List */}
            <div className={`w-[380px] flex flex-col ${isDayMode
                ? 'bg-white/95 border-r border-slate-200/70 shadow-day'
                : 'border-r border-white/5 bg-slate-900/40 backdrop-blur-3xl'
                }`}>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className={`text-2xl font-black ${isDayMode ? 'text-slate-900' : 'bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent'}`}>
                            Taleplerim
                        </h1>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-90 shadow-lg ${isDayMode
                                ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-white hover:brightness-110 shadow-sky-200/80'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                                }`}
                            title="Yeni Talep Oluştur"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDayMode ? 'text-slate-400 group-focus-within:text-sky-500' : 'text-slate-500 group-focus-within:text-cyan-400'}`} />
                        <input
                            type="text"
                            placeholder="Talep ara..."
                            className={`w-full rounded-2xl py-3 pl-10 pr-4 text-sm outline-none transition-all border ${isDayMode
                                ? 'bg-white text-slate-900 border-slate-200/70 focus:border-sky-400 shadow-sm'
                                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/10'
                                }`}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-2 pb-6">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className={`h-24 rounded-2xl animate-pulse mx-3 ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`} />
                        ))
                    ) : tickets.length === 0 ? (
                        <div className="px-6 py-20 text-center opacity-70">
                            <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${isDayMode ? 'text-slate-300' : 'opacity-20'}`} />
                            <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : ''}`}>Henüz bir talebiniz bulunmuyor.</p>
                        </div>
                    ) : (
                        tickets.map(ticket => {
                            const status = themedStatus(ticket.status)
                            const isSelected = selectedTicketId === (ticket._id || ticket.id)
                            const category = categories.find(c => c.id === ticket.category)

                            return (
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    key={ticket._id || ticket.id}
                                    onClick={() => setSelectedTicketId(ticket._id || ticket.id)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all ${isSelected
                                        ? (isDayMode
                                            ? 'bg-gradient-to-br from-sky-50 via-white to-slate-50 border border-sky-200 shadow-lg shadow-sky-100'
                                            : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30'
                                        )
                                        : (isDayMode
                                            ? 'bg-white border border-transparent hover:border-slate-200 shadow-sm'
                                            : 'hover:bg-white/5 border border-transparent'
                                        )
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${status.dot} animate-pulse shadow-[0_0_8px] shadow-current`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                #{ticket._id?.slice(-6).toUpperCase() || ticket.id?.slice(-6).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-medium ${isDayMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                    <h3 className={`font-bold text-sm line-clamp-1 mb-2 ${isSelected ? (isDayMode ? 'text-sky-600' : 'text-cyan-400') : (isDayMode ? 'text-slate-700' : 'text-slate-200')}`}>
                                        {ticket.subject}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold ${category?.bg} ${category?.color}`}>
                                            <Hash className="w-3 h-3" />
                                            {category?.name}
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${status.badgeClass}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                </motion.button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Main Content: Ticket Detail */}
            <div className={`flex-1 flex flex-col ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white' : "bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"}`}>
                <AnimatePresence mode="wait">
                    {selectedTicket ? (
                        <motion.div
                            key={selectedTicket._id || selectedTicket.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Detail Header */}
                            <div className={`p-8 border-b ${isDayMode ? 'bg-white/90 border-slate-200/80 shadow-day' : 'bg-slate-900/20 border-white/5 backdrop-blur-xl'}`}>
                                <div className="flex items-start justify-between max-w-4xl mx-auto w-full">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-tighter border ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                                ID: {selectedTicket._id || selectedTicket.id}
                                            </span>
                                            <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${detailStatus?.badgeClass || ''}`}>
                                                {detailStatus?.label || 'Açık'}
                                            </div>
                                        </div>
                                        <h2 className={`text-3xl font-black tracking-tight ${isDayMode ? 'text-slate-900' : ''}`}>{selectedTicket.subject}</h2>
                                        <div className={`flex items-center gap-6 text-sm ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${isDayMode ? 'bg-sky-100 text-sky-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                                    {user.name?.charAt(0)}
                                                </div>
                                                <span className={`${isDayMode ? 'text-slate-700' : 'text-white'} font-bold`}>{user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span className={isDayMode ? 'text-slate-500' : ''}>{new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className={`p-4 rounded-2xl border text-center min-w-[100px] ${isDayMode ? 'bg-slate-50 border-slate-200 shadow-day' : ''} ${categories.find(c => c.id === selectedTicket.category)?.border} ${categories.find(c => c.id === selectedTicket.category)?.bg}`}>
                                            <p className={`text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 ${isDayMode ? 'text-slate-500' : ''}`}>Kategori</p>
                                            <p className={`text-xs font-bold ${categories.find(c => c.id === selectedTicket.category)?.color}`}>
                                                {categories.find(c => c.id === selectedTicket.category)?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {selectedTicket.messages?.map((msg, idx) => {
                                        const isStaff = msg.sender === 'admin'
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, x: isStaff ? -20 : 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={idx}
                                                className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div className={`max-w-[85%] group`}>
                                                    <div className={`flex items-center gap-2 mb-2 ${isStaff ? 'flex-row' : 'flex-row-reverse'}`}>
                                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isStaff ? 'text-amber-400' : 'text-cyan-400'}`}>
                                                            {isStaff ? 'DESTEK EKİBİ' : 'SİZ'}
                                                        </span>
                                                        <span className={`text-[10px] font-medium ${isDayMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className={`relative p-5 rounded-3xl text-sm leading-relaxed shadow-lg ${isStaff
                                                        ? (isDayMode
                                                            ? 'bg-white border border-slate-200 rounded-tl-none text-slate-700 shadow-day'
                                                            : 'bg-white/5 border border-white/10 rounded-tl-none text-slate-200'
                                                        )
                                                        : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none shadow-cyan-500/10'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                    <div ref={messageEndRef} />
                                </div>
                            </div>

                            {/* Reply Input */}
                            {(selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed') && (
                                <div className={`p-8 border-t ${isDayMode ? 'bg-white/90 border-slate-200/80 shadow-day' : 'bg-slate-900/40 backdrop-blur-3xl border-white/5'}`}>
                                    <div className="max-w-4xl mx-auto flex gap-4">
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handleSendMessage()
                                                    }
                                                }}
                                                placeholder="Buraya yazın..."
                                                rows={1}
                                                className={`w-full rounded-2xl py-4 px-6 pr-14 text-sm outline-none transition-all resize-none max-h-32 min-h-[56px] border ${isDayMode
                                                    ? 'bg-white text-slate-900 border-slate-200/80 focus:border-sky-400 shadow-sm'
                                                    : 'bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:bg-white/10'
                                                    }`}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!newMessage.trim()}
                                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 ${isDayMode
                                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                                                    }`}
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className={`max-w-4xl mx-auto mt-3 text-[10px] font-medium text-center ${isDayMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Size en geç 24 saat içinde yanıt vermeye çalışacağız.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                className="space-y-6"
                            >
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border ${isDayMode ? 'bg-white border-slate-200 shadow-day' : 'bg-white/5 border-white/10'}`}>
                                    <MessageCircle className={`w-10 h-10 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Destek Merkezi’ne Hoş Geldiniz</h3>
                                    <p className={`text-sm max-w-xs mx-auto ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        Soru veya sorunlarınız için yanınızdayız. Mevcut bir talebi seçin veya yenisini oluşturun.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all border ${isDayMode
                                        ? 'bg-white text-slate-900 border-slate-200 shadow-day hover:bg-slate-50'
                                        : 'bg-white/10 hover:bg-white/15 border-white/10'
                                        }`}
                                >
                                    Yeni Talep Oluştur
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className={`absolute inset-0 ${isDayMode ? 'bg-slate-900/10 backdrop-blur-sm' : 'bg-slate-950/80 backdrop-blur-md'}`}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`relative w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl ${isDayMode ? 'bg-white border border-slate-200/80 shadow-day' : 'bg-slate-900 border border-white/10'}`}
                        >
                            <div className={`p-8 border-b flex items-center justify-between ${isDayMode ? 'bg-white border-slate-200/80' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDayMode ? 'bg-sky-100 text-sky-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-black ${isDayMode ? 'text-slate-900' : ''}`}>Yeni Talep</h3>
                                        <p className={`text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>Nasıl yardımcı olabiliriz?</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className={`p-3 rounded-2xl transition-colors ${isDayMode ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10'}`}
                                >
                                    <X className={`w-5 h-5 ${isDayMode ? 'text-slate-400' : 'text-slate-400'}`} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitTicket} className="p-8 space-y-8">
                                <div className="space-y-6">
                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Konu</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                                            placeholder="Talebinizi özetleyin..."
                                            className={`w-full rounded-2xl py-4 px-6 text-sm outline-none transition-all border ${isDayMode
                                                ? 'bg-white border-slate-200/80 text-slate-900 focus:border-sky-400 shadow-sm'
                                                : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Category */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kategori</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                                                    className={`w-full rounded-2xl py-4 px-6 text-sm outline-none appearance-none cursor-pointer font-bold border ${isDayMode
                                                        ? 'bg-white border-slate-200/80 text-slate-900 focus:border-sky-400'
                                                        : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500'
                                                        }`}
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Priority */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Öncelik</label>
                                            <div className="flex gap-2">
                                                {priorities.map(p => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, priority: p.id }))}
                                                        className={`flex-1 py-4 rounded-2xl border text-[10px] font-black transition-all uppercase tracking-tighter ${formData.priority === p.id
                                                            ? (isDayMode
                                                                ? `bg-sky-50 border-sky-200 text-sky-600 shadow-day`
                                                                : `bg-white/10 border-white/30 text-white shadow-xl ${p.glow}`
                                                            )
                                                            : (isDayMode
                                                                ? 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                                : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'
                                                            )
                                                            }`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Açıklama</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                            placeholder="Detaylar neler?"
                                            rows={4}
                                            className={`w-full rounded-2xl py-4 px-6 text-sm outline-none transition-all resize-none border ${isDayMode
                                                ? 'bg-white border-slate-200/80 text-slate-900 focus:border-sky-400 shadow-sm'
                                                : 'bg-white/5 border border-white/10 focus:border-cyan-500'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black rounded-3xl transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {isSubmitting ? (
                                        <Clock className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            TALEBİ GÖNDER
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDayMode ? 'rgba(148, 163, 184, 0.5)' : 'rgba(255, 255, 255, 0.05)'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDayMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.1)'};
                }
            `}</style>
        </div>
    )
}

