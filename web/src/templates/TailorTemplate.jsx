import React from 'react';
import { Mail, Phone, MapPin, Scissors, Ruler, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Shirt } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function TailorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1c1c1c' // Master Charcoal

    const t = {
        summary: isEn ? 'The Art of the Silhouette' : 'Silüet Sanatı',
        experience: isEn ? 'The Cutting Log & Bespoke Credits' : 'Kesim Günlüğü ve Ismarlama Krediler',
        education: isEn ? 'Apprenticeship & Foundation' : 'Çıraklık ve Temel Eğitim',
        expertise: isEn ? 'Fabric Mastery & Technique' : 'Kumaş Ustalığı ve Teknik',
        contact: isEn ? 'Consultation Node' : 'Danışma Noktası',
        manifesto: isEn ? 'Tailor\'s Manifesto' : 'Terzi Manifestosu'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
    }

    const stitchVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
    }

    return (
        <div className="min-h-full bg-[#fdfdfc] text-[#1c1c1c] p-0 selection:bg-[#1c1c1c] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* NATURAL LINEN OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.06]" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative overflow-hidden flex flex-col bg-white shadow-2xl border-x border-stone-100"
            >
                {/* 1. THE BESPOKE HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b-4 border-[#1c1c1c] bg-stone-50/50">
                    <div className="flex flex-row gap-16 items-start justify-between relative z-10">
                        <div className="flex-1 space-y-10">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-1 bg-[#1c1c1c] text-white text-[10px] font-black uppercase tracking-[0.8em] italic">
                                <Scissors className="w-4 h-4" /> MASTER_TAILOR_v.5.2
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl text-[10rem] font-light text-[#1c1c1c] tracking-tighter leading-none uppercase italic"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-10">
                                     <div className="h-px w-20 bg-[#1c1c1c]/20" />
                                     <p className="text-2xl font-black tracking-[0.4em] text-[#1c1c1c]/40 uppercase italic">
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-wrap items-center gap-10 text-[11px] font-black uppercase tracking-[0.4em] text-stone-400 pt-8"
                            >
                                {personal.email && <div className="flex items-center gap-4 hover:text-black transition-colors cursor-pointer"><Mail className="w-4 h-4" /> {personal.email}</div>}
                                {personal.phone && <div className="flex items-center gap-4 hover:text-black transition-colors cursor-pointer"><Phone className="w-4 h-4" /> {personal.phone}</div>}
                                {personal.location && <div className="flex items-center gap-4"><MapPin className="w-4 h-4" /> {personal.location}</div>}
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-10">
                             {theme?.showQrCode ? (
                                <div className="p-3 bg-white border border-[#1c1c1c]/10 shadow-xl relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={100} color="#1c1c1c" />
                                    <div className="absolute -top-3 -right-3 bg-[#1c1c1c] text-white px-2 py-0.5 text-[8px] font-black italic tracking-widest">BESPOKE_QR</div>
                                </div>
                             ) : (
                                <div className="w-24 h-24 rounded-full border border-dashed border-[#1c1c1c]/20 flex items-center justify-center">
                                    <Shirt className="w-12 h-12 text-stone-100" />
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 italic rotate-90 origin-right">REG_ARTISAN_772</p>
                        </motion.div>
                    </div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-stone-100 flex-1">
                    
                    {/* LEFT PANEL: CRAFT & FABRIC */}
                    <aside className="col-span-4 p-8 space-y-24 bg-stone-50/50 border-r border-[#1c1c1c]/5">
                        
                        {/* THE TAILOR'S MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-stone-300 flex items-center gap-4 italic mb-8 border-b border-stone-200 pb-4">
                                    <PenTool className="w-5 h-5 text-[#1c1c1c]" /> {t.manifesto}
                                </h3>
                                <p className="text-xl italic font-light leading-relaxed text-[#1c1c1c]/70 hover:text-black transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* FABRIC MASTERY (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-stone-300 flex items-center gap-4 italic mb-8 border-b border-stone-200 pb-4">
                                    <Layers className="w-5 h-5 text-[#1c1c1c]" /> {t.expertise}
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[15px] font-black uppercase tracking-widest group-hover/item:text-black text-[#1c1c1c]/60 transition-colors italic">{skill}</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-stone-200 relative overflow-hidden">
                                                <div className="h-full bg-[#1c1c1c] translate-x-[-100%] group-hover/item:translate-x-0 transition-transform duration-1000" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* APPRENTICESHIP (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-8 bg-white border border-[#1c1c1c]/5 shadow-sm space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-stone-200 text-center italic mb-10 leading-none pb-4 border-b border-stone-50">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-black text-stone-300 group-hover:text-[#1c1c1c] transition-colors mb-2 uppercase italic tracking-widest">MASTER_STUDY_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic text-black leading-tight uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{edu.degree}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-2">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: THE CUTTING LOG */}
                    <main className="col-span-8 p-10 p-16 space-y-32 bg-white">
                        
                        {/* EXPERIENCE SECTION */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-300 ${highlightedField === 'experience' ? 'bg-[#1c1c1c]/5 p-12 -mx-12 rounded-xl shadow-inner' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[1.5em] text-stone-200 mb-16 flex items-center gap-10 italic leading-none justify-start">
                                    <Scissors className="w-8 h-8 text-[#1c1c1c]" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-stone-100 hover:border-[#1c1c1c] transition-all duration-1000">
                                            {/* STITCH DECORATION */}
                                            <div className="absolute top-0 -left-[1.5px] w-1 h-32 bg-[#1c1c1c] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-10 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-6xl text-7xl font-light text-[#1c1c1c] tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <Ruler className="w-5 h-5 text-stone-200 group-hover:rotate-45 transition-transform" />
                                                        <p className="text-2xl font-black text-[#1c1c1c]/20 uppercase tracking-[0.5em] italic group-hover:text-black transition-colors">HOUSE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-white bg-[#1c1c1c] px-10 py-4 group-hover:bg-[#1c1c1c]/20 group-hover:text-[#1c1c1c] transition-all whitespace-nowrap italic uppercase tracking-[0.4em]">
                                                    {`${exp.startDate} > ${exp.endDate}`}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-stone-400 leading-relaxed font-light italic opacity-90 group-hover:opacity-100 transition-opacity pl-20 py-8 border-l-8 border-stone-50 group-hover:border-[#1c1c1c] group-hover:text-black" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SIGNATURE SECTION */}
                        <section className="p-16 border-2 border-dashed border-[#1c1c1c]/10 bg-stone-50/50 text-center group hover:border-[#1c1c1c] transition-all duration-1000">
                             <div className="inline-block p-10 bg-white border border-[#1c1c1c]/10 mb-10 shadow-xl group-hover:scale-110 transition-transform">
                                <Award className="w-16 h-16 text-[#1c1c1c]/20 group-hover:text-[#1c1c1c]" />
                             </div>
                             <h4 className="text-[11px] font-black uppercase tracking-[2em] text-[#1c1c1c]/10 mb-12 italic leading-none group-hover:text-black transition-colors">CRAFT_INTEGRITY_SEAL</h4>
                             <p className="text-xs font-bold text-stone-300 italic uppercase tracking-[0.3em] group-hover:text-stone-500 transition-colors">Certified Bespoke Pattern Cutter // Savile Row Standard</p>
                        </section>
                    </main>
                </div>

                {/* THE BESPOKE FOOTER */}
                <footer className="w-full mt-40 py-24 px-10 px-16 bg-[#1c1c1c] text-white flex flex-row justify-between items-center gap-24 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[15px] bg-[#1c1c1c] border-b border-white/5" />
                    <div className="flex flex-col items-start gap-12 relative z-10 pt-10">
                         <div className="flex gap-1.5 overflow-hidden">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <div key={i} className="w-[1px] h-8 bg-white/20 group-hover:h-16 transition-all duration-[1s]" style={{ opacity: i * 0.1 }} />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[20px] uppercase tracking-[1.5em] mb-4 text-white hover:text-stone-400 transition-colors">{personal.fullName} // BES_CORE_v5.2</p>
                             <p className="text-[11px] uppercase tracking-[0.5em] italic opacity-20 italic">Uncompromising Quality // Sartorial Mastery // Global Standard</p>
                        </div>
                    </div>
                    <div className="flex gap-12 text-white/5 group-hover:text-white transition-all duration-1000 relative z-10 p-10 bg-white/5 border border-white/10 rounded-full">
                         {[Share2, Globe, Ruler, Scissors].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -20, scale: 1.8, color: '#f5f5f0' }}>
                                 <Icon className="w-10 h-10 cursor-pointer transition-all" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
