import { Mail, Phone, MapPin, Linkedin, Globe, Home, Key, Award, Briefcase, GraduationCap } from 'lucide-react'

export default function RealEstateTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="flex min-h-full bg-white print-exact mx-auto print:mx-0" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="w-[35%] bg-blue-900 text-white p-10">
                <div className="text-center mb-12">
                    <div className="w-28 h-28 rounded-2xl bg-white text-blue-900 mx-auto mb-6 flex items-center justify-center text-4xl font-black shadow-2xl rotate-3">
                        {personal.fullName?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h1 className="text-2xl font-black uppercase mb-1">{personal.fullName}</h1>
                    <div className="h-1 w-12 bg-orange-500 mx-auto mb-4" />
                    <p className="text-blue-300 text-xs font-bold uppercase tracking-widest">{personal.title}</p>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-blue-800/50 rounded-2xl border border-blue-700">
                        <h2 className="text-xs font-black uppercase mb-4 text-orange-400">İletişim</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 opacity-90"><Mail className="w-4 h-4" /> {personal.email}</div>
                            <div className="flex items-center gap-3 opacity-90"><Phone className="w-4 h-4" /> {personal.phone}</div>
                            <div className="flex items-center gap-3 opacity-90"><MapPin className="w-4 h-4" /> {personal.location}</div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xs font-black uppercase mb-4 px-6">Beceriler</h2>
                        <div className="flex flex-wrap gap-2 px-6">
                            {skills.map(s => <span key={s} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold border border-white/10">{s}</span>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[65%] p-16">
                <div className="mb-12 flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-orange-600 mb-4">
                            <Home className="w-6 h-6" />
                            <h2 className="text-sm font-black uppercase tracking-widest">Profesyonel Profil</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed border-l-4 border-orange-500 pl-6">{personal.summary}</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <section>
                        <h3 className="text-lg font-black uppercase text-blue-900 mb-8 flex items-center gap-3">
                            <Key className="w-6 h-6 text-orange-500" /> Kariyer Geçmişi
                        </h3>
                        <div className="space-y-10">
                            {experience.map(exp => (
                                <div key={exp.id} className="relative pl-8 border-l border-slate-200 break-inside-avoid page-break-inside-avoid">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-orange-500" />
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-slate-800">{exp.position}</h4>
                                        <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-blue-600 text-sm font-bold mb-3">{exp.company}</div>
                                    <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-black uppercase text-blue-900 mb-8 flex items-center gap-3">
                            <Award className="w-6 h-6 text-orange-500" /> Eğitim
                        </h3>
                        <div className="grid grid-cols-2 gap-8">
                            {education.map(edu => (
                                <div key={edu.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 break-inside-avoid page-break-inside-avoid">
                                    <p className="text-[10px] font-black text-orange-500 mb-2">{edu.startDate} - {edu.endDate}</p>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{edu.school}</h4>
                                    <p className="text-slate-50 text-xs font-medium text-slate-500">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
