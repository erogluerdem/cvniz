import { useState, useRef } from 'react'
import { X, Video, Square, Play, Download, Trash2, Camera, AlertCircle } from 'lucide-react'

export default function VideoCVModal({ isOpen, onClose, cv }) {
    const [recording, setRecording] = useState(false)
    const [videoUrl, setVideoUrl] = useState(null)
    const [error, setError] = useState(null)
    const videoRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            videoRef.current.srcObject = stream
            mediaRecorderRef.current = new MediaRecorder(stream)

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' })
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
        mediaRecorderRef.current.stop()
        setRecording(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Video CV Oluştur</h2>
                            <p className="text-sm text-gray-400">30 saniyelik etkileyici bir giriş videosu çekin.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
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
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50">
                                <div className="w-2 h-2 rounded-full bg-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Kayıtta</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex justify-center gap-4">
                        {!videoUrl ? (
                            !recording ? (
                                <button
                                    onClick={startRecording}
                                    className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105"
                                >
                                    <Video className="w-5 h-5" />
                                    Kayda Başla
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-lg shadow-white/20 transition-all hover:scale-105"
                                >
                                    <Square className="w-5 h-5 fill-slate-900" />
                                    Kaydı Durdur
                                </button>
                            )
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setVideoUrl(null)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Yeniden Çek
                                </button>
                                <button
                                    className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Kaydet & CV'ye Ekle
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-red-500/5 text-center border-t border-white/5">
                    <p className="text-xs text-red-400/60 font-medium">
                        İdeal bir video CV: Kendinizi tanıtın, uzmanlığınızı belirtin ve ne aradığınızı söyleyin.
                    </p>
                </div>
            </div>
        </div>
    )
}
