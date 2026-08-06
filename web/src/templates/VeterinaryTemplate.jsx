import { Mail, Phone, MapPin, HeartPulse, Shield, Award, Briefcase, GraduationCap, Dog } from 'lucide-react'

export default function VeterinaryTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-emerald-50 p-12 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[48px] overflow-hidden border-2 border-white flex flex-col min-h-[900px]">
                <header className="bg-emerald-600 p-16 text-white relative">
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10">
                        <Dog className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-8 flex items-center justify-center border-2 border-white/30">
                            <HeartPulse className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">{personal.fullName}</h1>
                        <p className="text-emerald-100 font-bold uppercase tracking-[0.2em] text-sm">{personal.title}</p>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-bold text-emerald-50">
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-300" /> {personal.email}</div>
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-300" /> {personal.phone}</div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-300" /> {personal.location}</div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
                    <div className="col-span-8 p-16 space-y-20 border-r border-emerald-50">
                        <section>
                            <h2 className="text-xl font-bold text-emerald-800 mb-8 flex items-center gap-3">
                                Hekimlik Profili
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium italic border-l-4 border-emerald-500 pl-8">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-emerald-800 mb-12 flex items-center gap-3">
                                Klinisyen Geçmişi
                            </h2>
                            <div className="space-y-12">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-12 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-100 flex items-center justify-center rounded-full">
                                            <div className="w-2 h-2 rounded-full bg-emerald-600" />
                                        </div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 leading-none mb-2">{exp.position}</h3>
                                                <p className="text-emerald-600 font-bold text-sm tracking-wide">{exp.company}</p>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full uppercase">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium bg-emerald-50/20 p-8 rounded-[32px] border border-emerald-50 italic">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="col-span-4 p-12 bg-emerald-50/10 space-y-16">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-8 border-b-2 border-emerald-100 pb-2">Hekimlik Becerileri</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => <span key={s} className="px-3 py-1.5 bg-white text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">{s}</span>)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-8 border-b-2 border-emerald-100 pb-2">Hekimlik Eğitimi</h2>
                            <div className="space-y-8">
                                {education.map(edu => (
                                    <div key={edu.id} className="group break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-tighter">{edu.startDate} - {edu.endDate}</p>
                                        <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">{edu.school}</h4>
                                        <p className="text-slate-500 text-[10px] font-bold mt-1 italic">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-10 bg-emerald-800 rounded-[40px] text-white shadow-xl shadow-emerald-100 mt-20">
                            <Shield className="w-10 h-10 mb-6 text-emerald-300" />
                            <h3 className="font-bold text-sm uppercase mb-3">Güvenli Tedavi</h3>
                            <p className="text-xs opacity-70 leading-relaxed font-medium italic">Hayvan sağlığı ve refahı odaklı profesyonel hakanlık anlayışı.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
