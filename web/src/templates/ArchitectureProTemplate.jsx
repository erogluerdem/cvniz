import { Mail, Phone, MapPin, Layout, Box, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function ArchitectureProTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-50 p-16 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-5xl mx-auto bg-white shadow-[0_45px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200">
                <div className="grid grid-cols-12 min-h-[800px]">
                    <aside className="col-span-3 bg-slate-950 p-12 text-white flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 border-2 border-white mb-12 flex items-center justify-center text-2xl font-black">
                                {personal.fullName?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="space-y-16">
                                <section>
                                    <h2 className="text-[10px] font-black uppercase text-slate-600 mb-8 tracking-[0.3em]">Coordinates</h2>
                                    <div className="space-y-6 text-[10px] font-medium tracking-wide leading-relaxed opacity-70">
                                        <div className="flex flex-col gap-1"><span>EMAIL</span> <span>{personal.email}</span></div>
                                        <div className="flex flex-col gap-1"><span>PHONE</span> <span>{personal.phone}</span></div>
                                        <div className="flex flex-col gap-1"><span>STUDIO</span> <span>{personal.location}</span></div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-[10px] font-black uppercase text-slate-600 mb-8 tracking-[0.3em]">Toolbox</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(s => <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] uppercase font-bold text-slate-500">{s}</span>)}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </aside>

                    <main className="col-span-9 p-20">
                        <header className="mb-24 flex justify-between items-start">
                            <div>
                                <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none uppercase">{personal.fullName}</h1>
                                <p className="text-slate-500 text-lg font-medium tracking-widest flex items-center gap-4">
                                    <div className="w-12 h-px bg-slate-200" /> {personal.title}
                                </p>
                            </div>
                            <Layout className="w-12 h-12 text-slate-100" />
                        </header>

                        <div className="space-y-24">
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12 flex items-center gap-6">
                                    Summary <div className="flex-1 h-px bg-slate-50" />
                                </h3>
                                <p className="text-xl text-slate-600 leading-relaxed font-light pl-12 border-l-2 border-slate-900">
                                    {personal.summary}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12 flex items-center gap-6">
                                    Experience <div className="flex-1 h-px bg-slate-50" />
                                </h3>
                                <div className="space-y-16">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="grid grid-cols-4 gap-8 break-inside-avoid page-break-inside-avoid">
                                            <div className="text-[10px] font-black text-slate-500 pt-1 tracking-widest">{exp.startDate?.toUpperCase()} / {exp.endDate?.toUpperCase()}</div>
                                            <div className="col-span-3">
                                                <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{exp.position}</h4>
                                                <p className="text-slate-500 text-xs font-bold mb-6 italic">{exp.company}</p>
                                                <p className="text-slate-500 text-sm leading-[1.8] font-light">{exp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12 flex items-center gap-6">
                                    Formation <div className="flex-1 h-px bg-slate-50" />
                                </h3>
                                <div className="grid grid-cols-2 gap-12">
                                    {education.map(edu => (
                                        <div key={edu.id} className="p-10 bg-slate-50 border border-slate-100 italic break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
                                            <h4 className="font-black text-slate-900 text-sm mb-1 uppercase leading-tight">{edu.school}</h4>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
