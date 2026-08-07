import { useState } from 'react'
import { Sparkles, Edit2, Play, Save, History, Plus } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Modal from '../../components/admin/Modal'

export default function AIPromptsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [showModal, setShowModal] = useState(false)
    const [prompts, setPrompts] = useState([
        { id: 1, name: 'CV Generator', type: 'System', version: 'v2.4', lastUpdated: '2 gün önce', active: true },
        { id: 2, name: 'Cover Letter', type: 'User', version: 'v1.1', lastUpdated: '1 hafta önce', active: true },
        { id: 3, name: 'Interview Coach', type: 'System', version: 'v3.0', lastUpdated: 'Bugün', active: false },
    ])

    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>AI Prompt Laboratuvarı</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Yapay zeka modellerinin komutlarını ve davranışlarını yönetin.</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Prompt
                </button>
            </div>

            <div className={`rounded-2xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/5'}`}>
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {prompts.map((prompt) => (
                            <div key={prompt.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${isDayMode ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{prompt.name}</h3>
                                        <div className={`flex items-center gap-3 text-xs mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                            <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-white/10">{prompt.type}</span>
                                            <span>Sürüm: {prompt.version}</span>
                                            <span>Güncelleme: {prompt.lastUpdated}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium mr-4 ${prompt.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                        {prompt.active ? 'Aktif' : 'Taslak'}
                                    </div>
                                    <button className={`p-2 rounded-lg transition-colors ${isDayMode ? 'hover:bg-slate-200' : 'hover:bg-white/10'}`}>
                                        <Play className="w-4 h-4 text-emerald-500" />
                                    </button>
                                    <button className={`p-2 rounded-lg transition-colors ${isDayMode ? 'hover:bg-slate-200' : 'hover:bg-white/10'}`}>
                                        <Edit2 className="w-4 h-4 text-cyan-500" />
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
                title="Yeni Prompt Oluştur"
                isDayMode={isDayMode}
            >
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Prompt Adı</label>
                        <input
                            type="text"
                            placeholder="örn: Özgeçmiş İnceleyici"
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Sistem Promptu</label>
                        <textarea
                            rows={4}
                            placeholder="Sen bir kariyer danışmanısın..."
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none resize-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
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
                            type="button"
                            className={`flex-1 py-3 rounded-2xl text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg ${isDayMode ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:scale-[1.02] active:scale-95'}`}
                        >
                            Kaydet
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
