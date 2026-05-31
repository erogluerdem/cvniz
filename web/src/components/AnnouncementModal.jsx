import { useState, useEffect } from 'react';
import { X, Megaphone, Copy, ExternalLink, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnnouncementModal() {
    const [announcement, setAnnouncement] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        checkAnnouncement();
    }, []);

    const checkAnnouncement = async () => {
        try {
            // Check if user has seen this announcement recently
            const lastSeen = localStorage.getItem('last_announcement_seen');
            const hiddenUntil = localStorage.getItem('announcement_hidden_until');

            if (hiddenUntil && new Date(hiddenUntil) > new Date()) {
                return;
            }

            // Fetch active announcement
            const res = await fetch(`${import.meta.env.VITE_API_URL}/announcements/active`);
            
            // Sadece başarılı ve JSON yanıtıysa parse et
            const contentType = res.headers.get("content-type");
            if (res.ok && contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                
                if (data.success && data.announcement) {
                    // If it's a new announcement or different ID
                    if (lastSeen !== data.announcement._id) {
                        setAnnouncement(data.announcement);

                        // Delay showing based on config (default 3s)
                        const delay = data.announcement.startAfter || 3000;
                        setTimeout(() => setIsOpen(true), delay);
                    }
                }
            }
        } catch (error) {
            // Sessizce yoksay, kritik olmayan bir özellik
        }
    };

    const handleClose = (forever = false) => {
        setIsOpen(false);
        if (forever && announcement) {
            // Hide for 24h if dismissed
            const tomorrow = new Date();
            tomorrow.setHours(tomorrow.getHours() + 24);
            localStorage.setItem('announcement_hidden_until', tomorrow.toISOString());
            localStorage.setItem('last_announcement_seen', announcement._id);
        }
    };

    const copyCoupon = () => {
        if (announcement?.couponCode) {
            navigator.clipboard.writeText(announcement.couponCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!announcement) return null;

    const typeColors = {
        info: 'from-blue-500 to-cyan-500',
        success: 'from-green-500 to-emerald-500',
        warning: 'from-amber-500 to-orange-500',
        error: 'from-red-500 to-pink-500'
    };

    const gradient = typeColors[announcement.type] || typeColors.info;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={() => handleClose(true)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Image Header */}
                        {announcement.imageUrl && (
                            <div className="h-48 w-full relative">
                                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10`} />
                                <img
                                    src={announcement.imageUrl}
                                    alt="Duyuru"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => handleClose(true)}
                                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/70 transition-all border border-white/10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div className={`p-8 ${!announcement.imageUrl ? 'pt-12' : ''}`}>
                            {!announcement.imageUrl && (
                                <button
                                    onClick={() => handleClose(true)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Icon & Title */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                                    <Megaphone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                    {announcement.title}
                                </h3>
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                                {announcement.content}
                            </p>

                            {/* Coupon Code Section */}
                            {announcement.couponCode && (
                                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors" onClick={copyCoupon}>
                                    <div className="text-xs font-black text-gray-500 uppercase tracking-widest">KUPON KODUN:</div>
                                    <div className="flex items-center gap-3">
                                        <code className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent tracking-widest`}>
                                            {announcement.couponCode}
                                        </code>
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 group-hover:text-white" />}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleClose(true)}
                                    className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex-1"
                                >
                                    Kapat
                                </button>

                                {announcement.buttonText && announcement.buttonLink && (
                                    <a
                                        href={announcement.buttonLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`px-6 py-3.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-xs font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex-[2] flex items-center justify-center gap-2`}
                                        onClick={() => handleClose(true)}
                                    >
                                        {announcement.buttonText}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
