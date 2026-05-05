const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const { ApiError } = require('../../utils/apiError');
const { Media } = require('./media.model');
const {
  buildS3FileUrl,
  deleteObject,
  extractS3Key,
  generateDownloadUrl,
  generateUploadUrl,
  headObject,
} = require('../../utils/s3');
const { cacheGet, cacheSet, cacheDel } = require('../../infrastructure/cache/redis');
const { listEnrollments } = require('../enrollments/enrollments.service');
const { logActivity } = require('../../utils/activityLogger');
const { logger } = require('../../infrastructure/observability/logger');
const { Course, Module } = require('../courses/course.model');

const MB = 1024 * 1024;
const UPLOAD_URL_EXPIRY_SECONDS = 300;
const DOWNLOAD_URL_EXPIRY_SECONDS = 3600;

const MEDIA_RULES = {
  videos: {
    maxSize: 200 * MB,
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-matroska',
      'application/octet-stream',
    ],
  },
  pdfs: {
    maxSize: 25 * MB,
    mimeTypes: ['application/pdf'],
  },
  images: {
    maxSize: 10 * MB,
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  certificates: {
    maxSize: 25 * MB,
    mimeTypes: ['application/pdf'],
  },
  articles: {
    maxSize: 10 * MB,
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  events: {
    maxSize: 10 * MB,
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  system: {
    maxSize: 10 * MB,
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  }
};

function normalizeFolder(folder) {
  const normalized = String(folder || '')
    .trim()
    .toLowerCase();

  if (!MEDIA_RULES[normalized]) {
    throw new ApiError(400, 'Invalid folder. Allowed: videos, pdfs, images, certificates, articles, events, system');
  }

  return normalized;
}

function sanitizeFileName(fileName) {
  const baseName = path.basename(fileName || '');
  const sanitized = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');

  if (!sanitized) {
    throw new ApiError(400, 'Invalid fileName');
  }

  return sanitized.slice(0, 180);
}

function validateFileAgainstFolder(folder, fileType, fileSize) {
  const rule = MEDIA_RULES[folder];

  if (!rule.mimeTypes.includes(fileType)) {
    throw new ApiError(400, `Unsupported fileType for ${folder}`);
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new ApiError(400, 'fileSize must be greater than 0');
  }

  if (fileSize > rule.maxSize) {
    throw new ApiError(413, `File size exceeds limit for ${folder}`);
  }
}

function normalizeUploadRequest(input = {}) {
  const fileName = sanitizeFileName(input.fileName);
  const fileType = String(input.fileType || '').trim().toLowerCase();
  const fileSize = Number(input.fileSize);
  const folder = normalizeFolder(input.folder);
  const courseId = String(input.courseId || '').trim();
  const moduleId = input.moduleId ? String(input.moduleId).trim() : null;

  // If it's a course specific folder, require courseId
  const courseSpecificFolders = ['videos', 'pdfs', 'certificates'];
  if (courseSpecificFolders.includes(folder) && !courseId) {
    throw new ApiError(400, 'courseId is required for this folder type');
  }

  if (!fileType) {
    throw new ApiError(400, 'fileType is required');
  }

  if (!fileSize) {
    throw new ApiError(400, 'fileSize is required');
  }

  validateFileAgainstFolder(folder, fileType, fileSize);

  return {
    fileName,
    fileType,
    fileSize,
    folder,
    courseId,
    moduleId,
  };
}

async function assertCourseContext(courseId, moduleId) {
  if (!courseId) return; // Allow generic uploads
  
  if (!mongoose.isValidObjectId(courseId)) {
    throw new ApiError(400, 'Invalid courseId');
  }

  const course = await Course.findById(courseId).select('_id').lean();
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (!moduleId) {
    return;
  }

  if (!mongoose.isValidObjectId(moduleId)) {
    throw new ApiError(400, 'Invalid moduleId');
  }

  const moduleDoc = await Module.findById(moduleId).select('_id courseId').lean();
  if (!moduleDoc) {
    throw new ApiError(404, 'Module not found');
  }

  if (String(moduleDoc.courseId) !== String(courseId)) {
    throw new ApiError(400, 'moduleId does not belong to the supplied courseId');
  }
}

function buildCourseObjectKey({ courseId, folder, moduleId, fileName }) {
  const safeName = sanitizeFileName(fileName);
  const objectId = crypto.randomUUID();
  const moduleSegment = moduleId ? `/${moduleId}` : '';

  if (courseId) {
    return `courses/${courseId}/${folder}${moduleSegment}/${objectId}-${safeName}`;
  } else {
    return `${folder}/${objectId}-${safeName}`;
  }
}

function normalizeMediaDocument(media) {
  if (!media) return null;

  const resolvedKey = media.key || media.fileKey || null;
  const resolvedFileUrl = media.fileUrl || (resolvedKey ? buildS3FileUrl(resolvedKey) : null);

  return {
    _id: media._id,
    courseId: media.courseId,
    moduleId: media.moduleId || null,
    fileUrl: resolvedFileUrl,
    key: resolvedKey,
    fileType: media.fileType || media.contentType,
    size: media.size || 0,
    uploadedBy: media.uploadedBy || media.createdBy,
    createdAt: media.createdAt,
  };
}

async function requestUploadUrl(userId, input) {
  const normalized = normalizeUploadRequest(input);
  await assertCourseContext(normalized.courseId, normalized.moduleId);

  const key = buildCourseObjectKey(normalized);
  const signedUpload = await generateUploadUrl({
    key,
    contentType: normalized.fileType,
    expiresIn: UPLOAD_URL_EXPIRY_SECONDS,
  });

  logger.info('Generated S3 upload URL', {
    userId,
    courseId: normalized.courseId,
    moduleId: normalized.moduleId,
    folder: normalized.folder,
    key,
    fileType: normalized.fileType,
    fileSize: normalized.fileSize,
  });

  return {
    uploadUrl: signedUpload.uploadUrl,
    fileUrl: signedUpload.fileUrl,
    key: signedUpload.key,
    expiresIn: signedUpload.expiresIn,
  };
}

async function completeUpload(userId, input) {
  const normalized = normalizeUploadRequest(input);
  await assertCourseContext(normalized.courseId, normalized.moduleId);

  const key = extractS3Key(input.key);
  if (!key) {
    throw new ApiError(400, 'key is required');
  }

  const expectedPrefix = normalized.courseId 
    ? `courses/${normalized.courseId}/${normalized.folder}/`
    : `${normalized.folder}/`;

  if (!key.startsWith(expectedPrefix)) {
    throw new ApiError(400, 'key does not belong to the supplied folder/course');
  }

  const expectedFileUrl = buildS3FileUrl(key);
  if (input.fileUrl && input.fileUrl !== expectedFileUrl) {
    throw new ApiError(400, 'fileUrl does not match the generated object key');
  }

  logger.info('Verifying uploaded S3 object', {
    userId,
    courseId: normalized.courseId,
    moduleId: normalized.moduleId,
    key,
  });

  let objectMetadata;
  try {
    objectMetadata = await headObject(key);
  } catch (error) {
    logger.error('Uploaded file not visible in S3 after PUT', error, {
      userId,
      courseId: normalized.courseId,
      moduleId: normalized.moduleId,
      key,
    });
    throw new ApiError(502, 'Upload verification failed. File not visible in S3.');
  }

  const actualContentType = String(objectMetadata.ContentType || '').toLowerCase();
  const actualSize = Number(objectMetadata.ContentLength || 0);

  if (actualContentType !== normalized.fileType) {
    logger.warn('Rejected upload due to content-type mismatch', {
      userId,
      key,
      expected: normalized.fileType,
      actual: actualContentType,
    });
    throw new ApiError(400, 'Uploaded Content-Type does not match the requested fileType');
  }

  if (actualSize !== normalized.fileSize) {
    logger.warn('Rejected upload due to size mismatch', {
      userId,
      key,
      expected: normalized.fileSize,
      actual: actualSize,
    });
    throw new ApiError(400, 'Uploaded file size does not match the requested fileSize');
  }

  const record = await Media.findOneAndUpdate(
    { key },
    {
      $set: {
        courseId: normalized.courseId,
        moduleId: normalized.moduleId,
        fileUrl: expectedFileUrl,
        key,
        fileType: normalized.fileType,
        size: normalized.fileSize,
        uploadedBy: userId,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await cacheDel(`media:signed:${record._id}`).catch(() => {});
  await logActivity(userId, 'media.upload.completed', 'Verified media upload in S3', {
    mediaId: record._id,
    key,
    courseId: normalized.courseId,
    moduleId: normalized.moduleId,
  });

  logger.info('Completed verified S3 upload', {
    userId,
    mediaId: String(record._id),
    courseId: normalized.courseId,
    moduleId: normalized.moduleId,
    key,
    size: normalized.fileSize,
  });

  return {
    mediaId: record._id,
    courseId: record.courseId,
    moduleId: record.moduleId,
    fileUrl: record.fileUrl,
    key: record.key,
    fileType: record.fileType,
    size: record.size,
    createdAt: record.createdAt,
  };
}

async function getMediaSignedUrl(userId, mediaId) {
  const rawMedia = await Media.findById(mediaId).lean();
  const media = normalizeMediaDocument(rawMedia);

  if (!media) {
    throw new ApiError(404, 'Media not found');
  }

  const isOwner = String(media.uploadedBy || '') === String(userId);
  if (!isOwner) {
    const enrollments = await listEnrollments(userId, media.courseId);
    if (!enrollments || enrollments.length === 0) {
      throw new ApiError(403, 'Access denied');
    }
  }

  const cacheKey = `media:signed:${mediaId}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return { url: cached, expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS, cached: true };
  }

  const signedUrl = await generateDownloadUrl(media.key, DOWNLOAD_URL_EXPIRY_SECONDS);
  if (!signedUrl) {
    throw new ApiError(500, 'Could not generate signed URL');
  }

  await cacheSet(cacheKey, signedUrl, DOWNLOAD_URL_EXPIRY_SECONDS - 60);
  await logActivity(userId, 'media.signed-url', 'Generated signed media URL', { mediaId });

  logger.info('Generated signed media access URL', {
    userId,
    mediaId: String(mediaId),
    key: media.key,
  });

  return { url: signedUrl, expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS, cached: false };
}

async function deleteMediaByKey(actorUserId, key, context = {}) {
  const normalizedKey = extractS3Key(key);
  if (!normalizedKey) {
    return { deleted: false };
  }

  const existing = await Media.findOne({
    $or: [{ key: normalizedKey }, { fileKey: normalizedKey }],
  }).lean();

  try {
    await deleteObject(normalizedKey);
  } catch (error) {
    logger.error('Failed to delete S3 object', error, {
      actorUserId,
      key: normalizedKey,
      ...context,
    });
    throw new ApiError(502, 'Failed to delete file from S3');
  }

  if (existing?._id) {
    await Media.deleteOne({ _id: existing._id });
    await cacheDel(`media:signed:${existing._id}`).catch(() => {});
  } else {
    await Media.deleteOne({ key: normalizedKey }).catch(() => {});
  }

  if (actorUserId) {
    await logActivity(actorUserId, 'media.delete', 'Deleted media object from S3', {
      key: normalizedKey,
      ...context,
    });
  }

  logger.info('Deleted S3 media object', {
    actorUserId,
    key: normalizedKey,
    ...context,
  });

  return { deleted: true, key: normalizedKey };
}

async function deleteMediaByKeys(actorUserId, keys, context = {}) {
  const normalizedKeys = [...new Set((keys || []).map(extractS3Key).filter(Boolean))];

  for (const key of normalizedKeys) {
    await deleteMediaByKey(actorUserId, key, context);
  }

  return { deleted: normalizedKeys.length, keys: normalizedKeys };
}

module.exports = {
  completeUpload,
  deleteMediaByKey,
  deleteMediaByKeys,
  getMediaSignedUrl,
  requestUploadUrl,
};
