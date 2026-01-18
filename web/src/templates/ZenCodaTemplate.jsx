import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Flower2, Cloud, Trees, Wind, Sun, Coffee } from 'lucide-react';

export default function ZenCodaTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#f4f7f4] p-0 sm:p-12 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ZEN CODA BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#f0f4f0]" />

                {/* Zen Garden Rake Lines - Subtle Concentric Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] opacity-[0.05]"
                    style={{
                        backgroundImage: 'repeating-radial-gradient(circle at center, #2c3e2d 0, #2c3e2d 1px, transparent 1px, transparent 15px)',
                    }}
                />

                {/* Wavy lines for "sand" feel */}
                <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #2c3e2d 0, #2c3e2d 1px, transparent 1px, transparent 20px)',
                    }}
                />

                {/* Animated soft clouds/blobs */}
                <motion.div
                    animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[10%] w-64 h-64 bg-white/40 rounded-full blur-[80px]"
                />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white/90 backdrop-blur-md shadow-[0_20px_100px_rgba(46,62,45,0.05)] flex flex-col relative z-10 overflow-hidden p-20 text-[#2c3e2d] border border-white">

                <header className="relative z-10 flex flex-col items-center text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                        className="w-20 h-20 bg-[#e9f0e8] rounded-full flex items-center justify-center mb-12 text-[#5d7a5e] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                        <Flower2 className="w-10 h-10 opacity-40" />
                    </motion.div>

                    <h1 className="text-6xl font-extralight uppercase tracking-[0.6em] leading-none mb-8 text-[#1a2e1b] -mr-[0.6em]">
                        {personal.fullName}
                    </h1>

                    <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-[0.8em] text-[#8ba68c] mb-12 -mr-[0.8em]">
                        <div className="w-16 h-px bg-[#8ba68c] opacity-20" />
                        {personal.title}
                        <div className="w-16 h-px bg-[#8ba68c] opacity-20" />
                    </div>

                    <div className="flex justify-center gap-12 text-[11px] font-medium uppercase tracking-widest text-stone-400">
                        {[
                            { icon: Mail, value: personal.email },
                            { icon: Phone, value: personal.phone },
                            { icon: MapPin, value: personal.location }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 hover:text-[#5d7a5e] transition-colors group cursor-default">
                                <item.icon className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <main className="relative z-10 grid grid-cols-12 gap-24 flex-1">
                    <div className="col-span-12 mb-20">
                        <section className="max-w-4xl mx-auto text-center border-y border-stone-50 py-16 px-10 relative">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.1 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                                <Cloud className="w-64 h-64 text-[#8ba68c]" />
                            </motion.div>
                            <p className="text-3xl font-light leading-relaxed italic text-[#5d7a5e] relative z-10 balance-text">
                                "{personal.summary}"
                            </p>
                            <Wind className="w-6 h-6 mx-auto mt-8 text-[#8ba68c] opacity-20 animate-pulse" />
                        </section>
                    </div>

                    <div className="col-span-8 flex flex-col gap-24">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[1em] text-stone-300 mb-16 flex items-center gap-6">
                                <Trees className="w-5 h-5 opacity-40" /> Path_Sequential
                            </h2>
                            <div className="space-y-24">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        className="group relative pl-16 border-l border-stone-100"
                                    >
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border border-stone-200 group-hover:bg-[#8ba68c] group-hover:border-[#8ba68c] transition-all" />

                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-3xl font-light text-[#1a2e1b] tracking-[-0.01em] group-hover:translate-x-3 transition-transform duration-700">{exp.position}</h3>
                                                <p className="text-[#8ba68c] font-bold text-[10px] uppercase mt-3 tracking-[0.4em] flex items-center gap-3">
                                                    <Sun className="w-3 h-3 opacity-30" /> {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest italic pt-2">{exp.startDate} – {exp.endDate}</span>
                                        </div>
                                        <p className="text-[#647a65] text-base leading-relaxed font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
                                            {exp.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 flex flex-col gap-20">
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[1em] text-stone-300 mb-12">The_Essence</h2>
                            <div className="flex flex-col gap-6">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <span className="text-xs font-medium text-[#5d7a5e] group-hover:text-stone-900 group-hover:font-semibold transition-all uppercase tracking-widest">{skill}</span>
                                        <div className="h-px bg-stone-50 flex-1 mx-4 group-hover:bg-[#8ba68c]/20 transition-all" />
                                        <div className="w-1 h-1 rounded-full bg-stone-100 group-hover:bg-[#8ba68c] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[1em] text-stone-300 mb-12">Academic_Base</h2>
                            <div className="space-y-12">
                                {education.map((edu, i) => (
                                    <div key={i} className="p-8 bg-[#fbfcfb] rounded-2xl border border-stone-50 hover:border-[#8ba68c]/20 transition-all group overflow-hidden relative">
                                        <motion.div initial={{ x: -10 }} whileHover={{ x: 5 }} className="relative z-10">
                                            <p className="text-[8px] font-bold text-stone-300 mb-3 uppercase tracking-widest">{edu.startDate} – {edu.endDate}</p>
                                            <h4 className="text-[#1a2e1b] font-medium text-lg leading-tight mb-2 tracking-tight italic group-hover:text-[#5d7a5e] transition-colors">{edu.school}</h4>
                                            <p className="text-[#8ba68c] text-[10px] font-bold italic uppercase tracking-tighter opacity-60">{edu.degree}</p>
                                        </motion.div>
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-stone-50/50 rotate-45 translate-x-6 -translate-y-6" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-auto py-16 flex flex-col items-center gap-6 border-t border-stone-50">
                            <Coffee className="w-8 h-8 text-[#8ba68c] opacity-20" />
                            <div className="text-center">
                                <p className="text-[8px] font-black text-stone-300 uppercase tracking-[1em] mb-2 leading-none">End_of_Transmission</p>
                                <p className="text-[7px] font-bold text-[#8ba68c]/60 uppercase tracking-[0.4em] italic leading-none">Balanced_Existence // Zen_Code_2025</p>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-stone-100" />)}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Vertical Zen Lines Decoration */}
                <div className="absolute top-0 bottom-0 left-6 w-px bg-stone-50" />
                <div className="absolute top-0 bottom-0 right-6 w-px bg-stone-50" />
            </div>
        </div>
    );
}
