import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Terminal, Code, Hash } from 'lucide-react'

export default function BrutalismWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white" style={{ fontFamily: "'Space Mono', monospace" }}>

            {/* BRUTAL NAV */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl">
                            {personal.fullName?.charAt(0)}
                        </div>
                        <span className="font-black text-lg uppercase tracking-tight hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-black uppercase hover:underline underline-offset-4 decoration-4 hidden lg:block">About</a>
                        <a href="#work" className="text-xs font-black uppercase hover:underline underline-offset-4 decoration-4 hidden lg:block">Work</a>
                        <a href="#skills" className="text-xs font-black uppercase hover:underline underline-offset-4 decoration-4 hidden lg:block">Skills</a>
                        <a href={`mailto:${personal.email}`} className="px-6 py-3 bg-black text-white text-xs font-black uppercase hover:bg-white hover:text-black border-4 border-black transition-all">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="min-h-screen flex items-center justify-center pt-20 px-6 border-b-4 border-black">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <div className="mb-8">
                            <span className="inline-block px-4 py-2 bg-black text-white text-xs font-black uppercase mb-4">{personal.title}</span>
                        </div>
                        <h1 className="text-[15vw] md:text-[12vw] font-black uppercase leading-[0.85] tracking-tighter mb-8">
                            {personal.fullName?.split(' ').map((word, i) => (
                                <span key={i} className="block hover:italic transition-all cursor-default">{word}</span>
                            ))}
                        </h1>
                        <div className="grid md:grid-cols-2 gap-8 mt-16">
                            <div className="border-4 border-black p-8">
                                <h3 className="text-xs font-black uppercase mb-4 border-b-2 border-black pb-2">Bio</h3>
                                <p className="text-lg leading-relaxed">{personal.summary}</p>
                            </div>
                            <div className="border-4 border-black p-8 bg-black text-white">
                                <h3 className="text-xs font-black uppercase mb-4 border-b-2 border-white pb-2">Contact</h3>
                                <div className="space-y-3 text-sm">
                                    {personal.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4" />{personal.email}</div>}
                                    {personal.phone && <div className="flex items-center gap-3"><Phone className="w-4 h-4" />{personal.phone}</div>}
                                    {personal.location && <div className="flex items-center gap-3"><MapPin className="w-4 h-4" />{personal.location}</div>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="work" className="py-32 px-6 border-b-4 border-black">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-6xl font-black uppercase mb-20">Work<br />Experience</h2>
                    <div className="space-y-0">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="border-4 border-black p-8 -mt-1 hover:bg-black hover:text-white transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase">{exp.position}</h3>
                                        <p className="text-lg font-bold mt-2">{exp.company}</p>
                                    </div>
                                    <span className="text-sm font-mono mt-2 md:mt-0 px-4 py-2 border-2 border-current">{exp.startDate} — {exp.endDate}</span>
                                </div>
                                <p className="text-base leading-relaxed mt-4">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="py-32 px-6 bg-black text-white border-b-4 border-black">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-6xl font-black uppercase mb-20">Skills &<br />Tools</h2>
                    <div className="flex flex-wrap gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                viewport={{ once: true }}
                                className="px-6 py-4 border-4 border-white text-sm font-black uppercase hover:bg-white hover:text-black transition-all cursor-default"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section id="education" className="py-32 px-6 border-b-4 border-black">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-6xl font-black uppercase mb-20">Education</h2>
                    <div className="grid md:grid-cols-2 gap-0">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="border-4 border-black p-8 -m-[2px] hover:bg-black hover:text-white transition-all"
                            >
                                <div className="text-xs font-mono mb-4">{edu.startDate} — {edu.endDate}</div>
                                <h4 className="text-2xl font-black uppercase mb-2">{edu.school}</h4>
                                <p className="text-base">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-16 px-6 bg-black text-white">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black uppercase mb-2">Let's Talk</h3>
                        <p className="text-white/50 text-sm font-mono">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-14 h-14 border-4 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <Icon className="w-6 h-6" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
