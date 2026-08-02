import { NextResponse } from 'next/server';
const backendBaseUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function buildForwardHeaders(request) {
  const headers = { 'Content-Type': 'application/json' };
  const auth = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');
  if (auth) headers.Authorization = auth;
  if (cookie) headers.Cookie = cookie;
  return headers;
}

async function backendRequest(request, path, options = {}) {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      ...buildForwardHeaders(request),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  const json = await response.json();
  if (!response.ok || json.success === false) {
    const error = new Error(json.message || json.error || 'Backend request failed');
    error.status = response.status;
    throw error;
  }
  return json;
}

export async function POST(request) {
  try {
    const { responses } = await request.json();

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await backendRequest(request, '/api/v1/learning/quiz', {
      method: 'POST',
      body: { responses },
    });

    return NextResponse.json({
      ...result,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      );
    }

    const data = await backendRequest(request, `/api/v1/learning/quiz?videoId=${encodeURIComponent(videoId)}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
