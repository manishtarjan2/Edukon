'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

const MAX_COLLEGES = 3

interface CollegePreference {
  college: string
  course: string
  branch: string
}

interface CollegeOption {
  _id: string
  college: string
  courses: string[]
  branches: string[]
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  // Each preference has its own college + course + branch
  const [preferences, setPreferences] = useState<CollegePreference[]>([
    { college: '', course: '', branch: '' }
  ])

  const [formData, setFormData] = useState({
    user_id: '',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    phone: '',
    percentage12th: '',
    jeePercentile: '',
    provincialState: '',
    paymentStatus: 'pending',
  })

  // All college options from DB
  const [collegeOptions, setCollegeOptions] = useState<CollegeOption[]>([])

  useEffect(() => {
    const fetchCollegeOptions = async () => {
      try {
        const res = await fetch('/api/founder/college-options')
        const data = await res.json()
        if (res.ok) {
          setCollegeOptions(data.colleges || [])
        }
      } catch (err) {
        console.error('Failed to fetch college options:', err)
      }
    }
    fetchCollegeOptions()
  }, [])

  // Get courses available for a specific college
  const getCoursesForCollege = (collegeName: string): string[] => {
    const col = collegeOptions.find(c => c.college === collegeName)
    return col ? col.courses : []
  }

  // Get branches available for a specific college + course combo
  const getBranchesForCollegeCourse = (collegeName: string, courseName: string): string[] => {
    const col = collegeOptions.find(c => c.college === collegeName)
    if (!col) return []
    // Return all branches of that college (branches are per-college, not per-course)
    return col.branches
  }

  // Get colleges not already selected in other preferences (except current index)
  const getAvailableColleges = (currentIndex: number): CollegeOption[] => {
    const selectedElsewhere = preferences
      .filter((_, i) => i !== currentIndex)
      .map(p => p.college)
      .filter(Boolean)
    return collegeOptions.filter(c => !selectedElsewhere.includes(c.college))
  }

  const updatePreference = (index: number, field: keyof CollegePreference, value: string) => {
    setPreferences(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      // Reset downstream fields when college or course changes
      if (field === 'college') {
        updated[index].course = ''
        updated[index].branch = ''
      } else if (field === 'course') {
        updated[index].branch = ''
      }
      return updated
    })
  }

  const addPreference = () => {
    if (preferences.length < MAX_COLLEGES) {
      setPreferences(prev => [...prev, { college: '', course: '', branch: '' }])
    }
  }

  const removePreference = (index: number) => {
    if (preferences.length > 1) {
      setPreferences(prev => prev.filter((_, i) => i !== index))
    }
  }

  const movePreference = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...preferences]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newOrder.length) {
      ;[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
      setPreferences(newOrder)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePayment = async (skipPayment = false) => {
    setLoading(true)
    setError('')
    const paymentStatus = skipPayment ? 'skipped' : 'paid'
    if (!skipPayment) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    await submitRegistration(paymentStatus)
  }

  const submitRegistration = async (paymentStatus: string) => {
    try {
      // Build collegePreferences as array of college names (for backward compat)
      const collegePreferences = preferences.filter(p => p.college).map(p => p.college)

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          collegePreferences,
          // Store full preference details
          collegePreferenceDetails: preferences.filter(p => p.college),
          // Use first preference's course/branch as primary
          course: preferences[0]?.course || '',
          branch: preferences[0]?.branch || '',
          paymentStatus
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('✅ Registration successful! Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.email || !formData.password || !formData.phone) {
        setError('Please fill all required fields')
        return
      }
    }
    if (step === 2) {
      if (!formData.percentage12th) {
        setError('Please enter your 12th percentage')
        return
      }
    }
    if (step === 3) {
      const validPrefs = preferences.filter(p => p.college && p.course && p.branch)
      if (validPrefs.length < 1) {
        setError('Please select at least 1 complete college preference (college + course + branch)')
        return
      }
      const incomplete = preferences.filter(p => p.college && (!p.course || !p.branch))
      if (incomplete.length > 0) {
        setError('Please complete course and branch for all selected colleges')
        return
      }
    }
    setError('')
    setStep(step + 1)
  }

  const stepTitles = ['Personal', 'Education', 'Colleges', 'Payment']

  const priorityColors = [
    { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', badge: 'bg-blue-600' },
    { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', badge: 'bg-purple-600' },
    { bg: 'bg-green-600', light: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', badge: 'bg-green-600' },
  ]

  return (
    <div className="min-h-screen py-6 px-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--primary)' }}>
            📝 Student Registration
          </h1>
          <p className="mt-2" style={{ color: 'var(--nav-text)' }}>
            Join Edukon and start your learning journey
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block" style={{ color: 'var(--foreground)' }}>{title}</span>
              </div>
            ))}
          </div>
          <div className="flex">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex-1 h-1 mx-1 rounded ${step > i ? 'bg-green-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">⚠️ {error}</div>}
        {success && <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>}

        {/* Form Card */}
        <div className="rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="User ID" name="user_id" value={formData.user_id} onChange={handleChange} placeholder="Enter unique ID" />
                <InputField label="First Name *" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                <InputField label="Phone *" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" type="tel" required />

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Gender *</label>
                  <div className="flex flex-wrap gap-4">
                    {['Male', 'Female', 'Other'].map(g => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                        <span style={{ color: 'var(--foreground)' }}>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <InputField label="Email *" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" type="email" required />
                <InputField label="Password *" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" type="password" required />
              </div>

              <div className="mt-6 flex justify-between items-center">
                <a href="/login" className="text-blue-600 hover:underline">Already have an account?</a>
                <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition">Next →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Education Details */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Education Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <InputField label="12th Percentage *" name="percentage12th" value={formData.percentage12th} onChange={handleChange} placeholder="85.5" type="number" required />
                </div>
                <InputField label="JEE Percentile" name="jeePercentile" value={formData.jeePercentile} onChange={handleChange} placeholder="95.5" type="number" />
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Provincial State</label>
                  <select name="provincialState" value={formData.provincialState} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                    <option value="">-- Select State --</option>
                    <option>Delhi</option><option>Maharashtra</option><option>Karnataka</option><option>Tamil Nadu</option><option>Uttar Pradesh</option><option>Rajasthan</option><option>Gujarat</option><option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>← Back</button>
                <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">Next →</button>
              </div>
            </div>
          )}

          {/* STEP 3: College Preferences */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                College Preferences
              </h2>
              <p className="mb-6 text-sm" style={{ color: 'var(--nav-text)' }}>
                Add up to <strong>{MAX_COLLEGES} college preferences</strong>. Each college can have a different course and branch. Priority 1 is your top choice.
              </p>

              {collegeOptions.length === 0 && (
                <div className="p-4 mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <p className="text-amber-800 font-semibold">⚠️ No colleges configured yet. Please contact the founder/admin.</p>
                </div>
              )}

              {/* Preference Cards */}
              <div className="space-y-5 mb-6">
                {preferences.map((pref, index) => {
                  const colors = priorityColors[index] || priorityColors[2]
                  const availableColleges = getAvailableColleges(index)
                  const coursesForCollege = getCoursesForCollege(pref.college)
                  const branchesForCollege = getBranchesForCollegeCourse(pref.college, pref.course)
                  const isComplete = pref.college && pref.course && pref.branch

                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border-2 overflow-hidden transition-all ${colors.border} ${isComplete ? colors.light : 'bg-gray-50 border-gray-200'}`}
                    >
                      {/* Card Header */}
                      <div className={`flex items-center justify-between px-5 py-3 ${isComplete ? colors.bg : 'bg-gray-400'}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-white text-lg">
                            {index + 1}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {index === 0 ? '🥇 1st Choice (Top Priority)' : index === 1 ? '🥈 2nd Choice' : '🥉 3rd Choice'}
                          </span>
                          {isComplete && <span className="text-white/80 text-xs">✅ Complete</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => movePreference(index, 'up')}
                              className="text-white/80 hover:text-white font-bold text-lg px-1"
                              title="Move up"
                            >↑</button>
                          )}
                          {index < preferences.length - 1 && (
                            <button
                              type="button"
                              onClick={() => movePreference(index, 'down')}
                              className="text-white/80 hover:text-white font-bold text-lg px-1"
                              title="Move down"
                            >↓</button>
                          )}
                          {preferences.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePreference(index)}
                              className="text-white/80 hover:text-white font-bold text-xl px-1 ml-1"
                              title="Remove"
                            >✕</button>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* College */}
                        <div>
                          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
                            🏫 College *
                          </label>
                          <select
                            value={pref.college}
                            onChange={e => updatePreference(index, 'college', e.target.value)}
                            className="w-full px-3 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                          >
                            <option value="">-- Select College --</option>
                            {availableColleges.map(c => (
                              <option key={c._id} value={c.college}>{c.college}</option>
                            ))}
                          </select>
                          {availableColleges.length === 0 && !pref.college && (
                            <p className="text-xs text-amber-600 mt-1">All colleges already selected</p>
                          )}
                        </div>

                        {/* Course */}
                        <div>
                          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
                            📚 Course *
                          </label>
                          <select
                            value={pref.course}
                            onChange={e => updatePreference(index, 'course', e.target.value)}
                            disabled={!pref.college}
                            className="w-full px-3 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                          >
                            <option value="">
                              {!pref.college ? '-- Select College First --' : '-- Select Course --'}
                            </option>
                            {coursesForCollege.map(course => (
                              <option key={course} value={course}>{course}</option>
                            ))}
                          </select>
                          {pref.college && coursesForCollege.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">⚠️ No courses for this college</p>
                          )}
                        </div>

                        {/* Branch */}
                        <div>
                          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
                            🎓 Branch *
                          </label>
                          <select
                            value={pref.branch}
                            onChange={e => updatePreference(index, 'branch', e.target.value)}
                            disabled={!pref.college}
                            className="w-full px-3 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                          >
                            <option value="">
                              {!pref.college ? '-- Select College First --' : '-- Select Branch --'}
                            </option>
                            {branchesForCollege.map(branch => (
                              <option key={branch} value={branch}>{branch}</option>
                            ))}
                          </select>
                          {pref.college && branchesForCollege.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">⚠️ No branches for this college</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add More Button */}
              {preferences.length < MAX_COLLEGES && (
                <button
                  type="button"
                  onClick={addPreference}
                  className="w-full py-3 mb-6 border-2 border-dashed border-blue-400 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">➕</span>
                  Add {preferences.length === 1 ? '2nd' : '3rd'} College Preference
                  <span className="text-sm text-blue-400">({preferences.length}/{MAX_COLLEGES} added)</span>
                </button>
              )}

              {/* Summary */}
              {preferences.some(p => p.college) && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="font-bold text-blue-900 mb-2">📋 Your Preferences Summary:</p>
                  <div className="space-y-1">
                    {preferences.filter(p => p.college).map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-blue-800">
                        <span className="font-bold">#{i + 1}</span>
                        <span className="font-semibold">{p.college}</span>
                        {p.course && <span className="text-blue-600">• {p.course}</span>}
                        {p.branch && <span className="text-blue-600">• {p.branch}</span>}
                        {(!p.course || !p.branch) && <span className="text-amber-600 text-xs">⚠️ Incomplete</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>← Back</button>
                <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">Next →</button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Payment
              </h2>

              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--secondary)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center mb-4">
                  <span style={{ color: 'var(--foreground)' }}>Registration Fee</span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>₹299</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--nav-text)' }}>One-time payment for lifetime access</p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>Select Payment Method:</p>
                {['UPI', 'Card', 'Net Banking'].map(method => (
                  <label key={method} className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : ''}`} style={{ borderColor: paymentMethod === method ? '#3b82f6' : 'var(--border)' }}>
                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                    <span className="text-xl">{method === 'UPI' ? '📱' : method === 'Card' ? '💳' : '🏦'}</span>
                    <span style={{ color: 'var(--foreground)' }}>{method}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <button onClick={() => handlePayment(false)} disabled={!paymentMethod || loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition">
                  {loading ? 'Processing...' : '🔒 Pay ₹299 & Register'}
                </button>
                <div className="text-center"><span className="text-sm" style={{ color: 'var(--nav-text)' }}>or</span></div>
                <button onClick={() => handlePayment(true)} disabled={loading} className="w-full py-3 rounded-lg font-medium border-2 border-dashed" style={{ color: 'var(--nav-text)', borderColor: 'var(--border)' }}>
                  ⏭️ Skip Payment (For Testing)
                </button>
              </div>

              <button onClick={() => setStep(3)} className="mt-4 px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)' }}>← Back</button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--nav-text)' }}>🔒 Your data is protected with 256-bit SSL encryption</div>
      </div>
    </div>
  )
}

function InputField({ label, name, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; placeholder: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
    </div>
  )
}
