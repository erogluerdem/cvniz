import { Mail, Phone, MapPin, Scale, Gavel, Award, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react'

export default function LawyerProTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-white text-[#1a1a1a] relative" style={{ fontFamily: "'Playfair Display', serif" }}>
            <div className="relative overflow-hidden min-h-full">
                {/* Decorative border elements */}
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#e5e1da] pointer-events-none" />
                <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-[#f0ede9] pointer-events-none" />

                <div className="relative z-10 p-16">
                    <header className="text-center mb-20">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 border-2 border-[#c5a059] rounded-full flex items-center justify-center relative bg-white overflow-hidden">
                                {personal.photo ? (
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <Scale className="w-10 h-10 text-[#c5a059]" />
                                )}
                                <div className="absolute -inset-2 border border-[#c5a059]/20 rounded-full animate-pulse pointer-events-none" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-black text-[#1a1a1a] tracking-tight mb-4 uppercase leading-none">
                            {personal.fullName}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-[#c5a059]">
                            <div className="h-px w-12 bg-[#c5a059]" />
                            <p className="text-sm font-bold uppercase tracking-[0.4em] italic">{personal.title}</p>
                            <div className="h-px w-12 bg-[#c5a059]" />
                        </div>
                    </header>

                    <div className="grid grid-cols-12 gap-16">
                        <aside className="col-span-4 space-y-12">
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-8 border-b border-[#f0ede9] pb-4">
                                    Official Records
                                </h2>
                                <div className="space-y-6 text-[11px] font-sans font-medium text-[#4a4a4a]">
                                    <div className="flex items-start gap-4">
                                        <Mail className="w-4 h-4 text-[#c5a059] shrink-0" />
                                        <span className="break-all">{personal.email}</span>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                                        <span>{personal.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
                                        <span>{personal.location}</span>
                                    </div>
                                    {personal.linkedin && (
                                        <div className="flex items-start gap-4">
                                            <ShieldCheck className="w-4 h-4 text-[#c5a059] shrink-0" />
                                            <span className="break-all">Verified Profile</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-8 border-b border-[#f0ede9] pb-4">
                                    Legal Expertise
                                </h2>
                                <div className="space-y-4">
                                    {skills.map(s => (
                                        <div key={s} className="flex items-center justify-between group">
                                            <span className="text-[11px] font-sans font-bold text-[#1a1a1a] group-hover:text-[#c5a059] transition-colors">
                                                {s}
                                            </span>
                                            <div className="w-8 h-px bg-[#f0ede9]" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-8 border-b border-[#f0ede9] pb-4">
                                    Academic Record
                                </h2>
                                <div className="space-y-10">
                                    {education.map(edu => (
                                        <div key={edu.id} className="relative pl-6 border-l border-[#c5a059]/30">
                                            <p className="text-[9px] font-sans font-black text-[#c5a059] mb-2">{edu.startDate} — {edu.endDate}</p>
                                            <h4 className="text-xs font-bold text-[#1a1a1a] leading-snug mb-1 italic">{edu.school}</h4>
                                            <p className="text-[10px] font-sans font-medium text-[#7a7a7a] uppercase tracking-wider">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </aside>

                        <main className="col-span-8 space-y-16">
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-10 flex items-center gap-6">
                                    Executive Summary <div className="flex-1 h-px bg-[#f0ede9]" />
                                </h2>
                                <p className="text-lg text-[#4a4a4a] leading-relaxed italic border-l-2 border-[#1a1a1a] pl-10 font-medium">
                                    {personal.summary}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-12 flex items-center gap-6">
                                    Professional Jurisprudence <div className="flex-1 h-px bg-[#f0ede9]" />
                                </h2>
                                <div className="space-y-20">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="relative group">
                                            <div className="flex justify-between items-baseline mb-6 border-b border-[#f0ede9] pb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-[#1a1a1a] tracking-tight group-hover:text-[#c5a059] transition-colors leading-none mb-3 uppercase">
                                                        {exp.position}
                                                    </h3>
                                                    <p className="text-xs font-sans font-black text-[#c5a059] uppercase tracking-[0.2em]">
                                                        {exp.company}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-sans font-black text-[#7a7a7a] uppercase tracking-widest italic pt-1">
                                                    {exp.startDate} :: {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#4a4a4a] leading-[1.8] font-sans font-medium pl-10 border-l border-[#f0ede9] group-hover:border-[#c5a059] transition-all">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </main>
                    </div>

                </div>
            </div>
        </div>
    )
}
