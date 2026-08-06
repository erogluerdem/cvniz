import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Cpu, Share, Workflow, Network, Binary, Boxes, Layers as LayersIcon, Microscope } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function NanoEngineerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#2dd4bf' // Precision Teal

    const t = {
        summary: isEn ? 'The Atomic Manifesto' : 'Atomik Manifesto',
        experience: isEn ? 'Nanofabrication & Project Log' : 'Nanofabrikasyon ve Proje Günlüğü',
        education: isEn ? 'Foundational Training & Academics' : 'Temel Eğitim ve Akademik',
        expertise: isEn ? 'Molecular Precision Stack' : 'Moleküler Hassasiyet Yığını',
        contact: isEn ? 'Cleanroom Node Access' : 'Temiz Oda Nokta Erişimi',
        log: isEn ? 'Precision Fabrication Registry' : 'Hassas Fabrikasyon Kaydı',
        characterization: isEn ? 'Imaging & Characterization Mastery' : 'Görüntüleme ve Karakterizasyon Ustalığı'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const latticeVariants = {
        animate: {
            scale: [1, 1.02, 1],
            opacity: [0.03, 0.08, 0.03],
            transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-50 text-slate-500 p-0 selection:bg-[#2dd4bf] selection:text-black uppercase font-mono overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* LATTICE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-slate-100" />
                <motion.div 
                    variants={latticeVariants}
                    animate="animate"
                    className="absolute inset-0 bg-[#2dd4bf]/[0.05]" 
                    style={{ backgroundImage: 'linear-gradient(rgba(45,212,191,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
                />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-100"
            >
                {/* 1. THE ATOMIC WEAVER HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-[#2dd4bf]/30 bg-slate-50 overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05]">
                         <Boxes className="w-80 h-80 text-[#2dd4bf]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#2dd4bf]/5 text-[#2dd4bf] text-[10px] font-black tracking-[0.8em] border border-[#2dd4bf]/20 italic uppercase">
                                <Activity className="w-4 h-4 animate-pulse" /> NANO_STRUCT_v10.5
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[8rem] font-bold text-slate-900 tracking-tighter leading-none italic uppercase"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[1px] w-24 bg-[#2dd4bf] shadow-[0_0_15px_#2dd4bf]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-300 italic uppercase">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2 font-mono">
                                        {['ISO_1', 'CLEANROOM', 'EOP'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500 tracking-widest uppercase">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-[#2dd4bf]/30 shadow-2xl relative group hover:scale-110 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#2dd4bf" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-6 h-6 text-[#2dd4bf]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-[#2dd4bf]/20 italic rotate-90 origin-right uppercase leading-loose font-mono">NODE_REF: {personal.fullName?.split(' ')[0].toUpperCase()}_ATOMIC</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-[#2dd4bf] italic border-t border-slate-100 pt-16 uppercase">
                        {personal.email && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: PRECISION & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50/50 border-r border-slate-100">
                        
                        {/* ATOMIC MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white border border-slate-200 p-10 relative overflow-hidden shadow-sm break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                    <Spark className="w-24 h-24 text-[#2dd4bf]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-8 border-b border-slate-200 pb-4 uppercase">
                                     <Target className="w-5 h-5 text-[#2dd4bf]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold leading-relaxed text-slate-500 group-hover:text-slate-900 transition-colors uppercase">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* PRECISION STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-200 pb-4 uppercase">
                                    <LayersIcon className="w-5 h-5 text-[#2dd4bf]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-4 border border-slate-200 bg-white hover:border-[#2dd4bf] hover:shadow-xl transition-all cursor-default break-inside-avoid page-break-inside-avoid">
                                            <span className="text-[10px] font-black tracking-widest text-slate-300 group-hover:text-[#2dd4bf] transition-colors uppercase font-mono">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* IMAGING MASTERY HUB */}
                        <div className="p-10 border-2 border-[#2dd4bf]/10 text-center group bg-slate-50 relative overflow-hidden shadow-inner">
                             <h4 className="text-[11px] font-bold tracking-[1.5em] text-slate-200 mb-10 italic leading-none uppercase">{t.characterization}</h4>
                             <div className="grid grid-cols-2 gap-8 text-slate-300 group-hover:text-[#2dd4bf] transition-colors uppercase font-mono text-[9px]">
                                {[ 
                                    { icon: Microscope, label: 'SEM/TEM' },
                                    { icon: Activity, label: 'AFM_Scan' },
                                    { icon: Binary, label: 'E-Beam' },
                                    { icon: ShieldCheck, label: 'ISO_Clean' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-slate-200 group-hover:border-[#2dd4bf]/20 transition-all bg-white break-inside-avoid page-break-inside-avoid">
                                        <item.icon className="w-8 h-8" />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-100 border-y border-slate-200 uppercase break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-bold tracking-[1em] text-slate-300 text-center italic mb-10 leading-none pb-4 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-bold text-[#2dd4bf] mb-6 tracking-[0.5em] italic">STRUCT_FORMATION_#0{i + 1}</p>
                                        <h4 className="text-3xl font-bold italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-bold tracking-[0.3em] text-[#2dd4bf]/40 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: FABRICATION LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white font-mono">
                        
                        {/* FABRICATION LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#2dd4bf]/5 p-20 -mx-20 rounded-[4rem] border border-[#2dd4bf]/10 shadow-2xl' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[3em] text-slate-100 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Boxes className="w-10 h-10 text-[#2dd4bf]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-100 hover:border-[#2dd4bf] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2.5px] w-1.5 h-32 bg-[#2dd4bf] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_50px_#2dd4bf]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[7rem] font-bold text-slate-900 tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-200 group-hover:w-40 group-hover:bg-[#2dd4bf] transition-all duration-1000 shadow-[0_0_15px_#2dd4bf]" />
                                                        <p className="text-2xl font-bold text-slate-200 tracking-[0.8em] group-hover:text-slate-500 transition-colors italic leading-none uppercase">ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-white bg-slate-900 px-12 py-5 shadow-3xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.6em] leading-none uppercase">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-500 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-50 pl-24 py-16 group-hover:text-slate-600 group-hover:border-[#2dd4bf] bg-slate-50 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PRECISION HUB */}
                        <div className="p-32 bg-slate-50 border border-slate-200 text-center group relative overflow-hidden transition-all duration-1000 hover:bg-[#2dd4bf]/5 shadow-inner">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#2dd4bf] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <BoxIcon className="absolute -top-10 -right-10 w-64 h-64 text-[#2dd4bf]/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[3em] text-slate-200 mb-20 italic leading-none z-10 relative uppercase">{t.log}</h4>
                             <div className="space-y-12 relative z-10 uppercase">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-slate-900 uppercase">At-Scale Nanofabrication Lead // Advanced Materials Architect</p>
                                <p className="text-xl font-bold italic tracking-widest text-slate-300 group-hover:text-[#2dd4bf] transition-opacity uppercase">Precise Molecular Assembly // Semiconductor Innovation Specialist</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-slate-200 group-hover:text-[#2dd4bf] transition-all duration-[1s]">
                                {[Terminal, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE ATOMIC WEAVER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-100 bg-slate-50 text-slate-200 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#2dd4bf] to-transparent shadow-[0_0_20px_#2dd4bf]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-1 bg-[#2dd4bf]/30" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[1.8em] mb-6 text-slate-800 uppercase">{personal.fullName} // ATOM_ST_v10</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40 uppercase italic">Atomic Precision // Structural Mastery // Absolute Control</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-200 group-hover:text-[#2dd4bf] transition-colors relative z-10 p-16 bg-white rounded-0 border border-slate-200 shadow-xl">
                         {[Share2, Globe, Spark, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.2, color: '#000000' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl shadow-[#2dd4bf]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}

function BoxIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
