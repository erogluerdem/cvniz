import { Mail, Phone, MapPin, Linkedin, Globe, Heart, Stethoscope, Award } from 'lucide-react'

export default function HealthcareTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-teal-50 to-cyan-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header with Medical Theme */}
            <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                        <Stethoscope className="w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{personal.fullName || 'Dr. Ad Soyad'}</h1>
                        <p className="text-teal-100 text-lg">{personal.title || 'Uzman Hekim'}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-teal-100">
                            {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                            {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 grid grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-500 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-teal-700 mb-3 flex items-center gap-2">
                                <Heart className="w-5 h-5" /> Profesyonel Özet
                            </h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5" /> Klinik Deneyim
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-2 border-teal-200 pl-4 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                                                <p className="text-teal-600">{exp.company}</p>
                                            </div>
                                            <span className="text-sm text-gray-500 bg-teal-50 px-3 py-1 rounded-full h-fit">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-teal-700 mb-4">Eğitim & Uzmanlık</h2>
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id} className="flex justify-between items-start break-inside-avoid page-break-inside-avoid">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                            <p className="text-teal-600">{edu.degree}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-teal-600 text-white rounded-xl p-6">
                            <h2 className="font-bold mb-4">Uzmanlık Alanları</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 break-inside-avoid page-break-inside-avoid">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                        <span className="text-sm">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-teal-700 mb-4">Diller</h2>
                            <div className="space-y-2">
                                {languages.map((lang, i) => (
                                    <div key={i} className="flex justify-between text-sm break-inside-avoid page-break-inside-avoid">
                                        <span className="text-gray-700">{lang.name}</span>
                                        <span className="text-teal-600">{lang.level}</span>
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
