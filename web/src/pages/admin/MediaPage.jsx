import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Image as ImageIcon, Upload, Trash2, Download, Search,
  Grid, List, File, X, Filter, MoreVertical,
  CheckCircle2, AlertCircle, Loader2, FileText,
  Plus, HardDrive, Layout, ChevronRight
} from 'lucide-react'
import { mediaAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function MediaPage() {
  const { toast, confirm } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [media, setMedia] = useState([])
 const [loading, setLoading] = useState(true)
 const [uploading, setUploading] = useState(false)
 const [uploadProgress, setUploadProgress] = useState(0)
 const [viewMode, setViewMode] = useState('grid')
 const [searchQuery, setSearchQuery] = useState('')
 const [selectedItems, setSelectedItems] = useState([])
 const [showUploadModal, setShowUploadModal] = useState(false)
 const [activeFilter, setActiveFilter] = useState('all') // all, image, document, other
 const fileInputRef = useRef(null)

 useEffect(() => {
 fetchMedia()
}, [])

 const fetchMedia = async () => {
 setLoading(true)
 try {
 const response = await mediaAPI.getAll()
 if (response.success) {
 setMedia(response.media)
}
} catch (error) {
 console.error('Media fetch error:', error)
} finally {
 setLoading(false)
}
}

 const handleUpload = async (e) => {
 const file = e.target.files[0]
 if (!file) return

 const formData = new FormData()
 formData.append('file', file)

 setUploading(true)
 setUploadProgress(0)

 try {
 const response = await mediaAPI.upload(formData, (progress) => {
 setUploadProgress(progress)
})

 if (response.success) {
 setMedia(prev => [response.media, ...prev])
 setShowUploadModal(false)
 // Success toast or notification could be added here
}
} catch (error) {
 toast.error('Yükleme hatası: ' + error.message)
} finally {
 setUploading(false)
 setUploadProgress(0)
 if (fileInputRef.current) fileInputRef.current.value = ''
}
}

 const handleDelete = async (id) => {
 const confirmed = await confirm({
 title: 'Dosyayı Sil',
 message: 'Bu dosyayı kalıcı olarak silmek istediğinize emin misiniz?',
 confirmText: 'Evet, Sil',
 type: 'danger'
})
 if (!confirmed) return

 try {
 const response = await mediaAPI.delete(id)
 if (response.success) {
 setMedia(prev => prev.filter(m => m._id !== id))
 setSelectedItems(prev => prev.filter(item => item !== id))
 toast.success('Dosya silindi.')
}
} catch (error) {
 toast.error('Silme hatası: ' + error.message)
}
}

 const handleBulkDelete = async () => {
 const confirmed = await confirm({
 title: 'Toplu Silme',
 message:`${selectedItems.length} dosyayı kalıcı olarak silmek istediğinize emin misiniz?`,
 confirmText:`Evet, ${selectedItems.length} Dosyayı Sil`,
 type: 'danger'
})
 if (!confirmed) return

 for (const id of selectedItems) {
 try {
 await mediaAPI.delete(id)
 setMedia(prev => prev.filter(m => m._id !== id))
} catch (error) {
 console.error(`Error deleting ${id}:`, error)
}
}
 setSelectedItems([])
 toast.success(`${selectedItems.length} dosya silindi.`)
}

 const toggleSelect = (id) => {
 setSelectedItems(prev =>
 prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
 )
}

 const filteredMedia = media.filter(m => {
 const matchesSearch = m.originalName.toLowerCase().includes(searchQuery.toLowerCase())
 const matchesFilter = activeFilter === 'all' || m.category === activeFilter
 return matchesSearch && matchesFilter
})

 const formatSize = (bytes) => {
 if (bytes === 0) return '0 Bytes'
 const k = 1024
 const sizes = ['Bytes', 'KB', 'MB', 'GB']
 const i = Math.floor(Math.log(bytes) / Math.log(k))
 return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

 const stats = {
 total: media.length,
 images: media.filter(m => m.category === 'image').length,
 documents: media.filter(m => m.category === 'document').length,
 totalSize: formatSize(media.reduce((acc, curr) => acc + curr.size, 0))
}

  if (loading && media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
          <HardDrive className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className={`font-semibold uppercase tracking-wider text-xs mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Medya Kütüphanesi</h3>
          <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Dosyalar taranıyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-semibold mb-1 uppercase flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/20">
              <Layout className="w-6 h-6 text-purple-500" />
            </div>
            Medya Merkezi
          </h2>
          <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Bütün görseller ve dökümanlar tek bir merkezde.</p>
        </div>
        <div className="flex gap-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-red-500/5"
            >
              <Trash2 className="w-4 h-4" /> SEÇİLENLERİ SİL ({selectedItems.length})
            </button>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
          >
            <Upload className="w-5 h-5" /> YÜKLE
          </button>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOPLAM DOSYA', value: stats.total, icon: <File className="w-4 h-4" />, color: 'cyan' },
          { label: 'GÖRSELLER', value: stats.images, icon: <ImageIcon className="w-4 h-4" />, color: 'purple' },
          { label: 'DOKÜMANLAR', value: stats.documents, icon: <FileText className="w-4 h-4" />, color: 'green' },
          { label: 'DEPOLAMA', value: stats.totalSize, icon: <HardDrive className="w-4 h-4" />, color: 'amber' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-3xl p-5 border relative overflow-hidden group ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl -z-10`}></div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
            </div>
            <div className={`text-2xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={`rounded-2xl p-4 border flex flex-col md:flex-row items-center justify-between gap-4 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dosya adıyla ara..."
              className={`border rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-cyan-500/30 transition-all w-full md:w-80 font-medium ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/5 text-white'}`}
            />
          </div>
          <div className={`flex rounded-2xl p-1 border ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : (isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-500 hover:text-gray-300')}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : (isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-500 hover:text-gray-300')}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {[
            { id: 'all', label: 'HEPSİ', icon: <Filter className="w-3 h-3" /> },
            { id: 'image', label: 'GÖRSELLER', icon: <ImageIcon className="w-3 h-3" /> },
            { id: 'document', label: 'DOKÜMANLAR', icon: <FileText className="w-3 h-3" /> },
            { id: 'other', label: 'DİĞER', icon: <File className="w-3 h-3" /> }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all border ${activeFilter === filter.id
                  ? (isDayMode ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white/10 border-white/20 text-white')
                  : (isDayMode ? 'bg-transparent border-transparent text-slate-500 hover:text-slate-900' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300')
                }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMedia.map(item => (
            <div
              key={item._id}
              className={`rounded-2xl p-3 transition-all border relative group ${isDayMode ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300' : 'glass-card border-white/5 hover:border-white/20'} ${selectedItems.includes(item._id)
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : ''
                }`}
            >
              {/* Selection Overlay */}
              <button
                onClick={() => toggleSelect(item._id)}
                className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${selectedItems.includes(item._id)
                    ? 'bg-cyan-500 border-cyan-500 text-white scale-110'
                    : 'bg-black/20 border-white/20 opacity-0 group-hover:opacity-100'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>

              {/* Preview Area */}
              <div className={`aspect-square rounded-[2rem] overflow-hidden relative mb-4 flex items-center justify-center ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                {item.category === 'image' ? (
                  <img
                    src={item.path}
                    alt={item.originalName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-cyan-500/50" />
                    <span className="text-xs font-semibold text-cyan-500/40 uppercase">{item.mimetype.split('/')[1]}</span>
                  </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                  <a
                    href={item.path}
                    download={item.originalName}
                    className="p-3 rounded-2xl bg-white/10 text-white hover:bg-cyan-500 transition-all hover:scale-110"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-3 rounded-2xl bg-white/10 text-white hover:bg-red-500 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info Area */}
              <div className="px-2 pb-2">
                <p className={`text-xs font-semibold truncate mb-1 uppercase tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.originalName}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{formatSize(item.size)}</span>
                  <span className={`text-xs font-bold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>#{item.category}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Add New */}
          <button
            onClick={() => setShowUploadModal(true)}
            className={`rounded-2xl aspect-square border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 group ${isDayMode ? 'bg-white border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/50' : 'glass-card border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5'}`}
          >
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 group-hover:text-cyan-600' : 'bg-white/5 text-gray-500 group-hover:text-cyan-400 group-hover:scale-110'}`}>
              <Plus className="w-6 h-6" />
            </div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500 group-hover:text-cyan-600' : 'text-gray-500 group-hover:text-cyan-400'}`}>YENİ EKLE</span>
          </button>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
          <table className="w-full">
            <thead className={isDayMode ? 'bg-slate-50 border-b border-slate-200' : 'bg-white/5'}>
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredMedia.length && filteredMedia.length > 0}
                      onChange={() => {
                        if (selectedItems.length === filteredMedia.length) setSelectedItems([])
                        else setSelectedItems(filteredMedia.map(m => m._id))
                      }}
                      className="w-4 h-4 rounded border-slate-300 dark:border-white/10"
                    />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>DOSYA ADI</span>
                  </div>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>KATEGORİ</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>BOYUT</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>TARİH</th>
                <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className={isDayMode ? 'divide-y divide-slate-100' : 'divide-y divide-white/5'}>
              {filteredMedia.map(item => (
                <tr key={item._id} className={`transition-all group ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelect(item._id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-white/10"
                      />
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-purple-500 ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5'}`}>
                        {item.category === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.originalName}</p>
                        <p className={`text-xs font-medium ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.mimetype}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${item.category === 'image' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'
                      }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>{formatSize(item.size)}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <a href={item.path} download className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-cyan-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-cyan-500 hover:text-white'}`}>
                        <Download className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(item._id)} className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-red-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className={`rounded-2xl p-8 max-w-lg w-full border relative overflow-hidden animate-scale-in ${isDayMode ? 'bg-white border-slate-200 shadow-2xl' : 'glass-card border-white/10'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl -z-10"></div>

            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-2xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>DİNAMİK YÜKLEME</h3>
              <button onClick={() => !uploading && setShowUploadModal(false)} className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {!uploading ? (
              <div
                onClick={() => fileInputRef.current.click()}
                className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50' : 'border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5'}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleUpload}
                />
                <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-all duration-500 shadow-xl border ${isDayMode ? 'bg-white border-slate-200 text-slate-500 group-hover:text-cyan-600' : 'bg-white/5 border-white/5 text-gray-500 group-hover:scale-110 group-hover:text-cyan-400'}`}>
                  <Plus className="w-10 h-10" />
                </div>
                <h4 className={`text-lg font-semibold mb-2 uppercase tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>DOSYAYI BURAYA BIRAKIN</h4>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Yüklemek için tıklayın veya sürükleyin</p>
                <p className={`text-xs font-bold uppercase mt-4 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>MAX: 10MB (PNG, JPG, PDF)</p>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center">
                <div className="relative mb-8">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className={isDayMode ? 'text-slate-200' : 'text-white/5'}
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                      className="text-cyan-500 transition-all duration-300 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{uploadProgress}%</span>
                  </div>
                </div>
                <h4 className={`text-lg font-semibold mb-1 uppercase tracking-tight animate-pulse ${isDayMode ? 'text-slate-900' : 'text-white'}`}>DOSYA İŞLENİYOR</h4>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Bulut sunucuya aktarılıyor, lütfen bekleyin...</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                İPTAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
