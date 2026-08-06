import React from 'react';
import { Mail, Phone, MapPin, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Search, Trash2, Cpu, Fingerprint, ShieldAlert, Cpu as Processor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CyberForensicsTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#9b6bff' // Electric Purple

    const t = {
        summary: isEn ? 'Investigative Ethos & Vision' : 'Soruşturma Etosu ve Vizyonu',
        experience: isEn ? 'Investigation Ledger & Case History' : 'Soruşturma Defteri ve Vaka Geçmişi',
        education: isEn ? 'Technical Formation & Labs' : 'Teknik Formasyon ve Laboratuvarlar',
        expertise: isEn ? 'Forensic Methodologies & Tech' : 'Adli Metodolojiler ve Teknoloji',
        contact: isEn ? 'Secure Forensic Node' : 'Güvenli Adli Nokta',
        stack: isEn ? 'Digital Investigation Stack' : 'Dijital Soruşturma Yığını',
        custody: isEn ? 'Chain of Custody Integrity' : 'Gözetim Zinciri Bütünlüğü'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const bitVariants = {
        hidden: { opacity: 0, scaleY: 0 },
        visible: { opacity: 1, scaleY: 1, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#0a0a0a] text-slate-500 p-0 selection:bg-[#9b6bff] selection:text-black uppercase font-mono overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* BIT-TRACE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,#9b6bff08_1px,transparent_1px)] bg-[size:40px_40px]" />
                <motion.div 
                    animate={{ y: [0, -100, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-full opacity-[0.03] border-x-[100px] border-[#9b6bff]/20"
                />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#0a0a0a] border-x border-slate-900"
            >
                {/* 1. THE DIGITAL TRACE HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-[#9b6bff]/20 bg-[#0d0d0d] overflow-hidden">
                    <div className="absolute top-0 left-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Fingerprint className="w-64 h-64 text-[#9b6bff]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div variants={bitVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#9b6bff]/10 text-[#9b6bff] text-[10px] font-black tracking-[0.6em] border border-[#9b6bff]/30 italic">
                                <Terminal className="w-4 h-4 animate-pulse" /> FORRENSIC_NODE_v9.2
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={bitVariants} 
                                    className="text-6xl text-[8rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={bitVariants} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-[#9b6bff] shadow-[0_0_15px_#9b6bff]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-500">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['GCFE', 'GCFA', 'CHFI'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-500 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={bitVariants} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-slate-800 shadow-3xl skew-x-[-15deg] group hover:skew-x-0 transition-all duration-700 relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#9b6bff" />
                                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover:scale-100 transition-transform">
                                        <Lock className="w-6 h-6 text-[#9b6bff]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-white/10 italic">TRACE_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_8821</p>
                        </motion.div>
                    </div>

                    <motion.div variants={bitVariants} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#9b6bff] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#9b6bff]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#9b6bff] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#9b6bff]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#9b6bff]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: EVIDENCE & STACK */}
                    <aside className="col-span-4 p-10 space-y-24 bg-[#0d0d0d] border-r border-[#9b6bff]/10">
                        
                        {/* INVESTIGATIVE ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 border border-slate-800 p-10 relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Search className="w-6 h-6 text-[#9b6bff]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                     <Eye className="w-5 h-5 text-[#9b6bff]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* DIGITAL INVESTIGATION STACK (SKILLS) */}
                        <section className="bg-slate-900 border border-slate-800 p-10 space-y-12 relative overflow-hidden group break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-bold tracking-[0.6em] text-white/20 mb-10 italic leading-none">{t.stack}</h4>
                             <div className="space-y-6">
                                {[
                                    { tool: 'EnCase Forensic v8', lvl: 95 },
                                    { tool: 'FTK Imager / Magnet AXIOM', lvl: 90 },
                                    { tool: 'Wireshark / Network Minor', lvl: 85 },
                                    { tool: 'Volatility Memory Suite', lvl: 80 }
                                ].map((node, i) => (
                                    <div key={i} className="space-y-2 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-[#9b6bff] uppercase">
                                            <span>{node.tool}</span>
                                            <span>{node.lvl}%_OP</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 relative overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${node.lvl}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="h-full bg-gradient-to-r from-transparent via-[#9b6bff] to-white"
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* CORE COMPETENCIES (SKILLS - ADDITIONAL) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                    <Target className="w-5 h-5 text-[#9b6bff]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="p-4 bg-slate-900 border border-slate-800 text-[10px] font-bold tracking-[0.2em] text-slate-600 hover:text-white hover:border-[#9b6bff] transition-all cursor-default flex items-center justify-between group/item break-inside-avoid page-break-inside-avoid">
                                            <span>{skill}</span>
                                            <Trash2 className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-[#9b6bff] transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CHAIN OF CUSTODY SEAL */}
                        <div className="p-12 border-2 border-dashed border-[#9b6bff]/20 text-center group bg-[#9b6bff]/5">
                             <ShieldAlert className="w-12 h-12 text-[#9b6bff] mx-auto mb-8 group-hover:animate-bounce transition-all" />
                             <h4 className="text-[11px] font-bold tracking-[1.5em] text-white/20 mb-10 italic leading-none uppercase">{t.custody}</h4>
                             <div className="space-y-6 text-slate-500 font-bold tracking-widest text-[9px]">
                                {[ 'ISO/IEC 27037 Compliance', 'Digital Evidence Specialist', 'Expert Witness Qualified', 'ACPO Guidelines Mastery' ].map((item, i) => (
                                    <p key={i} className="group-hover:text-white transition-colors">CERT_ID_0{i + 1} :: {item}</p>
                                ))}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: INVESTIGATION LEDGER */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-[#0a0a0a]">
                        
                        {/* CASE HISTORY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={bitVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#9b6bff]/5 p-20 -mx-20 border-y border-[#9b6bff]/20 shadow-[0_0_100px_rgba(155,107,255,0.05)]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[2.5em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Database className="w-8 h-8 text-[#9b6bff]" /> {t.experience}
                                </h2>
                                <div className="space-y-48">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-slate-800 hover:border-[#9b6bff] transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            {/* BIT STREAM ANIMATION */}
                                            <div className="absolute top-0 -left-[1.5px] w-px h-full bg-gradient-to-b from-[#9b6bff] via-[#9b6bff] to-transparent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-4xl text-[6.5rem] font-bold text-white tracking-widest italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-[2px] bg-slate-800 group-hover:w-32 group-hover:bg-[#9b6bff] transition-all duration-1000" />
                                                        <p className="text-2xl font-bold text-slate-800 tracking-[0.8em] group-hover:text-slate-500 transition-colors italic leading-none">CASE_REF: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#9b6bff] px-10 py-4 shadow-2xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.4em]">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-xl text-slate-600 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[30px] border-slate-900 pl-20 py-10 group-hover:text-slate-200 group-hover:border-[#9b6bff] bg-white/5 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* TECHNICAL LABS & FORMATION */}
                        <div className="grid grid-cols-2 gap-10">
                            {education.length > 0 && (
                                <section className="p-16 border border-slate-800 bg-[#0d0d0d] group hover:border-[#9b6bff] transition-all duration-700 break-inside-avoid page-break-inside-avoid">
                                    <h3 className="text-[11px] font-bold tracking-[1em] text-white/10 text-center italic mb-16 flex items-center justify-center gap-10 leading-none">
                                         <GraduationCap className="w-10 h-10 mb-8 text-[#9b6bff] mx-auto opacity-30 group-hover:opacity-100 animate-pulse" /> {t.education}
                                    </h3>
                                    <div className="space-y-16">
                                        {education.map((edu, i) => (
                                            <div key={i} className="group/edu text-center break-inside-avoid page-break-inside-avoid">
                                                <p className="text-[9px] font-bold text-slate-500 mb-6 group-hover:text-[#9b6bff] transition-colors tracking-[0.5em] italic">LAB_FORMATION_#0{i + 1}</p>
                                                <h4 className="text-3xl font-bold italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform text-white">{edu.degree}</h4>
                                                <p className="text-[12px] font-bold tracking-[0.3em] text-[#9b6bff]/50 group-hover:text-[#9b6bff]">{edu.school}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <div className="p-16 border-2 border-slate-800 bg-[#9b6bff]/5 flex flex-col items-center justify-center group relative overflow-hidden">
                                 <Processor className="absolute -top-10 -right-10 w-64 h-64 opacity-[0.03] group-hover:opacity-10 transition-opacity" />
                                 <h4 className="text-[11px] font-bold tracking-[1.5em] text-[#9b6bff] mb-12 italic leading-none uppercase">{t.contact}</h4>
                                 <div className="flex flex-col items-center gap-10 mt-10">
                                    {[Terminal, ShieldCheck, Activity, Search].map((Icon, i) => (
                                        <div key={i} className="flex items-center gap-8 w-full group/row break-inside-avoid page-break-inside-avoid">
                                            <Icon className="w-10 h-10 text-slate-800 group-hover/row:text-[#9b6bff] transition-all" />
                                            <div className="flex-1 h-2 bg-slate-900 overflow-hidden">
                                                <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="h-full w-20 bg-[#9b6bff]" />
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* THE DIGITAL TRACE FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-16 border-t border-slate-800 bg-[#0d0d0d] text-slate-700 flex flex-row justify-between items-center gap-16 group overflow-hidden relative font-black">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#9b6bff] to-transparent shadow-[0_0_20px_#9b6bff]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-px h-16 bg-[#9b6bff] group-hover:h-32 transition-all duration-[1s]" style={{ opacity: i * 0.1 }} />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[20px] tracking-[1.2em] mb-6 text-white">{personal.fullName} // TRACE_CORE_v9.2</p>
                             <p className="text-[11px] tracking-[0.4em] italic opacity-40">Forensic Integrity // Data Recovery // Digital Justice</p>
                        </div>
                    </div>
                    <div className="flex gap-20 text-slate-800 group-hover:text-[#9b6bff] transition-colors relative z-10 p-12 bg-slate-900 border border-slate-800 rounded-full shadow-3xl">
                         {[Share2, Globe, Database, Fingerprint].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -40, scale: 2.5, color: '#ffffff' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-all duration-700" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
