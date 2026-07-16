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
