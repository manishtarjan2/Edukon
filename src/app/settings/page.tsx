'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const router = useRouter()
    const [theme, setTheme] = useState('light')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)

        // Check auth
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/profile')
            setIsLoggedIn(res.ok)
        } catch {
            setIsLoggedIn(false)
        }
    }

    const changeTheme = (newTheme: string) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    return (
        <div className="min-h-screen py-10 px-4" style={{ backgroundColor: 'var(--background)' }}>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
                    ⚙️ Settings
                </h1>

                {/* Theme Settings */}
                <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                        Appearance
                    </h2>

                    <div className="space-y-3">
                        <label className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                            style={{ backgroundColor: theme === 'light' ? 'var(--secondary)' : 'transparent' }}>
                            <input
                                type="radio"
                                name="theme"
                                checked={theme === 'light'}
                                onChange={() => changeTheme('light')}
                                className="w-4 h-4"
                            />
                            <span className="w-8 h-8 rounded-full bg-white border-2 border-gray-300"></span>
                            <div>
                                <p className="font-medium" style={{ color: 'var(--foreground)' }}>Light Mode</p>
                                <p className="text-sm" style={{ color: 'var(--nav-text)', opacity: 0.7 }}>Clean, bright interface</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                            style={{ backgroundColor: theme === 'dark' ? 'var(--secondary)' : 'transparent' }}>
                            <input
                                type="radio"
                                name="theme"
                                checked={theme === 'dark'}
                                onChange={() => changeTheme('dark')}
                                className="w-4 h-4"
                            />
                            <span className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-600"></span>
                            <div>
                                <p className="font-medium" style={{ color: 'var(--foreground)' }}>Dark Mode</p>
                                <p className="text-sm" style={{ color: 'var(--nav-text)', opacity: 0.7 }}>Easy on the eyes</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Account Settings */}
                {isLoggedIn && (
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                            Account
                        </h2>

                        <div className="space-y-3">
                            <a
                                href="/profile"
                                className="flex items-center gap-3 p-3 rounded-lg transition"
                                style={{ color: 'var(--foreground)' }}
                            >
                                <span className="text-xl">👤</span>
                                <div>
                                    <p className="font-medium">View Profile</p>
                                    <p className="text-sm" style={{ opacity: 0.7 }}>See your account details</p>
                                </div>
                            </a>

                            <button
                                onClick={async () => {
                                    await fetch('/api/logout')
                                    router.push('/login')
                                }}
                                className="flex items-center gap-3 p-3 rounded-lg transition w-full text-left text-red-500"
                            >
                                <span className="text-xl">🚪</span>
                                <div>
                                    <p className="font-medium">Logout</p>
                                    <p className="text-sm" style={{ opacity: 0.7 }}>Sign out of your account</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-6">
                    <a
                        href="/"
                        className="inline-block px-6 py-2 rounded-lg transition"
                        style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}
