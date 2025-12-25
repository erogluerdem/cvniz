import { Link } from 'react-router-dom'
import { Check, Star, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const pricingPlans = [
    {
        name: 'Ücretsiz',
        price: '0',
        period: '',
        description: 'Başlangıç için ideal',
        features: [
            '1 Temel Şablon (Modern)',
            'Watermark\'lı PDF',
            'Sınırlı Düzenleme',
            'Tarayıcıda Kayıt'
        ],
        notIncluded: [
            'Premium Şablonlar',
            'AI İçerik Oluşturma',
            'Sınırsız İndirme',
            'Öncelikli Destek'
        ],
        buttonText: 'Ücretsiz Başla',
        buttonLink: '/editor',
        highlighted: false
    },
    {
        name: 'Pro',
        price: '29',
        period: 'tek seferlik',
        description: 'En popüler seçim',
        features: [
            'Tüm 40 Premium Şablon',
            'Watermark\'sız PDF',
            'Sınırsız Düzenleme',
            '1 CV İndirme Hakkı',
            'AI İçerik Desteği',
            'E-posta Desteği'
        ],
        notIncluded: [],
        buttonText: 'Hemen Satın Al',
        buttonLink: '/payment?plan=pro',
        highlighted: true
    },
    {
        name: 'Kurumsal',
        price: '99',
        period: '/ay',
        description: 'Takımlar için',
        features: [
            'Tüm Pro Özellikleri',
            'Sınırsız CV Oluşturma',
            'Sınırsız İndirme',
            'Öncelikli Destek',
            'Takım Yönetimi',
            'API Erişimi',
            'Özel Şablon Tasarımı'
        ],
        notIncluded: [],
        buttonText: 'Satın Al',
        buttonLink: '/payment?plan=business',
        highlighted: false
    }
]

const faqs = [
    {
        q: 'Ödeme yaptıktan sonra ne olur?',
        a: 'Anında tüm premium şablonlara erişim kazanırsınız. Watermark\'sız PDF indirebilirsiniz.'
    },
    {
        q: 'İade politikanız nedir?',
        a: '7 gün içinde memnun kalmazsanız, hiçbir soru sorulmadan paranızı iade ediyoruz.'
    },
    {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz.'
    }
]

export default function PricingPage() {
    const { isPremium } = useAuth()

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Basit Fiyatlandırma</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Gizli ücret yok. İhtiyacınıza uygun planı seçin.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl p-8 relative ${plan.highlighted
                                ? 'bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-2 border-cyan-500/50 scale-105'
                                : 'glass-card'
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Star className="w-4 h-4" /> En Popüler
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                                <p className="text-gray-400 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-5xl font-extrabold gradient-text">{plan.price}₺</span>
                                <span className="text-gray-400 ml-2">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 opacity-50">
                                        <span className="w-5 h-5 text-center flex-shrink-0">✕</span>
                                        <span className="text-gray-500 line-through">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={plan.buttonLink}
                                className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${plan.highlighted
                                    ? 'btn-premium'
                                    : 'border border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                {isPremium && plan.name === 'Pro' ? 'Zaten Pro' : plan.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Sık Sorulan Sorular</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card rounded-xl p-6">
                                <h3 className="font-semibold mb-2">{faq.q}</h3>
                                <p className="text-gray-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/faq" className="text-cyan-400 hover:underline">
                            Tüm Soruları Gör →
                        </Link>
                    </div>
                </div>

                {/* Guarantee */}
                <div className="mt-16 text-center">
                    <div className="glass-card rounded-2xl p-8 inline-block">
                        <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">7 Gün Para İade Garantisi</h3>
                        <p className="text-gray-400">Memnun kalmazsanız paranızı iade ediyoruz.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
