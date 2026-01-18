import { Mail, Phone, MapPin, Cpu, Database, Award, Briefcase, GraduationCap, Hexagon, Terminal, Activity, ShieldCheck } from 'lucide-react'

export default function BlockchainTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-[#0a0f12] text-slate-300 relative overflow-hidden" style={{ fontFamily: "'Space Mono', monospace" }}>
            <div className="border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.05)] relative min-h-full flex flex-col">
                {/* Background Tech UI Elements */}
                <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-emerald-500 rounded-full" />
                    <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] border border-emerald-500 rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] border border-emerald-500 rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col min-h-[900px]">
                    <header className="p-16 border-b border-emerald-500/10 bg-[#0d1317]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-8">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Block_Height // Node_Active</span>
                                </div>
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase leading-none">
                                    {personal.fullName}
                                </h1>
                                <p className="text-emerald-500 text-sm font-bold uppercase tracking-[0.5em] flex items-center gap-4">
                                    {personal.title} <div className="w-12 h-px bg-emerald-500/30" />
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center justify-center w-32 h-32 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl backdrop-blur-sm overflow-hidden relative group">
                                <Hexagon className="w-24 h-24 text-emerald-500 animate-[spin_30s_linear_infinite] opacity-30 absolute" />
                                {personal.photo ? (
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover relative z-10" />
                                ) : (
                                    <Cpu className="w-10 h-10 text-emerald-500 relative z-10" />
                                )}
                            </div>
                        </div>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-emerald-500/5 pt-12">
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 border border-emerald-500/10 rounded-lg group-hover:border-emerald-500/30 transition-all">
                                    <Mail className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="group-hover:text-emerald-500 transition-colors">{personal.email}</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 border border-emerald-500/10 rounded-lg group-hover:border-emerald-500/30 transition-all">
                                    <Phone className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="group-hover:text-emerald-500 transition-colors uppercase">Secure_Line: {personal.phone?.slice(-4)}</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-2 border border-emerald-500/10 rounded-lg group-hover:border-emerald-500/30 transition-all">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                </div>
                                <span className="group-hover:text-emerald-500 transition-colors">{personal.location}</span>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 grid grid-cols-12">
                        <aside className="col-span-4 p-12 bg-[#0d1317]/50 border-r border-emerald-500/5 space-y-16">
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/50 mb-10 flex items-center gap-3">
                                    <Terminal className="w-3 h-3" /> Technical_Stack
                                </h2>
                                <div className="space-y-4">
                                    {skills.map(s => (
                                        <div key={s} className="group flex flex-col gap-2">
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <span>{s}</span>
                                                <span className="text-emerald-500">Verified</span>
                                            </div>
                                            <div className="h-0.5 bg-slate-900 w-full overflow-hidden">
                                                <div className="h-full bg-emerald-500/30 w-full group-hover:bg-emerald-500 group-hover:shadow-[0_0_10px_#10b981] transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/50 mb-10 flex items-center gap-3">
                                    <Activity className="w-3 h-3" /> Consensus_Log
                                </h2>
                                <div className="space-y-8">
                                    {education.map(edu => (
                                        <div key={edu.id} className="relative pl-6 border-l border-emerald-500/20 group hover:border-emerald-500 transition-colors">
                                            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-900 border border-emerald-500 group-hover:bg-emerald-500 group-hover:shadow-[0_0_10px_#10b981] transition-all" />
                                            <p className="text-[9px] font-black text-slate-500 mb-2 uppercase">{edu.startDate} :: {edu.endDate}</p>
                                            <h4 className="text-xs font-black text-white uppercase leading-tight mb-1">{edu.school}</h4>
                                            <p className="text-emerald-500 text-[9px] font-bold italic tracking-wider">{edu.degree}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="p-8 border border-emerald-500/10 rounded-2xl bg-emerald-500/5">
                                <ShieldCheck className="w-8 h-8 mb-4 text-emerald-500 opacity-50" />
                                <h3 className="text-[10px] font-black uppercase text-white mb-2">Immutable_Record</h3>
                                <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">Verified by distributed ledger consensus mechanisms.</p>
                            </div>
                        </aside>

                        <main className="col-span-8 p-16 space-y-20 bg-[#0a0f12]">
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/30 mb-8 flex items-center gap-4">
                                    Protocol_Abstract <div className="flex-1 h-px bg-emerald-500/5" />
                                </h2>
                                <div className="relative p-10 bg-[#0d1317] border-l-4 border-emerald-500 group">
                                    <Terminal className="absolute top-4 right-4 w-6 h-6 text-emerald-500/10 group-hover:text-emerald-500/30 transition-all" />
                                    <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
                                        {personal.summary}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/30 mb-12 flex items-center gap-4">
                                    Transaction_History <div className="flex-1 h-px bg-emerald-500/5" />
                                </h2>
                                <div className="space-y-16">
                                    {experience.map(exp => (
                                        <div key={exp.id} className="relative group">
                                            <div className="flex justify-between items-baseline mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-emerald-500 transition-colors italic">
                                                        {exp.position}
                                                    </h3>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 bg-[#0d1317] px-4 py-2 border border-emerald-500/10 rounded uppercase">
                                                    Hash_{exp.startDate?.slice(-4)} :: {exp.endDate?.slice(-4)}
                                                </span>
                                            </div>
                                            <div className="pl-6 border-l border-emerald-500/5 group-hover:border-emerald-500/20 transition-all">
                                                <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                                    Platform_{exp.company} <div className="h-px w-8 bg-emerald-500/20" />
                                                </p>
                                                <p className="text-slate-500 text-sm leading-[1.8] font-medium bg-[#0d1317]/30 p-8 rounded-xl border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
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
        </div>
    )
}
