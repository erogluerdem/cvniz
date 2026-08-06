import { Mail, Phone, MapPin, ShoppingBag, BarChart3, Award, Briefcase, GraduationCap, Globe } from 'lucide-react'

export default function EcommerceTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-indigo-50 p-12 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-[0_32px_64px_-16px_rgba(49,46,129,0.1)] rounded-3xl overflow-hidden border border-indigo-100">
                <div className="grid grid-cols-12">
                    <div className="col-span-12 bg-white p-12 border-b border-indigo-50 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-indigo-950 mb-2">{personal.fullName}</h1>
                            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">{personal.title}</p>
                        </div>
                        <div className="text-right text-xs font-medium space-y-1 text-slate-500">
                            <div className="flex items-center justify-end gap-2">{personal.email} <Mail className="w-4 h-4 text-indigo-400" /></div>
                            <div className="flex items-center justify-end gap-2">{personal.phone} <Phone className="w-4 h-4 text-indigo-400" /></div>
                            <div className="flex items-center justify-end gap-2">{personal.location} <MapPin className="w-4 h-4 text-indigo-400" /></div>
                        </div>
                    </div>

                    <div className="col-span-8 p-12 border-r border-indigo-50">
                        <section className="mb-12 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 bg-indigo-50 px-4 py-2 rounded-lg">Stratejik Özet</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">{personal.summary}</p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 bg-indigo-50 px-4 py-2 rounded-lg">E-Ticaret Deneyimi</h2>
                            </div>
                            <div className="space-y-12">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                                            <span className="text-[10px] font-black text-indigo-500 border border-indigo-100 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-indigo-600 text-xs font-black mb-4 uppercase tracking-wide">{exp.company}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed border-l-4 border-indigo-100 pl-6">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 p-12 bg-indigo-50/30">
                        <section className="mb-12 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-8">Dijital Yetenekler</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => <span key={s} className="px-3 py-1.5 bg-white text-indigo-700 rounded-xl text-[10px] font-bold shadow-sm border border-indigo-50">{s}</span>)}
                            </div>
                        </section>

                        <section className="mb-12 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-8">Eğitim Verileri</h2>
                            <div className="space-y-6">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold text-indigo-950 text-xs leading-snug">{edu.school}</h4>
                                        <p className="text-indigo-600 text-[10px] font-medium mb-2">{edu.degree}</p>
                                        <p className="text-slate-500 text-[9px] font-bold uppercase">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-8 bg-indigo-600 rounded-3xl text-white mt-12 shadow-xl shadow-indigo-200">
                            <BarChart3 className="w-8 h-8 mb-4 text-indigo-300" />
                            <h3 className="font-black text-xs uppercase mb-2">KPI Odaklı</h3>
                            <p className="text-[10px] opacity-70 leading-relaxed font-medium">Satış ve dönüşüm hedeflerinize hitap eden profesyonel altyapı.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
