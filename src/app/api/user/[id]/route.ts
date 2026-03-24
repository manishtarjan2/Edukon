import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

// GET - Fetch single user by ID
export async function GET(_: Request, { params }: any) {
  try {
    await connectDB()
    const { id } = await params
    const user = await User.findById(id).select('-password').lean()

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('GET user error:', error)
    return NextResponse.json({ message: 'Failed to get user' }, { status: 500 })
  }
}

// PUT - Update user details
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    // Don't allow role/password changes through this endpoint
    const { password, role, ...updateData } = body

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password').lean()

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('PUT user error:', error)
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - Remove user
export async function DELETE(_: Request, { params }: any) {
  try {
    await connectDB()
    const { id } = await params
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('DELETE user error:', error)
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 })
  }
}
