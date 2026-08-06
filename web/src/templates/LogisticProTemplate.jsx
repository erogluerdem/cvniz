import { Mail, Phone, MapPin, Truck, Box, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function LogisticProTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-50 p-12 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Roboto', sans-serif" }}>
            <div className="bg-white shadow-2xl rounded-sm overflow-hidden border-t-8 border-blue-600 flex">
                <div className="w-[30%] bg-slate-900 p-10 text-white">
                    <div className="mb-12">
                        <h1 className="text-2xl font-black uppercase leading-tight mb-2 tracking-tighter">{personal.fullName}</h1>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{personal.title}</p>
                    </div>

                    <div className="space-y-10">
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">İletişim</h2>
                            <div className="space-y-3 text-xs opacity-80">
                                <div className="flex items-center gap-3"><Mail className="w-4 h-4" /> {personal.email}</div>
                                <div className="flex items-center gap-3"><Phone className="w-4 h-4" /> {personal.phone}</div>
                                <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> {personal.location}</div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Uzmanlıklar</h2>
                            <div className="space-y-2">
                                {skills.map(s => (
                                    <div key={s} className="flex items-center justify-between text-[10px] break-inside-avoid page-break-inside-avoid">
                                        <span>{s}</span>
                                        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-blue-500"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="flex-1 p-12">
                    <div className="flex items-start gap-6 mb-12">
                        <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200">
                            <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed italic">{personal.summary}</p>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <Box className="w-5 h-5 text-blue-600" />
                                <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-blue-600 pb-1">Operasyonel Deneyim</h2>
                            </div>
                            <div className="space-y-8">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-slate-100 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-black text-slate-800 text-sm">{exp.position}</h4>
                                                <p className="text-blue-600 text-[10px] font-bold uppercase">{exp.company}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-bold">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-slate-500 text-xs leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-blue-600 pb-1">Akademik Geçmiş</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold text-slate-800 text-xs">{edu.school}</h4>
                                        <p className="text-slate-500 text-[10px]">{edu.degree}</p>
                                        <p className="text-blue-500 text-[9px] font-bold mt-1">{edu.startDate} - {edu.endDate}</p>
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
