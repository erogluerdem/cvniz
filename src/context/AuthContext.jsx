import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Default admin user
const DEFAULT_ADMIN = {
    id: 'admin',
    email: 'admin@cvify.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString()
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Initialize admin user if not exists
        const users = JSON.parse(localStorage.getItem('cvify_users') || '[]')
        if (!users.find(u => u.role === 'admin')) {
            users.push(DEFAULT_ADMIN)
            localStorage.setItem('cvify_users', JSON.stringify(users))
        }

        // Check for logged in user
        const savedUser = localStorage.getItem('cvify_current_user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('cvify_users') || '[]')
        const foundUser = users.find(u => u.email === email && u.password === password)

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser
            setUser(userWithoutPassword)
            localStorage.setItem('cvify_current_user', JSON.stringify(userWithoutPassword))
            return { success: true, user: userWithoutPassword }
        }
        return { success: false, error: 'E-posta veya şifre hatalı' }
    }

    const register = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('cvify_users') || '[]')

        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Bu e-posta zaten kayıtlı' }
        }

        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name,
            role: 'user',
            isPremium: false,
            createdAt: new Date().toISOString()
        }

        users.push(newUser)
        localStorage.setItem('cvify_users', JSON.stringify(users))

        const { password: _, ...userWithoutPassword } = newUser
        setUser(userWithoutPassword)
        localStorage.setItem('cvify_current_user', JSON.stringify(userWithoutPassword))

        return { success: true, user: userWithoutPassword }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('cvify_current_user')
    }

    const updateUser = (updates) => {
        const users = JSON.parse(localStorage.getItem('cvify_users') || '[]')
        const index = users.findIndex(u => u.id === user.id)
        if (index !== -1) {
            users[index] = { ...users[index], ...updates }
            localStorage.setItem('cvify_users', JSON.stringify(users))
            const { password: _, ...userWithoutPassword } = users[index]
            setUser(userWithoutPassword)
            localStorage.setItem('cvify_current_user', JSON.stringify(userWithoutPassword))
        }
    }

    const upgradeToPremium = () => {
        updateUser({ isPremium: true })
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            upgradeToPremium,
            isAdmin: user?.role === 'admin',
            isPremium: user?.isPremium || user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
