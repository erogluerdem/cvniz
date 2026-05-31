import { useState } from 'react'
import { usePortfolio, PORTFOLIO_THEMES, PROJECT_CATEGORIES } from '../context/PortfolioContext'
import { useCV } from '../context/CVContext'
import {
    X, Layout, Palette, FolderOpen, Globe, Plus, Trash2, Edit,
    Eye, ExternalLink, Github, Link, Check, Upload, Zap, Image
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <Layout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Portfolio Builder</h2>
                            <p className="text-sm text-gray-400">
                                {portfolio?.isPublished
                                    ? `Yayında: portfolio.CVniz.com/${portfolio.slug}`
                                    : 'Kişisel portfolyonuzu oluşturun'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {portfolio && (
                            <>
                                <button
                                    onClick={() => togglePublish?.()}
                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 ${portfolio.isPublished
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-white/10 text-gray-400'
                                        }`}
                                >
                                    <Globe className="w-4 h-4" />
                                    {portfolio.isPublished ? 'Yayında' : 'Yayınla'}
                                </button>
                                <button className="px-4 py-2 rounded-xl bg-white/10 flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Önizle
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {[
                        { id: 'profile', label: 'Profil', icon: <Edit className="w-4 h-4" /> },
                        { id: 'theme', label: 'Tema', icon: <Palette className="w-4 h-4" /> },
                        { id: 'projects', label: 'Projeler', icon: <FolderOpen className="w-4 h-4" /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${activeTab === tab.id
                                ? 'text-pink-400 border-b-2 border-pink-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {/* Import from CV */}
                            {cvs?.length > 0 && (
                                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-pink-400">CV'den İçe Aktar</h4>
                                            <p className="text-xs text-gray-400">Bilgilerinizi CV'nizden çekin</p>
                                        </div>
                                        <select
                                            onChange={(e) => handleImportFromCV(e.target.value)}
                                            className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-sm"
                                        >
                                            <option value="">CV Seç...</option>
                                            {cvs.map(cv => (
                                                <option key={cv.id} value={cv.id}>{cv.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Profile Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">İsim</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Adınız Soyadınız"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-pink-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Ünvan</label>
                                    <input
                                        type="text"
                                        value={profileData.title}
                                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                        placeholder="Frontend Developer"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-pink-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Hakkında</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Kendinizi tanıtın..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-pink-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <h4 className="font-medium mb-4">Sosyal Medya</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">GitHub</label>
                                            <input
                                                type="text"
                                                value={profileData.github}
                                                onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                                                placeholder="username"
                                                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
                                            <input
                                                type="text"
                                                value={profileData.linkedin}
                                                onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                                                placeholder="username"
                                                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Twitter</label>
                                            <input
                                                type="text"
                                                value={profileData.twitter}
                                                onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                                                placeholder="username"
                                                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    {portfolio ? 'Değişiklikleri Kaydet' : 'Portfolio Oluştur'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Theme Tab */}
                    {activeTab === 'theme' && (
                        <div className="space-y-6">
                            <h3 className="font-bold">Tema Seçin</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.values(PORTFOLIO_THEMES).map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => updatePortfolio?.({ theme: theme.id })}
                                        className={`p-4 rounded-xl text-left transition-all ${portfolio?.theme === theme.id
                                            ? 'ring-2 ring-pink-500'
                                            : 'hover:bg-white/5'
                                            }`}
                                        style={{ backgroundColor: theme.bgColor + '40' }}
                                    >
                                        <div
                                            className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
                                            style={{ backgroundColor: theme.bgColor }}
                                        >
                                            <div
                                                className="w-16 h-3 rounded-full"
                                                style={{ backgroundColor: theme.primaryColor }}
                                            />
                                        </div>
                                        <div className="font-medium">{theme.name}</div>
                                        <div className="text-sm text-gray-400">{theme.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">Projelerim</h3>
                                <button
                                    onClick={() => setShowAddProject(true)}
                                    className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Proje Ekle
                                </button>
                            </div>

                            {/* Add Project Form */}
                            {showAddProject && (
                                <div className="p-4 rounded-xl bg-white/5 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                            placeholder="Proje Adı"
                                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                                        />
                                        <select
                                            value={newProject.category}
                                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                                        >
                                            {Object.entries(PROJECT_CATEGORIES).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        placeholder="Proje açıklaması..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none resize-none"
                                    />
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={newProject.liveUrl}
                                            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                            placeholder="Canlı URL (https://...)"
                                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={newProject.githubUrl}
                                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                            placeholder="GitHub URL"
                                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={newProject.technologies}
                                        onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                        placeholder="Teknolojiler (virgülle ayırın): React, Node.js, PostgreSQL"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowAddProject(false)}
                                            className="flex-1 py-3 rounded-xl bg-white/10"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={handleAddProject}
                                            className="flex-1 py-3 rounded-xl bg-pink-500 text-white"
                                        >
                                            Ekle
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Project List */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {userProjects.map(project => (
                                    <div key={project.id} className="p-4 rounded-xl bg-white/5 group">
                                        <div className="aspect-video bg-white/10 rounded-lg mb-3 flex items-center justify-center">
                                            <Image className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-medium">{project.title}</h4>
                                                <span className="text-xs text-gray-400">
                                                    {PROJECT_CATEGORIES[project.category]}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteProject?.(project.id)}
                                                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                                        {project.technologies?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {project.technologies.map((tech, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener"
                                                    className="flex items-center gap-1 text-xs text-cyan-400"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> Demo
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener"
                                                    className="flex items-center gap-1 text-xs text-gray-400"
                                                >
                                                    <Github className="w-3 h-3" /> Kod
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {userProjects.length === 0 && !showAddProject && (
                                <div className="text-center py-12 text-gray-500">
                                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Henüz proje eklemediniz</p>
                                    <button
                                        onClick={() => setShowAddProject(true)}
                                        className="mt-3 px-4 py-2 rounded-lg bg-pink-500/20 text-pink-400 text-sm"
                                    >
                                        İlk Projeyi Ekle
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                        {portfolio?.views > 0 && `${portfolio.views} görüntülenme`}
                    </div>
                    <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white/10">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    )
}

