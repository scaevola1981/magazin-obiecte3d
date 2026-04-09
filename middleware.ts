import { NextResponse } from 'next/server';

export function middleware() {
  const res = NextResponse.next();

  // Basic security headers
  res.headers.set('X-Frame-Options', 'DENY');
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
    "frame-ancestors 'none'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);

  // HSTS only in production
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
