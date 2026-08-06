import { Mail, Phone, MapPin, Megaphone, Target, Lightbulb, TrendingUp } from 'lucide-react'

export default function MarketingTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-fuchsia-50 to-violet-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Vibrant Marketing Header */}
            <header className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white px-10 py-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <Megaphone className="w-10 h-10" />
                        <div>
                            <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-fuchsia-200">{personal.title || 'Pazarlama Uzmanı'}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-fuchsia-100">
                        {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </div>
            </header>

            <div className="p-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 -mt-12 mb-8 relative z-10">
                    <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <div className="text-3xl font-bold text-fuchsia-600">150%</div>
                        <div className="text-gray-500 text-sm">ROI Artışı</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <div className="text-3xl font-bold text-violet-600">500K+</div>
                        <div className="text-gray-500 text-sm">Ulaşılan Kitle</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <div className="text-3xl font-bold text-indigo-600">50+</div>
                        <div className="text-gray-500 text-sm">Kampanya</div>
                    </div>
                </div>

                {personal.summary && (
                    <section className="mb-8 bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                        <h2 className="text-lg font-bold text-fuchsia-700 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" /> Hakkımda
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        {experience.length > 0 && (
                            <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-lg font-bold text-fuchsia-700 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Deneyim
                                </h2>
                                <div className="space-y-5">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-4 border-fuchsia-400 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                                <span className="text-sm text-fuchsia-600">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-violet-600">{exp.company}</p>
                                            {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-lg font-bold text-fuchsia-700 mb-4">Eğitim</h2>
                                {education.map((edu) => (
                                    <div key={edu.id} className="mb-3 break-inside-avoid page-break-inside-avoid">
                                        <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                        <p className="text-violet-600">{edu.degree}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    <div className="space-y-6">
                        {skills.length > 0 && (
                            <div className="bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white rounded-xl p-6">
                                <h2 className="font-bold mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Yetenekler
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-bold text-fuchsia-700 mb-4">Diller</h2>
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid page-break-inside-avoid">
                                        <span>{lang.name}</span>
                                        <span className="text-violet-600">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
