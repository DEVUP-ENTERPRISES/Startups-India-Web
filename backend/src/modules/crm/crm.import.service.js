const { ApiError } = require('../../utils/apiError');
const { LeadList, LeadContact } = require('./crm.models');

/**
 * Spreadsheet import for lead lists.
 *
 * The browser parses the file (frontend/lib/crm.js) and posts mapped rows;
 * createListFromRows() maps columns to fields, dedupes and saves the list.
 */

// Fields a spreadsheet column can map onto. email is the only required one.
const MAPPABLE_FIELDS = [
  'name', 'email', 'phone', 'collegeName', 'additional1', 'additional2', 'additional3',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Suggest a column->field mapping by fuzzy-matching header names, so the admin
 * usually just confirms rather than mapping every column by hand.
 */
function suggestMapping(headers) {
  const norm = h => String(h).toLowerCase().replace(/[^a-z0-9]/g, '');
  const rules = [
    { field: 'email', hints: ['email', 'emailid', 'mail', 'emailaddress'] },
    { field: 'name', hints: ['name', 'username', 'fullname', 'studentname'] },
    { field: 'phone', hints: ['phone', 'number', 'mobile', 'contact', 'phoneno'] },
    { field: 'collegeName', hints: ['college', 'collegename', 'institution', 'university'] },
  ];
  const mapping = {};
  for (const h of headers) {
    const n = norm(h);
    for (const rule of rules) {
      if (mapping[rule.field]) continue;
      if (rule.hints.some(hint => n === hint || n.includes(hint))) {
        mapping[rule.field] = h;
        break;
      }
    }
  }
  return mapping;
}

/**
 * Build LeadContacts from rows + a mapping and save them under a new list.
 *
 * @param {object} opts
 * @param {string} opts.name         list name
 * @param {string} [opts.description]
 * @param {string} [opts.sourceFileName]
 * @param {object} opts.mapping      { field: headerName }  (must include email)
 * @param {object[]} opts.rows       parsed rows
 * @param {ObjectId} opts.createdBy
 */
async function createListFromRows({ name, description, sourceFileName, mapping, rows, createdBy }) {
  if (!name || !name.trim()) throw new ApiError(400, 'Please give the list a name.');
  if (!mapping || !mapping.email) throw new ApiError(400, 'You must map a column to Email.');

  // Validate mapping keys.
  for (const field of Object.keys(mapping)) {
    if (!MAPPABLE_FIELDS.includes(field)) {
      throw new ApiError(400, `Unknown field in mapping: ${field}`);
    }
  }

  const pick = (row, field) => {
    const header = mapping[field];
    return header ? String(row[header] ?? '').trim() : '';
  };

  // De-dupe within the file by email, keeping the first occurrence, and drop
  // rows without a valid email.
  const seen = new Set();
  const contacts = [];
  let invalid = 0;
  for (const row of rows) {
    const email = pick(row, 'email').toLowerCase();
    if (!EMAIL_RE.test(email)) { invalid += 1; continue; }
    if (seen.has(email)) continue;
    seen.add(email);
    contacts.push({
      name: pick(row, 'name'),
      email,
      phone: pick(row, 'phone'),
      collegeName: pick(row, 'collegeName'),
      additional1: pick(row, 'additional1'),
      additional2: pick(row, 'additional2'),
      additional3: pick(row, 'additional3'),
    });
  }

  if (contacts.length === 0) {
    throw new ApiError(400, 'No rows with a valid email address were found.');
  }

  const list = await LeadList.create({
    name: name.trim(),
    description: description || '',
    sourceFileName: sourceFileName || null,
    columnMapping: mapping,
    contactCount: contacts.length,
    createdBy,
  });

  // insertMany with the list id; ordered:false so one bad row doesn't abort all.
  const docs = contacts.map(c => ({ ...c, listId: list._id }));
  await LeadContact.insertMany(docs, { ordered: false }).catch(() => {});

  return {
    list,
    imported: contacts.length,
    duplicatesInFile: seen.size - contacts.length + (rows.length - invalid - contacts.length),
    invalidEmails: invalid,
  };
}

module.exports = {
  MAPPABLE_FIELDS,
  suggestMapping,
  createListFromRows,
};
