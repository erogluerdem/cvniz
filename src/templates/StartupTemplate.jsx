import { Mail, Phone, MapPin, Rocket, Lightbulb, Zap, TrendingUp } from 'lucide-react'

export default function StartupTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-gradient-to-br from-violet-950 to-indigo-950 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Startup Header */}
            <header className="px-10 py-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-violet-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-500 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                    <Rocket className="w-16 h-16 mx-auto mb-4 text-violet-400" />
                    <h1 className="text-4xl font-bold mb-2">{personal.fullName || 'Ad Soyad'}</h1>
                    <p className="text-violet-300 text-xl">{personal.title || 'Startup Kurucusu'}</p>
                    <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-violet-300">
                        {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 px-8 -mt-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400">$1M+</div>
                    <div className="text-violet-300 text-sm">Fonlama</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-pink-400">3</div>
                    <div className="text-violet-300 text-sm">Startup Kurdum</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-violet-400">50+</div>
                    <div className="text-violet-300 text-sm">Ekip Üyesi</div>
                </div>
            </div>

            <div className="px-8 pb-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="text-lg font-bold text-violet-300 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5" /> Vizyon
                            </h2>
                            <p className="text-violet-100 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="text-lg font-bold text-violet-300 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" /> Girişimlerim
                            </h2>
                            <div className="space-y-5">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-2 border-violet-500 pl-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-white">{exp.position}</h3>
                                            <span className="text-sm text-violet-400">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-pink-400">{exp.company}</p>
                                        {exp.description && <p className="text-violet-200 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl p-6">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Yetenekler
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="font-bold text-violet-300 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="font-semibold text-white">{edu.school}</h3>
                                    <p className="text-violet-400 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h2 className="font-bold text-violet-300 mb-4">Diller</h2>
                            {languages.map((lang, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2">
                                    <span className="text-white">{lang.name}</span>
                                    <span className="text-violet-400">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
