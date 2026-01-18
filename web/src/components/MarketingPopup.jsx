import { X, Gift, PartyPopper, BellRing, ArrowRight, Sparkles } from 'lucide-react'
import { useMarketing } from '../context/MarketingAutomationContext'

export default function MarketingPopup() {
    const { activeCampaign, dismissCampaign } = useMarketing()

    if (!activeCampaign) return null

    const icons = {
        anniversary: <PartyPopper className="w-8 h-8 text-amber-400" />,
        birthday: <Gift className="w-8 h-8 text-pink-500" />,
        abandoned: <BellRing className="w-8 h-8 text-cyan-400" />
    }

    const gradients = {
        anniversary: 'from-amber-500/20 to-orange-500/20',
        birthday: 'from-pink-500/20 to-rose-500/20',
        abandoned: 'from-cyan-500/20 to-blue-500/20'
    }

    return (
        <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-left-10 duration-500">
            <div className={`glass-card border-white/10 rounded-3xl w-80 p-6 shadow-2xl overflow-hidden relative group`}>
                {/* Background Decor */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${gradients[activeCampaign.id]} blur-2xl group-hover:scale-150 transition-transform duration-700`} />

                <button
                    onClick={dismissCampaign}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center relative">
                        {icons[activeCampaign.id] || <Sparkles className="w-8 h-8 text-white" />}
                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white italic tracking-tight">{activeCampaign.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{activeCampaign.message}</p>
                    </div>

                    {activeCampaign.code && (
                        <div className="w-full p-3 rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center gap-1 group/code">
                            <span className="text-[10px] uppercase font-bold text-gray-500">İndirim Kodunuz</span>
                            <span className="text-lg font-mono font-black text-cyan-400 tracking-widest">{activeCampaign.code}</span>
                        </div>
                    )}

                    <button
                        onClick={dismissCampaign}
                        className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-cyan-400 hover:text-white transition-all active:scale-95"
                    >
                        {activeCampaign.type === 'discount' ? 'FIRSATI YAKALA' : 'ŞİMDİ OLUŞTUR'}
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={dismissCampaign}
                        className="text-[10px] text-gray-600 hover:text-gray-400 uppercase font-bold tracking-widest"
                    >
                        Daha Sonra Hatırlat
                    </button>
                </div>
            </div>
        </div>
    )
}
