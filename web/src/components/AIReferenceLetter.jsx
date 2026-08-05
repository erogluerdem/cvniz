import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, FileText, Copy, Check, RefreshCw,
    User, Briefcase, Award, Star, ChevronRight, 
    Lightbulb, Download, Calendar, Building2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { aiAPI } from '../services/api'

// Referans türleri
const REFERENCE_TYPES = [
    { 
        id: 'manager', 
        label: 'Yönetici / Supervisor', 
        icon: '👔', 
        description: 'Direkt yöneticinizden referans',
        color: 'from-blue-500 to-cyan-500'
    },
    { 
        id: 'colleague', 
        label: 'İş Arkadaşı', 
        icon: '🤝', 
        description: 'Aynı seviyede çalıştığınız birinden',
        color: 'from-green-500 to-emerald-500'
    },
    { 
        id: 'client', 
        label: 'Müşteri / Client', 
        icon: '💼', 
        description: 'Çalıştığınız bir müşteriden',
        color: 'from-purple-500 to-pink-500'
    },
    { 
        id: 'professor', 
        label: 'Akademik Referans', 
        icon: '🎓', 
        description: 'Profesör veya hocadan',
        color: 'from-amber-500 to-orange-500'
    }
]

// Mektup tonu
const LETTER_TONES = [
    { id: 'formal', label: 'Resmi', emoji: '📜' },
    { id: 'warm', label: 'Samimi', emoji: '💝' },
    { id: 'enthusiastic', label: 'Coşkulu', emoji: '🌟' }
]

// Referans mektubu oluşturma
const generateReferenceLetter = (type, input, cv, tone) => {
    const candidateName = cv?.personalInfo?.name || 'Aday Adı'
    const candidateTitle = cv?.personalInfo?.title || 'Profesyonel'
    const topSkills = cv?.skills?.slice(0, 4).map(s => s.name) || ['problem çözme', 'iletişim', 'takım çalışması', 'liderlik']
    
    const today = new Date().toLocaleDateString('tr-TR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })

    const toneAdjectives = {
        formal: {
            opening: 'Bu mektup',
            recommendation: 'tereddütsüz tavsiye ederim',
            closing: 'Saygılarımla'
        },
        warm: {
            opening: 'Size bu mektubu yazabilmekten mutluluk duyuyorum',
            recommendation: 'gönül rahatlığıyla tavsiye ederim',
            closing: 'Sıcak selamlarımla'
        },
        enthusiastic: {
            opening: 'Size bu harika profesyonelden bahsetmek için sabırsızlanıyordum',
            recommendation: 'büyük bir coşkuyla tavsiye ederim',
            closing: 'En içten dileklerimle'
        }
    }

    const toneText = toneAdjectives[tone] || toneAdjectives.formal

    const typeTemplates = {
        manager: `${today}

Yetkili Makama,

${toneText.opening}, ${candidateName} için bir referans mektubu yazmak amacıyla kaleme alınmıştır. ${input.company || '[Şirket Adı]'} şirketinde ${input.duration || 'yaklaşık 2 yıl'} boyunca ${input.role || candidateTitle} olarak çalışan ${candidateName}'ın doğrudan yöneticisi olarak görev yaptım.

${candidateName}, ${input.achievement || 'ekibimizin en değerli üyelerinden biri olarak öne çıktı'}. Özellikle ${topSkills[0]} ve ${topSkills[1]} konularındaki yetkinliği dikkat çekiciydi. ${input.project || 'Görev aldığı projelerde'} tutarlı bir performans sergiledi ve sürekli olarak beklentilerin üzerinde sonuçlar elde etti.

Teknik becerilerinin yanı sıra, ${candidateName} aynı zamanda mükemmel bir takım oyuncusudur. ${input.teamwork || 'Zorlu projelerde takım arkadaşlarıyla uyum içinde çalışması ve sorumluluk alması'} onu değerli bir iş arkadaşı yapmaktadır.

${candidateName}'ı ${input.position || 'yeni pozisyonu'} için ${toneText.recommendation}. Herhangi bir konuda daha fazla bilgi almak isterseniz benimle iletişime geçmekten çekinmeyin.

${toneText.closing},

${input.referrerName || '[Referans Adı]'}
${input.referrerTitle || '[Referans Ünvanı]'}
${input.referrerCompany || '[Şirket Adı]'}
${input.referrerEmail || '[E-posta]'}
${input.referrerPhone || '[Telefon]'}`,

        colleague: `${today}

Yetkili Makama,

${toneText.opening}; iş arkadaşım ${candidateName} için bu referans mektubunu yazmaktan onur duyuyorum. ${input.company || '[Şirket Adı]'} şirketinde ${input.duration || 'yaklaşık 2 yıl'} boyunca aynı ekipte çalışma fırsatı bulduk.

${candidateName} ile birçok projede birlikte çalıştık. ${input.project || 'Özellikle yoğun dönemlerde'} sergilediği profesyonellik ve problem çözme becerileri takdire şayandı. ${topSkills[0]}, ${topSkills[1]} ve ${topSkills[2]} konularındaki uzmanlığı projelerimize büyük değer kattı.

${candidateName}'ın en dikkat çekici özelliklerinden biri ${input.strength || 'zorlu durumlar karşısında bile sakinliğini koruyarak çözüm odaklı yaklaşımıdır'}. Ekip içi iletişimi mükemmel olup, herkes tarafından sevilen ve saygı duyulan bir iş arkadaşıdır.

${candidateName}'ı ${input.position || 'başvurduğu pozisyon'} için ${toneText.recommendation}. Onunla çalışan her ekip şanslı olacaktır.

${toneText.closing},

${input.referrerName || '[Referans Adı]'}
${input.referrerTitle || '[Referans Ünvanı]'}
${input.referrerCompany || '[Şirket Adı]'}
${input.referrerEmail || '[E-posta]'}`,

        client: `${today}

Yetkili Makama,

${toneText.opening}; ${candidateName} ile olan iş ilişkimiz hakkında memnuniyetle görüşlerimi paylaşmak istiyorum.

${input.company || '[Şirket Adı]'} olarak ${candidateName} ile ${input.duration || 'yaklaşık 1 yıl'} boyunca ${input.project || 'çeşitli projelerde'} birlikte çalıştık. Bu süre zarfında ${candidateName}'ın ${topSkills[0]} ve ${topSkills[1]} konularındaki uzmanlığından oldukça faydalandık.

${candidateName}, ${input.strength || 'müşteri odaklı yaklaşımı ve zamanında teslimat konusundaki hassasiyeti'} ile öne çıktı. ${input.achievement || 'Karşılaştığımız teknik zorlukları hızlı ve etkili bir şekilde çözdü, beklentilerimizin ötesine geçti'}.

Profesyonelliği, teknik yetkinliği ve iletişim becerileri sayesinde ${candidateName}'ı ${toneText.recommendation}.

${toneText.closing},

${input.referrerName || '[Referans Adı]'}
${input.referrerTitle || '[Referans Ünvanı]'}
${input.referrerCompany || '[Şirket Adı]'}
${input.referrerEmail || '[E-posta]'}`,

        professor: `${today}

Yetkili Makama,

${toneText.opening}; eski öğrencim ${candidateName} için bu akademik referans mektubunu yazmaktan memnuniyet duyuyorum.

${candidateName}, ${input.university || '[Üniversite Adı]'} ${input.department || '[Bölüm Adı]'} bölümünde ${input.duration || 'dört yıl'} boyunca eğitim gördü. Bu süre zarfında ${input.course || 'verdiğim derslerde'} üstün bir performans sergiledi.

Akademik başarısının yanı sıra, ${candidateName} ${input.project || 'yürüttüğü araştırma projelerinde'} gösterdiği azim ve analitik düşünme becerisiyle dikkat çekti. ${topSkills[0]} ve ${topSkills[1]} konularında özellikle yetenekli olduğunu gözlemledim.

${candidateName}'ın ${input.strength || 'araştırma metodolojisine hakimiyeti ve akademik etiğe bağlılığı'} onu akranlarından ayıran özelliklerdi.

${candidateName}'ı ${input.position || 'başvurduğu pozisyon/program'} için ${toneText.recommendation}. Daha fazla bilgi için benimle iletişime geçebilirsiniz.

${toneText.closing},

${input.referrerName || '[Prof. Dr. Ad Soyad]'}
${input.referrerTitle || '[Ünvan]'}
${input.referrerCompany || '[Üniversite/Kurum]'}
${input.referrerEmail || '[E-posta]'}`
    }

    return typeTemplates[type] || typeTemplates.manager
}

export default function AIReferenceLetter({ isOpen, onClose }) {
    const { isPremium } = useAuth()
    const { cvData } = useCV()
    const [step, setStep] = useState(1)
    const [referenceType, setReferenceType] = useState('manager')
    const [tone, setTone] = useState('formal')
    const [input, setInput] = useState({
        referrerName: '',
        referrerTitle: '',
        referrerCompany: '',
        referrerEmail: '',
        referrerPhone: '',
        company: '',
        duration: '',
        role: '',
        position: '',
        project: '',
        achievement: '',
        strength: '',
        teamwork: '',
        university: '',
        department: '',
        course: ''
    })
    const [generatedLetter, setGeneratedLetter] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        
        try {
            const response = await aiAPI.writeReferenceLetter({
                referenceType,
                input,
                cvData,
                tone
            });
            
            if (response.success && response.content) {
                setGeneratedLetter(response.content);
            } else if (response.success && response.data?.content) {
                setGeneratedLetter(response.data.content);
            } else {
                throw new Error("API failed");
            }
        } catch (error) {
            console.warn("Reference Letter API failed, using fallback.", error);
            await new Promise(resolve => setTimeout(resolve, 1800))
            const letter = generateReferenceLetter(referenceType, input, cvData, tone)
            setGeneratedLetter(letter)
        }
        
        setIsGenerating(false)
        setStep(3)
    }

    const handleRegenerate = async () => {
        setIsGenerating(true)
        
        try {
            const response = await aiAPI.writeReferenceLetter({
                referenceType,
                input,
                cvData,
                tone,
                regenerate: true
            });
            
            if (response.success && response.content) {
                setGeneratedLetter(response.content);
            } else if (response.success && response.data?.content) {
                setGeneratedLetter(response.data.content);
            } else {
                throw new Error("API failed");
            }
        } catch (error) {
            console.warn("Reference Letter API failed, using fallback.", error);
            await new Promise(resolve => setTimeout(resolve, 1000))
            const letter = generateReferenceLetter(referenceType, input, cvData, tone)
            setGeneratedLetter(letter)
        }
        
        setIsGenerating(false)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Referans_Mektubu_${cvData?.personalInfo?.name || 'aday'}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const resetForm = () => {
        setStep(1)
        setInput({
            referrerName: '', referrerTitle: '', referrerCompany: '',
            referrerEmail: '', referrerPhone: '', company: '',
            duration: '', role: '', position: '', project: '',
            achievement: '', strength: '', teamwork: '',
            university: '', department: '', course: ''
        })
        setGeneratedLetter('')
    }

    // İlgili input alanlarını referans türüne göre belirle
    const getInputFields = () => {
        const referrerFields = [
            { key: 'referrerName', label: 'Referans Veren Kişi', placeholder: 'Ali Yılmaz', icon: User },
            { key: 'referrerTitle', label: 'Ünvanı', placeholder: 'Yazılım Müdürü', icon: Award },
            { key: 'referrerCompany', label: 'Şirket/Kurum', placeholder: 'ABC Teknoloji', icon: Building2 },
            { key: 'referrerEmail', label: 'E-posta', placeholder: 'ali.yilmaz@abc.com', icon: null }
        ]

        const typeFields = {
            manager: [
                { key: 'company', label: 'Çalıştığınız Şirket', placeholder: 'XYZ Teknoloji' },
                { key: 'duration', label: 'Çalışma Süresi', placeholder: '2 yıl' },
                { key: 'role', label: 'Pozisyonunuz', placeholder: 'Senior Developer' },
                { key: 'achievement', label: 'Öne Çıkan Başarınız', placeholder: 'Ekip performansını %30 artırdı...', multiline: true },
                { key: 'project', label: 'Önemli Bir Proje', placeholder: 'E-ticaret platformu geliştirmesi' },
                { key: 'teamwork', label: 'Takım Çalışması Örneği', placeholder: 'Zorlu dönemlerde liderlik...' }
            ],
            colleague: [
                { key: 'company', label: 'Birlikte Çalıştığınız Şirket', placeholder: 'XYZ Teknoloji' },
                { key: 'duration', label: 'Birlikte Çalışma Süresi', placeholder: '2 yıl' },
                { key: 'project', label: 'Birlikte Çalıştığınız Projeler', placeholder: 'CRM sistemi geliştirmesi' },
                { key: 'strength', label: 'En Güçlü Özelliğiniz', placeholder: 'Problem çözme becerisi...' }
            ],
            client: [
                { key: 'company', label: 'Müşteri Şirket', placeholder: 'ABC Şirketi' },
                { key: 'duration', label: 'İş İlişkisi Süresi', placeholder: '1 yıl' },
                { key: 'project', label: 'Birlikte Çalıştığınız Proje', placeholder: 'Web sitesi yenileme projesi' },
                { key: 'achievement', label: 'Sağladığınız Değer', placeholder: 'Satışları %50 artıran çözümler...' },
                { key: 'strength', label: 'Öne Çıkan Özelliğiniz', placeholder: 'Müşteri odaklı yaklaşım' }
            ],
            professor: [
                { key: 'university', label: 'Üniversite', placeholder: 'İstanbul Teknik Üniversitesi' },
                { key: 'department', label: 'Bölüm', placeholder: 'Bilgisayar Mühendisliği' },
                { key: 'duration', label: 'Öğrenim Süresi', placeholder: '4 yıl (2018-2022)' },
                { key: 'course', label: 'Birlikte Çalıştığınız Dersler/Projeler', placeholder: 'Yapay Zeka dersi ve bitirme projesi' },
                { key: 'strength', label: 'Akademik Güçlü Yönünüz', placeholder: 'Araştırma becerileri...' }
            ]
        }

        return { referrerFields, typeFields: typeFields[referenceType] || [] }
    }

    const { referrerFields, typeFields } = getInputFields()

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                    <FileText className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">AI Referans Mektubu</h2>
                                    <p className="text-gray-400 text-sm">Profesyonel referans mektupları oluşturun</p>
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
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                                            : 'bg-gray-700 text-gray-400'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-amber-500' : 'bg-gray-700'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Step 1: Reference Type */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Referans Türü Seçin</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                    {REFERENCE_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setReferenceType(type.id)}
                                            className={`p-4 rounded-xl border transition-all text-left ${
                                                referenceType === type.id
                                                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50'
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
                                <h4 className="text-white font-medium mb-3">Mektup Tonu</h4>
                                <div className="flex gap-2 mb-6">
                                    {LETTER_TONES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTone(t.id)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                                                tone === t.id
                                                    ? 'bg-amber-500 text-white'
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
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
                                <h3 className="text-lg font-semibold text-white mb-4">Mektup Detayları</h3>
                                
                                {/* Referans Veren Bilgileri */}
                                <div className="bg-gray-800/30 rounded-xl p-4 mb-4 border border-gray-700">
                                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                        <User size={18} className="text-amber-400" />
                                        Referans Veren Bilgileri
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {referrerFields.map(field => (
                                            <div key={field.key}>
                                                <label className="block text-gray-400 text-xs mb-1">{field.label}</label>
                                                <input
                                                    type="text"
                                                    value={input[field.key]}
                                                    onChange={(e) => setInput({ ...input, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Tür Bazlı Alanlar */}
                                <div className="space-y-3 mb-6">
                                    {typeFields.map(field => (
                                        <div key={field.key}>
                                            <label className="block text-gray-400 text-sm mb-2">{field.label}</label>
                                            {field.multiline ? (
                                                <textarea
                                                    value={input[field.key]}
                                                    onChange={(e) => setInput({ ...input, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={input[field.key]}
                                                    onChange={(e) => setInput({ ...input, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Başvurulan Pozisyon (Opsiyonel)</label>
                                        <input
                                            type="text"
                                            value={input.position}
                                            onChange={(e) => setInput({ ...input, position: e.target.value })}
                                            placeholder="Senior Software Engineer"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
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
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Oluşturuluyor...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                Mektup Oluştur
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
                                            onClick={handleCopy}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Kopyala"
                                        >
                                            {copied 
                                                ? <Check size={18} className="text-green-400" />
                                                : <Copy size={18} className="text-gray-400" />
                                            }
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                            title="İndir"
                                        >
                                            <Download size={18} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-6 max-h-96 overflow-y-auto">
                                    <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                        {generatedLetter}
                                    </pre>
                                </div>

                                {/* Tips */}
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="text-amber-400 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-amber-300 font-medium text-sm">Kullanım İpuçları</p>
                                            <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                                <li>• Bu mektubu referans verecek kişiye gönderin</li>
                                                <li>• Birlikte gözden geçirip düzenleme yapabilirsiniz</li>
                                                <li>• Spesifik projeler ve sonuçlar eklemek mektubu güçlendirir</li>
                                                <li>• Referans veren kişinin imzası ve iletişim bilgilerini eklemeyi unutmayın</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={resetForm}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Yeni Mektup
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <Download size={20} />
                                        Mektubu İndir
                                    </button>
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
