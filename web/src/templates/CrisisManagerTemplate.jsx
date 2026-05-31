import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, ShieldAlert, MessageSquare, TrendingUp, HeartHandshake, Users, Scale } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CrisisManagerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#991b1b' // Crisis Red

    const t = {
        summary: isEn ? 'The Resolver\'s Philosophy' : 'Çözümleyici Felsefesi',
        experience: isEn ? 'Crisis Resolution Portfolio & Case Log' : 'Kriz Çözüm Portfolyosu ve Vaka Günlüğü',
        education: isEn ? 'Foundational Theory & Strategy' : 'Temel Teori ve Strateji',
        expertise: isEn ? 'Strategic Resolution Stack' : 'Stratejik Çözüm Yığını',
        contact: isEn ? 'Strategic Command Node' : 'Stratejik Komuta Noktası',
        metrics: isEn ? 'Resolution Performance Metrics' : 'Çözüm Performansı Metrikleri',
        methodology: isEn ? 'Strategic Crisis Methodology' : 'Stratejik Kriz Metodolojisi'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const entryVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <div className="min-h-full bg-[#f8fafc] text-[#1e293b] p-0 selection:bg-[#991b1b] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* BUREAU STRUCTURE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-[#0f172a]/5 to-transparent" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-[#0f172a]/5"
            >
                {/* 1. THE RESOLVER HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b-[10px] border-[#0f172a] bg-[#f8fafc]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div variants={entryVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-[0.6em] italic shadow-xl">
                                <ShieldAlert className="w-4 h-4" /> CRISIS_BUREAU_v10.2
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={entryVariants} 
                                    className="text-7xl text-[9rem] font-black text-[#0f172a] tracking-tighter leading-none uppercase italic"
                                    style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={entryVariants} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[1px] w-24 bg-[#0f172a]/20" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-[#991b1b] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['Crisis', 'Resolution', 'Strategy'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-[#0f172a]/5 border border-[#0f172a]/10 text-[9px] font-black text-[#0f172a]/40 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={entryVariants} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-[#0f172a]/10 shadow-[0_50px_100px_rgba(15,23,42,0.1)] relative group hover:scale-105 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#0f172a" />
                                    <div className="absolute -top-4 -right-4 bg-[#991b1b] text-white text-[8px] px-3 py-1 font-black italic rounded-sm shadow-lg">RESOLVER_AUTH</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0f172a]/20 italic rotate-90 origin-right">BUREAU_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_RES</p>
                        </motion.div>
                    </div>

                    <motion.div variants={entryVariants} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.5em] text-[#475569] italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#0f172a] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#991b1b]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#0f172a] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#991b1b]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#991b1b]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: STRATEGY & METRICS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#f8fafc] border-r border-[#0f172a]/5">
                        
                        {/* RESOLVER ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={entryVariants} className="group relative bg-white p-10 border border-[#0f172a]/5 shadow-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-[#0f172a]/20 flex items-center gap-4 italic mb-6">
                                     <Scale className="w-5 h-5 text-[#991b1b]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-light italic leading-relaxed text-[#1e293b]" style={{ fontFamily: "'EB Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </motion.section>
                        )}

                        {/* RESOLUTION METRICS */}
                        <section className="bg-[#0f172a] p-10 text-white space-y-12 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                                <TrendingUp className="w-32 h-32" />
                             </div>
                             <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/30 mb-full border-b border-white/10 pb-4 mb-24 italic leading-none">{t.metrics}</h4>
                             <div className="space-y-10 relative z-10">
                                {[
                                    { label: 'Reputation Recovery', val: '+45%' },
                                    { label: 'Avg Resolution Time', val: '72h' },
                                    { label: 'High-Stake Wins', val: '120+' },
                                    { label: 'Stakeholder Trust', val: '98%' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/stat">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/stat:text-[#991b1b] transition-colors">{stat.label}</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-white">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* RESOLUTION METHODOLOGY (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-[#0f172a]/20 flex items-center gap-4 italic mb-10">
                                    <Target className="w-5 h-5 text-[#991b1b]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-6 border border-[#0f172a]/10 bg-white hover:border-[#991b1b] transition-all cursor-default relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#991b1b] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-[#475569] group-hover:text-[#0f172a] transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC STRATEGY (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-[#0f172a]/5 border-y border-[#0f172a]/10">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#0f172a]/10 text-center italic mb-10">
                                     <GraduationCap className="w-10 h-10 mb-8 text-[#991b1b] mx-auto opacity-30" /> {t.education}
                                </h3>
                                <div className="space-y-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="text-center group/edu">
                                            <p className="text-[9px] font-black text-[#475569] mb-6 tracking-[0.5em] italic uppercase">STRATEGY_FOUNDATION_0{i + 1}</p>
                                            <h4 className="text-4xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform uppercase text-[#0f172a]" style={{ fontFamily: "'EB Garamond', serif" }}>{edu.degree}</h4>
                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#991b1b]">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: RESOLUTION PORTFOLIO */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-white">
                        
                        {/* PORTFOLIO (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={entryVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#0f172a]/5 p-20 -mx-20 rounded-[4rem] border border-[#0f172a]/10 shadow-2xl' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2.5em] text-[#0f172a]/10 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <MessageSquare className="w-8 h-8 text-[#991b1b]" /> {t.experience}
                                </h2>
                                <div className="space-y-48">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-[#0f172a]/5 hover:border-[#991b1b] transition-all duration-[1.5s]">
                                            <div className="absolute -left-[1.5px] top-0 w-2 h-24 bg-[#0f172a] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000 shadow-[0_0_20px_rgba(15,23,42,0.1)]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[6.5rem] font-black text-[#0f172a] tracking-widest italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none" style={{ fontFamily: "'EB Garamond', serif" }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-20 bg-[#0f172a]/10 group-hover:w-40 group-hover:bg-[#991b1b] transition-all duration-1000" />
                                                        <p className="text-2xl font-black text-slate-300 uppercase tracking-[0.6em] italic leading-none">CASE_ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-[#0f172a] px-10 py-5 group-hover:bg-[#991b1b] transition-all italic tracking-[0.4em] shadow-2xl skew-x-[-15deg] group-hover:skew-x-0 whitespace-nowrap leading-none">
                                                    {exp.startDate} :: {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-[#475569] leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[30px] border-[#0f172a]/5 pl-24 py-12 group-hover:text-[#1e293b] group-hover:border-[#991b1b] bg-[#f8fafc] transition-all duration-1000" style={{ fontFamily: "'EB Garamond', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* STRATEGIC SEAL */}
                        <div className="p-20 bg-[#0f172a] text-white border-2 border-double border-[#991b1b]/30 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_100px_rgba(15,23,42,0.2)]">
                             <HeartHandshake className="absolute -top-10 -right-10 w-64 h-64 text-white/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             <h4 className="text-[11px] font-black uppercase tracking-[2em] text-[#991b1b] mb-12 italic leading-none z-10 relative">{t.methodology}</h4>
                             <div className="space-y-8 relative z-10">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none" style={{ fontFamily: "'EB Garamond', serif" }}>Elite Resolution Specialist // Strategic Asset Protection</p>
                                <p className="text-2xl font-black italic tracking-widest opacity-30 group-hover:opacity-100 transition-opacity uppercase text-stone-400">Accredited Crisis Command // Global Bureau Standard</p>
                             </div>
                             <div className="flex justify-center gap-16 mt-16 text-white/5 group-hover:text-[#991b1b] transition-all duration-[1s]">
                                {[ShieldCheck, Users, Globe, Lock].map((Icon, i) => <Icon key={i} className="w-12 h-12" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE RESOLVER FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-24 border-t-8 border-[#0f172a] bg-[#f8fafc] text-[#0f172a] flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#991b1b] shadow-[0_0_20px_#991b1b]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-16">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ height: [10, 60, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-2 bg-[#991b1b]/10 group-hover:bg-[#991b1b]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[20px] uppercase tracking-[1.5em] mb-4 text-[#0f172a]">{personal.fullName} // RES_CORE_v10.2</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-30 italic">Strategic Resolve // Crisis Mastery // Uncompromising Integrity</p>
                        </div>
                    </div>
                    <div className="flex gap-20 text-[#0f172a]/5 group-hover:text-[#0f172a] transition-all duration-1000 relative z-10 p-16 bg-[#0f172a]/5 rounded-0 border border-[#0f172a]/5 backdrop-blur-3xl shadow-3xl">
                         {[Share2, Globe, ShieldAlert, Award].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -40, scale: 2.2, rotate: 5, color: '#991b1b' }}>
                                 <Icon className="w-14 h-14 cursor-pointer transition-all duration-700" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
