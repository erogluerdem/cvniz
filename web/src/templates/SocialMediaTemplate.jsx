import { Mail, Phone, MapPin, Share2, Instagram, Award, Briefcase, GraduationCap, MessageSquare } from 'lucide-react'

export default function SocialMediaTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-slate-100 p-0 sm:p-8 flex justify-center py-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl overflow-hidden flex flex-col border border-slate-100">
                <header className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-12 text-white text-center">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-3xl mx-auto mb-10 border border-white/30 flex items-center justify-center rotate-6 shadow-2xl overflow-hidden">
                        <div className="text-4xl font-black -rotate-6">
                            {personal.fullName?.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{personal.fullName}</h1>
                    <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                        <Instagram className="w-4 h-4" />
                        <p className="text-sm font-bold uppercase tracking-[0.2em]">{personal.title}</p>
                    </div>
                </header>

                <div className="p-12 grid grid-cols-12 gap-10">
                    <div className="col-span-8">
                        <section className="mb-20">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center gap-4">
                                ABOUT ME <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <p className="text-xl font-bold text-slate-800 leading-tight mb-8">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-12 flex items-center gap-4">
                                CONTENT STRATEGY <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="space-y-16">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-12">
                                        <div className="absolute left-0 top-0 w-8 h-8 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-100">
                                            <Share2 className="w-4 h-4 text-pink-500" />
                                        </div>
                                        <div className="flex justify-between items-baseline mb-4">
                                            <h3 className="text-xl font-black text-slate-900 leading-none">{exp.position}</h3>
                                            <span className="text-[10px] font-black text-pink-500 bg-pink-50 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm mb-6">{exp.company}</p>
                                        <p className="text-slate-600 leading-relaxed font-medium">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-span-4 space-y-16">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-8">CONTACT</h2>
                            <div className="space-y-5 text-sm font-bold text-slate-500">
                                <div className="flex items-center gap-4"><Mail className="w-5 h-5 text-slate-900" /> {personal.email}</div>
                                <div className="flex items-center gap-4"><Phone className="w-5 h-5 text-slate-900" /> {personal.phone}</div>
                                <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-slate-900" /> {personal.location}</div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-8">CHANNELS</h2>
                            <div className="flex flex-wrap gap-3">
                                {skills.map(s => <span key={s} className="px-4 py-2 bg-slate-50 text-slate-800 rounded-2xl text-[10px] font-black border border-slate-100 hover:scale-105 transition-transform cursor-default">{s}</span>)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-8">FORMATION</h2>
                            <div className="space-y-8">
                                {education.map(edu => (
                                    <div key={edu.id}>
                                        <p className="text-[10px] font-black text-pink-500 mb-2">{edu.startDate} - {edu.endDate}</p>
                                        <h4 className="font-black text-slate-900 text-sm leading-snug">{edu.school}</h4>
                                        <p className="text-slate-500 text-xs font-bold italic mt-1">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-8 bg-slate-900 rounded-3xl text-white">
                            <MessageSquare className="w-8 h-8 mb-4 text-pink-500" />
                            <h3 className="font-black text-xs uppercase mb-2">Social Native</h3>
                            <p className="text-[10px] opacity-50 font-medium">Trends change, fundamentals stay.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
