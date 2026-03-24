'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Avatar options
const avatars = ['👤', '👨', '👩', '🧑', '👦', '👧']

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [selectedAvatar, setSelectedAvatar] = useState(0)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    checkAuthStatus()
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    // Load saved avatar
    const savedAvatar = localStorage.getItem('avatar') || '0'
    setSelectedAvatar(parseInt(savedAvatar))
  }, [])

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setIsLoggedIn(true)
        setUserName(data.user?.firstName || 'User')
        setUserRole(data.user?.role || 'user')
      } else {
        // Check for admin_token via separate check if profile fails (for admins)
        const roleFromCookie = document.cookie.split('; ').find(row => row.startsWith('userRole='))?.split('=')[1]
        if (roleFromCookie) {
          setIsLoggedIn(true)
          setUserRole(roleFromCookie)
          setUserName(roleFromCookie === 'founder' ? 'Founder' : 'Admin')
        } else {
          setIsLoggedIn(false)
        }
      }
    } catch {
      setIsLoggedIn(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/logout')
    // Clear admin cookies too
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setIsLoggedIn(false)
    setUserRole('')
    setProfileOpen(false)
    router.push('/login')
  }

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    setSettingsOpen(false)
  }

  const changeAvatar = (index: number) => {
    setSelectedAvatar(index)
    localStorage.setItem('avatar', index.toString())
  }

  const isActive = (path: string) => pathname === path

  const getNavLinks = () => {
    const links = [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/register', label: 'Register' },
      { href: '/admin/dashboard', label: 'Dashboard' },
    ]

    if (isLoggedIn && userRole === 'founder') {
      links.push({ href: '/founder', label: '👑 Founder' })
    }

    return links
  }

  const navLinks = getNavLinks()

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 shadow-md"
      style={{ backgroundColor: 'var(--nav-bg)' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-sm group-hover:shadow-md transition-shadow">
          <img src="/logo.png" alt="Edukon Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight cursor-pointer" style={{ color: 'var(--primary)' }}>
          Edukon
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-4 text-sm font-semibold items-center">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`nav-link px-3 py-2 rounded-lg transition-all ${isActive(link.href) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              {link.label}
            </Link>
          </li>
        ))}

        {isLoggedIn ? (
          <>
            {/* Profile Avatar with Dropdown */}
            <li className="relative ml-2">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full border-2 border-transparent hover:border-blue-500 transition-all bg-gray-50 pr-4"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xl shadow-inner text-white overflow-hidden border border-blue-400">
                  {avatars[selectedAvatar]}
                </div>
                <div className="text-left">
                  <span className="text-xs block text-gray-500 leading-none">Logged in as</span>
                  <span className="text-sm font-bold block" style={{ color: 'var(--foreground)' }}>
                    {userName}
                  </span>
                </div>
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--nav-text)' }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>

                  {/* User Info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      Hello, {userName}!
                    </p>
                  </div>

                  {/* Avatar Selection */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                      Choose Avatar
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {avatars.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => changeAvatar(index)}
                          className={`text-2xl p-1 rounded-lg transition ${selectedAvatar === index ? 'ring-2 ring-blue-500' : ''}`}
                          style={{ backgroundColor: selectedAvatar === index ? 'var(--secondary)' : 'transparent' }}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Links */}
                  {userRole === 'user' && (
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 transition"
                      style={{ color: 'var(--foreground)' }}
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>👤</span> My Profile
                    </Link>
                  )}

                  {userRole === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-2 transition"
                      style={{ color: 'var(--foreground)' }}
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>📊</span> Admin Dashboard
                    </Link>
                  )}

                  {userRole === 'founder' && (
                    <Link
                      href="/founder"
                      className="flex items-center gap-3 px-4 py-2 transition"
                      style={{ color: 'var(--foreground)' }}
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>👑</span> Founder Dashboard
                    </Link>
                  )}

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 transition"
                    style={{ color: 'var(--foreground)' }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <span>⚙️</span> Settings
                  </Link>

                  <div className="border-t my-1" style={{ borderColor: 'var(--border)' }}></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-500 transition"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className="btn-outline">
              Login
            </Link>
          </li>
        )}

        {/* Three Dot Settings Menu */}
        <li className="relative ml-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-full transition"
            style={{ color: 'var(--nav-text)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="4" r="2" />
              <circle cx="10" cy="10" r="2" />
              <circle cx="10" cy="16" r="2" />
            </svg>
          </button>

          {/* Settings Dropdown */}
          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                Theme
              </div>

              <button
                onClick={() => changeTheme('light')}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition ${theme === 'light' ? 'font-semibold' : ''}`}
                style={{ color: 'var(--foreground)' }}
              >
                <span className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></span>
                Light
                {theme === 'light' && <span className="ml-auto text-green-500">✓</span>}
              </button>

              <button
                onClick={() => changeTheme('dark')}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 transition ${theme === 'dark' ? 'font-semibold' : ''}`}
                style={{ color: 'var(--foreground)' }}
              >
                <span className="w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-500"></span>
                Dark
                {theme === 'dark' && <span className="ml-auto text-green-500">✓</span>}
              </button>
            </div>
          )}
        </li>
      </ul>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center gap-3">
        {/* Profile Avatar - Mobile */}
        {isLoggedIn && (
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="text-2xl"
          >
            {avatars[selectedAvatar]}
          </button>
        )}

        {/* Three Dot Menu - Mobile */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="p-2 rounded-full"
          style={{ color: 'var(--nav-text)' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="4" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="10" cy="16" r="2" />
          </svg>
        </button>

        {/* Hamburger Button */}
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            style={{ backgroundColor: 'var(--nav-text)' }}></span>
          <span className={`w-6 h-0.5 transition-all ${menuOpen ? 'opacity-0' : ''}`}
            style={{ backgroundColor: 'var(--nav-text)' }}></span>
          <span className={`w-6 h-0.5 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            style={{ backgroundColor: 'var(--nav-text)' }}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 shadow-lg md:hidden z-50"
          style={{ backgroundColor: 'var(--nav-bg)' }}>
          <ul className="flex flex-col text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href} style={{ borderBottom: '1px solid var(--border)' }}>
                <Link
                  href={link.href}
                  className={`block px-6 py-3 ${isActive(link.href) ? 'font-bold' : ''}`}
                  style={{
                    color: 'var(--nav-text)',
                    backgroundColor: isActive(link.href) ? 'var(--secondary)' : 'transparent'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {isLoggedIn ? (
              <>
                <li style={{ borderBottom: '1px solid var(--border)' }}>
                  {userRole === 'user' ? (
                    <Link
                      href="/profile"
                      className="block px-6 py-3"
                      style={{ color: 'var(--nav-text)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                  ) : userRole === 'admin' ? (
                    <Link
                      href="/admin/dashboard"
                      className="block px-6 py-3"
                      style={{ color: 'var(--nav-text)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      📊 Admin Dashboard
                    </Link>
                  ) : userRole === 'founder' ? (
                    <Link
                      href="/founder"
                      className="block px-6 py-3"
                      style={{ color: 'var(--nav-text)' }}
                      onClick={() => setMenuOpen(false)}
                    >
                      👑 Founder Dashboard
                    </Link>
                  ) : null}
                </li>
                <li>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full text-left px-6 py-3 text-red-500 font-medium"
                  >
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="block px-6 py-3 font-medium"
                  style={{ color: 'var(--primary)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Profile Dropdown - Mobile */}
      {profileOpen && (
        <div className="md:hidden absolute top-16 right-4 w-64 rounded-lg shadow-lg py-2 z-50"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>

          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              Hello, {userName}!
            </p>
          </div>

          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              Choose Avatar
            </p>
            <div className="flex gap-2 flex-wrap">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => changeAvatar(index)}
                  className={`text-2xl p-1 rounded-lg transition ${selectedAvatar === index ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: selectedAvatar === index ? 'var(--secondary)' : 'transparent' }}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {userRole === 'user' && (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 transition"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setProfileOpen(false)}
            >
              <span>👤</span> My Profile
            </Link>
          )}

          {userRole === 'admin' && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-2 transition"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setProfileOpen(false)}
            >
              <span>📊</span> Admin Dashboard
            </Link>
          )}

          {userRole === 'founder' && (
            <Link
              href="/founder"
              className="flex items-center gap-3 px-4 py-2 transition"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setProfileOpen(false)}
            >
              <span>👑</span> Founder Dashboard
            </Link>
          )}

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 transition"
            style={{ color: 'var(--foreground)' }}
            onClick={() => setProfileOpen(false)}
          >
            <span>⚙️</span> Settings
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      )}

      {/* Settings Dropdown - Mobile */}
      {settingsOpen && (
        <div className="md:hidden absolute top-16 right-12 w-48 rounded-lg shadow-lg py-2 z-50"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--foreground)', opacity: 0.6 }}>
            Theme
          </div>

          <button
            onClick={() => changeTheme('light')}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 ${theme === 'light' ? 'font-semibold' : ''}`}
            style={{ color: 'var(--foreground)' }}
          >
            <span className="w-4 h-4 rounded-full bg-white border-2 border-gray-300"></span>
            Light
            {theme === 'light' && <span className="ml-auto text-green-500">✓</span>}
          </button>

          <button
            onClick={() => changeTheme('dark')}
            className={`w-full px-4 py-2 text-left flex items-center gap-3 ${theme === 'dark' ? 'font-semibold' : ''}`}
            style={{ color: 'var(--foreground)' }}
          >
            <span className="w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-500"></span>
            Dark
            {theme === 'dark' && <span className="ml-auto text-green-500">✓</span>}
          </button>
        </div>
      )}

      {/* Click outside to close */}
      {(settingsOpen || menuOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setSettingsOpen(false); setMenuOpen(false); setProfileOpen(false); }}
        ></div>
      )}
    </nav>
  )
}
