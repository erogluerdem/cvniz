import { Mail, Phone, MapPin, Linkedin, Globe, Code, Terminal, GitBranch } from 'lucide-react'

export default function TechTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-slate-900 text-gray-100" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {/* Terminal-style Header */}
            <header className="bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-slate-400 ml-4">~/cv/{personal.fullName?.toLowerCase().replace(/\s+/g, '-') || 'developer'}.md</span>
                </div>

                <div className="px-8 py-8">
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                        <Terminal className="w-4 h-4" />
                        <span>$ cat profile.json</span>
                    </div>

                    <div className="pl-4 border-l-2 border-green-500">
                        <h1 className="text-3xl font-bold text-cyan-400 mb-1">
                            {personal.fullName || 'Developer Name'}
                        </h1>
                        <p className="text-xl text-purple-400 mb-4">{personal.title || 'Full Stack Developer'}</p>

                        {/* Contact as JSON-like format */}
                        <div className="text-sm space-y-1 text-slate-300">
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
            </header>

            {/* Main Content */}
            <div className="p-8">
                {/* Summary as Comment */}
                {personal.summary && (
                    <section className="mb-8">
                        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                            <div className="text-slate-500 text-sm mb-2">/** README.md */</div>
                            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                                {personal.summary}
                            </p>
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - Experience & Education */}
                    <div className="col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <GitBranch className="w-5 h-5 text-green-400" />
                                    <h2 className="text-lg font-bold text-green-400">git log --experience</h2>
                                </div>
                                <div className="space-y-4">
                                    {experience.map((exp, index) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-slate-700">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900"></div>

                                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-yellow-400 font-bold">{exp.position || 'Position'}</span>
                                                        <span className="text-slate-500"> @ </span>
                                                        <span className="text-cyan-400">{exp.company || 'Company'}</span>
                                                    </div>
                                                    <code className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">
                                                        {exp.startDate}..{exp.endDate}
                                                    </code>
                                                </div>
                                                {exp.description && (
                                                    <pre className="text-slate-400 text-sm whitespace-pre-line font-sans">
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
                                <div className="flex items-center gap-2 mb-4">
                                    <Code className="w-5 h-5 text-purple-400" />
                                    <h2 className="text-lg font-bold text-purple-400">education.forEach()</h2>
                                </div>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-yellow-400">{edu.school || 'School'}</span>
                                                    <span className="text-slate-500"> :: </span>
                                                    <span className="text-cyan-400">{edu.degree || 'Degree'}</span>
                                                </div>
                                                <code className="text-xs text-slate-400">[{edu.startDate}-{edu.endDate}]</code>
                                            </div>
                                            {edu.description && (
                                                <p className="text-slate-400 text-sm mt-2 font-sans">{edu.description}</p>
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
                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="text-green-400 text-sm mb-3">$ npm list --skills</div>
                                <div className="space-y-1">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <span className="text-slate-500">├──</span>
                                            <span className="text-cyan-400">{skill.toLowerCase().replace(/\s+/g, '-')}</span>
                                            <span className="text-slate-600">@latest</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="text-purple-400 text-sm mb-3">const languages = {"{"}</div>
                                <div className="pl-4 space-y-1">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="text-sm">
                                            <span className="text-cyan-400">{lang.name}</span>
                                            <span className="text-slate-500">: </span>
                                            <span className="text-green-400">"{lang.level}"</span>
                                            {index < languages.length - 1 && <span className="text-slate-500">,</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-purple-400 text-sm mt-1">{"}"}</div>
                            </div>
                        )}

                        {/* Links */}
                        {(personal.linkedin || personal.website) && (
                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="text-yellow-400 text-sm mb-3">// Links</div>
                                <div className="space-y-2 text-sm">
                                    {personal.linkedin && (
                                        <div className="flex items-center gap-2">
                                            <Linkedin className="w-4 h-4 text-blue-400" />
                                            <span className="text-slate-400 break-all">{personal.linkedin}</span>
                                        </div>
                                    )}
                                    {personal.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-green-400" />
                                            <span className="text-slate-400 break-all">{personal.website}</span>
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
