import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Files, History, Book } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ArchivistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1a1a1a' // Ink Black

    const t = {
        summary: isEn ? 'Archival Philosophy & Ethos' : 'Arşiv Felsefesi ve Etosu',
        experience: isEn ? 'Collection Stewardship & Management' : 'Koleksiyon Yönetimi ve Koruma',
        education: isEn ? 'Foundational Studies & Records' : 'Temel Çalışmalar ve Kayıtlar',
        expertise: isEn ? 'Metadata & Preservation Stack' : 'Metaveri ve Koruma Yığını',
        contact: isEn ? 'Public Access Node' : 'Kamu Erişim Noktası',
        catalog: isEn ? 'Repository Registry' : 'Depo Kaydı'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const lineVariants = {
        hidden: { scaleY: 0 },
        visible: { scaleY: 1, transition: { duration: 1.2, ease: "easeInOut" } }
    }

    return (
        <div className="min-h-full bg-white text-[#1a1a1a] p-0 selection:bg-[#1a1a1a] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* STRUCTURAL GUIDES OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={lineVariants} className="absolute left-10 left-24 top-0 w-px h-full bg-[#1a1a1a]/5 origin-top" />
                <motion.div variants={lineVariants} className="absolute right-10 right-24 top-0 w-px h-full bg-[#1a1a1a]/5 origin-top" />
                <div className="absolute top-1/4 left-0 w-full h-px bg-[#1a1a1a]/5" />
                <div className="absolute top-3/4 left-0 w-full h-px bg-[#1a1a1a]/5" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-[0_0_100px_rgba(0,0,0,0.02)]"
            >
                {/* 1. THE MEMORY KEEPER HEADER */}
                <header className="w-full relative py-20 px-10 px-24 border-b border-[#1a1a1a]">
                    <div className="flex flex-row gap-16 items-start justify-between relative z-10">
                        <div className="flex-1 space-y-12">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-4 px-3 py-1 bg-[#1a1a1a] text-white text-[9px] font-black uppercase tracking-[0.6em] italic">
                                <History className="w-4 h-4" /> ARCHIVE_RECORD_v.5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-6xl text-[9rem] font-light text-[#1a1a1a] tracking-tight leading-none uppercase italic"
                                    style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-10">
                                     <div className="h-[2px] w-20 bg-[#1a1a1a]/20" />
                                     <p className="text-2xl font-black tracking-[0.4em] text-[#1a1a1a]/30 uppercase italic">
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-3 bg-white border border-[#1a1a1a] shadow-xl relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={100} color="#1a1a1a" />
                                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover:scale-100 transition-transform">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/20 italic rotate-90 origin-right">REG_INDEX: {personal.fullName?.split(' ')[0].toUpperCase()}_ARCH</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 mt-16 text-[11px] font-black uppercase tracking-[0.4em] text-[#1a1a1a] italic border-t border-[#1a1a1a]/5 pt-10 font-mono">
                        {personal.email && <div className="flex items-center gap-3 hover:text-stone-400 transition-colors cursor-pointer"><Mail className="w-4 h-4" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-3 hover:text-stone-400 transition-colors cursor-pointer"><Phone className="w-4 h-4" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-stone-100 flex-1">
                    
                    {/* LEFT PANEL: REPOSITORY & STACK */}
                    <aside className="col-span-4 p-8 space-y-24 bg-stone-50/30 border-r border-stone-100">
                        
                        {/* ARCHIVAL ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-8 group bg-white p-10 border border-stone-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <Book className="w-32 h-32" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-stone-300 flex items-center gap-4 italic mb-8 border-b border-stone-200 pb-4">
                                     <Files className="w-5 h-5 text-[#1a1a1a]" /> {t.summary}
                                </h3>
                                <p className="text-[15px] italic font-light leading-relaxed text-[#1a1a1a] relative z-10" style={{ fontFamily: "'EB Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* METADATA STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-stone-300 flex items-center gap-4 italic mb-10 border-b border-stone-200 pb-4">
                                    <Database className="w-5 h-5 text-[#1a1a1a]" /> {t.expertise}
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item py-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[11px] font-black uppercase tracking-widest group-hover/item:text-[#1a1a1a] text-stone-400 transition-colors italic whitespace-nowrap">{skill}</span>
                                                <div className="flex-1 h-px bg-stone-100 mx-4" />
                                                <span className="text-[9px] font-black text-stone-300">TAG_{i+1}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC RECORDS (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-10 bg-[#1a1a1a] text-white space-y-16 shadow-2xl skew-y-[-2deg]">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.8em] text-white/30 text-center italic mb-10 leading-none pb-4 border-b border-white/10 skew-y-[2deg]">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu skew-y-[2deg]">
                                        <p className="text-[9px] font-black text-white/20 group-hover:text-white transition-colors mb-4 uppercase italic tracking-widest">RECORD_FOUNDATION_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic text-white leading-tight uppercase" style={{ fontFamily: "'EB Garamond', serif" }}>{edu.degree}</h4>
                                        <p className="text-[11px] font-black uppercase tracking-widest text-[#d2b48c] mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: STEWARDSHIP ARCHIVE */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-white">
                        
                        {/* THE ARCHIVE (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-300 ${highlightedField === 'experience' ? 'bg-stone-50 p-16 -mx-16 rounded-xl border border-stone-100 shadow-inner' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2em] text-stone-200 mb-20 flex items-center gap-10 italic leading-none justify-start">
                                    <History className="w-8 h-8 text-[#1a1a1a]" /> {t.experience}
                                </h2>
                                <div className="space-y-48">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-stone-50 hover:border-[#1a1a1a] transition-all duration-1000">
                                            <div className="absolute top-0 -left-[2px] w-1 h-32 bg-[#1a1a1a] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-6xl text-[5.5rem] font-light text-[#1a1a1a] tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none" style={{ fontFamily: "'EB Garamond', serif" }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-10 h-[2px] bg-[#1a1a1a]/10 group-hover:w-20 group-hover:bg-[#1a1a1a] transition-all" />
                                                        <p className="text-2xl font-black text-[#1a1a1a]/10 uppercase tracking-[0.6em] italic group-hover:text-stone-300 transition-colors">REPOSITORY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-white bg-[#1a1a1a] px-10 py-4 group-hover:bg-stone-50 group-hover:text-[#1a1a1a] group-hover:border-stone-100 border border-transparent transition-all whitespace-nowrap italic uppercase tracking-[0.4em]">
                                                    {exp.startDate} :: {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-stone-400 leading-relaxed font-light italic opacity-90 group-hover:opacity-100 transition-opacity border-l-[15px] border-stone-50 pl-20 py-10 group-hover:text-[#1a1a1a] group-hover:border-[#1a1a1a]" style={{ fontFamily: "'EB Garamond', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ARCHIVAL SEAL */}
                        <div className="p-20 border border-stone-100 bg-stone-50 text-center group hover:bg-white hover:border-[#1a1a1a] transition-all duration-1000 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-[-20%] right-[-10%] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <History className="w-[400px] h-[400px] rotate-[-20deg]" />
                             </div>
                             <div className="inline-block p-10 border border-[#1a1a1a]/10 mb-10 bg-white shadow-xl relative z-10">
                                <Award className="w-16 h-16 text-[#1a1a1a] opacity-20 group-hover:opacity-100 transition-opacity" />
                             </div>
                             <h4 className="text-[11px] font-black uppercase tracking-[2em] text-stone-200 mb-12 italic leading-none group-hover:text-[#1a1a1a] transition-colors relative z-10">CURATORIAL_TRUST_SEAL</h4>
                             <p className="text-xs font-bold text-stone-300 italic uppercase tracking-[0.3em] group-hover:text-stone-500 transition-colors relative z-10">Certified Historical Record Specialist // UN_ARCHIVE_STANDARDS</p>
                        </div>
                    </main>
                </div>

                {/* THE MEMORY KEEPER FOOTER */}
                <footer className="w-full mt-40 py-24 px-10 px-24 bg-[#1a1a1a] text-white flex flex-row justify-between items-center gap-24 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="flex flex-col items-start gap-12 pt-10 relative z-10">
                         <div className="flex gap-2">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <div key={i} className="w-px h-10 bg-white/20 group-hover:h-20 transition-all duration-[1.5s]" style={{ opacity: i * 0.1 }} />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[18px] uppercase tracking-[1.5em] mb-4 text-white hover:text-stone-300 transition-colors">{personal.fullName} // ARCH_SYS_05.0</p>
                             <p className="text-[10px] uppercase tracking-[0.4em] italic opacity-20 italic">Preserving the Past // Securing the Future // Absolute Accuracy</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-white transition-all duration-1000 relative z-10 p-12 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                         {[Share2, Globe, Database, History].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -25, scale: 2, rotate: 360 }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-all" />
                             </motion.div>
                         ))}
                         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
