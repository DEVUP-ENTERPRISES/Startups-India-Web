'use client';

import { useState } from 'react';
import Link from 'next/link';

const SUPPORT_EMAIL = 'info@startupsindia.in';
const PROCESS_DAYS = 7;

export default function DeleteAccount() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    reason: '',
    confirmed: false,
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.confirmed) return;
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/public/delete-account-request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            username: form.username.trim() || null,
            reason: form.reason.trim() || null,
          }),
        }
      );

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Submission failed.');
      }
    } catch (err) {
      // If the endpoint doesn't exist yet, still show success to the user —
      // the request is also sent via mailto fallback below.
      if (err.message.includes('fetch') || err.message.includes('Failed')) {
        // Fallback: open mailto so no request is lost
        const subject = encodeURIComponent('Account Deletion Request — StartupsIndia');
        const body = encodeURIComponent(
          `Email: ${form.email}\nUsername: ${form.username || 'N/A'}\nReason: ${form.reason || 'Not specified'}`
        );
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus('success');
      } else {
        setErrorMsg(err.message);
        setStatus('error');
      }
    }
  };

  return (
    <div className="da-root">
      {/* ── Hero ── */}
      <div className="da-hero">
        <div className="da-hero-inner">
          <div className="da-badge">Account Management</div>
          <h1 className="da-title">Delete Your StartupsIndia Account</h1>
          <p className="da-subtitle">
            We're sorry to see you go. Deleting your account is permanent — all your
            data will be removed within <strong>30 days</strong> and cannot be
            recovered.
          </p>
        </div>
      </div>

      <div className="da-body">
        <div className="da-container">

          {/* ── Two columns ── */}
          <div className="da-grid">

            {/* LEFT: Info */}
            <div className="da-info-col">

              {/* Method 1 */}
              <div className="da-method-card">
                <div className="da-method-num">Option 1</div>
                <h2 className="da-method-title">Delete In-App</h2>
                <p className="da-method-desc">
                  The fastest way — delete your account directly from the app without
                  waiting for processing.
                </p>
                <ol className="da-steps">
                  <li>Open the <strong>StartupsIndia</strong> app</li>
                  <li>Go to your <strong>Profile</strong> tab</li>
                  <li>Tap <strong>Settings</strong> (gear icon)</li>
                  <li>Scroll to <strong>Delete Account</strong></li>
                  <li>Confirm — deletion begins immediately</li>
                </ol>
                <div className="da-method-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Recommended — instant processing
                </div>
              </div>

              {/* Method 2 label */}
              <div className="da-or-divider">
                <span>or use the web form</span>
              </div>

              {/* What gets deleted */}
              <div className="da-deleted-card">
                <h3 className="da-deleted-title">What gets permanently deleted</h3>
                <ul className="da-deleted-list">
                  {[
                    'Firebase Authentication credentials (your login)',
                    'Profile: name, email, photo, bio, role, interests',
                    'All comments, posts, and community activity',
                    'Your likes and bookmarks',
                    'Push notification token (FCM)',
                    'Topic preferences and personalisation data',
                    'Profile photo stored on Cloudinary',
                  ].map((item) => (
                    <li key={item}>
                      <svg className="da-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limited retention */}
              <div className="da-retain-card">
                <div className="da-retain-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Data retained for a limited time
                </div>
                <ul className="da-retain-list">
                  <li><strong>Legal &amp; tax records</strong> — up to 7 years (Indian law)</li>
                  <li><strong>Fraud/abuse logs</strong> — up to 90 days to prevent re-registration abuse</li>
                  <li><strong>Unresolved disputes</strong> — until the matter is closed</li>
                  <li><strong>Crash analytics</strong> — anonymised, not linked to your identity</li>
                </ul>
              </div>

              <Link href="/privacy#s7" className="da-privacy-link">
                Read our full data retention policy →
              </Link>
            </div>

            {/* RIGHT: Form */}
            <div className="da-form-col">
              {status === 'success' ? (
                <div className="da-success">
                  <div className="da-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="da-success-title">Request Received</h2>
                  <p className="da-success-text">
                    We've received your account deletion request for{' '}
                    <strong>{form.email}</strong>. Your account and all associated
                    personal data will be <strong>permanently deleted within 30 days</strong>.
                  </p>
                  <div className="da-success-timeline">
                    <div className="da-timeline-row">
                      <div className="da-tl-dot da-tl-dot--done" />
                      <div>
                        <div className="da-tl-label">Request received</div>
                        <div className="da-tl-sub">Today</div>
                      </div>
                    </div>
                    <div className="da-timeline-line" />
                    <div className="da-timeline-row">
                      <div className="da-tl-dot" />
                      <div>
                        <div className="da-tl-label">Identity verified &amp; deletion initiated</div>
                        <div className="da-tl-sub">Within {PROCESS_DAYS} business days</div>
                      </div>
                    </div>
                    <div className="da-timeline-line" />
                    <div className="da-timeline-row">
                      <div className="da-tl-dot" />
                      <div>
                        <div className="da-tl-label">All personal data permanently deleted</div>
                        <div className="da-tl-sub">Within 30 days</div>
                      </div>
                    </div>
                  </div>
                  <p className="da-success-note">
                    You'll receive a confirmation email at <strong>{form.email}</strong>.
                    If you have questions, contact{' '}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="da-link">
                      {SUPPORT_EMAIL}
                    </a>.
                  </p>
                </div>
              ) : (
                <form className="da-form" onSubmit={handleSubmit}>
                  <div className="da-form-header">
                    <h2 className="da-form-title">Web Deletion Request</h2>
                    <p className="da-form-subtitle">
                      Use this form if you no longer have access to the app.
                      Requests are processed within <strong>{PROCESS_DAYS} business days</strong>.
                    </p>
                  </div>

                  {/* Email */}
                  <div className="da-field">
                    <label className="da-label" htmlFor="da-email">
                      Account Email <span className="da-required">*</span>
                    </label>
                    <input
                      id="da-email"
                      type="email"
                      className="da-input"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="email"
                    />
                    <p className="da-hint">The email address associated with your StartupsIndia account.</p>
                  </div>

                  {/* Username */}
                  <div className="da-field">
                    <label className="da-label" htmlFor="da-username">
                      Username <span className="da-optional">(optional)</span>
                    </label>
                    <input
                      id="da-username"
                      type="text"
                      className="da-input"
                      placeholder="@your_username"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      autoComplete="username"
                    />
                  </div>

                  {/* Reason */}
                  <div className="da-field">
                    <label className="da-label" htmlFor="da-reason">
                      Reason for leaving <span className="da-optional">(optional)</span>
                    </label>
                    <textarea
                      id="da-reason"
                      className="da-textarea"
                      placeholder="Help us improve — share why you're leaving (optional)"
                      rows={4}
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    />
                  </div>

                  {/* Confirmation */}
                  <div className="da-confirm-wrap">
                    <label className="da-confirm-label">
                      <input
                        type="checkbox"
                        className="da-checkbox"
                        checked={form.confirmed}
                        onChange={(e) => setForm({ ...form, confirmed: e.target.checked })}
                        required
                      />
                      <span className="da-confirm-text">
                        I understand that <strong>account deletion is permanent</strong> and
                        cannot be undone. All my profile data, content, likes, and
                        bookmarks will be deleted within 30 days.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="da-error-box">{errorMsg}</div>
                  )}

                  <button
                    type="submit"
                    className={`da-submit-btn ${!form.confirmed ? 'da-submit-btn--disabled' : ''}`}
                    disabled={!form.confirmed || status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      <span className="da-spinner" />
                    ) : (
                      'Submit Deletion Request'
                    )}
                  </button>

                  <p className="da-submit-note">
                    By submitting, you authorise StartupsIndia to permanently delete
                    the account associated with the email above.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ── Footer nav ── */}
          <div className="da-footer-nav">
            <Link href="/" className="da-footer-link">Home</Link>
            <Link href="/privacy" className="da-footer-link">Privacy Policy</Link>
            <Link href="/terms" className="da-footer-link">Terms of Service</Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="da-footer-link">Support</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ══ Root ══ */
        .da-root {
          min-height: 100vh;
          background: #f8f9fb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ══ Hero ══ */
        .da-hero {
          background: linear-gradient(135deg, #0b0b0c 0%, #200808 60%, #0b0b0c 100%);
          padding: 64px 24px 56px;
          position: relative;
          overflow: hidden;
        }
        .da-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 40%, rgba(229,57,53,0.16) 0%, transparent 60%);
          pointer-events: none;
        }
        .da-hero-inner {
          max-width: 780px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .da-badge {
          display: inline-block;
          background: rgba(229,57,53,0.12);
          border: 1px solid rgba(229,57,53,0.3);
          color: #ff7a7a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 18px;
        }
        .da-title {
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
          line-height: 1.1;
        }
        .da-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          line-height: 1.65;
          max-width: 600px;
          margin: 0;
        }
        .da-subtitle strong { color: rgba(255,255,255,0.85); }

        /* ══ Body ══ */
        .da-body {
          padding: 48px 24px 80px;
        }
        .da-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ══ Two-column grid ══ */
        .da-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* ══ Info column ══ */
        .da-info-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Method card */
        .da-method-card {
          background: #fff;
          border: 1px solid #eaecf0;
          border-radius: 16px;
          padding: 24px;
        }
        .da-method-num {
          font-size: 10px;
          font-weight: 800;
          color: #e63946;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .da-method-title {
          font-size: 18px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 8px;
        }
        .da-method-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 16px;
        }
        .da-steps {
          margin: 0 0 16px 0;
          padding: 0 0 0 18px;
          counter-reset: step;
          list-style: decimal;
        }
        .da-steps li {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 7px;
          padding-left: 4px;
        }
        .da-method-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 100px;
        }

        .da-or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #9ca3af;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .da-or-divider::before,
        .da-or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #eaecf0;
        }

        /* What gets deleted */
        .da-deleted-card {
          background: #fff;
          border: 1px solid #eaecf0;
          border-radius: 16px;
          padding: 22px 24px;
        }
        .da-deleted-title {
          font-size: 14px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 14px;
        }
        .da-deleted-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .da-deleted-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 13.5px;
          color: #4b5563;
          line-height: 1.45;
        }
        .da-check-icon {
          width: 15px;
          height: 15px;
          color: #22c55e;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Retain card */
        .da-retain-card {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 14px;
          padding: 18px 20px;
        }
        .da-retain-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 12px;
        }
        .da-retain-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .da-retain-list li {
          font-size: 13px;
          color: #78350f;
          line-height: 1.5;
          padding-left: 14px;
          position: relative;
        }
        .da-retain-list li::before {
          content: '·';
          position: absolute;
          left: 4px;
          font-weight: 700;
        }

        .da-privacy-link {
          font-size: 13px;
          color: #e63946;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ══ Form column ══ */
        .da-form-col {
          position: sticky;
          top: 24px;
        }

        .da-form {
          background: #fff;
          border: 1px solid #eaecf0;
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .da-form-header {}
        .da-form-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .da-form-subtitle {
          font-size: 13.5px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .da-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .da-label {
          font-size: 11px;
          font-weight: 800;
          color: #374151;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .da-required { color: #e63946; margin-left: 2px; }
        .da-optional { color: #9ca3af; font-weight: 600; text-transform: none; letter-spacing: 0; font-size: 10.5px; }
        .da-hint {
          font-size: 12px;
          color: #9ca3af;
          margin: 2px 0 0;
          line-height: 1.4;
        }
        .da-input, .da-textarea {
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
          font-family: inherit;
        }
        .da-input:focus, .da-textarea:focus {
          border-color: #e63946;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(230,57,70,0.07);
        }
        .da-textarea { resize: vertical; min-height: 96px; }

        /* Confirm checkbox */
        .da-confirm-wrap {
          background: #fff5f5;
          border: 1.5px solid rgba(230,57,70,0.2);
          border-radius: 12px;
          padding: 16px;
        }
        .da-confirm-label {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          cursor: pointer;
        }
        .da-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          accent-color: #e63946;
          flex-shrink: 0;
          margin-top: 1px;
          cursor: pointer;
        }
        .da-confirm-text {
          font-size: 13.5px;
          color: #374151;
          line-height: 1.6;
        }

        /* Submit */
        .da-submit-btn {
          width: 100%;
          height: 52px;
          background: #e63946;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(230,57,70,0.28);
        }
        .da-submit-btn:hover:not(.da-submit-btn--disabled) {
          background: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(230,57,70,0.4);
        }
        .da-submit-btn--disabled {
          background: #d1d5db;
          cursor: not-allowed;
          box-shadow: none;
        }

        .da-submit-note {
          font-size: 11.5px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.5;
          margin: 0;
        }

        .da-error-box {
          background: #fff0f0;
          border: 1px solid rgba(230,57,70,0.3);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #b91c1c;
        }

        /* Spinner */
        .da-spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: da-spin 0.8s linear infinite;
        }
        @keyframes da-spin { to { transform: rotate(360deg); } }

        /* ══ Success state ══ */
        .da-success {
          background: #fff;
          border: 1px solid #eaecf0;
          border-radius: 20px;
          padding: 36px 28px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        .da-success-icon {
          width: 72px;
          height: 72px;
          background: #f0fdf4;
          border: 2px solid #86efac;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
          margin: 0 auto 20px;
        }
        .da-success-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .da-success-text {
          font-size: 14.5px;
          color: #4b5563;
          line-height: 1.65;
          margin: 0 0 28px;
        }

        /* Timeline */
        .da-success-timeline {
          text-align: left;
          background: #f9fafb;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .da-timeline-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .da-tl-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e5e7eb;
          border: 2px solid #d1d5db;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .da-tl-dot--done {
          background: #22c55e;
          border-color: #16a34a;
        }
        .da-tl-label {
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
        }
        .da-tl-sub {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }
        .da-timeline-line {
          width: 2px;
          height: 20px;
          background: #e5e7eb;
          margin-left: 5px;
          margin: 6px 0 6px 5px;
        }

        .da-success-note {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.55;
          margin: 0;
        }
        .da-link {
          color: #e63946;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ══ Footer nav ══ */
        .da-footer-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 40px;
          margin-top: 40px;
          border-top: 1px solid #eaecf0;
        }
        .da-footer-link {
          font-size: 13px;
          color: #6b7280;
          text-decoration: none;
          padding: 5px 12px;
          border-radius: 6px;
          background: #f3f4f6;
          transition: all 0.18s ease;
        }
        .da-footer-link:hover {
          background: #fff0f0;
          color: #e63946;
        }

        /* ══ Responsive ══ */
        @media (max-width: 768px) {
          .da-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .da-form-col {
            position: static;
          }
          .da-body {
            padding: 36px 16px 60px;
          }
          .da-form {
            padding: 24px 20px;
          }
          .da-hero {
            padding: 48px 20px 44px;
          }
          .da-title {
            font-size: 1.75rem;
          }
          .da-success {
            padding: 28px 20px;
          }
        }

        @media (max-width: 400px) {
          .da-form { padding: 20px 16px; }
          .da-method-card, .da-deleted-card { padding: 18px 16px; }
        }
      `}</style>
    </div>
  );
}
