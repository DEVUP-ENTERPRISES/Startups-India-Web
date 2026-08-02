import { NextResponse } from 'next/server';

const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Block any direct access to /admin or /admin/* - return hard 404
  // This prevents scanners and bots from discovering the admin panel location.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 });
  }

  // Rewrite /{ADMIN_SLUG} or /{ADMIN_SLUG}/* → /admin or /admin/*
  // The browser URL stays as the slug; Next.js renders the /admin/* page tree.
  if (pathname === `/${ADMIN_SLUG}` || pathname.startsWith(`/${ADMIN_SLUG}/`)) {
    const rewrittenPath = pathname.replace(`/${ADMIN_SLUG}`, '/admin');
    const url = request.nextUrl.clone();
    url.pathname = rewrittenPath || '/admin';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all pages except Next.js internals, static files, and API routes
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|api/).*)',
  ],
};
