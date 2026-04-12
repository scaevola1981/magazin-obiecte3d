import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const res = NextResponse.next();

  // --- Hotlinking Protection ---
  // Check for 3D asset file extensions
  if (url.pathname.endsWith('.glb') || url.pathname.endsWith('.obj') || url.pathname.endsWith('.stl')) {
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    const allowedDomain = process.env.NEXT_PUBLIC_SITE_URL || host;

    /**
     * Relaxed Hotlinking Logic:
     * - ALLOW if referer is missing (Standlone PWA / Desktop App shells often omit referer)
     * - ALLOW if referer includes our own allowed domain or host
     * - BLOCK otherwise
     */
    if (referer && allowedDomain && !referer.includes(allowedDomain)) {
      return new NextResponse('Acces Interzis - Hotlinking Protection Active', { status: 403 });
    }
  }

  // --- Security Headers ---
  // Basic security headers
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), accelerometer=(), autoplay=(), encrypted-media=()'
  );

  // Content Security Policy — permissive enough for Next.js + Supabase + external images
  const csp = [
    "default-src 'self'",
    // Allow inline scripts required by Next.js runtime
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    // Allow inline styles (Tailwind, framer-motion, etc.)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Fonts from Google
    "font-src 'self' https://fonts.gstatic.com",
    // Images: self, Supabase storage, Unsplash, and any https image source + data URIs
    "img-src 'self' https: data: blob:",
    // API connections: Supabase, WhatsApp, Vercel analytics
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);

  // HSTS only in production
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }

  return res;
}

export const config = {
  // Use a broad matcher but skip static assets that usually don't need middleware processing
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
