import { useState, useEffect } from 'react'
import { Megaphone, X, Info, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { userAPI } from '../../services/api'

export default function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [closedIds, setClosedIds] = useState(() => {
        const saved = localStorage.getItem('CVniz_closed_announcements')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await userAPI.getAnnouncements()
                if (response.success) {
                    // Filter out closed ones
                    const visible = response.announcements.filter(a => !closedIds.includes(a._id))
                    setAnnouncements(visible)
                }
            } catch (error) {
                console.error('Announcements fetch fail:', error)
            }
        }
        fetchAnnouncements()
    }, [closedIds])

    const handleClose = (id) => {
        const newClosed = [...closedIds, id]
        setClosedIds(newClosed)
        localStorage.setItem('CVniz_closed_announcements', JSON.stringify(newClosed))
    }

    if (announcements.length === 0) return null

    const current = announcements[currentIndex]

    const getTypeStyles = (type) => {
        switch (type) {
            case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-500'
            case 'success': return 'bg-green-500/10 border-green-500/20 text-green-500'
            case 'error': return 'bg-red-500/10 border-red-500/20 text-red-500'
            default: return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-4 h-4" />
            case 'success': return <CheckCircle className="w-4 h-4" />
            case 'error': return <Shield className="w-4 h-4" />
            default: return <Info className="w-4 h-4" />
        }
    }

    return (
        <div className={`relative mb-6 rounded-2xl border p-4 animate-fade-in transition-all duration-500 ${getTypeStyles(current.type)}`}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    {getTypeIcon(current.type)}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Sistem Duyurusu</span>
                        {announcements.length > 1 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 opacity-70">
                                {currentIndex + 1} / {announcements.length}
                            </span>
                        )}
                    </div>
                    <h4 className="font-bold text-sm leading-tight text-white">{current.title}</h4>
                    <p className="text-xs opacity-80 mt-1 max-w-[800px]">{current.content}</p>
                </div>
                <div className="flex items-center gap-2">
                    {announcements.length > 1 && (
                        <div className="flex gap-1 mr-2 border-r border-white/10 pr-2">
                            <button
                                onClick={() => setCurrentIndex((currentIndex - 1 + announcements.length) % announcements.length)}
                                className="p-1 px-2 text-[10px] hover:bg-white/10 rounded transition-all"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentIndex((currentIndex + 1) % announcements.length)}
                                className="p-1 px-2 text-[10px] hover:bg-white/10 rounded transition-all"
                            >
                                →
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => handleClose(current._id)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 transition-all duration-[5000ms] linear" style={{ width: '100%' }}></div>
        </div>
    )
}

