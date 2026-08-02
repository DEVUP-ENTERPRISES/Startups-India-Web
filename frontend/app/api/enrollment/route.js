import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    const { courseId, paymentIntentId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment with Stripe (if payment intent provided)
    let paymentStatus = 'completed'; // Default for free courses
    if (paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
          return NextResponse.json(
            { error: 'Payment not completed' },
            { status: 400 }
          );
        }
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        );
      }
    }

    // Create or update enrollment
    const { data } = await backendRequest(request, '/api/v1/enrollments', {
      method: 'POST',
      body: {
        courseId,
        paymentStatus,
        stripePaymentId: paymentIntentId || null,
      },
    });

    return NextResponse.json({ success: true, data });
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
    const courseId = searchParams.get('courseId');

    const path = courseId
      ? `/api/v1/enrollments?courseId=${encodeURIComponent(courseId)}`
      : '/api/v1/enrollments';
    const { data } = await backendRequest(request, path);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
