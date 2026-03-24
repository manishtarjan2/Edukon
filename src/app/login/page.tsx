'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (res.ok) {
                router.refresh()
                router.push('/profile')
            } else {
                setError(data.message || 'Login failed')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 relative z-10 border border-gray-50">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-xl mb-6 border border-gray-50">
                        <img src="/logo.png" alt="Edukon Logo" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 font-medium mt-2">
                        Enter your credentials to continue
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 font-medium text-sm">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                            Secret Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? 'Authenticating...' : 'Sign In Now'}
                    </button>
                </form>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-gray-500 font-medium tracking-tight">
                        New to the platform?{' '}
                        <a href="/register" className="text-blue-600 hover:text-blue-700 font-black decoration-2 underline-offset-4 hover:underline">
                            Create Account
                        </a>
                    </p>
                    <div className="pt-6 border-t border-gray-100">
                        <a href="/admin/login" className="text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors tracking-widest uppercase">
                            Administrator Portal →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
