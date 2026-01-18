import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Zap, Circle, Square, Triangle } from 'lucide-react';

export default function BauhausLegacyTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#d1d1d1] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

            {/* BACKGROUND FON - BAUHAUS GRID & SHAPES */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }} />

                {/* Floating Primary Shapes */}
                <motion.div
                    animate={{ y: [0, -50, 0], rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-10 w-64 h-64 bg-[#e63946] rounded-full opacity-40 blur-xl"
                />
                <motion.div
                    animate={{ x: [0, 100, 0], rotate: -45 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-40 right-20 w-80 h-80 bg-[#ffb703] opacity-30 blur-2xl"
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                />
                <motion.div
                    animate={{ y: [0, 100, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#0077b6] opacity-30 blur-xl"
                />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-[#faf8f5] shadow-[0_0_100px_rgba(0,0,0,0.3)] flex flex-col relative z-10 overflow-hidden text-stone-900 border-[8px] border-black">

                {/* Asymmetric Bauhaus Header */}
                <header className="grid grid-cols-12 border-b-[8px] border-black">
                    <div className="col-span-8 p-12 bg-[#e63946] text-white flex flex-col justify-end border-r-[8px] border-black relative overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/20 rounded-full" />
                        <motion.h1
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-7xl font-black uppercase leading-[0.85] tracking-tighter mb-4 relative z-10"
                        >
                            {personal.fullName}
                        </motion.h1>
                        <p className="text-2xl font-bold uppercase tracking-[0.3em] relative z-10">{personal.title}</p>
                    </div>
                    <div className="col-span-4 bg-[#ffb703] p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-16 h-16 bg-black flex items-center justify-center">
                                <span className="text-white font-black text-4xl">B.</span>
                            </div>
                            <div className="w-8 h-8 bg-[#e63946] rotate-45" />
                        </div>
                        <div className="space-y-3 text-[10px] font-black uppercase tracking-widest leading-tight">
                            <div className="flex items-center gap-3 border-b-2 border-black pb-1"><Mail className="w-4 h-4" /> {personal.email}</div>
                            <div className="flex items-center gap-3 border-b-2 border-black pb-1"><Phone className="w-4 h-4" /> {personal.phone}</div>
                            <div className="flex items-center gap-3 border-b-2 border-black pb-1"><MapPin className="w-4 h-4" /> {personal.location}</div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 grid grid-cols-12">
                    {/* Left Sidebar - Summary & Skills */}
                    <div className="col-span-4 border-r-[8px] border-black flex flex-col">
                        <section className="p-8 border-b-[8px] border-black bg-[#faf8f5]">
                            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                                <div className="w-6 h-6 bg-[#e63946] flex-shrink-0" /> Profile
                            </h2>
                            <p className="text-sm font-bold leading-relaxed">
                                {personal.summary}
                            </p>
                        </section>

                        <section className="p-8 flex-1 bg-[#0077b6]/5">
                            <h2 className="text-2xl font-black uppercase mb-8 border-b-4 border-black pb-2">Skills</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className={`w-4 h-4 border-2 border-black ${i % 3 === 0 ? 'bg-[#ffb703]' : i % 3 === 1 ? 'bg-[#e63946]' : 'bg-black'}`} />
                                        <span className="text-xs font-black uppercase tracking-wider">{skill}</span>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-2xl font-black uppercase mt-12 mb-8 border-b-4 border-black pb-2">Linguistic</h2>
                            <div className="space-y-4">
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase">{lang.name}</span>
                                        <div className="h-4 w-full bg-stone-200 border-2 border-black relative overflow-hidden">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-[#ffb703]"
                                                style={{ width: lang.level?.toLowerCase().includes('adv') || lang.level?.toLowerCase().includes('native') ? '100%' : '70%' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-8 bg-black text-white text-[10px] font-black uppercase tracking-widest mt-auto flex justify-between items-end">
                            <span>Weimar // Dessau // Berlin</span>
                            <div className="w-8 h-8 rounded-full bg-[#e63946]" />
                        </div>
                    </div>

                    {/* Right Content - Experience & Education */}
                    <div className="col-span-8 bg-white p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 -z-10 -translate-y-1/2 translate-x-1/2 rotate-12" />

                        <section className="mb-16">
                            <h2 className="text-5xl font-black uppercase mb-12 flex items-center gap-4 relative">
                                <span className="z-10">Experience</span>
                                <div className="absolute -left-16 right-0 h-4 bg-[#ffb703]/20 -rotate-1" />
                            </h2>
                            <div className="space-y-16">
                                {experience.map((exp, i) => (
                                    <div key={i} className="relative pl-10 border-l-[6px] border-black">
                                        <div className="absolute -left-4 top-0 w-6 h-6 bg-black" />
                                        <div className="flex flex-col mb-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-3xl font-black uppercase leading-none">{exp.position}</h3>
                                                <span className="text-[10px] font-black bg-black text-white px-3 py-1 ml-4 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-lg font-black text-[#e63946] uppercase mt-2">{exp.company}</p>
                                        </div>
                                        <p className="text-sm text-stone-700 font-bold leading-relaxed">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-5xl font-black uppercase mb-12 flex items-center gap-4 relative">
                                <span className="z-10">Academic</span>
                                <div className="absolute -left-16 right-0 h-4 bg-[#0077b6]/20 rotate-1" />
                            </h2>
                            <div className="grid grid-cols-1 gap-8">
                                {education.map((edu, i) => (
                                    <div key={i} className="p-8 border-[6px] border-black bg-[#faf8f5] flex items-start gap-6 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-[#ffb703] translate-x-6 -translate-y-6 rotate-45" />
                                        <div className="w-16 h-16 bg-black flex-shrink-0 flex items-center justify-center">
                                            <GraduationCap className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase text-stone-500 mb-2">{edu.startDate} - {edu.endDate}</p>
                                            <h4 className="font-black text-2xl uppercase leading-tight mb-2">{edu.school}</h4>
                                            <p className="text-sm font-black italic border-t-2 border-black pt-2 uppercase">{edu.degree}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
