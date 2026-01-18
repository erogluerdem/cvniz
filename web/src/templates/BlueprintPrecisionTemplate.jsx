import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Ruler, Move, Compass, Settings, Hash, Layout } from 'lucide-react';

export default function BlueprintPrecisionTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#002b5c] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Space Mono', monospace" }}>

            {/* BLUEPRINT BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#003366]" />

                {/* Micro Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                />
                {/* Major Grid */}
                <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />

                {/* Technical Annotations */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/40 tracking-[2em] uppercase">Blueprint_System_v2.0</div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-bold text-white/40 rotate-90 tracking-[1em] uppercase">Coord: {personal.fullName?.length},127</div>

                {/* Corner Marks */}
                <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/40" />
                <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-white/40" />
                <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-white/40" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/40" />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-[#0047ab]/90 backdrop-blur-md shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col relative z-10 overflow-hidden text-white p-12 border border-white/30">

                {/* Title Block Style Header */}
                <header className="relative z-10 border-[3px] border-white p-0 mb-16 flex flex-col">
                    <div className="flex border-b-[3px] border-white">
                        <div className="p-10 flex-1 border-r-[3px] border-white">
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.4em] text-blue-200 mb-4">
                                <Hash className="w-4 h-4" /> Technical_Spec // Profile_01
                            </div>
                            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
                                {personal.fullName}
                            </h1>
                        </div>
                        <div className="w-48 flex items-center justify-center p-4">
                            {personal.photo ? (
                                <img src={personal.photo} alt="" className="w-full grayscale brightness-125 contrast-125 border border-white/20" />
                            ) : (
                                <Layout className="w-20 h-20 opacity-20" />
                            )}
                        </div>
                    </div>

                    <div className="flex bg-white text-[#0047ab]">
                        <div className="flex-1 p-6 flex items-center gap-6">
                            <Compass className="w-8 h-8 animate-spin-slow" />
                            <p className="text-2xl font-black uppercase tracking-[0.2em]">{personal.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 p-6 border-l-[3px] border-[#0047ab] text-[10px] font-black uppercase tracking-widest bg-blue-50">
                            <div className="flex items-center gap-2 text-[#0047ab]"><Mail className="w-3 h-3" /> {personal.email}</div>
                            <div className="flex items-center gap-2 text-[#0047ab]"><Phone className="w-3 h-3" /> {personal.phone}</div>
                            <div className="flex items-center gap-2 text-[#0047ab] col-span-2"><MapPin className="w-3 h-3" /> {personal.location}</div>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 grid grid-cols-12 gap-12 flex-1">
                    <div className="col-span-8 flex flex-col gap-12">
                        {/* Abstract Section */}
                        <section className="relative p-10 bg-white/5 border-2 border-dashed border-white/20">
                            <div className="absolute -top-3 left-6 px-3 bg-[#0047ab] text-[10px] font-black uppercase tracking-[0.3em] border-2 border-white">Abstract</div>
                            <p className="text-xl font-bold leading-relaxed italic text-white group">
                                {personal.summary}
                            </p>
                            {/* Decorative measuring lines */}
                            <div className="absolute top-0 bottom-0 -left-6 flex flex-col justify-between py-4">
                                {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-px bg-white/20" />)}
                            </div>
                        </section>

                        <section className="flex-1">
                            <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-12 flex items-center gap-6">
                                <Briefcase className="w-6 h-6" /> Component_History
                                <div className="flex-1 h-px bg-white/30 border-b border-white/10" />
                            </h2>

                            <div className="space-y-12">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="relative pl-12 border-l-2 border-white/40 group"
                                    >
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-[#0047ab] border-2 border-white flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform">
                                            <div className="w-1.5 h-1.5 bg-white shadow-[0_0_10px_white]" />
                                        </div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-3xl font-black uppercase tracking-tight leading-none group-hover:text-blue-200 transition-colors">{exp.position}</h3>
                                                <p className="text-base font-bold text-blue-300 uppercase mt-3 tracking-widest flex items-center gap-2">
                                                    <Ruler className="w-4 h-4" /> {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black border-2 border-white px-4 py-1.5 bg-white/5 whitespace-nowrap">{exp.startDate} <span className="mx-2 text-blue-200">/</span> {exp.endDate}</span>
                                        </div>
                                        <p className="text-white/80 text-base leading-relaxed font-bold border-t border-white/10 pt-4">
                                            {exp.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 flex flex-col gap-12">
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-200 mb-8 border-b-2 border-white/40 pb-3 flex items-center justify-between">
                                System_Assets <Settings className="w-4 h-4" />
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="group cursor-default">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-cyan-300 transition-colors">{skill}</span>
                                            <span className="text-[8px] font-black opacity-30 italic">Validated</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 relative overflow-hidden">
                                            <div className="absolute inset-y-0 left-0 bg-white w-full opacity-60 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-y-0 right-0 w-[15%] bg-[#0047ab] z-10" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-200 mb-8 border-b-2 border-white/40 pb-3 flex items-center justify-between">
                                Ledger_Matrix <GraduationCap className="w-4 h-4" />
                            </h2>
                            <div className="space-y-8">
                                {education.map((edu, i) => (
                                    <div key={i} className="relative pl-6 border-l-4 border-white group">
                                        <p className="text-[9px] font-black text-blue-200 mb-2 uppercase tracking-tight">{edu.startDate} – {edu.endDate}</p>
                                        <h4 className="font-black text-base uppercase leading-tight mb-2 group-hover:underline">{edu.school}</h4>
                                        <div className="flex items-center gap-2 text-blue-200 text-[10px] font-bold italic uppercase tracking-tighter">
                                            <Move className="w-3 h-3" /> {edu.degree}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-auto p-10 border-[3px] border-white bg-blue-900 shadow-2xl relative group overflow-hidden">
                            <motion.div
                                animate={{ rotate: [0, 90, 180, 270, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-10 -right-10 opacity-10"
                            >
                                <Settings className="w-40 h-40" />
                            </motion.div>
                            <div className="relative z-10">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.6em] mb-4 border-b border-white/30 pb-2">Precision_Grade</h4>
                                <div className="space-y-3 text-[9px] font-black uppercase tracking-widest text-blue-200">
                                    <div className="flex justify-between"><span>Status:</span> <span className="text-white">Active</span></div>
                                    <div className="flex justify-between"><span>Scale:</span> <span className="text-white">1:1 Performance</span></div>
                                    <div className="flex justify-between"><span>Registry:</span> <span className="text-white">#2025_FULL_DEV</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom Dimension Line */}
                <footer className="mt-16 pt-8 border-t-[3px] border-white flex justify-between items-center relative">
                    <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 bg-[#0047ab] px-4 text-[10px] font-black uppercase tracking-[1em]">210.00mm</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
                        Drafting_Office_Portfolio_Press
                    </div>
                    <div className="flex gap-6 opacity-40">
                        {[Globe, Layout, Ruler].map((Icon, i) => <Icon key={i} className="w-4 h-4" />)}
                    </div>
                </footer>
            </div>
        </div>
    );
}
