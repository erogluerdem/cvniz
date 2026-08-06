import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, FileText, Copy, Check, RefreshCw,
    User, Briefcase, Award, Star, ChevronRight, 
    Download, Calendar, Building2, Users, Target,
    Loader2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'

// Referans türleri
const REFERENCE_TYPES = [
    { 
        id: 'manager', 
        label: 'Yönetici / Supervisor', 
        icon: Briefcase, 
        description: 'Direkt yöneticinizden referans',
    },
    { 
        id: 'colleague', 
        label: 'İş Arkadaşı', 
        icon: Users, 
        description: 'Aynı seviyede çalıştığınız birinden',
    },
    { 
        id: 'client', 
        label: 'Müşteri / Client', 
        icon: Target, 
        description: 'Çalıştığınız bir müşteriden',
    },
    { 
        id: 'professor', 
        label: 'Akademik Referans', 
        icon: Award, 
        description: 'Profesör veya hocadan',
    }
]

// Mektup tonu
const TONES = [
    { id: 'formal', label: 'Resmi', emoji: '📜' },
    { id: 'warm', label: 'Samimi', emoji: '🤝' },
    { id: 'enthusiastic', label: 'Coşkulu', emoji: '🚀' }
]

export default function AIReferenceLetter({ isOpen, onClose }) {
    const { isPremium } = useAuth()
    const { cvs } = useCV()
    
    const [step, setStep] = useState(1)
    
    // State
    const [selectedCV, setSelectedCV] = useState(null)
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
        university: '',
        course: ''
    })
    
    // AI Response State
    const [generatedLetter, setGeneratedLetter] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Mektup panoya kopyalandı!')
    }

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([generatedLetter], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "Referans_Mektubu.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Mektup indirildi!');
    }

    const handleGenerate = async () => {
        if (!selectedCV) {
            toast.error('Lütfen becerileriniz için bir CV seçin.');
            return;
        }

        setIsGenerating(true)
        
        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const cvData = cv?.data || cv

            const response = await aiAPI.writeReferenceLetter({
                referenceType,
                tone,
                input,
                cvData
            });
            
            if (response.success && response.data) {
                let parsedData = response.data;
                if (typeof parsedData === 'string') {
                    try {
                        parsedData = JSON.parse(parsedData);
                    } catch (e) {
                        const jsonStr = parsedData.substring(parsedData.indexOf('{'), parsedData.lastIndexOf('}') + 1);
                        parsedData = JSON.parse(jsonStr);
                    }
                }
                setGeneratedLetter(parsedData.content || parsedData);
                setStep(3);
            } else {
                toast.error(response.error || 'Referans mektubu oluşturulamadı.');
            }
        } catch (error) {
            console.error('Reference generation error:', error)
            toast.error('Bağlantı hatası oluştu.')
        } finally {
            setIsGenerating(false)
        }
    }

    const renderInputFields = () => {
        switch(referenceType) {
            case 'manager':
                return (
                    <>
                        <InputField label="Çalışılan Şirket" value={input.company} onChange={e => setInput({...input, company: e.target.value})} icon={Building2} />
                        <InputField label="Başarı veya Katkı (Neyi övmeli?)" value={input.achievement} onChange={e => setInput({...input, achievement: e.target.value})} isTextArea placeholder="Örn: Satışları %20 artırdı..." />
                        <InputField label="Birlikte Çalışılan Proje / Ekip" value={input.project} onChange={e => setInput({...input, project: e.target.value})} icon={FileText} />
                    </>
                )
            case 'colleague':
                return (
                    <>
                        <InputField label="Çalışılan Şirket" value={input.company} onChange={e => setInput({...input, company: e.target.value})} icon={Building2} />
                        <InputField label="En Güçlü Yönü" value={input.strength} onChange={e => setInput({...input, strength: e.target.value})} isTextArea placeholder="Örn: Harika bir takım oyuncusu ve kriz anlarında soğukkanlı..." />
                        <InputField label="Birlikte Yapılan İş/Proje" value={input.project} onChange={e => setInput({...input, project: e.target.value})} icon={FileText} />
                    </>
                )
            case 'client':
                return (
                    <>
                        <InputField label="Müşteri Şirketi" value={input.company} onChange={e => setInput({...input, company: e.target.value})} icon={Building2} />
                        <InputField label="Memnuniyet Sebebi" value={input.achievement} onChange={e => setInput({...input, achievement: e.target.value})} isTextArea placeholder="Örn: Projeyi zamanından önce, sıfır hatayla teslim etti..." />
                        <InputField label="Gerçekleştirilen Proje" value={input.project} onChange={e => setInput({...input, project: e.target.value})} icon={FileText} />
                    </>
                )
            case 'professor':
                return (
                    <>
                        <InputField label="Üniversite / Kurum" value={input.university} onChange={e => setInput({...input, university: e.target.value})} icon={Building2} />
                        <InputField label="Alınan Ders veya Tez Konusu" value={input.course} onChange={e => setInput({...input, course: e.target.value})} icon={FileText} />
                        <InputField label="Akademik Güçlü Yönü" value={input.strength} onChange={e => setInput({...input, strength: e.target.value})} isTextArea placeholder="Örn: Analitik düşünme yeteneği çok yüksek, araştırmacı..." />
                    </>
                )
            default:
                return null
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
                                <FileText className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">AI Referans Mektubu</h2>
                                <p className="text-sm text-gray-400">Yapay zeka ile profesyonel referanslar</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative z-10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 py-4 border-b border-white/5 bg-black/40">
                        <div className="flex items-center gap-4 max-w-sm">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        step >= s 
                                            ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                            : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                                            step > s ? 'bg-[#10B981]' : 'bg-white/10'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-[#10B981]/30 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Email Type & Tone */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Referans Türü Seçin</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {REFERENCE_TYPES.map(type => {
                                                const Icon = type.icon;
                                                return (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setReferenceType(type.id)}
                                                        className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                                                            referenceType === type.id
                                                                ? 'bg-[#10B981]/10 border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                                            referenceType === type.id ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-black/40 text-gray-400 group-hover:text-white'
                                                        }`}>
                                                            <Icon size={20} />
                                                        </div>
                                                        <div className="text-left flex-1">
                                                            <div className="font-bold text-white mb-1">{type.label}</div>
                                                            <div className="text-sm text-gray-500 line-clamp-1">{type.description}</div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Mektup Tonu</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {TONES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTone(t.id)}
                                                    className={`px-5 py-3 rounded-xl border transition-all duration-300 flex items-center gap-2 font-medium ${
                                                        tone === t.id
                                                            ? 'bg-[#10B981] border-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    <span>{t.emoji}</span>
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 bg-[#10B981] text-black font-bold rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    >
                                        Devam Et <ChevronRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: Details */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <FileText className="text-[#10B981]" size={20} />
                                            Referans Detaylarını Girin
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Referans Alınacak CV (Yeteneklerinizi vurgulamak için) *
                                                </label>
                                                <select
                                                    value={selectedCV || ''}
                                                    onChange={(e) => setSelectedCV(e.target.value)}
                                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                                >
                                                    <option value="">CV Seçiniz...</option>
                                                    {cvs?.map(cv => (
                                                        <option key={cv.id} value={cv.id} className="bg-[#0F1115]">
                                                            {cv.name || 'İsimsiz CV'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Dinamik Alanlar */}
                                            {renderInputFields()}

                                            {/* Genel Alanlar */}
                                            <div className="space-y-4 pt-4 border-t border-white/5">
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Genel Bilgiler</h4>
                                                <InputField label="Referans Verecek Kişinin Adı" value={input.referrerName} onChange={e => setInput({...input, referrerName: e.target.value})} icon={User} />
                                                <InputField label="Beraber Çalışılan/Eğitim Süresi" value={input.duration} onChange={e => setInput({...input, duration: e.target.value})} icon={Calendar} placeholder="Örn: 2 Yıl" />
                                                <InputField label="Başvurulacak Hedef Pozisyon" value={input.position} onChange={e => setInput({...input, position: e.target.value})} icon={Star} placeholder="Örn: Kıdemli Yazılım Geliştirici" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-4 bg-white/5 text-gray-300 font-bold rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !selectedCV}
                                            className="flex-1 py-4 bg-[#10B981] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <><Loader2 size={20} className="animate-spin" /> Oluşturuluyor...</>
                                            ) : (
                                                <><Sparkles size={20} /> Mektubu Yaz</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Results */}
                            {step === 3 && generatedLetter && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden relative group">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button
                                                onClick={handleCopy}
                                                className="p-2 text-gray-400 hover:text-[#10B981] bg-black/60 hover:bg-[#10B981]/10 border border-white/5 hover:border-[#10B981]/20 rounded-xl transition-all backdrop-blur-md"
                                                title="Metni Kopyala"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="p-2 text-gray-400 hover:text-[#10B981] bg-black/60 hover:bg-[#10B981]/10 border border-white/5 hover:border-[#10B981]/20 rounded-xl transition-all backdrop-blur-md"
                                                title="Mektubu İndir"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                        <div className="p-6 md:p-8 text-gray-300 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                                            {generatedLetter}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="px-6 py-4 bg-white/5 text-gray-300 font-bold rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={handleCopy}
                                            className="flex-1 py-4 bg-[#10B981] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                        >
                                            {copied ? <Check size={20} /> : <Copy size={20} />}
                                            Panoya Kopyala
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

function InputField({ label, value, onChange, icon: Icon, isTextArea, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <div className="relative">
                {Icon && !isTextArea && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <Icon size={18} />
                    </div>
                )}
                {isTextArea ? (
                    <textarea
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all resize-none h-24"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all`}
                    />
                )}
            </div>
        </div>
    )
}
