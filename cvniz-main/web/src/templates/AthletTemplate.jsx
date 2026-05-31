import { Mail, Phone, MapPin, Dumbbell, Trophy } from 'lucide-react'

export default function AthletTemplate({ data }) {
    const { personal, experience, education, skills } = data

    return (
        <div className="min-h-full bg-zinc-900 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="bg-gradient-to-r from-orange-600 to-red-600 px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                        <Dumbbell className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-orange-100">{personal.title || 'Profesyonel Sporcu'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-orange-100">
                            {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8">
                {personal.summary && (
                    <section className="mb-8 bg-white/5 rounded-xl p-6 border-l-4 border-orange-500">
                        <p className="text-gray-300">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-8">
                    <div>
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4 flex items-center gap-2">
                                    <Trophy className="w-4 h-4" /> Kariyer & Başarılar
                                </h2>
                                <div className="space-y-4">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="bg-white/5 rounded-lg p-4">
                                            <h3 className="font-bold">{exp.position}</h3>
                                            <p className="text-orange-400 text-sm">{exp.company}</p>
                                            <p className="text-gray-400 text-xs">{exp.startDate} - {exp.endDate}</p>
                                            {exp.description && <p className="text-gray-400 text-sm mt-2">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {skills.length > 0 && (
                            <section className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6">
                                <h2 className="font-bold mb-4">Yetenekler</h2>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-white rounded-full"></span>
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-4">Eğitim</h2>
                                {education.map((edu) => (
                                    <div key={edu.id} className="mb-3">
                                        <h3 className="font-semibold">{edu.school}</h3>
                                        <p className="text-gray-400 text-sm">{edu.degree}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
