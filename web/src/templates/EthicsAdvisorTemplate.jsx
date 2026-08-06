import React from 'react';
import { Mail, Phone, MapPin, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, MessageCircle, Scale, Lightbulb, UserCheck, Book } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function EthicsAdvisorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#312e81' // Wisdom Indigo

    const t = {
        summary: isEn ? 'Ethical Philosophy & Moral Vision' : 'Etik Felsefe ve Ahlaki Vizyon',
        experience: isEn ? 'Ethics Case Ledger & Advisory History' : 'Etik Vaka Defteri ve Danışmanlık Geçmişi',
        education: isEn ? 'Academic Foundation & Theory' : 'Akademik Temel ve Teori',
        expertise: isEn ? 'Moral Frameworks & Governance' : 'Ahlaki Çerçeveler ve Yönetişim',
        contact: isEn ? 'Advisory Node' : 'Danışmanlık Noktası',
        ledger: isEn ? 'Strategic Case Resolution' : 'Stratejik Vaka Çözümü',
        frameworks: isEn ? 'Aligned Governance Standards' : 'Uyumlu Yönetişim Standartları'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const zenVariants = {
        animate: {
            opacity: [0.03, 0.1, 0.03],
            scale: [1, 1.02, 1],
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-stone-50 text-stone-800 p-0 selection:bg-[#312e81] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* ZEN OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    variants={zenVariants}
                    animate="animate"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#312e8105_1px,_transparent_1px)] bg-[size:100px_100px]"
                />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-[0_0_100px_rgba(0,0,0,0.02)]"
            >
                {/* 1. THE MORAL COMPASS HEADER */}
                <header className="w-full relative py-32 px-10 px-24 border-b border-stone-100 bg-white">
                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-16">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-3 py-1 bg-stone-100 text-[#312e81] text-[9px] font-black uppercase tracking-[0.8em] italic">
                                <Scale className="w-4 h-4" /> ETHICS_ADVISOR_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-6xl text-[10rem] font-light text-stone-900 tracking-tighter leading-none italic"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-12 justify-start">
                                     <div className="h-px w-24 bg-stone-200" />
                                     <p className="text-3xl font-light tracking-[0.4em] text-stone-300 uppercase italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-stone-100 shadow-xl relative group hover:-translate-y-2 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#312e81" />
                                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover:scale-100 transition-transform">
                                        <ShieldCheck className="w-6 h-6 text-[#312e81]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-200 italic leading-loose">EST_ADVISOR: {personal.fullName?.split(' ')[0].toUpperCase()}_8823</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-16 mt-24 text-[12px] font-light uppercase tracking-[0.4em] text-stone-300 italic border-t border-stone-50 pt-16">
                        {personal.email && <div className="flex items-center gap-6 hover:text-stone-800 transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#312e81]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-6 hover:text-stone-800 transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#312e81]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-6"><MapPin className="w-5 h-5 text-[#312e81]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-stone-50 flex-1 bg-stone-50/20">
                    
                    {/* LEFT PANEL: GOVERNANCE & THEORY */}
                    <aside className="col-span-4 p-12 space-y-32 bg-stone-50/30 border-r border-stone-100">
                        
                        {/* MORAL PHILOSOPHY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white p-12 border border-stone-100 shadow-sm relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                    <Lightbulb className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-stone-200 flex items-center gap-4 italic mb-10 border-b border-stone-100 pb-4">
                                     <MessageCircle className="w-6 h-6 text-[#312e81]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-stone-600" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* GOVERNANCE FRAMEWORKS (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-stone-200 flex items-center gap-4 italic mb-10 border-b border-stone-100 pb-4">
                                    <Award className="w-6 h-6 text-[#312e81]" /> {t.expertise}
                                </h3>
                                <div className="space-y-8">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-6 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[14px] font-bold uppercase tracking-widest text-stone-400 group-hover/item:text-[#312e81] transition-colors italic whitespace-nowrap">{skill}</span>
                                                <div className="h-px flex-1 bg-stone-100 mx-6 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                <UserCheck className="w-4 h-4 text-stone-200 opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC THEORY (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-16 border-l-[30px] border-[#312e81] bg-white shadow-2xl skew-y-[-1deg] break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-bold uppercase tracking-[1em] text-stone-200 text-center italic mb-16 leading-none pb-4 border-b border-stone-50 skew-y-[1deg] uppercase">{t.education}</h3>
                                <div className="space-y-24 skew-y-[1deg]">
                                    {education.map((edu, i) => (
                                        <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[10px] font-bold text-stone-200 group-hover:text-[#312e81] transition-colors mb-6 tracking-[0.4em] italic uppercase">THESIS_ADVISORY_0{i + 1}</p>
                                            <h4 className="text-4xl font-light italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform uppercase text-stone-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{edu.degree}</h4>
                                            <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-[#312e81]/60 underline underline-offset-8 decoration-stone-200">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: ETHICS CASE LEDGER */}
                    <main className="col-span-8 p-10 p-32 space-y-56 bg-white">
                        
                        {/* THE LEDGER (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-32 transition-all duration-[1.5s] ${highlightedField === 'experience' ? 'bg-stone-50 p-24 -mx-24 rounded-[4rem] shadow-inner border border-stone-100' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2.5em] text-stone-100 mb-32 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <BookOpen className="w-10 h-10 text-[#312e81]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-stone-100 hover:border-[#312e81] transition-all duration-[1s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-1.5 h-32 bg-[#312e81] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-16">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-6xl text-[8rem] font-light text-stone-900 tracking-tighter italic group-hover:text-[#312e81] transition-colors duration-[1s] leading-[0.85]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-20 bg-stone-100 group-hover:w-40 group-hover:bg-[#312e81] transition-all duration-1000" />
                                                        <p className="text-3xl font-light italic text-stone-300 tracking-[0.2em] group-hover:text-stone-500 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>BOARD: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[12px] font-bold text-stone-300 border border-stone-100 px-12 py-5 group-hover:bg-[#312e81] group-hover:text-white transition-all italic tracking-[0.4em] shadow-xl whitespace-nowrap">
                                                    {exp.startDate} – {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-3xl text-stone-400 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-stone-50 pl-24 py-16 group-hover:text-stone-700 group-hover:border-[#312e81] bg-stone-50/30 transition-all duration-1000" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* STRATEGIC FRAMEWORKS HUB */}
                        <div className="p-32 bg-stone-50 border border-stone-100 text-center group relative overflow-hidden transition-all duration-1000 hover:bg-[#312e81]/5">
                             <Scale className="absolute -top-10 -right-10 w-64 h-64 text-stone-200 group-hover:scale-125 transition-transform duration-[8s] opacity-20" />
                             <h4 className="text-[12px] font-black tracking-[2em] text-stone-200 mb-16 italic leading-none relative z-10 uppercase">{t.frameworks}</h4>
                             <div className="grid grid-cols-2 gap-10 relative z-10 text-stone-500 group-hover:text-[#312e81] transition-colors">
                                {[ 'IEEE Ethically Aligned Design', 'UN Bioethics Declaration (2005)', 'EU AI Act Governance Model', 'Corporate Philanthropy Ethical Pass' ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 bg-white border border-stone-100 italic font-light text-xl shadow-sm hover:shadow-xl transition-all break-inside-avoid page-break-inside-avoid" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        <div className="w-2 h-2 bg-[#312e81]" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE MORAL COMPASS FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 bg-white text-stone-400 flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-px bg-stone-100" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-1 bg-[#312e81] opacity-[0.05] group-hover:opacity-100 transition-all duration-[1s]" style={{ height: i * 10 }} />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] uppercase tracking-[2em] mb-6 text-stone-800">{personal.fullName} // MOR_AD_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-40">Balanced Logic // Absolute Ethics // Strategic Wisdom</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-stone-200 group-hover:text-[#312e81] transition-colors relative z-10 p-16 bg-stone-50 rounded-full border border-stone-100 shadow-inner">
                         {[Share2, Globe, Scale, Book].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.5, rotate: 10, color: '#312e81' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-2xl shadow-[#312e81]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
