import { Link } from 'react-router-dom'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Confetti from 'react-confetti'
import { useState, useEffect } from 'react'

export default function PaymentSuccessPage() {
    const { user, isPremium } = useAuth()
    const [showConfetti, setShowConfetti] = useState(true)
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        window.addEventListener('resize', handleResize)
        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}

            <div className="max-w-lg w-full text-center">
                <div className="glass-card rounded-3xl p-10">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">
                        Ödeme Başarılı! 🎉
                    </h1>

                    <p className="text-gray-400 mb-8">
                        Tebrikler {user?.name}! Artık <span className="text-cyan-400 font-semibold">Pro</span> üyesisiniz.
                        Tüm premium şablonlara ve özelliklere erişebilirsiniz.
                    </p>

                    <div className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl p-6 mb-8">
                        <h3 className="font-semibold mb-4">Pro Özellikleriniz:</h3>
                        <ul className="space-y-2 text-left">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>40 Premium Şablon</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Watermark'sız PDF</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>Sınırsız Düzenleme</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>AI İçerik Desteği</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link to="/editor" className="btn-premium py-3 flex items-center justify-center gap-2">
                            CV Oluşturmaya Başla <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/dashboard" className="py-3 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
                            Panele Git
                        </Link>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    Fatura e-posta adresinize gönderildi.
                </p>
            </div>
        </div>
    )
}
