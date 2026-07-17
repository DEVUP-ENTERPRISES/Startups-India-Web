'use client';

import { apiFetch } from './api';

/**
 * Mentor self-service API client.
 *
 * These endpoints are all behind authRequired + requireRole('mentor','admin'),
 * so they only ever return the CALLING mentor's own data — there is no mentorId
 * parameter to tamper with.
 */

export async function getMentorDashboard() {
  return apiFetch('/api/v1/mentors/me/dashboard');
}

export async function getMentorProfile() {
  return apiFetch('/api/v1/mentors/me/profile');
}

export async function updateMentorProfile(patch) {
  return apiFetch('/api/v1/mentors/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function getMentorRequests() {
  return apiFetch('/api/v1/mentors/me/requests');
}

// ─── Public application flow (no auth — applicant has no account yet) ────

// The public list of approved, active mentors shown on /mentors.
export async function listPublicMentors() {
  return apiFetch('/api/v1/profiles/mentors');
}

export async function applyAsMentor(payload) {
  return apiFetch('/api/v1/mentors/apply', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Uploads the applicant's profile photo directly to S3 via a presigned URL and
 * returns the public image URL to submit with the application. Bytes never touch
 * our API. XHR (not fetch) so we can report progress.
 */
export async function uploadMentorPhoto(file, onProgress = () => {}) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { data: null, error: { message: 'Please choose a JPG, PNG or WebP image.' } };
  }

  const { data: presign, error } = await apiFetch('/api/v1/mentors/application-photo-url', {
    method: 'POST',
    body: JSON.stringify({ fileType: file.type, fileName: file.name }),
  });
  if (error) return { data: null, error };

  try {
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presign.uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`));
      xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
      xhr.send(file);
    });
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }

  return { data: { fileUrl: presign.fileUrl }, error: null };
}
