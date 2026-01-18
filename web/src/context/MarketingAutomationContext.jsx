import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useCV } from './CVContext'

const MarketingAutomationContext = createContext(null)

export function MarketingAutomationProvider({ children }) {
    const { user } = useAuth()
    const { cvs } = useCV()
    const [activeCampaign, setActiveCampaign] = useState(null)

    useEffect(() => {
        if (user) {
            checkTriggers()
        }
    }, [user, cvs])

    const checkTriggers = () => {
        const today = new Date()
        const todayStr = `${today.getMonth() + 1}-${today.getDate()}`

        // 1. Anniversary Campaign
        const registrationDate = new Date(user.createdAt)
        const registrationStr = `${registrationDate.getMonth() + 1}-${registrationDate.getDate()}`

        if (todayStr === registrationStr && today.getFullYear() > registrationDate.getFullYear()) {
            showCampaign({
                id: 'anniversary',
                title: '🎉 Mutlu Yıldönümü!',
                message: 'Bizimle 1 yılı tamamladığınız için tüm Premium şablonlarda %50 indirim kazandınız!',
                code: 'YILDONUMU50',
                type: 'discount'
            })
            return
        }

        // 2. Birthday Discount (Simulated if not set, or we can check user.birthDate if we add it)
        if (user.birthDate) {
            const birthDate = new Date(user.birthDate)
            const birthStr = `${birthDate.getMonth() + 1}-${birthDate.getDate()}`
            if (todayStr === birthStr) {
                showCampaign({
                    id: 'birthday',
                    title: '🎂 İyi ki Doğdun!',
                    message: 'Doğum gününüz kutlu olsun! Size özel sürpriz indirim kodunuzu hemen kullanın.',
                    code: 'DOGUMGUNU',
                    type: 'discount'
                })
                return
            }
        }

        // 3. Abandoned CV Reminder
        // Logic: if user has 0 CVs OR if they haven't updated their CV in 7 days
        if (cvs.length === 0) {
            const lastReminder = localStorage.getItem(`CVniz_abandoned_reminder_${user.id}`)
            if (!lastReminder) {
                showCampaign({
                    id: 'abandoned',
                    title: '📂 CV\'niz Sizi Bekliyor!',
                    message: 'Kariyerinizde yeni bir sayfa açmaya çok yakınsınız. CV\'nizi hemen tamamlayın ve fark yaratın!',
                    type: 'reminder'
                })
                localStorage.setItem(`CVniz_abandoned_reminder_${user.id}`, today.toISOString())
                return
            }
        }
    }

    const showCampaign = (campaign) => {
        // Prevent showing multiple popups in one session if already dismissed
        const dismissed = sessionStorage.getItem(`CVniz_dismissed_${campaign.id}`)
        if (!dismissed) {
            setActiveCampaign(campaign)
        }
    }

    const dismissCampaign = () => {
        if (activeCampaign) {
            sessionStorage.setItem(`CVniz_dismissed_${activeCampaign.id}`, 'true')
            setActiveCampaign(null)
        }
    }

    return (
        <MarketingAutomationContext.Provider value={{
            activeCampaign,
            dismissCampaign,
            checkTriggers
        }}>
            {children}
        </MarketingAutomationContext.Provider>
    )
}

export const useMarketing = () => useContext(MarketingAutomationContext)

