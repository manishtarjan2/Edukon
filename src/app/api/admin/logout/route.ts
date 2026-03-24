import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url))

  // Clear all admin-related cookies
  res.cookies.set('admin_token', '', { maxAge: 0, path: '/' })
  res.cookies.set('userEmail', '', { maxAge: 0, path: '/' })
  res.cookies.set('userRole', '', { maxAge: 0, path: '/' })

  return res
}
