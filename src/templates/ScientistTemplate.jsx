import { Mail, Phone, MapPin, FlaskConical, Microscope, BookOpen } from 'lucide-react'

export default function ScientistTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-slate-50" style={{ fontFamily: 'Georgia, serif' }}>
            <header className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                        <FlaskConical className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-indigo-200">{personal.title || 'Bilim İnsanı'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-indigo-200">
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
                        <section className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-indigo-600">
                            <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Microscope className="w-4 h-4" /> Araştırma Özeti
                            </h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4">Araştırma Deneyimi</h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-2 border-indigo-200 pl-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                            <span className="text-sm text-indigo-600">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-indigo-700">{exp.company}</p>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className be="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Eğitim
                            </h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                    <p className="text-indigo-600">{edu.degree}</p>
                                    <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-indigo-900 text-white rounded-lg p-6">
                            <h2 className="font-bold mb-4">Uzmanlık Alanları</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="text-sm text-indigo-100">• {skill}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="font-bold text-indigo-900 mb-4">Diller</h2>
                            {languages.map((lang, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2">
                                    <span>{lang.name}</span>
                                    <span className="text-indigo-600">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
