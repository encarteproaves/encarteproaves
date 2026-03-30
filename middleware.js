import { NextResponse } from 'next/server'

export function middleware(request) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (!isAdminRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin-auth')?.value === 'true';

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}