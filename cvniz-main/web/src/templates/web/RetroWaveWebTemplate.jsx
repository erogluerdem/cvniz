import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, Sparkles, Star, Award, Briefcase, MapPin, Music, Zap, Sun, Moon, ChevronRight } from 'lucide-react'

export default function RetroWaveWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#ff00ff'
    const secondaryColor = colors.secondary || '#00ffff'
    const bgColor = colors.bg || '#0a0a1a'
    const textColor = colors.text || '#ffffff'

    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: colors.bg || 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 50%, #2d1b4e 100%)',
            fontFamily: styles.fontFamily || "'Orbitron', sans-serif"
        }}>
            {/* RETRO SUN */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-[600px] h-[300px] rounded-t-full relative"
                    style={{
                        background: 'linear-gradient(180deg, #ff6b6b 0%, #ffa500 30%, #ff1493 70%, #9400d3 100%)',
                        clipPath: 'polygon(0% 100%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 90%, 100% 90%, 100% 80%, 0% 80%, 0% 70%, 100% 70%, 100% 60%, 0% 60%, 0% 50%, 100% 50%, 100% 40%, 0% 40%, 0% 30%, 100% 30%, 100% 20%, 0% 20%)'
                    }}
                />
            </div>

            {/* PERSPECTIVE GRID */}
            <div className="fixed bottom-0 left-0 right-0 h-[50vh] pointer-events-none overflow-hidden" style={{ perspective: '500px' }}>
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `linear-gradient(0deg, ${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${secondaryColor} 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                        transform: 'rotateX(60deg)',
                        transformOrigin: 'center top'
                    }}
                />
            </div>

            {/* Floating Stars */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%` }}
                    />
                ))}
            </div>

            {/* Nav */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
                <div className="backdrop-blur-2xl bg-purple-900/30 border border-pink-500/30 rounded-full px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/50">
                            {personal?.fullName?.[0]}
                        </div>
                        <span className="font-bold text-white tracking-widest text-sm uppercase hidden md:block">{personal?.fullName}</span>
                    </div>
                    <a
                        href={`mailto:${personal?.email}`}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-pink-500/30"
                    >
                        <Mail className="w-4 h-4" /> Connect
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center justify-center pt-32 px-6 relative z-10">
                <div className="max-w-5xl w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                            <Sun className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-bold uppercase tracking-widest text-pink-300">{personal?.title}</span>
                        </div>

                        <h1 className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600" style={{ textShadow: '0 0 80px rgba(255,0,255,0.5)' }}>
                                {personal?.fullName?.split(' ')[0]}
                            </span>
                            <br />
                            <span className="text-white/20">
                                {personal?.fullName?.split(' ').slice(1).join(' ')}
                            </span>
                        </h1>

                        <p className="text-xl text-purple-200/60 max-w-2xl mx-auto leading-relaxed">
                            {personal?.summary}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 pt-8">
                            <a
                                href="#experience"
                                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-pink-500/30"
                            >
                                <Zap className="w-5 h-5" /> Explore
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Experience */}
            {experience?.length > 0 && (
                <section id="experience" className="py-40 px-6 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-20"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest text-pink-400 mb-4 block">Career Timeline</span>
                            <h2 className="text-6xl font-black text-white tracking-tighter">
                                Experience
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
                                    <div className="p-10 md:p-16 rounded-3xl bg-purple-900/20 border border-pink-500/20 backdrop-blur-xl relative overflow-hidden hover:border-pink-500/50 transition-all">
                                        <div className="absolute -top-10 -right-10 text-[15rem] font-black text-white/[0.02] select-none pointer-events-none">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        <div className="relative z-10 grid md:grid-cols-[1fr,2fr] gap-10">
                                            <div className="space-y-4">
                                                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-xs font-bold text-pink-300 uppercase tracking-widest">
                                                    {exp.startDate} — {exp.endDate || 'Present'}
                                                </div>
                                                <h3 className="text-3xl font-black text-white">{exp.position}</h3>
                                                <p className="text-lg font-bold text-pink-400">{exp.company}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-lg text-purple-200/60 leading-relaxed">{exp.description}</p>
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
                <section className="py-40 px-6 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4 block">Tech Stack</span>
                            <h2 className="text-6xl font-black text-white tracking-tighter">Skills</h2>
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
                                    className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-pink-500/20 text-center hover:border-cyan-400/50 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-500 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-pink-500/30">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-white text-lg">{skill.name || skill}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-40 px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-7xl md:text-9xl font-black tracking-tighter mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600">
                        Let's Connect.
                    </h2>
                    <a
                        href={`mailto:${personal?.email}`}
                        className="inline-flex items-center gap-4 px-12 py-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xl shadow-2xl shadow-pink-500/30 hover:scale-105 transition-all"
                    >
                        <Mail className="w-6 h-6" /> {personal?.email}
                    </a>
                </motion.div>
            </footer>
        </div>
    )
}
