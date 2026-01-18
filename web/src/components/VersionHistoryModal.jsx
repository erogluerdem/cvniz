import { useState, useEffect } from 'react'
import { useCV } from '../context/CVContext'
import {
    X, History, RotateCcw, Trash2, Clock, FileText,
    ChevronRight, AlertTriangle, Check, Save, GitBranch
} from 'lucide-react'

export default function VersionHistoryModal({ cvId, cvName, isOpen, onClose, onRestore }) {
    const { getVersions, restoreVersion, deleteVersion, saveVersion } = useCV()
    const [versions, setVersions] = useState([])
    const [saving, setSaving] = useState(false)
    const [newVersionName, setNewVersionName] = useState('')
    const [showSaveInput, setShowSaveInput] = useState(false)
    const [restoring, setRestoring] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        if (isOpen && cvId) {
            loadVersions()
        }
    }, [isOpen, cvId])

    const loadVersions = () => {
        const v = getVersions(cvId)
        setVersions(v.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }

    const handleSaveVersion = async () => {
        if (!newVersionName.trim()) return

        setSaving(true)
        const result = saveVersion(cvId, newVersionName.trim())

        if (result.success) {
            setMessage({ type: 'success', text: 'Versiyon kaydedildi!' })
            setNewVersionName('')
            setShowSaveInput(false)
            loadVersions()
        } else {
            setMessage({ type: 'error', text: result.error })
        }
        setSaving(false)
        setTimeout(() => setMessage(null), 3000)
    }

    const handleRestore = async (versionId) => {
        setRestoring(versionId)
        const result = restoreVersion(cvId, versionId)

        if (result.success) {
            setMessage({ type: 'success', text: 'Versiyon geri yüklendi!' })
            loadVersions()
            if (onRestore) onRestore()
        } else {
            setMessage({ type: 'error', text: result.error })
        }
        setRestoring(null)
        setTimeout(() => setMessage(null), 3000)
    }

    const handleDelete = async (versionId) => {
        setDeleting(versionId)
        const result = deleteVersion(cvId, versionId)

        if (result.success) {
            setMessage({ type: 'success', text: 'Versiyon silindi!' })
            loadVersions()
        } else {
            setMessage({ type: 'error', text: result.error })
        }
        setDeleting(null)
        setTimeout(() => setMessage(null), 3000)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl glass-card rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <GitBranch className="w-6 h-6 text-purple-400" />
                                Versiyon Geçmişi
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">{cvName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                {/* Save New Version */}
                <div className="p-6 border-b border-white/10">
                    {showSaveInput ? (
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newVersionName}
                                onChange={(e) => setNewVersionName(e.target.value)}
                                placeholder="Versiyon adı (örn: İş başvurusu için)"
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
                                autoFocus
                            />
                            <button
                                onClick={handleSaveVersion}
                                disabled={saving || !newVersionName.trim()}
                                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Kaydet
                            </button>
                            <button
                                onClick={() => { setShowSaveInput(false); setNewVersionName('') }}
                                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSaveInput(true)}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-purple-500 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                        >
                            <Save className="w-5 h-5" />
                            Mevcut Durumu Versiyon Olarak Kaydet
                        </button>
                    )}
                </div>

                {/* Version List */}
                <div className="p-6 max-h-[400px] overflow-y-auto">
                    {versions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>Henüz kaydedilmiş versiyon yok</p>
                            <p className="text-sm mt-2">Mevcut durumu kaydetmek için yukarıdaki butonu kullanın</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {versions.map((version, index) => (
                                <div
                                    key={version.id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    {version.name}
                                                    {index === 0 && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">
                                                            En Son
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(version.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleRestore(version.id)}
                                                disabled={restoring === version.id}
                                                className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-1 text-sm"
                                            >
                                                {restoring === version.id ? (
                                                    <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-4 h-4" />
                                                )}
                                                Geri Yükle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(version.id)}
                                                disabled={deleting === version.id}
                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                            >
                                                {deleting === version.id ? (
                                                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    <p className="text-xs text-gray-500 text-center">
                        💡 Versiyon geri yüklendiğinde mevcut durum otomatik olarak kaydedilir
                    </p>
                </div>
            </div>
        </div>
    )
}
