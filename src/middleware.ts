import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Check for 3D asset file extensions
  if (url.pathname.endsWith('.glb') || url.pathname.endsWith('.obj') || url.pathname.endsWith('.stl')) {
    const referer = request.headers.get('referer');
    const allowedDomain = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('host');

    // If the request doesn't come from our site or allowed domain, we block it to prevent hotlinking
    if (!referer || (allowedDomain && !referer.includes(allowedDomain))) {
      return new NextResponse('Acces Interzis - Hotlinking Protection Active', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply protection to public directories typically storing static assets or the whole site
  matcher: '/:path*',
}
