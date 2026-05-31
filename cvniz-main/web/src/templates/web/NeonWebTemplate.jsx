import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, Sparkles, Star, Award, Briefcase, MapPin, Calendar, Zap, ChevronRight, Heart } from 'lucide-react'

export default function NeonWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#00FF88'
    const secondaryColor = colors.secondary || '#FF00FF'
    const bgColor = colors.bg || '#000000'
    const textColor = colors.text || '#ffffff'

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: bgColor, color: textColor, fontFamily: styles.fontFamily || "'Space Grotesk', sans-serif" }}>
            {/* NEON Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Animated Neon Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                    <motion.line
                        x1="0" y1="30%" x2="100%" y2="30%"
                        stroke={accentColor}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
                    />
                    <motion.line
                        x1="0" y1="70%" x2="100%" y2="70%"
                        stroke={secondaryColor}
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        style={{ filter: `drop-shadow(0 0 10px ${secondaryColor})` }}
                    />
                </svg>

                {/* Neon Orbs */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-20 right-20 w-96 h-96 rounded-full blur-[150px]"
                    style={{ backgroundColor: accentColor }}
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-[120px]"
                    style={{ backgroundColor: secondaryColor }}
                />

                {/* Grid */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(${accentColor}20 1px, transparent 1px), linear-gradient(90deg, ${accentColor}20 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }} />
            </div>

            {/* Neon Nav */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
                <div
                    className="backdrop-blur-2xl border rounded-full px-8 py-4 flex justify-between items-center"
                    style={{ backgroundColor: `${bgColor}CC`, borderColor: `${accentColor}40` }}
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            animate={{ boxShadow: [`0 0 20px ${accentColor}40`, `0 0 40px ${accentColor}80`, `0 0 20px ${accentColor}40`] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            {personal?.fullName?.[0]}
                        </motion.div>
                        <span className="font-bold tracking-tight">{personal?.fullName}</span>
                    </div>
                    <a
                        href={`mailto:${personal?.email}`}
                        className="px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
                        style={{ backgroundColor: accentColor, color: bgColor, boxShadow: `0 0 30px ${accentColor}60` }}
                    >
                        <Zap className="w-4 h-4" /> İletişim
                    </a>
                </div>
            </nav>

            {/* NEON Hero */}
            <section className="min-h-screen flex items-center justify-center pt-32 px-6 relative">
                <div className="max-w-5xl w-full text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <div
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border"
                            style={{ borderColor: accentColor, boxShadow: `0 0 20px ${accentColor}30` }}
                        >
                            <motion.span
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: accentColor }}
                            />
                            <span className="text-sm font-bold uppercase tracking-widest">{personal?.title}</span>
                        </div>

                        <h1 className="text-7xl md:text-[12rem] font-black leading-[0.8] tracking-tighter">
                            <span style={{ color: accentColor, textShadow: `0 0 60px ${accentColor}80` }}>
                                {personal?.fullName?.split(' ')[0]}
                            </span>
                            <br />
                            <span className="text-white/20">
                                {personal?.fullName?.split(' ').slice(1).join(' ')}
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            {personal?.summary}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 pt-8">
                            <a
                                href="#experience"
                                className="px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all hover:scale-105"
                                style={{ backgroundColor: accentColor, color: bgColor, boxShadow: `0 0 50px ${accentColor}50` }}
                            >
                                Keşfet <ArrowRight className="w-5 h-5" />
                            </a>
                            <div className="flex gap-3">
                                {personal?.linkedin && (
                                    <a href={personal.linkedin} className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:scale-105 transition-all" style={{ borderColor: `${accentColor}40` }}>
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {personal?.github && (
                                    <a href={personal.github} className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:scale-105 transition-all" style={{ borderColor: `${accentColor}40` }}>
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Experience */}
            {experience?.length > 0 && (
                <section id="experience" className="py-40 px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-20"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: accentColor }}>
                                Kariyer
                            </span>
                            <h2 className="text-6xl font-black tracking-tighter">
                                Deneyim <span className="text-white/20">Timeline</span>
                            </h2>
                        </motion.div>

                        <div className="space-y-8">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 10 }}
                                    className="group"
                                >
                                    <div
                                        className="p-10 md:p-16 rounded-3xl border relative overflow-hidden transition-all"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.02)',
                                            borderColor: `${accentColor}20`
                                        }}
                                    >
                                        {/* Neon glow on hover */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ boxShadow: `inset 0 0 60px ${accentColor}10` }}
                                        />

                                        <div className="absolute -top-10 -right-10 text-[15rem] font-black opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        <div className="relative z-10 grid md:grid-cols-[1fr,2fr] gap-10">
                                            <div className="space-y-4">
                                                <div
                                                    className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                                                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                                                >
                                                    {exp.startDate} — {exp.endDate || 'Now'}
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tight">{exp.position}</h3>
                                                <p className="text-lg font-bold" style={{ color: accentColor }}>{exp.company}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-lg text-gray-400 leading-relaxed">{exp.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section className="py-40 px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: accentColor }}>
                                Tech Stack
                            </span>
                            <h2 className="text-6xl font-black tracking-tighter">
                                Yetenekler
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="group cursor-default"
                                >
                                    <div
                                        className="p-8 rounded-2xl border text-center transition-all"
                                        style={{
                                            borderColor: `${accentColor}30`,
                                            backgroundColor: 'rgba(255,255,255,0.02)'
                                        }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                                            style={{ backgroundColor: `${accentColor}20` }}
                                        >
                                            <Star className="w-6 h-6" style={{ color: accentColor }} />
                                        </motion.div>
                                        <span className="font-bold text-lg">{skill.name || skill}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-40 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2
                        className="text-7xl md:text-9xl font-black tracking-tighter mb-12"
                        style={{ color: accentColor, textShadow: `0 0 80px ${accentColor}60` }}
                    >
                        Bağlanalım.
                    </h2>
                    <a
                        href={`mailto:${personal?.email}`}
                        className="inline-flex items-center gap-4 px-12 py-6 rounded-full font-black text-xl transition-all hover:scale-105"
                        style={{ backgroundColor: accentColor, color: bgColor, boxShadow: `0 0 60px ${accentColor}50` }}
                    >
                        <Mail className="w-6 h-6" /> {personal?.email}
                    </a>
                </motion.div>
            </footer>
        </div>
    )
}
