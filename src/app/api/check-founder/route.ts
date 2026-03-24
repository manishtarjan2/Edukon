import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

// Check founder account details
export async function GET() {
    try {
        console.log('🔍 Checking founder account...')
        await connectDB()

        const founder = await User.findOne({ role: 'founder' }).lean() as any

        if (!founder) {
            return NextResponse.json({
                found: false,
                message: '❌ No founder account exists in database',
                action: 'Visit /api/seed to create accounts'
            })
        }

        return NextResponse.json({
            found: true,
            message: '✅ Founder account exists!',
            details: {
                id: founder._id,
                email: founder.email,
                firstName: founder.firstName,
                lastName: founder.lastName,
                role: founder.role,
                createdAt: founder.createdAt
            },
            loginInfo: {
                url: 'http://localhost:3000/admin/login',
                email: founder.email,
                note: 'Password is hashed in database - use: Founder@123'
            }
        })

    } catch (error: any) {
        console.error('❌ Check error:', error)
        return NextResponse.json({
            error: 'Failed to check founder account',
            details: error.message
        }, { status: 500 })
    }
}
