import { useEffect, useRef } from 'react'
import { useHeatmap } from '../context/HeatmapContext'
import { X, Trash2, Eye, EyeOff, Download } from 'lucide-react'

export default function HeatmapOverlay({ pagePath, isOpen, onClose }) {
    const canvasRef = useRef(null)
    const { getPageHeatmap, getHotZones, getElementStats, clearHeatmapData } = useHeatmap() || {}

    const clicks = getPageHeatmap?.(pagePath) || []
    const hotZones = getHotZones?.(pagePath) || []
    const elementStats = getElementStats?.(pagePath) || []

    // Draw heatmap on canvas
    useEffect(() => {
        if (!canvasRef.current || !isOpen) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Set canvas size to window
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw heatmap points
        clicks.forEach(click => {
            const x = (parseFloat(click.x) / 100) * canvas.width
            const y = (parseFloat(click.y) / 100) * canvas.height

            // Create radial gradient for heat point
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)')
            gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.3)')
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)')

            ctx.beginPath()
            ctx.arc(x, y, 30, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.fill()
        })

        // Draw hot zone indicators
        hotZones.forEach((zone, i) => {
            if (i > 5) return // Only show top 5

            const x = (zone.x / 100) * canvas.width
            const y = (zone.y / 100) * canvas.height
            const radius = Math.min(20 + zone.count * 5, 60)

            // Draw circle
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.strokeStyle = zone.count > 10 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 165, 0, 0.8)'
            ctx.lineWidth = 2
            ctx.stroke()

            // Draw count label
            ctx.fillStyle = 'white'
            ctx.font = 'bold 14px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(zone.count.toString(), x, y)
        })

    }, [isOpen, clicks, hotZones])

    const handleClear = () => {
        if (confirm('Bu sayfanın heatmap verilerini silmek istediğinizden emin misiniz?')) {
            clearHeatmapData?.(pagePath)
        }
    }

    const handleExport = () => {
        if (!canvasRef.current) return

        const link = document.createElement('a')
        link.download = `heatmap-${pagePath.replace(/\//g, '-')}-${Date.now()}.png`
        link.href = canvasRef.current.toDataURL()
        link.click()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Canvas for heatmap visualization */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Control Panel */}
            <div className="absolute top-4 right-4 glass-card rounded-2xl p-4 w-80 pointer-events-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Heatmap Görünümü</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-xl bg-white/5">
                            <div className="text-2xl font-bold text-cyan-400">{clicks.length}</div>
                            <div className="text-xs text-gray-400">Toplam Tıklama</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5">
                            <div className="text-2xl font-bold text-amber-400">{hotZones.length}</div>
                            <div className="text-xs text-gray-400">Sıcak Bölge</div>
                        </div>
                    </div>

                    {/* Top Elements */}
                    {elementStats.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-2">En Çok Tıklanan</h4>
                            <div className="space-y-1">
                                {elementStats.slice(0, 5).map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-cyan-400">&lt;{item.element}&gt;</span>
                                        <span className="text-gray-400">{item.count} tık</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Legend */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Renk Göstergesi</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-red-500" />
                                <span className="text-xs">Yoğun</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-orange-500" />
                                <span className="text-xs">Orta</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                <span className="text-xs">Düşük</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                        <button
                            onClick={handleExport}
                            className="flex-1 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center justify-center gap-2 text-sm"
                        >
                            <Download className="w-4 h-4" /> İndir
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center gap-2 text-sm"
                        >
                            <Trash2 className="w-4 h-4" /> Temizle
                        </button>
                    </div>
                </div>
            </div>

            {/* Page Path Display */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-card rounded-xl px-4 py-2 pointer-events-auto">
                <span className="text-sm text-gray-400">Sayfa: </span>
                <span className="text-sm font-medium">{pagePath}</span>
            </div>
        </div>
    )
}
