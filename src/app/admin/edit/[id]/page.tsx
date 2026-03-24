'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface UserData {
  _id: string
  user_id: string
  firstName: string
  lastName: string
  gender: string
  email: string
  phone: string
  college: string
  collegePreferences: string[]
  allottedCollege: string
  course: string
  branch: string
  percentage12th: string
  jeePercentile: string
  provincialState: string
  paymentStatus: string
}

export default function EditUser() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user/${id}`)
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
      } else {
        setError(data.message || 'Failed to load user')
      }
    } catch {
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('✅ Student details updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message || 'Failed to update')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/user/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Student deleted successfully')
        router.push('/admin/dashboard')
      } else {
        setError('Failed to delete student')
      }
    } catch {
      setError('Something went wrong')
    }
  }

  const updateField = (field: string, value: string) => {
    if (!user) return
    setUser({ ...user, [field]: value })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="text-4xl animate-spin inline-block mb-4">⏳</div>
          <p className="text-xl font-medium" style={{ color: 'var(--foreground)' }}>Loading student data...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">⚠️ {error}</p>
          <a href="/admin/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen py-8 px-4 md:px-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <a href="/admin/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition mb-2 inline-block">
              ← Back to Dashboard
            </a>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
              Edit Student: {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--nav-text)' }}>
              ID: {user.user_id || user._id}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition border-2 border-red-200"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">⚠️ {error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium">{success}</div>}

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">👤 Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <EditField label="First Name" value={user.firstName} onChange={v => updateField('firstName', v)} />
              <EditField label="Last Name" value={user.lastName || ''} onChange={v => updateField('lastName', v)} />
              <EditField label="Email" value={user.email} onChange={v => updateField('email', v)} type="email" />
              <EditField label="Phone" value={user.phone || ''} onChange={v => updateField('phone', v)} type="tel" />
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                <select
                  value={user.gender || ''}
                  onChange={e => updateField('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                >
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <EditField label="Provincial State" value={user.provincialState || ''} onChange={v => updateField('provincialState', v)} />
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">🎓 Academic Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <EditField label="12th Percentage" value={user.percentage12th || ''} onChange={v => updateField('percentage12th', v)} />
              <EditField label="JEE Percentile" value={user.jeePercentile || ''} onChange={v => updateField('jeePercentile', v)} />
              <EditField label="Course" value={user.course || ''} onChange={v => updateField('course', v)} />
              <EditField label="Branch" value={user.branch || ''} onChange={v => updateField('branch', v)} />
            </div>
          </div>

          {/* College Allotment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">🏛️ College Allotment</h2>
            </div>
            <div className="p-6 space-y-5">
              <EditField label="Allotted College" value={user.allottedCollege || ''} onChange={v => updateField('allottedCollege', v)} />

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">College Preferences</label>
                <div className="space-y-2">
                  {(user.collegePreferences || []).map((college, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 ${college === user.allottedCollege ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${college === user.allottedCollege ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'}`}>
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-700">{college}</span>
                      {college === user.allottedCollege && (
                        <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">ALLOTTED</span>
                      )}
                    </div>
                  ))}
                  {(!user.collegePreferences || user.collegePreferences.length === 0) && (
                    <p className="text-gray-400 text-sm italic">No college preferences selected</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Status</label>
                <select
                  value={user.paymentStatus || 'pending'}
                  onChange={e => updateField('paymentStatus', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between items-center">
          <a href="/admin/dashboard" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
            ← Back to Dashboard
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {saving ? 'Saving...' : '💾 Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditField({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
      />
    </div>
  )
}
