# 🎓 Edukon Setup Guide

## ✅ Current Status
Your development server is running successfully at: **http://localhost:3000**

---

## 🔑 Login Credentials

### Founder Account
- **URL**: http://localhost:3000/admin/login
- **Email**: `founder@edukon.com`
- **Password**: `Founder@123`
- **Redirects to**: `/founder` (Founder Dashboard)

### Admin Account
- **URL**: http://localhost:3000/admin/login
- **Email**: `admin@edukon.com`
- **Password**: `Admin@123`
- **Redirects to**: `/admin/dashboard` (Admin Dashboard)

---

## 🚀 Getting Started

### Step 1: Seed the Database
Before logging in for the first time, visit:
```
http://localhost:3000/api/seed
```
This creates the founder and admin accounts in your MongoDB database.

### Step 2: Login as Founder
1. Go to http://localhost:3000/admin/login
2. Enter founder credentials (see above)
3. You'll be redirected to the Founder Dashboard

### Step 3: Add Registration Form Options
**This is the KEY step to fix the registration form!**

On the Founder Dashboard, you'll now see a **"Form Options Management"** section where you can:

1. **Add Colleges** - Click the "Colleges" tab and add colleges like:
   - IIT Delhi
   - IIT Bombay
   - NIT Trichy
   - BITS Pilani
   - etc.

2. **Add Branches** - Click the "Branches" tab and add branches like:
   - Computer Science
   - Electrical Engineering
   - Mechanical Engineering
   - Civil Engineering
   - etc.

3. **Add Courses** - Click the "Courses" tab and add courses like:
   - B.Tech
   - M.Tech
   - B.Sc
   - M.Sc
   - etc.

### Step 4: Test Student Registration
Once you've added options in Step 3:
1. Go to http://localhost:3000/register
2. Fill out the registration form
3. You should now see colleges, branches, and courses in the dropdowns!

---

## 🎯 Key Features

### Founder Dashboard (`/founder`)
- Manage admin accounts (add/remove admins)
- **Manage form options** (colleges, branches, courses)
- View statistics
- Access to all admin features

### Admin Dashboard (`/admin/dashboard`)
- View all student registrations
- Edit student allotments (college, course, branch)
- Filter and search students
- Export data

### Student Features
- Registration with multi-step form
- College preferences (select 3-5 in priority order)
- Payment options (UPI, Card, Net Banking) or skip for testing
- Login and dashboard

---

## 🔧 Common Issues & Solutions

### Issue 1: "Colleges/Branches/Courses not showing in registration"
**Solution**: Login as founder and add options using the Form Options Manager (see Step 3 above)

### Issue 2: "Admin/Founder not found"
**Solution**: Visit `/api/seed` to create the default accounts

### Issue 3: "Port 3000 already in use"
**Solution**: Kill the existing process:
```powershell
taskkill /F /PID <process_id>
```
Then restart: `npm run dev`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/          # Admin/Founder login page
│   │   └── dashboard/      # Admin dashboard
│   ├── founder/            # Founder dashboard (manage admins & form options)
│   ├── register/           # Student registration
│   ├── login/              # Student login
│   └── api/
│       ├── seed/           # Database seeding
│       ├── admin/          # Admin API routes
│       ├── founder/        # Founder API routes
│       ├── form-options/   # Public API for form options
│       └── register/       # Student registration API
├── components/
│   └── FormOptionsManager.tsx  # Form options management UI
└── models/
    ├── User.js            # User model (students, admins, founder)
    └── FormOption.js      # Form options model
```

---

## 🎨 Design Theme
The application uses a warm, nostalgic design theme with:
- Amber and orange color palette
- Vintage paper textures
- Rounded corners and soft shadows
- Handwritten font accents
- Emoji decorations 💛

---

## 📝 Notes
- JWT tokens are stored in httpOnly cookies for security
- Form options are dynamically fetched from the database
- Payment is currently in test mode (can skip)
- All passwords are hashed with bcrypt

---

## 🤝 Support
If you encounter any issues, check:
1. MongoDB connection string in `.env.local`
2. JWT_SECRET is set in `.env.local`
3. Dev server is running on port 3000
4. Form options have been added via Founder Dashboard
