import { Mail, Phone, MapPin, Linkedin, Globe, Award, TrendingUp, Users } from 'lucide-react'

export default function ExecutiveTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {/* Luxury Header */}
            <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>

                <div className="px-8 md:px-12 py-8 md:py-10">
                    <div className="max-w-4xl mx-auto flex items-center gap-8 md:gap-12">
                        {personal.photo && (
                            <div className="shrink-0">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-amber-400/30 overflow-hidden shadow-2xl relative">
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 border border-amber-400/20 rounded-full pointer-events-none" />
                                </div>
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {personal.fullName || 'Ad Soyad'}
                            </h1>
                            <p className="text-xl text-amber-400 font-light mb-4">{personal.title || 'Executive Position'}</p>

                            {/* Elegant Contact Bar */}
                            <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm text-slate-300">
                                {personal.email && (
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{personal.email}</span>
                                    </div>
                                )}
                                {personal.phone && (
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{personal.phone}</span>
                                    </div>
                                )}
                                {personal.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{personal.location}</span>
                                    </div>
                                )}
                                {personal.linkedin && (
                                    <div className="flex items-center gap-1.5">
                                        <Linkedin className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{personal.linkedin}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-8 md:px-12 py-8 max-w-4xl mx-auto">
                {/* Executive Summary */}
                {personal.summary && (
                    <section className="mb-8 break-inside-avoid">
                        <div className="flex items-center gap-3 mb-3">
                            <Award className="w-5 h-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Yönetici Özeti
                            </h2>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-5">
                            <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line italic" style={{ fontFamily: "Georgia, serif" }}>
                                {personal.summary}
                            </p>
                        </div>
                    </section>
                )}

                {/* Key Achievements - Visual Stats */}
                <section className="mb-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg -mx-4 px-4 break-inside-avoid">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-bold text-amber-600 mb-0.5">10+</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Yıl Deneyim</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-amber-600 mb-0.5">50+</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tamamlanan Proje</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-amber-600 mb-0.5">100+</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Yönetilen Ekip</div>
                        </div>
                    </div>
                </section>

                {/* Professional Experience */}
                {experience.length > 0 && (
                    <section className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-5 h-5 text-amber-600" />
                            <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Profesyonel Deneyim
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="relative break-inside-avoid">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{exp.position || 'Position'}</h3>
                                            <p className="text-base text-amber-600 font-semibold">{exp.company || 'Company'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-0.5 bg-slate-900 text-white text-[11px] rounded tracking-wide font-bold">
                                                {exp.startDate} — {exp.endDate}
                                            </span>
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <div className="text-slate-600 text-sm whitespace-pre-line pl-4 border-l-2 border-slate-100" style={{ fontFamily: "Georgia, serif" }}>
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
