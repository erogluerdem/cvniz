import { useState, useEffect} from 'react'
import { Plus, Trash2, Play, Pause, BarChart2, Activity, Users, Target, RefreshCw} from 'lucide-react'
import { abTestAPI} from '../../services/api'
import { motion, AnimatePresence} from 'framer-motion'

export default function ABTestsPage() {
 const [tests, setTests] = useState([])
 const [loading, setLoading] = useState(true)
 const [showCreateModal, setShowCreateModal] = useState(false)

 // New Test Form State
 const [newTest, setNewTest] = useState({
 name: '',
 key: '',
 status: 'draft',
 variants: [
 { name: 'Control', value: '', trafficAllocation: 50},
 { name: 'Variant A', value: '', trafficAllocation: 50}
 ]
})

 useEffect(() => {
 fetchTests()
}, [])

 const fetchTests = async () => {
 setLoading(true)
 try {
 const response = await abTestAPI.getAll()
 if (response.success) {
 setTests(response.tests)
}
} catch (error) {
 console.error('Fetch tests failed', error)
} finally {
 setLoading(false)
}
}

 const handleCreate = async () => {
 try {
 const response = await abTestAPI.create(newTest)
 if (response.success) {
 setShowCreateModal(false)
 fetchTests()
 // Reset form
 setNewTest({
 name: '',
 key: '',
 status: 'draft',
 variants: [
 { name: 'Control', value: '', trafficAllocation: 50},
 { name: 'Variant A', value: '', trafficAllocation: 50}
 ]
})
}
} catch (error) {
 alert('Hata: ' + error.message)
}
}

 const handleDelete = async (id) => {
 if (!window.confirm('Bu testi silmek istediğinize emin misiniz?')) return;
 try {
 await abTestAPI.delete(id)
 fetchTests()
} catch (error) {
 alert('Silme hatası')
}
}

 const toggleStatus = async (test) => {
 try {
 const newStatus = test.status === 'active' ? 'paused' : 'active'
 await abTestAPI.update(test._id, { status: newStatus})
 fetchTests()
} catch (error) {
 console.error(error)
}
}

 const calculateRate = (views, conversions) => {
 if (!views) return '0.0%'
 return ((conversions / views) * 100).toFixed(1) + '%'
}

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-bold text-white flex items-center gap-3">
 <Activity className="w-6 h-6 text-cyan-400" />
 A/B Testleri
 </h2>
 <p className="text-gray-400 text-sm">Deneyler oluşturun ve en iyi sonucu vereni bulun.</p>
 </div>
 <button
 onClick={() => setShowCreateModal(true)}
 className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
 >
 <Plus className="w-4 h-4" />
 Yeni Test
 </button>
 </div>

 {loading ? (
 <div className="text-center py-20 text-gray-500">Yükleniyor...</div>
 ) : tests.length === 0 ? (
 <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
 <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
 <h3 className="text-lg font-bold text-white">Henüz test yok</h3>
 <p className="text-gray-500">İlk A/B testinizi oluşturarak başlayın.</p>
 </div>
 ) : (
 <div className="grid gap-6">
 {tests.map(test => (
 <div key={test._id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
 <div className="flex items-start justify-between mb-6">
 <div>
 <h3 className="text-lg font-bold text-white flex items-center gap-3">
 {test.name}
 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${test.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-500'
}`}>
 {test.status}
 </span>
 </h3>
 <code className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded mt-1 inline-block">
 Key: {test.key}
 </code>
 </div>
 <div className="flex gap-2">
 <button
 onClick={() => toggleStatus(test)}
 className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
 title={test.status === 'active' ? 'Duraklat' : 'Başlat'}
 >
 {test.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
 </button>
 <button
 onClick={() => handleDelete(test._id)}
 className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Variants Table */}
 <div className="bg-black/20 rounded-xl overflow-hidden">
 <table className="w-full text-sm text-left">
 <thead className="bg-white/5 text-gray-400 uppercase text-xs">
 <tr>
 <th className="px-4 py-3">Varyasyon</th>
 <th className="px-4 py-3">Değer</th>
 <th className="px-4 py-3 text-right">Trafik</th>
 <th className="px-4 py-3 text-right">Görüntüleme</th>
 <th className="px-4 py-3 text-right">Dönüşüm</th>
 <th className="px-4 py-3 text-right">Oran</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {test.variants.map((v, idx) => (
 <tr key={idx} className="hover:bg-white/5">
 <td className="px-4 py-3 font-medium text-white">{v.name}</td>
 <td className="px-4 py-3 text-gray-400 truncate max-w-[150px]">{JSON.stringify(v.value)}</td>
 <td className="px-4 py-3 text-right text-gray-400">{v.trafficAllocation}%</td>
 <td className="px-4 py-3 text-right text-white font-mono">{v.views}</td>
 <td className="px-4 py-3 text-right text-emerald-400 font-mono">{v.conversions}</td>
 <td className="px-4 py-3 text-right font-bold text-white">
 {calculateRate(v.views, v.conversions)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Create Modal */}
 <AnimatePresence>
 {showCreateModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
 <motion.div
 initial={{ scale: 0.9, opacity: 0}}
 animate={{ scale: 1, opacity: 1}}
 exit={{ scale: 0.9, opacity: 0}}
 className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl"
 >
 <h3 className="text-xl font-bold text-white mb-6">Yeni A/B Testi</h3>

 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Test Adı</label>
 <input
 type="text"
 value={newTest.name}
 onChange={e => setNewTest({ ...newTest, name: e.target.value})}
 className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
 placeholder="Örn: Landing Header Rengi"
 />
 </div>
 <div>
 <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Key (Kod)</label>
 <input
 type="text"
 value={newTest.key}
 onChange={e => setNewTest({ ...newTest, key: e.target.value})}
 className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
 placeholder="landing_header_color"
 />
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-xs text-gray-500 font-bold uppercase block">Varyasyonlar</label>
 {newTest.variants.map((v, i) => (
 <div key={i} className="flex gap-3">
 <input
 type="text"
 value={v.name}
 readOnly={i === 0} // Control is fixed usually, but let's allow edit if needed. For now simple.
 onChange={e => {
 const vars = [...newTest.variants]
 vars[i].name = e.target.value
 setNewTest({ ...newTest, variants: vars})
}}
 className="w-1/3 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
 placeholder="İsim"
 />
 <input
 type="text"
 value={v.value}
 onChange={e => {
 const vars = [...newTest.variants]
 vars[i].value = e.target.value
 setNewTest({ ...newTest, variants: vars})
}}
 className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white"
 placeholder="Değer (String/JSON)"
 />
 <input
 type="number"
 value={v.trafficAllocation}
 onChange={e => {
 const vars = [...newTest.variants]
 vars[i].trafficAllocation = parseInt(e.target.value)
 setNewTest({ ...newTest, variants: vars})
}}
 className="w-20 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-center"
 placeholder="%"
 />
 </div>
 ))}
 </div>
 </div>

 <div className="flex justify-end gap-3 mt-8">
 <button
 onClick={() => setShowCreateModal(false)}
 className="px-4 py-2 text-gray-400 hover:text-white"
 >
 İptal
 </button>
 <button
 onClick={handleCreate}
 className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold"
 >
 Oluştur
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 )
}
