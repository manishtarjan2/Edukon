import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

// PUT - Allot college to student
export async function PUT(req: Request) {
    try {
        await connectDB()

        const { userId, allottedCollege, course, branch } = await req.json()

        if (!userId || !allottedCollege) {
            return NextResponse.json({ message: 'User ID and allotted college are required' }, { status: 400 })
        }

        const updateData: any = { allottedCollege }
        if (course) updateData.course = course
        if (branch) updateData.branch = branch

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password')

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            message: 'College allotted successfully',
            user
        })

    } catch (error) {
        console.error('Allotment error:', error)
        return NextResponse.json({ message: 'Failed to allot college' }, { status: 500 })
    }
}
