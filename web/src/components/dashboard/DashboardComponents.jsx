// Dashboard Components - Modular Structure
import { useState, useEffect } from 'react'
import {
    Bell, X, User, Mail, Lock, Camera, Sparkles, Check, Gift, Download, AlertCircle,
    Trophy, Play, ArrowRight, Zap, FileText, Crown, Share2, Columns
} from 'lucide-react'

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
        { title: 'CVniz\'a Hoş Geldiniz! 🎉', desc: 'Size profesyonel CV oluşturmayı öğreteceğiz.', target: 'welcome' },
        { title: 'Yeni CV Oluşturun', desc: 'Buradan hızlıca yeni bir CV oluşturabilirsiniz.', target: 'new-cv' },
        { title: 'Şablonları Keşfedin', desc: '65+ profesyonel şablon arasından seçin.', target: 'templates' },
        { title: 'AI Asistanı Kullanın', desc: 'Yapay zeka ile içerik oluşturun.', target: 'ai' },
        { title: 'Hazırsınız!', desc: 'Artık profesyonel CV\'ler oluşturabilirsiniz.', target: 'done' }
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 max-w-md w-full animate-scale-in text-center shadow-2xl shadow-cyan-500/10 ring-1 ring-white/5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-6">
                    {step === 4 ? <Trophy className="w-10 h-10 text-slate-900 dark:text-white" /> : <Play className="w-10 h-10 text-slate-900 dark:text-white" />}
                </div>

                <h3 className="text-2xl font-bold mb-3">{steps[step].title}</h3>
                <p className="text-slate-500 dark:text-gray-400 mb-8">{steps[step].desc}</p>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-6">
                    {steps.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-cyan-400 w-6' : i < step ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                    ))}
                </div>

                <div className="flex gap-3">
                    {step > 0 && (
                        <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
                            Geri
                        </button>
                    )}
                    {step < steps.length - 1 ? (
                        <button onClick={() => setStep(step + 1)} className="flex-1 btn-premium py-3 justify-center">
                            Devam <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    ) : (
                        <button onClick={onClose} className="flex-1 btn-premium py-3 justify-center">
                            Başla <Zap className="w-4 h-4 ml-1" />
                        </button>
                    )}
                </div>

                <button onClick={onClose} className="mt-4 text-sm text-slate-600 dark:text-gray-500 hover:text-slate-500 dark:text-gray-400">
                    Turu Atla
                </button>
            </div>
        </div>
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
export function CompareModal({ isOpen, onClose, cvs = [] }) {
    const [cv1, setCv1] = useState(null)
    const [cv2, setCv2] = useState(null)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 max-w-4xl w-full animate-scale-in shadow-2xl shadow-cyan-500/10 ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Columns className="w-5 h-5 text-cyan-400" />
                        CV Karşılaştır
                    </h3>
                    <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* CV 1 */}
                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">İlk CV</label>
                        <select
                            value={cv1 || ''}
                            onChange={(e) => setCv1(e.target.value)}
                            className="input-field w-full"
                        >
                            <option value="">CV Seçin...</option>
                            {cvs.map(cv => (
                                <option key={cv.id} value={cv.id}>{cv.name}</option>
                            ))}
                        </select>
                        {cv1 && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                <p className="font-semibold">{cvs.find(c => c.id === cv1)?.name}</p>
                                <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{cvs.find(c => c.id === cv1)?.template} Şablon</p>
                            </div>
                        )}
                    </div>

                    {/* CV 2 */}
                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">İkinci CV</label>
                        <select
                            value={cv2 || ''}
                            onChange={(e) => setCv2(e.target.value)}
                            className="input-field w-full"
                        >
                            <option value="">CV Seçin...</option>
                            {cvs.map(cv => (
                                <option key={cv.id} value={cv.id}>{cv.name}</option>
                            ))}
                        </select>
                        {cv2 && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                <p className="font-semibold">{cvs.find(c => c.id === cv2)?.name}</p>
                                <p className="text-sm text-slate-500 dark:text-gray-400 capitalize">{cvs.find(c => c.id === cv2)?.template} Şablon</p>
                            </div>
                        )}
                    </div>
                </div>

                {cv1 && cv2 && (() => {
                    const data1 = cvs.find(c => c.id === cv1)?.data
                    const data2 = cvs.find(c => c.id === cv2)?.data
                    return (
                        <div className="mt-8 space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deneyim</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">{data1?.experience?.length || 0} vs {data2?.experience?.length || 0}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Beceriler</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">{data1?.skills?.length || 0} vs {data2?.skills?.length || 0}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Eğitim</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">{data1?.education?.length || 0} vs {data2?.education?.length || 0}</div>
                                </div>
                            </div>
                        </div>
                    )
                })()}

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
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

