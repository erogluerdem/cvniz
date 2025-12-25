import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export default function ModernTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="flex min-h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <div className="w-[35%] bg-gradient-to-b from-cyan-600 to-blue-700 text-white p-6">
                {/* Profile Section */}
                <div className="text-center mb-8">
                    <div className="w-28 h-28 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
                        {personal.fullName ? personal.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CV'}
                    </div>
                    <h1 className="text-xl font-bold mb-1">{personal.fullName || 'Ad Soyad'}</h1>
                    <p className="text-cyan-200 text-sm">{personal.title || 'Pozisyon'}</p>
                </div>

                {/* Contact Info */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-white/50"></div>
                        İletişim
                    </h2>
                    <div className="space-y-3 text-sm">
                        {personal.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-cyan-200" />
                                <span className="break-all">{personal.email}</span>
                            </div>
                        )}
                        {personal.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-cyan-200" />
                                <span>{personal.phone}</span>
                            </div>
                        )}
                        {personal.location && (
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-cyan-200" />
                                <span>{personal.location}</span>
                            </div>
                        )}
                        {personal.linkedin && (
                            <div className="flex items-center gap-3">
                                <Linkedin className="w-4 h-4 text-cyan-200" />
                                <span className="break-all text-xs">{personal.linkedin}</span>
                            </div>
                        )}
                        {personal.website && (
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-cyan-200" />
                                <span className="break-all text-xs">{personal.website}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-white/50"></div>
                            Yetenekler
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-white/20 rounded text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {languages?.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-white/50"></div>
                            Diller
                        </h2>
                        <div className="space-y-2 text-sm">
                            {languages.map((lang, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{lang.name}</span>
                                    <span className="text-cyan-200 text-xs">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-[65%] p-8 bg-white">
                {/* Summary */}
                {personal.summary && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-cyan-500">
                            Hakkımda
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {personal.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">
                            İş Deneyimi
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-cyan-500"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{exp.position || 'Pozisyon'}</h3>
                                            <p className="text-cyan-600 text-sm">{exp.company || 'Şirket'}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">
                            Eğitim
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200">
                                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-cyan-500"></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{edu.school || 'Okul'}</h3>
                                            <p className="text-cyan-600 text-sm">{edu.degree || 'Bölüm'}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                    {edu.description && (
                                        <p className="text-gray-600 text-sm mt-1">{edu.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
