import { Mail, Phone, MapPin, Cog, Wrench, Cpu, Building2 } from 'lucide-react'

export default function EngineerTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-zinc-100 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Technical Header */}
            <header className="bg-gradient-to-r from-zinc-800 to-zinc-900 text-white px-10 py-8">
                <div className="flex items-center gap-8">
                    {personal.photo ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-orange-500 shadow-xl shrink-0">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                            <Cog className="w-10 h-10" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-zinc-500 text-lg">{personal.title || 'Mühendis'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-500">
                            {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                            {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-3">Profesyonel Özet</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-lg p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-orange-500" /> Mühendislik Deneyimi
                            </h2>
                            <div className="space-y-5">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-zinc-200 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-orange-500"></div>
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-bold text-zinc-800">{exp.position}</h3>
                                            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-orange-600 font-medium">{exp.company}</p>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className="bg-white rounded-lg p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3 flex justify-between break-inside-avoid page-break-inside-avoid">
                                    <div>
                                        <h3 className="font-semibold text-zinc-800">{edu.school}</h3>
                                        <p className="text-orange-600">{edu.degree}</p>
                                    </div>
                                    <span className="text-zinc-500 text-sm">{edu.endDate}</span>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-zinc-800 text-white rounded-lg p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-orange-400" /> Teknik Beceriler
                            </h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 break-inside-avoid page-break-inside-avoid">
                                        <Cpu className="w-3 h-3 text-orange-400" />
                                        <span className="text-sm text-zinc-300">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="font-bold text-zinc-800 mb-4">Diller</h2>
                            {languages.map((lang, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid page-break-inside-avoid">
                                    <span>{lang.name}</span>
                                    <span className="text-orange-600">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
