import { Mail, Phone, MapPin, Building, Shield, FileCheck, Users } from 'lucide-react'

export default function GovernmentTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Formal Government Header */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center border-2 border-white/20">
                        <Building className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-blue-200">{personal.title || 'Kamu Görevlisi'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-200">
                            {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                            {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8">
                {personal.summary && (
                    <section className="mb-6 bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-800 break-inside-avoid page-break-inside-avoid">
                        <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Görev Tanımı
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {experience.length > 0 && (
                            <section className="bg-white rounded-lg p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileCheck className="w-4 h-4" /> Kamu Hizmeti Deneyimi
                                </h2>
                                <div className="space-y-4">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-blue-200 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                                <span className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-blue-700">{exp.company}</p>
                                            {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className="bg-white rounded-lg p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">Eğitim</h2>
                                {education.map((edu) => (
                                    <div key={edu.id} className="mb-3 flex justify-between break-inside-avoid page-break-inside-avoid">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                            <p className="text-blue-700">{edu.degree}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm">{edu.endDate}</span>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {skills.length > 0 && (
                            <div className="bg-blue-900 text-white rounded-lg p-6">
                                <h2 className="font-bold mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Yetkinlikler
                                </h2>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="text-sm text-blue-100 break-inside-avoid page-break-inside-avoid">• {skill}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="font-bold text-blue-900 mb-4">Diller</h2>
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid page-break-inside-avoid">
                                        <span>{lang.name}</span>
                                        <span className="text-blue-700">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
