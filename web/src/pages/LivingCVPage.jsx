import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Download, Share2, Mail, Phone, MapPin, Globe, Linkedin, Github,
    Briefcase, GraduationCap, Award, Code, Languages, ExternalLink,
    Play, Calendar, ChevronRight, Sparkles
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function LivingCVPage() {
    const { publicUrl } = useParams()
    const [cv, setCv] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showShareModal, setShowShareModal] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchCV()
    }, [publicUrl])

    const fetchCV = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_URL}/cvs/public/${publicUrl}`)

            if (!response.ok) {
                throw new Error('CV bulunamadı')
            }

            const data = await response.json()
            setCv(data.cv)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleShare = async () => {
        const shareUrl = window.location.href

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${cv?.data?.personalInfo?.fullName || 'CV'} - Yaşayan CV`,
                    text: 'Profesyonel CV\'mi inceleyin',
                    url: shareUrl
                })
            } catch (err) {
                console.error('Share error:', err)
            }
        } else {
            setShowShareModal(true)
        }
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePrint = () => {
        window.print()
    }

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
                        />
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-cyan-400" />
                    </div>
                    <p className="text-white text-lg font-medium">Yaşayan CV Yükleniyor...</p>
                    <p className="text-gray-500 text-sm mt-2">Lütfen bekleyin</p>
                </motion.div>
            </div>
        )
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">😕</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">CV Bulunamadı</h1>
                    <p className="text-gray-400 mb-6">Bu CV mevcut değil veya herkese açık değil.</p>
                    <a
                        href="/"
                        className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                    >
                        Ana Sayfaya Dön
                    </a>
                </div>
            </div>
        )
    }

    const data = cv?.data || {}
    const personalInfo = data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []
    const languages = data.languages || []
    const projects = data.projects || []
    const certifications = data.certifications || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative pt-20 pb-32 px-4"
            >
                <div className="max-w-4xl mx-auto text-center">
                    {/* Profile Photo */}
                    {personalInfo.photo && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="mb-8"
                        >
                            <div className="w-36 h-36 mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl shadow-cyan-500/20">
                                <img
                                    src={personalInfo.photo}
                                    alt={personalInfo.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Name & Title */}
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-6xl font-black text-white mb-4"
                    >
                        {personalInfo.fullName || 'İsimsiz'}
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-cyan-400 font-medium mb-6"
                    >
                        {personalInfo.title || 'Profesyonel'}
                    </motion.p>

                    {/* Location */}
                    {(personalInfo.city || personalInfo.country) && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center gap-2 text-gray-400 mb-8"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
                        </motion.div>
                    )}

                    {/* Contact Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-3"
                    >
                        {personalInfo.email && (
                            <a
                                href={`mailto:${personalInfo.email}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                E-posta
                            </a>
                        )}
                        {personalInfo.phone && (
                            <a
                                href={`tel:${personalInfo.phone}`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                            >
                                <Phone className="w-4 h-4" />
                                Ara
                            </a>
                        )}
                        {personalInfo.linkedin && (
                            <a
                                href={personalInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2]/20 border border-[#0A66C2]/30 rounded-xl text-[#0A66C2] hover:bg-[#0A66C2]/30 transition-all"
                            >
                                <Linkedin className="w-4 h-4" />
                                LinkedIn
                            </a>
                        )}
                        {personalInfo.github && (
                            <a
                                href={personalInfo.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                        )}
                        {personalInfo.website && (
                            <a
                                href={personalInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                            >
                                <Globe className="w-4 h-4" />
                                Website
                            </a>
                        )}
                    </motion.div>
                </div>
            </motion.section>

            {/* Summary */}
            {personalInfo.summary && (
                <Section title="Hakkımda" icon={<Sparkles className="w-5 h-5" />} delay={0.7}>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        {personalInfo.summary}
                    </p>
                </Section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <Section title="Deneyim" icon={<Briefcase className="w-5 h-5" />} delay={0.8}>
                    <div className="space-y-6">
                        {experience.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-6 border-l-2 border-cyan-500/30"
                            >
                                <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] bg-cyan-500 rounded-full" />
                                <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                                <p className="text-cyan-400 font-medium">{exp.company}</p>
                                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {exp.startDate} - {exp.current ? 'Devam Ediyor' : exp.endDate}
                                </p>
                                {exp.description && (
                                    <p className="text-gray-400 mt-3">{exp.description}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <Section title="Eğitim" icon={<GraduationCap className="w-5 h-5" />} delay={0.9}>
                    <div className="space-y-6">
                        {education.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-6 border-l-2 border-blue-500/30"
                            >
                                <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] bg-blue-500 rounded-full" />
                                <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                                <p className="text-blue-400 font-medium">{edu.school}</p>
                                {edu.field && (
                                    <p className="text-gray-400">{edu.field}</p>
                                )}
                                <p className="text-gray-500 text-sm mt-1">
                                    {edu.startDate} - {edu.endDate || 'Devam Ediyor'}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <Section title="Yetenekler" icon={<Code className="w-5 h-5" />} delay={1.0}>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                            <motion.span
                                key={index}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, type: 'spring' }}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl text-white font-medium"
                            >
                                {typeof skill === 'string' ? skill : skill.name}
                            </motion.span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <Section title="Projeler" icon={<ExternalLink className="w-5 h-5" />} delay={1.1}>
                    <div className="grid md:grid-cols-2 gap-4">
                        {projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all group"
                            >
                                <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                                    {project.name}
                                </h4>
                                {project.description && (
                                    <p className="text-gray-400 text-sm mt-2">{project.description}</p>
                                )}
                                {project.url && (
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-cyan-400 text-sm mt-3 hover:underline"
                                    >
                                        Görüntüle <ChevronRight className="w-3 h-3" />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <Section title="Diller" icon={<Languages className="w-5 h-5" />} delay={1.2}>
                    <div className="flex flex-wrap gap-4">
                        {languages.map((lang, index) => (
                            <div
                                key={index}
                                className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl"
                            >
                                <span className="text-white font-medium">
                                    {typeof lang === 'string' ? lang : lang.name}
                                </span>
                                {lang.level && (
                                    <span className="text-gray-500 text-sm ml-2">({lang.level})</span>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <Section title="Sertifikalar" icon={<Award className="w-5 h-5" />} delay={1.3}>
                    <div className="space-y-3">
                        {certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl"
                            >
                                <Award className="w-5 h-5 text-yellow-500" />
                                <div>
                                    <p className="text-white font-medium">
                                        {typeof cert === 'string' ? cert : cert.name}
                                    </p>
                                    {cert.issuer && (
                                        <p className="text-gray-500 text-sm">{cert.issuer}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Floating Action Bar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl print:hidden z-50"
            >
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-cyan-400 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    PDF İndir
                </button>
                <div className="w-px h-6 bg-white/20" />
                <button
                    onClick={handleShare}
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Paylaş"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Paylaş</h3>
                            <div className="flex items-center gap-2 p-4 bg-white/5 rounded-xl">
                                <input
                                    type="text"
                                    value={window.location.href}
                                    readOnly
                                    className="flex-1 bg-transparent text-gray-400 text-sm outline-none"
                                />
                                <button
                                    onClick={copyUrl}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-cyan-500 text-white hover:bg-cyan-600'
                                        }`}
                                >
                                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="py-12 text-center text-gray-500 text-sm print:hidden">
                <p>Powered by <span className="text-cyan-400 font-semibold">CVniz</span> - Yaşayan CV</p>
            </footer>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; }
                    .print-hidden { display: none !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </div>
    )
}

// Section Component
function Section({ title, icon, children, delay = 0 }) {
    return (
        <motion.section
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay }}
            className="relative py-12 px-4"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                        {icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                {children}
            </div>
        </motion.section>
    )
}

