import { Mail, Phone, MapPin, Palmtree, Compass, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function TourismEliteTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-sky-50 p-0 sm:p-8 flex justify-center py-10 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl overflow-hidden border border-sky-100 flex flex-col">
                <div className="bg-sky-900 p-12 text-center text-white relative">
                    <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <Palmtree className="w-96 h-96" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-24 h-px bg-sky-400 mx-auto mb-8" />
                        <h1 className="text-5xl font-light mb-4 italic tracking-widest">{personal.fullName}</h1>
                        <p className="text-sky-400 font-bold uppercase tracking-[0.4em] text-xs">{personal.title}</p>
                        <div className="w-24 h-px bg-sky-400 mx-auto mt-8" />
                    </div>
                </div>

                <div className="p-12 grid grid-cols-12 gap-10">
                    <div className="col-span-8 space-y-20">
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-sky-800 mb-8 flex items-center gap-4">
                                <Compass className="w-5 h-5" /> Profesyonel Vizyon
                            </h2>
                            <p className="text-slate-600 text-xl leading-relaxed font-light italic">{personal.summary}</p>
                        </section>

                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-sky-800 mb-12">Hizmet Kariyeri</h2>
                            <div className="space-y-12">
                                {experience.map(exp => (
                                    <div key={exp.id} className="group break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-end mb-4 border-b border-sky-50 pb-2">
                                            <p className="text-xl font-bold text-slate-800 leading-tight">
                                                {exp.position} <span className="text-xs italic text-sky-600 font-normal ml-2">{exp.startDate} - {exp.endDate}</span>
                                            </p>
                                        </div>
                                        <p className="text-sky-800 font-bold text-xs uppercase mb-4 tracking-widest">{exp.company}</p>
                                        <p className="text-slate-500 font-light leading-relaxed pl-8 border-l border-sky-100 group-hover:border-sky-300 transition-colors">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 space-y-16">
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-sky-800 mb-8">İletişim</h2>
                            <div className="space-y-6 text-sm italic text-slate-500 font-light">
                                <div className="flex items-center gap-4"><Mail className="w-4 h-4 text-sky-700" /> {personal.email}</div>
                                <div className="flex items-center gap-4"><Phone className="w-4 h-4 text-sky-700" /> {personal.phone}</div>
                                <div className="flex items-center gap-4"><MapPin className="w-4 h-4 text-sky-700" /> {personal.location}</div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-sky-800 mb-8">Ağırlama Becerileri</h2>
                            <div className="space-y-3 font-light italic text-slate-600">
                                {skills.map(s => <div key={s} className="flex items-center gap-3 border-b border-sky-50 pb-2 text-sm">{s}</div>)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-sky-800 mb-8">Eğitim</h2>
                            <div className="space-y-8">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="text-sm font-bold text-sky-900 mb-1">{edu.school}</h4>
                                        <p className="text-xs italic text-slate-500 mb-2">{edu.degree}</p>
                                        <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
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
