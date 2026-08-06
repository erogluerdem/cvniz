import { Mail, Phone, MapPin, Building, Ruler, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function CivilEngineerTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-200 p-12 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border-t-[12px] border-orange-600 flex flex-col min-h-[1000px]">
                <header className="bg-slate-900 p-20 text-white flex justify-between items-center relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 -rotate-45 translate-x-32 -translate-y-32" />
                    <div className="relative z-10">
                        <h1 className="text-6xl font-black italic tracking-tighter leading-none mb-4 uppercase">{personal.fullName}</h1>
                        <p className="text-orange-500 font-bold uppercase tracking-[0.4em] text-sm flex items-center gap-4">
                            <div className="w-12 h-px bg-orange-600" /> {personal.title}
                        </p>
                    </div>
                    <div className="relative z-10 text-right space-y-4">
                        <div className="w-20 h-20 bg-orange-600 flex items-center justify-center rounded-lg shadow-[8px_8px_0px_#f9731633] mb-8 ml-auto">
                            <Building className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center justify-end gap-3">{personal.email} <Mail className="w-4 h-4 text-orange-500" /></div>
                            <div className="flex items-center justify-end gap-3">{personal.phone} <Phone className="w-4 h-4 text-orange-500" /></div>
                            <div className="flex items-center justify-end gap-3">{personal.location} <MapPin className="w-4 h-4 text-orange-500" /></div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-12 gap-0">
                    <div className="col-span-8 p-20 space-y-24">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-10 flex items-center gap-4 italic">
                                <Ruler className="w-5 h-5 text-orange-600" /> ENGINEERING PROFILE
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-bold bg-slate-50 p-12 border-l-8 border-slate-900 italic">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-16 flex items-center gap-4 italic">
                                <Briefcase className="w-5 h-5 text-orange-600" /> STRUCTURAL BACKGROUND
                            </h2>
                            <div className="space-y-16">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative group break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[32px] top-0 text-[40px] font-black text-slate-100 select-none group-hover:text-orange-50 transition-colors italic">/0{experience.indexOf(exp) + 1}</div>
                                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 leading-none mb-2 uppercase">{exp.position}</h3>
                                                <p className="text-orange-600 font-bold text-[10px] uppercase tracking-widest">{exp.company}</p>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase italic">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-lg">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="col-span-4 p-12 bg-slate-50/50 space-y-20 flex flex-col justify-between">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-12 italic border-b-2 border-slate-200 pb-2">Technical Core</h2>
                            <div className="space-y-3">
                                {skills.map(s => (
                                    <div key={s} className="flex items-center justify-between text-[10px] font-black uppercase text-slate-800 italic break-inside-avoid page-break-inside-avoid">
                                        <span>{s}</span>
                                        <span className="text-orange-500">ENG_CERT</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-12 italic border-b-2 border-slate-200 pb-2">Academic Formation</h2>
                            <div className="space-y-10">
                                {education.map(edu => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-orange-600 break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-slate-500 mb-2 uppercase italic">{edu.startDate} - {edu.endDate}</p>
                                        <h4 className="text-xs font-black text-slate-900 leading-snug uppercase tracking-tight mb-1">{edu.school}</h4>
                                        <p className="text-orange-600 text-[10px] font-bold uppercase">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-10 bg-orange-600 text-white flex flex-col items-center text-center rounded-sm shadow-2xl">
                            <Award className="w-12 h-12 mb-6" />
                            <h3 className="font-black text-xs uppercase mb-3 tracking-widest">Certified Engineer</h3>
                            <p className="text-[10px] opacity-70 leading-relaxed font-bold italic">Building the future with structural integrity and precision.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
