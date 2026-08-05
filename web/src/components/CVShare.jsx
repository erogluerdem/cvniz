import { useState, useRef, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, Download, Share2, Printer, Check, Link, Linkedin, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950/95 backdrop-blur-3xl text-white rounded-[2rem] w-full max-w-md overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
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
                <div className="p-6 flex flex-col items-center">
                    {/* Animated QR Code Presentation */}
                    <div className="relative mb-8 mt-4 group">
                        <motion.div 
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="p-4 bg-white rounded-3xl shadow-2xl shadow-blue-500/30 relative z-10 border-4 border-slate-900/10"
                        >
                            <QRCodeSVG
                                id="cv-qr-code"
                                value={shareUrl}
                                size={180}
                                level="H"
                                includeMargin={true}
                                fgColor="#020617" // slate-950
                                cornerRadius={4}
                            />
                            {/* Scanning line animation */}
                            <motion.div 
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)] z-20 pointer-events-none"
                            />
                        </motion.div>
                        
                        {/* Decorative background elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-500/20 rounded-full blur-[50px] pointer-events-none z-0"></div>
                        
                        <div className="absolute -right-6 -top-6 text-slate-500/30 w-24 h-24 pointer-events-none z-0">
                            <Smartphone className="w-full h-full" strokeWidth={1} />
                        </div>
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
                                <Download className="w-4 h-4 text-cyan-400" />
                                QR İndir
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-sm"
                            >
                                <Printer className="w-4 h-4 text-slate-400" />
                                Yazdır
                            </button>
                        </div>
                        
                        <button
                            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/30 text-[#0a66c2] hover:text-[#0a66c2] transition-all font-bold text-sm shadow-lg shadow-[#0a66c2]/10"
                        >
                            <Linkedin className="w-5 h-5 fill-current" />
                            LinkedIn'de Paylaş
                        </button>
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
