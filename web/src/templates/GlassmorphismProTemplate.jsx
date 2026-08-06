import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, MessageCircle, Twitter, Linkedin, Github, Sparkles } from 'lucide-react';

export default function GlassmorphismProTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-950 p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* VIBRANT BACKGROUND BLOBS */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/40 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] bg-rose-600/30 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-amber-500/20 blur-[100px] rounded-full"
                />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white/5 backdrop-blur-[40px] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col relative z-10 overflow-hidden border border-white/20">

                {/* Specular Highlights */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                <div className="relative z-10 flex flex-col h-full p-12 gap-10">
                    {/* Glass Header */}
                    <header className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group mb-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-rose-500 to-amber-500 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-50" />
                            <div className="w-36 h-36 relative bg-slate-900 rounded-full border-2 border-white/30 p-1 overflow-hidden">
                                {personal.photo ? (
                                    <img src={personal.photo} alt="" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white bg-gradient-to-tr from-slate-800 to-slate-900">
                                        {personal.fullName?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                            {personal.fullName}
                        </h1>
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-black text-white uppercase tracking-[0.4em]">{personal.title}</span>
                        </div>

                        <div className="grid grid-cols-3 w-full gap-4 mt-10">
                            {[
                                { icon: Mail, value: personal.email, label: 'Email' },
                                { icon: Phone, value: personal.phone, label: 'Phone' },
                                { icon: MapPin, value: personal.location, label: 'Location' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl break-inside-avoid page-break-inside-avoid">
                                    <item.icon className="w-5 h-5 text-indigo-300 mx-auto mb-2" />
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-xs text-white font-medium truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </header>

                    <main className="grid grid-cols-12 gap-10 flex-1">
                        {/* Summary & Experience */}
                        <div className="col-span-12 flex flex-col gap-10">
                            <section className="relative break-inside-avoid page-break-inside-avoid">
                                <div className="absolute -left-12 -top-4 text-9xl font-black text-white/5 pointer-events-none uppercase select-none">About</div>
                                <div className="relative z-10 bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl" />
                                    <p className="text-xl text-indigo-50 leading-relaxed font-light italic">
                                        "{personal.summary}"
                                    </p>
                                </div>
                            </section>

                            <div className="grid grid-cols-12 gap-10">
                                <section className="col-span-8 space-y-8 break-inside-avoid page-break-inside-avoid">
                                    <h2 className="text-white font-black text-2xl uppercase tracking-widest flex items-center gap-4">
                                        Experience <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                                    </h2>
                                    <div className="space-y-12">
                                        {experience.map((exp, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ x: 10 }}
                                                className="relative pl-10 border-l border-white/10 group"
                                            >
                                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] group-hover:scale-150 transition-transform" />
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-white font-bold text-2xl">{exp.position}</h3>
                                                    <span className="text-[10px] font-black text-rose-300 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">{exp.startDate} - {exp.endDate}</span>
                                                </div>
                                                <p className="text-indigo-300 font-bold mb-4 tracking-wide">{exp.company}</p>
                                                <p className="text-white/60 text-sm leading-relaxed font-light">
                                                    {exp.description}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>

                                <aside className="col-span-4 space-y-10">
                                    <section>
                                        <h2 className="text-white font-black text-lg uppercase tracking-widest mb-6">Expertise</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, i) => (
                                                <motion.span
                                                    key={i}
                                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white uppercase tracking-wider"
                                                >
                                                    {skill}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-white font-black text-lg uppercase tracking-widest mb-6">Education</h2>
                                        <div className="space-y-6">
                                            {education.map((edu, i) => (
                                                <div key={i} className="bg-white/5 p-6 rounded-[32px] border border-white/10 group hover:bg-white/10 transition-colors break-inside-avoid page-break-inside-avoid">
                                                    <p className="text-[10px] font-black text-amber-300 mb-2 uppercase tracking-tighter">{edu.startDate} - {edu.endDate}</p>
                                                    <h4 className="text-white font-bold text-base leading-tight">{edu.school}</h4>
                                                    <p className="text-white/40 text-[10px] italic mt-2 uppercase">{edu.degree}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </aside>
                            </div>
                        </div>
                    </main>

                    {/* Footer Status */}
                    <footer className="mt-auto flex justify-between items-center border-t border-white/10 pt-8">
                        <div className="flex gap-4">
                            {[Linkedin, Github, Twitter].map((Icon, i) => (
                                <motion.div key={i} whileHover={{ y: -5 }} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 border border-white/10 hover:text-white transition-colors cursor-pointer">
                                    <Icon className="w-5 h-5" />
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-2xl">
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Active Status</span>
                        </div>
                    </footer>
                </div>

                {/* Glass Inner Shine Overlay */}
                <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
