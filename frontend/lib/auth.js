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
    window.dispatchEvent(new CustomEvent('user:login'));
  }
  return result;
}

// Takes an object. The signup page has always CALLED it that way, but the old
// signature was positional - so `email` received the whole object and the API got
// {"email":{...}}, which zod rejected. Signup was broken; this is the fix.
export async function signUp({ email, password, fullName, phone }) {
  const result = await apiFetch('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, ...(phone ? { phone } : {}) }),
  });
  if (result.data?.session?.access_token) {
    localStorage.setItem('access_token', result.data.session.access_token);
    if (result.data.session.refresh_token) {
      localStorage.setItem('refresh_token', result.data.session.refresh_token);
    }
    window.dispatchEvent(new CustomEvent('user:login'));
  }
  return result;
}

// --- Two-factor (SMS OTP) ---
//
// signIn() returns data.two_factor_required === true (and NO session) when the
// account has 2FA on. The caller must then collect the SMS code and call
// verifyTwoFactor() with the pending token to get an actual session.

function storeSession(result) {
  if (result.data?.session?.access_token) {
    localStorage.setItem('access_token', result.data.session.access_token);
    if (result.data.session.refresh_token) {
      localStorage.setItem('refresh_token', result.data.session.refresh_token);
    }
  }
  return result;
}

export async function verifyTwoFactor(pendingToken, code) {
  return storeSession(
    await apiFetch('/api/v1/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ pendingToken, code }),
    })
  );
}

export async function resendTwoFactorCode(pendingToken) {
  return apiFetch('/api/v1/auth/2fa/resend', {
    method: 'POST',
    body: JSON.stringify({ pendingToken }),
  });
}

// Lost phone: sign in with a one-time recovery code instead of an SMS.
export async function verifyBackupCode(pendingToken, backupCode) {
  return storeSession(
    await apiFetch('/api/v1/auth/2fa/recovery', {
      method: 'POST',
      body: JSON.stringify({ pendingToken, backupCode }),
    })
  );
}

// --- Phone verification + 2FA management (authenticated) ---

export async function sendPhoneOtp(phone) {
  return apiFetch('/api/v1/auth/phone/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function verifyPhoneOtp(code) {
  return apiFetch('/api/v1/auth/phone/verify', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

// Returns backup_codes - the only time they are ever visible. Show them once.
export async function enableTwoFactor() {
  return apiFetch('/api/v1/auth/2fa/enable', { method: 'POST' });
}

export async function disableTwoFactor(password) {
  return apiFetch('/api/v1/auth/2fa/disable', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function regenerateBackupCodes(password) {
  return apiFetch('/api/v1/auth/2fa/backup-codes', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

// Requests a reset link. Resolves successfully whether or not the address is
// registered - the API deliberately gives no signal either way, so the UI must
// not branch on it.
export async function requestPasswordReset(email) {
  return apiFetch('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Consumes a reset token. Does NOT sign the user in - they re-authenticate with
// the new password, which confirms the change actually landed.
export async function resetPassword(token, password) {
  return apiFetch('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
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
              window.dispatchEvent(new CustomEvent('user:login'));
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
    localStorage.removeItem('fcm_device_token');   // force re-registration on next login
    localStorage.removeItem('fcm_permission_asked_at');
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
