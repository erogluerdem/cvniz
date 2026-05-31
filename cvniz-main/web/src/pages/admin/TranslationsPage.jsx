// Translations Page
import { useState, useEffect } from 'react'
import { Globe, Search, Plus, Edit, Check, X, Languages, Save, Trash2, RefreshCw } from 'lucide-react'
import { translationAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
]

export default function TranslationsPage() {
    const { showToast } = useToast()
    const [selectedLang, setSelectedLang] = useState('tr')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [translations, setTranslations] = useState([])

    // Edit state
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')

    // New key state
    const [isAdding, setIsAdding] = useState(false)
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')

    useEffect(() => {
        fetchTranslations()
    }, [])

    const fetchTranslations = async () => {
        setLoading(true)
        try {
            const response = await translationAPI.getAllAdmin()
            if (response.success) {
                setTranslations(response.data)
            }
        } catch (error) {
            console.error('Failed to fetch translations:', error)
            showToast('Çeviriler alınamadı', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Derived state
    // Group translations by key to show side-by-side or just list them
    // For this UI, we want to filter by selected language but also show keys
    const currentLangTranslations = translations.filter(t => t.locale === selectedLang)

    // Get unique keys from all translations to show what might be missing
    const allKeys = [...new Set(translations.map(t => t.key))]

    // Filter display
    const displayedKeys = allKeys.filter(key =>
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (currentLangTranslations.find(t => t.key === key)?.value || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (key, currentValue) => {
        setEditingId(key)
        setEditValue(currentValue || '')
    }

    const handleSave = async (key) => {
        try {
            await translationAPI.upsert({
                locale: selectedLang,
                key: key,
                value: editValue,
                group: 'common' // Default group for now
            })

            showToast('Çeviri kaydedildi', 'success')
            setEditingId(null)
            fetchTranslations()
        } catch (error) {
            showToast('Kaydetme başarısız', 'error')
        }
    }

    const handleAddKey = async () => {
        if (!newKey || !newValue) return

        try {
            await translationAPI.upsert({
                locale: selectedLang,
                key: newKey,
                value: newValue,
                group: 'common'
            })

            showToast('Yeni çeviri eklendi', 'success')
            setIsAdding(false)
            setNewKey('')
            setNewValue('')
            fetchTranslations()
        } catch (error) {
            showToast('Ekleme başarısız', 'error')
        }
    }

    const handleDelete = async (key) => {
        if (!window.confirm('Bu çeviriyi silmek istediğinize emin misiniz?')) return

        // Find translation ID for this key/locale
        const translation = translations.find(t => t.key === key && t.locale === selectedLang)
        if (!translation) return

        try {
            await translationAPI.delete(translation._id)
            showToast('Çeviri silindi', 'success')
            fetchTranslations()
        } catch (error) {
            showToast('Silme işlemi başarısız', 'error')
        }
    }

    const getTranslationValue = (key, langCode) => {
        return translations.find(t => t.key === key && t.locale === langCode)?.value
    }

    // Function to initialize defaults if empty
    const handleInitDefaults = async () => {
        if (!window.confirm('Varsayılan çevirileri yüklemek istediğinize emin misiniz? Mevcut verilerin üzerine yazılabilir.')) return

        // Example defaults
        const defaults = [
            { locale: 'tr', key: 'welcome', value: 'Hoş Geldiniz' },
            { locale: 'en', key: 'welcome', value: 'Welcome' },
            { locale: 'tr', key: 'login', value: 'Giriş Yap' },
            { locale: 'en', key: 'login', value: 'Login' },
            { locale: 'tr', key: 'register', value: 'Kayıt Ol' },
            { locale: 'en', key: 'register', value: 'Register' },
        ]

        try {
            await translationAPI.init(defaults)
            showToast('Varsayılanlar yüklendi', 'success')
            fetchTranslations()
        } catch (error) {
            showToast('Başlatma hatası', 'error')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                    Çeviri Yönetimi
                </h1>
                <button onClick={fetchTranslations} className="p-2 bg-white/5 rounded-lg hover:bg-white/10">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-5 gap-4">
                {languages.map(lang => {
                    // Calculate progress (how many keys translated vs total unique keys)
                    const translatedCount = translations.filter(t => t.locale === lang.code).length
                    const totalKeys = allKeys.length || 1 // Avoid divide by zero
                    const progress = Math.round((translatedCount / totalKeys) * 100)

                    return (
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
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400">{progress}%</span>
                            </div>
                        </button>
                    )
                })}
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
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`px-4 py-2 rounded-xl border transition-colors flex items-center gap-2 ${isAdding ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-gray-400'
                            }`}
                    >
                        {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? 'İptal' : 'Yeni Anahtar'}
                    </button>

                    {allKeys.length === 0 && (
                        <button
                            onClick={handleInitDefaults}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Varsayılanları Yükle
                        </button>
                    )}
                </div>
            </div>

            {/* Add New Key Form */}
            {isAdding && (
                <div className="glass-card p-4 rounded-xl border border-cyan-500/30 flex gap-4 items-end animate-in fade-in slide-in-from-top-4">
                    <div className="flex-1 space-y-1">
                        <label className="text-xs text-gray-400">Anahtar (Key)</label>
                        <input
                            type="text"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            placeholder="örn: homepage.title"
                            className="input-field w-full"
                        />
                    </div>
                    <div className="flex-[2] space-y-1">
                        <label className="text-xs text-gray-400">Değer ({languages.find(l => l.code === selectedLang)?.name})</label>
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="Çeviri metni..."
                            className="input-field w-full"
                        />
                    </div>
                    <button
                        onClick={handleAddKey}
                        disabled={!newKey || !newValue}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Ekle
                    </button>
                </div>
            )}

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
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 w-24">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedKeys.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-500">
                                    {allKeys.length === 0 ? 'Henüz hiç çeviri eklenmemiş.' : 'Aradığınız kriterlere uygun çeviri bulunamadı.'}
                                </td>
                            </tr>
                        ) : (
                            displayedKeys.map(key => {
                                const trValue = getTranslationValue(key, 'tr');
                                const currentValue = getTranslationValue(key, selectedLang);
                                const isEditing = editingId === key;

                                return (
                                    <tr key={key} className="border-t border-white/10 hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <code className="px-2 py-1 bg-white/5 rounded text-xs select-all text-purple-300">{key}</code>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-400 font-light">{trValue || '-'}</td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="input-field w-full text-white bg-black/40 border-cyan-500/50"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSave(key);
                                                        if (e.key === 'Escape') setEditingId(null);
                                                    }}
                                                />
                                            ) : (
                                                <span className={`${currentValue ? 'text-white' : 'text-amber-400 italic text-sm'}`}>
                                                    {currentValue || 'Çeviri yok'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleSave(key)}
                                                        className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                        title="Kaydet"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                        title="İptal"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEdit(key, currentValue)}
                                                        className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                                                        title="Düzenle"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    {currentValue && (
                                                        <button
                                                            onClick={() => handleDelete(key)}
                                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Sil (Sadece Bu Dili)"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
