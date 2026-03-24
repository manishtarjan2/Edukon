'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      router.refresh()
      // Redirect based on role
      if (data.role === 'founder') {
        router.push('/founder')
      } else {
        router.push('/admin/dashboard')
      }
    } else {
      setError(data.message || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #fef8f0 50%, #f8f1e8 100%)' }}>

      {/* Warm ambient background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl"></div>

      {/* Vintage paper texture */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
      }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card with warm nostalgic feel */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-amber-100 relative">
          {/* Decorative corner elements */}
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 rounded-full"></div>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 rounded-full"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-amber-300 rounded-full"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-orange-300 rounded-full"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl mb-4 flex items-center justify-center text-5xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <span className="filter drop-shadow-lg">🔑</span>
            </div>

            <h2 className="text-3xl font-bold mb-2" style={{ color: '#3d2f1f' }}>
              Administrator Portal
            </h2>
            <p className="handwritten text-xl text-amber-700">
              Welcome back, guardian 💛
            </p>
            <p className="text-sm mt-2" style={{ color: '#5a4a3a' }}>
              Managing dreams, one student at a time
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#5a4a3a' }}>
                📧 Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@edukon.com"
                required
                className="w-full px-4 py-3 bg-amber-50/50 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all"
                style={{ color: '#3d2f1f' }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#5a4a3a' }}>
                🔐 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-amber-50/50 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all"
                style={{ color: '#3d2f1f' }}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Enter Portal ✨
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center">
            <a
              href="/login"
              className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors inline-flex items-center gap-2"
            >
              ← Back to Student Login
            </a>
          </div>

          {/* Decorative divider */}
          <div className="mt-8 flex items-center justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full"></div>
          </div>

          {/* Heartfelt note */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border-2 border-dashed border-amber-200">
            <p className="text-xs text-center text-amber-800 leading-relaxed">
              💛 Thank you for being a guardian of student dreams. Your dedication makes all the difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
