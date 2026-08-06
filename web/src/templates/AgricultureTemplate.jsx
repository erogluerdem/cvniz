import { Mail, Phone, MapPin, Leaf, Sprout, Award, Briefcase, GraduationCap } from 'lucide-react'

export default function AgricultureTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#fdfcf8] p-12 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-emerald-100">
                <header className="bg-gradient-to-r from-emerald-600 to-green-500 p-12 text-white relative">
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-20">
                        <Leaf className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex items-center gap-8">
                        {personal.photo && (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl shrink-0">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{personal.fullName}</h1>
                            <p className="text-emerald-100 font-medium tracking-wide">{personal.title}</p>
                            <div className="mt-8 flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-300" /> {personal.email}</div>
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-300" /> {personal.phone}</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-300" /> {personal.location}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-12 grid grid-cols-3 gap-12">
                    <div className="col-span-2 space-y-12">
                        <section>
                            <h2 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
                                <Sprout className="w-6 h-6 text-emerald-500" /> Profesyonel Özet
                            </h2>
                            <p className="text-slate-600 leading-relaxed">{personal.summary}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-emerald-800 mb-8 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-emerald-500" /> Sektörel Deneyim
                            </h2>
                            <div className="space-y-10">
                                {experience.map(exp => (
                                    <div key={exp.id} className="group break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{exp.position}</h3>
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 mb-3">{exp.company}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-lg font-bold text-emerald-800 mb-6 underline decoration-emerald-200 decoration-4 underline-offset-8">Beceriler</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => <span key={s} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">{s}</span>)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-emerald-800 mb-6 underline decoration-emerald-200 decoration-4 underline-offset-8">Eğitim</h2>
                            <div className="space-y-6">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-slate-800 text-sm mb-1">{edu.school}</h3>
                                        <p className="text-slate-500 text-xs mb-1">{edu.degree}</p>
                                        <p className="text-emerald-600 text-[10px] font-bold">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}
