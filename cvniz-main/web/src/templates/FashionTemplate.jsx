import { Mail, Phone, MapPin, Instagram, Globe, Award, Briefcase, GraduationCap, Camera, Scissors } from 'lucide-react'

export default function FashionTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-white text-black py-20 px-16" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <div className="flex flex-col min-h-full theme-fashion-content">
                {/* Visual Header - High Contrast & Minimal */}
                <header className="mb-32 flex flex-col items-center border-b border-black pb-20">
                    <div className="flex items-center gap-12 mb-16">
                        <div className="w-[1px] h-20 bg-black opacity-10" />
                        <h1 className="text-7xl font-light tracking-[0.2em] uppercase leading-none text-center">
                            {personal.fullName?.split(' ').map((n, i) => (
                                <span key={i} className={i % 2 === 0 ? "font-light" : "font-black italic block"}>
                                    {n}
                                </span>
                            ))}
                        </h1>
                        {personal.photo ? (
                            <div className="w-48 h-64 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden border border-black/5">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
                            </div>
                        ) : (
                            <div className="w-[1px] h-20 bg-black opacity-10" />
                        )}
                    </div>

                    <p className="text-sm font-bold uppercase tracking-[0.6em] text-center mb-12">
                        {personal.title}
                    </p>

                    <div className="flex gap-16 text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">
                        <div className="flex items-center gap-3">
                            <Mail className="w-3 h-3" />
                            {personal.email}
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-3 h-3" />
                            {personal.phone}
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-3 h-3" />
                            {personal.location}
                        </div>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-12 gap-24">
                    {/* Artistic Sidebar */}
                    <aside className="col-span-4 space-y-24">
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] mb-12 flex flex-col items-center">
                                <Scissors className="w-5 h-5 mb-4 opacity-20" />
                                Aesthetic_Core
                            </h2>
                            <div className="space-y-6">
                                {skills.map(s => (
                                    <div key={s} className="group overflow-hidden">
                                        <p className="text-xl font-light italic mb-2 group-hover:pl-4 transition-all duration-500">{s}</p>
                                        <div className="w-full h-[1px] bg-black/5" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] mb-12 text-center">
                                Curated_Studies
                            </h2>
                            <div className="space-y-12">
                                {education.map(edu => (
                                    <div key={edu.id} className="text-center group">
                                        <p className="text-[10px] uppercase tracking-widest opacity-30 mb-3 italic">{edu.startDate} — {edu.endDate}</p>
                                        <h4 className="text-lg font-bold uppercase leading-tight mb-2 group-hover:tracking-wider transition-all duration-700">{edu.school}</h4>
                                        <p className="text-xs font-light italic opacity-60 underline underline-offset-4 decoration-black/10">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-20 p-10 border border-black/5 text-center flex flex-col items-center">
                            <Instagram className="w-8 h-8 mb-6 opacity-20" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed opacity-40">
                                Global Stylist Identity<br />Verified Portfolio Portfolio 2024
                            </p>
                        </div>
                    </aside>

                    {/* Editorial Content */}
                    <main className="col-span-8 space-y-32">
                        <section>
                            <div className="relative mb-20 italic">
                                <span className="absolute top-[-40px] left-[-40px] text-[120px] font-black text-black/5 leading-none select-none italic">"</span>
                                <p className="text-3xl font-light leading-[1.6] text-black pr-12 relative z-10 italic">
                                    {personal.summary}
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] mb-16 flex items-center gap-6">
                                Editorial_Timeline <div className="flex-1 h-[1px] bg-black/10" />
                            </h2>
                            <div className="space-y-24">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative group">
                                        <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
                                            <div>
                                                <h3 className="text-3xl font-light uppercase tracking-tighter group-hover:italic transition-all duration-500">
                                                    {exp.position}
                                                </h3>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-3 opacity-50">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest italic opacity-20 border border-black/10 px-4 py-2 mb-2">
                                                {exp.startDate} :: {exp.endDate}
                                            </span>
                                        </div>
                                        <div className="pl-12 border-l border-black/5 group-hover:border-black transition-all duration-700">
                                            <p className="text-lg text-black/60 leading-[1.8] font-light max-w-xl italic">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>

            </div>
        </div>
    )
}
