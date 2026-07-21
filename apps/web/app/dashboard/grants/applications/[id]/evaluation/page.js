'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CreditCard, CheckCircle2, AlertCircle, CalendarClock, Video, MapPin, Receipt,
  Shield, Upload, Sparkles, Star, Users, Award, Zap, Send
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatMoney, getGrantConfig, getApplication } from '@/lib/grants';
import FileDropzone from '@/components/grants/FileDropzone';

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
  const [uploadCfg, setUploadCfg] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [justPaid, setJustPaid] = useState(false);

  const load = useCallback(async () => {
    const [{ data, error: err }, { data: app }, { data: cfg }] = await Promise.all([
      apiFetch(`/api/v1/grants/applications/${id}/evaluation`),
      getApplication(id),
      getGrantConfig(),
    ]);
    if (err) {
      setError(err.message || 'Could not load the evaluation details.');
      return;
    }
    setSummary(data);
    if (app?.documents) setDocuments(app.documents);
    if (cfg?.upload) setUploadCfg(cfg.upload);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const docsOf = kind => documents.filter(d => d.kind === kind);
  const hasKeyDoc = docsOf('business_plan').length > 0 || docsOf('pitch_deck').length > 0;

  const pay = async () => {
    setBusy(true);
    setError('');

    try {
      await loadRazorpay();

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
        theme: { color: '#f97316' }, 
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
        <style>{evalAnimations}</style>
        <AlertCircle size={38} color="#ef4444" style={{ margin: '0 auto 14px' }} />
        <p style={{ color: '#64748b' }}>{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <style>{evalAnimations}</style>
        {[180, 300, 240].map((h, i) => (
          <div key={i} style={{
            height: h, marginBottom: 16, borderRadius: 16,
            background: 'linear-gradient(90deg,#f8fafc 25%,#f1f5f9 50%,#f8fafc 75%)',
            backgroundSize: '200% 100%', animation: 'evalShimmer 1.4s infinite',
          }} />
        ))}
      </div>
    );
  }

  const { fee } = summary;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' }}>
      <style>{evalAnimations}</style>

      <Link
        href={`/dashboard/grants/applications/${id}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          color: '#1e3a8a', fontSize: '14px', fontWeight: 700,
          textDecoration: 'none', marginBottom: '24px',
          padding: '8px 16px', borderRadius: 10,
          background: '#ffffff', border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.08)',
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowLeft size={16} /> Back to application
      </Link>

      {/* Result (moved up for prominence if cleared) */}
      {summary.result && (
        <div style={{
          borderRadius: '32px', overflow: 'hidden',
          marginBottom: '32px',
          animation: 'evalCrazyPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>
          {summary.result.passed ? (
            <div style={{
              background: 'linear-gradient(135deg, #022c22, #064e3b)',
              border: '2px solid #10b981',
              padding: '60px 40px', textAlign: 'center',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(6, 78, 59, 0.3), inset 0 2px 10px rgba(255,255,255,0.1)'
            }}>
              {/* Crazy animations inside success block */}
              <div style={{ position: 'absolute', top: '15%', left: '15%', animation: 'evalCrazyFloat 4s infinite alternate ease-in-out' }}>
                <Send size={32} color="#f87171" fill="#f87171" style={{ transform: 'rotate(-45deg)' }} />
              </div>
              <div style={{ position: 'absolute', top: '20%', right: '20%', animation: 'evalCrazyFloat 5s infinite alternate-reverse ease-in-out' }}>
                <Star size={24} color="#facc15" fill="#facc15" />
              </div>
              
              <div style={{ fontSize: 64, marginBottom: 20, animation: 'evalCrazySpin 4s infinite linear', display: 'inline-block' }}>🎉</div>
              <h2 style={{ margin: '0 0 16px', fontSize: 36, fontWeight: 900, color: '#ffffff', letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                You cleared the Idea Evaluation!
              </h2>
              <p style={{ margin: '0 auto', fontSize: 18, color: '#a7f3d0', lineHeight: 1.6, maxWidth: 600, fontWeight: 500 }}>
                Congratulations — your idea passed our panel's review. You're now eligible for
                the next phases: Pre-Incubation, Incubation, and Funding by top VCs and
                angel investors. We'll be in touch with the next steps.
              </p>
              
              {summary.result.feedback && (
                <div style={{ marginTop: 32, padding: '24px', background: 'rgba(255,255,255,0.08)', borderRadius: 24, border: '1px solid rgba(16,185,129,0.5)', textAlign: 'left', backdropFilter: 'blur(10px)' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={16} /> Panel Feedback</p>
                  <p style={{ margin: 0, fontSize: 16, color: '#f8fafc', lineHeight: 1.7, fontStyle: 'italic' }}>"{summary.result.feedback}"</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fff)', border: '2px solid #fde68a', borderRadius: 24, padding: '40px', boxShadow: '0 10px 30px rgba(146, 64, 14, 0.1)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💪</div>
              <h2 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 900, color: '#92400e', letterSpacing: '-0.5px' }}>
                Keep Going!
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 16, color: '#78350f', lineHeight: 1.6, fontWeight: 500 }}>
                Your idea didn't clear the evaluation on this occasion, but every "no" brings you closer to a "yes". Here's the panel's feedback to help you level up:
              </p>
              {summary.result.feedback && (
                <div style={{ padding: '20px 24px', background: '#fffbeb', borderRadius: 16, borderLeft: '6px solid #f59e0b', fontSize: 16, color: '#92400e', lineHeight: 1.6, fontWeight: 600 }}>
                  "{summary.result.feedback}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Premium Navy Header with Saffron accent */}
      <div style={{
        background: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)',
        borderRadius: 24, padding: '36px 32px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 30px -8px rgba(30, 58, 138, 0.4)',
      }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)', pointerEvents: 'none', animation: 'evalCrazyFloat 6s infinite alternate' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'evalCrazyFloat 4s infinite alternate-reverse' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)', marginBottom: 20 }}>
            <Sparkles size={14} color="#f97316" />
            <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: '#fed7aa' }}>Phase 2</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', margin: '0 0 8px', letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Idea Evaluation
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: '#93c5fd', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
            {summary.applicationRef}
          </p>
        </div>
      </div>

      {/* Payment received — success state */}
      {(summary.paid || justPaid) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          padding: '28px 32px', marginBottom: '24px',
          background: 'linear-gradient(135deg, #022c22, #064e3b)',
          borderRadius: '24px', border: '1px solid #10b981',
          animation: 'evalCrazyPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 10px 30px rgba(6,78,59,0.2)'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #10b981, #059669)', border: '1px solid #34d399',
            flexShrink: 0,
            boxShadow: '0 4px 15px rgba(16,185,129,0.4)'
          }}>
            <CheckCircle2 size={28} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>
              Payment Secured! 🚀
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '15px', color: '#a7f3d0', lineHeight: 1.6, fontWeight: 500 }}>
              {summary.invoiceNumber
                ? <>Invoice <strong style={{ color: '#fff' }}>{summary.invoiceNumber}</strong>. We'll schedule your evaluation shortly.</>
                : 'We\'ll schedule your evaluation shortly.'}
            </p>
          </div>
          <Receipt size={32} color="rgba(16,185,129,0.3)" style={{ flexShrink: 0 }} />
        </div>
      )}

      {/* Scheduled meeting */}
      {summary.meeting && (
        <div style={{
          padding: '32px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)', border: '1px solid #e2e8f0',
          borderRadius: '24px', marginBottom: '24px',
          boxShadow: '0 10px 40px rgba(30,58,138,0.06)',
          animation: 'evalSlideIn 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #1e3a8a, #172554)',
              boxShadow: '0 4px 15px rgba(30,58,138,0.3)'
            }}>
              <CalendarClock size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a8a', margin: 0, letterSpacing: '-0.5px' }}>
              It's Showtime! ⏰
            </h2>
          </div>
          <div style={{
            padding: '24px', background: '#f8fafc', borderRadius: '16px',
            border: '2px solid #e2e8f0', marginBottom: 20,
          }}>
            <p style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
              {new Date(summary.meeting.scheduledAt).toLocaleString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>

          {summary.meeting.mode === 'physical' ? (
            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '16px', color: '#1e3a8a', fontWeight: 800 }}>
              <MapPin size={20} color="#f97316" /> {summary.meeting.location}
            </p>
          ) : (
            <a
              href={summary.meeting.link}
              target="_blank"
              rel="noopener noreferrer"
              className="eval-pay-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontWeight: 900, fontSize: '16px', textDecoration: 'none', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(249,115,22,0.4)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            >
              <Video size={20} /> Join the Meeting
            </a>
          )}
        </div>
      )}

      {/* Step 1 — Upload documents */}
      {!summary.paid && summary.payable && uploadCfg && (
        <div style={{
          padding: '32px', background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: '24px', marginBottom: '24px',
          boxShadow: '0 10px 40px rgba(30,58,138,0.06)',
          animation: 'evalSlideIn 0.4s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff',
              fontSize: 18, fontWeight: 900,
              boxShadow: '0 4px 15px rgba(249,115,22,0.3)'
            }}>1</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a8a', margin: 0, letterSpacing: '-0.5px' }}>
              Upload your documents
            </h2>
          </div>
          <p style={{ margin: '0 0 28px 54px', fontSize: '15px', color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
            Share your business plan and supporting material for the panel to review. A business plan
            or pitch deck is required before you can reserve your evaluation.
          </p>
          <div style={{ paddingLeft: 0 }}>
            <FileDropzone applicationId={id} kind="business_plan" label="Business Plan"
              hint="Your detailed business plan / model." accept={uploadCfg.documentTypes} maxSizeMb={uploadCfg.maxSizeMb} maxFiles={1}
              existing={docsOf('business_plan')} onChange={next => setDocuments([...documents.filter(d => d.kind !== 'business_plan'), ...next.filter(d => d.kind === 'business_plan')])} />
            <FileDropzone applicationId={id} kind="pitch_deck" label="Pitch Deck"
              accept={uploadCfg.pitchDeckTypes} maxSizeMb={uploadCfg.maxSizeMb} maxFiles={1}
              existing={docsOf('pitch_deck')} onChange={next => setDocuments([...documents.filter(d => d.kind !== 'pitch_deck'), ...next.filter(d => d.kind === 'pitch_deck')])} />
            <FileDropzone applicationId={id} kind="product_image" label="Product Images (optional)"
              hint="Up to 8 images." accept={uploadCfg.imageTypes} maxSizeMb={uploadCfg.maxSizeMb} maxFiles={8}
              existing={docsOf('product_image')} onChange={next => setDocuments([...documents.filter(d => d.kind !== 'product_image'), ...next.filter(d => d.kind === 'product_image')])} />
            <FileDropzone applicationId={id} kind="demo_video" label="Demo Video (optional)"
              accept={uploadCfg.videoTypes} maxSizeMb={uploadCfg.maxSizeMb} maxFiles={1}
              existing={docsOf('demo_video')} onChange={next => setDocuments([...documents.filter(d => d.kind !== 'demo_video'), ...next.filter(d => d.kind === 'demo_video')])} />
          </div>
        </div>
      )}

      {/* Step 2 — Payment */}
      {!summary.paid && summary.payable && (
        <div style={{
          opacity: hasKeyDoc ? 1 : 0.65,
          transform: hasKeyDoc ? 'scale(1)' : 'scale(0.98)',
          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: '24px', marginBottom: '24px',
          boxShadow: hasKeyDoc ? '0 15px 50px rgba(30,58,138,0.1)' : '0 4px 16px rgba(30,58,138,0.04)',
          overflow: 'hidden',
          animation: 'evalSlideIn 0.5s ease-out',
        }}>
          <div style={{ padding: '32px 32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: hasKeyDoc ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#f1f5f9',
                border: `1px solid ${hasKeyDoc ? '#ea580c' : '#e2e8f0'}`,
                color: hasKeyDoc ? '#fff' : '#94a3b8', 
                fontSize: 18, fontWeight: 900,
                transition: 'all 0.4s ease',
                boxShadow: hasKeyDoc ? '0 4px 15px rgba(249,115,22,0.3)' : 'none'
              }}>2</div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1e3a8a', margin: 0, letterSpacing: '-0.5px' }}>
                Reserve your Spot 🔥
              </h2>
            </div>
            <p style={{ margin: '0 0 28px 54px', fontSize: '15px', color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              Pay the evaluation fee to lock in your in-person evaluation with our panel of VCs and mentors.
            </p>
          </div>

          {/* Fee breakdown - premium styled */}
          <div style={{ margin: '0 32px 28px', padding: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '24px', background: '#f8fafc' }}>
              <Row label="Evaluation Fee" value={formatMoney(fee.baseAmount, fee.currency)} />
              <Row label={`GST (${fee.gstPercent}%)`} value={formatMoney(fee.gstAmount, fee.currency)} />
            </div>
            <div style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #1e3a8a, #172554)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#bfdbfe' }}>
                Total Payable
              </span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                {formatMoney(fee.totalAmount, fee.currency)}
              </span>
            </div>
          </div>

          {/* What you get */}
          <div style={{ margin: '0 32px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <FeaturePill icon={<Users size={18} color="#f97316" />} text="VC Panel Review" />
            <FeaturePill icon={<Star size={18} color="#f97316" />} text="Expert Scoring" />
            <FeaturePill icon={<Award size={18} color="#f97316" />} text="Funding Access" />
          </div>

          <div style={{ padding: '0 32px 32px' }}>
            <button
              type="button"
              onClick={pay}
              disabled={busy || !hasKeyDoc}
              className="eval-pay-btn"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                width: '100%', padding: '20px', borderRadius: '16px', border: 'none',
                background: (busy || !hasKeyDoc) ? '#f1f5f9' : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: (busy || !hasKeyDoc) ? '#94a3b8' : '#fff',
                fontWeight: 900, fontSize: '18px', letterSpacing: 0.5,
                cursor: (busy || !hasKeyDoc) ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: (busy || !hasKeyDoc) ? 'none' : '0 10px 30px rgba(249,115,22,0.4)',
              }}
            >
              <CreditCard size={22} />
              {busy ? 'Opening payment…' : `Pay ${formatMoney(fee.totalAmount, fee.currency)} & Reserve`}
            </button>

            {!hasKeyDoc && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                margin: '16px 0 0', padding: '16px',
                background: '#fff7ed', border: '2px dashed #fed7aa',
                borderRadius: '12px', fontSize: '14px', color: '#c2410c', fontWeight: 800,
                animation: 'evalCrazyPulse 2s infinite'
              }}>
                <Upload size={18} style={{ flexShrink: 0 }} />
                Upload your business plan or pitch deck above to unlock payment.
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              margin: '24px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 700,
            }}>
              <Shield size={16} color="#10b981" />
              Secured by Razorpay · Invoice generated on payment
            </div>
          </div>
        </div>
      )}

      {!summary.paid && !summary.payable && !summary.result && (
        <div style={{
          textAlign: 'center', padding: '80px 32px',
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '24px', boxShadow: '0 10px 40px rgba(30,58,138,0.04)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc', border: '1px solid #e2e8f0',
            animation: 'evalCrazyFloat 4s infinite alternate'
          }}>
            <AlertCircle size={32} color="#94a3b8" />
          </div>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '-0.5px' }}>
            Not at the evaluation stage yet ⏳
          </p>
          <p style={{ margin: '12px 0 0', fontSize: '16px', color: '#64748b', lineHeight: 1.6, fontWeight: 500 }}>
            You'll be able to book your Idea Evaluation once your application is selected by the review panel. Hang tight!
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <span style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>
        {label}
      </span>
      <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
        {value}
      </span>
    </div>
  );
}

function FeaturePill({ icon, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: '16px 12px', borderRadius: 12,
      background: '#ffffff', border: '2px solid #e2e8f0',
      fontSize: 14, fontWeight: 800, color: '#1e3a8a',
      boxShadow: '0 4px 10px rgba(30,58,138,0.03)',
      transition: 'all 0.2s',
    }} className="feature-pill">
      {icon} {text}
      <style>{`.feature-pill:hover { transform: translateY(-3px); border-color: #cbd5e1; box-shadow: 0 8px 20px rgba(30,58,138,0.08); }`}</style>
    </div>
  );
}

const evalAnimations = `
  @keyframes evalShimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
  @keyframes evalSlideIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: none; } }
  @keyframes evalCrazyPop { 0% { transform: scale(0.9) translateY(20px); opacity: 0; } 60% { transform: scale(1.02) translateY(-10px); opacity: 1; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
  @keyframes evalCrazyFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-10px) rotate(-3deg); } 75% { transform: translateY(-5px) rotate(3deg); } }
  @keyframes evalCrazySpin { 0% { transform: rotate(-10deg) scale(1); } 50% { transform: rotate(10deg) scale(1.2); } 100% { transform: rotate(-10deg) scale(1); } }
  @keyframes evalCrazyPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); } }
  .eval-pay-btn:hover:not(:disabled) { transform: translateY(-4px) scale(1.02); box-shadow: 0 15px 40px rgba(249,115,22,0.5) !important; }
  .eval-pay-btn:active:not(:disabled) { transform: translateY(0) scale(0.98); }
`;
