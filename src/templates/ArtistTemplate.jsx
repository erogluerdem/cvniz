import { Mail, Phone, MapPin, Brush, Palette } from 'lucide-react'

export default function ArtistTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-neutral-900 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="px-10 py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500"></div>
                </div>
                <div className="relative z-10">
                    <Palette className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                    <h1 className="text-4xl font-bold mb-2">{personal.fullName || 'Ad Soyad'}</h1>
                    <p className="text-neutral-300 text-xl">{personal.title || 'Sanatçı'}</p>
                    <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-neutral-400">
                        {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </div>
            </header>

            {personal.summary && (
                <section className="px-10 py-8 text-center border-t border-white/10">
                    <p className="text-neutral-300 leading-relaxed max-w-2xl mx-auto italic">{personal.summary}</p>
                </section>
            )}

            <div className="px-10 py-8 grid grid-cols-2 gap-8">
                <div>
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 mb-4 flex items-center gap-2">
                                <Brush className="w-4 h-4" /> Sergiler & Projeler
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="bg-white/5 rounded-xl p-4">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-bold">{exp.position}</h3>
                                            <span className="text-xs text-neutral-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-pink-400 text-sm">{exp.company}</p>
                                        {exp.description && <p className="text-neutral-400 text-sm mt-2">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 mb-4">Teknikler</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="bg-white/5 rounded-xl p-4 mb-2">
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <p className="text-neutral-400 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
