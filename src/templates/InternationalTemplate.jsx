import { Mail, Phone, MapPin, Globe, Flag, Plane } from 'lucide-react'

export default function InternationalTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* International Header with Flag Colors */}
            <header className="relative">
                <div className="h-2 bg-gradient-to-r from-red-500 via-white to-blue-500"></div>
                <div className="bg-gradient-to-r from-sky-700 to-sky-800 text-white px-10 py-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                            <Globe className="w-10 h-10 text-sky-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-sky-200">{personal.title || 'International Professional'}</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-sky-200">
                                {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                                {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-sky-50 rounded-xl p-6 border-l-4 border-sky-600">
                            <h2 className="text-lg font-bold text-sky-800 mb-3">Professional Summary</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-sky-800 mb-4 flex items-center gap-2">
                                <Plane className="w-5 h-5" /> International Experience
                            </h2>
                            <div className="space-y-5">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="bg-gray-50 rounded-xl p-5">
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                                <p className="text-sky-600 flex items-center gap-1">
                                                    <Flag className="w-4 h-4" /> {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-sm text-sky-700 bg-sky-100 px-3 py-1 rounded-full h-fit">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        {exp.description && <p className="text-gray-600 text-sm whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-sky-800 mb-4">Education</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="bg-gray-50 rounded-xl p-4 mb-3">
                                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                    <p className="text-sky-600">{edu.degree}</p>
                                    <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Languages - Featured prominently */}
                    {languages?.length > 0 && (
                        <div className="bg-sky-700 text-white rounded-xl p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5" /> Languages
                            </h2>
                            <div className="space-y-3">
                                {languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{lang.name}</span>
                                            <span className="text-sky-200">{lang.level}</span>
                                        </div>
                                        <div className="h-2 bg-sky-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-white rounded-full"
                                                style={{
                                                    width: lang.level?.includes('Ana') || lang.level?.includes('Native') ? '100%' :
                                                        lang.level?.includes('İleri') || lang.level?.includes('Advanced') ? '85%' :
                                                            lang.level?.includes('Orta') || lang.level?.includes('Intermediate') ? '60%' : '40%'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="font-bold text-sky-800 mb-4">Core Competencies</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
