import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  
  // Exclude api routes and Hono stuff
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const isPublicRoute = pathname === '/login' || pathname === '/register'

  // If user is NOT logged in and trying to go to unprotected route
  if (!token && !isPublicRoute) {
    // Determine where they were going to redirect them back after login
    const loginUrl = new URL('/login', request.url)
    
    // Only pass callback URL if it's not the home page (to avoid ?callbackUrl=/)
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', encodeURI(pathname + request.nextUrl.search))
    }
    
    return NextResponse.redirect(loginUrl)
  }

  // If user IS logged in and trying to access login/register page
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Matches all request paths except for the ones starting with:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
