'use client';

import { apiFetch } from './api';

// CRM admin client. Paths use /api/v1/crm/* (admin-gated on the server); the
// public tracking/unsubscribe endpoints are hit by email clients, not from here.

// ── Lead lists ──
export const listLeadLists = () => apiFetch('/api/v1/crm/lists');
export const getLeadList = (id, page = 1) => apiFetch(`/api/v1/crm/lists/${id}?page=${page}`);
export const suggestMapping = headers =>
  apiFetch('/api/v1/crm/lists/suggest-mapping', { method: 'POST', body: JSON.stringify({ headers }) });
export const createLeadList = payload =>
  apiFetch('/api/v1/crm/lists', { method: 'POST', body: JSON.stringify(payload) });
export const deleteLeadList = id => apiFetch(`/api/v1/crm/lists/${id}`, { method: 'DELETE' });

// ── Templates ──
export const listTemplates = () => apiFetch('/api/v1/crm/templates');
export const createTemplate = payload =>
  apiFetch('/api/v1/crm/templates', { method: 'POST', body: JSON.stringify(payload) });
export const updateTemplate = (id, payload) =>
  apiFetch(`/api/v1/crm/templates/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteTemplate = id => apiFetch(`/api/v1/crm/templates/${id}`, { method: 'DELETE' });
export const previewTemplate = (subject, htmlBody) =>
  apiFetch('/api/v1/crm/templates/preview', { method: 'POST', body: JSON.stringify({ subject, htmlBody }) });
export const seedDefaultTemplates = () =>
  apiFetch('/api/v1/crm/templates/seed-defaults', { method: 'POST' });

// ── Campaigns ──
export const listCampaigns = () => apiFetch('/api/v1/crm/campaigns');
export const getCampaign = id => apiFetch(`/api/v1/crm/campaigns/${id}`);
export const createCampaign = payload =>
  apiFetch('/api/v1/crm/campaigns', { method: 'POST', body: JSON.stringify(payload) });
export const startCampaign = id => apiFetch(`/api/v1/crm/campaigns/${id}/start`, { method: 'POST' });
export const pauseCampaign = id => apiFetch(`/api/v1/crm/campaigns/${id}/pause`, { method: 'POST' });
export const cancelCampaign = id => apiFetch(`/api/v1/crm/campaigns/${id}/cancel`, { method: 'POST' });

// The merge fields a template can use — kept in sync with the backend.
export const MERGE_FIELDS = ['name', 'email', 'phone', 'collegeName', 'additional1', 'additional2', 'additional3'];

/**
 * Parse an .xlsx/.csv File in the browser into { headers, rows }.
 * Done client-side so the raw file never has to be uploaded — only the rows
 * (already mapped) are POSTed when the admin confirms.
 */
export async function parseSpreadsheetFile(file) {
  const XLSX = await import('xlsx');
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error('The file has no sheets.');
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  if (rows.length === 0) throw new Error('The file has no rows.');
  return { headers: Object.keys(rows[0]), rows };
}
