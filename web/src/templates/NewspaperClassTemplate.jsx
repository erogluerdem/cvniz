import React from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Quote, Search, TrendingUp, Menu, Coffee } from 'lucide-react';

export default function NewspaperClassTemplate({ data }) {
    const personal = data?.personal || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || [];

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#d7d2cb] p-0 sm:p-8 flex justify-center py-10 relative overflow-hidden print-exact mx-auto print:mx-0" style={{ fontFamily: "'Playfair Display', serif" }}>

            {/* AGED PAPER TEXTURE FON */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#f4f1ea] opacity-90" />
                <div className="absolute inset-0 opacity-[0.4]" style={{
                    backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px), radial-gradient(#000 0.5px, #f4f1ea 0.5px)',
                    backgroundSize: '4px 4px',
                    backgroundPosition: '0 0, 2px 2px'
                }} />
                {/* Coffee Stains / Ink Blobs */}
                <div className="absolute top-[10%] right-[5%] w-48 h-48 bg-[#8b5a2b]/10 blur-3xl rounded-full" />
                <div className="absolute bottom-[20%] left-[-5%] w-64 h-64 bg-[#3d2b1f]/5 blur-2xl rounded-full rotate-45" />
                <div className="absolute top-[60%] right-[15%] w-24 h-24 bg-[#000]/5 blur-xl rounded-full" />
            </div>

            <div className="w-[210mm] min-h-[297mm] mx-auto bg-[#fffdfa] shadow-[0_0_60px_rgba(0,0,0,0.2)] flex flex-col p-12 border-[6px] border-double border-[#1a1a1a] relative z-10 overflow-hidden text-[#1a1a1a]">

                {/* Newspaper Masthead */}
                <header className="border-b-[4px] border-[#1a1a1a] pb-8 mb-10">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] mb-4 border-b border-[#1a1a1a] pb-2">
                        <span>LATEST EDITION // VOL. 2025</span>
                        <span className="italic">THE WORLD'S PREMIER TALENT SOURCE</span>
                        <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                    </div>

                    <div className="py-10 border-y-[2px] border-[#1a1a1a] text-center relative overflow-hidden">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#1a1a1a]" />
                        <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#1a1a1a]" />
                        <h1 className="text-8xl font-black uppercase tracking-[-0.05em] leading-[0.8] mb-0 inline-block px-10">
                            The Daily <span className="text-[#e63946]">Profile</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-10 font-bold italic border-b-2 border-black py-4 mt-6 text-sm">
                        <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 border border-black/10"><Mail className="w-4 h-4" /> {personal.email}</div>
                        <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 border border-black/10"><Phone className="w-4 h-4" /> {personal.phone}</div>
                        <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 border border-black/10"><MapPin className="w-4 h-4" /> {personal.location}</div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col gap-10">
                    {/* Hero Section - Breaking News Style */}
                    <section className="grid grid-cols-12 gap-10 pb-10 border-b-2 border-dashed border-[#ccc] break-inside-avoid page-break-inside-avoid">
                        <div className="col-span-12">
                            <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-center balance-text">
                                {personal.fullName}: Exceptional {personal.title} Redefines Industry Standards
                            </h2>
                        </div>
                        <div className="col-span-8 pr-10 border-r border-[#eee]">
                            <p className="text-xl leading-[1.6] first-letter:text-8xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-[0.7] first-letter:text-[#1a1a1a]">
                                {personal.summary}
                            </p>
                        </div>
                        <div className="col-span-4 flex flex-col gap-6">
                            <div className="bg-[#1a1a1a] text-white p-6 shadow-2xl relative">
                                <Quote className="w-12 h-12 absolute -top-4 -left-4 text-stone-500 fill-stone-500/20" />
                                <p className="text-lg leading-snug italic font-medium pt-2">
                                    "Innovation is not just a skill; it's the headline of my professional journey."
                                </p>
                            </div>
                            <div className="border-t-4 border-black pt-4">
                                <span className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#e63946]">Exclusive Interview</span>
                                <h3 className="text-xl font-black leading-tight tracking-tight">How {personal.fullName?.split(' ')[0]} Mastered the Art of Strategic Efficiency.</h3>
                            </div>
                        </div>
                    </section>

                    {/* Columns of Content */}
                    <div className="grid grid-cols-12 gap-10 flex-1">
                        {/* Experience Column */}
                        <div className="col-span-7 flex flex-col gap-10 border-r border-[#eee] pr-10">
                            <h3 className="text-2xl font-black uppercase border-b-2 border-black pb-2 flex justify-between items-center">
                                Career Ledger <Briefcase className="w-5 h-5" />
                            </h3>
                            <div className="space-y-12">
                                {experience.map((exp, i) => (
                                    <div key={i} className="group break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">{exp.startDate} // {exp.endDate}</p>
                                        <h4 className="text-2xl font-black leading-none mb-2 group-hover:underline cursor-pointer">{exp.position}</h4>
                                        <p className="text-sm font-black text-[#e63946] uppercase mb-4 tracking-tighter">{exp.company}</p>
                                        <p className="text-base leading-relaxed text-[#444] font-medium italic">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education & Skills Column */}
                        <div className="col-span-5 flex flex-col gap-10">
                            <section>
                                <h3 className="text-xl font-black uppercase border-y border-black py-2 mb-6 flex justify-between items-center bg-stone-50 px-2">
                                    Core Expertise <TrendingUp className="w-4 h-4" />
                                </h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-3 border-b border-stone-100 pb-1 break-inside-avoid page-break-inside-avoid">
                                            <div className="w-1.5 h-1.5 bg-black" />
                                            <span className="text-xs font-black uppercase tracking-tighter">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-black uppercase border-y border-black py-2 mb-6 flex justify-between items-center bg-stone-50 px-2">
                                    Academic Record <GraduationCap className="w-4 h-4" />
                                </h3>
                                <div className="space-y-8">
                                    {education.map((edu, i) => (
                                        <div key={i} className="border-l-2 border-black pl-4 break-inside-avoid page-break-inside-avoid">
                                            <h4 className="font-black text-base leading-tight mb-1">{edu.school}</h4>
                                            <p className="text-xs italic text-stone-600 mb-1">{edu.degree}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{edu.startDate} – {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="mt-auto pt-10">
                                <div className="p-6 border-[3px] border-black bg-white relative overflow-hidden group">
                                    <Coffee className="absolute bottom-[-10px] right-[-10px] w-20 h-20 text-stone-100 rotate-12 group-hover:text-amber-100 transition-colors" />
                                    <h4 className="text-[10px] font-black uppercase mb-3 tracking-widest border-b border-black pb-1">Editorial Note</h4>
                                    <p className="text-[11px] leading-relaxed italic font-bold text-stone-600 relative z-10">
                                        "Available for high-stakes projects and strategic leadership roles. Full reference dossier available upon request."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Newspaper Footer */}
                <footer className="mt-12 pt-6 border-t-[4px] border-[#1a1a1a] flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                    <div className="flex items-center gap-4">
                        <span>Registry #5175</span>
                        <div className="w-1 h-3 bg-red-600" />
                        <span>Verified Asset</span>
                    </div>
                    <span>© Portfolio Daily Press 2025</span>
                </footer>
            </div>
        </div>
    );
}
