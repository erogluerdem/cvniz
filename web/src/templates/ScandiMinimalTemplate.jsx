import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Minus, Circle, ArrowRight } from 'lucide-react';

export default function ScandiMinimalTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#fdfdfd] p-0 sm:p-12 flex justify-center py-10 relative overflow-hidden print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* SCANDI MINIMALIST FON (Ultra Clean) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Very subtle soft shadows as "blobs" */}
                <div className="absolute top-[5%] right-[10%] w-[30%] h-[30%] bg-[#f5f5f5] rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[5%] left-[10%] w-[40%] h-[40%] bg-[#fafafa] rounded-full blur-[120px] opacity-40" />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-[0_0_80px_rgba(0,0,0,0.02)] flex flex-col p-24 text-[#1a1a1a] relative z-10 border border-[#f0f0f0]">

                <header className="mb-32 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-8xl font-thin tracking-[-5px] leading-none mb-10 text-stone-900">
                            {personal.fullName}
                        </h1>
                    </motion.div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-light text-stone-400 tracking-[-0.02em] balance-text max-w-xl"
                        >
                            {personal.title}
                        </motion.p>

                        <div className="space-y-2 text-right">
                            {[personal.email, personal.phone, personal.location].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-300 hover:text-stone-900 transition-colors cursor-default"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-12 gap-24 flex-1">
                    <div className="col-span-8 flex flex-col gap-32">
                        {/* Summary Section */}
                        <section>
                            <p className="text-3xl font-light leading-[1.6] text-stone-500 tracking-tight italic">
                                "{personal.summary}"
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-200 mb-16 flex items-center gap-6">
                                <div className="w-1.5 h-1.5 rounded-full border border-stone-300" /> Professional Journal
                            </h2>
                            <div className="space-y-24">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="group"
                                    >
                                        <div className="flex justify-between items-baseline mb-8">
                                            <h3 className="text-4xl font-extralight tracking-tighter text-stone-800 group-hover:translate-x-4 transition-transform duration-500">{exp.position}</h3>
                                            <span className="text-[10px] font-bold text-stone-200 uppercase tracking-widest">{exp.startDate} <span className="mx-2 text-stone-100">//</span> {exp.endDate}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-8 h-px bg-stone-100 group-hover:w-16 transition-all duration-500" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 group-hover:text-stone-800 transition-colors">{exp.company}</p>
                                        </div>
                                        <p className="text-stone-500 text-base leading-relaxed font-light max-w-2xl select-all">
                                            {exp.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 flex flex-col gap-24 border-l border-stone-50 pl-20">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-200 mb-12">Expertise Toolbox</h2>
                            <div className="space-y-6">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-stone-100 group-hover:bg-stone-800 transition-colors rounded-full" />
                                        <span className="text-xs font-light text-stone-400 group-hover:text-stone-900 group-hover:font-medium transition-all uppercase tracking-widest">{skill}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-200 mb-12">Academic Journey</h2>
                            <div className="space-y-16">
                                {education.map((edu, i) => (
                                    <div key={i} className="group break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-stone-200 mb-3 uppercase tracking-widest">{edu.startDate} – {edu.endDate}</p>
                                        <h4 className="text-lg font-light text-stone-800 leading-tight mb-2 tracking-tight group-hover:text-stone-400 transition-colors uppercase">{edu.school}</h4>
                                        <p className="text-xs text-stone-400 font-light italic px-4 border-l border-stone-100">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-auto py-20 flex flex-col items-start gap-8 border-t border-stone-50">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center cursor-pointer"
                            >
                                <ArrowRight className="w-4 h-4 text-stone-200" />
                            </motion.div>
                            <div>
                                <h5 className="text-[10px] font-black text-stone-800 uppercase tracking-[0.5em] mb-2">Available</h5>
                                <p className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em] leading-relaxed italic">
                                    Nordic Crafted / Global Ready <br /> Document Ref: SC-2025
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Scandi Minimalist Edge Accents */}
                <div className="absolute top-12 left-12 w-4 h-4 border-t border-l border-stone-100" />
                <div className="absolute bottom-12 right-12 w-4 h-4 border-b border-r border-stone-100" />
            </div>
        </div>
    );
}
