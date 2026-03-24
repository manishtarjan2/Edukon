import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import CollegeFormOption from '@/models/CollegeFormOption'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// GET: Fetch all college options
export async function GET() {
    try {
        await connectDB()

        const colleges = await CollegeFormOption.find({ active: true } as any).sort({ college: 1 })

        return NextResponse.json({ colleges })
    } catch (error) {
        console.error('Error fetching college options:', error)
        return NextResponse.json({ error: 'Failed to fetch college options' }, { status: 500 })
    }
}

// POST: Create new college with options
export async function POST(req: Request) {
    try {
        // Verify founder auth
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }

        if (decoded.role !== 'founder') {
            return NextResponse.json({ error: 'Only founders can manage college options' }, { status: 403 })
        }

        await connectDB()

        const { college, courses, branches } = await req.json()

        if (!college || college.trim() === '') {
            return NextResponse.json({ error: 'College name is required' }, { status: 400 })
        }

        // Check if college already exists
        const existing = await CollegeFormOption.findOne({ college: college.trim() } as any)
        if (existing) {
            return NextResponse.json({ error: 'College already exists' }, { status: 400 })
        }

        const newCollege = await CollegeFormOption.create({
            college: college.trim(),
            courses: courses || [],
            branches: branches || [],
            active: true
        })

        return NextResponse.json({
            message: 'College options created successfully',
            college: newCollege
        })
    } catch (error) {
        console.error('Error creating college options:', error)
        return NextResponse.json({ error: 'Failed to create college options' }, { status: 500 })
    }
}

// PUT: Update existing college options
export async function PUT(req: Request) {
    try {
        // Verify founder auth
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }

        if (decoded.role !== 'founder') {
            return NextResponse.json({ error: 'Only founders can manage college options' }, { status: 403 })
        }

        await connectDB()

        const { collegeId, college, courses, branches } = await req.json()

        if (!collegeId) {
            return NextResponse.json({ error: 'College ID is required' }, { status: 400 })
        }

        const updated = await CollegeFormOption.findByIdAndUpdate(
            collegeId,
            {
                college: college.trim(),
                courses: courses || [],
                branches: branches || []
            } as any,
            { new: true } as any
        )

        if (!updated) {
            return NextResponse.json({ error: 'College not found' }, { status: 404 })
        }

        return NextResponse.json({
            message: 'College options updated successfully',
            college: updated
        })
    } catch (error) {
        console.error('Error updating college options:', error)
        return NextResponse.json({ error: 'Failed to update college options' }, { status: 500 })
    }
}

// DELETE: Remove college options
export async function DELETE(req: Request) {
    try {
        // Verify founder auth
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }

        if (decoded.role !== 'founder') {
            return NextResponse.json({ error: 'Only founders can manage college options' }, { status: 403 })
        }

        await connectDB()

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'College ID is required' }, { status: 400 })
        }

        const deleted = await (CollegeFormOption as any).findByIdAndDelete(id)

        if (!deleted) {
            return NextResponse.json({ error: 'College not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'College options deleted successfully' })
    } catch (error) {
        console.error('Error deleting college options:', error)
        return NextResponse.json({ error: 'Failed to delete college options' }, { status: 500 })
    }
}
