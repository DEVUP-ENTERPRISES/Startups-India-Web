'use client';

import { apiFetch } from './api';

/**
 * Startup Grant API client.
 *
 * Note there is no `statusLabels` / `stages` / `fee` constant anywhere in the
 * frontend: all of it comes from getGrantConfig(), which reads the admin's
 * settings. If a label were duplicated here it would silently go stale the first
 * time an admin renamed something.
 */

export async function getGrantConfig() {
  return apiFetch('/api/v1/grants/config');
}

export async function listMyApplications() {
  return apiFetch('/api/v1/grants/applications');
}

export async function getApplication(id) {
  return apiFetch(`/api/v1/grants/applications/${id}`);
}

// Creates a draft, or updates the caller's existing draft in place.
export async function saveDraft({ founder, startup }) {
  return apiFetch('/api/v1/grants/applications', {
    method: 'POST',
    body: JSON.stringify({ founder, startup }),
  });
}

export async function submitApplication(id, termsAccepted) {
  return apiFetch(`/api/v1/grants/applications/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ termsAccepted }),
  });
}

export async function deleteDocument(documentId) {
  return apiFetch(`/api/v1/grants/documents/${documentId}`, { method: 'DELETE' });
}

// Returns a short-lived signed URL - we never hold a permanent link to a deck.
export async function getDocumentUrl(documentId) {
  return apiFetch(`/api/v1/grants/documents/${documentId}/url`);
}

/**
 * Uploads a file straight to S3 with a presigned PUT.
 *
 * The bytes never touch our API. XMLHttpRequest rather than fetch() purely
 * because fetch still cannot report upload progress, and the spec asks for a
 * progress bar.
 *
 * @param {Function} onProgress called with 0..100
 */
export async function uploadDocument({ applicationId, kind, file, onProgress = () => {} }) {
  // 1. Ask our API for a presigned URL. This is where type/size are enforced.
  const { data: presign, error: presignError } = await apiFetch(
    `/api/v1/grants/applications/${applicationId}/documents/upload-url`,
    {
      method: 'POST',
      body: JSON.stringify({
        kind,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    }
  );
  if (presignError) return { data: null, error: presignError };

  // 2. PUT the bytes to S3 directly.
  try {
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presign.uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`Upload failed (${xhr.status})`));
      xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
      xhr.send(file);
    });
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }

  // 3. Tell our API the PUT landed. The server re-checks the object actually
  //    exists before recording it, so a skipped step 2 cannot fake a document.
  return apiFetch(`/api/v1/grants/applications/${applicationId}/documents/complete`, {
    method: 'POST',
    body: JSON.stringify({
      kind,
      key: presign.key,
      fileName: file.name,
      fileType: file.type,
    }),
  });
}

/** Formats a paise integer as ₹ - money is never a float in this codebase. */
export function formatMoney(minorUnits, currency = 'INR') {
  const major = (minorUnits || 0) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(major);
}
