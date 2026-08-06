import React from 'react';
import { Mail, Phone, MapPin, Building, Shield, FileCheck, Users, Share2, Globe, ArrowRight, Zap, Target, Star, ShieldCheck, Landmark, Scale, Briefcase, GraduationCap, Award, Fingerprint, BarChart2, PieChart, TrendingUp, Compass, Layers, Maximize2, Zap as Bolt, Layout, GitBranch } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function StrategicAdvisorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1e40af' // Strategy Blue

    const t = {
        summary: isEn ? 'Executive Synthesis' : 'Yönetici Özeti / Strateji',
        experience: isEn ? 'Advisory Engagements' : 'Danışmanlık Angajmanları',
        education: isEn ? 'Scientific Rigor' : 'Akademik Yetkinlik',
        expertise: isEn ? 'Core Value Drivers' : 'Temel Değer Sürücüleri',
        contact: isEn ? 'Liaison Node' : 'İletişim Kanalı',
        lingo: isEn ? 'Global Fluency' : 'Küresel Yetkinlik'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
    }

    const strategyVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-[#1a1a1a] p-0 selection:bg-[#2563eb] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.4'
            }}>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1100px] mx-auto min-h-[297mm] relative overflow-hidden flex flex-col bg-white"
            >
                {/* 1. ADVISORY HEADER (EXECUTIVE CLEAN) */}
                <header className="w-full border-b border-gray-100 p-12 p-24 flex flex-row justify-between items-start gap-16 relative">
                    <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
                         <Layers className="w-96 h-96 text-black" />
                    </div>
                    
                    <div className="flex-1 space-y-12 relative z-10">
                        <motion.div variants={strategyVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] border border-gray-100">
                             STRATEGIC_ADVISORY_v.5
                        </motion.div>
                        
                        <div className="space-y-4">
                            <motion.h1 variants={strategyVariants} className="text-7xl text-7xl font-black text-[#1a1a1a] tracking-tight leading-[0.85] uppercase">
                                {personal.fullName}
                            </motion.h1>
                            <motion.div variants={strategyVariants} className="flex items-center gap-8">
                                 <div className="h-0.5 w-20 bg-[#2563eb]" />
                                 <p className="text-3xl font-medium tracking-tight text-gray-300 uppercase">
                                    {personal.title}
                                 </p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center items-end gap-12 relative z-10">
                        {personal.photo ? (
                            <motion.div variants={strategyVariants} className="w-44 h-56 bg-white p-1 border border-gray-100 shadow-2xl skew-x-1 relative overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                            </motion.div>
                        ) : (
                            <motion.div variants={strategyVariants} className="w-40 h-40 border-8 border-gray-50 flex items-center justify-center p-8">
                                 <Target className="w-full h-full text-gray-50 animate-pulse" />
                            </motion.div>
                        )}
                        <div className="flex flex-col items-end gap-2 text-[11px] font-black uppercase tracking-widest text-[#2563eb]">
                             <div className="flex items-center gap-3"><Mail className="w-4 h-4" /> {personal.email}</div>
                             <div className="flex items-center gap-3"><Phone className="w-4 h-4" /> {personal.phone}</div>
                        </div>
                    </div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-gray-50">
                    
                    {/* LEFT PANEL (SYNTHESIS & DATA) */}
                    <div className="col-span-4 p-10 p-16 space-y-24 border-r border-gray-50 bg-gray-50/20">
                        {/* EXECUTIVE SYNTHESIS (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={strategyVariants} className="group border-l-[12px] border-gray-100 pl-10 hover:border-[#2563eb] transition-all duration-[1s]">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200 mb-8">{t.summary}</h2>
                                <p className="text-2xl font-bold leading-tight text-[#1a1a1a]/80 group-hover:text-black transition-colors">
                                    {personal.summary}
                                </p>
                            </motion.section>
                        )}

                        {/* CORE VALUE DRIVERS (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 pt-10 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200 flex items-center gap-4">
                                     {t.expertise}
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item flex flex-col gap-3 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center text-xl font-bold text-[#1a1a1a]/40 group-hover/item:text-[#2563eb] transition-colors uppercase tracking-tight">
                                                <span>{skill}</span>
                                                <TrendingUp className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-all" />
                                            </div>
                                            <div className="h-0.5 w-full bg-gray-100">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: '100%' }}
                                                    transition={{ duration: 1.2, delay: i * 0.1 }}
                                                    className="h-full bg-gray-200 group-hover/item:bg-[#2563eb] transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {theme?.showQrCode && (
                            <div className="pt-12 flex flex-col items-center">
                                <div className="p-4 bg-white border border-gray-100 shadow-xl rounded-sm">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={120} color="#1a1a1a" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[1em] text-gray-200 mt-6 leading-none text-center">Protocol_Check</span>
                            </div>
                        )}
                    </div>

                    {/* MAIN CHANNEL (ADVISORY) */}
                    <div className="col-span-8 p-10 p-20 space-y-24">
                        {experience.length > 0 && (
                            <motion.section variants={strategyVariants} className={`transition-all duration-700 ${highlightedField === 'experience' ? 'bg-gray-50/50 p-12 -mx-12 border-y border-gray-100 shadow-inner' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[1em] text-gray-100 mb-20 flex items-center gap-10 leading-none">
                                    <Briefcase className="w-8 h-8 text-[#2563eb]" /> {t.experience}
                                </h2>
                                <div className="space-y-32">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-12 border-l border-gray-100 hover:border-[#2563eb] transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2px] w-[3px] h-8 bg-[#2563eb] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-8 gap-10">
                                                <div className="space-y-3">
                                                    <h3 className="text-4xl text-5xl font-black text-[#1a1a1a] tracking-tight group-hover:text-[#2563eb] transition-colors leading-[0.85] uppercase italic">{exp.position}</h3>
                                                    <p className="text-[14px] font-black text-gray-200 uppercase tracking-[0.4em] italic flex items-center gap-4">
                                                        {exp.company}
                                                    </p>
                                                </div>
                                                <div className="text-[11px] font-black text-[#1a1a1a] border-2 border-[#1a1a1a] px-8 py-3 uppercase tracking-widest italic group-hover:bg-[#1a1a1a] group-hover:text-white transition-all whitespace-nowrap">
                                                    0{i+1} // {exp.startDate} – {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-xl text-[#1a1a1a]/40 leading-relaxed font-medium transition-colors group-hover:text-black">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* SCIENTIFIC RIGOR (EDUCATION) */}
                        {education.length > 0 && (
                            <section className={`p-16 bg-[#1a1a1a] text-white transition-all duration-[1s] ${highlightedField === 'education' ? 'ring-[20px] ring-gray-100 border-[#2563eb] shadow-2xl' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[1em] opacity-20 mb-16 pb-6 text-center">
                                     {t.education}
                                </h3>
                                <div className="grid grid-cols-2 gap-20">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center space-y-6 break-inside-avoid page-break-inside-avoid">
                                            <div className="w-16 h-1 bg-[#2563eb] mx-auto opacity-20 group-hover/edu:opacity-100 transition-all group-hover/edu:w-24" />
                                            <h4 className="text-4xl font-black tracking-tight leading-none uppercase group-hover/edu:scale-105 transition-transform">{edu.degree}</h4>
                                            <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* THE ADVISORY FOOTER */}
                <footer className="w-full mt-auto py-32 px-10 px-24 border-t-8 border-[#1a1a1a] bg-white flex flex-row justify-between items-center gap-20 group">
                    <div className="flex flex-col items-start gap-12">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-16 h-4 bg-gray-50 group-hover:bg-[#2563eb] transition-all duration-[2s]" style={{ opacity: i * 0.15 + 0.1 }} />)}
                        </div>
                        <div className="text-left font-black tracking-widest text-[#1a1a1a]">
                             <p className="text-[24px] uppercase tracking-[1em] mb-4 leading-none transition-colors group-hover:text-[#2563eb]">{personal.fullName} // ARCHITECT_OF_STRATEGY_v.5</p>
                             <p className="text-[10px] uppercase tracking-[0.5em] italic opacity-20">Pyramid Logic // Executive Impact // Strategic Stewardship</p>
                        </div>
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
