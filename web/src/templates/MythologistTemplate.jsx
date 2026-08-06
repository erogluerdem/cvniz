import React from 'react';
import { Mail, Phone, MapPin, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, MessageCircle, Scale, Lightbulb, UserCheck, Book, Sparkles, Moon, Sun, Anchor, Wind, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MythologistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#7f1d1d' // Mystic Crimson

    const t = {
        summary: isEn ? 'The Mythic Manifesto' : 'Mitolojik Manifesto',
        experience: isEn ? 'Mythic Cluster Analysis & Folklore Log' : 'Mitik Küme Analizi ve Folklor Günlüğü',
        education: isEn ? 'Scholarly Foundation & Archetypal Theory' : 'Akademik Temel ve Arketipsel Teori',
        expertise: isEn ? 'Symbolic Systems & Semiotics Stack' : 'Sembolik Sistemler ve Semiyotik Yığını',
        contact: isEn ? 'Archetypal Node' : 'Arketipsel Nokta',
        analysis: isEn ? 'Strategic Symbol Mapping' : 'Stratejik Sembol Haritalama',
        frameworks: isEn ? 'Global Mythic Frameworks' : 'Küresel Mitik Çerçeveler'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const mysticVariants = {
        animate: {
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 360],
            transition: { duration: 60, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#09090b] text-[#d4d4d8] p-0 selection:bg-[#7f1d1d] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* MYSTIC OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    variants={mysticVariants}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-[#7f1d1d]/10 rounded-full flex items-center justify-center"
                >
                    <div className="w-[800px] h-[800px] border border-[#f59e0b]/5 rounded-full" />
                    <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-[#7f1d1d]/20 to-transparent" />
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#7f1d1d]/20 to-transparent" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#09090b]/80 shadow-[0_0_150px_rgba(0,0,0,0.5)] border-x border-[#ffffff]/5"
            >
                {/* 1. THE SYMBOL ANALYST HEADER */}
                <header className="w-full relative py-32 px-10 px-24 border-b border-[#7f1d1d]/30 bg-[#09090b]">
                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-16">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-4 px-4 py-1 bg-[#7f1d1d]/10 text-[#f59e0b] text-[9px] font-black uppercase tracking-[1em] italic border border-[#7f1d1d]/20">
                                <Sparkles className="w-5 h-5 animate-pulse" /> ARCHETYPE_NODE_v7.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl text-[11rem] font-light text-white tracking-tighter leading-none italic"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-12 justify-start">
                                     <div className="h-[2px] w-24 bg-[#7f1d1d]" />
                                     <p className="text-3xl font-light tracking-[0.5em] text-[#f59e0b]/60 uppercase italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-6 bg-black border border-[#7f1d1d]/30 shadow-[0_0_60px_rgba(127,29,29,0.2)] relative group hover:scale-110 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={120} color="#7f1d1d" />
                                    <div className="absolute -top-4 -left-4 p-2 bg-[#f59e0b] text-black">
                                         <Sun className="w-6 h-6 animate-spin-slow" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#7f1d1d] italic rotate-90 origin-right uppercase leading-loose">EST_ANALYST: {personal.fullName?.split(' ')[0].toUpperCase()}_SYM</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-16 mt-24 text-[12px] font-light uppercase tracking-[0.4em] text-zinc-500 italic border-t border-[#7f1d1d]/10 pt-16">
                        {personal.email && <div className="flex items-center gap-6 hover:text-white transition-colors cursor-pointer"><Mail className="w-6 h-6 text-[#7f1d1d]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-6 hover:text-white transition-colors cursor-pointer"><Phone className="w-6 h-6 text-[#7f1d1d]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-6"><MapPin className="w-6 h-6 text-[#7f1d1d]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-[#ffffff]/5 flex-1 bg-[#09090b]">
                    
                    {/* LEFT PANEL: ARCODE & SYMBOLISM */}
                    <aside className="col-span-4 p-12 space-y-40 bg-black/50 border-r border-[#ffffff]/5">
                        
                        {/* THE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-12 group p-12 border border-[#7f1d1d]/10 bg-black/80 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <Moon className="w-48 h-48" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#7f1d1d] flex items-center gap-6 italic mb-10 border-b border-[#7f1d1d]/10 pb-6">
                                     <MessageCircle className="w-8 h-8" /> {t.summary}
                                </h3>
                                <p className="text-4xl font-light italic leading-relaxed text-zinc-500 group-hover:text-white transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* SYMBOLIC SYSTEMS (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-16 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#7f1d1d] flex items-center gap-6 italic mb-12 border-b border-[#7f1d1d]/10 pb-8">
                                    <Anchor className="w-8 h-8" /> {t.expertise}
                                </h3>
                                <div className="grid grid-cols-1 gap-8">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center z-10 relative">
                                                <span className="text-[18px] font-light uppercase tracking-widest text-[#f59e0b]/40 group-hover/item:text-[#f59e0b] transition-colors italic whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{skill}</span>
                                                <div className="h-px flex-1 bg-[#7f1d1d]/10 mx-6 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                <UserCheck className="w-5 h-5 text-[#7f1d1d] opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* MYTHIC CLUSTER HUB */}
                        <div className="p-16 border-l-[30px] border-[#7f1d1d] bg-black shadow-[30px_0_100px_rgba(127,29,29,0.1)] text-center group">
                             <h4 className="text-[12px] font-bold uppercase tracking-[2em] text-[#f59e0b]/20 mb-16 italic leading-none">{t.analysis}</h4>
                             <div className="grid grid-cols-2 gap-10 relative z-10 italic font-light text-2xl text-zinc-500 group-hover:text-white transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                {[ 
                                    { label: 'Hero Cycle', val: 'Analytic' },
                                    { label: 'Semiotics', val: 'Structural' },
                                    { label: 'Archetypes', val: 'In-Depth' },
                                    { label: 'Cosmology', val: 'Global' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-6 border border-[#7f1d1d]/5 hover:bg-[#7f1d1d]/10 transition-all break-inside-avoid page-break-inside-avoid">
                                        <p>{item.val}</p>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-700">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* SCHOLARLY FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-16 border-t border-b border-[#7f1d1d]/10 bg-black/30 italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-bold uppercase tracking-[1.5em] text-[#7f1d1d] text-center mb-16 leading-none pb-4 border-b border-[#7f1d1d]/5 uppercase">{t.education}</h3>
                                <div className="space-y-24">
                                    {education.map((edu, i) => (
                                        <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[11px] font-bold text-[#f59e0b]/20 group-hover:text-[#f59e0b] transition-colors mb-6 tracking-[0.4em] uppercase">SYSTEM_FORMATION_0{i + 1}</p>
                                            <h4 className="text-4xl font-light italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform uppercase text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{edu.degree}</h4>
                                            <p className="text-[14px] font-bold tracking-[0.3em] text-[#7f1d1d] underline underline-offset-8 decoration-white/5">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: MYTHIC PORTFOLIO */}
                    <main className="col-span-8 p-10 p-32 space-y-64 bg-[#09090b]">
                        
                        {/* MYTH SYSTEMS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-32 transition-all duration-[1.5s] ${highlightedField === 'experience' ? 'bg-[#7f1d1d]/5 p-24 -mx-24 rounded-[6rem] shadow-[0_0_150px_rgba(0,0,0,0.5)] border border-[#7f1d1d]/10' : ''}`}>
                                <h2 className="text-[12px] font-black uppercase tracking-[3em] text-[#7f1d1d] mb-40 flex items-center justify-center gap-12 italic leading-none justify-start uppercase">
                                    <BookOpen className="w-12 h-12 text-[#f59e0b]" /> {t.experience}
                                </h2>
                                <div className="space-y-80">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-[#ffffff]/5 hover:border-[#7f1d1d] transition-all duration-[1s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-1.5 h-48 bg-[#f59e0b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_40px_#f59e0b]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-20 gap-16">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-7xl text-[10rem] font-light text-white tracking-tighter italic group-hover:text-[#f59e0b] transition-colors duration-[1s] leading-[0.8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-24 bg-[#7f1d1d]/20 group-hover:w-48 group-hover:bg-[#f59e0b] transition-all duration-1000" />
                                                        <p className="text-4xl font-light italic text-[#7f1d1d] tracking-[0.2em] group-hover:text-[#f59e0b] transition-colors italic leading-none uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>CLUSTER: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[13px] font-bold text-[#f59e0b] bg-black border border-[#7f1d1d]/30 px-12 py-6 group-hover:bg-[#7f1d1d] group-hover:text-white transition-all italic tracking-[0.5em] shadow-3xl whitespace-nowrap leading-none uppercase">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-zinc-500 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-black/50 pl-24 py-20 group-hover:text-zinc-200 group-hover:border-[#7f1d1d] bg-[#ffffff]/[0.01] transition-all duration-1000" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ARCHETYPAL FINAL SEAL */}
                        <div className="p-40 bg-[#7f1d1d] text-white border-[10px] border-double border-[#f59e0b]/20 text-center group relative overflow-hidden transition-all duration-[2s] shadow-[0_0_150px_rgba(127,29,29,0.3)] hover:scale-105">
                             <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent pointer-events-none" />
                             <ShieldAlert className="absolute -top-10 -right-10 w-[500px] h-[500px] text-white/5 group-hover:rotate-12 transition-all duration-[8s]" />
                             
                             <h4 className="text-[14px] font-black tracking-[3em] text-[#f59e0b] mb-24 italic leading-none z-10 relative uppercase">{t.frameworks}</h4>
                             <div className="space-y-16 relative z-10">
                                <p className="text-6xl text-6xl font-light italic tracking-tighter leading-none italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Elite Archetypal Analyst // Master of Symbolic Synthesis</p>
                                <p className="text-2xl font-black italic tracking-[0.8em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-[#f59e0b]">Unveiling the Universal Grammar of Myth @ Global Scale</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-32 text-white/10 group-hover:text-[#f59e0b] transition-all duration-[1s]">
                                {[Sun, Moon, Globe, Anchor].map((Icon, i) => <Icon key={i} className="w-24 h-24" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE SYMBOL ANALYST FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 bg-black text-[#7f1d1d] flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black uppercase">
                    <div className="absolute top-0 left-0 w-full h-[8px] bg-[#f59e0b] shadow-[0_0_30px_#f59e0b]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-24">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [15, 100, 15], backgroundColor: ['#7f1d1d', '#f59e0b', '#7f1d1d'] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-1.5" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[32px] tracking-[2.2em] mb-8 text-[#f59e0b]">{personal.fullName} // SYM_NODE_v7</p>
                             <p className="text-[14px] tracking-[0.8em] italic opacity-40 italic text-white/50">Ancient Logic // Archetypal Mastery // Absolute Insight</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-zinc-900 group-hover:text-[#f59e0b] transition-colors relative z-10 p-24 bg-[#09090b] border border-[#7f1d1d]/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                         {[Share2, Globe, Wind, Award].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -80, scale: 3.5, rotate: 15, color: '#f59e0b' }}>
                                 <Icon className="w-20 h-20 cursor-pointer transition-all duration-1000 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
