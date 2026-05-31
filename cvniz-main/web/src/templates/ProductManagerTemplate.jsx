import { Mail, Phone, MapPin, Layout, Layers, Award, Briefcase, GraduationCap, LineChart } from 'lucide-react'

export default function ProductManagerTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-slate-100 p-12" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col min-h-[1000px]">
                <header className="bg-slate-900 p-16 text-white text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-10">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roadmap Driven Portfolio</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase leading-none">{personal.fullName}</h1>
                    <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-sm">{personal.title}</p>

                    <div className="mt-12 w-full max-w-lg h-px bg-white/10" />

                    <div className="mt-8 flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" /> {personal.email}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-500" /> {personal.phone}</div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> {personal.location}</div>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
                    <div className="col-span-8 p-16 space-y-20 border-r border-slate-100">
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-300 mb-8 tracking-[0.3em] flex items-center gap-4">
                                <LineChart className="w-5 h-5 text-blue-600" /> STRATEGIC VISION
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                {personal.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-300 mb-12 tracking-[0.3em] flex items-center gap-4">
                                <Layers className="w-5 h-5 text-blue-600" /> PRODUCT EXPERIENCE
                            </h2>
                            <div className="space-y-16">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-black text-slate-900 mb-2">{exp.position}</h3>
                                                <p className="text-blue-600 font-bold text-xs uppercase tracking-wide">{exp.company}</p>
                                            </div>
                                            <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-xl border border-slate-100 italic">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="col-span-4 p-12 space-y-16 bg-slate-50/20">
                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-400 mb-8">TOOLKIT</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => <span key={s} className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-[10px] font-black border border-slate-200 shadow-sm">{s}</span>)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-black uppercase text-slate-400 mb-8">FORMATION</h2>
                            <div className="space-y-8">
                                {education.map(edu => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-slate-200">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-600" />
                                        <h4 className="text-xs font-black text-slate-900 leading-snug mb-1 uppercase tracking-tight">{edu.school}</h4>
                                        <p className="text-blue-600 text-[10px] font-bold uppercase mb-2">{edu.degree}</p>
                                        <p className="text-slate-400 text-[9px] font-bold italic">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-200 mt-20">
                            <Layout className="w-8 h-8 mb-4 text-blue-200" />
                            <h3 className="font-black text-xs uppercase mb-2 italic">Product Mindset</h3>
                            <p className="text-[10px] opacity-70 leading-relaxed font-medium">Delivering user value through iterative growth and data insights.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
