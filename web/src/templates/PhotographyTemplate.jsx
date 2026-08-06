import React from 'react';
import { Mail, Phone, MapPin, Camera, Image, Share2, Globe, ArrowRight, Zap, Target, Star, Heart, Sparkles, Eye, Maximize, Scan, Aperture, Film, GalleryVertical as Gallery } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PhotographyTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#ffffff'

    const t = {
        summary: isEn ? 'The Visual Narrative' : 'Görsel Anlatı',
        experience: isEn ? 'Exposure & Assignment Log' : 'Pozlama ve Görev Günlüğü',
        education: isEn ? 'Technical Foundation' : 'Teknik Temel',
        expertise: isEn ? 'Optic Specializations' : 'Optik Uzmanlıklar',
        contact: isEn ? 'Signal Node' : 'Sinyal Noktası',
        lingo: isEn ? 'Harmonic Dialogue' : 'Armonik Diyalog'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.5 } }
    }

    const shutterVariants = {
        hidden: { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
        visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.19, 1, 0.22, 1] } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-black text-white p-0 selection:bg-white selection:text-black print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '1rem' : theme?.fontSize === 'Büyük' ? '1.25rem' : '1.15rem',
                lineHeight: '1.6'
            }}>

            {/* VIEWFINDER GRID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-50">
                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/20" />
                <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-white/20" />
                <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-white/20" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center opacity-20">
                     <div className="w-full h-[1px] bg-white" />
                     <div className="w-[1px] h-full bg-white absolute" />
                </div>
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1600px] mx-auto min-h-[297mm] relative overflow-hidden flex flex-col items-center bg-black shadow-[0_0_150px_rgba(255,255,255,0.05)] border-x border-white/5"
            >
                {/* 1. THE EXPOSURE HEADER */}
                <header className="w-full relative min-h-[80vh] flex flex-col items-center justify-center text-center px-10 px-24 border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
                    
                    <motion.div variants={shutterVariants} className="mb-16 space-y-4">
                        <div className="inline-flex items-center gap-4 px-8 py-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.8em] italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <Aperture className="w-4 h-4 animate-spin-slow" /> OPTIC_MASTERY_OS_5.0
                        </div>
                    </motion.div>

                    <motion.h1 
                        variants={shutterVariants} 
                        className="text-6xl text-[15rem] font-light tracking-tighter text-white leading-none uppercase italic"
                        style={{ letterSpacing: '-0.06em' }}
                    >
                        {personal.fullName}
                    </motion.h1>

                    <motion.div variants={shutterVariants} className="mt-16 flex flex-col items-center gap-12">
                         <div className="h-[2px] w-64 bg-white/20 relative">
                             <motion.div 
                                animate={{ x: ['-100%', '100%'] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-white shadow-[0_0_15px_#fff]"
                             />
                         </div>
                         <p className="text-3xl text-4xl font-black italic text-white uppercase tracking-[0.4em] opacity-40">
                            {personal.title}
                         </p>
                    </motion.div>

                    <motion.div variants={shutterVariants} className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {personal.location && <span>{personal.location}</span>}
                        <span>•</span>
                        <span>SHUTTER_PRIORITY</span>
                        <span>•</span>
                        <span>ISO_100</span>
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0">
                    
                    {/* LEFT CANVAS: THE NARRATIVE & ASSIGNMENTS */}
                    <div className="col-span-8 p-10 p-24 space-y-40 border-r border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                        
                        {/* THE VISUAL NARRATIVE (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={shutterVariants} className="group relative">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 mb-16 flex items-center gap-8 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                                     <Eye className="w-6 h-6 text-white" /> {t.summary}
                                </h2>
                                <p className="text-4xl text-6xl font-light italic leading-[1.2] text-white border-l border-white/5 pl-16 group-hover:border-white transition-all duration-1000">
                                    "{personal.summary}"
                                </p>
                            </motion.section>
                        )}

                        {/* EXPOSURE LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={shutterVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-white/5 p-16 -mx-16 shadow-inner border-y border-white/5' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[1em] text-white/20 mb-24 flex items-center gap-10 italic leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <Film className="w-6 h-6 text-white" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l border-white/[0.02] hover:border-white transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -left-[1px] top-0 w-px h-24 bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000 shadow-[0_0_20px_#fff]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-5xl text-7xl font-light text-white tracking-tighter uppercase italic group-hover:translate-x-10 transition-transform duration-1000 leading-none">{exp.position}</h3>
                                                    <p className="text-xl font-black text-white/20 uppercase tracking-[0.5em] italic group-hover:text-white transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>ENTITY_UNIT: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-black text-black bg-white px-10 py-4 group-hover:scale-110 transition-all whitespace-nowrap italic uppercase tracking-widest shadow-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                    {exp.startDate} / {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-white/30 leading-relaxed font-light italic border-l border-white/5 pl-16 py-4 group-hover:border-white group-hover:text-white transition-all duration-700">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* RIGHT CANVAS: OPTICS & SIGNAL */}
                    <aside className="col-span-4 p-12 space-y-32 bg-black relative">
                        
                        {/* OPTIC SPECIALIZATIONS (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="bg-white/5 p-16 border border-white/10 group overflow-hidden relative break-inside-avoid page-break-inside-avoid">
                                <Scan className="absolute -top-10 -right-10 w-48 h-48 text-white opacity-5 group-hover:rotate-[30deg] transition-transform duration-[2s]" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 mb-20 flex items-center gap-6 italic z-10 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <Target className="w-6 h-6 text-white" /> {t.expertise}
                                </h3>
                                <div className="space-y-10 relative z-10">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item py-2 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-2xl font-light italic tracking-[0.1em] group-hover/item:tracking-[0.3em] transition-all uppercase">{skill}</span>
                                                <Maximize className="w-5 h-5 opacity-0 group-hover/item:opacity-100 transition-all duration-700" />
                                            </div>
                                            <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                                                <motion.div 
                                                    initial={{ x: '-100%' }}
                                                    whileInView={{ x: '0%' }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="h-full bg-white shadow-[0_0_10px_#fff]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SIGNAL NODES (CONTACT) */}
                        <section className="bg-white text-black p-16 space-y-12 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-black uppercase tracking-[1em] mb-12 italic text-center" style={{ fontFamily: "'Inter', sans-serif" }}>SIGNAL_NODES</h3>
                            <div className="space-y-8">
                                 {[
                                    { icon: Mail, value: personal.email },
                                    { icon: Phone, value: personal.phone },
                                    { icon: Globe, value: personal.website || 'PORTFOLIO_V1' }
                                 ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer break-inside-avoid page-break-inside-avoid">
                                        <item.icon className="w-6 h-6 group-hover:scale-125 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{item.value}</span>
                                    </div>
                                 ))}
                            </div>
                        </section>

                        {/* TECHNICAL FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className={`p-16 border border-white/5 transition-all duration-500 ${highlightedField === 'education' ? 'bg-white text-black shadow-2xl scale-105' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[1.2em] text-white/20 mb-full border-b border-white/5 pb-10 mb-20 italic text-center uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                     {t.education}
                                </h3>
                                <div className="space-y-20">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[9px] font-black opacity-40 mb-6 group-hover:opacity-100 transition-opacity tracking-[0.4em] italic uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>ACADEMIC_EXP_0{i + 1}</p>
                                            <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform uppercase leading-none">{edu.degree}</h4>
                                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* LENS-SEAL */}
                        <div className="p-24 border border-white/5 text-center group relative overflow-hidden">
                             <Gallery className="absolute -top-10 -right-10 w-48 h-48 text-white/5 group-hover:-translate-y-12 transition-transform duration-[4s]" />
                             <Image className="w-16 h-16 text-white/5 mx-auto mb-16 group-hover:text-white transition-colors duration-[1.5s]" />
                             <h4 className="text-[11px] font-black uppercase tracking-[1.5em] text-white/10 mb-12 italic leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>OPTIC_VERIFICATION_LOG</h4>
                             {theme?.showQrCode && (
                                <div className="inline-block p-4 bg-white/5 backdrop-blur-xl border border-white/10 relative group-hover:bg-white group-hover:p-6 transition-all duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={90} color="#ffffff" />
                                </div>
                             )}
                        </div>
                    </aside>
                </div>

                {/* THE EXPOSURE FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-24 border-t border-white/10 bg-black flex flex-row justify-between items-center gap-24 group overflow-hidden relative">
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-1.5">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <div key={i} className="w-1.5 h-12 bg-white/5 group-hover:bg-white transition-all duration-[2s]" style={{ opacity: i * 0.1, height: `${i * 8}px` }} />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[16px] uppercase tracking-[1.5em] mb-6 text-white shadow-white">{personal.fullName} // OPTIC_CORE_OS_5.0</p>
                             <p className="text-[11px] uppercase tracking-[0.5em] italic opacity-20" style={{ fontFamily: "'Inter', sans-serif" }}>Visual Curation // Optic Integrity // Global Recognition</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-white transition-colors relative z-10">
                         {[Share2, Globe, Aperture, Camera].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -20, scale: 1.5 }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-colors" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
