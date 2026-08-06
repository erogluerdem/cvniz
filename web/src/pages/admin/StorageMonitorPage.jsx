import { useState } from 'react'
import { HardDrive, Cloud, Trash2, ImageIcon, FileText, Database, AlertTriangle } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function StorageMonitorPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    
    // Mock Data
    const totalStorage = 500 // GB
    const usedStorage = 342 // GB
    const percentage = Math.round((usedStorage / totalStorage) * 100)

    return (
        <div className="space-y-8 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight mb-2 flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        <Cloud className="w-8 h-8 text-sky-500" /> Bulut Depolama (S3) Yönetimi
                    </h2>
                    <p className={`text-base ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Kullanıcıların yüklediği görselleri, PDF dosyalarını ve sunucu disk alanını izleyin, gereksiz dosyaları temizleyerek tasarruf edin.
                    </p>
                </div>
            </div>

            {/* Storage Progress */}
            <div className={`p-8 rounded-3xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0F111A] border-white/10'}`}>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Toplam S3 Kullanımı (AWS)</h3>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{usedStorage} GB</span>
                            <span className={`text-lg font-medium ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>/ {totalStorage} GB Limit</span>
                        </div>
                    </div>
                    <div className={`text-2xl font-bold ${percentage > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        %{percentage} Dolu
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className={`w-full h-4 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${percentage > 80 ? 'bg-rose-500' : 'bg-sky-500'}`} 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {percentage > 80 && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-rose-500">
                        <AlertTriangle className="w-4 h-4" /> Depolama limiti dolmak üzere, eski dosyaları temizlemeyi veya kapasiteyi artırmayı düşünün.
                    </div>
                )}
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'CV Profil Fotoğrafları', size: '145 GB', files: '1.2M Dosya', icon: <ImageIcon className="w-6 h-6" />, color: 'purple' },
                    { title: 'Dışa Aktarılan PDF\'ler', size: '120 GB', files: '850K Dosya', icon: <FileText className="w-6 h-6" />, color: 'rose' },
                    { title: 'Veritabanı Yedekleri', size: '77 GB', files: '45 Dosya', icon: <Database className="w-6 h-6" />, color: 'emerald' },
                ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDayMode ? `bg-${item.color}-100 text-${item.color}-600` : `bg-${item.color}-500/20 text-${item.color}-400`}`}>
                            {item.icon}
                        </div>
                        <h4 className={`font-bold mb-1 ${isDayMode ? 'text-slate-800' : 'text-gray-200'}`}>{item.title}</h4>
                        <div className="flex justify-between items-center mt-4">
                            <span className={`text-2xl font-black ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.size}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${isDayMode ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-gray-400'}`}>
                                {item.files}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cleanup Tools */}
            <div className={`rounded-3xl border overflow-hidden ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0F111A] border-white/10'}`}>
                <div className={`p-6 border-b ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <h3 className={`text-lg font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Gereksiz Dosya Temizliği (Garbage Collection)</h3>
                    <p className={`text-sm mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Hiçbir CV'ye bağlı olmayan, silinmiş veya eski geçici dosyaları tespit edip silin.</p>
                </div>
                <div className="p-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${isDayMode ? 'bg-rose-50 text-rose-600' : 'bg-rose-500/10 text-rose-500'}`}>
                            <HardDrive className="w-8 h-8" />
                        </div>
                        <div>
                            <div className={`text-sm font-semibold mb-1 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>Kullanılmayan (Orphan) Görseller</div>
                            <div className={`text-3xl font-black ${isDayMode ? 'text-slate-900' : 'text-white'}`}>12.4 GB <span className="text-sm font-normal text-gray-500 ml-2">Tahmini Kurtarılacak Alan</span></div>
                        </div>
                    </div>
                    <button className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${isDayMode ? 'bg-rose-600 text-white' : 'bg-rose-500 text-white'}`}>
                        <Trash2 className="w-5 h-5" /> 12.4 GB Alanı Temizle
                    </button>
                </div>
            </div>
        </div>
    )
}
