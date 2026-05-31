import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { supportAPI } from '../services/api'

const SupportContext = createContext(null)

export function SupportProvider({ children }) {
    const { user, loading: authLoading } = useAuth()
    const [tickets, setTickets] = useState([])
    const [allTickets, setAllTickets] = useState([]) // State for admin reactivity
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!authLoading && user) {
            loadTickets()
            if (user.role === 'admin') {
                loadAllTicketsAdmin()
            }
        } else if (!authLoading && !user) {
            setTickets([])
            setAllTickets([])
        }
    }, [user, authLoading])

    const loadTickets = async () => {
        try {
            setLoading(true)
            const data = await supportAPI.getTickets()
            setTickets(data)
        } catch (error) {
            console.error('Biletler yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadAllTicketsAdmin = async () => {
        if (!user || user.role !== 'admin') return;

        try {
            const data = await supportAPI.getAllTicketsAdmin()
            setAllTickets(data)
        } catch (error) {
            // Silently handle 401/403 to avoid console spam if auth is in transition
            if (error.status !== 401 && error.status !== 403) {
                console.error('Tüm biletler yüklenirken hata:', error)
            }
        }
    }

    const createTicket = async (ticketData) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        try {
            const newTicket = await supportAPI.create(ticketData)
            setTickets(prev => [newTicket, ...prev])
            if (user.role === 'admin') loadAllTicketsAdmin()
            return { success: true, ticket: newTicket }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const addMessage = async (ticketId, content) => {
        if (!user) return { success: false }

        try {
            const updatedTicket = await supportAPI.addMessage(ticketId, content, 'user')

            // Local state'i güncelle
            setTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t))
            if (user.role === 'admin') {
                setAllTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t))
            }
            return { success: true }
        } catch (error) {
            console.error('Mesaj gönderilirken hata:', error)
            return { success: false }
        }
    }

    const getTicketById = (ticketId) => {
        // Hem users tickets hem allTickets içinde ara (id _id farkına dikkat)
        return tickets.find(t => t._id === ticketId || t.id === ticketId) ||
            allTickets.find(t => t._id === ticketId || t.id === ticketId)
    }

    const getAllTicketsAdmin = () => {
        return allTickets
    }

    const updateTicketStatus = async (ticketId, status) => {
        try {
            const updatedTicket = await supportAPI.updateStatus(ticketId, status)

            setAllTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t))
            setTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t))

            return { success: true }
        } catch (error) {
            console.error('Statü güncellenirken hata:', error)
            return { success: false }
        }
    }

    const addAdminReply = async (ticketId, content) => {
        try {
            const updatedTicket = await supportAPI.addMessage(ticketId, content, 'admin')

            setAllTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t))
            setTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t))

            return { success: true }
        } catch (error) {
            console.error('Admin yanıtı gönderilirken hata:', error)
            return { success: false }
        }
    }

    return (
        <SupportContext.Provider value={{
            tickets,
            allTickets,
            loading,
            createTicket,
            addMessage,
            getTicketById,
            getAllTicketsAdmin,
            updateTicketStatus,
            addAdminReply,
            loadTickets,
            loadAllTicketsAdmin
        }}>
            {children}
        </SupportContext.Provider>
    )
}

export const useSupport = () => useContext(SupportContext)
