import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Camera, Scissors, Sparkles, Quote, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function VogueEliteTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#f9f7f2] p-0 sm:p-12 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Playfair Display', serif" }}>

            {/* VOGUE ELITE BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#f4f1ea]" />
                {/* Subtle vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.05)]" />

                {/* Large Background Initial */}
                <div className="absolute top-[10%] left-[-5%] text-[40rem] font-black text-black/[0.02] select-none leading-none tracking-tighter uppercase">
                    {personal.fullName?.charAt(0)}
                </div>
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] flex flex-col relative z-10 overflow-hidden text-[#1a1a1a]">

                <header className="p-24 text-center relative border-b border-stone-100 bg-white">
                    <div className="absolute top-12 left-12 text-[9px] font-black uppercase tracking-[1.5em] text-stone-300 rotate-90 origin-left select-none">Collection: 2025_Series</div>
                    <div className="absolute top-12 right-12 text-[9px] font-black uppercase tracking-[1.5em] text-stone-300 -rotate-90 origin-right select-none">Issue. No 04</div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="relative z-10"
                    >
                        <h1 className="text-9xl font-black uppercase tracking-[-0.05em] leading-[0.8] mb-8 text-stone-900">
                            {personal.fullName}
                        </h1>
                        <div className="flex items-center justify-center gap-10">
                            <div className="h-px w-20 bg-stone-200" />
                            <p className="text-2xl font-light tracking-[0.5em] uppercase text-stone-400 italic">
                                {personal.title}
                            </p>
                            <div className="h-px w-20 bg-stone-200" />
                        </div>
                    </motion.div>

                    <div className="mt-20 grid grid-cols-3 w-full border-t border-stone-100 pt-16">
                        {[
                            { icon: Mail, value: personal.email, label: 'Correspondence' },
                            { icon: Phone, value: personal.phone, label: 'Direct_Access' },
                            { icon: MapPin, value: personal.location, label: 'Base_Coordinates' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                                <div className="p-3 border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-300 group-hover:text-stone-900 transition-colors mt-2">{item.label}</span>
                                <span className="text-[10px] font-bold text-stone-500">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <main className="flex-1">
                    <section className="p-24 bg-[#fbfbfb] border-b border-stone-100 relative overflow-hidden group">
                        <Quote className="absolute -top-10 -right-10 w-48 h-48 text-stone-100 opacity-50 transition-transform duration-1000 group-hover:scale-110" />
                        <div className="max-w-5xl mx-auto relative z-10">
                            <h2 className="text-[9px] font-black uppercase tracking-[1em] text-stone-300 mb-12 flex items-center gap-6">
                                <div className="h-px w-10 bg-stone-200" /> The Profile_Narrative
                            </h2>
                            <p className="text-4xl font-light leading-[1.6] text-stone-700 italic pr-20 balance-text">
                                "{personal.summary}"
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-12 border-b border-stone-100">
                        <div className="col-span-8 p-24 border-r border-stone-100">
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[1em] text-stone-300 mb-20 flex items-center gap-6">
                                    <div className="h-px w-12 bg-stone-900" /> Career_Heritage
                                </h2>
                                <div className="space-y-32">
                                    {experience.map((exp, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="group relative"
                                        >
                                            <div className="absolute -left-24 top-0 text-7xl font-black text-stone-100 opacity-0 group-hover:opacity-100 transition-opacity select-none italic tracking-tighter">
                                                0{i + 1}
                                            </div>
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h3 className="text-5xl font-black uppercase tracking-[-0.03em] leading-none text-stone-800 group-hover:italic transition-all duration-500">{exp.position}</h3>
                                                    <p className="text-lg font-light text-stone-400 uppercase tracking-[0.3em] mt-6 flex items-center gap-4">
                                                        <Scissors className="w-4 h-4 text-stone-200" /> {exp.company}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black border border-stone-200 px-6 py-2 tracking-[0.4em] text-stone-300 group-hover:text-stone-900 group-hover:border-stone-900 transition-colors bg-white">
                                                    {exp.startDate} – {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-stone-600 text-lg leading-relaxed font-light max-w-2xl border-l-[3px] border-stone-100 pl-10 italic">
                                                {exp.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="col-span-4 flex flex-col items-center bg-[#fafafa]">
                            <section className="p-16 w-full border-b border-stone-100">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-stone-300 mb-12">The_Palette</h2>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center justify-between group cursor-default">
                                            <span className="text-sm font-light tracking-widest text-stone-600 group-hover:text-stone-900 transition-colors uppercase">{skill}</span>
                                            <motion.div
                                                whileHover={{ scale: 1.5, rotate: 45 }}
                                                className="w-1.5 h-1.5 bg-stone-900 opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="p-16 w-full flex-1">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-stone-300 mb-12">Foundations</h2>
                                <div className="space-y-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group">
                                            <p className="text-[8px] font-black text-stone-200 uppercase tracking-[0.4em] mb-3">{edu.startDate} – {edu.endDate}</p>
                                            <h4 className="text-xl font-black uppercase leading-[1.1] text-stone-800 mb-3 group-hover:italic transition-all">{edu.school}</h4>
                                            <div className="inline-block py-1 px-3 border-l-2 border-stone-200">
                                                <p className="text-xs text-stone-400 font-light italic">{edu.degree}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="p-16 w-full border-t border-stone-100 text-center">
                                <Sparkles className="w-8 h-8 text-stone-200 mx-auto mb-6" />
                                <h5 className="text-[9px] font-black uppercase tracking-[1em] text-stone-300">Certified Elite Grade</h5>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="h-20 flex justify-between items-center px-16 bg-stone-900 text-white relative overflow-hidden group">
                    <motion.div
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-white/5 skew-x-[-45deg] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative z-10 text-[8px] font-black uppercase tracking-[1.5em] opacity-40">
                        © MMXXV THE_VOGUE_ELITE_PORTFOLIO
                    </div>
                    <div className="relative z-10 flex gap-10 opacity-40">
                        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                            <Icon key={i} className="w-4 h-4 hover:text-stone-400 cursor-pointer transition-colors" />
                        ))}
                    </div>
                </footer>
            </div>
        </div>
    );
}
