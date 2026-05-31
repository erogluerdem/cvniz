import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Zap, Heart, Star, Smile, MessageSquare, Rocket } from 'lucide-react';

export default function PopArtPulseTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div className="min-h-full bg-[#fdeb30] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden" style={{ fontFamily: "'Bungee', cursive" }}>

            {/* POP ART BACKGROUND FON */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Halftone Dot Overlay */}
                <div className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                        backgroundSize: '15px 15px'
                    }}
                />

                {/* Vibrant Circles */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#00aeef]/40 border-[10px] border-black rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#ec008c]/30 border-[10px] border-black rounded-full shadow-[20px_20px_0px_#000]"
                />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-[15px_15px_0px_rgba(0,0,0,1)] flex flex-col relative z-10 overflow-hidden border-[8px] border-black text-black">

                {/* Comic Masthead */}
                <header className="border-b-[8px] border-black grid grid-cols-12 relative overflow-hidden bg-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ec008c] border-b-[8px] border-l-[8px] border-black rotate-45 translate-x-12 -translate-y-12" />

                    <div className="col-span-8 p-12 relative z-10">
                        <motion.div
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            className="bg-black text-[#fdeb30] inline-block px-6 py-2 mb-6 -rotate-1 shadow-[8px_8px_0px_#00aeef]"
                        >
                            <span className="text-sm uppercase tracking-[0.3em] font-black italic">Premium Portfolio Edition // No. 001</span>
                        </motion.div>
                        <h1 className="text-8xl font-black uppercase leading-[0.85] tracking-tighter drop-shadow-[6px_6px_0px_#ec008c] mb-6">
                            {personal.fullName}
                        </h1>
                        <div className="inline-block bg-[#fdeb30] border-[5px] border-black px-6 py-2 shadow-[10px_10px_0px_black] rotate-2">
                            <p className="text-3xl font-black uppercase flex items-center gap-4">
                                <Zap className="w-8 h-8 fill-black" /> {personal.title}
                            </p>
                        </div>
                    </div>

                    <div className="col-span-4 bg-[#00aeef] p-10 border-l-[8px] border-black relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 2.5px, transparent 2.5px)', backgroundSize: '10px 10px' }} />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                className="w-24 h-24 bg-white border-[6px] border-black rounded-full flex items-center justify-center mb-8 shadow-[6px_6px_0px_black]"
                            >
                                {personal.photo ? (
                                    <img src={personal.photo} alt="" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <Smile className="w-12 h-12 text-black" />
                                )}
                            </motion.div>
                            <div className="space-y-3 w-full">
                                {[
                                    { icon: Mail, value: personal.email, bg: 'bg-black' },
                                    { icon: Phone, value: personal.phone, bg: 'bg-[#ec008c]' },
                                    { icon: MapPin, value: personal.location, bg: 'bg-white text-black' }
                                ].map((item, i) => (
                                    <div key={i} className={`${item.bg} border-[3px] border-black p-2 flex items-center gap-3 shadow-[4px_4px_0px_black] text-[10px] font-black truncate`}>
                                        <item.icon className="w-3 h-3 shrink-0" />
                                        <span>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 grid grid-cols-12 relative z-10 bg-white">
                    {/* Sidebar */}
                    <aside className="col-span-4 border-r-[8px] border-black bg-white flex flex-col">
                        <section className="p-10 border-b-[8px] border-black bg-[#fdeb30] relative overflow-hidden">
                            <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-white border-[5px] border-black rounded-full opacity-20" />
                            <h2 className="text-3xl font-black uppercase mb-6 drop-shadow-[3px_3px_0px_white] flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 fill-black" /> PROFILE!
                            </h2>
                            <p className="text-sm font-black leading-[1.4] italic">
                                "{personal.summary}"
                            </p>
                        </section>

                        <section className="p-10 flex-1 relative bg-white">
                            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(black 3px, transparent 3px)', backgroundSize: '15px 15px' }} />
                            <h2 className="text-3xl font-black uppercase mb-8 border-b-[6px] border-black pb-2 bg-[#ec008c] text-white px-4 shadow-[6px_6px_0px_#00aeef] inline-block -rotate-2">
                                Skills!
                            </h2>
                            <div className="flex flex-wrap gap-4 mt-4 relative z-10">
                                {skills.map((skill, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 5 : -5 }}
                                        className={`px-5 py-2.5 border-[4px] border-black font-black uppercase text-xs shadow-[5px_5px_0px_black] ${i % 3 === 0 ? 'bg-[#00aeef] text-white' : i % 3 === 1 ? 'bg-[#fdeb30]' : 'bg-white'}`}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>

                            <h2 className="text-3xl font-black uppercase mt-16 mb-8 border-b-[6px] border-black pb-2 bg-[#00aeef] text-white px-4 shadow-[6px_6px_0px_#ec008c] inline-block rotate-1">
                                Lingo!
                            </h2>
                            <div className="space-y-4 relative z-10">
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between items-center bg-black text-white p-3 border-r-[10px] border-[#ec008c] shadow-[4px_4px_0px_#00aeef]">
                                        <span className="text-xs font-black uppercase">{lang.name}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(dot => (
                                                <div key={dot} className={`w-2 h-2 border border-white ${dot <= 4 ? 'bg-[#fdeb30]' : 'bg-transparent'}`} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-10 bg-black text-[#fdeb30] border-t-[8px] border-black overflow-hidden relative group">
                            <motion.div animate={{ x: [-100, 100] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                            <p className="text-xl font-black uppercase tracking-[0.2em] relative z-10 flex items-center justify-center gap-4">
                                <Star className="w-6 h-6 fill-[#fdeb30]" /> BOOM! <Star className="w-6 h-6 fill-[#fdeb30]" />
                            </p>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="col-span-8 bg-white p-12 relative overflow-hidden">
                        <div className="absolute top-10 right-10 opacity-5 rotate-12">
                            <Rocket className="w-64 h-64 text-black" />
                        </div>

                        <section className="mb-20 relative z-10">
                            <h2 className="text-6xl font-black uppercase mb-16 flex items-center justify-between group">
                                <div className="flex items-center gap-8">
                                    <div className="bg-[#fdeb30] border-[6px] border-black p-4 shadow-[10px_10px_0px_black] -rotate-3 group-hover:rotate-0 transition-transform">
                                        <Briefcase className="w-12 h-12" />
                                    </div>
                                    <span className="drop-shadow-[5px_5px_0px_#00aeef]">EXPERIENCE!</span>
                                </div>
                                <div className="flex-1 h-[6px] bg-black ml-10 shadow-[4px_4px_0px_#ec008c]" />
                            </h2>

                            <div className="space-y-20">
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: -8, y: -8 }}
                                        className="relative border-[6px] border-black p-10 bg-white shadow-[12px_12px_0px_black] hover:shadow-[20px_20px_0px_#ec008c] transition-all cursor-default group"
                                    >
                                        <div className="absolute top-[-30px] left-[-6px] bg-black text-white px-8 py-2 text-xs font-black uppercase tracking-widest rotate-[-1deg]">
                                            {exp.startDate} <span className="text-[#00aeef]">::</span> {exp.endDate}
                                        </div>
                                        <div className="absolute top-10 right-10 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#ec008c] border-[4px] border-black rounded-full flex items-center justify-center text-white font-black group-hover:scale-150 transition-transform">
                                            {i + 1}
                                        </div>
                                        <h3 className="text-4xl font-black uppercase leading-none mb-4 group-hover:text-[#ec008c] transition-colors">{exp.position}</h3>
                                        <p className="text-xl font-black text-[#00aeef] uppercase mb-6 tracking-tight flex items-center gap-3">
                                            <div className="w-4 h-4 bg-[#fdeb30] border-2 border-black" /> {exp.company}
                                        </p>
                                        <p className="text-base font-black leading-relaxed text-black/80">
                                            {exp.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="relative z-10">
                            <h2 className="text-5xl font-black uppercase mb-12 flex items-center gap-8 group">
                                <span className="drop-shadow-[4px_4px_0px_#ec008c]">EDUCATION!</span>
                                <div className="bg-[#ec008c] border-[6px] border-black p-4 shadow-[10px_10px_0px_black] rotate-3 group-hover:rotate-0 transition-transform">
                                    <GraduationCap className="w-10 h-10 text-white" />
                                </div>
                            </h2>
                            <div className="grid grid-cols-2 gap-10">
                                {education.map((edu, i) => (
                                    <div key={i} className="border-[6px] border-black bg-[#e2f5fc] p-8 shadow-[10px_10px_0px_#ec008c] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#fdeb30] border-b-[6px] border-l-[6px] border-black -translate-y-8 translate-x-8 rotate-45" />
                                        <h4 className="font-black text-2xl uppercase leading-tight mb-4 ">{edu.school}</h4>
                                        <div className="bg-white border-[3px] border-black px-4 py-1 inline-block mb-4 shadow-[4px_4px_0px_black]">
                                            <p className="text-xs font-black italic">{edu.degree}</p>
                                        </div>
                                        <div className="mt-4 text-[11px] font-black bg-black text-white px-4 py-2 uppercase tracking-widest">
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>

                {/* Footer Bar */}
                <footer className="h-16 border-t-[8px] border-black bg-[#ec008c] flex justify-between items-center px-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)' }} />
                    <div className="relative z-10 text-white text-xs font-black uppercase tracking-[0.5em] italic">
                        Certified // High_Impact_System // Pop_Art_Engine
                    </div>
                    <div className="relative z-10 flex gap-6 text-white">
                        {[Globe, Heart, Star].map((Icon, i) => <Icon key={i} className="w-6 h-6 fill-current" />)}
                    </div>
                </footer>
            </div>
        </div>
    );
}
