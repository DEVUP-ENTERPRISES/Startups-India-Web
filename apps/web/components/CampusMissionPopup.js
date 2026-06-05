'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  X, ArrowRight, Calendar, Building2, GraduationCap, Users,
  Lightbulb, TrendingUp, Landmark, Rocket, Globe, Zap,
  ChevronRight, BookOpen,
} from 'lucide-react';
import styles from './CampusMissionPopup.module.css';

// ── Ecosystem constants ────────────────────────────────────────────────
const VS   = 420;   // viewBox / wrapper size (px)
const VCX  = 210;   // center x
const VCY  = 210;   // center y
const ORB1 = 98;    // inner dashed ring radius
const ORB2 = 128;   // outer dashed ring radius (dots live here)
const NR   = 150;   // node-card centre distance from hub

const ECO = [
  { id: 'innov',    l1: 'Innovation',  l2: 'Challenges',    angle: 0,   Icon: Lightbulb    },
  { id: 'startup',  l1: 'Startup',     l2: 'Ecosystem',     angle: 62,  Icon: Rocket       },
  { id: 'funding',  l1: 'Funding',     l2: 'Opportunities', angle: 120, Icon: TrendingUp   },
  { id: 'founders', l1: 'Future',      l2: 'Founders',      angle: 178, Icon: Users        },
  { id: 'mentor',   l1: 'Mentorship',  l2: 'Network',       angle: 258, Icon: GraduationCap},
  { id: 'industry', l1: 'Industry',    l2: 'Collaboration', angle: 305, Icon: Landmark     },
];

function deg2rad(d) { return d * Math.PI / 180; }
function pt(angle, r) {
  const a = deg2rad(angle - 90);
  return { x: VCX + r * Math.cos(a), y: VCY + r * Math.sin(a) };
}

// ── Circular ecosystem diagram ─────────────────────────────────────────
function EcosystemViz() {
  const [hov, setHov] = useState(null);

  return (
    <div className={styles.vizWrap}>

      {/* SVG — rings, spokes, dots */}
      <svg
        width={VS} height={VS}
        viewBox={`0 0 ${VS} ${VS}`}
        className={styles.vizSvg}
        aria-hidden="true"
        overflow="visible"
      >
        <defs>
          <radialGradient id="popHubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FF1E1E" stopOpacity="0.25" />
            <stop offset="65%"  stopColor="#FF1E1E" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FF1E1E" stopOpacity="0"    />
          </radialGradient>
          <filter id="popGlowLine">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="popGlowDot">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <style>{`
            @keyframes popRing1 { to { stroke-dashoffset: -56; } }
            @keyframes popRing2 { to { stroke-dashoffset:  56; } }
            .pr1 { animation: popRing1 9s  linear infinite; }
            .pr2 { animation: popRing2 13s linear infinite; }
          `}</style>
        </defs>

        {/* ambient hub glow */}
        <circle cx={VCX} cy={VCY} r="84" fill="url(#popHubGlow)" />

        {/* inner ring */}
        <circle className="pr1"
          cx={VCX} cy={VCY} r={ORB1}
          fill="none"
          stroke="rgba(255,30,30,0.18)" strokeWidth="1" strokeDasharray="4 5"
        />

        {/* outer ring */}
        <circle className="pr2"
          cx={VCX} cy={VCY} r={ORB2}
          fill="none"
          stroke="rgba(255,30,30,0.3)" strokeWidth="1.2" strokeDasharray="3 4"
        />

        {/* spokes + orbit dots */}
        {ECO.map(n => {
          const dp  = pt(n.angle, ORB2);
          const isH = hov === n.id;
          return (
            <g key={n.id}>
              <line
                x1={VCX} y1={VCY} x2={dp.x} y2={dp.y}
                stroke={isH ? 'rgba(255,30,30,0.65)' : 'rgba(255,30,30,0.2)'}
                strokeWidth={isH ? 1.4 : 0.8}
                strokeDasharray="3 4"
                filter={isH ? 'url(#popGlowLine)' : undefined}
                style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
              />
              <circle
                cx={dp.x} cy={dp.y}
                r={isH ? 4.5 : 3.2}
                fill={isH ? '#FF1E1E' : 'rgba(255,30,30,0.7)'}
                filter={isH ? 'url(#popGlowDot)' : undefined}
                style={{ transition: 'r 0.2s, fill 0.2s' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Hub centre text */}
      <div className={styles.hubCenter}>
        <span>Powering</span>
        <span>India's Next</span>
        <span className={styles.hubRed}>Innovation</span>
        <span>Wave</span>
      </div>

      {/* Node cards */}
      {ECO.map(n => {
        const p   = pt(n.angle, NR);
        const isH = hov === n.id;
        const { Icon } = n;
        return (
          <div
            key={n.id}
            className={`${styles.nodeCard} ${isH ? styles.nodeCardHov : ''}`}
            style={{ left: p.x, top: p.y }}
            onMouseEnter={() => setHov(n.id)}
            onMouseLeave={() => setHov(null)}
          >
            <Icon size={14} className={styles.nodeIco} />
            <span className={styles.nodeTxt}>{n.l1}<br />{n.l2}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Popup ──────────────────────────────────────────────────────────────
const CLOSE_MS = 360;

export default function CampusMissionPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mouse,   setMouse]   = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const timerRef = useRef(null);
  const router   = useRouter();

  // Show after 1 s on every refresh
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setClosing(false); setVisible(false); }, CLOSE_MS);
  }, [closing]);

  const closeAndGo = useCallback((href) => {
    if (closing) return;
    setClosing(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setClosing(false); setVisible(false); router.push(href);
    }, CLOSE_MS);
  }, [closing, router]);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [close]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onMouseMove = useCallback(e => {
    if (!modalRef.current) return;
    const r = modalRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const onBackdrop = e => { if (e.target === e.currentTarget) close(); };

  if (!visible) return null;

  return (
    <div
      className={`${styles.backdrop} ${closing ? styles.bOut : styles.bIn}`}
      onClick={onBackdrop}
      role="dialog" aria-modal="true"
      aria-label="Campus Startup & Innovation Mission 2026"
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${closing ? styles.mOut : styles.mIn}`}
        onMouseMove={onMouseMove}
        style={{ '--mx': `${mouse.x}px`, '--my': `${mouse.y}px` }}
      >
        {/* Spotlight */}
        <div className={styles.spotlight} aria-hidden="true" />

        {/* × Close */}
        <button className={styles.closeBtn} onClick={close} aria-label="Close">
          <X size={14} />
        </button>

        {/* ───────── LEFT COLUMN ───────── */}
        <div className={styles.left}>

          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            NEW INITIATIVE 2026
          </div>

          {/* Heading — 3 lines matching the design */}
          <h2 className={styles.h2}>
            Campus Startup &amp;<br />
            Innovation<br />
            <span className={styles.red}>Mission 2026</span>
          </h2>

          {/* Short description */}
          <p className={styles.desc}>
            Join India's largest campus innovation movement connecting students,
            colleges, startups, mentors, investors and industry leaders.
          </p>

          {/* 3 Stat cards */}
          <div className={styles.stats3}>
            {[
              { Icon: Building2,   val: '100+',    lbl: 'Top Colleges\nParticipating' },
              { Icon: Users,       val: '35,000+', lbl: 'Students\nEngaged'           },
              { Icon: Zap,         val: '6,000+',  lbl: 'Hackathon\nParticipants'     },
            ].map(({ Icon, val, lbl }, i) => (
              <div key={i} className={styles.statCard}>
                <Icon size={18} className={styles.statIco} />
                <span className={styles.statVal}>{val}</span>
                <span className={styles.statLbl}>{lbl}</span>
              </div>
            ))}
          </div>

          {/* "What's inside" teaser card */}
          <div
            className={styles.insideCard}
            onClick={() => closeAndGo('/campus-startup')}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && closeAndGo('/campus-startup')}
          >
            <div className={styles.insideIconBox}>
              <BookOpen size={15} className={styles.insideIco} />
            </div>
            <div className={styles.insideMid}>
              <p className={styles.insideTitle}>What's Inside the Mission?</p>
              <p className={styles.insideDesc}>
                Hackathons, innovation challenges, mentorship, funding access,
                incubation opportunities &amp; more —&nbsp;
                <span className={styles.redItalic}>it's bigger than you think.</span>
              </p>
            </div>
            <ChevronRight size={16} className={styles.insideArrow} />
          </div>

          {/* CTA buttons */}
          <div className={styles.ctas}>
            <button
              className={styles.btnPrimary}
              onClick={() => closeAndGo('/campus-startup')}
            >
              Explore Campus Mission 2026
              <ArrowRight size={14} />
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => closeAndGo('/campus-startup')}
            >
              Learn More
            </button>
          </div>

          {/* Footer bar */}
          <div className={styles.footerBar}>
            <span className={styles.footerItem}>
              <Calendar size={11} />
              June – July 2026
            </span>
            <span className={styles.footerSep} aria-hidden="true">|</span>
            <span className={styles.footerItem}>
              <Globe size={11} />
              One Mission.&nbsp;
              <span className={styles.red}>Infinite Possibilities.</span>
            </span>
          </div>
        </div>

        {/* ───────── RIGHT COLUMN ───────── */}
        <div className={styles.right}>
          <EcosystemViz />
        </div>
      </div>
    </div>
  );
}
