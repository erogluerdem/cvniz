import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MinimalistTemplate({ data, theme }) {
    const { personal, experience, education, skills, languages, customSections } = data

    return (
        <div className="p-10 min-h-full bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header className="text-center mb-10 pb-8 border-b border-gray-200">
                {personal.photo && (
                    <div className="flex justify-center mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 p-1 bg-white shadow-sm">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>
                )}
                <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-wide">
                    {personal.fullName || 'Ad Soyad'}
                </h1>
                <p className="text-lg text-gray-500 mb-6">{personal.title || 'Pozisyon'}</p>

                {/* Contact Info - Horizontal */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
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
            </header>

            {/* Summary */}
            {personal.summary && (
                <section className="mb-10">
                    <p className="text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
                        {personal.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 text-center">
                        İş Deneyimi
                    </h2>
                    <div className="space-y-8">
                        {experience.map((exp) => (
                            <div key={exp.id} className="grid grid-cols-[140px_1fr] gap-6">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">{exp.startDate}</div>
                                    <div className="text-sm text-gray-500">{exp.endDate}</div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{exp.position || 'Pozisyon'}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{exp.company || 'Şirket'}</p>
                                    {exp.description && (
                                        <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 text-center">
                        Eğitim
                    </h2>
                    <div className="space-y-6">
                        {education.map((edu) => (
                            <div key={edu.id} className="grid grid-cols-[140px_1fr] gap-6">
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">{edu.startDate}</div>
                                    <div className="text-sm text-gray-500">{edu.endDate}</div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{edu.school || 'Okul'}</h3>
                                    <p className="text-gray-500 text-sm">{edu.degree || 'Bölüm'}</p>
                                    {edu.description && (
                                        <p className="text-gray-600 text-sm mt-1">{edu.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills & Languages */}
            <section className="grid grid-cols-2 gap-10">
                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
                            Yetenekler
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
                            Diller
                        </h2>
                        <div className="space-y-2">
                            {languages.map((lang, index) => (
                                <div key={index} className="flex justify-between items-center max-w-xs mx-auto">
                                    <span className="text-gray-700">{lang.name}</span>
                                    <span className="text-sm text-gray-500">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Custom Sections */}
            {customSections && customSections.length > 0 && (
                <section className="mt-12 space-y-10 border-t border-gray-100 pt-10">
                    {customSections.map(section => (
                        <div key={section.id}>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 text-center">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto text-center">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {/* Footer QR Code */}
            {theme?.showQrCode && (personal.website || personal.linkedin) && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                    <QRCodeDisplay
                        url={personal.website || personal.linkedin}
                        label={personal.website ? 'Web Sitesi' : 'LinkedIn Profili'}
                    />
                </div>
            )}
        </div>
    )
}
