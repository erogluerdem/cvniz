import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCareerPath, CAREER_PATHS, MILESTONE_TYPES } from '../context/CareerPathContext'
import {
    X, Target, Flag, Plus, Check, Trash2, ChevronRight,
    TrendingUp, Calendar, Star, Award, Briefcase, Zap, Crown
} from 'lucide-react'

export default function CareerPathVisualizer({ isOpen, onClose }) {
    const {
        careerPlan, setPath, updateLevel,
        addMilestone, toggleMilestone, deleteMilestone,
        addGoal, updateGoalProgress, deleteGoal,
        getProgress, getNextStage, getUserMilestones, getUserGoals
    } = useCareerPath() || {}

    const [step, setStep] = useState(careerPlan ? 'view' : 'select') // select, view
    const [showAddMilestone, setShowAddMilestone] = useState(false)
    const [showAddGoal, setShowAddGoal] = useState(false)
    const [newMilestone, setNewMilestone] = useState({ title: '', type: 'skill', date: '' })
    const [newGoal, setNewGoal] = useState({ title: '', deadline: '', timeframe: '1year' })

    const milestones = getUserMilestones?.() || []
    const goals = getUserGoals?.() || []
    const nextStage = getNextStage?.()
    const progress = getProgress?.() || 0

    // Select path
    const handleSelectPath = (pathId) => {
        setPath?.(pathId, 1)
        setStep('view')
    }

    // Add milestone
    const handleAddMilestone = () => {
        if (!newMilestone.title) return
        addMilestone?.(newMilestone)
        setNewMilestone({ title: '', type: 'skill', date: '' })
        setShowAddMilestone(false)
    }

    // Add goal
    const handleAddGoal = () => {
        if (!newGoal.title) return
        addGoal?.(newGoal)
        setNewGoal({ title: '', deadline: '', timeframe: '1year' })
        setShowAddGoal(false)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] text-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative"
                >
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-gradient-to-r from-[#10B981]/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <TrendingUp className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                    Kariyer Yol Haritası <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm font-medium text-gray-400">
                                    {step === 'select' && 'Kariyer hedefinizi ve yönünüzü seçin'}
                                    {step === 'view' && <span className="text-[#10B981]">{careerPlan?.pathName}</span>}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* Path Selection */}
                            {step === 'select' && (
                                <motion.div 
                                    key="select"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid md:grid-cols-2 gap-4"
                                >
                                    {Object.entries(CAREER_PATHS).map(([key, path]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSelectPath(key)}
                                            className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-[#10B981]/50 text-left transition-all group hover:bg-[#10B981]/5 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/0 to-[#10B981]/0 group-hover:to-[#10B981]/10 transition-colors"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#10B981]/20 transition-colors border border-white/5 group-hover:border-[#10B981]/30 shadow-inner">
                                                        <Briefcase className="w-6 h-6 text-gray-400 group-hover:text-[#10B981] transition-colors" />
                                                    </div>
                                                    <h3 className="font-bold text-lg text-white group-hover:text-[#10B981] transition-colors">{path.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-500 bg-white/5 inline-flex px-3 py-1.5 rounded-xl border border-white/5">
                                                    <span className="text-white">{path.stages.length} Seviye</span>
                                                    <span className="text-[#10B981]">&bull;</span>
                                                    <span className="truncate max-w-[150px]">{path.stages[0].title} → {path.stages[path.stages.length - 1].title}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Path View */}
                            {step === 'view' && careerPlan && (
                                <motion.div 
                                    key="view"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Progress Overview */}
                                    <div className="p-8 rounded-3xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#10B981]/10 transition-colors"></div>
                                        
                                        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-[#10B981]/20 rounded-xl border border-[#10B981]/30">
                                                        <Target className="w-5 h-5 text-[#10B981]" />
                                                    </div>
                                                    <h3 className="font-black text-xl text-white">Genel İlerleme Durumu</h3>
                                                </div>
                                                
                                                {nextStage && (
                                                    <div className="flex items-center gap-2 text-sm mt-3">
                                                        <span className="text-gray-400 font-medium">Sonraki hedefin:</span>
                                                        <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white font-bold inline-flex items-center gap-2">
                                                            {nextStage.title} <Zap className="w-3 h-3 text-amber-400" />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end min-w-[200px]">
                                                <span className="text-4xl font-black text-[#10B981] drop-shadow-md mb-2">{progress}%</span>
                                                <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] relative"
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-3 gap-8">
                                        {/* Career Timeline */}
                                        <div className="lg:col-span-2">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-black text-2xl text-white flex items-center gap-3">
                                                    <Flag className="w-6 h-6 text-[#10B981]" /> Kariyer Yolculuğu
                                                </h3>
                                                <button 
                                                    onClick={() => setStep('select')}
                                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-white/5 flex items-center gap-2"
                                                >
                                                    <RotateCcw className="w-3 h-3" /> Yolu Değiştir
                                                </button>
                                            </div>
                                            
                                            <div className="relative pt-4">
                                                <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#10B981] to-black/20 rounded-full" />
                                                
                                                <div className="space-y-6">
                                                    {careerPlan.stages.map((stage, i) => (
                                                        <div key={i} className="relative pl-16">
                                                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg z-10 ${
                                                                i < careerPlan.currentLevel
                                                                ? 'bg-[#10B981] text-black shadow-[#10B981]/30'
                                                                : i === careerPlan.currentLevel
                                                                    ? 'bg-black border-2 border-[#10B981] text-[#10B981] shadow-[#10B981]/20'
                                                                    : 'bg-black/60 border border-white/10 text-gray-500'
                                                                }`}>
                                                                {i < careerPlan.currentLevel ? (
                                                                    <Check className="w-6 h-6" />
                                                                ) : (
                                                                    <span className="text-lg font-black">{i + 1}</span>
                                                                )}
                                                            </div>
                                                            <div className={`p-5 rounded-3xl border transition-all ${
                                                                i === careerPlan.currentLevel
                                                                ? 'bg-[#10B981]/10 border-[#10B981]/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                                                : 'bg-black/40 border-white/5'
                                                                }`}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className={`font-bold text-lg ${i <= careerPlan.currentLevel ? 'text-white' : 'text-gray-400'}`}>{stage.title}</h4>
                                                                    <span className="px-3 py-1 rounded-xl bg-black/40 border border-white/5 text-xs font-bold text-gray-400 flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" /> {stage.years} Yıl
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="mt-4 flex flex-wrap gap-2">
                                                                    {stage.requirements.map((req, j) => (
                                                                        <span key={j} className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                                                                            i < careerPlan.currentLevel
                                                                            ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                                                                            : i === careerPlan.currentLevel
                                                                                ? 'bg-white/5 text-gray-300 border-white/10'
                                                                                : 'bg-black/40 text-gray-500 border-white/5'
                                                                        }`}>
                                                                            {req}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                
                                                                {i === careerPlan.currentLevel && (
                                                                    <button
                                                                        onClick={() => updateLevel?.(i + 1)}
                                                                        className="mt-5 w-full py-3 rounded-2xl bg-[#10B981] text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-[#059669] transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                                                    >
                                                                        Bu Seviyeye Ulaştım <Award className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Sidebar */}
                                        <div className="space-y-6">
                                            {/* Milestones Panel */}
                                            <div className="p-6 rounded-3xl bg-black/40 border border-white/5 flex flex-col h-[400px]">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                                        <Star className="w-5 h-5 text-amber-400" /> Kendi Kilometre Taşlarım
                                                    </h3>
                                                    <button
                                                        onClick={() => setShowAddMilestone(true)}
                                                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#10B981]/20 hover:text-[#10B981] flex items-center justify-center transition-colors border border-white/5"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                                                    {milestones.length === 0 ? (
                                                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
                                                                <Flag className="w-8 h-8 text-gray-500" />
                                                            </div>
                                                            <p className="text-gray-500 text-sm font-medium">Henüz bir kilometre taşı eklemediniz.</p>
                                                        </div>
                                                    ) : (
                                                        milestones.map((m) => (
                                                            <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 group relative">
                                                                <div className="flex items-start gap-3">
                                                                    <button
                                                                        onClick={() => toggleMilestone?.(m.id)}
                                                                        className={`w-6 h-6 rounded-lg mt-0.5 flex-shrink-0 flex items-center justify-center border transition-all ${
                                                                            m.completed 
                                                                            ? 'bg-[#10B981] border-[#10B981] text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                                                            : 'bg-black border-gray-500 hover:border-[#10B981]'
                                                                        }`}
                                                                    >
                                                                        {m.completed && <Check className="w-4 h-4" />}
                                                                    </button>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className={`font-medium text-sm truncate ${m.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{m.title}</h4>
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-lg border border-[#10B981]/20">
                                                                                {MILESTONE_TYPES[m.type].name}
                                                                            </span>
                                                                            {m.date && <span className="text-[10px] text-gray-500">{new Date(m.date).toLocaleDateString('tr-TR')}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteMilestone?.(m.id)}
                                                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Add Milestone Form */}
                                                <AnimatePresence>
                                                    {showAddMilestone && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="mt-4 pt-4 border-t border-white/10"
                                                        >
                                                            <input
                                                                type="text"
                                                                placeholder="Örn: AWS Sertifikası"
                                                                value={newMilestone.title}
                                                                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] mb-3"
                                                            />
                                                            <div className="flex gap-2 mb-3">
                                                                <select
                                                                    value={newMilestone.type}
                                                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, type: e.target.value }))}
                                                                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981] flex-1"
                                                                >
                                                                    {Object.entries(MILESTONE_TYPES).map(([k, v]) => (
                                                                        <option key={k} value={k}>{v.name}</option>
                                                                    ))}
                                                                </select>
                                                                <input
                                                                    type="date"
                                                                    value={newMilestone.date}
                                                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
                                                                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981] flex-1 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={handleAddMilestone}
                                                                    disabled={!newMilestone.title}
                                                                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-black font-bold text-sm py-2 rounded-xl transition-colors disabled:opacity-50"
                                                                >
                                                                    Ekle
                                                                </button>
                                                                <button
                                                                    onClick={() => setShowAddMilestone(false)}
                                                                    className="px-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm py-2 rounded-xl transition-colors"
                                                                >
                                                                    İptal
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
