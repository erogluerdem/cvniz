import { Mail, Phone, MapPin, Scale, Gavel, Shield } from 'lucide-react'

export default function LegalTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-stone-100" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
            {/* Formal Legal Header */}
            <header className="bg-stone-900 text-white px-10 py-10">
                <div className="text-center border-b border-stone-700 pb-6 mb-6">
                    <Scale className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                    <h1 className="text-3xl font-normal tracking-wide">{personal.fullName || 'Av. Ad Soyad'}</h1>
                    <p className="text-stone-400 text-lg mt-2 italic">{personal.title || 'Avukat'}</p>
                </div>
                <div className="flex justify-center flex-wrap gap-8 text-sm text-stone-400">
                    {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>
            </header>

            <div className="p-10 max-w-4xl mx-auto">
                {personal.summary && (
                    <section className="mb-10 text-center">
                        <p className="text-gray-700 leading-relaxed italic text-lg whitespace-pre-line">"{personal.summary}"</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2 border-b border-stone-300 pb-2">
                                    <Gavel className="w-5 h-5 text-amber-600" /> Mesleki Deneyim
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between mb-1">
                                                <h3 className="font-bold text-stone-800">{exp.position}</h3>
                                                <span className="text-sm text-stone-500">{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                            <p className="text-amber-700 font-medium">{exp.company}</p>
                                            {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-stone-800 mb-4 border-b border-stone-300 pb-2">Eğitim</h2>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h3 className="font-bold text-stone-800">{edu.school}</h3>
                                            <p className="text-amber-700">{edu.degree}</p>
                                            <p className="text-sm text-stone-500">{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {skills.length > 0 && (
                            <div className="bg-stone-800 text-white rounded-lg p-6">
                                <h2 className="font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-amber-500" /> Uzmanlık Alanları
                                </h2>
                                <ul className="space-y-2 text-sm text-stone-300">
                                    {skills.map((skill, i) => (
                                        <li key={i}>• {skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className="bg-white rounded-lg p-6 border border-stone-200">
                                <h2 className="font-bold text-stone-800 mb-4">Diller</h2>
                                <div className="space-y-2">
                                    {languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-stone-700">{lang.name}</span>
                                            <span className="text-amber-700">{lang.level}</span>
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
