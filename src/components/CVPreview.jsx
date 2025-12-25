import ModernTemplate from '../templates/ModernTemplate'
import MinimalistTemplate from '../templates/MinimalistTemplate'
import CorporateTemplate from '../templates/CorporateTemplate'
import CreativeTemplate from '../templates/CreativeTemplate'
import TechTemplate from '../templates/TechTemplate'
import ExecutiveTemplate from '../templates/ExecutiveTemplate'
import ElegantTemplate from '../templates/ElegantTemplate'
import HealthcareTemplate from '../templates/HealthcareTemplate'
import AcademicTemplate from '../templates/AcademicTemplate'
import FinanceTemplate from '../templates/FinanceTemplate'
import LegalTemplate from '../templates/LegalTemplate'
import MarketingTemplate from '../templates/MarketingTemplate'
import EngineerTemplate from '../templates/EngineerTemplate'
import RetailTemplate from '../templates/RetailTemplate'
import HospitalityTemplate from '../templates/HospitalityTemplate'
import GovernmentTemplate from '../templates/GovernmentTemplate'
import FreelancerTemplate from '../templates/FreelancerTemplate'
import StartupTemplate from '../templates/StartupTemplate'
import InternationalTemplate from '../templates/InternationalTemplate'
import PortfolioTemplate from '../templates/PortfolioTemplate'
// New 20 templates
import ScientistTemplate from '../templates/ScientistTemplate'
import ArtistTemplate from '../templates/ArtistTemplate'
import TeacherTemplate from '../templates/TeacherTemplate'
import ChefTemplate from '../templates/ChefTemplate'
import PhotographerTemplate from '../templates/PhotographerTemplate'
import MusicianTemplate from '../templates/MusicianTemplate'
import AthletTemplate from '../templates/AthletTemplate'
import PilotTemplate from '../templates/PilotTemplate'
import ConstructionTemplate from '../templates/ConstructionTemplate'
import EnvironmentTemplate from '../templates/EnvironmentTemplate'
import JournalistTemplate from '../templates/JournalistTemplate'
import NurseTemplate from '../templates/NurseTemplate'
import LogisticsTemplate from '../templates/LogisticsTemplate'
import SecurityTemplate from '../templates/SecurityTemplate'
import ArchitectTemplate from '../templates/ArchitectTemplate'
import HRTemplate from '../templates/HRTemplate'
import DataScienceTemplate from '../templates/DataScienceTemplate'
import GamerTemplate from '../templates/GamerTemplate'
import ConsultantTemplate from '../templates/ConsultantTemplate'
import BeautyTemplate from '../templates/BeautyTemplate'

export default function CVPreview({ cvData, template, showWatermark }) {
    const renderTemplate = () => {
        switch (template) {
            case 'minimalist': return <MinimalistTemplate data={cvData} />
            case 'corporate': return <CorporateTemplate data={cvData} />
            case 'creative': return <CreativeTemplate data={cvData} />
            case 'tech': return <TechTemplate data={cvData} />
            case 'executive': return <ExecutiveTemplate data={cvData} />
            case 'elegant': return <ElegantTemplate data={cvData} />
            case 'healthcare': return <HealthcareTemplate data={cvData} />
            case 'academic': return <AcademicTemplate data={cvData} />
            case 'finance': return <FinanceTemplate data={cvData} />
            case 'legal': return <LegalTemplate data={cvData} />
            case 'marketing': return <MarketingTemplate data={cvData} />
            case 'engineer': return <EngineerTemplate data={cvData} />
            case 'retail': return <RetailTemplate data={cvData} />
            case 'hospitality': return <HospitalityTemplate data={cvData} />
            case 'government': return <GovernmentTemplate data={cvData} />
            case 'freelancer': return <FreelancerTemplate data={cvData} />
            case 'startup': return <StartupTemplate data={cvData} />
            case 'international': return <InternationalTemplate data={cvData} />
            case 'portfolio': return <PortfolioTemplate data={cvData} />
            // New 20 templates
            case 'scientist': return <ScientistTemplate data={cvData} />
            case 'artist': return <ArtistTemplate data={cvData} />
            case 'teacher': return <TeacherTemplate data={cvData} />
            case 'chef': return <ChefTemplate data={cvData} />
            case 'photographer': return <PhotographerTemplate data={cvData} />
            case 'musician': return <MusicianTemplate data={cvData} />
            case 'athlet': return <AthletTemplate data={cvData} />
            case 'pilot': return <PilotTemplate data={cvData} />
            case 'construction': return <ConstructionTemplate data={cvData} />
            case 'environment': return <EnvironmentTemplate data={cvData} />
            case 'journalist': return <JournalistTemplate data={cvData} />
            case 'nurse': return <NurseTemplate data={cvData} />
            case 'logistics': return <LogisticsTemplate data={cvData} />
            case 'security': return <SecurityTemplate data={cvData} />
            case 'architect': return <ArchitectTemplate data={cvData} />
            case 'hr': return <HRTemplate data={cvData} />
            case 'datascience': return <DataScienceTemplate data={cvData} />
            case 'gamer': return <GamerTemplate data={cvData} />
            case 'consultant': return <ConsultantTemplate data={cvData} />
            case 'beauty': return <BeautyTemplate data={cvData} />
            case 'modern':
            default: return <ModernTemplate data={cvData} />
        }
    }

    return (
        <div className="relative">
            {/* CV Container */}
            <div
                id="cv-preview"
                className="cv-preview rounded-lg overflow-hidden mx-auto"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    maxWidth: '100%',
                    transform: 'scale(0.85)',
                    transformOrigin: 'top center'
                }}
            >
                {renderTemplate()}

                {/* Watermark for non-premium users */}
                {showWatermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="text-6xl font-bold text-gray-300/30 rotate-[-30deg] select-none"
                            style={{ textShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                        >
                            CVify.com
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Hint */}
            <div className="text-center mt-4 text-sm text-gray-500">
                A4 boyutunda önizleme
            </div>
        </div>
    )
}
