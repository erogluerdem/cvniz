// Dashboard Components - Modular Structure
import { useState, useEffect } from 'react'
import {
    Bell, X, User, Mail, Lock, Camera, Sparkles, Check, Gift, Download, AlertCircle,
    Trophy, Play, ArrowRight, Zap, FileText, Crown, Share2, Columns, LayoutTemplate, Bot
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ============ NOTIFICATION PANEL ============
export function NotificationPanel({ isOpen, onClose, notifications = [] }) {
    if (!isOpen) return null

    return (
        <div className="absolute top-full right-0 mt-2 w-80 glass-card rounded-xl overflow-hidden z-50 animate-scale-in">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold">Bildirimler</h3>
                <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 dark:text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Henüz bildirim yok</p>
                    </div>
                ) : (
                    notifications.map((notif, i) => (
                        <div key={i} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-green-500/20' : notif.type === 'warning' ? 'bg-amber-500/20' : 'bg-cyan-500/20'}`}>
                                    {notif.icon}
                                </div>
                                <div>
                                    <p className="text-sm">{notif.message}</p>
                                    <p className="text-xs text-slate-600 dark:text-gray-500 mt-1">{notif.time}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-3 border-t border-white/10">
                <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    Tümünü Okundu İşaretle
                </button>
            </div>
        </div>
    )
}

// ============ PROFILE MODAL ============
export function ProfileModal({ isOpen, onClose, user, onSave, savedProfile }) {
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [phone, setPhone] = useState(savedProfile?.phone || '')
    const [location, setLocation] = useState(savedProfile?.location || '')
    const [title, setTitle] = useState(savedProfile?.title || '')
    const [linkedin, setLinkedin] = useState(savedProfile?.linkedin || '')
    const [website, setWebsite] = useState(savedProfile?.website || '')
    const [summary, setSummary] = useState(savedProfile?.summary || '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [birthDate, setBirthDate] = useState(user?.birthDate || '')
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        if (savedProfile) {
            setPhone(savedProfile.phone || '')
            setLocation(savedProfile.location || '')
            setTitle(savedProfile.title || '')
            setLinkedin(savedProfile.linkedin || '')
            setWebsite(savedProfile.website || '')
            setSummary(savedProfile.summary || '')
        }
    }, [savedProfile])

    const handleSave = () => {
        const profileData = {
            fullName: name,
            email,
            phone,
            location,
            title,
            linkedin,
            website,
            summary,
            birthDate
        }
        onSave(profileData)
        setSaveSuccess(true)
        setTimeout(() => {
            setSaveSuccess(false)
            onClose()
        }, 1500)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 max-w-lg w-full animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-cyan-500/10 ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Profili Düzenle</h3>
                    <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Avatar */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-3 relative group">
                        <span className="text-2xl font-bold">{name?.[0] || 'U'}</span>
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 dark:text-gray-300">
                        Bu bilgiler yeni CV oluştururken <span className="text-cyan-400 font-bold">otomatik doldurulur</span>. Tek seferlik kaydedin, her CV'de kullanın!
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Ad Soyad</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-gray-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field pl-9 text-sm py-2"
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Ünvan</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field text-sm py-2"
                                placeholder="Yazılım Mühendisi"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-9 text-sm py-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Telefon</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-field text-sm py-2"
                                placeholder="+90 555 123 45 67"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Konum</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input-field text-sm py-2"
                            placeholder="İstanbul, Türkiye"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">LinkedIn</label>
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="input-field text-sm py-2"
                                placeholder="linkedin.com/in/username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Website</label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="input-field text-sm py-2"
                                placeholder="www.siteadı.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Profesyonel Özet</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={3}
                            className="input-field text-sm py-2 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Doğum Tarihi</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="input-field text-sm py-2"
                        />
                    </div>

                    {/* Password Section */}
                    <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-sm font-semibold mb-3">Şifre Değiştir (isteğe bağlı)</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-gray-500" />
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Mevcut şifre"
                                    className="input-field pl-9 text-sm py-2"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-gray-500" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Yeni şifre"
                                    className="input-field pl-9 text-sm py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
                        Vazgeç
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveSuccess}
                        className={`flex-1 py-3 justify-center flex items-center gap-2 rounded-xl font-bold transition-all ${saveSuccess ? 'bg-green-500 text-slate-900 dark:text-white' : 'btn-premium'}`}
                    >
                        {saveSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                Kaydedildi!
                            </>
                        ) : (
                            'Profili Kaydet'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============ ONBOARDING TOUR ============
export function OnboardingTour({ isOpen, onClose, step, setStep }) {
    const steps = [
        { title: 'CVniz\'e Hoş Geldiniz! 🎉', desc: 'Saniyeler içinde profesyonel bir özgeçmiş oluşturmaya hazır mısınız? Kariyer yolculuğunuzda size eşlik edecek en güçlü araca hoş geldiniz.', icon: <Sparkles className="w-16 h-16 text-white" />, color: 'from-blue-500 to-cyan-400' },
        { title: 'Zahmetsiz CV Oluşturma', desc: 'Modern editörümüzle bilgilerinizi kolayca girin. Tasarım ve hizalama ile uğraşmayın, gerisini algoritmalarımız halletsin.', icon: <FileText className="w-16 h-16 text-white" />, color: 'from-purple-500 to-indigo-500' },
        { title: 'Premium Şablonlar', desc: 'Dünya standartlarında tasarlanmış 65+ şablon arasından sektörünüze en uygun olanı seçin ve tek tıkla uygulayın.', icon: <LayoutTemplate className="w-16 h-16 text-white" />, color: 'from-amber-500 to-orange-500' },
        { title: 'Yapay Zeka Destekli', desc: 'Kendinizi nasıl ifade edeceğinizi bilemiyor musunuz? Tıkandığınız yerde yapay zeka asistanımız sizin yerinize yazsın.', icon: <Bot className="w-16 h-16 text-white" />, color: 'from-emerald-400 to-teal-500' },
        { title: 'Başarıya Hazırsınız!', desc: 'Artık İK uzmanlarının dikkatini çekecek, mülakatlara davet edilme şansınızı artıracak o mükemmel CV\'yi oluşturabilirsiniz.', icon: <Trophy className="w-16 h-16 text-white" />, color: 'from-pink-500 to-rose-500' }
    ]

    if (!isOpen) return null

    const currentStep = steps[step]

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 20, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                    className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] w-full max-w-4xl shadow-2xl z-10 relative overflow-hidden flex flex-col md:flex-row min-h-[450px]"
                >
                    {/* Visual Left Side */}
                    <div className="relative hidden md:flex w-2/5 p-8 items-center justify-center overflow-hidden border-r border-white/5">
                        <div className="absolute inset-0 bg-white/[0.02]"></div>
                        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
                        <motion.div 
                            key={`bg-${step}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`absolute w-[150%] h-[150%] bg-gradient-to-br ${currentStep.color} opacity-20 blur-[80px] rounded-full pointer-events-none`}
                        />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className={`relative z-10 w-40 h-40 rounded-[2.5rem] bg-gradient-to-br ${currentStep.color} shadow-2xl flex items-center justify-center transform rotate-3 ring-4 ring-white/10`}
                            >
                                <motion.div
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {currentStep.icon}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Content Right Side */}
                    <div className="relative flex flex-col p-8 md:p-12 w-full md:w-3/5">
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2 mb-10 mt-4 md:mt-0">
                            {steps.map((_, i) => (
                                <div key={i} className="h-1.5 rounded-full bg-white/10 flex-1 overflow-hidden relative">
                                    <motion.div 
                                        className={`absolute inset-0 bg-gradient-to-r ${currentStep.color}`}
                                        initial={{ width: '0%' }}
                                        animate={{ width: i < step ? '100%' : i === step ? '100%' : '0%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-3xl font-black mb-4 tracking-tight text-white">{currentStep.title}</h3>
                                    <p className="text-lg text-slate-400 leading-relaxed font-medium">{currentStep.desc}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                            {step > 0 && (
                                <button onClick={() => setStep(step - 1)} className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all">
                                    Geri
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    if (step < steps.length - 1) setStep(step + 1)
                                    else onClose()
                                }} 
                                className={`w-full group flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r ${currentStep.color} text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5`}
                            >
                                {step < steps.length - 1 ? (
                                    <>Devam Et <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                ) : (
                                    <>Hemen Başla <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}


// ============ ACHIEVEMENT BADGE ============
export function AchievementBadge({ icon, title, unlocked, color }) {
    return (
        <div className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${unlocked ? 'bg-white/5 hover:bg-white/10' : 'opacity-40'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${unlocked ? color : 'bg-gray-700'}`}>
                {icon}
            </div>
            <span className="text-xs text-center">{title}</span>
            {unlocked && <Check className="w-3 h-3 text-green-400" />}
        </div>
    )
}

// ============ CV COMPARE MODAL ============
export function CompareModal({ isOpen, onClose, cvs = [], isDayMode = false }) {
    const [cv1, setCv1] = useState(null)
    const [cv2, setCv2] = useState(null)

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] border ${isDayMode ? 'bg-[#f4f7f6] border-[#10B981]/20' : 'bg-[#0F1115] border-[#10B981]/20'}`}
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <Columns className="text-black" size={24} />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-black ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                        CV Karşılaştır
                                    </h3>
                                    <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-[#10B981]/80'}`}>İki farklı CV'yi analiz edin ve karşılaştırın</p>
                                </div>
                            </div>
                            <button onClick={onClose} className={`p-2.5 rounded-xl transition-colors ${isDayMode ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* CV 1 */}
                            <div className={`p-6 rounded-2xl border transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>İlk CV</label>
                                <select
                                    value={cv1 || ''}
                                    onChange={(e) => setCv1(e.target.value)}
                                    className={`w-full p-4 rounded-xl font-medium outline-none transition-all ${
                                        isDayMode 
                                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#10B981]' 
                                        : 'bg-black/50 border border-white/10 text-white focus:border-[#10B981] hover:border-white/20'
                                    }`}
                                >
                                    <option value="" className="text-gray-500">CV Seçin...</option>
                                    {cvs.map(cv => (
                                        <option key={cv.id} value={cv.id} className="bg-[#0F1115] text-white">{cv.name}</option>
                                    ))}
                                </select>
                                {cv1 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                                        <p className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{cvs.find(c => c.id === cv1)?.name}</p>
                                        <p className={`text-sm font-bold ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}><span className="text-gray-500 font-medium capitalize">Şablon:</span> {cvs.find(c => c.id === cv1)?.template}</p>
                                    </motion.div>
                                )}
                            </div>

                            {/* CV 2 */}
                            <div className={`p-6 rounded-2xl border transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                <label className={`block text-xs font-black uppercase tracking-widest mb-3 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>İkinci CV</label>
                                <select
                                    value={cv2 || ''}
                                    onChange={(e) => setCv2(e.target.value)}
                                    className={`w-full p-4 rounded-xl font-medium outline-none transition-all ${
                                        isDayMode 
                                        ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-[#10B981]' 
                                        : 'bg-black/50 border border-white/10 text-white focus:border-[#10B981] hover:border-white/20'
                                    }`}
                                >
                                    <option value="" className="text-gray-500">CV Seçin...</option>
                                    {cvs.map(cv => (
                                        <option key={cv.id} value={cv.id} className="bg-[#0F1115] text-white">{cv.name}</option>
                                    ))}
                                </select>
                                {cv2 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                                        <p className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{cvs.find(c => c.id === cv2)?.name}</p>
                                        <p className={`text-sm font-bold ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}><span className="text-gray-500 font-medium capitalize">Şablon:</span> {cvs.find(c => c.id === cv2)?.template}</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <AnimatePresence>
                            {cv1 && cv2 && (() => {
                                const data1 = cvs.find(c => c.id === cv1)?.data
                                const data2 = cvs.find(c => c.id === cv2)?.data
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-8 space-y-4"
                                    >
                                        <div className="grid grid-cols-3 gap-6 text-center">
                                            <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#10B981]/10 border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
                                                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>Deneyim</div>
                                                <div className={`text-3xl font-black flex items-center justify-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                                    <span>{data1?.experience?.length || 0}</span>
                                                    <span className="text-[#10B981] text-lg">vs</span>
                                                    <span>{data2?.experience?.length || 0}</span>
                                                </div>
                                            </div>
                                            <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#10B981]/10 border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
                                                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>Beceriler</div>
                                                <div className={`text-3xl font-black flex items-center justify-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                                    <span>{data1?.skills?.length || 0}</span>
                                                    <span className="text-[#10B981] text-lg">vs</span>
                                                    <span>{data2?.skills?.length || 0}</span>
                                                </div>
                                            </div>
                                            <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#10B981]/10 border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
                                                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>Eğitim</div>
                                                <div className={`text-3xl font-black flex items-center justify-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                                    <span>{data1?.education?.length || 0}</span>
                                                    <span className="text-[#10B981] text-lg">vs</span>
                                                    <span>{data2?.education?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })()}
                        </AnimatePresence>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={onClose} className={`px-8 py-3.5 font-bold rounded-2xl transition-colors border ${isDayMode ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}>
                                Kapat
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// ============ UTILITY FUNCTIONS ============
export const formatTimeAgo = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} dk önce`
    if (hours < 24) return `${hours} saat önce`
    return `${days} gün önce`
}

export const getTemplateEmoji = (template) => {
    const emojis = {
        modern: '🎨', minimalist: '⚡', corporate: '🏢', creative: '🌈', tech: '💻',
        executive: '👔', elegant: '✨', healthcare: '🏥', academic: '📚', finance: '💰',
        legal: '⚖️', marketing: '📢', engineer: '⚙️', retail: '🛍️', hospitality: '🏨',
        government: '🏛️', freelancer: '💼', startup: '🚀', international: '🌍', portfolio: '🖼️',
        scientist: '🔬', artist: '🎨', teacher: '📖', chef: '👨‍🍳', photographer: '📷',
        musician: '🎵', athlet: '🏆', pilot: '✈️', construction: '🏗️', environment: '🌱',
        journalist: '📰', nurse: '💉', logistics: '🚚', security: '🛡️', architect: '🏛️',
        hr: '👥', datascience: '📊', gamer: '🎮', consultant: '💡', beauty: '💅'
    }
    return emojis[template] || '📄'
}

// ============ SAMPLE DATA ============
export const sampleNotifications = [
    { message: 'Yeni şablonlar eklendi! 🎉', time: '2 saat önce', type: 'info', icon: <Gift className="w-4 h-4 text-cyan-400" />, read: false },
    { message: 'CV\'niz başarıyla indirildi', time: '1 gün önce', type: 'success', icon: <Download className="w-4 h-4 text-green-400" />, read: true },
    { message: 'Pro üyeliğiniz 7 gün sonra bitiyor', time: '3 gün önce', type: 'warning', icon: <AlertCircle className="w-4 h-4 text-amber-400" />, read: true }
]

export const getAchievements = (cvCount, isPremium) => [
    { id: 'first-cv', title: 'İlk CV', icon: <FileText className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: true, color: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
    { id: 'pro-member', title: 'Pro Üye', icon: <Crown className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: isPremium, color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
    { id: 'five-cvs', title: '5 CV Master', icon: <Trophy className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: cvCount >= 5, color: 'bg-gradient-to-br from-purple-500 to-pink-600' },
    { id: 'downloader', title: 'İndirici', icon: <Download className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: true, color: 'bg-gradient-to-br from-green-500 to-emerald-600' },
    { id: 'sharer', title: 'Paylaşımcı', icon: <Share2 className="w-5 h-5 text-slate-900 dark:text-white" />, unlocked: false, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' }
]

