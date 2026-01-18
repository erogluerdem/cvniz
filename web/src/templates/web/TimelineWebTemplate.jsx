import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Calendar, Clock, Circle, ArrowDown } from 'lucide-react'

export default function TimelineWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100" style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl px-8 py-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-800 hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors hidden lg:block">Başlangıç</a>
                        <a href="#timeline" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors hidden lg:block">Zaman Çizelgesi</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors hidden lg:block">Yetenekler</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-8">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" />{personal.location}</div>}
                        </div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mt-20"
                        >
                            <ArrowDown className="w-6 h-6 text-blue-600 mx-auto" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* TIMELINE SECTION */}
            <section id="timeline" className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Zaman Çizelgesi</h2>

                    {/* Vertical Timeline */}
                    <div className="relative">
                        {/* Central Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-slate-200" />

                        {/* Experience Items */}
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex ${i % 2 === 0 ? 'justify-end pr-[52%]' : 'justify-start pl-[52%]'} mb-16`}
                            >
                                {/* Dot on timeline */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />

                                {/* Content card */}
                                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all max-w-md group border border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">{exp.position}</h3>
                                    <p className="text-blue-600 font-medium text-sm mb-4">{exp.company}</p>
                                    <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Education Items */}
                        {education.map((edu, i) => (
                            <motion.div
                                key={`edu-${i}`}
                                initial={{ opacity: 0, x: (experience.length + i) % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex ${(experience.length + i) % 2 === 0 ? 'justify-end pr-[52%]' : 'justify-start pl-[52%]'} mb-16`}
                            >
                                {/* Dot on timeline */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-lg" />

                                {/* Content card */}
                                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all max-w-md group border border-slate-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">{edu.school}</h3>
                                    <p className="text-indigo-600 font-medium text-sm">{edu.degree}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Yetenekler</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-default"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Geleceği Birlikte Yazalım</h3>
                        <p className="text-slate-400 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all">
                                <Icon className="w-5 h-5 text-slate-400" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
