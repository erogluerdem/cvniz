import { Mail, Phone, MapPin, Image, ExternalLink, Palette, Camera } from 'lucide-react'

export default function PortfolioTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-neutral-900 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Portfolio Header */}
            <header className="px-10 py-12 text-center border-b border-neutral-800">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-1 mx-auto mb-6">
                    <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-4xl font-bold">
                        {personal.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '✦'}
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-2">{personal.fullName || 'Ad Soyad'}</h1>
                <p className="text-neutral-400 text-xl">{personal.title || 'Kreatif Profesyonel'}</p>
                <div className="flex justify-center flex-wrap gap-6 mt-6 text-sm text-neutral-400">
                    {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.website && (
                        <a href="#" className="flex items-center gap-1 text-pink-400 hover:text-pink-300">
                            <ExternalLink className="w-4 h-4" /> Portfolio
                        </a>
                    )}
                    {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>
            </header>

            {/* Bio */}
            {personal.summary && (
                <section className="px-10 py-8 text-center border-b border-neutral-800">
                    <p className="text-neutral-300 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                        {personal.summary}
                    </p>
                </section>
            )}

            {/* Portfolio Grid - Simulated */}
            <section className="px-10 py-8 border-b border-neutral-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-6 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Seçili Çalışmalar
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-xl flex items-center justify-center">
                            <Image className="w-12 h-12 text-neutral-600" />
                        </div>
                    ))}
                </div>
            </section>

            <div className="px-10 py-8 grid grid-cols-2 gap-8">
                {/* Experience */}
                <div>
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                                <Palette className="w-4 h-4" /> Deneyim
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="bg-neutral-800 rounded-xl p-4">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-bold">{exp.position}</h3>
                                            <span className="text-xs text-neutral-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-pink-400 text-sm">{exp.company}</p>
                                        {exp.description && <p className="text-neutral-400 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Skills & Education */}
                <div className="space-y-6">
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Araçlar & Yetenekler</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="bg-neutral-800 rounded-xl p-4 mb-2">
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <p className="text-neutral-400 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {languages?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Diller</h2>
                            <div className="bg-neutral-800 rounded-xl p-4">
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm mb-2">
                                        <span>{lang.name}</span>
                                        <span className="text-pink-400">{lang.level}</span>
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
