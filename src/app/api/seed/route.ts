import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

// Simple seed endpoint - Use this ONCE to create founder and admin
export async function GET() {
    try {
        console.log('🔄 Starting seed process...')

        // Connect to database
        console.log('📡 Connecting to database...')
        await connectDB()
        console.log('✅ Database connected')

        // Check if founder already exists
        console.log('🔍 Checking for existing founder...')
        const existingFounder = await User.findOne({ role: 'founder' })

        if (existingFounder) {
            console.log('👑 Founder already exists')
            return NextResponse.json({
                message: '✅ Accounts already exist!',
                credentials: {
                    founder: {
                        email: 'founder@edukon.com',
                        password: 'Founder@123'
                    },
                    admin: {
                        email: 'admin@edukon.com',
                        password: 'Admin@123'
                    }
                },
                note: 'Try logging in at /admin/login'
            })
        }

        console.log('🔐 Hashing passwords...')
        // Create founder
        const founderPassword = await bcrypt.hash('Founder@123', 10)
        console.log('👑 Creating founder...')

        const founder = await User.create({
            firstName: 'Founder',
            lastName: 'Edukon',
            email: 'founder@edukon.com',
            password: founderPassword,
            role: 'founder'
        })
        console.log('✅ Founder created:', founder.email)

        // Create admin
        const adminPassword = await bcrypt.hash('Admin@123', 10)
        console.log('👤 Creating admin...')

        const admin = await User.create({
            user_id: 'ADM-0001',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@edukon.com',
            password: adminPassword,
            role: 'admin'
        })
        console.log('✅ Admin created:', admin.email)

        console.log('🎉 Seed completed successfully!')

        return NextResponse.json({
            success: true,
            message: '✅ Successfully created founder and admin accounts!',
            credentials: {
                founder: {
                    email: 'founder@edukon.com',
                    password: 'Founder@123',
                    role: 'founder'
                },
                admin: {
                    email: 'admin@edukon.com',
                    password: 'Admin@123',
                    role: 'admin'
                }
            },
            next: 'Now visit /admin/login to sign in!'
        })

    } catch (error: any) {
        console.error('❌ Seed error:', error)
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)

        return NextResponse.json({
            success: false,
            error: 'Failed to seed accounts',
            details: error.message,
            name: error.name,
            hint: 'Check the terminal console for detailed error logs'
        }, { status: 500 })
    }
}
