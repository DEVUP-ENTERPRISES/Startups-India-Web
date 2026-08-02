// Next.js 14 polls /api/flags for Vercel Feature Flags / Toolbar integration.
// This stub returns 200 with an empty flags object so the repeated 404 noise
// is eliminated without enabling any actual feature-flag billing.
export const dynamic = 'force-static';

export function GET() {
  return Response.json({ flags: {} }, { status: 200 });
}
