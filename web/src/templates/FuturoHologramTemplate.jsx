import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Radio, Activity, Box, Zap, Cpu, Terminal, Shield } from 'lucide-react';

export default function FuturoHologramTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#0a0a0f] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

            {/* FUTURO HOLOGRAM BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0a0a0f]" />

                {/* Hexagonal Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' fill='%23ffffff' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Animated Light Sweeps */}
                <motion.div
                    animate={{ x: ['-100%', '200%'], opacity: [0, 0.3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-64 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent skew-x-[-30deg]"
                />

                {/* Floating HUD Bubbles */}
                <motion.div
                    animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-[10%] left-[5%] w-96 h-96 bg-indigo-600 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ y: [0, 50, 0], scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-[10%] right-[0%] w-[500px] h-[500px] bg-cyan-600 rounded-full blur-[120px]"
                />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white/5 backdrop-blur-[30px] shadow-[0_0_100px_rgba(79,70,229,0.3)] flex flex-col relative z-10 overflow-hidden text-cyan-50 border border-white/10">

                {/* Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

                <div className="p-12 flex flex-col h-full gap-12 relative z-10">
                    <header className="flex flex-col gap-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-flex items-center gap-3 bg-cyan-500/20 border border-cyan-500/40 px-6 py-2 rounded-lg"
                                >
                                    <Radio className="w-4 h-4 text-cyan-400 animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-300">Bio_Matrix_Activated</span>
                                </motion.div>
                                <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white">
                                    {personal.fullName?.split(' ').map((name, i) => (
                                        <span key={i} className={i === 1 ? "block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "block"}>
                                            {name}
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            <div className="w-48 h-48 relative group">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full" />
                                <div className="absolute inset-2 border border-indigo-500/30 rounded-full animate-pulse" />
                                <div className="w-full h-full p-2 relative rounded-full overflow-hidden">
                                    {personal.photo ? (
                                        <img src={personal.photo} alt="" className="w-full h-full object-cover rounded-full mix-blend-screen opacity-90 grayscale" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-950/50 rounded-full">
                                            <Cpu className="w-16 h-16 text-cyan-400/20" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6">
                            <div className="col-span-1 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Primary Title</p>
                                <p className="text-xl font-bold text-cyan-300 uppercase truncate"><Box className="w-4 h-4 inline mr-2" /> {personal.title}</p>
                            </div>
                            <div className="col-span-3 grid grid-cols-3 gap-6">
                                {[
                                    { icon: Mail, value: personal.email, label: 'Transmission', color: 'text-indigo-400' },
                                    { icon: Phone, value: personal.phone, label: 'Direct_Link', color: 'text-cyan-400' },
                                    { icon: MapPin, value: personal.location, label: 'Coordinates', color: 'text-purple-400' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md group hover:bg-white/10 transition-colors">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`w-4 h-4 ${item.color}`} />
                                            <span className="text-xs font-bold text-white/80 truncate">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </header>

                    <main className="grid grid-cols-12 gap-10 flex-1">
                        <div className="col-span-12 flex flex-col gap-10">
                            {/* Narrative Module */}
                            <section className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-[40px] opacity-20 blur group-hover:opacity-40 transition-opacity" />
                                <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 overflow-hidden">
                                    <Terminal className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                                    <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.6em] mb-6 flex items-center gap-4">
                                        <Activity className="w-4 h-4 animate-pulse" /> Narrative_Core_Dump
                                    </h2>
                                    <p className="text-2xl font-light text-cyan-50 leading-relaxed italic balance-text">
                                        "{personal.summary}"
                                    </p>
                                </div>
                            </section>

                            <div className="grid grid-cols-12 gap-10 overflow-hidden">
                                {/* Experience Segment */}
                                <section className="col-span-8 space-y-12">
                                    <h2 className="text-2xl font-black uppercase tracking-[0.4em] flex items-center gap-6 text-white group">
                                        <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl group-hover:rotate-12 transition-transform">
                                            <Briefcase className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        Timeline_Sequential_Data
                                        <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                                    </h2>

                                    <div className="space-y-12">
                                        {experience.map((exp, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ x: 10 }}
                                                className="relative pl-12 border-l-2 border-white/10 group"
                                            >
                                                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-[#0a0a0f] border-2 border-cyan-500 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                                                    <div className="w-full h-full bg-cyan-500 animate-ping rounded-full" />
                                                </div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-3xl font-black uppercase tracking-tight text-white group-hover:text-cyan-300 transition-colors">{exp.position}</h3>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{exp.company}</p>
                                                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{exp.startDate} :: {exp.endDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-cyan-100/60 text-base leading-relaxed font-light pl-6 border-l border-white/5 group-hover:text-cyan-100 transition-colors">
                                                    {exp.description}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>

                                {/* Side Modules */}
                                <aside className="col-span-4 space-y-12">
                                    <section>
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-8 border-b border-cyan-500/20 pb-2">Skill_Node_Inventory</h2>
                                        <div className="space-y-4">
                                            {skills.map((skill, i) => (
                                                <div key={i} className="group cursor-default">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-cyan-400 transition-colors">{skill}</span>
                                                        <span className="text-[8px] font-bold text-cyan-500/50">LVL_{100 - i * 5}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/5 rounded-full relative overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${100 - i * 5}%` }}
                                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-indigo-500 shadow-[0_0_10px_#06b6d4]"
                                                        />
                                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-30 pointer-events-none" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-8 border-b border-indigo-500/20 pb-2">Academic_Archive</h2>
                                        <div className="space-y-8">
                                            {education.map((edu, i) => (
                                                <div key={i} className="relative pl-6 border-l-2 border-indigo-500/30 group hover:border-indigo-400 transition-colors">
                                                    <div className="absolute -left-[7px] top-0 w-3 h-3 bg-[#0a0a0f] border border-indigo-400 rotate-45 group-hover:scale-125 transition-all" />
                                                    <p className="text-[9px] font-black text-white/20 mb-2 uppercase tracking-widest">{edu.startDate} <span className="text-indigo-900">—</span> {edu.endDate}</p>
                                                    <h4 className="text-white font-black text-xs uppercase leading-tight mb-2 tracking-tighter group-hover:text-indigo-300 transition-colors">{edu.school}</h4>
                                                    <p className="text-indigo-400 text-[10px] font-bold italic border-t border-white/5 pt-2">{edu.degree}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="mt-auto p-8 bg-gradient-to-t from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-3xl text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-sm" />
                                        <Shield className="w-10 h-10 text-cyan-400/30 mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform" />
                                        <div className="relative z-10">
                                            <h4 className="text-white font-black text-[9px] uppercase tracking-[0.5em] mb-2 leading-none">Security_Protocol_Verified</h4>
                                            <div className="h-0.5 w-8 bg-cyan-500 mx-auto mb-4" />
                                            <p className="text-[7px] text-cyan-400/50 font-black uppercase tracking-[1em] select-none">Auth_Token: #2025_FT_HL</p>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </main>

                    {/* Industrial Footer Details */}
                    <footer className="mt-auto pt-10 border-t border-white/5 flex justify-between items-end opacity-20 hover:opacity-100 transition-opacity">
                        <div className="flex gap-4">
                            {[Globe, Zap, Activity].map((Icon, i) => (
                                <Icon key={i} className="w-5 h-5 text-white/50 hover:text-cyan-400 cursor-pointer transition-colors" />
                            ))}
                        </div>
                        <div className="text-right">
                            <p className="text-[7px] font-black uppercase tracking-[0.8em] text-white/40 mb-1">FuturoHologram_v2.1_Industrial_Grade</p>
                            <p className="text-[6px] font-bold text-white/20 uppercase tracking-[0.4em]">Designed for high-latency interstellar transmissions</p>
                        </div>
                    </footer>
                </div>

                {/* Cyber Frame Trim */}
                <div className="absolute top-0 left-0 w-32 h-1 border-t-2 border-white/10 pointer-events-none" />
                <div className="absolute top-0 left-0 h-32 w-1 border-l-2 border-white/10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-32 h-1 border-b-2 border-white/10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 h-32 w-1 border-r-2 border-white/10 pointer-events-none" />
            </div>
        </div>
    );
}
