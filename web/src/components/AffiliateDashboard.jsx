import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Users, DollarSign, TrendingUp, Link, Copy, Share2, 
    BarChart3, Award, ChevronRight, ExternalLink, Check,
    Wallet, Clock, ArrowUpRight, Zap, Gift, Shield,
    Twitter, Instagram, Youtube, Globe, Mail
} from 'lucide-react'
import { useAffiliate, COMMISSION_TIERS } from '../context/AffiliateContext'
import { useAuth } from '../context/AuthContext'

export default function AffiliateDashboard() {
    const { user } = useAuth()
    const { 
        affiliateData,
        isAffiliate,
        loading,
        applyForAffiliate,
        getAffiliateLink,
        requestWithdrawal,
        createCustomCoupon,
        getAnalytics,
        calculateTier
    } = useAffiliate()

    const [activeTab, setActiveTab] = useState('overview')
    const [showApplyModal, setShowApplyModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showCouponModal, setShowCouponModal] = useState(false)
    const [applicationData, setApplicationData] = useState({
        brandName: '',
        website: '',
        socialMedia: { twitter: '', instagram: '', youtube: '' },
        audienceSize: '',
        niche: '',
        paymentMethod: 'bank',
        paymentDetails: { iban: '', bankName: '', accountHolder: '' }
    })
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [couponDiscount, setCouponDiscount] = useState(15)
    const [message, setMessage] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [selectedPeriod, setSelectedPeriod] = useState(30)

    useEffect(() => {
        if (affiliateData) {
            setAnalytics(getAnalytics(selectedPeriod))
        }
    }, [affiliateData, selectedPeriod])

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setMessage({ type: 'success', text: 'Kopyalandı!' })
        setTimeout(() => setMessage(null), 2000)
    }

    const handleApply = async () => {
        const result = await applyForAffiliate(applicationData)
        if (result.success) {
            setMessage({ type: 'success', text: result.message })
            setShowApplyModal(false)
        } else {
            setMessage({ type: 'error', text: result.error })
        }
    }

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount)
        if (isNaN(amount) || amount <= 0) {
            setMessage({ type: 'error', text: 'Geçerli bir tutar girin' })
            return
        }

        const result = await requestWithdrawal(amount)
        if (result.success) {
            setMessage({ type: 'success', text: result.message })
            setShowWithdrawModal(false)
            setWithdrawAmount('')
        } else {
            setMessage({ type: 'error', text: result.error })
        }
    }

    const handleCreateCoupon = async () => {
        const result = await createCustomCoupon(couponDiscount)
        if (result.success) {
            setMessage({ type: 'success', text: result.message })
            setShowCouponModal(false)
        } else {
            setMessage({ type: 'error', text: result.error })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // Not an affiliate - show apply CTA
    if (!isAffiliate) {
        return (
            <div className="space-y-8">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-purple-900/50 via-gray-900 to-cyan-900/50 rounded-3xl p-8 md:p-12 overflow-hidden border border-purple-500/30">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Zap size={16} />
                            Affiliate Program
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Paylaş ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Kazan</span>
                        </h1>
                        
                        <p className="text-xl text-gray-300 mb-8">
                            Her satıştan %30'a kadar komisyon kazanın. Sınırsız kazanç potansiyeli!
                        </p>

                        <motion.button
                            onClick={() => setShowApplyModal(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 flex items-center gap-3"
                        >
                            Hemen Başvur
                            <ChevronRight size={20} />
                        </motion.button>
                    </div>

                    {/* Decorative */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
                    <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl" />
                </div>

                {/* Tier Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    {Object.values(COMMISSION_TIERS).map((tier, i) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
                        >
                            <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${tier.color}20` }}
                            >
                                <Award size={24} style={{ color: tier.color }} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3">
                                %{tier.commission}
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                {tier.minSales}+ satış
                            </p>
                            <ul className="space-y-2">
                                {tier.benefits.map((benefit, j) => (
                                    <li key={j} className="text-gray-300 text-sm flex items-center gap-2">
                                        <Check size={14} className="text-green-400" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Apply Modal */}
                <AnimatePresence>
                    {showApplyModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                            onClick={(e) => e.target === e.currentTarget && setShowApplyModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                            >
                                <h3 className="text-2xl font-bold text-white mb-6">Affiliate Başvurusu</h3>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Marka/Kanal Adı</label>
                                        <input
                                            type="text"
                                            value={applicationData.brandName}
                                            onChange={(e) => setApplicationData({ ...applicationData, brandName: e.target.value })}
                                            placeholder="Örn: TechReview"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Website</label>
                                        <input
                                            type="url"
                                            value={applicationData.website}
                                            onChange={(e) => setApplicationData({ ...applicationData, website: e.target.value })}
                                            placeholder="https://example.com"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-400 text-sm mb-2">Sosyal Medya Hesapları</label>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <div className="relative">
                                            <Twitter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                value={applicationData.socialMedia.twitter}
                                                onChange={(e) => setApplicationData({ 
                                                    ...applicationData, 
                                                    socialMedia: { ...applicationData.socialMedia, twitter: e.target.value }
                                                })}
                                                placeholder="@username"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Instagram size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                value={applicationData.socialMedia.instagram}
                                                onChange={(e) => setApplicationData({ 
                                                    ...applicationData, 
                                                    socialMedia: { ...applicationData.socialMedia, instagram: e.target.value }
                                                })}
                                                placeholder="@username"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Youtube size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                value={applicationData.socialMedia.youtube}
                                                onChange={(e) => setApplicationData({ 
                                                    ...applicationData, 
                                                    socialMedia: { ...applicationData.socialMedia, youtube: e.target.value }
                                                })}
                                                placeholder="Kanal adı"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Takipçi/Kitle Sayısı</label>
                                        <select
                                            value={applicationData.audienceSize}
                                            onChange={(e) => setApplicationData({ ...applicationData, audienceSize: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        >
                                            <option value="">Seçin</option>
                                            <option value="1k-10k">1K - 10K</option>
                                            <option value="10k-50k">10K - 50K</option>
                                            <option value="50k-100k">50K - 100K</option>
                                            <option value="100k+">100K+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Niş/Kategori</label>
                                        <select
                                            value={applicationData.niche}
                                            onChange={(e) => setApplicationData({ ...applicationData, niche: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                        >
                                            <option value="">Seçin</option>
                                            <option value="career">Kariyer & İş</option>
                                            <option value="tech">Teknoloji</option>
                                            <option value="education">Eğitim</option>
                                            <option value="lifestyle">Yaşam Tarzı</option>
                                            <option value="other">Diğer</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                                    <h4 className="text-white font-medium mb-3">Ödeme Bilgileri</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-gray-400 text-sm mb-2">IBAN</label>
                                            <input
                                                type="text"
                                                value={applicationData.paymentDetails.iban}
                                                onChange={(e) => setApplicationData({ 
                                                    ...applicationData, 
                                                    paymentDetails: { ...applicationData.paymentDetails, iban: e.target.value }
                                                })}
                                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Banka</label>
                                            <input
                                                type="text"
                                                value={applicationData.paymentDetails.bankName}
                                                onChange={(e) => setApplicationData({ 
                                                    ...applicationData, 
                                                    paymentDetails: { ...applicationData.paymentDetails, bankName: e.target.value }
                                                })}
                                                placeholder="Banka adı"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Hesap Sahibi</label>
                                            <input
                                                type="text"
                                                value={applicationData.paymentDetails.accountHolder}
                                                onChange={(e) => setApplicationData({ 
                                                    ...applicationData, 
                                                    paymentDetails: { ...applicationData.paymentDetails, accountHolder: e.target.value }
                                                })}
                                                placeholder="Ad Soyad"
                                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowApplyModal(false)}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Başvur
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Affiliate Dashboard
    const currentTier = calculateTier(affiliateData.totalSales)
    const nextTier = Object.values(COMMISSION_TIERS).find(t => t.minSales > currentTier.minSales)
    const progressToNext = nextTier 
        ? ((affiliateData.totalSales - currentTier.minSales) / (nextTier.minSales - currentTier.minSales)) * 100
        : 100

    return (
        <div className="space-y-6">
            {/* Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-lg flex items-center gap-3 ${
                            message.type === 'success' 
                                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                        }`}
                    >
                        <Check size={20} />
                        <span>{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-5 border border-green-500/30">
                    <DollarSign className="text-green-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Toplam Kazanç</p>
                    <p className="text-2xl font-bold text-white">₺{affiliateData.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/30">
                    <Clock className="text-amber-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Bekleyen</p>
                    <p className="text-2xl font-bold text-white">₺{affiliateData.pendingEarnings.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/30">
                    <Users className="text-purple-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Toplam Satış</p>
                    <p className="text-2xl font-bold text-white">{affiliateData.totalSales}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/30">
                    <TrendingUp className="text-cyan-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Tıklama</p>
                    <p className="text-2xl font-bold text-white">{affiliateData.totalClicks}</p>
                </div>
            </div>

            {/* Tier & Link */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Current Tier */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${currentTier.color}20` }}
                            >
                                <Award size={24} style={{ color: currentTier.color }} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{currentTier.name} Tier</h3>
                                <p className="text-gray-400">%{currentTier.commission} Komisyon</p>
                            </div>
                        </div>
                    </div>

                    {nextTier && (
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-400">Sonraki: {nextTier.name}</span>
                                <span className="text-cyan-400">{affiliateData.totalSales}/{nextTier.minSales} satış</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressToNext}%` }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Affiliate Link */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Link size={20} className="text-cyan-400" />
                        Affiliate Link
                    </h3>
                    
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={getAffiliateLink()}
                            readOnly
                            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-sm"
                        />
                        <button
                            onClick={() => copyToClipboard(getAffiliateLink())}
                            className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                        >
                            <Copy size={18} />
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mt-3">
                        Kod: <code className="text-cyan-400">{affiliateData.code}</code>
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <button
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={affiliateData.pendingEarnings < 100}
                    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                    <Wallet className="text-green-400" size={24} />
                    <div className="text-left">
                        <p className="text-white font-medium">Para Çek</p>
                        <p className="text-gray-500 text-sm">Min. ₺100</p>
                    </div>
                </button>

                <button
                    onClick={() => setShowCouponModal(true)}
                    disabled={currentTier.minSales < COMMISSION_TIERS.silver.minSales}
                    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                    <Gift className="text-pink-400" size={24} />
                    <div className="text-left">
                        <p className="text-white font-medium">Kupon Oluştur</p>
                        <p className="text-gray-500 text-sm">Silver+ gerekli</p>
                    </div>
                </button>

                <button
                    onClick={() => {
                        const shareData = {
                            title: 'CVniz - Profesyonel CV Oluşturucu',
                            text: `CVniz ile profesyonel CV'nizi oluşturun! Benim referans kodum: ${affiliateData.code}`,
                            url: getAffiliateLink()
                        }
                        if (navigator.share) {
                            navigator.share(shareData)
                        } else {
                            copyToClipboard(getAffiliateLink())
                        }
                    }}
                    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all flex items-center gap-3"
                >
                    <Share2 className="text-blue-400" size={24} />
                    <div className="text-left">
                        <p className="text-white font-medium">Paylaş</p>
                        <p className="text-gray-500 text-sm">Sosyal medyada</p>
                    </div>
                </button>
            </div>

            {/* Analytics Chart */}
            {analytics && (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <BarChart3 size={20} className="text-cyan-400" />
                            Performans
                        </h3>
                        <div className="flex gap-2">
                            {[7, 30, 90].map(period => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                                        selectedPeriod === period
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                >
                                    {period} Gün
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="h-48 flex items-end justify-between gap-1">
                        {analytics.dailyData.slice(-14).map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(4, (day.revenue / (Math.max(...analytics.dailyData.map(d => d.revenue)) || 1)) * 100)}%` }}
                                    className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
                                    title={`₺${day.revenue.toFixed(2)}`}
                                />
                                <span className="text-gray-500 text-xs mt-2">
                                    {new Date(day.date).getDate()}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{analytics.clicks}</p>
                            <p className="text-gray-500 text-sm">Tıklama</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{analytics.signups}</p>
                            <p className="text-gray-500 text-sm">Kayıt</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{analytics.sales}</p>
                            <p className="text-gray-500 text-sm">Satış</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">%{analytics.conversionRate}</p>
                            <p className="text-gray-500 text-sm">Dönüşüm</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            <AnimatePresence>
                {showWithdrawModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={(e) => e.target === e.currentTarget && setShowWithdrawModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Para Çekme Talebi</h3>

                            <div className="mb-6">
                                <p className="text-gray-400 mb-2">Mevcut Bakiye</p>
                                <p className="text-3xl font-bold text-green-400">₺{affiliateData.pendingEarnings.toFixed(2)}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm mb-2">Çekim Tutarı (TL)</label>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="100"
                                    min="100"
                                    max={affiliateData.pendingEarnings}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-xl"
                                />
                                <p className="text-gray-500 text-sm mt-2">Minimum: ₺100</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Çekim Talebi Gönder
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Coupon Modal */}
            <AnimatePresence>
                {showCouponModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={(e) => e.target === e.currentTarget && setShowCouponModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Özel Kupon Oluştur</h3>

                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm mb-2">İndirim Oranı (%)</label>
                                <input
                                    type="range"
                                    value={couponDiscount}
                                    onChange={(e) => setCouponDiscount(parseInt(e.target.value))}
                                    min="5"
                                    max="25"
                                    step="5"
                                    className="w-full"
                                />
                                <div className="flex justify-between text-gray-400 text-sm mt-1">
                                    <span>5%</span>
                                    <span className="text-xl font-bold text-cyan-400">{couponDiscount}%</span>
                                    <span>25%</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-800 rounded-lg mb-6">
                                <p className="text-gray-400 text-sm mb-1">Oluşturulacak Kupon Kodu</p>
                                <code className="text-lg text-cyan-400">{affiliateData.code}{couponDiscount}</code>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCouponModal(false)}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleCreateCoupon}
                                    className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Kupon Oluştur
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

