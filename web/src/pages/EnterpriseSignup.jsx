import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEnterprise, ENTERPRISE_PLANS } from '../context/EnterpriseContext'
import {
    Building2, Check, ArrowLeft, ArrowRight, Users, Crown,
    Zap, Shield, Headphones, BarChart3, Globe, Lock
} from 'lucide-react'

export default function EnterpriseSignup() {
    const { user } = useAuth()
    const { createCompany } = useEnterprise() || {}
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [selectedPlan, setSelectedPlan] = useState('business')
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        size: '10-50',
        website: '',
        phone: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!formData.name || !createCompany) return

        setLoading(true)

        const result = createCompany({
            ...formData,
            plan: selectedPlan
        })

        if (result.success) {
            setStep(3)
        }

        setLoading(false)
    }

    const plans = Object.values(ENTERPRISE_PLANS)

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Ana Sayfaya Dön
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                        <Building2 className="w-8 h-8 text-cyan-400" />
                        Kurumsal Hesap Oluştur
                    </h1>
                    <p className="text-gray-400 mt-2">Şirketiniz için CVniz'ı hemen kullanmaya başlayın</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-white/10 text-gray-500'
                                }`}>
                                {step > s ? <Check className="w-5 h-5" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`w-20 h-1 mx-2 rounded ${step > s ? 'bg-cyan-500' : 'bg-white/10'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Select Plan */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            {plans.map(plan => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`p-6 rounded-2xl text-left transition-all ${selectedPlan === plan.id
                                            ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 scale-105'
                                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    {plan.id === 'business' && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 font-medium mb-2 inline-block">
                                            En Popüler
                                        </span>
                                    )}
                                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                    <div className="text-3xl font-bold text-cyan-400 mb-4">
                                        {plan.price ? `₺${plan.price}` : 'Özel Fiyat'}
                                        {plan.price && <span className="text-sm text-gray-400">/ay</span>}
                                    </div>
                                    <div className="text-sm text-gray-400 mb-4">
                                        {plan.seats === 999 ? 'Sınırsız' : plan.seats} kullanıcıya kadar
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-300">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => setStep(2)}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center gap-2"
                            >
                                Devam Et
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Company Info */}
                {step === 2 && (
                    <div className="max-w-xl mx-auto">
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-xl font-bold mb-6">Şirket Bilgileri</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Şirket Adı *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                        placeholder="Şirket adınız"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Sektör</label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="technology">Teknoloji</option>
                                        <option value="finance">Finans</option>
                                        <option value="healthcare">Sağlık</option>
                                        <option value="education">Eğitim</option>
                                        <option value="retail">Perakende</option>
                                        <option value="manufacturing">Üretim</option>
                                        <option value="other">Diğer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Şirket Büyüklüğü</label>
                                    <select
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                    >
                                        <option value="1-10">1-10 çalışan</option>
                                        <option value="10-50">10-50 çalışan</option>
                                        <option value="50-200">50-200 çalışan</option>
                                        <option value="200-500">200-500 çalışan</option>
                                        <option value="500+">500+ çalışan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Website</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                        placeholder="https://sirketiniz.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Telefon</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-cyan-500 outline-none"
                                        placeholder="+90 5XX XXX XX XX"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                >
                                    Geri
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.name || loading}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="max-w-xl mx-auto text-center">
                        <div className="glass-card rounded-2xl p-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Kurumsal Hesabınız Hazır!</h2>
                            <p className="text-gray-400 mb-6">
                                {formData.name} için kurumsal hesabınız başarıyla oluşturuldu.
                            </p>

                            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-6 text-left">
                                <h4 className="font-medium mb-2">Seçilen Plan: {ENTERPRISE_PLANS[selectedPlan].name}</h4>
                                <p className="text-sm text-gray-400">
                                    {ENTERPRISE_PLANS[selectedPlan].seats} kullanıcıya kadar •{' '}
                                    {ENTERPRISE_PLANS[selectedPlan].price
                                        ? `₺${ENTERPRISE_PLANS[selectedPlan].price}/ay`
                                        : 'Özel fiyatlandırma'
                                    }
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/enterprise')}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
                                >
                                    Panele Git
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                >
                                    CV Oluştur
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features */}
                {step === 1 && (
                    <div className="mt-12 grid md:grid-cols-4 gap-4">
                        <div className="glass-card rounded-xl p-4 text-center">
                            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                            <div className="font-medium">Ekip Yönetimi</div>
                            <div className="text-sm text-gray-500">Merkezi kullanıcı kontrolü</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <div className="font-medium">Raporlama</div>
                            <div className="text-sm text-gray-500">Detaylı kullanım analizi</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <div className="font-medium">Güvenlik</div>
                            <div className="text-sm text-gray-500">SSO & 2FA desteği</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 text-center">
                            <Headphones className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                            <div className="font-medium">Destek</div>
                            <div className="text-sm text-gray-500">Öncelikli müşteri hizmeti</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

