import { Mail, Phone, MapPin, Database, Server } from 'lucide-react'

export default function DataScienceTemplate({ data }) {
    const { personal, experience, education, skills } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-950 text-white print-exact mx-auto print:mx-0" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <header className="px-10 py-8 border-b border-cyan-500/30">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <Database className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-cyan-400">{personal.title || 'Data Scientist'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                            {personal.email && <span>{personal.email}</span>}
                            {personal.phone && <span>{personal.phone}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-slate-900 rounded-lg p-6 border border-cyan-500/20 break-inside-avoid page-break-inside-avoid">
                            <p className="text-slate-300">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-slate-900 rounded-lg p-6 border border-cyan-500/20 break-inside-avoid page-break-inside-avoid">
                            <h2 className="font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <Server className="w-5 h-5" /> Deneyim
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-2 border-cyan-500 pl-4 break-inside-avoid page-break-inside-avoid">
                                        <h3 className="font-bold">{exp.position}</h3>
                                        <p className="text-purple-400 text-sm">{exp.company}</p>
                                        <p className="text-slate-500 text-sm">{exp.startDate} - {exp.endDate}</p>
                                        {exp.description && <p className="text-slate-500 text-sm mt-2">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-gradient-to-br from-cyan-600 to-purple-600 rounded-lg p-6">
                            <h2 className="font-bold mb-4">Teknolojiler</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-black/30 rounded text-xs">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="bg-slate-900 rounded-lg p-6 border border-cyan-500/20">
                            <h2 className="font-bold text-cyan-400 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3 break-inside-avoid page-break-inside-avoid">
                                    <h3 className="font-semibold">{edu.school}</h3>
                                    <p className="text-slate-500 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
