'use client';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

// Transparently rewrite /api/v1/admin/* → /api/v1/{slug}/* so no admin page
// needs updating. The literal string '/api/v1/admin' is never sent to the server.
const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';
function resolveAdminPath(path) {
  if (path.startsWith('/api/v1/admin')) {
    return path.replace('/api/v1/admin', `/api/v1/${ADMIN_SLUG}`);
  }
  return path;
}

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
}

let _refreshing = null;

async function tryRefresh() {
  if (_refreshing) return _refreshing;
  _refreshing = (async () => {
    try {
      const rt = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (!rt) return false;
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: rt }),
        credentials: 'include',
      });
      
      let json;
      try {
        json = await res.json();
      } catch (err) {
        return false;
      }

      if (res.ok && json.data?.session?.access_token) {
        localStorage.setItem('access_token', json.data.session.access_token);
        if (json.data.session.refresh_token) {
          localStorage.setItem('refresh_token', json.data.session.refresh_token);
        }
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

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const resolvedPath = resolveAdminPath(path);

  let res;
  try {
    res = await fetch(`${API_BASE}${resolvedPath}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (err) {
    return { data: null, error: { message: 'Network error — server may be down', status: 0 } };
  }

  // Auto-refresh on 401 and retry once
  if (res.status === 401 && !options._retried) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = getToken();
      const retryHeaders = {
        ...headers,
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
      };
      try {
        res = await fetch(`${API_BASE}${resolvedPath}`, {
          ...options,
          _retried: true,
          headers: retryHeaders,
          credentials: 'include',
        });
      } catch (err) {
        return { data: null, error: { message: 'Network error — server may be down', status: 0 } };
      }
    } else {
      // Refresh failed, user is definitely logged out. Clear tokens.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  } else if (res.status === 401) {
    // If it's still 401 after retry or _retried was already true
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  try {
    const json = await res.json();
    if (!res.ok) {
      return {
        data: null,
        error: { message: json.message || json.error || 'Request failed', status: res.status },
      };
    }
    return { data: json.data !== undefined ? json.data : json, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Invalid response from server', status: res.status } };
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
