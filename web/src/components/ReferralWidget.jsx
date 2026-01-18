import { useState } from 'react'
import { useReferral } from '../context/ReferralContext'
import {
    Gift, Copy, Check, Users, Award, Share2,
    Twitter, Facebook, Linkedin, Mail, Ticket,
    ChevronDown, ChevronUp, Sparkles, TrendingUp
} from 'lucide-react'

export default function ReferralWidget() {
    const {
        getReferralCode,
        getReferralLink,
        referralStats
    } = useReferral()

    const [copied, setCopied] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const referralCode = getReferralCode()
    const referralLink = getReferralLink()

    const handleCopyCode = () => {
        if (referralCode) {
            navigator.clipboard.writeText(referralCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleCopyLink = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const shareOnTwitter = () => {
        const text = `CVniz ile profesyonel CV oluşturmak çok kolay! Kayıt ol ve %20 indirim kazan: ${referralLink}`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    }

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')
    }

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank')
    }

    const shareViaEmail = () => {
        const subject = 'CVniz ile Profesyonel CV Oluştur - %20 İndirim'
        const body = `Merhaba,\n\nCVniz ile profesyonel CV oluşturmak çok kolay! Bu link ile kayıt olursan %20 indirim kazanırsın:\n\n${referralLink}\n\nİyi günler!`
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10" />

            {/* Header */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Arkadaşını Getir</h3>
                            <p className="text-xs text-gray-400">Her davet için %20 indirim kazan!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                        <div className="text-xl font-bold">{referralStats.totalReferrals}</div>
                        <div className="text-[10px] text-gray-500">Davetli</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <TrendingUp className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                        <div className="text-xl font-bold">{referralStats.completedReferrals}</div>
                        <div className="text-[10px] text-gray-500">Tamamlanan</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                        <Award className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                        <div className="text-xl font-bold">{referralStats.earnedCoupons.length}</div>
                        <div className="text-[10px] text-gray-500">Kupon</div>
                    </div>
                </div>

                {/* Referral Code */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <div className="text-xs text-gray-400 mb-2">Referral Kodun</div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-900/50 rounded-lg px-4 py-2 font-mono text-lg font-bold text-cyan-400 tracking-wider">
                            {referralCode || '...'}
                        </div>
                        <button
                            onClick={handleCopyCode}
                            className="p-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors text-cyan-400"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Expanded Section */}
                {expanded && (
                    <div className="space-y-4 animate-fadeIn">
                        {/* Share Link */}
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-xs text-gray-400 mb-2">Paylaşım Linkin</div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={referralLink || ''}
                                    readOnly
                                    className="flex-1 bg-slate-900/50 rounded-lg px-4 py-2 text-sm text-gray-300 truncate"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-400 text-sm font-medium flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Kopyala
                                </button>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div>
                            <div className="text-xs text-gray-400 mb-3">Sosyal Medyada Paylaş</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={shareOnTwitter}
                                    className="flex-1 p-3 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors flex items-center justify-center"
                                >
                                    <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                                </button>
                                <button
                                    onClick={shareOnFacebook}
                                    className="flex-1 p-3 rounded-xl bg-[#4267B2]/20 hover:bg-[#4267B2]/30 transition-colors flex items-center justify-center"
                                >
                                    <Facebook className="w-5 h-5 text-[#4267B2]" />
                                </button>
                                <button
                                    onClick={shareOnLinkedIn}
                                    className="flex-1 p-3 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 transition-colors flex items-center justify-center"
                                >
                                    <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                                </button>
                                <button
                                    onClick={shareViaEmail}
                                    className="flex-1 p-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 transition-colors flex items-center justify-center"
                                >
                                    <Mail className="w-5 h-5 text-pink-400" />
                                </button>
                            </div>
                        </div>

                        {/* Earned Coupons */}
                        {referralStats.earnedCoupons.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                                    <Ticket className="w-4 h-4" />
                                    Kazandığın Kuponlar
                                </div>
                                <div className="space-y-2">
                                    {referralStats.earnedCoupons.map((coupon, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-3 rounded-xl ${coupon.used
                                                    ? 'bg-gray-500/10 opacity-50'
                                                    : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Sparkles className={`w-5 h-5 ${coupon.used ? 'text-gray-500' : 'text-green-400'}`} />
                                                <div>
                                                    <div className="font-mono font-bold">{coupon.code}</div>
                                                    <div className="text-xs text-gray-400">
                                                        %{coupon.discount} İndirim
                                                    </div>
                                                </div>
                                            </div>
                                            {coupon.used ? (
                                                <span className="text-xs text-gray-500">Kullanıldı</span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(coupon.code)
                                                        setCopied(true)
                                                        setTimeout(() => setCopied(false), 2000)
                                                    }}
                                                    className="text-xs px-3 py-1 rounded-lg bg-green-500/30 hover:bg-green-500/40 text-green-400 transition-colors"
                                                >
                                                    Kopyala
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* How it Works */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                            <div className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Nasıl Çalışır?
                            </div>
                            <div className="space-y-2 text-xs text-gray-400">
                                <div className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">1</span>
                                    <span>Referral linkini arkadaşlarınla paylaş</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">2</span>
                                    <span>Arkadaşın linkin üzerinden kayıt olsun</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">3</span>
                                    <span>Arkadaşın Pro'ya geçtiğinde sen %20 indirim kuponu kazan!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

