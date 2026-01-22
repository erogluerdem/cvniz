import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCampaign } from '../context/CampaignContext'
import { useAuth } from '../context/AuthContext'
import {
    X, Sparkles, Gift, ArrowRight, FileText,
    Layout, Crown, ChevronRight, Zap
} from 'lucide-react'

export default function WelcomePopup() {
    const { user } = useAuth()
    const { activeCampaign, dismissCampaign, trackCampaignClick, triggerCampaign } = useCampaign()
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    // Trigger welcome campaign on registration
    useEffect(() => {
        if (user) {
            // Check if this is a new user (registered within last 5 minutes)
            const registrationTime = new Date(user.createdAt).getTime()
            const now = Date.now()
            const fiveMinutes = 5 * 60 * 1000

            if (now - registrationTime < fiveMinutes) {
                // Trigger welcome campaign after a short delay
                const timer = setTimeout(() => {
                    const campaign = triggerCampaign('registration')
                    if (campaign) {
                        setIsVisible(true)
                    }
                }, 1500)
                return () => clearTimeout(timer)
            }
        }
    }, [user, triggerCampaign])

    // Show popup when activeCampaign is welcome type
    useEffect(() => {
        if (activeCampaign?.id === 'welcome') {
            setIsVisible(true)
        }
    }, [activeCampaign])

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsVisible(false)
            setIsClosing(false)
            dismissCampaign()
        }, 300)
    }

    const handlePrimaryClick = () => {
        trackCampaignClick('welcome', 'cta_primary')
        handleClose()
        navigate('/editor')
    }

    const handleSecondaryClick = () => {
        trackCampaignClick('welcome', 'cta_secondary')
        handleClose()
        navigate('/templates')
    }

    if (!isVisible || !activeCampaign || activeCampaign.id !== 'welcome') return null

    const content = activeCampaign.content

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`max-w-lg w-full glass-card rounded-3xl overflow-hidden relative transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20" />

                {/* Animated Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse" />
                    <div className="absolute w-24 h-24 bg-purple-500/20 rounded-full blur-3xl -bottom-10 -right-10 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Content */}
                <div className="relative z-10 p-8">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                        {content.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-400 text-center mb-6">
                        {content.subtitle}
                    </p>

                    {/* Body */}
                    <p className="text-gray-300 text-center text-sm mb-8 px-4">
                        {content.body}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="text-center p-3 rounded-xl bg-white/5">
                            <FileText className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                            <span className="text-xs text-gray-400">200+ Şablon</span>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                            <Zap className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                            <span className="text-xs text-gray-400">AI Asistan</span>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                            <Gift className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                            <span className="text-xs text-gray-400">%20 İndirim</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                        <button
                            onClick={handlePrimaryClick}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-500/30"
                        >
                            {content.ctaPrimary}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSecondaryClick}
                            className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Layout className="w-5 h-5" />
                            {content.ctaSecondary}
                        </button>
                    </div>

                    {/* Skip */}
                    <button
                        onClick={handleClose}
                        className="w-full mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
                    >
                        Daha sonra
                    </button>
                </div>
            </div>
        </div>
    )
}
