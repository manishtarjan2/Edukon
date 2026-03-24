import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// POST - Register new admin (only Founder can do this)
export async function POST(req: Request) {
    try {
        await connectDB()

        // Check if requester is Founder
        const cookieStore = await cookies()
        const userEmail = cookieStore.get('userEmail')?.value

        if (!userEmail) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const founder = await User.findOne({ email: userEmail, role: 'founder' })
        if (!founder) {
            return NextResponse.json({ message: 'Only Founder can create admins' }, { status: 403 })
        }

        const { firstName, lastName, email, password, phone, college, assignedWork } = await req.json()

        // Validate required fields
        if (!firstName || !email || !password) {
            return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 })
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ message: 'Email already registered' }, { status: 400 })
        }

        // Generate Admin ID
        const count = await User.countDocuments({ role: 'admin' })
        const adminId = `ADM-${(count + 1).toString().padStart(4, '0')}`

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create admin
        const admin = await User.create({
            user_id: adminId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            college,
            assignedWork,
            role: 'admin',
            createdBy: founder._id
        })

        return NextResponse.json({
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                user_id: admin.user_id,
                email: admin.email,
                firstName: admin.firstName,
                role: admin.role,
                college: admin.college,
                assignedWork: admin.assignedWork
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Admin registration error:', error)
        return NextResponse.json({ message: 'Failed to create admin' }, { status: 500 })
    }
}

// GET - Get all admins (only Founder can see)
export async function GET() {
    try {
        await connectDB()

        // Check if requester is Founder
        const cookieStore = await cookies()
        const userEmail = cookieStore.get('userEmail')?.value

        if (!userEmail) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const founder = await User.findOne({ email: userEmail, role: 'founder' })
        if (!founder) {
            return NextResponse.json({ message: 'Only Founder can view admins' }, { status: 403 })
        }

        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 })

        return NextResponse.json({ admins })

    } catch (error) {
        console.error('Get admins error:', error)
        return NextResponse.json({ message: 'Failed to fetch admins' }, { status: 500 })
    }
}

// PUT - Update admin details (only Founder can do this)
export async function PUT(req: Request) {
    try {
        await connectDB()

        const cookieStore = await cookies()
        const userEmail = cookieStore.get('userEmail')?.value

        if (!userEmail) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const founder = await User.findOne({ email: userEmail, role: 'founder' })
        if (!founder) {
            return NextResponse.json({ message: 'Only Founder can update admins' }, { status: 403 })
        }

        const { adminId, firstName, lastName, phone, college, assignedWork } = await req.json()

        if (!adminId) {
            return NextResponse.json({ message: 'Admin ID is required' }, { status: 400 })
        }

        // Find admin and update
        const admin = await User.findById(adminId)
        if (!admin || admin.role !== 'admin') {
            return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
        }

        // Update fields
        if (firstName) admin.firstName = firstName
        if (lastName) admin.lastName = lastName
        if (phone !== undefined) admin.phone = phone
        if (college !== undefined) admin.college = college
        if (assignedWork !== undefined) admin.assignedWork = assignedWork

        await admin.save()

        return NextResponse.json({
            message: 'Admin updated successfully',
            admin: {
                id: admin._id,
                user_id: admin.user_id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phone: admin.phone,
                college: admin.college,
                assignedWork: admin.assignedWork
            }
        })

    } catch (error) {
        console.error('Update admin error:', error)
        return NextResponse.json({ message: 'Failed to update admin' }, { status: 500 })
    }
}

// DELETE - Remove admin (only Founder can do this)
export async function DELETE(req: Request) {
    try {
        await connectDB()

        const cookieStore = await cookies()
        const userEmail = cookieStore.get('userEmail')?.value

        if (!userEmail) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const founder = await User.findOne({ email: userEmail, role: 'founder' })
        if (!founder) {
            return NextResponse.json({ message: 'Only Founder can remove admins' }, { status: 403 })
        }

        const { adminId } = await req.json()

        await User.findByIdAndDelete(adminId)

        return NextResponse.json({ message: 'Admin removed successfully' })

    } catch (error) {
        console.error('Delete admin error:', error)
        return NextResponse.json({ message: 'Failed to remove admin' }, { status: 500 })
    }
}
