const crypto = require('crypto');
const { ApiError } = require('../../utils/apiError');
const {
  generateUploadUrl,
  generateDownloadUrl,
  headObject,
  deleteObject,
  buildS3FileUrl,
} = require('../../utils/s3');
const { GrantApplication, ApplicationDocument } = require('./grant.models');
const { getGrantSettings } = require('./grant.settings');
const { isEditable, STATUS } = require('./grant.status');
const { addTimelineEntry } = require('./grant.service');

/**
 * Document uploads for grant applications.
 *
 * Files go straight from the browser to S3 via a presigned PUT — bytes never
 * transit the API. Mongo only ever holds the object key, and the download URL is
 * signed on demand, so a leaked DB row cannot be turned into permanent public
 * access to a founder's pitch deck.
 */

// Which admin setting governs each document kind, and how many are allowed.
const KIND_RULES = {
  pitch_deck: { typesKey: 'grant.upload.pitchDeckTypes', max: 1 },
  business_plan: { typesKey: 'grant.upload.documentTypes', max: 1 },
  product_image: { typesKey: 'grant.upload.imageTypes', max: 8 },
  demo_video: { typesKey: 'grant.upload.videoTypes', max: 1 },
};

function sanitizeFileName(name) {
  return String(name)
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(-120);
}

/**
 * The application must exist, belong to the caller, and still be open for edits.
 * Both checks live in the query/state, not in a caller's `if` — an upload into
 * someone else's application must be impossible, not merely discouraged.
 */
// Documents can be uploaded in two windows: while the Phase 1 form is still
// editable (draft / changes requested), and during Phase 2 once the idea is
// accepted but the fee hasn't been paid yet (SELECTED / EVALUATION_PENDING) —
// this is where business plans and the pitch deck are actually collected.
const PHASE2_UPLOAD_STATUSES = [STATUS.SELECTED, STATUS.EVALUATION_PENDING];

async function assertOwnedAndEditable(userId, applicationDbId) {
  const application = await GrantApplication.findOne({ _id: applicationDbId, userId });
  if (!application) throw new ApiError(404, 'Application not found');

  const canEdit = isEditable(application.status, application.revisionAllowed)
    || PHASE2_UPLOAD_STATUSES.includes(application.status);
  if (!canEdit) {
    throw new ApiError(409, 'This application is locked and its documents cannot be changed.');
  }
  return application;
}

/**
 * Step 1: hand the browser a short-lived presigned PUT URL.
 * Type and size are validated HERE, against admin settings — the client-side
 * check is UX, this is the enforcement.
 */
async function requestUploadUrl(userId, { applicationDbId, kind, fileName, fileType, fileSize }) {
  const rule = KIND_RULES[kind];
  if (!rule) throw new ApiError(400, `Unknown document type: ${kind}`);

  const application = await assertOwnedAndEditable(userId, applicationDbId);
  const settings = await getGrantSettings();

  const allowedTypes = settings[rule.typesKey];
  if (!allowedTypes.includes(fileType)) {
    throw new ApiError(400, `${fileType} is not an accepted file type for this upload.`);
  }

  const maxBytes = settings['grant.upload.maxSizeMb'] * 1024 * 1024;
  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new ApiError(400, 'Invalid file size.');
  }
  if (fileSize > maxBytes) {
    throw new ApiError(
      400,
      `File is too large. The maximum is ${settings['grant.upload.maxSizeMb']} MB.`
    );
  }

  const existing = await ApplicationDocument.countDocuments({
    applicationId: application._id,
    kind,
  });
  if (existing >= rule.max) {
    throw new ApiError(
      409,
      rule.max === 1
        ? 'A file of this type is already uploaded. Remove it first.'
        : `You may upload at most ${rule.max} files of this type.`
    );
  }

  // Key namespaced by application, with random entropy so two files of the same
  // name can't collide or be guessed.
  const key = `grants/${application.applicationId}/${kind}/${crypto
    .randomBytes(8)
    .toString('hex')}-${sanitizeFileName(fileName)}`;

  // generateUploadUrl returns { uploadUrl, fileUrl, key, expiresIn } — it is NOT
  // the URL string itself. Passing the object straight through made the browser
  // PUT to "[object Object]", a relative path, which 404'd against the Next server.
  const presigned = await generateUploadUrl({
    key,
    contentType: fileType,
    expiresIn: 300,
  });

  return { uploadUrl: presigned.uploadUrl, key: presigned.key, expiresIn: presigned.expiresIn };
}

/**
 * Step 2: the browser confirms the PUT succeeded.
 *
 * We re-HEAD the object rather than trusting the client. Otherwise a caller could
 * skip the upload entirely and POST a made-up key, producing an application whose
 * "pitch deck" is a 404 — and reviewers would only find out at review time.
 */
async function completeUpload(userId, { applicationDbId, kind, key, fileName, fileType }) {
  const rule = KIND_RULES[kind];
  if (!rule) throw new ApiError(400, `Unknown document type: ${kind}`);

  const application = await assertOwnedAndEditable(userId, applicationDbId);

  // The key must live under this application's prefix — otherwise a user could
  // attach another founder's already-uploaded file to their own application.
  const expectedPrefix = `grants/${application.applicationId}/${kind}/`;
  if (!String(key).startsWith(expectedPrefix)) {
    throw new ApiError(400, 'Upload key does not belong to this application.');
  }

  let head;
  try {
    head = await headObject(key);
  } catch {
    throw new ApiError(502, 'Upload could not be verified. Please try again.');
  }

  const settings = await getGrantSettings();
  const maxBytes = settings['grant.upload.maxSizeMb'] * 1024 * 1024;
  const size = head?.ContentLength ?? 0;

  // Re-check the real size: the presign was issued against a client-claimed size,
  // and S3 will happily accept a larger body than the one the client promised.
  if (size > maxBytes) {
    await deleteObject(key).catch(() => {});
    throw new ApiError(
      400,
      `File is too large. The maximum is ${settings['grant.upload.maxSizeMb']} MB.`
    );
  }

  const document = await ApplicationDocument.create({
    applicationId: application._id,
    userId,
    kind,
    fileName: sanitizeFileName(fileName),
    fileType,
    fileSize: size,
    key,
    url: buildS3FileUrl(key),
  });

  await addTimelineEntry({
    applicationId: application._id,
    event: 'document_uploaded',
    message: `Uploaded ${kind.replace(/_/g, ' ')}.`,
    actorId: userId,
    actorRole: 'student',
    metadata: { kind, fileName: document.fileName },
  });

  return document;
}

/** Signed, expiring URL. Used by both the owner and admins to view/download. */
async function getSignedUrl({ documentId, userId = null, isAdmin = false }) {
  const document = await ApplicationDocument.findById(documentId);
  if (!document) throw new ApiError(404, 'Document not found');

  if (!isAdmin) {
    // Ownership is checked against the application, not the document's userId
    // alone — they should agree, but the application is the authority.
    const owns = await GrantApplication.exists({
      _id: document.applicationId,
      userId,
    });
    if (!owns) throw new ApiError(404, 'Document not found');
  }

  const url = await generateDownloadUrl(document.key, 300);
  return { url, fileName: document.fileName, fileType: document.fileType };
}

async function deleteDocument(userId, documentId) {
  const document = await ApplicationDocument.findById(documentId);
  if (!document) throw new ApiError(404, 'Document not found');

  const application = await assertOwnedAndEditable(userId, document.applicationId);

  await deleteObject(document.key).catch(() => {});
  await ApplicationDocument.deleteOne({ _id: document._id });

  await addTimelineEntry({
    applicationId: application._id,
    event: 'document_removed',
    message: `Removed ${document.kind.replace(/_/g, ' ')}.`,
    actorId: userId,
    actorRole: 'student',
  });

  return { deleted: true };
}

module.exports = {
  KIND_RULES,
  requestUploadUrl,
  completeUpload,
  getSignedUrl,
  deleteDocument,
};
