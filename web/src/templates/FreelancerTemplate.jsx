import { Mail, Phone, MapPin, Briefcase, Clock, CheckCircle, Star } from 'lucide-react'

export default function FreelancerTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-lime-50 to-green-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Freelancer Header */}
            <header className="bg-gradient-to-r from-lime-600 to-green-600 text-white px-10 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                            {personal.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'FL'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-lime-100">{personal.title || 'Freelance Uzman'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-lime-100 mb-1">
                            <CheckCircle className="w-5 h-5" />
                            <span>Müsait</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-lime-100">
                    {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 px-8 -mt-6">
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-lime-600">100+</div>
                    <div className="text-gray-500 text-xs">Proje</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-green-600">5+</div>
                    <div className="text-gray-500 text-xs">Yıl Deneyim</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-lime-600">98%</div>
                    <div className="text-gray-500 text-xs">Memnuniyet</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <div className="text-2xl font-bold text-green-600">24h</div>
                    <div className="text-gray-500 text-xs">Yanıt</div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-lime-700 mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5" /> Hakkımda
                            </h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-lime-700 mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5" /> Proje Deneyimi
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-4 border-lime-400 pl-4 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                            <span className="text-sm text-lime-600">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-green-600">{exp.company}</p>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-lime-600 text-white rounded-xl p-6">
                            <h2 className="font-bold mb-4">Hizmetlerim</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm break-inside-avoid page-break-inside-avoid">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-lime-700 mb-4">Eğitim & Sertifika</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3 break-inside-avoid page-break-inside-avoid">
                                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                    <p className="text-green-600 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-lime-700 mb-4">Diller</h2>
                            {languages.map((lang, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid page-break-inside-avoid">
                                    <span>{lang.name}</span>
                                    <span className="text-green-600">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
