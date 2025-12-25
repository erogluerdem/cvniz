import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = login(email, password)

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/dashboard')
            }
        } else {
            setError(result.error)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">CVify</span>
                </Link>

                {/* Card */}
                <div className="glass-card rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-center mb-2">Hoş Geldiniz</h1>
                    <p className="text-gray-400 text-center mb-8">Hesabınıza giriş yapın</p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">E-posta</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 text-white"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 text-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-premium py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-6">
                        Hesabınız yok mu?{' '}
                        <Link to="/register" className="text-cyan-400 hover:underline">
                            Kayıt Ol
                        </Link>
                    </p>
                </div>

                {/* Demo Info */}
                <div className="mt-6 glass-card rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-400">Admin Demo:</p>
                    <p className="text-xs text-gray-500">admin@cvify.com / admin123</p>
                </div>
            </div>
        </div>
    )
}
