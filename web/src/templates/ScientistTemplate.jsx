import { Mail, Phone, MapPin, FlaskConical, Microscope, BookOpen, Atom, Dna, TestTube } from 'lucide-react'

export default function ScientistTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Scientific Header with DNA-like accent */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800" />

                {/* Decorative scientific elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-10 w-32 h-32 border-4 border-white rounded-full" />
                    <div className="absolute top-12 right-16 w-20 h-20 border-2 border-white rounded-full" />
                    <div className="absolute bottom-4 left-10 w-24 h-24 border-2 border-white rounded-full" />
                </div>

                <div className="relative px-10 py-10">
                    <div className="flex items-center gap-8">
                        {/* Avatar with atom design */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-900/30 ring-4 ring-white/20">
                                <FlaskConical className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                                <Atom className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-white">
                            <h1 className="text-4xl font-bold mb-2 tracking-tight">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-xl text-cyan-300 font-medium mb-4">{personal.title || 'Bilim İnsanı / Araştırmacı'}</p>

                            {/* Contact Pills */}
                            <div className="flex flex-wrap gap-3">
                                {personal.email && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm border border-white/20">
                                        <Mail className="w-4 h-4 text-cyan-400" /> {personal.email}
                                    </span>
                                )}
                                {personal.phone && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm border border-white/20">
                                        <Phone className="w-4 h-4 text-cyan-400" /> {personal.phone}
                                    </span>
                                )}
                                {personal.location && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm border border-white/20">
                                        <MapPin className="w-4 h-4 text-cyan-400" /> {personal.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 grid grid-cols-3 gap-8 -mt-4">
                {/* Left Column - Main Content */}
                <div className="col-span-2 space-y-6">
                    {/* Research Summary */}
                    {personal.summary && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/50 border-l-4 border-gradient-to-b from-cyan-500 to-blue-600" style={{ borderLeftColor: '#0891b2' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <Microscope className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Araştırma Özeti</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-[52px]">{personal.summary}</p>
                        </section>
                    )}

                    {/* Research Experience */}
                    {experience.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/50 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <TestTube className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Araştırma Deneyimi</h2>
                            </div>
                            <div className="space-y-5 pl-[52px]">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-cyan-500/30 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 ring-4 ring-white" />
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-base">{exp.position || 'Araştırmacı'}</h3>
                                                <p className="text-cyan-600 font-medium">{exp.company || 'Kurum'}</p>
                                            </div>
                                            <span className="text-xs text-white bg-gradient-to-r from-indigo-500 to-blue-600 px-3 py-1.5 rounded-full font-medium">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-gray-600 text-sm mt-3 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/50 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Akademik Eğitim</h2>
                            </div>
                            <div className="space-y-4 pl-[52px]">
                                {education.map((edu) => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-emerald-500/30 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 ring-4 ring-white" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-800">{edu.school || 'Üniversite'}</h3>
                                                <p className="text-emerald-600 font-medium">{edu.degree || 'Derece'}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                                                {edu.startDate} - {edu.endDate}
                                            </span>
                                        </div>
                                        {edu.description && (
                                            <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column - Skills & Languages */}
                <div className="space-y-6">
                    {/* Expertise Areas */}
                    {skills.length > 0 && (
                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-5">
                                <Dna className="w-6 h-6 text-cyan-300" />
                                <h2 className="font-bold text-lg">Uzmanlık Alanları</h2>
                            </div>
                            <div className="space-y-3">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm break-inside-avoid page-break-inside-avoid">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                        <span className="text-indigo-100">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Publications Stats (Decorative) */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/50">
                        <h2 className="font-bold text-slate-800 mb-4">Akademik Metrikler</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                                <div className="text-2xl font-bold text-cyan-600">10+</div>
                                <div className="text-xs text-gray-500">Yayın</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                <div className="text-2xl font-bold text-indigo-600">50+</div>
                                <div className="text-xs text-gray-500">Atıf</div>
                            </div>
                        </div>
                    </div>

                    {/* Languages */}
                    {languages?.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-100/50">
                            <h2 className="font-bold text-slate-800 mb-4">Diller</h2>
                            <div className="space-y-3">
                                {languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 font-medium">{lang.name}</span>
                                            <span className="text-cyan-600">{lang.level}</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                                style={{
                                                    width: lang.level?.includes('Ana') ? '100%' :
                                                        lang.level?.includes('İleri') ? '85%' :
                                                            lang.level?.includes('Orta') ? '60%' : '40%'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
