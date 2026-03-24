# 🔐 Edukon Login Credentials & Testing Guide

## ✅ Fixed Issues

1. **MongoDB IP Whitelist** - Your IP (152.58.157.60) is now whitelisted
2. **Admin Login API** - Enhanced with detailed logging and case-insensitive email
3. **Student Login API** - Enhanced with detailed logging and better error messages
4. **Registration API** - Improved validation and email normalization
5. **Admin Account** - Reset and properly configured

---

## 👨‍💼 Admin Login

**Login Page:** http://localhost:3000/admin/login

| Field | Value |
|-------|-------|
| **Email** | `admin@edukon.com` |
| **Password** | `Admin@123` |

**After Login:** You'll be redirected to `/admin/dashboard`

**Admin Features:**
- View all registered students
- Allot colleges to students
- Manage student data
- View analytics

---

## 👑 Founder Login

**Login Page:** http://localhost:3000/admin/login (same as admin)

The founder needs to be created separately. To create a founder account:

```bash
# Run this in your project directory
node scripts/create-founder.mjs
```

**Founder Features:**
- All admin features
- Manage form options (colleges, branches, courses)
- Access founder dashboard at `/founder`

---

## 👨‍🎓 Student Login

**Registration Page:** http://localhost:3000/register  
**Login Page:** http://localhost:3000/login

**Steps:**
1. First, **REGISTER** a new student account at `/register`
2. Fill in the registration form
3. After successful registration, **LOGIN** at `/login` with your email and password
4. You'll be redirected to `/profile`

**Student Features:**
- View profile
- Check allotment status
- Update preferences
- View college information

---

## 🧪 Testing Instructions

### Test 1: Admin Login
1. Go to http://localhost:3000/admin/login
2. Enter email: `admin@edukon.com`
3. Enter password: `Admin@123`
4. Click "Enter Portal ✨"
5. **Expected:** Redirect to `/admin/dashboard` and see admin interface

### Test 2: Student Registration & Login
1. Go to http://localhost:3000/register
2. Fill in the registration form with your details
3. Click Register
4. **Expected:** Success message
5. Go to http://localhost:3000/login
6. Enter your email and password
7. Click "Sign In Now"
8. **Expected:** Redirect to `/profile` showing your information

### Test 3: Create Founder Account (Optional)
1. Create a file: `scripts/create-founder.mjs`
2. Copy the admin reset script and change:
   - Email to your desired founder email
   - Role to 'founder'
3. Run: `node scripts/create-founder.mjs`
4. Login at `/admin/login` with founder credentials

---

## 🔍 Debugging Tips

### Check Server Logs
Your dev server (`npm run dev`) now has detailed logging:
- 🔐 Login attempt started
- ✅ Database connected
- 📧 Email being used
- ✅ User found / Password verified
- ❌ Error messages with details

### Common Issues

**Issue:** Login returns 401 Unauthorized  
**Solutions:**
- Check if you're using the correct email (case doesn't matter)
- Verify password is correct
- For students: Make sure you registered first
- For admin: Use `admin@edukon.com` / `Admin@123`
- Check terminal logs for detailed error

**Issue:** "User not found"  
**Solutions:**
- Students: Register first at `/register`
- Admin: Run `node scripts/reset-admin.mjs` to recreate admin

**Issue:** Cannot connect to database  
**Solutions:**
- Check if your IP changed (re-add to MongoDB Atlas whitelist)
- Verify `.env.local` has correct `MONGODB_URI`

---

## 🛠️ Useful Scripts

### Reset Admin Account
```bash
node scripts/reset-admin.mjs
```
This deletes and recreates the admin account with fresh credentials.

### Check Database Connection
Your `.env.local` should have:
```
MONGODB_URI=mongodb+srv://manishtarjan2_db_user:manishtarjan_DB2@cluster0.uxxkbs3.mongodb.net/edukon?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=supersecretkey123
```

---

## 📊 API Endpoints Status

| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/login` | POST | ✅ Working | Student login |
| `/api/admin/login` | POST | ✅ Working | Admin/Founder login |
| `/api/register` | POST | ✅ Working | Student registration |
| `/api/profile` | GET | ✅ Working | Get user profile |
| `/api/logout` | POST | ✅ Working | Logout user |

---

## 🎯 Next Steps

1. **Test Admin Login** - Login with the credentials above
2. **Create Test Student** - Register a dummy student account to test the flow
3. **Test Full Flow** - Register → Login → View Profile → Admin Allots → Check Status

---

## 💡 Tips

- **Email is case-insensitive** - `Admin@Edukon.com` = `admin@edukon.com`
- **Cookies are used** - Login tokens stored in httpOnly cookies
- **Role-based access** - Students, Admins, and Founders have different permissions
- **Server logs** - Check your terminal running `npm run dev` for detailed logs

---

**Last Updated:** 2026-02-03  
**Status:** ✅ All login systems functional
