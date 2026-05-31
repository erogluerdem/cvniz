import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, FileText, Paperclip, Stamp, PenTool, BookOpen, Star, Briefcase, Calendar, MapPin } from 'lucide-react'

export default function PaperWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#b45309' // amber-700
    const bgColor = colors.bg || '#fffbeb' // amber-50
    const textColor = colors.text || '#1f2937' // gray-800

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: bgColor, color: textColor, fontFamily: styles.fontFamily || "'Merriweather', serif" }}>
            {/* Paper Texture Overlay */}
            <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            {/* Tape Decorations */}
            <div className="fixed top-0 left-20 w-8 h-24 bg-yellow-200/60 rotate-12 shadow-lg hidden lg:block" />
            <div className="fixed top-0 right-40 w-8 h-20 bg-amber-300/50 -rotate-6 shadow-lg hidden lg:block" />
            <div className="fixed bottom-20 left-40 w-6 h-16 bg-orange-200/50 rotate-45 shadow-lg hidden lg:block" />

            {/* Header - Letterhead Style */}
            <header className="pt-12 pb-8 px-6 border-b-2 border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {personal?.fullName}
                            </h1>
                            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mt-2">{personal?.title}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600 space-y-1">
                            {personal?.location && <div className="flex items-center justify-end gap-2"><MapPin className="w-4 h-4" /> {personal?.location}</div>}
                            {personal?.email && <div className="flex items-center justify-end gap-2"><Mail className="w-4 h-4" /> {personal?.email}</div>}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Document Style */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Summary - Typewriter Style */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Stamp className="w-8 h-8 text-red-700" />
                        <h2 className="text-2xl font-bold uppercase tracking-widest">Professional Summary</h2>
                    </div>
                    <div className="pl-12 border-l-4 border-gray-300">
                        <p className="text-xl leading-relaxed" style={{ color: `${textColor}CC`, fontFamily: styles.fontFamily || "'Courier New', monospace" }}>
                            {personal?.summary}
                        </p>
                    </div>
                </motion.section>

                {/* Experience - Resume Style */}
                {experience?.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <Briefcase className="w-8 h-8 text-amber-700" />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Work Experience</h2>
                        </div>

                        <div className="space-y-12 pl-12 border-l-4 border-gray-300">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[2.65rem] w-4 h-4 rounded-full border-4" style={{ backgroundColor: accentColor, borderColor: bgColor }} />

                                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 relative">
                                        {/* Paper Clip */}
                                        <div className="absolute -top-4 right-8 text-gray-400">
                                            <Paperclip className="w-8 h-8 rotate-45" />
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold">{exp.position}</h3>
                                                <p className="text-lg font-medium" style={{ color: accentColor }}>{exp.company}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full self-start">
                                                <Calendar className="w-4 h-4" />
                                                {exp.startDate} — {exp.endDate || 'Present'}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Skills - Handwritten Labels */}
                {skills?.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <PenTool className="w-8 h-8 text-blue-700" />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Skills & Expertise</h2>
                        </div>

                        <div className="flex flex-wrap gap-4 pl-12">
                            {skills.map((skill, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 3 : -3 }}
                                    className="px-6 py-3 bg-white border-2 font-bold shadow-lg cursor-default"
                                    style={{
                                        borderColor: textColor,
                                        fontFamily: "'Patrick Hand', cursive, sans-serif",
                                        transform: `rotate(${(i % 5 - 2) * 2}deg)`
                                    }}
                                >
                                    {skill.name || skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <BookOpen className="w-8 h-8 text-green-700" />
                            <h2 className="text-2xl font-bold uppercase tracking-widest">Education</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pl-12">
                            {education.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
                                >
                                    <div className="text-sm text-gray-500 mb-2">{edu.year || edu.startDate}</div>
                                    <h3 className="text-xl font-bold mb-1">{edu.school || edu.institution}</h3>
                                    <p className="font-medium" style={{ color: accentColor }}>{edu.degree || edu.field}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </main>

            {/* Footer - Signature Style */}
            <footer className="border-t-2 border-gray-800 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">Let's Connect</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Available for Opportunities
                        </h2>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="inline-flex items-center gap-4 px-10 py-5 text-white font-bold text-lg transition-all"
                            style={{ backgroundColor: textColor }}
                        >
                            <Mail className="w-5 h-5" /> Contact Me
                        </a>

                        <div className="mt-16 pt-8 border-t border-gray-300 flex justify-center gap-12 text-sm text-gray-500">
                            {personal?.linkedin && <a href={personal.linkedin} className="hover:text-gray-800 transition-colors flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</a>}
                            {personal?.github && <a href={personal.github} className="hover:text-gray-800 transition-colors flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</a>}
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
