import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolio, PORTFOLIO_THEMES, PROJECT_CATEGORIES } from '../context/PortfolioContext'
import { useCV } from '../context/CVContext'
import {
    X, Layout, Palette, FolderOpen, Globe, Plus, Trash2, Edit,
    Eye, ExternalLink, Github, Link, Check, Upload, Zap, Image, Sparkles
} from 'lucide-react'

export default function PortfolioBuilder({ isOpen, onClose }) {
    const {
        portfolio, projects, createPortfolio, updatePortfolio, togglePublish,
        addProject, updateProject, deleteProject, getUserProjects, importFromCV
    } = usePortfolio() || {}
    const { cvs } = useCV()

    const [activeTab, setActiveTab] = useState('profile') // profile, theme, projects
    const [editingProject, setEditingProject] = useState(null)
    const [showAddProject, setShowAddProject] = useState(false)
    const [newProject, setNewProject] = useState({
        title: '', description: '', category: 'web',
        liveUrl: '', githubUrl: '', technologies: ''
    })
    const [profileData, setProfileData] = useState({
        name: portfolio?.name || '',
        title: portfolio?.title || '',
        bio: portfolio?.bio || '',
        github: portfolio?.socialLinks?.github || '',
        linkedin: portfolio?.socialLinks?.linkedin || '',
        twitter: portfolio?.socialLinks?.twitter || ''
    })

    const userProjects = getUserProjects?.() || []

    // Initialize portfolio if doesn't exist
    const handleInit = () => {
        if (!createPortfolio) return
        createPortfolio({
            name: profileData.name,
            title: profileData.title,
            bio: profileData.bio,
            socialLinks: {
                github: profileData.github,
                linkedin: profileData.linkedin,
                twitter: profileData.twitter
            }
        })
    }

    // Save profile changes
    const handleSaveProfile = () => {
        if (!portfolio) {
            handleInit()
            return
        }
        updatePortfolio?.({
            name: profileData.name,
            title: profileData.title,
            bio: profileData.bio,
            socialLinks: {
                github: profileData.github,
                linkedin: profileData.linkedin,
                twitter: profileData.twitter
            }
        })
    }

    // Add project
    const handleAddProject = () => {
        if (!newProject.title) return
        addProject?.({
            ...newProject,
            technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
        })
        setNewProject({ title: '', description: '', category: 'web', liveUrl: '', githubUrl: '', technologies: '' })
        setShowAddProject(false)
    }

    // Import from CV
    const handleImportFromCV = (cvId) => {
        importFromCV?.(cvId)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] text-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative"
                >
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 bg-gradient-to-r from-[#10B981]/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Layout className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                    Portfolio Builder <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm font-medium text-gray-400">
                                    {portfolio?.isPublished
                                        ? <span className="text-[#10B981]">Yayında: portfolio.cvniz.com/{portfolio.slug}</span>
                                        : 'Kişisel portfolyonuzu kusursuzca oluşturun'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {portfolio && (
                                <>
                                    <button
                                        onClick={() => togglePublish?.()}
                                        className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${portfolio.isPublished
                                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/30'
                                            : 'bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:border-[#10B981]/50'
                                            }`}
                                    >
                                        <Globe className={`w-4 h-4 ${portfolio.isPublished ? 'animate-pulse' : ''}`} />
                                        {portfolio.isPublished ? 'Yayında' : 'Yayınla'}
                                    </button>
                                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold flex items-center gap-2 border border-white/10 transition-colors">
                                        <Eye className="w-4 h-4" />
                                        Önizle
                                    </button>
                                </>
                            )}
                            <button onClick={onClose} className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-black/20">
                        {[
                            { id: 'profile', label: 'Kişisel Profil', icon: <Edit className="w-4 h-4" /> },
                            { id: 'theme', label: 'Tasarım Teması', icon: <Palette className="w-4 h-4" /> },
                            { id: 'projects', label: 'Projelerim', icon: <FolderOpen className="w-4 h-4" /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all text-sm font-bold uppercase tracking-wider relative ${activeTab === tab.id
                                    ? 'text-[#10B981] bg-[#10B981]/5'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="portfolio-tab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] shadow-[0_-2px_10px_rgba(16,185,129,0.5)]" 
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div 
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8 max-w-2xl mx-auto"
                                >
                                    {/* Import from CV */}
                                    {cvs?.length > 0 && (
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#10B981]/20 transition-colors"></div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                                <div>
                                                    <h4 className="font-black text-lg text-white flex items-center gap-2">
                                                        <Zap className="w-5 h-5 text-[#10B981]" /> Hızlı Başlangıç
                                                    </h4>
                                                    <p className="text-sm text-gray-400 font-medium">Bilgilerinizi mevcut CV'nizden otomatik çekin</p>
                                                </div>
                                                <div className="relative">
                                                    <select
                                                        onChange={(e) => handleImportFromCV(e.target.value)}
                                                        className="appearance-none w-full sm:w-auto pl-4 pr-10 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-bold focus:border-[#10B981] outline-none hover:border-white/30 transition-colors"
                                                    >
                                                        <option value="">CV Seçiniz...</option>
                                                        {cvs.map(cv => (
                                                            <option key={cv.id} value={cv.id}>{cv.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <Upload className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Profile Form */}
                                    <div className="space-y-5 p-6 md:p-8 rounded-3xl bg-black/40 border border-white/5 shadow-inner">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Ad Soyad</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                placeholder="Örn: John Doe"
                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] focus:bg-[#10B981]/5 outline-none transition-all placeholder-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mesleki Ünvan</label>
                                            <input
                                                type="text"
                                                value={profileData.title}
                                                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                                placeholder="Örn: Senior Frontend Developer"
                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] focus:bg-[#10B981]/5 outline-none transition-all placeholder-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hakkımda</label>
                                            <textarea
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                placeholder="Kendinizi, hedeflerinizi ve tutkularınızı anlatın..."
                                                rows={5}
                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] focus:bg-[#10B981]/5 outline-none resize-none transition-all placeholder-gray-600 scrollbar-thin scrollbar-thumb-white/10"
                                            />
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-white/5">
                                            <h4 className="font-black text-lg text-white mb-5 flex items-center gap-2">
                                                <Link className="w-5 h-5 text-[#10B981]" /> Sosyal Medya & Bağlantılar
                                            </h4>
                                            <div className="grid md:grid-cols-3 gap-5">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                                                        <Github className="w-3.5 h-3.5" /> GitHub
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profileData.github}
                                                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                                                        placeholder="username"
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none text-sm placeholder-gray-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">LinkedIn</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.linkedin}
                                                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                                                        placeholder="username"
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none text-sm placeholder-gray-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Twitter / X</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.twitter}
                                                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                                                        placeholder="username"
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none text-sm placeholder-gray-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSaveProfile}
                                            className="w-full mt-8 py-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                                        >
                                            <Check className="w-5 h-5" />
                                            {portfolio ? 'Değişiklikleri Kaydet' : 'Portfolyomu Oluştur'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Theme Tab */}
                            {activeTab === 'theme' && (
                                <motion.div 
                                    key="theme"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-black text-white mb-2">Sizi Yansıtan Temayı Seçin</h3>
                                        <p className="text-gray-400 font-medium">Tüm temalar mobil uyumlu ve modern prensiplerle tasarlanmıştır.</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.values(PORTFOLIO_THEMES).map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => updatePortfolio?.({ theme: theme.id })}
                                                className={`p-1 rounded-3xl text-left transition-all relative overflow-hidden group ${portfolio?.theme === theme.id
                                                    ? 'bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="bg-black/60 backdrop-blur-sm rounded-[22px] p-5 h-full relative z-10">
                                                    <div
                                                        className="w-full h-32 rounded-xl mb-5 flex flex-col items-center justify-center shadow-inner relative overflow-hidden"
                                                        style={{ backgroundColor: theme.bgColor }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/5"></div>
                                                        <div
                                                            className="w-20 h-4 rounded-full mb-3 shadow-lg"
                                                            style={{ backgroundColor: theme.primaryColor }}
                                                        />
                                                        <div className="flex gap-2">
                                                            <div className="w-8 h-8 rounded bg-white/10"></div>
                                                            <div className="w-8 h-8 rounded bg-white/10"></div>
                                                            <div className="w-8 h-8 rounded bg-white/10"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className={`font-black text-lg ${portfolio?.theme === theme.id ? 'text-[#10B981]' : 'text-white'}`}>
                                                            {theme.name}
                                                        </div>
                                                        {portfolio?.theme === theme.id && (
                                                            <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-black" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-400 font-medium">{theme.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Projects Tab */}
                            {activeTab === 'projects' && (
                                <motion.div 
                                    key="projects"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-black/40 border border-white/5">
                                        <div>
                                            <h3 className="font-black text-xl text-white mb-1">Projelerim</h3>
                                            <p className="text-sm text-gray-400 font-medium">En iyi işlerinizi portfolyonuzda sergileyin</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddProject(true)}
                                            className="px-5 py-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/30 font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Yeni Proje Ekle
                                        </button>
                                    </div>

                                    {/* Add Project Form */}
                                    <AnimatePresence>
                                        {showAddProject && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 md:p-8 rounded-3xl bg-black/60 border border-[#10B981]/30 space-y-6 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-3xl"></div>
                                                    
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-black text-lg text-white">Yeni Proje Detayları</h4>
                                                        <button onClick={() => setShowAddProject(false)} className="text-gray-500 hover:text-white">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-5">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Proje Adı</label>
                                                            <input
                                                                type="text"
                                                                value={newProject.title}
                                                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                                                placeholder="Örn: E-Ticaret Platformu"
                                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none placeholder-gray-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Kategori</label>
                                                            <select
                                                                value={newProject.category}
                                                                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none appearance-none"
                                                            >
                                                                {Object.entries(PROJECT_CATEGORIES).map(([key, label]) => (
                                                                    <option key={key} value={key} className="bg-slate-900">{label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Açıklama</label>
                                                        <textarea
                                                            value={newProject.description}
                                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                                            placeholder="Projenin amacı, çözdüğü problem ve sizin rolünüz..."
                                                            rows={3}
                                                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none resize-none placeholder-gray-600"
                                                        />
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-5">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Canlı Demo URL</label>
                                                            <input
                                                                type="text"
                                                                value={newProject.liveUrl}
                                                                onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                                                placeholder="https://projeniz.com"
                                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none placeholder-gray-600"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">GitHub URL</label>
                                                            <input
                                                                type="text"
                                                                value={newProject.githubUrl}
                                                                onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                                                placeholder="https://github.com/..."
                                                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none placeholder-gray-600"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Kullanılan Teknolojiler</label>
                                                        <input
                                                            type="text"
                                                            value={newProject.technologies}
                                                            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                                            placeholder="React, Node.js, Tailwind, MongoDB (Virgülle ayırın)"
                                                            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:border-[#10B981] outline-none placeholder-gray-600"
                                                        />
                                                    </div>

                                                    <div className="flex gap-4 pt-4">
                                                        <button
                                                            onClick={() => setShowAddProject(false)}
                                                            className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors text-white"
                                                        >
                                                            İptal Et
                                                        </button>
                                                        <button
                                                            onClick={handleAddProject}
                                                            disabled={!newProject.title}
                                                            className="flex-1 py-4 rounded-xl bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-black font-black transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                        >
                                                            Projeyi Ekle
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Project List */}
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userProjects.map(project => (
                                            <div key={project.id} className="p-5 rounded-3xl bg-black/40 border border-white/5 group hover:border-[#10B981]/30 transition-all flex flex-col h-full hover:bg-white/5 relative overflow-hidden">
                                                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-2xl mb-4 flex flex-col items-center justify-center border border-white/5 relative group-hover:from-[#10B981]/5 group-hover:to-[#10B981]/10 transition-colors">
                                                    <Image className="w-10 h-10 text-gray-600 group-hover:text-[#10B981] transition-colors mb-2" />
                                                    <span className="text-xs font-bold text-gray-500 group-hover:text-[#10B981]/50 uppercase tracking-widest">Kapak Görseli</span>
                                                </div>
                                                
                                                <div className="flex items-start justify-between mb-3 relative z-10">
                                                    <div>
                                                        <h4 className="font-black text-lg text-white group-hover:text-[#10B981] transition-colors line-clamp-1">{project.title}</h4>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                                                            {PROJECT_CATEGORIES[project.category]}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteProject?.(project.id)}
                                                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                                        title="Projeyi Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                
                                                <p className="text-sm text-gray-400 font-medium mb-4 line-clamp-3 flex-1">{project.description}</p>
                                                
                                                {project.technologies?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                                        {project.technologies.slice(0, 4).map((tech, i) => (
                                                            <span key={i} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {project.technologies.length > 4 && (
                                                            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-[#10B981]">
                                                                +{project.technologies.length - 4}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="flex gap-2 pt-4 border-t border-white/5 mt-auto">
                                                    {project.liveUrl && (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener"
                                                            className="flex-1 py-2 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#10B981]/20"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" /> Canlı Proje
                                                        </a>
                                                    )}
                                                    {project.githubUrl && (
                                                        <a
                                                            href={project.githubUrl}
                                                            target="_blank"
                                                            rel="noopener"
                                                            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                                                        >
                                                            <Github className="w-3.5 h-3.5" /> Kaynak Kod
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {userProjects.length === 0 && !showAddProject && (
                                        <div className="text-center py-20 px-6 rounded-3xl bg-black/40 border border-white/5 border-dashed max-w-2xl mx-auto">
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                <FolderOpen className="w-10 h-10 text-gray-600" />
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2">Henüz proje eklemediniz</h4>
                                            <p className="text-gray-400 font-medium mb-8">En iyi çalışmalarınızı ekleyerek potansiyel işverenleri etkileyin.</p>
                                            <button
                                                onClick={() => setShowAddProject(true)}
                                                className="px-8 py-3.5 rounded-2xl bg-[#10B981] text-black font-black transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] inline-flex items-center gap-2"
                                            >
                                                <Plus className="w-5 h-5" />
                                                İlk Projenizi Ekleyin
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 flex justify-between items-center bg-black/20">
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            {portfolio?.views > 0 ? (
                                <>
                                    <Eye className="w-4 h-4 text-[#10B981]" /> {portfolio.views} Görüntülenme
                                </>
                            ) : (
                                'Portfolyo Paneli'
                            )}
                        </div>
                        <button onClick={onClose} className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
                            Kapat
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
