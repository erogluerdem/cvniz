import { Mail, Phone, MapPin, ChefHat, Utensils } from 'lucide-react'

export default function ChefTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-stone-100" style={{ fontFamily: 'Playfair Display, serif' }}>
            <header className="bg-gradient-to-r from-red-900 to-red-800 text-white px-10 py-8 relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                </div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <ChefHat className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-red-200 text-lg italic">{personal.title || 'Executive Chef'}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-red-100">
                            {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {personal.summary && (
                        <section className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-800">
                            <h2 className="font-bold text-red-900 mb-3 italic">Mutfak Felsefem</h2>
                            <p className="text-gray-600 leading-relaxed">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                                <Utensils className="w-5 h-5" /> Profesyonel Deneyim
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-2 border-red-200 pl-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold text-gray-800">{exp.position}</h3>
                                            <span className="text-sm text-red-600">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-red-700 italic">{exp.company}</p>
                                        {exp.description && <p className="text-gray-600 text-sm mt-2">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <div className="bg-red-900 text-white rounded-lg p-6">
                            <h2 className="font-bold mb-4 italic">Uzmanlık Alanları</h2>
                            <div className="space-y-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="text-sm text-red-100">★ {skill}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="font-bold text-red-900 mb-4">Eğitim & Sertifikalar</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="font-semibold text-gray-800">{edu.school}</h3>
                                    <p className="text-red-600 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
