import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Microscope, Palette, History, Pen, Trash2, Brush } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ArtRestorerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#b45309' // Renaissance Gold

    const t = {
        summary: isEn ? 'The Conservation Manifesto' : 'Konservasyon Manifestosu',
        experience: isEn ? 'Restoration Methodology & Project Log' : 'Restorasyon Metodolojisi ve Proje Günlüğü',
        education: isEn ? 'Academic Foundation & Theory' : 'Akademik Temel ve Teori',
        expertise: isEn ? 'Chemical & Visual Analysis Stack' : 'Kimyasal ve Görsel Analiz Yığını',
        contact: isEn ? 'Conservation Node Access' : 'Konservasyon Nokta Erişimi',
        log: isEn ? 'Masterpiece Treatment Registry' : 'Başyapıt Tedavi Kaydı',
        analysis: isEn ? 'Imaging & Forensic Characterization' : 'Görüntüleme ve Adli Karakterizasyon'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const revealVariants = {
        animate: {
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.02, 1],
            transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#fef3c7] text-[#451a03] p-0 selection:bg-[#b45309] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* REVEAL OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={revealVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b45309]/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/canvas.png')" }} />
                <div className="absolute inset-0 bg-[#fef3c7]/60" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-[#b45309]/10"
            >
                {/* 1. THE TIME HEALER HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b-4 border-[#b45309] bg-[#fef3c7]">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Brush className="w-80 h-80 text-[#b45309]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#b45309] text-white text-[10px] font-black uppercase tracking-[0.8em] italic shadow-xl">
                                <History className="w-4 h-4" /> CONSERVATION_NODE_v10.2
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[9rem] font-black text-[#451a03] tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#b45309]/40" />
                                     <p className="text-3xl font-light tracking-[0.4em] text-[#b45309] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2 font-sans">
                                        {['X-RAY', 'INFRARED', 'STABILIZATION'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-[#b45309]/10 text-[9px] font-bold text-[#b45309]/40 tracking-widest uppercase">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-[#b45309]/10 shadow-2xl relative group hover:rotate-2 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#b45309" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Layers className="w-8 h-8 text-[#b45309]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#b45309]/20 italic rotate-90 origin-right">REG: {personal.fullName?.split(' ')[0].toUpperCase()}_RESTOR</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[12px] font-light tracking-[0.5em] text-[#b45309] italic border-t border-[#b45309]/10 pt-12">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#451a03] transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#451a03] transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: ANALYSIS & PERIODS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#fef3c7]/20 border-r border-[#b45309]/10 shadow-inner">
                        
                        {/* THE CONSERVATION ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white p-10 border border-[#b45309]/10 relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <Palette className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#b45309]/20 flex items-center gap-4 italic mb-8 border-b border-[#b45309]/5 pb-4">
                                     <Microscope className="w-6 h-6 text-[#1e40af]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-[#b45309] group-hover:text-[#451a03] transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* ANALYSIS STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#b45309]/20 flex items-center gap-4 italic mb-10 border-b border-[#b45309]/5 pb-4 uppercase">
                                    <Database className="w-5 h-5 text-[#b45309]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center z-10 relative">
                                                <span className="text-[18px] font-light uppercase tracking-widest text-[#b45309]/40 group-hover/item:text-[#451a03] transition-colors italic">{skill}</span>
                                                <div className="h-px bg-[#b45309]/5 flex-1 mx-4" />
                                                <Zap className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-[#1e40af] transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* IMAGING HUB */}
                        <div className="p-10 border-2 border-[#b45309]/10 text-center group bg-[#fef3c7]/50 shadow-inner italic">
                             <h4 className="text-[11px] font-bold uppercase tracking-[1.5em] text-[#b45309]/20 mb-10 italic leading-none">{t.analysis}</h4>
                             <div className="grid grid-cols-2 gap-8 text-[#b45309]/40 group-hover:text-[#b45309] transition-colors relative z-10 text-[9px] font-black uppercase tracking-widest">
                                {[ 
                                    { label: 'X-Ray Diffrac.', val: 'Lead' },
                                    { label: 'IR Reflect.', val: 'Expert' },
                                    { label: 'Laser Clean.', val: 'Adv.' },
                                    { label: 'Chemical Stab.', val: 'Pioneering' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-[#b45309]/10 bg-white break-inside-avoid page-break-inside-avoid">
                                        <p>{item.val}</p>
                                        <span className="text-[8px] font-bold text-slate-500 font-sans">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* ACADEMICS (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-white border-y border-[#b45309]/10 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-[#b45309]/20 text-center mb-10 leading-none pb-4 border-b border-[#b45309]/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-[#b45309]/30 mb-6 tracking-[0.5em]">ACADEMIC_ARC_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-[#451a03] uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-[#b45309]/40 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: TREATMENT LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white shadow-inner">
                        
                        {/* PROJECTS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#fef3c7]/30 p-20 -mx-20 rounded-[4rem] border border-[#b45309]/10 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[3em] text-[#b45309]/10 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Palette className="w-10 h-10 text-[#b45309]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-[#b45309]/10 hover:border-[#b45309] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1px] w-px h-32 bg-[#b45309] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#b45309]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[9rem] font-black text-[#451a03] tracking-tighter italic group-hover:text-[#b45309] transition-colors duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-[#b45309]/10 group-hover:w-40 group-hover:bg-[#b45309] transition-all duration-1000 shadow-[0_0_15px_#b45309]" />
                                                        <p className="text-3xl font-light italic text-[#b45309]/40 tracking-[0.4em] group-hover:text-[#b45309] transition-colors italic leading-none uppercase">SITE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-[#b45309] px-10 py-4 group-hover:bg-[#451a03] transition-all whitespace-nowrap italic tracking-[0.4em] shadow-3xl leading-none">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-slate-500 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-[#fef3c7] pl-24 py-16 group-hover:text-[#451a03] group-hover:border-[#b45309] bg-[#fef3c7]/20 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* TREATMENT FINAL SEAL */}
                        <div className="p-32 bg-[#fef3c7] border border-[#b45309]/20 text-center group relative overflow-hidden transition-all duration-1000 shadow-inner">
                             <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#b45309] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Trash2 className="absolute -top-10 -right-10 w-96 h-96 text-[#b45309]/5 group-hover:rotate-45 transition-all duration-[12s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[4em] text-[#b45309]/40 mb-20 italic leading-none z-10 relative uppercase">{t.log}</h4>
                             <div className="space-y-12 relative z-10 italic">
                                <p className="text-5xl text-7xl font-black italic tracking-tighter leading-none italic uppercase">Advanced Masterpiece Restorer // Curator of Historical Authenticity</p>
                                <p className="text-2xl font-black italic tracking-[0.8em] opacity-10 group-hover:opacity-100 transition-opacity uppercase text-[#b45309]">Preserving the Infinite @ Historical Scale // Scientific Precision</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-[#b45309]/10 group-hover:text-[#b45309] transition-all duration-[1s]">
                                {[Microscope, Activity, Globe, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE TIME HEALER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t border-[#b45309]/10 bg-[#fef3c7] text-[#b45309]/10 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[5px] bg-[#b45309] shadow-[0_0_20px_rgba(180,83,9,0.5)]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#b45309]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2em] mb-6 text-[#451a03] leading-none">{personal.fullName} // REST_NODE_v10</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-40 uppercase italic text-[#b45309]">Healing the Past // Preserving the Present // Defining the Future</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-[#b45309]/20 group-hover:text-[#b45309] transition-colors relative z-10 p-20 bg-white border border-[#b45309]/10 rounded-full shadow-3xl">
                         {[Share2, Globe, Spark, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#451a03' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
