'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { Users, IndianRupee, Building2, Globe, Scale, Handshake } from 'lucide-react';
import '../styles/ecosystem-features.css';

const iconMap = {
  users: Users,
  rupee: IndianRupee,
  building: Building2,
  globe: Globe,
  handshake: Handshake,
  scale: Scale,
};

const getIcon = iconName => {
  const Icon = iconMap[iconName] || Users;
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

// ─── SpotlightCard ────────────────────────────────────────────────────────────
// Gradient glow applied to .ecosystem-card background via inherited CSS vars.
function SpotlightCard({ children, ...props }) {
  const wrapRef = useRef(null);
  const rafRef = useRef(null);
  const hoveredRef = useRef(false);

  const cursor = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });
  const glowA = useRef(0);
  const trailA = useRef(0);

  const TRAIL_LERP = 0.1;
  const ALPHA_IN = 0.14;
  const ALPHA_OUT = 0.07;
  const MAX_GLOW_A = 0.15;
  const MAX_TRAIL_A = 0.09;

  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  );

  const tick = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const targetA = hoveredRef.current ? 1 : 0;

    trail.current.x += (cursor.current.x - trail.current.x) * TRAIL_LERP;
    trail.current.y += (cursor.current.y - trail.current.y) * TRAIL_LERP;

    const aSpeed = hoveredRef.current ? ALPHA_IN : ALPHA_OUT;
    glowA.current += (targetA - glowA.current) * aSpeed;
    trailA.current += (targetA - trailA.current) * (ALPHA_OUT * 0.7);

    wrap.style.setProperty('--glow-x', `${cursor.current.x}px`);
    wrap.style.setProperty('--glow-y', `${cursor.current.y}px`);
    wrap.style.setProperty('--trail-x', `${trail.current.x}px`);
    wrap.style.setProperty('--trail-y', `${trail.current.y}px`);
    wrap.style.setProperty('--glow-a', (glowA.current * MAX_GLOW_A).toFixed(4));
    wrap.style.setProperty('--trail-a', (trailA.current * MAX_TRAIL_A).toFixed(4));

    const stillAnimating =
      Math.abs(glowA.current - targetA) > 0.004 || Math.abs(trailA.current - targetA) > 0.004;

    if (hoveredRef.current || stillAnimating) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    e => {
      if (isTouch.current) return;
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect = wrap.getBoundingClientRect();
      cursor.current.x = e.clientX - rect.left;
      cursor.current.y = e.clientY - rect.top;

      if (!hoveredRef.current) {
        trail.current.x = cursor.current.x;
        trail.current.y = cursor.current.y;
        hoveredRef.current = true;
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouch.current) return;
    hoveredRef.current = false;
  }, []);

  return (
    <div
      ref={wrapRef}
      className="spotlight-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── FlipCard ─────────────────────────────────────────────────────────────────
// 3D rotateY flip card with click-based interaction
function FlipCard({ feature, index }) {
  const [flipped, setFlipped] = useState(false);

  const handleToggleFlip = e => {
    e.stopPropagation();
    setFlipped(v => !v);
  };

  const handleFlipBack = e => {
    e.stopPropagation();
    setFlipped(false);
  };

  return (
    <SpotlightCard>
      <motion.div
        className="card-flip-scene"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      >
        <div className={`card-container ${flipped ? 'flipped' : ''}`}>
          <motion.div
            className="card-inner"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              mass: 1,
            }}
          >
            {/* ─ FRONT ─ */}
            <div className="card-front ecosystem-card">
              <div className="ecosystem-card-header">
                <div className="ecosystem-icon-wrapper">{feature.icon}</div>
              </div>

              <div className="ecosystem-badge-row">
                {feature.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`ecosystem-highlight-badge ${badge.active ? 'active' : ''}`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>

              <h3 className="ecosystem-card-title">{feature.title}</h3>
              <p className="ecosystem-card-desc">{feature.description}</p>

              <div className="ecosystem-card-footer">
                <button
                  className="ecosystem-learn-more-btn"
                  onClick={handleToggleFlip}
                  aria-label={`Learn more about ${feature.title}`}
                >
                  <span>Learn more</span>
                  <svg
                    className="ecosystem-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ─ BACK ─ */}
            <div className="card-back ecosystem-card">
              <button className="card-back-close" onClick={handleFlipBack} aria-label="Go back">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back</span>
              </button>

              <div className="card-back-content">
                <h3 className="card-back-title">{feature.title}</h3>
                <div className="card-back-divider" />
                <ul className="card-back-list">
                  {feature.backContent.points.map((point, i) => (
                    <li key={i} className="card-back-item">
                      <span className="card-back-dot" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>

                {feature.backContent.cta && (
                  <a
                    href={feature.backContent.ctaHref || '#'}
                    className="card-back-cta"
                    onClick={e => e.stopPropagation()}
                  >
                    {feature.backContent.cta}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SpotlightCard>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function EcosystemFeaturesSection() {
  const features = [
    {
      title: 'Mentorship & Guidance',
      description:
        'Learn directly from experienced founders, subject matter experts, and leading industry professionals.',
      badges: [
        { text: '200+ Mentors', active: true },
        { text: 'Weekly Sessions', active: false },
      ],
      backContent: {
        points: [
          'One-on-one mentorship from 200+ industry veterans & serial founders',
          'Weekly live workshops, AMA sessions, and group masterclasses',
          'Personalised startup roadmaps tailored to your stage and sector',
        ],
        cta: 'Meet our mentors',
        ctaHref: '#mentors',
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'Funding Access',
      description:
        'Direct connections to seed funds, angel networks, and VC partners for rapid scaling.',
      badges: [
        { text: '₹110Cr+ Raised', active: true },
        { text: 'Investor Network', active: false },
      ],
      backContent: {
        points: [
          'Warm introductions to 50+ seed funds, angel networks & VC partners',
          'Curated pitch sessions and demo days with active investors',
          'Grant discovery support and government scheme navigation',
        ],
        cta: 'Explore funding',
        ctaHref: '#funding',
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: 'Infrastructure & Resources',
      description:
        'Access high-end workspaces, cloud credits, API tools, and premium startup software.',
      badges: [
        { text: 'Co-working Spaces', active: true },
        { text: 'Premium Facilities', active: false },
      ],
      backContent: {
        points: [
          'Plug-and-play co-working desks and private cabins across 3 campuses',
          '$100K+ in cloud credits from AWS, GCP, and Azure partner programs',
          'Licensed access to 30+ SaaS tools — design, analytics, CRM & more',
        ],
        cta: 'View facilities',
        ctaHref: '#facilities',
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
    {
      title: 'Market Access',
      description:
        'Connect with early adopters, corporate partners, and beta testers to validate your product.',
      badges: [
        { text: 'B2B Partnerships', active: true },
        { text: 'Corporate Connect', active: false },
      ],
      backContent: {
        points: [
          'Direct introductions to 100+ corporate partners for pilot programs',
          'Access to our curated beta-tester community for rapid MVP validation',
          'B2B deal-flow support to land your first enterprise customers',
        ],
        cta: 'Find partners',
        ctaHref: '#market',
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      title: 'Legal & Compliance',
      description:
        'Get specialized support for company incorporation, intellectual property strategy, and accounting.',
      badges: [
        { text: 'IP Strategy', active: true },
        { text: 'Fast Incorporation', active: false },
      ],
      backContent: {
        points: [
          'Startup incorporation in under 7 days with expert legal support',
          'IP filing, patent strategy and trademark guidance at zero retainer',
          'DPIIT recognition, GST, and compliance advisory for Indian startups',
        ],
        cta: 'Get legal help',
        ctaHref: '#legal',
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      title: 'Community & Networking',
      description:
        'Join a structured community of ambitious founders, organized meetups, and exclusive alumni events.',
      badges: [
        { text: 'Active Alumni', active: true },
        { text: 'Global Events', active: false },
      ],
      backContent: {
        points: [
          '2,000+ alumni network spanning 15 countries and 30+ industries',
          'Monthly founder meetups, hackathons, and curated networking dinners',
          'Access to global startup conferences and IEC delegation programs',
        ],
        cta: 'Join community',
        ctaHref: '#community',
      },
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="ecosystem-section">
      <div className="iec-container">
        {/* Section Header */}
        <motion.div
          className="ecosystem-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="section-label-premium">Our Ecosystem</div>
          <h2 className="ecosystem-title">
            Everything You Need to <span className="ecosystem-highlight">Succeed</span>
          </h2>
          <p className="ecosystem-subtitle">
            A comprehensive support system providing capital, infrastructure, and expert guidance to
            help you scale faster and build a resilient business.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="ecosystem-grid">
          {features.map((feature, index) => (
            <FlipCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
