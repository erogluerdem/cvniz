import React from 'react';
import { Mail, Phone, MapPin, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Brain, Zap as Spark, ShieldAlert, MessageCircle, BarChart, TrendingUp, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PerformancePsychologistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#60a5fa' // Neural Blue

    const t = {
        summary: isEn ? 'The Peak Mind Manifesto' : 'Zirve Zihin Manifestosu',
        experience: isEn ? 'Psychological Protocol Portfolio' : 'Psikolojik Protokol Portfolyosu',
        education: isEn ? 'Academic Foundation & Theory' : 'Akademik Temel ve Teori',
        expertise: isEn ? 'Cognitive & Behavioral Stack' : 'Bilişsel ve Davranışsal Yığın',
        contact: isEn ? 'Cognitive Node Access' : 'Bilişsel Nokta Erişimi',
        metrics: isEn ? 'Athlete Mindset Metrics' : 'Sporcu Zihniyet Metrikleri',
        research: isEn ? 'Evidence-Based Research' : 'Kanıta Dayalı Araştırma'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-50 text-slate-800 p-0 selection:bg-[#60a5fa] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* NEURAL OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={pulseVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#60a5fa]/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[#f8fafc]/50" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#60a5fa]/20 to-transparent" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-100"
            >
                {/* 1. THE PEAK MIND HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-[#60a5fa]/10 bg-white">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#60a5fa]/10 text-[#60a5fa] text-[10px] font-black uppercase tracking-[0.8em] italic">
                                <Brain className="w-4 h-4 animate-pulse" /> NEURAL_NODAL_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[8rem] font-black text-slate-900 tracking-tighter leading-none uppercase italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#60a5fa]/30" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-slate-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['PhD', 'Elite Performance', 'CBT'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-100 shadow-[0_50px_100px_rgba(96,165,250,0.1)] relative group hover:rotate-3 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#60a5fa" />
                                    <div className="absolute -top-4 -right-4 bg-[#60a5fa] text-white text-[8px] px-3 py-1 font-black italic shadow-lg">MIND_LINK</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">NODE_REF: {personal.fullName?.split(' ')[0].toUpperCase()}_PSYCH</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.5em] text-[#60a5fa] italic border-t border-slate-50 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: COGNITIVE & METRICS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50/50 border-r border-slate-100">
                        
                        {/* MINDSET MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white p-10 border border-slate-100 shadow-sm relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                    <Lightbulb className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-8 border-b border-slate-100 pb-4">
                                     <MessageCircle className="w-5 h-5 text-[#60a5fa]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-light italic leading-relaxed text-slate-500 group-hover:text-slate-900 transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* ATHLETE MINDSET METRICS */}
                        <section className="bg-slate-900 p-10 text-white space-y-12 relative overflow-hidden group shadow-2xl skew-x-[-2deg] break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-[#60a5fa] mb-full border-b border-white/10 pb-4 mb-20 italic leading-none skew-x-[2deg] uppercase">{t.metrics}</h4>
                             <div className="space-y-10 relative z-10 skew-x-[2deg]">
                                {[
                                    { label: 'Flow State Opt', val: '92%' },
                                    { label: 'Resilience Index', val: '88/100' },
                                    { label: 'Stress Buffer', val: '95%' },
                                    { label: 'Cohesion Rate', val: '+40%' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/stat break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover/stat:text-[#60a5fa] transition-colors">{stat.label}</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-white">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* COGNITIVE STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-100 pb-4 uppercase">
                                    <Target className="w-5 h-5 text-[#60a5fa]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-6 border border-slate-100 bg-white shadow-sm hover:border-[#60a5fa]/30 transition-all cursor-default relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#60a5fa] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-[#60a5fa] transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-10 bg-white border border-slate-100 shadow-2xl text-center space-y-16 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-200 text-center italic mb-10 leading-none pb-4 border-b border-slate-50 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-slate-300 group-hover:text-[#60a5fa] transition-colors mb-4 tracking-[0.5em] italic">NEURAL_RECORD_v0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#60a5fa]">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: PROTOCOL PORTFOLIO */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-white">
                        
                        {/* PORTFOLIO (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#60a5fa]/5 p-16 -mx-16 rounded-[4rem] border border-[#60a5fa]/10 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2.5em] text-slate-100 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Activity className="w-10 h-10 text-[#60a5fa]" /> {t.experience}
                                </h2>
                                <div className="space-y-56">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-50 hover:border-[#60a5fa] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-1 h-32 bg-[#60a5fa] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#60a5fa]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[6.5rem] font-black text-slate-900 tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-20 bg-slate-100 group-hover:w-40 group-hover:bg-[#60a5fa] transition-all duration-1000" />
                                                        <p className="text-3xl font-black text-slate-200 tracking-[0.6em] group-hover:text-[#60a5fa] transition-colors italic leading-none uppercase">TEAM_ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-[#60a5fa] px-10 py-4 shadow-2xl transition-all whitespace-nowrap italic tracking-[0.4em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-500 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-50 pl-24 py-12 group-hover:text-slate-800 group-hover:border-[#60a5fa] bg-slate-50 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* NEURAL ACCREDITATION HUB */}
                        <div className="p-32 bg-[#020617] text-white border-2 border-double border-[#60a5fa]/30 text-center group relative overflow-hidden transition-all duration-1000 shadow-2xl">
                             <Spark className="absolute -top-10 -right-10 w-64 h-64 text-[#60a5fa]/10 group-hover:scale-125 transition-transform duration-[8s]" />
                             <h4 className="text-[12px] font-black tracking-[2em] text-[#60a5fa] mb-12 italic leading-none z-10 relative uppercase">{t.research}</h4>
                             <div className="space-y-10 relative z-10">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none">Elite Cognitive Performance Advisor // Behavioral Systems Lead</p>
                                <p className="text-2xl font-black italic tracking-widest opacity-20 group-hover:opacity-100 transition-opacity uppercase text-slate-500">Accredited Peak Performance Bureau // Evidence-Based Practice</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-20 text-slate-800 group-hover:text-[#60a5fa] transition-all duration-[1s]">
                                {[ShieldCheck, Users, Globe, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE PEAK MIND FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t-8 border-slate-50 bg-white text-slate-300 flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#60a5fa] shadow-[0_0_20px_#60a5fa]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-2 bg-[#60a5fa]/10 group-hover:bg-[#60a5fa]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] uppercase tracking-[1.5em] mb-6 text-slate-900">{personal.fullName} // PSY_CORE_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-30 italic">Cognitive Mastery // Performance Clarity // Absolute Focus</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-100 group-hover:text-[#60a5fa] transition-colors relative z-10 p-16 bg-slate-50 rounded-0 border border-slate-100 shadow-inner backdrop-blur-3xl">
                         {[Share2, Globe, Brain, UserCheck].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.5, rotate: 5, color: '#0f172a' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
