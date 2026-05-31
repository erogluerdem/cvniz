import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, BarChart3, PieChart, TrendingUp, Activity, Database, Cpu } from 'lucide-react'

export default function DataVizWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0f172a]" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0' }}>

            {/* DATA VIZ BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Animated data points */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                        className="absolute w-2 h-2 rounded-full bg-emerald-500"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                    />
                ))}

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                    {[...Array(10)].map((_, i) => (
                        <motion.line
                            key={i}
                            x1={`${Math.random() * 100}%`}
                            y1={`${Math.random() * 100}%`}
                            x2={`${Math.random() * 100}%`}
                            y2={`${Math.random() * 100}%`}
                            stroke="#10b981"
                            strokeWidth="1"
                            animate={{ opacity: [0.1, 0.5, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </svg>
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-lg px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <Database className="w-5 h-5 text-slate-900" />
                        </div>
                        <div className="hidden md:block">
                            <span className="font-bold text-white text-sm">{personal.fullName}</span>
                            <div className="text-[10px] text-emerald-500">● ONLINE</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors hidden lg:block">dashboard</a>
                        <a href="#metrics" className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors hidden lg:block">metrics</a>
                        <a href="#skills" className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors hidden lg:block">analytics</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-emerald-500 rounded-lg text-xs font-bold text-slate-900 hover:bg-emerald-400 transition-all">
                            connect()
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO - DASHBOARD */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {/* Stats cards */}
                            {[
                                { label: 'Experience', value: `${experience.length}+`, icon: Briefcase, color: 'emerald' },
                                { label: 'Skills', value: skills.length, icon: Cpu, color: 'blue' },
                                { label: 'Education', value: education.length, icon: GraduationCap, color: 'purple' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</span>
                                        <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                                    </div>
                                    <div className="text-4xl font-bold text-white">{stat.value}</div>
                                    <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                            className={`h-full bg-${stat.color}-500`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm text-slate-400">user.profile</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                {personal.fullName}
                            </h1>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">{personal.title}</span>
                            </div>
                            <p className="text-slate-400 max-w-2xl leading-relaxed">
                                {personal.summary}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {personal.email && (
                                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm text-slate-400 truncate">{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-slate-400">{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-slate-400">{personal.location}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* METRICS - EXPERIENCE */}
            <section id="metrics" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-white">experience.timeline()</h2>
                    </div>
                    <div className="space-y-6">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{exp.position}</h3>
                                        <p className="text-emerald-500 text-sm">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono mt-2 md:mt-0 bg-slate-700/50 px-3 py-1 rounded">{exp.startDate} → {exp.endDate}</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ANALYTICS - SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-white">skills.analyze()</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex items-center justify-between group hover:border-emerald-500/50 transition-all"
                            >
                                <span className="text-sm text-slate-300">{skill}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${70 + Math.random() * 30}%` }}
                                            className="h-full bg-emerald-500"
                                        />
                                    </div>
                                    <span className="text-xs text-emerald-500 font-mono">{Math.floor(70 + Math.random() * 30)}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <PieChart className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-2xl font-bold text-white">education.query()</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                            >
                                <div className="text-xs text-slate-500 font-mono mb-2">{edu.startDate} → {edu.endDate}</div>
                                <h4 className="text-lg font-bold text-white mb-2">{edu.school}</h4>
                                <p className="text-blue-400 text-sm">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-slate-800">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <div className="text-xs text-slate-500 font-mono mb-2">// ready to connect</div>
                        <p className="text-slate-400 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-all">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
