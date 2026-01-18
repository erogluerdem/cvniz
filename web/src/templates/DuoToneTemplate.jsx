import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function DuoToneTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#0ea5e9'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Skills' : 'Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Hobbies' : 'Hobiler'
    }

    return (
        <div className="min-h-full flex"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Dark Side */}
            <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col">
                {personal.photo && (
                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6">
                        <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale" />
                    </div>
                )}

                <h1 className="text-2xl font-black mb-1 break-words">{personal.fullName || 'İsim'}</h1>
                <p className="text-sky-400 font-medium mb-6">{personal.title || 'Pozisyon'}</p>

                {/* Contact */}
                <div className="space-y-3 text-sm text-slate-300 mb-8">
                    {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-400" /> {personal.email}</div>}
                    {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-sky-400" /> {personal.phone}</div>}
                    {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /> {personal.location}</div>}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.skills}</h3>
                        <div className="space-y-2">
                            {skills.map((skill, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-sky-400 rounded-full" />
                                    <span className="text-sm">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.education}</h3>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <h4 className="font-bold text-sm">{edu.degree}</h4>
                                    <p className="text-slate-400 text-xs">{edu.school}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hobbies */}
                {hobbies?.length > 0 && (
                    <div className="mt-auto">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t.hobbies}</h3>
                        <div className="flex flex-wrap gap-2">
                            {hobbies.map((h) => (
                                <span key={h.id} className="px-2 py-1 bg-slate-800 rounded text-xs">{h.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {theme?.showQrCode && (
                    <div className="mt-6 p-3 bg-white rounded-xl inline-block">
                        <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#0f172a" />
                    </div>
                )}
            </div>

            {/* Light Side */}
            <div className="w-2/3 bg-white text-slate-800 p-8 md:p-10">
                {/* Summary */}
                {personal.summary && (
                    <section className="mb-10 pb-8 border-b border-slate-100">
                        <p className="text-lg leading-relaxed text-slate-600 italic">"{personal.summary}"</p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section className={`mb-10 ${highlightedField === 'experience' ? 'bg-sky-50 p-6 rounded-2xl -m-6' : ''}`}>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-6">{t.experience}</h2>
                        <div className="space-y-8">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold">{exp.position}</h3>
                                            <p className="text-sky-600 font-medium">{exp.company}</p>
                                        </div>
                                        <span className="text-sm text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* References */}
                {references?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-6">{t.references}</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {references.map((ref) => (
                                <div key={ref.id} className="p-4 border border-slate-200 rounded-xl">
                                    <p className="font-bold">{ref.name}</p>
                                    <p className="text-sm text-slate-500">{ref.company}</p>
                                    <p className="text-xs text-sky-600 mt-2">{ref.email}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    )
}

