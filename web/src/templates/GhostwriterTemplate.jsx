import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Pen, Feather, FileText, Type } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function GhostwriterTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1c1917' // Typewriter Black

    const t = {
        summary: isEn ? 'The Invisible Manifesto' : 'Görünmez Manifesto',
        experience: isEn ? 'Confidential Project Registry & Manuscript Log' : 'Gizli Proje Kaydı ve Elyazması Günlüğü',
        education: isEn ? 'Literary Foundation & Stylistic Theory' : 'Edebi Temel ve Stilistik Teori',
        expertise: isEn ? 'Voice Matching & Narrative Stack' : 'Ses Eşleştirme ve Anlatı Yığını',
        contact: isEn ? 'Manuscript Node Access' : 'Elyazması Nokta Erişimi',
        log: isEn ? 'Strategic Publication Portfolio' : 'Stratejik Yayın Portfolyosu',
        confidentiality: isEn ? 'NDA & Privacy Clearance' : 'Gizlilik ve NDA Onayı'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const inkVariants = {
        animate: {
            opacity: [0.03, 0.08, 0.03],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#fafaf9] text-[#1c1917] p-0 selection:bg-[#1c1917] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* INK OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={inkVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-slate-200 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1c1917 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="absolute inset-0 bg-[#fafaf9]/50" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-stone-100"
            >
                {/* 1. THE INVISIBLE VOICE HEADER */}
                <header className="w-full relative py-24 px-10 px-16 border-b border-stone-100 bg-[#fafaf9]">
                    <div className="absolute top-0 right-0 p-12 opacity-5 italic text-[120px] font-black select-none pointer-events-none">
                        ...
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#1c1917] text-white text-[10px] font-black uppercase tracking-[0.8em] italic shadow-lg">
                                <PenTool className="w-4 h-4" /> MANUSCRIPT_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[9rem] font-black text-stone-900 tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-px w-24 bg-[#1c1917]" />
                                     <p className="text-3xl font-light tracking-[0.4em] text-stone-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-4">
                                        {['NDA', 'MEMOIR', 'SPEECH'].map(tag => (
                                            <span key={tag} className="px-4 py-1 bg-stone-50 border border-stone-100 text-[10px] font-black text-stone-400 tracking-widest italic uppercase">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-16 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-stone-100 shadow-[0_50px_100px_rgba(28,25,23,0.05)] relative group hover:-rotate-2 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#1c1917" />
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-8 h-8 text-[#1c1917]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-200 italic rotate-90 origin-right">REG: {personal.fullName?.split(' ')[0].toUpperCase()}_GHOST</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[12px] font-light tracking-[0.6em] text-stone-400 italic border-t border-stone-50 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#1c1917] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-stone-200" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#1c1917] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-stone-200" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-stone-200" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: PRIVACY & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#fafaf9]/20 border-r border-stone-100 shadow-inner">
                        
                        {/* THE INVISIBLE ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-12 group bg-white p-10 border border-stone-100 relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                    <Type className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-stone-200 flex items-center gap-4 italic mb-8 border-b border-stone-50 pb-4">
                                     <Feather className="w-6 h-6 text-[#1c1917]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-stone-400 group-hover:text-black transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* NARRATIVE STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-stone-200 flex items-center gap-4 italic mb-10 border-b border-stone-50 pb-4 uppercase">
                                    <Layers className="w-5 h-5 text-[#1c1917]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center z-10 relative">
                                                <span className="text-[18px] font-light uppercase tracking-widest text-stone-300 group-hover/item:text-black transition-colors italic">{skill}</span>
                                                <div className="h-px bg-stone-50 flex-1 mx-4" />
                                                <Zap className="w-4 h-4 text-[#1c1917]/20 group-hover/item:text-[#1c1917] transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* NDA & PRIVACY SEAL */}
                        <div className="p-16 border-2 border-stone-900/10 text-center group bg-stone-50 relative overflow-hidden italic shadow-inner">
                             <ShieldAlert className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.02] group-hover:scale-125 transition-transform duration-[8s]" />
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-stone-300 mb-12 italic leading-none uppercase">{t.confidentiality}</h4>
                             <div className="space-y-6 relative z-10 text-stone-400 group-hover:text-black transition-colors font-bold uppercase tracking-widest text-[9px]">
                                {[ '100% NDA Compliance History', 'Confidentiality Bonded Practitioner', 'Secure Communication Protocols', 'Ghosted Projects: 45+ Bestsellers' ].map((item, i) => (
                                    <p key={i}>FILE_SEC_0{i + 1} :: {item}</p>
                                ))}
                             </div>
                             <div className="flex justify-center gap-10 mt-12 text-stone-200 group-hover:text-[#1c1917] transition-all duration-[1s]">
                                {[Lock, ShieldCheck, FileText, Pen].map((Icon, i) => <Icon key={i} className="w-8 h-8" />)}
                             </div>
                        </div>

                        {/* LITERARY FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-white border-y border-stone-100 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-stone-300 text-center mb-10 leading-none pb-4 border-b border-stone-50 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-stone-200 mb-6 tracking-[0.5em] italic">ACADEMIC_FORM_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-stone-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-stone-300 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: MANUSCRIPT LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white shadow-inner">
                        
                        {/* THE REGISTRY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#fafaf9] p-20 -mx-20 rounded-[4rem] border border-stone-100 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[3em] text-stone-100 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <FileText className="w-10 h-10 text-[#1c1917]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-stone-100 hover:border-[#1c1917] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1px] w-px h-32 bg-[#1c1917] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#1c1917]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[9rem] font-black text-stone-900 tracking-tighter italic group-hover:text-[#1c1917] transition-colors duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-stone-100 group-hover:w-40 group-hover:bg-[#1c1917] transition-all duration-1000 shadow-[0_0_15px_#1c1917]" />
                                                        <p className="text-3xl font-light italic text-stone-200 tracking-[0.4em] group-hover:text-stone-400 transition-colors italic leading-none uppercase">VOICE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-stone-900 px-10 py-4 group-hover:bg-[#1c1917] transition-all whitespace-nowrap italic tracking-[0.4em] leading-none">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-stone-400 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-stone-50 pl-24 py-16 group-hover:text-black group-hover:border-[#1c1917] bg-[#fafaf9]/50 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* GHOST FINAL SEAL */}
                        <div className="p-32 bg-[#fafaf9] border border-stone-100 text-center group relative overflow-hidden transition-all duration-1000 shadow-inner">
                             <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#1c1917] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Pen className="absolute -top-10 -right-10 w-96 h-96 text-[#1c1917]/5 group-hover:rotate-45 transition-all duration-[10s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[4em] text-stone-200 mb-20 italic leading-none z-10 relative uppercase">{t.log}</h4>
                             <div className="space-y-12 relative z-10 italic">
                                <p className="text-5xl text-7xl font-black italic tracking-tighter leading-none italic uppercase">Elite Invisible Voice // Master of Stylistic Adaptivity</p>
                                <p className="text-2xl font-black italic tracking-[0.8em] opacity-10 group-hover:opacity-100 transition-opacity uppercase text-stone-400">Defining the Voice @ Infinite Scale // Zero Attribution</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-stone-100 group-hover:text-[#1c1917] transition-all duration-[1s]">
                                {[FileText, Globe, BookOpen, Clock].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE INVISIBLE VOICE FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t border-stone-100 bg-[#fafaf9] text-stone-100 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#1c1917] shadow-[0_0_20px_#1c1917]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#1c1917]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2em] mb-6 text-stone-900 leading-none">{personal.fullName} // GHOST_NODE_EX1</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-30 italic text-stone-500">Writing the Silent // Healing the Script // Defining the Voice</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-stone-50 group-hover:text-[#1c1917] transition-colors relative z-10 p-20 bg-white border border-stone-100 rounded-full shadow-3xl">
                         {[Share2, Globe, Archive, Compass].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#000000' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}

function Archive(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  )
}

function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function Compass(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}
