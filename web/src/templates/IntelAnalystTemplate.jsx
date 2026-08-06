import React from 'react';
import { Mail, Phone, MapPin, Shield, Globe, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Eye, Terminal, Activity, Search, Map } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function IntelAnalystTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#00ffcc' // Matrix Cyan

    const t = {
        summary: isEn ? 'Tactical Mission Profile' : 'Taktik Misyon Profili',
        experience: isEn ? 'Operational Intel History' : 'Operasyonel İstihbarat Geçmişi',
        education: isEn ? 'Technical Training & Clearance' : 'Teknik Eğitim ve Yetki',
        expertise: isEn ? 'Intel Methodologies' : 'İstihbarat Metodolojileri',
        contact: isEn ? 'Secure Comms Channel' : 'Güvenli İletişim Kanalı',
        matrix: isEn ? 'Geopolitical Risk Matrix' : 'Jeopolitik Risk Matrisi',
        stack: isEn ? 'Technical Intelligence Stack' : 'Teknik İstihbarat Yığını'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const scannerVariants = {
        hidden: { opacity: 0, scaleY: 0 },
        visible: { opacity: 1, scaleY: 1, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#0a0a0a] text-slate-500 p-0 selection:bg-[#00ffcc] selection:text-black uppercase overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* TACTICAL HUD OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-50 border-[1.5rem] border-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#0a0a0a] border-x border-slate-800"
            >
                {/* 1. THE ORACLE HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-slate-800 bg-[#0d0d0d] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent animate-scan" style={{ animation: 'scan 4s linear infinite' }} />
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div variants={scannerVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#00ffcc]/10 text-[#00ffcc] text-[10px] font-black tracking-[0.6em] border border-[#00ffcc]/30 italic">
                                <Activity className="w-4 h-4 animate-pulse" /> COMMAND_CENTER_OS_5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={scannerVariants} 
                                    className="text-6xl text-[8rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={scannerVariants} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-[#00ffcc]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-[#00ffcc]">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['TS/SCI', 'OSINT', 'CYBER'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-500 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={scannerVariants} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-slate-800 shadow-2xl skew-x-[-4deg] group hover:skew-x-0 transition-all duration-700 relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#00ffcc" />
                                    <div className="absolute -top-4 -left-4 bg-[#00ffcc] text-black text-[8px] px-3 py-1 font-bold italic shadow-lg">DATA_SECURE</div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 italic">OP_SEC_STATUS: CLEAR</p>
                        </motion.div>
                    </div>

                    <motion.div variants={scannerVariants} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#00ffcc] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#00ffcc]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#00ffcc] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#00ffcc]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#00ffcc]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: RISK MATRIX & STACK */}
                    <aside className="col-span-4 p-10 space-y-24 bg-[#0d0d0d] border-r border-slate-800">
                        
                        {/* MISSION PROFILE (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 border border-slate-800 p-10 relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Eye className="w-6 h-6 text-[#00ffcc]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8">
                                     <Terminal className="w-5 h-5 text-[#00ffcc]" /> {t.summary}
                                </h3>
                                <p className="text-lg font-bold leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* GEOPOLITICAL RISK MATRIX */}
                        <section className="bg-slate-900 border border-slate-800 p-10 space-y-12 relative overflow-hidden group break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-bold tracking-[0.6em] text-white/20 mb-10 italic leading-none">{t.matrix}</h4>
                             <div className="space-y-8">
                                {[
                                    { region: 'East Asia', risk: 'High', color: 'bg-red-500' },
                                    { region: 'MENA', risk: 'Med', color: 'bg-orange-500' },
                                    { region: 'Eastern Europe', risk: 'High', color: 'bg-red-500' },
                                    { region: 'Latin America', risk: 'Low', color: 'bg-emerald-500' }
                                ].map((node, i) => (
                                    <div key={i} className="space-y-2 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                                            <span>{node.region}</span>
                                            <span className={node.risk === 'High' ? 'text-red-500' : node.risk === 'Med' ? 'text-orange-500' : 'text-emerald-500'}>{node.risk}_RISK</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 relative">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: node.risk === 'High' ? '90%' : node.risk === 'Med' ? '60%' : '30%' }}
                                                className={`h-full ${node.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* INTEL METHODOLOGIES (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 group break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8">
                                    <ShieldCheck className="w-5 h-5 text-[#00ffcc]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="p-4 bg-slate-900 border border-slate-800 text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-[#00ffcc] hover:border-[#00ffcc] transition-all cursor-default flex items-center gap-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="w-2 h-2 bg-[#00ffcc] opacity-20 group-hover:opacity-100 animate-pulse" /> {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: OPERATIONAL HISTORY */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-[#0a0a0a]">
                        
                        {/* OPERATIONS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={scannerVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#00ffcc]/5 p-16 -mx-16 border-y border-[#00ffcc]/20 shadow-[0_0_100px_rgba(0,255,204,0.05)]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[2em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Search className="w-8 h-8 text-[#00ffcc]" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l-2 border-slate-800 hover:border-[#00ffcc] transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -left-[1.5px] top-0 w-2 h-24 bg-[#00ffcc] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_20px_#00ffcc]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl text-6xl font-bold text-white tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <p className="text-xl font-bold text-[#00ffcc] tracking-[0.5em] italic opacity-30 group-hover:opacity-100 transition-opacity">AGENCY_ENTITY: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#00ffcc] px-10 py-3 skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.4em] shadow-2xl">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-xl text-slate-500 leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity border-l border-slate-800 pl-16 py-8 group-hover:text-slate-300 group-hover:border-[#00ffcc] bg-white/[0.01]">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* TECHNICAL STACK & CREDENTIALS */}
                        <div className="grid grid-cols-2 gap-10">
                            {education.length > 0 && (
                                <section className="p-16 border border-slate-800 bg-[#0d0d0d] group hover:border-[#00ffcc] transition-all duration-700 break-inside-avoid page-break-inside-avoid">
                                    <h3 className="text-[11px] font-bold tracking-[1em] text-white/10 text-center italic mb-16 flex items-center justify-center gap-10 leading-none">
                                         <GraduationCap className="w-10 h-10 mb-8 text-[#00ffcc] mx-auto opacity-30 group-hover:opacity-100 animate-pulse" /> {t.education}
                                    </h3>
                                    <div className="space-y-16">
                                        {education.map((edu, i) => (
                                            <div key={i} className="group/edu text-center break-inside-avoid page-break-inside-avoid">
                                                <p className="text-[9px] font-bold text-slate-500 mb-6 group-hover:text-[#00ffcc] transition-colors tracking-[0.5em] italic">ACADEMIC_RECORD_#0{i + 1}</p>
                                                <h4 className="text-3xl font-bold italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform text-white">{edu.degree}</h4>
                                                <p className="text-[12px] font-bold tracking-[0.3em] text-[#00ffcc]/50 group-hover:text-[#00ffcc]">{edu.school}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <div className="p-16 border-2 border-slate-800 bg-[#00ffcc]/5 flex flex-col items-center justify-center group relative overflow-hidden">
                                 <Lock className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] group-hover:opacity-10 transition-opacity" />
                                 <h4 className="text-[11px] font-bold tracking-[1.5em] text-[#00ffcc] mb-12 italic leading-none">{t.stack}</h4>
                                 <div className="space-y-4 text-slate-500 font-bold tracking-widest text-[9px] text-center uppercase">
                                    {[ 'Palantir Foundry / Gotham', 'Maltego Graphical Link', 'Python / OSINT Framework', 'CyberThreat Intelligence' ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 justify-center group-hover:text-white transition-colors break-inside-avoid page-break-inside-avoid">
                                            <Layers className="w-4 h-4 text-[#00ffcc]/30" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                 </div>
                                 <div className="mt-16 flex gap-4">
                                     {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-12 bg-slate-800 group-hover:bg-[#00ffcc] transition-all duration-1000" />)}
                                 </div>
                            </div>
                        </div>
                    </main>
                </div>

                {/* THE ORACLE FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-16 border-t border-slate-800 bg-[#0d0d0d] text-slate-600 flex flex-row justify-between items-center gap-16 group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent shadow-[0_0_20px_#00ffcc]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-4 h-1 bg-[#00ffcc]/20 group-hover:w-16 transition-all duration-[1s]" />)}
                        </div>
                        <div className="text-left font-bold">
                             <p className="text-[20px] tracking-[1.2em] mb-6 text-white">{personal.fullName} // ORACLE_CORE_OS_5.0</p>
                             <p className="text-[11px] tracking-[0.4em] italic opacity-40">Tactical Awareness // Geopolitical Superiority // Absolute Precision</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-slate-800 group-hover:text-[#00ffcc] transition-colors relative z-10 p-12 bg-slate-900 border border-slate-800 rounded-[2rem]">
                         {[Share2, Globe, Database, Terminal].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -30, scale: 2, color: '#ffffff' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-colors shadow-2xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
