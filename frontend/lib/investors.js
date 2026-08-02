'use client';

import { apiFetch } from './api';

/**
 * Investor client - mirror of lib/mentors.js. Self-service endpoints are behind
 * requireRole('investor','admin') and scoped to the caller; apply + photo are
 * public (the applicant has no account yet).
 */

export async function getInvestorDashboard() {
  return apiFetch('/api/v1/investors/me/dashboard');
}

export async function getInvestorProfile() {
  return apiFetch('/api/v1/investors/me/profile');
}

export async function updateInvestorProfile(patch) {
  return apiFetch('/api/v1/investors/me/profile', { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function listPublicInvestors() {
  return apiFetch('/api/v1/profiles/investors');
}

export async function applyAsInvestor(payload) {
  return apiFetch('/api/v1/investors/apply', { method: 'POST', body: JSON.stringify(payload) });
}

/** Uploads the applicant's photo to S3 via a presigned URL; returns the public URL. */
export async function uploadInvestorPhoto(file, onProgress = () => {}) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { data: null, error: { message: 'Please choose a JPG, PNG or WebP image.' } };
  }
  const { data: presign, error } = await apiFetch('/api/v1/investors/application-photo-url', {
    method: 'POST',
    body: JSON.stringify({ fileType: file.type, fileName: file.name }),
  });
  if (error) return { data: null, error };

  try {
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presign.uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
      xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'));
      xhr.send(file);
    });
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
  return { data: { fileUrl: presign.fileUrl }, error: null };
}
