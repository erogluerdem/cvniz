import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Archive, Languages, History, Map, Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function EpigrapherTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1e3a8a' // Lapidary Blue

    const t = {
        summary: isEn ? 'The Epigrapher\'s Vision' : 'Epigrafistin Vizyonu',
        experience: isEn ? 'Inscription Rubbing Ledger & Field Log' : 'Yazıt Kopyalama Defteri ve Saha Günlüğü',
        education: isEn ? 'Classical Foundation & Academics' : 'Klasik Temel ve Akademik',
        expertise: isEn ? 'Lapidary & Digital Epigraphy Stack' : 'Lapidary ve Dijital Epigrafi Yığını',
        contact: isEn ? 'Epigraphic Node Access' : 'Epigrafik Nokta Erişimi',
        log: isEn ? 'Corpus Inscriptionum Registry' : 'Corpus Inscriptionum Kaydı',
        sites: isEn ? 'Excavation & Documentation History' : 'Kazı ve Belgeleme Geçmişi'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const stoneVariants = {
        animate: {
            opacity: [0.03, 0.08, 0.03],
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#f4f4f5] text-slate-700 p-0 selection:bg-[#1e3a8a] selection:text-white uppercase font-sans overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* STONE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#e4e4e7]" />
                <motion.div variants={stoneVariants} animate="animate" className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pave.png')] opacity-10" />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-slate-800/5 to-slate-800/10" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#e4e4e7] border-x border-slate-300 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]"
            >
                {/* 1. THE STONE READER HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b-8 border-[#1e3a8a] bg-[#d4d4d8] shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Map className="w-64 h-64 text-slate-800" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-slate-800 text-white text-[10px] font-black tracking-[0.8em] italic shadow-inner">
                                <History className="w-4 h-4" /> EPIGRAPHIC_NODE_v10.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[9rem] font-black text-slate-900 tracking-tighter leading-none"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-24 bg-[#1e3a8a]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-cyan-900/40 uppercase">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['LAPIDARY', 'CORPUS', 'D-EPIG'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-500 text-[9px] font-bold tracking-widest leading-none">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-[#e4e4e7] border-2 border-slate-300 shadow-[20px_20px_60px_#bebebe,_-20px_-20px_60px_#ffffff] relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#1e3a8a" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-6 h-6 text-[#1e3a8a]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 italic rotate-90 origin-right">SITE_LOG: {personal.fullName?.split(' ')[0].toUpperCase()}_8823</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-slate-500 italic border-t border-slate-300 pt-12">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#1e3a8a] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#1e3a8a]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#1e3a8a] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#1e3a8a]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#1e3a8a]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: LAPIDARY & SITES */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-200/50 border-r border-slate-300 shadow-inner">
                        
                        {/* EPIGRAPHIC VISION (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-[#e4e4e7] border border-slate-300 p-10 relative overflow-hidden shadow-2xl skew-y-[-2deg] break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Compass className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black tracking-[0.8em] text-slate-500 flex items-center gap-4 italic mb-8 border-b border-slate-300 pb-4 skew-y-[2deg] uppercase">
                                     <History className="w-5 h-5 text-[#1e3a8a]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold italic leading-relaxed text-slate-600 group-hover:text-black transition-colors skew-y-[2deg]">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* LAPIDARY STACK (SKILLS) */}
                        <section className="space-y-10 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-black tracking-[0.8em] text-slate-500 flex items-center gap-4 italic mb-10 border-b border-slate-300 pb-4 uppercase">
                                <Languages className="w-5 h-5 text-[#1e3a8a]" /> {t.expertise}
                            </h3>
                            <div className="space-y-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="group/item p-6 border-l-8 border-slate-300 bg-[#e4e4e7] hover:border-[#1e3a8a] transition-all cursor-default relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-center z-10 relative">
                                            <span className="text-[10px] font-black tracking-widest text-slate-500 group-hover:text-[#1e3a8a] transition-colors">{skill}</span>
                                            <Spark className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#1e3a8a] transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* DIGITAL EPIGRAPHY HUB */}
                        <div className="p-10 border-2 border-slate-300 text-center group bg-slate-300 shadow-inner">
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-slate-500 mb-10 italic leading-none uppercase">{t.log}</h4>
                             <div className="grid grid-cols-2 gap-8 text-[#1e3a8a]/40 group-hover:text-[#1e3a8a] transition-colors relative z-10 text-[9px] font-black uppercase tracking-widest">
                                {[ 
                                    { label: 'Photogrammetry', val: 'Expert' },
                                    { label: 'RTI Scan', val: 'Advanced' },
                                    { label: 'LIDAR', val: 'Field_Op' },
                                    { label: 'GIS Mapping', val: 'Lead' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-slate-400/20 bg-[#e4e4e7] group-hover:border-[#1e3a8a] transition-all break-inside-avoid page-break-inside-avoid">
                                        <p>{item.val}</p>
                                        <span className="text-[8px] font-normal text-slate-500">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* ACADEMICS (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-100 border-y border-slate-300 italic shadow-inner break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-300 text-center mb-10 leading-none pb-4 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-[#1e3a8a] mb-6 tracking-[0.5em]">CLASSICAL_THREAD_0{i + 1}</p>
                                        <h4 className="text-3xl font-black leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[11px] font-black tracking-[0.3em] text-slate-500 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: INSCRIPTION LEDGER */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-[#e4e4e7]">
                        
                        {/* INSCRIPTIONS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-slate-300 p-20 -mx-20 rounded-[8rem] border border-slate-400/20 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[3em] text-slate-800/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Archive className="w-10 h-10 text-slate-800" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-4 border-slate-300 hover:border-[#1e3a8a] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[4px] w-2 h-32 bg-[#1e3a8a] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#1e3a8a]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[8rem] font-black text-slate-900 tracking-tighter group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-[2px] w-20 bg-slate-400 group-hover:w-40 group-hover:bg-[#1e3a8a] transition-all duration-1000" />
                                                        <p className="text-3xl font-black text-slate-500 tracking-[0.8em] group-hover:text-slate-800 transition-colors italic leading-none uppercase">SITE_REF: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-800 px-12 py-5 shadow-2xl skew-x-[-20deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.5em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-600 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-300/30 pl-24 py-16 group-hover:text-slate-900 group-hover:border-[#1e3a8a] bg-slate-200/20 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* LAPIDARY SEAL HUB */}
                        <div className="p-32 bg-slate-800 text-white border-4 border-double border-slate-700 text-center group relative overflow-hidden transition-all duration-1000 shadow-3xl">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1e3a8a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <ShieldAlert className="absolute -top-10 -right-10 w-96 h-96 text-white/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[2.5em] text-[#1e3a8a] mb-20 italic leading-none z-10 relative uppercase">{t.log}</h4>
                             <div className="space-y-12 relative z-10">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white italic" style={{ letterSpacing: '-0.02em' }}>Advanced Corpus Reconstruction Lead // Classical Inscription Mastery</p>
                                <p className="text-xl font-bold italic tracking-widest text-[#1e3a8a]/40 group-hover:text-white transition-opacity uppercase">Deciphering History @ Scale // Precision Field Documentation</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-white/5 group-hover:text-[#1e3a8a] transition-all duration-[1s]">
                                {[Languages, Archive, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE STONE READER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-300 bg-[#d4d4d8] text-slate-600 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase">
                    <div className="absolute top-0 left-0 w-full h-[8px] bg-[#1e3a8a] shadow-[0_0_50px_rgba(30,58,138,0.5)]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-2 bg-[#1e3a8a]/10 group-hover:bg-[#1e3a8a]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[1.8em] mb-6 text-slate-800 uppercase">{personal.fullName} // EPI_CORE_v10</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40 uppercase italic">Reading Stone // Deciphering Silence // Preserving Time</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-500 group-hover:text-[#1e3a8a] transition-colors relative z-10 p-16 bg-[#e4e4e7] rounded-0 border border-slate-300 shadow-xl">
                         {[Share2, Globe, Archive, Compass].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.5, rotate: 10, color: '#1e3a8a' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl shadow-[#1e3a8a]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
