'use client';

function formatBytes(bytes) {
  if (!bytes) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function UploadProgressPanel({ uploadState, onRetry, onDismiss }) {
  if (!uploadState || uploadState.status === 'idle') {
    return null;
  }

  const isError = uploadState.status === 'error';
  const isSuccess = uploadState.status === 'success';
  const progressWidth = uploadState.isProgressIndeterminate
    ? '45%'
    : `${Math.max(4, uploadState.progress || 0)}%`;

  return (
    <div
      style={{
        marginBottom: 16,
        padding: 14,
        borderRadius: 12,
        border: `1px solid ${isError ? '#fecaca' : isSuccess ? '#bbf7d0' : '#dbeafe'}`,
        background: isError ? '#fff7f7' : isSuccess ? '#f0fdf4' : '#f8fbff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          alignItems: 'flex-start',
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
            {uploadState.label || uploadState.fileName || 'Upload'}
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{uploadState.message}</div>
          {uploadState.error ? (
            <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 4 }}>{uploadState.error}</div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {isError && typeof onRetry === 'function' ? (
            <button className="btn btn-primary btn-sm" onClick={onRetry}>
              Resume Upload
            </button>
          ) : null}
          {(isError || isSuccess) && typeof onDismiss === 'function' ? (
            <button className="btn btn-secondary btn-sm" onClick={onDismiss}>
              Dismiss
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: '#e2e8f0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: progressWidth,
            height: '100%',
            background: isError ? '#ef4444' : isSuccess ? '#22c55e' : '#2563eb',
            borderRadius: 999,
            transition: uploadState.isProgressIndeterminate ? 'none' : 'width 0.2s ease',
            animation: uploadState.isProgressIndeterminate ? 'uploadPulse 1.2s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 8,
          fontSize: 11,
          color: '#64748b',
          flexWrap: 'wrap',
        }}
      >
        <span>
          Attempt {Math.max(uploadState.attempt || 1, 1)} / {uploadState.maxAttempts || 3}
        </span>
        <span>
          {uploadState.uploadedBytes || uploadState.totalBytes
            ? `${formatBytes(uploadState.uploadedBytes)} / ${formatBytes(uploadState.totalBytes)}`
            : null}
        </span>
      </div>

      <style jsx>{`
        @keyframes uploadPulse {
          0% {
            transform: translateX(-10%);
          }
          50% {
            transform: translateX(80%);
          }
          100% {
            transform: translateX(-10%);
          }
        }
      `}</style>
    </div>
  );
}
