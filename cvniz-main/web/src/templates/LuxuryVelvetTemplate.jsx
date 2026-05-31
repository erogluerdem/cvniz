import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, PenTool, ShieldCheck, Diamond, Star, Crown } from 'lucide-react';

export default function LuxuryVelvetTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#0f0f0f] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>

            {/* LUXURY BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]" />

                {/* Metallic Shimmer Effect */}
                <motion.div
                    animate={{
                        x: ['-100%', '100%'],
                        opacity: [0, 0.1, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 transform-gpu"
                />

                {/* Subtle Grain / Texture */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

                {/* Floating Gold Accents */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#d4af37]/10 blur-[120px] rounded-full"
                />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-[#161616] shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col relative z-10 overflow-hidden text-stone-300 border border-white/5">

                {/* Gold Trim Borders */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#d4af37]/20 pointer-events-none" />
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#d4af37]/10 pointer-events-none" />

                <header className="pt-24 pb-16 px-20 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 inline-block"
                    >
                        <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-[#d4af37]/40 rounded-full"
                            />
                            <div className="text-4xl font-light text-[#d4af37] italic tracking-tighter z-10">
                                {personal.fullName?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <Diamond className="w-4 h-4 text-[#d4af37] absolute top-0" />
                            <Diamond className="w-4 h-4 text-[#d4af37] absolute bottom-0" />
                        </div>
                    </motion.div>

                    <h1 className="text-7xl font-light text-white tracking-[0.2em] uppercase mb-6 leading-none italic drop-shadow-lg">
                        {personal.fullName}
                    </h1>
                    <div className="flex justify-center items-center gap-4 mb-12">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]" />
                        <p className="text-[#d4af37] text-sm font-bold uppercase tracking-[0.6em]">
                            {personal.title}
                        </p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]" />
                    </div>

                    <div className="flex justify-center items-center gap-10 text-[#888] text-xs uppercase tracking-[0.3em] font-medium border-y border-white/5 py-8 max-w-3xl mx-auto italic backdrop-blur-sm">
                        <div className="flex items-center gap-3 hover:text-[#d4af37] transition-colors"><Mail className="w-4 h-4 text-[#d4af37]/60" /> {personal.email}</div>
                        <div className="flex items-center gap-3 hover:text-[#d4af37] transition-colors"><Phone className="w-4 h-4 text-[#d4af37]/60" /> {personal.phone}</div>
                        <div className="flex items-center gap-3 hover:text-[#d4af37] transition-colors"><MapPin className="w-4 h-4 text-[#d4af37]/60" /> {personal.location}</div>
                    </div>
                </header>

                <main className="flex-1 px-20 grid grid-cols-12 gap-20 pb-20 relative z-10">
                    <div className="col-span-8 space-y-24">
                        <section>
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.8em]">The Executive Vision</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <div className="relative">
                                <Quote className="absolute -left-12 -top-6 text-[#d4af37]/20 w-16 h-16" />
                                <p className="text-3xl text-white font-light leading-[1.6] italic pr-12 text-justify drop-shadow-md">
                                    "{personal.summary}"
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-6 mb-16">
                                <h2 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.8em]">Career Heritage</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <div className="space-y-20">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="group"
                                    >
                                        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6 group-hover:border-[#d4af37]/40 transition-all duration-500">
                                            <div>
                                                <h3 className="text-4xl font-light text-white italic tracking-tight mb-3 group-hover:text-[#d4af37] transition-colors">{exp.position}</h3>
                                                <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                                    <Crown className="w-3 h-3" /> {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em] italic mb-1">{exp.startDate} <span className="text-[#d4af37]/40 px-2">—</span> {exp.endDate}</span>
                                        </div>
                                        <p className="text-[#999] text-lg font-light leading-relaxed pl-12 border-l border-[#d4af37]/10 select-all">
                                            {exp.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 flex flex-col gap-20 border-l border-white/5 pl-10">
                        <section>
                            <h2 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.6em] mb-12 flex items-center gap-3">
                                <Diamond className="w-3 h-3" /> Expertise
                            </h2>
                            <div className="space-y-6">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-6 text-white text-lg font-light italic border-b border-white/5 pb-3 group hover:border-[#d4af37]/30 transition-all">
                                        <div className="w-1.5 h-1.5 bg-[#d4af37]/40 group-hover:bg-[#d4af37] rounded-full transition-colors" />
                                        <span>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.6em] mb-12 flex items-center gap-3">
                                <Diamond className="w-3 h-3" /> Foundation
                            </h2>
                            <div className="space-y-12">
                                {education.map((edu, i) => (
                                    <div key={i} className="relative group">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{edu.startDate} – {edu.endDate}</p>
                                        <h4 className="text-white font-bold text-xl leading-tight uppercase tracking-tighter mb-2 group-hover:text-[#d4af37] transition-colors">{edu.school}</h4>
                                        <p className="text-[#d4af37]/80 text-[11px] italic font-medium tracking-widest border-t border-white/5 pt-2 uppercase">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-auto p-12 bg-black/40 border border-[#d4af37]/20 relative overflow-hidden text-center group">
                            <motion.div
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent"
                            />
                            <Star className="w-12 h-12 text-[#d4af37] mx-auto mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.6em] mb-3 relative z-10">Signature Series</h4>
                            <div className="h-px w-8 bg-[#d4af37] mx-auto mb-4" />
                            <p className="text-[#666] text-[10px] font-bold italic tracking-[0.2em] relative z-10 leading-relaxed uppercase">
                                Verified Portfolio <br /> Executive Grade
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="py-12 px-20 border-t border-white/5 flex justify-between items-center opacity-30 relative z-10">
                    <div className="text-[#666] text-[8px] font-black uppercase tracking-[1em]">
                        LuxuryVelvet_Corporate_Series_2025
                    </div>
                    <Globe className="w-4 h-4 text-[#d4af37]" />
                </footer>
            </div>
        </div>
    );
}
