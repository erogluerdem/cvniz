import { Mail, Phone, MapPin, Database, BarChart, Award, Briefcase, GraduationCap, Terminal } from 'lucide-react'

export default function DataAnalystTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-950 p-12 text-slate-300 print-exact mx-auto print:mx-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <div className="max-w-4xl mx-auto border-2 border-slate-800 rounded-3xl overflow-hidden bg-[#0A0C10] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                <header className="p-16 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md mb-6">
                            <Terminal className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Data Scientist Node</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase">{personal.fullName}</h1>
                        <p className="text-blue-500 font-bold uppercase tracking-[0.4em] text-xs">{personal.title}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-2"><Mail className="w-4 h-4 text-blue-400" /> {personal.email}</div>
                        <div className="flex items-center gap-4 border-b border-white/5 pb-2"><Phone className="w-4 h-4 text-blue-400" /> {personal.phone}</div>
                        <div className="flex items-center gap-4"><MapPin className="w-4 h-4 text-blue-400" /> {personal.location}</div>
                    </div>
                </header>

                <div className="p-16 grid grid-cols-12 gap-16">
                    <aside className="col-span-4 space-y-20">
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-600 mb-8 tracking-[0.3em]">Skillset Matrix</h2>
                            <div className="space-y-4">
                                {skills.map(s => (
                                    <div key={s} className="space-y-2 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            <span>{s}</span>
                                            <span className="text-blue-500">OPTIMIZED</span>
                                        </div>
                                        <div className="h-0.5 bg-slate-800 w-full">
                                            <div className="h-full bg-blue-500 w-[95%] shadow-[0_0_10px_#3b82f6]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-600 mb-8 tracking-[0.3em]">Training Log</h2>
                            <div className="space-y-12">
                                {education.map(edu => (
                                    <div key={edu.id} className="relative pl-6 border-l border-white/5 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[1px] top-0 w-px h-6 bg-blue-500" />
                                        <p className="text-[9px] font-black text-slate-600 mb-2 uppercase">{edu.startDate} - {edu.endDate}</p>
                                        <h4 className="text-xs font-black text-white uppercase leading-tight mb-1">{edu.school}</h4>
                                        <p className="text-blue-500 text-[10px] font-bold italic tracking-wide">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>

                    <main className="col-span-8 space-y-20">
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-600 mb-8 tracking-[0.3em] flex items-center gap-4">
                                <Database className="w-5 h-5 text-blue-500" /> Executive Description
                            </h2>
                            <p className="text-md text-slate-500 border-l-2 border-blue-500 pl-10 leading-[1.8] italic">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-600 mb-12 tracking-[0.3em] flex items-center gap-4">
                                <BarChart className="w-5 h-5 text-blue-500" /> Data Provenance
                            </h2>
                            <div className="space-y-20">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative group break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-6">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{exp.position}</h3>
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{exp.startDate} :: {exp.endDate}</span>
                                        </div>
                                        <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">{exp.company}</p>
                                        <p className="text-slate-500 text-sm leading-[1.8] font-medium opacity-80 border-b border-white/5 pb-8 group-last:border-none">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>

            </div>
        </div>
    )
}
