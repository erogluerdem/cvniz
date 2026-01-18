import { createContext, useContext, useState, useEffect } from 'react'
import { useSupport } from './SupportContext'
import { usePayment } from './PaymentContext'

const AdminNotificationContext = createContext(null)

export function AdminNotificationProvider({ children }) {
    const { allTickets, loadAllTicketsAdmin } = useSupport()
    const { getAllPayments } = usePayment()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        refreshNotifications()
    }, [allTickets])

    useEffect(() => {
        // Periyodik olarak backend'den verileri tazele (canlılık için)
        const interval = setInterval(() => {
            loadAllTicketsAdmin?.()
            // Diğer kaynaklar için (ödeme vb.) refreshNotifications manuel çağrılabilir
            refreshNotifications()
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    const refreshNotifications = () => {
        const supportTickets = allTickets || [] // Use state from SupportContext
        const payments = getAllPayments?.() || []
        const users = JSON.parse(localStorage.getItem('CVniz_users') || '[]')

        const newNotifications = []

        // Destek Talepleri Bildirimleri
        supportTickets.filter(t => t.status === 'open').forEach(ticket => {
            newNotifications.push({
                id: `support-${ticket.id}`,
                type: 'support',
                title: 'Yeni Destek Talebi',
                message: `${ticket.userName}: ${ticket.subject}`,
                time: ticket.createdAt,
                link: '/admin/support',
                priority: 'high'
            })
        })

        // Ödeme Bildirimleri
        payments.slice(-5).forEach(payment => {
            newNotifications.push({
                id: `payment-${payment.id}`,
                type: 'payment',
                title: 'Yeni Ödeme',
                message: `${payment.userName} - ₺${payment.amount}`,
                time: payment.createdAt,
                link: '/admin/payments',
                priority: 'medium'
            })
        })

        // Yeni Kullanıcı Bildirimleri
        users.slice(-3).forEach(u => {
            newNotifications.push({
                id: `user-${u.id}`,
                type: 'user',
                title: 'Yeni Kayıt',
                message: `${u.name} (${u.email}) sisteme katıldı.`,
                time: u.createdAt || new Date().toISOString(),
                link: '/admin/users',
                priority: 'low'
            })
        })

        // Zamana göre sırala (en yeni en üstte)
        const sorted = newNotifications.sort((a, b) => new Date(b.time) - new Date(a.time))
        setNotifications(sorted)
        setUnreadCount(sorted.length)
    }

    const markAsRead = (id) => {
        setUnreadCount(prev => Math.max(0, prev - 1))
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
        setUnreadCount(0)
    }

    return (
        <AdminNotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            clearAll,
            refreshNotifications
        }}>
            {children}
        </AdminNotificationContext.Provider>
    )
}

export const useAdminNotifications = () => {
    const context = useContext(AdminNotificationContext)
    if (!context) {
        throw new Error('useAdminNotifications bir AdminNotificationProvider içinde kullanılmalıdır')
    }
    return context
}

