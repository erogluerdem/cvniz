import React, { useState, useRef, useEffect } from 'react'
import { 
    Calendar, MapPin, Building2, Search, Check, X, 
    Briefcase, GraduationCap, Sparkles, Loader2
} from 'lucide-react'

/**
 * SmartFields - Faz 2: Smart Fields
 * Otomatik tamamlama, tarih seçici, konum autocomplete
 * Company logo çekme, GitHub entegrasyonu
 */

// Date Range Picker Component
export function SmartDateRange({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    isPresent,
    onPresentToggle,
    isDayMode = false
}) {
    const [showPicker, setShowPicker] = useState(false)
    const pickerRef = useRef(null)

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowPicker(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]

    const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i)

    const parseDate = (dateStr) => {
        if (!dateStr) return { month: '', year: '' }
        const parts = dateStr.split(' ')
        return { month: parts[0] || '', year: parts[1] || '' }
    }

    const { month: startMonth, year: startYear } = parseDate(startDate)
    const { month: endMonth, year: endYear } = parseDate(endDate)

    return (
        <div className="flex items-center gap-2" ref={pickerRef}>
            {/* Start Date */}
            <div className="relative flex-1">
                <button
                    onClick={() => setShowPicker(showPicker === 'start' ? false : 'start')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                        isDayMode
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-500/50'
                    }`}
                >
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className={!startDate ? 'text-slate-400' : ''}>
                        {startDate || 'Başlangıç'}
                    </span>
                </button>
                
                {showPicker === 'start' && (
                    <DatePickerDropdown
                        months={months}
                        years={years}
                        selectedMonth={startMonth}
                        selectedYear={startYear}
                        onSelect={(month, year) => {
                            onStartChange(`${month} ${year}`)
                            setShowPicker(false)
                        }}
                        isDayMode={isDayMode}
                    />
                )}
            </div>

            <span className={isDayMode ? 'text-slate-400' : 'text-slate-500'}>-</span>

            {/* End Date */}
            <div className="relative flex-1">
                <button
                    onClick={() => !isPresent && setShowPicker(showPicker === 'end' ? false : 'end')}
                    disabled={isPresent}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                        isPresent
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : isDayMode
                                ? 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-500/50'
                    }`}
                >
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className={!endDate && !isPresent ? 'text-slate-400' : ''}>
                        {isPresent ? 'Devam ediyor' : (endDate || 'Bitiş')}
                    </span>
                </button>
                
                {showPicker === 'end' && !isPresent && (
                    <DatePickerDropdown
                        months={months}
                        years={years}
                        selectedMonth={endMonth}
                        selectedYear={endYear}
                        onSelect={(month, year) => {
                            onEndChange(`${month} ${year}`)
                            setShowPicker(false)
                        }}
                        isDayMode={isDayMode}
                    />
                )}
            </div>

            {/* Present Toggle */}
            <button
                onClick={() => onPresentToggle?.(!isPresent)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isPresent
                        ? 'bg-cyan-500 text-slate-950'
                        : isDayMode
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
            >
                {isPresent ? 'Devam ediyor' : 'Devam et'}
            </button>
        </div>
    )
}

// Date Picker Dropdown
function DatePickerDropdown({ months, years, selectedMonth, selectedYear, onSelect, isDayMode }) {
    return (
        <div className={`absolute top-full left-0 mt-2 w-64 p-4 rounded-2xl border shadow-2xl z-50 ${
            isDayMode ? 'bg-white border-slate-200' : 'bg-[#1a1d24] border-white/20'
        }`}>
            <div className="grid grid-cols-3 gap-2 mb-4">
                <p className={`col-span-3 text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    isDayMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                    Ay
                </p>
                {months.map((month) => (
                    <button
                        key={month}
                        onClick={() => onSelect(month, selectedYear || new Date().getFullYear())}
                        className={`px-2 py-1.5 rounded-lg text-xs transition-all ${
                            selectedMonth === month
                                ? 'bg-cyan-500 text-slate-950'
                                : isDayMode
                                    ? 'hover:bg-slate-100 text-slate-600'
                                    : 'hover:bg-white/10 text-slate-400'
                        }`}
                    >
                        {month.slice(0, 3)}
                    </button>
                ))}
            </div>
            <div className={`border-t pt-3 ${isDayMode ? 'border-slate-100' : 'border-white/10'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    isDayMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                    Yıl
                </p>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {years.map((year) => (
                        <button
                            key={year}
                            onClick={() => onSelect(selectedMonth || months[0], year)}
                            className={`px-2 py-1.5 rounded-lg text-xs transition-all ${
                                selectedYear === String(year)
                                    ? 'bg-cyan-500 text-slate-950'
                                    : isDayMode
                                        ? 'hover:bg-slate-100 text-slate-600'
                                        : 'hover:bg-white/10 text-slate-400'
                            }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Company Input with Autocomplete
export function SmartCompanyInput({
    value,
    onChange,
    onLogoFetch,
    isDayMode = false,
    isPremium = false
}) {
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef(null)

    const companyDatabase = [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Spotify',
        'Airbnb', 'Uber', 'Lyft', 'Twitter', 'LinkedIn', 'Adobe', 'Salesforce',
        'Oracle', 'IBM', 'Intel', 'NVIDIA', 'AMD', 'Qualcomm', 'Samsung', 'Sony',
        'Toyota', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Tesla', 'Porsche',
        'McDonald\'s', 'Starbucks', 'Coca-Cola', 'Pepsi', 'Nike', 'Adidas', 'Zara',
        'Turkcell', 'Vodafone', 'Türk Telekom', 'Turkish Airlines', 'Arçelik', 'Beko'
    ]

    useEffect(() => {
        if (value && value.length > 1) {
            const filtered = companyDatabase.filter(company => 
                company.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5)
            setSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
        } else {
            setShowSuggestions(false)
        }
    }, [value])

    const handleSelectCompany = async (company) => {
        onChange(company)
        setShowSuggestions(false)
        
        if (isPremium && onLogoFetch) {
            setIsLoading(true)
            // Simulate logo fetch
            await new Promise(resolve => setTimeout(resolve, 800))
            onLogoFetch(`https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`)
            setIsLoading(false)
        }
    }

    return (
        <div className="relative">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                isDayMode
                    ? 'bg-white border-slate-200 focus-within:border-cyan-400'
                    : 'bg-white/5 border-white/10 focus-within:border-cyan-500/50'
            }`}>
                <Building2 className="w-4 h-4 text-slate-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Şirket adı"
                    className={`flex-1 bg-transparent outline-none text-sm ${
                        isDayMode ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                    }`}
                />
                {isLoading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                {isPremium && !isLoading && (
                    <span className="text-[10px] text-slate-400">Logo çek</span>
                )}
            </div>

            {showSuggestions && (
                <div className={`absolute top-full left-0 right-0 mt-2 py-2 rounded-xl border shadow-xl z-20 ${
                    isDayMode ? 'bg-white border-slate-200' : 'bg-[#1a1d24] border-white/20'
                }`}>
                    {suggestions.map((company) => (
                        <button
                            key={company}
                            onClick={() => handleSelectCompany(company)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                                isDayMode
                                    ? 'hover:bg-slate-50 text-slate-700'
                                    : 'hover:bg-white/10 text-slate-300'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                                isDayMode ? 'bg-slate-100' : 'bg-white/10'
                            }`}>
                                {company[0]}
                            </div>
                            <span className="text-sm">{company}</span>
                            {isPremium && (
                                <Sparkles className="w-3 h-3 text-amber-400 ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// Location Input with Autocomplete
export function SmartLocationInput({
    value,
    onChange,
    isDayMode = false
}) {
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)

    const cities = [
        'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
        'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Samsun',
        'London', 'New York', 'Paris', 'Berlin', 'Tokyo', 'Singapore', 'Dubai',
        'San Francisco', 'Los Angeles', 'Chicago', 'Boston', 'Seattle', 'Austin'
    ]

    useEffect(() => {
        if (value && value.length > 1) {
            const filtered = cities.filter(city => 
                city.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5)
            setSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
        } else {
            setShowSuggestions(false)
        }
    }, [value])

    return (
        <div className="relative">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                isDayMode
                    ? 'bg-white border-slate-200 focus-within:border-cyan-400'
                    : 'bg-white/5 border-white/10 focus-within:border-cyan-500/50'
            }`}>
                <MapPin className="w-4 h-4 text-slate-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Konum (şehir)"
                    className={`flex-1 bg-transparent outline-none text-sm ${
                        isDayMode ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                    }`}
                />
            </div>

            {showSuggestions && (
                <div className={`absolute top-full left-0 right-0 mt-2 py-2 rounded-xl border shadow-xl z-20 ${
                    isDayMode ? 'bg-white border-slate-200' : 'bg-[#1a1d24] border-white/20'
                }`}>
                    {suggestions.map((city) => (
                        <button
                            key={city}
                            onClick={() => {
                                onChange(city)
                                setShowSuggestions(false)
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                                isDayMode
                                    ? 'hover:bg-slate-50 text-slate-700'
                                    : 'hover:bg-white/10 text-slate-300'
                            }`}
                        >
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{city}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// Skill Autocomplete Input
export function SmartSkillInput({
    value,
    onChange,
    onAdd,
    existingSkills = [],
    isDayMode = false
}) {
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)

    const skillDatabase = [
        // Programming
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift',
        'React', 'Vue.js', 'Angular', 'Node.js', 'Next.js', 'Express', 'Django', 'Spring',
        // Design
        'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'UX Research',
        // Management
        'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Trello', 'Asana',
        // Data
        'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'AWS', 'Docker', 'Kubernetes',
        // Soft Skills
        'Liderlik', 'İletişim', 'Problem Çözme', 'Takım Çalışması', 'Proje Yönetimi'
    ]

    useEffect(() => {
        if (value && value.length > 1) {
            const filtered = skillDatabase.filter(skill => 
                skill.toLowerCase().includes(value.toLowerCase()) &&
                !existingSkills.includes(skill)
            ).slice(0, 5)
            setSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
        } else {
            setShowSuggestions(false)
        }
    }, [value, existingSkills])

    const handleAdd = (skill) => {
        onAdd?.(skill)
        onChange('')
        setShowSuggestions(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && value.trim()) {
            e.preventDefault()
            handleAdd(value.trim())
        }
    }

    return (
        <div className="relative">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                isDayMode
                    ? 'bg-white border-slate-200 focus-within:border-cyan-400'
                    : 'bg-white/5 border-white/10 focus-within:border-cyan-500/50'
            }`}>
                <Search className="w-4 h-4 text-slate-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Beceri ekle (Enter ile)"
                    className={`flex-1 bg-transparent outline-none text-sm ${
                        isDayMode ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                    }`}
                />
                {value && (
                    <button
                        onClick={() => handleAdd(value.trim())}
                        className="p-1 rounded-lg bg-cyan-500 text-white"
                    >
                        <Check className="w-3 h-3" />
                    </button>
                )}
            </div>

            {showSuggestions && (
                <div className={`absolute top-full left-0 right-0 mt-2 py-2 rounded-xl border shadow-xl z-20 ${
                    isDayMode ? 'bg-white border-slate-200' : 'bg-[#1a1d24] border-white/20'
                }`}>
                    {suggestions.map((skill) => (
                        <button
                            key={skill}
                            onClick={() => handleAdd(skill)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                                isDayMode
                                    ? 'hover:bg-slate-50 text-slate-700'
                                    : 'hover:bg-white/10 text-slate-300'
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-sm">{skill}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// Main SmartFields Export
export default function SmartFields({ type, ...props }) {
    switch (type) {
        case 'dateRange':
            return <SmartDateRange {...props} />
        case 'company':
            return <SmartCompanyInput {...props} />
        case 'location':
            return <SmartLocationInput {...props} />
        case 'skill':
            return <SmartSkillInput {...props} />
        default:
            return null
    }
}
