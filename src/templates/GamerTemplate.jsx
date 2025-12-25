import { Mail, Phone, MapPin, Gamepad2, Joystick } from 'lucide-react'

export default function GamerTemplate({ data }) {
    const { personal, experience, education, skills } = data

    return (
        <div className="min-h-full bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="px-10 py-8 text-center relative">
                <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-3xl"></div>
                <div className="relative z-10">
                    <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                    <h1 className="text-4xl font-bold mb-2">{personal.fullName || 'Ad Soyad'}</h1>
                    <p className="text-purple-300">{personal.title || 'E-Spor Oyuncusu'}</p>
                    <div className="flex justify-center flex-wrap gap-6 mt-4 text-sm text-gray-400">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                    </div>
                </div>
            </header>

            <div className="px-10 py-8 grid grid-cols-2 gap-6">
                <div className="space-y-6">
                    {personal.summary && (
                        <section className="bg-white/5 rounded-xl p-6 border border-purple-500/30">
                            <p className="text-gray-300">{personal.summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section className="bg-white/5 rounded-xl p-6 border border-purple-500/30">
                            <h2 className="font-bold text-pink-400 mb-4 flex items-center gap-2">
                                <Joystick className="w-5 h-5" /> Takım & Turnuva
                            </h2>
                            <div className="space-y-4">
                                {experience.map((exp) => (
                                    <div key={exp.id}>
                                        <h3 className="font-bold">{exp.position}</h3>
                                        <p className="text-purple-400 text-sm">{exp.company}</p>
                                        <p className="text-gray-500 text-xs">{exp.startDate} - {exp.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    {skills.length > 0 && (
                        <section className="bg-gradient-to-br from-pink-600/50 to-purple-600/50 rounded-xl p-6 border border-pink-500/30">
                            <h2 className="font-bold mb-4">Oyunlar & Roller</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-black/30 rounded-full text-sm">🎮 {skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section className="bg-white/5 rounded-xl p-6 border border-purple-500/30">
                            <h2 className="font-bold text-pink-400 mb-4">Eğitim</h2>
                            {education.map((edu) => (
                                <div key={edu.id} className="mb-3">
                                    <h3 className="font-semibold">{edu.school}</h3>
                                    <p className="text-gray-400 text-sm">{edu.degree}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
