import { NextRequest, NextResponse } from 'next/server'
import { getTenantBySubdomain } from '@jobflow/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl

  // For local dev, assume localhost:3000
  // In production, jobflow.com
  const baseDomain = process.env.NODE_ENV === 'production' ? 'jobflow.com' : 'localhost:3000'

  // If hostname is subdomain.baseDomain, extract subdomain
  if (hostname.endsWith(`.${baseDomain}`)) {
    const subdomain = hostname.replace(`.${baseDomain}`, '')
    if (subdomain && subdomain !== 'app' && subdomain !== 'www') {
      // Look up tenant by subdomain
      const tenant = await getTenantBySubdomain(subdomain)
      
      if (tenant) {
        // Forward tenant info to downstream request
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-tenant-subdomain', subdomain)
        requestHeaders.set('x-tenant-id', tenant.id.toString())
        requestHeaders.set('x-tenant-name', tenant.name)

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        })
        // Also mirror on response for client-side reads if needed
        response.headers.set('x-tenant-subdomain', subdomain)
        response.headers.set('x-tenant-id', tenant.id.toString())
        response.headers.set('x-tenant-name', tenant.name)
        return response
      } else {
        // Tenant not found, redirect to main site or show error
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // For localhost (local dev without subdomain), check for tenant ID in cookies or session
  if (hostname.includes('localhost') || hostname.includes('github.dev') || hostname.includes('gitpod')) {
    // Try to get tenant ID from cookie and forward to request headers
    const tenantIdCookie = request.cookies.get('tenantId')?.value
    if (tenantIdCookie) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-tenant-id', tenantIdCookie)
      const response = NextResponse.next({ request: { headers: requestHeaders } })
      response.headers.set('x-tenant-id', tenantIdCookie)
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}