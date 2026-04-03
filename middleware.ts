import { NextResponse } from 'next/server';

export function middleware() {
  const res = NextResponse.next();

  // Security headers (kept permissive for Supabase assets)
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), accelerometer=(), autoplay=(), encrypted-media=()'
  );

  // Content Security Policy
  const supabaseProject = 'socqbkfurzfbxqqwijnnd.supabase.co';
  const csp = [
    "default-src 'self'",
    // Images from Supabase storage and data URLs for placeholders
    `img-src 'self' https://${supabaseProject} data:`,
    // Scripts/styles/fonts kept self + Google Fonts if still used
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    // API/WS calls to Supabase
    `connect-src 'self' https://${supabaseProject}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
  res.headers.set('Content-Security-Policy', csp);

  // HSTS only in production (avoid on localhost)
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
