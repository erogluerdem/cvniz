import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Hammer, HardHat, Construction, Wrench, AlertTriangle, Settings, ChevronRight } from 'lucide-react';

export default function IndustrialRawTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-zinc-900 p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

            {/* INDUSTRIAL CONCRETE BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#d4d4d8]" />
                {/* Concrete Texture Simulation */}
                <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]" />
                <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #a1a1aa 0%, transparent 100%)', backgroundSize: '100% 100%' }} />

                {/* Safety Stripes in background corners */}
                <div className="absolute top-0 right-0 w-64 h-8 bg-zinc-900 rotate-45 translate-x-1/2 -translate-y-1/2 opacity-20"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #18181b 20px, #18181b 40px)' }} />
                <div className="absolute bottom-0 left-0 w-64 h-8 bg-zinc-900 rotate-45 -translate-x-1/2 translate-y-1/2 opacity-20"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #18181b 20px, #18181b 40px)' }} />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-[20px_20px_0px_#18181b] flex flex-col relative z-10 overflow-hidden text-zinc-950 border-[10px] border-zinc-950">

                {/* Header Section - Industrial Stencil Style */}
                <header className="flex flex-col md:flex-row border-b-[6px] border-zinc-950 bg-white">
                    <div className="flex-1 p-16 bg-zinc-950 text-white relative h-full flex flex-col justify-end overflow-hidden group">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -left-10 opacity-10 group-hover:opacity-30 transition-opacity"
                        >
                            <Settings className="w-64 h-64" />
                        </motion.div>

                        <div className="relative z-10 flex flex-col gap-6">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="inline-flex items-center gap-3 bg-[#ff6b00] border-2 border-white px-6 py-2 rounded-sm rotate-[-1deg] shadow-[4px_4px_0px_white]"
                            >
                                <AlertTriangle className="w-5 h-5 fill-white text-[#ff6b00]" />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Unit_01_Identity</span>
                            </motion.div>
                            <h1 className="text-8xl font-black uppercase leading-[0.75] tracking-tighter italic">
                                {personal.fullName?.split(' ').map((name, i) => (
                                    <span key={i} className={i === 1 ? "block text-[#ff6b00] drop-shadow-[4px_4px_0px_white]" : "block"}>
                                        {name}
                                    </span>
                                ))}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="h-0.5 w-12 bg-[#ff6b00]" />
                                <p className="text-2xl font-black uppercase tracking-[0.3em] text-zinc-400">{personal.title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[320px] bg-white p-12 flex flex-col justify-center gap-6 border-l-[6px] border-zinc-950">
                        {personal.photo ? (
                            <div className="w-full aspect-square border-[4px] border-zinc-950 bg-zinc-100 p-1 mb-4 shadow-[8px_8px_0px_#ff6b00] relative group">
                                <img src={personal.photo} alt="" className="w-full h-full object-cover grayscale brightness-110 contrast-125" />
                                <div className="absolute inset-0 bg-[#ff6b00]/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ) : (
                            <div className="w-full aspect-square border-[4px] border-zinc-950 bg-zinc-100 flex items-center justify-center mb-4 shadow-[8px_8px_0px_#ff6b00]">
                                <HardHat className="w-16 h-16 text-zinc-300" />
                            </div>
                        )}
                        <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-950">
                            {[
                                { icon: Mail, value: personal.email, label: 'Trans_Line' },
                                { icon: Phone, value: personal.phone, label: 'Voice_Link' },
                                { icon: MapPin, value: personal.location, label: 'Base_Loc' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 bg-zinc-100 p-3 border-2 border-zinc-950 hover:bg-[#ff6b00] hover:text-white transition-all cursor-default group">
                                    <item.icon className="w-4 h-4 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[6px] text-zinc-400 group-hover:text-white/50">{item.label}</span>
                                        <span className="truncate max-w-[180px]">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="relative z-10 grid grid-cols-12 flex-1 bg-white">
                    {/* Main Content Area */}
                    <div className="col-span-8 p-16 flex flex-col gap-20 border-r-[4px] border-zinc-950">
                        <section className="relative">
                            <div className="absolute -top-10 -left-6 text-[10px] font-black uppercase tracking-[0.8em] text-zinc-200 pointer-events-none select-none">Foundational_Directive</div>
                            <div className="bg-zinc-100 border-4 border-zinc-950 p-10 shadow-[8px_8px_0px_#ff6b00] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-900/5 -rotate-12 translate-x-1/2 -translate-y-1/2" />
                                <p className="text-3xl font-black leading-tight text-zinc-950 uppercase tracking-tighter">
                                    "{personal.summary}"
                                </p>
                            </div>
                        </section>

                        <section className="flex-1">
                            <h2 className="text-xl font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                <span className="bg-[#ff6b00] text-white p-2 border-2 border-zinc-950 shadow-[4px_4px_0px_black]"><Briefcase className="w-6 h-6" /></span>
                                Career_Logistics
                                <div className="flex-1 h-1 bg-zinc-950" />
                            </h2>
                            <div className="space-y-16">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        className="relative pl-12 border-l-[6px] border-zinc-950 group"
                                    >
                                        <div className="absolute -left-[20px] top-0 w-8 h-8 bg-zinc-950 text-white flex items-center justify-center font-black rounded-sm group-hover:bg-[#ff6b00] transition-colors shadow-[4px_4px_0px_#faaf6a]">
                                            {i + 1}
                                        </div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none group-hover:text-[#ff6b00] transition-colors">{exp.position}</h3>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <p className="text-base font-bold text-zinc-500 uppercase tracking-widest italic">{exp.company}</p>
                                                    <div className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black bg-zinc-950 text-white px-4 py-1.5 uppercase tracking-widest border-2 border-zinc-950 shadow-[4px_4px_0px_#ff6b00] whitespace-nowrap">{exp.startDate} <span className="text-[#ff6b00]">/</span> {exp.endDate}</span>
                                        </div>
                                        <div className="text-zinc-700 text-base leading-relaxed font-bold border-t-2 border-zinc-100 pt-6">
                                            {exp.description}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Industrial Sidebar */}
                    <div className="col-span-4 bg-zinc-50 flex flex-col h-full relative overflow-hidden">
                        {/* Vertical Hazard Stripes */}
                        <div className="absolute top-0 right-0 w-2 h-full bg-zinc-900" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #ff6b00, #ff6b00 10px, #18181b 10px, #18181b 20px)' }} />

                        <section className="p-12 border-b-[6px] border-zinc-950 relative z-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff6b00] mb-10 flex items-center gap-3">
                                <Wrench className="w-4 h-4" /> Skill_Module
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05, backgroundColor: '#18181b', color: '#fff' }}
                                        className="inline-flex items-center gap-3 bg-white border-2 border-zinc-950 px-4 py-2 shadow-[4px_4px_0px_#ff6b00] transition-all cursor-default font-black uppercase text-[10px] tracking-widest"
                                    >
                                        <ChevronRight className="w-3 h-3 text-[#ff6b00]" />
                                        {skill}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="p-12 relative z-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-10">Structural_Matrix</h2>
                            <div className="space-y-12">
                                {education.map((edu, i) => (
                                    <div key={i} className="bg-white p-6 border-4 border-zinc-950 shadow-[8px_8px_0px_zinc-200] group hover:shadow-[8px_8px_0px_#ff6b00] transition-all">
                                        <p className="text-[9px] font-black text-zinc-300 mb-3 uppercase tracking-widest group-hover:text-[#ff6b00]">{edu.startDate} <span className="text-zinc-100">—</span> {edu.endDate}</p>
                                        <h4 className="text-xl font-black uppercase leading-[1.1] mb-2 tracking-tighter underline group-hover:no-underline transition-all">{edu.school}</h4>
                                        <p className="text-xs font-bold italic tracking-tight text-zinc-500 uppercase">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-auto p-12 bg-zinc-950 text-white relative overflow-hidden group">
                            <motion.div
                                animate={{ rotate: [0, 90, 180, 270, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-10 -right-10 opacity-10"
                            >
                                <Settings className="w-32 h-32" />
                            </motion.div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 border-2 border-[#ff6b00] flex items-center justify-center bg-white/5 shadow-[0_0_15px_rgba(255,107,0,0.3)]">
                                        <Construction className="w-5 h-5 text-[#ff6b00]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic leading-none mb-1">Raw_Protocol</h4>
                                        <p className="text-[7px] text-[#ff6b00] font-black uppercase tracking-[0.2em]">Verified Load Capacity</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-full h-1 bg-[#ff6b00] shadow-[0_0_5px_#ff6b00]" style={{ opacity: i * 0.15 }} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Industrial Overlay Ornaments */}
                <div className="absolute top-0 bottom-0 left-0 w-2 bg-zinc-950 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-2 bg-zinc-950 pointer-events-none" />
            </div>
        </div>
    );
}
