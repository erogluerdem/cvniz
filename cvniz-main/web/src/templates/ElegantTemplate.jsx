import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export default function ElegantTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-stone-50" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {/* Elegant Header with Border Frame */}
            <div className="p-4 md:p-6">
                <div className="border border-stone-300 p-6 relative">
                    {/* Corner Decorations */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-stone-800"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-stone-800"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-stone-800"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-stone-800"></div>

                    <div className="text-center">
                        <h1 className="text-3xl font-normal text-stone-800 mb-1 tracking-widest uppercase">
                            {personal.fullName || 'Ad Soyad'}
                        </h1>
                        <div className="flex items-center justify-center gap-3 my-2">
                            <div className="h-px w-12 bg-stone-300"></div>
                            <span className="text-stone-400 text-lg">✦</span>
                            <div className="h-px w-12 bg-stone-300"></div>
                        </div>
                        <p className="text-base text-stone-600 italic tracking-wide">{personal.title || 'Profesyonel Ünvan'}</p>
                    </div>
                </div>
            </div>

            {/* Contact Info - Elegant Line */}
            <div className="px-8 -mt-4">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-600">
                    {personal.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{personal.email}</span>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{personal.phone}</span>
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{personal.location}</span>
                        </div>
                    )}
                    {personal.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4" />
                            <span>{personal.linkedin}</span>
                        </div>
                    )}
                    {personal.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{personal.website}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 md:px-12 py-6">
                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 text-center max-w-2xl mx-auto break-inside-avoid">
                        <p className="text-base text-stone-600 leading-relaxed italic">
                            "{personal.summary}"
                        </p>
                    </section>
                )}

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200"></div>
                    <span className="text-stone-300 text-base">❧</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200"></div>
                </div>

                {/* Experience */}
                {experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl text-center text-stone-800 mb-6 tracking-widest uppercase">
                            Deneyim
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="text-center break-inside-avoid">
                                    <h3 className="text-lg font-semibold text-stone-800">{exp.position || 'Pozisyon'}</h3>
                                    <p className="text-stone-600 italic text-base">{exp.company || 'Şirket'}</p>
                                    <p className="text-xs text-stone-500 mt-0.5">{exp.startDate} — {exp.endDate}</p>
                                    {exp.description && (
                                        <p className="text-stone-600 mt-2 max-w-2xl mx-auto text-left whitespace-pre-line text-sm">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-4 my-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200"></div>
                    <span className="text-stone-300 text-base">✿</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200"></div>
                </div>

                {/* Education */}
                {education.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl text-center text-stone-800 mb-6 tracking-widest uppercase">
                            Eğitim
                        </h2>
                        <div className="space-y-4 text-center">
                            {education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <h3 className="text-lg font-semibold text-stone-800">{edu.school || 'Okul'}</h3>
                                    <p className="text-stone-600 text-sm italic">{edu.degree || 'Bölüm'}</p>
                                    <p className="text-xs text-stone-500">{edu.startDate} — {edu.endDate}</p>
                                    {edu.description && (
                                        <p className="text-stone-500 text-[11px] mt-1">{edu.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Languages in Columns */}
                <div className="grid grid-cols-2 gap-12 mt-10">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="text-center">
                            <h2 className="text-xl text-stone-800 mb-6 tracking-widest uppercase">Yetenekler</h2>
                            <div className="flex flex-wrap justify-center gap-3">
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 border border-stone-300 text-stone-700 text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {languages?.length > 0 && (
                        <div className="text-center">
                            <h2 className="text-xl text-stone-800 mb-6 tracking-widest uppercase">Diller</h2>
                            <div className="space-y-3">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-center gap-4">
                                        <span className="text-stone-800">{lang.name}</span>
                                        <span className="text-stone-500">—</span>
                                        <span className="text-stone-600 italic">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Decoration */}
            <div className="px-8 pb-8">
                <div className="border-t border-stone-300 pt-4 text-center text-stone-400 text-sm">
                    ✦ ✦ ✦
                </div>
            </div>
        </div>
    )
}
