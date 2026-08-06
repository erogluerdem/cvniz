import { Mail, Phone, MapPin, HeartHandshake, Smile, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function CustomerSuccessTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-cyan-50 p-12 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-cyan-100 flex flex-col min-h-[900px]">
                <header className="bg-gradient-to-r from-cyan-600 to-blue-600 p-16 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-black mb-2 tracking-tight">{personal.fullName}</h1>
                            <p className="text-cyan-100 font-bold uppercase tracking-widest text-sm">{personal.title}</p>
                        </div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                            <HeartHandshake className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <div className="mt-12 flex flex-wrap gap-8 text-xs font-bold text-cyan-50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/5"><Mail className="w-4 h-4" /> {personal.email}</div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/5"><Phone className="w-4 h-4" /> {personal.phone}</div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/5"><MapPin className="w-4 h-4" /> {personal.location}</div>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-12 gap-0">
                    <div className="col-span-8 p-16 border-r border-slate-100">
                        <section className="mb-16 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <Smile className="w-5 h-5 text-cyan-500" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Empathy & Strategy</h2>
                            </div>
                            <p className="text-lg text-slate-600 border-l-4 border-cyan-500 pl-8 leading-relaxed font-medium">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <Briefcase className="w-5 h-5 text-cyan-500" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Success Milestones</h2>
                            </div>
                            <div className="space-y-12">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-12 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute left-0 top-0 w-8 h-8 bg-cyan-50 flex items-center justify-center rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                        </div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 leading-none mb-2">{exp.position}</h3>
                                                <p className="text-cyan-600 font-bold text-xs uppercase tracking-wide">{exp.company}</p>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1 rounded-full uppercase italic">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium bg-slate-50/50 p-6 rounded-2xl">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="col-span-4 p-12 bg-slate-50/30">
                        <section className="mb-16 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Client Toolkit</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => <span key={s} className="px-3 py-1.5 bg-white text-cyan-700 rounded-xl text-[10px] font-black border border-cyan-100 shadow-sm">{s}</span>)}
                            </div>
                        </section>

                        <section className="mb-16 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Academic Path</h2>
                            <div className="space-y-8">
                                {education.map(edu => (
                                    <div key={edu.id} className="group break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black text-cyan-400 mb-2 uppercase italic">{edu.startDate} - {edu.endDate}</p>
                                        <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-cyan-600 transition-colors uppercase">{edu.school}</h4>
                                        <p className="text-slate-500 text-[10px] font-bold mt-1 tracking-wide">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-10 bg-slate-950 rounded-[40px] text-white">
                            <Globe className="w-10 h-10 mb-6 text-cyan-400" />
                            <h3 className="font-black text-xs uppercase mb-3">Global Success</h3>
                            <p className="text-[10px] opacity-50 font-medium leading-relaxed italic">Managing high-value accounts with a focus on retention and expansion.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
