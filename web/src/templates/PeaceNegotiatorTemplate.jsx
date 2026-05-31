import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, HeartHandshake, Users, Scale, MessageCircle, Flag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PeaceNegotiatorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#60a5fa' // Peace Blue

    const t = {
        summary: isEn ? 'The Mediator\'s Philosophy' : 'Arabulucunun Felsefesi',
        experience: isEn ? 'Treaty & Mediation Portfolio' : 'Antlaşma ve Arabuluculuk Portfolyosu',
        education: isEn ? 'Diplomatic Formation & Theory' : 'Diplomatik Formasyon ve Teori',
        expertise: isEn ? 'Conflict Resolution & Neutrality Stack' : 'Çatışma Çözümü ve Tarafsızlık Yığını',
        contact: isEn ? 'Diplomatic Node' : 'Diplomatik Nokta',
        mediation: isEn ? 'High-Stakes Resolution Registry' : 'Yüksek Riskli Çözüm Kaydı',
        missions: isEn ? 'International Diplomatic Missions' : 'Uluslararası Diplomatik Misyonlar'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const sereneVariants = {
        animate: {
            opacity: [0.02, 0.05, 0.02],
            scale: [1, 1.05, 1],
            transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div className="min-h-full bg-white text-slate-800 p-0 selection:bg-[#60a5fa] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* PEACE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={sereneVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#60a5fa]/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #60a5fa 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-50"
            >
                {/* 1. THE BRIDGE BUILDER HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-[#60a5fa]/10 bg-white">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#60a5fa]/5 text-[#60a5fa] text-[10px] font-black uppercase tracking-[0.8em] italic">
                                <HeartHandshake className="w-4 h-4" /> DIPLOMATIC_SIGNAL_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[10rem] font-light text-slate-900 tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-px w-24 bg-[#60a5fa]/30" />
                                     <p className="text-3xl font-light tracking-[0.4em] text-slate-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2 font-mono">
                                        {['MEDIATION', 'CONFLICT', 'NEUTRAL'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-100 shadow-[0_50px_100px_rgba(96,165,250,0.1)] relative group hover:-translate-y-2 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#60a5fa" />
                                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover:scale-100 transition-transform">
                                        <ShieldCheck className="w-6 h-6 text-[#60a5fa]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">DIP_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_RES</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.5em] text-[#60a5fa] italic border-t border-slate-50 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: NEUTRALITY & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50/20 border-r border-slate-100">
                        
                        {/* THE PHILOSOPHY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                    <MessageCircle className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-8 border-b border-slate-100 pb-4">
                                     <Scale className="w-5 h-5 text-[#60a5fa]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-light italic leading-relaxed text-slate-500 group-hover:text-slate-900 transition-colors uppercase">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* RESOLUTION STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-100 pb-4 uppercase">
                                    <Target className="w-5 h-5 text-[#60a5fa]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-4 border border-white bg-slate-50 hover:border-[#60a5fa]/30 transition-all cursor-default relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#60a5fa] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-[#60a5fa]/40 group-hover:text-[#60a5fa] transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-10 border-l-[30px] border-[#60a5fa] bg-white text-center italic shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#60a5fa]/[0.02] -z-10 group-hover:bg-[#60a5fa]/5 transition-colors" />
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-200 text-center mb-10 leading-none pb-4 border-b border-slate-50 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu mb-12 last:mb-0">
                                        <p className="text-[9px] font-black text-[#60a5fa]/30 mb-6 tracking-[0.5em]">ACADEMIC_DOC_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.3em] text-[#60a5fa]/60 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: RESOLUTION PORTFOLIO */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white">
                        
                        {/* THE PORTFOLIO (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#60a5fa]/10 p-24 -mx-24 rounded-[6rem] border border-[#60a5fa]/20 shadow-[0_0_100px_rgba(96,165,250,0.1)]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[4em] text-slate-500/10 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Globe className="w-10 h-10 text-[#60a5fa]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-slate-50 hover:border-[#60a5fa] transition-all duration-[1.5s]">
                                            <div className="absolute top-0 -left-[1.5px] w-1.5 h-32 bg-[#60a5fa] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#60a5fa]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-6xl text-[9.5rem] font-light text-slate-900 tracking-tighter italic group-hover:text-[#60a5fa] transition-colors duration-[1.5s] leading-none uppercase" style={{ letterSpacing: '-0.06em' }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-24 bg-slate-100 group-hover:w-48 group-hover:bg-[#60a5fa] transition-all duration-1000" />
                                                        <p className="text-4xl font-light italic text-slate-200 tracking-[0.6em] group-hover:text-[#60a5fa] transition-colors italic leading-none uppercase">ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-[#60a5fa] border border-[#60a5fa]/30 px-10 py-4 group-hover:bg-[#60a5fa] group-hover:text-white transition-all whitespace-nowrap italic tracking-[0.5em] leading-none uppercase">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-slate-300 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-slate-50 pl-24 py-16 group-hover:text-slate-800 group-hover:border-[#60a5fa] bg-slate-50 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* DIPLOMATIC FINAL SEAL */}
                        <div className="p-32 bg-white border border-slate-100 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-40 shadow-inner">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#60a5fa]/5 to-transparent pointer-events-none" />
                             <Flag className="absolute -top-10 -right-10 w-64 h-64 text-[#60a5fa]/5 group-hover:rotate-12 transition-all duration-[10s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[3em] text-[#60a5fa]/20 mb-16 italic leading-none z-10 relative uppercase">{t.mediation}</h4>
                             <div className="space-y-8 relative z-10">
                                <p className="text-5xl text-7xl font-light italic tracking-tighter leading-none italic uppercase">Global Peace Negotiator // Elite Resolution Specialist</p>
                                <p className="text-2xl font-black italic tracking-[0.8em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-slate-400">Neutralizing Conflict @ Global Scale // Uncompromising Integrity</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-slate-100 group-hover:text-[#60a5fa] transition-all duration-[1s]">
                                {[Users, Globe, HeartHandshake, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE BRIDGE BUILDER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t-8 border-slate-50 bg-white text-slate-300 flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#60a5fa] shadow-[0_0_20px_#60a5fa]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-2 bg-[#60a5fa]/5 group-hover:bg-[#60a5fa]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2em] mb-6 text-slate-900 leading-none">{personal.fullName} // DIP_NODE_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-30 italic">Preserving Order // Restoring Voice // Defining Peace</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-100 group-hover:text-[#60a5fa] transition-colors relative z-10 p-16 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                         {[Share2, Globe, MessageCircle, Scale].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.5, rotate: 5, color: '#0f172a' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
