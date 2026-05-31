import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    CreditCard, Calendar, AlertTriangle, Check, X, Pause, Play, 
    RefreshCw, ChevronRight, Crown, Clock, Zap, Shield, Settings,
    ArrowUpRight, ArrowDownRight, Snowflake, Ban
} from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import { usePayment, PLANS } from '../context/PaymentContext'
import { useAuth } from '../context/AuthContext'

export default function SubscriptionManager() {
    const { user } = useAuth()
    const { 
        subscription, 
        loading,
        changePlan,
        cancelSubscription,
        freezeSubscription,
        unfreezeSubscription,
        toggleAutoRenew,
        getRemainingDays
    } = useSubscription()

    const [activeTab, setActiveTab] = useState('overview')
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showFreezeModal, setShowFreezeModal] = useState(false)
    const [showChangePlanModal, setShowChangePlanModal] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [freezeMonths, setFreezeMonths] = useState(1)
    const [freezeReason, setFreezeReason] = useState('')
    const [selectedNewPlan, setSelectedNewPlan] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [message, setMessage] = useState(null)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!subscription) {
        return (
            <div className="bg-gray-800/50 rounded-2xl p-8 text-center border border-gray-700">
                <Crown className="mx-auto mb-4 text-gray-500" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">Henüz aboneliğiniz yok</h3>
                <p className="text-gray-400 mb-6">Premium özelliklere erişmek için bir plan seçin</p>
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all">
                    Planları İncele
                </button>
            </div>
        )
    }

    const currentPlan = PLANS[subscription.planId]
    const remainingDays = getRemainingDays()
    const statusColors = {
        active: 'bg-green-500/10 text-green-400 border-green-500/30',
        frozen: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        cancelled: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        expired: 'bg-red-500/10 text-red-400 border-red-500/30'
    }

    const statusLabels = {
        active: 'Aktif',
        frozen: 'Donduruldu',
        cancelled: 'İptal Edildi',
        expired: 'Süresi Doldu'
    }

    const handleAction = async (action, ...args) => {
        setActionLoading(true)
        setMessage(null)

        try {
            let result
            switch (action) {
                case 'cancel':
                    result = await cancelSubscription(cancelReason)
                    setShowCancelModal(false)
                    break
                case 'freeze':
                    result = await freezeSubscription(freezeMonths, freezeReason)
                    setShowFreezeModal(false)
                    break
                case 'unfreeze':
                    result = await unfreezeSubscription()
                    break
                case 'toggleAutoRenew':
                    result = await toggleAutoRenew()
                    break
                case 'changePlan':
                    result = await changePlan(selectedNewPlan, subscription.billingCycle)
                    setShowChangePlanModal(false)
                    break
            }

            if (result.success) {
                setMessage({ type: 'success', text: result.message })
            } else {
                setMessage({ type: 'error', text: result.error })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Bir hata oluştu' })
        } finally {
            setActionLoading(false)
        }
    }

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
                        {message.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subscription Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <Crown size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{currentPlan?.name} Plan</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[subscription.status]}`}>
                                        {statusLabels[subscription.status]}
                                    </span>
                                    {subscription.autoRenew && (
                                        <span className="text-gray-500 text-sm flex items-center gap-1">
                                            <RefreshCw size={14} />
                                            Otomatik Yenileme Açık
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {remainingDays !== null && (
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Kalan Süre</p>
                                <p className="text-2xl font-bold text-white">{remainingDays} gün</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-700 border-b border-gray-700">
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-sm">Plan</p>
                        <p className="text-white font-semibold">{currentPlan?.name}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-sm">Dönem</p>
                        <p className="text-white font-semibold capitalize">{subscription.billingCycle === 'gift' ? 'Hediye' : subscription.billingCycle === 'lifetime' ? 'Ömür Boyu' : subscription.billingCycle === 'yearly' ? 'Yıllık' : 'Aylık'}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-sm">Başlangıç</p>
                        <p className="text-white font-semibold">{new Date(subscription.startedAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-sm">Bitiş</p>
                        <p className="text-white font-semibold">
                            {subscription.expiresAt 
                                ? new Date(subscription.expiresAt).toLocaleDateString('tr-TR')
                                : 'Süresiz'
                            }
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Change Plan */}
                        <button
                            onClick={() => setShowChangePlanModal(true)}
                            disabled={subscription.status !== 'active'}
                            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                            <ArrowUpRight className="text-cyan-400 mb-2" size={20} />
                            <p className="text-white font-medium">Plan Değiştir</p>
                            <p className="text-gray-500 text-sm">Yükselt veya düşür</p>
                        </button>

                        {/* Freeze/Unfreeze */}
                        {subscription.status === 'frozen' ? (
                            <button
                                onClick={() => handleAction('unfreeze')}
                                disabled={actionLoading}
                                className="p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all text-left"
                            >
                                <Play className="text-blue-400 mb-2" size={20} />
                                <p className="text-white font-medium">Devam Ettir</p>
                                <p className="text-gray-500 text-sm">Aboneliği aktifleştir</p>
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowFreezeModal(true)}
                                disabled={subscription.status !== 'active'}
                                className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                            >
                                <Snowflake className="text-blue-400 mb-2" size={20} />
                                <p className="text-white font-medium">Dondur</p>
                                <p className="text-gray-500 text-sm">1-3 ay arası</p>
                            </button>
                        )}

                        {/* Auto Renew Toggle */}
                        <button
                            onClick={() => handleAction('toggleAutoRenew')}
                            disabled={actionLoading || subscription.billingCycle === 'lifetime'}
                            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                            <RefreshCw className={`mb-2 ${subscription.autoRenew ? 'text-green-400' : 'text-gray-400'}`} size={20} />
                            <p className="text-white font-medium">Oto Yenileme</p>
                            <p className="text-gray-500 text-sm">{subscription.autoRenew ? 'Açık' : 'Kapalı'}</p>
                        </button>

                        {/* Cancel */}
                        <button
                            onClick={() => setShowCancelModal(true)}
                            disabled={subscription.status === 'cancelled' || subscription.status === 'expired'}
                            className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                        >
                            <Ban className="text-red-400 mb-2" size={20} />
                            <p className="text-white font-medium">İptal Et</p>
                            <p className="text-gray-500 text-sm">Dönem sonunda</p>
                        </button>
                    </div>
                </div>

                {/* Frozen Info */}
                {subscription.status === 'frozen' && (
                    <div className="mx-6 mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Snowflake className="text-blue-400" size={24} />
                            <div>
                                <p className="text-white font-medium">Abonelik Donduruldu</p>
                                <p className="text-gray-400 text-sm">
                                    {new Date(subscription.frozenUntil).toLocaleDateString('tr-TR')} tarihine kadar donduruldu
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowCancelModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-gray-700"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="text-red-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Aboneliği İptal Et</h3>
                                    <p className="text-gray-400 text-sm">Bu işlem geri alınamaz</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <p className="text-gray-300">
                                    Aboneliğiniz dönem sonunda ({subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('tr-TR') : 'bugün'}) iptal edilecektir.
                                </p>
                                
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">İptal sebebi (opsiyonel)</label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Neden iptal ediyorsunuz?"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={() => handleAction('cancel')}
                                    disabled={actionLoading}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'İşleniyor...' : 'İptal Et'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Freeze Modal */}
            <AnimatePresence>
                {showFreezeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowFreezeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-gray-700"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Snowflake className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Aboneliği Dondur</h3>
                                    <p className="text-gray-400 text-sm">Geçici olarak askıya al</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Dondurma süresi</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(month => (
                                            <button
                                                key={month}
                                                onClick={() => setFreezeMonths(month)}
                                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                                    freezeMonths === month
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                }`}
                                            >
                                                {month} Ay
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Sebep (opsiyonel)</label>
                                    <textarea
                                        value={freezeReason}
                                        onChange={(e) => setFreezeReason(e.target.value)}
                                        placeholder="Neden dondurmak istiyorsunuz?"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                        rows={2}
                                    />
                                </div>

                                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-blue-300 text-sm">
                                        💡 Abonelik süresi dondurma kadar uzatılacaktır.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFreezeModal(false)}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={() => handleAction('freeze')}
                                    disabled={actionLoading}
                                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'İşleniyor...' : 'Dondur'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Change Plan Modal */}
            <AnimatePresence>
                {showChangePlanModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setShowChangePlanModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 border border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Plan Değiştir</h3>

                            <div className="space-y-3 mb-6">
                                {Object.values(PLANS).filter(p => p.id !== 'free' && p.id !== subscription.planId).map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedNewPlan(plan.id)}
                                        className={`w-full p-4 rounded-xl border transition-all text-left ${
                                            selectedNewPlan === plan.id
                                                ? 'bg-cyan-500/10 border-cyan-500/50'
                                                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-semibold">{plan.name}</h4>
                                                <p className="text-gray-400 text-sm">{plan.features.slice(0, 2).join(' • ')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold">₺{plan.price.monthly}/ay</p>
                                                {plan.price.monthly > currentPlan.price.monthly ? (
                                                    <span className="text-green-400 text-sm flex items-center gap-1">
                                                        <ArrowUpRight size={14} /> Yükseltme
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-400 text-sm flex items-center gap-1">
                                                        <ArrowDownRight size={14} /> Düşürme
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowChangePlanModal(false)}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={() => handleAction('changePlan')}
                                    disabled={actionLoading || !selectedNewPlan}
                                    className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'İşleniyor...' : 'Değiştir'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
