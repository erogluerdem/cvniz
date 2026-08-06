import { Mail, Phone, MapPin, Linkedin, Globe, Code, Terminal, GitBranch } from 'lucide-react'

export default function TechTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-900 text-gray-100 print-exact mx-auto print:mx-0" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {/* Terminal-style Header */}
            <header className="bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2 px-4 py-1.5 border-b border-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-slate-500 ml-3">~/cv/{personal.fullName?.toLowerCase().replace(/\s+/g, '-') || 'developer'}.md</span>
                </div>

                <div className="px-6 md:px-8 py-6">
                    <div className="flex items-center gap-6 md:gap-8">
                        {personal.photo && (
                            <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-slate-700 p-1 bg-slate-900 shadow-xl">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-md grayscale hover:grayscale-0 transition-all duration-500" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-green-400 text-[11px] mb-1.5">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>$ cat profile.json</span>
                            </div>

                            <div className="pl-4 border-l-2 border-green-500">
                                <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-0.5">
                                    {personal.fullName || 'Developer Name'}
                                </h1>
                                <p className="text-lg text-purple-400 mb-3">{personal.title || 'Full Stack Developer'}</p>

                                {/* Contact as JSON-like format */}
                                <div className="text-[11px] space-y-0.5 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">{"{"}</span>
                                    </div>
                                    {personal.email && (
                                        <div className="pl-4">
                                            <span className="text-cyan-400">"email"</span>
                                            <span className="text-slate-500">: </span>
                                            <span className="text-green-400">"{personal.email}"</span>
                                            <span className="text-slate-500">,</span>
                                        </div>
                                    )}
                                    {personal.phone && (
                                        <div className="pl-4">
                                            <span className="text-cyan-400">"phone"</span>
                                            <span className="text-slate-500">: </span>
                                            <span className="text-green-400">"{personal.phone}"</span>
                                            <span className="text-slate-500">,</span>
                                        </div>
                                    )}
                                    {personal.location && (
                                        <div className="pl-4">
                                            <span className="text-cyan-400">"location"</span>
                                            <span className="text-slate-500">: </span>
                                            <span className="text-green-400">"{personal.location}"</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500">{"}"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-6 md:p-8">
                {/* Summary as Comment */}
                {personal.summary && (
                    <section className="mb-8 break-inside-avoid">
                        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                            <div className="text-slate-500 text-[11px] mb-1.5">/** README.md */</div>
                            <p className="text-slate-500 text-sm whitespace-pre-line leading-relaxed italic">
                                {personal.summary}
                            </p>
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column - Experience & Education */}
                    <div className="col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4 break-inside-avoid">
                                    <GitBranch className="w-4 h-4 text-green-400" />
                                    <h2 className="text-base font-bold text-green-400 uppercase tracking-tight">git log --experience</h2>
                                </div>
                                <div className="space-y-6">
                                    {experience.map((exp, index) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-slate-800 break-inside-avoid">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900 shadow-lg shadow-green-500/20"></div>

                                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-green-500/30 transition-colors">
                                                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                    <div>
                                                        <span className="text-yellow-400 font-bold text-sm md:text-base">{exp.position || 'Position'}</span>
                                                        <span className="text-slate-500"> @ </span>
                                                        <span className="text-cyan-400 text-sm md:text-base">{exp.company || 'Company'}</span>
                                                    </div>
                                                    <code className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700/50">
                                                        {exp.startDate}..{exp.endDate}
                                                        CodeMarkdownLanguage: "jsx",
                                                        Instructions: "Compact TechTemplate and add page-break controls."
                                                        ,
                                                    </code>
                                                </div>
                                                {exp.description && (
                                                    <pre className="text-slate-500 text-[12px] whitespace-pre-line font-sans leading-relaxed">
                                                        {exp.description}
                                                    </pre>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4 break-inside-avoid">
                                    <Code className="w-4 h-4 text-purple-400" />
                                    <h2 className="text-base font-bold text-purple-400 uppercase tracking-tight">education.forEach()</h2>
                                </div>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 break-inside-avoid">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <span className="text-yellow-400 text-sm md:text-base">{edu.school || 'School'}</span>
                                                    <span className="text-slate-500"> :: </span>
                                                    <span className="text-cyan-400 text-sm md:text-base">{edu.degree || 'Degree'}</span>
                                                </div>
                                                <code className="text-[10px] text-slate-500">[{edu.startDate}-{edu.endDate}]</code>
                                            </div>
                                            {edu.description && (
                                                <p className="text-slate-500 text-[12px] mt-2 font-sans italic">{edu.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Skills as npm packages */}
                        {skills.length > 0 && (
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 break-inside-avoid">
                                <div className="text-green-400 text-[11px] mb-3 font-bold">$ npm list --skills</div>
                                <div className="space-y-0.5">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2 text-[11px] break-inside-avoid page-break-inside-avoid">
                                            <span className="text-slate-600">├──</span>
                                            <span className="text-cyan-400 uppercase tracking-tighter">{skill.toLowerCase().replace(/\s+/g, '-')}</span>
                                            <span className="text-slate-600">@stable</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 break-inside-avoid">
                                <div className="text-purple-400 text-[11px] mb-3 font-bold">const languages = {"{"}</div>
                                <div className="pl-4 space-y-1">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="text-[11px] break-inside-avoid page-break-inside-avoid">
                                            <span className="text-cyan-400">"{lang.name}"</span>
                                            <span className="text-slate-500">: </span>
                                            <span className="text-green-400">"{lang.level}"</span>
                                            {index < languages.length - 1 && <span className="text-slate-500">,</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-purple-400 text-[11px] mt-1 font-bold">{"}"}</div>
                            </div>
                        )}

                        {/* Links */}
                        {(personal.linkedin || personal.website) && (
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 break-inside-avoid">
                                <div className="text-yellow-400 text-[11px] mb-3 font-bold">// Links</div>
                                <div className="space-y-2 text-[11px]">
                                    {personal.linkedin && (
                                        <div className="flex items-center gap-2">
                                            <Linkedin className="w-3.5 h-3.5 text-blue-500/70" />
                                            <span className="text-slate-500 break-all">{personal.linkedin}</span>
                                        </div>
                                    )}
                                    {personal.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-green-500/70" />
                                            <span className="text-slate-500 break-all">{personal.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
