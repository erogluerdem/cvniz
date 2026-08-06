import { Mail, Phone, MapPin, ShoppingBag, Star, Users, Award } from 'lucide-react'

export default function RetailTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-rose-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Retail Header */}
            <header className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-rose-100">{personal.title || 'Satış Uzmanı'}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-rose-100">
                    {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>
            </header>

            {/* Achievement Cards */}
            <div className="grid grid-cols-3 gap-4 px-8 -mt-6">
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <Star className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-rose-600">₺5M+</div>
                    <div className="text-gray-500 text-sm">Toplam Satış</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <Users className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-pink-600">10K+</div>
                    <div className="text-gray-500 text-sm">Müşteri</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                    <Award className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-rose-600">#1</div>
                    <div className="text-gray-500 text-sm">Satış Temsilcisi</div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-rose-700 mb-3">Hakkımda</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-xl p-6 shadow-sm break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-lg font-bold text-rose-700 mb-4">İş Deneyimi</h2>
                            <div className="space-y-5">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-4 border-rose-400 pl-4 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                            <span className="text-sm text-rose-600">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-pink-600">{exp.company}</p>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-rose-600 text-white rounded-xl p-6">
                            <h2 className="font-bold mb-4">Satış Becerileri</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 break-inside-avoid page-break-inside-avoid">
                                        <Star className="w-3 h-3" />
                                        <span className="text-sm">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-rose-700 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3 break-inside-avoid page-break-inside-avoid">
                                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                    <p className="text-rose-600 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {languages?.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-rose-700 mb-4">Diller</h2>
                            {languages.map((lang, i) => (
                                <div key={i} className="flex justify-between text-sm mb-2 break-inside-avoid page-break-inside-avoid">
                                    <span>{lang.name}</span>
                                    <span className="text-rose-600">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
