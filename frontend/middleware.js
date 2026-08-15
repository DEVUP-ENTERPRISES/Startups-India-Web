import { NextResponse } from 'next/server';

const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── Admin panel obfuscation ──────────────────────────────────────────
  // Block direct /admin access - hard 404 so scanners get nothing.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 });
  }

  // Rewrite /{ADMIN_SLUG}/* → /admin/* (browser URL stays as slug).
  if (pathname === `/${ADMIN_SLUG}` || pathname.startsWith(`/${ADMIN_SLUG}/`)) {
    const rewrittenPath = pathname.replace(`/${ADMIN_SLUG}`, '/admin');
    const url = request.nextUrl.clone();
    url.pathname = rewrittenPath || '/admin';
    return NextResponse.rewrite(url);
  }

  // Note: /onboarding auth guard is handled client-side in the page component
  // via localStorage token check. The backend accessToken cookie is set on
  // localhost:5000 (different origin in dev) so it is not readable here in
  // the Next.js middleware running on localhost:3000.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|api/).*)',
  ],
};
