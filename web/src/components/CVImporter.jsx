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

export default function CVImporter({ isOpen, onClose, onImport, isEditor = false, isDayMode = false }) {
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] border ${isDayMode ? 'bg-[#f4f7f6] border-[#10B981]/20' : 'bg-[#0F1115] border-[#10B981]/20'}`}
                >
                    {/* Header */}
                    <div className={`sticky top-0 z-10 backdrop-blur-md border-b p-6 md:p-8 ${isDayMode ? 'bg-[#f4f7f6]/95 border-[#10B981]/20' : 'bg-[#0F1115]/95 border-white/5'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <Upload className="text-black" size={24} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-black ${isDayMode ? 'text-slate-800' : 'text-white'}`}>CV İçe Aktar</h2>
                                    <p className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Mevcut CV'nizi yükleyin, biz ayrıştıralım</p>
                                </div>
                            </div>
                            <button onClick={onClose} className={`p-2.5 rounded-xl transition-colors ${isDayMode ? 'hover:bg-slate-200 text-slate-400' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
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
                                    className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all overflow-hidden ${
                                        dragActive 
                                            ? 'border-[#10B981] bg-[#10B981]/10' 
                                            : isDayMode ? 'border-[#10B981]/30 hover:border-[#10B981]/60 hover:bg-[#10B981]/5' : 'border-white/10 hover:border-[#10B981]/50 hover:bg-white/5'
                                    }`}
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".docx,.doc,.pdf,.txt"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    
                                    <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 flex items-center justify-center border border-[#10B981]/20 group-hover:scale-110 transition-transform">
                                        <FileText size={40} className="text-[#10B981]" />
                                    </div>
                                    
                                    <p className={`font-black text-xl mb-2 relative z-10 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                        CV dosyanızı sürükleyin veya tıklayın
                                    </p>
                                    <p className={`text-sm font-medium mb-6 relative z-10 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                        DOCX, PDF veya TXT formatları desteklenir
                                    </p>
                                    
                                    <div className="flex justify-center gap-2 relative z-10">
                                        {SUPPORTED_FORMATS.slice(0, 3).map(format => (
                                            <span key={format.ext} className={`px-4 py-1.5 rounded-xl text-xs font-bold ${isDayMode ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-gray-300 border border-white/10'}`}>
                                                {format.ext}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className={`mt-6 p-6 rounded-2xl border ${isDayMode ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-gradient-to-r from-[#10B981]/10 to-transparent border-[#10B981]/20'}`}>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="text-[#10B981]" size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>AI Destekli Ayrıştırma</p>
                                            <p className={`text-sm mt-1 font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
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
                                className="py-16 text-center"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-[#10B981] rounded-full border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-[#10B981] animate-pulse" />
                                    </div>
                                </div>
                                
                                <h3 className={`text-2xl font-black mb-2 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                    {status === 'uploading' ? 'Dosya Yükleniyor...' : 'Yapay Zeka Analiz Ediyor...'}
                                </h3>
                                <p className={`text-sm font-medium mb-8 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{file?.name}</p>
                                
                                {/* Progress Bar */}
                                <div className="max-w-xs mx-auto">
                                    <div className={`h-3 rounded-full overflow-hidden ${isDayMode ? 'bg-[#10B981]/20' : 'bg-white/10'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                        />
                                    </div>
                                    <p className={`text-xs font-bold mt-3 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>% {progress}</p>
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
                                
                                <h3 className={`font-semibold mb-2 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Hata Oluştu</h3>
                                <p className="text-red-500 text-sm mb-6">{error}</p>

                                <button
                                    onClick={resetImporter}
                                    className={`px-6 py-3 font-medium rounded-xl transition-colors inline-flex items-center gap-2 ${isDayMode ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
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
                                <div className={`flex items-center gap-4 mb-8 p-6 rounded-2xl border ${isDayMode ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-[#10B981]/10 border-[#10B981]/30'}`}>
                                    <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                        <CheckCircle className="text-black" size={24} />
                                    </div>
                                    <div>
                                        <p className={`font-black text-xl ${isDayMode ? 'text-slate-800' : 'text-white'}`}>AI Analizi Tamamlandı!</p>
                                        <p className={`text-sm font-medium ${isDayMode ? 'text-slate-600' : 'text-[#10B981]/80'}`}>CV verileriniz başarıyla ayrıştırıldı. Lütfen kontrol edip onaylayın.</p>
                                    </div>
                                </div>

                                {/* Parsed Data Preview */}
                                <div className="space-y-4 mb-8">
                                    {/* Personal Info */}
                                    <div className={`rounded-2xl border overflow-hidden transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                        <button
                                            onClick={() => toggleSection('personal')}
                                            className={`w-full p-5 flex items-center justify-between transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                                    <User size={20} className="text-cyan-400" />
                                                </div>
                                                <span className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Kişisel Bilgiler</span>
                                                {parsedData.personalInfo.name && (
                                                    <span className={`text-sm font-bold ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>• {parsedData.personalInfo.name}</span>
                                                )}
                                            </div>
                                            {expandedSections.personal ? <ChevronUp size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} /> : <ChevronDown size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} />}
                                        </button>
                                        {expandedSections.personal && (
                                            <div className="p-5 pt-0 grid grid-cols-2 gap-4 text-sm bg-black/20">
                                                {Object.entries(parsedData.personalInfo).filter(([k, v]) => v).map(([key, value]) => (
                                                    <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <span className={`capitalize font-bold text-[10px] uppercase tracking-widest block mb-1 ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>{key}</span>
                                                        <span className={`font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{value.substring(0, 50)}{value.length > 50 ? '...' : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Experience */}
                                    {parsedData.experience.length > 0 && (
                                        <div className={`rounded-2xl border overflow-hidden transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                            <button
                                                onClick={() => toggleSection('experience')}
                                                className={`w-full p-5 flex items-center justify-between transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                                        <Briefcase size={20} className="text-purple-400" />
                                                    </div>
                                                    <span className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Deneyim</span>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${isDayMode ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                                                        {parsedData.experience.length} Kayıt
                                                    </span>
                                                </div>
                                                {expandedSections.experience ? <ChevronUp size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} /> : <ChevronDown size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} />}
                                            </button>
                                            {expandedSections.experience && (
                                                <div className="p-5 pt-0 space-y-3 bg-black/20">
                                                    {parsedData.experience.map((exp, i) => (
                                                        <div key={i} className={`p-4 rounded-xl border ${isDayMode ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'}`}>
                                                            <p className={`font-black text-lg mb-1 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{exp.company}</p>
                                                            <p className={`font-bold text-sm ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>{exp.position} <span className="text-gray-500 font-medium">• {exp.startDate} - {exp.endDate}</span></p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Education */}
                                    {parsedData.education.length > 0 && (
                                        <div className={`rounded-2xl border overflow-hidden transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                            <button
                                                onClick={() => toggleSection('education')}
                                                className={`w-full p-5 flex items-center justify-between transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                        <GraduationCap size={20} className="text-blue-400" />
                                                    </div>
                                                    <span className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Eğitim</span>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${isDayMode ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                                                        {parsedData.education.length} Kayıt
                                                    </span>
                                                </div>
                                                {expandedSections.education ? <ChevronUp size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} /> : <ChevronDown size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} />}
                                            </button>
                                            {expandedSections.education && (
                                                <div className="p-5 pt-0 space-y-3 bg-black/20">
                                                    {parsedData.education.map((edu, i) => (
                                                        <div key={i} className={`p-4 rounded-xl border ${isDayMode ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'}`}>
                                                            <p className={`font-black text-lg mb-1 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{edu.school}</p>
                                                            <p className={`font-bold text-sm ${isDayMode ? 'text-slate-500' : 'text-[#10B981]'}`}>{edu.degree} {edu.field && <span className="text-gray-500 font-medium">• {edu.field}</span>}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {parsedData.skills.length > 0 && (
                                        <div className={`rounded-2xl border overflow-hidden transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                            <button
                                                onClick={() => toggleSection('skills')}
                                                className={`w-full p-5 flex items-center justify-between transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                        <Award size={20} className="text-amber-400" />
                                                    </div>
                                                    <span className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Yetenekler</span>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${isDayMode ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                                                        {parsedData.skills.length} Yetenek
                                                    </span>
                                                </div>
                                                {expandedSections.skills ? <ChevronUp size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} /> : <ChevronDown size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} />}
                                            </button>
                                            {expandedSections.skills && (
                                                <div className="p-5 pt-0 flex flex-wrap gap-2 bg-black/20">
                                                    {parsedData.skills.map((skill, i) => (
                                                        <span key={i} className={`px-4 py-2 text-sm font-bold rounded-xl border ${isDayMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`}>
                                                            {skill.name || skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {parsedData.languages.length > 0 && (
                                        <div className={`rounded-2xl border overflow-hidden transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 hover:border-[#10B981]/30'}`}>
                                            <button
                                                onClick={() => toggleSection('languages')}
                                                className={`w-full p-5 flex items-center justify-between transition-colors ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                                        <Languages size={20} className="text-indigo-400" />
                                                    </div>
                                                    <span className={`font-black text-lg ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Diller</span>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${isDayMode ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                                                        {parsedData.languages.length} Dil
                                                    </span>
                                                </div>
                                                {expandedSections.languages ? <ChevronUp size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} /> : <ChevronDown size={20} className={isDayMode ? 'text-slate-400' : 'text-gray-400'} />}
                                            </button>
                                            {expandedSections.languages && (
                                                <div className="p-5 pt-0 flex flex-wrap gap-2 bg-black/20">
                                                    {parsedData.languages.map((lang, i) => (
                                                        <span key={i} className={`px-4 py-2 text-sm font-bold rounded-xl border ${isDayMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`}>
                                                            <span className="text-[#10B981]">{lang.language}</span> <span className="text-gray-500 mx-1">•</span> {lang.level}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={resetImporter}
                                        className={`w-1/3 py-4 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 border ${isDayMode ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}
                                    >
                                        <RefreshCw size={18} />
                                        Farklı Dosya
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        className="w-2/3 py-4 bg-[#10B981] hover:bg-[#059669] text-black font-black text-lg rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all group"
                                    >
                                        CV Olarak İçe Aktar
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Edit Note */}
                                <p className={`text-center font-medium text-xs mt-6 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    <Edit3 size={14} className="inline mr-1" />
                                    İçe aktarma sonrası tüm bilgileri düzenleyebilirsiniz
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Premium Badge */}
                    {!isPremium && (
                        <div className="absolute top-6 right-16 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                            PRO
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
