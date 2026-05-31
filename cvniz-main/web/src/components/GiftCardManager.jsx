import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Gift, Send, Mail, CreditCard, Check, X, Copy, 
    ChevronRight, Sparkles, Heart, Star, Clock, CheckCircle
} from 'lucide-react'
import { useGiftCard, GIFT_PLANS } from '../context/GiftCardContext'
import { useAuth } from '../context/AuthContext'

export default function GiftCardManager() {
    const { user } = useAuth()
    const { 
        purchasedGifts, 
        receivedGifts,
        purchaseGiftCard,
        redeemGiftCard,
        checkGiftCard,
        sendGiftCardEmail,
        isProcessing
    } = useGiftCard()

    const [activeTab, setActiveTab] = useState('purchase') // purchase, redeem, history
    const [selectedPlan, setSelectedPlan] = useState('pro_3month')
    const [recipientEmail, setRecipientEmail] = useState('')
    const [senderName, setSenderName] = useState(user?.name || '')
    const [personalMessage, setPersonalMessage] = useState('')
    const [redeemCode, setRedeemCode] = useState('')
    const [message, setMessage] = useState(null)
    const [purchasedGift, setPurchasedGift] = useState(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handlePurchase = async () => {
        if (!recipientEmail) {
            setMessage({ type: 'error', text: 'Alıcı email adresi gerekli' })
            return
        }

        const result = await purchaseGiftCard(selectedPlan, recipientEmail, senderName, personalMessage)
        
        if (result.success) {
            setPurchasedGift(result.giftCard)
            setShowSuccessModal(true)
            setRecipientEmail('')
            setPersonalMessage('')
        } else {
            setMessage({ type: 'error', text: result.error })
        }
    }

    const handleRedeem = async () => {
        if (!redeemCode) {
            setMessage({ type: 'error', text: 'Hediye kodu gerekli' })
            return
        }

        const result = await redeemGiftCard(redeemCode)
        
        if (result.success) {
            setMessage({ type: 'success', text: result.message })
            setRedeemCode('')
        } else {
            setMessage({ type: 'error', text: result.error })
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setMessage({ type: 'success', text: 'Kopyalandı!' })
        setTimeout(() => setMessage(null), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-800 rounded-xl">
                {[
                    { id: 'purchase', label: 'Hediye Al', icon: Gift },
                    { id: 'redeem', label: 'Kod Kullan', icon: Sparkles },
                    { id: 'history', label: 'Geçmiş', icon: Clock }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

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
                        {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Purchase Tab */}
            {activeTab === 'purchase' && (
                <div className="space-y-6">
                    {/* Gift Plans */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.values(GIFT_PLANS).map(plan => (
                            <motion.button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative p-4 rounded-xl border transition-all text-left ${
                                    selectedPlan === plan.id
                                        ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50'
                                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                        Popüler
                                    </span>
                                )}
                                {plan.bestValue && (
                                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                        En İyi Değer
                                    </span>
                                )}
                                
                                <Gift className={`mb-2 ${selectedPlan === plan.id ? 'text-pink-400' : 'text-gray-500'}`} size={24} />
                                <h4 className="text-white font-semibold">{plan.name}</h4>
                                <div className="mt-2">
                                    <span className="text-gray-500 line-through text-sm">₺{plan.price}</span>
                                    <span className="text-2xl font-bold text-white ml-2">₺{plan.discountedPrice}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Alıcının Email Adresi *</label>
                            <input
                                type="email"
                                value={recipientEmail}
                                onChange={(e) => setRecipientEmail(e.target.value)}
                                placeholder="ornek@email.com"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Gönderen Adı</label>
                            <input
                                type="text"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                placeholder="Adınız"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Kişisel Mesaj (opsiyonel)</label>
                            <textarea
                                value={personalMessage}
                                onChange={(e) => setPersonalMessage(e.target.value)}
                                placeholder="Sevgili arkadaşım, bu hediyeyi senin için aldım..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                            />
                        </div>

                        <motion.button
                            onClick={handlePurchase}
                            disabled={isProcessing || !recipientEmail}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    <Gift size={20} />
                                    ₺{GIFT_PLANS[selectedPlan].discountedPrice} - Hediye Kartı Al
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Redeem Tab */}
            {activeTab === 'redeem' && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                            <Sparkles size={40} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Hediye Kartı Kullan</h3>
                        <p className="text-gray-400">Hediye kodunuzu girerek Premium'a geçin</p>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                        <input
                            type="text"
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                            placeholder="GIFT-XXXX-XXXX-XXXX-XXXX"
                            className="w-full px-6 py-4 bg-gray-900 border-2 border-gray-700 rounded-xl text-white text-center text-lg font-mono tracking-wider placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                        />

                        <motion.button
                            onClick={handleRedeem}
                            disabled={!redeemCode}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            Hediyeyi Etkinleştir
                        </motion.button>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    {/* Sent Gifts */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Send size={20} className="text-pink-400" />
                            Gönderilen Hediyeler ({purchasedGifts.length})
                        </h3>
                        
                        {purchasedGifts.length === 0 ? (
                            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
                                <Gift className="mx-auto mb-3 text-gray-500" size={40} />
                                <p className="text-gray-400">Henüz hediye göndermediniz</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {purchasedGifts.map(gift => (
                                    <div key={gift.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{GIFT_PLANS[gift.giftPlanId]?.name}</p>
                                                <p className="text-gray-400 text-sm">
                                                    <Mail size={14} className="inline mr-1" />
                                                    {gift.recipientEmail}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    gift.status === 'redeemed' 
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                    {gift.status === 'redeemed' ? 'Kullanıldı' : 'Bekliyor'}
                                                </span>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {new Date(gift.createdAt).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {gift.status === 'active' && (
                                            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                                                <code className="text-cyan-400 text-sm bg-gray-900 px-3 py-1 rounded">
                                                    {gift.code}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(gift.code)}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Received Gifts */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Heart size={20} className="text-red-400" />
                            Alınan Hediyeler ({receivedGifts.length})
                        </h3>
                        
                        {receivedGifts.length === 0 ? (
                            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
                                <Heart className="mx-auto mb-3 text-gray-500" size={40} />
                                <p className="text-gray-400">Henüz hediye almadınız</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {receivedGifts.map(gift => (
                                    <div key={gift.id} className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/30">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{GIFT_PLANS[gift.giftPlanId]?.name}</p>
                                                <p className="text-gray-400 text-sm">
                                                    {gift.purchaserName} tarafından gönderildi
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <CheckCircle className="text-green-400 inline" size={20} />
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {new Date(gift.redeemedAt).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && purchasedGift && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-gradient-to-br from-pink-900/50 to-purple-900/50 rounded-2xl p-8 border border-pink-500/30 text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center"
                            >
                                <Gift size={48} className="text-white" />
                            </motion.div>

                            <h3 className="text-2xl font-bold text-white mb-2">🎉 Hediye Hazır!</h3>
                            <p className="text-gray-300 mb-6">
                                Hediye kartı {purchasedGift.recipientEmail} adresine gönderilecek.
                            </p>

                            <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
                                <p className="text-gray-400 text-sm mb-2">Hediye Kodu</p>
                                <div className="flex items-center justify-center gap-3">
                                    <code className="text-xl font-mono text-cyan-400">{purchasedGift.code}</code>
                                    <button
                                        onClick={() => copyToClipboard(purchasedGift.code)}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <Copy size={18} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => sendGiftCardEmail(purchasedGift.id)}
                                    className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} />
                                    Email Gönder
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false)
                                        setPurchasedGift(null)
                                    }}
                                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Kapat
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
