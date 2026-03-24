# 🔐 Authentication & Navigation Guide

## Overview
This document explains how the authentication system works and how users navigate through the application.

---

## 🎯 User Roles

### 1. **Student (User)**
- Role: `user`
- Login URL: `/login`
- Dashboard: `/profile`
- Cookie: `user_token`

### 2. **Admin**
- Role: `admin`
- Login URL: `/admin/login`
- Dashboard: `/admin/dashboard`
- Cookie: `admin_token`

### 3. **Founder**
- Role: `founder`
- Login URL: `/admin/login` (same as admin)
- Dashboard: `/founder`
- Cookie: `admin_token`

---

## 🔑 Login Process

### Student Login
1. Navigate to `/login`
2. Enter email and password
3. API calls `/api/login` (POST)
4. Sets `user_token` cookie
5. Redirects to `/profile`

### Admin/Founder Login
1. Navigate to `/admin/login`
2. Enter email and password
3. API calls `/api/admin/login` (POST)
4. Sets three cookies:
   - `admin_token` (httpOnly: true) - for authentication
   - `userEmail` (httpOnly: true) - for reference
   - `userRole` (httpOnly: false) - for client-side checks
5. Redirects to:
   - `/admin/dashboard` for admins
   - `/founder` for founders

---

## 🚪 Logout Process

### Method 1: Via Navbar (Available on all pages)
1. Click on profile avatar in navbar
2. Click "Logout" from dropdown
3. Executes client-side logout:
   ```javascript
   fetch('/api/logout')
   // Clears cookies: user_token, admin_token, userRole, userEmail
   ```
4. Redirects to `/login`

### Method 2: Via Admin Dashboard Button
1. Click the red "Logout" button in dashboard header
2. Navigates to `/api/admin/logout`
3. Clears cookies: `admin_token`, `userEmail`, `userRole`
4. Redirects to `/admin/login`

---

## 🛡️ Security Features

### Middleware Protection
File: `src/middleware.ts`

Protects these routes:
- `/admin/dashboard/*`
- `/admin/edit/*`

How it works:
1. Checks for `admin_token` cookie
2. Verifies JWT signature
3. If invalid/missing → redirects to `/admin/login`
4. If valid → allows access

### Cookie Settings
All auth cookies use:
- `httpOnly: true` - prevents JavaScript access (except userRole)
- `path: '/'` - available site-wide
- `sameSite: 'lax'` - CSRF protection
- `maxAge: 86400` - 24 hour expiry

---

## 📱 Navigation Structure

### Public Pages (No login required)
- `/` - Home
- `/about` - About
- `/contact` - Contact
- `/register` - Student Registration
- `/login` - Student Login
- `/admin/login` - Admin/Founder Login

### Protected Pages

#### Student Pages
- `/profile` - Student Profile & Allotment Letter

#### Admin Pages (Requires admin_token)
- `/admin/dashboard` - Main Admin Dashboard
- `/admin/edit/*` - Edit Student Details

#### Founder Pages (Requires admin_token with founder role)
- `/founder` - Founder Dashboard
- Manages form options (colleges, courses, branches)

---

## 🔄 Inter-Page Linking

### From Navbar (Available Everywhere)
The `Navbar` component is included in `layout.tsx` so it appears on all pages.

#### When Logged Out:
- Home, About, Contact, Register, Dashboard links
- "Login" button → `/login`

#### When Logged In (Student):
- Same links + Profile Avatar dropdown with:
  - "My Profile" → `/profile`
  - "Settings" → `/settings`
  - "Logout" button

#### When Logged In (Admin):
- Same links + Profile Avatar dropdown with:
  - "Admin Dashboard" → `/admin/dashboard`
  - "Settings" → `/settings`
  - "Logout" button

#### When Logged In (Founder):
- Same links + Profile Avatar dropdown with:
  - "👑 Founder" → `/founder`
  - "Founder Dashboard" (in dropdown)
  - "Settings" → `/settings`
  - "Logout" button

### From Admin Dashboard
Quick action buttons in header:
- 🏠 Home → `/`
- 🚪 Logout → `/api/admin/logout`

### From Admin Login Page
- "← Back to Student Login" → `/login`

---

## 📥 PDF Download Feature

### Individual Student Allotment Letter
**Location**: Student Profile (`/profile`)
- Button: "🖨️ Download Allotment Letter"
- Shows only if student has allotted college
- Opens print dialog with formatted letter

**Location**: Admin Dashboard (`/admin/dashboard`)
- Button: "🖨️ Print" (per student row)
- Shows only for allotted students

### Bulk Student Report
**Location**: Admin Dashboard Filters Section
- Button: "📥 Download Report - {X} Students"
- Features:
  - Modern gradient header with statistics
  - Student cards with avatars
  - Color-coded status badges
  - Detailed information grid
  - Student preferences list
  - Professional styling
  - Print-optimized

---

## 🎨 Features

### Theme Switcher
- Available in navbar (three-dot menu)
- Options: Light, Dark
- Saves to localStorage
- Persists across sessions

### Avatar Selector
- 6 avatar options: 👤 👨 👩 🧑 👦 👧
- Choose from profile dropdown
- Saves to localStorage
- Shows in navbar when logged in

---

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - Student login
- `POST /api/register` - Student registration
- `POST /api/admin/login` - Admin/Founder login
- `GET /api/logout` - Student logout (clears all cookies)
- `GET /api/admin/logout` - Admin logout (clears all cookies)

### Data
- `GET /api/profile` - Get logged-in student profile
- `GET /api/user` - Get all students (admin only)
- `PUT /api/admin/allot` - Allot college to student

---

## ✅ Testing the System

### 1. Test Student Flow
```
1. Visit http://localhost:3000/register
2. Register a new student account
3. Login at /login
4. View profile at /profile
5. Click avatar → Logout
6. Verify redirect to /login
```

### 2. Test Admin Flow
```
1. Visit http://localhost:3000/admin/login
2. Login with admin credentials
3. View dashboard at /admin/dashboard
4. Try downloading student report
5. Click red "Logout" button
6. Verify redirect to /admin/login
7. Try accessing /admin/dashboard (should redirect to login)
```

### 3. Test Navigation
```
1. Login as any user
2. Use navbar to navigate between pages
3. Check profile dropdown works
4. Verify theme switcher works
5. Test avatar selection
6. Test logout from navbar
```

---

## 🐛 Troubleshooting

### "Not authorized" errors
- Clear browser cookies
- Check if JWT_SECRET is set in `.env.local`
- Verify correct login URL for role

### Redirect loops
- Check middleware.ts matcher patterns
- Clear cookies and try again
- Verify token expiration

### Download button not working
- Check browser popup blocker
- Open browser console for errors
- Verify student data exists

---

## 📝 Summary

✅ **Fully functional login/logout system**
✅ **Role-based access control**
✅ **Protected routes with middleware**
✅ **Comprehensive navigation**
✅ **Modern PDF download feature**
✅ **Theme customization**
✅ **Mobile-responsive**
✅ **Secure cookie handling**

All pages are properly linked and authentication flows work correctly!
