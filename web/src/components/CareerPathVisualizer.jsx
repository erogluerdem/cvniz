import { useState } from 'react'
import { useCareerPath, CAREER_PATHS, MILESTONE_TYPES } from '../context/CareerPathContext'
import {
    X, Target, Flag, Plus, Check, Trash2, ChevronRight,
    TrendingUp, Calendar, Star, Award, Briefcase, Zap
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Kariyer Yol Haritası</h2>
                            <p className="text-sm text-gray-400">
                                {step === 'select' && 'Kariyer yolunuzu seçin'}
                                {step === 'view' && careerPlan?.pathName}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Path Selection */}
                    {step === 'select' && (
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(CAREER_PATHS).map(([key, path]) => (
                                <button
                                    key={key}
                                    onClick={() => handleSelectPath(key)}
                                    className="p-5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30">
                                            <Briefcase className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h3 className="font-bold">{path.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>{path.stages.length} seviye</span>
                                        <span>•</span>
                                        <span>{path.stages[0].title} → {path.stages[path.stages.length - 1].title}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Path View */}
                    {step === 'view' && careerPlan && (
                        <div className="space-y-6">
                            {/* Progress Overview */}
                            <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold">İlerleme Durumu</h3>
                                    <span className="text-2xl font-bold text-indigo-400">{progress}%</span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mb-4">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                {nextStage && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Target className="w-4 h-4 text-amber-400" />
                                        <span className="text-gray-400">Sonraki hedef:</span>
                                        <span className="text-white font-medium">{nextStage.title}</span>
                                    </div>
                                )}
                            </div>

                            {/* Career Timeline */}
                            <div>
                                <h3 className="font-bold mb-4">Kariyer Yolculuğu</h3>
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
                                    {careerPlan.stages.map((stage, i) => (
                                        <div key={i} className="relative pl-10 pb-6">
                                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${i < careerPlan.currentLevel
                                                ? 'bg-green-500'
                                                : i === careerPlan.currentLevel
                                                    ? 'bg-indigo-500 ring-4 ring-indigo-500/30'
                                                    : 'bg-white/20'
                                                }`}>
                                                {i < careerPlan.currentLevel ? (
                                                    <Check className="w-4 h-4 text-white" />
                                                ) : (
                                                    <span className="text-sm font-bold">{i + 1}</span>
                                                )}
                                            </div>
                                            <div className={`p-4 rounded-xl ${i === careerPlan.currentLevel
                                                ? 'bg-indigo-500/20 border border-indigo-500/30'
                                                : 'bg-white/5'
                                                }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{stage.title}</h4>
                                                    <span className="text-xs text-gray-400">{stage.years} yıl</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {stage.skills.map((skill, j) => (
                                                        <span key={j} className="px-2 py-1 rounded-lg bg-white/10 text-xs">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Milestones */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold">Kilometre Taşları</h3>
                                    <button
                                        onClick={() => setShowAddMilestone(true)}
                                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Ekle
                                    </button>
                                </div>

                                {showAddMilestone && (
                                    <div className="p-4 rounded-xl bg-white/5 mb-4 space-y-3">
                                        <input
                                            type="text"
                                            value={newMilestone.title}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                            placeholder="Milestone başlığı..."
                                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                value={newMilestone.type}
                                                onChange={(e) => setNewMilestone({ ...newMilestone, type: e.target.value })}
                                                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                            >
                                                {Object.entries(MILESTONE_TYPES).map(([key, type]) => (
                                                    <option key={key} value={key}>{type.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleAddMilestone}
                                                className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm"
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {milestones.map(m => (
                                        <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl ${m.completed ? 'bg-green-500/10' : 'bg-white/5'}`}>
                                            <button
                                                onClick={() => toggleMilestone?.(m.id)}
                                                className={`w-6 h-6 rounded-full flex items-center justify-center ${m.completed ? 'bg-green-500' : 'bg-white/20'
                                                    }`}
                                            >
                                                {m.completed && <Check className="w-4 h-4" />}
                                            </button>
                                            <div className="flex-1">
                                                <span className={m.completed ? 'text-gray-400 line-through' : ''}>{m.title}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs ${MILESTONE_TYPES[m.type]?.bg} ${MILESTONE_TYPES[m.type]?.color}`}>
                                                {MILESTONE_TYPES[m.type]?.label}
                                            </span>
                                            <button onClick={() => deleteMilestone?.(m.id)} className="p-1 rounded hover:bg-white/10">
                                                <Trash2 className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    ))}
                                    {milestones.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">Henüz milestone yok</p>
                                    )}
                                </div>
                            </div>

                            {/* Goals */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold">Hedefler</h3>
                                    <button
                                        onClick={() => setShowAddGoal(true)}
                                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Ekle
                                    </button>
                                </div>

                                {showAddGoal && (
                                    <div className="p-4 rounded-xl bg-white/5 mb-4 space-y-3">
                                        <input
                                            type="text"
                                            value={newGoal.title}
                                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                            placeholder="Hedef başlığı..."
                                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                value={newGoal.timeframe}
                                                onChange={(e) => setNewGoal({ ...newGoal, timeframe: e.target.value })}
                                                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm"
                                            >
                                                <option value="1year">1 Yıl</option>
                                                <option value="3year">3 Yıl</option>
                                                <option value="5year">5 Yıl</option>
                                            </select>
                                            <button
                                                onClick={handleAddGoal}
                                                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm"
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {goals.map(g => (
                                        <div key={g.id} className="p-4 rounded-xl bg-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{g.title}</span>
                                                <span className="text-xs text-gray-400">
                                                    {g.timeframe === '1year' ? '1 Yıl' : g.timeframe === '3year' ? '3 Yıl' : '5 Yıl'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-500"
                                                        style={{ width: `${g.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-amber-400">{g.progress}%</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={g.progress}
                                                    onChange={(e) => updateGoalProgress?.(g.id, parseInt(e.target.value))}
                                                    className="w-20"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {goals.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">Henüz hedef yok</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between">
                    {step === 'view' && (
                        <button
                            onClick={() => setStep('select')}
                            className="px-6 py-3 rounded-xl bg-white/10"
                        >
                            Yol Değiştir
                        </button>
                    )}
                    <button onClick={onClose} className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold ml-auto">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    )
}
