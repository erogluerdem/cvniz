import { Mail, Phone, MapPin, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

export default function FinanceTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Professional Finance Header */}
            <header className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white px-10 py-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-emerald-200 text-lg">{personal.title || 'Finans Uzmanı'}</p>
                    </div>
                    <div className="text-right text-sm text-emerald-200 space-y-1">
                        {personal.email && <div className="flex items-center justify-end gap-2"><Mail className="w-4 h-4" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center justify-end gap-2"><Phone className="w-4 h-4" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center justify-end gap-2"><MapPin className="w-4 h-4" /> {personal.location}</div>}
                    </div>
                </div>
            </header>

            <div className="p-8">
                {personal.summary && (
                    <section className="mb-8 bg-white rounded-lg p-6 shadow-sm border-t-4 border-emerald-600 break-inside-avoid page-break-inside-avoid">
                        <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-3">Profesyonel Profil</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {experience.length > 0 && (
                            <section className="bg-white rounded-lg p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Kariyer Geçmişi
                                </h2>
                                <div className="space-y-5">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-4 border-l-2 border-emerald-200 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-600"></div>
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-emerald-700 font-medium">{exp.company}</p>
                                            {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className="bg-white rounded-lg p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4">Eğitim</h2>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="flex justify-between break-inside-avoid page-break-inside-avoid">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                                <p className="text-emerald-700">{edu.degree}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{edu.endDate}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {skills.length > 0 && (
                            <div className="bg-emerald-800 text-white rounded-lg p-6">
                                <h2 className="font-bold mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Uzmanlıklar
                                </h2>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="text-sm text-emerald-100 break-inside-avoid page-break-inside-avoid">• {skill}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="font-bold text-emerald-800 mb-4">Diller</h2>
                                <div className="space-y-2">
                                    {languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between text-sm break-inside-avoid page-break-inside-avoid">
                                            <span>{lang.name}</span>
                                            <span className="text-emerald-600">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
