import React, { useState, useEffect } from 'react'
import { 
    Github, ExternalLink, Star, GitFork, Calendar, 
    Loader2, Check, X, RefreshCw, Code2, Activity
} from 'lucide-react'

/**
 * GitHubIntegration - Faz 3: GitHub Entegrasyonu
 * Pinned repo ve activity verilerini getir
 * Projeleri otomatik doldur
 */
export default function GitHubIntegration({
    onImport,
    isDayMode = false,
    isPremium = false,
    onOpenUpsell
}) {
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [repos, setRepos] = useState([])
    const [selectedRepos, setSelectedRepos] = useState([])
    const [error, setError] = useState(null)
    const [step, setStep] = useState('input') // input | loading | select | success

    const fetchRepos = async () => {
        if (!username.trim()) return
        
        if (!isPremium) {
            onOpenUpsell?.()
            return
        }

        setIsLoading(true)
        setError(null)
        setStep('loading')

        try {
            // Fetch from GitHub API
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
            
            if (!response.ok) {
                throw new Error('Kullanıcı bulunamadı')
            }

            const data = await response.json()
            
            // Sort by stars and filter
            const sortedRepos = data
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10)
                .map(repo => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    url: repo.html_url,
                    createdAt: repo.created_at,
                    updatedAt: repo.updated_at,
                    topics: repo.topics || [],
                    homepage: repo.homepage
                }))

            setRepos(sortedRepos)
            setStep('select')
        } catch (err) {
            setError(err.message)
            setStep('input')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleRepo = (repo) => {
        setSelectedRepos(prev => {
            const exists = prev.find(r => r.id === repo.id)
            if (exists) {
                return prev.filter(r => r.id !== repo.id)
            }
            return [...prev, repo]
        })
    }

    const handleImport = () => {
        const projects = selectedRepos.map(repo => ({
            name: repo.name,
            description: repo.description || `${repo.language} projesi - ${repo.stars} yıldız`,
            link: repo.homepage || repo.url,
            github: repo.url,
            technologies: repo.language ? [repo.language, ...repo.topics.slice(0, 3)] : repo.topics.slice(0, 4),
            highlights: [
                `${repo.stars} GitHub yıldızı`,
                `${repo.forks} fork`,
                repo.language && `Ana dil: ${repo.language}`
            ].filter(Boolean)
        }))

        onImport?.(projects)
        setStep('success')
        
        setTimeout(() => {
            setStep('input')
            setSelectedRepos([])
            setRepos([])
            setUsername('')
        }, 2000)
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short'
        })
    }

    if (!isPremium) {
        return (
            <div className={`p-6 rounded-2xl border ${
                isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
            }`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                        <Github className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className={`font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                            GitHub Entegrasyonu
                        </h3>
                        <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            Projelerinizi otomatik içe aktarın
                        </p>
                    </div>
                </div>
                <button
                    onClick={onOpenUpsell}
                    className="w-full py-3 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-colors"
                >
                    Premium ile Aç
                </button>
            </div>
        )
    }

    return (
        <div className={`p-6 rounded-2xl border ${
            isDayMode ? 'bg-white border-slate-200' : 'bg-[#161920] border-white/10'
        }`}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className={`font-bold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                        GitHub Entegrasyonu
                    </h3>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Repo'larınızı projelere dönüştürün
                    </p>
                </div>
            </div>

            {/* Step: Input */}
            {step === 'input' && (
                <div className="space-y-4">
                    <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                        isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                    }`}>
                        <span className={`text-lg ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`}>@</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="GitHub kullanıcı adı"
                            className={`flex-1 bg-transparent outline-none ${
                                isDayMode ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                            }`}
                            onKeyDown={(e) => e.key === 'Enter' && fetchRepos()}
                        />
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <X className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={fetchRepos}
                        disabled={!username.trim() || isLoading}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            username.trim() && !isLoading
                                ? 'bg-slate-800 text-white hover:bg-slate-700'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Repo'lar getiriliyor...
                            </>
                        ) : (
                            <>
                                <Github className="w-4 h-4" />
                                Repo'ları Getir
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Step: Loading */}
            {step === 'loading' && (
                <div className="py-12 text-center">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className={`text-sm ${isDayMode ? 'text-slate-600' : 'text-slate-400'}`}>
                        GitHub profili analiz ediliyor...
                    </p>
                </div>
            )}

            {/* Step: Select */}
            {step === 'select' && (
                <div className="space-y-4">
                    <div className={`flex items-center justify-between pb-3 border-b ${
                        isDayMode ? 'border-slate-100' : 'border-white/10'
                    }`}>
                        <span className={`text-sm ${isDayMode ? 'text-slate-600' : 'text-slate-400'}`}>
                            {repos.length} repo bulundu
                        </span>
                        <button
                            onClick={() => setStep('input')}
                            className={`text-sm flex items-center gap-1 ${
                                isDayMode ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Yenile
                        </button>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                        {repos.map((repo) => {
                            const isSelected = selectedRepos.find(r => r.id === repo.id)
                            return (
                                <button
                                    key={repo.id}
                                    onClick={() => toggleRepo(repo)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                                        isSelected
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : isDayMode
                                                ? 'border-slate-200 hover:border-slate-300 bg-white'
                                                : 'border-white/10 hover:border-white/20 bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                                            isSelected
                                                ? 'bg-cyan-500 border-cyan-500'
                                                : isDayMode ? 'border-slate-300' : 'border-white/30'
                                        }`}>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-bold truncate ${
                                                    isDayMode ? 'text-slate-800' : 'text-white'
                                                }`}>
                                                    {repo.name}
                                                </h4>
                                                {repo.language && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        isDayMode ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-slate-400'
                                                    }`}>
                                                        {repo.language}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {repo.description && (
                                                <p className={`text-sm line-clamp-2 mb-2 ${
                                                    isDayMode ? 'text-slate-600' : 'text-slate-400'
                                                }`}>
                                                    {repo.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="flex items-center gap-1 text-amber-400">
                                                    <Star className="w-3.5 h-3.5" />
                                                    {repo.stars}
                                                </span>
                                                <span className={`flex items-center gap-1 ${
                                                    isDayMode ? 'text-slate-500' : 'text-slate-500'
                                                }`}>
                                                    <GitFork className="w-3.5 h-3.5" />
                                                    {repo.forks}
                                                </span>
                                                <span className={`flex items-center gap-1 ${
                                                    isDayMode ? 'text-slate-400' : 'text-slate-500'
                                                }`}>
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(repo.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                            onClick={() => setStep('input')}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                                isDayMode
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={selectedRepos.length === 0}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                selectedRepos.length > 0
                                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <Check className="w-4 h-4" />
                            {selectedRepos.length} Projeyi Ekle
                        </button>
                    </div>
                </div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
                <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className={`font-bold mb-2 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                        Projeler Eklendi!
                    </h4>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {selectedRepos.length} proje CV'nize eklendi
                    </p>
                </div>
            )}
        </div>
    )
}
