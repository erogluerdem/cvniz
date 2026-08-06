import { Mail, Phone, MapPin, Hotel, Coffee, Globe, Star } from 'lucide-react'

export default function HospitalityTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-amber-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Luxury Hospitality Header */}
            <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white px-10 py-10 text-center">
                <Hotel className="w-12 h-12 mx-auto mb-4 text-amber-300" />
                <h1 className="text-3xl font-light tracking-widest uppercase">{personal.fullName || 'Ad Soyad'}</h1>
                <p className="text-amber-200 text-lg mt-2">{personal.title || 'Otel Yöneticisi'}</p>
                <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-amber-200">
                    {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>
            </header>

            <div className="p-8 max-w-4xl mx-auto">
                {personal.summary && (
                    <section className="mb-8 text-center break-inside-avoid page-break-inside-avoid">
                        <div className="flex justify-center mb-4">
                            <Star className="w-5 h-5 text-amber-500" />
                            <Star className="w-5 h-5 text-amber-500" />
                            <Star className="w-5 h-5 text-amber-500" />
                            <Star className="w-5 h-5 text-amber-500" />
                            <Star className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-gray-700 leading-relaxed italic whitespace-pre-line">"{personal.summary}"</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {experience.length > 0 && (
                            <section className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-amber-500 break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                                    <Coffee className="w-5 h-5" /> Kariyer Deneyimi
                                </h2>
                                <div className="space-y-5">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-amber-300 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                                <span className="text-sm text-amber-700">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-amber-600">{exp.company}</p>
                                            {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-lg font-bold text-amber-800 mb-4">Eğitim</h2>
                                {education.map((edu) => (
                                    <div key={edu.id} className="mb-3 break-inside-avoid page-break-inside-avoid">
                                        <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                        <p className="text-amber-600">{edu.degree}</p>
                                        <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {skills.length > 0 && (
                            <div className="bg-amber-800 text-white rounded-xl p-6">
                                <h2 className="font-bold mb-4">Uzmanlık Alanları</h2>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="text-sm text-amber-100 break-inside-avoid page-break-inside-avoid">• {skill}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Diller
                                </h2>
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid page-break-inside-avoid">
                                        <span>{lang.name}</span>
                                        <span className="text-amber-600">{lang.level}</span>
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
