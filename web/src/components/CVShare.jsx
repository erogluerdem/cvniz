import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, Download, Share2, Printer, Check, Link } from 'lucide-react'

export default function CVShare({ isOpen, onClose, cv }) {
    const [copied, setCopied] = useState(false)
    const qrRef = useRef()

    if (!isOpen || !cv) return null

    // Use Living CV URL if publicUrl exists, otherwise fallback to preview
    const shareUrl = cv.publicUrl
        ? `${window.location.origin}/cv/${cv.publicUrl}`
        : `${window.location.origin}/preview/${cv.id}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePrint = () => {
        window.print()
    }

    const downloadQR = () => {
        const svg = document.getElementById('cv-qr-code')
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = `CV_QR_${cv.name}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl border border-white/10">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">CV Paylaş</h2>
                            <p className="text-sm text-gray-400">{cv.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center">
                    {/* QR Code */}
                    <div className="p-4 bg-white rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
                        <QRCodeSVG
                            id="cv-qr-code"
                            value={shareUrl}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <div className="w-full space-y-4">
                        {/* URL Field */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Link className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadQR}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm"
                            >
                                <Download className="w-4 h-4" />
                                QR İndir
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm"
                            >
                                <Printer className="w-4 h-4" />
                                Yazdır
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="p-4 bg-blue-500/5 text-center">
                    <p className="text-xs text-blue-400">
                        Bu QR kodu kullanarak özgeçmişinize mobil cihazlardan anında erişebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    )
}
