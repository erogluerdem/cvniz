import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Cpu, Share, Workflow, Network, Binary, AlertTriangle, Bug, Ghost } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function EthicalHackerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#22c55e' // Matrix Green

    const t = {
        summary: isEn ? 'Offensive-Defensive Manifesto' : 'Ofansif-Defansif Manifesto',
        experience: isEn ? 'Vulnerability Ledger & Breach Log' : 'Zafiyet Defteri ve İhlal Günlüğü',
        education: isEn ? 'Technical Formation & Cyber Theory' : 'Teknik Formasyon ve Siber Teori',
        expertise: isEn ? 'Exploit & Security Stack' : 'Exploit ve Güvenlik Yığını',
        contact: isEn ? 'Terminal Node Access' : 'Terminal Nokta Erişimi',
        sec: isEn ? 'Offensive Posture Registry' : 'Ofansif Duruş Kaydı',
        certs: isEn ? 'Elite Security Certifications' : 'Seçkin Güvenlik Sertifikaları'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    }

    const terminalVariants = {
        animate: {
            opacity: [0.3, 0.4, 0.3],
            transition: { duration: 0.1, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-black text-[#22c55e] p-0 selection:bg-[#22c55e] selection:text-black uppercase font-mono overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.4'
            }}>

            {/* TERMINAL OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#22c55e10_1px,_transparent_1px)] bg-[size:40px_40px]" />
                <motion.div variants={terminalVariants} animate="animate" className="absolute inset-0 bg-[#22c55e]/[0.02]" />
                <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-black border-x border-[#22c55e]/20 shadow-[0_0_100px_rgba(34,197,94,0.1)]"
            >
                {/* 1. THE WHITE HAT HEADER */}
                <header className="w-full relative py-16 px-10 px-16 border-b border-[#22c55e]/30 bg-[#050505] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                         <Ghost className="w-64 h-64 text-[#ef4444]" />
                    </div>
                    
                    <div className="flex flex-row gap-12 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-black tracking-[0.6em] border border-[#22c55e]/30 italic shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                                <Terminal className="w-4 h-4 animate-pulse" /> TERMINAL_STATUS: root@box:~#
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[8.5rem] font-bold text-[#ef4444] tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-8 justify-start">
                                     <div className="h-[2px] w-20 bg-[#22c55e] shadow-[0_0_15px_#22c55e]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-700 italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['TOP_SEC', 'OSCP', 'REVERSE_ENG'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-600 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, rotate: -10 }} animate={{ opacity: 1, rotate: 0 }} className="flex flex-col items-center items-end gap-8 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-950 border border-[#22c55e]/30 shadow-3xl relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#22c55e" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <ShieldAlert className="w-6 h-6 text-[#ef4444]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-[#22c55e]/20 italic rotate-90 origin-right uppercase">NODE: {personal.fullName?.split(' ')[0].toUpperCase()}_HACK</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-12 text-[11px] font-bold tracking-[0.5em] text-[#22c55e]/40 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#22c55e] transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#22c55e] transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: EXPLOITS & METRICS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#050505] border-r border-[#22c55e]/10">
                        
                        {/* THE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-950 border border-slate-900 p-10 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <AlertTriangle className="w-24 h-24 text-[#ef4444]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-[#22c55e]/20 flex items-center gap-4 italic mb-8 border-b border-slate-900 pb-4 uppercase">
                                     <Bug className="w-5 h-5 text-[#ef4444]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold italic leading-relaxed text-slate-700 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* EXPLOIT STACK (SKILLS) */}
                        <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-bold tracking-[0.8em] text-[#22c55e]/20 flex items-center gap-4 italic mb-10 border-b border-slate-900 pb-4 uppercase">
                                <Workflow className="w-5 h-5 text-[#22c55e]" /> {t.expertise}
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="group/item p-4 border border-slate-900 bg-black/40 hover:border-[#22c55e]/30 transition-all cursor-default relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#22c55e] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                                        <span className="text-[10px] font-bold tracking-widest text-slate-700 group-hover:text-[#22c55e] transition-colors">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ELITE CERTS HUB */}
                        <div className="p-10 border-2 border-[#22c55e]/10 text-center group bg-[#050505] relative overflow-hidden shadow-2xl skew-x-[-1deg]">
                             <ShieldAlert className="absolute -top-10 -right-10 w-64 h-64 text-[#22c55e]/5 group-hover:rotate-12 transition-all duration-[6s]" />
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-[#22c55e]/20 mb-12 italic leading-none">{t.certs}</h4>
                             <div className="space-y-6 relative z-10 text-slate-700 group-hover:text-[#22c55e] transition-colors font-bold uppercase tracking-widest text-[9px]">
                                {[ 'OSCP Certified Professional', 'CEH | Master of Exploitation', 'CISSP / CISM Lead Auditor', 'Dark-Web Intelligence Analyst' ].map((item, i) => (
                                    <p key={i}>SEC_CERT_#0{i + 1} :: {item}</p>
                                ))}
                             </div>
                             <div className="flex justify-center gap-12 mt-12 text-[#22c55e]/10 group-hover:text-[#22c55e] transition-all duration-[1s]">
                                {[Cpu, Lock, Database, Network].map((Icon, i) => <Icon key={i} className="w-10 h-10" />)}
                             </div>
                        </div>

                        {/* FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-950 border-y border-slate-900 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-bold tracking-[1em] text-white/5 text-center mb-10 leading-none pb-4 border-b border-white/5">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-bold text-[#ef4444] mb-6 tracking-[0.5em]">ROOT_FORMATION_0{i + 1}</p>
                                        <h4 className="text-3xl font-bold leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-bold tracking-[0.3em] text-[#22c55e]/40 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: BREACH LEDGER */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-black">
                        
                        {/* THE LEDGER (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#22c55e]/5 p-20 -mx-20 border border-[#22c55e]/10 shadow-3xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[4em] text-[#22c55e]/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Binary className="w-10 h-10 text-[#22c55e]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-950 hover:border-[#22c55e] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2.5px] w-2 h-32 bg-[#22c55e] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#22c55e]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[8.5rem] font-bold text-white tracking-tighter group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase italic">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-900 group-hover:w-40 group-hover:bg-[#22c55e] transition-all duration-1000 shadow-[0_0_15px_#22c55e]" />
                                                        <p className="text-3xl font-bold text-slate-800 tracking-[0.8em] group-hover:text-slate-500 transition-colors italic leading-none uppercase">ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#22c55e] px-12 py-5 shadow-3xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.5em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-700 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-950 pl-24 py-16 group-hover:text-slate-500 group-hover:border-[#22c55e] bg-white/[0.01] transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* OFFENSIVE HUB */}
                        <div className="p-32 bg-slate-950 border border-[#22c55e]/20 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_150px_rgba(34,197,94,0.1)]">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#ef4444] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Ghost className="absolute -top-10 -right-10 w-96 h-96 text-white/5 group-hover:rotate-45 transition-all duration-[10s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[4em] text-[#22c55e] mb-20 italic leading-none z-10 relative uppercase">{t.sec}</h4>
                             <div className="space-y-12 relative z-10 font-mono italic">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white italic" style={{ letterSpacing: '-0.02em' }}>Cyber Offensive & Defense Architect // Master of Persistent Threats</p>
                                <p className="text-xl font-bold italic tracking-[0.8em] opacity-10 group-hover:opacity-100 transition-opacity uppercase text-[#22c55e]">Total Network Domination // Zero-Day Exploitation Lead</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-[#22c55e]/10 group-hover:text-[#22c55e] transition-all duration-[1s]">
                                {[Terminal, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE WHITE HAT FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-900 bg-[#050505] text-[#22c55e]/20 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#22c55e] shadow-[0_0_30px_#22c55e]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#22c55e]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[2.2em] mb-6 text-white uppercase">{personal.fullName} // ROOT_BOX_EX1</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40 uppercase italic">Infiltrate // Exfiltrate // Encrypt // Peace</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-950 group-hover:text-[#22c55e] transition-colors relative z-10 p-24 bg-black border border-slate-900 rounded-full shadow-3xl">
                         {[Share2, Globe, Spark, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.5, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl shadow-[#22c55e]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
