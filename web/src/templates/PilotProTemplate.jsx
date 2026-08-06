import { Mail, Phone, MapPin, Plane, Navigation, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function PilotProTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-900 p-8 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden rounded-sm border-x-8 border-slate-800">
                <header className="bg-slate-800 p-12 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">{personal.fullName}</h1>
                        <p className="text-sky-400 font-black uppercase tracking-[0.3em] text-xs">{personal.title}</p>
                    </div>
                    <div className="text-right space-y-2">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mx-auto mb-4">
                            <Plane className="w-8 h-8 text-sky-400" />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-12">
                    <div className="col-span-4 bg-slate-50 p-10 border-r border-slate-100">
                        <section className="mb-12 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest border-b border-slate-200 pb-2">Logbook</h2>
                            <div className="space-y-4 text-xs font-bold text-slate-600">
                                <div className="flex flex-col gap-1"><span>Email</span> <span className="text-slate-900">{personal.email}</span></div>
                                <div className="flex flex-col gap-1"><span>Phone</span> <span className="text-slate-900">{personal.phone}</span></div>
                                <div className="flex flex-col gap-1"><span>Base</span> <span className="text-slate-900">{personal.location}</span></div>
                            </div>
                        </section>

                        <section className="mb-12 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest border-b border-slate-200 pb-2">Ratings & Skills</h2>
                            <div className="space-y-3">
                                {skills.map(s => (
                                    <div key={s} className="flex items-center gap-3 break-inside-avoid page-break-inside-avoid">
                                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                        <span className="text-[10px] font-black uppercase text-slate-700">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest border-b border-slate-200 pb-2">Education</h2>
                            <div className="space-y-6">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase leading-tight mb-1">{edu.school}</h4>
                                        <p className="text-[9px] font-bold text-sky-600 uppercase mb-1">{edu.degree}</p>
                                        <p className="text-slate-500 text-[9px]">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-8 p-12">
                        <section className="mb-16 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <Navigation className="w-5 h-5 text-sky-600" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Flight Deck Summary</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium border-l-4 border-sky-500 pl-8">{personal.summary}</p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <Briefcase className="w-5 h-5 text-sky-600" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Aviation Career</h2>
                            </div>
                            <div className="space-y-12">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-8 border-l border-slate-100 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-900" />
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 leading-none mb-2">{exp.position}</h4>
                                                <p className="text-sky-600 font-bold text-xs uppercase tracking-wide">{exp.company}</p>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium mt-4">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
