'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePushNotification } from '@/hooks/usePushNotification';
import styles from './PushToast.module.css';

// ── Premium notification sound using Web Audio API ──────────────────────────
function playPremiumSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.7, ctx.currentTime);
    master.connect(ctx.destination);

    // Reverb convolver for depth
    const convolver = ctx.createConvolver();
    const revLen = ctx.sampleRate * 1.5;
    const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = revBuf.getChannelData(ch);
      for (let i = 0; i < revLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 2);
    }
    convolver.buffer = revBuf;
    convolver.connect(master);

    function tone(freq, start, dur, type = 'sine', gainPeak = 0.5) {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(g);
      g.connect(convolver);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    }

    // Zepto-style ascending chime sequence
    tone(523, 0.00, 0.25, 'sine',     0.4);  // C5
    tone(659, 0.12, 0.25, 'sine',     0.4);  // E5
    tone(784, 0.24, 0.30, 'sine',     0.5);  // G5
    tone(1047,0.36, 0.45, 'triangle', 0.5);  // C6
    tone(1319,0.42, 0.60, 'sine',     0.45); // E6 — bright tail

    // Subtle harmonic undertone
    tone(262, 0.00, 0.55, 'triangle', 0.15); // C4

    setTimeout(() => ctx.close(), 2500);
  } catch (_) {}
}

// ─────────────────────────────────────────────────────────────────────────────

export default function PushToast() {
  const [toasts, setToasts] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const idRef = useRef(0);

  // Listen for the blocked event dispatched by the hook
  useEffect(() => {
    const handler = () => setBlocked(true);
    window.addEventListener('fcm:blocked', handler);
    return () => window.removeEventListener('fcm:blocked', handler);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 420);
  }, []);

  const addToast = useCallback((payload) => {
    const { title, body, image } = payload.notification || {};
    const data = payload.data || {};
    const id = ++idRef.current;

    playPremiumSound();
    setToasts(prev => [...prev.slice(-4), { id, title, body, image, data, leaving: false }]);

    // Auto-dismiss after 7s
    setTimeout(() => dismiss(id), 7000);
  }, [dismiss]);

  usePushNotification({ onMessage: addToast });

  return (
    <>
      {/* Re-enable banner for users who blocked notifications */}
      {blocked && <BlockedBanner onDismiss={() => setBlocked(false)} />}

      <div className={styles.container} aria-live="polite">
        {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
    </>
  );
}

function BlockedBanner({ onDismiss }) {
  // Detect browser for specific instructions
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isChrome  = /Chrome/.test(ua) && !/Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isSafari  = /Safari/.test(ua) && !/Chrome/.test(ua);

  let instructions = 'Go to browser Settings → Site Settings → Notifications → find this site → Allow.';
  if (isChrome)  instructions = 'Click the 🔒 lock icon in the address bar → Notifications → Allow → reload.';
  if (isFirefox) instructions = 'Click the 🔒 lock icon → Connection secure → More info → Permissions → Allow Notifications.';
  if (isSafari)  instructions = 'Safari → Settings → Websites → Notifications → find this site → Allow.';

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99998,
      background: 'rgba(10,10,14,0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(245,158,11,0.35)',
      borderLeft: '3px solid #f59e0b',
      borderRadius: 14,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      maxWidth: 420,
      width: 'calc(100vw - 48px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'slideInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <style>{`@keyframes slideInUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>

      <div style={{ fontSize: 22, lineHeight: 1 }}>🔔</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#fef3c7' }}>
          Notifications are blocked
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
          {instructions}
        </p>
      </div>

      <button
        onClick={onDismiss}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          padding: 2,
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

function ToastCard({ toast, onDismiss }) {
  const progressRef = useRef(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.width = '100%';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'width 7s linear';
      el.style.width = '0%';
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const url = toast.data?.clickUrl || '/';

  function handleClick() {
    onDismiss(toast.id);
    if (url && url !== '/') window.open(url, '_blank', 'noopener');
  }

  return (
    <div
      className={`${styles.toast} ${toast.leaving ? styles.leaving : styles.entering}`}
      role="alert"
    >
      <div className={styles.glow} />

      <div className={styles.inner} onClick={handleClick}>
        <div className={styles.iconWrap}>
          <img
            src="/assets/images/logos/Startupsina-logo-wight.png"
            alt="Startup India"
            className={styles.icon}
          />
          <span className={styles.pulse} />
        </div>

        <div className={styles.content}>
          <p className={styles.title}>{toast.title || 'Startup India'}</p>
          {toast.body && <p className={styles.body}>{toast.body}</p>}
        </div>

        <button
          className={styles.close}
          onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
          aria-label="Dismiss"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.progressTrack}>
        <div ref={progressRef} className={styles.progressBar} />
      </div>
    </div>
  );
}
