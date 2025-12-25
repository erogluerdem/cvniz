import { Mail, Phone, MapPin, Linkedin, Globe, Award, TrendingUp, Users } from 'lucide-react'

export default function ExecutiveTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {/* Luxury Header */}
            <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>

                <div className="px-12 py-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl font-bold mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {personal.fullName || 'Ad Soyad'}
                        </h1>
                        <p className="text-2xl text-amber-400 font-light mb-6">{personal.title || 'Executive Position'}</p>

                        {/* Elegant Contact Bar */}
                        <div className="flex flex-wrap gap-8 text-sm text-slate-300">
                            {personal.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-amber-400" />
                                    <span>{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-amber-400" />
                                    <span>{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-amber-400" />
                                    <span>{personal.location}</span>
                                </div>
                            )}
                            {personal.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 text-amber-400" />
                                    <span>{personal.linkedin}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-12 py-10 max-w-4xl mx-auto">
                {/* Executive Summary */}
                {personal.summary && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-6 h-6 text-amber-600" />
                            <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Yönetici Özeti
                            </h2>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-6">
                            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line italic" style={{ fontFamily: "Georgia, serif" }}>
                                {personal.summary}
                            </p>
                        </div>
                    </section>
                )}

                {/* Key Achievements - Visual Stats */}
                <section className="mb-10 py-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg -mx-6 px-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-4xl font-bold text-amber-600 mb-1">10+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider">Yıl Deneyim</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-amber-600 mb-1">50+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider">Tamamlanan Proje</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-amber-600 mb-1">100+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider">Yönetilen Ekip</div>
                        </div>
                    </div>
                </section>

                {/* Professional Experience */}
                {experience.length > 0 && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-6 h-6 text-amber-600" />
                            <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Profesyonel Deneyim
                            </h2>
                        </div>
                        <div className="space-y-8">
                            {experience.map((exp) => (
                                <div key={exp.id} className="relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{exp.position || 'Position'}</h3>
                                            <p className="text-lg text-amber-600 font-semibold">{exp.company || 'Company'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-4 py-1 bg-slate-900 text-white text-sm rounded">
                                                {exp.startDate} — {exp.endDate}
                                            </span>
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <div className="text-slate-600 whitespace-pre-line pl-4 border-l-2 border-slate-200" style={{ fontFamily: "Georgia, serif" }}>
                                            {exp.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Two Column Footer */}
                <div className="grid grid-cols-2 gap-10">
                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="w-5 h-5 text-amber-600" />
                                <h2 className="text-xl font-bold text-slate-800">Eğitim</h2>
                            </div>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold text-slate-800">{edu.school || 'School'}</h3>
                                        <p className="text-amber-600">{edu.degree || 'Degree'}</p>
                                        <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills & Languages */}
                    <section>
                        {skills.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Uzmanlık Alanları</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-slate-900 text-white text-sm rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">Diller</h2>
                                <div className="space-y-2">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-slate-700">{lang.name}</span>
                                            <span className="text-amber-600">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
