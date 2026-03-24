import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/db'
import FormOption from '@/models/FormOption'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// GET - Fetch all form options (optionally by type)
export async function GET(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { role: string; userId: string }

        // Check if user is founder
        if (decoded.role !== 'founder') {
            return NextResponse.json({ error: 'Forbidden - Founder access only' }, { status: 403 })
        }

        await connectDB()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')

        const query: any = {}
        if (type) {
            query.type = type
        }

        const options = await FormOption.find(query as any).sort({ type: 1, name: 1 })

        return NextResponse.json({ options })
    } catch (error) {
        console.error('GET /api/founder/form-options error:', error)
        return NextResponse.json({ error: 'Failed to fetch form options' }, { status: 500 })
    }
}

// POST - Add new form option
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { role: string; userId: string }

        if (decoded.role !== 'founder') {
            return NextResponse.json({ error: 'Forbidden - Founder access only' }, { status: 403 })
        }

        await connectDB()

        const body = await request.json()
        const { type, name } = body

        if (!type || !name) {
            return NextResponse.json({ error: 'Type and name are required' }, { status: 400 })
        }

        if (!['college', 'branch', 'course'].includes(type)) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        // Check if option already exists
        const existing = await FormOption.findOne({ type, name: name.trim() } as any)
        if (existing) {
            return NextResponse.json({ error: 'Option already exists' }, { status: 400 })
        }

        const newOption = new FormOption({
            type,
            name: name.trim(),
            active: true
        })

        await newOption.save()

        return NextResponse.json({
            message: 'Form option added successfully',
            option: newOption
        }, { status: 201 })
    } catch (error) {
        console.error('POST /api/founder/form-options error:', error)
        return NextResponse.json({ error: 'Failed to add form option' }, { status: 500 })
    }
}

// DELETE - Remove form option
export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { role: string; userId: string }

        if (decoded.role !== 'founder') {
            return NextResponse.json({ error: 'Forbidden - Founder access only' }, { status: 403 })
        }

        await connectDB()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Option ID is required' }, { status: 400 })
        }

        const deletedOption = await (FormOption as any).findByIdAndDelete(id)

        if (!deletedOption) {
            return NextResponse.json({ error: 'Option not found' }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Form option deleted successfully',
            option: deletedOption
        })
    } catch (error) {
        console.error('DELETE /api/founder/form-options error:', error)
        return NextResponse.json({ error: 'Failed to delete form option' }, { status: 500 })
    }
}
