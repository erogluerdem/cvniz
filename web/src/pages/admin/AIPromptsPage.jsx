import { useState, useEffect } from 'react'
import { Sparkles, Edit2, Play, Save, History, Plus, Trash2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/admin/Modal'

export default function AIPromptsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [showModal, setShowModal] = useState(false)
    const [prompts, setPrompts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingPrompt, setEditingPrompt] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        type: 'System',
        version: 'v1.0',
        content: '',
        active: true
    })

    useEffect(() => {
        fetchPrompts()
    }, [])

    const fetchPrompts = async () => {
        try {
            const res = await adminAPI.getAIPrompts()
            if (res.success) {
                setPrompts(res.prompts)
            }
        } catch (error) {
            toast.error('AI Promptleri yüklenemedi')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (prompt = null) => {
        if (prompt) {
            setEditingPrompt(prompt)
            setFormData({
                name: prompt.name || '',
                type: prompt.type || 'System',
                version: prompt.version || 'v1.0',
                content: prompt.content || '',
                active: prompt.active ?? true
            })
        } else {
            setEditingPrompt(null)
            setFormData({
                name: '',
                type: 'System',
                version: 'v1.0',
                content: '',
                active: true
            })
        }
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingPrompt) {
                const res = await adminAPI.updateAIPrompt(editingPrompt._id, formData)
                if (res.success) {
                    setPrompts(prompts.map(p => p._id === editingPrompt._id ? res.prompt : p))
                    toast.success('AI Prompt güncellendi')
                }
            } else {
                const res = await adminAPI.createAIPrompt(formData)
                if (res.success) {
                    setPrompts([res.prompt, ...prompts])
                    toast.success('Yeni AI Prompt eklendi')
                }
            }
            setShowModal(false)
        } catch (error) {
            toast.error('İşlem başarısız')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bu promptu silmek istediğinize emin misiniz?')) return
        try {
            const res = await adminAPI.deleteAIPrompt(id)
            if (res.success) {
                setPrompts(prompts.filter(p => p._id !== id))
                toast.success('AI Prompt silindi')
            }
        } catch (error) {
            toast.error('Silme işlemi başarısız')
        }
    }


    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>AI Prompt Laboratuvarı</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Yapay zeka modellerinin komutlarını ve davranışlarını yönetin.</p>
                </div>
                <button 
                  onClick={() => openModal()}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Prompt
                </button>
            </div>

            <div className={`rounded-2xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/5'}`}>
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="text-center py-8 text-slate-500">Yükleniyor...</div>
                        ) : prompts.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">Kayıtlı prompt bulunamadı.</div>
                        ) : prompts.map((prompt) => (
                            <div key={prompt._id} className={`flex items-center justify-between p-4 rounded-xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${isDayMode ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{prompt.name}</h3>
                                        <div className={`flex items-center gap-3 text-xs mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-white/10">{prompt.type}</span>
                                            <span>Sürüm: {prompt.version}</span>
                                            <span>Güncelleme: {new Date(prompt.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium mr-4 ${prompt.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                        {prompt.active ? 'Aktif' : 'Taslak'}
                                    </div>
                                    <button onClick={() => openModal(prompt)} className={`p-2 rounded-lg transition-colors ${isDayMode ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-gray-400'}`}>
                                        <Edit2 className="w-4 h-4 text-cyan-500" />
                                    </button>
                                    <button onClick={() => handleDelete(prompt._id)} className={`p-2 rounded-lg transition-colors ${isDayMode ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-gray-400'}`}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingPrompt ? "Prompt Düzenle" : "Yeni Prompt Oluştur"}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Prompt Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="örn: Özgeçmiş İnceleyici"
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Türü</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                    isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                                }`}
                            >
                                <option value="System">System</option>
                                <option value="User">User</option>
                                <option value="Assistant">Assistant</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Sürüm</label>
                            <input
                                type="text"
                                required
                                value={formData.version}
                                onChange={(e) => setFormData({...formData, version: e.target.value})}
                                className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                    isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                                }`}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Sistem Promptu</label>
                        <textarea
                            rows={4}
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            placeholder="Sen bir kariyer danışmanısın..."
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none resize-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="active-prompt"
                            checked={formData.active}
                            onChange={(e) => setFormData({...formData, active: e.target.checked})}
                            className="rounded text-cyan-500 focus:ring-cyan-500"
                        />
                        <label htmlFor="active-prompt" className={`text-sm ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>Aktif (Kullanımda)</label>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className={`flex-1 py-3 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all border ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex-1 py-3 rounded-2xl text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg ${isDayMode ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:scale-[1.02] active:scale-95'}`}
                        >
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
