import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PaymentPage() {
    const [searchParams] = useSearchParams()
    const plan = searchParams.get('plan') || 'pro'
    const navigate = useNavigate()
    const { user, upgradeToPremium } = useAuth()

    const [paymentMethod, setPaymentMethod] = useState('iyzico')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const plans = {
        pro: { name: 'Pro', price: 29, period: 'tek seferlik', features: ['40 Premium Şablon', 'Watermark\'sız PDF', 'Sınırsız Düzenleme'] },
        business: { name: 'Kurumsal', price: 99, period: '/ay', features: ['Tüm Pro Özellikleri', 'Sınırsız İndirme', 'Öncelikli Destek'] }
    }

    const currentPlan = plans[plan] || plans.pro

    const handlePayment = async () => {
        if (!user) {
            navigate('/login?redirect=/payment?plan=' + plan)
            return
        }

        setLoading(true)
        setError('')

        try {
            // For demo purposes, simulate payment success
            // In production, this would call the actual payment API
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulate successful payment
            upgradeToPremium()
            navigate('/payment/success')
        } catch (err) {
            setError('Ödeme işlemi başarısız. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    // Demo mode - direct upgrade for testing
    const handleDemoPayment = () => {
        if (!user) {
            navigate('/login?redirect=/payment?plan=' + plan)
            return
        }
        upgradeToPremium()
        navigate('/payment/success')
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/pricing" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
                        <ArrowLeft className="w-5 h-5" /> Geri
                    </Link>
                    <h1 className="text-3xl font-bold">Ödeme</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>

                        <div className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl p-6 mb-6">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold gradient-text">{currentPlan.price}₺</span>
                                <span className="text-gray-400">{currentPlan.period}</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{currentPlan.name} Paket</h3>
                            <ul className="space-y-2">
                                {currentPlan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300">
                                        <Check className="w-4 h-4 text-green-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between text-lg">
                                <span>Toplam</span>
                                <span className="font-bold gradient-text">{currentPlan.price}₺</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6">Ödeme Yöntemi</h2>

                        {/* Payment Options */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => setPaymentMethod('iyzico')}
                                className={`w-full p-4 rounded-xl border-2 transition-colors flex items-center gap-4 ${paymentMethod === 'iyzico'
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                                    iyzico
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">iyzico ile Öde</div>
                                    <div className="text-sm text-gray-400">Kredi/Banka kartı</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setPaymentMethod('paytr')}
                                className={`w-full p-4 rounded-xl border-2 transition-colors flex items-center gap-4 ${paymentMethod === 'paytr'
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                                    PayTR
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold">PayTR ile Öde</div>
                                    <div className="text-sm text-gray-400">Kredi/Banka kartı</div>
                                </div>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full btn-premium py-4 text-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    {currentPlan.price}₺ Öde
                                </>
                            )}
                        </button>

                        {/* Demo Button for Testing */}
                        <button
                            onClick={handleDemoPayment}
                            className="w-full mt-3 py-3 text-sm text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            🧪 Demo: Ödeme Simülasyonu (Test için)
                        </button>

                        {/* Security Note */}
                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span>256-bit SSL ile güvenli ödeme</span>
                        </div>

                        {/* Cards */}
                        <div className="mt-4 flex gap-2">
                            <div className="px-3 py-1 bg-white/10 rounded text-xs">Visa</div>
                            <div className="px-3 py-1 bg-white/10 rounded text-xs">Mastercard</div>
                            <div className="px-3 py-1 bg-white/10 rounded text-xs">Troy</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
