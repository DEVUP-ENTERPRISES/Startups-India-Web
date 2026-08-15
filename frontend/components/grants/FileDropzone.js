'use client';

import { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Check, AlertCircle } from 'lucide-react';
import { uploadDocument, deleteDocument } from '@/lib/grants';

/**
 * Drag-and-drop uploader for one document kind.
 *
 * Two modes:
 *  - Static:  pass `applicationId` directly (already-known draft/app id).
 *  - Lazy:    pass `onBeforeUpload` - an async fn that creates the draft on
 *             demand and returns the application id (or null on failure). The
 *             draft is only created the first time the user actually picks a
 *             file, so nothing is sent to the backend on page load.
 *
 * `accept` and `maxSizeMb` come from the admin's grant settings. The client-side
 * checks here are pure UX (fail fast, no wasted round-trip); the server
 * re-validates type, size and ownership, so nothing here is security-critical.
 */
export default function FileDropzone({
  applicationId,
  onBeforeUpload,       // async () => string | null  - lazy draft creation
  kind,
  label,
  hint,
  accept = [],
  maxSizeMb = 10,
  maxFiles = 1,
  existing = [],
  onChange,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const atCapacity = existing.length >= maxFiles;
  const locked = disabled || atCapacity || busy;

  const prettyTypes = accept
    .map(t =>
      t.split('/').pop()
       .replace('vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx')
       .replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx')
       .replace('vnd.ms-powerpoint', 'ppt')
       .replace('msword', 'doc')
    )
    .join(', ');

  const handleFiles = async fileList => {
    setError('');
    const file = fileList?.[0];
    if (!file) return;

    // Client-side type + size checks - fail fast before touching the network.
    if (accept.length && !accept.includes(file.type)) {
      setError(`That file type isn't accepted here. Allowed: ${prettyTypes}.`);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File is too large. The maximum is ${maxSizeMb} MB.`);
      return;
    }

    setBusy(true);
    setProgress(0);

    // Resolve the application id. If the page passed a static id use it; if it
    // passed a lazy creator, call it now (creates draft on first upload only).
    let appId = applicationId;
    if (!appId && typeof onBeforeUpload === 'function') {
      appId = await onBeforeUpload();
    }

    if (!appId) {
      setBusy(false);
      setProgress(null);
      setError('Could not prepare your application. Please try again.');
      return;
    }

    const { data, error: err } = await uploadDocument({
      applicationId: appId,
      kind,
      file,
      onProgress: setProgress,
    });

    setBusy(false);
    setProgress(null);

    if (err) {
      setError(err.message || 'Upload failed. Please try again.');
      return;
    }
    onChange?.([...existing, data]);
  };

  const handleRemove = async doc => {
    setBusy(true);
    const { error: err } = await deleteDocument(doc._id);
    setBusy(false);
    if (err) {
      setError(err.message || 'Could not remove the file.');
      return;
    }
    onChange?.(existing.filter(d => d._id !== doc._id));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '6px',
        }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ margin: '0 0 10px', fontSize: '12.5px', color: '#9ca3af' }}>{hint}</p>
      )}

      {/* Already-uploaded files */}
      {existing.map(doc => (
        <div
          key={doc._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            marginBottom: '8px',
            background: '#f0fdf4',
            border: '1px solid #dcfce7',
            borderRadius: '12px',
          }}
        >
          <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
          <FileText size={16} color="#6b7280" style={{ flexShrink: 0 }} />
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#111827',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {doc.fileName}
          </span>
          <span style={{ fontSize: '12px', color: '#9ca3af', flexShrink: 0 }}>
            {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
          </span>
          {!disabled && (
            <button
              type="button"
              onClick={() => handleRemove(doc)}
              disabled={busy}
              aria-label={`Remove ${doc.fileName}`}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: busy ? 'default' : 'pointer',
                padding: '2px',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}

      {/* Dropzone */}
      {!atCapacity && !disabled && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            if (!locked) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => !locked && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ' ') && !locked) inputRef.current?.click();
          }}
          style={{
            padding: '24px',
            border: `2px dashed ${dragging ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '14px',
            background: dragging ? '#fff5f5' : '#fafafa',
            textAlign: 'center',
            cursor: locked ? 'default' : 'pointer',
            transition: 'border-color .15s, background .15s',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept.join(',')}
            hidden
            onChange={e => handleFiles(e.target.files)}
          />

          {busy ? (
            <div>
              <p style={{ margin: '0 0 10px', fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>
                {progress === 0 ? 'Preparing…' : `Uploading… ${progress ?? 0}%`}
              </p>
              <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '100px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progress ?? 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #e63946, #ff6b6b)',
                    transition: 'width .2s',
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <UploadCloud size={26} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>
                Drag a file here, or <span style={{ color: '#ef4444' }}>browse</span>
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                {prettyTypes} · up to {maxSizeMb} MB
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '8px 0 0',
            fontSize: '12.5px',
            color: '#ef4444',
            fontWeight: 500,
          }}
        >
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
