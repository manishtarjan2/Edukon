'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FormOptionsManager from '@/components/FormOptionsManager'

interface Admin {
    _id: string
    user_id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    college: string
    assignedWork: string
    role: string
    createdAt: string
}

export default function FounderDashboard() {
    const router = useRouter()
    const [admins, setAdmins] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)

    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        college: '',
        assignedWork: ''
    })

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/register')
            if (res.status === 403) {
                router.push('/admin/login')
                return
            }
            const data = await res.json()
            if (res.ok) {
                setAdmins(data.admins || [])
            }
        } catch (err) {
            console.error('Error fetching admins:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdmin)
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess('✅ Admin created successfully!')
                setShowAddModal(false)
                setNewAdmin({ firstName: '', lastName: '', email: '', password: '', phone: '', college: '', assignedWork: '' })
                fetchAdmins()
            } else {
                setError(data.message || 'Failed to create admin')
            }
        } catch {
            setError('Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditAdmin = (admin: Admin) => {
        setEditingAdmin(admin)
        setShowEditModal(true)
    }

    const handleUpdateAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingAdmin) return

        setSubmitting(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/admin/register', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: editingAdmin._id,
                    firstName: editingAdmin.firstName,
                    lastName: editingAdmin.lastName,
                    phone: editingAdmin.phone,
                    college: editingAdmin.college,
                    assignedWork: editingAdmin.assignedWork
                })
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess('✅ Admin updated successfully!')
                setShowEditModal(false)
                setEditingAdmin(null)
                fetchAdmins()
            } else {
                setError(data.message || 'Failed to update admin')
            }
        } catch {
            setError('Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteAdmin = async (adminId: string, adminName: string) => {
        if (!confirm(`Are you sure you want to remove ${adminName} as admin?`)) return

        try {
            const res = await fetch('/api/admin/register', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId })
            })

            if (res.ok) {
                setSuccess('✅ Admin removed successfully!')
                fetchAdmins()
            } else {
                setError('Failed to remove admin')
            }
        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <div className="min-h-screen p-6 md:p-10" style={{ background: 'linear-gradient(to bottom, #fef8f0, #f5e6d3)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Nostalgic Header Section */}
                <div className="mb-10 bg-white rounded-3xl p-8 shadow-lg border-4 border-amber-100 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-amber-100/50 to-transparent"></div>
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-amber-400 rounded-full"></div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-orange-400 rounded-full"></div>

                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full border-4 border-amber-200 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-5xl">
                                👑
                            </div>
                            <div>
                                <div className="handwritten text-amber-700 text-lg mb-1">
                                    Edukon Leadership
                                </div>
                                <h1 className="text-4xl font-bold mb-2" style={{ color: '#3d2f1f' }}>
                                    Founder's Circle
                                </h1>
                                <p className="text-lg" style={{ color: '#5a4a3a' }}>
                                    Empowering the team that empowers students 💛
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 text-white"
                            style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}
                        >
                            <span className="text-2xl">➕</span> Add New Guardian
                        </button>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-center gap-3 font-medium shadow-md">
                        <span className="text-2xl">⚠️</span> {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl flex items-center gap-3 font-medium shadow-md">
                        <span className="text-2xl">✅</span> {success}
                    </div>
                )}

                {/* Stats Cards with nostalgic style */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <p className="text-sm font-semibold mb-2" style={{ color: '#5a4a3a' }}>
                                Dream Guardians
                            </p>
                            <p className="text-4xl font-bold mb-2" style={{ color: '#d4851c' }}>
                                {admins.length}
                            </p>
                            <div className="text-3xl">👥</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <p className="text-sm font-semibold mb-2" style={{ color: '#5a4a3a' }}>
                                Active & Ready
                            </p>
                            <p className="text-4xl font-bold mb-2 text-green-600">
                                {admins.length}
                            </p>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative">
                            <p className="text-sm font-semibold mb-2" style={{ color: '#5a4a3a' }}>
                                Your Role
                            </p>
                            <p className="text-2xl font-bold mb-2 text-purple-600">
                                👑 Founder
                            </p>
                            <div className="text-3xl">🎖️</div>
                        </div>
                    </div>
                </div>

                {/* Admins Table with vintage feel */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-100">
                    <div className="p-6 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#3d2f1f' }}>
                            <span>📋</span> Our Dream Guardians
                        </h2>
                        <p className="handwritten text-lg text-amber-700 mt-1">
                            The team making it all possible
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-amber-50">
                                    <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: '#3d2f1f' }}>Admin ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: '#3d2f1f' }}>Guardian Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: '#3d2f1f' }}>Assigned College</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: '#3d2f1f' }}>Assigned Work</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: '#3d2f1f' }}>Contact</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold" style={{ color: '#3d2f1f' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#5a4a3a' }}>
                                        <span className="text-4xl inline-block animate-spin">⏳</span>
                                        <p className="mt-2">Loading guardians...</p>
                                    </td></tr>
                                ) : admins.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12">
                                        <span className="text-5xl">👥</span>
                                        <p className="mt-4 handwritten text-2xl text-amber-700">No guardians yet</p>
                                        <p className="mt-2" style={{ color: '#5a4a3a' }}>Click "Add New Guardian" to create one</p>
                                    </td></tr>
                                ) : (
                                    admins.map((admin, index) => (
                                        <tr key={admin._id} className={`border-t-2 border-amber-100 hover:bg-amber-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm px-3 py-1 bg-amber-100 rounded-lg text-amber-800 font-semibold">
                                                    {admin.user_id || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                                        {admin.firstName?.[0]}{admin.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold" style={{ color: '#3d2f1f' }}>
                                                            {admin.firstName} {admin.lastName}
                                                        </div>
                                                        <div className="text-sm text-amber-700">{admin.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: '#5a4a3a' }}>
                                                {admin.college || <span className="italic text-amber-600">Not Assigned</span>}
                                            </td>
                                            <td className="px-6 py-4" style={{ color: '#5a4a3a' }}>
                                                {admin.assignedWork || <span className="italic text-amber-600">No Work Assigned</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm" style={{ color: '#5a4a3a' }}>
                                                {admin.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEditAdmin(admin)}
                                                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-2 border-blue-200 font-semibold"
                                                        title="Edit Guardian"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin._id, `${admin.firstName} ${admin.lastName}`)}
                                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-200 font-semibold"
                                                        title="Remove Guardian"
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Options Manager Section */}
                <div className="mt-10">
                    <FormOptionsManager />
                </div>

                {/* Navigation Links */}
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                    <a href="/admin/dashboard" className="px-6 py-3 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 transition-all font-semibold flex items-center gap-2 shadow-md" style={{ color: '#d4851c' }}>
                        📊 Student Dashboard
                    </a>
                    <a href="/admin/login" className="px-6 py-3 bg-white border-2 border-amber-200 rounded-xl hover:border-amber-400 transition-all font-semibold flex items-center gap-2 shadow-md" style={{ color: '#d4851c' }}>
                        ↩️ Logout
                    </a>
                </div>
            </div>

            {/* Add Admin Modal with nostalgic design */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border-4 border-amber-100 relative">
                        {/* Decorative corners */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 rounded-full"></div>
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 rounded-full"></div>

                        <div className="p-8 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d2f1f' }}>
                                ➕ Add New Guardian
                            </h2>
                            <p className="handwritten text-xl text-amber-700">
                                Welcoming a new team member 💛
                            </p>
                        </div>

                        <form onSubmit={handleAddAdmin} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>First Name *</label>
                                    <input
                                        type="text"
                                        value={newAdmin.firstName}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Last Name</label>
                                    <input
                                        type="text"
                                        value={newAdmin.lastName}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Email *</label>
                                    <input
                                        type="email"
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Password *</label>
                                    <input
                                        type="password"
                                        value={newAdmin.password}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Assigned College</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. IIT Delhi"
                                        value={newAdmin.college}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, college: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Assigned Work</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Admission Verifier"
                                        value={newAdmin.assignedWork}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, assignedWork: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Phone</label>
                                <input
                                    type="tel"
                                    value={newAdmin.phone}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 rounded-xl border-2 border-amber-200 font-semibold hover:bg-amber-50 transition-all"
                                    style={{ color: '#5a4a3a' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                    style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}
                                >
                                    {submitting ? 'Creating...' : 'Create Guardian ✨'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditModal && editingAdmin && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border-4 border-amber-100 relative">
                        {/* Decorative corners */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 rounded-full"></div>
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-400 rounded-full"></div>

                        <div className="p-8 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d2f1f' }}>
                                ✏️ Edit Guardian Details
                            </h2>
                            <p className="handwritten text-xl text-amber-700">
                                Updating {editingAdmin.firstName}'s information 💛
                            </p>
                        </div>

                        <form onSubmit={handleUpdateAdmin} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>First Name *</label>
                                    <input
                                        type="text"
                                        value={editingAdmin.firstName}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>Last Name</label>
                                    <input
                                        type="text"
                                        value={editingAdmin.lastName}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>📞 Phone Number</label>
                                <input
                                    type="tel"
                                    value={editingAdmin.phone || ''}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                    placeholder="9876543210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>🏫 Assigned College</label>
                                <input
                                    type="text"
                                    placeholder="e.g. IIT Delhi"
                                    value={editingAdmin.college || ''}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, college: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2" style={{ color: '#5a4a3a' }}>📋 Assigned Work</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Admission Verifier"
                                    value={editingAdmin.assignedWork || ''}
                                    onChange={(e) => setEditingAdmin({ ...editingAdmin, assignedWork: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all bg-amber-50/30"
                                />
                            </div>

                            <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                                <p className="text-sm" style={{ color: '#5a4a3a' }}>
                                    <strong>Email:</strong> {editingAdmin.email}
                                </p>
                                <p className="text-sm mt-1" style={{ color: '#5a4a3a' }}>
                                    <strong>Admin ID:</strong> {editingAdmin.user_id}
                                </p>
                                <p className="text-xs mt-2 text-amber-700">
                                    ℹ️ Email and Admin ID cannot be changed
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false)
                                        setEditingAdmin(null)
                                    }}
                                    className="flex-1 py-3 rounded-xl border-2 border-amber-200 font-semibold hover:bg-amber-50 transition-all"
                                    style={{ color: '#5a4a3a' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                    style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}
                                >
                                    {submitting ? 'Updating...' : 'Update Guardian ✨'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
