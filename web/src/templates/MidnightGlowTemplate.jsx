import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Terminal, Cpu, Share2, Shield, Zap, Activity } from 'lucide-react';

export default function MidnightGlowTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-black p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden print-exact mx-auto print:mx-0" style={{ fontFamily: "'Space Mono', monospace" }}>

            {/* CYBERPUNK BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* 3D Perspective Grid */}
                <div
                    className="absolute bottom-0 left-[-50%] right-[-50%] h-[60%] opacity-40"
                    style={{
                        perspective: '500px',
                        transform: 'rotateX(60deg)',
                        transformStyle: 'preserve-3d',
                        background: 'linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
                        backgroundSize: '80px 80px',
                        maskImage: 'linear-gradient(to top, black, transparent)'
                    }}
                />

                {/* Random Digital "Stars" or Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * i }}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            boxShadow: '0 0 10px #22d3ee'
                        }}
                    />
                ))}

                {/* Digital Scanlines overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-[#0a0a0c]/90 backdrop-blur-md shadow-[0_0_100px_rgba(139,92,246,0.3)] flex flex-col relative z-10 overflow-hidden text-slate-300 border border-violet-500/30">

                {/* Top Interactive Bar */}
                <div className="bg-black/50 border-b border-violet-500/20 px-8 py-3 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-[0.2em] text-violet-400/60">
                        <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> System: Stable</span>
                        <div className="w-px h-3 bg-violet-500/20" />
                        <span>Transmission: Secure</span>
                    </div>
                </div>

                <div className="p-12 flex flex-col h-full gap-16 relative">
                    {/* Header with Glitchy Vibes */}
                    <header className="flex justify-between items-start">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="inline-flex items-center gap-3 px-4 py-1.5 bg-violet-950/40 border border-violet-500/40 rounded-lg"
                            >
                                <Zap className="w-4 h-4 text-violet-400 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Identity_Validated</span>
                            </motion.div>
                            <h1 className="text-7xl font-black text-white leading-[0.9] tracking-tighter">
                                {personal.fullName?.split(' ').map((word, i) => (
                                    <span key={i} className={i === 0 ? "block group relative" : "block text-violet-500"}>
                                        {word}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-xl font-bold uppercase tracking-[0.5em] text-cyan-400 flex items-center gap-3">
                                <Cpu className="w-6 h-6 animate-pulse" /> {personal.title}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: Mail, value: personal.email, color: 'text-violet-400', bg: 'bg-violet-950/20', border: 'border-violet-500/30' },
                                { icon: Phone, value: personal.phone, color: 'text-cyan-400', bg: 'bg-cyan-950/20', border: 'border-cyan-500/30' },
                                { icon: MapPin, value: personal.location, color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-500/30' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: -10 }}
                                    className={`flex items-center gap-4 px-6 py-3 ${item.bg} border ${item.border} rounded-2xl backdrop-blur-xl group cursor-pointer`}
                                >
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.icon.name}</p>
                                        <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors uppercase">{item.value}</p>
                                    </div>
                                    <div className={`p-2 rounded-xl transition-all ${item.color} border ${item.border} group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </header>

                    <main className="grid grid-cols-12 gap-16 flex-1">
                        <div className="col-span-8 space-y-20">
                            {/* Summary as a Terminal Output */}
                            <section>
                                <div className="flex items-center gap-6 mb-10 text-slate-500">
                                    <Terminal className="w-4 h-4" />
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em]">Executing Profile_Scan...</h2>
                                    <div className="flex-1 h-px bg-violet-500/20" />
                                </div>
                                <div className="p-8 bg-black/40 border border-violet-500/20 rounded-[32px] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Activity className="w-12 h-12 text-violet-500" />
                                    </div>
                                    <p className="text-xl font-medium text-slate-500 leading-relaxed italic border-l-4 border-violet-500 pl-8">
                                        "{personal.summary}"
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="p-3 bg-cyan-600/10 border border-cyan-500/30 rounded-2xl rotate-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]"><Briefcase className="w-6 h-6 text-cyan-400" /></div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Experience_Stack</h2>
                                    <div className="flex-1 h-px bg-emerald-500/20" />
                                </div>

                                <div className="space-y-16">
                                    {experience.map((exp, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className="group relative pl-12 border-l-2 border-slate-800 hover:border-violet-500 transition-colors"
                                        >
                                            <div className="absolute -left-[5px] top-0 w-2 h-8 bg-slate-800 group-hover:bg-violet-500 transition-colors" />
                                            <div className="flex justify-between items-baseline mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{exp.position}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-sm font-bold text-violet-500 uppercase tracking-widest">{exp.company}</span>
                                                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                                        <span className="text-[10px] font-black text-slate-500 uppercase">{exp.startDate} - {exp.endDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed font-light">
                                                {exp.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="col-span-4 space-y-16">
                            <section>
                                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                                    Core_Core <div className="flex-1 h-px bg-slate-800" />
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group overflow-hidden break-inside-avoid page-break-inside-avoid">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-slate-500 group-hover:text-cyan-400 transition-colors uppercase tracking-widest leading-none">{skill}</span>
                                                <span className="text-[8px] font-black text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">LVL_{90 - i * 5}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-900 rounded-full border border-white/5 relative overflow-hidden shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${90 - i * 5}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 to-cyan-500 shadow-[0_0_10px_#8b5cf6]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                                    Foundation <div className="flex-1 h-px bg-slate-800" />
                                </h2>
                                <div className="space-y-8">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group relative pl-8 border-l border-emerald-500/20 hover:border-emerald-500 transition-colors break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-1 w-2 h-2 rounded-full border border-emerald-500 bg-black group-hover:bg-emerald-500 transition-colors" />
                                            <p className="text-[8px] font-black text-emerald-500 mb-1 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
                                            <h4 className="text-white font-black text-xs uppercase group-hover:text-cyan-400 transition-colors">{edu.school}</h4>
                                            <p className="text-slate-500 text-[9px] font-bold mt-1 leading-tight">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="bg-gradient-to-br from-violet-600/20 to-black p-8 rounded-[40px] border border-violet-500/30 relative overflow-hidden group">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.1, 0.2, 0.1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-violet-500 blur-3xl rounded-full"
                                />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-violet-400" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol.Finalized</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
                                        Integrity check passed. Carrier ready for deployment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer Signature */}
                    <footer className="pt-12 border-t border-slate-800/50 flex justify-between items-end">
                        <div className="flex gap-4">
                            {[Linkedin, Github, Twitter].map((Icon, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.1, y: -5 }} className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800 hover:text-white hover:border-violet-500 transition-all cursor-pointer">
                                    <Icon className="w-4 h-4" />
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-[8px] font-black uppercase tracking-[1em] text-slate-700 animate-pulse">MidnightGlow_Active_Connection</div>
                    </footer>
                </div>

                {/* Cyber HUD elements */}
                <div className="absolute top-1/2 left-0 w-8 h-32 bg-violet-500/5 -translate-y-1/2 border-r border-violet-500/20 pointer-events-none" />
                <div className="absolute top-1/2 right-0 w-8 h-32 bg-cyan-500/5 -translate-y-1/2 border-l border-cyan-500/20 pointer-events-none" />
            </div>
        </div>
    );
}
