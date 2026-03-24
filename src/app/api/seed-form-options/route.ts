import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import FormOption from '@/models/FormOption'

// Seed form options with default colleges, branches, and courses
export async function GET() {
    try {
        console.log('🌱 Starting form options seed...')
        await connectDB()

        // Check if options already exist
        const existingOptions = await FormOption.find()
        if (existingOptions.length > 0) {
            return NextResponse.json({
                message: '✅ Form options already exist!',
                count: existingOptions.length,
                options: existingOptions,
                note: 'Delete existing options first if you want to re-seed'
            })
        }

        // Default colleges
        const colleges = [
            'IIT Delhi',
            'IIT Bombay',
            'IIT Madras',
            'IIT Kanpur',
            'IIT Kharagpur',
            'IIT Roorkee',
            'NIT Trichy',
            'NIT Warangal',
            'BITS Pilani',
            'DTU Delhi',
            'NSUT Delhi',
            'Jadavpur University',
            'Anna University'
        ]

        // Default branches
        const branches = [
            'Computer Science and Engineering',
            'Information Technology',
            'Electronics and Communication Engineering',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Chemical Engineering',
            'Aerospace Engineering',
            'Biotechnology',
            'Industrial Engineering'
        ]

        // Default courses
        const courses = [
            'B.Tech',
            'B.E.',
            'M.Tech',
            'M.E.',
            'B.Sc',
            'M.Sc',
            'BCA',
            'MCA',
            'Dual Degree (B.Tech + M.Tech)'
        ]

        // Create college options
        const collegeOptions = colleges.map(name => ({
            type: 'college',
            name,
            active: true
        }))

        // Create branch options
        const branchOptions = branches.map(name => ({
            type: 'branch',
            name,
            active: true
        }))

        // Create course options
        const courseOptions = courses.map(name => ({
            type: 'course',
            name,
            active: true
        }))

        // Insert all options
        const allOptions = [...collegeOptions, ...branchOptions, ...courseOptions]
        await FormOption.insertMany(allOptions as any)

        console.log('✅ Form options seeded successfully!')

        return NextResponse.json({
            success: true,
            message: '✅ Successfully seeded form options!',
            count: {
                colleges: colleges.length,
                branches: branches.length,
                courses: courses.length,
                total: allOptions.length
            },
            data: {
                colleges,
                branches,
                courses
            },
            next: 'Now students can register at /register!'
        })

    } catch (error: any) {
        console.error('❌ Seed form options error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to seed form options',
            details: error.message
        }, { status: 500 })
    }
}
