// Translations Page
import { useState } from 'react'
import { Globe, Search, Plus, Edit, Check, X, Languages, Save } from 'lucide-react'

const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', progress: 100 },
    { code: 'en', name: 'English', flag: '🇬🇧', progress: 85 },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', progress: 60 },
    { code: 'fr', name: 'Français', flag: '🇫🇷', progress: 45 },
    { code: 'es', name: 'Español', flag: '🇪🇸', progress: 30 }
]

const translations = {
    tr: { 'welcome': 'Hoş Geldiniz', 'login': 'Giriş Yap', 'register': 'Kayıt Ol', 'create_cv': 'CV Oluştur', 'download': 'İndir' },
    en: { 'welcome': 'Welcome', 'login': 'Login', 'register': 'Register', 'create_cv': 'Create CV', 'download': 'Download' },
    de: { 'welcome': 'Willkommen', 'login': 'Anmelden', 'register': 'Registrieren', 'create_cv': 'Lebenslauf erstellen', 'download': 'Herunterladen' }
}

export default function TranslationsPage() {
    const [selectedLang, setSelectedLang] = useState('tr')
    const [searchQuery, setSearchQuery] = useState('')
    const [editingKey, setEditingKey] = useState(null)
    const [editValue, setEditValue] = useState('')

    const currentTranslations = translations[selectedLang] || {}
    const keys = Object.keys(translations.tr)

    const filteredKeys = keys.filter(key =>
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currentTranslations[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (key) => {
        setEditingKey(key)
        setEditValue(currentTranslations[key] || '')
    }

    const handleSave = () => {
        // Save to backend
        setEditingKey(null)
    }

    return (
        <div className="space-y-6">
            {/* Languages */}
            <div className="grid grid-cols-5 gap-4">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setSelectedLang(lang.code)}
                        className={`glass-card rounded-xl p-4 text-left transition-all ${selectedLang === lang.code ? 'ring-2 ring-cyan-500' : ''
                            }`}
                    >
                        <div className="text-2xl mb-2">{lang.flag}</div>
                        <div className="font-medium text-sm">{lang.name}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                                    style={{ width: `${lang.progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-400">{lang.progress}%</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Çeviri ara..."
                        className="input-field pl-9 w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Yeni Anahtar
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-medium flex items-center gap-2">
                        <Save className="w-4 h-4" /> Kaydet
                    </button>
                </div>
            </div>

            {/* Translations Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 w-1/4">Anahtar</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 w-1/3">Türkçe (Referans)</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">
                                {languages.find(l => l.code === selectedLang)?.flag} {languages.find(l => l.code === selectedLang)?.name}
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 w-20">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredKeys.map(key => (
                            <tr key={key} className="border-t border-white/10 hover:bg-white/5">
                                <td className="px-4 py-3">
                                    <code className="px-2 py-1 bg-white/5 rounded text-xs">{key}</code>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-400">{translations.tr[key]}</td>
                                <td className="px-4 py-3">
                                    {editingKey === key ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="input-field w-full"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className={currentTranslations[key] ? '' : 'text-amber-400 italic'}>
                                            {currentTranslations[key] || 'Çevrilmedi'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingKey === key ? (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={handleSave}
                                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingKey(null)}
                                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(key)}
                                            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
