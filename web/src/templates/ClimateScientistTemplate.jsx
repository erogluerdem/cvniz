import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Thermometer, Droplet, Wind, Mountain, Sun, CloudRain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ClimateScientistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#0ea5e9' // Glacial Blue

    const t = {
        summary: isEn ? 'Planetary Observation & Vision' : 'Gezegensel Gözlem ve Vizyon',
        experience: isEn ? 'Predictive Modeling & Fieldwork Log' : 'Öngörücü Modelleme ve Saha Günlüğü',
        education: isEn ? 'Scientific Foundation & Earth Theory' : 'Bilimsel Temel ve Dünya Teorisi',
        expertise: isEn ? 'Climate Modeling & Terra Stack' : 'İklim Modelleme ve Terra Yığını',
        contact: isEn ? 'Observation Node' : 'Gözlem Noktası',
        metrics: isEn ? 'Planetary Health Metrics' : 'Gezegensel Sağlık Metrikleri',
        policy: isEn ? 'Policy Impact & Mitigation Registry' : 'Politika Etkisi ve Azaltma Kaydı'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const terraVariants = {
        animate: {
            scale: [1, 1.02, 1],
            opacity: [0.03, 0.06, 0.03],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#f8fafc] text-slate-800 p-0 selection:bg-[#0ea5e9] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* TERRA OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={terraVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#0ea5e9]/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[#f8fafc]/50" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-100"
            >
                {/* 1. THE EARTH GUARDIAN HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-slate-100 bg-[#f8fafc]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-black uppercase tracking-[1em] italic border border-[#0ea5e9]/20">
                                <Globe className="w-4 h-4 animate-pulse" /> TERRA_OBS_NODE_v14.0
                            </motion.div>
                            
                            <div className="space-y-4 font-mono">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[8.5rem] font-black text-slate-900 tracking-tighter leading-none italic uppercase"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-24 bg-[#0ea5e9]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-slate-200 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['IPCC', 'NOAA', 'GIS'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right font-mono">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border-2 border-slate-100 shadow-[20px_20px_60px_#e2e8f0,_-20px_-20px_60px_#ffffff] relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#0ea5e9" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <CloudRain className="w-8 h-8 text-[#0ea5e9]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[11px] font-black tracking-[0.4em] text-slate-200 uppercase">PLANET_HEALTH_IDX: 72% // {personal.fullName?.split(' ')[0].toUpperCase()}</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black tracking-[0.6em] text-slate-500 italic border-t border-slate-50 pt-16 uppercase font-mono">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#0ea5e9] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#0ea5e9]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#0ea5e9] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#0ea5e9]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#0ea5e9]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white font-mono">
                    
                    {/* LEFT PANEL: TERRA METRICS & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50/50 border-r border-slate-100">
                        
                        {/* PLANETARY MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 text-white p-10 border border-slate-800 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Sun className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#0ea5e9] flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                     <Activity className="w-5 h-5" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold italic leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* PLANETARY HEALTH METRICS */}
                        <section className="bg-white border-2 border-slate-100 p-10 space-y-12 group transition-all hover:border-[#0ea5e9]/30 break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-black tracking-[1em] text-slate-200 mb-20 italic leading-none border-b border-slate-50 pb-4 uppercase">{t.metrics}</h4>
                             <div className="space-y-10 italic">
                                {[
                                    { label: 'CO2 Modeling', val: '420ppm' },
                                    { label: 'Temp Anomaly', val: '+1.2°C' },
                                    { label: 'Glacial Mass', val: '-12%' },
                                    { label: 'Ocean pH', val: '8.07' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/item break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black text-slate-300 group-hover/item:text-[#0ea5e9] transition-colors">{stat.label}</p>
                                        <p className="text-3xl font-black text-slate-900">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* TERRA STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-100 pb-4 uppercase">
                                    <Terminal className="w-5 h-5 text-[#0ea5e9]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-4 border border-slate-100 bg-white hover:border-[#0ea5e9] transition-all cursor-default relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 left-0 w-full h-px bg-[#0ea5e9] translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-[#0ea5e9]/40 group-hover:text-slate-950 transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SCIENTIFIC THEORY (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-100 border-y border-slate-200 uppercase break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-300 text-center mb-10 leading-none pb-4 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-[#0ea5e9] mb-6 tracking-[0.5em]">ACADEMIC_THREAD_0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-slate-500 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: MODELING LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white">
                        
                        {/* THE LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#0ea5e9]/5 p-20 -mx-20 rounded-[8rem] border border-[#0ea5e9]/10 shadow-3xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[4em] text-slate-100 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Database className="w-10 h-10 text-[#0ea5e9]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-100 hover:border-[#0ea5e9] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2.5px] w-2 h-32 bg-[#0ea5e9] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#0ea5e9]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[8rem] font-black text-slate-900 tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-20 bg-slate-100 group-hover:w-40 group-hover:bg-[#0ea5e9] transition-all duration-1000 shadow-[0_0_15px_#0ea5e9]" />
                                                        <p className="text-3xl font-black text-slate-200 tracking-[0.8em] group-hover:text-slate-500 transition-colors italic leading-none uppercase">INSTITUTE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-950 px-12 py-5 shadow-2xl transition-all whitespace-nowrap italic tracking-[0.6em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-500 leading-relaxed font-black italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-50 pl-24 py-16 group-hover:text-slate-900 group-hover:border-[#0ea5e9] bg-slate-50 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* TERRA POLICY HUB */}
                        <div className="p-32 bg-slate-950 border border-slate-900 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_150px_rgba(14,165,233,0.1)]">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#0ea5e9] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Mountain className="absolute -top-10 -right-10 w-80 h-80 text-white/5 group-hover:translate-y-20 transition-transform duration-[10s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[3em] text-[#0ea5e9] mb-20 italic leading-none z-10 relative uppercase">{t.policy}</h4>
                             <div className="space-y-12 relative z-10 font-mono italic">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white uppercase italic">Advanced Climate Modeling Lead // Mitigating Global Risk</p>
                                <p className="text-xl font-black italic tracking-[0.8em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-[#0ea5e9]">Predicting Future States @ Planetary Scale // Absolute Accuracy</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-white/5 group-hover:text-[#0ea5e9] transition-all duration-[1s]">
                                {[Droplet, Thermometer, Wind, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE EARTH GUARDIAN FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-100 bg-slate-50 text-slate-800 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic font-mono">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#0ea5e9] shadow-[0_0_30px_#0ea5e9]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#0ea5e9]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[1.8em] mb-6 text-slate-900 leading-none">{personal.fullName} // TERRA_NODE_v14</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40 uppercase italic">Protecting the Pulse // Restoring the Ice // Defining the Future</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-200 group-hover:text-[#0ea5e9] transition-colors relative z-10 p-20 bg-white border border-slate-100 rounded-0 shadow-inner">
                         {[Share2, Globe, Mountain, Award].map((Icon, i) => (
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
