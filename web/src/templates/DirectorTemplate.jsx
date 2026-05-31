import React from 'react';
import { Mail, Phone, MapPin, Film, Video, Tv, Play, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, Layers, Maximize, Monitor, Clapperboard, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function DirectorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#0ea5e9' // Cinematic Blue

    const t = {
        summary: isEn ? 'The Cinematic Vision' : 'Sinematik Vizyon',
        experience: isEn ? 'Filmography & Directorial Credits' : 'Filmografi ve Yönetmenlik Kredileri',
        education: isEn ? 'Foundational Cinema Studies' : 'Temel Sinema Çalışmaları',
        expertise: isEn ? 'Technical Mastery' : 'Teknik Yetkinlikler',
        contact: isEn ? 'Vision Access' : 'Vizyon Erişimi',
        awards: isEn ? 'Festival & Award Recognition' : 'Festival ve Ödül Başarıları',
        collaboration: isEn ? 'Key Collaborators' : 'Temel İşbirlikleri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    }

    const cinematicVariants = {
        hidden: { opacity: 0, x: -30, scale: 1.05 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1, ease: [0.19, 1, 0.22, 1] } }
    }

    return (
        <div className="min-h-full bg-[#050505] text-[#d4d4d8] p-0 selection:bg-[#0ea5e9] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* CINEMATIC GRAIN & LIGHT LEAK OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative overflow-hidden flex flex-col bg-[#050505] shadow-[0_0_100px_rgba(14,165,233,0.1)]"
            >
                {/* 1. THE VISIONARY HEADER (WIDE ASPECT) */}
                <header className="w-full relative py-24 px-10 px-20 border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-transparent overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_20px_#0ea5e9]"
                    />

                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div variants={cinematicVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-black uppercase tracking-[0.6em] border border-[#0ea5e9]/20 italic">
                                <Clapperboard className="w-4 h-4" /> DIRECTOR_VISION_OS_5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={cinematicVariants} 
                                    className="text-7xl text-[10rem] font-black text-white tracking-tighter leading-[0.85] uppercase italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={cinematicVariants} className="flex items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#0ea5e9]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-white/30 uppercase italic">
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={cinematicVariants} className="flex flex-col items-center items-end gap-12">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-3xl group hover:scale-110 hover:border-[#0ea5e9]/50 transition-all duration-700 shadow-2xl relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#ffffff" />
                                    <div className="absolute -top-4 -left-4 bg-[#0ea5e9] text-white text-[8px] px-3 py-1 font-black italic rounded-full shadow-lg">SHOW_REEL</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">FRAME_RATE: 24FPS // TRUE_VISION</p>
                        </motion.div>
                    </div>

                    <motion.div variants={cinematicVariants} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
                        {personal.email && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#0ea5e9]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#0ea5e9]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#0ea5e9]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-white/5 flex-1 bg-[#050505]">
                    
                    {/* LEFT CANVAS: MANIFESTO & FILMOGRAPHY */}
                    <main className="col-span-8 p-10 p-20 space-y-40 border-r border-white/5">
                        
                        {/* CREATIVE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={cinematicVariants} className="group relative">
                                <div className="flex items-center gap-8 mb-16">
                                     <Lightbulb className="w-8 h-8 text-[#0ea5e9]" />
                                     <h2 className="text-[11px] font-black uppercase tracking-[1em] text-white/10 italic leading-none">{t.summary}</h2>
                                     <div className="flex-1 h-px bg-white/5" />
                                </div>
                                <p className="text-4xl text-5xl font-black italic leading-[1.2] text-white border-l-[30px] border-white/5 pl-16 group-hover:border-[#0ea5e9] transition-all duration-1000">
                                    "{personal.summary}"
                                </p>
                            </motion.section>
                        )}

                        {/* FILMOGRAPHY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={cinematicVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-white/5 p-16 -mx-16 shadow-2xl skew-x-[-2deg]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[1.5em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <Film className="w-8 h-8 text-[#0ea5e9]" /> {t.experience}
                                </h2>
                                <div className="space-y-32">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l border-white/5 hover:border-[#0ea5e9] transition-all duration-[1.5s]">
                                            <div className="absolute -left-[1.5px] top-0 w-1 h-32 bg-[#0ea5e9] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000 shadow-[0_0_20px_#0ea5e9]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-10 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-5xl text-7xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <p className="text-2xl font-black text-[#0ea5e9] uppercase tracking-[0.5em] italic opacity-30 group-hover:opacity-100 transition-opacity">STUDIO: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-white/5 border border-white/10 px-10 py-4 group-hover:bg-[#0ea5e9] transition-all whitespace-nowrap italic uppercase tracking-[0.4em] shadow-2xl">
                                                    {`${exp.startDate} > ${exp.endDate}`}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-white/30 leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity border-l border-white/5 pl-16 py-4 group-hover:text-white group-hover:border-[#0ea5e9] bg-white/[0.02]">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </main>

                    {/* RIGHT CANVAS: TECHNICAL & COLLABORATION */}
                    <aside className="col-span-4 p-12 space-y-32 bg-[#0a0a0a]/50">
                        
                        {/* TECHNICAL MASTERY (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="bg-white/5 backdrop-blur-3xl p-16 border-r-[20px] border-[#0ea5e9] group relative overflow-hidden transition-all duration-700 hover:bg-white/10">
                                <Maximize className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 group-hover:scale-125 transition-transform duration-[4s]" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 mb-24 flex items-center gap-6 italic z-10 relative leading-none">
                                    <Target className="w-8 h-8 text-[#0ea5e9]" /> {t.expertise}
                                </h3>
                                <div className="space-y-14 relative z-10">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-2xl font-black italic tracking-[0.1em] text-white group-hover/item:text-[#0ea5e9] transition-colors uppercase leading-none">{skill}</span>
                                                <Zap className="w-4 h-4 text-[#0ea5e9] opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-2" />
                                            </div>
                                            <div className="h-1 bg-white/5 relative overflow-hidden">
                                                <motion.div 
                                                    initial={{ x: '-100%' }}
                                                    whileInView={{ x: '0%' }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-blue-900 to-[#0ea5e9] shadow-[0_0_15px_#0ea5e9]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EDUCATION & STUDIES */}
                        {education.length > 0 && (
                            <section className={`p-16 border-l-[15px] border-white/10 transition-all duration-300 ${highlightedField === 'education' ? 'bg-[#0ea5e9] text-white shadow-[0_0_50px_#0ea5e9]' : 'bg-white/5'}`}>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] opacity-30 mb-full border-b border-white/5 pb-10 mb-24 italic text-center uppercase">
                                     <GraduationCap className="w-12 h-12 mb-10 text-[#0ea5e9] mx-auto group-hover:text-white transition-colors" /> {t.education}
                                </h3>
                                <div className="space-y-20">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center">
                                            <p className="text-[9px] font-black opacity-40 mb-6 group-hover:opacity-100 transition-opacity tracking-[0.4em] italic uppercase">CINEMA_THESIS_0{i + 1}</p>
                                            <h4 className="text-4xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform uppercase leading-none">{edu.degree}</h4>
                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#0ea5e9] group-hover:text-white transition-colors">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FESTIVAL & AWARDS */}
                        <div className="p-24 bg-gradient-to-br from-[#111111] to-black border-2 border-[#0ea5e9] text-center group relative overflow-hidden shadow-[20px_20px_0_rgba(14,165,233,0.1)] hover:shadow-none transition-all duration-700">
                             <Award className="absolute -top-10 -left-10 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-[4s]" />
                             <h4 className="text-[11px] font-black uppercase tracking-[1.5em] text-[#0ea5e9] mb-12 italic leading-none">{t.awards}</h4>
                             <div className="space-y-4 relative z-10 text-white group-hover:text-[#0ea5e9] transition-colors">
                                <p className="text-2xl font-black italic leading-none uppercase">Official Selection // Cannes 2024</p>
                                <p className="text-2xl font-black italic leading-none uppercase text-white/30 group-hover:text-white transition-colors">Best Director // Berlinale '23</p>
                             </div>
                             <div className="flex justify-center gap-12 mt-12 text-white/10 group-hover:text-[#0ea5e9] transition-all duration-[1.5s]">
                                {[Film, Monitor, Video].map((Icon, i) => <Icon key={i} className="w-10 h-10" />)}
                             </div>
                        </div>
                    </aside>
                </div>

                {/* THE CINEMATIC FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-24 border-t border-white/5 bg-[#0a0a0a] text-white flex flex-row justify-between items-center gap-24 group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent shadow-[0_0_20px_#0ea5e9]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="w-2 h-16 bg-[#0ea5e9] group-hover:h-32 transition-all duration-[1s]" style={{ opacity: i * 0.12 }} />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[18px] uppercase tracking-[1.5em] mb-6 text-[#0ea5e9] shadow-[#0ea5e9]">{personal.fullName} // DIR_CORE_OS_5.0</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-20">Artistic Innovation // Cinematic Mastery // Global Presence</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-[#0ea5e9] transition-colors relative z-10 p-10 bg-white/5 rounded-full border border-white/5 backdrop-blur-3xl">
                         {[Share2, Globe, Layers, Play].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -25, scale: 1.8, color: '#ffffff' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-colors shadow-2xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
