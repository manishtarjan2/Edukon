# 🗺️ System Architecture & Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDUKON SYSTEM OVERVIEW                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PUBLIC PAGES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  🏠 Home (/)              📖 About (/about)        📧 Contact (/contact)   │
│                                                                              │
│  ┌─────────────┐          ┌─────────────┐                                  │
│  │  /register  │          │   /login    │                                  │
│  │  (Student)  │          │  (Student)  │                                  │
│  └──────┬──────┘          └──────┬──────┘                                  │
│         │                        │                                          │
│         │ Register               │ Login                                    │
│         │                        │                                          │
│         ▼                        ▼                                          │
│   POST /api/register      POST /api/login                                  │
│         │                        │                                          │
│         └────────────────────────┴─► Sets user_token cookie                │
│                                  │                                          │
│                                  └─► Redirects to /profile                  │
│                                                                              │
│  ┌──────────────┐                                                           │
│  │ /admin/login │                                                           │
│  │ (Admin/Fdnr) │                                                           │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         │ Login                                                              │
│         ▼                                                                    │
│   POST /api/admin/login                                                     │
│         │                                                                    │
│         ├─► Sets admin_token, userEmail, userRole                          │
│         │                                                                    │
│         ├─► If role = 'admin' → /admin/dashboard                           │
│         └─► If role = 'founder' → /founder                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           PROTECTED PAGES                                    │
│                     (Requires authentication)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STUDENT AREA (user_token required)                                         │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /profile                                                     │          │
│  │  • View student details                                       │          │
│  │  • See allotted college                                       │          │
│  │  • Download allotment letter (if allotted)                   │          │
│  │  • 🖨️ Download Allotment Letter button                       │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                              │
│  ADMIN AREA (admin_token required) [Protected by middleware.ts]            │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /admin/dashboard                                             │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │  HEADER                                                 │  │          │
│  │  │  • Search bar 🔍                                        │  │          │
│  │  │  • 🏠 Home button → /                                   │  │          │
│  │  │  • 🚪 Logout button → /api/admin/logout                │  │          │
│  │  └────────────────────────────────────────────────────────┘  │          │
│  │                                                               │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │  FILTERS & DOWNLOAD                                     │  │          │
│  │  │  • Filter: All Status / Allotted / Pending             │  │          │
│  │  │  • Filter: Payment Status                              │  │          │
│  │  │  • Filter: College                                      │  │          │
│  │  │  • 📥 Download Report - {X} Students (SINGLE BUTTON)   │  │          │
│  │  └────────────────────────────────────────────────────────┘  │          │
│  │                                                               │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │  STATISTICS                                             │  │          │
│  │  │  👥 Total | ✅ Allotted | ⏳ Pending | 🔍 Showing     │  │          │
│  │  └────────────────────────────────────────────────────────┘  │          │
│  │                                                               │          │
│  │  ┌────────────────────────────────────────────────────────┐  │          │
│  │  │  STUDENTS TABLE                                         │  │          │
│  │  │  Student | Contact | Course | Preferences | Allotted   │  │          │
│  │  │  [Allot Button] [🖨️ Print Button]                      │  │          │
│  │  └────────────────────────────────────────────────────────┘  │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                              │
│  FOUNDER AREA (admin_token + founder role)                                  │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  /founder                                                     │          │
│  │  • Manage form options (colleges, courses, branches)         │          │
│  │  • Add/remove options                                         │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          GLOBAL COMPONENTS                                   │
│                    (Available on all pages)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📍 NAVBAR (src/components/Navbar.tsx)                                      │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │  Logo | Home | About | Contact | Register | Dashboard        │          │
│  │                                                                │          │
│  │  When LOGGED OUT:                                             │          │
│  │  • "Login" button → /login                                    │          │
│  │                                                                │          │
│  │  When LOGGED IN (all roles):                                  │          │
│  │  • Profile Avatar (clickable) →                               │          │
│  │    ┌──────────────────────────────────────┐                  │          │
│  │    │ Dropdown Menu                        │                  │          │
│  │    │ • Choose Avatar (6 options)          │                  │          │
│  │    │ • My Profile (student only)          │                  │          │
│  │    │ • Admin Dashboard (admin only)       │                  │          │
│  │    │ • 👑 Founder Dashboard (founder only)│                  │          │
│  │    │ • ⚙️ Settings                        │                  │          │
│  │    │ • 🚪 Logout → calls /api/logout      │                  │          │
│  │    └──────────────────────────────────────┘                  │          │
│  │                                                                │          │
│  │  • Three-dot menu (⋮) →                                       │          │
│  │    ┌──────────────────────┐                                  │          │
│  │    │ Theme                │                                  │          │
│  │    │ • ☀️ Light           │                                  │          │
│  │    │ • 🌙 Dark            │                                  │          │
│  │    └──────────────────────┘                                  │          │
│  └──────────────────────────────────────────────────────────────┘          │
│                                                                              │
│  📍 FOOTER (src/components/Footer.tsx)                                      │
│  • Copyright, links, etc.                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         LOGOUT FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  METHOD 1: Navbar Logout (Available everywhere)                             │
│  ┌────────────────────────────────────────────────────────┐                │
│  │ 1. Click avatar in navbar                              │                │
│  │ 2. Click "🚪 Logout" from dropdown                     │                │
│  │ 3. JavaScript calls fetch('/api/logout')               │                │
│  │ 4. Clears cookies: user_token, admin_token, etc.      │                │
│  │ 5. Redirects to /login                                 │                │
│  └────────────────────────────────────────────────────────┘                │
│                                                                              │
│  METHOD 2: Dashboard Logout Button (Admin dashboard only)                  │
│  ┌────────────────────────────────────────────────────────┐                │
│  │ 1. Click red "🚪 Logout" button in dashboard header    │                │
│  │ 2. Navigates to /api/admin/logout                      │                │
│  │ 3. Clears cookies: admin_token, userEmail, userRole   │                │
│  │ 4. Redirects to /admin/login                           │                │
│  └────────────────────────────────────────────────────────┘                │
│                                                                              │
│  Both methods completely clear session and redirect properly!              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      PDF DOWNLOAD FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INDIVIDUAL STUDENT LETTER                                                  │
│  ┌────────────────────────────────────────────────────────┐                │
│  │ Location: /profile OR /admin/dashboard                 │                │
│  │ Button: "🖨️ Download Allotment Letter" / "🖨️ Print"   │                │
│  │                                                         │                │
│  │ 1. Opens new window                                    │                │
│  │ 2. Generates formatted HTML letter                     │                │
│  │ 3. Shows:                                               │                │
│  │    • Student details                                    │                │
│  │    • Allotted college                                   │                │
│  │    • Course & Branch                                    │                │
│  │    • College preferences                                │                │
│  │ 4. Auto-opens print dialog                             │                │
│  └────────────────────────────────────────────────────────┘                │
│                                                                              │
│  BULK STUDENT REPORT (NEW & IMPROVED!)                                     │
│  ┌────────────────────────────────────────────────────────┐                │
│  │ Location: /admin/dashboard filters section             │                │
│  │ Button: "📥 Download Report - {X} Students"             │                │
│  │                                                         │                │
│  │ 1. Applies current filters                             │                │
│  │ 2. Opens new window with premium PDF                   │                │
│  │ 3. Shows:                                               │                │
│  │    ┌──────────────────────────────────────┐            │                │
│  │    │ 📚 EDUKON                            │            │                │
│  │    │ Student Enrollment Report            │            │                │
│  │    │ Generated: [Date/Time]               │            │                │
│  │    │ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │            │                │
│  │    │ │ XX │ │ XX │ │ XX │ │ XX │         │            │                │
│  │    │ │Tot.│ │Alot│ │Pend│ │Paid│         │            │                │
│  │    │ └────┘ └────┘ └────┘ └────┘         │            │                │
│  │    └──────────────────────────────────────┘            │                │
│  │                                                         │                │
│  │    For each student:                                   │                │
│  │    ┌──────────────────────────────────────┐            │                │
│  │    │ [AB] Student Name           ✓ Allot │            │                │
│  │    │      ID: 12345678                    │            │                │
│  │    ├──────────────────────────────────────┤            │                │
│  │    │ Email | Phone | Course | Branch     │            │                │
│  │    │ 12th% | JEE%  | Payment | Date      │            │                │
│  │    ├──────────────────────────────────────┤            │                │
│  │    │ 🏛️ Allotted: College Name           │            │                │
│  │    ├──────────────────────────────────────┤            │                │
│  │    │ 📋 Preferences:                      │            │                │
│  │    │ 1. College A ✓                       │            │                │
│  │    │ 2. College B                         │            │                │
│  │    └──────────────────────────────────────┘            │                │
│  │                                                         │                │
│  │ 4. Modern gradient styling                             │                │
│  │ 5. Print-optimized CSS                                 │                │
│  │ 6. Auto-opens print dialog                             │                │
│  └────────────────────────────────────────────────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       SECURITY & MIDDLEWARE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  src/middleware.ts                                                          │
│  ┌────────────────────────────────────────────────────────┐                │
│  │ Protects:                                              │                │
│  │ • /admin/dashboard/*                                   │                │
│  │ • /admin/edit/*                                        │                │
│  │                                                         │                │
│  │ Process:                                                │                │
│  │ 1. Check for admin_token cookie                        │                │
│  │ 2. Verify JWT signature with secret                    │                │
│  │ 3. If valid → Allow access                             │                │
│  │ 4. If invalid/missing → Redirect to /admin/login       │                │
│  └────────────────────────────────────────────────────────┘                │
│                                                                              │
│  Cookie Security:                                                           │
│  • httpOnly: true (prevents XSS)                                           │
│  • sameSite: 'lax' (prevents CSRF)                                         │
│  • maxAge: 86400 (24 hour expiry)                                          │
│  • path: '/' (site-wide)                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           KEY IMPROVEMENTS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ BEFORE: Two download buttons (header + filters)                         │
│  ✅ AFTER:  Single enhanced button in filters section                       │
│                                                                              │
│  ✅ BEFORE: Basic PDF formatting                                            │
│  ✅ AFTER:  Premium gradient header, cards, avatars, colors                 │
│                                                                              │
│  ✅ BEFORE: Incomplete cookie clearing on logout                            │
│  ✅ AFTER:  All cookies cleared (admin_token, userRole, userEmail, etc.)    │
│                                                                              │
│  ✅ BEFORE: No logout button in dashboard                                   │
│  ✅ AFTER:  Prominent red logout button in header + navbar dropdown         │
│                                                                              │
│  ✅ BEFORE: Manual navigation needed                                        │
│  ✅ AFTER:  Quick action buttons (Home, Logout) in dashboard                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE SYSTEM STATUS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ Authentication: Fully functional                                        │
│  ✅ Login/Logout: Complete with proper cookie management                    │
│  ✅ Navigation: All pages inter-linked                                      │
│  ✅ PDF Downloads: Enhanced & working                                       │
│  ✅ Admin Dashboard: Single download button, logout button                  │
│  ✅ Security: Middleware protection active                                  │
│  ✅ Mobile: Responsive design                                               │
│  ✅ Theming: Light/Dark mode working                                        │
│                                                                              │
│  📖 See AUTHENTICATION_GUIDE.md for detailed documentation                  │
│  📖 See FIXES_SUMMARY.md for complete list of changes                       │
│  📖 See TEST_CHECKLIST.md for testing instructions                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
