import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        console.log('📝 Registration attempt started...')

        await connectDB()
        console.log('✅ Database connected')

        const body = await req.json()
        const {
            user_id, firstName, lastName, gender, email, password, phone,
            college, course, branch, percentage12th, jeePercentile, provincialState, paymentStatus,
            collegePreferences, collegePreferenceDetails
        } = body

        console.log('📧 Registration attempt for email:', email)

        // Validate required fields
        if (!firstName || !email || !password) {
            console.log('❌ Missing required fields')
            return NextResponse.json({ message: 'First name, email, and password are required' }, { status: 400 })
        }

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim()

        // Check if user already exists (case insensitive)
        const existingUser = await User.findOne({ email: normalizedEmail })
        if (existingUser) {
            console.log('❌ Email already registered:', normalizedEmail)
            return NextResponse.json({ message: 'Email already registered. Please login instead.' }, { status: 400 })
        }

        // Check if user_id already exists
        if (user_id) {
            const existingUserId = await User.findOne({ user_id })
            if (existingUserId) {
                console.log('❌ User ID already taken:', user_id)
                return NextResponse.json({ message: 'User ID already taken' }, { status: 400 })
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log('✅ Password hashed')

        // Create user
        const user = await User.create({
            user_id,
            firstName,
            lastName,
            gender,
            email: normalizedEmail, // Store normalized email
            password: hashedPassword,
            phone,
            college,
            collegePreferences: collegePreferences || [],
            collegePreferenceDetails: collegePreferenceDetails || [],
            course,
            branch,
            percentage12th,
            jeePercentile,
            provincialState,
            paymentStatus: paymentStatus || 'pending',
            role: 'user'
        })

        console.log('✅ User registered successfully:', normalizedEmail)

        return NextResponse.json({
            message: 'Registration successful! You can now login.',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName
            }
        }, { status: 201 })

    } catch (error) {
        console.error('❌ Registration error:', error)
        return NextResponse.json({
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 })
    }
}
