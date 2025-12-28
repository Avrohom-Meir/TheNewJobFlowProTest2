import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl

  // For local dev, assume localhost:3466
  // In production, jobflow.com
  const baseDomain = process.env.NODE_ENV === 'production' ? 'jobflow.com' : 'localhost:3000'

  // If hostname is subdomain.baseDomain, extract subdomain
  if (hostname.endsWith(`.${baseDomain}`)) {
    const subdomain = hostname.replace(`.${baseDomain}`, '')
    if (subdomain && subdomain !== 'app' && subdomain !== 'www') {
      // Set tenant subdomain in headers for the app to use
      const response = NextResponse.next()
      response.headers.set('x-tenant-subdomain', subdomain)
      return response
    }
  }

  // For admin (app.jobflow.com or localhost)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}