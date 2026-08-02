'use client';

import { useCallback, useRef, useState } from 'react';
import { apiPost } from '@/lib/api';

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

function createInitialState() {
  return {
    status: 'idle',
    fileName: '',
    label: '',
    message: '',
    error: '',
    progress: 0,
    uploadedBytes: 0,
    totalBytes: 0,
    attempt: 0,
    maxAttempts: MAX_RETRIES,
    isProgressIndeterminate: false,
  };
}

function wait(ms) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

function createApiError(error, fallbackMessage) {
  const message = error?.message || fallbackMessage;
  const wrapped = new Error(message);
  wrapped.status = error?.status || 0;
  wrapped.retryable = ![400, 401, 403, 404, 413, 422].includes(Number(error?.status || 0));
  return wrapped;
}

function buildUploadRequest({ file, folder, courseId, moduleId }) {
  return {
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    fileSize: file.size,
    folder,
    courseId,
    ...(moduleId ? { moduleId } : {}),
  };
}

async function requestUploadUrl(payload) {
  const { data, error } = await apiPost('/api/v1/upload-url', payload);
  if (error) throw createApiError(error, 'Could not get a secure upload URL');
  return data;
}

async function confirmUpload(payload) {
  const { data, error } = await apiPost('/api/v1/media/complete', payload);
  if (error) throw createApiError(error, 'Upload verification failed');
  return data;
}

export async function deleteUploadedFile({ key, courseId, moduleId }) {
  if (!key) return null;

  const { data, error } = await apiPost('/api/v1/media/delete', {
    key,
    ...(courseId ? { courseId } : {}),
    ...(moduleId ? { moduleId } : {}),
  });

  if (error) throw createApiError(error, 'Failed to clean up uploaded file');
  return data;
}

function supportsRequestStreams() {
  if (typeof window === 'undefined' || typeof ReadableStream === 'undefined') {
    return false;
  }

  try {
    const stream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    // Browser support for upload progress with fetch depends on request streams + duplex.
    // This throws on browsers that do not support streamed request bodies.
    new Request('https://example.com', {
      method: 'POST',
      body: stream,
      duplex: 'half',
    });

    return true;
  } catch {
    return false;
  }
}

function createUploadBody(file, onProgress) {
  if (!supportsRequestStreams() || typeof file?.stream !== 'function') {
    return {
      body: file,
      requestOptions: {},
      isProgressIndeterminate: true,
    };
  }

  const totalBytes = file.size || 0;
  let uploadedBytes = 0;
  const reader = file.stream().getReader();

  const body = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();

      if (done) {
        controller.close();
        return;
      }

      uploadedBytes += value.byteLength;
      if (totalBytes > 0) {
        const progress = Math.min(100, Math.round((uploadedBytes / totalBytes) * 100));
        onProgress(progress, uploadedBytes, totalBytes);
      }

      controller.enqueue(value);
    },
    cancel(reason) {
      reader.cancel(reason);
    },
  });

  return {
    body,
    requestOptions: { duplex: 'half' },
    isProgressIndeterminate: false,
  };
}

async function uploadWithFetch(uploadUrl, file, onProgress, onModeDetected) {
  const { body, requestOptions, isProgressIndeterminate } = createUploadBody(file, onProgress);
  if (typeof onModeDetected === 'function') {
    onModeDetected(isProgressIndeterminate);
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
    body,
    ...requestOptions,
  });

  if (!response.ok) {
    const error = new Error(`Upload failed with status ${response.status}`);
    error.status = response.status;
    error.retryable = ![400, 401, 404, 413, 422].includes(response.status);
    throw error;
  }

  onProgress(100, file.size || 0, file.size || 0);
  return { status: response.status, isProgressIndeterminate };
}

function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

export function resolveUploadFolder(file) {
  if (!file) return 'videos';

  if (file.type === 'application/pdf') {
    return 'pdfs';
  }

  if (file.type.startsWith('image/')) {
    return 'images';
  }

  if (file.type.startsWith('video/')) {
    return 'videos';
  }

  return 'certificates';
}

export function useS3DirectUpload() {
  const [state, setState] = useState(createInitialState());
  const lastUploadRef = useRef(null);

  const resetUploadState = useCallback(() => {
    lastUploadRef.current = null;
    setState(createInitialState());
  }, []);

  const startUpload = useCallback(async input => {
    if (!input?.file) {
      throw new Error('No file selected');
    }

    lastUploadRef.current = input;

    const uploadRequest = buildUploadRequest(input);
    const label = input.label || input.file.name || 'file';

    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        if (isOffline()) {
          const offlineError = new Error(
            'You are offline. Reconnect to the internet and use Resume Upload.'
          );
          offlineError.retryable = true;
          throw offlineError;
        }

        setState({
          status: 'preparing',
          fileName: input.file.name,
          label,
          message: 'Requesting a secure upload URL...',
          error: '',
          progress: 0,
          uploadedBytes: 0,
          totalBytes: input.file.size || 0,
          attempt,
          maxAttempts: MAX_RETRIES,
          isProgressIndeterminate: false,
        });

        console.info('[s3-upload] requesting upload URL', {
          fileName: input.file.name,
          folder: input.folder,
          courseId: input.courseId,
          moduleId: input.moduleId || null,
          attempt,
        });

        const signedUpload = await requestUploadUrl(uploadRequest);

        setState(previous => ({
          ...previous,
          status: 'uploading',
          message: 'Uploading directly to S3...',
        }));

        console.info('[s3-upload] upload started', {
          fileName: input.file.name,
          key: signedUpload.key,
          attempt,
        });

        const putResult = await uploadWithFetch(
          signedUpload.uploadUrl,
          input.file,
          (progress, uploadedBytes, totalBytes) => {
            setState(previous => ({
              ...previous,
              status: 'uploading',
              progress,
              uploadedBytes,
              totalBytes,
              message:
                progress >= 100
                  ? 'Upload finished. Verifying in S3...'
                  : 'Uploading directly to S3...',
            }));
          },
          isProgressIndeterminate => {
            setState(previous => ({
              ...previous,
              isProgressIndeterminate,
            }));
          }
        );

        setState(previous => ({
          ...previous,
          status: 'verifying',
          progress: 100,
          uploadedBytes: input.file.size || previous.uploadedBytes,
          totalBytes: input.file.size || previous.totalBytes,
          isProgressIndeterminate: putResult.isProgressIndeterminate,
          message: 'Verifying the file exists in S3...',
        }));

        console.info('[s3-upload] upload finished, verifying', {
          fileName: input.file.name,
          key: signedUpload.key,
          attempt,
        });

        const confirmedUpload = await confirmUpload({
          ...uploadRequest,
          key: signedUpload.key,
          fileUrl: signedUpload.fileUrl,
        });

        if (typeof input.onUploaded === 'function') {
          try {
            await input.onUploaded(confirmedUpload);
          } catch (error) {
            console.error('[s3-upload] post-upload persistence failed', error);
            try {
              await deleteUploadedFile({
                key: confirmedUpload.key,
                courseId: input.courseId,
                moduleId: input.moduleId,
              });
            } catch (cleanupError) {
              console.error('[s3-upload] cleanup failed after persistence error', cleanupError);
            }
            throw error;
          }
        }

        setState({
          status: 'success',
          fileName: input.file.name,
          label,
          message: 'Upload completed and verified in S3.',
          error: '',
          progress: 100,
          uploadedBytes: input.file.size || 0,
          totalBytes: input.file.size || 0,
          attempt,
          maxAttempts: MAX_RETRIES,
          isProgressIndeterminate: false,
        });

        console.info('[s3-upload] upload completed', {
          fileName: input.file.name,
          key: confirmedUpload.key,
          attempt,
        });

        return confirmedUpload;
      } catch (error) {
        lastError = error;
        const retryable = error?.retryable !== false;
        const isFinalAttempt = attempt >= MAX_RETRIES || !retryable;

        console.warn('[s3-upload] upload attempt failed', {
          fileName: input.file.name,
          attempt,
          retryable,
          error: error?.message,
        });

        if (isFinalAttempt) {
          setState(previous => ({
            ...previous,
            status: 'error',
            message: retryable
              ? 'Upload failed after multiple attempts. Resume Upload to try again.'
              : error?.message || 'Upload failed.',
            error: error?.message || 'Upload failed.',
            attempt,
          }));
          throw error;
        }

        const delayMs = RETRY_DELAYS_MS[attempt - 1] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
        setState(previous => ({
          ...previous,
          status: 'retrying',
          message: `Upload failed. Retrying in ${delayMs / 1000}s...`,
          error: error?.message || 'Upload failed.',
          attempt,
        }));

        console.info('[s3-upload] retry scheduled', {
          fileName: input.file.name,
          attempt,
          retryInMs: delayMs,
        });

        await wait(delayMs);
      }
    }

    throw lastError || new Error('Upload failed');
  }, []);

  const retryUpload = useCallback(async () => {
    if (!lastUploadRef.current) {
      throw new Error('No upload is available to resume');
    }

    return startUpload(lastUploadRef.current);
  }, [startUpload]);

  return {
    resetUploadState,
    retryUpload,
    startUpload,
    uploadState: state,
  };
}
