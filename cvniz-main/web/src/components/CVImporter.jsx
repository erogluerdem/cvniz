import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Upload, FileText, CheckCircle, AlertCircle, Loader2,
    User, Briefcase, GraduationCap, Award, Languages, Sparkles,
    ArrowRight, RefreshCw, Edit3, Eye, ChevronDown, ChevronUp
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { useToast } from '../context/ToastContext'
import { resumeParserAPI } from '../services/api'

const SUPPORTED_FORMATS = [
    { ext: '.docx', label: 'Word (DOCX)' },
    { ext: '.pdf', label: 'PDF' },
    { ext: '.txt', label: 'Metin (TXT)' }
]

export default function CVImporter({ isOpen, onClose, onImport, darkMode }) {
    const { isPremium } = useAuth()
    const { createCV } = useCV()
    const { toast } = useToast()

    const fileInputRef = useRef(null)
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('idle') // idle, uploading, success, error
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState('')
    const [parsedData, setParsedData] = useState(null)
    const [expandedSections, setExpandedSections] = useState({})

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const validateFile = (file) => {
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            throw new Error('Dosya boyutu 10MB\'dan büyük olamaz')
        }

        const ext = file.name.toLowerCase().split('.').pop()
        if (!['docx', 'doc', 'pdf', 'txt'].includes(ext)) {
            throw new Error('Desteklenmeyen dosya formatı. PDF, DOCX veya TXT kullanın.')
        }

        return true
    }

    const processFile = async (selectedFile) => {
        try {
            setFile(selectedFile)
            setStatus('uploading')
            setProgress(30)
            setError('')
            setParsedData(null)

            validateFile(selectedFile)

            // Send to backend for AI parsing
            const response = await resumeParserAPI.upload(selectedFile)

            setProgress(100)

            if (response.success && response.data) {
                setParsedData(response.data)
                setStatus('success')
            } else {
                throw new Error(response.error || 'CV ayrıştırılamadı')
            }

        } catch (err) {
            console.error('Import Error:', err)
            setError(err.message || 'Dosya işlenirken bir hata oluştu')
            setStatus('error')
        }
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }, [])

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
        }
    }

    const handleImport = async () => {
        if (!parsedData) return

        try {
            // Create new CV with parsed data
            const newCV = await createCV({
                name: parsedData.personalInfo?.fullName ? `${parsedData.personalInfo.fullName} CV` : (file?.name || 'İçe Aktarılan CV'),
                data: parsedData,
                template: 'modern',
                metadata: {
                    lastEdited: 'web',
                    importedFrom: file?.name
                }
            })

            toast.success('CV başarıyla içe aktarıldı!')

            if (onImport) {
                onImport(newCV)
            }

            onClose()
        } catch (err) {
            console.error('Import Error:', err)
            toast.error('CV oluşturulurken bir hata oluştu')
        }
    }

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const resetImporter = () => {
        setFile(null)
        setStatus('idle')
        setProgress(0)
        setError('')
        setParsedData(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-2xl transition-colors duration-300`}
                >
                    {/* Header */}
                    <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-100'} backdrop-blur-sm border-b p-6`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Upload className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CV İçe Aktar</h2>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Mevcut CV'nizi yükleyin, biz ayrıştıralım</p>
                                </div>
                            </div>
                            <button onClick={onClose} className={`p-2 ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} rounded-lg transition-colors`}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Upload Area */}
                        {status === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {/* Drag & Drop Zone */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragActive
                                        ? 'border-cyan-500 bg-cyan-500/10'
                                        : darkMode
                                            ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".docx,.doc,.pdf,.txt"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                        <FileText size={40} className="text-cyan-400" />
                                    </div>

                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold mb-2`}>
                                        CV dosyanızı sürükleyin veya tıklayın
                                    </p>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-4`}>
                                        DOCX, PDF veya TXT formatları desteklenir
                                    </p>

                                    <div className="flex justify-center gap-2">
                                        {SUPPORTED_FORMATS.slice(0, 3).map(format => (
                                            <span key={format.ext} className={`px-3 py-1 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'} rounded-full text-xs font-medium`}>
                                                {format.ext}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className={`mt-6 p-4 ${darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-100'} border rounded-xl transition-colors`}>
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="text-blue-500 mt-0.5" size={20} />
                                        <div>
                                            <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-medium text-sm`}>AI Destekli Ayrıştırma</p>
                                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
                                                CV'nizdeki bilgileri otomatik olarak algılar ve düzenlenebilir formata dönüştürür.
                                                İçe aktarma sonrası tüm bilgileri düzenleyebilirsiniz.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Processing State */}
                        {(status === 'uploading' || status === 'parsing') && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                    <Loader2 size={40} className="text-cyan-400 animate-spin" />
                                </div>

                                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {status === 'uploading' ? 'Dosya Yükleniyor...' : 'CV Ayrıştırılıyor...'}
                                </h3>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>{file?.name}</p>

                                {/* Progress Bar */}
                                <div className="max-w-xs mx-auto">
                                    <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full overflow-hidden`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                        />
                                    </div>
                                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs mt-2`}>{progress}%</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Error State */}
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
                                    <AlertCircle size={40} className="text-red-400" />
                                </div>

                                <h3 className="text-white font-semibold mb-2">Hata Oluştu</h3>
                                <p className="text-red-400 text-sm mb-6">{error}</p>

                                <button
                                    onClick={resetImporter}
                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
                                >
                                    <RefreshCw size={18} />
                                    Tekrar Dene
                                </button>
                            </motion.div>
                        )}

                        {/* Success - Preview Parsed Data */}
                        {status === 'success' && parsedData && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {/* Success Header */}
                                <div className={`flex items-center gap-3 mb-6 p-4 ${darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-100'} border rounded-xl`}>
                                    <CheckCircle className="text-green-500" size={24} />
                                    <div>
                                        <p className={`${darkMode ? 'text-green-300' : 'text-green-800'} font-medium`}>CV başarıyla ayrıştırıldı!</p>
                                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Bilgileri kontrol edin ve içe aktarın</p>
                                    </div>
                                </div>

                                {/* Parsed Data Preview */}
                                <div className="space-y-3 mb-6">
                                    {/* Personal Info */}
                                    <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                        <button
                                            onClick={() => toggleSection('personal')}
                                            className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <User size={18} className="text-cyan-400" />
                                                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kişisel Bilgiler</span>
                                                {(parsedData.personalInfo?.fullName || parsedData.personalInfo?.name) && (
                                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>• {parsedData.personalInfo.fullName || parsedData.personalInfo.name}</span>
                                                )}
                                            </div>
                                            {expandedSections.personal ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                        </button>
                                        {expandedSections.personal && (
                                            <div className="p-4 pt-0 grid grid-cols-2 gap-3 text-sm">
                                                {Object.entries(parsedData.personalInfo).filter(([k, v]) => v).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} capitalize`}>{key}: </span>
                                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{value.substring(0, 50)}{value.length > 50 ? '...' : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    {parsedData.summary && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('summary')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Sparkles size={18} className="text-blue-400" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profesyonel Özet</span>
                                                </div>
                                                {expandedSections.summary ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.summary && (
                                                <div className="p-4 pt-0">
                                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                                        {parsedData.summary}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {parsedData.experience.length > 0 && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('experience')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Briefcase size={18} className="text-purple-400" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Deneyim</span>
                                                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'} text-xs rounded-full font-bold`}>
                                                        {parsedData.experience.length}
                                                    </span>
                                                </div>
                                                {expandedSections.experience ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.experience && (
                                                <div className="p-4 pt-0 space-y-2">
                                                    {parsedData.experience.map((exp, i) => (
                                                        <div key={i} className={`text-sm p-3 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-100 text-gray-700'} rounded-lg`}>
                                                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{exp.company}</p>
                                                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>{exp.position} • {exp.startDate} - {exp.endDate}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Education */}
                                    {parsedData.education.length > 0 && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('education')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <GraduationCap size={18} className="text-green-500" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Eğitim</span>
                                                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'} text-xs rounded-full font-bold`}>
                                                        {parsedData.education.length}
                                                    </span>
                                                </div>
                                                {expandedSections.education ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.education && (
                                                <div className="p-4 pt-0 space-y-2">
                                                    {parsedData.education.map((edu, i) => (
                                                        <div key={i} className={`text-sm p-3 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-100 text-gray-700'} rounded-lg`}>
                                                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{edu.school}</p>
                                                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>{edu.degree} {edu.field && `• ${edu.field}`}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {parsedData.skills.length > 0 && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('skills')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Award size={18} className="text-amber-500" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Yetenekler</span>
                                                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'} text-xs rounded-full font-bold`}>
                                                        {parsedData.skills.length}
                                                    </span>
                                                </div>
                                                {expandedSections.skills ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.skills && (
                                                <div className="p-4 pt-0 flex flex-wrap gap-2">
                                                    {parsedData.skills.map((skill, i) => (
                                                        <span key={i} className={`px-3 py-1 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'} text-sm rounded-full font-medium shadow-sm`}>
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {parsedData.languages?.length > 0 && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('languages')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Languages size={18} className="text-indigo-500" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Diller</span>
                                                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} text-xs rounded-full font-bold`}>
                                                        {parsedData.languages.length}
                                                    </span>
                                                </div>
                                                {expandedSections.languages ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.languages && (
                                                <div className="p-4 pt-0 flex flex-wrap gap-2">
                                                    {parsedData.languages.map((lang, i) => (
                                                        <span key={i} className={`px-3 py-1 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'} text-sm rounded-full font-medium shadow-sm`}>
                                                            {lang.language} • {lang.level}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Projects */}
                                    {parsedData.projects?.length > 0 && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('projects')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText size={18} className="text-cyan-500" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Projeler</span>
                                                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'} text-xs rounded-full font-bold`}>
                                                        {parsedData.projects.length}
                                                    </span>
                                                </div>
                                                {expandedSections.projects ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.projects && (
                                                <div className="p-4 pt-0 space-y-2">
                                                    {parsedData.projects.map((proj, i) => (
                                                        <div key={i} className={`text-sm p-3 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-100 text-gray-700'} rounded-lg`}>
                                                            <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{proj.name}</p>
                                                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>{proj.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Certifications */}
                                    {parsedData.certifications?.length > 0 && (
                                        <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-xl border overflow-hidden`}>
                                            <button
                                                onClick={() => toggleSection('certifications')}
                                                className={`w-full p-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Award size={18} className="text-emerald-500" />
                                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sertifikalar</span>
                                                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'} text-xs rounded-full font-bold`}>
                                                        {parsedData.certifications.length}
                                                    </span>
                                                </div>
                                                {expandedSections.certifications ? <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} /> : <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />}
                                            </button>
                                            {expandedSections.certifications && (
                                                <div className="p-4 pt-0 flex flex-wrap gap-2">
                                                    {parsedData.certifications.map((cert, i) => (
                                                        <span key={i} className={`px-3 py-1 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'} text-sm rounded-full font-medium shadow-sm`}>
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={resetImporter}
                                        className={`flex-1 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium rounded-xl transition-colors flex items-center justify-center gap-2`}
                                    >
                                        <RefreshCw size={18} />
                                        Farklı Dosya
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <ArrowRight size={18} />
                                        CV Olarak İçe Aktar
                                    </button>
                                </div>

                                {/* Edit Note */}
                                <p className="text-center text-gray-500 text-xs mt-4">
                                    <Edit3 size={12} className="inline mr-1" />
                                    İçe aktarma sonrası tüm bilgileri düzenleyebilirsiniz
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Premium Badge */}
                    {!isPremium && (
                        <div className="absolute top-4 right-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PRO
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
