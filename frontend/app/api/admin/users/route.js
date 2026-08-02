import { NextResponse } from 'next/server';
const backendBaseUrl =
  process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function buildForwardHeaders(request) {
  const headers = { 'Content-Type': 'application/json' };
  const auth = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');
  if (auth) headers.Authorization = auth;
  if (cookie) headers.Cookie = cookie;
  return headers;
}

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const response = await fetch(`${backendBaseUrl}/api/v1/users/admin/list`, {
      method: 'GET',
      headers: buildForwardHeaders(request),
      cache: 'no-store',
    });

    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      return NextResponse.json(
        { error: payload.message || payload.error || 'Failed to fetch users' },
        { status: response.status }
      );
    }

    // Return with no-cache headers
    return NextResponse.json(
      { users: payload.data?.users || [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
