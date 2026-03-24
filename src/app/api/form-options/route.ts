import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import FormOption from '@/models/FormOption'

// GET - Fetch active form options (public endpoint for registration)
export async function GET(request: Request) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')

        const query: any = { active: true }
        if (type) {
            query.type = type
        }

        const options = await FormOption.find(query).sort({ name: 1 }).select('type name')

        return NextResponse.json({ options })
    } catch (error) {
        console.error('GET /api/form-options error:', error)
        return NextResponse.json({ error: 'Failed to fetch form options' }, { status: 500 })
    }
}
