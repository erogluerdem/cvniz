import { Mail, Phone, MapPin, BookOpen, GraduationCap, FileText } from 'lucide-react'

export default function AcademicTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-amber-50" style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
            {/* Classic Academic Header */}
            <header className="bg-amber-900 text-white px-10 py-8 text-center">
                {personal.photo && (
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-amber-800/30 shadow-lg bg-white p-1">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded shadow-inner" />
                        </div>
                    </div>
                )}
                <h1 className="text-4xl font-normal tracking-wide mb-2">{personal.fullName || 'Prof. Dr. Ad Soyad'}</h1>
                <p className="text-amber-200 text-xl italic">{personal.title || 'Araştırma Görevlisi'}</p>
                <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-amber-200">
                    {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>
            </header>

            <div className="p-10 max-w-4xl mx-auto space-y-8">
                {personal.summary && (
                    <section>
                        <h2 className="text-xl font-bold text-amber-900 mb-3 border-b-2 border-amber-900 pb-1">
                            Araştırma Alanları
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line italic">{personal.summary}</p>
                    </section>
                )}

                {education.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-amber-900 mb-4 border-b-2 border-amber-900 pb-1 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" /> Akademik Geçmiş
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                                        <span className="text-amber-700">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <p className="text-amber-800 italic">{edu.school}</p>
                                    {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {experience.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-amber-900 mb-4 border-b-2 border-amber-900 pb-1 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Akademik Pozisyonlar
                        </h2>
                        <div className="space-y-4">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                        <span className="text-amber-700">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-amber-800 italic">{exp.company}</p>
                                    {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-8">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-amber-900 mb-3 border-b border-amber-300 pb-1">
                                Uzmanlık Alanları
                            </h2>
                            <ul className="space-y-1">
                                {skills.map((skill, i) => (
                                    <li key={i} className="text-gray-700 text-sm">• {skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {languages?.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-amber-900 mb-3 border-b border-amber-300 pb-1">
                                Diller
                            </h2>
                            <div className="space-y-1">
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-700">{lang.name}</span>
                                        <span className="text-amber-700">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
