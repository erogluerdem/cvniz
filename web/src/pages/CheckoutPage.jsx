import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePayment, PLANS } from '../context/PaymentContext'
import { CountdownTimer } from '../components/SalesPrompts'
import {
    CreditCard, Check, Shield, Lock, ArrowLeft, Tag, X, Loader2,
    Calendar, Infinity, Clock, Sparkles, Crown, CheckCircle, AlertCircle,
    Landmark, Copy, Upload, ArrowRight
} from 'lucide-react'
import { mediaAPI, paymentAPI } from '../services/api'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { user } = useAuth()
    const {
        selectedPlan, setSelectedPlan,
        billingCycle, setBillingCycle,
        appliedCoupon, applyCoupon, removeCoupon,
        calculatePrice, processPayment, isProcessing
    } = usePayment()

    const [couponCode, setCouponCode] = useState('')
    const [couponError, setCouponError] = useState('')
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    })
    const [errors, setErrors] = useState({})
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [paymentResult, setPaymentResult] = useState(null)

    // Payment Logic
    const [paymentMethod, setPaymentMethod] = useState('card') // 'card' or 'bank'
    const [bankForm, setBankForm] = useState({ senderName: '', file: null })

    const [localProcessing, setLocalProcessing] = useState(false)

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, bank: 'Dosya boyutu 5MB\'dan küçük olmalı' }))
                return
            }
            setBankForm({ ...bankForm, file })
            setErrors(prev => ({ ...prev, bank: '' }))
        }
    }

    const handleBankSubmit = async () => {
        if (!bankForm.senderName || bankForm.senderName.length < 3) {
            setErrors({ bank: 'Lütfen gönderen adını tam girin' })
            return
        }
        if (!bankForm.file) {
            setErrors({ bank: 'Lütfen dekont yükleyin' })
            return
        }

        setLocalProcessing(true)

        try {
            // 1. Upload Receipt
            const formData = new FormData()
            formData.append('file', bankForm.file)
            const uploadRes = await mediaAPI.upload(formData)

            if (!uploadRes.success) throw new Error('Dosya yüklenemedi')
            const proofUrl = uploadRes.data.url

            // 2. Create Payment Notification
            const paymentRes = await paymentAPI.bankTransfer({
                planId: selectedPlan.id,
                planName: selectedPlan.name,
                billingCycle,
                amount: finalPrice,
                senderName: bankForm.senderName,
                proofDocument: proofUrl
            })

            if (paymentRes.success) {
                setPaymentSuccess(true)
                setPaymentResult(paymentRes.payment)
            } else {
                setErrors({ bank: paymentRes.error || 'Bildirim oluşturulamadı' })
            }
        } catch (error) {
            console.error(error)
            setErrors({ bank: error.response?.data?.error || error.message || 'Bir hata oluştu' })
        } finally {
            setLocalProcessing(false)
        }
    }

    // Countdown timer - expires in 24 hours from session start
    const [offerEndTime] = useState(() => {
        const stored = sessionStorage.getItem('checkoutOfferEnd')
        if (stored) return stored
        const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        sessionStorage.setItem('checkoutOfferEnd', endTime)
        return endTime
    })

    // Get plan from URL params
    useEffect(() => {
        const planId = searchParams.get('plan') || 'pro'
        const cycle = searchParams.get('cycle') || 'yearly'

        if (PLANS[planId]) {
            setSelectedPlan(PLANS[planId])
        }
        setBillingCycle(cycle)
    }, [searchParams, setSelectedPlan, setBillingCycle])

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout')
        }
    }, [user, navigate])

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        return parts.length ? parts.join(' ') : value
    }

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    const handleCardChange = (field, value) => {
        let formattedValue = value
        if (field === 'cardNumber') {
            formattedValue = formatCardNumber(value)
        } else if (field === 'expiry') {
            formattedValue = formatExpiry(value)
        } else if (field === 'cvv') {
            formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4)
        }
        setCardData(prev => ({ ...prev, [field]: formattedValue }))
        setErrors(prev => ({ ...prev, [field]: '' }))
    }

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return
        const result = applyCoupon(couponCode)
        if (!result.valid) {
            setCouponError(result.error)
        } else {
            setCouponError('')
            setCouponCode('')
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'Geçerli bir kart numarası girin'
        }
        if (!cardData.cardName || cardData.cardName.length < 3) {
            newErrors.cardName = 'Kart üzerindeki ismi girin'
        }
        if (!cardData.expiry || cardData.expiry.length < 5) {
            newErrors.expiry = 'Geçerli bir son kullanma tarihi girin'
        }
        if (!cardData.cvv || cardData.cvv.length < 3) {
            newErrors.cvv = 'CVV kodunu girin'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const result = await processPayment({
            cardNumber: cardData.cardNumber.replace(/\s/g, ''),
            cardName: cardData.cardName,
            expiry: cardData.expiry,
            cvv: cardData.cvv
        })

        if (result.success) {
            setPaymentSuccess(true)
            setPaymentResult(result.payment)
        } else {
            setErrors({ submit: result.error })
        }
    }

    const finalPrice = calculatePrice(selectedPlan, billingCycle, appliedCoupon)
    const originalPrice = calculatePrice(selectedPlan, billingCycle, null)

    const billingOptions = [
        { id: 'monthly', label: 'Aylık', icon: Clock, desc: 'Her ay faturalandırılır' },
        { id: 'yearly', label: 'Yıllık', icon: Calendar, desc: '%40 tasarruf', badge: 'Popüler' },
        { id: 'lifetime', label: 'Tek Seferlik', icon: Infinity, desc: 'Süresiz erişim' }
    ]

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center">
                    <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>

                            <h1 className="text-3xl font-bold mb-2">Ödeme Başarılı! 🎉</h1>
                            <p className="text-gray-400 mb-6">
                                Pro üyeliğiniz aktif edildi. Tüm premium özelliklere erişebilirsiniz.
                            </p>

                            <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">İşlem No</span>
                                    <span className="font-mono">{paymentResult?.id}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Plan</span>
                                    <span>{paymentResult?.planName}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Ödeme Tipi</span>
                                    <span>{billingOptions.find(b => b.id === paymentResult?.billingCycle)?.label}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tutar</span>
                                    <span className="font-bold text-green-400">{paymentResult?.amount}₺</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    to="/dashboard"
                                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium"
                                >
                                    Panele Git
                                </Link>
                                <Link
                                    to="/editor"
                                    className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                                >
                                    CV Oluştur
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Ödeme</h1>
                        <p className="text-sm text-gray-400">Güvenli ödeme ile Pro'ya geçin</p>
                    </div>
                </div>

                {/* Countdown Timer */}
                <div className="mb-6">
                    <CountdownTimer endTime={offerEndTime} />
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Billing Cycle Selection */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-cyan-400" />
                                Fatura Dönemi
                            </h2>

                            <div className="grid grid-cols-3 gap-3">
                                {billingOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setBillingCycle(option.id)}
                                        className={`p-4 rounded-xl border-2 transition-all relative ${billingCycle === option.id
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {option.badge && (
                                            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black">
                                                {option.badge}
                                            </span>
                                        )}
                                        <option.icon className={`w-6 h-6 mb-2 ${billingCycle === option.id ? 'text-cyan-400' : 'text-gray-500'}`} />
                                        <div className="font-bold text-sm">{option.label}</div>
                                        <div className="text-[10px] text-gray-500">{option.desc}</div>
                                        <div className="mt-2 font-bold text-lg">
                                            {selectedPlan?.price[option.id]}₺
                                            {option.id !== 'lifetime' && <span className="text-xs text-gray-500">/ay</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-cyan-400" />
                                Ödeme Yöntemi
                            </h2>

                            <div className="flex p-1 bg-white/5 rounded-xl mb-6">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'card'
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Kredi / Banka Kartı
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'bank'
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Landmark className="w-4 h-4" />
                                    Havale / EFT
                                </button>
                            </div>

                            {paymentMethod === 'card' ? (
                                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-sm mb-4 flex items-start gap-3">
                                        <Shield className="w-5 h-5 shrink-0" />
                                        <p>Ödemeniz <strong>Iyzico / PayTR</strong> güvencesiyle 256-bit SSL şifreleme ile işlenecektir. Kart bilgileriniz sistemimizde saklanmaz.</p>
                                    </div>

                                    {/* Card input simulation (or redirect info) */}
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CreditCard className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-300 text-sm mb-6 max-w-xs mx-auto">
                                            "Öde" butonuna tıkladığınızda güvenli ödeme sayfasına yönlendirileceksiniz.
                                        </p>

                                        {/* Mock Simulation Buttons for Development */}
                                        <div className="text-xs text-gray-500 mb-4 bg-black/20 p-2 rounded">
                                            (Geliştirici Notu: Gerçek entegrasyonda burası Iyzico formunu açar)
                                        </div>
                                    </div>

                                    {errors.submit && (
                                        <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.submit}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Yönlendiriliyor...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                {finalPrice}₺ Güvenli Öde
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Bank Accounts */}
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                    <span className="font-bold text-lg">GB</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Garanti Bankası</h4>
                                                    <p className="text-xs text-gray-400">CVniz Teknoloji A.Ş.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg mb-2">
                                                <code className="text-sm font-mono text-cyan-400">TR12 0006 2000 0001 2345 6789 01</code>
                                                <button onClick={() => navigator.clipboard.writeText('TR12 0006 2000 0001 2345 6789 01')} className="text-gray-500 hover:text-white p-1">
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-gray-500 text-center">
                                                Açıklama kısmına <strong>{user?.email}</strong> yazmayı unutmayın.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Upload Form */}
                                    <div className="border-t border-white/10 pt-6">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <Upload className="w-4 h-4 text-purple-400" />
                                            Ödeme Bildirimi
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Gönderen Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    value={bankForm.senderName}
                                                    onChange={(e) => setBankForm({ ...bankForm, senderName: e.target.value })}
                                                    placeholder="Örn: Ahmet Yılmaz"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-2">Dekont Yükle</label>
                                                <div className="relative group cursor-pointer">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileSelect}
                                                        accept="image/*,.pdf"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${bankForm.file
                                                        ? 'border-green-500/50 bg-green-500/10'
                                                        : 'border-white/10 bg-white/5 group-hover:border-white/20 group-hover:bg-white/10'
                                                        }`}>
                                                        {bankForm.file ? (
                                                            <div className="flex items-center justify-center gap-2 text-green-400">
                                                                <CheckCircle className="w-5 h-5" />
                                                                <span className="font-medium text-sm truncate max-w-[200px]">{bankForm.file.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                                                <p className="text-sm">Dosya seçmek için tıklayın</p>
                                                                <p className="text-[10px] mt-1 opacity-50">JPG, PNG veya PDF</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {errors.bank && (
                                                <div className="text-xs text-red-400 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> {errors.bank}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleBankSubmit}
                                                disabled={isProcessing || localProcessing}
                                                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                            >
                                                {isProcessing || localProcessing ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        Bildirimi Gönder
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-2">
                        <div className="glass-card rounded-2xl p-6 sticky top-24">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                Sipariş Özeti
                            </h2>

                            {/* Selected Plan */}
                            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl p-4 mb-4 border border-cyan-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="w-8 h-8 text-cyan-400" />
                                    <div>
                                        <div className="font-bold">{selectedPlan?.name} Plan</div>
                                        <div className="text-xs text-gray-400">
                                            {billingOptions.find(b => b.id === billingCycle)?.label} faturalama
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {selectedPlan?.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <Check className="w-3 h-3 text-green-400" />
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Kupon Kodu</label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-green-400" />
                                            <span className="font-bold text-green-400">{appliedCoupon.code}</span>
                                            <span className="text-xs text-gray-400">
                                                ({appliedCoupon.type === 'percent' ? `%${appliedCoupon.discount}` : `${appliedCoupon.discount}₺`} indirim)
                                            </span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-gray-400 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Kupon kodu girin"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                        >
                                            Uygula
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Plan Ücreti</span>
                                    <span>{originalPrice}₺</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-green-400">
                                        <span>Kupon İndirimi</span>
                                        <span>-{originalPrice - finalPrice}₺</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                    <span>Toplam</span>
                                    <span className="text-cyan-400">{finalPrice}₺</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Güvenli
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> SSL
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check className="w-3 h-3" /> 7 Gün İade
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
