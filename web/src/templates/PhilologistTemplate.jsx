import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Book, Languages, History, Archive, Pen, Feather } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PhilologistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#991b1b' // Crimson Gloss

    const t = {
        summary: isEn ? 'Lexical Philology & Vision' : 'Sözcükbilimsel Filoloji ve Vizyon',
        experience: isEn ? 'Etymological Lineage & Manuscript Log' : 'Etimolojik Soyağacı ve Elyazması Günlüğü',
        education: isEn ? 'Scholarly Foundation & Classics' : 'Akademik Temel ve Klasikler',
        expertise: isEn ? 'Philological & Paleographic Stack' : 'Filolojik ve Paleografik Yığın',
        contact: isEn ? 'Scriptorium Node' : 'Yazı Odası Noktası',
        log: isEn ? 'Manuscript Restoration Registry' : 'Elyazması Restorasyon Kaydı',
        linguistics: isEn ? 'Ancient Language Mastery' : 'Antik Dil Ustalığı'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const parchmentVariants = {
        animate: {
            opacity: [0.3, 0.4, 0.3],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#fdf6e3] text-[#27272a] p-0 selection:bg-[#991b1b] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* PARCHMENT OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={parchmentVariants} animate="animate" className="absolute inset-0 bg-[#fdf6e3]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")' }} />
                <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-black/5 to-transparent" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-[#27272a]/5"
            >
                {/* 1. THE WORD ARCHAEOLOGIST HEADER */}
                <header className="w-full relative py-24 px-10 px-20 border-b-[5px] border-[#991b1b] bg-[#fdf6e3]">
                    <div className="absolute top-0 right-0 p-12 opacity-5 italic text-[120px] font-black select-none pointer-events-none">
                        ABΓΔ
                    </div>
                    
                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-16 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#27272a] text-[#fdf6e3] text-[10px] font-black uppercase tracking-[0.8em] italic shadow-xl">
                                <History className="w-4 h-4" /> SCRIPTORIUM_NODE_v10.2
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-6xl text-[11rem] font-black text-stone-900 tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-12 justify-start">
                                     <div className="h-px w-32 bg-[#991b1b]" />
                                     <p className="text-4xl font-light tracking-[0.2em] text-[#991b1b] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-4">
                                        {['CLASSICS', 'SANSKRIT', 'HERMENEUTICS'].map(tag => (
                                            <span key={tag} className="px-4 py-1 bg-[#27272a]/5 border border-[#27272a]/10 text-[10px] font-black text-[#27272a]/40 tracking-widest italic uppercase">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-16 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-[#27272a]/10 shadow-[0_50px_100px_rgba(39,39,42,0.1)] relative group hover:-rotate-3 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={120} color="#27272a" />
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Feather className="w-8 h-8 text-[#991b1b]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#27272a]/20 italic rotate-90 origin-right">CODEX: {personal.fullName?.split(' ')[0].toUpperCase()}_RES</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-16 mt-20 text-[13px] font-light tracking-[0.4em] text-[#27272a] italic border-t border-[#991b1b]/10 pt-16">
                        {personal.email && <div className="flex items-center gap-6 hover:text-[#991b1b] transition-colors cursor-pointer"><Mail className="w-6 h-6 text-[#991b1b]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-6 hover:text-[#991b1b] transition-colors cursor-pointer"><Phone className="w-6 h-6 text-[#991b1b]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-6"><MapPin className="w-6 h-6 text-[#991b1b]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: SCHOLARSHIP & LINEAGE */}
                    <aside className="col-span-4 p-12 space-y-40 bg-[#fdf6e3]/50 border-r border-[#27272a]/5">
                        
                        {/* THE PHILOLOGIST ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-12 group bg-white p-12 border border-[#27272a]/10 shadow-sm relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                    <BookOpen className="w-32 h-32" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#27272a]/20 flex items-center gap-6 italic mb-10 border-b border-[#27272a]/10 pb-6">
                                     <Archive className="w-8 h-8 text-[#991b1b]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-[#27272a]/80 group-hover:text-black transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* ANCIENT LANGUAGES (SKILLS) */}
                        <section className="space-y-16 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#27272a]/20 flex items-center gap-6 italic mb-12 border-b border-[#27272a]/10 pb-8">
                                <Languages className="w-8 h-8 text-[#991b1b]" /> {t.linguistics}
                            </h3>
                            <div className="space-y-12">
                                {skills.map((skill, i) => (
                                    <div key={i} className="group/item relative pb-4 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-4 italic">
                                            <span className="text-[20px] font-light text-[#27272a]/60 group-hover/item:text-black transition-colors tracking-widest">{skill}</span>
                                            <span className="text-[10px] font-black text-[#991b1b]/40 italic tracking-widest uppercase">PROFICIENT</span>
                                        </div>
                                        <div className="h-px w-full bg-[#27272a]/5 group-hover/item:bg-[#991b1b]/20 transition-all duration-700" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SCHOLARLY FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-16 border-2 border-double border-[#27272a]/10 bg-white text-center shadow-inner italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.8em] text-[#27272a]/10 text-center mb-16 leading-none pb-6 border-b border-[#27272a]/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu mb-16 last:mb-0 break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black text-[#27272a]/20 mb-6 tracking-[0.5em]">ACADEMIC_THREAD_0{i + 1}</p>
                                        <h4 className="text-4xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-black">{edu.degree}</h4>
                                        <p className="text-[14px] font-black tracking-[0.4em] text-[#991b1b]/60 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: MANUSCRIPT LOG */}
                    <main className="col-span-8 p-10 p-32 space-y-64 bg-white shadow-inner">
                        
                        {/* THE LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#fdf6e3]/30 p-24 -mx-24 rounded-[4rem] border border-[#27272a]/10 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[13px] font-black tracking-[3em] text-[#27272a]/5 mb-32 flex items-center justify-center gap-12 italic leading-none justify-start uppercase">
                                    <History className="w-12 h-12 text-[#991b1b]" /> {t.experience}
                                </h2>
                                <div className="space-y-80">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-[#27272a]/10 hover:border-[#991b1b] transition-all duration-[1s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-px h-64 bg-[#991b1b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-20 gap-16">
                                                <div className="space-y-8 flex-1">
                                                    <h3 className="text-6xl text-[9rem] font-black text-stone-900 tracking-tighter italic group-hover:text-[#991b1b] transition-colors duration-[1s] leading-[0.85]">{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-24 bg-[#27272a]/10 group-hover:w-48 group-hover:bg-[#991b1b] transition-all duration-1000" />
                                                        <p className="text-4xl font-light italic text-[#27272a]/40 tracking-[0.2em] group-hover:text-black transition-colors">ARCHIVE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[13px] font-black text-[#fdf6e3] bg-[#27272a] px-12 py-6 group-hover:bg-[#991b1b] transition-all italic tracking-[0.6em] whitespace-nowrap leading-none uppercase">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-stone-500 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-[#fdf6e3] pl-24 py-20 group-hover:text-black group-hover:border-[#991b1b]/5 bg-[#fdf6e3]/20 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SCRIPTORIUM HUB */}
                        <div className="p-40 bg-[#fdf6e3] border-[10px] border-double border-[#27272a]/10 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-48">
                             <PenTool className="absolute -top-10 -right-10 w-96 h-96 text-[#27272a]/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             <h4 className="text-[13px] font-black tracking-[3em] text-[#27272a]/20 mb-20 italic leading-none z-10 relative uppercase">{t.log}</h4>
                             <div className="space-y-16 relative z-10">
                                <p className="text-5xl text-7xl font-black italic tracking-tighter leading-none" style={{ letterSpacing: '-0.04em' }}>Lexical Forensics // Comparative Philology // Ancient Script Recovery</p>
                                <p className="text-2xl font-light italic tracking-[0.4em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-stone-500">Unlocking History Through the Lineage of the Word</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-[#27272a]/10 group-hover:text-[#991b1b] transition-all duration-[1s]">
                                {[Languages, Archive, History, Book].map((Icon, i) => <Icon key={i} className="w-20 h-20" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE WORD ARCHAEOLOGIST FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t-[30px] border-[#fdf6e3] bg-white text-stone-300 flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black uppercase">
                    <div className="absolute top-0 left-0 w-full h-[5px] bg-[#991b1b] shadow-[0_0_20px_#991b1b]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-24">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [15, 100, 15] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#991b1b]/10 group-hover:bg-[#991b1b]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[32px] uppercase tracking-[2em] mb-8 text-stone-900">{personal.fullName} // LEX_NODE_v10</p>
                             <p className="text-[13px] uppercase tracking-[1em] italic opacity-40">Preserving Voice // Restoring Text // Defining Continuity</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-stone-100 group-hover:text-[#991b1b] transition-colors relative z-10 p-20 bg-[#fdf6e3] border border-[#27272a]/5 shadow-inner">
                         {[Share2, Globe, Feather, History].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 3, rotate: 15, color: '#fdf6e3', backgroundColor: '#991b1b' }}>
                                 <Icon className="w-20 h-20 cursor-pointer transition-all duration-700 p-4 border border-transparent rounded-full shadow-2xl shadow-[#991b1b]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
