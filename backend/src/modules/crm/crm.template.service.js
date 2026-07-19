const { ApiError } = require('../../utils/apiError');
const { EmailTemplate } = require('./crm.models');

/**
 * Email templates + merge-tag rendering.
 *
 * Tags are {{field}} where field is one of the merge fields below. Rendering is
 * a plain, safe substitution — no template engine, no eval — so a template can
 * never execute code, only fill in a contact's fields.
 */
const MERGE_FIELDS = ['name', 'email', 'phone', 'collegeName', 'additional1', 'additional2', 'additional3'];

// Escapes a contact's value before it goes into the HTML body. Contact data is
// admin-imported, but a name like "A <b>" should render as text, not markup.
function escapeHtml(v = '') {
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Replace {{tag}} occurrences with the contact's values.
 * Unknown tags and missing values collapse to '' so a half-filled row never
 * leaves a literal "{{collegeName}}" in someone's inbox.
 */
function render(text, contact, { escape = true } = {}) {
  if (!text) return '';
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, tag) => {
    if (!MERGE_FIELDS.includes(tag)) return '';
    const val = contact?.[tag] ?? '';
    return escape ? escapeHtml(val) : String(val);
  });
}

// ─── CRUD ───────────────────────────────────────────────────────────────
async function listTemplates() {
  return EmailTemplate.find({}).sort({ updatedAt: -1 }).lean();
}

async function getTemplate(id) {
  const tpl = await EmailTemplate.findById(id).lean();
  if (!tpl) throw new ApiError(404, 'Template not found');
  return tpl;
}

async function createTemplate({ name, subject, htmlBody, createdBy }) {
  if (!name?.trim() || !subject?.trim() || !htmlBody?.trim()) {
    throw new ApiError(400, 'Name, subject and body are all required.');
  }
  return EmailTemplate.create({ name: name.trim(), subject: subject.trim(), htmlBody, createdBy });
}

async function updateTemplate(id, { name, subject, htmlBody }) {
  const patch = {};
  if (name !== undefined) patch.name = name.trim();
  if (subject !== undefined) patch.subject = subject.trim();
  if (htmlBody !== undefined) patch.htmlBody = htmlBody;
  const tpl = await EmailTemplate.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!tpl) throw new ApiError(404, 'Template not found');
  return tpl;
}

async function deleteTemplate(id) {
  const tpl = await EmailTemplate.findByIdAndDelete(id);
  if (!tpl) throw new ApiError(404, 'Template not found');
  return { deleted: true };
}

/** Render a template against a sample contact for the preview pane. */
function preview(template, sampleContact) {
  const contact = sampleContact || {
    name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210',
    collegeName: 'IIT Delhi', additional1: 'Sample 1', additional2: 'Sample 2', additional3: 'Sample 3',
  };
  return {
    subject: render(template.subject, contact, { escape: false }),
    html: render(template.htmlBody, contact),
  };
}

module.exports = {
  MERGE_FIELDS,
  render,
  listTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  preview,
};
