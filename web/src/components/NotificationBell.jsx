import { useState, useRef, useEffect } from 'react'
import { Bell, Eye, X, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        refresh
    } = useNotifications()

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Refresh on open
    useEffect(() => {
        if (isOpen) {
            refresh()
        }
    }, [isOpen, refresh])

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'cv_view':
                return <Eye className="w-4 h-4 text-cyan-400" />
            default:
                return <Bell className="w-4 h-4 text-blue-400" />
        }
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Az önce'
        if (diffMins < 60) return `${diffMins} dk önce`
        if (diffHours < 24) return `${diffHours} saat önce`
        if (diffDays < 7) return `${diffDays} gün önce`
        return date.toLocaleDateString('tr-TR')
    }

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id)
        }

        // Navigate based on notification type
        if (notification.type === 'cv_view' && notification.data?.cvId) {
            navigate(`/dashboard/analytics/${notification.data.cvId}`)
        }

        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-white/5 transition-all group"
                title="Bildirimler"
            >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />

                {/* Unread Badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50 ring-1 ring-white/5"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-cyan-400" />
                                <h3 className="font-bold text-white">Bildirimler</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full">
                                        {unreadCount} yeni
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyan-400 transition-colors"
                                        title="Tümünü okundu işaretle"
                                    >
                                        <CheckCheck className="w-4 h-4" />
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                                        title="Tümünü sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm">Henüz bildirim yok</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        CV'niz görüntülendiğinde burada göreceksiniz
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 hover:bg-white/5 cursor-pointer transition-colors group ${!notification.isRead ? 'bg-cyan-500/5' : ''
                                                }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.type === 'cv_view'
                                                        ? 'bg-cyan-500/10'
                                                        : 'bg-blue-500/10'
                                                    }`}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="font-semibold text-white text-sm">
                                                            {notification.title}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteNotification(notification.id)
                                                        }}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-white/10 bg-white/5">
                                <button
                                    onClick={() => {
                                        navigate('/dashboard/notifications')
                                        setIsOpen(false)
                                    }}
                                    className="w-full py-2 text-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    Tüm bildirimleri gör
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
