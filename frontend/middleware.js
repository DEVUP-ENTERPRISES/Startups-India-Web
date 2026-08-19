import { NextResponse } from 'next/server';

const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';
const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // ── QR scan tracking ─────────────────────────────────────────────────
  // When a visitor lands with utm_medium=qr, ping the backend to record
  // the scan. User sees nothing — they land on the page normally.
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');
  if (utmMedium === 'qr' && utmCampaign) {
    fetch(`${API_URL}/api/v1/campaigns/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utmCampaign,
        utmMedium,
        utmContent: searchParams.get('utm_content') || '',
        utmSource: searchParams.get('utm_source') || '',
        pathname,
        userAgent: request.headers.get('user-agent') || '',
        ip:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          '',
        referrer: request.headers.get('referer') || '',
      }),
    }).catch(() => {});
    // Never await — the redirect/page load must not be delayed
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api/).*)', '/'],
};
