import { Mail, Phone, MapPin, Mic, Music } from 'lucide-react'

export default function MusicianTemplate({ data }) {
    const { personal, experience, education, skills } = data

    return (
        <div className="min-h-full bg-gradient-to-br from-purple-950 via-purple-900 to-black text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="px-10 py-10 text-center">
                <Music className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h1 className="text-4xl font-bold mb-2">{personal.fullName || 'Ad Soyad'}</h1>
                <p className="text-purple-300 text-xl">{personal.title || 'Müzisyen'}</p>
                <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-purple-300">
                    {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                </div>
            </header>

            {personal.summary && (
                <section className="px-10 py-6 text-center">
                    <p className="text-purple-200 max-w-2xl mx-auto">{personal.summary}</p>
                </section>
            )}

            <div className="px-10 py-8 grid grid-cols-2 gap-8">
                <div>
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
                                <Mic className="w-4 h-4" /> Performanslar
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                                        <h3 className="font-bold">{exp.position}</h3>
                                        <p className="text-purple-400 text-sm">{exp.company}</p>
                                        <p className="text-purple-300 text-xs mt-1">{exp.startDate} - {exp.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4">Enstrümanlar</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="font-semibold">{edu.school}</h3>
                                    <p className="text-purple-300 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
