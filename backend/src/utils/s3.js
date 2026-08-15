const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const env = require('../config/env');

let s3Client = null;

function getS3Client() {
  if (s3Client) return s3Client;

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET) {
    return null;
  }

  s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    // Prevent SDK from adding CRC32 checksum to presigned PUT URLs.
    // Browsers cannot compute checksums, causing S3 to reject the request
    // before sending CORS headers (appearing as a CORS error).
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  return s3Client;
}

function ensureS3Client() {
  const client = getS3Client();

  if (!client) {
    throw new Error(
      'AWS S3 is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET in .env'
    );
  }

  return client;
}

function buildS3FileUrl(key) {
  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

async function generateUploadUrl({ key, contentType, contentLength, expiresIn = 300 }) {
  if (!key) {
    throw new Error('key is required for upload URL generation');
  }

  const client = ensureS3Client();

  const putParams = {
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType || 'application/octet-stream',
  };

  // Including ContentLength in the signed command locks the presigned URL to the
  // exact file size. S3 will reject any PUT whose body length differs, which
  // prevents a client from uploading a larger file after the size check passes.
  if (Number.isFinite(contentLength) && contentLength > 0) {
    putParams.ContentLength = contentLength;
  }

  const command = new PutObjectCommand(putParams);

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });

  return {
    uploadUrl,
    fileUrl: buildS3FileUrl(key),
    key,
    expiresIn,
  };
}

async function generateDownloadUrl(key, expiresIn = 3600) {
  if (!key) return null;

  const client = getS3Client();
  if (!client) return null;

  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

async function headObject(key) {
  if (!key) {
    throw new Error('key is required for headObject');
  }

  const client = ensureS3Client();

  return client.send(
    new HeadObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    })
  );
}

async function deleteObject(key) {
  if (!key) {
    throw new Error('key is required for deleteObject');
  }

  const client = ensureS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    })
  );
}

function extractS3Key(urlOrKey) {
  if (!urlOrKey || typeof urlOrKey !== 'string') return null;

  if (!urlOrKey.startsWith('http://') && !urlOrKey.startsWith('https://')) {
    return urlOrKey;
  }

  try {
    const parsed = new URL(urlOrKey);
    const host = parsed.hostname.toLowerCase();
    const isAmazonAwsHost = host.includes('amazonaws.com');
    if (!isAmazonAwsHost) {
      return null;
    }
    return parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
  } catch {
    return null;
  }
}

module.exports = {
  buildS3FileUrl,
  deleteObject,
  extractS3Key,
  generateDownloadUrl,
  generateUploadUrl,
  getS3Client,
  headObject,
};
