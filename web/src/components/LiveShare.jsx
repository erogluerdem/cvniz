import React, { useState, useEffect } from 'react'
import { 
    Share2, Link2, Copy, Check, Lock, Eye, Clock,
    QrCode, Mail, MessageCircle, Linkedin, Twitter,
    Globe, Shield, X, Loader2, ExternalLink, Sparkles
} from 'lucide-react'

/**
 * LiveShare - Faz 4: Canlı CV Paylaşımı
 * Benzersiz URL ile anlık paylaşım
 * Şifre korumalı preview, süreli linkler
 */
export default function LiveShare({
    cvId,
    cvData,
    isDayMode = false,
    isPremium = false,
    onOpenUpsell
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [settings, setSettings] = useState({
        passwordProtected: false,
        password: '',
        expiryDays: 7,
        allowDownload: false,
        trackViews: true
    })
    const [stats, setStats] = useState({
        views: 0,
        uniqueVisitors: 0,
        lastViewed: null
    })

    // Generate share URL
    const generateShareUrl = async () => {
        if (!isPremium) {
            onOpenUpsell?.()
            return
        }

        setIsLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const uniqueId = cvId || Math.random().toString(36).substring(2, 15)
        const url = `${window.location.origin}/view/${uniqueId}${settings.passwordProtected ? '?p=1' : ''}`
        
        setShareUrl(url)
        setIsLoading(false)
    }

    // Copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Share via social
    const shareVia = (platform) => {
        const text = `CV'mi görüntüleyin: ${cvData?.personal?.fullName || 'Profilim'}`
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
        }
        
        window.open(urls[platform], '_blank')
    }

    // Generate QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isDayMode
                        ? 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-500/50'
                }`}
            >
                <Share2 className="w-4 h-4" />
                <span className="font-medium text-sm">Paylaş</span>
                {!isPremium && <Sparkles className="w-3 h-3 text-amber-500 ml-1" />}
            </button>
        )
    }

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isDayMode ? 'bg-slate-900/50' : 'bg-black/80'
        }`}>
            <div className={`w-full max-w-lg rounded-2xl border shadow-2xl ${
                isDayMode ? 'bg-white border-slate-200' : 'bg-[#161920] border-white/10'
            }`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${
                    isDayMode ? 'border-slate-100' : 'border-white/10'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className={`font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                CV Paylaş
                            </h3>
                            <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Canlı link oluştur
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className={`p-2 rounded-lg transition-colors ${
                            isDayMode ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-500'
                        }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {!shareUrl ? (
                        <>
                            {/* Settings */}
                            <div className="space-y-4">
                                <div className={`flex items-center justify-between p-4 rounded-xl ${
                                    isDayMode ? 'bg-slate-50' : 'bg-white/5'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <Lock className={`w-5 h-5 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                        <div>
                                            <p className={`font-medium text-sm ${isDayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                                                Şifre Koruması
                                            </p>
                                            <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                Görüntüleyenler şifre girsin
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, passwordProtected: !s.passwordProtected }))}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            settings.passwordProtected ? 'bg-cyan-500' : 'bg-slate-300'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                            settings.passwordProtected ? 'translate-x-7' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>

                                {settings.passwordProtected && (
                                    <input
                                        type="password"
                                        value={settings.password}
                                        onChange={(e) => setSettings(s => ({ ...s, password: e.target.value }))}
                                        placeholder="Şifre belirleyin"
                                        className={`w-full px-4 py-3 rounded-xl border outline-none ${
                                            isDayMode
                                                ? 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
                                                : 'bg-[#0f1115] border-white/10 text-white placeholder:text-slate-500'
                                        }`}
                                    />
                                )}

                                <div className={`flex items-center justify-between p-4 rounded-xl ${
                                    isDayMode ? 'bg-slate-50' : 'bg-white/5'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <Clock className={`w-5 h-5 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                        <div>
                                            <p className={`font-medium text-sm ${isDayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                                                Link Süresi
                                            </p>
                                        </div>
                                    </div>
                                    <select
                                        value={settings.expiryDays}
                                        onChange={(e) => setSettings(s => ({ ...s, expiryDays: parseInt(e.target.value) }))}
                                        className={`px-3 py-2 rounded-lg text-sm ${
                                            isDayMode
                                                ? 'bg-white border border-slate-200 text-slate-700'
                                                : 'bg-[#0f1115] border border-white/10 text-slate-300'
                                        }`}
                                    >
                                        <option value={1}>1 gün</option>
                                        <option value={7}>7 gün</option>
                                        <option value={30}>30 gün</option>
                                        <option value={365}>1 yıl</option>
                                    </select>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateShareUrl}
                                disabled={isLoading || (settings.passwordProtected && !settings.password)}
                                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                    isLoading || (settings.passwordProtected && !settings.password)
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Link2 className="w-4 h-4" />
                                        Canlı Link Oluştur
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Share URL */}
                            <div className={`p-4 rounded-xl border ${
                                isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                            }`}>
                                <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${
                                    isDayMode ? 'text-slate-500' : 'text-slate-500'
                                }`}>
                                    Paylaşım Linki
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className={`flex-1 px-4 py-3 rounded-xl border text-sm ${
                                            isDayMode
                                                ? 'bg-white border-slate-200 text-slate-800'
                                                : 'bg-[#0f1115] border-white/10 text-slate-300'
                                        }`}
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                                            copied
                                                ? 'bg-emerald-500 text-white'
                                                : isDayMode
                                                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                        }`}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex justify-center">
                                <div className={`p-4 rounded-xl border ${
                                    isDayMode ? 'bg-white border-slate-200' : 'bg-white border-white/10'
                                }`}>
                                    <img 
                                        src={qrCodeUrl} 
                                        alt="QR Code" 
                                        className="w-32 h-32"
                                    />
                                    <p className={`text-center text-xs mt-2 ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Taramak için telefon kullanın
                                    </p>
                                </div>
                            </div>

                            {/* Social Share */}
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { icon: Twitter, label: 'Twitter', color: 'bg-sky-500' },
                                    { icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-600' },
                                    { icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-500' },
                                    { icon: Mail, label: 'Email', color: 'bg-slate-600' }
                                ].map(({ icon: Icon, label, color }) => (
                                    <button
                                        key={label}
                                        onClick={() => shareVia(label.toLowerCase())}
                                        className={`p-3 rounded-xl ${color} text-white hover:opacity-90 transition-opacity flex flex-col items-center gap-1`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-[10px] font-bold">{label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Stats */}
                            {settings.trackViews && (
                                <div className={`p-4 rounded-xl ${
                                    isDayMode ? 'bg-slate-50' : 'bg-white/5'
                                }`}>
                                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                                        isDayMode ? 'text-slate-500' : 'text-slate-500'
                                    }`}>
                                        İstatistikler
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <Eye className={`w-5 h-5 mx-auto mb-1 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                            <p className={`text-lg font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                                {stats.views}
                                            </p>
                                            <p className={`text-[10px] ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>Görüntüleme</p>
                                        </div>
                                        <div className="text-center">
                                            <Globe className={`w-5 h-5 mx-auto mb-1 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                            <p className={`text-lg font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                                {stats.uniqueVisitors}
                                            </p>
                                            <p className={`text-[10px] ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>Ziyaretçi</p>
                                        </div>
                                        <div className="text-center">
                                            <Clock className={`w-5 h-5 mx-auto mb-1 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                            <p className={`text-lg font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                                {settings.expiryDays}g
                                            </p>
                                            <p className={`text-[10px] ${isDayMode ? 'text-slate-500' : 'text-slate-500'}`}>Kalan süre</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reset */}
                            <button
                                onClick={() => {
                                    setShareUrl('')
                                    setSettings({
                                        passwordProtected: false,
                                        password: '',
                                        expiryDays: 7,
                                        allowDownload: false,
                                        trackViews: true
                                    })
                                }}
                                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                                    isDayMode
                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                            >
                                Yeni Link Oluştur
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
