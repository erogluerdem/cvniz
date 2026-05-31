import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Frame, Image, Eye, Palette } from 'lucide-react'

export default function MuseumWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#f5f5f0]" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1a1a1a' }}>

            {/* MUSEUM BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Subtle wall texture */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                {/* Spotlight effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-white/30 to-transparent blur-3xl" />
                <div className="absolute top-0 right-1/3 w-64 h-64 bg-gradient-radial from-amber-100/20 to-transparent blur-2xl" />
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="bg-white/90 backdrop-blur-xl border border-stone-200 rounded-sm px-8 py-4 flex justify-between items-center shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-900 flex items-center justify-center">
                            <Frame className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-stone-800 text-lg tracking-wide hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <a href="#about" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden lg:block tracking-wide">Giriş</a>
                        <a href="#gallery" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden lg:block tracking-wide">Galeri</a>
                        <a href="#collection" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden lg:block tracking-wide">Koleksiyon</a>
                        <a href={`mailto:${personal.email}`} className="px-6 py-3 bg-stone-900 text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-all">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO - GALLERY ENTRANCE */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                        <div className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 mb-12">
                            <Eye className="w-4 h-4 text-stone-400" />
                            <span className="text-sm tracking-[0.3em] text-stone-500 uppercase">{personal.title}</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-light tracking-tight mb-12 text-stone-900">
                            {personal.fullName}
                        </h1>
                        <div className="max-w-2xl mx-auto mb-16 relative">
                            <div className="absolute -left-8 top-0 bottom-0 w-px bg-stone-300" />
                            <p className="text-2xl text-stone-500 leading-relaxed italic pl-8">
                                "{personal.summary}"
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 text-sm text-stone-400">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* GALLERY - EXPERIENCE */}
            <section id="gallery" className="relative py-32 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-sm tracking-[0.5em] text-stone-400 uppercase">Kariyer</span>
                        <h2 className="text-5xl font-light mt-4 text-stone-900">Sergi</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-16">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                {/* Frame */}
                                <div className="relative bg-[#f5f5f0] p-8 border-8 border-stone-200 shadow-2xl">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-stone-300 rounded-full" />
                                    <div className="border border-stone-100 p-8 bg-white">
                                        <span className="text-xs tracking-[0.3em] text-stone-400 uppercase">{exp.startDate} — {exp.endDate}</span>
                                        <h3 className="text-3xl font-light text-stone-900 mt-4 mb-2 group-hover:italic transition-all">{exp.position}</h3>
                                        <p className="text-lg text-amber-700 mb-6 italic">{exp.company}</p>
                                        <p className="text-stone-500 leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                                {/* Placard */}
                                <div className="mt-4 text-center">
                                    <div className="inline-block bg-stone-100 px-4 py-2 text-xs tracking-[0.2em] text-stone-500 uppercase">
                                        Exhibit {i + 1}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COLLECTION - SKILLS */}
            <section id="collection" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-sm tracking-[0.5em] text-stone-400 uppercase">Yetenekler</span>
                        <h2 className="text-5xl font-light mt-4 text-stone-900">Koleksiyon</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                viewport={{ once: true }}
                                className="px-8 py-4 bg-white border border-stone-200 text-lg text-stone-700 hover:text-stone-900 hover:border-stone-400 transition-all cursor-default shadow-md"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section className="relative py-32 px-6 bg-stone-900 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-sm tracking-[0.5em] text-stone-500 uppercase">Eğitim</span>
                        <h2 className="text-5xl font-light mt-4 text-white">Arşiv</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="border border-stone-700 p-8 hover:border-stone-500 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <Palette className="w-6 h-6 text-stone-500" />
                                    <div>
                                        <h4 className="text-2xl font-light text-white group-hover:italic transition-all">{edu.school}</h4>
                                        <p className="text-sm text-stone-500">{edu.startDate} — {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-amber-400 italic">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 bg-white border-t border-stone-200">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-light text-stone-900 mb-2">Ziyaret Edin</h3>
                        <p className="text-stone-400 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 border border-stone-200 flex items-center justify-center hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all">
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
