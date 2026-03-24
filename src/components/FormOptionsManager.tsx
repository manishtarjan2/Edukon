'use client'

import { useEffect, useState, useRef } from 'react'

interface FormOption {
    _id: string
    type: 'college' | 'branch' | 'course'
    name: string
    active: boolean
}

interface CollegeOption {
    _id: string
    college: string
    courses: string[]
    branches: string[]
    active: boolean
}

export default function FormOptionsManager() {
    const [options, setOptions] = useState<FormOption[]>([])
    const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([])
    const [loading, setLoading] = useState(true)
    const [mode, setMode] = useState<'simple' | 'college-specific'>('college-specific')
    const [activeTab, setActiveTab] = useState<'college' | 'branch' | 'course'>('college')
    const [newOptionName, setNewOptionName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    // College-specific state
    const [newCourse, setNewCourse] = useState('')
    const [newBranch, setNewBranch] = useState('')
    const [editingCollege, setEditingCollege] = useState<CollegeOption | null>(null)
    const [showCollegeModal, setShowCollegeModal] = useState(false)

    // New college creation state
    const [showAddCollegeForm, setShowAddCollegeForm] = useState(false)
    const [newCollegeName, setNewCollegeName] = useState('')
    const newCollegeInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchOptions()
        fetchCollegeOptions()
    }, [])

    useEffect(() => {
        if (showAddCollegeForm && newCollegeInputRef.current) {
            newCollegeInputRef.current.focus()
        }
    }, [showAddCollegeForm])

    const showMessage = (type: string, text: string) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 4000)
    }

    const fetchOptions = async () => {
        try {
            const res = await fetch('/api/founder/form-options')
            const data = await res.json()
            if (res.ok) {
                setOptions(data.options)
            }
        } catch (error) {
            console.error('Failed to fetch options:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCollegeOptions = async () => {
        try {
            const res = await fetch('/api/founder/college-options')
            const data = await res.json()
            if (res.ok) {
                setCollegeOptions(data.colleges || [])
            }
        } catch (error) {
            console.error('Failed to fetch college options:', error)
        }
    }

    const handleAddOption = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newOptionName.trim()) return

        setSubmitting(true)
        setMessage({ type: '', text: '' })

        try {
            const res = await fetch('/api/founder/form-options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: activeTab, name: newOptionName.trim() })
            })
            const data = await res.json()
            if (res.ok) {
                showMessage('success', `✅ ${activeTab} added successfully!`)
                setNewOptionName('')
                fetchOptions()
            } else {
                showMessage('error', data.error || 'Failed to add option')
            }
        } catch {
            showMessage('error', 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteOption = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove "${name}"?`)) return
        try {
            const res = await fetch(`/api/founder/form-options?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                showMessage('success', `✅ Removed successfully!`)
                fetchOptions()
            } else {
                showMessage('error', 'Failed to delete option')
            }
        } catch {
            showMessage('error', 'Something went wrong')
        }
    }

    // Create new college with inline form
    const handleCreateNewCollege = async (e: React.FormEvent) => {
        e.preventDefault()
        const name = newCollegeName.trim()
        if (!name) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/founder/college-options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ college: name, courses: [], branches: [] })
            })
            const data = await res.json()
            if (res.ok) {
                showMessage('success', `✅ College "${name}" created! Now add courses & branches.`)
                setNewCollegeName('')
                setShowAddCollegeForm(false)
                await fetchCollegeOptions()
                // Open edit modal for the new college
                const newCol = data.college
                if (newCol) {
                    setEditingCollege(newCol)
                    setShowCollegeModal(true)
                }
            } else {
                showMessage('error', data.error || 'Failed to create college')
            }
        } catch {
            showMessage('error', 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleSaveCollegeOptions = async () => {
        if (!editingCollege) return

        setSubmitting(true)
        setMessage({ type: '', text: '' })

        try {
            const isNew = !editingCollege._id
            const res = await fetch('/api/founder/college-options', {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collegeId: editingCollege._id,
                    college: editingCollege.college,
                    courses: editingCollege.courses,
                    branches: editingCollege.branches
                })
            })
            const data = await res.json()
            if (res.ok) {
                showMessage('success', `✅ College options saved successfully!`)
                setShowCollegeModal(false)
                setEditingCollege(null)
                setNewCourse('')
                setNewBranch('')
                fetchCollegeOptions()
            } else {
                showMessage('error', data.error || 'Failed to save college options')
            }
        } catch {
            showMessage('error', 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditCollegeOptions = (college: CollegeOption) => {
        setEditingCollege({ ...college, courses: [...college.courses], branches: [...college.branches] })
        setNewCourse('')
        setNewBranch('')
        setShowCollegeModal(true)
    }

    const handleDeleteCollegeOption = async (id: string, college: string) => {
        if (!confirm(`Are you sure you want to remove "${college}" and all its courses/branches?`)) return
        try {
            const res = await fetch(`/api/founder/college-options?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                showMessage('success', `✅ College removed successfully!`)
                fetchCollegeOptions()
            } else {
                showMessage('error', 'Failed to delete college')
            }
        } catch {
            showMessage('error', 'Something went wrong')
        }
    }

    const addCourseToCollege = () => {
        if (!editingCollege || !newCourse.trim()) return
        if (editingCollege.courses.includes(newCourse.trim())) {
            showMessage('error', 'Course already exists!')
            return
        }
        setEditingCollege({ ...editingCollege, courses: [...editingCollege.courses, newCourse.trim()] })
        setNewCourse('')
    }

    const removeCourseFromCollege = (course: string) => {
        if (!editingCollege) return
        setEditingCollege({ ...editingCollege, courses: editingCollege.courses.filter(c => c !== course) })
    }

    const addBranchToCollege = () => {
        if (!editingCollege || !newBranch.trim()) return
        if (editingCollege.branches.includes(newBranch.trim())) {
            showMessage('error', 'Branch already exists!')
            return
        }
        setEditingCollege({ ...editingCollege, branches: [...editingCollege.branches, newBranch.trim()] })
        setNewBranch('')
    }

    const removeBranchFromCollege = (branch: string) => {
        if (!editingCollege) return
        setEditingCollege({ ...editingCollege, branches: editingCollege.branches.filter(b => b !== branch) })
    }

    const filteredOptions = options.filter(opt => opt.type === activeTab)

    const tabs = [
        { key: 'college' as const, label: 'Colleges', icon: '🏫' },
        { key: 'branch' as const, label: 'Branches', icon: '🎓' },
        { key: 'course' as const, label: 'Courses', icon: '📚' }
    ]

    return (
        <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-amber-100">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-1" style={{ color: '#3d2f1f' }}>
                        📝 Registration Form Options
                    </h2>
                    <p className="text-amber-700">
                        Manage colleges, courses & branches shown in the student registration form
                    </p>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="mb-6 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
                <p className="font-semibold mb-3" style={{ color: '#3d2f1f' }}>Management Mode:</p>
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => setMode('college-specific')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${mode === 'college-specific'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-amber-800 border-2 border-amber-300 hover:border-amber-500'
                            }`}
                    >
                        🎓 College-Specific Mode
                    </button>
                    <button
                        onClick={() => setMode('simple')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${mode === 'simple'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-white text-amber-800 border-2 border-amber-300 hover:border-amber-500'
                            }`}
                    >
                        📋 Simple Mode
                    </button>
                </div>
                <p className="text-sm mt-3 text-amber-700">
                    {mode === 'college-specific'
                        ? '🏫 Each college has its own specific courses and branches — recommended!'
                        : '📝 Manage global lists of colleges, courses, and branches separately'}
                </p>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-xl mb-4 font-medium flex items-center gap-2 ${message.type === 'success'
                    ? 'bg-green-50 text-green-800 border-2 border-green-200'
                    : 'bg-red-50 text-red-800 border-2 border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {mode === 'simple' ? (
                <>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Add New Option Form */}
                    <form onSubmit={handleAddOption} className="mb-6">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newOptionName}
                                onChange={(e) => setNewOptionName(e.target.value)}
                                placeholder={`Enter new ${activeTab} name...`}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none"
                                disabled={submitting}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newOptionName.trim()}
                                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? '⏳ Adding...' : '➕ Add'}
                            </button>
                        </div>
                    </form>

                    {/* Options List */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg mb-3" style={{ color: '#3d2f1f' }}>
                            Current {tabs.find(t => t.key === activeTab)?.label} ({filteredOptions.length})
                        </h3>
                        {loading ? (
                            <p className="text-amber-700 p-4">Loading...</p>
                        ) : filteredOptions.length === 0 ? (
                            <p className="text-amber-700 p-4 bg-amber-50 rounded-xl">
                                No {activeTab}s added yet. Add your first one above!
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredOptions.map(option => (
                                    <div
                                        key={option._id}
                                        className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all"
                                    >
                                        <span className="font-medium" style={{ color: '#3d2f1f' }}>{option.name}</span>
                                        <button
                                            onClick={() => handleDeleteOption(option._id, option.name)}
                                            className="text-red-600 hover:text-red-800 font-bold text-xl hover:scale-125 transition-transform"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* College-Specific Mode */}
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h3 className="font-bold text-xl" style={{ color: '#3d2f1f' }}>
                                    🏫 Colleges with Courses & Branches
                                    <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                                        {collegeOptions.length} colleges
                                    </span>
                                </h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    Each college can have different courses and branches available to students
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAddCollegeForm(v => !v)}
                                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                {showAddCollegeForm ? '✕ Cancel' : '➕ Add College'}
                            </button>
                        </div>

                        {/* Inline Add College Form */}
                        {showAddCollegeForm && (
                            <form
                                onSubmit={handleCreateNewCollege}
                                className="mb-6 p-5 bg-green-50 border-2 border-green-300 rounded-2xl"
                            >
                                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                    <span>🏫</span> Create New College
                                </h4>
                                <div className="flex gap-3">
                                    <input
                                        ref={newCollegeInputRef}
                                        type="text"
                                        value={newCollegeName}
                                        onChange={e => setNewCollegeName(e.target.value)}
                                        placeholder="e.g. IIT Delhi, NIT Trichy..."
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:outline-none text-gray-800"
                                        disabled={submitting}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !newCollegeName.trim()}
                                        className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {submitting ? '⏳ Creating...' : '✅ Create & Edit'}
                                    </button>
                                </div>
                                <p className="text-xs text-green-700 mt-2">
                                    💡 After creating, you'll be taken to add courses & branches for this college
                                </p>
                            </form>
                        )}

                        {collegeOptions.length === 0 ? (
                            <div className="text-center p-12 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300">
                                <span className="text-6xl">🏫</span>
                                <p className="mt-4 text-xl font-semibold" style={{ color: '#3d2f1f' }}>No colleges configured yet</p>
                                <p className="text-amber-700 mt-2">Click "Add College" above to create your first college</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {collegeOptions.map(college => {
                                    const isComplete = college.courses.length > 0 && college.branches.length > 0
                                    return (
                                        <div
                                            key={college._id}
                                            className={`p-5 rounded-2xl border-2 shadow-md hover:shadow-lg transition-all ${isComplete
                                                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                                                : 'bg-yellow-50 border-yellow-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-lg font-bold truncate" style={{ color: '#3d2f1f' }}>
                                                        {college.college}
                                                    </h4>
                                                    <div className="flex gap-3 mt-1">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${college.courses.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                            📚 {college.courses.length} courses
                                                        </span>
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${college.branches.length > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                                            🎓 {college.branches.length} branches
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-3 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleEditCollegeOptions(college)}
                                                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm transition-all hover:scale-105"
                                                        title="Edit courses & branches"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCollegeOption(college._id, college.college)}
                                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm transition-all hover:scale-105"
                                                        title="Delete college"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>

                                            {!isComplete && (
                                                <div className="p-2 bg-yellow-100 border border-yellow-300 rounded-lg mb-3">
                                                    <p className="text-yellow-800 text-xs font-semibold">
                                                        ⚠️ {college.courses.length === 0 && college.branches.length === 0
                                                            ? 'No courses or branches — click Edit to add them'
                                                            : college.courses.length === 0
                                                                ? 'Missing courses — click Edit to add'
                                                                : 'Missing branches — click Edit to add'}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Courses preview */}
                                            {college.courses.length > 0 && (
                                                <div className="mb-2">
                                                    <p className="text-xs font-bold mb-1.5" style={{ color: '#5a4a3a' }}>📚 Courses:</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {college.courses.slice(0, 4).map(course => (
                                                            <span key={course} className="px-2 py-0.5 bg-white rounded-lg text-xs border border-amber-200 font-medium">
                                                                {course}
                                                            </span>
                                                        ))}
                                                        {college.courses.length > 4 && (
                                                            <span className="px-2 py-0.5 bg-amber-100 rounded-lg text-xs border border-amber-300 font-medium text-amber-700">
                                                                +{college.courses.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Branches preview */}
                                            {college.branches.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold mb-1.5" style={{ color: '#5a4a3a' }}>🎓 Branches:</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {college.branches.slice(0, 4).map(branch => (
                                                            <span key={branch} className="px-2 py-0.5 bg-white rounded-lg text-xs border border-amber-200 font-medium">
                                                                {branch}
                                                            </span>
                                                        ))}
                                                        {college.branches.length > 4 && (
                                                            <span className="px-2 py-0.5 bg-amber-100 rounded-lg text-xs border border-amber-300 font-medium text-amber-700">
                                                                +{college.branches.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* College Edit Modal */}
            {showCollegeModal && editingCollege && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border-4 border-amber-100 max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-3xl flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold" style={{ color: '#3d2f1f' }}>
                                        🏫 Edit College Options
                                    </h2>
                                    <p className="text-amber-700 font-semibold mt-1 text-lg">{editingCollege.college}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCollegeModal(false)
                                        setEditingCollege(null)
                                        setNewCourse('')
                                        setNewBranch('')
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xl transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Courses Section */}
                            <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                        📚 Courses
                                        <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-sm">
                                            {editingCollege.courses.length}
                                        </span>
                                    </h3>
                                </div>
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        value={newCourse}
                                        onChange={(e) => setNewCourse(e.target.value)}
                                        placeholder="e.g. B.Tech, M.Tech, MBA..."
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:outline-none bg-white"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCourseToCollege())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addCourseToCollege}
                                        disabled={!newCourse.trim()}
                                        className="px-5 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        ➕ Add
                                    </button>
                                </div>
                                {editingCollege.courses.length === 0 ? (
                                    <p className="text-blue-600 italic text-sm p-3 bg-blue-100 rounded-xl">
                                        No courses added yet. Add courses above.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {editingCollege.courses.map(course => (
                                            <div key={course} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
                                                <span className="font-medium text-blue-900">{course}</span>
                                                <button
                                                    onClick={() => removeCourseFromCollege(course)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-lg leading-none transition-colors"
                                                    title="Remove course"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Branches Section */}
                            <div className="bg-purple-50 rounded-2xl p-5 border-2 border-purple-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                                        🎓 Branches
                                        <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-sm">
                                            {editingCollege.branches.length}
                                        </span>
                                    </h3>
                                </div>
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        value={newBranch}
                                        onChange={(e) => setNewBranch(e.target.value)}
                                        placeholder="e.g. Computer Science, Mechanical..."
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none bg-white"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBranchToCollege())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addBranchToCollege}
                                        disabled={!newBranch.trim()}
                                        className="px-5 py-3 rounded-xl font-semibold text-white bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        ➕ Add
                                    </button>
                                </div>
                                {editingCollege.branches.length === 0 ? (
                                    <p className="text-purple-600 italic text-sm p-3 bg-purple-100 rounded-xl">
                                        No branches added yet. Add branches above.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {editingCollege.branches.map(branch => (
                                            <div key={branch} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
                                                <span className="font-medium text-purple-900">{branch}</span>
                                                <button
                                                    onClick={() => removeBranchFromCollege(branch)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-lg leading-none transition-colors"
                                                    title="Remove branch"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Warning */}
                            {editingCollege.courses.length === 0 && editingCollege.branches.length === 0 && (
                                <div className="p-4 bg-yellow-100 border-2 border-yellow-300 rounded-xl">
                                    <p className="text-yellow-800 font-semibold">
                                        ⚠️ Warning: This college won't appear in registration without at least one course and one branch
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t-2 border-amber-100 bg-amber-50/50 rounded-b-3xl flex-shrink-0">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCollegeModal(false)
                                        setEditingCollege(null)
                                        setNewCourse('')
                                        setNewBranch('')
                                    }}
                                    className="flex-1 py-3 rounded-xl border-2 border-amber-200 font-semibold hover:bg-amber-100 transition-all"
                                    style={{ color: '#5a4a3a' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCollegeOptions}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:scale-100"
                                    style={{ background: 'linear-gradient(135deg, #d4851c 0%, #f59e0b 100%)' }}
                                >
                                    {submitting ? '⏳ Saving...' : '💾 Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
