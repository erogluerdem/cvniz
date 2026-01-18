import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, BookOpen, Pencil, Heart, Bookmark, Sticker } from 'lucide-react'

export default function JournalWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#fef3e2]" style={{ fontFamily: "'Caveat', cursive", color: '#4a4a4a' }}>

            {/* JOURNAL BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }} />

                {/* Lined paper effect */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #1e90ff 31px, #1e90ff 32px)', backgroundSize: '100% 32px' }} />

                {/* Decorative stickers */}
                <div className="absolute top-20 right-20 text-6xl rotate-12 opacity-20">✨</div>
                <div className="absolute bottom-40 left-20 text-5xl -rotate-6 opacity-20">🌸</div>
                <div className="absolute top-1/2 right-40 text-4xl rotate-6 opacity-15">☕</div>
            </div>

            {/* NAV - Bookmark style */}
            <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
                <div className="bg-[#d4a574]/90 backdrop-blur-sm px-8 py-4 flex justify-between items-center shadow-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#8b4513] flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[#fef3e2]" />
                        </div>
                        <span className="font-bold text-[#5c3317] text-xl hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-sm font-bold text-[#5c3317]/60 hover:text-[#5c3317] transition-colors hidden lg:block">Günlük</a>
                        <a href="#story" className="text-sm font-bold text-[#5c3317]/60 hover:text-[#5c3317] transition-colors hidden lg:block">Hikayem</a>
                        <a href="#notes" className="text-sm font-bold text-[#5c3317]/60 hover:text-[#5c3317] transition-colors hidden lg:block">Notlar</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-[#8b4513] rounded-full text-sm font-bold text-[#fef3e2] hover:bg-[#5c3317] transition-all">
                            Yaz Bana
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO - Journal Entry */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="bg-white/80 backdrop-blur rounded-3xl p-12 shadow-xl relative transform rotate-1">
                            {/* Paper clip */}
                            <div className="absolute -top-4 left-8 w-8 h-16 border-4 border-[#c0c0c0] rounded-full bg-transparent" />

                            <div className="text-sm text-[#8b4513]/60 mb-4">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

                            <div className="inline-block px-4 py-2 bg-[#ffe4b5] rounded-lg mb-6 transform -rotate-2">
                                <Pencil className="w-4 h-4 inline mr-2 text-[#8b4513]" />
                                <span className="text-sm text-[#8b4513]">{personal.title}</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-bold text-[#5c3317] mb-8">
                                Merhaba, ben {personal.fullName?.split(' ')[0]}! 👋
                            </h1>

                            <p className="text-2xl text-[#6b4423] leading-relaxed mb-8">
                                {personal.summary}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {personal.email && (
                                    <div className="px-4 py-2 bg-[#ffd700]/20 rounded-lg flex items-center gap-2 text-sm text-[#8b4513]">
                                        <Mail className="w-4 h-4" />{personal.email}
                                    </div>
                                )}
                                {personal.phone && (
                                    <div className="px-4 py-2 bg-[#98fb98]/20 rounded-lg flex items-center gap-2 text-sm text-[#8b4513]">
                                        <Phone className="w-4 h-4" />{personal.phone}
                                    </div>
                                )}
                                {personal.location && (
                                    <div className="px-4 py-2 bg-[#87ceeb]/20 rounded-lg flex items-center gap-2 text-sm text-[#8b4513]">
                                        <MapPin className="w-4 h-4" />{personal.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* STORY - Experience */}
            <section id="story" className="relative py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl font-bold text-[#5c3317] mb-12 flex items-center gap-4">
                        <Bookmark className="w-8 h-8 text-[#8b4513]" /> Hikayem
                    </h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg transform"
                                style={{ rotate: `${(i % 2 === 0 ? 1 : -1) * (Math.random() * 2)}deg` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-3xl font-bold text-[#5c3317]">{exp.position}</h3>
                                        <p className="text-lg text-[#d2691e]">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-[#8b4513]/60 mt-2 md:mt-0 px-3 py-1 bg-[#ffe4b5] rounded-full">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-xl text-[#6b4423] leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NOTES - Skills */}
            <section id="notes" className="relative py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl font-bold text-[#5c3317] mb-12 flex items-center gap-4">
                        <Heart className="w-8 h-8 text-pink-400" /> Sevdiğim Şeyler
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 rounded-xl text-xl font-bold cursor-default"
                                style={{
                                    background: ['#ffb6c1', '#98fb98', '#87ceeb', '#dda0dd', '#ffd700', '#ffa07a'][i % 6],
                                    transform: `rotate(${(Math.random() - 0.5) * 10}deg)`
                                }}
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section className="relative py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl font-bold text-[#5c3317] mb-12">📚 Öğrenim Yolculuğum</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg transform"
                                style={{ rotate: `${(i % 2 === 0 ? -1 : 1) * 2}deg` }}
                            >
                                <div className="text-sm text-[#8b4513]/60 mb-2">{edu.startDate} - {edu.endDate}</div>
                                <h4 className="text-2xl font-bold text-[#5c3317] mb-2">{edu.school}</h4>
                                <p className="text-lg text-[#d2691e]">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6">
                <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl text-center">
                    <div className="text-4xl mb-4">💌</div>
                    <h3 className="text-3xl font-bold text-[#5c3317] mb-4">Tanıştığımıza Memnun Oldum!</h3>
                    <p className="text-xl text-[#6b4423] mb-6">{personal.email}</p>
                    <div className="flex justify-center gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-full bg-[#d4a574] flex items-center justify-center hover:bg-[#8b4513] transition-all">
                                <Icon className="w-5 h-5 text-[#fef3e2]" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
