import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Sparkles, X, Loader2, Upload, User, CheckCircle2 } from 'lucide-react'
export default function AIHeadshotModal({ isOpen, onClose, onSelectImage }) {
    const [step, setStep] = useState('upload') // upload, processing, results
    const [uploadedImage, setUploadedImage] = useState(null)
    const [results, setResults] = useState([])
    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setUploadedImage(reader.result)
                setStep('processing')
                simulateProcessing()
            }
            reader.readAsDataURL(file)
        }
    }
    const simulateProcessing = () => {
        setTimeout(() => {
            setResults([
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256'
            ])
            setStep('results')
        }, 3000)
    }
    const handleSelect = (img) => {
        onSelectImage(img)
        onClose()
        setTimeout(() => {
            setStep('upload')
            setUploadedImage(null)
            setResults([])
        }, 500)
    }
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="absolute inset-0 bg-[#0f1115]/80 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Headshot</h2>
                            <p className="text-sm text-slate-400">Sıradan fotoğrafınızı profesyonel portreye dönüştürün</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Camera className="w-10 h-10 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Günlük bir fotoğrafınızı yükleyin</h3>
                                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                                        Yüzünüzün net göründüğü herhangi bir fotoğrafı yükleyin, yapay zeka sizin için stüdyo kalitesinde profesyonel CV fotoğrafları üretsin.
                                    </p>
                                </div>
                                <label className="cursor-pointer group">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    <div className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold flex items-center gap-3 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                                        <Upload className="w-5 h-5" />
                                        Fotoğraf Yükle
                                    </div>
                                </label>
                            </motion.div>
                        )}
                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center text-center space-y-8 py-8"
                            >
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30">
                                        <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover opacity-50" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Yapay Zeka Çalışıyor...</h3>
                                    <p className="text-sm text-slate-400">Sizin için profesyonel varyasyonlar üretiliyor. (Demo amaçlı simüle edilmektedir)</p>
                                </div>
                            </motion.div>
                        )}
                        {step === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-sm font-bold mb-4">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Fotoğraflarınız Hazır!
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">En beğendiğiniz portreyi seçin</h3>
                                    <p className="text-sm text-slate-400">Seçtiğiniz fotoğraf doğrudan CV'nize eklenecektir.</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {results.map((img, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => handleSelect(img)}
                                            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                                        >
                                            <img src={img} alt={`Result ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <span className="text-xs font-bold text-white px-3 py-1.5 bg-blue-500 rounded-lg">Seç</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-center mt-6">
                                    <button 
                                        onClick={() => setStep('upload')}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        Farklı fotoğraf yükle
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
