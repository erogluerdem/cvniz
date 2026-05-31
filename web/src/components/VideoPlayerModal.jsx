import { X } from 'lucide-react'

export default function VideoPlayerModal({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-5xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-2xl">
                    <video
                        src="/videos/CVniz_AI_Kariyer_Asistanı.mp4"
                        controls
                        autoPlay
                        className="w-full h-full"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
        </div>
    )
}
