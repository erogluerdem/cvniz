import { Mail, Phone, MapPin, Camera, Film } from 'lucide-react'

export default function PhotographerTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-black text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="px-10 py-12 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-white/80" />
                <h1 className="text-4xl font-light tracking-widest mb-2">{personal.fullName?.toUpperCase() || 'AD SOYAD'}</h1>
                <p className="text-white/60 tracking-wider">{personal.title || 'Fotoğrafçı'}</p>
                <div className="flex justify-center flex-wrap gap-6 mt-6 text-sm text-white/40">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                </div>
            </header>

            {personal.summary && (
                <section className="px-10 py-8 text-center border-t border-white/10">
                    <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">{personal.summary}</p>
                </section>
            )}

            <section className="px-10 py-8 border-t border-white/10">
                <div className="grid grid-cols-4 gap-3 mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square bg-white/10 rounded"></div>
                    ))}
                </div>
            </section>

            <div className="px-10 py-8 grid grid-cols-2 gap-8 border-t border-white/10">
                <div>
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Deneyim</h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id}>
                                        <h3 className="font-medium">{exp.position}</h3>
                                        <p className="text-white/60 text-sm">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Uzmanlık</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 border border-white/20 rounded-full text-sm text-white/70">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-2">
                                    <h3 className="font-medium">{edu.school}</h3>
                                    <p className="text-white/60 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
