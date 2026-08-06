import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Cpu, Share, Settings, History, Watch, Timer, Scale } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function WatchmakerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#374151' // Gunmetal Grey

    const t = {
        summary: isEn ? 'The Horological Manifesto' : 'Horolojik Manifesto',
        experience: isEn ? 'Complication Registry & Overhaul Log' : 'Komplikasyon Kaydı ve Revizyon Günlüğü',
        education: isEn ? 'Technical Formation & Micromechanics' : 'Teknik Formasyon ve Mikromekanik',
        expertise: isEn ? 'Complication & Tool-Stack Proficiency' : 'Komplikasyon ve Araç Yığını Yeterliliği',
        contact: isEn ? 'Horological Node Access' : 'Horolojik Nokta Erişimi',
        log: isEn ? 'Movement Calibration Portfolio' : 'Mekanizma Kalibrasyon Portfolyosu',
        precision: isEn ? 'Micro-Precision Bench Metrics' : 'Mikro-Hassas Tezgah Metrikleri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const cogVariants = {
        animate: {
            rotate: [0, 360],
            transition: { duration: 20, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#f1f5f9] text-[#1e293b] p-0 selection:bg-[#374151] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.6'
            }}>

            {/* MECHANISM OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={cogVariants} animate="animate" className="absolute -top-32 -left-32 opacity-[0.03]">
                     <Settings className="w-[600px] h-[600px] text-[#374151]" />
                </motion.div>
                <div className="absolute inset-0 bg-[#f1f5f9]/50" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-200"
            >
                {/* 1. THE CLOCKWORK MASTER HEADER */}
                <header className="w-full relative py-16 px-10 px-16 border-b-2 border-slate-100 bg-[#f1f5f9]">
                    <div className="flex flex-row gap-12 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#374151] text-white text-[10px] font-black uppercase tracking-[0.8em] italic shadow-xl">
                                <Watch className="w-4 h-4 animate-pulse" /> HOROLOGICAL_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-4 font-mono">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-6xl text-[8rem] font-black text-slate-900 tracking-tighter leading-none italic uppercase"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-24 bg-[#374151]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-slate-500 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['COAXIAL', 'TOURB', 'CALIB'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right font-mono uppercase">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border-2 border-slate-200 shadow-2xl relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#374151" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Timer className="w-8 h-8 text-[#374151]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[11px] font-black tracking-[0.4em] text-slate-300">CALIB_PRECISION: +/- 0.5s // {personal.fullName?.split(' ')[0].toUpperCase()}</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-12 text-[11px] font-black tracking-[0.6em] text-slate-500 italic border-t border-slate-100 pt-12 uppercase font-mono">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#374151] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#374151]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#374151] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#374151]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#374151]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white font-mono">
                    
                    {/* LEFT PANEL: PRECISION & TOOLS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50 border-r border-slate-100 italic">
                        
                        {/* THE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 text-white p-10 border border-slate-800 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <History className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-500 flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                     <Scale className="w-5 h-5 text-[#374151]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold italic leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* PRECISION METRICS */}
                        <section className="bg-white border-2 border-slate-100 p-10 space-y-12 shadow-inner break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-black tracking-[1.2em] text-slate-300 mb-20 italic leading-none border-b border-slate-50 pb-4 uppercase">{t.precision}</h4>
                             <div className="space-y-10">
                                {[
                                    { label: 'Avg. Daily Error', val: '+0.2s' },
                                    { label: 'Mastered Calibers', val: '145+' },
                                    { label: 'Micro-Finish', val: 'Elite' },
                                    { label: 'Overhaul Yield', val: '99%' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/item break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black text-slate-300 group-hover/item:text-[#374151] transition-colors">{stat.label}</p>
                                        <p className="text-3xl font-black text-[#374151]">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* TOOL-STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-300 flex items-center gap-4 italic mb-10 border-b border-slate-50 pb-4 uppercase">
                                    <Database className="w-5 h-5 text-[#374151]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-4 border border-slate-100 bg-white hover:border-[#374151] transition-all cursor-default relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 left-0 w-full h-px bg-[#374151] translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-950 transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EDUCATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-white border-y border-slate-100 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-200 text-center mb-10 leading-none pb-4 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-[#374151]/30 mb-6 tracking-[0.5em]">TECHNICAL_ARC_0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-slate-300 mt-4 uppercase uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: COMPLICATION REGISTRY */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white shadow-inner">
                        
                        {/* THE REGISTRY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#f1f5f9] p-20 -mx-20 border border-slate-200 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[4em] text-slate-50 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Settings className="w-10 h-10 text-[#374151]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-50 hover:border-[#374151] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2.5px] w-2 h-32 bg-[#374151] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#374151]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[8.5rem] font-black text-slate-900 tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-100 group-hover:w-40 group-hover:bg-[#374151] transition-all duration-1000 shadow-[0_0_15px_#374151]" />
                                                        <p className="text-3xl font-black text-slate-200 tracking-[0.8em] group-hover:text-slate-500 transition-colors italic leading-none uppercase">HOUSE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-900 px-12 py-5 shadow-2xl transition-all whitespace-nowrap italic tracking-[0.6em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-500 leading-relaxed font-black italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-[#f1f5f9] pl-24 py-16 group-hover:text-slate-900 group-hover:border-[#374151] bg-[#f1f5f9]/20 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* HOROLOGICAL HUB */}
                        <div className="p-32 bg-slate-950 border border-slate-900 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_150px_rgba(55,65,81,0.2)]">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#374151] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Settings className="absolute -top-10 -right-10 w-96 h-96 text-white/5 group-hover:rotate-180 transition-all duration-[20s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[4em] text-[#374151] mb-20 italic leading-none z-10 relative uppercase">{t.log}</h4>
                             <div className="space-y-12 relative z-10 font-mono italic">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white italic uppercase italic">Master Horologist // Architect of Mechanical Precision</p>
                                <p className="text-xl font-black italic tracking-[0.8em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-[#374151]">Controlling Time @ Micromechanical Scale // Absolute Accuracy</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-white/5 group-hover:text-[#374151] transition-all duration-[1s]">
                                {[Timer, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE CLOCKWORK MASTER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-100 bg-[#f1f5f9] text-[#374151]/50 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic font-mono">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#374151] shadow-[0_0_30px_#374151]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#374151]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2.8em] mb-6 text-slate-900 leading-none">{personal.fullName} // TIME_NODE_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-40 uppercase italic text-[#374151]">Measuring the Silent // Calibrating the Heart // Defining the Second</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-200 group-hover:text-[#374151] transition-colors relative z-10 p-20 bg-white border border-slate-200 rounded-0 shadow-inner">
                         {[Share2, Globe, Database, Award].map((Icon, i) => (
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
