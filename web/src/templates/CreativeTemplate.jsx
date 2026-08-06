import { Mail, Phone, MapPin, Linkedin, Globe, Palette } from 'lucide-react'

export default function CreativeTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-rose-50 via-purple-50 to-cyan-50 print-exact mx-auto print:mx-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Creative Header with Diagonal Design */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 transform -skew-y-6 origin-top-left scale-110"></div>
                <div className="relative px-10 py-12 text-white">
                    <div className="flex items-center gap-8">
                        {/* Creative Avatar/Photo */}
                        {personal.photo ? (
                            <div className="w-28 h-28 rounded-2xl overflow-hidden rotate-3 shadow-xl border-4 border-white shrink-0">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-black rotate-3 shadow-xl border-4 border-white/30 shrink-0">
                                {personal.fullName ? personal.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '✦'}
                            </div>
                        )}

                        <div>
                            <h1 className="text-4xl font-black mb-2 drop-shadow-lg">
                                {personal.fullName || 'Ad Soyad'}
                            </h1>
                            <p className="text-xl font-light text-white/90 mb-3">{personal.title || 'Pozisyon'}</p>

                            {/* Contact Pills */}
                            <div className="flex flex-wrap gap-2">
                                {personal.email && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                                        <Mail className="w-3 h-3" /> {personal.email}
                                    </span>
                                )}
                                {personal.phone && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                                        <Phone className="w-3 h-3" /> {personal.phone}
                                    </span>
                                )}
                                {personal.location && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                                        <MapPin className="w-3 h-3" /> {personal.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-10 py-8 -mt-8">
                {/* Summary Card */}
                {personal.summary && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-gradient-to-b from-purple-500 to-pink-500" style={{ borderLeftColor: '#a855f7' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Palette className="w-5 h-5 text-purple-500" />
                            <h2 className="font-bold text-gray-800">Hakkımda</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {personal.summary}
                        </p>
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-5 gap-8">
                    {/* Left Column - Experience & Education */}
                    <div className="col-span-3 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-6">
                                    💼 İş Deneyimi
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp, index) => (
                                        <div
                                            key={exp.id}
                                            className="relative bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow break-inside-avoid page-break-inside-avoid"
                                            style={{
                                                borderLeft: `4px solid ${index % 2 === 0 ? '#a855f7' : '#ec4899'}`
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{exp.position || 'Pozisyon'}</h3>
                                                    <p className="text-purple-600 font-medium">{exp.company || 'Şirket'}</p>
                                                </div>
                                                <span className="text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full font-medium">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-gray-600 text-sm whitespace-pre-line mt-3">
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
                            <section>
                                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 mb-6">
                                    🎓 Eğitim
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div
                                            key={edu.id}
                                            className="bg-white rounded-xl shadow-lg p-5 border-l-4 break-inside-avoid page-break-inside-avoid"
                                            style={{ borderLeftColor: '#06b6d4' }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{edu.school || 'Okul'}</h3>
                                                    <p className="text-cyan-600">{edu.degree || 'Bölüm'}</p>
                                                    {edu.description && (
                                                        <p className="text-gray-500 text-sm mt-1">{edu.description}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Skills & Languages */}
                    <div className="col-span-2 space-y-6">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
                                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    ⚡ Yetenekler
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
                                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    🌍 Diller
                                </h2>
                                <div className="space-y-3">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between items-center break-inside-avoid page-break-inside-avoid">
                                            <span className="font-medium">{lang.name}</span>
                                            <span className="text-sm bg-white/20 px-2 py-0.5 rounded">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {(personal.linkedin || personal.website) && (
                            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-dashed border-purple-200">
                                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    🔗 Bağlantılar
                                </h2>
                                <div className="space-y-2 text-sm">
                                    {personal.linkedin && (
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <Linkedin className="w-4 h-4" />
                                            <span className="break-all">{personal.linkedin}</span>
                                        </div>
                                    )}
                                    {personal.website && (
                                        <div className="flex items-center gap-2 text-pink-600">
                                            <Globe className="w-4 h-4" />
                                            <span className="break-all">{personal.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
