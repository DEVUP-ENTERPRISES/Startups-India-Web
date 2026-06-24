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
  const idRef = useRef(0);

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

  if (!toasts.length) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
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
