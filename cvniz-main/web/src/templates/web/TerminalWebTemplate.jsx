import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, Sparkles, Star, Award, Briefcase, MapPin, Terminal, Code, Cpu, Database, Server, Wifi, ChevronRight } from 'lucide-react'

export default function TerminalWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#00FF00'
    const bgColor = colors.bg || '#000000'
    const textColor = colors.text || '#00FF00'
    const terminalSlug = personal?.fullName ? personal.fullName.toLowerCase().replace(/\s+/g, '-') : 'terminal-user'

    return (
        <div className="min-h-screen relative overflow-hidden font-mono" style={{ backgroundColor: bgColor, color: textColor, fontFamily: styles.fontFamily || "'Fira Code', monospace" }}>
            {/* CRT Scanlines */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${accentColor} 2px, ${accentColor} 4px)`
            }} />

            {/* CRT Flicker */}
            <motion.div
                animate={{ opacity: [1, 0.98, 1, 0.99, 1] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="fixed inset-0 pointer-events-none z-40"
            />

            {/* Terminal Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: `${bgColor}F2`, borderColor: `${accentColor}80` }}>
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-sm opacity-60">terminal@{terminalSlug}</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs">
                        <a href="#about" className="hover:text-white transition-colors">$ whoami</a>
                        <a href="#experience" className="hover:text-white transition-colors">$ history</a>
                        <a href="#skills" className="hover:text-white transition-colors">$ skills --list</a>
                    </div>
                </div>
            </header>

            {/* Terminal Hero */}
            <section id="about" className="min-h-screen flex items-center pt-20 px-6">
                <div className="max-w-4xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Command Line */}
                        <div className="flex items-center gap-3">
                            <span style={{ color: `${accentColor}CC` }}>$</span>
                            <span className="text-white">whoami</span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                style={{ backgroundColor: accentColor }}
                                className="w-3 h-6"
                            />
                        </div>

                        {/* Output */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="pl-8 space-y-6"
                        >
                            <div className="text-6xl md:text-8xl font-bold text-white leading-none tracking-tighter">
                                {personal?.fullName}
                            </div>
                            <div className="text-2xl" style={{ color: `${accentColor}E6` }}>
                                &gt;&gt; {personal?.title}
                            </div>
                            <pre className="text-sm opacity-60 leading-relaxed max-w-2xl whitespace-pre-wrap">
                                {`/**
 * ${personal?.summary}
 */`}
                            </pre>
                        </motion.div>

                        {/* System Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="pl-8 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t"
                            style={{ borderColor: `${accentColor}4D` }}
                        >
                            {[
                                { label: 'Experience', value: `${experience?.length || 0}+ years` },
                                { label: 'Skills', value: `${skills?.length || 0} loaded` },
                                { label: 'Status', value: 'AVAILABLE' },
                                { label: 'Location', value: personal?.location || 'Remote' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-xs uppercase" style={{ color: `${accentColor}CC` }}>{item.label}:</div>
                                    <div className="text-white font-bold">{item.value}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Action */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="pl-8 pt-8"
                        >
                            <a
                                href={`mailto:${personal?.email}`}
                                className="inline-flex items-center gap-3 px-8 py-4 font-bold rounded-lg transition-all"
                                style={{ backgroundColor: accentColor, color: bgColor }}
                            >
                                <Terminal className="w-5 h-5" /> $ contact --send-email
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Experience */}
            {experience?.length > 0 && (
                <section id="experience" className="py-32 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-12">
                            <span style={{ color: `${accentColor}CC` }}>$</span>
                            <span className="text-white">history --career</span>
                        </div>

                        <div className="space-y-6 pl-8">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 border rounded-lg transition-all group"
                                    style={{ borderColor: `${accentColor}4D`, backgroundColor: `${accentColor}0D` }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="text-2xl font-bold" style={{ color: textColor }}>{exp.position}</div>
                                            <div style={{ color: `${accentColor}E6` }}>@ {exp.company}</div>
                                        </div>
                                        <div className="text-xs px-3 py-1 rounded font-bold" style={{ backgroundColor: `${accentColor}4D` }}>
                                            {exp.startDate} - {exp.endDate || 'PRESENT'}
                                        </div>
                                    </div>
                                    <pre className="text-sm opacity-60 whitespace-pre-wrap">
                                        // {exp.description}
                                    </pre>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section id="skills" className="py-32 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-12">
                            <span style={{ color: `${accentColor}CC` }}>$</span>
                            <span className="text-white">skills --list --verbose</span>
                        </div>

                        <div className="pl-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="p-6 border rounded-lg transition-all"
                                    style={{ borderColor: `${accentColor}4D`, backgroundColor: `${accentColor}0D` }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <Code className="w-5 h-5" style={{ color: `${accentColor}CC` }} />
                                        <span className="font-bold text-white">{skill.name || skill}</span>
                                    </div>
                                    <div className="h-1 rounded overflow-hidden" style={{ backgroundColor: `${accentColor}4D` }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${95 - i * 2}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full rounded"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span style={{ color: `${accentColor}CC` }}>$</span>
                        <span className="text-white">echo "Ready to connect?"</span>
                    </div>
                    <div className="text-4xl md:text-6xl font-bold text-white mb-8">
                        Ready to connect?
                    </div>
                    <a
                        href={`mailto:${personal?.email}`}
                        className="inline-block px-10 py-5 font-bold text-lg rounded-lg transition-all"
                        style={{ backgroundColor: accentColor, color: bgColor }}
                    >
                        {personal?.email}
                    </a>
                </div>
            </footer>
        </div>
    )
}
