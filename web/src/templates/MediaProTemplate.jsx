import { Mail, Phone, MapPin, Tv, Radio, Award, Briefcase, GraduationCap, PlayCircle } from 'lucide-react'

export default function MediaProTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-100 p-8 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="bg-white shadow-2xl rounded-[40px] overflow-hidden border-2 border-slate-900">
                <div className="grid grid-cols-12 min-h-[600px]">
                    <div className="col-span-4 bg-slate-950 text-white p-12">
                        <div className="mb-12">
                            <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl rotate-12 mb-8 flex items-center justify-center text-4xl font-black">
                                {personal.fullName?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h1 className="text-2xl font-black uppercase mb-2 leading-tight">{personal.fullName}</h1>
                            <p className="text-red-500 font-bold uppercase tracking-widest text-xs">{personal.title}</p>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <h2 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest flex items-center gap-3">
                                    <div className="w-8 h-px bg-red-600" /> İLETİŞİM
                                </h2>
                                <div className="space-y-4 text-xs">
                                    <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-red-500" /> {personal.email}</div>
                                    <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-red-500" /> {personal.phone}</div>
                                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-red-500" /> {personal.location}</div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest flex items-center gap-3">
                                    <div className="w-8 h-px bg-red-600" /> YETENEKLER
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(s => <span key={s} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] border border-white/5">{s}</span>)}
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="col-span-8 p-16">
                        <div className="mb-16 flex items-start gap-8">
                            <div className="flex-1">
                                <h2 className="text-4xl font-black text-slate-900 mb-6">Yayıncı Profili</h2>
                                <p className="text-slate-500 leading-relaxed text-lg">{personal.summary}</p>
                            </div>
                            <PlayCircle className="w-16 h-16 text-red-600 opacity-20" />
                        </div>

                        <div className="space-y-16">
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-10 flex items-center gap-4">
                                    Deneyimler <div className="flex-1 h-px bg-slate-100" />
                                </h3>
                                <div className="space-y-12">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="relative group break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900 mb-1">{exp.position}</h4>
                                                    <p className="text-red-600 font-bold text-sm tracking-wide">{exp.company}</p>
                                                </div>
                                                <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-4 py-2 rounded-xl">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-slate-100 pl-6 group-hover:border-red-600 transition-colors">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
