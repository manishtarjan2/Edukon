import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    console.log('🔐 Admin login attempt started...')

    await connectDB()
    console.log('✅ Database connected')

    const { email, password } = await req.json()
    console.log('📧 Login attempt for email:', email)

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    // Find admin OR founder
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role: { $in: ['admin', 'founder'] }
    })

    if (!user) {
      console.log('❌ No admin/founder found with email:', email)
      // Check if user exists with different role
      const anyUser = await User.findOne({ email: email.toLowerCase().trim() })
      if (anyUser) {
        console.log('⚠️ User exists but role is:', anyUser.role)
        return NextResponse.json({ message: 'This account is not an admin/founder. Use student login.' }, { status: 401 })
      }
      return NextResponse.json({ message: 'Admin/Founder not found. Check your email.' }, { status: 401 })
    }

    console.log('✅ Found user:', user.email, 'Role:', user.role)

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      console.log('❌ Password mismatch for:', email)
      return NextResponse.json({ message: 'Invalid password. Please try again.' }, { status: 401 })
    }

    console.log('✅ Password verified')

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    console.log('✅ JWT token created')

    const res = NextResponse.json({
      message: 'Login success',
      role: user.role,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    })

    res.cookies.set('admin_token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    })

    // Store email for role checking
    res.cookies.set('userEmail', email.toLowerCase().trim(), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    })

    // Store role for client-side checks
    res.cookies.set('userRole', user.role, {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    })

    console.log('✅ Login successful for:', email, '- Role:', user.role)

    return res
  } catch (err) {
    console.error('❌ Login error:', err)
    return NextResponse.json({ message: 'Login failed. Server error.', error: String(err) }, { status: 500 })
  }
}
