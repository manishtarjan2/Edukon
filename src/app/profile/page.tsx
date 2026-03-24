'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CollegePrefDetail {
    college: string
    course: string
    branch: string
}

interface UserProfile {
    _id: string
    user_id: string
    firstName: string
    lastName: string
    gender: string
    email: string
    phone: string
    college: string
    collegePreferences: string[]
    collegePreferenceDetails?: CollegePrefDetail[]
    allottedCollege: string
    course: string
    branch: string
    percentage12th: string
    jeePercentile: string
    provincialState: string
    paymentStatus: string
    createdAt: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile')

            if (res.status === 401) {
                router.push('/login')
                return
            }

            const data = await res.json()

            if (res.ok) {
                setUser(data.user)
            } else {
                setError(data.message || 'Failed to load profile')
            }
        } catch {
            setError('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/logout')
        router.push('/login')
    }

    const printAllotmentLetter = () => {
        if (!user?.allottedCollege) return

        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Allotment Letter - ${user.firstName} ${user.lastName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #1e40af; }
          .title { font-size: 20px; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px; }
          .college-box { border: 2px solid #1e40af; padding: 20px; margin: 20px 0; text-align: center; background: #eff6ff; }
          .college-name { font-size: 24px; font-weight: bold; color: #1e40af; }
          .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .details-table td { padding: 10px; border: 1px solid #ddd; }
          .details-table td:first-child { background: #f3f4f6; font-weight: bold; width: 200px; }
          .pref-table { width: 100%; border-collapse: collapse; margin: 10px 0 20px; }
          .pref-table th { background: #1e40af; color: white; padding: 8px 12px; text-align: left; font-size: 13px; }
          .pref-table td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
          .pref-table tr:nth-child(even) td { background: #f9fafb; }
          .pref-allotted td { background: #dcfce7 !important; font-weight: bold; }
          .footer { margin-top: 50px; text-align: right; }
          .signature { margin-top: 60px; }
          .stamp { border: 2px solid #000; padding: 10px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">📚 EDUKON</div>
          <div class="title">College Allotment Letter</div>
          <div style="font-size: 12px; margin-top: 10px;">Reference No: EDU/${new Date().getFullYear()}/${user._id.slice(-6).toUpperCase()}</div>
        </div>

        <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        
        <p>Dear <strong>${user.firstName} ${user.lastName}</strong>,</p>
        
        <p>We are pleased to inform you that you have been allotted admission to:</p>

        <div class="college-box">
          <div style="font-size: 14px; color: #666;">Allotted College</div>
          <div class="college-name">${user.allottedCollege}</div>
          <div style="margin-top: 10px;">Course: ${user.course} | Branch: ${user.branch}</div>
        </div>

        <h3>Student Details:</h3>
        <table class="details-table">
          <tr><td>Student ID</td><td>${user.user_id || user._id.slice(-8)}</td></tr>
          <tr><td>Full Name</td><td>${user.firstName} ${user.lastName}</td></tr>
          <tr><td>Email</td><td>${user.email}</td></tr>
          <tr><td>Phone</td><td>${user.phone || 'N/A'}</td></tr>
          <tr><td>12th Percentage</td><td>${user.percentage12th || 'N/A'}%</td></tr>
          <tr><td>JEE Percentile</td><td>${user.jeePercentile || 'N/A'}%</td></tr>
        </table>

        <h3>Your College Preferences:</h3>
        ${user.collegePreferenceDetails && user.collegePreferenceDetails.length > 0 ? `
          <table class="pref-table">
            <thead>
              <tr><th>#</th><th>College</th><th>Course</th><th>Branch</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${user.collegePreferenceDetails.map((p, i) => `
                <tr class="${p.college === user.allottedCollege ? 'pref-allotted' : ''}">
                  <td>${i + 1}</td>
                  <td>${p.college}</td>
                  <td>${p.course || '-'}</td>
                  <td>${p.branch || '-'}</td>
                  <td>${p.college === user.allottedCollege ? '✅ Allotted' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <ol>
            ${(user.collegePreferences || []).map(c => `<li>${c} ${c === user.allottedCollege ? '✅ (Allotted)' : ''}</li>`).join('')}
          </ol>
        `}

        <p>Please report to the allotted institution within 15 days with all original documents.</p>

        <div class="footer">
          <div class="signature">
            <p>Authorized Signatory</p>
            <p><strong>Edukon Admissions Committee</strong></p>
            <div class="stamp">OFFICIAL</div>
          </div>
        </div>

        <script>window.print();</script>
      </body>
      </html>
    `)
        printWindow.document.close()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
                <div className="text-xl" style={{ color: 'var(--foreground)' }}>Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4 md:px-6" style={{ backgroundColor: 'var(--background)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="rounded-3xl shadow-2xl overflow-hidden border border-gray-100" style={{ backgroundColor: 'var(--card-bg)' }}>

                    {/* Premium Header with Banner and Circle Profile */}
                    <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700">
                        {/* Abstract shapes for banner */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>

                        {/* Profile Section Overlay */}
                        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl bg-white p-1 overflow-hidden">
                                <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-5xl md:text-6xl border border-gray-100 shadow-inner">
                                    👤
                                </div>
                            </div>
                            <div className="pb-4 hidden sm:block">
                                <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-blue-100 font-medium">Student Profile • {user?.user_id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for profile circle */}
                    <div className="h-20 sm:h-24"></div>

                    {/* User Info for Mobile */}
                    <div className="px-8 sm:hidden mb-6">
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">Student ID: {user?.user_id}</p>
                    </div>

                    {/* Allotment Status Highlight */}
                    <div className="px-8 mb-8">
                        {user?.allottedCollege ? (
                            <div className="p-1 px-1 bg-green-50 rounded-2xl border-2 border-green-100 shadow-sm overflow-hidden">
                                <div className="p-6 bg-white rounded-xl">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-green-700 mb-1">
                                                <span className="text-xl">🏆</span>
                                                <span className="font-bold uppercase tracking-wider text-xs">Admission Confirmed</span>
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                                {user.allottedCollege}
                                            </h2>
                                            <p className="text-gray-600 font-medium mt-1">
                                                {user.course} <span className="mx-2 opacity-30">|</span> {user.branch}
                                            </p>
                                        </div>
                                        <button
                                            onClick={printAllotmentLetter}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 font-bold"
                                        >
                                            <span className="text-lg">🖨️</span> Download Allotment Letter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">⏳</div>
                                <div>
                                    <h2 className="text-amber-800 font-bold">Allotment Pending</h2>
                                    <p className="text-amber-700/80 text-sm">Our admissions team is reviewing your preferences. Check back within 24-48 hours.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-12">
                        {/* Main Info Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Academic Profile */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-4 h-0.5 bg-blue-600 inline-block"></span> Academic Profile
                                </h3>
                                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ProfileField label="12th Percentage" value={`${user?.percentage12th}%`} icon="📊" />
                                    <ProfileField label="JEE Percentile" value={`${user?.jeePercentile}%`} icon="🚀" />
                                    <ProfileField label="Applied Course" value={user?.course} icon="🎓" />
                                    <ProfileField label="Specialization" value={user?.branch} icon="⚡" />
                                </div>
                            </section>

                            {/* Applied Preferences */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-4 h-0.5 bg-blue-600 inline-block"></span> Choice Preferences
                                </h3>
                                <div className="space-y-3">
                                    {user?.collegePreferenceDetails && user.collegePreferenceDetails.length > 0 ? (
                                        // New format: per-college course+branch
                                        user.collegePreferenceDetails.map((pref, idx) => {
                                            const isAllotted = pref.college === user.allottedCollege
                                            return (
                                                <div key={idx} className={`p-4 rounded-xl border-2 transition-all ${isAllotted ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${isAllotted ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                            {idx + 1}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-bold truncate ${isAllotted ? 'text-blue-900' : 'text-gray-800'}`}>
                                                                {pref.college}
                                                            </p>
                                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                                {pref.course && (
                                                                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                                                        📚 {pref.course}
                                                                    </span>
                                                                )}
                                                                {pref.branch && (
                                                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-semibold">
                                                                        🎓 {pref.branch}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {isAllotted && (
                                                            <span className="ml-auto bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase flex-shrink-0">Selected</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        // Fallback: old string-only format
                                        user?.collegePreferences?.map((college, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${college === user.allottedCollege ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${college === user.allottedCollege ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    {idx + 1}
                                                </span>
                                                <span className={`font-semibold ${college === user.allottedCollege ? 'text-blue-900' : 'text-gray-700'}`}>
                                                    {college}
                                                </span>
                                                {college === user.allottedCollege && (
                                                    <span className="ml-auto bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase">Selected</span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Info Column */}
                        <div className="space-y-8">
                            {/* Identity Info */}
                            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Identity Details</h3>
                                <div className="space-y-4">
                                    <ProfileField label="Phone Number" value={user?.phone} icon="📞" compact />
                                    <ProfileField label="Email Address" value={user?.email} icon="✉️" compact />
                                    <ProfileField label="State of Origin" value={user?.provincialState} icon="📍" compact />
                                    <ProfileField label="Gender" value={user?.gender} icon="🚻" compact />
                                </div>
                            </div>

                            {/* Status Info */}
                            <div className="bg-indigo-900 p-6 rounded-2xl shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <h3 className="font-bold text-white mb-4 relative z-10">Verification Status</h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                        <span className="text-white/80 text-sm">Payment Status: <span className="text-white font-bold uppercase ml-1">{user?.paymentStatus}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                        <span className="text-white/80 text-sm">Documents: <span className="text-white font-bold uppercase ml-1">Verified</span></span>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] text-white/50 leading-relaxed italic">
                                            Last Updated: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-col gap-3">
                                <a href="/" className="w-full py-3 rounded-xl font-bold text-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                                    🏠 Back to Home
                                </a>
                                <button onClick={handleLogout} className="w-full py-3 rounded-xl font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                                    🚪 Logout Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProfileField({ label, value, icon, compact = false }: { label: string; value?: string; icon?: string; compact?: boolean }) {
    if (compact) {
        return (
            <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{icon}</span>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
                    <p className="text-sm font-semibold text-gray-700">{value || '-'}</p>
                </div>
            </div>
        )
    }
    return (
        <div className="group">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{icon}</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{label}</p>
            </div>
            <p className="text-xl font-black text-gray-800 tracking-tight" style={{ color: 'var(--foreground)' }}>
                {value || '-'}
            </p>
        </div>
    )
}
