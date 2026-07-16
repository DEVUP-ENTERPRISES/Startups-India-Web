'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CreditCard, CheckCircle2, AlertCircle, CalendarClock, Video, MapPin, Receipt,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/grants';

const card = {
  padding: '24px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '20px',
  marginBottom: '16px',
};

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.getElementById('razorpay-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Could not load the payment gateway.')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment gateway.'));
    document.body.appendChild(script);
  });
}

export default function IdeaEvaluationPage() {
  const { id } = useParams();

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [justPaid, setJustPaid] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await apiFetch(`/api/v1/grants/applications/${id}/evaluation`);
    if (err) {
      setError(err.message || 'Could not load the evaluation details.');
      return;
    }
    setSummary(data);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const pay = async () => {
    setBusy(true);
    setError('');

    try {
      await loadRazorpay();

      // The order is created server-side. Notice we send NO amount — the price is
      // computed from admin settings, so it cannot be tampered with from here.
      const { data: order, error: orderErr } = await apiFetch(
        `/api/v1/grants/applications/${id}/evaluation/order`,
        { method: 'POST' }
      );
      if (orderErr) throw new Error(orderErr.message);

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.totalAmount,
        currency: order.currency,
        name: 'Startups India',
        description: `Idea Evaluation — ${order.applicationRef}`,
        order_id: order.orderId,
        handler: async response => {
          // The signature is verified server-side. A forged handler payload
          // cannot mark the application paid.
          const { error: verifyErr } = await apiFetch(
            `/api/v1/grants/applications/${id}/evaluation/verify`,
            {
              method: 'POST',
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            }
          );

          if (verifyErr) {
            setError(
              'Your payment went through but we could not verify it. Please contact support with your payment ID — do not pay again.'
            );
            return;
          }
          setJustPaid(true);
          await load();
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
        theme: { color: '#e63946' },
      });

      rzp.on('payment.failed', res => {
        setError(res?.error?.description || 'The payment failed. You have not been charged.');
        setBusy(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || 'Could not start the payment.');
      setBusy(false);
    }
  };

  if (error && !summary) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <AlertCircle size={38} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <p style={{ color: '#6b7280' }}>{error}</p>
      </div>
    );
  }

  if (!summary) {
    return <div style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>Loading…</div>;
  }

  const { fee } = summary;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <Link
        href={`/dashboard/grants/applications/${id}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '20px' }}
      >
        <ArrowLeft size={15} /> Back to application
      </Link>

      <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
        Idea Evaluation
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: '14.5px', color: '#6b7280', lineHeight: 1.7 }}>
        {summary.applicationRef}
      </p>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {(summary.paid || justPaid) && (
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
          <CheckCircle2 size={26} color="#10b981" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#065f46' }}>
              Payment received
            </p>
            <p style={{ margin: '3px 0 0', fontSize: '13.5px', color: '#047857', lineHeight: 1.6 }}>
              {summary.invoiceNumber
                ? <>Invoice <strong>{summary.invoiceNumber}</strong>. We&apos;ll schedule your evaluation shortly.</>
                : 'We’ll schedule your evaluation shortly.'}
            </p>
          </div>
          <Receipt size={20} color="#10b981" style={{ flexShrink: 0 }} />
        </div>
      )}

      {/* Scheduled meeting */}
      {summary.meeting && (
        <div style={card}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>
            <CalendarClock size={17} color="#ef4444" /> Your evaluation is scheduled
          </h2>
          <p style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: '#111827' }}>
            {new Date(summary.meeting.scheduledAt).toLocaleString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'long',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>

          {summary.meeting.mode === 'physical' ? (
            <p style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: 0, fontSize: '13.5px', color: '#6b7280' }}>
              <MapPin size={15} /> {summary.meeting.location}
            </p>
          ) : (
            <a
              href={summary.meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 20px', borderRadius: '11px', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none' }}
            >
              <Video size={15} /> Join the meeting
            </a>
          )}
        </div>
      )}

      {/* Payment */}
      {!summary.paid && summary.payable && (
        <div style={card}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
            <CreditCard size={17} color="#ef4444" /> Evaluation Fee
          </h2>
          <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#6b7280', lineHeight: 1.7 }}>
            Complete the payment to book your Idea Evaluation with our review panel.
          </p>

          {/* Every line comes from the server. Nothing is computed in the browser. */}
          <div style={{ padding: '18px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '14px', marginBottom: '20px' }}>
            <Row label="Evaluation Fee" value={formatMoney(fee.baseAmount, fee.currency)} />
            <Row label={`GST (${fee.gstPercent}%)`} value={formatMoney(fee.gstAmount, fee.currency)} />
            <div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />
            <Row label="Total" value={formatMoney(fee.totalAmount, fee.currency)} strong />
          </div>

          <button
            type="button"
            onClick={pay}
            disabled={busy}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '12px', border: 'none',
              background: busy ? '#f3f4f6' : 'linear-gradient(135deg,#e63946,#ff6b6b)',
              color: busy ? '#9ca3af' : '#fff',
              fontWeight: 700, fontSize: '14.5px',
              cursor: busy ? 'default' : 'pointer',
              boxShadow: busy ? 'none' : '0 8px 24px rgba(230,57,70,0.3)',
            }}
          >
            <CreditCard size={17} />
            {busy ? 'Opening payment…' : `Pay ${formatMoney(fee.totalAmount, fee.currency)}`}
          </button>

          <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#9ca3af', lineHeight: 1.6 }}>
            Payments are processed securely by Razorpay. You&apos;ll receive an invoice once the
            payment succeeds.
          </p>
        </div>
      )}

      {!summary.paid && !summary.payable && (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={36} color="#d1d5db" style={{ margin: '0 auto 14px' }} />
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#374151' }}>
            Not at the evaluation stage yet
          </p>
          <p style={{ margin: '5px 0 0', fontSize: '13.5px', color: '#9ca3af', lineHeight: 1.6 }}>
            You&apos;ll be able to book your Idea Evaluation once your application is selected.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: strong ? 0 : '9px' }}>
      <span style={{ fontSize: strong ? '14.5px' : '13.5px', fontWeight: strong ? 800 : 500, color: strong ? '#111827' : '#6b7280' }}>
        {label}
      </span>
      <span style={{ fontSize: strong ? '18px' : '13.5px', fontWeight: strong ? 900 : 600, color: '#111827' }}>
        {value}
      </span>
    </div>
  );
}
