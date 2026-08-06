import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Video, Square, Play, Download, Trash2, Camera, AlertCircle, Lock, UploadCloud } from 'lucide-react'

export default function VideoCVModal({ isOpen, onClose, cv, isPremium }) {
    const [recording, setRecording] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)
    const [videoBlob, setVideoBlob] = useState(null)
    const [error, setError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const videoRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const startRecording = async () => {
        if (!isPremium) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            mediaRecorderRef.current = new MediaRecorder(stream)

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' })
                setVideoBlob(blob)
                setVideoUrl(URL.createObjectURL(blob))
                chunksRef.current = []
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorderRef.current.start()
            setRecording(true)
            setError(null)
        } catch (err) {
            setError('Kameraya erişilemedi. Lütfen izinleri kontrol edin.')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop()
            setRecording(false)
        }
    }

    const uploadVideo = async () => {
        if (!videoBlob || !cv?.id || !isPremium) return;
        setIsUploading(true)
        setError(null)
        try {
            const formData = new FormData();
            formData.append('video', videoBlob, 'video-cv.webm');

            const res = await fetch(`/api/cv/${cv.id}/video`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            })

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Video yüklenemedi.')
            }

            onClose(); // Close on success
        } catch (err) {
            setError(err.message)
        } finally {
            setIsUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] border border-[#10B981]/20 rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] relative"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

                    <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                                <Video className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight">Video CV Oluştur</h2>
                                <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest mt-0.5">Etkileyici Bir Giriş Çekin</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 relative z-10">
                        {!isPremium && (
                            <div className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 flex flex-col items-center justify-center text-center">
                                <Lock className="w-8 h-8 text-gray-500 mb-2" />
                                <h3 className="text-white font-bold mb-1">Premium Özellik</h3>
                                <p className="text-sm text-gray-400">Özgeçmişinize etkileyici bir Video CV eklemek için Premium plana ihtiyacınız var.</p>
                            </div>
                        )}
                        <div className="aspect-video bg-black/50 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl shadow-black">
                            {videoUrl ? (
                                <video src={videoUrl} controls className="w-full h-full object-cover" />
                            ) : (
                                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                            )}

                            {!recording && !videoUrl && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                    <Camera className="w-12 h-12 text-white/20" />
                                </div>
                            )}

                            {recording && (
                                <div className="absolute top-6 right-6 flex items-center gap-3 px-4 py-2 bg-red-500/90 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                    <motion.div 
                                        animate={{ opacity: [1, 0.2, 1] }} 
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-2.5 h-2.5 rounded-full bg-white" 
                                    />
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">Kayıtta</span>
                                </div>
                            )}
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold flex items-center gap-2"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 flex justify-center gap-4">
                            {!videoUrl ? (
                                !recording ? (
                                    <button
                                        onClick={startRecording}
                                        disabled={!isPremium}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all active:scale-[0.98] disabled:opacity-50 ${isPremium ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {isPremium ? <Video className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                        {isPremium ? 'KAYDA BAŞLA' : 'PREMIUM GEREKLİ'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all active:scale-[0.98]"
                                    >
                                        <Square className="w-5 h-5 fill-black" />
                                        KAYDI DURDUR
                                    </button>
                                )
                            ) : (
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => {
                                            setVideoUrl(null)
                                            setVideoBlob(null)
                                        }}
                                        disabled={isUploading}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black transition-all disabled:opacity-50"
                                    >
                                        <Trash2 className="w-5 h-5 text-gray-400" />
                                        YENİDEN ÇEK
                                    </button>
                                    <button
                                        onClick={uploadVideo}
                                        disabled={isUploading}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-black rounded-2xl font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <>
                                                <UploadCloud className="w-5 h-5 animate-bounce" />
                                                YÜKLENİYOR...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-5 h-5" />
                                                CV'YE EKLE
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-5 bg-[#10B981]/5 text-center border-t border-white/5 backdrop-blur-sm relative z-10">
                        <p className="text-xs text-[#10B981]/70 font-medium">
                            <strong className="text-[#10B981] font-bold">İPUCU:</strong> İdeal bir video CV: Kendinizi tanıtın, uzmanlığınızı belirtin ve ne aradığınızı kısa ve öz söyleyin. (Max: 60sn)
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
