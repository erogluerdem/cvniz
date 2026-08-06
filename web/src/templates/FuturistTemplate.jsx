import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Cpu, Share, Workflow, Network, Binary, Compass, Lightbulb, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function FuturistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#8b5cf6' // Horizon Violet

    const t = {
        summary: isEn ? 'The Foresight Manifesto' : 'Öngörü Manifestosu',
        experience: isEn ? 'Scenario Planning & Foresight Log' : 'Senaryo Planlama ve Öngörü Günlüğü',
        education: isEn ? 'Evolutionary Theory & Academics' : 'Evrimsel Teori ve Akademik',
        expertise: isEn ? 'Strategic Foresight & Signal Stack' : 'Stratejik Öngörü ve Sinyal Yığını',
        contact: isEn ? 'Foresight Signal Node' : 'Öngörü Sinyal Noktası',
        horizon: isEn ? 'Timeline Horizon Registry' : 'Zaman Çizelgesi Ufuk Kaydı',
        signals: isEn ? 'Signal-to-Noise Ratio Analysis' : 'Sinyal-Gürültü Oranı Analizi'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
    }

    const horizonVariants = {
        animate: {
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
            filter: ["blur(40px)", "blur(100px)", "blur(40px)"],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-800 p-0 selection:bg-[#8b5cf6] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* HORIZON OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={horizonVariants} animate="animate" className="absolute top-1/4 -left-1/4 w-[1200px] h-[1200px] bg-gradient-to-br from-[#8b5cf6]/20 via-[#f97316]/10 to-transparent rounded-full" />
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[200px]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#8b5cf6]/5 to-transparent" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-50"
            >
                {/* 1. THE HORIZON SEER HEADER */}
                <header className="w-full relative py-32 px-10 px-24 border-b border-slate-100 bg-white/10 overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-5">
                         <Eye className="w-80 h-80 text-[#8b5cf6]" />
                    </div>
                    
                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-16">
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-6 px-8 py-3 bg-[#8b5cf6]/5 text-[#8b5cf6] text-[11px] font-black uppercase tracking-[1.2em] italic border border-[#8b5cf6]/10">
                                <Spark className="w-5 h-5 animate-pulse" /> FORESIGHT_SIGNAL_v20.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[12rem] font-light text-slate-950 tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.08em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-12 justify-start">
                                     <div className="h-px w-32 bg-[#8b5cf6]/40" />
                                     <p className="text-4xl font-light tracking-[0.5em] text-slate-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-4">
                                        {['2050_HORIZON', 'TREND_SCAN', 'POST_SCARCITY'].map(tag => (
                                            <span key={tag} className="px-5 py-2 bg-[#8b5cf6]/5 border border-[#8b5cf6]/10 text-[10px] font-black text-[#8b5cf6]/40 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-16 text-right">
                             {theme?.showQrCode && (
                                <div className="p-8 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_80px_150px_rgba(139,92,246,0.1)] relative group hover:scale-110 transition-transform duration-[1s]">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={140} color="#8b5cf6" />
                                    <div className="absolute -top-6 -left-6 p-4 bg-[#f97316] text-white shadow-3xl">
                                         <Lightbulb className="w-8 h-8 animate-pulse" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-200 italic rotate-90 origin-right">SIGNAL_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_FUTUR</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-16 mt-24 text-[13px] font-black uppercase tracking-[0.8em] text-[#8b5cf6] italic border-t border-slate-50 pt-20">
                        {personal.email && <div className="flex items-center gap-6 hover:text-slate-950 transition-colors cursor-pointer"><Mail className="w-6 h-6" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-6 hover:text-slate-950 transition-colors cursor-pointer"><Phone className="w-6 h-6" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-6"><MapPin className="w-6 h-6" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: SIGNALS & STRATEGY */}
                    <aside className="col-span-4 p-12 space-y-48 bg-slate-50/10 border-r border-slate-100 backdrop-blur-3xl">
                        
                        {/* FORESIGHT MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-12 group p-12 border border-slate-100 bg-white/50 backdrop-blur-3xl relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <Spark className="w-32 h-32 text-[#8b5cf6]" />
                                </div>
                                <h3 className="text-[12px] font-black uppercase tracking-[1em] text-slate-300 flex items-center gap-6 italic mb-12 border-b border-slate-100 pb-8 uppercase">
                                     <Compass className="w-8 h-8 text-[#8b5cf6]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-slate-500 group-hover:text-slate-950 transition-colors uppercase">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* SIGNAL ANALYSIS HUB */}
                        <section className="bg-white border-2 border-[#8b5cf6]/10 p-12 space-y-16 group hover:p-16 transition-all duration-1000 shadow-3xl break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[12px] font-black tracking-[1.5em] text-[#8b5cf6]/20 mb-20 italic leading-none border-b border-slate-50 pb-6 uppercase">{t.signals}</h4>
                             <div className="space-y-12 italic">
                                {[
                                    { label: 'Signal-to-Noise', val: '92%' },
                                    { label: 'Disruption Prob.', val: 'Lo-Mid' },
                                    { label: 'Emergent Tech', val: 'High' },
                                    { label: 'Horizon Distance', val: '25y' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/item break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[11px] font-black text-slate-200 group-hover/item:text-[#8b5cf6] transition-colors uppercase">{stat.label}</p>
                                        <p className="text-4xl font-light text-slate-900">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* STRATEGIC FORESIGHT (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-16 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[12px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-6 italic mb-12 border-b border-slate-100 pb-8 uppercase">
                                    <TrendingUp className="w-8 h-8 text-[#8b5cf6]" /> {t.expertise}
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-6 border border-white bg-white/40 hover:border-[#8b5cf6]/20 transition-all cursor-default relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 right-0 w-2 h-full bg-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-[14px] font-black uppercase tracking-widest text-[#8b5cf6]/30 group-hover:text-slate-950 transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EVOLUTIONARY TRAINING (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-20 p-12 bg-slate-50 border-y border-slate-100 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black tracking-[1.2em] text-slate-300 text-center mb-16 leading-none pb-6 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black text-[#8b5cf6]/40 mb-8 tracking-[1em]">TIMELINE_ formação_0{i + 1}</p>
                                        <h4 className="text-4xl font-light italic leading-tight mb-6 group-hover/edu:scale-110 transition-transform text-slate-950 uppercase">{edu.degree}</h4>
                                        <p className="text-[14px] font-black tracking-[0.5em] text-[#f97316]/60 mt-6 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: FORESIGHT PORTFOLIO */}
                    <main className="col-span-8 p-10 p-32 space-y-64 bg-white/20 backdrop-blur-3xl shadow-inner relative">
                        <div className="absolute top-0 right-0 p-32 opacity-[0.02] pointer-events-none">
                             <Layers className="w-[800px] h-[800px] rotate-12" />
                        </div>
                        
                        {/* THE PORTFOLIO (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-32 transition-all duration-[2s] ${highlightedField === 'experience' ? 'bg-[#8b5cf6]/5 p-24 -mx-24 rounded-[10rem] border border-[#8b5cf6]/10 shadow-[0_0_200px_rgba(139,92,246,0.1)]' : ''}`}>
                                <h2 className="text-[13px] font-black uppercase tracking-[5em] text-slate-50/10 mb-40 flex items-center justify-center gap-16 italic leading-none justify-start uppercase">
                                    <Eye className="w-16 h-16 text-[#8b5cf6]" /> {t.experience}
                                </h2>
                                <div className="space-y-96">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-slate-50 hover:border-[#8b5cf6] transition-all duration-[1s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-2 h-48 bg-[#8b5cf6] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-[1s] shadow-[0_0_50px_#8b5cf6]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-24 gap-16">
                                                <div className="space-y-12 flex-1">
                                                    <h3 className="text-7xl text-[11rem] font-light text-slate-950 tracking-tighter italic group-hover:text-[#8b5cf6] transition-colors duration-[1.5s] leading-none uppercase" style={{ letterSpacing: '-0.06em' }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-32 bg-slate-50 group-hover:w-64 group-hover:bg-[#f97316] transition-all duration-[1.5s]" />
                                                        <p className="text-4xl font-light italic text-slate-100 tracking-[1em] group-hover:text-slate-500 transition-colors uppercase">HORIZON: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[13px] font-black text-white bg-slate-900 px-16 py-8 group-hover:bg-[#8b5cf6] transition-all italic tracking-[1em] whitespace-nowrap shadow-3xl leading-none uppercase">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-4xl text-slate-200 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[80px] border-slate-50/50 pl-32 py-24 group-hover:text-slate-950 group-hover:border-[#8b5cf6] bg-slate-50 transition-all duration-[1.5s] uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* THE 200TH TEMPLATE SPECIAL SEAL */}
                        <div className="p-48 bg-slate-950 text-white border-[12px] border-double border-[#8b5cf6]/20 text-center group relative overflow-hidden transition-all duration-[2.5s] hover:scale-105 shadow-[0_0_150px_rgba(139,92,246,0.3)]">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/30 to-transparent pointer-events-none opacity-50" />
                             <Globe className="absolute -top-10 -right-10 w-[600px] h-[600px] text-white/5 group-hover:rotate-[360deg] transition-all duration-[30s]" />
                             
                             <h4 className="text-[14px] font-black tracking-[4em] text-[#f97316] mb-24 italic leading-none z-10 relative uppercase">THE_200TH_SUMMIT</h4>
                             <div className="space-y-16 relative z-10 box-decoration-clone">
                                <p className="text-6xl text-6xl font-light italic tracking-tighter leading-none italic uppercase">Master of the Future Horizon // Elite Strategic Anticipator</p>
                                <p className="text-2xl font-black italic tracking-[1.5em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-white shadow-2xl">Visualizing Possible Futures @ Galactic Scale // Zero Uncertainty</p>
                             </div>
                             
                             <div className="flex justify-start gap-32 mt-40 text-white/5 group-hover:text-[#8b5cf6] transition-all duration-[1s]">
                                {[TrendingUp, Database, Eye, Lightbulb].map((Icon, i) => <Icon key={i} className="w-24 h-24" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE HORIZON SEER FOOTER */}
                <footer className="w-full mt-48 py-64 px-10 px-24 border-t-[40px] border-slate-50 bg-white text-slate-300 flex flex-row justify-between items-center gap-32 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-r from-[#8b5cf6] via-[#f97316] to-[#8b5cf6] shadow-[0_0_50px_rgba(139,92,246,0.5)]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-6 items-end h-32">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <motion.div key={i} animate={{ h: [20, 120, 20], backgroundColor: ['#8b5cf6', '#f97316', '#8b5cf6'] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-2" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[40px] uppercase tracking-[2.5em] mb-12 text-slate-950 leading-none">{personal.fullName} // FLW_200_FINAL</p>
                             <p className="text-[14px] uppercase tracking-[1em] italic opacity-40 italic">Seeing the Unseen // Building the Next // Defining Destiny</p>
                        </div>
                    </div>
                    <div className="flex gap-32 text-slate-50 group-hover:text-[#8b5cf6] transition-colors relative z-10 p-32 bg-slate-900 rounded-full shadow-3xl">
                         {[Share2, Globe, Database, Award].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -80, scale: 3.5, rotate: 15, color: '#f97316' }}>
                                 <Icon className="w-24 h-24 cursor-pointer transition-all duration-[1s] p-2" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
