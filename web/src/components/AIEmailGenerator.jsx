import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, Mail, Copy, Check, RefreshCw,
    Briefcase, Send, FileText, ChevronRight, Lightbulb,
    Edit3, Zap, ArrowRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'

// E-posta türleri
const EMAIL_TYPES = [
    { 
        id: 'application', 
        label: 'İş Başvurusu', 
        icon: '📨', 
        description: 'Açık bir pozisyona başvuru',
        color: 'from-blue-500 to-cyan-500'
    },
    { 
        id: 'followup', 
        label: 'Takip E-postası', 
        icon: '🔄', 
        description: 'Başvuru sonrası takip',
        color: 'from-green-500 to-emerald-500'
    },
    { 
        id: 'networking', 
        label: 'Networking', 
        icon: '🤝', 
        description: 'İlk tanışma ve bağlantı kurma',
        color: 'from-purple-500 to-pink-500'
    },
    { 
        id: 'referral', 
        label: 'Referans İsteme', 
        icon: '⭐', 
        description: 'Önceki iş arkadaşından referans',
        color: 'from-amber-500 to-orange-500'
    },
    { 
        id: 'informational', 
        label: 'Bilgi Görüşmesi', 
        icon: '💬', 
        description: 'Kariyer hakkında bilgi alma',
        color: 'from-indigo-500 to-violet-500'
    },
    { 
        id: 'thankyou', 
        label: 'Teşekkür E-postası', 
        icon: '🙏', 
        description: 'Görüşme sonrası teşekkür',
        color: 'from-rose-500 to-pink-500'
    }
]

// Ton seçenekleri
const TONES = [
    { id: 'professional', label: 'Profesyonel', emoji: '👔' },
    { id: 'friendly', label: 'Samimi', emoji: '😊' },
    { id: 'confident', label: 'Özgüvenli', emoji: '💪' },
    { id: 'enthusiastic', label: 'Heyecanlı', emoji: '🚀' }
]

// E-posta oluşturma
const generateEmail = (type, input, cv, tone) => {
    const name = cv?.personalInfo?.name || 'Ad Soyad'
    const title = cv?.personalInfo?.title || 'Profesyonel'
    const topSkills = cv?.skills?.slice(0, 3).map(s => s.name).join(', ') || 'problem çözme'
    
    const templates = {
        application: {
            subject: `${input.position || 'Açık Pozisyon'} Başvurusu - ${name}`,
            body: `Sayın ${input.recipient || 'Yetkili'},

${input.company || '[Şirket Adı]'} bünyesinde açık olan ${input.position || '[Pozisyon]'} pozisyonu için başvurumu iletmek istiyorum.

${title} olarak ${topSkills} alanlarındaki deneyimim ve becerilerimle şirketinize değer katacağıma inanıyorum. ${input.whyCompany || 'Şirketinizin sektördeki yenilikçi yaklaşımı beni oldukça heyecanlandırıyor.'}

CV'mi ekte bulabilirsiniz. Görüşme fırsatı yaratmanız durumunda, neden bu pozisyon için ideal aday olduğumu daha detaylı anlatmak isterim.

İlginiz için teşekkür eder, olumlu dönüşünüzü beklerim.

Saygılarımla,
${name}
${cv?.personalInfo?.phone || ''}
${cv?.personalInfo?.email || ''}`
        },
        followup: {
            subject: `Re: ${input.position || 'Başvuru'} Takip - ${name}`,
            body: `Sayın ${input.recipient || 'Yetkili'},

${input.date || 'Geçtiğimiz hafta'} ${input.position || 'açık pozisyon'} için yapmış olduğum başvuruyu takip etmek amacıyla yazıyorum.

Başvurumun durumu hakkında bilgi almak isterim. Pozisyon hâlâ açık ise, görüşme için uygun olduğumu belirtmek isterim.

Bu fırsata olan ilgim devam etmekte olup, herhangi bir sorunuz olursa yanıtlamaktan memnuniyet duyarım.

Teşekkürler,
${name}`
        },
        networking: {
            subject: `Bağlantı Kurma İsteği - ${name}, ${title}`,
            body: `Merhaba ${input.recipient || ''},

LinkedIn üzerinden profilinizi inceledim ve ${input.topic || 'kariyer yolculuğunuz'} beni çok etkiledi.

${title} olarak sektörde deneyim kazanıyor ve sizin gibi profesyonellerden öğrenmek istiyorum. ${input.reason || 'Özellikle kariyerinizde aldığınız kararlar ve edindiğiniz deneyimler hakkında bilgi almak isterim.'}

15-20 dakikalık kısa bir telefon veya video görüşmesi için müsait olur musunuz?

Teşekkürler,
${name}`
        },
        referral: {
            subject: `Referans Rica - ${input.position || 'Yeni Fırsat'}`,
            body: `Merhaba ${input.recipient || ''},

Umarım her şey yolundadır. ${input.company || 'Yeni bir şirkette'} ${input.position || 'açık bir pozisyon'} için başvuru sürecindeyim ve referansınızı almak istiyorum.

Birlikte çalıştığımız ${input.project || 'projeler'} sırasında gösterdiğiniz desteği unutmadım. Eğer uygunsa, benim adıma bir referans mektubu yazmanız veya referans olarak isminizi vermem mümkün olur mu?

Tabii ki tamamen sizin tercihiniz, ve herhangi bir baskı hissetmenizi istemem.

Teşekkürler,
${name}`
        },
        informational: {
            subject: `Bilgi Görüşmesi Talebi - ${input.topic || 'Kariyer'}`,
            body: `Merhaba ${input.recipient || ''},

${input.topic || 'Kariyer yolculuğunuz ve sektördeki deneyimleriniz'} hakkında bilgi almak amacıyla yazıyorum.

${title} olarak kariyer hedeflerim doğrultusunda yol haritası çizmeye çalışıyorum. ${input.question || 'Sektöre yeni başlayanlar için tavsiyelerinizi öğrenmek isterim.'}

Zamanınızın değerli olduğunun farkındayım. Size uygun bir zamanda 15-20 dakikalık bir görüşme yapabilir miyiz?

Teşekkürler,
${name}`
        },
        thankyou: {
            subject: `Teşekkür - ${input.position || 'Görüşme'} Hakkında`,
            body: `Sayın ${input.recipient || 'Yetkili'},

Bugün ${input.position || 'pozisyon'} için gerçekleştirdiğimiz görüşme için teşekkür ederim.

${input.highlight || 'Şirketinizin vizyonu ve ekip kültürü'} hakkında konuşmak beni çok heyecanlandırdı. Görüşmemizde öğrendiklerim, bu fırsata olan ilgimi daha da artırdı.

${input.contribution || 'Deneyimlerimin bu pozisyona nasıl değer katabileceğini paylaşma fırsatı bulduğum için mutluyum.'}

Süreçle ilgili sorularınız olursa bana ulaşmaktan çekinmeyin. Olumlu haberlerinizi bekliyorum.

Saygılarımla,
${name}`
        }
    }

    return templates[type] || templates.application
}

export default function AIEmailGenerator({ isOpen, onClose }) {
    const { isPremium } = useAuth()
    const { cvData } = useCV()
    const [step, setStep] = useState(1)
    const [emailType, setEmailType] = useState('application')
    const [tone, setTone] = useState('professional')
    const [input, setInput] = useState({
        recipient: '',
        company: '',
        position: '',
        whyCompany: '',
        date: '',
        topic: '',
        reason: '',
        project: '',
        question: '',
        highlight: '',
        contribution: ''
    })
    const [generatedEmail, setGeneratedEmail] = useState({ subject: '', body: '' })
    const [isGenerating, setIsGenerating] = useState(false)
    const [copiedField, setCopiedField] = useState(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        
        // Simüle AI işleme
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const email = generateEmail(emailType, input, cvData, tone)
        setGeneratedEmail(email)
        
        setIsGenerating(false)
        setStep(3)
    }

    const handleRegenerate = async () => {
        setIsGenerating(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const email = generateEmail(emailType, input, cvData, tone)
        setGeneratedEmail(email)
        
        setIsGenerating(false)
    }

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const handleCopyAll = () => {
        const fullEmail = `Konu: ${generatedEmail.subject}\n\n${generatedEmail.body}`
        navigator.clipboard.writeText(fullEmail)
        setCopiedField('all')
        setTimeout(() => setCopiedField(null), 2000)
    }

    const resetForm = () => {
        setStep(1)
        setInput({
            recipient: '', company: '', position: '', whyCompany: '',
            date: '', topic: '', reason: '', project: '',
            question: '', highlight: '', contribution: ''
        })
        setGeneratedEmail({ subject: '', body: '' })
    }

    // İlgili input alanlarını e-posta türüne göre belirle
    const getInputFields = () => {
        const commonFields = [
            { key: 'recipient', label: 'Alıcı Adı', placeholder: 'Ahmet Yılmaz' }
        ]

        const typeFields = {
            application: [
                { key: 'company', label: 'Şirket Adı', placeholder: 'ABC Teknoloji' },
                { key: 'position', label: 'Pozisyon', placeholder: 'Frontend Developer' },
                { key: 'whyCompany', label: 'Şirketi neden tercih ediyorsunuz?', placeholder: 'Şirketin yenilikçi yaklaşımı...', multiline: true }
            ],
            followup: [
                { key: 'position', label: 'Başvurulan Pozisyon', placeholder: 'Frontend Developer' },
                { key: 'date', label: 'Başvuru Tarihi', placeholder: 'Geçtiğimiz Pazartesi' }
            ],
            networking: [
                { key: 'topic', label: 'İlgilendiğiniz Konu', placeholder: 'Kariyer yolculuğunuz' },
                { key: 'reason', label: 'Neden bağlantı kurmak istiyorsunuz?', placeholder: 'Sektördeki deneyimlerinizden...', multiline: true }
            ],
            referral: [
                { key: 'company', label: 'Başvurulan Şirket', placeholder: 'XYZ Şirketi' },
                { key: 'position', label: 'Başvurulan Pozisyon', placeholder: 'Senior Developer' },
                { key: 'project', label: 'Birlikte çalıştığınız proje', placeholder: 'E-ticaret projesi' }
            ],
            informational: [
                { key: 'topic', label: 'Görüşme Konusu', placeholder: 'Sektör trendleri' },
                { key: 'question', label: 'Sormak istediğiniz soru', placeholder: 'Kariyerinizde en değerli deneyim...', multiline: true }
            ],
            thankyou: [
                { key: 'position', label: 'Görüşülen Pozisyon', placeholder: 'Frontend Developer' },
                { key: 'highlight', label: 'Görüşmede sizi etkileyen', placeholder: 'Şirketin ekip kültürü' },
                { key: 'contribution', label: 'Katkı sağlayacağınız alan', placeholder: 'React deneyimim ile...' }
            ]
        }

        return [...commonFields, ...(typeFields[emailType] || [])]
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Mail className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">AI E-posta Oluşturucu</h2>
                                    <p className="text-gray-400 text-sm">Profesyonel e-postalar saniyeler içinde</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2 mt-4">
                            {[1, 2, 3].map(s => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                        step >= s 
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                                            : 'bg-gray-700 text-gray-400'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Step 1: Email Type */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">E-posta Türü Seçin</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                    {EMAIL_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setEmailType(type.id)}
                                            className={`p-4 rounded-xl border transition-all text-left ${
                                                emailType === type.id
                                                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/50'
                                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{type.icon}</span>
                                                <div>
                                                    <p className="text-white font-medium">{type.label}</p>
                                                    <p className="text-gray-400 text-sm">{type.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Ton Seçimi */}
                                <h4 className="text-white font-medium mb-3">Ton Seçin</h4>
                                <div className="flex gap-2 mb-6">
                                    {TONES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTone(t.id)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                                tone === t.id
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                        >
                                            <span>{t.emoji}</span>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    Devam Et
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">E-posta Detayları</h3>
                                
                                <div className="space-y-4 mb-6">
                                    {getInputFields().map(field => (
                                        <div key={field.key}>
                                            <label className="block text-gray-400 text-sm mb-2">{field.label}</label>
                                            {field.multiline ? (
                                                <textarea
                                                    value={input[field.key]}
                                                    onChange={(e) => setInput({ ...input, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={input[field.key]}
                                                    onChange={(e) => setInput({ ...input, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Geri
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Oluşturuluyor...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                E-posta Oluştur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Result */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">AI Tarafından Oluşturuldu</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleRegenerate}
                                            disabled={isGenerating}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            title="Yeniden Oluştur"
                                        >
                                            <RefreshCw size={18} className={`text-gray-400 ${isGenerating ? 'animate-spin' : ''}`} />
                                        </button>
                                        <button
                                            onClick={handleCopyAll}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {copiedField === 'all' 
                                                ? <><Check size={18} className="text-green-400" /></>
                                                : <><Copy size={18} className="text-gray-400" /></>
                                            }
                                        </button>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-gray-400 text-sm">Konu</label>
                                        <button
                                            onClick={() => handleCopy(generatedEmail.subject, 'subject')}
                                            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                                        >
                                            {copiedField === 'subject' ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedField === 'subject' ? 'Kopyalandı' : 'Kopyala'}
                                        </button>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
                                        <p className="text-white font-medium">{generatedEmail.subject}</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-gray-400 text-sm">İçerik</label>
                                        <button
                                            onClick={() => handleCopy(generatedEmail.body, 'body')}
                                            className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                                        >
                                            {copiedField === 'body' ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedField === 'body' ? 'Kopyalandı' : 'Kopyala'}
                                        </button>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                        <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                            {generatedEmail.body}
                                        </pre>
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="text-emerald-400 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-emerald-300 font-medium text-sm">İpucu</p>
                                            <p className="text-gray-400 text-sm">
                                                E-postayı göndermeden önce kendi durumunuza göre düzenleyin. 
                                                Spesifik detaylar ve kişisel dokunuşlar e-postanızı daha etkili kılar.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={resetForm}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Yeni E-posta
                                    </button>
                                    <a
                                        href={`mailto:?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`}
                                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <Send size={20} />
                                        E-posta Gönder
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Premium Badge */}
                    {!isPremium && (
                        <div className="absolute top-4 right-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PRO
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
