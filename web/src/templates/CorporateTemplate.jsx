import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CorporateTemplate({ data, theme }) {
    const { personal, experience, education, skills, languages, customSections } = data

    return (
        <div className="min-h-full bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-10 py-10">
                <div className="flex items-center gap-8">
                    {/* Avatar/Photo */}
                    {personal.photo ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-lg bg-white/10 flex items-center justify-center text-3xl font-bold border-2 border-white/20 shrink-0">
                            {personal.fullName ? personal.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CV'}
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-1">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-indigo-200 text-lg mb-4">{personal.title || 'Pozisyon'}</p>

                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            {personal.email && (
                                <div className="flex items-center gap-2 text-indigo-200">
                                    <Mail className="w-4 h-4" />
                                    <span>{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-center gap-2 text-indigo-200">
                                    <Phone className="w-4 h-4" />
                                    <span>{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-center gap-2 text-indigo-200">
                                    <MapPin className="w-4 h-4" />
                                    <span>{personal.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-10">
                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-indigo-600">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3">
                            Profesyonel Özet
                        </h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {personal.summary}
                        </p>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - Experience & Education */}
                    <div className="col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-600">
                                    İş Deneyimi
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{exp.position || 'Pozisyon'}</h3>
                                                    <p className="text-indigo-600 font-medium">{exp.company || 'Şirket'}</p>
                                                </div>
                                                <span className="text-sm text-white bg-indigo-600 px-3 py-1 rounded-full">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-gray-600 text-sm whitespace-pre-line pl-4 border-l-2 border-gray-200">
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
                                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-600">
                                    Eğitim
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{edu.school || 'Okul'}</h3>
                                                <p className="text-indigo-600">{edu.degree || 'Bölüm'}</p>
                                                {edu.description && (
                                                    <p className="text-gray-600 text-sm mt-1">{edu.description}</p>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                                {edu.startDate} - {edu.endDate}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Skills, Languages, Links */}
                    <div className="space-y-8">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="bg-gray-50 rounded-lg p-5">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">
                                    Uzmanlık Alanları
                                </h2>
                                <div className="space-y-2">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                            <span className="text-gray-700 text-sm">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <section className="bg-gray-50 rounded-lg p-5">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">
                                    Dil Becerileri
                                </h2>
                                <div className="space-y-3">
                                    {languages.map((lang, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{lang.name}</span>
                                                <span className="text-gray-500">{lang.level}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                    style={{
                                                        width: lang.level?.includes('Ana') ? '100%' :
                                                            lang.level?.includes('İleri') ? '85%' :
                                                                lang.level?.includes('Orta') ? '60%' : '40%'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Links */}
                        {(personal.linkedin || personal.website) && (
                            <section className="bg-gray-50 rounded-lg p-5">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">
                                    Bağlantılar
                                </h2>
                                <div className="space-y-2 text-sm">
                                    {personal.linkedin && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Linkedin className="w-4 h-4 text-indigo-600" />
                                            <span className="break-all">{personal.linkedin}</span>
                                        </div>
                                    )}
                                    {personal.website && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Globe className="w-4 h-4 text-indigo-600" />
                                            <span className="break-all">{personal.website}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections in Sidebar */}
                        {customSections && customSections.map(section => (
                            <section key={section.id} className="bg-gray-50 rounded-lg p-5">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4">
                                    {section.title}
                                </h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </p>
                            </section>
                        ))}

                        {/* QR Code */}
                        {theme?.showQrCode && (personal.website || personal.linkedin) && (
                            <section className="bg-gray-50 rounded-lg p-5 flex justify-center">
                                <QRCodeDisplay
                                    url={personal.website || personal.linkedin}
                                    label={personal.website ? 'Web Sitesi' : 'LinkedIn Profili'}
                                />
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
