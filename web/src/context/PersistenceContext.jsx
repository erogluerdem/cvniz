import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { useCV } from './CVContext'

const PersistenceContext = createContext(null)

export function PersistenceProvider({ children }) {
    const { user } = useAuth()
    const { updateCV } = useCV()

    // Sync States
    const [syncStatus, setSyncStatus] = useState('synced') // 'synced', 'syncing', 'offline', 'error'
    const [lastSynced, setLastSynced] = useState(new Date().toISOString())
    const [isOnline, setIsOnline] = useState(window.navigator.onLine)

    // Undo/Redo History
    const [history, setHistory] = useState([])
    const [pointer, setPointer] = useState(-1)

    const isInternalUpdate = useRef(false)

    // Monitor Online Status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        if (!isOnline) setSyncStatus('offline')
        else if (syncStatus === 'offline') setSyncStatus('synced')
    }, [isOnline])

    // History Management
    const addToHistory = (state) => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false
            return
        }

        const newHistory = history.slice(0, pointer + 1)
        newHistory.push(JSON.parse(JSON.stringify(state)))

        // Limit history to 50 steps
        if (newHistory.length > 50) newHistory.shift()

        setHistory(newHistory)
        setPointer(newHistory.length - 1)
    }

    const undo = () => {
        if (pointer > 0) {
            isInternalUpdate.current = true
            const prevState = history[pointer - 1]
            setPointer(pointer - 1)
            return JSON.parse(JSON.stringify(prevState))
        }
        return null
    }

    const redo = () => {
        if (pointer < history.length - 1) {
            isInternalUpdate.current = true
            const nextState = history[pointer + 1]
            setPointer(pointer + 1)
            return JSON.parse(JSON.stringify(nextState))
        }
        return null
    }

    // Cloud Sync Simulation
    const syncToCloud = async (cvId, cvData, template, name) => {
        if (!isOnline) {
            setSyncStatus('offline')
            return
        }

        setSyncStatus('syncing')

        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 1500))

        try {
            // In a real app, this would be an API call
            await updateCV(cvId, { data: cvData, template, name })
            setSyncStatus('synced')
            setLastSynced(new Date().toISOString())
        } catch (err) {
            setSyncStatus('error')
        }
    }

    const clearHistory = () => {
        setHistory([])
        setPointer(-1)
    }

    return (
        <PersistenceContext.Provider value={{
            syncStatus,
            lastSynced,
            isOnline,
            undo,
            redo,
            addToHistory,
            syncToCloud,
            canUndo: pointer > 0,
            canRedo: pointer < history.length - 1,
            clearHistory
        }}>
            {children}
        </PersistenceContext.Provider>
    )
}

export const usePersistence = () => useContext(PersistenceContext)
