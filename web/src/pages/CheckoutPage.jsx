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
    const [iyzicoHtml, setIyzicoHtml] = useState(null) // New state for Iyzico content
    const [uiTheme, setUiTheme] = useState('night')
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

    // Theme logic
    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem('CVniz-home-theme')
        if (stored === 'day' || stored === 'night') {
            setUiTheme(stored)
        }
        
        const handler = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setUiTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handler)
        return () => window.removeEventListener('CVniz-theme-change', handler)
    }, [])

    const darkMode = uiTheme === 'night'

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=/checkout')
        }
    }, [user, navigate])

    // Script Execution Effect for Iyzico
    useEffect(() => {
        if (iyzicoHtml) {
            const container = document.getElementById('iyzico-container');
            if (container) {
                container.innerHTML = iyzicoHtml;
                const scripts = container.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            }
        }
    }, [iyzicoHtml])

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

    const handlePaymentInit = async () => {
        const result = await processPayment({}); // No card data needed anymore

        if (result.success) {
            if (result.htmlContent) {
                setIyzicoHtml(result.htmlContent);
            } else {
                // Fallback if direct success (not likely for Iyzico)
                setPaymentSuccess(true);
                setPaymentResult(result.payment);
            }
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
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-slate-50'}`}>
                <div className="max-w-lg w-full text-center">
                    <div className={`${darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-xl'} rounded-3xl p-8 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>

                            <h1 className="text-3xl font-bold mb-2">Ödeme Başarılı! 🎉</h1>
                            <p className="text-gray-400 mb-6">
                                Pro üyeliğiniz aktif edildi. Tüm premium özelliklere erişebilirsiniz.
                            </p>

                            <div className={`${darkMode ? 'bg-white/5 text-left' : 'bg-slate-50 border border-slate-100 text-left'} rounded-2xl p-4 mb-6`}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>İşlem No</span>
                                    <span className="font-mono">{paymentResult?.id}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Plan</span>
                                    <span>{paymentResult?.planName}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Ödeme Tipi</span>
                                    <span>{billingOptions.find(b => b.id === paymentResult?.billingCycle)?.label}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-slate-500'}>Tutar</span>
                                    <span className="font-bold text-green-400">{paymentResult?.amount}₺</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    to="/dashboard"
                                    className={`flex-1 py-3 rounded-xl transition-colors font-medium ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
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
        <div className={`min-h-screen py-12 px-4 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Ödeme</h1>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Güvenli ödeme ile Pro'ya geçin</p>
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
                        <div className={`${darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-md'} rounded-2xl p-6`}>
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
                                            ? (darkMode ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500 bg-cyan-50')
                                            : (darkMode ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50')
                                            }`}
                                    >
                                        {option.badge && (
                                            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black">
                                                {option.badge}
                                            </span>
                                        )}
                                        <option.icon className={`w-6 h-6 mb-2 ${billingCycle === option.id ? 'text-cyan-400' : 'text-gray-500'}`} />
                                        <div className="font-bold text-sm">{option.label}</div>
                                        <div className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>{option.desc}</div>
                                        <div className="mt-2 font-bold text-lg">
                                            {selectedPlan?.price[option.id]}₺
                                            {option.id !== 'lifetime' && <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>/ay</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className={`${darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-md'} rounded-2xl p-6`}>
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-cyan-400" />
                                Ödeme Yöntemi
                            </h2>

                            <div className={`flex p-1 rounded-xl mb-6 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'card'
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                        : (darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Kredi / Banka Kartı
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'bank'
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                        : (darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                                        }`}
                                >
                                    <Landmark className="w-4 h-4" />
                                    Havale / EFT
                                </button>
                            </div>

                            {paymentMethod === 'card' ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div className={`p-4 rounded-xl border text-sm mb-4 flex items-start gap-3 ${darkMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-200' : 'bg-cyan-50 border-cyan-200 text-cyan-800'}`}>
                                        <Shield className="w-5 h-5 shrink-0" />
                                        <p>Ödemeniz <strong>Iyzico</strong> güvencesiyle işlenecektir. Aşağıdaki butona tıkladığınızda güvenli ödeme formu açılacaktır.</p>
                                    </div>

                                    {/* Iyzico Container */}
                                    <div id="iyzico-container" className="min-h-[100px]">
                                        {!iyzicoHtml && (
                                            <div className="text-center py-8">
                                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                    <CreditCard className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} />
                                                </div>
                                                <p className={`text-sm mb-6 max-w-xs mx-auto ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                                                    Devam etmek için aşağıdaki butona tıklayın.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {errors.submit && (
                                        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.submit}
                                        </div>
                                    )}

                                    {!iyzicoHtml && (
                                        <button
                                            onClick={handlePaymentInit}
                                            disabled={isProcessing}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Ödeme Formu Hazırlanıyor...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-5 h-5" />
                                                    {finalPrice}₺ Güvenli Öde
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Bank Accounts */}
                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
                                                    <span className="font-bold text-lg">GB</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Garanti Bankası</h4>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>CVniz Teknoloji A.Ş.</p>
                                                </div>
                                            </div>
                                            <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${darkMode ? 'bg-black/20' : 'bg-white border border-slate-200'}`}>
                                                <code className="text-sm font-mono text-cyan-500">TR12 0006 2000 0001 2345 6789 01</code>
                                                <button onClick={() => navigator.clipboard.writeText('TR12 0006 2000 0001 2345 6789 01')} className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'} p-1`}>
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className={`text-[10px] text-center ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                                                Açıklama kısmına <strong>{user?.email}</strong> yazmayı unutmayın.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Upload Form */}
                                    <div className={`border-t pt-6 ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <Upload className="w-4 h-4 text-purple-400" />
                                            Ödeme Bildirimi
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Gönderen Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    value={bankForm.senderName}
                                                    onChange={(e) => setBankForm({ ...bankForm, senderName: e.target.value })}
                                                    placeholder="Örn: Ahmet Yılmaz"
                                                    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'}`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Dekont Yükle</label>
                                                <div className="relative group cursor-pointer">
                                                    <input
                                                        type="file"
                                                        onChange={handleFileSelect}
                                                        accept="image/*,.pdf"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${bankForm.file
                                                        ? (darkMode ? 'border-green-500/50 bg-green-500/10' : 'border-green-500 bg-green-50')
                                                        : (darkMode ? 'border-white/10 bg-white/5 group-hover:border-white/20 group-hover:bg-white/10' : 'border-slate-300 bg-slate-50 group-hover:border-slate-400 group-hover:bg-slate-100')
                                                        }`}>
                                                        {bankForm.file ? (
                                                            <div className={`flex items-center justify-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                                <CheckCircle className="w-5 h-5" />
                                                                <span className="font-medium text-sm truncate max-w-[200px]">{bankForm.file.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className={darkMode ? 'text-gray-400' : 'text-slate-500'}>
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
                                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'}`}
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
                        <div className={`${darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-md'} rounded-2xl p-6 sticky top-24`}>
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                Sipariş Özeti
                            </h2>

                            {/* Selected Plan */}
                            <div className={`rounded-xl p-4 mb-4 border ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="w-8 h-8 text-cyan-500" />
                                    <div>
                                        <div className="font-bold">{selectedPlan?.name} Plan</div>
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                            {billingOptions.find(b => b.id === billingCycle)?.label} faturalama
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {selectedPlan?.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs">
                                            <Check className="w-3 h-3 text-green-500" />
                                            <span className={darkMode ? 'text-gray-300' : 'text-slate-700'}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="mb-4">
                                <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Kupon Kodu</label>
                                {appliedCoupon ? (
                                    <div className={`flex items-center justify-between border rounded-xl px-4 py-3 ${darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <Tag className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                            <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{appliedCoupon.code}</span>
                                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-green-600/70'}`}>
                                                ({appliedCoupon.type === 'percent' ? `%${appliedCoupon.discount}` : `${appliedCoupon.discount}₺`} indirim)
                                            </span>
                                        </div>
                                        <button onClick={removeCoupon} className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
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
                                            className={`flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className={`px-4 py-2 rounded-xl transition-colors text-sm ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                        >
                                            Uygula
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                            </div>

                            {/* Price Breakdown */}
                            <div className={`border-t pt-4 space-y-2 ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                <div className="flex justify-between text-sm">
                                    <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Plan Ücreti</span>
                                    <span>{originalPrice}₺</span>
                                </div>
                                {appliedCoupon && (
                                    <div className={`flex justify-between text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                        <span>Kupon İndirimi</span>
                                        <span>-{originalPrice - finalPrice}₺</span>
                                    </div>
                                )}
                                <div className={`flex justify-between text-lg font-bold pt-2 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                    <span>Toplam</span>
                                    <span className="text-cyan-500">{finalPrice}₺</span>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                <div className={`flex items-center justify-center gap-4 text-[10px] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
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
