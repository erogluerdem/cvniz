import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Flag, Scale, Palette, Ship, Anchor, Wind } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function VexillologistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1e3a8a' // Royal Blue

    const t = {
        summary: isEn ? 'The Vexillographic Manifesto' : 'Veksillografik Manifesto',
        experience: isEn ? 'Flag Architecture & Symbolic Registry' : 'Bayrak Mimarisi ve Sembolik Kayıt',
        education: isEn ? 'Heraldic Foundation & Theory' : 'Hanedan Temeli ve Teori',
        expertise: isEn ? 'Tincture & Symbolic Stack' : 'Tandans ve Sembolik Yığın',
        contact: isEn ? 'Diplomatic Signal Access' : 'Diplomatik Sinyal Erişimi',
        signals: isEn ? 'National & Corporate Signal History' : 'Ulusal ve Kurumsal Sinyal Geçmişi',
        rules: isEn ? 'Vexillographic Rule Compliance' : 'Veksillografik Kural Uyumluluğu'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const bannerVariants = {
        animate: {
            x: [0, -10, 0],
            skewX: [0, 2, 0],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-800 p-0 selection:bg-[#1e3a8a] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.6'
            }}>

            {/* BANNER OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div variants={bannerVariants} animate="animate" className="absolute -top-1/4 -right-1/4 w-[1200px] h-[1200px] bg-gradient-to-br from-[#1e3a8a]/5 via-[#dc2626]/5 to-transparent rotate-45" />
                <div className="absolute inset-x-0 top-0 h-1 bg-[#dc2626]/20 shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[#1e3a8a]/20" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-50"
            >
                {/* 1. THE FLAG ARCHITECT HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b-8 border-[#1e3a8a] bg-slate-50">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Flag className="w-96 h-96 text-[#dc2626]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-[1em] italic shadow-xl">
                                <Anchor className="w-4 h-4 animate-pulse" /> SIGNAL_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[10rem] font-black text-[#1e3a8a] tracking-[0.2em] leading-none italic uppercase"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-24 bg-[#1e3a8a]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-slate-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['NAVA', 'FIAV', 'HERALD'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-[#1e3a8a]/10 text-[9px] font-bold text-[#1e3a8a] tracking-widest uppercase">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border-2 border-[#1e3a8a] shadow-2xl relative group hover:p-6 transition-all duration-[1s]">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#1e3a8a" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Scale className="w-8 h-8 text-[#dc2626]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">SIG_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_VEX</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black uppercase tracking-[0.6em] text-[#1e3a8a] italic border-t border-slate-100 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#dc2626] transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#dc2626] transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: HERALDRY & SYMBOLS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50 border-r border-slate-100 shadow-inner">
                        
                        {/* THE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-[#1e3a8a] text-white p-10 border border-[#1e3a8a] relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Wind className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-white/10 pb-4">
                                     <Activity className="w-5 h-5" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold italic leading-relaxed text-slate-100 group-hover:text-white transition-colors uppercase">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* VEXILLOGRAPHIC RULES HUB */}
                        <div className="p-10 border-4 border-slate-100 text-center group bg-white shadow-inner relative overflow-hidden">
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-slate-200 mb-12 italic leading-none border-b border-slate-50 pb-4 uppercase">{t.rules}</h4>
                             <div className="space-y-6 relative z-10 text-slate-300 group-hover:text-[#1e3a8a] transition-colors font-black uppercase tracking-widest text-[10px]">
                                {[ 'Maintain Symbolic Transparency', 'Minimum Tincture Palette', 'High Geometric Contrast', 'Rule of Tinctures Compliance' ].map((item, i) => (
                                    <p key={i}>RULE_#0{i + 1} :: {item}</p>
                                ))}
                             </div>
                             <div className="flex justify-center gap-12 mt-12 text-slate-50 group-hover:text-[#dc2626] transition-all duration-[1s]">
                                {[Flag, Scale, Ship, Anchor].map((Icon, i) => <Icon key={i} className="w-10 h-10" />)}
                             </div>
                        </div>

                        {/* SYMBOLIC STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-100 pb-4 uppercase">
                                    <Palette className="w-5 h-5 text-[#1e3a8a]" /> {t.expertise}
                                </h3>
                                <div className="space-y-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-4 bg-white border border-slate-50 hover:border-[#1e3a8a] transition-all cursor-default relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-[#1e3a8a] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#1e3a8a] transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* HERALDIC FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-[#dc2626] text-white border-y border-red-700 uppercase italic shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black tracking-[1em] text-white/20 text-center mb-10 leading-none pb-4 border-b border-white/10 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-white/40 mb-6 tracking-[0.5em] italic">HERALDIC_ARC_0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.6em] text-red-100/60 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: SIGNAL REGISTRY */}
                    <main className="col-span-8 p-10 px-24 py-32 space-y-48 bg-white shadow-inner">
                        
                        {/* THE REGISTRY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#1e3a8a]/5 p-20 -mx-20 border border-[#1e3a8a]/10 shadow-[0_0_100px_rgba(30,58,138,0.1)] skew-x-[-2deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[4em] text-slate-50 mb-32 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Globe className="w-10 h-10 text-[#1e3a8a]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-4 border-slate-50 hover:border-[#dc2626] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[4px] w-4 h-32 bg-[#dc2626] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#dc2626]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[8.5rem] font-black text-slate-800 tracking-tighter italic group-hover:text-[#1e3a8a] transition-all duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-24 bg-slate-100 group-hover:w-48 group-hover:bg-[#dc2626] transition-all duration-1000 shadow-[0_0_15px_#dc2626]" />
                                                        <p className="text-3xl font-black text-slate-200 tracking-[0.4em] group-hover:text-slate-500 transition-colors italic leading-none uppercase">ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-[#1e3a8a] px-12 py-5 shadow-3xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.6em] leading-none uppercase">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-slate-100 leading-relaxed font-black italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-slate-50 pl-24 py-16 group-hover:text-slate-800 group-hover:border-[#1e3a8a] bg-slate-50 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SIGNAL FINAL SEAL */}
                        <div className="p-32 bg-white border border-[#1e3a8a]/20 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-48 shadow-3xl">
                             <div className="absolute inset-x-0 bottom-0 h-2 bg-[#dc2626] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[1.5s] uppercase" />
                             <Flag className="absolute -top-10 -right-10 w-96 h-96 text-[#1e3a8a]/5 group-hover:scale-110 transition-transform duration-[10s]" />
                             
                             <h4 className="text-[14px] font-black tracking-[4em] text-[#dc2626]/20 mb-20 italic leading-none z-10 relative uppercase">{t.signals}</h4>
                             <div className="space-y-12 relative z-10 italic">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none italic uppercase">Elite Vexillographic Architect // Master of Symbolic Signals</p>
                                <p className="text-2xl font-black italic tracking-[1.5em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-[#1e3a8a]">Defining Identity @ Global Scale // Zero Ambiguity</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-slate-100 group-hover:text-[#1e3a8a] transition-all duration-[1s]">
                                {[Ship, Globe, Flag, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE FLAG ARCHITECT FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t-8 border-[#dc2626] bg-[#1e3a8a] text-white/10 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[8px] bg-[#dc2626] shadow-[0_0_30px_#dc2626]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-white" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2.8em] mb-6 text-white leading-none">{personal.fullName} // SIG_NODE_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-40 uppercase italic text-red-200/40">Signaling the Future // Preserving the Signal // Defining the Charge</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-white/20 group-hover:text-white transition-colors relative z-10 p-20 bg-[#1e3a8a] border border-white/10 rounded-full shadow-inner shadow-black/20">
                         {[Share2, Globe, Spark, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#dc2626' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl shadow-black/20" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
