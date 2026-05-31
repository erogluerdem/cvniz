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

// Desteklenen dosya formatları
const SUPPORTED_FORMATS = [
    { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (DOCX)' },
    { ext: '.doc', mime: 'application/msword', label: 'Word (DOC)' },
    { ext: '.pdf', mime: 'application/pdf', label: 'PDF' },
    { ext: '.txt', mime: 'text/plain', label: 'Metin (TXT)' }
]

// Regex patterns for parsing
const PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(?:\+90|0)?[\s.-]?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/g,
    linkedin: /(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9-]+)/gi,
    github: /(?:github\.com\/|github:?\s*)([a-zA-Z0-9-]+)/gi,
    website: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g,
    dateRange: /(\d{4})\s*[-–—]\s*(\d{4}|Halen|Present|Günümüz|Devam|Current)/gi,
    sectionHeaders: /(deneyim|experience|iş\s*deneyimi|work\s*history|eğitim|education|öğrenim|yetenekler|skills|beceriler|sertifikalar?|certificates?|diller?|languages?|projeler?|projects?|özet|summary|hakkımda|about\s*me|profil|profile)/gi
}

// Section keywords for detection
const SECTION_KEYWORDS = {
    experience: ['deneyim', 'experience', 'iş deneyimi', 'work history', 'çalışma geçmişi', 'profesyonel deneyim'],
    education: ['eğitim', 'education', 'öğrenim', 'akademik', 'üniversite', 'okul'],
    skills: ['yetenekler', 'skills', 'beceriler', 'teknik beceriler', 'yetkinlikler', 'competencies'],
    languages: ['diller', 'languages', 'yabancı dil', 'foreign languages'],
    certificates: ['sertifikalar', 'certificates', 'certifications', 'belgeler'],
    projects: ['projeler', 'projects', 'kişisel projeler', 'personal projects'],
    summary: ['özet', 'summary', 'hakkımda', 'about me', 'profil', 'profile', 'kariyer hedefi', 'career objective']
}

// Parse text content into CV structure
const parseTextToCV = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l)
    
    const cvData = {
        personalInfo: {
            name: '',
            title: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            website: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certificates: [],
        projects: []
    }

    // Extract contact info
    const emailMatch = text.match(PATTERNS.email)
    if (emailMatch) cvData.personalInfo.email = emailMatch[0]

    const phoneMatch = text.match(PATTERNS.phone)
    if (phoneMatch) cvData.personalInfo.phone = phoneMatch[0]

    const linkedinMatch = text.match(PATTERNS.linkedin)
    if (linkedinMatch) cvData.personalInfo.linkedin = `linkedin.com/in/${linkedinMatch[1] || linkedinMatch[0]}`

    const githubMatch = text.match(PATTERNS.github)
    if (githubMatch) cvData.personalInfo.github = `github.com/${githubMatch[1] || githubMatch[0]}`

    // First non-empty line is usually the name
    if (lines.length > 0) {
        const firstLine = lines[0]
        // Check if it looks like a name (2-4 words, no special chars except spaces)
        if (/^[A-Za-zÇĞİÖŞÜçğıöşü\s]{3,50}$/.test(firstLine) && firstLine.split(/\s+/).length <= 5) {
            cvData.personalInfo.name = firstLine
        }
    }

    // Try to find job title near the top
    for (let i = 1; i < Math.min(5, lines.length); i++) {
        const line = lines[i]
        // Common job title patterns
        if (/(developer|engineer|designer|manager|analyst|specialist|consultant|mühendis|uzman|tasarımcı|geliştirici)/i.test(line)) {
            cvData.personalInfo.title = line
            break
        }
    }

    // Detect sections and parse content
    let currentSection = 'unknown'
    let sectionContent = []
    
    const detectSection = (line) => {
        const lowerLine = line.toLowerCase()
        for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
            if (keywords.some(kw => lowerLine.includes(kw))) {
                return section
            }
        }
        return null
    }

    const processSection = (section, content) => {
        if (content.length === 0) return

        switch (section) {
            case 'experience':
                // Try to parse experience entries
                let currentExp = null
                content.forEach(line => {
                    const dateMatch = line.match(PATTERNS.dateRange)
                    if (dateMatch || /^[A-Z]/.test(line)) {
                        if (currentExp && currentExp.company) {
                            cvData.experience.push(currentExp)
                        }
                        currentExp = {
                            company: '',
                            position: '',
                            startDate: dateMatch ? dateMatch[1] : '',
                            endDate: dateMatch ? (dateMatch[2] || 'Halen') : '',
                            description: ''
                        }
                        // Clean line from date
                        const cleanLine = line.replace(PATTERNS.dateRange, '').trim()
                        if (cleanLine) {
                            currentExp.company = cleanLine.split(/[|,–-]/)[0]?.trim() || cleanLine
                            currentExp.position = cleanLine.split(/[|,–-]/)[1]?.trim() || ''
                        }
                    } else if (currentExp) {
                        currentExp.description += (currentExp.description ? '\n' : '') + line
                    }
                })
                if (currentExp && currentExp.company) {
                    cvData.experience.push(currentExp)
                }
                break

            case 'education':
                let currentEdu = null
                content.forEach(line => {
                    const dateMatch = line.match(PATTERNS.dateRange)
                    if (dateMatch || /(üniversite|university|lisans|bachelor|master|yüksek lisans|doktora|phd|lise|high school)/i.test(line)) {
                        if (currentEdu && currentEdu.school) {
                            cvData.education.push(currentEdu)
                        }
                        currentEdu = {
                            school: '',
                            degree: '',
                            field: '',
                            startDate: dateMatch ? dateMatch[1] : '',
                            endDate: dateMatch ? dateMatch[2] : '',
                            description: ''
                        }
                        const cleanLine = line.replace(PATTERNS.dateRange, '').trim()
                        if (cleanLine) {
                            currentEdu.school = cleanLine.split(/[|,–-]/)[0]?.trim() || cleanLine
                            currentEdu.degree = cleanLine.split(/[|,–-]/)[1]?.trim() || ''
                            currentEdu.field = cleanLine.split(/[|,–-]/)[2]?.trim() || ''
                        }
                    } else if (currentEdu) {
                        currentEdu.description += (currentEdu.description ? '\n' : '') + line
                    }
                })
                if (currentEdu && currentEdu.school) {
                    cvData.education.push(currentEdu)
                }
                break

            case 'skills':
                // Parse skills - could be comma/bullet separated
                const skillsText = content.join(' ')
                const skillsRaw = skillsText.split(/[,;•●○◦▪▫–-]|\n/).map(s => s.trim()).filter(s => s && s.length < 50)
                cvData.skills = skillsRaw.slice(0, 20)
                break

            case 'languages':
                content.forEach(line => {
                    const parts = line.split(/[:-–]/).map(p => p.trim())
                    if (parts[0]) {
                        let level = 'Orta'
                        const levelText = (parts[1] || '').toLowerCase()
                        if (/(native|ana\s*dil|anadil|mother)/i.test(levelText)) level = 'Ana Dil'
                        else if (/(fluent|ileri|advanced|c1|c2)/i.test(levelText)) level = 'İleri'
                        else if (/(intermediate|orta|b1|b2)/i.test(levelText)) level = 'Orta'
                        else if (/(basic|başlangıç|a1|a2|temel)/i.test(levelText)) level = 'Başlangıç'
                        
                        cvData.languages.push({ language: parts[0], level })
                    }
                })
                break

            case 'certificates':
                content.forEach(line => {
                    if (line.length > 3) {
                        const dateMatch = line.match(/\d{4}/)
                        cvData.certificates.push({
                            name: line.replace(/\d{4}/g, '').trim(),
                            issuer: '',
                            date: dateMatch ? dateMatch[0] : ''
                        })
                    }
                })
                break

            case 'projects':
                let currentProj = null
                content.forEach(line => {
                    if (/^[A-ZÇĞİÖŞÜ]/.test(line) && line.length < 80) {
                        if (currentProj && currentProj.name) {
                            cvData.projects.push(currentProj)
                        }
                        currentProj = { name: line, description: '', technologies: [] }
                    } else if (currentProj) {
                        currentProj.description += (currentProj.description ? '\n' : '') + line
                        // Extract tech from description
                        const techWords = line.match(/\b(react|vue|angular|node|python|java|javascript|typescript|html|css|sql|mongodb|aws|docker|kubernetes|git)\b/gi)
                        if (techWords) {
                            currentProj.technologies.push(...techWords.map(t => t.toLowerCase()))
                        }
                    }
                })
                if (currentProj && currentProj.name) {
                    cvData.projects.push(currentProj)
                }
                break

            case 'summary':
                cvData.personalInfo.summary = content.join(' ').substring(0, 500)
                break
        }
    }

    // Process lines
    for (const line of lines) {
        const detectedSection = detectSection(line)
        if (detectedSection) {
            // Process previous section
            processSection(currentSection, sectionContent)
            currentSection = detectedSection
            sectionContent = []
        } else if (currentSection !== 'unknown') {
            sectionContent.push(line)
        }
    }
    // Process last section
    processSection(currentSection, sectionContent)

    return cvData
}

// Read file content
const readFileContent = async (file) => {
    const ext = file.name.toLowerCase().split('.').pop()
    
    if (ext === 'txt') {
        return await file.text()
    }
    
    if (ext === 'docx') {
        // Use JSZip to extract text from DOCX
        return await extractDocxText(file)
    }
    
    if (ext === 'pdf') {
        // For PDF, we'd need pdf.js - show message for now
        throw new Error('PDF desteği yakında eklenecek. Lütfen DOCX veya TXT formatı kullanın.')
    }
    
    if (ext === 'doc') {
        throw new Error('Eski DOC formatı desteklenmiyor. Lütfen DOCX olarak kaydedin.')
    }
    
    throw new Error('Desteklenmeyen dosya formatı')
}

// Alternative DOCX extraction using native APIs
const extractDocxText = async (file) => {
    try {
        // DOCX is a ZIP file, we'll use native decompression
        const arrayBuffer = await file.arrayBuffer()
        
        // Try using CompressionStream API (modern browsers)
        if (typeof DecompressionStream !== 'undefined') {
            return await extractDocxWithNativeZip(arrayBuffer)
        }
        
        // Fallback: Simple extraction attempt
        return await extractDocxSimple(arrayBuffer)
    } catch (error) {
        console.error('DOCX extraction error:', error)
        throw new Error('DOCX dosyası ayrıştırılamadı. Lütfen TXT formatını deneyin.')
    }
}

// Extract text using native zip handling
const extractDocxWithNativeZip = async (arrayBuffer) => {
    // DOCX files are ZIP archives containing XML files
    // We need to find and extract word/document.xml
    
    const bytes = new Uint8Array(arrayBuffer)
    
    // Find the central directory
    let pos = bytes.length - 22
    while (pos >= 0 && !(bytes[pos] === 0x50 && bytes[pos+1] === 0x4b && bytes[pos+2] === 0x05 && bytes[pos+3] === 0x06)) {
        pos--
    }
    
    if (pos < 0) {
        throw new Error('Geçersiz DOCX dosyası')
    }
    
    // Read central directory info
    const cdOffset = bytes[pos + 16] | (bytes[pos + 17] << 8) | (bytes[pos + 18] << 16) | (bytes[pos + 19] << 24)
    const cdSize = bytes[pos + 12] | (bytes[pos + 13] << 8) | (bytes[pos + 14] << 16) | (bytes[pos + 15] << 24)
    
    // Find document.xml in the archive
    let textContent = ''
    let searchPos = 0
    
    while (searchPos < bytes.length - 4) {
        // Look for local file header signature
        if (bytes[searchPos] === 0x50 && bytes[searchPos+1] === 0x4b && bytes[searchPos+2] === 0x03 && bytes[searchPos+3] === 0x04) {
            const compressionMethod = bytes[searchPos + 8] | (bytes[searchPos + 9] << 8)
            const compressedSize = bytes[searchPos + 18] | (bytes[searchPos + 19] << 8) | (bytes[searchPos + 20] << 16) | (bytes[searchPos + 21] << 24)
            const uncompressedSize = bytes[searchPos + 22] | (bytes[searchPos + 23] << 8) | (bytes[searchPos + 24] << 16) | (bytes[searchPos + 25] << 24)
            const fileNameLength = bytes[searchPos + 26] | (bytes[searchPos + 27] << 8)
            const extraLength = bytes[searchPos + 28] | (bytes[searchPos + 29] << 8)
            
            const fileNameBytes = bytes.slice(searchPos + 30, searchPos + 30 + fileNameLength)
            const fileName = new TextDecoder().decode(fileNameBytes)
            
            const dataStart = searchPos + 30 + fileNameLength + extraLength
            
            if (fileName === 'word/document.xml') {
                const compressedData = bytes.slice(dataStart, dataStart + compressedSize)
                
                if (compressionMethod === 0) {
                    // Stored (no compression)
                    textContent = new TextDecoder().decode(compressedData)
                } else if (compressionMethod === 8) {
                    // Deflate compression
                    try {
                        const ds = new DecompressionStream('deflate-raw')
                        const writer = ds.writable.getWriter()
                        const reader = ds.readable.getReader()
                        
                        writer.write(compressedData)
                        writer.close()
                        
                        const chunks = []
                        while (true) {
                            const { done, value } = await reader.read()
                            if (done) break
                            chunks.push(value)
                        }
                        
                        const decompressed = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0))
                        let offset = 0
                        for (const chunk of chunks) {
                            decompressed.set(chunk, offset)
                            offset += chunk.length
                        }
                        
                        textContent = new TextDecoder().decode(decompressed)
                    } catch (e) {
                        console.warn('Decompression failed:', e)
                    }
                }
                break
            }
            
            searchPos = dataStart + compressedSize
        } else {
            searchPos++
        }
    }
    
    if (!textContent) {
        throw new Error('document.xml bulunamadı')
    }
    
    // Parse XML to extract text
    return parseDocxXml(textContent)
}

// Simple fallback extraction
const extractDocxSimple = async (arrayBuffer) => {
    // Try to find readable text in the buffer
    const text = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer)
    
    // Look for XML content and extract text
    const matches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || []
    const extractedText = matches
        .map(m => m.replace(/<[^>]+>/g, ''))
        .join(' ')
    
    if (extractedText.length > 50) {
        return extractedText
    }
    
    throw new Error('DOCX içeriği okunamadı')
}

// Parse DOCX XML content to plain text
const parseDocxXml = (xmlContent) => {
    // Extract text from Word XML
    const text = xmlContent
        // Add newlines for paragraphs
        .replace(/<w:p[^>]*\/>/g, '\n')
        .replace(/<w:p[^>]*>/g, '\n')
        .replace(/<\/w:p>/g, '')
        // Handle line breaks
        .replace(/<w:br[^>]*\/>/g, '\n')
        .replace(/<w:br[^>]*>/g, '\n')
        // Handle tabs
        .replace(/<w:tab[^>]*\/>/g, '\t')
        // Extract text content
        .replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, '$1')
        // Remove all remaining XML tags
        .replace(/<[^>]+>/g, '')
        // Decode HTML entities
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        // Clean up whitespace
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim()
    
    return text
}

export default function CVImporter({ isOpen, onClose, onImport, isEditor = false }) {
    const { isPremium } = useAuth()
    const { saveCV } = useCV()
    const { toast } = useToast()
    
    const fileInputRef = useRef(null)
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('idle') // idle, uploading, parsing, success, error
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
            throw new Error('Desteklenmeyen dosya formatı. DOCX, PDF veya TXT kullanın.')
        }
        
        return true
    }

    const processFile = async (selectedFile) => {
        try {
            setFile(selectedFile)
            setStatus('uploading')
            setProgress(20)
            setError('')
            setParsedData(null)

            validateFile(selectedFile)
            
            setProgress(40)
            setStatus('parsing')

            const text = await readFileContent(selectedFile)
            
            setProgress(70)

            const parsed = parseTextToCV(text)
            
            setProgress(100)
            setParsedData(parsed)
            setStatus('success')
            
        } catch (err) {
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
        
        if (isEditor) {
            toast.success('CV bilgileri başarıyla ayrıştırıldı!')
            if (onImport) onImport(parsedData)
            onClose()
            return
        }

        try {
            // Create new CV with parsed data
            const response = await saveCV(parsedData, 'modern', file?.name || 'İçe Aktarılan CV')
            
            if (response.success) {
                toast.success('CV başarıyla içe aktarıldı!')
                if (onImport) onImport(response.cv)
                onClose()
            } else {
                toast.error(response.error || 'CV oluşturulurken bir hata oluştu')
            }
        } catch (err) {
            toast.error('CV oluşturulurken hata oluştu')
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
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Upload className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">CV İçe Aktar</h2>
                                    <p className="text-gray-400 text-sm">Mevcut CV'nizi yükleyin, biz ayrıştıralım</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-400" />
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
                                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                                        dragActive 
                                            ? 'border-cyan-500 bg-cyan-500/10' 
                                            : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
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
                                    
                                    <p className="text-white font-semibold mb-2">
                                        CV dosyanızı sürükleyin veya tıklayın
                                    </p>
                                    <p className="text-gray-400 text-sm mb-4">
                                        DOCX, PDF veya TXT formatları desteklenir
                                    </p>
                                    
                                    <div className="flex justify-center gap-2">
                                        {SUPPORTED_FORMATS.slice(0, 3).map(format => (
                                            <span key={format.ext} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                                                {format.ext}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="text-blue-400 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-blue-300 font-medium text-sm">AI Destekli Ayrıştırma</p>
                                            <p className="text-gray-400 text-sm mt-1">
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
                                
                                <h3 className="text-white font-semibold mb-2">
                                    {status === 'uploading' ? 'Dosya Yükleniyor...' : 'CV Ayrıştırılıyor...'}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">{file?.name}</p>
                                
                                {/* Progress Bar */}
                                <div className="max-w-xs mx-auto">
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                        />
                                    </div>
                                    <p className="text-gray-500 text-xs mt-2">{progress}%</p>
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
                                <div className="flex items-center gap-3 mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                    <CheckCircle className="text-green-400" size={24} />
                                    <div>
                                        <p className="text-green-300 font-medium">CV başarıyla ayrıştırıldı!</p>
                                        <p className="text-gray-400 text-sm">Bilgileri kontrol edin ve içe aktarın</p>
                                    </div>
                                </div>

                                {/* Parsed Data Preview */}
                                <div className="space-y-3 mb-6">
                                    {/* Personal Info */}
                                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('personal')}
                                            className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <User size={18} className="text-cyan-400" />
                                                <span className="text-white font-medium">Kişisel Bilgiler</span>
                                                {parsedData.personalInfo.name && (
                                                    <span className="text-gray-400 text-sm">• {parsedData.personalInfo.name}</span>
                                                )}
                                            </div>
                                            {expandedSections.personal ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                        </button>
                                        {expandedSections.personal && (
                                            <div className="p-4 pt-0 grid grid-cols-2 gap-3 text-sm">
                                                {Object.entries(parsedData.personalInfo).filter(([k, v]) => v).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-gray-500 capitalize">{key}: </span>
                                                        <span className="text-gray-300">{value.substring(0, 50)}{value.length > 50 ? '...' : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Experience */}
                                    {parsedData.experience.length > 0 && (
                                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('experience')}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Briefcase size={18} className="text-purple-400" />
                                                    <span className="text-white font-medium">Deneyim</span>
                                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                                        {parsedData.experience.length}
                                                    </span>
                                                </div>
                                                {expandedSections.experience ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                            </button>
                                            {expandedSections.experience && (
                                                <div className="p-4 pt-0 space-y-2">
                                                    {parsedData.experience.map((exp, i) => (
                                                        <div key={i} className="text-sm p-2 bg-gray-800 rounded-lg">
                                                            <p className="text-white">{exp.company}</p>
                                                            <p className="text-gray-400">{exp.position} • {exp.startDate} - {exp.endDate}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Education */}
                                    {parsedData.education.length > 0 && (
                                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('education')}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <GraduationCap size={18} className="text-green-400" />
                                                    <span className="text-white font-medium">Eğitim</span>
                                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                        {parsedData.education.length}
                                                    </span>
                                                </div>
                                                {expandedSections.education ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                            </button>
                                            {expandedSections.education && (
                                                <div className="p-4 pt-0 space-y-2">
                                                    {parsedData.education.map((edu, i) => (
                                                        <div key={i} className="text-sm p-2 bg-gray-800 rounded-lg">
                                                            <p className="text-white">{edu.school}</p>
                                                            <p className="text-gray-400">{edu.degree} {edu.field && `• ${edu.field}`}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {parsedData.skills.length > 0 && (
                                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('skills')}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Award size={18} className="text-amber-400" />
                                                    <span className="text-white font-medium">Yetenekler</span>
                                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                                                        {parsedData.skills.length}
                                                    </span>
                                                </div>
                                                {expandedSections.skills ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                            </button>
                                            {expandedSections.skills && (
                                                <div className="p-4 pt-0 flex flex-wrap gap-2">
                                                    {parsedData.skills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {parsedData.languages.length > 0 && (
                                        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection('languages')}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Languages size={18} className="text-indigo-400" />
                                                    <span className="text-white font-medium">Diller</span>
                                                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                                                        {parsedData.languages.length}
                                                    </span>
                                                </div>
                                                {expandedSections.languages ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                            </button>
                                            {expandedSections.languages && (
                                                <div className="p-4 pt-0 flex flex-wrap gap-2">
                                                    {parsedData.languages.map((lang, i) => (
                                                        <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                                                            {lang.language} • {lang.level}
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
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
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
