import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SalaryContext = createContext(null)

// Salary data by position and city
export const SALARY_DATA = {
    'Frontend Developer': {
        junior: { min: 25000, avg: 35000, max: 50000 },
        mid: { min: 45000, avg: 65000, max: 90000 },
        senior: { min: 80000, avg: 120000, max: 180000 }
    },
    'Backend Developer': {
        junior: { min: 28000, avg: 40000, max: 55000 },
        mid: { min: 50000, avg: 75000, max: 100000 },
        senior: { min: 90000, avg: 130000, max: 200000 }
    },
    'Full Stack Developer': {
        junior: { min: 30000, avg: 42000, max: 58000 },
        mid: { min: 55000, avg: 80000, max: 110000 },
        senior: { min: 100000, avg: 150000, max: 220000 }
    },
    'DevOps Engineer': {
        junior: { min: 35000, avg: 50000, max: 65000 },
        mid: { min: 60000, avg: 90000, max: 120000 },
        senior: { min: 110000, avg: 160000, max: 250000 }
    },
    'Data Scientist': {
        junior: { min: 35000, avg: 50000, max: 70000 },
        mid: { min: 65000, avg: 100000, max: 140000 },
        senior: { min: 120000, avg: 180000, max: 280000 }
    },
    'Product Manager': {
        junior: { min: 30000, avg: 45000, max: 60000 },
        mid: { min: 55000, avg: 85000, max: 120000 },
        senior: { min: 100000, avg: 150000, max: 230000 }
    },
    'UI/UX Designer': {
        junior: { min: 22000, avg: 32000, max: 45000 },
        mid: { min: 40000, avg: 60000, max: 85000 },
        senior: { min: 75000, avg: 110000, max: 160000 }
    },
    'Project Manager': {
        junior: { min: 25000, avg: 38000, max: 50000 },
        mid: { min: 45000, avg: 70000, max: 95000 },
        senior: { min: 85000, avg: 130000, max: 190000 }
    }
}

// City multipliers
export const CITY_MULTIPLIERS = {
    'İstanbul': 1.0,
    'Ankara': 0.85,
    'İzmir': 0.82,
    'Bursa': 0.75,
    'Antalya': 0.72,
    'Diğer': 0.65,
    'Remote': 0.90
}

// Negotiation strategies
export const NEGOTIATION_STRATEGIES = {
    research: {
        name: 'Araştırma Temelli',
        description: 'Piyasa verilerine dayalı pazarlık',
        tips: [
            'Pozisyon için piyasa ortalamasını araştırın',
            'Şirketin maaş bandını öğrenmeye çalışın',
            'Rakip şirketlerin tekliflerini bilin'
        ]
    },
    value: {
        name: 'Değer Odaklı',
        description: 'Sunduğunuz değeri vurgulayın',
        tips: [
            'Somut başarılarınızı listeleyin',
            'Rakamlarla ifade edin (satış artışı, maliyet düşüşü)',
            'Benzersiz becerilerinizi öne çıkarın'
        ]
    },
    collaborative: {
        name: 'İşbirlikçi',
        description: 'Kazan-kazan yaklaşımı',
        tips: [
            'Esnek olun (maaş dışı faydalar)',
            'Şirketin bütçe kısıtlarını anlayın',
            'Performansa dayalı artış teklif edin'
        ]
    },
    anchor: {
        name: 'Çapa Yöntemi',
        description: 'İlk teklifi siz verin',
        tips: [
            'Hedefledğinizin %15-20 üstünde başlayın',
            'Net ve kararlı olun',
            'Sessizlik gücünü kullanın'
        ]
    }
}

// Negotiation phrases
export const NEGOTIATION_PHRASES = {
    opening: [
        'Teklifi değerlendirdim ve deneyimlerime göre {amount} aralığının daha uygun olacağını düşünüyorum.',
        'Piyasa araştırmama göre, bu pozisyon için {amount} bandı daha rekabetçi görünüyor.'
    ],
    counter: [
        'Teklifinizi anlıyorum, ancak {reason} nedeniyle {amount} daha uygun olacaktır.',
        'Mevcut teklifime zaten {amount} civarında bir teklif aldım, bunu karşılayabilir misiniz?'
    ],
    closing: [
        'Eğer {amount} üzerinde anlaşabilirsek, hemen başlamaya hazırım.',
        'Bu rakamda anlaşırsak, 3 yıllık bir bağlılık taahhüdü verebilirim.'
    ]
}

export function SalaryProvider({ children }) {
    const { user } = useAuth()
    const [calculations, setCalculations] = useState([])

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_salary_calculations')
        if (stored) {
            try {
                setCalculations(JSON.parse(stored))
            } catch (e) { }
        }
    }, [])

    // Save calculations
    const saveCalculations = (newCalcs) => {
        setCalculations(newCalcs)
        localStorage.setItem('CVniz_salary_calculations', JSON.stringify(newCalcs))
    }

    // Calculate salary range
    const calculateSalaryRange = (position, level, city, yearsExp = 0, skills = []) => {
        const positionData = SALARY_DATA[position]
        if (!positionData) return null

        const levelData = positionData[level]
        if (!levelData) return null

        const cityMultiplier = CITY_MULTIPLIERS[city] || 0.7

        // Experience bonus (2% per year, max 20%)
        const expBonus = Math.min(yearsExp * 0.02, 0.2)

        // Skills bonus (5% per in-demand skill, max 15%)
        const inDemandSkills = ['React', 'Python', 'AWS', 'Kubernetes', 'Machine Learning', 'TypeScript']
        const matchingSkills = skills.filter(s =>
            inDemandSkills.some(d => s.toLowerCase().includes(d.toLowerCase()))
        )
        const skillsBonus = Math.min(matchingSkills.length * 0.05, 0.15)

        const totalBonus = 1 + expBonus + skillsBonus

        const result = {
            min: Math.round(levelData.min * cityMultiplier * totalBonus),
            avg: Math.round(levelData.avg * cityMultiplier * totalBonus),
            max: Math.round(levelData.max * cityMultiplier * totalBonus),
            marketData: levelData,
            adjustments: {
                cityMultiplier,
                expBonus: Math.round(expBonus * 100),
                skillsBonus: Math.round(skillsBonus * 100)
            }
        }

        // Save calculation
        const calc = {
            id: `calc_${Date.now()}`,
            userId: user?.id,
            position,
            level,
            city,
            yearsExp,
            skills,
            result,
            createdAt: new Date().toISOString()
        }
        saveCalculations([...calculations, calc])

        return result
    }

    // Generate negotiation script
    const generateNegotiationScript = (currentOffer, targetSalary, reasons = []) => {
        const difference = targetSalary - currentOffer
        const percentIncrease = Math.round((difference / currentOffer) * 100)

        const script = {
            opening: `Teklifiniz için teşekkür ederim. Deneyimlerimi ve piyasa koşullarını değerlendirdiğimde, ${targetSalary.toLocaleString()} TL'nin daha uygun olacağını düşünüyorum.`,

            reasons: reasons.length > 0
                ? reasons
                : [
                    'Benzer pozisyonlarda piyasa ortalaması bu seviyede',
                    `${percentIncrease}% artış, sunduğum değerle orantılı`
                ],

            alternatives: [
                'Maaş konusunda esneklik gösteremezseniz, performans bonusu teklifine açığım',
                '6 aylık değerlendirme ile maaş revizyonu yapılabilir',
                'Ek yan haklar (eğitim bütçesi, esnek çalışma) değerlendirilebilir'
            ],

            closing: 'Bu koşullarda anlaşabilirsek, ekibinize büyük katkı sağlayacağıma eminim.'
        }

        return script
    }

    // Get negotiation tips by strategy
    const getStrategyTips = (strategyId) => {
        return NEGOTIATION_STRATEGIES[strategyId] || null
    }

    // Calculate counter offer
    const calculateCounterOffer = (offer, strategy = 'value') => {
        const multipliers = {
            conservative: 1.1,
            moderate: 1.15,
            aggressive: 1.25
        }

        return {
            conservative: Math.round(offer * multipliers.conservative),
            moderate: Math.round(offer * multipliers.moderate),
            aggressive: Math.round(offer * multipliers.aggressive)
        }
    }

    // Get user's calculation history
    const getCalculationHistory = () => {
        return calculations.filter(c => c.userId === user?.id)
    }

    return (
        <SalaryContext.Provider value={{
            calculations,
            calculateSalaryRange,
            generateNegotiationScript,
            getStrategyTips,
            calculateCounterOffer,
            getCalculationHistory,
            SALARY_DATA,
            CITY_MULTIPLIERS,
            NEGOTIATION_STRATEGIES,
            NEGOTIATION_PHRASES
        }}>
            {children}
        </SalaryContext.Provider>
    )
}

export const useSalary = () => useContext(SalaryContext)

