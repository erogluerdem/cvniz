import { Mail, Phone, MapPin, Dumbbell, Heart, Award, Briefcase, GraduationCap, Zap } from 'lucide-react'

export default function FitnessTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-zinc-950 text-white p-12" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="max-w-4xl mx-auto border-2 border-orange-500 rounded-[48px] p-12 relative overflow-hidden bg-zinc-900 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 relative z-10">
                    <div>
                        <h1 className="text-6xl font-black italic tracking-tighter text-white mb-2 uppercase">
                            {personal.fullName?.split(' ')[0]} <br />
                            <span className="text-orange-500">{personal.fullName?.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-xl font-bold italic text-zinc-400 uppercase tracking-widest">{personal.title}</p>
                    </div>
                    <div className="bg-zinc-800 p-8 rounded-3xl border border-zinc-700">
                        <div className="space-y-4 text-sm font-bold">
                            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-orange-500" /> {personal.email}</div>
                            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-orange-500" /> {personal.phone}</div>
                            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-orange-500" /> {personal.location}</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    <div className="md:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-3xl font-black italic uppercase text-orange-500 mb-8 border-l-8 border-orange-500 pl-6">Vizyon</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed font-medium">{personal.summary}</p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-black italic uppercase text-orange-500 mb-8 border-l-8 border-orange-500 pl-6">Kariyer Maratonu</h2>
                            <div className="space-y-12">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-8 border-l border-zinc-700">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]" />
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl font-bold uppercase">{exp.position}</h3>
                                            <span className="text-xs font-black bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700 text-orange-500">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 font-bold mb-4">{exp.company}</p>
                                        <p className="text-zinc-400 leading-relaxed italic">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-xl font-black italic uppercase text-white mb-8">Güç Alanları</h2>
                            <div className="space-y-4">
                                {skills.map(s => (
                                    <div key={s} className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-black uppercase">
                                            <span>{s}</span>
                                            <span className="text-orange-500">MAX</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 w-full shadow-[0_0_15px_#f97316]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-black italic uppercase text-white mb-8">Eğitim</h2>
                            <div className="space-y-8">
                                {education.map(edu => (
                                    <div key={edu.id} className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
                                        <h4 className="font-bold text-white mb-1">{edu.school}</h4>
                                        <p className="text-orange-500 text-xs font-black uppercase mb-1">{edu.degree}</p>
                                        <p className="text-zinc-500 text-[10px] font-bold">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
