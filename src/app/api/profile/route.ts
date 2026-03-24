import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('user_token')?.value || req.cookies.get('admin_token')?.value

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
        }

        // Verify token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const { payload } = await jwtVerify(token, secret)

        // Connect to DB and get user
        await connectDB()
        const user = await User.findById(payload.id).select('-password').lean()

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Profile error:', error)
        return NextResponse.json({ message: 'Failed to get profile' }, { status: 500 })
    }
}
