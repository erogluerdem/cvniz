import { Mail, Phone, MapPin, Leaf, TreePine } from 'lucide-react'

export default function EnvironmentTemplate({ data }) {
    const { personal, experience, education, skills } = data

    return (
        <div className="min-h-full bg-emerald-50" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="bg-gradient-to-r from-emerald-700 to-green-700 text-white px-10 py-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                        <TreePine className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-emerald-100">{personal.title || 'Çevre Mühendisi'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-emerald-100">
                            {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-emerald-500">
                            <h2 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                                <Leaf className="w-5 h-5" /> Vizyon
                            </h2>
                            <p className="text-gray-600">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="font-bold text-emerald-800 mb-4">Deneyim</h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-2 border-emerald-300 pl-4">
                                        <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                        <p className="text-emerald-600">{exp.company}</p>
                                        <p className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate}</p>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-emerald-700 text-white rounded-lg p-6">
                            <h2 className="font-bold mb-4">Uzmanlık Alanları</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="text-sm">🌱 {skill}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="font-bold text-emerald-800 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="font-semibold">{edu.school}</h3>
                                    <p className="text-emerald-600 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
