'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CollegePrefDetail {
  college: string
  course: string
  branch: string
}

interface Student {
  _id: string
  user_id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  course: string
  branch: string
  percentage12th: string
  jeePercentile: string
  collegePreferences: string[]
  collegePreferenceDetails?: CollegePrefDetail[]
  allottedCollege: string
  paymentStatus: string
  createdAt: string
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  }

  return (
    <div className="rounded-xl p-5 shadow" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--nav-text)' }}>{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>{value}</p>
        </div>
        <div className={`text-3xl p-3 rounded-full ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showAllotModal, setShowAllotModal] = useState(false)
  const [allotting, setAllotting] = useState(false)
  const [search, setSearch] = useState('')
  const [filterAllotment, setFilterAllotment] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [filterCollege, setFilterCollege] = useState('all')
  const [editCourse, setEditCourse] = useState('')
  const [editBranch, setEditBranch] = useState('')
  const [selectedPrefIndex, setSelectedPrefIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/user')
      const data = await res.json()
      if (res.ok) {
        setStudents(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAllotModal = (student: Student) => {
    setSelectedStudent(student)
    // Pre-select the currently allotted preference if exists
    const currentIdx = student.collegePreferenceDetails?.findIndex(
      p => p.college === student.allottedCollege
    ) ?? -1
    if (currentIdx >= 0) {
      setSelectedPrefIndex(currentIdx)
      setEditCourse(student.collegePreferenceDetails![currentIdx].course || '')
      setEditBranch(student.collegePreferenceDetails![currentIdx].branch || '')
    } else {
      setSelectedPrefIndex(null)
      setEditCourse(student.course || '')
      setEditBranch(student.branch || '')
    }
    setShowAllotModal(true)
  }

  const allotCollege = async (college: string, overrideCourse?: string, overrideBranch?: string) => {
    if (!selectedStudent) return
    setAllotting(true)

    const finalCourse = overrideCourse ?? editCourse
    const finalBranch = overrideBranch ?? editBranch

    try {
      const res = await fetch('/api/admin/allot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedStudent._id,
          allottedCollege: college,
          course: finalCourse,
          branch: finalBranch
        })
      })

      if (res.ok) {
        const updatedStudent = { ...selectedStudent, allottedCollege: college, course: finalCourse, branch: finalBranch }
        // Update both the list and the selected student
        setStudents(prev => prev.map(s =>
          s._id === selectedStudent._id ? updatedStudent : s
        ))
        setSelectedStudent(updatedStudent)
        setShowAllotModal(false)
        setSelectedPrefIndex(null)
        // Brief success notification
        const msg = document.createElement('div')
        msg.textContent = `✅ Allotted: ${college} · ${finalCourse} · ${finalBranch}`
        msg.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:#16a34a;color:white;padding:14px 20px;border-radius:12px;font-weight:bold;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.2);'
        document.body.appendChild(msg)
        setTimeout(() => msg.remove(), 3500)
      } else {
        const data = await res.json()
        alert(`❌ Failed to allot: ${data.message || 'Unknown error'}`)
      }
    } catch (err) {
      alert('❌ Network error while allotting college')
    } finally {
      setAllotting(false)
    }
  }

  const printAllotmentLetter = (student: Student) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Allotment Letter - ${student.firstName} ${student.lastName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #1e40af; }
          .title { font-size: 20px; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px; }
          .content { line-height: 1.8; text-align: justify; }
          .highlight { background: #fef3c7; padding: 2px 8px; font-weight: bold; }
          .college-box { border: 2px solid #1e40af; padding: 20px; margin: 20px 0; text-align: center; background: #eff6ff; }
          .college-name { font-size: 24px; font-weight: bold; color: #1e40af; }
          .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .details-table td { padding: 10px; border: 1px solid #ddd; }
          .details-table td:first-child { background: #f3f4f6; font-weight: bold; width: 200px; }
          .footer { margin-top: 50px; text-align: right; }
          .signature { margin-top: 60px; }
          .stamp { border: 2px solid #000; padding: 10px; display: inline-block; margin-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">📚 EDUKON</div>
          <div class="title">College Allotment Letter</div>
          <div style="font-size: 12px; margin-top: 10px;">Reference No: EDU/${new Date().getFullYear()}/${student._id.slice(-6).toUpperCase()}</div>
        </div>

        <div class="content">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          
          <p>Dear <span class="highlight">${student.firstName} ${student.lastName}</span>,</p>
          
          <p>We are pleased to inform you that based on your academic credentials and preferences, you have been allotted admission to the following institution:</p>

          <div class="college-box">
            <div style="font-size: 14px; color: #666;">Allotted College</div>
            <div class="college-name">${student.allottedCollege || 'Not Allotted Yet'}</div>
            <div style="margin-top: 10px;">Course: ${student.course} | Branch: ${student.branch}</div>
          </div>

          <h3>Student Details:</h3>
          <table class="details-table">
            <tr><td>Student ID</td><td>${student.user_id || student._id.slice(-8)}</td></tr>
            <tr><td>Full Name</td><td>${student.firstName} ${student.lastName}</td></tr>
            <tr><td>Email</td><td>${student.email}</td></tr>
            <tr><td>Phone</td><td>${student.phone || 'N/A'}</td></tr>
            <tr><td>12th Percentage</td><td>${student.percentage12th || 'N/A'}%</td></tr>
            <tr><td>JEE Percentile</td><td>${student.jeePercentile || 'N/A'}%</td></tr>
            <tr><td>Course</td><td>${student.course}</td></tr>
            <tr><td>Branch</td><td>${student.branch}</td></tr>
            <tr><td>Payment Status</td><td>${student.paymentStatus === 'paid' ? '✅ Paid' : student.paymentStatus}</td></tr>
          </table>

          <h3>Your College Preferences:</h3>
          ${student.collegePreferenceDetails && student.collegePreferenceDetails.length > 0 ? `
            <table style="width:100%;border-collapse:collapse;margin:10px 0 20px;">
              <thead>
                <tr style="background:#1e40af;color:white;">
                  <th style="padding:8px 12px;text-align:left;font-size:13px;">#</th>
                  <th style="padding:8px 12px;text-align:left;font-size:13px;">College</th>
                  <th style="padding:8px 12px;text-align:left;font-size:13px;">Course</th>
                  <th style="padding:8px 12px;text-align:left;font-size:13px;">Branch</th>
                  <th style="padding:8px 12px;text-align:left;font-size:13px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${student.collegePreferenceDetails.map((p, i) => `
                  <tr style="${p.college === student.allottedCollege ? 'background:#dcfce7;font-weight:bold;' : i % 2 === 0 ? 'background:#f9fafb;' : ''}">
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${i + 1}</td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${p.college}</td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${p.course || '-'}</td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${p.branch || '-'}</td>
                    <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${p.college === student.allottedCollege ? '✅ Allotted' : ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <ol>
              ${(student.collegePreferences || []).map(c => `<li>${c} ${c === student.allottedCollege ? '✅ (Allotted)' : ''}</li>`).join('')}
            </ol>
          `}

          <p>Please report to the allotted institution within 15 days from the date of this letter with all original documents.</p>

          <p>Congratulations and best wishes for your academic journey!</p>
        </div>

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

  // This function will be called after filteredStudents is defined
  const printFilteredStudents = (studentsToPrint: Student[]) => {
    if (studentsToPrint.length === 0) {
      alert('No students match the current filters!')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const hasFilters = filterAllotment !== 'all' || filterPayment !== 'all' || filterCollege !== 'all' || search !== ''
    const filterInfo = hasFilters ? `Filtered Results` : 'Complete Report'

    const allottedCount = studentsToPrint.filter(s => s.allottedCollege).length
    const pendingCount = studentsToPrint.filter(s => !s.allottedCollege).length
    const paidCount = studentsToPrint.filter(s => s.paymentStatus === 'paid').length

    const studentsHTML = studentsToPrint.map((student, index) => `
      <div class="student-card">
        <div class="student-header">
          <div class="student-info-left">
            <div class="student-avatar">${student.firstName.charAt(0)}${student.lastName.charAt(0)}</div>
            <div>
              <div class="student-name">${index + 1}. ${student.firstName} ${student.lastName}</div>
              <div class="student-id">ID: ${student.user_id || student._id.slice(-8)}</div>
            </div>
          </div>
          <div class="status-badge ${student.allottedCollege ? 'status-allotted' : 'status-pending'}">
            ${student.allottedCollege ? '✓ Allotted' : '⏳ Pending'}
          </div>
        </div>
        
        <table class="details-grid">
          <tr>
            <td class="label">📧 Email</td>
            <td class="value">${student.email}</td>
            <td class="label">📞 Phone</td>
            <td class="value">${student.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td class="label">🎓 Course</td>
            <td class="value">${student.course || 'N/A'}</td>
            <td class="label">⚡ Branch</td>
            <td class="value">${student.branch || 'N/A'}</td>
          </tr>
          <tr>
            <td class="label">📊 12th %</td>
            <td class="value">${student.percentage12th || 'N/A'}%</td>
            <td class="label">🚀 JEE %</td>
            <td class="value">${student.jeePercentile || 'N/A'}%</td>
          </tr>
          <tr>
            <td class="label">💳 Payment</td>
            <td class="value payment-${student.paymentStatus}">${student.paymentStatus || 'pending'}</td>
            <td class="label">📅 Registered</td>
            <td class="value">${new Date(student.createdAt).toLocaleDateString('en-IN')}</td>
          </tr>
        </table>

        ${student.allottedCollege ? `
          <div class="allotted-box">
            <div class="allotted-label">🏛️ Allotted Institution</div>
            <div class="allotted-college">${student.allottedCollege}</div>
            <div style="margin-top:6px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
              ${student.course ? `<span style="font-size:12px;padding:2px 10px;background:#dbeafe;color:#1e40af;border-radius:20px;font-weight:600;">${student.course}</span>` : ''}
              ${student.branch ? `<span style="font-size:12px;padding:2px 10px;background:#ede9fe;color:#6d28d9;border-radius:20px;font-weight:600;">${student.branch}</span>` : ''}
            </div>
          </div>
        ` : `
          <div class="pending-box">
            <div class="pending-text">⏳ Allotment in progress</div>
          </div>
        `}

        ${student.collegePreferenceDetails && student.collegePreferenceDetails.length > 0 ? `
          <div class="preferences-section">
            <div class="preferences-label">📋 Student Preferences</div>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;">
              <thead>
                <tr style="background:#1e40af;color:white;">
                  <th style="padding:5px 8px;text-align:left;font-size:11px;">#</th>
                  <th style="padding:5px 8px;text-align:left;font-size:11px;">College</th>
                  <th style="padding:5px 8px;text-align:left;font-size:11px;">Course</th>
                  <th style="padding:5px 8px;text-align:left;font-size:11px;">Branch</th>
                  <th style="padding:5px 8px;text-align:left;font-size:11px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${student.collegePreferenceDetails.map((p, i) => `
                  <tr style="${p.college === student.allottedCollege ? 'background:#dcfce7;font-weight:bold;' : i % 2 === 0 ? 'background:#f9fafb;' : ''}">
                    <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${i + 1}</td>
                    <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${p.college}</td>
                    <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${p.course || '-'}</td>
                    <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${p.branch || '-'}</td>
                    <td style="padding:5px 8px;border-bottom:1px solid #e5e7eb;font-size:11px;">${p.college === student.allottedCollege ? '✅' : ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : student.collegePreferences && student.collegePreferences.length > 0 ? `
          <div class="preferences-section">
            <div class="preferences-label">📋 Student Preferences</div>
            <ol class="preferences-list">
              ${student.collegePreferences.map((c, i) => `
                <li class="${c === student.allottedCollege ? 'preference-selected' : ''}">${c} ${c === student.allottedCollege ? '✓' : ''}</li>
              `).join('')}
            </ol>
          </div>
        ` : ''}
      </div>
    `).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Report - Edukon</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 30px; 
            background: #f8fafc;
            color: #1e293b;
          }
          
          .report-header { 
            background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            margin-bottom: 25px;
            box-shadow: 0 10px 25px rgba(30, 64, 175, 0.2);
          }
          
          .logo { 
            font-size: 32px; 
            font-weight: 900; 
            text-align: center;
            margin-bottom: 10px;
            letter-spacing: -1px;
          }
          
          .report-title {
            text-align: center;
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 15px;
            opacity: 0.95;
          }
          
          .report-meta {
            text-align: center;
            font-size: 13px;
            opacity: 0.8;
            margin-bottom: 20px;
          }
          
          .stats-container { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          
          .stat-card { 
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 15px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .stat-num { 
            font-size: 32px; 
            font-weight: 900;
            margin-bottom: 5px;
          }
          
          .stat-label {
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .student-card { 
            background: white;
            margin-bottom: 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            page-break-inside: avoid;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          
          .student-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .student-info-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .student-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1px;
          }
          
          .student-name {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 3px;
          }
          
          .student-id {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
          }
          
          .status-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
          }
          
          .status-allotted {
            background: #dcfce7;
            color: #166534;
          }
          
          .status-pending {
            background: #fef3c7;
            color: #92400e;
          }
          
          .details-grid {
            width: 100%;
            border-collapse: collapse;
          }
          
          .details-grid td {
            padding: 12px 20px;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .details-grid tr:last-child td {
            border-bottom: none;
          }
          
          .label {
            font-weight: 700;
            color: #64748b;
            font-size: 12px;
            width: 20%;
          }
          
          .value {
            color: #1e293b;
            font-size: 14px;
            font-weight: 600;
            width: 30%;
          }
          
          .payment-paid { color: #16a34a; }
          .payment-pending { color: #dc2626; }
          .payment-skipped { color: #64748b; }
          
          .allotted-box {
            margin: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            border: 2px solid #3b82f6;
            border-radius: 12px;
            text-align: center;
          }
          
          .allotted-label {
            font-size: 11px;
            color: #1e40af;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          
          .allotted-college {
            font-size: 20px;
            font-weight: 900;
            color: #1e40af;
          }
          
          .pending-box {
            margin: 20px;
            padding: 15px;
            background: #fef3c7;
            border: 2px dashed #fbbf24;
            border-radius: 12px;
            text-align: center;
          }
          
          .pending-text {
            color: #92400e;
            font-weight: 700;
          }
          
          .preferences-section {
            padding: 20px;
            background: #f8fafc;
            border-top: 2px solid #e2e8f0;
          }
          
          .preferences-label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          
          .preferences-list {
            list-style: none;
            counter-reset: pref-counter;
          }
          
          .preferences-list li {
            counter-increment: pref-counter;
            padding: 8px 12px;
            margin-bottom: 6px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }
          
          .preferences-list li:before {
            content: counter(pref-counter) ". ";
            font-weight: 900;
            color: #3b82f6;
            margin-right: 8px;
          }
          
          .preference-selected {
            background: #dcfce7 !important;
            border-color: #16a34a !important;
            color: #166534 !important;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 12px;
          }
          
          @media print { 
            body { 
              padding: 15px;
              background: white;
            }
            .student-card {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="logo">📚 EDUKON</div>
          <div class="report-title">Student Enrollment Report - ${filterInfo}</div>
          <div class="report-meta">
            Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-num">${studentsToPrint.length}</div>
              <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">${allottedCount}</div>
              <div class="stat-label">Allotted</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">${pendingCount}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">${paidCount}</div>
              <div class="stat-label">Paid</div>
            </div>
          </div>
        </div>
        ${studentsHTML}
        <div class="footer">
          <strong>© ${new Date().getFullYear()} Edukon Education Platform</strong><br>
          This document is confidential and intended for administrative use only.
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Get unique colleges for filter dropdown
  const allColleges = [...new Set(students.filter(s => s.allottedCollege).map(s => s.allottedCollege))]

  const filteredStudents = students.filter(s => {
    // Search filter
    const matchesSearch =
      s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.user_id?.toLowerCase().includes(search.toLowerCase())

    // Allotment filter
    const matchesAllotment =
      filterAllotment === 'all' ||
      (filterAllotment === 'allotted' && s.allottedCollege) ||
      (filterAllotment === 'pending' && !s.allottedCollege)

    // Payment filter
    const matchesPayment =
      filterPayment === 'all' ||
      s.paymentStatus === filterPayment

    // College filter
    const matchesCollege =
      filterCollege === 'all' ||
      s.allottedCollege === filterCollege

    return matchesSearch && matchesAllotment && matchesPayment && matchesCollege
  })

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Premium Header Section */}
        <div className="mb-10 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2"></div>


          <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-blue-50 shadow-md bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-4xl text-white">
                👨‍💼
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img src="/logo.png" alt="Edukon" className="w-6 h-6 object-contain" />
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Edukon Admin Portal</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 font-medium">Student Allotment & Enrollment Management</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch">
              <div className="relative group flex-1 md:w-64">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, ID or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                />
              </div>

              <div className="flex gap-2">
                <a
                  href="/"
                  className="px-4 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                  title="Go to Home"
                >
                  <span>🏠</span>
                  <span className="hidden sm:inline">Home</span>
                </a>
                <a
                  href="/api/admin/logout"
                  className="px-4 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                  title="Logout"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex gap-3 flex-wrap items-center">
            <select
              value={filterAllotment}
              onChange={(e) => setFilterAllotment(e.target.value)}
              className="px-4 py-3 border rounded-xl font-medium"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              <option value="all">All Status</option>
              <option value="allotted">Allotted</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-3 border rounded-xl font-medium"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              <option value="all">All Payment</option>
              <option value="paid">Paid</option>
              <option value="skipped">Skipped</option>
              <option value="pending">Pending</option>
            </select>
            {allColleges.length > 0 && (
              <select
                value={filterCollege}
                onChange={(e) => setFilterCollege(e.target.value)}
                className="px-4 py-3 border rounded-xl font-medium"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <option value="all">All Colleges</option>
                {allColleges.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <div className="flex-1"></div>
            <button
              onClick={() => printFilteredStudents(filteredStudents)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-3"
            >
              <span className="text-lg">📥</span>
              <div className="flex flex-col items-start">
                <span className="text-xs opacity-90">Download Report</span>
                <span className="text-sm font-black">{filteredStudents.length} Students</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Students" value={students.length} icon="👥" color="blue" />
          <StatCard title="Allotted" value={students.filter(s => s.allottedCollege).length} icon="✅" color="green" />
          <StatCard title="Pending" value={students.filter(s => !s.allottedCollege).length} icon="⏳" color="yellow" />
          <StatCard title="Showing" value={filteredStudents.length} icon="🔍" color="purple" />
        </div>

        {/* Students Table */}
        <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--secondary)' }}>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Student</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Course</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Preferences</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Allotted</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Payment</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8" style={{ color: 'var(--nav-text)' }}>Loading...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8" style={{ color: 'var(--nav-text)' }}>No students found</td></tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="border-t hover:bg-gray-50" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3">
                        <div className="font-medium" style={{ color: 'var(--foreground)' }}>{student.firstName} {student.lastName}</div>
                        <div className="text-sm" style={{ color: 'var(--nav-text)' }}>{student.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {student.phone ? (
                          <div className="flex items-center gap-2">
                            <span style={{ color: 'var(--foreground)' }}>📞</span>
                            <span className="font-medium" style={{ color: 'var(--foreground)' }}>{student.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--nav-text)' }}>No phone</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div style={{ color: 'var(--foreground)' }}>{student.course}</div>
                        <div className="text-sm" style={{ color: 'var(--nav-text)' }}>{student.branch}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(student.collegePreferences || []).slice(0, 3).map((c, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {i + 1}. {c.split(' ')[0]}
                            </span>
                          ))}
                          {(student.collegePreferences || []).length > 3 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              +{student.collegePreferences.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {student.allottedCollege ? (
                          <div>
                            <div className="text-xs font-bold text-green-700 flex items-center gap-1">
                              <span>✅</span>
                              <span className="truncate max-w-[140px]">{student.allottedCollege}</span>
                            </div>
                            {(student.course || student.branch) && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {student.course && (
                                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">{student.course}</span>
                                )}
                                {student.branch && (
                                  <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">{student.branch}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${student.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          student.paymentStatus === 'skipped' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {student.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openAllotModal(student)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            {student.allottedCollege ? 'Change' : 'Allot'}
                          </button>
                          <a
                            href={`/admin/edit/${student._id}`}
                            className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 inline-flex items-center"
                          >
                            ✏️ Edit
                          </a>
                          {student.allottedCollege && (
                            <button
                              onClick={() => printAllotmentLetter(student)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              🖨️ Print
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allotment Modal */}
        {showAllotModal && selectedStudent && (() => {
          // Priority colors matching the registration form
          const priorityColors = [
            { border: 'border-blue-400', bg: 'bg-blue-50', badgeBg: 'bg-blue-600', text: 'text-blue-900', label: '1st Choice', ring: 'ring-blue-300' },
            { border: 'border-purple-400', bg: 'bg-purple-50', badgeBg: 'bg-purple-600', text: 'text-purple-900', label: '2nd Choice', ring: 'ring-purple-300' },
            { border: 'border-green-400', bg: 'bg-green-50', badgeBg: 'bg-green-600', text: 'text-green-900', label: '3rd Choice', ring: 'ring-green-300' },
          ]

          const hasDetails = selectedStudent.collegePreferenceDetails && selectedStudent.collegePreferenceDetails.length > 0
          const selectedPref = hasDetails && selectedPrefIndex !== null
            ? selectedStudent.collegePreferenceDetails![selectedPrefIndex]
            : null

          return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col">

                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight">🏛️ Allot Institution</h2>
                      <p className="text-gray-500 text-sm mt-0.5">
                        <span className="font-bold text-gray-700">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                        <span className="mx-2 opacity-40">·</span>
                        <span className="text-blue-600">{selectedStudent.user_id || selectedStudent._id.slice(-8)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => { setShowAllotModal(false); setSelectedPrefIndex(null) }}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 text-gray-500 font-bold transition-all shadow-sm"
                    >✕</button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                  {/* Live Preview — Course & Branch for selected preference */}
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${selectedPref
                    ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${selectedPref ? 'text-indigo-600' : 'text-gray-400'
                      }`}>📋 Will be Allotted As</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Course</p>
                        <div className={`px-3 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${editCourse
                          ? 'bg-white border-indigo-200 text-indigo-900'
                          : 'bg-white border-dashed border-gray-200 text-gray-400'
                          }`}>
                          {editCourse || 'Select a preference →'}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Branch</p>
                        <div className={`px-3 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${editBranch
                          ? 'bg-white border-indigo-200 text-indigo-900'
                          : 'bg-white border-dashed border-gray-200 text-gray-400'
                          }`}>
                          {editBranch || 'Select a preference →'}
                        </div>
                      </div>
                    </div>
                    {selectedPref && (
                      <p className="text-xs text-indigo-600 mt-2 font-semibold">
                        ✅ {selectedPref.college} · {selectedPref.course} · {selectedPref.branch}
                      </p>
                    )}
                  </div>

                  {/* Preference Cards */}
                  <div>
                    <p className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">Student's Preferences — Click to Select</p>

                    {hasDetails ? (
                      <div className="space-y-3">
                        {selectedStudent.collegePreferenceDetails!.map((pref, index) => {
                          const colors = priorityColors[index] || priorityColors[2]
                          const isSelected = selectedPrefIndex === index
                          const isCurrentlyAllotted = selectedStudent.allottedCollege === pref.college

                          return (
                            <button
                              key={pref.college}
                              type="button"
                              onClick={() => {
                                setSelectedPrefIndex(index)
                                setEditCourse(pref.course || '')
                                setEditBranch(pref.branch || '')
                              }}
                              disabled={allotting}
                              className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 ${isSelected
                                ? `${colors.border} ${colors.bg} shadow-md ring-2 ${colors.ring}`
                                : isCurrentlyAllotted
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                {/* Priority badge */}
                                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white ${isSelected ? colors.badgeBg : isCurrentlyAllotted ? 'bg-green-600' : 'bg-gray-300'
                                  }`}>
                                  <span className="text-xs font-black leading-none">{index + 1}</span>
                                  <span className="text-[9px] leading-none opacity-80 mt-0.5">{['ST', 'ND', 'RD'][index] || 'TH'}</span>
                                </div>

                                {/* College + course/branch */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className={`font-bold truncate text-sm ${isSelected ? colors.text : 'text-gray-800'
                                      }`}>{pref.college}</p>
                                    {isCurrentlyAllotted && !isSelected && (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold flex-shrink-0">Current</span>
                                    )}
                                  </div>
                                  <div className="flex gap-2 mt-1.5 flex-wrap">
                                    {pref.course && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        📚 {pref.course}
                                      </span>
                                    )}
                                    {pref.branch && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        🎓 {pref.branch}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Select indicator */}
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                                  ? `${colors.badgeBg} border-transparent`
                                  : 'border-gray-300 bg-white'
                                  }`}>
                                  {isSelected && <span className="text-white text-xs font-black">✓</span>}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    ) : selectedStudent.collegePreferences && selectedStudent.collegePreferences.length > 0 ? (
                      // Fallback: old string-only format
                      <div className="space-y-3">
                        {selectedStudent.collegePreferences.map((college, index) => {
                          const colors = priorityColors[index] || priorityColors[2]
                          const isSelected = selectedPrefIndex === index
                          const isCurrentlyAllotted = selectedStudent.allottedCollege === college
                          return (
                            <button
                              key={college}
                              type="button"
                              onClick={() => {
                                setSelectedPrefIndex(index)
                                setEditCourse('')
                                setEditBranch('')
                              }}
                              disabled={allotting}
                              className={`w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center gap-3 ${isSelected
                                ? `${colors.border} ${colors.bg} shadow-md ring-2 ${colors.ring}`
                                : isCurrentlyAllotted
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-gray-100 bg-white hover:border-gray-300'
                                }`}
                            >
                              <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white flex-shrink-0 ${isSelected ? colors.badgeBg : isCurrentlyAllotted ? 'bg-green-600' : 'bg-gray-300'
                                }`}>{index + 1}</span>
                              <span className={`flex-1 font-bold text-sm ${isSelected ? colors.text : 'text-gray-800'
                                }`}>{college}</span>
                              {isCurrentlyAllotted && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Current</span>
                              )}
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? `${colors.badgeBg} border-transparent` : 'border-gray-300'
                                }`}>
                                {isSelected && <span className="text-white text-xs font-black">✓</span>}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      // No preferences — manual entry
                      <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                        <p className="text-amber-800 text-sm font-semibold">⚠️ No college preferences submitted</p>
                        <p className="text-amber-700 text-xs mt-1">Enter college name manually:</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="College name..."
                              className="flex-1 px-3 py-2 border-2 border-amber-300 rounded-lg text-sm outline-none focus:border-amber-500"
                              id="manual-college-input"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editCourse}
                              onChange={e => setEditCourse(e.target.value)}
                              placeholder="Course..."
                              className="px-3 py-2 border-2 border-amber-300 rounded-lg text-sm outline-none focus:border-amber-500"
                            />
                            <input
                              type="text"
                              value={editBranch}
                              onChange={e => setEditBranch(e.target.value)}
                              placeholder="Branch..."
                              className="px-3 py-2 border-2 border-amber-300 rounded-lg text-sm outline-none focus:border-amber-500"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const input = document.getElementById('manual-college-input') as HTMLInputElement
                              if (input?.value.trim()) allotCollege(input.value.trim(), editCourse, editBranch)
                            }}
                            disabled={allotting}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            Allot Manually
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer — Confirm Button */}
                <div className="p-5 border-t border-gray-100 flex-shrink-0 space-y-3">
                  {selectedPref && (
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-sm">
                      <span className="font-semibold text-indigo-800">Allotting: </span>
                      <span className="font-bold text-indigo-900">{selectedPref.college}</span>
                      <span className="text-indigo-600 mx-1">·</span>
                      <span className="text-indigo-700">{selectedPref.course}</span>
                      <span className="text-indigo-600 mx-1">·</span>
                      <span className="text-indigo-700">{selectedPref.branch}</span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowAllotModal(false); setSelectedPrefIndex(null) }}
                      className="flex-1 py-3 rounded-2xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    {hasDetails ? (
                      <button
                        onClick={() => {
                          if (selectedPrefIndex === null) {
                            alert('Please select a college preference first')
                            return
                          }
                          const pref = selectedStudent.collegePreferenceDetails![selectedPrefIndex]
                          allotCollege(pref.college, pref.course || '', pref.branch || '')
                        }}
                        disabled={allotting || selectedPrefIndex === null}
                        className="flex-1 py-3 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: selectedPrefIndex !== null ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : undefined, backgroundColor: selectedPrefIndex === null ? '#9ca3af' : undefined }}
                      >
                        {allotting ? '⏳ Allotting...' : selectedPrefIndex !== null ? '✅ Confirm Allotment' : 'Select a Preference'}
                      </button>
                    ) : selectedStudent.collegePreferences && selectedStudent.collegePreferences.length > 0 ? (
                      <button
                        onClick={() => {
                          if (selectedPrefIndex === null) {
                            alert('Please select a college preference first')
                            return
                          }
                          allotCollege(selectedStudent.collegePreferences[selectedPrefIndex], editCourse, editBranch)
                        }}
                        disabled={allotting || selectedPrefIndex === null}
                        className="flex-1 py-3 rounded-2xl font-bold text-white transition-all disabled:opacity-50"
                        style={{ background: selectedPrefIndex !== null ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : undefined, backgroundColor: selectedPrefIndex === null ? '#9ca3af' : undefined }}
                      >
                        {allotting ? '⏳ Allotting...' : selectedPrefIndex !== null ? '✅ Confirm Allotment' : 'Select a Preference'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

