'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';

export default function ContactPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setStatus('');
    const res = await apiPost('/api/v1/support', { subject, message });
    if (res.error) {
      setStatus('Unable to send message right now. Please email us directly.');
    } else {
      setStatus('Message sent! We will get back to you soon.');
      setSubject('');
      setMessage('');
    }
    setSending(false);
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Contact Support
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Have a question or need help? Send us a message or email{' '}
        <a href="mailto:info@startupsindia.in" style={{ color: '#3b82f6' }}>
          info@startupsindia.in
        </a>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4 }}
          >
            Subject
          </label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="What do you need help with?"
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 8,
              border: '1px solid #d1d5db',
            }}
          />
        </div>
        <div>
          <label
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4 }}
          >
            Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            placeholder="Describe your issue or question..."
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              resize: 'vertical',
            }}
          />
        </div>

        {status && (
          <p
            style={{ fontSize: '0.85rem', color: status.includes('sent') ? '#10b981' : '#ef4444' }}
          >
            {status}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          style={{
            padding: '0.7rem 1.5rem',
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: sending ? 'not-allowed' : 'pointer',
            opacity: sending ? 0.6 : 1,
            alignSelf: 'flex-start',
          }}
        >
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div
        style={{
          marginTop: '2rem',
          padding: '1.25rem',
          background: '#f9fafb',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
        }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>
          Other ways to reach us
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          ?? Email:{' '}
          <a href="mailto:info@startupsindia.in" style={{ color: '#3b82f6' }}>
            info@startupsindia.in
          </a>
        </p>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          ?? Phone: Available during business hours (Mon-Fri, 10 AM - 6 PM IST)
        </p>
      </div>
    </div>
  );
}

