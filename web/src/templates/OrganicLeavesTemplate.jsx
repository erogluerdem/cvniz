import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Leaf, Heart, Sprout, Wind, Sunrise } from 'lucide-react';

export default function OrganicLeavesTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#f1f5f1] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>

            {/* ORGANIC BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#e2ece2] rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#f8f3e8] rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />

                {/* Animated Leaves */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i }}
                        className="absolute text-[#4a7c59]"
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${15 + (i % 3) * 20}%`,
                        }}
                    >
                        <Leaf className="w-32 h-32 fill-current opacity-10" />
                    </motion.div>
                ))}
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white/95 backdrop-blur-sm shadow-[0_20px_80px_rgba(74,124,89,0.15)] flex flex-col relative z-10 overflow-hidden rounded-[48px] p-12 text-[#2d3a3a] border border-white">

                {/* Top Leaf Accent */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
                    <div className="w-12 h-px bg-[#4a7c59]" />
                    <Leaf className="w-4 h-4 text-[#4a7c59]" />
                    <div className="w-12 h-px bg-[#4a7c59]" />
                </div>

                <header className="relative z-10 flex flex-col items-center text-center pt-8 mb-20">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative mb-8"
                    >
                        <div className="absolute inset-0 bg-[#e8f3ee] rounded-full blur-2xl opacity-60 animate-pulse" />
                        <div className="w-40 h-40 relative bg-white rounded-[40px] border-4 border-[#e8f3ee] p-1 flex items-center justify-center overflow-hidden rotate-3 shadow-xl">
                            {personal.photo ? (
                                <img src={personal.photo} alt="" className="w-full h-full object-cover rounded-[32px]" />
                            ) : (
                                <div className="text-5xl font-black text-[#4a7c59]">
                                    {personal.fullName?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <h1 className="text-6xl font-black text-[#1b2b2b] tracking-tighter leading-none mb-4">
                        {personal.fullName}
                    </h1>
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#f1f5f1] border border-[#e8f3ee] rounded-full">
                        <Sprout className="w-4 h-4 text-[#4a7c59]" />
                        <span className="text-sm font-bold text-[#4a7c59] uppercase tracking-[0.2em]">{personal.title}</span>
                    </div>

                    <div className="grid grid-cols-3 w-full gap-8 mt-12 px-10">
                        {[
                            { icon: Mail, value: personal.email, label: 'Email' },
                            { icon: Phone, value: personal.phone, label: 'Phone' },
                            { icon: MapPin, value: personal.location, label: 'Location' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#f1f5f1] mb-2">
                                    <item.icon className="w-4 h-4 text-[#4a7c59]" />
                                </div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.label}</p>
                                <p className="text-xs font-semibold text-stone-600 max-w-[120px] truncate">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </header>

                <main className="relative z-10 grid grid-cols-12 gap-16 flex-1 px-8">
                    <div className="col-span-12">
                        <section className="p-10 bg-[#fbfcfb] rounded-[40px] border border-[#f1f5f1] relative shadow-inner">
                            <h2 className="text-[#4a7c59] font-black uppercase text-[10px] tracking-[0.4em] mb-6 flex items-center gap-3">
                                <Sunrise className="w-4 h-4" /> The Narrative
                            </h2>
                            <p className="text-2xl font-light text-[#2d3a3a] leading-relaxed italic pr-12 text-center balance-text">
                                "{personal.summary}"
                            </p>
                        </section>
                    </div>

                    <div className="col-span-7 space-y-16">
                        <section>
                            <h2 className="text-[#4a7c59] font-black uppercase text-[10px] tracking-[0.4em] mb-12 flex items-center gap-4">
                                Career Evolution <div className="h-px flex-1 bg-stone-100" />
                            </h2>
                            <div className="space-y-12">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="group relative pl-10"
                                    >
                                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-white border-2 border-[#e8f3ee] rounded-full group-hover:border-[#4a7c59] transition-colors" />
                                        <div className="flex justify-between items-baseline mb-3">
                                            <h3 className="text-2xl font-bold text-[#1b2b2b] tracking-tight leading-none group-hover:text-[#4a7c59] transition-colors">{exp.position}</h3>
                                            <span className="text-[10px] font-bold text-stone-400 border border-stone-100 px-3 py-1 rounded-full uppercase italic">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-[#4a7c59] font-black text-[10px] uppercase mb-4 tracking-widest flex items-center gap-2">
                                            <Wind className="w-3 h-3" /> {exp.company}
                                        </p>
                                        <p className="text-[#5a6a6a] text-base leading-[1.6] font-light">
                                            {exp.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-5 flex flex-col gap-16">
                        <section>
                            <h2 className="text-[#4a7c59] font-black uppercase text-[10px] tracking-[0.4em] mb-10 flex items-center gap-4">
                                Skill Garden <div className="h-px flex-1 bg-stone-100" />
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ scale: 1.05, backgroundColor: '#4a7c59', color: '#fff' }}
                                        className="px-5 py-2 bg-[#f8f9f5] border border-[#e8f3ee] rounded-2xl text-xs font-bold text-[#4a7c59] shadow-sm transition-all cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[#4a7c59] font-black uppercase text-[10px] tracking-[0.4em] mb-10 flex items-center gap-4">
                                Formation <div className="h-px flex-1 bg-stone-100" />
                            </h2>
                            <div className="space-y-8">
                                {education.map((edu, i) => (
                                    <div key={i} className="p-8 bg-[#fbfcfb] border border-[#f1f5f1] rounded-[32px] group">
                                        <p className="text-[10px] font-bold text-stone-300 mb-2 uppercase tracking-widest">{edu.startDate} – {edu.endDate}</p>
                                        <h4 className="text-[#1b2b2b] font-bold text-lg leading-tight mb-2 tracking-tight group-hover:text-[#4a7c59] transition-colors">{edu.school}</h4>
                                        <p className="text-[#4a7c59] text-xs font-medium italic border-t border-stone-50 pt-2">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-auto p-10 bg-[#e8f3ee] rounded-[48px] text-center relative overflow-hidden group">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-10 -right-10 opacity-10"
                            >
                                <Leaf className="w-32 h-32 text-[#4a7c59]" />
                            </motion.div>
                            <div className="relative z-10">
                                <Heart className="w-8 h-8 text-[#4a7c59] mx-auto mb-4 fill-current opacity-40" />
                                <h4 className="font-black text-xs uppercase tracking-[0.4em] text-[#4a7c59] mb-2">Consciously Crafted</h4>
                                <p className="text-[10px] font-medium text-[#4a7c59]/60 leading-relaxed italic uppercase tracking-widest">Growth. Balance. Impact.</p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="mt-20 pt-10 border-t border-stone-100 flex justify-between items-center px-8 pb-4">
                    <div className="text-stone-300 text-[9px] font-black uppercase tracking-[0.5em]">
                        OrganicLeaves_v4_EcoSystem
                    </div>
                    <div className="flex gap-4">
                        {[Linkedin, Github, Twitter].map((Icon, i) => (
                            <Icon key={i} className="w-4 h-4 text-stone-200 hover:text-[#4a7c59] transition-colors cursor-pointer" />
                        ))}
                    </div>
                </footer>
            </div>
        </div>
    );
}
