import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, Quote, BookOpen, Calendar, MapPin, Star, ChevronRight, User, Bookmark } from 'lucide-react'

export default function MagazineWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#000000'
    const bgColor = colors.bg || '#f8f6f1'
    const textColor = colors.text || '#111827'

    const containerStyle = {
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Playfair Display', serif",
    }

    return (
        <div className="min-h-screen relative" style={containerStyle}>
            {/* Magazine Header */}
            <header className="border-b-4 border-black py-6 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-center flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-2">
                            Issue N°{new Date().getFullYear()} • Premium Edition
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight italic">
                            PORTFOLIO
                        </h1>
                        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 mt-2">
                            The Professional Journey of {personal?.fullName}
                        </div>
                    </div>
                </div>
            </header>

            {/* Cover Story */}
            <section className="py-20 px-6 border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Big Title */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-px bg-black" />
                                <span className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500">Cover Story</span>
                            </div>

                            <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">
                                {personal?.fullName?.split(' ')[0]}
                                <br />
                                <span className="italic font-light">{personal?.fullName?.split(' ').slice(1).join(' ')}</span>
                            </h2>

                            <div className="flex items-center gap-4">
                                <span className="px-4 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest">
                                    {personal?.title}
                                </span>
                                {personal?.location && (
                                    <span className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" /> {personal?.location}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Right - Quote Box */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="p-12 bg-white border-2 border-black relative">
                                <Quote className="w-16 h-16 text-gray-200 absolute -top-8 -left-8" />
                                <p className="text-2xl md:text-3xl leading-relaxed font-light italic relative z-10">
                                    "{personal?.summary}"
                                </p>
                                <div className="mt-8 pt-8 border-t border-gray-200 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-black">
                                        {personal?.fullName?.[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{personal?.fullName}</div>
                                        <div className="text-sm text-gray-500">{personal?.title}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Magazine Page Corner */}
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-t-2 border-l-2 border-black" style={{ backgroundColor: bgColor }} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Experience - Article Layout */}
            {experience?.length > 0 && (
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="flex items-center gap-6 mb-16">
                            <div className="text-8xl font-black text-gray-100">01</div>
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-2">Feature Article</div>
                                <h2 className="text-5xl font-black tracking-tight">Career Timeline</h2>
                            </div>
                        </div>

                        {/* Articles Grid */}
                        <div className="grid md:grid-cols-2 gap-12">
                            {experience.map((exp, i) => (
                                <motion.article
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <div className="border-t-4 border-black pt-8 space-y-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-bold">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-black leading-tight group-hover:italic transition-all">
                                            {exp.position}
                                        </h3>

                                        <div className="flex items-center gap-2">
                                            <Bookmark className="w-4 h-4" />
                                            <span className="font-bold uppercase tracking-widest text-sm">{exp.company}</span>
                                        </div>

                                        <p className="text-lg text-gray-600 leading-relaxed font-light">
                                            {exp.description}
                                        </p>

                                        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 pt-4">
                                            Continue Reading →
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills - Side Column Style */}
            {skills?.length > 0 && (
                <section className="py-20 px-6 bg-black text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-16">
                            {/* Left - Header */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-20">
                                    <div className="text-8xl font-black text-white/10 mb-4">02</div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-4">Professional Skills</div>
                                    <h2 className="text-5xl font-black tracking-tight mb-6">Expertise</h2>
                                    <p className="text-gray-400 leading-relaxed">
                                        A comprehensive toolkit refined through years of professional experience and continuous learning.
                                    </p>
                                </div>
                            </div>

                            {/* Right - Skills */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {skills.map((skill, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className="p-6 border border-white/20 text-center hover:bg-white hover:text-black transition-all cursor-default group"
                                        >
                                            <Star className="w-8 h-8 mx-auto mb-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-bold text-lg">{skill.name || skill}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer - Magazine Back Cover */}
            <footer className="py-32 px-6 border-t-4 border-black">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">Get In Touch</div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tight italic">
                            Let's Work<br />Together.
                        </h2>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="inline-flex items-center gap-4 px-12 py-6 bg-black text-white font-bold text-xl hover:bg-gray-800 transition-all"
                        >
                            <Mail className="w-6 h-6" /> {personal?.email}
                        </a>

                        <div className="pt-20 flex justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">
                            {personal?.linkedin && <a href={personal.linkedin} className="hover:text-black transition-colors">LinkedIn</a>}
                            {personal?.github && <a href={personal.github} className="hover:text-black transition-colors">GitHub</a>}
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
