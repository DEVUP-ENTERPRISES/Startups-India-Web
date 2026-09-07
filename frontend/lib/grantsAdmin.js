'use client';

import { apiFetch } from './api';

/**
 * Admin-side Startup Grant client.
 *
 * Paths are written as /api/v1/admin/... and apiFetch rewrites them to the
 * secret slug (see resolveAdminPath in lib/api.js) - the literal string
 * '/api/v1/admin' never goes over the wire.
 */

const BASE = '/api/v1/admin/grants';

// PAGE navigation must use the secret slug, not '/admin/...'. The middleware
// serves the admin panel at /{ADMIN_SLUG}/* and returns a hard 404 for any
// literal /admin/* path - so an in-app <Link href="/admin/grants"> would 404.
// (apiFetch already rewrites API paths; this is only for page links.)
const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';
export const adminUrl = path => `/${ADMIN_SLUG}${path}`;

export async function getGrantStats() {
  return apiFetch(`${BASE}/stats`);
}

export async function listGrantApplications(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  ).toString();
  return apiFetch(`${BASE}/applications${qs ? `?${qs}` : ''}`);
}

export async function getGrantApplication(id) {
  return apiFetch(`${BASE}/applications/${id}`);
}

// Drives which action buttons are legal in the current state - the UI never
// hardcodes its own copy of the lifecycle.
export async function getStatusMachine() {
  return apiFetch(`${BASE}/status-machine`);
}

export async function changeStatus(id, { status, reason = '', notify = true }) {
  return apiFetch(`${BASE}/applications/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status, reason, notify }),
  });
}

export async function assignReviewer(id, reviewerId) {
  return apiFetch(`${BASE}/applications/${id}/reviewer`, {
    method: 'POST',
    body: JSON.stringify({ reviewerId }),
  });
}

export async function addComment(id, { comment, visibleToStudent = false }) {
  return apiFetch(`${BASE}/applications/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment, visibleToStudent }),
  });
}

export async function saveInternalNotes(id, notes) {
  return apiFetch(`${BASE}/applications/${id}/internal-notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  });
}

export async function setRevisionAllowed(id, allowed) {
  return apiFetch(`${BASE}/applications/${id}/revision`, {
    method: 'POST',
    body: JSON.stringify({ allowed }),
  });
}

export async function getAdminDocumentUrl(documentId) {
  return apiFetch(`${BASE}/documents/${documentId}/url`);
}

// ─── Scoring ───────────────────────────────────────────────────────────
export async function submitScore(applicationId, { score, feedback = '' }) {
  return apiFetch(`${BASE}/applications/${applicationId}/score`, {
    method: 'POST',
    body: JSON.stringify({ score, feedback }),
  });
}

// ─── Report PDF upload ───────────────────────────────────────────────────
// Uploads the evaluation report PDF straight to S3 via a presigned URL, then
// attaches the resulting key to the application's evaluation. The student can
// download it once they book a 1:1 slot.
export async function uploadReportPdf(applicationId, file) {
  if (!file) return { data: null, error: { message: 'No file selected.' } };
  if (file.type !== 'application/pdf') {
    return { data: null, error: { message: 'The report must be a PDF.' } };
  }

  // 1. Presigned PUT URL.
  const { data: presign, error: presignErr } = await apiFetch(
    `${BASE}/applications/${applicationId}/report-file/upload-url`,
    {
      method: 'POST',
      body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size }),
    }
  );
  if (presignErr) return { data: null, error: presignErr };

  // 2. PUT the bytes to S3.
  try {
    const putRes = await fetch(presign.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error(`Upload failed (${putRes.status}).`);
  } catch (err) {
    return { data: null, error: { message: err.message || 'Upload to storage failed.' } };
  }

  // 3. Attach the key to the evaluation.
  return apiFetch(`${BASE}/applications/${applicationId}/report-file`, {
    method: 'POST',
    body: JSON.stringify({ fileKey: presign.key }),
  });
}

// ─── Evaluations ───────────────────────────────────────────────────────
export async function listEvaluations(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  ).toString();
  return apiFetch(`${BASE}/evaluations${qs ? `?${qs}` : ''}`);
}

export async function getEvaluation(applicationId) {
  return apiFetch(`${BASE}/applications/${applicationId}/evaluation`);
}

export async function scheduleMeeting(applicationId, payload) {
  return apiFetch(`${BASE}/applications/${applicationId}/evaluation/schedule`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitEvaluationResult(applicationId, payload) {
  return apiFetch(`${BASE}/applications/${applicationId}/evaluation/result`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Slot Management ───────────────────────────────────────────────────
export async function getAdminSlots(date) {
  return apiFetch(`${BASE}/slots?date=${date}`);
}

export async function setSlotBlocked({ date, times, blocked }) {
  return apiFetch(`${BASE}/slots`, {
    method: 'PATCH',
    body: JSON.stringify({ date, times, blocked }),
  });
}

export async function getSlotBookings({ page, limit } = {}) {
  const qs = new URLSearchParams(
    Object.entries({ page, limit }).filter(([, v]) => v !== undefined && v !== null)
  ).toString();
  return apiFetch(`${BASE}/slots/bookings${qs ? `?${qs}` : ''}`);
}

// ─── Settings ──────────────────────────────────────────────────────────
export async function getGrantSettings() {
  return apiFetch(`${BASE}/settings`);
}

export async function updateGrantSettings(patch) {
  return apiFetch(`${BASE}/settings`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}
