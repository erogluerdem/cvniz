import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Cpu, Share, Workflow, Network, Binary } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function QuantumComputingTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#7c3aed' // Superposition Purple

    const t = {
        summary: isEn ? 'Quantum Philosophy & Computational Vision' : 'Kuantum Felsefesi ve Hesaplama Vizyonu',
        experience: isEn ? 'Quantum Algorithm Ledger & Experience' : 'Kuantum Algoritma Defteri ve Deneyimi',
        education: isEn ? 'Academic Foundation & Theory' : 'Akademik Temel ve Teori',
        expertise: isEn ? 'Quantum Stack & Fidelity' : 'Kuantum Yığını ve Sadakat',
        contact: isEn ? 'Nodal Signal Node' : 'Düğümsel Sinyal Noktası',
        ledger: isEn ? 'Strategic Algorithm Deployment' : 'Stratejik Algoritma Dağıtımı',
        metrics: isEn ? 'Qubit Performance Metrics' : 'Kubit Performans Metrikleri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const quantumVariants = {
        animate: {
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.05, 1],
            filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div className="min-h-full bg-black text-slate-400 p-0 selection:bg-[#7c3aed] selection:text-white uppercase font-mono overflow-x-hidden"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* QUANTUM OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#7c3aed]/[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <motion.div variants={quantumVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7c3aed]/10 rounded-full blur-[100px]" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-black border-x border-[#7c3aed]/10"
            >
                {/* 1. THE QUBIT STRATEGIST HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-[#7c3aed]/30 bg-[#050505] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05]">
                         <Network className="w-64 h-64 text-[#7c3aed]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#7c3aed]/10 text-[#7c3aed] text-[10px] font-black tracking-[0.6em] border border-[#7c3aed]/30 italic">
                                <Binary className="w-4 h-4 animate-pulse" /> QUANTUM_COMPUTE_v14.2
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[8rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-[#7c3aed] shadow-[0_0_15px_#7c3aed]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-500 italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2 font-mono">
                                        {['QUBIT', 'CIRCUITS', 'ERROR_CORR'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-600 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, rotate: 10 }} animate={{ opacity: 1, rotate: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-[#7c3aed]/30 shadow-[0_0_50px_rgba(124,58,237,0.1)] relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#7c3aed" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-6 h-6 text-[#7c3aed]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-[#7c3aed]/20 italic rotate-90 origin-right">REG_NODE: {personal.fullName?.split(' ')[0].toUpperCase()}_QBT</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#7c3aed] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#7c3aed]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#7c3aed] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#7c3aed]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#7c3aed]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: QUBITS & METRICS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#050505] border-r border-[#7c3aed]/10">
                        
                        {/* QUANTUM SUMMARY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 border border-slate-800 p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                    <Spark className="w-24 h-24 text-[#7c3aed]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                     <Activity className="w-5 h-5 text-[#7c3aed]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* QUBIT PERFORMANCE METRICS */}
                        <section className="bg-[#7c3aed]/5 border border-[#7c3aed]/20 p-10 space-y-12 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                                <Cpu className="w-32 h-32" />
                             </div>
                             <h4 className="text-[11px] font-bold tracking-[0.8em] text-[#7c3aed] mb-full border-b border-[#7c3aed]/20 pb-4 mb-20 italic leading-none uppercase">{t.metrics}</h4>
                             <div className="space-y-10 relative z-10">
                                {[
                                    { label: 'Qubit Fidelity', val: '99.9%' },
                                    { label: 'Coherence T1/T2', val: '150µs' },
                                    { label: 'Gate Error Rate', val: '<0.01%' },
                                    { label: 'Entanglement Density', val: '94%' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/stat">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover/stat:text-white transition-colors">{stat.label}</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-[#7c3aed]">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* QUANTUM STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-10 border-b border-slate-800 pb-4 uppercase">
                                    <Terminal className="w-5 h-5 text-[#7c3aed]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-4 border border-slate-900 bg-black/40 hover:border-[#7c3aed]/30 transition-all cursor-default relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#7c3aed] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                                            <span className="text-[10px] font-bold tracking-widest text-slate-600 group-hover:text-white transition-colors uppercase">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC THEORY (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-900/50 border-y border-slate-800">
                                <h3 className="text-[10px] font-bold tracking-[1em] text-white/5 text-center italic mb-10 leading-none pb-4 border-b border-white/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-bold text-slate-700 group-hover:text-[#7c3aed] transition-colors mb-6 tracking-[0.5em] italic">QUANTUM_FORMATION_0{i + 1}</p>
                                        <h4 className="text-3xl font-bold italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white">{edu.degree}</h4>
                                        <p className="text-[11px] font-bold tracking-[0.3em] text-[#7c3aed]/40 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: ALGORITHM LEDGER */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-black">
                        
                        {/* THE LEDGER (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#7c3aed]/5 p-20 -mx-20 border border-[#7c3aed]/10 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[3em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Binary className="w-10 h-10 text-[#7c3aed]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-900 hover:border-[#7c3aed] transition-all duration-[1.5s]">
                                            <div className="absolute top-0 -left-[2.5px] w-1.5 h-32 bg-[#7c3aed] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#7c3aed]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[8rem] font-bold text-white tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-800 group-hover:w-40 group-hover:bg-[#7c3aed] transition-all duration-1000 shadow-[0_0_10px_#7c3aed]" />
                                                        <p className="text-3xl font-bold text-slate-800 tracking-[0.8em] group-hover:text-slate-500 transition-colors italic leading-none uppercase">LAB_REF: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#7c3aed] px-12 py-5 shadow-3xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.6em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-700 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-950 pl-24 py-16 group-hover:text-slate-300 group-hover:border-[#7c3aed] bg-white/[0.01] transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* QUANTUM STATUS HUB */}
                        <div className="p-32 bg-slate-900 border border-[#7c3aed]/20 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_100px_rgba(124,58,237,0.1)]">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#7c3aed] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000" />
                             <ShieldAlert className="absolute -top-10 -right-10 w-64 h-64 text-[#7c3aed]/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[2.5em] text-[#7c3aed] mb-20 italic leading-none z-10 relative uppercase">{t.ledger}</h4>
                             <div className="space-y-12 relative z-10">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white italic" style={{ letterSpacing: '-0.02em' }}>Quantum Supremacy Validated // NISQ-Era Architecture Lead</p>
                                <p className="text-xl font-bold italic tracking-widest text-slate-600 group-hover:text-white transition-opacity uppercase">Computational Physics Specialist // Multi-Platform Hardware Mastery</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-[#7c3aed]/10 group-hover:text-[#7c3aed] transition-all duration-[1s]">
                                {[Network, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE QUBIT STRATEGIST FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-900 bg-[#050505] text-slate-800 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent shadow-[0_0_20px_#7c3aed]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-24">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 100, 10], backgroundColor: ['#7c3aed', '#3b82f6', '#7c3aed'] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#7c3aed]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[1.8em] mb-8 text-white">{personal.fullName} // QBT_NODE_v14</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40 italic">In Superposition // Zero Error // Absolute Computation</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-900 group-hover:text-[#7c3aed] transition-colors relative z-10 p-20 bg-slate-950 border border-slate-900 rounded-full shadow-3xl">
                         {[Share2, Globe, Cpu, Workflow].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.5, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl shadow-[#7c3aed]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
