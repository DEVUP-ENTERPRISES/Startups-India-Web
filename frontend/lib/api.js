'use client';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

if (typeof window !== 'undefined' && !API_BASE.startsWith('http')) {
  console.error(
    '[api.js] NEXT_PUBLIC_API_BASE_URL is not set or invalid. All API calls will fail.'
  );
}

const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';

function resolveAdminPath(path) {
  if (path.startsWith('/api/v1/admin')) {
    return path.replace('/api/v1/admin', `/api/v1/${ADMIN_SLUG}`);
  }
  return path;
}

// ── In-memory token store ─────────────────────────────────────────────────────
// The access token lives here (NOT in localStorage) so it's inaccessible to XSS.
// sessionStorage is used to survive page navigations within the same tab - it's
// cleared when the tab/browser closes, unlike localStorage.
// On module init, seed from sessionStorage if present (handles page refresh).
let _memToken = (typeof window !== 'undefined' && sessionStorage.getItem('_at')) || null;

export function setMemToken(token) {
  _memToken = token || null;
  if (typeof window !== 'undefined') {
    if (token) sessionStorage.setItem('_at', token);
    else sessionStorage.removeItem('_at');
  }
}
export function clearMemToken() {
  setMemToken(null);
}
export function getMemToken() {
  return _memToken;
}

// ── Auth signal ──────────────────────────────────────────────────────────────
// localStorage stores ONLY a presence flag - not a usable secret.
// The real auth is the httpOnly accessToken cookie sent automatically by the
// browser on every cross-origin request via credentials: 'include'.
// If an attacker steals this flag via XSS, they get nothing useful - they
// cannot call the API without the httpOnly cookie, which JS can never read.
export function isLoggedIn() {
  return typeof window !== 'undefined' && !!localStorage.getItem('auth_user_id');
}

export function setLoggedInFlag(userId) {
  if (typeof window !== 'undefined') localStorage.setItem('auth_user_id', String(userId || '1'));
}

export function clearLoggedInFlag() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('_at');
    _memToken = null;
  }
}

let _refreshing = null;

async function tryRefresh() {
  if (_refreshing) return _refreshing;
  _refreshing = (async () => {
    try {
      // The httpOnly refreshToken cookie is sent automatically - no need to
      // read it from localStorage. Send an empty body so the backend falls
      // back to reading the cookie (it already supports both paths).
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        credentials: 'include',
      });

      let json;
      try {
        json = await res.json();
      } catch {
        return false;
      }

      if (res.ok && json.data?.session?.access_token) {
        setMemToken(json.data.session.access_token);
        setLoggedInFlag(json.data.user?.id || '1');
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      _refreshing = null;
    }
  })();
  return _refreshing;
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  clearLoggedInFlag();
  const isAdminPage =
    window.location.pathname.startsWith(`/${ADMIN_SLUG}`) ||
    window.location.pathname.startsWith('/admin');
  window.location.href = isAdminPage ? `/${ADMIN_SLUG}/login` : '/login';
}

// One place decides what users read when something fails: calm, actionable, never blaming them.
const FRIENDLY = {
  network: "We couldn't reach Startups India. Please check your internet connection and try again.",
  server: 'Something went wrong on our side. Please try again in a moment.',
  maintenance: "We're making a quick update. Please try again in a minute.",
  rateLimited: 'Too many attempts in a short time. Please wait a moment and try again.',
  invalidInput: 'Please check the details you entered and try again.',
  signIn: 'Please sign in to continue.',
};

const TECHNICAL_MESSAGES =
  /invalid request body|request failed|cast to objectid|validation failed|internal server error|unexpected token|econn|timeout|failed to fetch/i;

export function friendlyErrorMessage(status, serverMessage) {
  if (!status) return FRIENDLY.network;
  if (status === 503) return FRIENDLY.maintenance;
  if (status >= 500) return FRIENDLY.server;
  if (status === 429) return FRIENDLY.rateLimited;
  if (status === 401 && !serverMessage) return FRIENDLY.signIn;
  if (!serverMessage || TECHNICAL_MESSAGES.test(serverMessage)) {
    return status === 400 || status === 422 ? FRIENDLY.invalidInput : FRIENDLY.server;
  }
  return serverMessage;
}

const RETRYABLE_STATUS = new Set([502, 503, 504]);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// GETs are safe to repeat, so a brief network blip or gateway restart is retried before the user sees anything.
async function fetchWithRetry(url, init) {
  const method = String(init.method || 'GET').toUpperCase();
  const attempts = method === 'GET' ? 3 : 1;
  for (let attempt = 1; ; attempt += 1) {
    try {
      const res = await fetch(url, init);
      if (attempt < attempts && RETRYABLE_STATUS.has(res.status)) {
        await sleep(attempt * 800);
        continue;
      }
      return res;
    } catch (err) {
      if (attempt >= attempts) throw err;
      await sleep(attempt * 800);
    }
  }
}

export async function apiFetch(path, options = {}) {
  const token = _memToken; // in-memory only - never localStorage
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const resolvedPath = resolveAdminPath(path);

  let res;
  try {
    res = await fetchWithRetry(`${API_BASE}${resolvedPath}`, {
      ...options,
      headers,
      // httpOnly cookie is sent automatically - this is the actual auth mechanism
      credentials: 'include',
    });
  } catch {
    return { data: null, error: { message: FRIENDLY.network, status: 0 } };
  }

  // Auth endpoints (login, register, etc.) return 401 for bad credentials -
  // never attempt a token refresh for these paths, just surface the real error.
  const isAuthEndpoint = resolvedPath.includes('/auth/');

  // Auto-refresh on 401 and retry once (only for non-auth endpoints)
  if (res.status === 401 && !isAuthEndpoint && !options._retried) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      try {
        res = await fetchWithRetry(`${API_BASE}${resolvedPath}`, {
          ...options,
          _retried: true,
          headers,
          credentials: 'include',
        });
      } catch {
        return { data: null, error: { message: FRIENDLY.network, status: 0 } };
      }
    } else {
      redirectToLogin();
      return { data: null, error: { message: FRIENDLY.signIn, status: 401 } };
    }
  } else if (res.status === 401 && !isAuthEndpoint) {
    redirectToLogin();
    return { data: null, error: { message: FRIENDLY.signIn, status: 401 } };
  }

  try {
    const json = await res.json();
    if (!res.ok) {
      return {
        data: null,
        error: {
          message: friendlyErrorMessage(res.status, json.message || json.error),
          status: res.status,
          reference: json.reference,
        },
      };
    }
    return { data: json.data !== undefined ? json.data : json, error: null };
  } catch {
    return {
      data: null,
      error: {
        message: friendlyErrorMessage(res.status >= 400 ? res.status : 500),
        status: res.status,
      },
    };
  }
}

export async function apiGet(path) {
  return apiFetch(path);
}
export async function apiPost(path, body) {
  return apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
}
export async function apiPatch(path, body) {
  return apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) });
}
export async function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}
