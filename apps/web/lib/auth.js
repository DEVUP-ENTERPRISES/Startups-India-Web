'use client';

import { apiFetch } from './api';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

let googleSignInInitialized = false;

// --- Auth Functions ---

export async function signIn(email, password) {
  const result = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result.data?.session?.access_token) {
    localStorage.setItem('access_token', result.data.session.access_token);
    if (result.data.session.refresh_token) {
      localStorage.setItem('refresh_token', result.data.session.refresh_token);
    }
  }
  return result;
}

export async function signUp(email, password, fullName) {
  const result = await apiFetch('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
  if (result.data?.session?.access_token) {
    localStorage.setItem('access_token', result.data.session.access_token);
    if (result.data.session.refresh_token) {
      localStorage.setItem('refresh_token', result.data.session.refresh_token);
    }
  }
  return result;
}

// Renders Google's official sign-in button into a DOM element.
// Call this once after mount with a container ref and a callback for the result.
export function initGoogleSignIn(containerElement, onResult) {
  if (!GOOGLE_CLIENT_ID) {
    onResult({ data: null, error: { message: 'Google Client ID is not configured.' } });
    return;
  }
  if (!containerElement) return;

  loadGoogleScript()
    .then(() => {
      if (!googleSignInInitialized) {
        googleSignInInitialized = true;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async response => {
            const result = await apiFetch('/api/v1/auth/oauth/google', {
              method: 'POST',
              body: JSON.stringify({ idToken: response.credential }),
            });
            if (result.data?.session?.access_token) {
              localStorage.setItem('access_token', result.data.session.access_token);
            }
            onResult(result);
          },
          ux_mode: 'popup',
        });
      }

      window.google.accounts.id.renderButton(containerElement, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: containerElement.offsetWidth || 320,
      });
    })
    .catch(() => {
      onResult({ data: null, error: { message: 'Failed to load Google Sign-In.' } });
    });
}

export async function signOut() {
  try {
    await apiFetch('/api/v1/auth/logout', { method: 'POST' });
  } catch {
    // Continue with client-side cleanup regardless
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.clear();
    // Also clear any potential auth cookies just in case
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }
  return { error: null };
}

export async function getCurrentUser() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!token) return { data: null, error: { message: 'Not authenticated' } };
  return apiFetch('/api/v1/auth/me');
}

export async function resendVerificationEmail() {
  return { data: null, error: { message: 'Email verification is not available yet.' } };
}

// --- Internal: load Google Identity Services script ---
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });
}
