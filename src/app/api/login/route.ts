import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
    try {
        console.log('🔐 Student login attempt started...')

        await connectDB()
        console.log('✅ Database connected')

        const { email, password } = await req.json()
        console.log('📧 Login attempt for email:', email)

        if (!email || !password) {
            console.log('❌ Missing email or password')
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
        }

        // Find user by email (case insensitive)
        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
            console.log('❌ User not found:', email)
            return NextResponse.json({ message: 'User not found. Please register first.' }, { status: 401 })
        }

        console.log('✅ Found user:', user.email, 'Role:', user.role)

        // Check password
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            console.log('❌ Password mismatch for:', email)
            return NextResponse.json({ message: 'Invalid password. Please try again.' }, { status: 401 })
        }

        console.log('✅ Password verified')

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        )

        console.log('✅ JWT token created')

        const res = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                role: user.role
            }
        })

        res.cookies.set('user_token', token, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        // Also set role cookie for client-side checks
        res.cookies.set('userRole', user.role, {
            httpOnly: false,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        console.log('✅ Login successful for:', email, '- Role:', user.role)

        return res
    } catch (err) {
        console.error('❌ Login error:', err)
        return NextResponse.json({ message: 'Login failed. Server error.' }, { status: 500 })
    }
}

