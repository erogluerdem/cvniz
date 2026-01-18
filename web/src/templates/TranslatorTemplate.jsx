import { Mail, Phone, MapPin, Languages, MessageCircle, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function TranslatorTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-slate-100 p-0 sm:p-8 flex justify-center py-10">
            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl p-[15mm] flex flex-col border border-stone-100 ring-1 ring-stone-200">
                <header className="mb-24 flex justify-between items-end border-b-2 border-amber-900 pb-12">
                    <div>
                        <h1 className="text-5xl font-black text-amber-950 mb-4 tracking-tight leading-none">{personal.fullName}</h1>
                        <p className="text-amber-700 font-medium italic text-xl">{personal.title}</p>
                    </div>
                    <div className="text-right text-xs font-serif space-y-1 text-amber-900/60 uppercase tracking-widest">
                        <div className="flex items-center justify-end gap-3">{personal.email} <Mail className="w-4 h-4 text-amber-800" /></div>
                        <div className="flex items-center justify-end gap-3">{personal.phone} <Phone className="w-4 h-4 text-amber-800" /></div>
                        <div className="flex items-center justify-end gap-3">{personal.location} <MapPin className="w-4 h-4 text-amber-800" /></div>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-12 gap-16 font-serif">
                    <div className="col-span-8 space-y-24">
                        <section>
                            <h2 className="text-xs font-black uppercase text-amber-900 mb-10 tracking-[0.3em] flex items-center gap-4">
                                <Languages className="w-5 h-5" /> Linguist Profiling
                            </h2>
                            <p className="text-xl text-amber-900 leading-relaxed font-light italic pl-12 border-l border-amber-900/20">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase text-amber-900 mb-16 tracking-[0.3em] flex items-center gap-4">
                                <Briefcase className="w-5 h-5" /> Professional History
                            </h2>
                            <div className="space-y-16">
                                {experience.map(exp => (
                                    <div key={exp.id} className="group">
                                        <div className="flex justify-between items-end mb-4 border-b border-amber-100 pb-2">
                                            <h3 className="text-2xl font-light text-amber-950">{exp.position}</h3>
                                            <span className="text-xs italic text-amber-600">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-amber-900 font-bold text-[10px] uppercase mb-4 tracking-widest">{exp.company}</p>
                                        <p className="text-amber-900/60 text-sm leading-relaxed font-light pl-6 italic max-w-lg">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 space-y-16">
                        <section>
                            <h2 className="text-xs font-black uppercase text-amber-900 mb-8 tracking-[0.3em]">Expertise</h2>
                            <div className="flex flex-col gap-4">
                                {skills.map(s => <span key={s} className="text-sm italic font-light pb-2 border-b border-amber-50 text-amber-950">{s}</span>)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase text-amber-900 mb-8 tracking-[0.3em]">Formation</h2>
                            <div className="space-y-10">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <p className="text-[10px] font-bold text-amber-600 mb-2 uppercase">{edu.startDate} - {edu.endDate}</p>
                                        <h4 className="font-bold text-amber-950 text-sm leading-snug">{edu.school}</h4>
                                        <p className="text-amber-900/60 text-xs italic mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-24 p-8 border border-amber-900/10 rounded-sm italic text-amber-900/40 text-sm leading-relaxed text-center font-light">
                            "Translation is that which transforms everything so that nothing changes."
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
