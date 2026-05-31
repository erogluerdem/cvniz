import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const EnterpriseContext = createContext(null)

// Enterprise pricing plans
export const ENTERPRISE_PLANS = {
    starter: {
        id: 'starter',
        name: 'Starter',
        seats: 10,
        price: 499,
        features: ['10 kullanıcı', 'Temel raporlama', 'E-posta destek', 'Tüm şablonlar']
    },
    business: {
        id: 'business',
        name: 'Business',
        seats: 50,
        price: 1999,
        features: ['50 kullanıcı', 'Gelişmiş raporlama', 'Öncelikli destek', 'API erişimi', 'Özel branding']
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        seats: 999,
        price: null, // Custom pricing
        features: ['Sınırsız kullanıcı', 'Özel entegrasyon', 'Dedike hesap yöneticisi', 'SLA garantisi', 'On-premise seçenek']
    }
}

export function EnterpriseProvider({ children }) {
    const { user } = useAuth()
    const [companies, setCompanies] = useState([])
    const [currentCompany, setCurrentCompany] = useState(null)
    const [loading, setLoading] = useState(false)

    // Load companies from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_enterprise')
        if (stored) {
            try {
                const data = JSON.parse(stored)
                setCompanies(data.companies || [])

                // If user belongs to a company, set current
                if (user?.companyId) {
                    const company = data.companies?.find(c => c.id === user.companyId)
                    setCurrentCompany(company || null)
                }
            } catch (e) {
                console.error('Enterprise load error:', e)
            }
        }
    }, [user])

    // Save to localStorage
    const saveData = (newCompanies) => {
        setCompanies(newCompanies)
        localStorage.setItem('CVniz_enterprise', JSON.stringify({ companies: newCompanies }))
    }

    // Create new company account
    const createCompany = (companyData) => {
        const newCompany = {
            id: `company_${Date.now()}`,
            ...companyData,
            createdAt: new Date().toISOString(),
            plan: companyData.plan || 'starter',
            seats: ENTERPRISE_PLANS[companyData.plan || 'starter'].seats,
            usedSeats: 1,
            status: 'active',
            adminUserId: user?.id,
            employees: [{
                userId: user?.id,
                email: user?.email,
                name: user?.name,
                role: 'admin',
                joinedAt: new Date().toISOString(),
                status: 'active'
            }],
            stats: {
                totalCVs: 0,
                totalDownloads: 0,
                activeUsers: 1
            },
            billing: {
                plan: companyData.plan || 'starter',
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMethod: null
            }
        }

        const newCompanies = [...companies, newCompany]
        saveData(newCompanies)
        setCurrentCompany(newCompany)

        return { success: true, company: newCompany }
    }

    // Add employee to company
    const addEmployee = (companyId, employeeData) => {
        const company = companies.find(c => c.id === companyId)
        if (!company) return { success: false, error: 'Şirket bulunamadı' }

        if (company.usedSeats >= company.seats) {
            return { success: false, error: 'Kullanıcı limiti doldu' }
        }

        const newEmployee = {
            id: `emp_${Date.now()}`,
            ...employeeData,
            role: employeeData.role || 'member',
            joinedAt: new Date().toISOString(),
            status: 'pending' // pending, active, inactive
        }

        const updatedCompany = {
            ...company,
            employees: [...company.employees, newEmployee],
            usedSeats: company.usedSeats + 1
        }

        const newCompanies = companies.map(c => c.id === companyId ? updatedCompany : c)
        saveData(newCompanies)

        if (currentCompany?.id === companyId) {
            setCurrentCompany(updatedCompany)
        }

        return { success: true, employee: newEmployee }
    }

    // Remove employee
    const removeEmployee = (companyId, employeeId) => {
        const company = companies.find(c => c.id === companyId)
        if (!company) return { success: false, error: 'Şirket bulunamadı' }

        const updatedCompany = {
            ...company,
            employees: company.employees.filter(e => e.id !== employeeId),
            usedSeats: Math.max(1, company.usedSeats - 1)
        }

        const newCompanies = companies.map(c => c.id === companyId ? updatedCompany : c)
        saveData(newCompanies)

        if (currentCompany?.id === companyId) {
            setCurrentCompany(updatedCompany)
        }

        return { success: true }
    }

    // Update employee role/status
    const updateEmployee = (companyId, employeeId, updates) => {
        const company = companies.find(c => c.id === companyId)
        if (!company) return { success: false, error: 'Şirket bulunamadı' }

        const updatedCompany = {
            ...company,
            employees: company.employees.map(e =>
                e.id === employeeId ? { ...e, ...updates } : e
            )
        }

        const newCompanies = companies.map(c => c.id === companyId ? updatedCompany : c)
        saveData(newCompanies)

        if (currentCompany?.id === companyId) {
            setCurrentCompany(updatedCompany)
        }

        return { success: true }
    }

    // Update company stats
    const updateCompanyStats = (companyId, statsUpdate) => {
        const company = companies.find(c => c.id === companyId)
        if (!company) return

        const updatedCompany = {
            ...company,
            stats: { ...company.stats, ...statsUpdate }
        }

        const newCompanies = companies.map(c => c.id === companyId ? updatedCompany : c)
        saveData(newCompanies)

        if (currentCompany?.id === companyId) {
            setCurrentCompany(updatedCompany)
        }
    }

    // Upgrade/downgrade plan
    const changePlan = (companyId, newPlanId) => {
        const company = companies.find(c => c.id === companyId)
        if (!company) return { success: false, error: 'Şirket bulunamadı' }

        const newPlan = ENTERPRISE_PLANS[newPlanId]
        if (!newPlan) return { success: false, error: 'Geçersiz plan' }

        if (company.usedSeats > newPlan.seats) {
            return { success: false, error: `Bu plan maksimum ${newPlan.seats} kullanıcı destekliyor` }
        }

        const updatedCompany = {
            ...company,
            plan: newPlanId,
            seats: newPlan.seats,
            billing: {
                ...company.billing,
                plan: newPlanId
            }
        }

        const newCompanies = companies.map(c => c.id === companyId ? updatedCompany : c)
        saveData(newCompanies)

        if (currentCompany?.id === companyId) {
            setCurrentCompany(updatedCompany)
        }

        return { success: true }
    }

    // Get company by ID
    const getCompany = (companyId) => {
        return companies.find(c => c.id === companyId)
    }

    // Get all companies (admin only)
    const getAllCompanies = () => {
        return companies
    }

    // Check if user is enterprise admin
    const isEnterpriseAdmin = () => {
        if (!currentCompany || !user) return false
        const employee = currentCompany.employees.find(e => e.userId === user.id)
        return employee?.role === 'admin'
    }

    // Check if user is enterprise member
    const isEnterpriseMember = () => {
        return !!currentCompany
    }

    return (
        <EnterpriseContext.Provider value={{
            companies,
            currentCompany,
            loading,
            createCompany,
            addEmployee,
            removeEmployee,
            updateEmployee,
            updateCompanyStats,
            changePlan,
            getCompany,
            getAllCompanies,
            isEnterpriseAdmin,
            isEnterpriseMember,
            ENTERPRISE_PLANS
        }}>
            {children}
        </EnterpriseContext.Provider>
    )
}

export const useEnterprise = () => useContext(EnterpriseContext)

